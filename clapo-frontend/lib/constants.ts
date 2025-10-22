// Game Constants

export const GAME_CONFIG = {
  MATCH_DURATION: 120, // 120 seconds
  MAX_BUDGET: 100,
  REQUIRED_ASSETS: 7,
  LEADER_MULTIPLIER: 2.0,
  CO_LEADER_MULTIPLIER: 1.5,
  REGULAR_MULTIPLIER: 1.0,
} as const;

export const ASSET_SYMBOLS = [
  "BTC",
  "ETH",
  "SOL",
  "BNB",
  "AVAX",
  "XRP",
  "ADA",
  "MATIC",
  "NEAR",
  "DOGE",
  "TRX",
  "SUI",
  "ASTAR",
  "SHIB",
  "PEPE",
  "HYPE",
  "DOT",
  "APT",
] as const;

export type AssetSymbol = (typeof ASSET_SYMBOLS)[number];

export interface Asset {
  symbol: AssetSymbol;
  name: string;
  cost: number;
  tier: "A" | "B" | "C" | "D" | "E";
  icon?: string;
}

export const ASSETS: Record<AssetSymbol, Asset> = {
  BTC: { symbol: "BTC", name: "Bitcoin", cost: 30, tier: "A" },
  ETH: { symbol: "ETH", name: "Ethereum", cost: 25, tier: "A" },
  SOL: { symbol: "SOL", name: "Solana", cost: 18, tier: "A" },
  BNB: { symbol: "BNB", name: "BNB", cost: 16, tier: "B" },
  AVAX: { symbol: "AVAX", name: "Avalanche", cost: 12, tier: "B" },
  XRP: { symbol: "XRP", name: "Ripple", cost: 12, tier: "B" },
  ADA: { symbol: "ADA", name: "Cardano", cost: 10, tier: "C" },
  MATIC: { symbol: "MATIC", name: "Polygon", cost: 10, tier: "C" },
  NEAR: { symbol: "NEAR", name: "NEAR Protocol", cost: 10, tier: "C" },
  DOGE: { symbol: "DOGE", name: "Dogecoin", cost: 9, tier: "D" },
  TRX: { symbol: "TRX", name: "Tron", cost: 8, tier: "D" },
  SUI: { symbol: "SUI", name: "Sui", cost: 8, tier: "D" },
  ASTAR: { symbol: "ASTAR", name: "Astar", cost: 7, tier: "E" },
  SHIB: { symbol: "SHIB", name: "Shiba Inu", cost: 6, tier: "E" },
  PEPE: { symbol: "PEPE", name: "Pepe", cost: 5, tier: "E" },
  HYPE: { symbol: "HYPE", name: "Hype", cost: 5, tier: "E" },
  DOT: { symbol: "DOT", name: "Polkadot", cost: 10, tier: "C" },
  APT: { symbol: "APT", name: "Aptos", cost: 9, tier: "D" },
};

export enum Role {
  Regular = 0,
  CoLeader = 1,
  Leader = 2,
}

export enum MatchState {
  Created = 0,
  Committed = 1,
  Started = 2,
  Ended = 3,
  Settled = 4,
}

// Contract addresses - hardcoded to ensure correct deployment
export const CONTRACT_ADDRESSES = {
  AssetRegistry: "0x898bcA461cE3B7f0697e15Dd2209C673dae5fbe2",
  NFTVault: "0xAEB69e308A2580e48F0371FCD89EcAe7f700775a",
  Matchmaker: "0x1E5152468537309Bd797f6EDc1fe112e98a09402",
  ClapoNFT: "0x3B5a097c560636D5090266d5cBf5578B9940543F",
  MockPyth: "0x2880aB155794e7179c9eE2e38200202908C17B43",
} as const;
