# 🚀 Deploy Clapo Game to Monad Testnet NOW

## ✅ Everything is Ready!

**Pyth Oracle Address Configured:** `0x2880aB155794e7179c9eE2e38200202908C17B43`

## Step-by-Step Deployment

### Step 1: Get Your Private Key

From MetaMask:
1. Click the three dots → Account Details
2. Click "Show Private Key"
3. Enter your password
4. Copy the private key (without 0x prefix)

### Step 2: Update .env File

```bash
cd "clapo-contracts"
nano .env  # or use any text editor
```

Update this line:
```env
PRIVATE_KEY=your_actual_private_key_here
```

**⚠️ IMPORTANT:**
- Remove the `0x` prefix from your private key
- Never commit this file to git
- Keep it secure!

### Step 3: Get Testnet MON Tokens

Visit any of these faucets:

1. **Official Monad Faucet**
   ```
   https://faucet.monad.xyz
   ```

2. **ETHGlobal Faucet** (0.2 MON/day)
   ```
   https://ethglobal.com/faucet/monad-testnet-10143
   ```

3. **QuickNode Faucet**
   ```
   https://faucet.quicknode.com/monad/testnet
   ```

**You need:** At least 0.5-1 MON for deployment

### Step 4: Add Monad Testnet to MetaMask

**Network Settings:**
- Network Name: `Monad Testnet`
- RPC URL: `https://testnet-rpc.monad.xyz/`
- Chain ID: `10143`
- Currency Symbol: `MON`
- Block Explorer: `https://testnet.monadexplorer.com`

Or visit: https://faucet.monad.xyz/add-network (auto-adds the network)

### Step 5: Deploy Contracts

```bash
cd "clapo-contracts"
source ~/.zshenv  # If forge not in PATH

# Deploy to Monad Testnet
forge script script/DeployMonad.s.sol:DeployMonad \
  --rpc-url https://testnet-rpc.monad.xyz/ \
  --broadcast \
  --legacy
```

**Expected Output:**
```
=== Deploying to Monad Testnet ===
Using Pyth Oracle at: 0x2880aB155794e7179c9eE2e38200202908C17B43

Deploying AssetRegistry...
AssetRegistry deployed at: 0x...
Deploying NFTVault...
NFTVault deployed at: 0x...
Deploying Matchmaker...
Matchmaker deployed at: 0x...
Deploying ClapoNFT...
ClapoNFT deployed at: 0x...

Setting up NFTVault...
Adding assets to AssetRegistry...
Added 18 assets to registry

=== MONAD TESTNET DEPLOYMENT SUMMARY ===
AssetRegistry: 0x...
NFTVault: 0x...
PythOracle: 0x2880aB155794e7179c9eE2e38200202908C17B43
Matchmaker: 0x...
ClapoNFT: 0x...
=======================================

Deployment addresses saved to .env.monad
```

**⏱️ Deployment Time:** ~1-2 minutes
**💰 Gas Cost:** ~0.08-0.1 MON

### Step 6: Verify Deployment

Check contracts on Monad Explorer:

```bash
# View the deployment addresses
cat .env.monad
```

Visit: `https://testnet.monadexplorer.com/address/[CONTRACT_ADDRESS]`

Verify each contract shows:
- ✅ Transaction Status: Success
- ✅ Contract Created
- ✅ Recent transactions

### Step 7: Configure Frontend

```bash
cd "../clapo-frontend"
cp .env.local.example .env.local

# Copy content from clapo-contracts/.env.monad to .env.local
cat "../clapo-contracts/.env.monad" > .env.local
```

Or manually edit `.env.local`:
```env
NEXT_PUBLIC_ASSET_REGISTRY_ADDRESS=0x...
NEXT_PUBLIC_NFT_VAULT_ADDRESS=0x...
NEXT_PUBLIC_PYTH_ORACLE_ADDRESS=0x2880aB155794e7179c9eE2e38200202908C17B43
NEXT_PUBLIC_MATCHMAKER_ADDRESS=0x...
NEXT_PUBLIC_CLAPO_NFT_ADDRESS=0x...
```

### Step 8: Test Frontend Locally

```bash
# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

Visit: http://localhost:3000

**Test Checklist:**
- [ ] Frontend loads without errors
- [ ] Can connect wallet
- [ ] MetaMask switches to Monad Testnet
- [ ] Can see portfolio builder
- [ ] No console errors

### Step 9: Mint Test NFTs

```bash
cd "../clapo-contracts"

