import React from 'react';

export default function LeaderboardModal({ onClose }) {
  const dummyLeaderboard = [
    { rank: 1, name: 'Alex_Master', score: '2,450', avatar: '👑' },
    { rank: 2, name: 'CyberGamer', score: '1,980', avatar: '🥈' },
    { rank: 3, name: 'ProPlayer99', score: '1,620', avatar: '🥉' },
    { rank: 4, name: 'You', score: '1,200', avatar: '🎮' },
    { rank: 5, name: 'PixelHero', score: '950', avatar: '👾' },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 rounded-2xl p-6 max-w-md w-full relative shadow-2xl border border-slate-800 text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl font-bold transition"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
            🏆 Global Leaderboard
          </h2>
          <p className="text-xs text-slate-400 mt-1">Top players this week</p>
        </div>

        <div className="space-y-3">
          {dummyLeaderboard.map((player) => (
            <div
              key={player.rank}
              className={`flex items-center justify-between p-3 rounded-xl border ${
                player.name === 'You'
                  ? 'bg-indigo-950/60 border-indigo-500/50'
                  : 'bg-slate-800/60 border-slate-700/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg font-bold w-6 text-slate-400">
                  #{player.rank}
                </span>
                <span className="text-xl">{player.avatar}</span>
                <span className={`font-semibold ${player.name === 'You' ? 'text-indigo-400' : 'text-slate-200'}`}>
                  {player.name}
                </span>
              </div>
              <span className="font-mono font-bold text-emerald-400">{player.score} pts</span>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-medium transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}