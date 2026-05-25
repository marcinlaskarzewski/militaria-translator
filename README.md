# Tłumacz treści e-commerce - Militaria.pl

> **Teza:** Przy 9 językach i tysiącach SKU różnice nie są w pojedynczych słowach (modele LLM są dziś dobre), tylko w **konwencji rynku**. Generyczny translator daje "Add to cart" gdzie UK wymaga "Add to Basket". Tłumaczy agresywne PL ADS dosłownie do DE, gdzie ustawa o broni karze taki ton. Myli "Waffenbesitzkarte" (do kupna broni) z "Waffenschein" (do noszenia). Tego pracownik nietechniczny PL nie wyłapie. Zbudowałem narzędzie wokół **macierzy typ treści × rynek**, **glosariusza wstrzykiwanego do promptu**, oraz **warstwy ewaluacji** (sędzia-LLM ocenia wg rubryki, anti-bias) - bo zadanie brzmi "udowodnij że lepsze", a to wymaga metryki, nie opinii.

## Realny side-by-side (testy live, 2026-05-22)

| Input PL | Generic | To narzędzie | Co decyduje |
|---|---|---|---|
| "Dodaj do koszyka" → EN-UK | Add to **cart** | Add to **Basket** | Konwencja UI rynku (UK ≠ US) |
| "Zabij konkurencję na strzelnicy!" → DE marketing | "**Schlag die Konkurrenz** auf dem Schießstand!" | "**Überzeugen Sie** auf dem Schießstand." | Waffengesetz - agresywna retoryka problematyczna prawnie |
| "Pozwolenie na broń" → DE prawne | **Waffenschein** (dokument do noszenia) | **Waffenbesitzkarte** (dokument do posiadania) | Precyzja terminologii prawno-broniowej |
| "Karabinek z magazynkiem na 30 śrucin" → DE | "...mit Magazin auf 30 **Schrotkugeln**" (śrut strzelniczy) | "...mit Magazin auf 30 **Diabolo-Kugeln**" (śruciny pneumatyczne) | Glosariusz branżowy |

Pełne wyniki testów: `tests/results/SMOKE-RESULTS-2026-05-22.md`.

## Co to robi

Tłumaczy treści e-commerce PL → 9 języków (EN-US, EN-UK, DE, FR, UK, RO, CS, HU, FI) **świadomie kontekstu**: inaczej opis produktu (perswazja), inaczej przycisk checkout (konwencja UI rynku), inaczej regulamin (precyzja prawna, zero kreatywności).

**Trzy tryby:**
- **Pojedynczy tekst** - tłumaczenie + porównanie z generykiem + ocena jakości
- **Tryb masowy (CSV)** - wgraj listę produktów, pobierz przetłumaczony CSV
- **Długi dokument** - regulamin/polityka .txt, auto-podział na sekcje i złożenie

## Jak uruchomić

```bash
cp .env.example .env          # wklej swój klucz Anthropic do .env
node proxy.js                 # wymaga Node 18+, ZERO zależności npm
```
Otwórz `http://localhost:3000`. Tyle. Bez `npm install`, bez build.

## Kluczowe decyzje (i dlaczego)

| Decyzja | Dlaczego |
|---|---|
| **Macierz `BASE + typ[11] + rynek[9] + glosariusz`**, nie 11 osobnych promptów | Typ treści i rynek to dwie *niezależne* osie (niemieckie prawo o broni dotyczy każdego typu treści). Macierz = brak duplikacji, spójność, jasne myślenie o problemie |
| **Glosariusz filtrowany do tekstu, format imperatywny + negatywny** (`"łuska" = "Hülse", NIE "shell"`) | Wrzucenie 90 par do każdego promptu = szum, model ignoruje. Negatywny przykład działa na LLM lepiej. 10 *zweryfikowanych* terminów > 50 zmyślonych |
| **Generyk = ten sam model, pusty prompt** | Kontrolowany eksperyment z jedną zmienną. Różnica = wartość warstwy kontekstowej, nie "lepszy silnik". Rozbraja zarzut "ustawione" |
| **Warstwa ewaluacji** (sędzia-LLM wg rubryki + back-translation) | "Wygląda lepiej" to opinia. Sędzia nie wie które tłumaczenie jest "nasze" (losowa kolejność = anti-bias). **Sędzia czasem bije nasze - to dowód że metryka nie jest ustawiona**. Back-translation dla FI/UK/HU/RO bo nikt w firmie nie zweryfikuje fińskiego gołym okiem |
| **Lokalny proxy, klucz w `.env`** | Zadanie zabrania backendu - trzymam się tego (zero stanu/bazy). Ale klucz w przeglądarce = rachunek na cudzej karcie. Proxy to *minimalna warstwa bezpieczeństwa*, nie backend aplikacji |
| **Confidence signaling** | Treść prawna / rynek restrykcyjny (DE/FR/UK) / język low-resource → flaga "wymaga weryfikacji człowieka". Nie sprzedaję pewności której nie mam |
| **Hardening** | retry+backoff (429/529), timeout 60s, walidacja długości, błędy tłumaczone na język pracownika (nie surowy stack) |

📋 **Pełny zapis decyzji** (alternatywy, co odrzucone i dlaczego, mapowanie na kryteria z PDF): **[`/dlaczego.html`](https://militaria-translator-sh.vercel.app/dlaczego.html)** - podstrona aplikacji.

## Proces budowy

9 commitów na GitHubie pokazuje drogę. Plan v1 (11 osobnych promptów) odrzuciłem po własnym audycie - dwie osie problemu (typ × rynek) były ortogonalne, monolity je sklejały. Sprawdziłem OSS (lingo.dev, Lokalise) - operują na plikach JSON, ślepe na typ treści e-commerce. Custom Claude + glosariusz branżowy + warstwa ewaluacji = jedyna droga która odpowiada na pytanie z PDF "udowodnij że lepsze".

## Świadome granice (dalszy rozwój, nie braki)

- **Glosariusz** = proof-of-mechanism (10 terminów zweryfikowane PL/EN/DE, eksperymentalne pozostałe języki). Produkcja: budowany z realnego feedu produktów + walidacja native per rynek.
- **Upload .docx/.pdf** - pominięty świadomie: wymagałby zależności npm (złamanie filaru "zero deps"). .txt pokrywa rdzeń problemu (długość regulaminu > limit).
- **Tryby CSV/dokument** - poza scope PDF, dodałem bo realny workflow Militarii to tysiące SKU + długie regulaminy. Limity (CSV 25 wierszy, chunki dokumentu) sygnalizują że produkcja = kolejka zadań.
- **Brak translation memory** - spójność między uruchomieniami zapewnia glosariusz; pełna spójność = TM (poza zakresem prototypu).
- **chrF/COMET** (klasyczne metryki MT) - świadomie nie zaimplementowane (wymagałyby `pip install` lub modeli, łamie "zero deps"). W produkcji: standardowy etap CI tłumaczeń.

## Struktura

```
proxy.js              serwer lokalny (główny sposób uruchomienia)
api/                  warstwa serverless (wariant podglądowy, ta sama logika)
src/handlers.js       wspólna logika: wywołanie API, tłumaczenie, ewaluacja
src/prompts.js        macierz promptów - SERCE narzędzia
src/glossary.json     glosariusz militarny PL × 9 języków
src/evaluate.js       sędzia-LLM + back-translation
src/examples.json     kuratorowane przykłady (demo + benchmark)
public/               interfejs (vanilla, zero build)
tests/results/        wyniki testów live z 2026-05-22 (dowody przewagi)
```
