import React, { useEffect } from 'react';
import { useGlobalPrediction } from '../context/GlobalPredictionContext';
import { usePrice } from '../context/PriceContext';
import { useEthereumPrice } from '../context/EthereumPriceContext';
import { useBitcoinPrice } from '../context/BitcoinPriceContext';
import { PriceData } from '../types';
import { usePrediction } from '../context/PredictionContext';

const DRAW_DURATION = 90000; // 1.5 minutes in milliseconds
const PREPARATION_TIME = 30000; // 30 seconds in milliseconds

export const PredictionService: React.FC = () => {
  const { solPrediction, ethPrediction, btcPrediction, updatePrediction } = useGlobalPrediction();
  const { latestPrice: solLatestPrice } = usePrice();
  const { latestPrice: ethLatestPrice } = useEthereumPrice();
  const { latestPrice: btcLatestPrice } = useBitcoinPrice();
  const { setPredictData } = usePrediction();
  // Run SOL prediction
  useEffect(() => {
    const runPrediction = (
      token: 'SOL' | 'ETH' | 'BTC', 
      latestPrice: number, 
      drawingState: any, 
      countdown: number
    ) => {
      // Update price data
      const updateInterval = setInterval(() => {
        const now = Date.now();
        let variation: number;
        switch (token) {
          case 'SOL':
            variation = (Math.random() - 0.5) * 0.01; // ±0.01
            break;
          case 'ETH':
            variation = (Math.random() - 0.5) * 0.1; // ±0.1
            break;
          case 'BTC':
            variation = (Math.random() - 0.5); // ±1
            break;
          default:
            variation = 0;
        }

        const newPoint: PriceData = {
          timestamp: now,
          price: latestPrice + variation,
        };
        
        // Get current data and update
        const currentData = token === 'SOL' 
          ? solPrediction.predictData 
          : token === 'ETH' 
            ? ethPrediction.predictData 
            : btcPrediction.predictData;
        
        const updatedData = [...currentData, newPoint].slice(-300);
        updatePrediction(token, {
          predictData: updatedData,
        });
        if (token === 'SOL') setPredictData(prev => {
          return [...prev, newPoint].slice(-300); // Keep last 300 points
        });
      }, 400);

      // Handle drawing state
      if (!drawingState.isActive) {
        const timer = setInterval(() => {
          const currentCountdown = token === 'SOL' 
            ? solPrediction.countdown 
            : token === 'ETH' 
              ? ethPrediction.countdown 
              : btcPrediction.countdown;

          if (currentCountdown <= 1) {
            const now = Date.now();
            updatePrediction(token, {
              drawingState: {
                isActive: true,
                startTime: now,
                endTime: now + DRAW_DURATION,
                startPrice: latestPrice,
              },
              countdown: DRAW_DURATION / 1000,
            });
          } else {
            updatePrediction(token, {
              countdown: currentCountdown - 1,
            });
          }
        }, 1000);
        return () => {
          clearInterval(timer);
          clearInterval(updateInterval);
        };
      } else {
        const timer = setInterval(() => {
          const now = Date.now();
          if (now >= drawingState.endTime) {
            updatePrediction(token, {
              drawingState: { ...drawingState, isActive: false },
              countdown: PREPARATION_TIME / 1000,
              selectedVote: null,
            });
          } else {
            updatePrediction(token, {
              countdown: Math.ceil((drawingState.endTime - now) / 1000),
            });
          }
        }, 1000);
        return () => {
          clearInterval(timer);
          clearInterval(updateInterval);
        };
      }
    };

    // Start all prediction processes
    const solCleanup = runPrediction('SOL', solLatestPrice, solPrediction.drawingState, solPrediction.countdown);
    const ethCleanup = runPrediction('ETH', ethLatestPrice, ethPrediction.drawingState, ethPrediction.countdown);
    const btcCleanup = runPrediction('BTC', btcLatestPrice, btcPrediction.drawingState, btcPrediction.countdown);

    return () => {
      solCleanup();
      ethCleanup();
      btcCleanup();
    };
  }, [
    solLatestPrice, ethLatestPrice, btcLatestPrice,
    solPrediction.drawingState, ethPrediction.drawingState, btcPrediction.drawingState,
    solPrediction.countdown, ethPrediction.countdown, btcPrediction.countdown,
    solPrediction.predictData, ethPrediction.predictData, btcPrediction.predictData,
    updatePrediction
  ]);

  return null; // This component doesn't render anything
};