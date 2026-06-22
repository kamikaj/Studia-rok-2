const przyciskZapiszSpotify = document.getElementById('zapisz-spotify');
const przyciskUsunSpotify = document.getElementById('usun-spotify');
const poleUrlSpotify = document.getElementById('spotify-url');
const odtwarzaczSpotify = document.getElementById('spotify-player');

const DOMYSLNA_PLAYLISTA = "https://open.spotify.com/embed/playlist/0vvXsWCC9xrNLmHuSg8A6e";

document.addEventListener('DOMContentLoaded', function() {
    const zapisanyEmbed = localStorage.getItem('userSpotifyEmbed');
    if (zapisanyEmbed && odtwarzaczSpotify) {
        odtwarzaczSpotify.src = zapisanyEmbed;
    }
});

if (przyciskZapiszSpotify) {
    przyciskZapiszSpotify.addEventListener('click', function() {
        const wklejonyLink = poleUrlSpotify.value.trim();

        if (wklejonyLink.includes('spotify.com')) {
            let nowySrc = '';

            if (wklejonyLink.includes('/embed/')) {
                nowySrc = wklejonyLink;
            } else {
                const match = wklejonyLink.match(/(playlist|album|artist)\/([a-zA-Z0-9]+)/);
                if (match && match[1] && match[2]) {
                    const typ = match[1];
                    const id = match[2];
                    nowySrc = `https://open.spotify.com/embed/${typ}/${id}`;
                }
            }

            if (nowySrc) {
                odtwarzaczSpotify.src = nowySrc;
                localStorage.setItem('userSpotifyEmbed', nowySrc);
                poleUrlSpotify.value = '';
                alert('Zasób Spotify został załadowany i zapisany!');
            } else {
                alert('Nie udało się rozpoznać linku. Upewnij się, że kopiujesz link do playlisty lub albumu.');
            }
        } else {
            alert('Proszę wkleić prawidłowy link ze Spotify!');
        }
    });
}

if (przyciskUsunSpotify) {
    przyciskUsunSpotify.addEventListener('click', function() {
        odtwarzaczSpotify.src = DOMYSLNA_PLAYLISTA;
        localStorage.removeItem('userSpotifyEmbed');
        poleUrlSpotify.value = '';
        alert('Przywrócono domyślną playlistę do nauki!');
    });
}

function toggleSpotify() {
    const body = document.getElementById('spotify-body');
    const kolFunkcjonalna = document.getElementById('kolumna-funkcjonalna');
    const kolSpotify = document.getElementById('kolumna-spotify');

    body.classList.toggle('d-none');

    if (body.classList.contains('d-none')) {
        kolFunkcjonalna.classList.replace('col-lg-8', 'col-lg-10');
        kolSpotify.classList.replace('col-lg-4', 'col-lg-2');
    } else {
        kolFunkcjonalna.classList.replace('col-lg-10', 'col-lg-8');
        kolSpotify.classList.replace('col-lg-2', 'col-lg-4');
    }
}