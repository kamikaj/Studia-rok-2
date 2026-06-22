# Podstawy Grafiki Komputerowej
## Multimedialne Projekty Graficzne – 2D & 3D

**Autor:** Kamil Sitarski  

---

## 📂 Zawartość Repozytorium

Repozytorium zawiera dwa niezależne zadania projektowe realizowane w ramach przedmiotu Grafika Komputerowa. Projekty demonstrują praktyczne zastosowanie zaawansowanych technik edycji grafiki rastrowej (2D) oraz modelowania, cieniowania i animacji w środowisku trójwymiarowym (3D).

---

## 🎨 1. Projekt 2D: Architektura Obrazu – Rekonstrukcja Bramy Krakowskiej
Kompleksowe studium edycji grafiki rastrowej, skupione na zaawansowanym retuszu nieniszczącym, korekcie perspektywy historycznego obiektu, cyfrowej koloryzacji oraz fotorealistycznym montażu i integracji postaci.

*   **Narzędzie:** GIMP
*   **Główne techniki:** Retusz („Łatka”), separacja warstwowa, kluczowanie kanałem alfa, korekcja perspektywy, malowanie cyfrowe.
*   👉 **[Przejdź do pełnego opisu i galerii projektu 2D](./Projekt_2D_GIMP/README.md)**

---

## ⚔️ 2. Projekt 3D: Architektura Nocy – Kreacja, Shading i Animacja
Projekt syntezy środowiska trójwymiarowego, zaawansowanego shading'u PBR oraz reżyserii dynamicznej sekwencji filmowej. Praca kładzie silny nacisk na budowanie kinowego klimatu oraz agresywną optymalizację zużycia VRAM i czasu kalkulacji silnika Cycles.

*   **Narzędzie:** Blender (Render Engine: Cycles)
*   **Główne techniki:** PBR Workflow (Shader Graph), animacja klatek kluczowych (Keyframing), manipulacja oświetleniem, optymalizacja geometrii (Frustum culling).
*   👉 **[Przejdź do pełnego opisu i galerii projektu 3D](./Projekt_3D_Blender/README.md)**

---

## 🏗 Struktura Katalogów

Repozytorium zostało ustrukturyzowane zgodnie z rygorystycznymi standardami projektowymi:

```text
.
├── Projekt_2D_GIMP/             # Katalog projektu grafiki 2D
│   ├── assets/                  # Zasoby: zdjęcia oryginalne, pliki .xcf, rendery etapowe
│   ├── docs/                    # Dokumentacja opisująca przebieg prac
│   └── README.md                # Szczegółowa dokumentacja projektu 2D
│
├── Projekt_3D_Blender/          # Katalog projektu grafiki 3D
│   ├── assets/                  # Zasoby: pliki .blend, tekstury, rendery .png, animacja .gif
│   ├── docs/                    # Dokumentacja opisująca przebieg prac
│   └── README.md                # Szczegółowa dokumentacja projektu 3D
│
└── README.md                    # Niniejszy plik główny (landing page)
