document.addEventListener('DOMContentLoaded', () => {
    const formularz = document.getElementById('formularz-linkow');
    const kontener = document.getElementById('kontener-linkow');
    const nazwaInput = document.getElementById('nazwa-linku');
    const urlInput = document.getElementById('url-linku');

    let linki = JSON.parse(localStorage.getItem('mojeSzybkieLinki')) || [];

    function renderujLinki() {
        kontener.innerHTML = '';
        linki.forEach((link, index) => {
            const kolumna = document.createElement('div');
            kolumna.className = 'col-6 col-md-3';
            kolumna.innerHTML = `
                <div class="card p-2 shadow-sm d-flex flex-row align-items-center justify-content-between">
                    <a href="${link.url}" target="_blank" class="text-decoration-none text-truncate fw-bold small" title="${link.nazwa}">
                        ${link.nazwa}
                    </a>
                    <button class="btn btn-sm btn-outline-danger p-0 px-1 border-0" onclick="usunLink(${index})">
                        <i class="bi bi-x-lg"></i>
                    </button>
                </div>
            `;
            kontener.appendChild(kolumna);
        });
    }

    formularz.addEventListener('submit', (e) => {
        e.preventDefault();
        const nowyLink = {
            nazwa: nazwaInput.value.trim(),
            url: urlInput.value.trim()
        };
        linki.push(nowyLink);
        localStorage.setItem('mojeSzybkieLinki', JSON.stringify(linki));
        formularz.reset();
        renderujLinki();
    });

    window.usunLink = (index) => {
        linki.splice(index, 1);
        localStorage.setItem('mojeSzybkieLinki', JSON.stringify(linki));
        renderujLinki();
    };

    renderujLinki();
});