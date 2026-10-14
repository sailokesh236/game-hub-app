import React, { useState } from "react";

const MergeGame = ({ onFinishGame }) => {
  const [board, setBoard] = useState([
    [2, 2, 4, 0],
    [0, 4, 8, 0],
    [2, 0, 2, 4],
    [0, 2, 0, 8],
  ]);
  const [score, setScore] = useState(120);

  const handleTileClick = (r, c) => {
    if (board[r][c] === 0) return;
    
    // Simple double tile mechanic for interactive play
    const newBoard = board.map((row) => [...row]);
    newBoard[r][c] = newBoard[r][c] * 2;
    setBoard(newBoard);
    setScore((prev) => prev + newBoard[r][c]);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="flex justify-between w-full max-w-xs px-2 text-sm">
        <span className="text-slate-400">Tap tiles to combine!</span>
        <span className="font-bold text-amber-400">Score: {score}</span>
      </div>

      {/* 4x4 Grid */}
      <div className="grid grid-cols-4 gap-2 bg-slate-950 p-3 rounded-2xl border border-slate-800 w-full max-w-xs">
        {board.map((row, r) =>
          row.map((val, c) => (
            <button
              key={`${r}-${c}`}
              onClick={() => handleTileClick(r, c)}
              className={`h-16 rounded-xl font-extrabold text-lg flex items-center justify-center transition-all transform active:scale-95 shadow-md ${
                val === 0
                  ? "bg-slate-900/50 border border-slate-800/40"
                  : val === 2
                  ? "bg-indigo-600 text-white"
                  : val === 4
                  ? "bg-purple-600 text-white"
                  : val === 8
                  ? "bg-pink-600 text-white"
                  : "bg-amber-500 text-slate-950 font-black"
              }`}
            >
              {val > 0 ? val : ""}
            </button>
          ))
        )}
      </div>

      <button
        onClick={() => onFinishGame(score)}
        className="w-full max-w-xs py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 font-bold rounded-xl text-sm text-slate-950 transition-all shadow-lg cursor-pointer mt-2"
      >
        Collect Rewards & Claim XP 🎉
      </button>
    </div>
  );
};

export default MergeGame;