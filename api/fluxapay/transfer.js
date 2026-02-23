// Vercel Serverless Function: POST /api/fluxapay/transfer
// Calls real Fluxapay Payout API to transfer USDC on Base
const { v4: uuidv4 } = require('uuid');

const WALLET_API = 'https://walletapi.fluxapay.xyz';
const AGENT_ID_API = 'https://agentid.fluxapay.xyz';
const USDC_BASE_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

// Convert USDC amount to atomic units (6 decimals)
function toAtomicUnits(usdcAmount) {
  return String(Math.round(usdcAmount * 1_000_000));
}

// Refresh JWT if we have agent_id and token
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

  // Validate amount (10-20 USDC)
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

  // Check for Fluxapay credentials
  const agentId = process.env.AGENT_ID;
  const agentToken = process.env.AGENT_TOKEN;
  let agentJwt = process.env.AGENT_JWT;

  if (!agentId || !agentJwt) {
    return res.status(500).json({
      success: false,
      error: 'Fluxapay credentials not configured. Set AGENT_ID and AGENT_JWT environment variables.'
    });
  }

  // Try to refresh JWT for freshness
  if (agentToken) {
    const freshJwt = await refreshJwt(agentId, agentToken).catch(() => null);
    if (freshJwt) {
      agentJwt = freshJwt;
    }
  }

  // Create payout via Fluxapay API
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

    return res.json({
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
    return res.status(500).json({
      success: false,
      error: 'Failed to connect to Fluxapay: ' + err.message
    });
  }
};
