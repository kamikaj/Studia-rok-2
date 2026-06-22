# 🌐 Portfolio Aplikacji Webowych — Podstawy Aplikacji Internetowych

Katalog zawiera autorskie projekty inżynierskie dedykowane technologiom frontendowym, architekturze aplikacji opartych na stanie (State-Driven Apps) oraz optymalizacji User Experience (UX). Elementy te demonstrują płynne przejście od semantycznego układu stron do kompletnych systemów typu SPA (Single Page Application) stworzonych w czystym kodzie.

---

## Projekty w obrębie modułu

Katalog został podzielony na dwa kluczowe etapy wdrożeniowe, z których każdy posiada niezależną, pełną dokumentację techniczną:

### 🎓 1. Pulpit Studenta — Kompleksowy Asystent Akademicki & SPA Organizer
* **Katalog projektu:** [`/Projekt_końcowy`](./Projekt_ko%C5%84cowy/)
* **Główny Stack:** Vanilla JavaScript (ES6+), Bootstrap 5, Web Storage API (`localStorage`), Fetch API, CSS Variables.
* **Zakres inżynierski:** Kompletna aplikacja **SPA** zarządzająca procesami planowania i komunikacji. Implementuje pełne operacje CRUD na harmonogramie zajęć, asynchroniczne zasilanie danymi z plików JSON, zintegrowany edytor notatek deweloperskich z opcją eksportu do struktur TXT/JSON oraz interaktywne forum roku działające w czasie rzeczywistym. Moduł UX oferuje dynamiczny wtrysk motywów (w tym High-Contrast dla dostępności) oraz integrację z Spotify API.

* ⚠️ Uwaga dotycząca uruchamiania:
Aplikacja korzysta z asynchronicznego pobierania danych (Fetch API) oraz Web Storage API. Z tego względu, w przypadku pobrania plików na dysk lokalny, uruchomienie aplikacji bezpośrednio poprzez dwukrotne kliknięcie w index.html (protokół file://) może zablokować niektóre funkcjonalności ze względów bezpieczeństwa przeglądarki (blokada CORS).
Zalecam:
    Korzystanie z wersji Live Demo dostępnej w tym repozytorium (działa w pełni bez żadnej konfiguracji).
    Uruchamianie plików lokalnie wyłącznie przez wtyczkę Live Server w VS Code lub WebStorm, co symuluje środowisko serwera (protokół http://).
* **Live Demo:** [🚀 Uruchom aplikację - Pulpit Studenta](https://github.com/kamikaj/Studia-rok-2/blob/8f72f5e5f938da9de280356b835d21c0438a7a83/Podstawy%20Aplikacji%20Internetowych/Projekt_ko%C5%84cowy/Pulpit_Studenta/index.html)

### 🛰️ 2. Gwiezdny Interaktywny Przewodnik HTML z Walidacją Real-Time
* **Katalog projektu:** [`/Projekt_cząstkowy`](./Projekt_cząstkowy/)
* **Główny Stack:** HTML5 Semantic, CSS3 Core (Flexbox & CSS Grid), Vanilla JS, W3C Standards.
* **Zakres inżynierski:** Projekt zorientowany na bezkompromisową wydajność renderowania i czystą semantykę struktur informacyjnych. Unikalna, ergonomiczna estetyka Dark Mode minimalizuje zmęczenie wzroku. Efekty wizualne (gwiezdne tło) zostały wygenerowane czystym algorytmem CSS, redukując wagę aplikacji. Zawiera inteligentny moduł walidacji formularzy w czasie rzeczywistym oparty na stanach natywnych pseudoklas CSS.
* **Live Demo:** [🚀 Uruchom projekt](https://github.com/kamikaj/Studia-rok-2/blob/8f72f5e5f938da9de280356b835d21c0438a7a83/Podstawy%20Aplikacji%20Internetowych/Projekt_cz%C4%85stkowy/Gwiezdny_Interaktywny_Przewodnik_HTML/index.html)

---

## 🛠️ Architektura i Standardy Jakościowe

Oba systemy zostały zaprojektowane z poszanowaniem rygorystycznych reguł współczesnego rzemiosła webowego:
* **Separation of Concerns:** Całkowite odseparowanie struktury (HTML5), prezentacji wizualnej (CSS3) i logiki biznesowej aplikacji (JS).
* **Natywne zarządzanie stanem:** Wykorzystanie możliwości przeglądarki (`localStorage`) do utrzymywania, serializacji i odczytu danych użytkownika bez narzutu ciężkich frameworków.
* **Zgodność z W3C:** Pełna poprawność składniowa potwierdzona oficjalnymi walidatorami konsorcjum W3C, zapewniająca identyczne zachowanie aplikacji na silnikach Blink (Chrome), Gecko (Firefox) oraz WebKit (Safari).
