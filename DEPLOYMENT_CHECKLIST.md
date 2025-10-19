# Clapo Game - Monad Testnet Deployment Checklist

## Pre-Deployment Setup

### 1. Get Monad Testnet Access
- [ ] Add Monad Testnet to MetaMask
  - Chain ID: `10143`
  - RPC URL: `https://testnet-rpc.monad.xyz/`
  - Currency: `MON`
  - Explorer: `https://testnet.monadexplorer.com`

- [ ] Get testnet MON tokens from faucets:
  - [ ] https://faucet.monad.xyz
  - [ ] https://ethglobal.com/faucet/monad-testnet-10143
  - [ ] https://faucet.quicknode.com/monad/testnet

**Recommended:** Get at least 1-2 MON for deployment and testing

### 2. Find Pyth Oracle Address
- [ ] Check Pyth documentation: https://docs.pyth.network/price-feeds/contract-addresses
- [ ] Check Monad oracle docs: https://docs.monad.xyz/tooling-and-infra/oracles
- [ ] Contact Pyth Discord if address not listed: https://discord.gg/pythnetwork
- [ ] Contact Monad Discord: https://discord.gg/monad

**⚠️ Critical:** Deployment will fail without the correct Pyth oracle address!

### 3. Configure Environment Files

#### Contracts Environment (clapo-contracts/.env)
```bash
cd "clapo-contracts"
cp .env.example .env
# Edit .env with your details:
```

- [ ] Set `PRIVATE_KEY` (without 0x prefix)
- [ ] Set `MONAD_RPC_URL=https://testnet-rpc.monad.xyz/`
- [ ] Set `PYTH_ORACLE_ADDRESS` (from step 2)

#### Verify Configuration
```bash
# DO NOT commit .env file!
echo ".env" >> .gitignore
```

## Contract Deployment

### 4. Test Compilation
```bash
cd "clapo-contracts"
source ~/.zshenv  # If forge not in PATH
forge build
```

- [ ] Build successful with no errors
- [ ] All contracts compiled (5 contracts + 1 interface)

### 5. Deploy to Monad Testnet
```bash
forge script script/DeployMonad.s.sol:DeployMonad \
  --rpc-url $MONAD_RPC_URL \
  --broadcast \
  --legacy
```

**Expected Output:**
```
=== MONAD TESTNET DEPLOYMENT SUMMARY ===
AssetRegistry: 0x...
NFTVault: 0x...
PythOracle: 0x...
Matchmaker: 0x...
ClapoNFT: 0x...
=======================================
```

- [ ] AssetRegistry deployed
- [ ] NFTVault deployed
- [ ] Matchmaker deployed
- [ ] ClapoNFT deployed
- [ ] All 18 assets added to registry
- [ ] NFTVault configured with whitelist
- [ ] Deployment addresses saved to `.env.monad`

**Gas Used:** ~8M gas (~0.08-0.1 MON)

### 6. Verify Deployments on Block Explorer
Visit: https://testnet.monadexplorer.com

Check each contract:
- [ ] AssetRegistry: https://testnet.monadexplorer.com/address/[ADDRESS]
- [ ] NFTVault: https://testnet.monadexplorer.com/address/[ADDRESS]
- [ ] Matchmaker: https://testnet.monadexplorer.com/address/[ADDRESS]
- [ ] ClapoNFT: https://testnet.monadexplorer.com/address/[ADDRESS]

Verify transaction status is "Success"

## Frontend Configuration

### 7. Update Frontend Environment
```bash
cd "../clapo-frontend"
cp .env.local.example .env.local
```

Copy addresses from `clapo-contracts/.env.monad`:
- [ ] `NEXT_PUBLIC_ASSET_REGISTRY_ADDRESS`
- [ ] `NEXT_PUBLIC_NFT_VAULT_ADDRESS`
- [ ] `NEXT_PUBLIC_PYTH_ORACLE_ADDRESS`
- [ ] `NEXT_PUBLIC_MATCHMAKER_ADDRESS`
- [ ] `NEXT_PUBLIC_CLAPO_NFT_ADDRESS`

### 8. Test Frontend Locally
```bash
npm install  # If not already done
npm run dev
```

- [ ] Frontend loads at http://localhost:3000
- [ ] Can connect wallet
- [ ] Can switch to Monad Testnet in MetaMask
- [ ] No console errors

## Contract Testing

