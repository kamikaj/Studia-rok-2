const kontenerPlanu = document.getElementById('plan-zajec-kontener');
const odznakaStatusu = document.getElementById('status-polaczenia');
const przyciskiDni = document.querySelectorAll('#nawigacja-dni .btn');

const formKalendarz = document.getElementById('formularz-kalendarza');
const inputData = document.getElementById('data');
const inputTekstKalendarz = document.getElementById('tekst-kalendarz');
const pokazywanaDataBadge = document.getElementById('pokazywana-data');
const agendaKontener = document.getElementById('agenda-kontener');

const formNowyPrzedmiot = document.getElementById('formularz-nowego-przedmiotu');
const tytulFormPrzedmiotu = document.getElementById('tytul-formularza-przedmiotu');
const inputEdycjaIndex = document.getElementById('plan-edycja-index');
const btnAnulujEdycje = document.getElementById('btn-anuluj-edycje');
const btnZapiszPrzedmiot = document.getElementById('btn-zapisz-przedmiot');

const MAPA_DNI_TYGODNIA = { 1: 'poniedzialek', 2: 'wtorek', 3: 'sroda', 4: 'czwartek', 5: 'piatek' };
const NAZWY_DNI = { 'poniedzialek': 'Poniedziałek', 'wtorek': 'Wtorek', 'sroda': 'Środa', 'czwartek': 'Czwartek', 'piatek': 'Piątek' };

function pobierzDanePlanu(nazwaDnia) {
    return new Promise((resolve, reject) => {
        const lokalnyPlan = localStorage.getItem(`plan_${nazwaDnia}`);
        if (lokalnyPlan) {
            resolve(JSON.parse(lokalnyPlan));
        } else {
            fetch(`Plan/${nazwaDnia}.json?t=${new Date().getTime()}`, { cache: 'no-store' })
                .then(res => {
                    if (!res.ok) throw new Error();
                    return res.json();
                })
                .then(dane => {
                    localStorage.setItem(`plan_${nazwaDnia}`, JSON.stringify(dane));
                    resolve(dane);
                })
                .catch(() => {
                    localStorage.setItem(`plan_${nazwaDnia}`, JSON.stringify([]));
                    resolve([]);
                });
        }
    });
}

