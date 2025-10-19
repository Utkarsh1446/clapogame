# 🚀 Deploy Clapo Game Frontend to Vercel

## Quick Deploy Guide

### Option 1: Deploy via Vercel Dashboard (Easiest)

1. **Go to Vercel**
   - Visit: https://vercel.com
   - Sign up or login with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select "Import Git Repository"
   - If not connected to GitHub, push your code first (see below)

3. **Configure Project**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `clapo-frontend`
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

4. **Add Environment Variables**

   Click "Environment Variables" and add these:

   ```env
   NEXT_PUBLIC_ASSET_REGISTRY_ADDRESS=0xC0606efe733A23540708Ce34d44c6E4f53F56f50
   NEXT_PUBLIC_NFT_VAULT_ADDRESS=0xeffF5D7Dd3C754C4cb4D8e68FB8773AF853b5DaC
   NEXT_PUBLIC_PYTH_ORACLE_ADDRESS=0x2880aB155794e7179c9eE2e38200202908C17B43
   NEXT_PUBLIC_MATCHMAKER_ADDRESS=0x1ac16cE4F9158a11152a90C61A66aF9eBdA10067
   NEXT_PUBLIC_CLAPO_NFT_ADDRESS=0x19432D872C790CaBA08B5b99bad907d5360D90eA
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your site will be live at: `https://your-project.vercel.app`

---

### Option 2: Deploy via Vercel CLI

1. **Login to Vercel**
   ```bash
   cd clapo-frontend
   vercel login
   ```

   Follow the email verification link

2. **Deploy**
   ```bash
   vercel
   ```

   Answer the prompts:
   - Set up and deploy? **Yes**
   - Which scope? **Your account**
   - Link to existing project? **No**
   - Project name? **clapo-game** (or your choice)
   - Directory? **./clapo-frontend**
   - Override settings? **No**

3. **Add Environment Variables**
   ```bash
   vercel env add NEXT_PUBLIC_ASSET_REGISTRY_ADDRESS
   # Paste: 0xC0606efe733A23540708Ce34d44c6E4f53F56f50

   vercel env add NEXT_PUBLIC_NFT_VAULT_ADDRESS
   # Paste: 0xeffF5D7Dd3C754C4cb4D8e68FB8773AF853b5DaC

   vercel env add NEXT_PUBLIC_PYTH_ORACLE_ADDRESS
   # Paste: 0x2880aB155794e7179c9eE2e38200202908C17B43

   vercel env add NEXT_PUBLIC_MATCHMAKER_ADDRESS
   # Paste: 0x1ac16cE4F9158a11152a90C61A66aF9eBdA10067

   vercel env add NEXT_PUBLIC_CLAPO_NFT_ADDRESS
   # Paste: 0x19432D872C790CaBA08B5b99bad907d5360D90eA
   ```

4. **Redeploy with Environment Variables**
   ```bash
   vercel --prod
   ```

---

### Option 3: Push to GitHub First

If you want to connect via GitHub:

1. **Initialize Git Repository**
   ```bash
   cd "Clapo Game"
   git init
   git add .
   git commit -m "Initial commit - Clapo Game"
   ```

2. **Create GitHub Repository**
   - Go to: https://github.com/new
   - Name: `clapo-game`
   - Don't initialize with README
   - Click "Create repository"

3. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/clapo-game.git
   git branch -M main
   git push -u origin main
   ```

4. **Deploy from GitHub**
   - Go to Vercel Dashboard
   - Click "Import Project"
   - Select your GitHub repository
   - Follow Option 1 steps above

---

## Environment Variables Reference

Copy these exactly as shown:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_ASSET_REGISTRY_ADDRESS` | `0xC0606efe733A23540708Ce34d44c6E4f53F56f50` |
| `NEXT_PUBLIC_NFT_VAULT_ADDRESS` | `0xeffF5D7Dd3C754C4cb4D8e68FB8773AF853b5DaC` |
| `NEXT_PUBLIC_PYTH_ORACLE_ADDRESS` | `0x2880aB155794e7179c9eE2e38200202908C17B43` |
| `NEXT_PUBLIC_MATCHMAKER_ADDRESS` | `0x1ac16cE4F9158a11152a90C61A66aF9eBdA10067` |
| `NEXT_PUBLIC_CLAPO_NFT_ADDRESS` | `0x19432D872C790CaBA08B5b99bad907d5360D90eA` |

