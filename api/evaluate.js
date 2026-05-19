// Vercel serverless - ocena jakości (judge + back-translation).
// UWAGA: na free tier Vercel timeout 10s; ocena bywa wolniejsza -
// może timeoutować. Tłumaczenie samo zmieści się. To akceptowalne
// ograniczenie wariantu podglądowego (lokalny proxy nie ma tego limitu).
const { handleEvaluate } = require('../src/handlers.js');

module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Metoda niedozwolona' }); return; }
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) { res.status(500).json({ error: 'Brak ANTHROPIC_API_KEY w środowisku Vercel.' }); return; }
  try {
    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const result = await handleEvaluate(apiKey, payload);
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};
