/**
 * handlers.js - logika wspólna dla obu sposobów uruchomienia:
 *   - proxy.js     (lokalnie, główny sposób zgodny z PDF: "działa lokalnie")
 *   - api/[...].js (Vercel serverless, dodatkowo - podgląd z dowolnego urządzenia)
 *
 * Jedno źródło prawdy. Wywołanie Claude API + logika tłumaczenia/ewaluacji
 * tu, warstwa HTTP (proxy vs serverless) tylko cienko ją owija.
 */

const https = require('https');
const prompts = require('./prompts.js');
const evaluate = require('./evaluate.js');
const glossary = require('./glossary.json').terms;
const examples = require('./examples.json').examples;

const MODEL = 'claude-sonnet-4-6';
const MAX_INPUT_CHARS = 12000;

// ── Wywołanie Claude API z retry/backoff ─────────────────────────────────────
function callClaude({ apiKey, system, user, temperature = 0.3, maxTokens = 4096 }) {
  const body = JSON.stringify({
    model: MODEL, max_tokens: maxTokens, temperature, system,
    messages: [{ role: 'user', content: user }]
  });

  const attempt = (retriesLeft, delay) => new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
        'content-length': Buffer.byteLength(body)
      },
      timeout: 60000
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        if ([429, 529].includes(res.statusCode) || res.statusCode >= 500) {
          if (retriesLeft > 0) {
            return setTimeout(() => attempt(retriesLeft - 1, delay * 2).then(resolve, reject), delay);
          }
          return reject(new Error(`Claude API przeciążone (HTTP ${res.statusCode}). Spróbuj ponownie za chwilę.`));
        }
        if (res.statusCode === 401) return reject(new Error('Klucz API odrzucony (401). Sprawdź ANTHROPIC_API_KEY.'));
        if (res.statusCode !== 200) {
          let msg = `Błąd API (HTTP ${res.statusCode})`;
          try { const j = JSON.parse(data); if (j.error && j.error.message) msg += `: ${j.error.message}`; } catch (_) {}
          return reject(new Error(msg));
        }
        try {
          const j = JSON.parse(data);
          resolve(j.content.map(b => b.text).join('').trim());
        } catch (e) { reject(new Error('Nieczytelna odpowiedź API.')); }
      });
    });
    req.on('timeout', () => { req.destroy(); reject(new Error('Przekroczono czas oczekiwania (60s). Tekst może być za długi - spróbuj krótszy fragment.')); });
    req.on('error', e => reject(new Error(`Brak połączenia z API: ${e.message}`)));
    req.write(body);
    req.end();
  });

  return attempt(2, 1500);
}

// ── Tłumaczenie ──────────────────────────────────────────────────────────────
async function handleTranslate(apiKey, payload) {
  const { text, contentType, lang, customInstruction = '', useGlossary = null, compare = true } = payload;

  if (!text || !text.trim()) throw new Error('Pusty tekst do tłumaczenia.');
  if (text.length > MAX_INPUT_CHARS) {
    throw new Error(`Tekst za długi (${text.length} znaków, limit ${MAX_INPUT_CHARS}). Podziel na mniejsze fragmenty - to prototyp, w produkcji byłby chunking.`);
  }

  const built = prompts.buildSystemPrompt({ contentType, lang, glossary, customInstruction, useGlossary });
  let system = built.system;
  let matchedTerms = [];
  if (built.withGlossary) {
    const g = built.withGlossary(text);
    system = g.system;
    matchedTerms = g.matchedTerms;
  }

  const tasks = [callClaude({ apiKey, system, user: text, temperature: 0.3 })];
  if (compare) {
    tasks.push(callClaude({ apiKey, system: prompts.buildGenericPrompt(lang), user: text, temperature: 0.3 }));
  }
  const [contextual, generic] = await Promise.all(tasks);

  const typeMeta = prompts.TYPE_MODULES[contentType] || {};
  const marketMeta = prompts.MARKET_PROFILES[lang] || {};
  // Confidence flag - 3 niezależne źródła ryzyka:
  //  1. typ Prawne  2. rynek restrykcyjny (DE/FR/UK)  3. język low-resource
  const reasons = [
    typeMeta.legalRisk ? 'treść prawna (ryzyko interpretacyjne)' : null,
    marketMeta.legalRisk ? `rynek o restrykcyjnym prawie o broni (${marketMeta.label})` : null,
    marketMeta.lowResource ? 'język o niskich zasobach LLM - weryfikacja native speakera' : null
  ].filter(Boolean);

  return {
    contextual,
    generic: compare ? generic : null,
    matchedTerms,
    needsReview: reasons.length > 0,
    reviewReason: reasons.length ? reasons.join(' + ') : null,
    lowResource: !!marketMeta.lowResource
  };
}

// ── Ewaluacja ────────────────────────────────────────────────────────────────
async function handleEvaluate(apiKey, payload) {
  const { text, contextual, generic, lang, contentType, lowResource } = payload;
  const typeLabel = (prompts.TYPE_MODULES[contentType] || {}).label || contentType;
  const callModel = ({ system, user, temperature }) => callClaude({ apiKey, system, user, temperature, maxTokens: 1024 });

  const out = { judge: null, backTranslation: null };
  out.judge = await evaluate.judge({ callModel, source: text, contextual, generic, lang, contentTypeLabel: typeLabel });
  if (lowResource) {
    out.backTranslation = await evaluate.backTranslate({ callModel, source: text, translation: contextual, lang });
  }
  return out;
}

// ── Metadane dla UI ──────────────────────────────────────────────────────────
function getMeta() {
  return {
    types: prompts.CONTENT_TYPES_ORDER.map(k => ({
      id: k,
      label: prompts.TYPE_MODULES[k].label,
      glossaryDefault: !!prompts.TYPE_MODULES[k].glossary,
      isCustom: !!prompts.TYPE_MODULES[k].isCustom,
      example: examples[k] || ''
    })),
    langs: Object.entries(prompts.MARKET_PROFILES).map(([id, m]) => ({
      id, label: m.label, lowResource: !!m.lowResource
    }))
  };
}

module.exports = { handleTranslate, handleEvaluate, getMeta };
