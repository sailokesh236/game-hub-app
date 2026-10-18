import React, { createContext, useContext, useState } from 'react';

const GameCoinContext = createContext(null);

export const GameCoinProvider = ({ children }) => {
  const [tokens, setTokens] = useState(110);
  const [gameCoins, setGameCoins] = useState(245);
  const [ves, setVes] = useState(10);
  const [sves, setSves] = useState(5);
  const [gems, setGems] = useState(50);
  const [spins, setSpins] = useState(3);

  const deductTokens = (amount = 20) => {
    if (tokens >= amount) {
      setTokens((prev) => prev - amount);
      return true;
    }
    return false;
  };

  const addGameCoins = (amount) => {
    setGameCoins((prev) => prev + amount);
  };

  const redeemCoins = (costCoins, rewardType, rewardAmount) => {
    if (gameCoins < costCoins) return false;
    
    setGameCoins((prev) => prev - costCoins);
    if (rewardType === 'VE') setVes((prev) => prev + rewardAmount);
    if (rewardType === 'SVE') setSves((prev) => prev + rewardAmount);
    if (rewardType === 'Gems') setGems((prev) => prev + rewardAmount);
    if (rewardType === 'Tokens') setTokens((prev) => prev + rewardAmount);
    if (rewardType === 'Spins') setSpins((prev) => prev + rewardAmount);
    return true;
  };

  return (
    <GameCoinContext.Provider
      value={{
        tokens,
        gameCoins,
        ves,
        sves,
        gems,
        spins,
        deductTokens,
        addGameCoins,
        redeemCoins,
      }}
    >
      {children}
    </GameCoinContext.Provider>
  );
};

export const useGameCoin = () => {
  const context = useContext(GameCoinContext);
  if (!context) {
    // Return safe fallback default values if rendered outside provider
    return {
      tokens: 110,
      gameCoins: 245,
      ves: 10,
      sves: 5,
      gems: 50,
      spins: 3,
      deductTokens: () => true,
      addGameCoins: () => {},
      redeemCoins: () => true,
    };
  }
  return context;
};