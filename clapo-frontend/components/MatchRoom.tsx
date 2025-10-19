"use client";

import { useState, useEffect } from "react";
import { GAME_CONFIG } from "@/lib/constants";
import { ResultsModal } from "./ResultsModal";

interface MatchRoomProps {
  onMatchEnd: () => void;
}

export function MatchRoom({ onMatchEnd }: MatchRoomProps) {
  const [timeRemaining, setTimeRemaining] = useState(GAME_CONFIG.MATCH_DURATION);
  const [matchStarted, setMatchStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Mock data for demonstration
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);

  useEffect(() => {
    if (!matchStarted) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleMatchEnd();
          return 0;
        }
        return prev - 1;
      });

      // Simulate score changes
      setPlayer1Score((prev) => prev + Math.random() * 20 - 10);
      setPlayer2Score((prev) => prev + Math.random() * 20 - 10);
    }, 1000);

    return () => clearInterval(interval);
  }, [matchStarted]);

  const handleMatchEnd = () => {
    setShowResults(true);
  };

  const handleStartMatch = () => {
    setMatchStarted(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (showResults) {
    return (
      <ResultsModal
        player1Score={player1Score}
        player2Score={player2Score}
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
          {matchStarted ? "Battle In Progress" : "Waiting for Opponent"}
        </h2>

        {/* Timer */}
        {matchStarted && (
          <div className="inline-block bg-gray-800 rounded-lg px-8 py-4 mb-4">
            <div className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
              {formatTime(timeRemaining)}
            </div>
            <div className="text-gray-400 mt-2">Time Remaining</div>
          </div>
        )}
      </div>

      {/* Score Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Player 1 */}
        <div className="bg-gray-800 rounded-lg p-6 border-2 border-purple-500">
          <div className="text-center">
            <div className="text-sm text-gray-400 mb-2">YOU</div>
            <div className="text-3xl font-bold text-white mb-4">Player 1</div>
            <div className={`text-5xl font-bold ${
              player1Score >= 0 ? "text-green-400" : "text-red-400"
            }`}>
              {player1Score >= 0 ? "+" : ""}{player1Score.toFixed(2)}
            </div>
            <div className="text-gray-400 mt-2">Score</div>
          </div>

          {/* Mock portfolio */}
          <div className="mt-6 space-y-2">
            <div className="text-sm text-gray-400 mb-3">Your Portfolio</div>
            {["BTC", "ETH", "SOL", "BNB", "AVAX", "ADA", "DOGE"].map((symbol, i) => (
              <div key={symbol} className="flex justify-between items-center bg-gray-700 p-2 rounded">
                <span className="font-bold text-white">
                  {symbol}
                  {i === 0 && <span className="ml-2 text-xs text-yellow-400">★ Leader</span>}
                  {i === 1 && <span className="ml-2 text-xs text-blue-400">Co-Lead</span>}
                </span>
                <span className={Math.random() > 0.5 ? "text-green-400" : "text-red-400"}>
                  {Math.random() > 0.5 ? "+" : ""}{(Math.random() * 10 - 5).toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Player 2 */}
        <div className="bg-gray-800 rounded-lg p-6 border-2 border-pink-500">
          <div className="text-center">
            <div className="text-sm text-gray-400 mb-2">OPPONENT</div>
            <div className="text-3xl font-bold text-white mb-4">Player 2</div>
            <div className={`text-5xl font-bold ${
              player2Score >= 0 ? "text-green-400" : "text-red-400"
            }`}>
              {player2Score >= 0 ? "+" : ""}{player2Score.toFixed(2)}
            </div>
            <div className="text-gray-400 mt-2">Score</div>
          </div>

          {/* Mock portfolio (hidden until reveal) */}
          <div className="mt-6 space-y-2">
            <div className="text-sm text-gray-400 mb-3">
              {matchStarted && timeRemaining > 0 ? "Picks Hidden" : "Opponent Portfolio"}
            </div>
            {matchStarted && timeRemaining > 0 ? (
              <div className="text-center py-8 text-gray-500">
                Picks will be revealed after the match
              </div>
            ) : (
              ["ETH", "BTC", "XRP", "MATIC", "NEAR", "TRX", "SHIB"].map((symbol, i) => (
                <div key={symbol} className="flex justify-between items-center bg-gray-700 p-2 rounded">
                  <span className="font-bold text-white">
                    {symbol}
                    {i === 0 && <span className="ml-2 text-xs text-yellow-400">★ Leader</span>}
                    {i === 1 && <span className="ml-2 text-xs text-blue-400">Co-Lead</span>}
                  </span>
                  <span className={Math.random() > 0.5 ? "text-green-400" : "text-red-400"}>
                    {Math.random() > 0.5 ? "+" : ""}{(Math.random() * 10 - 5).toFixed(2)}%
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Start Button */}
      {!matchStarted && (
        <div className="text-center">
          <button
            onClick={handleStartMatch}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-4 rounded-lg text-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105"
          >
            Start Match
          </button>
          <p className="text-gray-400 mt-4 text-sm">
            Both players must reveal their picks to start
          </p>
        </div>
      )}

      {/* Match Info */}
      <div className="mt-8 text-center text-gray-400 text-sm">
        <p>Match ID: #12345 • Duration: {GAME_CONFIG.MATCH_DURATION}s</p>
      </div>
    </div>
  );
}
