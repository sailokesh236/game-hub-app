import React, { useState } from 'react';

export default function RedemptionCenter({ userRewards, saveRewards, onBack }) {
  const [selectedReward, setSelectedReward] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const redemptionOptions = [
    { id: 've', name: 'VEs', icon: '🌀', rate: 100, gives: '10 VEs', desc: 'Convert Game Coins to standard VEs' },
    { id: 'sve', name: 'SVEs (Silver)', icon: '🥈', rate: 150, gives: '15 SVEs', desc: 'Convert to Silver VEs' },
    { id: 'gems', name: 'Gems', icon: '💎', rate: 80, gives: '25 Gems', desc: 'Convert Game Coins to premium Gems' },
    { id: 'tokens', name: 'Tokens', icon: '🪙', rate: 50, gives: '50 Tokens', desc: 'Refill your game entry Tokens' },
    { id: 'spins', name: 'Spin Voucher', icon: '🎰', rate: 120, gives: '1 Spin Ticket', desc: 'Get a Lucky Spin Wheel ticket' },
  ];

  const handleConfirmRedeem = () => {
    if (!selectedReward) return;
    if (userRewards.gameCoins < selectedReward.rate) return;

    const updated = {
      ...userRewards,
      gameCoins: userRewards.gameCoins - selectedReward.rate,
      coins: selectedReward.id === 'tokens' ? userRewards.coins + 50 : userRewards.coins
    };

    saveRewards(updated);
    setSuccessMessage(`Successfully redeemed ${selectedReward.gives}!`);
    setSelectedReward(null);

    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="min-h-screen bg-[#161827] text-white p-6 max-w-5xl mx-auto">
      {/* Header Navigation */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition"
        >
          ← Back to Dashboard
        </button>

        <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl">
          <span className="text-amber-400 text-base">✨</span>
          <span className="text-sm font-extrabold text-amber-300">{userRewards.gameCoins || 0} Game Coins</span>
        </div>
      </div>

      <div className="text-center mb-10">
        <h2 className="text-3xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Game Coin Redemption Center
        </h2>
        <p className="text-xs text-slate-400 mt-2">
          Exchange your centralized Game Coins into valuable platform rewards!
        </p>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm font-bold text-center rounded-2xl animate-fade-in">
          ✅ {successMessage}
        </div>
      )}

      {/* Redemption Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {redemptionOptions.map((option) => {
          const canAfford = userRewards.gameCoins >= option.rate;
          return (
            <div
              key={option.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:border-indigo-500/50 transition duration-300 shadow-xl"
            >
              <div>
                <div className="text-4xl mb-3">{option.icon}</div>
                <h3 className="text-lg font-bold text-white">{option.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{option.desc}</p>
                <div className="mt-4 text-xs font-semibold text-indigo-400">
                  Receive: <span className="text-white font-bold">{option.gives}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="text-xs text-amber-400 font-bold">
                  Cost: {option.rate} Coins
                </div>

                <button
                  disabled={!canAfford}
                  onClick={() => setSelectedReward(option)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition active:scale-95 ${
                    canAfford
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {canAfford ? 'Redeem' : 'Need More Coins'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation Modal */}
      {selectedReward && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl">
            <div className="text-5xl mb-3">{selectedReward.icon}</div>
            <h3 className="text-xl font-bold text-white mb-2">Confirm Redemption</h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Are you sure you want to convert <span className="text-amber-400 font-bold">{selectedReward.rate} Game Coins</span> into <span className="text-indigo-300 font-bold">{selectedReward.gives}</span>?
            </p>

            <div className="flex space-x-3">
              <button
                onClick={() => setSelectedReward(null)}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRedeem}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}