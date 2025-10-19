# Clapo Game - Complete Deployment Guide

## Prerequisites

- Node.js 18+ installed
- Foundry installed
- MetaMask or compatible Web3 wallet
- Git

## Step 1: Deploy Smart Contracts (Local Testing)

### 1.1 Start Local Blockchain

```bash
# Open Terminal 1
anvil
```

Keep this running. Note the private keys shown.

### 1.2 Deploy Contracts

```bash
# Open Terminal 2
cd clapo-contracts

# Create .env file
echo "PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80" > .env

# Deploy contracts
source ~/.zshenv
forge script script/Deploy.s.sol:DeployScript --fork-url http://localhost:8545 --broadcast

# Save the deployed addresses
cat .env.deployed
```

### 1.3 Mint Test NFTs

```bash
# In Terminal 2 (clapo-contracts)
cast send <CLAPO_NFT_ADDRESS> "mint(address)" <YOUR_ADDRESS> \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  --rpc-url http://localhost:8545

# Mint NFT for second player
cast send <CLAPO_NFT_ADDRESS> "mint(address)" 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  --rpc-url http://localhost:8545
```

## Step 2: Configure Frontend

### 2.1 Install Dependencies

```bash
# Open Terminal 3
cd clapo-frontend
npm install
```

### 2.2 Create Environment File

```bash
# Create .env.local
cat > .env.local << EOF
NEXT_PUBLIC_MATCHMAKER_ADDRESS=<from .env.deployed>
NEXT_PUBLIC_ASSET_REGISTRY_ADDRESS=<from .env.deployed>
NEXT_PUBLIC_NFT_VAULT_ADDRESS=<from .env.deployed>
NEXT_PUBLIC_CLAPO_NFT_ADDRESS=<from .env.deployed>
NEXT_PUBLIC_MOCK_PYTH_ADDRESS=<from .env.deployed>
EOF
```

### 2.3 Start Frontend

```bash
npm run dev
```

Open http://localhost:3000

## Step 3: Test the Game

### 3.1 Connect Wallet

1. Open MetaMask
2. Add local network:
   - Network Name: Anvil Local
   - RPC URL: http://localhost:8545
   - Chain ID: 31337
   - Currency: ETH

3. Import test account:
   - Private Key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`

### 3.2 Create a Match

1. Click "Connect Wallet"
2. Select 7 crypto assets (within 100 points)
3. Choose Leader (2× multiplier)
4. Choose Co-Leader (1.5× multiplier)
5. Enter NFT Token ID: `0`
6. Click "Create Match"
7. Approve transaction in MetaMask

### 3.3 Play the Game

Two options for testing:

**Option A: Single Browser (Quick Test)**
1. After creating match, the UI switches to MatchRoom
2. Click "Start Match" for demo
3. Watch the 120-second countdown
4. See results after match ends

**Option B: Two Players (Full Test)**
1. Player 1 creates match (steps above)
2. Open incognito window
3. Player 2 connects with different account
4. Player 2 joins match
5. Both players start and compete

## Step 4: Deploy to Monad Testnet (Production)

### 4.1 Get Monad Testnet Setup

```bash
# Add Monad testnet to MetaMask
Network Name: Monad Testnet
RPC URL: <MONAD_RPC_URL>
Chain ID: <MONAD_CHAIN_ID>
Currency: MON
```

### 4.2 Get Testnet Tokens

Visit Monad faucet and get test MON tokens

### 4.3 Deploy Contracts

```bash
cd clapo-contracts

# Update .env with your private key
echo "PRIVATE_KEY=<YOUR_PRIVATE_KEY>" > .env
echo "MONAD_RPC_URL=<MONAD_RPC_URL>" >> .env

# Deploy
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url $MONAD_RPC_URL \
  --broadcast \
  --verify
```

### 4.4 Update Frontend Config

```bash
cd clapo-frontend

# Update .env.local with new addresses
nano .env.local
```

### 4.5 Deploy Frontend

```bash
# Build
npm run build

# Deploy to Vercel
npm install -g vercel
vercel

# Or deploy to your preferred hosting
```

## Troubleshooting

### Contract Deployment Issues

**Error: "Insufficient funds"**
```bash
# Check balance
cast balance <YOUR_ADDRESS> --rpc-url http://localhost:8545

# Anvil provides 10000 ETH by default
```

**Error: "Contract not found"**
```bash
# Verify deployment
cast code <CONTRACT_ADDRESS> --rpc-url http://localhost:8545
```

### Frontend Issues

**Error: "Cannot read contract"**
- Verify .env.local has correct addresses
- Restart dev server: `npm run dev`

**Error: "Transaction failed"**
- Check you have testnet tokens
- Verify contract addresses are correct
- Check MetaMask network matches RPC URL

### NFT Issues

**Error: "NFT not approved"**
```bash
# Manually approve NFT
cast send <CLAPO_NFT_ADDRESS> \
  "approve(address,uint256)" \
  <NFT_VAULT_ADDRESS> \
  0 \
  --private-key <YOUR_PRIVATE_KEY> \
  --rpc-url http://localhost:8545
```

## Testing Checklist

- [ ] Contracts deployed successfully
- [ ] Frontend shows wallet connect button
- [ ] Can select 7 assets
- [ ] Budget calculation works (≤100 points)
- [ ] Leader/Co-leader selection works
- [ ] NFT approval transaction succeeds
- [ ] Match creation transaction succeeds
- [ ] Match room displays correctly
- [ ] Countdown timer works
- [ ] Results modal shows after match
- [ ] NFTs transferred to winner

## Production Checklist

- [ ] All contracts verified on explorer
- [ ] Real Pyth oracle integrated (not MockPyth)
- [ ] Price feeds configured for all 18 assets
- [ ] Frontend deployed to production hosting
- [ ] Environment variables set correctly
- [ ] SSL/HTTPS enabled
- [ ] Error tracking enabled (Sentry, etc.)
- [ ] Analytics configured
- [ ] Social sharing tested
- [ ] Mobile responsive verified

## Useful Commands

```bash
# Check NFT balance
cast call <CLAPO_NFT_ADDRESS> "balanceOf(address)" <YOUR_ADDRESS> --rpc-url http://localhost:8545

# Check NFT owner
cast call <CLAPO_NFT_ADDRESS> "ownerOf(uint256)" 0 --rpc-url http://localhost:8545

# Check match state
cast call <MATCHMAKER_ADDRESS> "getMatch(uint256)" 1 --rpc-url http://localhost:8545

# Get player active match
cast call <MATCHMAKER_ADDRESS> "getPlayerActiveMatch(address)" <PLAYER_ADDRESS> --rpc-url http://localhost:8545
```

## Support

- GitHub Issues: https://github.com/your-repo/issues
- Discord: https://discord.gg/clapo
- Documentation: https://docs.clapo.game

## License

MIT
