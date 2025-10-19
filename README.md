# 🎮 Clapo Game

**"Stake. Strategize. Dominate."**

Head-to-head NFT prediction duels powered by Pyth price feeds on Monad Testnet.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Solidity](https://img.shields.io/badge/Solidity-0.8.24-363636?logo=solidity)
![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)

## 🎯 Overview

Clapo Game is a PvP crypto prediction game where players:
1. **Stake** their NFTs
2. **Build** a 7-token portfolio under a 100-point budget
3. **Battle** in 120-second real-time matches
4. **Winner** takes both NFTs!

## ✨ Features

### Smart Contracts
- ✅ **Matchmaker** - Full match lifecycle with commit-reveal
- ✅ **AssetRegistry** - 18 crypto assets with tiered pricing
- ✅ **NFTVault** - Secure NFT escrow and transfers
- ✅ **GameMath** - Score calculations with multipliers
- ✅ **Fully Tested** - 8 comprehensive tests, all passing

### Frontend
- ✅ **Draft Panel** - Visual portfolio builder
- ✅ **Match Room** - Live 120-second battles
- ✅ **Results Modal** - Winner announcement & breakdown
- ✅ **Web3 Integration** - Wagmi + Viem
- ✅ **Responsive Design** - Beautiful gradient UI

## 🚀 Quick Start

### Prerequisites
```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Verify installation
forge --version
node --version  # Need 18+
```

### Installation

```bash
# Clone repository
git clone <your-repo>
cd "Clapo Game"

# Install contracts
cd clapo-contracts
forge install

# Install frontend
cd ../clapo-frontend
npm install
```

### Run Locally

```bash
# Terminal 1: Start local blockchain
anvil

# Terminal 2: Deploy contracts
cd clapo-contracts
forge script script/Deploy.s.sol:DeployScript --fork-url http://localhost:8545 --broadcast

# Terminal 3: Start frontend
cd clapo-frontend
# Copy contract addresses from Terminal 2 to .env.local
npm run dev
```

Visit http://localhost:3000

## 📁 Project Structure

```
Clapo Game/
├── clapo-contracts/           Smart Contracts
│   ├── src/
│   │   ├── Matchmaker.sol     Match lifecycle & settlement
│   │   ├── AssetRegistry.sol  Asset costs & validation
│   │   ├── NFTVault.sol       NFT escrow
│   │   ├── GameMath.sol       Scoring library
│   │   ├── MockPyth.sol       Oracle mock
│   │   └── ClapoNFT.sol       Demo ERC721
│   ├── test/                  8 passing tests
│   ├── script/Deploy.s.sol    Deployment script
│   └── README.md
│
├── clapo-frontend/            Next.js Frontend
│   ├── app/
│   │   ├── layout.tsx         Root layout
│   │   ├── page.tsx           Main game page
│   │   └── providers.tsx      Web3 setup
│   ├── components/
│   │   ├── DraftPanel.tsx     Portfolio builder
│   │   ├── MatchRoom.tsx      Live battle
│   │   └── ResultsModal.tsx   Results screen
│   ├── hooks/
│   │   ├── useMatchmaker.ts   Contract hooks
│   │   ├── useClapoNFT.ts     NFT hooks
│   │   └── useAssetRegistry.ts
│   ├── lib/
│   │   ├── constants.ts       Game config
│   │   ├── wagmi.ts           Web3 config
│   │   └── contracts/         ABIs
│   └── README.md
│
├── DEPLOYMENT_GUIDE.md        Full deployment guide
└── README.md                  This file
```

## 🎮 How to Play

### 1. Connect Wallet
- Click "Connect Wallet"
- Approve MetaMask connection

### 2. Build Portfolio
- Select 7 tokens from 18 options
- Stay within 100-point budget
- Choose Leader (2× multiplier)
- Choose Co-Leader (1.5× multiplier)

### 3. Create Match
- Enter your NFT Token ID
- Click "Create Match"
- Approve NFT transfer
- Wait for opponent

### 4. Battle
- 120-second countdown
- Watch live scores
- Prices update in real-time

### 5. Results
- Winner announced
- NFTs transferred automatically
- Performance breakdown shown

## 📊 Game Mechanics

### Asset Tiers

| Tier | Tokens | Cost Range |
|------|--------|------------|
| A | BTC, ETH, SOL | 18-30 pts |
| B | BNB, AVAX, XRP | 12-16 pts |
| C | ADA, MATIC, NEAR, DOT | 10 pts |
| D | DOGE, TRX, SUI, APT | 8-9 pts |
| E | ASTAR, SHIB, PEPE, HYPE | 5-7 pts |

### Scoring Formula

```
PriceChange = ((PriceEnd - PriceStart) / PriceStart) × 10000
Score = PriceChange × Multiplier

Multipliers:
- Leader: 2.0×
- Co-Leader: 1.5×
- Regular: 1.0×

Total Score = Σ(all assets)
```

### Match Flow

```
Create → Join → Start → Battle (120s) → Reveal → Settle
```

## 🧪 Testing

```bash
# Run contract tests
cd clapo-contracts
forge test -vv

# Test coverage
forge coverage

# Gas report
forge test --gas-report
```

All 8 tests passing ✅

## 🔒 Security Features

- **Commit-Reveal** - Prevents pick front-running
- **Reentrancy Guards** - Protected state changes
- **Price Freshness** - Max 5-second staleness
- **Portfolio Validation** - On-chain budget checks
- **NFT Whitelist** - Approved collections only
- **Access Control** - Owner-only admin functions

## 🛠️ Tech Stack

**Smart Contracts**
- Solidity 0.8.24
- Foundry
- OpenZeppelin Contracts
- Pyth Oracle (Mock for testing)

**Frontend**
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Wagmi + Viem
- React Query

## 📈 Development Status

| Component | Status | Progress |
|-----------|--------|----------|
| Smart Contracts | ✅ Complete | 100% |
| Contract Tests | ✅ Passing | 100% |
| Frontend UI | ✅ Complete | 100% |
| Web3 Integration | ✅ Complete | 100% |
| Documentation | ✅ Complete | 100% |
| Deployment Scripts | ✅ Ready | 100% |

## 🚢 Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

**Quick Deploy (Local)**
```bash
# 1. Start Anvil
anvil

# 2. Deploy contracts
cd clapo-contracts && forge script script/Deploy.s.sol --fork-url http://localhost:8545 --broadcast

# 3. Start frontend
cd clapo-frontend && npm run dev
```

## 📝 Environment Variables

### Contracts (.env)
```env
PRIVATE_KEY=your_private_key
MONAD_RPC_URL=your_rpc_url
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_MATCHMAKER_ADDRESS=0x...
NEXT_PUBLIC_ASSET_REGISTRY_ADDRESS=0x...
NEXT_PUBLIC_NFT_VAULT_ADDRESS=0x...
NEXT_PUBLIC_CLAPO_NFT_ADDRESS=0x...
NEXT_PUBLIC_MOCK_PYTH_ADDRESS=0x...
```

## 🎯 Roadmap

- [x] Core smart contracts
- [x] Frontend UI
- [x] Web3 integration
- [x] Local testing
- [ ] Real Pyth oracle integration
- [ ] Monad Testnet deployment
- [ ] Leaderboard system
- [ ] Team battles (3v3)
- [ ] Tournament mode
- [ ] Mobile app

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch
3. Make your changes
4. Add tests
5. Submit pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

## 🙏 Acknowledgments

- Pyth Network for price feeds
- OpenZeppelin for secure contracts
- Foundry for development tools
- Monad for testnet support

## 📞 Support

- Documentation: [docs.clapo.game](https://docs.clapo.game)
- Discord: [discord.gg/clapo](https://discord.gg/clapo)
- Twitter: [@ClapoGame](https://twitter.com/ClapoGame)
- Issues: [GitHub Issues](https://github.com/your-repo/issues)

---

**Built with ❤️ for the Monad ecosystem**

⚡ **Stake. Strategize. Dominate.** ⚡
