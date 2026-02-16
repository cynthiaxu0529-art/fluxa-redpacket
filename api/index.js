// Vercel Serverless Function for Red Packet API
const { v4: uuidv4 } = require('uuid');

// In-memory storage (will reset on each cold start)
const wallets = {};
const transactions = [];

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const { method, url } = req;
  
  // Connect wallet
  if (method === 'POST' && url === '/api/wallet/connect') {
    const { address } = req.body;
    
    if (!wallets[address]) {
      wallets[address] = {
        balance: 1000,
        sentPackets: [],
        receivedPackets: []
      };
    }
    
    return res.json({
      success: true,
      address,
      balance: wallets[address].balance
    });
  }
  
  // Get balance
  if (method === 'GET' && url.startsWith('/api/wallet/')) {
    const address = url.split('/').pop();
    const wallet = wallets[address] || { balance: 0 };
    
    return res.json({
      address,
      balance: wallet.balance
    });
  }
  
  // Send red packet
  if (method === 'POST' && url === '/api/redpacket/send') {
    const { sender, recipient, amount, message } = req.body;
    
    if (!sender || !recipient || !amount || amount < 10 || amount > 20) {
      return res.status(400).json({
        success: false,
        error: 'Amount must be 10-20 USDC'
      });
    }
    
    const senderWallet = wallets[sender];
    if (!senderWallet || senderWallet.balance < amount) {
      return res.status(400).json({
        success: false,
        error: 'Insufficient balance'
      });
    }
    
    senderWallet.balance -= amount;
    
    const packet = {
      id: 'rp_' + uuidv4().slice(0, 8),
      sender,
      recipient,
      amount,
      message,
      txHash: '0x' + uuidv4().replace(/-/g, ''),
      timestamp: new Date().toISOString()
    };
    
    transactions.push(packet);
    
    return res.json({
      success: true,
      packet: {
        id: packet.id,
        txHash: packet.txHash,
        amount,
        recipient
      },
      newBalance: senderWallet.balance
    });
  }
  
  // Fluxapay transfer
  if (method === 'POST' && url === '/api/fluxapay/transfer') {
    const { to, amount } = req.body;
    
    if (!to || !amount || amount < 10 || amount > 20) {
      return res.status(400).json({
        success: false,
        error: 'Amount must be 10-20 USDC'
      });
    }
    
    if (!to.startsWith('0x') || to.length !== 42) {
      return res.status(400).json({
        success: false,
        error: 'Invalid wallet address'
      });
    }
    
    const txHash = '0x' + uuidv4().replace(/-/g, '');
    
    console.log(`💸 Fluxapay: ${amount} USDC -> ${to}`);
    
    return res.json({
      success: true,
      txHash,
      amount,
      to,
      timestamp: new Date().toISOString()
    });
  }
  
  // Get transactions
  if (method === 'GET' && url === '/api/transactions') {
    return res.json({
      count: transactions.length,
      transactions: transactions.slice(-50)
    });
  }
  
  // Health check
  if (method === 'GET' && url === '/') {
    return res.json({
      status: 'ok',
      service: 'fluxa-redpacket-api',
      timestamp: new Date().toISOString()
    });
  }
  
  // 404
  return res.status(404).json({ error: 'Not found' });
};
