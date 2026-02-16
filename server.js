/**
 * FluxA Red Packet Server
 * 
 * 红包发送服务
 * 
 * 功能：
 * 1. 发送红包
 * 2. 查询历史
 * 3. WebSocket 实时通知
 */

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// 中间件
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ========== 数据存储 ==========
// 模拟数据库
const wallets = {
  '0x_demo_wallet': {
    balance: 1000, // 初始余额
    sentPackets: [],
    receivedPackets: []
  }
};

// 交易记录
const transactions = [];
const redPackets = [];

// ========== API 端点 ==========

// 获取钱包余额
app.get('/api/wallet/:address/balance', (req, res) => {
  const { address } = req.params;
  const wallet = wallets[address] || { balance: 0 };
  
  res.json({
    address,
    balance: wallet.balance,
    sentCount: (wallet.sentPackets || []).length,
    receivedCount: (wallet.receivedPackets || []).length
  });
});

// 模拟连接钱包
app.post('/api/wallet/connect', (req, res) => {
  const { address } = req.body;
  
  if (!wallets[address]) {
    wallets[address] = {
      balance: 1000, // 新钱包初始 1000 USDC
      sentPackets: [],
      receivedPackets: []
    };
  }
  
  res.json({
    success: true,
    address,
    balance: wallets[address].balance
  });
});

// 发送红包
app.post('/api/redpacket/send', (req, res) => {
  const { sender, recipient, amount, message } = req.body;
  
  // 验证参数
  if (!sender || !recipient || !amount || amount < 0.1) {
    return res.status(400).json({
      success: false,
      error: 'Invalid parameters. Required: sender, recipient, amount >= 0.1'
    });
  }
  
  // 获取发送者钱包
  const senderWallet = wallets[sender];
  if (!senderWallet || senderWallet.balance < amount) {
    return res.status(400).json({
      success: false,
      error: 'Insufficient balance'
    });
  }
  
  // 扣除余额
  senderWallet.balance -= amount;
  
  // 创建红包记录
  const packet = {
    id: 'rp_' + uuidv4().slice(0, 8),
    sender,
    recipient,
    amount,
    message,
    txHash: '0x' + uuidv4().replace(/-/g, ''),
    timestamp: new Date().toISOString(),
    status: 'sent'
  };
  
  // 更新记录
  senderWallet.sentPackets.push(packet);
  
  if (!wallets[recipient]) {
    wallets[recipient] = {
      balance: 0,
      sentPackets: [],
      receivedPackets: []
    };
  }
  wallets[recipient].receivedPackets.push(packet);
  
  // 保存交易
  transactions.push({
    ...packet,
    type: 'redpacket'
  });
  
  // 广播给所有连接的客户端
  broadcast({
    type: 'redpacket_sent',
    packet
  });
  
  console.log(`🧧 红包发送: ${amount} USDC -> ${recipient}`);
  
  res.json({
    success: true,
    packet: {
      id: packet.id,
      txHash: packet.txHash,
      amount,
      recipient
    },
    newBalance: senderWallet.balance
  });
});