### 9. Mint Test NFTs
```bash
# Save addresses as variables
export CLAPO_NFT=0x...  # From .env.monad
export YOUR_ADDRESS=0x...  # Your wallet address

# Mint NFT with ID 0
cast send $CLAPO_NFT \
  "mint(address)" \
  $YOUR_ADDRESS \
  --rpc-url $MONAD_RPC_URL \
  --private-key $PRIVATE_KEY

# Mint NFT with ID 1
cast send $CLAPO_NFT \
  "mint(address)" \
  $YOUR_ADDRESS \
  --rpc-url $MONAD_RPC_URL \
  --private-key $PRIVATE_KEY
```

- [ ] Successfully minted NFT #0
- [ ] Successfully minted NFT #1
- [ ] Can see NFTs in MetaMask (if supported)

### 10. Verify Asset Registry
```bash
# Check BTC asset
cast call $ASSET_REGISTRY \
  "getAsset(bytes32)" \
  $(cast keccak "BTC") \
  --rpc-url $MONAD_RPC_URL
```

- [ ] Returns BTC asset data (cost: 30, active: true)
- [ ] All 18 assets are queryable

### 11. Test Match Creation (Frontend)

Using the frontend at http://localhost:3000:

- [ ] Connect wallet to Monad Testnet
- [ ] Build a portfolio (7 assets, ≤100 points)
- [ ] Select Leader and Co-Leader
- [ ] Enter NFT Token ID (0 or 1)
- [ ] Click "Create Match"
- [ ] Approve NFT transfer in MetaMask
- [ ] Sign match creation transaction
- [ ] Match created successfully

**Check on block explorer:**
- [ ] NFT transferred to NFTVault
- [ ] Match created event emitted
- [ ] Match ID returned

### 12. Test Full Match Flow

**Requirements:** 2 wallets with NFTs

From Wallet 1:
- [ ] Create match with NFT #0

From Wallet 2:
- [ ] Join match with NFT #1
- [ ] Start match
- [ ] Wait 120 seconds
- [ ] Reveal picks
- [ ] Wait for opponent to reveal
- [ ] Match settles automatically

Verify:
- [ ] Winner determined correctly
- [ ] Winner receives both NFTs
- [ ] Loser loses their NFT
- [ ] Match state updated to "Settled"

## Production Deployment

### 13. Deploy Frontend to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd clapo-frontend
vercel
```

Follow prompts:
- [ ] Connect to GitHub repository
- [ ] Configure project settings
- [ ] Add environment variables from `.env.local`
- [ ] Deploy to production

**Vercel Environment Variables:**
Add all `NEXT_PUBLIC_*` variables from `.env.local`

- [ ] Deployment successful
- [ ] Site accessible at https://your-project.vercel.app
- [ ] Wallet connection works
- [ ] Can create matches on production site

### 14. Final Verification

- [ ] All contracts verified on Monad Explorer
- [ ] Frontend deployed and accessible
- [ ] Can create and join matches
- [ ] NFTs transfer correctly
- [ ] Match settlement works
- [ ] No console errors in production

## Documentation

### 15. Update Repository

- [ ] Update main README.md with deployment addresses
- [ ] Add Monad testnet badge to README
- [ ] Document any deployment issues encountered
- [ ] Update DEPLOYMENT_GUIDE.md with actual experience
- [ ] Tag release: `git tag v1.0.0-testnet`

## Post-Deployment

### 16. Monitor & Maintain

- [ ] Set up transaction monitoring
- [ ] Monitor contract gas usage
- [ ] Check Pyth oracle data freshness
- [ ] Test with multiple users
- [ ] Gather feedback
- [ ] Fix any bugs discovered

### 17. Community & Marketing

- [ ] Share deployment on Monad Discord
- [ ] Share on Pyth Discord
- [ ] Tweet about launch
- [ ] Create demo video
- [ ] Write blog post about development

## Troubleshooting

### Common Issues:

**"PYTH_ORACLE_ADDRESS not set"**
- Solution: Add Pyth oracle address to `.env` file

**"Insufficient funds for gas"**
- Solution: Get more MON from faucets

**"Nonce too high"**
- Solution: Wait for pending transactions or reset MetaMask

**Frontend can't connect to contracts**
- Solution: Verify addresses in `.env.local`
- Solution: Check network matches (Chain ID 10143)

**Pyth prices not updating**
- Solution: Verify Pyth oracle address is correct
- Solution: Check Pyth has active feeds on Monad

## Success Criteria

✅ All checkboxes above are complete
✅ Full match flow works end-to-end
✅ Frontend is live and accessible
✅ Contracts verified on block explorer
✅ Documentation is up to date

---

**Deployment Date:** ___________
**Deployer:** ___________
**Contract Addresses:** See `.env.monad`
**Frontend URL:** ___________

**Next Steps:** Monitor usage, gather feedback, iterate!
