/**
 * evaluate.js - WARSTWA EWALUACJI JAKOŚCI
 *
 * DLACZEGO TO ISTNIEJE (najważniejsza decyzja produktowa):
 * Całe zadanie brzmi "udowodnij że jakość wyższa niż generyk". Pokazanie
 * dwóch tłumaczeń obok siebie (side-by-side) to DEMO, nie DOWÓD - bo
 * "wygląda lepiej" jest opinią. Narzędzie musi dawać METRYKĘ.
 *
 * Dwa niezależne mechanizmy, każdy odpowiada na inne pytanie:
 *
 *  1. PROMPT-AS-JUDGE - "o ile lepsze?" Trzeci, niezależny przebieg modelu
 *     ocenia OBA tłumaczenia wg rubryki (wierność / terminologia / ton /
 *     konwencja rynku). Sędzia NIE wie które jest "nasze" - dostaje A i B
 *     w losowej kolejności (anti-bias). Zwraca liczby, nie zdania.
 *
 *  2. BACK-TRANSLATION - "czy w ogóle mogę temu ufać?" Dla języków
 *     low-resource (FI/UK/HU/RO) nikt w firmie nie zweryfikuje wyniku
 *     gołym okiem. Tłumaczymy wynik Z POWROTEM na polski i sprawdzamy
 *     czy sens się zachował. To nie dowód poprawności, ale wykrywa
 *     katastrofy (zgubiony fragment, odwrócony sens) - i uzasadnia
 *     confidence flag w UI.
 *
 * Sędzia to OSOBNE wywołanie modelu z czystym kontekstem - nie ten sam
 * przebieg co tłumaczenie (model nie ocenia samego siebie w jednym łańcuchu).
 */

// ─────────────────────────────────────────────────────────────────────────────
// RUBRYKA - 4 osie oceny. Świadomie różne wagi per oś:
// terminologia waży najwięcej (to sedno przewagi militarnego glosariusza),
// "wierność" jest progowa (błąd faktyczny dyskwalifikuje niezależnie od reszty).
// ─────────────────────────────────────────────────────────────────────────────
const RUBRIC = `Oceniasz dwa tłumaczenia e-commerce (sklep z militariami) tego samego
polskiego tekstu źródłowego. NIE wiesz które wykonało jakie narzędzie - oceniaj wyłącznie jakość.

Oceń KAŻDE tłumaczenie (A i B) w 4 wymiarach, skala 1-5 (5 = najlepsze):

1. WIERNOŚĆ (próg krytyczny): czy przekazuje dokładnie sens oryginału, bez dodawania, gubienia i przekłamań liczb/parametrów. Błąd faktyczny = max 2 pkt na tej osi niezależnie od reszty.
2. TERMINOLOGIA (waga najwyższa): czy terminy branżowe (broń, amunicja, sprzęt) są fachowe, nie potoczne. "magazynek" jako "magazine=czasopismo" = błąd terminologiczny.
3. TON: czy rejestr pasuje do typu treści i rynku (formalność, perswazja vs precyzja).
4. KONWENCJA RYNKU: jednostki, format daty/waluty, naturalność dla native speakera (nie kalka z polskiego).

Zwróć WYŁĄCZNIE JSON, bez komentarza:
{"A":{"wiernosc":N,"terminologia":N,"ton":N,"konwencja":N},"B":{"wiernosc":N,"terminologia":N,"ton":N,"konwencja":N},"werdykt":"A"|"B"|"remis","uzasadnienie":"jedno zdanie po polsku - najważniejsza różnica"}`;

// Wagi do wyniku zbiorczego. Terminologia 2x (sedno przewagi), wierność 1.5x (próg).
const WEIGHTS = { wiernosc: 1.5, terminologia: 2, ton: 1, konwencja: 1 };

function weightedScore(scores) {
  let sum = 0, wsum = 0;
  for (const k of Object.keys(WEIGHTS)) {
    if (typeof scores[k] === 'number') { sum += scores[k] * WEIGHTS[k]; wsum += WEIGHTS[k]; }
  }
  return wsum ? +(sum / wsum).toFixed(2) : null;
}

/**
 * Buduje wiadomości dla przebiegu "sędziego".
 * callModel: async ({system, user}) => string  - wstrzykiwane z proxy
 *            (evaluate.js nie zna API, jest provider-agnostic)
 * Kolejność A/B losowana - sędzia nie może faworyzować "drugiego" systematycznie.
 */
