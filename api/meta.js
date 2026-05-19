// Vercel serverless - metadane dla UI (lista typów/języków).
const { getMeta } = require('../src/handlers.js');

module.exports = (req, res) => {
  res.status(200).json(getMeta());
};
