import React, { useState } from 'react';
import confetti from 'canvas-confetti';

const GameArcadeModal = ({ isOpen, onClose, game, userTokens, userCoins, onPlayGame, onWinCoins }) => {
  const [activeTab, setActiveTab] = useState('spin'); // 'spin' | 'memory' | 'cards'

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden text-white flex flex-col">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-800/80 border-b border-slate-700/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-2xl">
              🎮
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide">
                {game?.title || "VELOOP Arcade Center"}
              </h2>
              <p className="text-xs text-slate-400">Entry: <span className="text-amber-400 font-semibold">20 Tokens</span> per match</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-700/60 transition text-slate-400 hover:text-white text-xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* Arcade Selector Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-6 pt-3 gap-3">
          <button
            onClick={() => setActiveTab('spin')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-t-xl font-bold text-sm transition-all ${
              activeTab === 'spin'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            ✨ Spin Wheel
          </button>

          <button
            onClick={() => setActiveTab('memory')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-t-xl font-bold text-sm transition-all ${
              activeTab === 'memory'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            ⚡ Memory Match
          </button>

          <button
            onClick={() => setActiveTab('cards')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-t-xl font-bold text-sm transition-all ${
              activeTab === 'cards'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            🏆 Mystery Cards
          </button>
        </div>

        {/* Dynamic Game View */}
        <div className="p-6 bg-slate-900/90 flex-1 flex flex-col items-center justify-center">
          {activeTab === 'spin' && (
            <SpinWheelGame tokens={userTokens} onPlayGame={onPlayGame} onWinCoins={onWinCoins} />
          )}

          {activeTab === 'memory' && (
            <MemoryMatchGame tokens={userTokens} onPlayGame={onPlayGame} onWinCoins={onWinCoins} />
          )}

          {activeTab === 'cards' && (
            <LuckyPickGame tokens={userTokens} onPlayGame={onPlayGame} onWinCoins={onWinCoins} />
          )}
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   GAME 1: SPIN THE WHEEL
   ========================================== */
const SpinWheelGame = ({ tokens, onPlayGame, onWinCoins }) => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);

  const prizes = [50, 100, 20, 200, 10, 500, 0, 150];

  const handleSpin = () => {
    if (tokens < 20) {
      alert("You need 20 tokens to play!");
      return;
    }
    if (spinning) return;

    onPlayGame(20);
    setSpinning(true);
    setResult(null);

    const randomIndex = Math.floor(Math.random() * prizes.length);
    const prizeCoins = prizes[randomIndex];
    const degreesPerSegment = 360 / prizes.length;
    
    const extraRounds = 5 * 360;
    const targetDegree = extraRounds + (prizes.length - randomIndex) * degreesPerSegment - degreesPerSegment / 2;

    setRotation((prev) => prev + targetDegree);

    setTimeout(() => {
      setSpinning(false);
      setResult(prizeCoins);
      if (prizeCoins > 0) {
        onWinCoins(prizeCoins);
        try { confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } }); } catch (e) {}
      }
    }, 4000);
  };

  return (
    <div className="flex flex-col items-center justify-center py-2 w-full">
      <div className="relative w-64 h-64 my-4">
        {/* Pointer */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-amber-400 drop-shadow-lg" />

        {/* Outer Ring */}
        <div className="w-full h-full rounded-full border-4 border-amber-400/90 shadow-[0_0_25px_rgba(251,191,36,0.25)] p-2 bg-slate-950">
          <div 
            className="w-full h-full rounded-full relative overflow-hidden transition-all duration-[4000ms] cubic-bezier(0.15, 0.9, 0.2, 1)"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {prizes.map((prize, idx) => {
              const angle = (360 / prizes.length) * idx;
              return (
                <div
                  key={idx}
                  className="absolute w-1/2 h-1/2 top-0 right-0 origin-bottom-left flex items-center justify-center text-xs font-bold"
                  style={{
                    transform: `rotate(${angle}deg)`,
                    backgroundColor: idx % 2 === 0 ? '#1e1b4b' : '#312e81',
                  }}
                >
                  <span className="transform -rotate-45 translate-x-3 translate-y-2 text-amber-300 font-extrabold text-sm">
                    {prize} 🪙
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <button
        onClick={handleSpin}
        disabled={spinning}
        className="mt-3 px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-lg transition disabled:opacity-50"
      >
        {spinning ? "Spinning..." : "SPIN (20 TOKENS)"}
      </button>

      {result !== null && (
        <div className="mt-3 text-center">
          <p className="text-lg font-bold text-emerald-400">
            {result > 0 ? `🎉 You Won ${result} Coins!` : "Better luck next time!"}
          </p>
        </div>
      )}
    </div>
  );
};

/* ==========================================
   GAME 2: MEMORY MATCH
   ========================================== */
const MemoryMatchGame = ({ tokens, onPlayGame, onWinCoins }) => {
  const cardsData = ['🚀', '💎', '🎮', '🔥', '🚀', '💎', '🎮', '🔥'];
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const startMemoryGame = () => {
    if (tokens < 20) {
      alert("You need 20 tokens to play!");
      return;
    }
    onPlayGame(20);
    const shuffled = [...cardsData].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setIsPlaying(true);
  };

  const handleCardClick = (index) => {
    if (!isPlaying || flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (cards[first] === cards[second]) {
        const updatedMatched = [...matched, first, second];
        setMatched(updatedMatched);
        setFlipped([]);

        if (updatedMatched.length === cards.length) {
          onWinCoins(150);
          try { confetti(); } catch (e) {}
        }
      } else {
        setTimeout(() => setFlipped([]), 800);
      }
    }
  };

  return (
    <div className="flex flex-col items-center py-2">
      {!isPlaying ? (
        <div className="text-center py-6">
          <p className="text-slate-300 mb-4">Pair all matching cards to win <span className="text-amber-400 font-bold">150 Coins</span>!</p>
          <button
            onClick={startMemoryGame}
            className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-lg transition"
          >
            PLAY MEMORY MATCH (20 TOKENS)
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-3 my-2">
          {cards.map((card, idx) => {
            const isFlipped = flipped.includes(idx) || matched.includes(idx);
            return (
              <button
                key={idx}
                onClick={() => handleCardClick(idx)}
                className={`w-16 h-16 rounded-xl text-2xl flex items-center justify-center font-bold transition-all duration-300 ${
                  isFlipped 
                    ? 'bg-indigo-600 border border-indigo-400' 
                    : 'bg-slate-800 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                {isFlipped ? card : '❓'}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ==========================================
   GAME 3: MYSTERY CARDS
   ========================================== */
const LuckyPickGame = ({ tokens, onPlayGame, onWinCoins }) => {
  const [picked, setPicked] = useState(null);
  const rewards = [50, 10, 250, 0, 100, 30];

  const handlePick = (idx) => {
    if (picked !== null) return;
    if (tokens < 20) {
      alert("You need 20 tokens to play!");
      return;
    }

    onPlayGame(20);
    setPicked(idx);
    const prize = rewards[idx];
    if (prize > 0) {
      onWinCoins(prize);
      try { confetti(); } catch (e) {}
    }
  };

  return (
    <div className="flex flex-col items-center py-2 text-center">
      <p className="text-slate-300 mb-4">Pick a mystery card to reveal your reward!</p>

      <div className="grid grid-cols-3 gap-3 mb-4">
        {rewards.map((reward, idx) => (
          <button
            key={idx}
            onClick={() => handlePick(idx)}
            className={`w-24 h-32 rounded-xl border flex flex-col items-center justify-center transition-all duration-300 ${
              picked === idx
                ? 'bg-amber-500 border-amber-300 text-slate-950 font-bold shadow-xl'
                : 'bg-slate-800 border-slate-700 hover:border-emerald-500'
            }`}
          >
            {picked === idx ? (
              <div>
                <span className="text-xl">🪙</span>
                <p className="text-lg font-extrabold">+{reward}</p>
              </div>
            ) : (
              <span className="text-2xl">✨</span>
            )}
          </button>
        ))}
      </div>

      {picked !== null && (
        <button
          onClick={() => setPicked(null)}
          className="px-5 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-medium transition"
        >
          Pick Again
        </button>
      )}
    </div>
  );
};

export default GameArcadeModal;