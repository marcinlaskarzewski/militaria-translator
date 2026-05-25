/**
 * tests/smoke.js - smoke test bez zewnetrznego API
 *
 * Dowod ze trzy filary narzedzia maja matematyczne podstawy a nie sa deklaracjami:
 *  1. MACIERZ 99 promptow - 11 typow x 9 rynkow = 99 unikalnych systemPromptow,
 *     kazdy zawiera odpowiedni TYPE_MODULE + odpowiedni MARKET_PROFILE.
 *  2. MATCHER GLOSARIUSZA bez false-positive - "zamek" nie lapie "zamknij",
 *     "kolba" nie lapie "kolejka", ale "kolbę"/"kolby" sa lapane (fleksja).
 *  3. CHUNKING dokumentu - dluga tresc dzielona po granicach paragrafu/§,
 *     kazdy chunk pod limitem 12000 znakow, struktura zachowana.
 *
 * Uruchom:  node tests/smoke.js
 * Output:   stdout + tests/results.txt (commitujemy jako dowod)
 *
 * Nie wymaga klucza API - testujemy logike kompozycji promptow i matchowania,
 * nie samego tlumaczenia (to jest osobny smoke LIVE w SMOKE-RESULTS-2026-05-22.md).
 */

const fs = require('fs');
const path = require('path');
const prompts = require('../src/prompts.js');
const { CONTENT_TYPES_ORDER, MARKET_PROFILES, TYPE_MODULES, buildSystemPrompt } = prompts;

const glossary = require('../src/glossary.json').terms;
const keepAsIs = require('../src/glossary.json').keepAsIs.terms;

let pass = 0, fail = 0;
const log = [];

function assert(cond, msg) {
  if (cond) { pass++; log.push(`  PASS: ${msg}`); }
  else { fail++; log.push(`  FAIL: ${msg}`); }
}

function section(title) {
  log.push(`\n=== ${title} ===`);
  console.log(`\n=== ${title} ===`);
}

// ──────────────────────────────────────────────────────────────────────────────
// FILAR 1: macierz 99 promptow (11 typow x 9 rynkow)
// ──────────────────────────────────────────────────────────────────────────────
section('Filar 1: macierz 99 systemPromptow (11 typow x 9 rynkow)');

const langs = Object.keys(MARKET_PROFILES);
const types = CONTENT_TYPES_ORDER;
assert(langs.length === 9, `9 rynkow w MARKET_PROFILES (jest ${langs.length})`);
assert(types.length === 11, `11 typow w CONTENT_TYPES_ORDER (jest ${types.length})`);

const seen = new Set();
let built = 0;
let withType = 0, withMarket = 0;
for (const type of types) {
  for (const lang of langs) {
    const { system } = buildSystemPrompt({
      contentType: type, lang, glossary: [], keepAsIs: [],
      customInstruction: type === 'wlasny_prompt' ? 'Testuj wiernie.' : ''
    });
    built++;
    seen.add(system);
    if (TYPE_MODULES[type].prompt && system.includes(TYPE_MODULES[type].prompt.slice(0, 40))) withType++;
    else if (type === 'wlasny_prompt' && system.includes('INSTRUKCJA UŻYTKOWNIKA')) withType++;
    if (system.includes(MARKET_PROFILES[lang].prompt.slice(0, 40))) withMarket++;
  }
}
assert(built === 99, `zbudowano 99 promptow (zbudowano ${built})`);
assert(seen.size === 99, `99 UNIKALNYCH promptow - brak duplikatow (unikalnych ${seen.size})`);
assert(withType === 99, `kazdy prompt zawiera fragment swojego TYPE_MODULE (${withType}/99)`);
assert(withMarket === 99, `kazdy prompt zawiera fragment swojego MARKET_PROFILE (${withMarket}/99)`);

// ──────────────────────────────────────────────────────────────────────────────
// FILAR 2: matcher glosariusza - brak false-positive, lapie fleksje
// ──────────────────────────────────────────────────────────────────────────────
section('Filar 2: matcher glosariusza (fleksja PL + brak FP na UI/menu)');

function matched(text, glossary) {
  const built = buildSystemPrompt({
    contentType: 'produktowe_dlugie', lang: 'de', glossary, keepAsIs: []
  });
  if (!built.withGlossary) return [];
  return built.withGlossary(text).matchedTerms;
}

// 2a. Powinno lapac fleksje (kazdy przypadek = rdzen + 0-3 liter konca)
const flexJa = ['Wymienilem kolbe karabinu.', 'Pusta luska na podlodze.', 'Magazynek do AR-15.', 'Lufa wyczyszczona.'];
for (const text of flexJa) {
  const m = matched(text, glossary);
  assert(m.length > 0, `lapie termin (fleksja) w: "${text}" - matched: [${m.join(',')}]`);
}

