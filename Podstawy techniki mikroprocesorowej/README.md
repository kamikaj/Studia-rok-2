# Programowanie Niskopoziomowe i Systemy Wbudowane (AVR ATmega32)

Repozytorium stanowi inżynierskie portfolio projektów zrealizowanych na platformie sprzętowej **Microchip/Atmel ATmega32** (taktowanie wewnętrzne 1 MHz) w architekturze **bare-metal**. Zamieszczone projekty demonstrują niskopoziomowe zarządzanie zasobami sprzętowymi, programowanie zorientowane na zdarzenia (Interrupt-Driven Design), precyzyjne systemy czasu rzeczywistego oraz optymalizację magistral komunikacyjnych w języku **C** z elementami **Asemblera (AVR)**.

---

## Stos Technologiczny i Narzędzia
* **Język programowania:** C (standard ANSI/ISO), elementy AVR Assembly
* **Architektura:** 8-bit RISC (AVR Harvard Architecture)
* **Mikrokontroler:** ATmega32 (1MHz wewnętrzny oscylator RC)
* **Kompilator i narzędzia:** `avr-gcc`, `avr-libc`, Microchip Studio / Atmel Studio
* **Peryferia sprzętowe:** Wyświetlacze 7-segmentowe (wspólna anoda/katoda), kontroler LCD HD44780, sprzętowe Timery (Timer 0), zewnętrzne kontrolery przerwań (INT0, INT2), diody LED, układy stykowe (debouncing).

---

## Szczegółowy Przegląd Architektury Projektów

### 1. Sekwencyjne Sterowanie GPIO & Determinizm Czasowy (Laboratorium 1)
Projekt implementuje zaawansowany algorytm sterowania sekwencyjnego dla 8 diod LED na porcie `PORTA`. Realizuje on asymetryczną animację cyklicznego przemieszczania się pary punktów świetlnych z różnymi interwałami czasowymi (0,5 s w stronę bitu najmłodszego, 1,0 s w stronę powrotną).
* **Kluczowe zagadnienia inżynierskie:**
  * **Zarządzanie rejestrami kierunku:** Wykorzystanie pełnej szerokości magistrali danych poprzez rejestr `DDRA` ustawiony w tryb wyjściowy (`0xFF`).
  * **Determinizm czasowy na poziomie maszynowym:** Zapewnienie stałego czasu wykonania pętli niezależnie od ścieżki wykonania instrukcji warunkowych `if`. Różnice w cyklach zegarowych procesora zostały zamaskowane sprzętowo-programowymi pętlami opóźniającymi opartymi na instrukcjach `SBCI` i `BRNE`.
  * **Bezpieczeństwo wykonywania kodu (Fault Tolerance):** Zastosowanie instrukcji blokowania przerwań `CLI` oraz pułapki programowej `RJMP PC` na końcu krytycznych sekwencji kodu, co zapobiega wykonywaniu przypadkowych instrukcji z pustych, niezainicjalizowanych obszarów pamięci Flash (program counter overflow prevention).
  * **Manipulacja bitowa:** Wykorzystanie operacji XOR (`EOR`) do przełączania stanów logicznych zamiast wielokrotnego wpisywania stałych masek do rejestru wyjściowego, optymalizując rozmiar kodu wynikowego.

### 2. Cyfrowe Multipleksowanie Wyświetlacza 7-Segmentowego (Laboratorium 2)
Projekt implementuje wielopozycyjny sterownik wyświetlacza 7-segmentowego. System realizuje algorytm dynamicznego odświeżania pozycji (multipleksowanie czasowe), tworząc dla ludzkiego oka iluzję jednoczesnego świecenia wszystkich segmentów przy jednoczesnym ograniczeniu linii GPIO.
* **Kluczowe zagadnienia inżynierskie:**
  * **Zbilansowany budżet czasowy:** Rygorystyczny podział czasu procesora – każda gałąź instrukcji warunkowej została zbalansowana do sumarycznego interwału **6 ms**. Zbyt długie opóźnienie powodowało migotanie (flickering), natomiast zbyt krótkie uniemożliwiało pełne otwarcie złącza tranzystorów kluczujących, drastycznie ograniczając jasność.
  * **Eliminacja powidoków ("Duchów"):** Opracowanie techniki czyszczenia stanów nieustalonych poprzez bezpośrednie przełączanie rejestru kierunku (`DDRB`) zamiast modyfikacji rejestru wyjściowego (`PORTB`). Wprowadzanie pinów sterujących kolumnami w stan wysokiej impedancji (Hi-Z / tryb wejścia) całkowicie odcinało prąd resztkowy podczas zmiany danych segmentów.

