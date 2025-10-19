# Monad Testnet Deployment Guide

This guide covers deploying Clapo Game contracts to Monad testnet with real Pyth oracle integration.

## Prerequisites

1. **Foundry** installed and configured
2. **Metamask** or wallet with Monad testnet configured
3. **MON tokens** from testnet faucet
4. **Private key** for deployment

## Monad Testnet Configuration

| Parameter | Value |
|-----------|-------|
| Chain ID | 10143 |
| RPC URL | https://testnet-rpc.monad.xyz/ |
| Native Token | MON |
| Block Explorer | https://testnet.monadexplorer.com |

## Step 1: Get Testnet Tokens

Visit any of these faucets to get testnet MON:

1. **Official Monad Faucet**: https://faucet.monad.xyz
2. **ETHGlobal Faucet**: https://ethglobal.com/faucet/monad-testnet-10143 (0.2 MON/day)
3. **QuickNode Faucet**: https://faucet.quicknode.com/monad/testnet

## Step 2: Find Pyth Oracle Address

The Pyth oracle contract address on Monad testnet needs to be obtained from:

1. **Pyth Documentation**: https://docs.pyth.network/price-feeds/contract-addresses
2. **Monad Documentation**: https://docs.monad.xyz/tooling-and-infra/oracles
3. **Contact Pyth/Monad Support** if not listed

**Common Pyth Addresses (verify before use):**
- Most EVM testnets use a standard Pyth contract address
- Check if Monad uses the same address as other EVM chains

**To find the address:**
```bash
# Check Pyth documentation
curl https://hermes.pyth.network/api/latest_price_feeds

# Or search Monad block explorer for Pyth deployments
```

## Step 3: Configure Environment

Create `.env` file in `clapo-contracts/` directory:

```env
# Monad Testnet Configuration
PRIVATE_KEY=your_private_key_here
MONAD_RPC_URL=https://testnet-rpc.monad.xyz/

# Pyth Oracle Address (REQUIRED - update with actual address)
PYTH_ORACLE_ADDRESS=0x0000000000000000000000000000000000000000

# Optional: Etherscan API key for verification (if supported)
ETHERSCAN_API_KEY=your_api_key_here
```

**⚠️ IMPORTANT:**
- Replace `your_private_key_here` with your actual private key
- **DO NOT** commit `.env` file to version control
- Update `PYTH_ORACLE_ADDRESS` with the real Pyth contract address on Monad

## Step 4: Verify Compilation

```bash
cd clapo-contracts
source ~/.zshenv  # If forge not in PATH
forge build
```

Expected output: `Compiler run successful`

## Step 5: Deploy to Monad Testnet

```bash
# Deploy using the Monad deployment script
forge script script/DeployMonad.s.sol:DeployMonad \
  --rpc-url $MONAD_RPC_URL \
  --broadcast \
  --verify \
  --legacy

# If verification fails, deploy without it
forge script script/DeployMonad.s.sol:DeployMonad \
  --rpc-url $MONAD_RPC_URL \
  --broadcast \
  --legacy
```

**Notes:**
- `--legacy` flag may be needed for Monad compatibility
- `--verify` attempts to verify contracts on block explorer (may not be supported yet)
- Deployment takes ~30-60 seconds

## Step 6: Save Deployment Addresses

After successful deployment, addresses will be saved to `.env.monad`:

```env
# Monad Testnet Deployment
NEXT_PUBLIC_ASSET_REGISTRY_ADDRESS=0x...
NEXT_PUBLIC_NFT_VAULT_ADDRESS=0x...
NEXT_PUBLIC_PYTH_ORACLE_ADDRESS=0x...
NEXT_PUBLIC_MATCHMAKER_ADDRESS=0x...
NEXT_PUBLIC_CLAPO_NFT_ADDRESS=0x...
```

## Step 7: Update Frontend Configuration

Copy the addresses to `clapo-frontend/.env.local`:

```bash
# From clapo-contracts directory
cat .env.monad

# Copy output to clapo-frontend/.env.local
```