---

## Verify Deployment

After deployment, test your site:

1. **Visit Your URL**
   - Example: `https://clapo-game.vercel.app`

2. **Check Console**
   - Open browser DevTools
   - No errors should appear

3. **Connect Wallet**
   - Click "Connect Wallet"
   - Import test wallet or use your own
   - Switch to Monad Testnet (Chain ID: 10143)

4. **Test Match Creation**
   - Build portfolio
   - Enter NFT ID
   - Create match
   - Verify transaction on Monad Explorer

---

## Troubleshooting

### Build Fails
**Error:** `Module not found` or `Cannot find module`

**Solution:**
```bash
cd clapo-frontend
npm install
npm run build
```
Fix any errors locally first, then redeploy.

### Environment Variables Not Working
**Symptom:** Contract addresses showing as undefined

**Solution:**
- Ensure all variables start with `NEXT_PUBLIC_`
- Redeploy after adding variables
- Clear cache: `vercel --force`

### Wallet Connection Issues
**Symptom:** Cannot connect wallet

**Solution:**
- Check MetaMask is installed
- Ensure Monad Testnet is added to MetaMask
- Try clearing browser cache

### Transactions Failing
**Symptom:** Transactions rejected or failing

**Solution:**
- Verify contract addresses are correct
- Check you're on Monad Testnet (Chain ID: 10143)
- Ensure you have MON tokens for gas
- Check NFT ownership before creating match

---

## Post-Deployment Checklist

- [ ] Site loads without errors
- [ ] All pages are accessible
- [ ] Wallet connection works
- [ ] Can switch to Monad Testnet
- [ ] Portfolio builder displays assets
- [ ] Can select 7 assets
- [ ] Can choose Leader/Co-Leader
- [ ] Can enter NFT ID
- [ ] Create match button works
- [ ] Transactions submit successfully

---

## Custom Domain (Optional)

Add a custom domain in Vercel Dashboard:

1. Go to Project Settings → Domains
2. Add your domain (e.g., `clapo.game`)
3. Update DNS records as instructed
4. Wait for DNS propagation (~24 hours)

---

## Useful Commands

```bash
# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs

# List projects
vercel ls

# View deployment info
vercel inspect [deployment-url]

# Remove deployment
vercel rm [deployment-url]
```

---

## Next Steps After Deployment

1. **Share Your Game**
   - Tweet the URL
   - Post in Monad Discord
   - Share with friends

2. **Monitor Usage**
   - Check Vercel Analytics
   - Monitor contract transactions
   - Track gas usage

3. **Gather Feedback**
   - Ask users to test
   - Fix bugs
   - Improve UX

4. **Iterate**
   - Add new features
   - Optimize performance
   - Enhance UI/UX

---

## Support

**Vercel Docs:** https://vercel.com/docs
**Vercel Support:** https://vercel.com/support

**Project Info:**
- Framework: Next.js 15
- Node Version: 18+
- Build Time: ~2-3 minutes
- Deploy Region: Auto (closest to users)

---

## Success!

Once deployed, your Clapo Game will be:
- ✅ Live on the internet
- ✅ Accessible via HTTPS
- ✅ Automatically scaled
- ✅ CDN-optimized
- ✅ Free (Hobby plan)

**Your game is ready to play! 🎮🎉**

---

**Deployed Contracts:** Monad Testnet
**Deployment Date:** October 19, 2025
**Status:** 🟢 Ready to Deploy
