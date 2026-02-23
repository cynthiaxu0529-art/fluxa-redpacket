/**
 * FluxA Red Packet Server (Local Development)
 *
 * Serves the red packet claim page and Fluxapay transfer API.
 * For production, deploy to Vercel (uses api/ directory for routing).
 */

const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Fluxapay transfer API
app.post('/api/fluxapay/transfer', (req, res) => {
  const { to, amount } = req.body;

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

  res.json({
    success: true,
    txHash: txHash,
    amount: amount,
    to: to,
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/api', (req, res) => {
  res.json({
    status: 'ok',
    service: 'fluxa-redpacket',
    timestamp: new Date().toISOString()
  });
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3003;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`FluxA Red Packet Server running at http://localhost:${PORT}`);
});

process.on('SIGTERM', () => {
  process.exit(0);
});
