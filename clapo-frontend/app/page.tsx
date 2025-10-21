"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { DraftPanel } from "@/components/DraftPanel";
import { JoinMatch } from "@/components/JoinMatch";
import { MatchRoom } from "@/components/MatchRoom";
import { useState, useEffect } from "react";
import { usePlayerActiveMatch, useMatchmaker } from "@/hooks/useMatchmaker";

type GameMode = "menu" | "create" | "join" | "match";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const [gameMode, setGameMode] = useState<GameMode>("menu");
  const [localMatchId, setLocalMatchId] = useState<bigint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClearing, setIsClearing] = useState(false);

  // Check if player has an active match on-chain
  const { matchId: activeMatchId } = usePlayerActiveMatch(address);
  const { clearStuckMatch, isPending } = useMatchmaker();

  // Use on-chain match ID if available, otherwise use local
  const currentMatchId = activeMatchId !== undefined && activeMatchId > BigInt(0)
    ? activeMatchId
    : localMatchId;

  // Load match ID from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedMatchId = localStorage.getItem("clapo-matchId");
        if (savedMatchId && savedMatchId !== "0") {
          setLocalMatchId(BigInt(savedMatchId));
          setGameMode("match");
        }
      } catch (error) {
        console.error("Error loading match ID:", error);
        // Clear corrupted data
        localStorage.removeItem("clapo-matchId");
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  // Auto-switch to match mode if active match found
  useEffect(() => {
    if (currentMatchId !== null && currentMatchId > BigInt(0)) {
      setGameMode("match");
    }
  }, [currentMatchId]);

  const handleMatchCreated = (matchId: bigint) => {
    setLocalMatchId(matchId);
    localStorage.setItem("clapo-matchId", matchId.toString());
    setGameMode("match");
  };

  const handleMatchJoined = (matchId: bigint) => {
    setLocalMatchId(matchId);
    localStorage.setItem("clapo-matchId", matchId.toString());
    setGameMode("match");
  };

  const handleMatchEnd = () => {
    setLocalMatchId(null);
    setGameMode("menu");
    localStorage.removeItem("clapo-matchId");
    localStorage.removeItem("clapo-salt");
    localStorage.removeItem("clapo-assets");
    localStorage.removeItem("clapo-roles");
  };

  const handleClearStuckMatch = async () => {
    if (!confirm("This will clear you from any stuck/expired match and return your NFT. Continue?")) {
      return;
    }

    setIsClearing(true);
    try {
      await clearStuckMatch();

      // Clear local storage
      handleMatchEnd();

      alert("Stuck match cleared! You can now create or join a new match.");
    } catch (error) {
      console.error("Error clearing stuck match:", error);
      alert("Failed to clear stuck match. Make sure you have an active match that is expired (120+ seconds old).");
    } finally {
      setIsClearing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎮</div>
          <p className="text-gray-400">Loading Clapo Game...</p>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
            Clapo Game
          </h1>
          <p className="text-2xl text-gray-300 mb-8">
            Stake. Strategize. Dominate.
          </p>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Head-to-head NFT prediction duels powered by Pyth price feeds
          </p>
          <button
            onClick={() => connect({ connector: connectors[0] })}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-sm border-b border-purple-500/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
            Clapo Game
          </h1>
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <p className="text-gray-400">Connected</p>
              <p className="text-white font-mono">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </p>
            </div>
            <button
              onClick={() => disconnect()}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Disconnect
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {gameMode === "menu" && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-bold text-white mb-4">Choose Your Path</h2>
              <p className="text-gray-400 text-lg">
                Create a new match or join an existing one
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Create Match */}
              <button
                onClick={() => setGameMode("create")}
                className="bg-gradient-to-br from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 rounded-2xl p-8 transition-all transform hover:scale-105 border-2 border-purple-500"
              >
                <div className="text-6xl mb-4">🎮</div>
                <h3 className="text-3xl font-bold text-white mb-3">Create Match</h3>
                <p className="text-purple-200 mb-4">
                  Start a new match and wait for an opponent to join
                </p>
                <div className="bg-purple-900/50 rounded-lg p-3 text-sm text-purple-200">
                  <div className="font-semibold mb-1">You&apos;ll be Player 1</div>
                  <div>Share your Match ID with friends</div>
                </div>
              </button>

              {/* Join Match */}
              <button
                onClick={() => setGameMode("join")}
                className="bg-gradient-to-br from-pink-600 to-pink-800 hover:from-pink-700 hover:to-pink-900 rounded-2xl p-8 transition-all transform hover:scale-105 border-2 border-pink-500"
              >
                <div className="text-6xl mb-4">⚔️</div>
                <h3 className="text-3xl font-bold text-white mb-3">Join Match</h3>
                <p className="text-pink-200 mb-4">
                  Enter a Match ID to challenge an opponent
                </p>
                <div className="bg-pink-900/50 rounded-lg p-3 text-sm text-pink-200">
                  <div className="font-semibold mb-1">You&apos;ll be Player 2</div>
                  <div>Get the Match ID from your friend</div>
                </div>
              </button>
            </div>

            {/* Info Section */}
            <div className="mt-12 bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h4 className="text-xl font-bold text-white mb-4">How to Play</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
                <div>
                  <div className="font-bold text-purple-400 mb-2">1. Build Portfolio</div>
                  <div>Select 7 crypto assets within 100 point budget</div>
                </div>
                <div>
                  <div className="font-bold text-pink-400 mb-2">2. Choose Roles</div>
                  <div>Pick Leader (2×) and Co-Leader (1.5×) multipliers</div>
                </div>
                <div>
                  <div className="font-bold text-blue-400 mb-2">3. Battle</div>
                  <div>120-second price battle - highest score wins!</div>
                </div>
              </div>
            </div>

            {/* Clear Stuck Match Button */}
            {activeMatchId && activeMatchId > BigInt(0) && (
              <div className="mt-8 text-center">
                <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-4 inline-block mb-4">
                  <p className="text-yellow-400 font-bold mb-2">⚠️ Stuck in a match?</p>
                  <p className="text-yellow-300 text-sm mb-3">
                    If you&apos;re stuck in Match #{activeMatchId.toString()} from an abandoned game,
                    you can clear it after 120 seconds.
                  </p>
                  <button
                    onClick={handleClearStuckMatch}
                    disabled={isClearing || isPending}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isClearing || isPending ? "Clearing..." : "Clear Stuck Match"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {gameMode === "create" && (
          <DraftPanel
            onMatchCreated={handleMatchCreated}
            onBack={() => setGameMode("menu")}
          />
        )}

        {gameMode === "join" && (
          <JoinMatch
            onMatchJoined={handleMatchJoined}
            onBack={() => setGameMode("menu")}
          />
        )}

        {gameMode === "match" && currentMatchId !== null && currentMatchId > BigInt(0) && (
          <MatchRoom matchId={currentMatchId} onMatchEnd={handleMatchEnd} />
        )}
      </main>
    </div>
  );
}
