import React, { useState } from 'react';
import Dashboard from './components/Dashboard';

export default function App() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [userTokens, setUserTokens] = useState(110);
  const [userCoins, setUserCoins] = useState(245);
  const [toastMessage, setToastMessage] = useState(null);
  const [showRedeemModal, setShowRedeemModal] = useState(false);

  const redeemRewards = [
    { id: 1, title: '$5 Gift Voucher', costCoins: 200, icon: '💳' },
    { id: 2, title: 'VIP Badge (30 Days)', costCoins: 150, icon: '🛡️' },
    { id: 3, title: '50 Bonus Tokens', costCoins: 100, icon: '🎟️' },
    { id: 4, title: '2x XP Booster', costCoins: 80, icon: '⚡' }
  ];

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSelectGame = (game) => {
    const cost = game.cost || 20;
    if (userTokens < cost) {
      showToast(`⚠️ Insufficient tokens! You need ${cost} tokens.`);
      return;
    }
    setUserTokens((prev) => prev - cost);
    setSelectedGame(game);
    showToast(`🎟️ -${cost} Tokens. Playing ${game.title}!`);
  };

  const handleClaimReward = (reward) => {
    if (userCoins < reward.costCoins) {
      showToast(`⚠️ Insufficient coins! Required: ${reward.costCoins}`);
      return;
    }
    setUserCoins((prev) => prev - reward.costCoins);
    showToast(`🎉 Redeemed "${reward.title}"!`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white relative font-sans">
      {toastMessage && (
        <div className="fixed top-20 right-5 z-50 bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-xl shadow-2xl">
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      <header className="w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎮</span>
          <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            VELOOP Rewards Hub
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-amber-500/30">
            <img src="/assets/games/Token.jpeg" alt="Tokens" className="w-5 h-5 rounded object-cover" />
            <span className="text-sm font-bold text-amber-300">{userTokens} Tokens</span>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-yellow-500/30">
            <img src="/assets/games/coins.jpeg" alt="Coins" className="w-5 h-5 rounded-full object-cover" />
            <span className="text-sm font-bold text-yellow-400">{userCoins} Coins</span>
          </div>

          <button
            onClick={() => showToast("🏆 Leaderboard loaded")}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-700"
          >
            🏆 Leaderboard
          </button>

          <button
            onClick={() => setShowRedeemModal(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-md"
          >
            🎁 Redeem Center
          </button>
        </div>
      </header>

      {selectedGame ? (
        <div className="p-6 max-w-5xl mx-auto">
          <button
            onClick={() => setSelectedGame(null)}
            className="mb-6 bg-slate-800 hover:bg-slate-700 text-white font-semibold px-4 py-2.5 rounded-xl border border-slate-700"
          >
            ← Back to Dashboard
          </button>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
              <div>
                <h1 className="text-2xl font-bold">{selectedGame.title}</h1>
                <p className="text-slate-400 text-xs mt-0.5">{selectedGame.description}</p>
              </div>
              <div className="flex items-center gap-2 bg-amber-400/10 px-3 py-1 rounded-lg border border-amber-400/20">
                <img src="/assets/games/Token.jpeg" alt="Tokens" className="w-4 h-4 rounded object-cover" />
                <span className="text-xs font-semibold text-amber-300">{userTokens} Tokens left</span>
              </div>
            </div>

            <div className="w-full min-h-[400px] bg-slate-950 rounded-xl border border-slate-800/80 flex flex-col items-center justify-center p-6">
              <p className="text-emerald-400 font-bold text-xl mb-2">🎮 {selectedGame.title} Session Active</p>
              <p className="text-slate-400 text-sm">Game module initialized successfully.</p>
            </div>
          </div>
        </div>
      ) : (
        <Dashboard onSelectGame={handleSelectGame} />
      )}

      {showRedeemModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🎁</span>
                <div>
                  <h2 className="text-xl font-bold text-white">Redemption Center</h2>
                  <p className="text-slate-400 text-xs">Exchange earned coins for rewards</p>
                </div>
              </div>
              <button
                onClick={() => setShowRedeemModal(false)}
                className="text-slate-400 hover:text-white bg-slate-800 px-3 py-1 rounded-lg text-sm"
              >
                ✕ Close
              </button>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-amber-500/30 flex items-center justify-between mb-5">
              <span className="text-xs text-slate-400">Coins Available</span>
              <div className="flex items-center gap-2">
                <img src="/assets/games/coins.jpeg" alt="Coins" className="w-5 h-5 rounded-full object-cover" />
                <span className="text-sm font-bold text-yellow-400">{userCoins} Coins</span>
              </div>
            </div>

            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
              {redeemRewards.map((reward) => (
                <div
                  key={reward.id}
                  className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{reward.icon}</span>
                    <div>
                      <h4 className="font-semibold text-sm text-white">{reward.title}</h4>
                      <div className="flex items-center gap-1 mt-0.5">
                        <img src="/assets/games/coins.jpeg" alt="Coins" className="w-3.5 h-3.5 rounded-full" />
                        <span className="text-xs text-yellow-400 font-medium">{reward.costCoins} Coins</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleClaimReward(reward)}
                    disabled={userCoins < reward.costCoins}
                    className={`text-xs font-semibold px-4 py-2 rounded-lg ${
                      userCoins >= reward.costCoins
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {userCoins >= reward.costCoins ? 'Claim Prize' : 'Not Enough'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}