// 获取红包历史
app.get('/api/redpacket/history/:address', (req, res) => {
  const { address } = req.params;
  const wallet = wallets[address];
  
  if (!wallet) {
    return res.json({
      address,
      history: [],
      balance: 0
    });
  }
  
  // 合并发送和接收历史
  const history = [
    ...wallet.receivedPackets.map(p => ({ ...p, direction: 'received' })),
    ...wallet.sentPackets.map(p => ({ ...p, direction: 'sent' }))
  ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  res.json({
    address,
    history,
    balance: wallet.balance
  });
});

// 获取红包信息
app.get('/api/redpacket/info/:id', (req, res) => {
  const { id } = req.params;
  const packet = transactions.find(t => t.id === id);
  
  if (!packet) {
    return res.status(404).json({ error: '红包不存在' });
  }
  
  res.json({
    packet: {
      id: packet.id,
      sender: packet.sender,
      amount: packet.amount,
      blessing: packet.message
    }
  });
});

// Fluxapay 转账 API
app.post('/api/fluxapay/transfer', async (req, res) => {
  const { to, amount } = req.body;
  
  // 验证参数
  if (!to || !amount || amount < 10 || amount > 20) {
    return res.status(400).json({
      success: false,
      error: 'Invalid parameters. Amount must be 10-20 USDC, and wallet address required.'
    });
  }
  
  // 验证钱包地址格式
  if (!to.startsWith('0x') || to.length !== 42) {
    return res.status(400).json({
      success: false,
      error: 'Invalid wallet address format. Must be 0x followed by 40 hex characters.'
    });
  }
  
  // 这里调用真实的 Fluxapay API
  // 模拟转账过程
  try {
    // 模拟 Fluxapay API 调用
    const txHash = '0x' + uuidv4().replace(/-/g, '');
    
    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log(`💸 Fluxapay 转账: ${amount} USDC -> ${to}`);
    console.log(`   交易哈希: ${txHash}`);
    
    res.json({
      success: true,
      txHash: txHash,
      amount: amount,
      to: to,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Transfer failed: ' + err.message
    });
  }
});

// 获取所有交易记录
app.get('/api/transactions', (req, res) => {
  res.json({
    count: transactions.length,
    transactions: transactions.slice(-50)
  });
});

// 模拟支付（用于测试）
app.post('/api/faucet', (req, res) => {
  const { address } = req.body;
  
  if (!wallets[address]) {
    wallets[address] = {
      balance: 1000,
      sentPackets: [],
      receivedPackets: []
    };
  }
  
  wallets[address].balance += 100;
  
  res.json({
    success: true,
    newBalance: wallets[address].balance
  });
});

// ========== WebSocket ==========

function broadcast(message) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

wss.on('connection', (ws) => {
  console.log('🔌 新客户端连接');
  
  ws.on('close', () => {
    console.log('🔌 客户端断开');
  });
});

// ========== 页面路由 ==========

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/redpacket/:id', (req, res) => {
  // 红包领取页面
  const packet = transactions.find(t => t.id === req.params.id);
  
  if (!packet) {
    return res.status(404).send('红包不存在或已过期');
  }
  
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>🧧 收到红包</title>
      <style>
        body {
          font-family: -apple-system, sans-serif;
          background: linear-gradient(135deg, #1a1a2e, #16213e);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
        .card {
          background: linear-gradient(135deg, #ff6b6b, #d63031);
          border-radius: 20px;
          padding: 40px;
          text-align: center;
          max-width: 400px;
        }
        h1 { font-size: 3em; margin-bottom: 20px; }
        .amount { font-size: 2.5em; font-weight: bold; }
        .message { margin: 20px 0; font-style: italic; }
        .sender { color: rgba(255,255,255,0.8); }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>🧧</h1>
        <div class="amount">${packet.amount} USDC</div>
        <div class="message">"${packet.message}"</div>
        <div class="sender">来自: ${packet.sender.slice(0,6)}...${packet.sender.slice(-4)}</div>
      </div>
    </body>
    </html>
  `);
});

// ========== 启动 ==========

const PORT = process.env.PORT || 3003;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔════════════════════════════════════════════════════╗
║                                                    ║
║   🧧 FluxA Red Packet Server                      ║
║                                                    ║
║   🌐 http://localhost:${PORT}                        ║
║                                                    ║
║   ✨ 红包功能正常                                   ║
║   🔗 钱包连接正常                                   ║
║   📜 历史记录正常                                   ║
║   🔄 WebSocket 实时通知正常                        ║
║                                                    ║
╚════════════════════════════════════════════════════╝
  `);
});

process.on('SIGTERM', () => {
  console.log('📴 关闭服务器...');
  server.close(() => {
    process.exit(0);
  });
});
