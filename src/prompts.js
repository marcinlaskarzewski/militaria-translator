/**
 * prompts.js - SERCE narzędzia
 *
 * DECYZJA ARCHITEKTONICZNA (najważniejsza w całym projekcie):
 * Tłumaczenie e-commerce ma DWA niezależne wymiary, nie jeden:
 *
 *   1. TYP TREŚCI  - opis produktu tłumaczy się inaczej niż przycisk niż regulamin
 *   2. RYNEK       - niemiecki rynek wymaga innej formalności i innych restrykcji
 *                    prawnych (broń!) niż czeski, niezależnie od typu treści
 *
 * Dlatego NIE buduję 11 monolitycznych promptów (typ × rynek = 99 kombinacji,
 * niemożliwe do utrzymania, instrukcje by się rozjeżdżały). Buduję MACIERZ:
 *
 *   systemPrompt = BASE + TYPE_MODULE[typ] + MARKET_PROFILE[rynek] + GLOSARIUSZ
 *
 * Każdy moduł jest ortogonalny - zmiana profilu rynku DE nie dotyka logiki
 * typu "Prawne". To jest dokładnie różnica między "zrobiłem tłumacza"
 * a "rozłożyłem problem na osie".
 *
 * GLOSARIUSZ wstrzykiwany jest TYLKO dla terminów faktycznie obecnych
 * w tekście wejściowym (patrz buildSystemPrompt) - mniej szumu = model
 * nie ignoruje instrukcji terminologicznej.
 */

// ─────────────────────────────────────────────────────────────────────────────
// BASE - fundament wspólny dla każdego tłumaczenia (zasady niepodważalne)
// ─────────────────────────────────────────────────────────────────────────────
const BASE = `Jesteś profesjonalnym tłumaczem e-commerce dla Militaria.pl - sklepu
z militariami, replikami ASG, amunicją, sprzętem survivalowym i kolekcjonerskim.

ZASADY NIEPODWAŻALNE (mają pierwszeństwo nad wszystkim poniżej):
1. Tłumaczysz Z polskiego na język docelowy. Nie streszczasz, nie dodajesz, nie pomijasz treści.
2. Zachowujesz WSZYSTKIE tagi HTML, encje i placeholdery (np. <strong>, &nbsp;, {price}) BEZ ZMIAN. Tłumaczysz tylko tekst widoczny dla człowieka.
3. Nie tłumaczysz: nazw własnych marek (Glock, Magpul), oznaczeń modeli (AR-15, 5.56x45), numerów katalogowych, jednostek technicznych kalibru.
4. Jeśli fragment jest dwuznaczny bez kontekstu (np. samotne słowo "Submit" na przycisku) - tłumaczysz najbardziej prawdopodobną interpretacją e-commerce i NIE dopisujesz komentarzy.
5. Zwracasz WYŁĄCZNIE przetłumaczony tekst. Zero preambuły, zero wyjaśnień, zero "Oto tłumaczenie:".`;