async function judge({ callModel, source, contextual, generic, lang, contentTypeLabel }) {
  const flip = Math.random() < 0.5;
  const A = flip ? generic : contextual;
  const B = flip ? contextual : generic;

  const user = `TEKST ŹRÓDŁOWY (polski):
"""${source}"""

TYP TREŚCI: ${contentTypeLabel}
JĘZYK DOCELOWY: ${lang}

TŁUMACZENIE A:
"""${A}"""

TŁUMACZENIE B:
"""${B}"""`;

  let raw;
  try {
    raw = await callModel({ system: RUBRIC, user, temperature: 0 });
  } catch (e) {
    return { ok: false, error: `Sędzia niedostępny: ${e.message}` };
  }

  const parsed = safeParseJson(raw);
  if (!parsed || !parsed.A || !parsed.B) {
    return { ok: false, error: 'Sędzia zwrócił nieparsowalny wynik', raw };
  }

  // Odmapuj losowanie z powrotem na contextual/generic
  const contextualScores = flip ? parsed.B : parsed.A;
  const genericScores = flip ? parsed.A : parsed.B;
  const cScore = weightedScore(contextualScores);
  const gScore = weightedScore(genericScores);

  let verdict = 'remis';
  if (cScore != null && gScore != null) {
    if (cScore > gScore + 0.15) verdict = 'kontekstowe';
    else if (gScore > cScore + 0.15) verdict = 'generyczne';
  }

  return {
    ok: true,
    contextual: { scores: contextualScores, weighted: cScore },
    generic: { scores: genericScores, weighted: gScore },
    delta: cScore != null && gScore != null ? +(cScore - gScore).toFixed(2) : null,
    verdict,
    rationale: parsed.uzasadnienie || ''
  };
}

/**
 * Back-translation dla języków low-resource.
 * Tłumaczy wynik Z POWROTEM na polski (czysty prompt, bez glosariusza),
 * następnie model ocenia ZGODNOŚĆ SENSU z oryginałem (1-5).
 * Niski wynik = sygnał "to tłumaczenie wymaga weryfikacji native speakera".
 */
async function backTranslate({ callModel, source, translation, lang }) {
  let backPl;
  try {
    backPl = await callModel({
      system: `Translate the following ${lang} text to Polish. Output only the translation, nothing else.`,
      user: translation,
      temperature: 0
    });
  } catch (e) {
    return { ok: false, error: `Back-translation niedostępna: ${e.message}` };
  }

  let raw;
  try {
    raw = await callModel({
      system: `Porównujesz dwa polskie teksty: ORYGINAŁ i TEKST PO PODWÓJNYM TŁUMACZENIU (PL->${lang}->PL).
Oceń w skali 1-5 czy SENS się zachował (5 = identyczny sens, 1 = sens zgubiony/odwrócony).
Zwróć WYŁĄCZNIE JSON: {"zgodnosc":N,"ryzyko":"niskie"|"srednie"|"wysokie","uwaga":"co się zgubiło, jedno zdanie PL lub pusty"}`,
      user: `ORYGINAŁ:\n"""${source}"""\n\nPO PODWÓJNYM TŁUMACZENIU:\n"""${backPl}"""`,
      temperature: 0
    });
  } catch (e) {
    return { ok: false, error: `Ocena back-translation niedostępna: ${e.message}`, backPl };
  }

  const parsed = safeParseJson(raw);
  if (!parsed || typeof parsed.zgodnosc !== 'number') {
    return { ok: false, error: 'Nieparsowalny wynik back-translation', raw, backPl };
  }
  return {
    ok: true,
    backPl,
    consistency: parsed.zgodnosc,
    risk: parsed.ryzyko || (parsed.zgodnosc >= 4 ? 'niskie' : parsed.zgodnosc >= 3 ? 'srednie' : 'wysokie'),
    note: parsed.uwaga || ''
  };
}

// Model bywa gadatliwy mimo instrukcji - wyłuskaj pierwszy obiekt JSON.
function safeParseJson(s) {
  if (!s) return null;
  try { return JSON.parse(s); } catch (_) {}
  const m = s.match(/\{[\s\S]*\}/);
  if (m) { try { return JSON.parse(m[0]); } catch (_) {} }
  return null;
}

module.exports = { judge, backTranslate, RUBRIC, WEIGHTS };