# Set environment variables
export CLAPO_NFT=$(grep NEXT_PUBLIC_CLAPO_NFT_ADDRESS .env.monad | cut -d '=' -f 2)
export YOUR_ADDRESS=your_wallet_address_here

# Mint NFT #0
cast send $CLAPO_NFT \
  "mint(address)" \
  $YOUR_ADDRESS \
  --rpc-url https://testnet-rpc.monad.xyz/ \
  --private-key $PRIVATE_KEY

# Mint NFT #1 (for testing matches)
cast send $CLAPO_NFT \
  "mint(address)" \
  $YOUR_ADDRESS \
  --rpc-url https://testnet-rpc.monad.xyz/ \
  --private-key $PRIVATE_KEY
```

**Verify in MetaMask:**
- Go to NFTs tab
- You should see 2 ClapoNFT tokens

### Step 10: Test Match Creation

Using the frontend at http://localhost:3000:

1. **Build Portfolio:**
   - Select 7 crypto assets
   - Stay within 100-point budget
   - Choose Leader and Co-Leader

2. **Create Match:**
   - Enter NFT Token ID: `0`
   - Click "Create Match"
   - Approve NFT in MetaMask
   - Confirm transaction

3. **Verify on Explorer:**
   ```
   https://testnet.monadexplorer.com/address/[MATCHMAKER_ADDRESS]
   ```
   - Check for `MatchCreated` event
   - Your NFT should be in NFTVault

### Step 11: Deploy Frontend to Vercel

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Deploy
cd clapo-frontend
vercel
```

**Follow prompts:**
1. Log in to Vercel
2. Connect to repository
3. Configure project
4. Add environment variables (from `.env.local`)
5. Deploy!

**Add Environment Variables in Vercel Dashboard:**
- Go to Project Settings → Environment Variables
- Add all `NEXT_PUBLIC_*` variables
- Redeploy if needed

**Your site will be live at:**
```
https://your-project.vercel.app
```

## 🎊 Deployment Complete!

### What You've Deployed

✅ **5 Smart Contracts** on Monad Testnet
✅ **18 Crypto Assets** with real Pyth feeds
✅ **NFT Staking System** fully functional
✅ **Frontend dApp** live on Vercel

### Next Steps

1. **Share Your Deployment:**
   - Post in Monad Discord
   - Tweet about it
   - Share with friends

2. **Test with Others:**
   - Get someone to join your match
   - Test full match flow
   - Gather feedback

3. **Monitor & Iterate:**
   - Watch for bugs
   - Check gas usage
   - Improve UX

## 📊 Deployment Checklist

- [ ] Private key added to `.env`
- [ ] Got testnet MON tokens (≥0.5 MON)
- [ ] Added Monad Testnet to MetaMask
- [ ] Ran deployment script
- [ ] All 5 contracts deployed successfully
- [ ] Verified on Monad Explorer
- [ ] Configured frontend `.env.local`
- [ ] Frontend runs locally
- [ ] Minted test NFTs
- [ ] Created test match successfully
- [ ] Deployed frontend to Vercel
- [ ] Production site accessible

## 🆘 Troubleshooting

### "Insufficient funds for gas"
**Solution:** Get more MON from faucets

### "PYTH_ORACLE_ADDRESS not set"
**Solution:** Already configured! Address is `0x2880aB155794e7179c9eE2e38200202908C17B43`

### "Nonce too high"
**Solution:** Wait for pending transactions or reset MetaMask account

### "Cannot connect to RPC"
**Solution:** Check internet connection and Monad RPC status

### Frontend shows wrong network
**Solution:** Switch to Monad Testnet in MetaMask (Chain ID: 10143)

## 📞 Support

- **Monad Discord:** https://discord.gg/monad
- **Pyth Discord:** https://discord.gg/pythnetwork
- **Foundry Book:** https://book.getfoundry.sh

## 🎯 Success Criteria

When you see:
- ✅ Deployment addresses in `.env.monad`
- ✅ Contracts on Monad Explorer
- ✅ Frontend live on Vercel
- ✅ Can create matches
- ✅ NFTs transfer correctly

**You've successfully deployed Clapo Game! 🎉**

---

**Pyth Oracle:** 0x2880aB155794e7179c9eE2e38200202908C17B43
**Monad Testnet Chain ID:** 10143
**Ready to deploy!** 🚀
