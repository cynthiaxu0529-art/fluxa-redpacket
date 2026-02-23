// Vercel Serverless Function: GET /api
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  return res.json({
    status: 'ok',
    service: 'fluxa-redpacket',
    endpoints: {
      'POST /api/fluxapay/transfer': 'Transfer USDC via Fluxapay'
    },
    timestamp: new Date().toISOString()
  });
};
