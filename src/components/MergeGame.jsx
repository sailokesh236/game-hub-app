
import React, { useState, useEffect, useCallback } from "react";

const SIZE = 4;

const addRandomTile = (board) => {
  const empty = board
    .map((value, index) => (value === 0 ? index : -1))
    .filter((index) => index !== -1);

  if (empty.length === 0) return [...board];

  const index = empty[Math.floor(Math.random() * empty.length)];
  const next = [...board];
  next[index] = Math.random() < 0.9 ? 2 : 4;

  return next;
};

const createBoard = () => {
  let board = Array(SIZE * SIZE).fill(0);
  board = addRandomTile(board);
  board = addRandomTile(board);
  return board;
};

const hasMoves = (board) => {
  if (board.includes(0)) return true;

  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      const index = row * SIZE + col;

      if (
        col < SIZE - 1 &&
        board[index] === board[index + 1]
      ) {
        return true;
      }

      if (
        row < SIZE - 1 &&
        board[index] === board[index + SIZE]
      ) {
        return true;
      }
    }
  }

  return false;
};

const slideRow = (row) => {
  const values = row.filter((value) => value !== 0);
  const result = [];
  let gained = 0;

  for (let i = 0; i < values.length; i++) {
    if (values[i] === values[i + 1]) {
      const merged = values[i] * 2;
      result.push(merged);
      gained += merged;
      i++;
    } else {
      result.push(values[i]);
    }
  }

  while (result.length < SIZE) result.push(0);

  return { row: result, gained };
};

const moveBoard = (board, direction) => {
  const next = [...board];
  let gained = 0;

  for (let line = 0; line < SIZE; line++) {
    const indices = [];

    for (let i = 0; i < SIZE; i++) {
      indices.push(
        direction === "left" || direction === "right"
          ? line * SIZE + i
          : i * SIZE + line
      );
    }

    if (direction === "right" || direction === "down") {
      indices.reverse();
    }

    const result = slideRow(
      indices.map((index) => board[index])
    );

    indices.forEach((index, i) => {
      next[index] = result.row[i];
    });

    gained += result.gained;
  }

  const changed = next.some(
    (value, index) => value !== board[index]
  );

  if (changed) {
    const boardWithTile = addRandomTile(next);

    return {
      board: boardWithTile,
      gained,
      changed: true,
      gameOver: !hasMoves(boardWithTile),
    };
  }

  return {
    board,
    gained: 0,
    changed: false,
    gameOver: !hasMoves(board),
  };
};

const colors = {
  0: "bg-slate-900/70 border border-slate-800",
  2: "bg-indigo-600 text-white",
  4: "bg-purple-600 text-white",
  8: "bg-pink-600 text-white",
  16: "bg-rose-500 text-white",
  32: "bg-orange-500 text-white",
  64: "bg-amber-400 text-slate-950",
  128: "bg-yellow-300 text-slate-950",
  256: "bg-lime-300 text-slate-950",
  512: "bg-emerald-400 text-slate-950",
  1024: "bg-cyan-300 text-slate-950",
  2048: "bg-white text-slate-950",
};

export default function MergeGame({ onFinishGame }) {
  const [board, setBoard] = useState(createBoard);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [finished, setFinished] = useState(false);

  const restartGame = useCallback(() => {
    setBoard(createBoard());
    setScore(0);
    setGameOver(false);
    setFinished(false);
  }, []);

  const move = useCallback(
    (direction) => {
      if (gameOver || finished) return;

      setBoard((current) => {
        const result = moveBoard(current, direction);

        if (!result.changed) {
          if (result.gameOver) setGameOver(true);
          return current;
        }

        setScore((previous) => {
          const updated = previous + result.gained;
          setBestScore((best) => Math.max(best, updated));
          return updated;
        });

        if (result.gameOver) setGameOver(true);

        return result.board;
      });
    },
    [gameOver, finished]
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      const keys = {
        ArrowLeft: "left",
        ArrowRight: "right",
        ArrowUp: "up",
        ArrowDown: "down",
      };

      if (!keys[event.key]) return;

      event.preventDefault();
      move(keys[event.key]);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [move]);

  const handleTouchStart = (event) => {
    const touch = event.touches[0];
    event.currentTarget.dataset.touchX = touch.clientX;
    event.currentTarget.dataset.touchY = touch.clientY;
  };

  const handleTouchEnd = (event) => {
    const touch = event.changedTouches[0];
    const startX = Number(event.currentTarget.dataset.touchX);
    const startY = Number(event.currentTarget.dataset.touchY);
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;

    if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < 25) {
      return;
    }

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      move(deltaX > 0 ? "right" : "left");
    } else {
      move(deltaY > 0 ? "down" : "up");
    }
  };

  // Players can submit their current score at any time.
  const collectRewards = () => {
    if (finished) return;

    setFinished(true);

    if (onFinishGame) {
      onFinishGame(score);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col items-center gap-4">
      <div className="grid grid-cols-2 gap-3 w-full">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
          <p className="text-xs text-slate-400">SCORE</p>
          <p className="text-xl font-extrabold text-amber-400">
            {score}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
          <p className="text-xs text-slate-400">
            BEST THIS SESSION
          </p>
          <p className="text-xl font-extrabold text-emerald-400">
            {bestScore}
          </p>
        </div>
      </div>

      <p className="text-sm text-slate-400 text-center">
        Use arrow keys or swipe to move. Match equal tiles to merge them!
      </p>

      {gameOver && !finished && (
        <div className="text-center">
          <p className="text-rose-400 text-xl font-bold">
            Game Over!
          </p>
          <p className="text-sm text-slate-400">
            No more moves available. Collect your rewards.
          </p>
        </div>
      )}

      {finished ? (
        <div className="text-center">
          <p className="text-emerald-400 font-bold">
            Rewards submitted!
          </p>
          <p className="text-sm text-slate-400 mt-1">
            Your final score was {score}.
          </p>
        </div>
      ) : (
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="grid grid-cols-4 gap-2 w-full aspect-square bg-slate-950 p-2.5 rounded-2xl border border-slate-800"
          aria-label="Merge Master game board"
        >
          {board.map((value, index) => (
            <div
              key={index}
              className={`rounded-lg flex items-center justify-center font-extrabold text-xl sm:text-2xl ${
                colors[value] || "bg-amber-300 text-slate-950"
              }`}
            >
              {value || ""}
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 w-full">
        <button
          onClick={restartGame}
          className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700"
        >
          ↻ New Game
        </button>

        <button
          onClick={collectRewards}
          disabled={finished}
          className="py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold text-sm"
        >
          {finished
            ? "Rewards Submitted"
            : "Stop & Collect Rewards 🎉"}
        </button>
      </div>
    </div>
  );
}
