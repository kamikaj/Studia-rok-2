const selectUser = document.getElementById('forum-user-select');
const inputTytul = document.getElementById('forum-temat-tytul');
const inputTresc = document.getElementById('forum-temat-tresc');
const btnDodajWatek = document.getElementById('btn-dodaj-watek');
const kontenerWatkow = document.getElementById('forum-lista-watkow');
const podgladWatku = document.getElementById('forum-podglad-watku');
const brakWyboruWatku = document.getElementById('forum-brak-wyboru');
const podgladAutor = document.getElementById('podglad-autor');
const podgladTytul = document.getElementById('podglad-tytul');
const podgladTresc = document.getElementById('podglad-tresc');
const kontenerKomentarzy = document.getElementById('forum-lista-komentarzy');
const inputKomentarz = document.getElementById('forum-nowy-komentarz');
const btnDodajKomentarz = document.getElementById('btn-dodaj-komentarz');

let forumData = JSON.parse(localStorage.getItem('forumStudenckieData')) || [];
let aktywnyWatekId = null;

function wyswietlWatki() {
    if (!kontenerWatkow) return;
    kontenerWatkow.innerHTML = '';

    if (forumData.length === 0) {
        kontenerWatkow.innerHTML = '<div class="p-3 text-muted text-center small">Brak tematów.</div>';
        return;
    }

    forumData.forEach(watek => {
        const przycisk = document.createElement('button');
        przycisk.className = `list-group-item list-group-item-action text-start p-3 ${aktywnyWatekId === watek.id ? 'watek-aktywny' : ''}`;

        przycisk.innerHTML = `
            <div class="d-flex w-100 justify-content-between align-items-start">
                <h6 class="mb-1 text-truncate" style="max-width: 85%;">${watek.tytul}</h6>
                <button class="btn btn-sm btn-outline-danger p-0 px-2" onclick="usunWatek(event, ${watek.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
            <div class="d-flex justify-content-between align-items-center mt-1">
                <small class="${aktywnyWatekId === watek.id ? 'text-white-50' : 'text-muted'}">Autor: ${watek.autor}</small>
                <small class="${aktywnyWatekId === watek.id ? 'text-white-50' : 'text-muted'}">${watek.data.split(' ')[0]}</small>
            </div>
        `;
        przycisk.onclick = () => otworzWatek(watek.id);
        kontenerWatkow.appendChild(przycisk);
    });
}

function otworzWatek(id) {
    aktywnyWatekId = id;
    const watek = forumData.find(w => w.id === id);

    if (watek) {
        if (brakWyboruWatku) brakWyboruWatku.classList.add('d-none');
        if (podgladWatku) podgladWatku.classList.remove('d-none');

        if (podgladAutor) {
            podgladAutor.className = 'small text-muted d-block mb-1';
            podgladAutor.innerText = `Napisane przez: ${watek.autor} (${watek.data})`;
        }
        if (podgladTytul) podgladTytul.innerText = watek.tytul;
        if (podgladTresc) podgladTresc.innerText = watek.tresc;

        wyswietlKomentarze(watek.komentarze);
        wyswietlWatki();
    }
}

function wyswietlKomentarze(komentarze) {
    if (!kontenerKomentarzy) return;
    kontenerKomentarzy.innerHTML = '';

    komentarze.forEach(kom => {
        const pudelko = document.createElement('div');
        pudelko.className = 'p-2 mb-2 bg-body-tertiary rounded border shadow-sm';
        pudelko.innerHTML = `
            <div class="d-flex justify-content-between mb-1">
                <span class="fw-bold small">${kom.autor}</span>
                <small class="text-muted" style="font-size:10px;">${kom.data}</small>
            </div>
            <p class="mb-0 small">${kom.tekst}</p>
        `;
        kontenerKomentarzy.appendChild(pudelko);
    });
}

btnDodajWatek.addEventListener('click', () => {
    const teraz = new Date();
    const dataString = teraz.toLocaleDateString('pl-PL') + ' ' + teraz.toLocaleTimeString('pl-PL', {hour: '2-digit', minute:'2-digit'});

    const nowyWatek = {
        id: Date.now(),
        tytul: inputTytul.value.trim(),
        tresc: inputTresc.value.trim(),
        autor: selectUser.value,
        data: dataString,
        komentarze: []
    };

    forumData.unshift(nowyWatek);
    localStorage.setItem('forumStudenckieData', JSON.stringify(forumData));
    wyswietlWatki();
    otworzWatek(nowyWatek.id);
});

btnDodajKomentarz.addEventListener('click', () => {
    const tekst = inputKomentarz.value.trim();
    if (!tekst || aktywnyWatekId === null) return;

    const watekIndex = forumData.findIndex(w => w.id === aktywnyWatekId);
    forumData[watekIndex].komentarze.push({
        autor: selectUser.value,
        tekst: tekst,
        data: new Date().toLocaleTimeString('pl-PL', {hour: '2-digit', minute:'2-digit'})
    });

    localStorage.setItem('forumStudenckieData', JSON.stringify(forumData));
    wyswietlKomentarze(forumData[watekIndex].komentarze);
    inputKomentarz.value = '';
});

window.usunWatek = (event, id) => {
    event.stopPropagation();

    if (confirm('Czy na pewno chcesz usunąć ten wątek?')) {
        forumData = forumData.filter(w => w.id !== id);
        localStorage.setItem('forumStudenckieData', JSON.stringify(forumData));

        if (aktywnyWatekId === id) {
            aktywnyWatekId = null;
            podgladWatku.classList.add('d-none');
            brakWyboruWatku.classList.remove('d-none');
        }

        wyswietlWatki();
    }
};