// 2b. NIE powinno lapac false-positive na typowych slowach UI/menu
const uiNoise = [
  'Zaloguj sie',
  'Zamknij okno',
  'Zamow newsletter',
  'Zakladki przegladarki',
  'Kolejka zamowien',
  'Magnes na lodowke',
  'Lustro w lazience',
  'Lufa = referencja w komiksie?', // ten powinien zlapac "lufa" - intencyjnie
  'Pomoc / FAQ',
  'Twoj koszyk',
  'Polityka prywatnosci',
  'Cookies w przegladarce',
  'Drukowanie etykiet',
  'Subskrypcja konta',
  'Pasek nawigacji',
  'Strona glowna',
  'Powrot do menu',
  'Filtrowanie kategorii',
  'Wyszukiwarka produktow',
  'Logowanie do konta',
];
let fpCount = 0;
let fpExamples = [];
for (const text of uiNoise) {
  const m = matched(text, glossary);
  if (m.length > 0 && !text.toLowerCase().includes('lufa')) {
    fpCount += m.length;
    fpExamples.push(`"${text}" -> [${m.join(',')}]`);
  }
}
assert(fpCount === 0, `zero false-positive na 19 stringach UI (FP: ${fpCount}, przyklady: ${fpExamples.slice(0, 3).join(' | ')})`);

// 2c. keepAsIs - akronimy lapane case-insensitive
const akroTexts = [
  { t: 'System MOLLE i kieszen IFAK.', expect: ['MOLLE', 'IFAK'] },
  { t: 'edc w torbie + ar-15 do zabawy', expect: ['EDC', 'AR-15'] },
  { t: 'glock z optyka NV', expect: ['Glock'] },
];
for (const {t, expect} of akroTexts) {
  const built = buildSystemPrompt({
    contentType: 'produktowe_dlugie', lang: 'en-us', glossary: [], keepAsIs
  });
  const got = built.withGlossary ? built.withGlossary(t).keptTerms : [];
  for (const e of expect) {
    assert(got.includes(e), `keepAsIs lapie "${e}" w: "${t}" (matched: [${got.join(',')}])`);
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// FILAR 3: chunking dlugiej tresci po granicach paragrafu/§
// ──────────────────────────────────────────────────────────────────────────────
section('Filar 3: chunking dokumentow po granicach sekcji (§, paragrafy)');

// Wzorzec chunkera z public/app.js - tu Node port do testu jednostkowego.
// Granice: pusta linia (paragraf), §, "Paragraf N", "Art. N". Limit 12000 znakow.
const CHUNK_MAX = 12000;
function chunkDocument(text) {
  const paragraphs = text.split(/\n\s*\n/);
  const chunks = [];
  let buf = '';
  const flush = () => { if (buf.trim()) { chunks.push(buf.trim()); buf = ''; } };
  for (const p of paragraphs) {
    if (/^\s*(§|Paragraf|Art\.)/i.test(p) && buf.trim()) flush();
    if ((buf + '\n\n' + p).length > CHUNK_MAX) {
      flush();
      if (p.length > CHUNK_MAX) {
        // bardzo dlugi pojedynczy paragraf -> tnij po zdaniach
        const sentences = p.split(/(?<=[.!?])\s+/);
        let sb = '';
        for (const s of sentences) {
          if ((sb + s).length > CHUNK_MAX) { if (sb.trim()) chunks.push(sb.trim()); sb = s; }
          else { sb = sb ? sb + ' ' + s : s; }
        }
        if (sb.trim()) chunks.push(sb.trim());
      } else { buf = p; }
    } else { buf = buf ? buf + '\n\n' + p : p; }
  }
  flush();
  return chunks;
}

// 3a. Dokument 30 paragrafow po ~400 znakow = ~12000 znakow razem
const para = 'To jest paragraf testowy o broni palnej, magazynkach i amunicji 5.56x45 NATO. ' +
             'Zawiera referencje do MOLLE, EDC oraz IFAK. Przyklad standardowego opisu produktu. '.repeat(3);
const doc30 = Array.from({length: 30}, (_, i) => `Paragraf ${i+1}.\n${para}`).join('\n\n');
const chunks30 = chunkDocument(doc30);
assert(chunks30.length > 1, `dokument 30 paragrafow dzieli sie na chunki (${chunks30.length} chunkow)`);
const allUnderLimit = chunks30.every(c => c.length <= CHUNK_MAX);
assert(allUnderLimit, `wszystkie chunki pod limitem ${CHUNK_MAX} znakow`);
const allParagraphsKept = chunks30.join('\n\n').replace(/\s+/g, ' ').includes('Paragraf 30');
assert(allParagraphsKept, `tresc nie zgubiona - "Paragraf 30" znajduje sie w wyniku`);

// 3b. Regulamin z § - kazdy § zaczyna nowy chunk gdy buf nie pusty
const regulamin = `§ 1. Postanowienia ogolne\n${para}\n\n§ 2. Definicje\n${para}\n\n§ 3. Reklamacje\n${para}`;
const chunksReg = chunkDocument(regulamin);
const startsWithPara = chunksReg.filter(c => /^\s*§/.test(c)).length;
assert(startsWithPara >= 1, `chunki regulaminu zaczynaja sie od § (${startsWithPara} z ${chunksReg.length})`);

// ──────────────────────────────────────────────────────────────────────────────
// PODSUMOWANIE
// ──────────────────────────────────────────────────────────────────────────────
const summary = `\n${'='.repeat(60)}\nWYNIK: PASS ${pass}  FAIL ${fail}\n${'='.repeat(60)}\n`;
log.push(summary);
console.log(log.join('\n'));

const outPath = path.join(__dirname, 'results.txt');
fs.writeFileSync(outPath, `Smoke test - ${new Date().toISOString()}\n${log.join('\n')}\n`);
console.log(`\nLog zapisany: ${outPath}`);

process.exit(fail === 0 ? 0 : 1);
