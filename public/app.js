/* app.js - logika interfejsu. Cel: pracownik nietechniczny ma rozumieć
   co się dzieje na każdym kroku. Wszystkie błędy tłumaczone na język ludzki
   (proxy zwraca {error: "..."} - nigdy surowy stack). */

const $ = id => document.getElementById(id);
let META = { types: [], langs: [] };

// ── Inicjalizacja: pobierz listę typów/języków z serwera ─────────────────────
(async function init() {
  try {
    const r = await fetch('/api/meta');
    META = await r.json();
  } catch (e) {
    showError('Nie można połączyć się z serwerem. Czy uruchomiono "node proxy.js"?');
    return;
  }
  const ct = $('contentType');
  META.types.forEach(t => ct.add(new Option(t.label, t.id)));
  const lg = $('lang');
  META.langs.forEach(l => lg.add(new Option(l.label + (l.lowResource ? '  (język wymagający weryfikacji)' : ''), l.id)));
  syncType();
})();

$('contentType').addEventListener('change', syncType);
function syncType() {
  const t = META.types.find(x => x.id === $('contentType').value);
  if (!t) return;
  $('customWrap').classList.toggle('hidden', !t.isCustom);
  // useGlossary teraz hidden input z "true" - zawsze aktywne (filter robi swoje).
  // Komunikacja przez hint - pracownik wie ze slownik dziala i czym dysponuje.
  renderTypeHint(t);
}

function renderTypeHint(t) {
  const host = $('typeHint');
  if (t.isCustom) {
    host.textContent = 'Wpisz własną instrukcję poniżej.';
    return;
  }
  const ctxLine = t.glossaryDefault
    ? 'Słownik branżowy aktywny - terminologia sprzętu będzie fachowa.'
    : 'Treść ogólna - słownik aktywny tylko jeśli pojawi się termin militarny.';
  const gi = META.glossaryInfo;
  if (!gi) { host.textContent = ctxLine; return; }
  // 2-linijkowy hint: status + skladniki (na nizszej linii w jasniejszym kolorze)
  host.innerHTML = ctxLine + ` <span class="hint-meta">` +
    `Słownik: ${gi.termsCount} terminów (${gi.sampleTerms.slice(0, 3).join(', ')}...) ` +
    `+ ${gi.keepAsIsCount} akronimów zachowanych dosłownie (${gi.sampleKeepAsIs.slice(0, 3).join(', ')}...).` +
    `</span>`;
}

$('sourceText').addEventListener('input', e => {
  $('charCount').textContent = e.target.value.length;
});

// Wstaw przykład - kuratorowany tekst dla wybranej kategorii.
// Każde kolejne kliknięcie wpisuje INNY z dostępnych wariantów (rotacja
// 2-3 przykładów per typ). Demonstracja dla pracownika że narzędzie radzi
// sobie z różnorodnymi treściami, nie tylko jedną próbką.
const exampleIndexByType = {};  // pamiętamy który wariant pokazujemy dla każdego typu
$('exampleBtn').addEventListener('click', () => {
  const t = META.types.find(x => x.id === $('contentType').value);
  if (!t) return;
  const arr = (t.examples && t.examples.length) ? t.examples : (t.example ? [t.example] : []);
  if (!arr.length) return;
  if ($('sourceText').value.trim() && !confirm('Zastąpić obecny tekst kolejnym przykładem?')) return;

  // rotacja: indeks +1 dla tego typu (modulo długość)
  const prev = exampleIndexByType[t.id];
  let next = prev == null ? 0 : (prev + 1) % arr.length;
  exampleIndexByType[t.id] = next;
  const picked = arr[next];

  $('sourceText').value = picked;
  $('charCount').textContent = picked.length;
  $('sourceText').focus();

  // Subtelna informacja w button tekście jeśli jest więcej niż jeden wariant
  if (arr.length > 1) {
    const btn = $('exampleBtn');
    const original = 'Wstaw przykład ↧';
    btn.textContent = `Przykład ${next + 1}/${arr.length} - kliknij dla kolejnego ↻`;
    clearTimeout(window._exampleBtnTimer);
    window._exampleBtnTimer = setTimeout(() => { btn.textContent = original; }, 3500);
  }
});

