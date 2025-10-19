# 🚀 Deploy Clapo Game to Vercel (Step-by-Step)

## ✅ Code Already Pushed to GitHub!

**Repository:** https://github.com/Utkarsh1446/clapogame

---

## Quick Deploy (5 minutes)

### Step 1: Go to Vercel

Visit: **https://vercel.com/new**

### Step 2: Import Your Repository

1. Click **"Import Git Repository"**
2. If not connected, click **"Connect to GitHub"**
3. Search for: `Utkarsh1446/clapogame`
4. Click **"Import"**

### Step 3: Configure Project

**Important Settings:**

| Setting | Value |
|---------|-------|
| Framework Preset | **Next.js** (auto-detected) |
| Root Directory | `clapo-frontend` ← **IMPORTANT!** |
| Build Command | `npm run build` (default) |
| Output Directory | `.next` (default) |
| Install Command | `npm install` (default) |

**⚠️ CRITICAL:** Make sure to set **Root Directory** to `clapo-frontend` since your Next.js app is in a subfolder!

### Step 4: Add Environment Variables

Click **"Environment Variables"** and add these **5 variables**:

#### Variable 1:
- **Name:** `NEXT_PUBLIC_ASSET_REGISTRY_ADDRESS`
- **Value:** `0xC0606efe733A23540708Ce34d44c6E4f53F56f50`

#### Variable 2:
- **Name:** `NEXT_PUBLIC_NFT_VAULT_ADDRESS`
- **Value:** `0xeffF5D7Dd3C754C4cb4D8e68FB8773AF853b5DaC`

#### Variable 3:
- **Name:** `NEXT_PUBLIC_PYTH_ORACLE_ADDRESS`
- **Value:** `0x2880aB155794e7179c9eE2e38200202908C17B43`

#### Variable 4:
- **Name:** `NEXT_PUBLIC_MATCHMAKER_ADDRESS`
- **Value:** `0x1ac16cE4F9158a11152a90C61A66aF9eBdA10067`

#### Variable 5:
- **Name:** `NEXT_PUBLIC_CLAPO_NFT_ADDRESS`
- **Value:** `0x19432D872C790CaBA08B5b99bad907d5360D90eA`

### Step 5: Deploy!

1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. Your site will be live! 🎉

**You'll get a URL like:** `https://clapogame.vercel.app` or `https://clapogame-[random].vercel.app`

---

## Visual Guide

### Screenshot 1: Import Project
```
┌────────────────────────────────────────┐
│  Import Git Repository                 │
│                                        │
│  Search: Utkarsh1446/clapogame         │
│  ✓ Found                               │
│                                        │
│  [Import] ←── Click this               │
└────────────────────────────────────────┘
```

### Screenshot 2: Configure Build Settings
```
┌────────────────────────────────────────┐
│  Configure Project                     │
│                                        │
│  Framework Preset: Next.js ✓           │
│                                        │
│  Root Directory: clapo-frontend ⚠️     │
│  ^^^ MUST SET THIS ^^^                 │
│                                        │
│  Build Command: npm run build          │
│  Output Directory: .next               │
└────────────────────────────────────────┘
```

### Screenshot 3: Environment Variables
```
┌────────────────────────────────────────┐
│  Environment Variables                 │
│                                        │
│  [Add New]                             │
│                                        │
│  Name: NEXT_PUBLIC_ASSET_REGISTRY...  │
│  Value: 0xC060...                      │
│                                        │
│  (Add all 5 variables)                 │
└────────────────────────────────────────┘
```

---

## Copy-Paste Environment Variables

For quick setup, copy all 5 lines below:

