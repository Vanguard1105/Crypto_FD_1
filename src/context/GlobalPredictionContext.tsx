import React, { createContext, useContext, useState } from 'react';
import { PriceData, DrawingState } from '../types';
import { usePrice } from './PriceContext';
import { useEthereumPrice } from './EthereumPriceContext';
import { useBitcoinPrice } from './BitcoinPriceContext';

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
  startPrediction: (token: 'SOL' | 'ETH' | 'BTC') => void;
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
  startPrediction: () => {},
});

export const GlobalPredictionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { latestPrice: solLatestPrice } = usePrice();
  const { latestPrice: ethLatestPrice } = useEthereumPrice();
  const { latestPrice: btcLatestPrice } = useBitcoinPrice();
  
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

  const startPrediction = (token: 'SOL' | 'ETH' | 'BTC') => {
    const now = Date.now();
    const endTime = now + 30000; // 30 seconds from now

    switch (token) {
      case 'SOL':
        updatePrediction(token, {
          drawingState: {
            isActive: true,
            startTime: now,
            endTime,
            startPrice: solLatestPrice,
          },
          countdown: 30,
        });
        break;
      case 'ETH':
        updatePrediction(token, {
          drawingState: {
            isActive: true,
            startTime: now,
            endTime,
            startPrice: ethLatestPrice,
          },
          countdown: 30,
        });
        break;
      case 'BTC':
        updatePrediction(token, {
          drawingState: {
            isActive: true,
            startTime: now,
            endTime,
            startPrice: btcLatestPrice,
          },
          countdown: 30,
        });
        break;
    }
  };

  return (
    <GlobalPredictionContext.Provider
      value={{
        solPrediction,
        ethPrediction,
        btcPrediction,
        updatePrediction,
        setVote,
        startPrediction,
      }}
    >
      {children}
    </GlobalPredictionContext.Provider>
  );
};

export const useGlobalPrediction = () => useContext(GlobalPredictionContext);