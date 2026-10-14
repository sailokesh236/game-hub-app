import React, { useState } from 'react';
import GamesCarousel from './GamesCarousel';
import { gamesData } from '../data/gamesData';

export default function Dashboard({ onSelectGame }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(gamesData.map((g) => g.category))];

  const filteredGames = gamesData.filter((game) => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-2">🔥 Featured Rewards Banners</h2>
        <p className="text-slate-400 text-xs mb-4">Explore top games • 20 Tokens per entry</p>
        <GamesCarousel onSelectGame={onSelectGame} />
      </section>

      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <input
            type="text"
            placeholder="Search games..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-72 bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none"
          />

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                  selectedCategory === cat ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredGames.map((game) => (
            <div
              key={game.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-md"
            >
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-3 bg-slate-950">
                <img src={game.image} alt={game.title} className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 bg-black/70 text-[10px] font-semibold px-2 py-0.5 rounded-full text-white">
                  {game.category}
                </span>
              </div>

              <div className="flex-grow">
                <h4 className="font-bold text-white text-base mb-1">{game.title}</h4>
                <p className="text-slate-400 text-xs line-clamp-2 mb-3">{game.description}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <span className="text-xs font-semibold text-amber-300 flex items-center gap-1">
                  <img src="/assets/games/Token.jpeg" alt="Tokens" className="w-4 h-4 rounded object-cover" />
                  {game.cost || 20} Tokens
                </span>
                <button
                  onClick={() => onSelectGame(game)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg"
                >
                  Play Now →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}