/**
 * FluxA Red Packet Server (Local Development)
 *
 * Serves the red packet claim page and calls real Fluxapay Payout API.
 * For production, deploy to Vercel (uses api/ directory for routing).
 *
 * Required environment variables:
 *   AGENT_ID    - Fluxapay agent ID
 *   AGENT_JWT   - Fluxapay JWT token
 *   AGENT_TOKEN - (optional) Fluxapay agent token for JWT refresh
 */

const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const WALLET_API = 'https://walletapi.fluxapay.xyz';
const AGENT_ID_API = 'https://agentid.fluxapay.xyz';
const USDC_BASE_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

function toAtomicUnits(usdcAmount) {
  return String(Math.round(usdcAmount * 1_000_000));
}

async function refreshJwt(agentId, agentToken) {
  const resp = await fetch(AGENT_ID_API + '/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ agent_id: agentId, token: agentToken })
  });
  if (!resp.ok) return null;
  const data = await resp.json();
  return data.jwt || null;
}

// Fluxapay payout API
app.post('/api/fluxapay/transfer', async (req, res) => {
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

  // Check credentials
  const agentId = process.env.AGENT_ID;
  const agentToken = process.env.AGENT_TOKEN;
  let agentJwt = process.env.AGENT_JWT;

  if (!agentId || !agentJwt) {
    return res.status(500).json({
      success: false,
      error: 'Fluxapay credentials not configured. Set AGENT_ID and AGENT_JWT environment variables.'
    });
  }

  // Refresh JWT
  if (agentToken) {
    const freshJwt = await refreshJwt(agentId, agentToken).catch(() => null);
    if (freshJwt) agentJwt = freshJwt;
  }

  // Create payout
  const payoutId = 'redpacket_' + uuidv4().slice(0, 12);
  const atomicAmount = toAtomicUnits(amount);

  try {
    const payoutResp = await fetch(WALLET_API + '/api/payouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + agentJwt,
        'x-agent-id': agentId
      },
      body: JSON.stringify({
        agentId: agentId,
        toAddress: to,
        amount: atomicAmount,
        currency: 'USDC',
        network: 'base',
        assetAddress: USDC_BASE_ADDRESS,
        payoutId: payoutId
      })
    });

    const payoutData = await payoutResp.json();

    if (!payoutResp.ok) {
      console.error('Fluxapay payout error:', payoutData);
      return res.status(payoutResp.status).json({
        success: false,
        error: payoutData.error || payoutData.message || 'Payout request failed'
      });
    }

    console.log(`Fluxapay payout created: ${amount} USDC -> ${to} | payoutId: ${payoutId}`);

    res.json({
      success: true,
      payoutId: payoutId,
      txHash: payoutData.txHash || null,
      status: payoutData.status || 'pending_authorization',
      authorizationUrl: payoutData.authorizationUrl || null,
      amount: amount,
      to: to,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Fluxapay payout exception:', err.message);
    res.status(500).json({
      success: false,
      error: 'Failed to connect to Fluxapay: ' + err.message
    });
  }
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
