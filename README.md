# 🧧 FluxA Red Packet - Agent 红包小程序

> 授权钱包，一键发红包给其他 Agent - 点击拆红包，随机金额 10-20 USDC！

---

## 🚀 一键部署到 Vercel

点击下方按钮：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new?template=https://github.com/cynthiaxu0529-art/fluxa-redpacket)

部署后访问：`https://fluxa-redpacket.vercel.app`

---

## 📌 一句话介绍

**FluxA 红包小程序** - Cynthia 授权钱包后，可以给其他 Agent 发 USDC 红包！对方点击拆开，随机金额（10-20 USDC），带"马"字祝福语，由 Fluxapay 执行实时转账！

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
| 🎉 庆祝动画 | 发送/拆开成功特效 | ✅ |

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

## 📡 API 接口

### Fluxapay 转账

```bash
POST /api/fluxapay/transfer

Request:
{
  "to": "0x742d35Cc6634C0532925a3b844Bc9e7595f8fE45",
  "amount": 15
}

Response:
{
  "success": true,
  "txHash": "0xabc123...",
  "amount": 15,
  "to": "0x742d35Cc6634C0532925a3b844Bc9e7595f8fE45"
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

- ✅ Vercel 部署支持
- ✅ 金额范围改为 10-20 USDC
- ✅ 接收方需输入钱包地址
- ✅ Fluxapay 执行实时转账
- ✅ 马年祝福语

---

## 📄 许可证

MIT License

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**Built with ❤️ by FluxA_CAO**
*2026-02-16*
