import React, { createContext, useContext, useState, useEffect } from 'react';
import { PriceData, DrawingState } from '../types';

// Define types for each token's prediction state
interface TokenPredictionState {
  predictData: PriceData[];
  drawingState: DrawingState;
  countdown: number;
  selectedVote: 'up' | 'down' | null;
}

interface GlobalPredictionContextType {
  solPrediction: TokenPredictionState;
  ethPrediction: TokenPredictionState;
  btcPrediction: TokenPredictionState;
  updatePrediction: (token: 'SOL' | 'ETH' | 'BTC', data: Partial<TokenPredictionState>) => void;
  setVote: (token: 'SOL' | 'ETH' | 'BTC', vote: 'up' | 'down' | null) => void;
}

const defaultDrawingState: DrawingState = {
  isActive: false,
  startTime: 0,
  endTime: 0,
  startPrice: 0,
};

const defaultPredictionState: TokenPredictionState = {
  predictData: [],
  drawingState: defaultDrawingState,
  countdown: 30,
  selectedVote: null,
};

const GlobalPredictionContext = createContext<GlobalPredictionContextType>({
  solPrediction: defaultPredictionState,
  ethPrediction: defaultPredictionState,
  btcPrediction: defaultPredictionState,
  updatePrediction: () => {},
  setVote: () => {},
});

export const GlobalPredictionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [solPrediction, setSolPrediction] = useState<TokenPredictionState>(defaultPredictionState);
  const [ethPrediction, setEthPrediction] = useState<TokenPredictionState>(defaultPredictionState);
  const [btcPrediction, setBtcPrediction] = useState<TokenPredictionState>(defaultPredictionState);

  const updatePrediction = (token: 'SOL' | 'ETH' | 'BTC', data: Partial<TokenPredictionState>) => {
    switch (token) {
      case 'SOL':
        setSolPrediction(prev => ({ ...prev, ...data }));
        break;
      case 'ETH':
        setEthPrediction(prev => ({ ...prev, ...data }));
        break;
      case 'BTC':
        setBtcPrediction(prev => ({ ...prev, ...data }));
        break;
    }
  };

  const setVote = (token: 'SOL' | 'ETH' | 'BTC', vote: 'up' | 'down' | null) => {
    updatePrediction(token, { selectedVote: vote });
  };

  return (
    <GlobalPredictionContext.Provider
      value={{
        solPrediction,
        ethPrediction,
        btcPrediction,
        updatePrediction,
        setVote,
      }}
    >
      {children}
    </GlobalPredictionContext.Provider>
  );
};

export const useGlobalPrediction = () => useContext(GlobalPredictionContext);
