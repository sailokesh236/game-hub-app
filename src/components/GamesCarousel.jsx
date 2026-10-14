import React from 'react';
import { gamesData } from '../data/gamesData';

export default function GamesCarousel({ onSelectGame }) {
  return (
    <div className="w-full my-6">
      <div className="flex gap-5 overflow-x-auto pb-4 pt-1">
        {gamesData.map((game) => (
          <div
            key={game.id}
            className="min-w-[280px] max-w-[280px] bg-slate-800 rounded-xl overflow-hidden border border-slate-700/80 flex flex-col justify-between shadow-lg flex-shrink-0"
          >
            <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-900">
              <img
                src={game.image}
                alt={game.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2.5 left-2.5 bg-black/70 text-[11px] font-semibold px-2.5 py-0.5 rounded-full text-white">
                {game.category}
              </span>
            </div>

            <div className="p-4 flex flex-col flex-grow justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">{game.title}</h3>
                <p className="text-slate-400 text-xs line-clamp-2 mb-4">
                  {game.description}
                </p>
              </div>

              <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-700/60">
                <span className="text-xs font-semibold text-amber-300 flex items-center gap-1.5 bg-amber-400/10 px-2.5 py-1 rounded-md border border-amber-400/20">
                  <img
                    src="/assets/games/Token.jpeg"
                    alt="Tokens"
                    className="w-4 h-4 rounded object-cover"
                  />
                  {game.cost || 20} Tokens
                </span>
                <button
                  onClick={() => onSelectGame(game)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors"
                >
                  Play Now →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}