import React, { createContext, useContext, useState } from 'react';
import { PriceData } from '../types';

interface PredictionContextType {
  predictData: PriceData[];
  setPredictData: React.Dispatch<React.SetStateAction<PriceData[]>>;
}

const PredictionContext = createContext<PredictionContextType>({
  predictData: [],
  setPredictData: () => {},
});

export const PredictionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [predictData, setPredictData] = useState<PriceData[]>([]);

  return (
    <PredictionContext.Provider value={{ predictData, setPredictData }}>
      {children}
    </PredictionContext.Provider>
  );
};

export const usePrediction = () => {
  const context = useContext(PredictionContext);
  if (!context) {
    throw new Error('usePrediction must be used within a PredictionProvider');
  }
  return context;
};