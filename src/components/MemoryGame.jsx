
import React, { useState, useEffect, useRef, useCallback } from 'react';

const CARD_SYMBOLS = ['🎮', '🕹️', '👾', '🎲', '🧩', '⚡', '🏆', '🎯'];
const POINTS_PER_MATCH = 100;

const createDeck = () =>
  [...CARD_SYMBOLS, ...CARD_SYMBOLS]
    .map((symbol, index) => ({
      id: index,
      symbol,
      shuffleKey: Math.random(),
    }))
    .sort((a, b) => a.shuffleKey - b.shuffleKey)
    .map(({ id, symbol }) => ({ id, symbol }));

export default function MemoryGame({ onGameEnd }) {
  const [cards, setCards] = useState(createDeck);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Prevent two rapid clicks from processing the same turn.
  const resolvingRef = useRef(false);
  const timeoutRef = useRef(null);
  const submittedRef = useRef(false);

  const initializeGame = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setCards(createDeck());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setScore(0);
    setIsGameOver(false);
    setIsSubmitted(false);

    resolvingRef.current = false;
    submittedRef.current = false;
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCardClick = (index) => {
    if (
      resolvingRef.current ||
      isGameOver ||
      isSubmitted ||
      flipped.includes(index) ||
      matched.includes(index)
    ) {
      return;
    }

    if (flipped.length === 0) {
      setFlipped([index]);
      return;
    }

    const firstIndex = flipped[0];
    const secondIndex = index;

    setFlipped([firstIndex, secondIndex]);
    setMoves((previous) => previous + 1);

    if (cards[firstIndex].symbol === cards[secondIndex].symbol) {
      resolvingRef.current = true;

      const nextMatched = [...matched, firstIndex, secondIndex];
      setMatched(nextMatched);
      setScore((previous) => previous + POINTS_PER_MATCH);
      setFlipped([]);

      if (nextMatched.length === cards.length) {
        setIsGameOver(true);
      }

      resolvingRef.current = false;
    } else {
      resolvingRef.current = true;

      timeoutRef.current = window.setTimeout(() => {
        setFlipped([]);
        resolvingRef.current = false;
        timeoutRef.current = null;
      }, 900);
    }
  };

  const stopAndCollect = () => {
    if (submittedRef.current) return;

    submittedRef.current = true;

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    resolvingRef.current = false;
    setFlipped([]);
    setIsGameOver(true);
    setIsSubmitted(true);

    if (onGameEnd) {
      onGameEnd(score);
    }
  };

  const matchesFound = matched.length / 2;

  return (
    <div className="flex flex-col items-center p-4 bg-slate-900 text-white rounded-xl shadow-2xl w-full max-w-md mx-auto gap-4">
      <div className="grid grid-cols-3 gap-2 w-full">
        <div className="bg-slate-950 rounded-lg p-3 text-center">
          <p className="text-xs text-slate-400">MOVES</p>
          <p className="text-lg font-bold text-white">{moves}</p>
        </div>

        <div className="bg-slate-950 rounded-lg p-3 text-center">
          <p className="text-xs text-slate-400">MATCHES</p>
          <p className="text-lg font-bold text-emerald-400">
            {matchesFound}/{CARD_SYMBOLS.length}
          </p>
        </div>

        <div className="bg-slate-950 rounded-lg p-3 text-center">
          <p className="text-xs text-slate-400">SCORE</p>
          <p className="text-lg font-bold text-amber-400">{score}</p>
        </div>
      </div>

      <p className="text-xs text-slate-400 text-center">
        Flip two cards to find matching symbols. Each matching pair earns 100 points.
      </p>

      <div className="grid grid-cols-4 gap-2 sm:gap-3 w-full">
        {cards.map((card, index) => {
          const isFlipped =
            flipped.includes(index) || matched.includes(index);

          return (
            <button
              key={card.id}
              type="button"
              onClick={() => handleCardClick(index)}
              disabled={
                isGameOver ||
                isSubmitted ||
                matched.includes(index) ||
                resolvingRef.current
              }
              aria-label={
                isFlipped ? card.symbol : `Card ${index + 1}, hidden`
              }
              className={`aspect-square min-h-0 rounded-lg text-xl sm:text-2xl flex items-center justify-center transition-all duration-300 active:scale-95 ${
                isFlipped
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-700 hover:bg-slate-600 text-white'
              } disabled:cursor-default`}
            >
              {isFlipped ? card.symbol : '❓'}
            </button>
          );
        })}
      </div>

      {isGameOver && !isSubmitted && (
        <div className="text-center">
          <p className="text-emerald-400 font-bold text-lg">
            🎉 All Matches Found!
          </p>
          <p className="text-sm text-slate-400">
            Final score: {score}. Collect your rewards!
          </p>
        </div>
      )}

      {isSubmitted ? (
        <div className="text-center">
          <p className="text-emerald-400 font-bold">
            Rewards submitted!
          </p>
          <p className="text-sm text-slate-400">
            Final score: {score}
          </p>

          <button
            type="button"
            onClick={initializeGame}
            className="mt-3 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold"
          >
            Play Again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 w-full">
          <button
            type="button"
            onClick={initializeGame}
            className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700"
          >
            ↻ New Game
          </button>

          <button
            type="button"
            onClick={stopAndCollect}
            className="py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold text-sm"
          >
            Stop & Collect 🎉
          </button>
        </div>
      )}
    </div>
  );
}
