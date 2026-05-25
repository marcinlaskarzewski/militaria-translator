# militaria-translator

Tłumacz treści e-commerce dla Militaria.pl. PL → 9 języków (EN-US, EN-UK, DE, FR, UK, RO, CS, HU, FI).
Świadomy typu treści (opis / regulamin / UI / marketing) i konwencji rynku (waluta, formalność, terminologia, prawo broni).

LIVE: https://militaria-translator.vercel.app

## Problem

Generic translator (DeepL, Google) tłumaczy słowa, nie konwencje. Kilka realnych pułapek dla Militaria.pl:

- "Add to cart" - UK używa "Add to Basket" (Amazon UK, John Lewis). Inny rynek, inny standard UI.
- "pozwolenie na broń" → "Waffenschein" (do noszenia broni publicznie). Poprawnie: "Waffenbesitzkarte" (do posiadania). Dwa różne dokumenty prawne.
- Marketing DE "Zabij konkurencję!" przetłumaczony dosłownie ("Schlag die Konkurrenz!") jest problematyczny pod Waffengesetz (ustawa o broni). Stonowane "Überzeugen Sie" trzyma intencję bez ryzyka.

Przy 9 językach × tysiącach SKU pracownik bez kompetencji językowo-prawnych takich różnic nie wyłapie.

## Uruchomienie

```bash
cp .env.example .env          # wklej ANTHROPIC_API_KEY
node proxy.js                 # Node 18+, brak zależności npm
# otwórz http://localhost:3000
```

Wariant alternatywny (preview): `vercel dev` - ta sama logika w `api/` (serverless).

## Architektura

System prompt składany w runtime z 4 komponentów:

```
BASE  +  TYPE_MODULE[11]  +  MARKET_PROFILE[9]  +  GLOSSARY(filtered)
```

Daje 99 unikalnych konfiguracji (11 typów treści × 9 rynków) bez duplikacji.
Glosariusz wstrzykiwany do promptu tylko dla terminów obecnych w wejściu (matcher z obsługą fleksji PL).

| Komponent | Plik | Zawartość |
|---|---|---|
| BASE | `src/prompts.js` | Reguły niepodważalne: zachowanie HTML, brak streszczeń, brak preambuły |
| TYPE_MODULE | `src/prompts.js` `TYPE_MODULES` | 11 typów: produktowe (długie/krótkie), SEO, poradniki, marketingowe, systemowe/UI, informacyjne, prawne, infografiki, ogólne, custom |
| MARKET_PROFILE | `src/prompts.js` `MARKET_PROFILES` | 9 rynków. Każdy oparty na researchu 5 sklepów konkurencyjnych (`research/per-country/*.md`) |
| GLOSSARY | `src/glossary.json` | 10 terminów PL × 9 języków + `keepAsIs` (akronimy NATO/MOLLE/AR-15) |
| Sędzia / back-translation | `src/evaluate.js` | Ocena obu tłumaczeń przez niezależny przebieg, kolejność losowana |
| Wspólna logika | `src/handlers.js` | Wywołanie API z retry/backoff, kompozycja odpowiedzi |
| Serwer lokalny | `proxy.js` | HTTP server, statyka + endpointy API, klucz w `.env` |
| Wariant serverless | `api/{translate,evaluate,meta}.js` | Vercel functions, ta sama `handlers.js` |

## API

Trzy endpointy. Identyczna sygnatura w `proxy.js` i `api/`.

### `GET /api/meta`
Metadane do dropdownów UI: lista typów (z `glossaryDefault`), lista języków (z `lowResource`), licznik terminów słownika.

### `POST /api/translate`
```json
{
  "text": "...",
  "contentType": "produktowe_dlugie",
  "lang": "de",
  "useGlossary": null,        // null = decyduje typ; true/false = override
  "customInstruction": "",    // tylko dla contentType=wlasny_prompt
  "compare": true             // tłumaczenie generyczne side-by-side
}
```
Response:
```json
{
  "contextual": "...",
  "generic": "...",           // null jeśli compare=false
  "matchedTerms": ["łuska", "magazynek"],
  "keptTerms": ["MOLLE"],
  "needsReview": true,
  "reviewReason": "typ:prawne + rynek:de",
  "lowResource": false,
  "uiCharBudget": null,       // dla typu systemowe_ui: {length, target:30, hardMax:45, status}
  "appliedContext": { "contentTypeLabel": "...", "marketLabel": "...", "glossaryCount": 2, "keepAsIsCount": 1, "reviewFlag": true }
}
```

### `POST /api/evaluate`
Sędzia LLM ocenia oba tłumaczenia wg rubryki (terminologia, formalność, naturalność) + back-translation dla języków oznaczonych `lowResource:true` (FI/UK/HU/RO). Kolejność tłumaczeń randomizowana - model nie wie które jest „kontekstowe".

## Limity i konfiguracja