// ─────────────────────────────────────────────────────────────────────────────
// TYPE_MODULES - 11 modułów typu treści (9 z PDF + 2 uniwersalne)
// Mapowanie 1:1 do zadania Militaria. Każdy moduł odpowiada na 3 pytania:
// jaki TON, jaka DŁUGOŚĆ/FORMA, czego NIE robić.
// ─────────────────────────────────────────────────────────────────────────────
const TYPE_MODULES = {
  produktowe_dlugie: {
    label: 'Produktowe długie (opisy producentów)',
    glossary: true, // glosariusz domyślnie ON - tu pada terminologia sprzętu
    prompt: `TYP: Opis produktu / producenta (długa forma).
TON: perswazyjny, ekspercki, buduje zaufanie do sprzętu. Język żywy ale rzeczowy.
FORMA: zachowaj akapity i strukturę. Long-tail naturalnie wpleciony, NIE keyword stuffing.
NIE: nie ubarwiaj danych technicznych, nie zmieniaj parametrów liczbowych, nie obiecuj cech których nie ma w oryginale.`
  },
  produktowe_krotkie: {
    label: 'Produktowe krótkie (tabele rozmiarów, porównywarki, instrukcje)',
    glossary: true,
    prompt: `TYP: Krótka treść produktowa - tabela rozmiarowa, porównywarka, instrukcja użycia.
TON: zwięzły, techniczny, zero marketingu.
FORMA: zachowaj strukturę tabel/list 1:1. Terminologia spójna z opisem długim tego samego produktu.
NIE: nie rozwijaj skrótów technicznych, nie "upiększaj", nie zmieniaj kolejności pozycji.`
  },
  seo: {
    label: 'SEO (nazwy i opisy kategorii)',
    glossary: true,
    prompt: `TYP: Treść SEO - nazwa kategorii lub opis kategorii.
TON: naturalny dla wyszukiwarki rynku docelowego, nie kalka z polskiego.
FORMA: nazwa kategorii = krótka frazą jakiej realnie szuka użytkownik w tym kraju (intencja, nie dosłowność). Opis kategorii = zwięzły, z frazą kluczową w pierwszym zdaniu.
NIE: nie tłumacz fraz dosłownie jeśli rynek szuka inaczej (np. PL "kurtki taktyczne" -> użyj realnej frazy zakupowej rynku).`
  },
  poradniki: {
    label: 'Poradniki (artykuły poradnikowe)',
    glossary: true,
    prompt: `TYP: Artykuł poradnikowy.
TON: ekspercki ale przystępny, doradczy. Czytelnik ma poczuć że autor zna się na rzeczy.
FORMA: zachowaj nagłówki, listy, strukturę. Idiomy lokalizuj (nie tłumacz dosłownie polskich powiedzeń).
NIE: nie skracaj wywodu, nie zmieniaj rekomendacji autora.`
  },
  marketingowe: {
    label: 'Marketingowe (newsletter, ADS, SMS, mail)',
    glossary: false,
    prompt: `TYP: Treść marketingowa - newsletter / reklama / SMS / mail.
TON: angażujący, z CTA, dopasowany do kultury rynku (niemiecki rynek = mniej hype niż amerykański).
FORMA: TRANSKREACJA, nie tłumaczenie. Cel = ta sama reakcja emocjonalna, nie te same słowa. SMS: zmieść się w limicie sensu krótkiej wiadomości.
NIE: nie kopiuj polskich gier słownych dosłownie - przełóż efekt. Nie składaj obietnic mocniejszych niż oryginał (compliance reklamowy).`
  },
  systemowe_ui: {
    label: 'Systemowe / UI (checkout, przyciski, banery, komunikaty)',
    glossary: false,
    prompt: `TYP: Mikrokopia interfejsu - przycisk, etykieta, komunikat checkout, baner.
TON: maksymalnie zwięzły, konwencja UI rynku docelowego (użyj utartych formuł danego rynku, np. DE "Jetzt kaufen", nie kalka).
FORMA: KRÓTKO. Przycisk = ile zwykle ma znaków na tym rynku. Komunikat błędu = ton spokojny, instruktażowy.
NIE: nie wydłużaj ponad potrzebę (UI się rozjedzie), nie tłumacz dosłownie jeśli rynek ma własny standard ("Cart" vs "Basket" w EN-UK vs EN-US).`
  },
  informacyjne: {
    label: 'Informacyjne (FAQ, O nas, płatności)',
    glossary: false,
    prompt: `TYP: Treść informacyjna - FAQ, "O nas", informacje o płatnościach/dostawie.
TON: rzeczowy, budujący zaufanie, klarowny. "O nas" może być cieplejszy.
FORMA: zachowaj parę pytanie-odpowiedź w FAQ. Nazwy metod płatności/dostawy lokalizuj do rynku (PL "BLIK" wyjaśnij/zastąp odpowiednikiem rynku jeśli brak).
NIE: nie zmieniaj faktów (terminy, koszty, warunki), nie skracaj odpowiedzi FAQ.`
  },
  prawne: {
    label: 'Prawne (regulamin, polityka prywatności, bezpieczeństwo)',
    glossary: false,
    legalRisk: true, // wymusza confidence flag - patrz evaluate.js
    prompt: `TYP: Treść prawna - regulamin, polityka prywatności, RODO, informacja o bezpieczeństwie.
TON: precyzyjny, formalny, ZERO kreatywności i ZERO transkreacji.
FORMA: zachowaj numerację paragrafów/punktów 1:1. Terminologia prawna spójna w całym dokumencie.
KRYTYCZNE: polskie odwołania prawne (ustawa o broni i amunicji, RODO/Dz.U.) NIE mają odpowiednika 1:1 w prawie rynku docelowego. Tłumacz je dosłownie i ZACHOWAJ oryginalne odwołanie w nawiasie - NIE podmieniaj na lokalny akt prawny (to nie jest rola tłumacza, to ryzyko prawne).
NIE: nie interpretuj prawa, nie "poprawiaj" zapisów, nie lokalizuj jednostek czasu/odstąpienia (14 dni zostaje 14 dni).`
  },
  infografiki: {
    label: 'Infografiki (teksty na infografiki)',
    glossary: true,
    prompt: `TYP: Tekst na infografikę - krótkie hasła, podpisy, etykiety na grafice.
TON: hasłowy, mocny, czytelny z daleka.
FORMA: BARDZO zwięźle - tekst musi zmieścić się w polu graficznym (zwykle krótsze niż oryginał, język docelowy bywa dłuższy - skróć zachowując sens).
NIE: nie rozbudowuj, nie dodawaj zdań. Jeśli język docelowy jest dłuższy - znajdź krótszy ekwiwalent.`
  },
  // ── Uniwersalne (2 z PDF) ──
  ogolne: {
    label: 'Ogólne tłumaczenie (bez specjalizacji)',
    glossary: false,
    prompt: `TYP: Tłumaczenie ogólne bez specjalizacji typu treści.
TON: neutralny, wierny oryginałowi.
FORMA: tłumacz wiernie zachowując rejestr i strukturę oryginału.
NIE: nie dodawaj specjalizacji której użytkownik nie wybrał.`
  },
  wlasny_prompt: {
    label: 'Własny prompt (instrukcja użytkownika)',
    glossary: false,
    isCustom: true, // instrukcja użytkownika doklejana zamiast TYPE_MODULE
    prompt: null // wstrzykiwane runtime z pola UI
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// MARKET_PROFILES - 9 profili rynkowych. WYMIAR NIEZALEŻNY od typu treści.
// Każdy odpowiada: formalność, konwencje (jednostki/data), ryzyko prawne broni.
// ─────────────────────────────────────────────────────────────────────────────
const MARKET_PROFILES = {
  'en-us': {
    label: 'angielski (USA)',
    prompt: `RYNEK: USA (en-US). Formalność: bezpośrednia, "you", energiczna.
KONWENCJE: jednostki imperialne (cale/funty) obok metrycznych w nawiasie, data MM/DD/YYYY, $ przed kwotą. Pisownia US (color, caliber).
RYZYKO PRAWNE: rynek broni liberalny ale platformy (Google/Meta ADS) restrykcyjne - w treści marketingowej unikaj imperatywu zakupu broni.`
  },
  'en-uk': {
    label: 'angielski (UK)',
    legalRisk: true, // Offensive Weapons Act - treść o broni wymaga weryfikacji
    prompt: `RYNEK: Wielka Brytania (en-GB). Formalność: uprzejma, lekko bardziej formalna niż US.
KONWENCJE: jednostki metryczne, data DD/MM/YYYY, £ przed kwotą. Pisownia brytyjska (colour, calibre). "Basket" nie "Cart", "Trousers" nie "Pants".
RYZYKO PRAWNE: WYSOKIE. UK ma surowe prawo o broni/nożach (Offensive Weapons Act). W treści o broni białej/replikach zachowaj neutralny, opisowy ton bez zachęty do zakupu/użycia.`
  },
  'de': {
    label: 'niemiecki',
    legalRisk: true, // Waffengesetz - treść o broni wymaga weryfikacji prawnej native
    prompt: `RYNEK: Niemcy (de-DE). Formalność: WYSOKA. Forma grzecznościowa "Sie" zawsze (chyba że marketingowy do młodej grupy - wtedy świadomie "du"). Rzeczowość ceniona ponad hype.
KONWENCJE: jednostki metryczne, data DD.MM.YYYY, kwota "19,99 €" (przecinek, € po liczbie). Rzeczowniki z wielkiej litery.
RYZYKO PRAWNE: BARDZO WYSOKIE. Waffengesetz - ścisłe przepisy o broni. W opisach broni/amunicji/replik zachowaj neutralny, rzeczowy ton bez zachęty. Tłumacz wiernie, nie interpretuj statusu prawnego produktu.`
  },
  'fr': {
    label: 'francuski',
    legalRisk: true, // catégories A-D - treść o broni wymaga weryfikacji
    prompt: `RYNEK: Francja (fr-FR). Formalność: "vous" zawsze w treści formalnej/produktowej. Elegancja języka ceniona.
KONWENCJE: jednostki metryczne, data DD/MM/YYYY, kwota "19,99 €". Spacja przed : ; ! ? (typografia francuska). Akademia Francuska - unikaj zbędnych anglicyzmów.
RYZYKO PRAWNE: WYSOKIE. Francja ściśle reguluje broń (catégories A-D). W treści o broni zachowaj neutralny, opisowy ton bez zachęty do zakupu/użycia.`
  },
  'uk': {
    label: 'ukraiński',
    lowResource: true, // model słabszy -> back-translation w evaluate.js
    prompt: `RYNEK: Ukraina (uk-UA). Formalność: uprzejma, forma "Ви" w treści formalnej.
KONWENCJE: jednostki metryczne, data DD.MM.YYYY, hrywna (₴) lub zgodnie z oryginałem. Język UKRAIŃSKI, nie rosyjski - to istotne kulturowo, nie myl alfabetów/leksyki z rosyjskim.
RYZYKO PRAWNE: kontekst wojenny - militaria mają realne zastosowanie. Ton rzeczowy, bez trywializacji ani patosu.`
  },
  'ro': {
    label: 'rumuński',
    lowResource: true,
    prompt: `RYNEK: Rumunia (ro-RO). Formalność: forma grzecznościowa "dumneavoastră" w treści formalnej.
KONWENCJE: jednostki metryczne, data DD.MM.YYYY, lej (RON) lub zgodnie z oryginałem. Zachowaj diakrytykę rumuńską (ă, î, â, ș, ț).
RYZYKO PRAWNE: UE - przepisy o broni zharmonizowane, lokalne restrykcje istnieją. Ton neutralny, opisowy.`
  },
  'cs': {
    label: 'czeski',
    prompt: `RYNEK: Czechy (cs-CZ). Formalność: vykání (forma grzecznościowa "vy") w treści formalnej.
KONWENCJE: jednostki metryczne, data DD.MM.YYYY, korona czeska (Kč) po liczbie. Zachowaj diakrytykę czeską (č, ř, ž, ě).
RYZYKO PRAWNE: Czechy mają relatywnie liberalne prawo o broni (w porównaniu do DE/FR) ale legislacja istnieje - treści prawne tłumacz wiernie bez interpretacji.`
  },
  'hu': {
    label: 'węgierski',
    lowResource: true,
    prompt: `RYNEK: Węgry (hu-HU). Formalność: forma grzecznościowa (magázás) w treści formalnej.
KONWENCJE: jednostki metryczne, data YYYY.MM.DD. (specyfika węgierska!), forint (Ft) po liczbie. Język aglutynacyjny - struktura zdania inna niż w PL, NIE tłumacz słowo w słowo.
RYZYKO PRAWNE: UE - przepisy zharmonizowane. Język aglutynacyjny - priorytetem wierność sensu nad strukturą.`
  },
  'fi': {
    label: 'fiński',
    lowResource: true,
    prompt: `RYNEK: Finlandia (fi-FI). Formalność: fiński mniej rozróżnia formalność niż PL/DE - ton uprzejmy ale bezpośredni, bez sztucznego dystansu.
KONWENCJE: jednostki metryczne, data DD.MM.YYYY, kwota "19,99 €". Język aglutynacyjny, struktura odległa od polskiej - tłumacz sens, NIE strukturę.
RYZYKO PRAWNE: Finlandia ma kulturę myślistwa/strzelectwa, ścisłe pozwolenia. Ton rzeczowy, opisowy.`
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GLOSARIUSZ - składanie instrukcji terminologicznej.
// KLUCZOWE: format imperatywny + NEGATYWNY przykład (czego NIE).
// Negatywne przykłady działają na LLM lepiej niż same pozytywne.
// Wstrzykujemy TYLKO terminy obecne w tekście (filtr w buildSystemPrompt).
// ─────────────────────────────────────────────────────────────────────────────
function buildGlossaryInstruction(matchedTerms, lang) {
  if (!matchedTerms.length) return '';
  const lines = matchedTerms.map(t => {
    const correct = t.translations[lang];
    if (!correct) return null;
    const wrong = t.commonMistake ? ` (NIE: "${t.commonMistake}")` : '';
    return `- "${t.pl}" MUSI być przetłumaczone jako "${correct}"${wrong}`;
  }).filter(Boolean);
  if (!lines.length) return '';
  return `\nGLOSARIUSZ MILITARNY (terminologia obowiązkowa - branżowa, nie potoczna):
${lines.join('\n')}
Te tłumaczenia są nienegocjowalne. Generyczny translator pomyli je z potocznym znaczeniem - Ty nie możesz.`;
}

// ─────────────────────────────────────────────────────────────────────────────
// SKŁADANIE PROMPTU - tu macierz łączy się w jeden system prompt
// ─────────────────────────────────────────────────────────────────────────────
function buildSystemPrompt({ contentType, lang, glossary = [], customInstruction = '', useGlossary = null }) {
  const typeMod = TYPE_MODULES[contentType];
  const market = MARKET_PROFILES[lang];
  if (!typeMod || !market) {
    throw new Error(`Nieznany typ treści (${contentType}) lub rynek (${lang})`);
  }

  let parts = [BASE];

  // Moduł typu treści (albo własna instrukcja użytkownika)
  if (typeMod.isCustom) {
    parts.push(`INSTRUKCJA UŻYTKOWNIKA (typ niestandardowy):\n${customInstruction || '(brak - tłumacz wiernie i neutralnie)'}`);
  } else {
    parts.push(typeMod.prompt);
  }

  // Profil rynku - ZAWSZE (niezależny wymiar)
  parts.push(market.prompt);

  // Glosariusz - domyślnie wg typu treści, override możliwy z UI.
  // matchedTerms = tylko terminy faktycznie w tekście (mniej szumu).
  const glossaryOn = useGlossary === null ? typeMod.glossary : useGlossary;
  if (glossaryOn && glossary.length) {
    return {
      system: parts.join('\n\n'),
      // funkcja - filtr glosariusza odpala się gdy znamy tekst (w proxy)
      withGlossary: (text) => {
        const matched = glossary.filter(t => termMatchesText(t.pl, text));
        const gloss = buildGlossaryInstruction(matched, lang);
        return { system: parts.join('\n\n') + gloss, matchedTerms: matched.map(t => t.pl) };
      }
    };
  }

  return { system: parts.join('\n\n'), withGlossary: null };
}

// Generyk do uczciwego porównania side-by-side.
// TEN SAM model/temp/max_tokens (ustawiane w proxy) - jedyna zmienna = brak kontekstu.
// To kontrolowany eksperyment: różnica w wyniku = wartość warstwy kontekstowej, nie "lepszy silnik".
// Język podajemy nazwą EN (model rozumie "German" precyzyjniej niż lokalną nazwę).
const GENERIC_LANG_NAMES = {
  'en-us': 'English (US)', 'en-uk': 'English (UK)', 'de': 'German',
  'fr': 'French', 'uk': 'Ukrainian', 'ro': 'Romanian',
  'cs': 'Czech', 'hu': 'Hungarian', 'fi': 'Finnish'
};
function buildGenericPrompt(lang) {
  return `Translate the following text to ${GENERIC_LANG_NAMES[lang] || lang}. Output only the translation.`;
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Dopasowanie terminu glosariusza do tekstu z uwzględnieniem polskiej fleksji.
 * Polski jest fleksyjny: "kolba/kolbę/kolby/kolbą" = ta sama rzecz, więc match
 * na pełne słowo gubiłby odmienione formy. Naiwne obcięcie 3 liter dawało jednak
 * false-positive (rdzeń "za" z "zamek" łapał "zamknij", "zakładki").
 *
 * Pragmatyczny kompromis (prototyp, nie morfologia NLP): polskie końcówki
 * fleksyjne rzeczowników są krótkie (-a -y -ę -ą -i -u -em -ie ...). Zamiast
 * ciąć stałą liczbę liter, dopasowujemy rdzeń (słowo minus do 2 końcowych
 * samogłosek/typowych końcówek) i WYMAGAMY by dalej szło co najwyżej kilka
 * liter alfabetu (granica fleksji), nie dowolny ciąg. To eliminuje "zamknij"
 * przy zachowaniu "zamek/zamka/zamkiem". Termin pozostaje instrukcją
 * terminologiczną dla modelu - ewentualny rzadki FP jest tani (model i tak
 * rozpozna z kontekstu), FN (przeoczony termin) jest droższy.
 */
// Normalizacja diakrytyków - treści e-commerce bywają wklejane z różnych
// źródeł, czasem bez polskich znaków ("luska" zamiast "łuska"). Glosariusz
// trzymamy poprawnie ("łuska"), ale dopasowujemy też wersję bez ogonków.
function stripDiacritics(s) {
  return s
    .replace(/ł/g, 'l').replace(/Ł/g, 'L')
    .normalize('NFD').replace(/[̀-ͯ]/g, '');
}
function termMatchesText(term, text) {
  const firstWord = stripDiacritics(term.split(/\s+/)[0].toLowerCase());
  const haystack = stripDiacritics(text.toLowerCase());
  // rdzeń = słowo bez końcowej samogłoski (polskie rzeczowniki: kolba->kolb,
  // luska->lusk, lufa->luf). Słowa <=3 liter zostawiamy w całości.
  let stem = firstWord;
  if (firstWord.length > 3 && /[aeiouy]$/.test(firstWord)) {
    stem = firstWord.slice(0, -1);
  }
  // po rdzeniu 0-3 liter końcówki przypadka, potem granica słowa.
  const re = new RegExp(`\\b${escapeRegex(stem)}[a-z]{0,3}\\b`, 'i');
  return re.test(haystack);
}

// Lista typów do dropdownu UI (zachowuje kolejność z PDF)
const CONTENT_TYPES_ORDER = [
  'produktowe_dlugie', 'produktowe_krotkie', 'seo', 'poradniki',
  'marketingowe', 'systemowe_ui', 'informacyjne', 'prawne', 'infografiki',
  'ogolne', 'wlasny_prompt'
];

module.exports = {
  buildSystemPrompt,
  buildGenericPrompt,
  TYPE_MODULES,
  MARKET_PROFILES,
  CONTENT_TYPES_ORDER
};
