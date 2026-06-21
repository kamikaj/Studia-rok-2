# Portfolio Projektów – Bezpieczeństwo Informacji (Laboratoria)

Niniejsze repozytorium stanowi przekrój praktycznych umiejętności i projektów zrealizowanych przeze mnie w ramach zaawansowanego kursu **Bezpieczeństwa Informacji**. Zawarte tu materiały dokumentują kompetencje z zakresu administracji bezpiecznymi systemami, kryptografii, inżynierii sieciowej oraz zarządzania ryzykiem i ciągłością działania.

---

## Ważna informacja dotycząca dostępności pełnej dokumentacji

> [!IMPORTANT]
> Ze względów bezpieczeństwa (ochrona realnych adresów IP, nazw hostów, struktur sieciowych oraz danych wrażliwych środowiska testowego) **pełne sprawozdania techniczne (pliki PDF ze zrzutami ekranu, logami i szczegółowymi konfiguracjami) znajdują się w repozytorium prywatnym**.
> 
> **Pełna dokumentacja techniczna każdego z poniższych laboratoriów jest dostępna do wglądu na życzenie w procesie rekrutacyjnym.** Chętnie udostępnię dedykowany dostęp lub prześlę wybrane pliki.

---

## Przegląd zrealizowanych prac laboratoryjnych

### 1. Wirtualizacja i Zaawansowana Konfiguracja Sieci (Laboratorium 2)
* **Zakres prac:** Projektowanie i izolacja środowisk testowych w Oracle VirtualBox.
* **Technologie i narzędzia:** VirtualBox, Linux (Xubuntu), narzędzia sieciowe (`ping`, `netstat`).
* **Kluczowe osiągnięcia:**
  * Skonfigurowanie i testowanie 5 różnych trybów sieciowych: **NAT**, **Sieć NAT (NAT Network)**, **Mostkowana (Bridged)**, **Wewnętrzna (Internal)** oraz **Host-Only**.
  * Wdrożenie mechanizmu przekierowania portów (Port Forwarding) dla usług SSH oraz baz danych w środowisku izolowanym.
  * Analiza izolacji maszyn wirtualnych (VM-to-VM) i podatności na bezpośrednią komunikację w różnych architekturach sieciowych.

### 2. Utwardzanie Ochrony Systemów Operacyjnych (Laboratorium 3)
* **Zakres prac:** Implementacja polityk bezpieczeństwa (Hardening) w systemach operacyjnych Linux.
* **Technologie i narzędzia:** ClamAV, Cron, Samba, Tripwire, Lynis.
* **Kluczowe osiągnięcia:**
  * Wdrożenie ochrony antywirusowej (ClamAV) z automatyzacją skanowania za pomocą autorskich skryptów powłoki harmonogramowanych w `cron`.
  * Zarządzanie tożsamością: konfiguracja zaawansowanych polityk haseł, grup systemowych oraz restrykcyjnych uprawnień do plików (`chmod`, `chown`).
  * Konfiguracja bezpiecznego serwera plików Samba z restrykcjami dostępu dla konkretnych użytkowników i hostów (`hosts allow`).
  * Wdrożenie systemu wykrywania intruzów (HIDS) **Tripwire** – inicjalizacja bazy integralności oraz modyfikacja polityk (`twpol.txt`) w celu eliminacji fałszywych alarmów (false positives).
  * Przeprowadzenie pełnego audytu bezpieczeństwa systemu za pomocą narzędzia **Lynis**.

### 3. Kryptografia Symetryczna i Tryby Pracy Szyfrów Blokowych (Laboratorium 4)
* **Zakres prac:** Praktyczne wykorzystanie kryptografii w ochronie poufności danych.
* **Technologie i narzędzia:** Python, PyCryptodome, AES, tryby pracy szyfrów (ECB, CBC itd.).
* **Kluczowe osiągnięcia:**
  * Implementacja skryptów kryptograficznych w języku Python generujących bezpieczne klucze kryptograficzne.
  * Analiza systemowych źródeł entropii przy użyciu funkcji `get_random_bytes()`.
  * Praktyczne badanie różnic, zalet i podatności poszczególnych trybów pracy szyfrów blokowych.

### 4. Funkcje Skrótu i Badanie Odporności na Kolizje (Laboratorium 5)
* **Zakres prac:** Zapewnianie integralności danych za pomocą nieodwracalnych funkcji skrótu.
* **Technologie i narzędzia:** MD5, SHA-1, SHA-256, Python (analiza statystyczna).
* **Kluczowe osiągnięcia:**
  * Generowanie i weryfikacja sum kontrolnych dla plików o krytycznym rozmiarze (do 100 MB+).
  * **Analiza matematyczno-statystyczna kolizji:** Przeprowadzenie testów empirycznych odporności na kolizje (atak Birthday Paradox).
  * Wykazanie przewagi statystycznej paradoksu dnia urodzin nad tradycyjnym atakiem brute-force (osiągnięcie kolizji przy średnio ~6046 próbach dla zredukowanej przestrzeni adresowej, zgodnie z teoretycznymi założeń $\sqrt{n}$).