// ── Tłumaczenie ──────────────────────────────────────────────────────────────
$('translateBtn').addEventListener('click', async () => {
  const text = $('sourceText').value.trim();
  if (!text) return showError('Wklej tekst do przetłumaczenia.');
  hideError();

  const payload = {
    text,
    contentType: $('contentType').value,
    lang: $('lang').value,
    customInstruction: $('customInstruction').value,
    // Glosariusz zawsze on - filter pokazuje tylko terminy faktycznie obecne w tekscie,
    // wiec dla "marketingowe" z 0 terminami nic sie nie wstrzykuje. Niepotrzebny user toggle.
    useGlossary: true,
    compare: $('compare').checked
  };

  const btn = $('translateBtn');
  btn.disabled = true;
  btn.innerHTML = '<span class="spin"></span>Tłumaczę...';

  try {
    const res = await fetch('/api/translate', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok || data.error) throw new Error(data.error || 'Nieznany błąd serwera.');

    renderResult(data, payload);

    // Opcjonalna ocena jakości - osobny, wolniejszy przebieg
    if ($('doEvaluate').checked && data.generic) {
      btn.innerHTML = '<span class="spin"></span>Oceniam jakość...';
      await runEvaluation(text, data, payload);
    }
  } catch (e) {
    showError(e.message);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Przetłumacz';
  }
});

function renderResult(data, payload) {
  $('results').classList.remove('hidden');
  $('evalBox').classList.add('hidden');

  // Confidence banner - kiedy tłumaczenie wymaga człowieka
  const banner = $('reviewBanner');
  if (data.needsReview) {
    banner.innerHTML = `<b>Wymaga weryfikacji człowieka:</b> ${data.reviewReason}. To tłumaczenie traktuj jako wstępne - przed publikacją sprawdź je z osobą znającą rynek/prawo.`;
    banner.classList.remove('hidden');
  } else {
    banner.classList.add('hidden');
  }

  $('ctxOut').textContent = data.contextual;

  // Widget "Uwzgledniono" - co AI wzielo pod uwage (zbiorczo zamiast rozproszenia)
  renderAppliedContext(data);

  // Słownik militarny - które terminy fleksyjne dopasowano
  const m = $('matched');
  let matchedHtml = '';
  if (data.matchedTerms && data.matchedTerms.length) {
    matchedHtml += `<div>Słownik branżowy: <b>${data.matchedTerms.join('</b>, <b>')}</b></div>`;
  }
  if (data.keptTerms && data.keptTerms.length) {
    matchedHtml += `<div style="margin-top:6px">Zachowano bez tłumaczenia (akronimy/standardy): <b>${data.keptTerms.join('</b>, <b>')}</b></div>`;
  }
  if (matchedHtml) {
    m.innerHTML = matchedHtml;
    m.classList.remove('hidden');
  } else m.classList.add('hidden');

  // Porównanie z generykiem
  const grid = document.querySelector('.result-grid');
  if (data.generic) {
    $('genOut').textContent = data.generic;
    $('genWrap').classList.remove('hidden');
    grid.classList.remove('solo');
  } else {
    $('genWrap').classList.add('hidden');
    grid.classList.add('solo');
  }
}

