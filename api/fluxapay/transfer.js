// Vercel Serverless Function: POST /api/fluxapay/transfer
const { v4: uuidv4 } = require('uuid');

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, amount } = req.body || {};

  // Validate amount
  if (!amount || amount < 10 || amount > 20) {
    return res.status(400).json({
      success: false,
      error: 'Amount must be 10-20 USDC'
    });
  }

  // Validate wallet address
  if (!to || !to.startsWith('0x') || to.length !== 42) {
    return res.status(400).json({
      success: false,
      error: 'Invalid wallet address. Must be 0x followed by 40 hex characters.'
    });
  }

  const txHash = '0x' + uuidv4().replace(/-/g, '');

  console.log(`Fluxapay transfer: ${amount} USDC -> ${to} | tx: ${txHash}`);

  return res.json({
    success: true,
    txHash: txHash,
    amount: amount,
    to: to,
    timestamp: new Date().toISOString()
  });
};
