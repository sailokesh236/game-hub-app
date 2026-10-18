
import React, { useMemo, useState } from 'react';
import GamesCarousel from './GamesCarousel';
import { gamesData } from '../data/gamesData';

export default function Dashboard({ onSelectGame }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = useMemo(
    () => ['All', ...new Set(gamesData.map((game) => game.category))],
    []
  );

  const filteredGames = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return gamesData.filter((game) => {
      const matchesSearch =
        game.title.toLowerCase().includes(query) ||
        game.description.toLowerCase().includes(query);

      const matchesCategory =
        selectedCategory === 'All' ||
        game.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const isPlayable = (game) =>
    game.playable === true &&
    ['merge-game', 'memory-match'].includes(game.component);

  return (
    <main className="dashboard-page">
      <section className="dashboard-featured">
        <div className="dashboard-section-heading">
          <div>
            <span className="dashboard-eyebrow">
              YOUR NEXT CHALLENGE
            </span>

            <h1>🔥 Featured Rewards Banners</h1>

            <p>
              Explore exciting games and earn rewards.
              <span> 20 Tokens per entry</span>
            </p>
          </div>

          <div className="dashboard-game-count">
            <span>{gamesData.length}</span>
            <span>Games</span>
          </div>
        </div>

        <GamesCarousel onSelectGame={onSelectGame} />
      </section>

      <section className="dashboard-library">
        <div className="dashboard-library-heading">
          <div>
            <span className="dashboard-eyebrow">EXPLORE & PLAY</span>
            <h2>All Games</h2>
            <p>Find your next favorite challenge.</p>
          </div>

          <span className="dashboard-results-count">
            {filteredGames.length} games
          </span>
        </div>

        <div className="dashboard-filter-panel">
          <label className="dashboard-search">
            <span aria-hidden="true">⌕</span>

            <input
              type="search"
              placeholder="Search games by name or description..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              aria-label="Search games"
            />

            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </label>

          <div
            className="dashboard-category-list"
            aria-label="Filter games by category"
          >
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`dashboard-category-button ${
                  selectedCategory === category ? 'selected' : ''
                }`}
                aria-pressed={selectedCategory === category}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {filteredGames.length > 0 ? (
          <div className="dashboard-game-grid">
            {filteredGames.map((game) => {
              const playable = isPlayable(game);

              return (
                <article
                  key={game.id}
                  className="dashboard-game-card"
                >
                  <div className="dashboard-grid-image">
                    <img
                      src={game.image}
                      alt={game.title}
                      loading="lazy"
                    />

                    <span className="dashboard-grid-category">
                      {game.category}
                    </span>

                    {!playable && (
                      <span className="dashboard-coming-soon-badge">
                        Coming Soon
                      </span>
                    )}
                  </div>

                  <div className="dashboard-grid-content">
                    <h3>{game.title}</h3>

                    <p>{game.description}</p>

                    <div className="dashboard-grid-footer">
                      <span className="dashboard-grid-cost">
                        <img
                          src="/assets/games/coins.jpeg"
                          alt=""
                          aria-hidden="true"
                        />
                        {game.cost || 20} Tokens
                      </span>

                      {playable ? (
                        <button
                          type="button"
                          className="play-now-button"
                          onClick={() => onSelectGame(game)}
                        >
                          <span>Play Now</span>
                          <span aria-hidden="true">→</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="play-now-button"
                          disabled
                          aria-label={`${game.title} coming soon`}
                        >
                          <span>Coming Soon</span>
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="dashboard-empty-state">
            <span aria-hidden="true">🎮</span>
            <h3>No games found</h3>
            <p>Try another search term or category.</p>

            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