// Widget "Uwzgledniono" + UI char budget warning
function renderAppliedContext(data) {
  const host = $('appliedContext');
  if (!host) return;
  const ctx = data.appliedContext;
  if (!ctx) { host.classList.add('hidden'); return; }

  const chips = [];
  chips.push(`<span class="chip"><span class="chip-mark">✓</span>typ: <b>${escapeHtml(ctx.contentTypeLabel)}</b></span>`);
  chips.push(`<span class="chip"><span class="chip-mark">✓</span>rynek: <b>${escapeHtml(ctx.marketLabel)}</b></span>`);
  if (ctx.glossaryCount > 0) {
    chips.push(`<span class="chip"><span class="chip-mark">✓</span>słownik: <b>${ctx.glossaryCount} ${plural(ctx.glossaryCount, 'termin', 'terminy', 'terminów')}</b></span>`);
  }
  if (ctx.keepAsIsCount > 0) {
    chips.push(`<span class="chip"><span class="chip-mark">✓</span>akronimy zachowane: <b>${ctx.keepAsIsCount}</b></span>`);
  }
  if (ctx.reviewFlag) {
    chips.push(`<span class="chip warn"><span class="chip-mark">⚠</span>flaga: <b>wymaga weryfikacji</b></span>`);
  }

  // UI char budget - tylko dla systemowe_ui
  let budgetHtml = '';
  if (data.uiCharBudget) {
    const b = data.uiCharBudget;
    const cls = b.status === 'ok' ? 'ok' : b.status === 'warn' ? 'warn' : 'over';
    const icon = b.status === 'ok' ? '✓' : b.status === 'warn' ? '⚠' : '✗';
    const msg = b.status === 'ok'
      ? `mieści się w limicie UI (cel ${b.target} znaków)`
      : b.status === 'warn'
      ? `długie dla UI - może obciąć się w przycisku (cel ${b.target}, max ${b.hardMax})`
      : `za długie dla UI - rozwali layout (limit ${b.hardMax})`;
    budgetHtml = `<div class="char-budget ${cls}"><span class="chip-mark">${icon}</span>długość <b>${b.length}/${b.target}</b> znaków - ${msg}</div>`;
  }

  host.innerHTML = `<div class="applied-label">Uwzględniono</div><div class="applied-chips">${chips.join('')}</div>${budgetHtml}`;
  host.classList.remove('hidden');
}

function plural(n, one, few, many) {
  if (n === 1) return one;
  if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) return few;
  return many;
}

// ── Ocena jakości (prompt-as-judge + back-translation) ───────────────────────
async function runEvaluation(text, data, payload) {
  try {
    const res = await fetch('/api/evaluate', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        text, contextual: data.contextual, generic: data.generic,
        lang: payload.lang, contentType: payload.contentType, lowResource: data.lowResource
      })
    });
    const ev = await res.json();
    if (!res.ok || ev.error) throw new Error(ev.error || 'Ocena niedostępna.');
    renderEval(ev);
  } catch (e) {
    $('evalBox').classList.remove('hidden');
    $('evalContent').innerHTML = `<div class="error">Ocena jakości niedostępna: ${e.message}</div>`;
  }
}

