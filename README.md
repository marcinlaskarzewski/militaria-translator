# Tłumacz treści e-commerce - Militaria.pl

> **Teza:** Przy 9 językach i tysiącach produktów różnice nie są w pojedynczych słowach (modele LLM są dziś dobre), tylko w **konwencji rynku**. Zwykły tłumacz daje "Add to cart" tam, gdzie UK używa "Add to Basket". Tłumaczy "pozwolenie na broń" jako "Waffenschein" (do noszenia) zamiast "Waffenbesitzkarte" (do kupna). Tłumaczy agresywne polskie ADS dosłownie na niemiecki, gdzie tamtejsza ustawa o broni (Waffengesetz) karze taki ton. Tego pracownik nietechniczny nie wyłapie. Zbudowałem narzędzie wokół **trzech filarów**: składania instrukcji z 4 klocków (typ treści × rynek × słownik), słownika branżowego wstrzykiwanego tylko gdy potrzebny, oraz systemu mierzenia jakości - bo zadanie brzmi "udowodnij że lepsze", a to wymaga liczby, nie opinii.

**LIVE:** [militaria-translator.vercel.app](https://militaria-translator.vercel.app) (4 dowody przewagi z testów 22.05 w hero).

## Co zbudowane

Tłumacz treści e-commerce PL → 9 języków (EN-US, EN-UK, DE, FR, UK, RO, CS, HU, FI) **świadomy kontekstu**: inaczej opis produktu (perswazja), inaczej przycisk checkout (skrócona konwencja UI rynku), inaczej regulamin (precyzja prawna, zero kreatywności).

**Trzy tryby pracy:** pojedynczy tekst (z porównaniem do zwykłego tłumacza + oceną), tryb masowy (wgraj CSV produktów, pobierz przetłumaczony), długi dokument (regulamin .txt, automatycznie dzielony na sekcje i składany).

## Jak uruchomić

```bash
cp .env.example .env          # wklej swój klucz Anthropic
node proxy.js                 # Node 18+, ZERO zależności npm
```
Otwórz `http://localhost:3000`. Tyle. Bez `npm install`, bez kompilacji.

## Kluczowe decyzje

| Decyzja | Dlaczego |
|---|---|
| **Składanie z klocków** (`BASE + typ[11] + rynek[9] + słownik`) zamiast 11 osobnych instrukcji | Typ treści i rynek to dwie niezależne sprawy. Składanie daje 99 kombinacji bez duplikacji i pozwala zmienić profil rynku w jednym miejscu |
| **Profile rynkowe oparte na researchu 5 sklepów per kraj** (`research/per-country/*.md`) | Konkrety zamiast "wiedzy modelu": UK 13× "Basket", US 414× "Cart", DE "In den Warenkorb" 184×, HU data `YYYY.MM.DD.` z kropką. Rekruter może zweryfikować źródła. 9 raportów w repo |
| **Słownik wstrzykiwany tylko gdy potrzebny + format negatywny** (`"łuska" = "Hülse", NIE "shell"`) | Wrzucenie 90 par do każdego promptu = szum, model gubi instrukcje. Mechanizm dopasowujący rozpoznaje polską fleksję. 10 zweryfikowanych terminów > 50 zmyślonych |
| **Zwykły tłumacz = ten sam model bez kontekstu** | Kontrolowany eksperyment z jedną zmienną: moja praca nad instrukcją. Gdyby po drugiej stronie był DeepL, różnica mogłaby wynikać z "lepszego silnika". Tak różnica jest czysto moja |
| **Sędzia + tłumaczenie wsteczne** | "Wygląda lepiej" to opinia. Sędzia ocenia oba tłumaczenia w losowej kolejności (nie wie które jest moje, 10× pod rząd nie potrafi zgadnąć). Sędzia czasem bije moje - to dowód że metryka nie jest naciągnięta. Tłumaczenie wsteczne dla FI/UK/HU/RO bo nikt w firmie nie sprawdzi fińskiego |
| **Lokalny serwer pośredniczący, klucz w `.env`** | Zadanie zabrania backendu - trzymam się. Bez bazy, bez stanu, bez logiki biznesowej. Klucz API w przeglądarce = rachunek na cudzej karcie. Pośrednik to cienka warstwa bezpieczeństwa, nie backend |
| **Sygnał "wymaga sprawdzenia"** dla typu Prawne / rynku z surowym prawem broni (DE/FR/UK) / rzadszego języka (FI/UK/HU/RO) | Narzędzie samo przyznaje granice. Nie sprzedaję pewności której nie mam |

## Dowód jakości

- **Smoke test** (`node tests/smoke.js`) → `PASS 20 FAIL 0`. Sprawdza 3 filary bez API: 99 unikalnych instrukcji (11 typów × 9 rynków), słownik bez fałszywych dopasowań na 19 typowych stringach UI ("Zamknij okno" NIE łapie "zamek"), dzielenie regulaminu po granicach paragrafów (§).
- **Smoke test LIVE z 22.05** (`tests/results/SMOKE-RESULTS-2026-05-22.md`) - 8 realnych scenariuszy z API: kontekstowe wygrało 3/4 wg sędziego (Basket, Überzeugen, Waffenbesitzkarte), 1/4 zwykłe (prawne/DE - naprawione w `prompts.js`).

## Struktura

```
proxy.js                serwer lokalny (główny sposób uruchomienia)
api/                    wariant serverless (podgląd Vercel, ta sama logika)
src/handlers.js         wspólna logika: API, tłumaczenie, ocena
src/prompts.js          składanie instrukcji - serce narzędzia
src/glossary.json       słownik militarny PL × 9 języków
src/evaluate.js         sędzia + tłumaczenie wsteczne
src/examples.json       gotowe przykłady (pomoc demo + benchmark)
public/                 interfejs (czysty JS, bez kompilacji)
research/per-country/   9 raportów konkurencji (źródło profili rynkowych)
tests/smoke.js          test 99 instrukcji + matchera + dzielenia
tests/results/          log testu LIVE z 22.05
```

## Świadome granice (czego NIE ma, dlaczego)

- **Słownik** = pokazanie mechanizmu (10 terminów). Produkcja: budowany z realnego katalogu + walidacja rodzima per rynek.
- **Obsługa .docx/.pdf** - wymagałaby dodatkowych bibliotek (złamanie zasady "bez zależności"). Tryb .txt pokrywa rdzeń problemu (regulamin > limit modelu).
- **Standardowe miary jakości (chrF, COMET)** - świadomie nie wdrożone. Wymagają wzorcowych tłumaczeń lub dodatkowych modeli. Sędzia + tłumaczenie wsteczne działają bez nich.
- **Pamięć tłumaczeń (translation memory)** - spójność między uruchomieniami zapewnia słownik. Pełna spójność = TM, poza zakresem prototypu.

## Proces budowy

13 commitów w git pokazują kolejne kroki. Plan v1 (11 dużych osobnych instrukcji, jedna per typ treści) odrzuciłem po własnym audycie - dwie osie problemu (typ × rynek) są niezależne, jedna duża instrukcja je sklejała i powtarzała słownik 9 razy. Sprawdziłem gotowe rozwiązania (DeepL, Lokalise, Crowdin) - operują na plikach i pojedynczych zdaniach, ślepe na typ treści e-commerce. Claude + składanie z klocków + słownik branżowy + sędzia jakości = jedyna droga która odpowiada na pytanie z PDF "udowodnij że lepsze".
