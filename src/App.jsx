
import React, { useRef, useState } from 'react';
import Dashboard from './components/Dashboard';
import MergeGame from './components/MergeGame';
import MemoryGame from './components/MemoryGame';

const ENTRY_COST = 20;

const redeemRewards = [
  { id: 1, title: 'VE Reward', currency: 'VE', costCoins: 200, icon: '💎' },
  { id: 2, title: 'SVE Reward', currency: 'SVE', costCoins: 300, icon: '🌟' },
  { id: 3, title: 'Gem Pack', currency: 'Gems', costCoins: 100, icon: '💠' },
  { id: 4, title: '50 Bonus Tokens', currency: 'Tokens', costCoins: 100, amount: 50, icon: '🎟️' },
  { id: 5, title: 'Spin Reward', currency: 'Spins', costCoins: 80, amount: 1, icon: '🎡' },
];

export default function App() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [userTokens, setUserTokens] = useState(110);
  const [userCoins, setUserCoins] = useState(245);
  const [toastMessage, setToastMessage] = useState('');
  const [showGuide, setShowGuide] = useState(false);
  const [showGameResult, setShowGameResult] = useState(false);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [pendingScore, setPendingScore] = useState(0);
  const [gameKey, setGameKey] = useState(0);
  const [isStarting, setIsStarting] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [inventory, setInventory] = useState({
    VE: 0,
    SVE: 0,
    Gems: 0,
    Spins: 0,
  });

  const sessionEndedRef = useRef(false);
  const rewardClaimedRef = useRef(false);

  const showToast = (message) => {
    setToastMessage(message);
    window.setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSelectGame = (game) => {
    if (
      game.playable !== true ||
      !['merge-game', 'memory-match'].includes(game.component)
    ) {
      showToast(`${game.title} is coming soon!`);
      return;
    }

    const cost = game.cost || ENTRY_COST;

    if (userTokens < cost) {
      showToast(`Insufficient Tokens. You need ${cost} Tokens.`);
      return;
    }

    setUserTokens((prev) => prev - cost);
    setSelectedGame(game);
    setPendingScore(0);
    setGameKey((prev) => prev + 1);
    setShowGameResult(false);
    setShowGuide(true);
    setIsStarting(false);

    sessionEndedRef.current = false;
    rewardClaimedRef.current = false;

    showToast(`${cost} Tokens deducted. ${game.title} is ready!`);
  };

  const startGameplay = () => {
    setIsStarting(true);
    setShowGuide(false);
    setGameKey((prev) => prev + 1);
    sessionEndedRef.current = false;
    rewardClaimedRef.current = false;
    setIsStarting(false);
  };

  const handleGameEnd = (score) => {
    if (sessionEndedRef.current || rewardClaimedRef.current) return;

    sessionEndedRef.current = true;
    setPendingScore(Math.max(0, Number(score) || 0));
    setShowGameResult(true);
  };

  const handleRevive = () => {
    setShowGameResult(false);
    setPendingScore(0);
    setGameKey((prev) => prev + 1);

    sessionEndedRef.current = false;
    rewardClaimedRef.current = false;

    showToast('Game restarted. Keep playing!');
  };

  const handleNoThanks = () => {
    if (rewardClaimedRef.current) return;

    rewardClaimedRef.current = true;

    const earnedCoins = Math.max(10, Math.floor(pendingScore / 10));

    setUserCoins((prev) => prev + earnedCoins);
    setShowGameResult(false);
    setShowGuide(false);
    setSelectedGame(null);
    setPendingScore(0);

    showToast(`You earned ${earnedCoins} Game Coins!`);
  };

  const handleClaimReward = (reward) => {
    if (userCoins < reward.costCoins) {
      showToast(`Not enough Game Coins. Required: ${reward.costCoins}.`);
      return;
    }

    setSelectedReward(reward);
  };

  const confirmRedemption = () => {
    if (!selectedReward || isRedeeming) return;

    if (userCoins < selectedReward.costCoins) {
      showToast('Insufficient Game Coins.');
      setSelectedReward(null);
      return;
    }

    setIsRedeeming(true);

    const reward = selectedReward;

    setUserCoins((prev) => prev - reward.costCoins);

    if (reward.currency === 'Tokens') {
      setUserTokens((prev) => prev + (reward.amount || 0));
    } else {
      setInventory((prev) => ({
        ...prev,
        [reward.currency]:
          (prev[reward.currency] || 0) +
          (reward.amount || 1),
      }));
    }

    setSelectedReward(null);
    setIsRedeeming(false);

    showToast(`${reward.title} redeemed successfully!`);
  };

  const goHome = () => {
    setSelectedGame(null);
    setShowGuide(false);
    setShowGameResult(false);
    setPendingScore(0);
  };

  const renderGame = () => {
    if (!selectedGame) return null;

    if (selectedGame.component === 'merge-game') {
      return (
        <MergeGame
          key={`merge-${gameKey}`}
          onFinishGame={handleGameEnd}
        />
      );
    }

    if (selectedGame.component === 'memory-match') {
      return (
        <MemoryGame
          key={`memory-${gameKey}`}
          onGameEnd={handleGameEnd}
        />
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white relative font-sans">
      {toastMessage && (
        <div
          role="status"
          className="fixed top-20 right-5 z-[80] bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-xl shadow-2xl"
        >
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      <header className="w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-40">
        <button
          type="button"
          onClick={goHome}
          className="flex items-center gap-2 text-left"
          aria-label="Go to Rewards Hub home"
        >
          <span className="text-xl">🎮</span>
          <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            VELOOP Rewards Hub
          </span>
        </button>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-amber-500/30">
            <img
              src="/assets/games/Token.jpeg"
              alt=""
              className="w-5 h-5 rounded object-cover"
            />
            <span className="text-sm font-bold text-amber-300">
              {userTokens} Tokens
            </span>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-yellow-500/30">
            <img
              src="/assets/games/coins.jpeg"
              alt=""
              className="w-5 h-5 rounded-full object-cover"
            />
            <span className="text-sm font-bold text-yellow-400">
              {userCoins} Coins
            </span>
          </div>

          <button
            type="button"
            onClick={() => showToast('Leaderboard is a demo feature.')}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-700"
          >
            🏆 Leaderboard
          </button>

          <button
            type="button"
            onClick={() => setShowRedeemModal(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-md"
          >
            🎁 Redeem Center
          </button>
        </div>
      </header>

      {selectedGame ? (
        <main className="p-4 sm:p-6 max-w-5xl mx-auto">
          <button
            type="button"
            onClick={goHome}
            className="mb-6 bg-slate-800 hover:bg-slate-700 text-white font-semibold px-4 py-2.5 rounded-xl border border-slate-700"
          >
            ← Back to Dashboard
          </button>

          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-800">
              <div>
                <h2 className="text-2xl font-bold">
                  {selectedGame.title}
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  {selectedGame.description}
                </p>
              </div>

              <div className="flex items-center gap-2 bg-amber-400/10 px-3 py-2 rounded-lg border border-amber-400/20">
                <img
                  src="/assets/games/Token.jpeg"
                  alt=""
                  className="w-4 h-4 rounded object-cover"
                />
                <span className="text-xs font-semibold text-amber-300">
                  {userTokens} Tokens left
                </span>
              </div>
            </div>

            <div className="w-full min-h-[400px] bg-slate-950 rounded-xl border border-slate-800/80 flex flex-col items-center justify-center p-4 sm:p-6">
              {renderGame()}
            </div>
          </section>
        </main>
      ) : (
        <Dashboard onSelectGame={handleSelectGame} />
      )}

      {/* Game Guide */}
      {showGuide && selectedGame && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="game-guide-title"
        >
          <div className="bg-white text-slate-900 w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <div className="text-4xl mb-3">
              {selectedGame.component === 'merge-game' ? '🧩' : '🃏'}
            </div>

            <h2 id="game-guide-title" className="text-2xl font-bold">
              {selectedGame.title} Guide
            </h2>

            <p className="text-slate-600 mt-2">
              {selectedGame.component === 'merge-game'
                ? 'Merge matching number tiles to increase your score. Use the arrow keys or swipe to move tiles.'
                : 'Flip two cards at a time and find matching pairs. Each successful pair increases your score.'}
            </p>

            <div className="bg-slate-100 rounded-xl p-4 mt-4 text-sm space-y-2">
              <p>🎟️ Entry fee: 20 Tokens</p>
              <p>🪙 Stop at any time to collect your score-based reward.</p>
              <p>🎁 Minimum reward: 10 Game Coins.</p>
            </div>

            <button
              type="button"
              disabled={isStarting}
              onClick={startGameplay}
              className="w-full mt-5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-bold py-3 rounded-xl"
            >
              {isStarting ? 'Starting...' : 'Got It — Start Game'}
            </button>

            <button
              type="button"
              onClick={goHome}
              className="w-full mt-2 text-slate-500 hover:text-slate-800 py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Game result / revive */}
      {showGameResult && selectedGame && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="game-result-title"
        >
          <div className="bg-white text-slate-900 w-full max-w-md rounded-2xl p-6 text-center shadow-2xl">
            <div className="text-5xl mb-3">🎉</div>
            <h2 id="game-result-title" className="text-2xl font-bold">
              Game Over!
            </h2>

            <p className="text-slate-600 mt-2">
              Your score: <strong>{pendingScore}</strong>
            </p>

            <p className="text-slate-600 mt-1">
              Collecting now earns at least 10 Game Coins.
            </p>

            <button
              type="button"
              onClick={handleRevive}
              className="w-full mt-5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl"
            >
              🔄 Revive & Play Again
            </button>

            <button
              type="button"
              onClick={handleNoThanks}
              className="w-full mt-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl"
            >
              No Thanks — Collect & Exit
            </button>
          </div>
        </div>
      )}

      {/* Redemption center */}
      {showRedeemModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-2xl p-5 sm:p-6 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="redeem-title"
          >
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800 gap-3">
              <div>
                <h2 id="redeem-title" className="text-xl font-bold text-white">
                  🎁 Redemption Center
                </h2>
                <p className="text-slate-400 text-xs mt-1">
                  Exchange Game Coins for demo rewards
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowRedeemModal(false)}
                className="text-slate-400 hover:text-white bg-slate-800 px-3 py-2 rounded-lg text-sm"
              >
                ✕ Close
              </button>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-amber-500/30 flex items-center justify-between mb-5">
              <span className="text-sm text-slate-400">
                Coins Available
              </span>
              <span className="text-sm font-bold text-yellow-400">
                🪙 {userCoins} Coins
              </span>
            </div>

            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
              {redeemRewards.map((reward) => (
                <div
                  key={reward.id}
                  className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{reward.icon}</span>
                    <div>
                      <h3 className="font-semibold text-sm text-white">
                        {reward.title}
                      </h3>
                      <p className="text-xs text-yellow-400 mt-1">
                        {reward.costCoins} Coins
                      </p>
                      {reward.currency !== 'Tokens' && (
                        <p className="text-xs text-slate-400 mt-1">
                          Owned: {inventory[reward.currency] || 0}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleClaimReward(reward)}
                    disabled={userCoins < reward.costCoins}
                    className={`text-xs font-semibold px-3 py-2 rounded-lg ${
                      userCoins >= reward.costCoins
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {userCoins >= reward.costCoins ? 'Redeem' : 'Not Enough'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Confirm redemption */}
      {selectedReward && (
        <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4">
          <div
            className="bg-white text-slate-900 w-full max-w-sm rounded-2xl p-6 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-redeem-title"
          >
            <div className="text-4xl mb-3">{selectedReward.icon}</div>

            <h2 id="confirm-redeem-title" className="text-xl font-bold">
              Confirm Redemption
            </h2>

            <p className="text-slate-600 text-sm mt-2">
              Redeem {selectedReward.title} for {selectedReward.costCoins} Game Coins?
            </p>

            <p className="text-slate-500 text-xs mt-2">
              This is a demo redemption. No real-world value is transferred.
            </p>

            <div className="flex gap-3 mt-5">
              <button
                type="button"
                disabled={isRedeeming}
                onClick={() => setSelectedReward(null)}
                className="flex-1 bg-slate-200 hover:bg-slate-300 disabled:opacity-60 py-3 rounded-xl font-semibold"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isRedeeming}
                onClick={confirmRedemption}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white py-3 rounded-xl font-semibold"
              >
                {isRedeeming ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