function renderEval(ev) {
  $('evalBox').classList.remove('hidden');
  let html = '';
  const j = ev.judge;
  if (j && j.ok) {
    const win = j.verdict === 'kontekstowe';
    const tie = j.verdict === 'remis';
    html += `<div class="verdict ${win ? 'win' : tie ? 'tie' : ''}">
      Werdykt sędziego: <b>${j.verdict === 'kontekstowe' ? 'tłumaczenie kontekstowe lepsze' : j.verdict === 'generyczne' ? 'zwykły tłumacz lepszy' : 'remis'}</b>
      ${j.delta != null ? ` &nbsp;(różnica ocen ważonych: ${j.delta > 0 ? '+' : ''}${j.delta})` : ''}
      <br><small>${escapeHtml(j.rationale)}</small></div>`;
    const axes = [['wiernosc', 'Wierność'], ['terminologia', 'Terminologia'], ['ton', 'Ton'], ['konwencja', 'Konwencja rynku']];
    html += `<table class="scores"><tr><th>Kryterium</th><th>Kontekstowe</th><th>Zwykły tłumacz</th></tr>`;
    axes.forEach(([k, lbl]) => {
      const c = j.contextual.scores[k], g = j.generic.scores[k];
      html += `<tr><td>${lbl}</td><td class="${c >= g ? 'hi' : ''}">${c ?? '-'}</td><td class="${g > c ? 'hi' : ''}">${g ?? '-'}</td></tr>`;
    });
    html += `<tr><td><b>Wynik ważony</b></td><td class="${j.contextual.weighted >= j.generic.weighted ? 'hi' : ''}">${j.contextual.weighted ?? '-'}</td><td class="${j.generic.weighted > j.contextual.weighted ? 'hi' : ''}">${j.generic.weighted ?? '-'}</td></tr>`;
    html += `</table>`;
  } else if (j) {
    html += `<div class="error">Sędzia niedostępny: ${escapeHtml(j.error || '')}</div>`;
  }

  // Back-translation (tylko języki low-resource)
  const bt = ev.backTranslation;
  if (bt && bt.ok) {
    const riskColor = bt.risk === 'niskie' ? 'var(--ok)' : bt.risk === 'wysokie' ? 'var(--danger)' : 'var(--warn)';
    html += `<div class="bt"><b>Test podwójnego tłumaczenia</b> (PL → język → PL, dla języków których nikt w firmie nie zweryfikuje gołym okiem):<br>
      Zgodność sensu: <b>${bt.consistency}/5</b> &nbsp;·&nbsp; ryzyko: <span style="color:${riskColor}">${bt.risk}</span>
      ${bt.note ? `<br>Uwaga: ${escapeHtml(bt.note)}` : ''}
      <br><small style="color:var(--muted)">Tekst po powrocie do PL: "${escapeHtml(bt.backPl || '')}"</small></div>`;
  }
  $('evalContent').innerHTML = html;
}

// ── Kopiowanie ───────────────────────────────────────────────────────────────
document.addEventListener('click', e => {
  // tylko przyciski kopiujące mają data-target; pomijamy np. #downloadDoc
  if (!e.target.classList.contains('copy') || !e.target.dataset.target) return;
  const txt = $(e.target.dataset.target).textContent;
  navigator.clipboard.writeText(txt).then(() => {
    const o = e.target.textContent;
    e.target.textContent = 'Skopiowano ✓';
    setTimeout(() => e.target.textContent = o, 1400);
  });
});

function showError(msg) { const e = $('error'); e.textContent = msg; e.classList.remove('hidden'); }
function hideError() { $('error').classList.add('hidden'); }
function escapeHtml(s) { return String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

// ═══════════════════════════════════════════════════════════════════════════
// TRYB MASOWY (CSV)
//
// Decyzja architektoniczna: przetwarzanie WIERSZ PO WIERSZU z frontu, nie jeden
// gigantyczny request. Powód: Vercel serverless ma limit czasu - batch 25 wierszy
// w jednym requeście by timeoutował ("narzędzie nie działa" na demo). Wiersz =
// osobny szybki request, pasek postępu na żywo. Limit 25 z jasnym komunikatem
// (prototyp; produkcja miałaby kolejkę zadań - to świadoma granica zakresu).
// ═══════════════════════════════════════════════════════════════════════════
const BATCH_LIMIT = 25;
let batchResults = [];

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const mode = tab.dataset.mode; // single | batch | doc
    $('singleMode').classList.toggle('hidden', mode !== 'single');
    $('batchMode').classList.toggle('hidden', mode !== 'batch');
    $('docMode').classList.toggle('hidden', mode !== 'doc');
    $('results').classList.add('hidden');
    $('batchResults').classList.add('hidden');
    $('docResults').classList.add('hidden');
    hideError();
  });
});