### 5. Infrastruktura Klucza Publicznego (PKI) i Protokół SSL/TLS (Laboratorium 6)
* **Zakres prac:** Budowa zaufanej struktury certyfikacji i zabezpieczanie usług webowych.
* **Technologie i narzędzia:** OpenSSL, Kryptografia krzywych eliptycznych (ECC), Serwer Apache2, Certyfikaty X.509.
* **Kluczowe osiągnięcia:**
  * Utworzenie własnego, niezależnego Głównego Urzędu Certyfikacji (**Root CA**) przy użyciu nowoczesnego szyfrowania opartego na krzywych eliptycznych (ECC - `prime256v1`).
  * Generowanie żądań podpisania certyfikatów (CSR) oraz autoryzacja certyfikatów końcowych dla usług sieciowych.
  * Konfiguracja i utwardzenie serwera Apache2 do obsługi bezpiecznego protokołu HTTPS (port 443) z wykorzystaniem własnoręcznie podpisanego certyfikatu TLS.

### 6. Zarządzanie Kopiami Zapasowymi i Automatyzacja Backupów (Laboratorium 7)
* **Zakres prac:** Zapewnianie dostępności danych oraz odporności na awarie i ataki typu Ransomware.
* **Technologie i narzędzia:** `rsync`, `grsync`, `tar` (Incremental Backups), Bash.
* **Kluczowe osiągnięcia:**
  * Projektowanie lokalnych strategii synchronizacji danych za pomocą mechanizmu `rsync`.
  * Automatyzacja kopii zapasowych w Linuxie: implementacja skryptów wykonujących **kopie pełne oraz kopie przyrostowe** z wykorzystaniem metadanych struktury drzewa katalogów (plik `.snar`).
  * Analiza efektywności pamięciowej (porównanie rozmiarów kopii pełnej ~1.45 GB z kopią przyrostową rejestrującą jedynie zmiany różnicowe).

### 7. Niezawodność Danych – Macierze RAID (Laboratorium 8)
* **Zakres prac:** Konfiguracja sprzętowej i programowej odporności pamięci masowych na uszkodzenia.
* **Technologie i narzędzia:** Linux Software RAID (`mdadm`), VirtualBox Block Devices.
* **Kluczowe osiągnięcia:**
  * Tworzenie, montowanie i zarządzanie programowymi macierzami dyskowymi **RAID 1**, **RAID 5** oraz **RAID 6**.
  * Przeprowadzanie zaawansowanych operacji migracji aktywnych macierzy (np. migracja live z RAID 6 do RAID 5).
  * Symulacja awarii sprzętowych: programowe oznaczanie dysków jako uszkodzone (`--fail`), usuwanie ich z macierzy, bezpieczna wymiana "w locie" i monitorowanie procesu odbudowy danych (rebuilding).

### 8. Ataki Sieciowe, Zapory Ogniowe i Sieci VPN (Laboratoria 9, 10, 11)
* **Zakres prac:** Bezpieczeństwo warstwy sieciowej, analiza ruchu oraz bezpieczne tunele szyfrowane.
* **Technologie i narzędzia:** Wireshark/Tshark, `iptables`, `ufw`, OpenVPN, Easy-RSA.
* **Kluczowe osiągnięcia:**
  * Badanie podatności protokołów sieciowych: analiza teoretyczna i praktyczna ataków typu Sniffing, Spoofing, ARP Poisoning oraz manipulacji pakietami TCP/ICMP.
  * Implementacja reguł filtrowania ruchu na zaporach sieciowych (`iptables` / `ufw`) – blokowanie nieautoryzowanego ruchu, ochrona portów i logowanie anomalii.
  * Budowa kompletnej wirtualnej sieci prywatnej (**VPN**): konfiguracja serwera i klienta OpenVPN, zarządzanie infrastrukturą kluczy za pomocą Easy-RSA, generowanie profili klienckich `.ovpn` i bezpieczna dystrybucja za pomocą SFTP.

### 9. Opracowanie Polityki Bezpieczeństwa Informacji - PBI (Laboratorium 12)
* **Zakres prac:** Podejście procesowe i formalno-prawne do bezpieczeństwa struktur organizacyjnych.
* **Standardy:** Zgodność z RODO, ISO/IEC 27001.
* **Kluczowe osiągnięcia:**
  * Stworzenie od podstaw kompleksowego dokumentu Polityki Bezpieczeństwa Informacji dla przykładowego przedsiębiorstwa produkcyjnego ("Zapałki Sp. z o.o.").
  * Przeprowadzenie klasyfikacji aktywów informacyjnych (receptury technologiczne, dane kadrowo-płacowe, bazy handlowe).
  * Opracowanie procedur technicznych i organizacyjnych: m.in. zasada czystego biurka/ekranu, zarządzanie incydentami, polityka backupu 3-2-1, zasady bezpiecznej wymiany danych z podmiotami zewnętrznymi.

---

## Główne Kompetencje Techniczne
* **SysAdmin & Hardening:** Zaawansowana administracja systemem Linux (Ubuntu/Xubuntu), kontrola integralności (Tripwire), audyt systemowy (Lynis).
* **NetSec & Firewalls:** Projektowanie sieci wirtualnych, filtrowanie ruchu (`iptables`), bezpieczna komunikacja zdalna (OpenVPN).
* **Kryptografia w Praktyce:** Zarządzanie strukturą PKI (własne urzędy certyfikacji CA), implementacja bibliotek kryptograficznych w Pythonie, znajomość mechanizmów szyfrowania symetrycznego i asymetrycznego.
* **SecOps / Continuity:** Projektowanie procedur odzyskiwania danych po awarii (Disaster Recovery), zarządzanie macierzami dyskowymi (`mdadm`), automatyzacja kopii zapasowych.

---

*W celu uzyskania dostępu do pełnego repozytorium prywatnego ze sprawozdaniami wykonawczymi, proszę o kontakt bezpośredni.*
