# 🎨 Test NFTs Minted

## Summary

**Total NFTs Minted:** 8 (IDs: 0-7)
**Owner Address:** `0x2c3A7D88CBA76E1b231e969f8B11b73417f03A09`
**Contract:** `0x9dAE75B5D674c0943253871dede9402FfF9dfedf`

---

## NFT List

| NFT ID | Transaction Hash | Block | Status |
|--------|-----------------|-------|--------|
| #0 | `0x76ec6f06b710caa638884bc9f5c0a0c9d0a3f056217d62177422f59d98e72a71` | 44021847 | ✅ Success |
| #1 | `0xe0f88724c58f79cc80ec3ca0ead329e5e92a991f57b2310d35cd1f652790ed8b` | 44021925 | ✅ Success |
| #2 | `0x99cb339317f59e5a490bfcefed348657ad29dc2e67c9cf1e2713b324f6525c88` | 44029005 | ✅ Success |
| #3 | `0xab0b4788b8001f8a3cb5039ae0c6aae039d0ade447092e07d8a4dbe467624b3f` | 44029042 | ✅ Success |
| #4 | `0x72c2925b47811cb3f02ac3d9fb7eb49a91467db0ad0fc96550c8f26684fd8485` | 44029065 | ✅ Success |
| #5 | `0x24dbeb474fa1d811e1a7adcccb7ab38a9ddaf8e0508f80e93da657c3e9829594` | 44029094 | ✅ Success |
| #6 | `0x25a74236ba0f0b1e7a838f97e94ad998d7b01cc0965d0353afb7247363ddf7df` | 44029118 | ✅ Success |
| #7 | (Next available) | - | Ready to mint |

---

## View on Block Explorer

**Base URL:** https://testnet.monadexplorer.com

### Individual NFT Transactions

- [NFT #0](https://testnet.monadexplorer.com/tx/0x76ec6f06b710caa638884bc9f5c0a0c9d0a3f056217d62177422f59d98e72a71)
- [NFT #1](https://testnet.monadexplorer.com/tx/0xe0f88724c58f79cc80ec3ca0ead329e5e92a991f57b2310d35cd1f652790ed8b)
- [NFT #2](https://testnet.monadexplorer.com/tx/0x99cb339317f59e5a490bfcefed348657ad29dc2e67c9cf1e2713b324f6525c88)
- [NFT #3](https://testnet.monadexplorer.com/tx/0xab0b4788b8001f8a3cb5039ae0c6aae039d0ade447092e07d8a4dbe467624b3f)
- [NFT #4](https://testnet.monadexplorer.com/tx/0x72c2925b47811cb3f02ac3d9fb7eb49a91467db0ad0fc96550c8f26684fd8485)
- [NFT #5](https://testnet.monadexplorer.com/tx/0x24dbeb474fa1d811e1a7adcccb7ab38a9ddaf8e0508f80e93da657c3e9829594)
- [NFT #6](https://testnet.monadexplorer.com/tx/0x25a74236ba0f0b1e7a838f97e94ad998d7b01cc0965d0353afb7247363ddf7df)

---

## Using NFTs for Testing

### In the Frontend

When creating a match in the localhost frontend, you can use any of these NFT IDs:
- `0` - First NFT
- `1` - Second NFT
- `2` - Third NFT
- `3` - Fourth NFT
- `4` - Fifth NFT
- `5` - Sixth NFT
- `6` - Seventh NFT

### Test Scenarios

**Single Player Test:**
1. Build portfolio
2. Use NFT #0 to create match
3. Verify NFT is staked

**Two Player Test (requires 2 wallets):**
1. Player 1 creates match with NFT #0
2. Player 2 joins with NFT #1
3. Start match
4. Complete 120-second battle
5. Reveal and settle

**Multiple Matches:**
- Use different NFT IDs for each match
- Test concurrent matches
- Verify NFT transfers after settlement

---

## Wallet Import for MetaMask

To test with these NFTs in MetaMask:

### Import the Test Wallet

⚠️ **WARNING:** This is a testnet wallet only. The private key is public. Never use for real funds!

**Private Key:** `0xea4bf3fd209dea950fc8889c90a4db78f7773b47734b9967b284b278c61d8d1d`

**Steps:**
1. Open MetaMask
2. Click account icon → Import Account
3. Select "Private Key"
4. Paste the private key above
5. Switch to Monad Testnet

**Imported Address:** `0x2c3A7D88CBA76E1b231e969f8B11b73417f03A09`

---

## Mint More NFTs

If you need more NFTs for testing:

```bash
cd "clapo-contracts"

# Mint to the deployer address
cast send 0x9dAE75B5D674c0943253871dede9402FfF9dfedf \
  "mint(address)" \
  0x2c3A7D88CBA76E1b231e969f8B11b73417f03A09 \
  --rpc-url https://testnet-rpc.monad.xyz/ \
  --private-key 0xea4bf3fd209dea950fc8889c90a4db78f7773b47734b9967b284b278c61d8d1d \
  --legacy

# Or mint to a different address
cast send 0x9dAE75B5D674c0943253871dede9402FfF9dfedf \
  "mint(address)" \
  YOUR_ADDRESS_HERE \
  --rpc-url https://testnet-rpc.monad.xyz/ \
  --private-key 0xea4bf3fd209dea950fc8889c90a4db78f7773b47734b9967b284b278c61d8d1d \
  --legacy
```

---

## Gas Costs

Each mint transaction:
- **Gas Used:** 22,100
- **Gas Price:** 102 Gwei
- **Cost per Mint:** ~0.0022 MON
- **Total for 7 NFTs:** ~0.015 MON

---

## NFT Contract Info

**Contract Address:** `0x9dAE75B5D674c0943253871dede9402FfF9dfedf`

**Explorer:** https://testnet.monadexplorer.com/address/0x9dAE75B5D674c0943253871dede9402FfF9dfedf

**Features:**
- ERC721 standard
- Ownable (owner can mint)
- Batch minting supported
- Simple token ID counter (0, 1, 2, ...)

---

## Ready to Test!

You now have **7 NFTs** ready for testing matches on localhost.

### Quick Test Guide

1. **Start Frontend:**
   ```bash
   cd clapo-frontend
   npm run dev
   ```

2. **Open Browser:**
   Visit http://localhost:3000

3. **Connect Wallet:**
   - Import the test wallet to MetaMask
   - Connect to the app
   - Switch to Monad Testnet

4. **Create a Match:**
   - Build your 7-asset portfolio
   - Enter NFT ID: `0` (or any ID from 0-6)
   - Click "Create Match"

5. **Test Complete Flow:**
   - Need 2 wallets for full match
   - Or test just the creation/cancellation

Enjoy testing! 🎮