function pobierzPlanDlaDnia(nazwaDnia, czyPokazacAkcje = true) {
    if (!kontenerPlanu || !nazwaDnia) return;

    const szukanyDzien = nazwaDnia.toLowerCase().trim();

    if (odznakaStatusu) odznakaStatusu.innerText = `Dzień: ${NAZWY_DNI[szukanyDzien] || nazwaDnia}`;

    pobierzDanePlanu(szukanyDzien)
        .then(danePlanu => {
            if (danePlanu.length === 0) {
                kontenerPlanu.innerHTML = '<div class="p-4 text-muted text-center fw-bold">Brak zajęć w tym dniu! Wolne! 🎉</div>';
                return;
            }

            let htmlTabeli = `
                <table class="table table-hover table-striped mb-0 align-middle">
                    <thead class="table-light">
                        <tr>
                            <th scope="col" style="width: 15%; padding-left: 20px;">Godzina</th>
                            <th scope="col">Przedmiot</th>
                            <th scope="col">Sala</th>
                            <th scope="col">Prowadzący</th>
                            <th scope="col" style="width: 25%;">Uwagi</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            danePlanu.forEach((wiersz, index) => {
                let klasaOdznaki = 'bg-secondary';
                if (wiersz.status.includes('Egzamin') || wiersz.status.includes('egzamin') || wiersz.status.includes('projekt') || wiersz.status.includes('Kolokwium')) {
                    klasaOdznaki = 'bg-danger';
                } else if (wiersz.status.includes('Wykład') || wiersz.status.includes('zdalne')) {
                    klasaOdznaki = 'bg-success';
                }

                let htmlAkcji = czyPokazacAkcje ? `
            <div class="btn-group btn-group-sm ms-2">
                <button class="btn btn-link p-0 text-primary" onclick="uruchomEdycjePrzedmiotu('${szukanyDzien}', ${index})"><i class="bi bi-pencil-square"></i></button>
                <button class="btn btn-link p-0 text-danger ms-2" onclick="usunPrzedmiotZPlanu('${szukanyDzien}', ${index})"><i class="bi bi-trash-fill"></i></button>
            </div>` : '';

                htmlTabeli += `
            <tr>
                <td>${wiersz.godzina}</td>
                <td>${wiersz.przedmiot}</td>
                <td>${wiersz.sala}</td>
                <td>${wiersz.prowadzacy}</td>
                <td>
                    <div class="d-flex align-items-center">
                        <span class="badge ${klasaOdznaki}">${wiersz.status}</span>
                        ${htmlAkcji}
                    </div>
                </td>
            </tr>`;
            });

            htmlTabeli += '</tbody></table>';
            kontenerPlanu.innerHTML = htmlTabeli;
        })
        .catch(() => {
            kontenerPlanu.innerHTML = `<div class="alert alert-danger m-3 small">Błąd pobierania planu.</div>`;
        });
}

function autoWykryjDzien() {
    const dzisiejszyDzienId = new Date().getDay();
    switch(dzisiejszyDzienId) {
        case 2: return 'wtorek';
        case 3: return 'sroda';
        case 4: return 'czwartek';
        case 5: return 'piatek';
        case 1:
        case 6:
        case 0:
        default:
            return 'poniedzialek';
    }
}

function odswiezAgendeDnia(wybranaDataText) {
    if (!wybranaDataText || !agendaKontener) return;

    if (pokazywanaDataBadge) pokazywanaDataBadge.innerText = wybranaDataText;

    const obiektDaty = new Date(wybranaDataText);
    const dzienTygodniaNum = obiektDaty.getDay();
    const nazwaPlikuDnia = MAPA_DNI_TYGODNIA[dzienTygodniaNum];

    let prywatneZadania = JSON.parse(localStorage.getItem(`cal_${wybranaDataText}`)) || [];
    let htmlPlanuHeader = `<h6 class="fw-bold text-secondary-emphasis mb-3 border-bottom pb-1"><i class="bi bi-mortarboard"></i> Zajęcia i wykłady</h6>`;

    if (dzienTygodniaNum === 0 || dzienTygodniaNum === 6) {
        renderujKoncowaAgende(htmlPlanuHeader + '<div class="text-secondary-emphasis small mb-4"> Brak zaplanowanych zajęć w tym dniu.</div>', prywatneZadania, wybranaDataText);
    } else {
        pobierzDanePlanu(nazwaPlikuDnia)
            .then(planDnia => {
                let htmlPlanu = '';
                if (planDnia.length === 0) {
                    htmlPlanu = '<div class="text-muted small mb-4">Brak zaplanowanych zajęć.</div>';
                } else {
                    htmlPlanu = '<div class="list-group mb-4 shadow-sm">';
                    planDnia.forEach((zajecie, idx) => {
                        htmlPlanu += `
                            <div class="list-group-item list-group-item-action py-2 d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 class="mb-1 fw-bold text-accent">${zajecie.przedmiot}</h6>
                                    <p class="mb-0 text-muted small">Sala: <strong>${zajecie.sala}</strong> | Prowadzący: ${zajecie.prowadzacy}</p>
                                </div>
                                <div class="text-end">
                                    <span class="text-accent fw-bold small d-block mb-1">${zajecie.godzina}</span>
                                        <div class="d-flex justify-content-end gap-2">
                                            <button class="btn btn-xs btn-link text-accent p-0 text-decoration-none small" style="font-size: 12px;" onclick="uruchomEdycjePrzedmiotu('${nazwaPlikuDnia}', ${idx})">
                                                <i class="bi bi-pencil-square"></i> Edytuj
                                            </button>
                                            <button class="btn btn-xs btn-link text-danger p-0 text-decoration-none small" style="font-size: 12px;" onclick="usunPrzedmiotZPlanu('${nazwaPlikuDnia}', ${idx})">
                                                <i class="bi bi-trash-fill"></i> Usuń
                                            </button>
                                        </div>
                                </div>
                            </div>
                        `;
                    });
                    htmlPlanu += '</div>';
                }
                renderujKoncowaAgende(htmlPlanuHeader + htmlPlanu, prywatneZadania, wybranaDataText);
            })
            .catch(() => {
                renderujKoncowaAgende(htmlPlanuHeader + '<div class="text-danger small mb-4">Błąd wczytywania planu.</div>', prywatneZadania, wybranaDataText);
            });
    }
}

function renderujKoncowaAgende(htmlPlanuUczelni, listaZadanPrywatnych, dataKlucz) {
    let htmlPrywatne = `<h6 class="fw-bold text-secondary-emphasis mb-3 border-bottom pb-1"><i class="bi bi-person-fill-gear"></i> Zadania</h6>`;

    if (listaZadanPrywatnych.length === 0) {
        htmlPrywatne += '<div class="text-muted small italic p-2 bg-gradient rounded">Brak wpisów. </div>';
    } else {
        htmlPrywatne += '<ul class="list-group">';
        listaZadanPrywatnych.forEach((zadanie, index) => {
            htmlPrywatne += `
                <li class="list-group-item d-flex justify-content-between align-items-center bg-active text-secondary-emphasis border-secondary p-2 small">
                    <span>- ${zadanie}</span>
                    <button class="btn btn-sm btn-link text-danger p-0 border-0" onclick="usunZadanieZKalendarza('${dataKlucz}', ${index})">
                        <i class="bi bi-trash3-fill"></i>
                    </button>
                </li>
            `;
        });
        htmlPrywatne += '</ul>';
    }

    agendaKontener.innerHTML = htmlPlanuUczelni + htmlPrywatne;
}

window.uruchomEdycjePrzedmiotu = function(nazwaDnia, index) {
    pobierzDanePlanu(nazwaDnia).then(planDnia => {
        const przedmiot = planDnia[index];

        const kontenerBledow = document.getElementById('walidacja-bledy');
        if(kontenerBledow) kontenerBledow.innerHTML = '';

        if(document.getElementById('plan-nowy-dzien')) document.getElementById('plan-nowy-dzien').value = nazwaDnia;
        if(document.getElementById('plan-nowa-godzina')) document.getElementById('plan-nowa-godzina').value = przedmiot.godzina;
        if(document.getElementById('plan-nowy-przedmiot')) document.getElementById('plan-nowy-przedmiot').value = przedmiot.przedmiot;
        if(document.getElementById('plan-nowa-sala')) document.getElementById('plan-nowa-sala').value = przedmiot.sala;
        if(document.getElementById('plan-nowy-prowadzacy')) document.getElementById('plan-nowy-prowadzacy').value = przedmiot.prowadzacy;

        const statusTekst = przedmiot.status || '';
        const czyZdalne = statusTekst.includes('(Zdalnie)');
        if(document.getElementById('plan-czy-zdalne')) {
            document.getElementById('plan-czy-zdalne').checked = czyZdalne;
        }

        if(statusTekst.includes('Laboratorium')) {
            document.getElementById('typ-lab').checked = true;
        } else if(statusTekst.includes('Ćwiczenia')) {
            document.getElementById('typ-cwiczenia').checked = true;
        } else {
            document.getElementById('typ-wyklad').checked = true;
        }

        if(inputEdycjaIndex) inputEdycjaIndex.value = index;
        if(tytulFormPrzedmiotu) tytulFormPrzedmiotu.innerHTML = `<i class="bi bi-pencil-square"></i> TRYB EDYCJI: Modyfikujesz przedmiot`;
        if(btnZapiszPrzedmiot) btnZapiszPrzedmiot.className = "btn btn-primary btn-sm flex-grow-1 fw-bold";
        if(btnAnulujEdycje) btnAnulujEdycje.classList.remove('d-none');

        if(formNowyPrzedmiot) formNowyPrzedmiot.scrollIntoView({ behavior: 'smooth' });
    });
};

window.anulujEdycjePrzedmiotu = function() {
    if(inputEdycjaIndex) inputEdycjaIndex.value = "-1";
    if(tytulFormPrzedmiotu) tytulFormPrzedmiotu.innerHTML = `<i class="bi bi-plus-circle-fill"></i> Dodaj nowy przedmiot do planu`;
    if(btnZapiszPrzedmiot) btnZapiszPrzedmiot.className = "btn btn-accent w-100 fw-bold";
    if(btnAnulujEdycje) btnAnulujEdycje.classList.add('d-none');

    const kontenerBledow = document.getElementById('walidacja-bledy');
    if(kontenerBledow) kontenerBledow.innerHTML = '';

    if(formNowyPrzedmiot) {
        formNowyPrzedmiot.reset();
        document.getElementById('typ-wyklad').checked = true;
        document.getElementById('plan-czy-zdalne').checked = false;
    }
};

window.usunPrzedmiotZPlanu = function(nazwaDnia, index) {
    if(confirm("Czy na pewno chcesz usunąć ten przedmiot z harmonogramu?")) {
        pobierzDanePlanu(nazwaDnia).then(planDnia => {
            planDnia.splice(index, 1);
            localStorage.setItem(`plan_${nazwaDnia}`, JSON.stringify(planDnia));

            pobierzPlanDlaDnia(nazwaDnia);
            if (inputData && inputData.value) odswiezAgendeDnia(inputData.value);
        });
    }
};

if (btnAnulujEdycje) {
    btnAnulujEdycje.addEventListener('click', function(e) {
        e.preventDefault();
        window.anulujEdycjePrzedmiotu();
    });
}

if (formKalendarz) {
    formKalendarz.addEventListener('submit', function(e) {
        e.preventDefault();

        const dataKey = inputData.value;
        const noweZadanie = inputTekstKalendarz.value.trim();

        if (!dataKey || !noweZadanie) return;

        let zadaniaDnia = JSON.parse(localStorage.getItem(`cal_${dataKey}`)) || [];
        zadaniaDnia.push(noweZadanie);
        localStorage.setItem(`cal_${dataKey}`, JSON.stringify(zadaniaDnia));

        inputTekstKalendarz.value = '';
        odswiezAgendeDnia(dataKey);
        wyswietlZadaniaNaDzis();
    });
}

if (inputData) {
    inputData.addEventListener('change', function() {
        odswiezAgendeDnia(this.value);
    });
}

window.usunZadanieZKalendarza = function(dataKlucz, index) {
    let zadaniaDnia = JSON.parse(localStorage.getItem(`cal_${dataKlucz}`)) || [];
    zadaniaDnia.splice(index, 1);

    if (zadaniaDnia.length === 0) {
        localStorage.removeItem(`cal_${dataKlucz}`);
    } else {
        localStorage.setItem(`cal_${dataKlucz}`, JSON.stringify(zadaniaDnia));
    }

    odswiezAgendeDnia(dataKlucz);
    wyswietlZadaniaNaDzis();
};

window.addEventListener('DOMContentLoaded', () => {
    const wczytaneForum = localStorage.getItem('forumStudenckieData');
    if (wczytaneForum) {
        window.forumData = JSON.parse(wczytaneForum);
    } else {
        window.forumData = [
            {
                id: 1,
                tytul: "Pytania na kolokwium z PAI",
                tresc: "Siema, wiecie może czy na kolosie z programowania aplikacji internetowych będą pytania z LocalStorage i cyklu życia komponentu?",
                autor: "Tomek",
                data: "11:20",
                komentarze: [
                    { autor: "Anna (Starosta)", tekst: "Tak, pytałam prowadzącego. Mówił, że LocalStorage będzie na 100%, warto powtórzyć operacje JSON.stringify i parse.", data: "11:25" },
                    { autor: "Janek", tekst: "Dzięki Ania! Uratowałaś mi życie, idę pписать skrypty.", data: "11:32" }
                ]
            }
        ];
    }

    if (typeof wyswietlWatki === 'function') {
        wyswietlWatki();
    }

    const startowyDzien = autoWykryjDzien();
    pobierzPlanDlaDnia(startowyDzien, false);

    if (przyciskiDni) {
        przyciskiDni.forEach(btn => {
            btn.addEventListener('click', () => {
                const wybranyDzien = btn.getAttribute('data-dzien');
                if (wybranyDzien) {
                    pobierzPlanDlaDnia(wybranyDzien);
                }
            });
        });
    }

    if (inputData) {
        const dzis = new Date().toISOString().split('T')[0];
        inputData.value = dzis;
        odswiezAgendeDnia(dzis);
    }

    wyswietlZadaniaNaDzis();
});

const uploadPhoto = document.getElementById('upload-photo');
const profileImg = document.getElementById('profile-img');

document.addEventListener('DOMContentLoaded', () => {
    const savedPhoto = localStorage.getItem('profilePhoto');
    if (savedPhoto && profileImg) {
        profileImg.src = savedPhoto;
    }
});

if (uploadPhoto) {
    uploadPhoto.addEventListener('change', function() {
        const file = this.files[0];
        if (file && profileImg) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profileImg.src = e.target.result;
                localStorage.setItem('profilePhoto', e.target.result);
            }
            reader.readAsDataURL(file);
        }
    });
}

if (formNowyPrzedmiot) {
    formNowyPrzedmiot.addEventListener('submit', function(e) {
        e.preventDefault();

        const kontenerBledow = document.getElementById('walidacja-bledy');
        kontenerBledow.innerHTML = '';
        let bledy = [];

        const wybranyDzien = document.getElementById('plan-nowy-dzien').value;
        const godzinaWprowadzona = document.getElementById('plan-nowa-godzina').value.trim();
        const przedmiotNazwa = document.getElementById('plan-nowy-przedmiot').value.trim();
        const salaNazwa = document.getElementById('plan-nowa-sala').value.trim();
        const prowadzacyNazwa = document.getElementById('plan-nowy-prowadzacy').value.trim();

        const wybranyTypRadio = document.querySelector('input[name="plan-typ-zajec"]:checked').value;
        const czyZdalneCheckbox = document.getElementById('plan-czy-zdalne').checked;

        if (!wybranyDzien) {
            bledy.push("Musisz wybrać dzień tygodnia z listy.");
        }

        const regexGodziny = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]\s*-\s*([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!godzinaWprowadzona) {
            bledy.push("Pole 'Godzina' nie może być puste.");
        } else if (!regexGodziny.test(godzinaWprowadzona)) {
            bledy.push("Niepoprawny format godziny! Wpisz np: 08:15 - 09:45");
        }

        if (!przedmiotNazwa) {
            bledy.push("Nazwa przedmiotu jest wymagana.");
        } else if (przedmiotNazwa.length < 3) {
            bledy.push("Nazwa przedmiotu musi mieć minimum 3 znaki.");
        }

        if (!salaNazwa) {
            bledy.push("Musisz podać numer sali lub oznaczenie laboratorium.");
        }

        if (!prowadzacyNazwa) {
            bledy.push("Wpisz stopień i nazwisko prowadzącego.");
        }

        if (bledy.length > 0) {
            let htmlBledow = '<div class="alert alert-danger p-2 small m-0"><ul class="mb-0 ps-3">';
            bledy.forEach(b => {
                htmlBledow += `<li>${b}</li>`;
            });
            htmlBledow += '</ul></div>';
            kontenerBledow.innerHTML = htmlBledow;
            return;
        }

        let finalnyStatus = wybranyTypRadio;
        if (czyZdalneCheckbox) {
            finalnyStatus += " (Zdalnie)";
        }

        const indexEdycji = inputEdycjaIndex ? parseInt(inputEdycjaIndex.value) : -1;

        const przedmiotDane = {
            godzina: godzinaWprowadzona,
            przedmiot: przedmiotNazwa,
            sala: salaNazwa,
            prowadzacy: prowadzacyNazwa,
            status: finalnyStatus
        };

        pobierzDanePlanu(wybranyDzien).then(planDnia => {
            if (indexEdycji > -1) {
                planDnia[indexEdycji] = przedmiotDane;
                alert("Pomyślnie zaktualizowano dane przedmiotu!");
            } else {
                planDnia.push(przedmiotDane);
                alert("Dodano nowy przedmiot do planu zajęć!");
            }

            localStorage.setItem(`plan_${wybranyDzien}`, JSON.stringify(planDnia));
            window.anulujEdycjePrzedmiotu();

            pobierzPlanDlaDnia(wybranyDzien);
            if (inputData && inputData.value) odswiezAgendeDnia(inputData.value);
        });
    });
}

function wyswietlZadaniaNaDzis() {
    const kontener = document.getElementById('notatki-dzis-kontener');
    if (!kontener) return;

    let wszystkieZadania = [];

    for (let i = 0; i < localStorage.length; i++) {
        const klucz = localStorage.key(i);

        if (klucz && klucz.startsWith('cal_')) {
            const dataKlucza = klucz.replace('cal_', '');
            const zadaniaZDanegoDnia = JSON.parse(localStorage.getItem(klucz)) || [];

            zadaniaZDanegoDnia.forEach(tekst => {
                wszystkieZadania.push({
                    data: dataKlucza,
                    tekst: tekst
                });
            });
        }
    }

    if (wszystkieZadania.length === 0) {
        kontener.innerHTML = `<p class="text-muted small mb-0 p-2"><i class="bi bi-info-circle me-1"></i>Brak zaplanowanych zadań.</p>`;
        return;
    }

    wszystkieZadania.sort((a, b) => new Date(a.data) - new Date(b.data));

    const t = new Date();
    const dzisFormat = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;

    let html = '<ul class="list-group list-group-flush" style="max-height: 300px; overflow-y: auto;">';
    wszystkieZadania.forEach(z => {
        const opcje = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const sformatowanaData = new Date(z.data).toLocaleDateString('pl-PL', opcje);

        const czyDzis = z.data === dzisFormat;
        const odznakaDaty = czyDzis
            ? '<span class="badge bg-warning text-dark fw-bold">Dzisiaj</span>'
            : `<span class="badge bg-secondary-subtle text-body fw-bold">${sformatowanaData}</span>`;

        html += `
            <li class="list-group-item bg-transparent d-flex justify-content-between align-items-center border-bottom border-secondary-subtle py-2 text-secondary-emphasis">
                <span class="text-wrap pe-2"><i class="bi bi-calendar-event text-accent-dynamic me-2"></i>${z.tekst}</span>
                <small class="flex-shrink-0">${odznakaDaty}</small>
            </li>
        `;
    });
    html += '</ul>';

    kontener.innerHTML = html;
}