```env
NEXT_PUBLIC_ASSET_REGISTRY_ADDRESS=0xC0606efe733A23540708Ce34d44c6E4f53F56f50
NEXT_PUBLIC_NFT_VAULT_ADDRESS=0xeffF5D7Dd3C754C4cb4D8e68FB8773AF853b5DaC
NEXT_PUBLIC_PYTH_ORACLE_ADDRESS=0x2880aB155794e7179c9eE2e38200202908C17B43
NEXT_PUBLIC_MATCHMAKER_ADDRESS=0x1ac16cE4F9158a11152a90C61A66aF9eBdA10067
NEXT_PUBLIC_CLAPO_NFT_ADDRESS=0x19432D872C790CaBA08B5b99bad907d5360D90eA
```

Add them one by one in the Vercel dashboard.

---

## After Deployment

### Test Your Deployment

1. **Visit Your URL**
   - Click the deployment URL Vercel provides

2. **Check Console**
   - Open DevTools (F12)
   - No errors should appear

3. **Connect Wallet**
   - Click "Connect Wallet"
   - Switch to Monad Testnet (Chain ID: 10143)

4. **Create Test Match**
   - Build portfolio (7 assets)
   - Enter NFT ID: 2, 3, 4, 5, or 6
   - Create match!

---

## Troubleshooting

### Build Fails with "Module not found"

**Cause:** Wrong root directory

**Fix:**
1. Go to Project Settings
2. Set Root Directory to `clapo-frontend`
3. Redeploy

### Environment Variables Not Working

**Cause:** Variables added after deployment

**Fix:**
1. Go to Project Settings → Environment Variables
2. Verify all 5 variables are present
3. Click "Redeploy" on latest deployment

### "Cannot read properties of undefined"

**Cause:** Missing environment variables

**Fix:**
- Check all variable names start with `NEXT_PUBLIC_`
- Verify values are correct (no extra spaces)
- Redeploy

---

## Custom Domain (Optional)

### Add Your Own Domain

1. Go to **Project Settings → Domains**
2. Click **"Add Domain"**
3. Enter your domain (e.g., `clapo.game`)
4. Follow DNS instructions
5. Wait 24-48 hours for propagation

---

## Auto-Deploy on Git Push

Vercel automatically redeploys when you push to GitHub!

```bash
cd "Clapo Game"
git add .
git commit -m "Update game features"
git push
```

Your site will auto-update in 2-3 minutes! 🚀

---

## Success Checklist

After deployment, verify:

- [ ] Site loads at Vercel URL
- [ ] No console errors
- [ ] "Connect Wallet" button works
- [ ] Can switch to Monad Testnet
- [ ] Assets display in portfolio builder
- [ ] Can select 7 assets
- [ ] Leader/Co-Leader selection works
- [ ] Can enter NFT ID
- [ ] Create Match button submits transaction
- [ ] NFTs visible on Monad Explorer

---

## Your Deployment Info

**GitHub Repo:** https://github.com/Utkarsh1446/clapogame
**Vercel URL:** `https://clapogame.vercel.app` (or similar)
**Network:** Monad Testnet (10143)

**Contract Addresses:**
- AssetRegistry: `0xC0606efe733A23540708Ce34d44c6E4f53F56f50`
- NFTVault: `0xeffF5D7Dd3C754C4cb4D8e68FB8773AF853b5DaC`
- Matchmaker: `0x1ac16cE4F9158a11152a90C61A66aF9eBdA10067`
- ClapoNFT: `0x19432D872C790CaBA08B5b99bad907d5360D90eA`

---

## Next Steps

1. ✅ Deploy to Vercel
2. ✅ Test on live site
3. ✅ Share with friends
4. ✅ Post on Twitter/Discord
5. ✅ Gather feedback
6. ✅ Iterate and improve!

---

## 🎉 You're Ready!

**Your Clapo Game is:**
- ✅ On GitHub
- ⏳ Ready for Vercel
- ✅ Contracts live on Monad
- ✅ NFTs minted
- ✅ Pyth oracle working

**Just click deploy and you're done!** 🚀

---

**Need Help?**
- Vercel Docs: https://vercel.com/docs
- Vercel Support: https://vercel.com/support
- GitHub Issues: https://github.com/Utkarsh1446/clapogame/issues