Or manually create `clapo-frontend/.env.local`:

```env
# Monad Testnet Contract Addresses
NEXT_PUBLIC_ASSET_REGISTRY_ADDRESS=0x...
NEXT_PUBLIC_NFT_VAULT_ADDRESS=0x...
NEXT_PUBLIC_PYTH_ORACLE_ADDRESS=0x...
NEXT_PUBLIC_MATCHMAKER_ADDRESS=0x...
NEXT_PUBLIC_CLAPO_NFT_ADDRESS=0x...
```

## Step 8: Verify Deployment

Check your deployments on Monad Block Explorer:

```
https://testnet.monadexplorer.com/address/YOUR_CONTRACT_ADDRESS
```

Verify each contract:
- AssetRegistry
- NFTVault
- Matchmaker
- ClapoNFT

## Step 9: Test Contracts

### 9.1 Mint Test NFTs

```bash
# Using cast (Foundry tool)
cast send $CLAPO_NFT_ADDRESS \
  "mint(address)" \
  YOUR_WALLET_ADDRESS \
  --rpc-url $MONAD_RPC_URL \
  --private-key $PRIVATE_KEY
```

### 9.2 Check Asset Registry

```bash
# Get BTC asset info
cast call $ASSET_REGISTRY_ADDRESS \
  "getAsset(bytes32)" \
  $(cast keccak "BTC") \
  --rpc-url $MONAD_RPC_URL
```

### 9.3 Test Pyth Oracle Integration

```bash
# This requires Pyth oracle to have live data
# Test by creating a match in the frontend
```

## Troubleshooting

### Issue: "PYTH_ORACLE_ADDRESS not set"

**Solution:** Add the Pyth oracle address to your `.env` file. Contact Pyth or Monad support for the correct address.

### Issue: "Insufficient funds"

**Solution:** Get more MON from testnet faucets. Deployment requires ~0.5-1 MON for gas.

### Issue: "Nonce too high"

**Solution:** Reset your account nonce or wait for pending transactions to complete.

```bash
# Check pending transactions
cast nonce YOUR_ADDRESS --rpc-url $MONAD_RPC_URL
```

### Issue: "Compiler errors"

**Solution:** Ensure you're using Solidity 0.8.24:

```bash
forge --version
# Should show: forge 0.2.0 (with solc 0.8.24)
```

### Issue: Pyth oracle not working

**Solution:**
1. Verify Pyth contract address is correct
2. Check if Pyth has active price feeds on Monad testnet
3. Update price feeds using Pyth Hermes API if needed

## Gas Estimation

Approximate gas costs on Monad testnet:

| Contract | Gas Used | MON Cost (estimate) |
|----------|----------|---------------------|
| AssetRegistry | ~2M | ~0.02 MON |
| NFTVault | ~1.5M | ~0.015 MON |
| Matchmaker | ~3M | ~0.03 MON |
| ClapoNFT | ~1M | ~0.01 MON |
| Asset Setup | ~500k | ~0.005 MON |
| **Total** | **~8M** | **~0.08 MON** |

## Next Steps

After successful deployment:

1. ✅ Update frontend with contract addresses
2. ✅ Configure Monad testnet in frontend Wagmi config
3. ✅ Test NFT minting
4. ✅ Test match creation
5. ✅ Test full match flow
6. ✅ Deploy frontend to Vercel/Netlify

## Resources

- **Monad Docs**: https://docs.monad.xyz
- **Pyth Docs**: https://docs.pyth.network
- **Monad Explorer**: https://testnet.monadexplorer.com
- **Monad Faucet**: https://faucet.monad.xyz
- **Foundry Book**: https://book.getfoundry.sh

## Support

If you encounter issues:

1. Check Monad Discord: https://discord.gg/monad
2. Check Pyth Discord: https://discord.gg/pythnetwork
3. Review Foundry docs: https://book.getfoundry.sh
4. Open GitHub issue in this repository

---

**Last Updated:** January 2025
**Monad Testnet Chain ID:** 10143
