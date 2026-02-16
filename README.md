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
| 🧧 发红包 | 指定金额 + 祝福语 | ✅ |
| 🎁 拆红包 | 点击随机金额（≤$5） | ✅ |
| 🐴 马年祝福 | 15+ 带"马"字的祝福语 | ✅ |
| 💰 余额管理 | 实时显示余额变化 | ✅ |
| 📜 发送历史 | 记录所有红包 | ✅ |
| 🎉 庆祝动画 | 发送/拆开成功特效 | ✅ |
| 🔗 领取页面 | 红包链接可查看详情 | ✅ |

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
http://localhost:3001
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
1. 输入金额（USDC）
2. 写下祝福语（可选）
3. 点击 "发送红包"
4. 🎉 庆祝动画！
5. 对方收到通知
```

### 3. 拆红包（对方）

```
1. 收到红包链接
2. 点击 "拆红包"
3. 🎰 随机金额（0.01-5 USDC）
4. 🐴 随机"马"字祝福语
5. 🎉 庆祝动画！
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

---

## 🔗 相关项目

- **FluxA Wallet**: https://agentwallet.fluxapay.xyz
- **FluxA Monetization**: https://github.com/cynthiaxu0529-art/fluxa-monetization
- **x402 Protocol**: https://github.com/fluxapay/fluxa-protocol

---

## 📝 更新日志

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
