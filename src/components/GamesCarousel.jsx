
import React, { useEffect, useRef, useState } from 'react';
import { gamesData } from '../data/gamesData';

export default function GamesCarousel({ onSelectGame }) {
  const carouselRef = useRef(null);
  const [activeDot, setActiveDot] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const carouselGames = [...gamesData, ...gamesData];

  const isPlayable = (game) =>
    game.playable === true &&
    ['merge-game', 'memory-match'].includes(game.component);

  useEffect(() => {
    const carousel = carouselRef.current;

    if (!carousel || gamesData.length < 2 || isPaused) return;

    let frameId;
    let previousTime = 0;
    const speed = 28;

    const animate = (time) => {
      const currentCarousel = carouselRef.current;
      if (!currentCarousel) return;

      if (previousTime) {
        const elapsed = Math.min(time - previousTime, 50);

        currentCarousel.scrollLeft += (speed * elapsed) / 1000;

        const loopPoint = currentCarousel.scrollWidth / 2;

        if (
          loopPoint > 0 &&
          currentCarousel.scrollLeft >= loopPoint
        ) {
          currentCarousel.scrollLeft -= loopPoint;
        }
      }

      previousTime = time;
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
  }, [isPaused]);

  const handleScroll = () => {
    const carousel = carouselRef.current;
    if (!carousel || !gamesData.length) return;

    const firstCard = carousel.querySelector('[data-game-card]');
    if (!firstCard) return;

    const cardWidth = firstCard.getBoundingClientRect().width;
    const containerStyle = window.getComputedStyle(carousel);
    const gap =
      parseFloat(containerStyle.columnGap) ||
      parseFloat(containerStyle.gap) ||
      0;

    const itemWidth = cardWidth + gap;

    if (itemWidth > 0) {
      const index = Math.floor(carousel.scrollLeft / itemWidth);
      setActiveDot(index % gamesData.length);
    }
  };

  const scrollToGame = (index) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const firstCard = carousel.querySelector('[data-game-card]');
    if (!firstCard) return;

    const cardWidth = firstCard.getBoundingClientRect().width;
    const containerStyle = window.getComputedStyle(carousel);
    const gap =
      parseFloat(containerStyle.columnGap) ||
      parseFloat(containerStyle.gap) ||
      0;

    setIsPaused(true);

    carousel.scrollTo({
      left: index * (cardWidth + gap),
      behavior: 'smooth',
    });

    setActiveDot(index);
  };

  const handleDotClick = (index) => {
    scrollToGame(index);
  };

  return (
    <section className="games-carousel-section">
      <div
        ref={carouselRef}
        className="games-carousel-track"
        onScroll={handleScroll}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocusCapture={() => setIsPaused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setIsPaused(false);
          }
        }}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        aria-label="Featured games"
      >
        {carouselGames.map((game, index) => {
          const playable = isPlayable(game);

          return (
            <article
              key={`${game.id}-${index}`}
              data-game-card
              className="game-banner-card"
            >
              <div className="game-banner-image">
                <img
                  src={game.image}
                  alt={game.title}
                  loading={index < 4 ? 'eager' : 'lazy'}
                  draggable="false"
                />

                <span className="game-category">
                  {game.category}
                </span>

                {!playable && (
                  <span className="dashboard-coming-soon-badge">
                    Coming Soon
                  </span>
                )}
              </div>

              <div className="game-banner-content">
                <div className="game-banner-description">
                  <h3>{game.title}</h3>
                  <p>{game.description}</p>
                </div>

                <div className="game-banner-footer">
                  <span className="game-token-cost">
                    <img
                      src="/assets/games/coins.jpeg"
                      alt=""
                      aria-hidden="true"
                    />
                    <span>{game.cost || 20} Tokens</span>
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

      <div className="games-carousel-dots" aria-label="Choose a game">
        {gamesData.map((game, index) => (
          <button
            key={game.id}
            type="button"
            className={`carousel-dot ${
              activeDot === index ? 'active' : ''
            }`}
            aria-label={`Go to ${game.title}`}
            aria-current={activeDot === index ? 'true' : undefined}
            onClick={() => handleDotClick(index)}
          />
        ))}
      </div>
    </section>
  );
}
