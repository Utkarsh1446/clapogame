# Clapo Game Smart Contracts

**"Stake. Strategize. Dominate."**

Head-to-head NFT prediction duels powered by Pyth price feeds on Monad Testnet.

## Overview

Clapo Game is a PvP crypto prediction game where players:
1. Stake their NFTs
2. Build a 7-token portfolio under a 100-point budget
3. Battle in 120-second real-time matches
4. Winner takes both NFTs!

## Contracts

### Core Contracts

- **Matchmaker.sol** - Main game logic, match lifecycle, commit-reveal mechanism
- **AssetRegistry.sol** - Token metadata, costs, and Pyth feed IDs
- **NFTVault.sol** - NFT escrow and transfer management
- **GameMath.sol** - Scoring calculations and price change logic
- **MockPyth.sol** - Mock oracle for local testing
- **ClapoNFT.sol** - Demo ERC721 NFT for testing

## Features

- ✅ Commit-reveal to prevent front-running
- ✅ Leader (2×) and Co-leader (1.5×) multipliers
- ✅ 18 crypto assets with tiered costs
- ✅ 100-point budget system
- ✅ 120-second match duration
- ✅ Pyth Oracle integration (real-time prices)
- ✅ NFT wagering with automatic transfers

## Getting Started

### Prerequisites

```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### Installation

```bash
cd clapo-contracts
forge install
```

### Compile

```bash
forge build
```

### Test

```bash
forge test -vv
```

### Deploy (Local)

```bash
# Start local node
anvil

# Deploy contracts
forge script script/Deploy.s.sol:DeployScript --fork-url http://localhost:8545 --broadcast
```

## Gameplay Mechanics

### Portfolio Building

Players select **7 tokens** from 18 available options:

**Tier A** (Premium)
- BTC: 30 points
- ETH: 25 points
- SOL: 18 points

**Tier B** (Mid)
- BNB, AVAX, XRP: 12-16 points

**Tier C** (Standard)
- ADA, MATIC, NEAR: 10 points

**Tier D** (Low-cap)
- DOGE, TRX, SUI: 8-9 points

**Tier E** (Meme/High-risk)
- ASTAR, SHIB, PEPE, HYPE: 5-7 points

**Total Budget: 100 points max**

### Scoring

```
PriceChange(%) = ((PriceEnd - PriceStart) / PriceStart) × 10000
Score = PriceChange × Multiplier

Multipliers:
- Leader: 2.0×
- Co-Leader: 1.5×
- Regular: 1.0×
```

### Match Flow

```
1. Create Match → Player 1 stakes NFT + commits picks
2. Join Match → Player 2 stakes NFT + commits picks
3. Start Match → Record starting prices
4. Wait 120s → Battle in progress
5. Reveal Picks → Both players reveal + auto-settle
6. Winner Takes All → NFTs transferred
```

## Testing

### Run All Tests

```bash
forge test
```

### Run Specific Test

```bash
forge test --match-test test_FullMatchFlow -vvv
```

### Gas Report

```bash
forge test --gas-report
```

## Architecture

```
┌─────────────────┐
│   Matchmaker    │
│  (Game Logic)   │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼──────┐
│ Vault │ │Registry │
│(NFTs) │ │(Assets) │
└───┬───┘ └──┬──────┘
    │        │
    └────┬───┘
         │
    ┌────▼─────┐
    │   Pyth   │
    │ (Oracle) │
    └──────────┘
```

## Security Features

- **Reentrancy Guards**: All state-changing functions protected
- **Commit-Reveal**: Prevents pick front-running
- **Price Freshness**: Max 5-second staleness checks
- **Portfolio Validation**: On-chain budget & uniqueness checks
- **NFT Whitelist**: Only approved collections can play
- **Access Control**: Owner-only admin functions

## TODO

- [ ] Snapshot prices at match start instead of querying historical
- [ ] Add timeout/forfeit mechanism for incomplete matches
- [ ] Implement leaderboard contract
- [ ] Add EXP/leveling system
- [ ] Support for USDC side bets
- [ ] Multi-round tournaments
- [ ] Team battles (3v3)

## License

MIT
