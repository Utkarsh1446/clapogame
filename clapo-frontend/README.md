# Clapo Game Frontend

**"Stake. Strategize. Dominate."**

Next.js frontend for the Clapo Game - head-to-head NFT prediction duels.

## Features

- ✅ Wallet connection (Wagmi + Viem)
- ✅ Draft panel with 18 crypto assets
- ✅ Budget management (100 points)
- ✅ Leader/Co-leader selection (2× and 1.5× multipliers)
- ✅ Live match room with 120-second countdown
- ✅ Real-time score tracking
- ✅ Results modal with performance breakdown

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Web3**: Wagmi + Viem
- **State**: React Query
- **TypeScript**: Full type safety

## Getting Started

### Installation

```bash
npm install
```

### Environment Setup

Create a `.env.local` file:

```env
# Contract addresses (from deployment)
NEXT_PUBLIC_MATCHMAKER_ADDRESS=0x...
NEXT_PUBLIC_ASSET_REGISTRY_ADDRESS=0x...
NEXT_PUBLIC_NFT_VAULT_ADDRESS=0x...
NEXT_PUBLIC_CLAPO_NFT_ADDRESS=0x...
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with Web3 providers
│   ├── page.tsx            # Main game interface
│   └── providers.tsx       # Wagmi & React Query setup
├── components/
│   ├── DraftPanel.tsx      # Portfolio builder
│   ├── MatchRoom.tsx       # Live battle view
│   └── ResultsModal.tsx    # Match results
└── lib/
    ├── constants.ts        # Game config & assets
    ├── wagmi.ts            # Web3 configuration
    └── contracts/          # Contract ABIs
```

## Usage Flow

1. **Connect Wallet** → MetaMask/injected wallet
2. **Build Portfolio** → Select 7 assets within 100-point budget
3. **Set Roles** → Choose Leader (2×) and Co-leader (1.5×)
4. **Create Match** → Stake NFT and enter lobby
5. **Battle** → 120-second live price duel
6. **Results** → Winner takes both NFTs

## License

MIT
