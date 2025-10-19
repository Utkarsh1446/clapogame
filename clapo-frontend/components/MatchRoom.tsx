"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";
import { GAME_CONFIG, MatchState, ASSETS } from "@/lib/constants";
import { useMatch, useMatchmaker } from "@/hooks/useMatchmaker";
import { ResultsModal } from "./ResultsModal";

interface MatchRoomProps {
  matchId: bigint;
  onMatchEnd: () => void;
}

// Type for the Match struct returned from contract
interface MatchData {
  matchId: bigint;
  state: number;
  player1: {
    player: string;
    nftContract: string;
    nftTokenId: bigint;
    commitHash: string;
    hasCommitted: boolean;
    hasRevealed: boolean;
  };
  player2: {
    player: string;
    nftContract: string;
    nftTokenId: bigint;
    commitHash: string;
    hasCommitted: boolean;
    hasRevealed: boolean;
  };
}

export function MatchRoom({ matchId, onMatchEnd }: MatchRoomProps) {
  const { address } = useAccount();
  const { match, isLoading } = useMatch(matchId);
  const { startMatch, revealAndSettle, cancelMatch, isPending } = useMatchmaker();

  const [timeRemaining, setTimeRemaining] = useState<number>(GAME_CONFIG.MATCH_DURATION);
  const [showResults, setShowResults] = useState(false);
  const [revealing, setRevealing] = useState(false);
  const [waitingTime, setWaitingTime] = useState<number>(0);
  const [cancelling, setCancelling] = useState(false);

  // Parse match data with proper types
  const matchData = match as unknown as MatchData | undefined;
  const matchState = matchData ? Number(matchData.state) : MatchState.Created;
  const player1 = matchData?.player1.player || null;
  const player2 = matchData?.player2.player || null;
  const hasPlayer2 = player2 && player2 !== "0x0000000000000000000000000000000000000000";
  const isPlayer1 = address?.toLowerCase() === player1?.toLowerCase();

  // Get saved portfolio from localStorage
  const savedAssets = typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("clapo-assets") || "[]")
    : [];
  const savedRoles = typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("clapo-roles") || "[]")
    : [];
  const savedSalt = typeof window !== "undefined"
    ? localStorage.getItem("clapo-salt") || ""
    : "";

  const handleMatchEnd = useCallback(async () => {
    setRevealing(true);
    try {
      // Reveal and settle
      await revealAndSettle(
        matchId,
        savedAssets,
        savedRoles,
        savedSalt
      );

      setShowResults(true);
    } catch (error) {
      console.error("Error revealing:", error);
      alert("Failed to reveal picks. Check console for details.");
    } finally {
      setRevealing(false);
    }
  }, [matchId, savedAssets, savedRoles, savedSalt, revealAndSettle]);

  // Timer for started matches
  useEffect(() => {
    if (matchState !== MatchState.Started) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleMatchEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [matchState, handleMatchEnd]);

  // Waiting timer for matches without opponent
  useEffect(() => {
    if (matchState !== MatchState.Created || hasPlayer2) return;

    const interval = setInterval(() => {
      setWaitingTime((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
      setWaitingTime(0);
    };
  }, [matchState, hasPlayer2]);

  const handleStartMatch = async () => {
    if (!hasPlayer2) {
      alert("Waiting for opponent to join!");
      return;
    }

    try {
      await startMatch(matchId);
    } catch (error) {
      console.error("Error starting match:", error);
      alert("Failed to start match. Check console for details.");
    }
  };

  const handleCancelMatch = async () => {
    if (!confirm("Are you sure you want to cancel this match? Your NFT will be returned.")) {
      return;
    }

    setCancelling(true);
    try {
      await cancelMatch(matchId);

      // Clear local storage and go back to menu
      setTimeout(() => {
        onMatchEnd();
      }, 2000);
    } catch (error) {
      console.error("Error cancelling match:", error);
      alert("Failed to cancel match. Check console for details.");
    } finally {
      setCancelling(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto text-center">
        <div className="text-4xl font-bold text-white mb-4">Loading Match...</div>
      </div>
    );
  }

  if (showResults) {
    return (
      <ResultsModal
        player1Score={0} // TODO: Get from contract after settlement
        player2Score={0}
        onClose={() => {
          setShowResults(false);
          onMatchEnd();
        }}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Match Status */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-white mb-4">
          {matchState === MatchState.Created && "Waiting for Opponent"}
          {matchState === MatchState.Committed && "Ready to Start"}
          {matchState === MatchState.Started && "Battle In Progress"}
          {matchState === MatchState.Ended && "Match Ended - Revealing..."}
          {matchState === MatchState.Settled && "Match Complete"}
        </h2>

        {/* Match ID */}
        <div className="text-gray-400 mb-4">
          Match #{matchId.toString()}
        </div>

        {/* Timer */}
        {matchState === MatchState.Started && (
          <div className="inline-block bg-gray-800 rounded-lg px-8 py-4 mb-4">
            <div className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
              {formatTime(timeRemaining)}
            </div>
            <div className="text-gray-400 mt-2">Time Remaining</div>
          </div>
        )}
      </div>

      {/* Player Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Player 1 */}
        <div className={`bg-gray-800 rounded-lg p-6 border-2 ${
          isPlayer1 ? "border-purple-500" : "border-gray-700"
        }`}>
          <div className="text-center">
            <div className="text-sm text-gray-400 mb-2">
              {isPlayer1 ? "YOU" : "OPPONENT"}
            </div>
            <div className="text-2xl font-bold text-white mb-4">Player 1</div>
            <div className="text-sm text-gray-500 font-mono">
              {player1?.slice(0, 6)}...{player1?.slice(-4)}
            </div>
            <div className="mt-4 text-green-400 font-bold">
              ✓ Portfolio Committed
            </div>
          </div>

          {/* Show portfolio if you're player 1 */}
          {isPlayer1 && savedAssets.length > 0 && (
            <div className="mt-6 space-y-2">
              <div className="text-sm text-gray-400 mb-3">Your Portfolio</div>
              {savedAssets.map((symbol: string, i: number) => (
                <div key={symbol} className="flex justify-between items-center bg-gray-700 p-2 rounded">
                  <span className="font-bold text-white">
                    {symbol}
                    {savedRoles[i] === 2 && <span className="ml-2 text-xs text-yellow-400">★ Leader (2×)</span>}
                    {savedRoles[i] === 1 && <span className="ml-2 text-xs text-blue-400">Co-Lead (1.5×)</span>}
                  </span>
                  <span className="text-gray-400 text-sm">
                    {ASSETS[symbol as keyof typeof ASSETS]?.cost || 0} pts
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Player 2 */}
        <div className={`bg-gray-800 rounded-lg p-6 border-2 ${
          !isPlayer1 ? "border-pink-500" : "border-gray-700"
        }`}>
          <div className="text-center">
            <div className="text-sm text-gray-400 mb-2">
              {!isPlayer1 ? "YOU" : "OPPONENT"}
            </div>
            <div className="text-2xl font-bold text-white mb-4">Player 2</div>
            {hasPlayer2 ? (
              <>
                <div className="text-sm text-gray-500 font-mono">
                  {player2?.slice(0, 6)}...{player2?.slice(-4)}
                </div>
                <div className="mt-4 text-green-400 font-bold">
                  ✓ Portfolio Committed
                </div>
              </>
            ) : (
              <div className="mt-4 text-yellow-400 font-bold">
                Waiting to Join...
              </div>
            )}
          </div>

          {/* Hidden portfolio */}
          {hasPlayer2 && (
            <div className="mt-6 space-y-2">
              <div className="text-sm text-gray-400 mb-3">
                {matchState < MatchState.Ended ? "Picks Hidden" : "Opponent Portfolio"}
              </div>
              {matchState < MatchState.Ended ? (
                <div className="text-center py-8 text-gray-500">
                  Picks will be revealed after the match
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  Revealing...
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="text-center">
        {matchState === MatchState.Created && !hasPlayer2 && (
          <div>
            <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-4 mb-4 inline-block max-w-md">
              <p className="text-yellow-400 font-bold mb-2">Waiting for opponent to join...</p>
              <p className="text-yellow-300 text-sm mb-3">
                Share Match ID #{matchId.toString()} with your opponent
              </p>
              <div className="text-gray-400 text-sm">
                Waiting time: {Math.floor(waitingTime / 60)}:{(waitingTime % 60).toString().padStart(2, "0")}
              </div>
            </div>

            {/* Cancel Button */}
            <div className="mt-4">
              <button
                onClick={handleCancelMatch}
                disabled={cancelling}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelling ? "Cancelling..." : "Cancel Match & Return NFT"}
              </button>
              <p className="text-gray-500 text-xs mt-2">
                Your NFT will be returned to you
              </p>
            </div>
          </div>
        )}

        {matchState === MatchState.Committed && hasPlayer2 && (
          <div>
            <button
              onClick={handleStartMatch}
              disabled={isPending}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-4 rounded-lg text-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Starting..." : "Start Match"}
            </button>
            <p className="text-gray-400 mt-4 text-sm">
              Both players have committed - ready to battle!
            </p>
          </div>
        )}

        {matchState === MatchState.Ended && (
          <div>
            <button
              onClick={handleMatchEnd}
              disabled={revealing || isPending}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-4 rounded-lg text-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {revealing || isPending ? "Revealing..." : "Reveal & Settle"}
            </button>
            <p className="text-gray-400 mt-4 text-sm">
              Match ended - reveal your picks to settle
            </p>
          </div>
        )}
      </div>

      {/* Match Info */}
      <div className="mt-8 text-center text-gray-400 text-sm">
        <p>Duration: {GAME_CONFIG.MATCH_DURATION}s • Network: Monad Testnet</p>
      </div>
    </div>
  );
}