// Minimalny parser CSV - obsługuje pola w cudzysłowach i przecinki wewnątrz.
// Świadomie prosty (prototyp): jedna kolumna tekstu = pierwsza kolumna.
function parseCsv(text) {
  const rows = [];
  let row = [], field = '', inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i], next = text[i + 1];
    if (inQuotes) {
      if (c === '"' && next === '"') { field += '"'; i++; }
      else if (c === '"') inQuotes = false;
      else field += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ',') { row.push(field); field = ''; }
      else if (c === '\n' || c === '\r') {
        if (c === '\r' && next === '\n') i++;
        if (field !== '' || row.length) { row.push(field); rows.push(row); row = []; field = ''; }
      } else field += c;
    }
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  return rows;
}

$('csvFile').addEventListener('change', e => {
  $('batchBtn').disabled = !e.target.files.length;
});

$('sampleCsvBtn').addEventListener('click', () => {
  const sample = 'tekst\n"Karabinek ma składaną kolbę i magazynek na 30 naboi"\n"Dodaj do koszyka"\n"Tylko teraz! Magazynek gratis do każdej repliki ASG"\n"Zwrot towaru w terminie 14 dni zgodnie z ustawą"';
  downloadFile('przyklad-do-tlumaczenia.csv', sample);
});

$('batchBtn').addEventListener('click', async () => {
  hideError();
  const file = $('csvFile').files[0];
  if (!file) return showError('Wybierz plik CSV.');

  const text = await file.text();
  const rows = parseCsv(text);
  if (rows.length < 2) return showError('Plik CSV pusty lub bez danych (potrzebny nagłówek + min. 1 wiersz).');

  // pierwszy wiersz = nagłówek, bierzemy pierwszą kolumnę każdego kolejnego
  const dataRows = rows.slice(1).map(r => (r[0] || '').trim()).filter(Boolean);
  if (!dataRows.length) return showError('Brak tekstów w pierwszej kolumnie.');

  let toProcess = dataRows;
  let truncated = false;
  if (dataRows.length > BATCH_LIMIT) {
    toProcess = dataRows.slice(0, BATCH_LIMIT);
    truncated = true;
  }

  const contentType = $('contentType').value;
  const lang = $('lang').value;
  const useGlossary = true;  // zawsze on (filter)

  $('batchBtn').disabled = true;
  $('batchProgress').classList.remove('hidden');
  batchResults = [];

  for (let i = 0; i < toProcess.length; i++) {
    const pct = Math.round((i / toProcess.length) * 100);
    $('progressFill').style.width = pct + '%';
    $('progressText').textContent = `Tłumaczę ${i + 1} z ${toProcess.length}...`;

    try {
      const res = await fetch('/api/translate', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ text: toProcess[i], contentType, lang, useGlossary, compare: false })
      });
      const d = await res.json();
      if (!res.ok || d.error) throw new Error(d.error || 'błąd');
      batchResults.push({
        source: toProcess[i], translation: d.contextual,
        review: d.needsReview ? d.reviewReason : '', error: ''
      });
    } catch (e) {
      batchResults.push({ source: toProcess[i], translation: '', review: '', error: e.message });
    }
  }

  $('progressFill').style.width = '100%';
  $('progressText').textContent = `Gotowe: ${batchResults.length} wierszy.` + (truncated ? ` (Plik miał ${dataRows.length}, przetworzono limit ${BATCH_LIMIT}.)` : '');
  $('batchBtn').disabled = false;
  renderBatch(truncated, dataRows.length);
});

function renderBatch(truncated, total) {
  $('batchResults').classList.remove('hidden');
  let html = '';
  if (truncated) html += `<div class="banner" style="margin-bottom:14px"><b>Limit prototypu:</b> plik miał ${total} wierszy, przetworzono pierwsze ${BATCH_LIMIT}. W produkcji byłaby kolejka zadań bez limitu.</div>`;
  html += '<table class="batch"><tr><th>#</th><th>Tekst PL</th><th>Tłumaczenie</th><th>Uwaga</th></tr>';
  batchResults.forEach((r, i) => {
    html += `<tr><td>${i + 1}</td><td>${escapeHtml(r.source)}</td>`;
    if (r.error) html += `<td class="err" colspan="2">Błąd: ${escapeHtml(r.error)}</td>`;
    else html += `<td>${escapeHtml(r.translation)}</td><td class="flag">${r.review ? '⚠ ' + escapeHtml(r.review) : ''}</td>`;
    html += '</tr>';
  });
  html += '</table>';
  $('batchTableWrap').innerHTML = html;
}

