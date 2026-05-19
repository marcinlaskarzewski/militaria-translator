// Vercel serverless - wariant dodatkowy (podgląd z dowolnego urządzenia).
// Logika współdzielona z proxy.js przez src/handlers.js (bez duplikacji).
// Klucz API z env Vercel (nigdy w repo).
const { handleTranslate } = require('../src/handlers.js');

module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Metoda niedozwolona' }); return; }
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) { res.status(500).json({ error: 'Brak ANTHROPIC_API_KEY w środowisku Vercel.' }); return; }
  try {
    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const result = await handleTranslate(apiKey, payload);
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({ error: e.message }); // komunikat ludzki
  }
};
