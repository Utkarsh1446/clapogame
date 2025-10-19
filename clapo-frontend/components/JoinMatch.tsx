"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { ASSETS, GAME_CONFIG, CONTRACT_ADDRESSES, Role, type AssetSymbol } from "@/lib/constants";
import { useMatchmaker } from "@/hooks/useMatchmaker";
import { useClapoNFT } from "@/hooks/useClapoNFT";

interface SelectedAsset {
  symbol: AssetSymbol;
  role: Role;
}

interface JoinMatchProps {
  onMatchJoined: (matchId: bigint) => void;
  onBack: () => void;
}

export function JoinMatch({ onMatchJoined, onBack }: JoinMatchProps) {
  const { address } = useAccount();
  const { joinMatch, isPending } = useMatchmaker();
  const { approve, isPending: isApproving } = useClapoNFT();

  const [matchIdInput, setMatchIdInput] = useState<string>("");
  const [selectedAssets, setSelectedAssets] = useState<SelectedAsset[]>([]);
  const [leaderIndex, setLeaderIndex] = useState<number | null>(null);
  const [coLeaderIndex, setCoLeaderIndex] = useState<number | null>(null);
  const [nftTokenId, setNftTokenId] = useState<string>("0");

  const usedBudget = selectedAssets.reduce(
    (sum, { symbol }) => sum + ASSETS[symbol].cost,
    0
  );
  const remainingBudget = GAME_CONFIG.MAX_BUDGET - usedBudget;

  const toggleAsset = (symbol: AssetSymbol) => {
    const index = selectedAssets.findIndex((a) => a.symbol === symbol);

    if (index >= 0) {
      // Deselect
      const newAssets = selectedAssets.filter((_, i) => i !== index);
      setSelectedAssets(newAssets);

      // Update leader/co-leader indices
      if (leaderIndex === index) setLeaderIndex(null);
      else if (leaderIndex !== null && leaderIndex > index) setLeaderIndex(leaderIndex - 1);

      if (coLeaderIndex === index) setCoLeaderIndex(null);
      else if (coLeaderIndex !== null && coLeaderIndex > index) setCoLeaderIndex(coLeaderIndex - 1);
    } else {
      // Select (if within budget and not max assets)
      if (selectedAssets.length < GAME_CONFIG.REQUIRED_ASSETS) {
        const newCost = usedBudget + ASSETS[symbol].cost;
        if (newCost <= GAME_CONFIG.MAX_BUDGET) {
          setSelectedAssets([...selectedAssets, { symbol, role: Role.Regular }]);
        }
      }
    }
  };

  const setAsLeader = (index: number) => {
    if (leaderIndex === index) {
      setLeaderIndex(null);
    } else {
      if (coLeaderIndex === index) setCoLeaderIndex(null);
      setLeaderIndex(index);
    }
  };

  const setAsCoLeader = (index: number) => {
    if (coLeaderIndex === index) {
      setCoLeaderIndex(null);
    } else {
      if (leaderIndex === index) setLeaderIndex(null);
      setCoLeaderIndex(index);
    }
  };

  const canJoinMatch =
    matchIdInput.trim() !== "" &&
    selectedAssets.length === GAME_CONFIG.REQUIRED_ASSETS &&
    leaderIndex !== null &&
    coLeaderIndex !== null;

  const handleJoinMatch = async () => {
    if (!canJoinMatch || !address) return;

    try {
      const matchId = BigInt(matchIdInput);

      // Build roles array
      const roles = selectedAssets.map((_, index) =>
        index === leaderIndex ? Role.Leader :
        index === coLeaderIndex ? Role.CoLeader :
        Role.Regular
      );

      const assets = selectedAssets.map(a => a.symbol);
      const salt = `clapo-${Date.now()}-${Math.random()}`;

      // First approve NFT
      await approve(BigInt(nftTokenId));

      // Then join match
      await joinMatch(
        matchId,
        CONTRACT_ADDRESSES.ClapoNFT as `0x${string}`,
        BigInt(nftTokenId),
        assets,
        roles,
        salt
      );

      // Store salt for later reveal
      localStorage.setItem("clapo-salt", salt);
      localStorage.setItem("clapo-assets", JSON.stringify(assets));
      localStorage.setItem("clapo-roles", JSON.stringify(roles));

      // Wait a moment for transaction to confirm
      setTimeout(() => {
        onMatchJoined(matchId);
      }, 2000);
    } catch (error) {
      console.error("Error joining match:", error);
      alert("Failed to join match. Check console for details.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <button
          onClick={onBack}
          className="mb-4 text-gray-400 hover:text-white transition-colors"
        >
          ← Back to Menu
        </button>
        <h2 className="text-4xl font-bold text-white mb-2">Join a Match</h2>
        <p className="text-gray-400">
          Enter Match ID and build your portfolio
        </p>
      </div>

      {/* Match ID Input */}
      <div className="mb-8 bg-gray-800 rounded-lg p-6">
        <label className="block text-sm text-gray-400 mb-2">Match ID</label>
        <input
          type="text"
          value={matchIdInput}
          onChange={(e) => setMatchIdInput(e.target.value)}
          placeholder="Enter match ID (e.g., 1)"
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white text-lg"
        />
      </div>

      {/* Budget Bar */}
      <div className="mb-8 bg-gray-800 rounded-lg p-4">
        <div className="flex justify-between mb-2">
          <span className="text-gray-400">Budget Used</span>
          <span className="text-white font-bold">
            {usedBudget} / {GAME_CONFIG.MAX_BUDGET}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full transition-all ${
              usedBudget > GAME_CONFIG.MAX_BUDGET
                ? "bg-red-500"
                : "bg-gradient-to-r from-purple-500 to-pink-500"
            }`}
            style={{ width: `${Math.min((usedBudget / GAME_CONFIG.MAX_BUDGET) * 100, 100)}%` }}
          />
        </div>
        <p className="text-sm text-gray-400 mt-1">
          Remaining: {remainingBudget} points
        </p>
      </div>

      {/* Asset Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {Object.values(ASSETS).map((asset) => {
          const isSelected = selectedAssets.some((a) => a.symbol === asset.symbol);
          const canAfford = usedBudget + asset.cost <= GAME_CONFIG.MAX_BUDGET;

          return (
            <button
              key={asset.symbol}
              onClick={() => toggleAsset(asset.symbol)}
              disabled={!isSelected && (!canAfford || selectedAssets.length >= GAME_CONFIG.REQUIRED_ASSETS)}
              className={`p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? "border-purple-500 bg-purple-500/20"
                  : canAfford && selectedAssets.length < GAME_CONFIG.REQUIRED_ASSETS
                  ? "border-gray-600 bg-gray-800 hover:border-gray-500"
                  : "border-gray-700 bg-gray-900 opacity-50 cursor-not-allowed"
              }`}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">{asset.symbol}</div>
                <div className="text-xs text-gray-400 mb-2">{asset.name}</div>
                <div className="text-sm">
                  <span className={`px-2 py-1 rounded ${
                    asset.tier === "A" ? "bg-yellow-500/20 text-yellow-400" :
                    asset.tier === "B" ? "bg-blue-500/20 text-blue-400" :
                    asset.tier === "C" ? "bg-green-500/20 text-green-400" :
                    asset.tier === "D" ? "bg-purple-500/20 text-purple-400" :
                    "bg-pink-500/20 text-pink-400"
                  }`}>
                    {asset.cost} pts
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Assets */}
      {selectedAssets.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-white mb-4">
            Your Team ({selectedAssets.length}/{GAME_CONFIG.REQUIRED_ASSETS})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {selectedAssets.map((asset, index) => (
              <div
                key={asset.symbol}
                className="bg-gray-700 rounded-lg p-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-white">{asset.symbol}</span>
                  <span className="text-sm text-gray-400">
                    {ASSETS[asset.symbol].cost} pts
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setAsLeader(index)}
                    className={`px-3 py-1 rounded text-xs font-semibold ${
                      leaderIndex === index
                        ? "bg-yellow-500 text-black"
                        : "bg-gray-600 text-gray-300 hover:bg-gray-500"
                    }`}
                  >
                    Leader 2×
                  </button>
                  <button
                    onClick={() => setAsCoLeader(index)}
                    className={`px-3 py-1 rounded text-xs font-semibold ${
                      coLeaderIndex === index
                        ? "bg-blue-500 text-white"
                        : "bg-gray-600 text-gray-300 hover:bg-gray-500"
                    }`}
                  >
                    Co-Lead 1.5×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NFT Input and Join Button */}
      <div className="text-center space-y-4">
        {selectedAssets.length === GAME_CONFIG.REQUIRED_ASSETS && (
          <div className="inline-block">
            <label className="block text-sm text-gray-400 mb-2">Your NFT Token ID</label>
            <input
              type="number"
              value={nftTokenId}
              onChange={(e) => setNftTokenId(e.target.value)}
              className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white text-center w-40"
              min="0"
            />
          </div>
        )}

        <div>
          <button
            onClick={handleJoinMatch}
            disabled={!canJoinMatch || isPending || isApproving}
            className={`px-8 py-4 rounded-lg text-lg font-bold transition-all ${
              canJoinMatch && !isPending && !isApproving
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transform hover:scale-105"
                : "bg-gray-700 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isPending || isApproving
              ? "Joining Match..."
              : !matchIdInput.trim()
              ? "Enter Match ID"
              : selectedAssets.length < GAME_CONFIG.REQUIRED_ASSETS
              ? `Select ${GAME_CONFIG.REQUIRED_ASSETS - selectedAssets.length} More`
              : leaderIndex === null
              ? "Choose a Leader"
              : coLeaderIndex === null
              ? "Choose a Co-Leader"
              : "Join Match"}
          </button>
        </div>
      </div>
    </div>
  );
}