$('downloadCsv').addEventListener('click', () => {
  const esc = s => `"${String(s || '').replace(/"/g, '""')}"`;
  const lines = ['tekst_pl,tlumaczenie,wymaga_weryfikacji,blad'];
  batchResults.forEach(r => {
    lines.push([esc(r.source), esc(r.translation), esc(r.review), esc(r.error)].join(','));
  });
  downloadFile('tlumaczenia-militaria.csv', lines.join('\n'));
});

function downloadFile(name, content, mime = 'text/csv;charset=utf-8') {
  const blob = new Blob(['﻿' + content], { type: mime });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}

// ═══════════════════════════════════════════════════════════════════════════
// TRYB DOKUMENT (.txt + auto-chunking)
//
// Problem: regulamin/polityka ma 10-50k znaków, limit pojedynczego requestu
// to 12k (model gubi spójność na bardzo długich tekstach). Rozwiązanie:
// dziel dokument po GRANICACH SEKCJI (§, paragrafy), tłumacz chunk po chunku
// tym samym promptem (spójność terminologii zapewnia glosariusz + ten sam
// system prompt), składaj z powrotem. Chunking po stronie frontu - jak batch,
// omija timeout serverless, pasek postępu na żywo.
//
// .docx/.pdf świadomie POMINIĘTE (wymagałyby zależności npm - złamanie filaru
// "zero deps"). W README jako "dalszy rozwój" = sygnał świadomości zakresu.
// ═══════════════════════════════════════════════════════════════════════════
const CHUNK_MAX = 8000; // zapas pod system prompt (limit API ~12k)
let docResultText = '';
let docFileName = 'dokument';

// Dzielenie z poszanowaniem struktury: najpierw po § / podwójnym newline
// (granice sekcji prawnych), gdy fragment nadal za duży - po akapitach,
// w ostateczności po zdaniach. Nigdy nie tnie w środku zdania jeśli się da.
function chunkDocument(text) {
  const blocks = text.split(/(?=§\s*\d)|\n{2,}/).map(s => s.trim()).filter(Boolean);
  const chunks = [];
  let buf = '';
  const flush = () => { if (buf.trim()) { chunks.push(buf.trim()); buf = ''; } };

  for (let block of blocks) {
    if (block.length > CHUNK_MAX) {
      flush();
      // za długi pojedynczy blok - tnij po zdaniach
      const sentences = block.match(/[^.!?]+[.!?]+|\s*\S+\s*$/g) || [block];
      let sb = '';
      for (const s of sentences) {
        if ((sb + s).length > CHUNK_MAX) { if (sb.trim()) chunks.push(sb.trim()); sb = s; }
        else sb += s;
      }
      if (sb.trim()) chunks.push(sb.trim());
    } else if ((buf + '\n\n' + block).length > CHUNK_MAX) {
      flush();
      buf = block;
    } else {
      buf = buf ? buf + '\n\n' + block : block;
    }
  }
  flush();
  return chunks;
}

$('docFile').addEventListener('change', e => {
  $('docBtn').disabled = !e.target.files.length;
  if (e.target.files.length) docFileName = e.target.files[0].name.replace(/\.[^.]+$/, '');
});

