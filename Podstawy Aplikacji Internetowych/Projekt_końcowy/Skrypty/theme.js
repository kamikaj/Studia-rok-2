document.addEventListener('DOMContentLoaded', () => {
    const wyborMotywu = document.getElementById('wybor-motywu');
    const body = document.body;
    const html = document.documentElement;

    function zastosujMotyw(nazwaMotywu) {
        body.classList.remove('theme-yellow-dark', 'theme-dark', 'theme-light');
        body.classList.add(nazwaMotywu);

        if (nazwaMotywu === 'theme-light') {
            html.setAttribute('data-bs-theme', 'light');
        } else {
            html.setAttribute('data-bs-theme', 'dark');
        }
    }

    const zapisanyMotyw = localStorage.getItem('aktywny-motyw');
    if (zapisanyMotyw) {
        zastosujMotyw(zapisanyMotyw);
        if (wyborMotywu) {
            wyborMotywu.value = zapisanyMotyw;
        }
    }

    if (wyborMotywu) {
        wyborMotywu.addEventListener('change', function() {
            const wybranyMotyw = this.value;
            zastosujMotyw(wybranyMotyw);
            localStorage.setItem('aktywny-motyw', wybranyMotyw);
        });
    }
});