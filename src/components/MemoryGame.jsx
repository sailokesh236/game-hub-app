import React, { useState, useEffect } from 'react';

const CARD_SYMBOLS = ['🎮', '🕹️', '👾', '🎲', '🧩', '⚡', '🏆', '🎯'];

export default function MemoryGame({ onGameEnd }) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  // Initialize and shuffle board
  const initializeGame = () => {
    const deck = [...CARD_SYMBOLS, ...CARD_SYMBOLS]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({ id: index, symbol }));
    setCards(deck);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setIsGameOver(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  // Handle card click
  const handleCardClick = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index) || isGameOver) {
      return;
    }

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1);
      const [firstIdx, secondIdx] = newFlipped;

      if (cards[firstIdx].symbol === cards[secondIdx].symbol) {
        const newMatched = [...matched, firstIdx, secondIdx];
        setMatched(newMatched);
        setFlipped([]);

        // Game Won Check
        if (newMatched.length === cards.length) {
          setIsGameOver(true);
          const calculatedScore = Math.max(1000 - moves * 30, 200);
          if (onGameEnd) {
            onGameEnd(calculatedScore);
          }
        }
      } else {
        setTimeout(() => setFlipped([]), 900);
      }
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-slate-900 text-white rounded-xl shadow-2xl max-w-md mx-auto">
      <div className="flex justify-between w-full mb-4 px-2">
        <span className="text-sm font-semibold text-slate-400">Moves: {moves}</span>
        <span className="text-sm font-semibold text-emerald-400">
          Matches: {matched.length / 2} / {CARD_SYMBOLS.length}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-3 w-full mb-6">
        {cards.map((card, index) => {
          const isFlipped = flipped.includes(index) || matched.includes(index);
          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(index)}
              className={`h-16 rounded-lg text-2xl flex items-center justify-center transition-all duration-300 transform active:scale-95 ${
                isFlipped ? 'bg-indigo-600 rotate-0' : 'bg-slate-700 hover:bg-slate-600'
              }`}
            >
              {isFlipped ? card.symbol : '❓'}
            </button>
          );
        })}
      </div>

      {isGameOver ? (
        <div className="text-center my-2">
          <p className="text-emerald-400 font-bold text-lg mb-2">🎉 Stage Cleared!</p>
          <button
            onClick={initializeGame}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition"
          >
            Play Again
          </button>
        </div>
      ) : (
        <button
          onClick={initializeGame}
          className="text-xs text-slate-400 hover:text-white underline"
        >
          Reset Game
        </button>
      )}
    </div>
  );
}