| Parametr | Wartość | Plik |
|---|---|---|
| Model | `claude-sonnet-4-6` | `src/handlers.js` |
| Temperatura | `0.3` | `src/handlers.js` |
| Max tokens (response) | `4096` | `src/handlers.js` |
| Max długość wejścia | `12 000` znaków | `src/handlers.js:MAX_INPUT_CHARS` |
| Timeout pojedynczego żądania | `60s` | `src/handlers.js` |
| Retry / backoff | `2 próby (1.5s → 3s)` na 429/529/5xx | `src/handlers.js` |
| Tryb masowy CSV | `25 wierszy` (prototyp; produkcja = kolejka) | `public/app.js:BATCH_LIMIT` |
| Chunking dokumentu | `8000 znaków/chunk` na granicach § lub paragrafu | `public/app.js:CHUNK_MAX` |

## Testy

```bash
node tests/smoke.js
```

Output: stdout + `tests/results.txt`. Trzy filary, bez wywoływania API:

1. **Macierz promptów** - 99 unikalnych kombinacji, każda zawiera fragment swojego `TYPE_MODULE` i `MARKET_PROFILE`.
2. **Matcher glosariusza** - fleksja PL działa (`Wymieniłem kolbę` → `kolba`), brak false-positive na 19 typowych stringach UI (`Zamknij okno` NIE łapie `zamek`, `Kolejka` NIE łapie `kolba`).
3. **Chunking** - dokument 30 paragrafów i regulamin z `§` dzielone bez przekroczenia limitu, granice na końcach sekcji.

Wynik: `PASS 20 / FAIL 0`.

`tests/results/SMOKE-RESULTS-2026-05-22.md` zawiera dodatkowo log testu LIVE z 8 scenariuszy (z faktycznym API): sędzia ocenił kontekstowe wygrane w 3/4 (Basket UK, Überzeugen DE, Waffenbesitzkarte DE), 1 strata na prawne/DE - naprawione w `src/prompts.js:100-108`.

## Struktura

```
proxy.js                serwer lokalny (zalecany sposób uruchomienia)
api/                    warianty serverless (Vercel), identyczna logika
src/
  handlers.js           wywołanie Claude API, retry, kompozycja response
  prompts.js            BASE + TYPE_MODULES + MARKET_PROFILES + buildSystemPrompt
  glossary.json         10 terminów PL × 9 języków + keepAsIs
  evaluate.js           sędzia LLM + back-translation
  examples.json         przykłady demo per typ treści
public/                 frontend (vanilla JS, brak kompilacji)
research/per-country/   9 raportów konkurencji (źródło MARKET_PROFILES)
tests/
  smoke.js              testy 3 filarów bez API
  results/              log testu LIVE z 22.05
.env.example            template (klucz placeholder)
vercel.json             config serverless
```

## Założenia i świadomie pominięte

- **Bez backendu w sensie aplikacyjnym** (zgodnie z briefem): brak bazy, brak sesji, brak stanu. `proxy.js` to wyłącznie warstwa bezpieczeństwa dla klucza API (klucz w przeglądarce = wyciek). Vercel functions mają tę samą charakterystykę.
- **Bez zależności npm**. Wszystko na stdlib Node. Konsekwencja: brak obsługi .docx/.pdf (wymagałaby `mammoth` / `pdf-parse`). Tryb `.txt` z chunkingiem pokrywa rdzeń problemu (regulamin > limit kontekstu).
- **Bez chrF / COMET / BLEU**. Wymagają referencji ludzkich lub modeli scoringowych. Sędzia LLM + back-translation działają bez nich, są tańsze.
- **Bez translation memory**. Spójność terminologii w obrębie pojedynczego żądania zapewnia `GLOSSARY`; spójność między żądaniami = TM, poza zakresem prototypu.
- **Glosariusz: 10 terminów × 9 języków** (zweryfikowane PL/EN/DE, eksperymentalne pozostałe). W produkcji: budowany z realnego katalogu Militaria + walidacja native per rynek.

## Proces budowy

15 commitów na master:
1. Szkielet projektu, zero deps
2. Macierz promptów (BASE + 11 typów + 9 rynków + glosariusz)
3. Glosariusz militarny
4. Sędzia LLM + back-translation
5. `handlers.js` wspólny + `proxy.js` z retry/backoff
6. Frontend vanilla (jeden ekran, 3 tryby)
7. Przykłady demo per typ
8. Wariant serverless (`api/`)
9. README v1
10. (po audycie 22.05) naprawa promptu prawne/DE + smoke test 8 scenariuszy LIVE
11. Słownik militarny zawsze aktywny w UI (podgląd terminów pod typem)
12. Profile rynkowe oparte na researchu 5 sklepów per rynek (9 raportów)
13. Smoke test 99 promptów + matcher + chunking (20/20 PASS)
14. Hero index.html bez marketingowego copy
15. README v2 (techniczny)

Plan v1 (11 osobnych dużych instrukcji per typ treści) odrzucony po własnym audycie: typ × rynek to dwie niezależne osie, monolityczne instrukcje je sklejały i wymagały duplikacji glosariusza 9 razy. Sprawdzone alternatywy (DeepL, Lokalise, Crowdin) operują na plikach i pojedynczych zdaniach - ślepe na typ treści e-commerce i ryzyko prawne per rynek.