### 3. Sprzętowe Odmierzanie Czasu - Tryb CTC Timera 0 (Laboratorium 3)
Eliminacja programowych pętli opóźniających (`_delay_ms`) na rzecz deterministycznego, sprzętowego odliczania czasu za pomocą wbudowanego bloku licznika **Timer 0** pracującego w trybie **CTC (Clear Timer on Compare)**.
* **Kluczowe zagadnienia inżynierskie:**
  * **Matematyczny model konfiguracji:** Dla częstotliwości bazowej $F_{CPU} = 1	ext{ MHz}$, zadanego interwału taktowania $t = 10	ext{ ms}$ oraz preskalera $N = 256$, wyliczono i zaprogramowano rejestr porównania:
    $$OCR0 = rac{F_{CPU} \cdot t}{N} - 1 = rac{1000000 \cdot 0.01}{256} - 1  pprox 38$$
  * **Minimalizacja błędów kumulacyjnych:** Wykorzystanie sprzętowego zerowania licznika natychmiast po osiągnięciu wartości w `OCR0` (flaga `OCF0`), co odciąża procesor i eliminuje jitter czasowy wywołany opóźnieniem programowym.
  * **Integracja Hardware-Software:** Stabilizacja odczytu wejść mechanicznych poprzez programowy debouncing (blokada $200	ext{ ms}$) połączona z wymuszaniem wewnętrznych rezystorów podciągających (**pull-up**), co całkowicie wyeliminowało zakłócenia elektromagnetyczne (stany nieustalone).

### 4. Asynchroniczny System Przerwań Przemysłowych (Laboratorium 4 & 5)
Implementacja architektury sterowanej zdarzeniami (Event-Driven Architecture) z wykorzystaniem podsystemu przerwań zewnętrznych mikrokontrolera. System reaguje asynchronicznie na zewnętrzne sygnały fizyczne dostarczane do linii `INT0` oraz `INT2`.
* **Kluczowe zagadnienia inżynierskie:**
  * **Efektywność energetyczna i obliczeniowa:** Przeniesienie całej logiki przełączania stanów bezpośrednio do procedur obsługi przerwań (**ISR** - `ISR(INT0_vect)`, `ISR(INT2_vect)`). Pętla główna aplikacji `while(1)` pozostaje całkowicie pusta lub dedykowana do zadań tła, co pozwala na wprowadzenie procesora w tryb oszczędzania energii (Idle/Sleep).
  * **Konfiguracja warstwy sprzętowej:** Programowanie rejestrów sterujących przerwaniami `MCUCR` oraz `MCUCSR` w celu precyzyjnego wyzwalania zboczem narastającym (Rising Edge) i opadającym (Falling Edge). Globalne zarządzanie rejestrem statusowym przy użyciu makra `sei()`.
  * **Bezpieczeństwo pamięci i modyfikator `volatile`:** Praktyczne zastosowanie flagi `volatile` dla zmiennych modyfikowanych wewnątrz procedur ISR i odczytywanych w pętli głównej. Zapobiega to błędnej optymalizacji kompilatora `avr-gcc`, który mógłby zbuforować wartość zmiennej w rejestrach ogólnego przeznaczenia, ignorując jej asynchroniczną zmianę w pamięci SRAM.

### 5. Niskopoziomowy Sterownik Magistrali LCD HD44780 (Laboratorium 6)
Opracowanie w pełni autorskiego, niskopoziomowego sterownika alfanumerycznego wyświetlacza LCD opartego na jednoukładowym kontrolerze **HD44780**.
* **Kluczowe zagadnienia inżynierskie:**
  * **Optymalizacja zasobów GPIO (Tryb 4-bitowy):** Zredukowanie szerokości magistrali danych z 8 do 4 linii sygnałowych poprzez mapowanie transmisji na cztery starsze bity portu (`PORTA` [PA4-PA7]). Zaoszczędziło to 4 cenne linie GPIO mikrokontrolera na potrzeby innych peryferiów.
  * **Rygorystyczny reżim czasowy sterownika:** Implementacja precyzyjnych mikro-opóźnień wymaganych przez specyfikację HD44780, w tym procedury strobującej na linii `EN` (Enable) oraz wydłużonych czasów oczekiwania (rzędu milisekund) po instrukcjach czyszczenia ekranu (`Clear Display`).
  * **Złożona inicjalizacja programowa:** Implementacja sekwencji potrójnego resetu programowego (wymuszenie wartości `0x30` w określonych odstępach czasu przy linii wyboru instrukcji `RS = 0`), gwarantującej poprawną synchronizację kontrolera LCD po włączeniu zasilania, niezależnie od stanu początkowego.
  * **Zarządzanie pamięcią DDRAM:** Napisanie algorytmu pozycjonowania kursora uwzględniającego nieciągłość adresów pamięci RAM wyświetlacza (mapowanie fizycznych wierszy matrycy) wraz z funkcją automatycznego zawijania tekstu (Word Wrapping) do drugiego wiersza po przekroczeniu limitu znaków.

---

## Najważniejsze Kompetencje Inżynierskie Wykazane w Projekcie
1. **Programowanie Bare-Metal (No-OS):** Pełne zrozumienie działania systemów bez warstwy abstrakcji systemu operacyjnego. Bezpośrednia kontrola nad rejestrami sterującymi, stanami pinów oraz pamięcią.
2. **Architektura Zorientowana na Przerwania:** Zdolność do projektowania systemów czasu rzeczywistego, które reagują na bodźce zewnętrzne bez marnowania cykli procesora na ciągły pooling (odpytywanie stanów).
3. **Świadomość Ograniczeń Sprzętowych:** Umiejętność efektywnego gospodarowania pamięcią RAM/Flash, liniami wejścia/wyjścia oraz budżetem energetycznym mikrokontrolera.
4. **Praca ze Specyfikacją Techniczną (Datasheet):** Kodowanie rozwiązań w oparciu o analizę dokumentacji technicznych układów scalonych (ATmega32 oraz sterownika HD44780).
