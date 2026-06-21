document.addEventListener('DOMContentLoaded', () => {
    const poleTekstowe = document.getElementById('tekst-notatki');
    const wyborTrybuKodu = document.getElementById('wybor-trybu-kodu');
    const formularz = document.getElementById('formularz-notatek');
    const ukryteIdEdycji = document.getElementById('notatnik-edycja-id');
    const btnZapisz = document.getElementById('btn-zapisz-notatke');
    const btnAnuluj = document.getElementById('btn-anuluj-notatke');
    const kontenerListy = document.getElementById('lista-notatek');

    let edytorKodu = CodeMirror.fromTextArea(poleTekstowe, {
        lineNumbers: true,
        theme: "dracula",
        mode: "text",
        lineWrapping: true,
        matchBrackets: true,
        indentUnit: 4
    });

    const tabNotatnik = document.querySelector('button[data-bs-target="#notatnik"]');

    tabNotatnik.addEventListener('shown.bs.tab', function () {
        edytorKodu.refresh();
    });

    wyborTrybuKodu.addEventListener('change', function() {
        let tryb = this.value;
        if (tryb === 'text') tryb = 'plain';
        edytorKodu.setOption('mode', tryb);
    });

    let notatki = JSON.parse(localStorage.getItem('studenckieNotatki')) || [];

    function renderujNotatki() {
        kontenerListy.innerHTML = '';

        if (notatki.length === 0) {
            kontenerListy.innerHTML = `<div class="col-12 text-center opacity-50 py-3">Brak zapisanych notatek. Napisz coś powyżej!</div>`;
            return;
        }

        notatki.sort((a, b) => new Date(b.dataWpisu) - new Date(a.dataWpisu));

        notatki.forEach(notatka => {
            const kolumna = document.createElement('div');
            kolumna.className = 'col-md-6';

            const czystyTekst = notatka.tresc.length > 120 ? notatka.tresc.substring(0, 120) + '...' : notatka.tresc;

            kolumna.innerHTML = `
                <div class="card h-100 shadow-sm notatka-karta border">
                    <div class="card-body d-flex flex-column">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="badge bg-secondary opacity-75 small">
                                <i class="bi bi-clock"></i> ${notatka.dataSformatowana}
                            </span>
                            <span class="badge bg-dark text-warning border border-warning px-2 small">${notatka.jezyk.toUpperCase()}</span>
                        </div>
                        <p class="card-text flex-grow-1" style="white-space: pre-wrap; font-family: monospace; font-size: 13px;">${escapeHTML(czystyTekst)}</p>
                        
                        <div class="input-group input-group-sm mb-3 mt-2">
                            <label class="input-group-text bg-secondary text-white small" style="font-size: 11px;">Pobierz jako:</label>
                            <select id="format-${notatka.id}" class="form-select form-select-sm" style="font-size: 11px;">
                                <option value="txt">Plik tekstowy (.txt)</option>
                                <option value="md">Markdown (.md)</option>
                                <option value="html">Strona WWW (.html)</option>
                                <option value="js">Kod źródłowy (.js / .css)</option>
                                <option value="cpp">C++ (.cpp)</option>
                                <option value="py">Python (.py)</option>
                            </select>
                            <button class="btn btn-outline-success btn-sm btn-pobierz" data-id="${notatka.id}" type="button">
                                <i class="bi bi-download"></i>
                            </button>
                        </div>

                        <div class="d-flex justify-content-end gap-2 border-top pt-2">
                            <button class="btn btn-sm btn-outline-primary btn-edytuj" data-id="${notatka.id}"><i class="bi bi-pencil"></i> Edytuj</button>
                            <button class="btn btn-sm btn-outline-danger btn-usun" data-id="${notatka.id}"><i class="bi bi-trash"></i> Usuń</button>
                        </div>
                    </div>
                </div>
            `;
            kontenerListy.appendChild(kolumna);
        });

        podepnijZdarzeniaDoKart();
    }

    formularz.addEventListener('submit', function(e) {
        e.preventDefault();
        const trescNotatki = edytorKodu.getValue().trim();
        const wybranyJezyk = wyborTrybuKodu.value;
        const edytowaneId = ukryteIdEdycji.value;

        if (trescNotatki === "") {
            alert("Notatka nie może być pusta!");
            return;
        }

        const teraz = new Date();
        const dataSformatowana = teraz.toLocaleString('pl-PL', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });

        if (edytowaneId !== "") {
            const index = notatki.findIndex(n => n.id == edytowaneId);
            if (index !== -1) {
                notatki[index].tresc = trescNotatki;
                notatki[index].jezyk = wybranyJezyk;
                notatki[index].dataSformatowana = dataSformatowana + " (edytowano)";
                notatki[index].dataWpisu = teraz.toISOString();
            }
            ukryteIdEdycji.value = "";
            btnZapisz.innerText = "Zapisz notatkę";
            btnAnuluj.classList.add('d-none');
        } else {
            const nowaNotatka = {
                id: Date.now(),
                tresc: trescNotatki,
                jezyk: wybranyJezyk,
                dataSformatowana: dataSformatowana,
                dataWpisu: teraz.toISOString()
            };
            notatki.push(nowaNotatka);
        }

        localStorage.setItem('studenckieNotatki', JSON.stringify(notatki));
        edytorKodu.setValue("");
        renderujNotatki();
    });

    function podepnijZdarzeniaDoKart() {
        document.querySelectorAll('.btn-edytuj').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const n = notatki.find(item => item.id == id);
                if (n) {
                    ukryteIdEdycji.value = n.id;
                    edytorKodu.setValue(n.tresc);
                    wyborTrybuKodu.value = n.jezyk;
                    edytorKodu.setOption('mode', n.jezyk === 'text' ? 'plain' : n.jezyk);

                    btnZapisz.innerText = "Zaktualizuj wpis";
                    btnAnuluj.classList.remove('d-none');
                    document.getElementById('formularz-notatek').scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        document.querySelectorAll('.btn-usun').forEach(button => {
            button.addEventListener('click', function() {
                if (confirm('Czy na pewno chcesz bezpowrotnie usunąć tę notatkę?')) {
                    const id = this.getAttribute('data-id');
                    notatki = notatki.filter(item => item.id != id);
                    localStorage.setItem('studenckieNotatki', JSON.stringify(notatki));
                    renderujNotatki();
                }
            });
        });

        document.querySelectorAll('.btn-pobierz').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const n = notatki.find(item => item.id == id);
                const format = document.getElementById(`format-${id}`).value;

                if (n) {
                    pobierzPlik(n.tresc, format, n.jezyk);
                }
            });
        });
    }

    btnAnuluj.addEventListener('click', () => {
        ukryteIdEdycji.value = "";
        edytorKodu.setValue("");
        btnZapisz.innerText = "Zapisz notatkę";
        btnAnuluj.classList.add('d-none');
    });

    function pobierzPlik(tresc, format, oryginalnyJezyk) {
        let rozszerzenie = 'txt';
        let typMime = 'text/plain';
        let finalnaTresc = tresc;

        if (format === 'md') {
            rozszerzenie = 'md';
            finalnaTresc = `# Notatka Studencka\n_Wygenerowano automatycznie_\n\n${tresc}`;
        } else if (format === 'html') {
            rozszerzenie = 'html';
            typMime = 'text/html';
            finalnaTresc = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Eksport Notatki</title><style>body{font-family:sans-serif;padding:30px;background:#f4f4f4;}pre{background:#222;color:#fff;padding:15px;border-radius:5px;}</style></head><body><h1>Wyeksportowana Notatka</h1><pre>${escapeHTML(tresc)}</pre></body></html>`;
        } else if (format === 'js') {
            rozszerzenie = oryginalnyJezyk === 'text' ? 'js' : oryginalnyJezyk;
            typMime = 'application/javascript';
        }

        const blob = new Blob([finalnaTresc], { type: typMime + ';charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.setAttribute("href", url);
        link.setAttribute("download", `notatka_${Date.now()}.${rozszerzenie}`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g,
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }

    renderujNotatki();
});