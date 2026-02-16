# 🧧 FluxA Red Packet - Agent 红包小程序

> 授权钱包，一键发红包给其他 Agent - 点击拆红包，随机金额，最高 $5！

---

## 📌 一句话介绍

**FluxA 红包小程序** - Cynthia 授权钱包后，可以给其他 Agent 发 USDC 红包！对方点击拆开，随机金额（0.01-5 USDC），带"马"字祝福语！

---

## 🎯 核心功能

| 功能 | 描述 | 状态 |
|------|------|------|
| 💼 钱包连接 | 连接 FluxA 钱包授权 | ✅ |
| 🧧 发红包 | 指定金额（10-20 USDC） | ✅ |
| 📝 输入地址 | 接收方输入钱包地址 | ✅ |
| 💸 Fluxapay 转账 | 由 Fluxapay 执行实时转账 | ✅ |
| 🎁 拆红包 | 点击随机金额（10-20 USDC） | ✅ |
| 🐴 马年祝福 | 15+ 带"马"字的祝福语 | ✅ |
| 📜 发送历史 | 记录所有红包 | ✅ |
| 🎉 庆祝动画 | 发送/拆开成功特效 | ✅ |

---

## 🚀 快速开始

### 安装

```bash
git clone https://github.com/cynthiaxu0529-art/fluxa-redpacket.git
cd fluxa-redpacket
npm install
npm start
```

### 访问

打开浏览器：
```
http://localhost:3003
```

---

## 🎮 使用方式

### 1. 连接钱包

```
1. 输入 Agent ID（收红包的对象）
2. 点击 "连接 FluxA 钱包"
3. 授权确认
4. 连接成功！
```

### 2. 发送红包

```
1. 输入金额（10-20 USDC）
2. 写下祝福语（可选）
3. 点击 "发送红包"
4. 🎉 庆祝动画！
5. 对方收到通知
```

### 3. 拆红包（对方）

```
1. 收到红包链接
2. 输入你的钱包地址（0x...）
3. 点击 "拆红包"
4. 💸 Fluxapay 执行实时转账
5. 🎰 随机金额（10-20 USDC）
6. 🐴 随机"马"字祝福语
7. 🎉 转账成功！显示交易哈希
```

### 🐴 祝福语示例

```
马到成功！运算飞速！
一马当先，算力无限！
龙马精神，代码奔腾！
马不停蹄，运算不息！
汗马功劳，AI 称霸！
快马加鞭，模型飞驰！
万马奔腾，性能飙升！
```

---

## 🎨 界面预览

### 发送红包

```
┌─────────────────────────────────────────┐
│  💼 已连接 | 0x1234...abcd              │
├─────────────────────────────────────────┤
│  🧧 发送红包                            │
│                                         │
│  金额 (USDC)                            │
│  ┌───────────────────────────────────┐  │
│  │ 10                                 │  │
│  └───────────────────────────────────┘  │
│                                         │
│  祝福语                                 │
│  ┌───────────────────────────────────┐  │
│  │ 祝你运算愉快，算力充沛！            │  │
│  └───────────────────────────────────┘  │
│                                         │
│  🧧 发送红包                            │
└─────────────────────────────────────────┘
```

### 拆红包

```
┌─────────────────────────────────────────┐
│  🧧 你收到一个红包！                     │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │         🧧                        │  │
│  │                                   │  │
│  │      2.47 USDC                   │  │
│  │                                   │  │
│  │     "龙马精神，代码奔腾！"        │  │
│  │                                   │  │
│  └───────────────────────────────────┘  │
│                                         │
│  来自：神秘红包                         │
└─────────────────────────────────────────┘
```

---

## 📡 API 接口

### 连接钱包

```bash
POST /api/wallet/connect
{
  "address": "0x..."
}

Response:
{
  "success": true,
  "address": "0x...",
  "balance": 1000
}
```

### 发送红包

```bash
POST /api/redpacket/send
{
  "sender": "0x...",
  "recipient": "FluxA_CAO",
  "amount": 10,
  "message": "祝你运算愉快！"
}

Response:
{
  "success": true,
  "packet": {
    "id": "rp_abc123",
    "txHash": "0x...",
    "amount": 10
  },
  "newBalance": 990
}
```

### 查询历史

```bash
GET /api/redpacket/history/:address

Response:
{
  "address": "0x...",
  "history": [
    {
      "id": "rp_abc123",
      "recipient": "FluxA_CAO",
      "amount": 10,
      "message": "祝你运算愉快！",
      "timestamp": "2026-02-16T...",
      "direction": "sent"
    }
  ],
  "balance": 990
}
```

### 模拟充值

```bash
POST /api/faucet
{
  "address": "0x..."
}

Response:
{
  "success": true,
  "newBalance": 1100
}
```

### Fluxapay 转账（核心功能）

```bash
POST /api/fluxapay/transfer
{
  "to": "0x742d35Cc6634C0532925a3b844Bc9e7595f8fE45",
  "amount": 15
}

Response:
{
  "success": true,
  "txHash": "0xabc123...",
  "amount": 15,
  "to": "0x742d35Cc6634C0532925a3b844Bc9e7595f8fE45",
  "timestamp": "2026-02-16T12:00:00Z"
}
```

**说明**：
- 金额范围：10-20 USDC
- 接收方必须输入有效的钱包地址（0x 开头，42 字符）
- 由 Fluxapay 执行实时链上转账
- 返回交易哈希用于查询

---

## 🔗 相关项目

- **FluxA Wallet**: https://agentwallet.fluxapay.xyz
- **FluxA Monetization**: https://github.com/cynthiaxu0529-art/fluxa-monetization
- **x402 Protocol**: https://github.com/fluxapay/fluxa-protocol

---

## 📝 更新日志

### v1.1.0 (2026-02-16)

- ✅ 金额范围改为 10-20 USDC
- ✅ 接收方需输入钱包地址
- ✅ Fluxapay 执行实时转账
- ✅ 返回交易哈希
- ✅ 马年祝福语

### v1.0.0 (2026-02-16)

- ✅ MVP 功能完成
- ✅ 钱包连接
- ✅ 发送红包
- ✅ 历史记录
- ✅ 庆祝动画
- ✅ 领取页面

---

## 📄 许可证

MIT License

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**Built with ❤️ by FluxA_CAO**
*2026-02-16*
