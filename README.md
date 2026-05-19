# Tłumacz treści e-commerce — Militaria.pl

> **Teza:** Największe ryzyko w tłumaczeniu treści Militaria.pl nie jest językowe,
> tylko **kontekstowo-terminologiczne**. Generyczny translator pomyli „magazynek"
> z czasopismem, „kolbę" z tłokiem, a regulamin potraktuje jak opis produktu —
> i nikt tego nie wychwyci przy 9 językach i tysiącach SKU. Dlatego zbudowałem
> narzędzie wokół **dwóch ortogonalnych osi (typ treści × rynek)** + **glosariusza
> branżowego** + **warstwy dowodzenia jakości** — bo zadanie brzmi „udowodnij że
> lepsze niż generyk", a to wymaga metryki, nie opinii.

## Co to robi

Tłumaczy treści e-commerce PL → 9 języków (EN-US, EN-UK, DE, FR, UK, RO, CS, HU, FI)
**świadomie kontekstu**: inaczej opis produktu (perswazja), inaczej przycisk checkout
(konwencja UI rynku), inaczej regulamin (precyzja prawna, zero kreatywności).

**Trzy tryby pracy:**
- **Pojedynczy tekst** — tłumaczenie + porównanie ze zwykłym translatorem + ocena jakości
- **Tryb masowy (CSV)** — wgraj listę produktów, pobierz przetłumaczony CSV
- **Długi dokument** — regulamin/polityka .txt, auto-podział na sekcje i złożenie

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
| **Glosariusz filtrowany do tekstu, format imperatywny + negatywny** (`"łuska" = "Hülse", NIE "shell"`) | Wrzucenie 90 par do każdego promptu = szum, model ignoruje. Negatywny przykład działa na LLM lepiej. 10 *zweryfikowanych* terminów > 50 zmyślonych (błędny termin jest gorszy niż brak) |
| **Generyk = ten sam model, pusty prompt** | Kontrolowany eksperyment z jedną zmienną. Różnica = wartość warstwy kontekstowej, nie „lepszy silnik". Rozbraja zarzut „ustawione" |
| **Warstwa ewaluacji** (sędzia-LLM wg rubryki + back-translation) | „Wygląda lepiej" to opinia. Sędzia nie wie które tłumaczenie jest „nasze" (losowa kolejność = anti-bias). Back-translation dla FI/UK/HU/RO bo nikt w firmie nie zweryfikuje fińskiego gołym okiem |
| **Lokalny proxy, klucz w `.env`** | Zadanie zabrania backendu — trzymam się tego (zero stanu/bazy). Ale klucz w przeglądarce = rachunek na cudzej karcie. Proxy to *minimalna warstwa bezpieczeństwa*, nie backend aplikacji |
| **Confidence signaling** | Treść prawna / rynek restrykcyjny (DE/FR/UK) / język low-resource → flaga „wymaga weryfikacji człowieka". Nie sprzedaję pewności której nie mam |
| **Hardening** | retry+backoff (429/529), timeout, walidacja długości, błędy tłumaczone na język pracownika (nie surowy stack) |

## Jak budowałem

Vibe coding z Claude. Plan → niezależny audyt (architektura + perspektywa rekrutera
+ research istniejących rozwiązań OSS) → przeprojektowanie (macierz zamiast monolitów,
dodana warstwa ewaluacji) → implementacja moduł po module z testami logiki przed API.
Świadomie **nie sklonowałem** istniejących OSS (lingo.dev itd.) — operują na plikach
JSON, nie na typach treści e-commerce; kopia nie pokazałaby myślenia.

## Świadome granice (dalszy rozwój, nie braki)

- **Glosariusz** = proof-of-mechanism (10 terminów). Produkcja: budowany z realnego
  feedu produktów + walidacja native per rynek.
- **Upload .docx/.pdf** — pominięty świadomie: wymagałby zależności npm (złamanie
  filaru „zero deps"). .txt pokrywa rdzeń problemu (długość regulaminu > limit).
- **Limity** (CSV 25 wierszy, chunki dokumentu) — w produkcji kolejka zadań.
- **Brak pamięci tłumaczeń** — spójność między uruchomieniami zapewnia glosariusz;
  pełna spójność = translation memory (poza zakresem prototypu).

## Struktura

```
proxy.js              serwer lokalny (główny sposób uruchomienia)
api/                  warstwa serverless (wariant podglądowy, ta sama logika)
src/handlers.js       wspólna logika: wywołanie API, tłumaczenie, ewaluacja
src/prompts.js        macierz promptów — SERCE narzędzia
src/glossary.json     glosariusz militarny PL × 9 języków
src/evaluate.js       sędzia-LLM + back-translation
src/examples.json     kuratorowane przykłady (demo + benchmark)
public/               interfejs (vanilla, zero build)
```
