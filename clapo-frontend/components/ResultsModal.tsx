"use client";

interface ResultsModalProps {
  player1Score: number;
  player2Score: number;
  onClose: () => void;
}

export function ResultsModal({ player1Score, player2Score, onClose }: ResultsModalProps) {
  const player1Won = player1Score > player2Score;
  const isTie = Math.abs(player1Score - player2Score) < 0.01;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 border-2 border-purple-500 rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl">
        {/* Title */}
        <div className="text-center mb-8">
          {isTie ? (
            <>
              <h2 className="text-5xl font-bold text-yellow-400 mb-2">It&apos;s a Tie!</h2>
              <p className="text-gray-400">Both NFTs returned</p>
            </>
          ) : (
            <>
              <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text mb-2">
                {player1Won ? "You Won!" : "You Lost"}
              </h2>
              <p className="text-gray-400">
                {player1Won ? "You won both NFTs!" : "Better luck next time"}
              </p>
            </>
          )}
        </div>

        {/* Scores */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className={`bg-gray-800 rounded-lg p-6 text-center ${
            player1Won && !isTie ? "border-2 border-green-500" : ""
          }`}>
            <div className="text-sm text-gray-400 mb-2">YOU</div>
            <div className="text-3xl font-bold text-white mb-2">Player 1</div>
            <div className={`text-4xl font-bold ${
              player1Score >= 0 ? "text-green-400" : "text-red-400"
            }`}>
              {player1Score >= 0 ? "+" : ""}{player1Score.toFixed(2)}
            </div>
            {player1Won && !isTie && (
              <div className="mt-4 text-green-400 font-bold text-lg">WINNER</div>
            )}
          </div>

          <div className={`bg-gray-800 rounded-lg p-6 text-center ${
            !player1Won && !isTie ? "border-2 border-green-500" : ""
          }`}>
            <div className="text-sm text-gray-400 mb-2">OPPONENT</div>
            <div className="text-3xl font-bold text-white mb-2">Player 2</div>
            <div className={`text-4xl font-bold ${
              player2Score >= 0 ? "text-green-400" : "text-red-400"
            }`}>
              {player2Score >= 0 ? "+" : ""}{player2Score.toFixed(2)}
            </div>
            {!player1Won && !isTie && (
              <div className="mt-4 text-green-400 font-bold text-lg">WINNER</div>
            )}
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-bold text-white mb-4">Performance Breakdown</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-400 mb-2">Your Best Performer</div>
              <div className="flex items-center justify-between bg-gray-700 p-3 rounded">
                <span className="font-bold text-white">BTC ★</span>
                <span className="text-green-400">+8.5%</span>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-2">Your Worst Performer</div>
              <div className="flex items-center justify-between bg-gray-700 p-3 rounded">
                <span className="font-bold text-white">DOGE</span>
                <span className="text-red-400">-3.2%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Match Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6 text-center">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-white">120s</div>
            <div className="text-xs text-gray-400">Duration</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-white">7</div>
            <div className="text-xs text-gray-400">Assets</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-white">
              {Math.abs(player1Score - player2Score).toFixed(2)}
            </div>
            <div className="text-xs text-gray-400">Margin</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-bold hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            New Match
          </button>
          <button
            onClick={() => {
              // TODO: Share to Twitter
              alert("Share functionality coming soon!");
            }}
            className="flex-1 bg-gray-700 text-white py-3 rounded-lg font-bold hover:bg-gray-600 transition-all"
          >
            Share Result
          </button>
        </div>
      </div>
    </div>
  );
}
