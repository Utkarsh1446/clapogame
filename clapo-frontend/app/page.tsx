"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { DraftPanel } from "@/components/DraftPanel";
import { MatchRoom } from "@/components/MatchRoom";
import { useState } from "react";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [hasMatch, setHasMatch] = useState(false);

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
        {!hasMatch ? (
          <DraftPanel onMatchCreated={() => setHasMatch(true)} />
        ) : (
          <MatchRoom onMatchEnd={() => setHasMatch(false)} />
        )}
      </main>
    </div>
  );
}
