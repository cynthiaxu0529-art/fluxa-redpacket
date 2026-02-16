# 🚀 Deploy to Vercel (Recommended)

## One-Click Deploy

Click this button:

<a href="https://vercel.com/new?project-name=fluxa-redpacket&repository-url=https://github.com/cynthiaxu0529-art/fluxa-redpacket"><img src="https://vercel.com/button" alt="Deploy with Vercel"></a>

## After Deploy - Configure Environment Variables

### Required Setup

1. Go to Vercel Dashboard: https://vercel.com/dashboard
2. Find `fluxa-redpacket` project
3. Click **Settings** → **Environment Variables**
4. Add:
   ```
   FLUXA_WALLET_ADDRESS=0x577d7Ceb8325fdf13072623E42D739a15b1a0bD8
   ```
5. Click **Save**
6. Go to **Deployments** and **Redeploy**

### Environment Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `FLUXA_WALLET_ADDRESS` | `0x577d7Ceb8325fdf13072623E42D739a15b1a0bD8` | Agent's FluxA Wallet |

---

## 🎮 Testing Flow

1. Open: `https://fluxa-redpacket.vercel.app`
2. Click "连接 FluxA 钱包"
3. Enter amount (10-20 USDC)
4. Click "发送红包"
5. Copy link and test grab

---

*Generated: 2026-02-16*