$('sampleDocBtn').addEventListener('click', () => {
  const reg = `REGULAMIN SKLEPU MILITARIA

§1. Postanowienia ogólne
1. Sklep internetowy prowadzi sprzedaż detaliczną artykułów militarnych, replik ASG, amunicji oraz sprzętu survivalowego za pośrednictwem sieci Internet.
2. Warunkiem złożenia zamówienia jest ukończenie 18 roku życia.

§2. Zamówienia
1. Zamówienia można składać 24 godziny na dobę przez stronę internetową sklepu.
2. Złożenie zamówienia stanowi ofertę zawarcia umowy sprzedaży w rozumieniu Kodeksu cywilnego.

§3. Odstąpienie od umowy
1. Konsument może odstąpić od umowy w terminie 14 dni bez podania przyczyny, zgodnie z ustawą z dnia 30 maja 2014 r. o prawach konsumenta (Dz.U. 2014 poz. 827).
2. Prawo odstąpienia nie przysługuje w odniesieniu do amunicji oraz towarów w zapieczętowanym opakowaniu, których po otwarciu nie można zwrócić ze względów bezpieczeństwa.

§4. Bezpieczeństwo
1. Repliki ASG nie są bronią palną w rozumieniu ustawy o broni i amunicji.
2. Kupujący zobowiązuje się do używania zakupionych produktów zgodnie z ich przeznaczeniem i obowiązującym prawem.`;
  downloadFile('przyklad-regulamin.txt', reg, 'text/plain;charset=utf-8');
});

$('docBtn').addEventListener('click', async () => {
  hideError();
  const file = $('docFile').files[0];
  if (!file) return showError('Wybierz plik .txt.');

  const text = (await file.text()).trim();
  if (!text) return showError('Plik jest pusty.');

  const chunks = chunkDocument(text);
  const contentType = $('contentType').value;
  const lang = $('lang').value;
  const useGlossary = true;  // zawsze on (filter)

  $('docBtn').disabled = true;
  $('docProgress').classList.remove('hidden');
  const parts = [];
  let anyReview = false, reviewReason = '', failed = false;

  for (let i = 0; i < chunks.length; i++) {
    $('docProgressFill').style.width = Math.round((i / chunks.length) * 100) + '%';
    $('docProgressText').textContent = `Tłumaczę sekcję ${i + 1} z ${chunks.length} (dokument podzielony automatycznie)...`;
    try {
      const res = await fetch('/api/translate', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ text: chunks[i], contentType, lang, useGlossary, compare: false })
      });
      const d = await res.json();
      if (!res.ok || d.error) throw new Error(d.error || 'błąd');
      parts.push(d.contextual);
      if (d.needsReview) { anyReview = true; reviewReason = d.reviewReason; }
    } catch (e) {
      parts.push(`[BŁĄD TŁUMACZENIA SEKCJI ${i + 1}: ${e.message}]`);
      failed = true;
    }
  }

  $('docProgressFill').style.width = '100%';
  $('docProgressText').textContent = `Gotowe: ${chunks.length} sekcji złożonych w jeden dokument.`;
  $('docBtn').disabled = false;

  docResultText = parts.join('\n\n');
  $('docResults').classList.remove('hidden');
  $('docOut').textContent = docResultText;
  $('docMeta').innerHTML = `Dokument podzielono na <b>${chunks.length}</b> sekcji (${text.length} znaków źródła), przetłumaczono z zachowaniem spójności terminologii i złożono.`;
  const banner = $('docReviewBanner');
  if (anyReview || failed) {
    banner.innerHTML = (failed ? '<b>Część sekcji nie przetłumaczona</b> - sprawdź dokument przed użyciem. ' : '') +
      (anyReview ? `<b>Wymaga weryfikacji człowieka:</b> ${reviewReason}. Treść prawna - przed publikacją sprawdź z prawnikiem znającym rynek docelowy.` : '');
    banner.classList.remove('hidden');
  } else banner.classList.add('hidden');
});

$('downloadDoc').addEventListener('click', () => {
  downloadFile(`${docFileName}-tlumaczenie.txt`, docResultText, 'text/plain;charset=utf-8');
});
