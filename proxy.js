/**
 * proxy.js - lokalny serwer pośredniczący (GŁÓWNY sposób uruchomienia)
 *
 * DLACZEGO PROXY (świadoma decyzja, nie "backend aplikacji"):
 * Zadanie zabrania backendu i bazy danych. Tego się trzymam - nie ma tu
 * stanu, bazy ani logiki biznesowej. Ale klucz API NIE MOŻE trafić do
 * przeglądarki (każdy z DevTools by go zobaczył = rachunek na cudzej karcie),
 * a Anthropic API blokuje wywołania bezpośrednio z przeglądarki (CORS).
 * Proxy to MINIMALNA warstwa bezpieczeństwa: serwuje pliki statyczne i
 * przekazuje request do Claude trzymając klucz po stronie serwera.
 *
 * Zero zależności npm. Pracownik: `node proxy.js`, otwiera przeglądarkę.
 * Logika tłumaczenia/ewaluacji jest w src/handlers.js (współdzielona -
 * ten sam kod używany też przez wariant Vercel, bez duplikacji).
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { handleTranslate, handleEvaluate, getMeta } = require('./src/handlers.js');

// ── Wczytanie .env (bez zależności dotenv) ───────────────────────────────────
try {
  fs.readFileSync(path.join(__dirname, '.env'), 'utf8').split('\n').forEach(line => {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] = m[2];
  });
} catch (_) { /* .env opcjonalny - sprawdzamy klucz niżej */ }

const API_KEY = process.env.ANTHROPIC_API_KEY;
const PORT = process.env.PORT || 3000;

if (!API_KEY) {
  console.error('\n❌ Brak ANTHROPIC_API_KEY. Skopiuj .env.example do .env i wklej klucz.\n');
  process.exit(1);
}

const STATIC = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8'
};

const server = http.createServer((req, res) => {
  const sendJson = (code, obj) => {
    res.writeHead(code, { 'content-type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(obj));
  };

  // Metadane dla UI
  if (req.method === 'GET' && req.url === '/api/meta') {
    return sendJson(200, getMeta());
  }

  // Tłumaczenie / ewaluacja
  if (req.method === 'POST' && (req.url === '/api/translate' || req.url === '/api/evaluate')) {
    let body = '';
    req.on('data', c => { body += c; if (body.length > 5e6) req.destroy(); });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body);
        const result = req.url === '/api/translate'
          ? await handleTranslate(API_KEY, payload)
          : await handleEvaluate(API_KEY, payload);
        sendJson(200, result);
      } catch (e) {
        sendJson(400, { error: e.message }); // komunikat ludzki, nie stack
      }
    });
    return;
  }

  // Pliki statyczne (public/)
  const file = req.url === '/' ? '/index.html' : req.url.split('?')[0];
  const full = path.join(__dirname, 'public', path.normalize(file).replace(/^(\.\.[/\\])+/, ''));
  fs.readFile(full, (err, content) => {
    if (err) { res.writeHead(404); return res.end('404'); }
    res.writeHead(200, { 'content-type': STATIC[path.extname(full)] || 'application/octet-stream' });
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log(`\n  ✅ Militaria Translator działa:  http://localhost:${PORT}\n     Zatrzymaj: Ctrl+C\n`);
});
