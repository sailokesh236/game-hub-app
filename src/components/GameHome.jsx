import React, { useState } from 'react';

export default function GameHome({ game, userRewards, onBack, onStartGame }) {
  const [showGuide, setShowGuide] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handlePlayClick = () => {
    // Check if user has at least 20 tokens
    if (userRewards.coins < 20) {
      setErrorMsg("Not enough Tokens! You need 20 Tokens to play.");
      return;
    }
    setErrorMsg("");
    setShowGuide(true); // Show How to Play guide first on first entry
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Navigation / Header (Light Theme) */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
        >
          ← Back to Games
        </button>

        <div className="flex items-center space-x-3 bg-amber-50 border border-amber-200 px-4 py-2 rounded-2xl">
          <span className="text-amber-500 text-base">🪙</span>
          <div>
            <div className="text-[10px] uppercase font-bold text-amber-600 tracking-wider">Game Coins</div>
            <div className="text-sm font-extrabold text-amber-800">{userRewards.gameCoins || 100}</div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 flex flex-col items-center justify-center">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden max-w-lg w-full text-center p-8">
          
          {/* Game Illustration */}
          <div className="h-52 w-full rounded-2xl overflow-hidden bg-slate-900 mb-6 relative shadow-inner">
            <img 
              src={game.image} 
              alt={game.title} 
              className="w-full h-full object-cover" 
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
              <span className="bg-indigo-600 text-white text-xs px-3 py-1 rounded-full font-bold">
                {game.category}
              </span>
            </div>
          </div>

          <h2 className="text-2xl font-black text-slate-900">{game.title}</h2>
          <p className="text-sm text-slate-600 mt-2 mb-6">{game.description}</p>

          {/* Entry Fee Requirement */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Entry Fee</span>
            <div className="flex items-center space-x-1.5 text-amber-600 font-bold text-sm">
              <span>🪙</span>
              <span>20 Tokens</span>
            </div>
          </div>

          {/* Error Message if insufficient tokens */}
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-xl">
              {errorMsg}
            </div>
          )}

          {/* Play Now Button */}
          <button
            onClick={handlePlayClick}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-sm font-extrabold rounded-2xl shadow-lg transition-all active:scale-98"
          >
            Play Now (20 Tokens)
          </button>
        </div>
      </main>

      {/* First-Time Game Guide Modal */}
      {showGuide && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-2">How to Play</h3>
            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              Interact with the game, score points before time runs out, and avoid obstacles to maximize your Game Coin rewards!
            </p>
            <button
              onClick={() => {
                setShowGuide(false);
                onStartGame(game.component);
              }}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition"
            >
              Got It, Start Game!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}