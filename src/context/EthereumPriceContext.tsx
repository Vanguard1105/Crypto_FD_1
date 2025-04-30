import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

interface PriceData {
  timestamp: number;
  price: number;
  average: number;
}

interface PriceHistory {
  ms: PriceData[];
  '5m': PriceData[];
  '1h': PriceData[];
  '1d': PriceData[];
  '7d': PriceData[];
}

interface EthereumPriceContextType {
  priceHistory: PriceHistory;
  latestPrice: number;
  previousPrice: number;
}

const initialPriceHistory: PriceHistory = {
  ms: [],
  '5m': [],
  '1h': [],
  '1d': [],
  '7d': [],
};

const EthereumPriceContext = createContext<EthereumPriceContextType>({
  priceHistory: initialPriceHistory,
  latestPrice: 0,
  previousPrice: 0,
});

export const EthereumPriceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [priceHistory, setPriceHistory] = useState<PriceHistory>(initialPriceHistory);
  const [latestPrice, setLatestPrice] = useState(0);
  const [previousPrice, setPreviousPrice] = useState(0);

  const fetchHistoricalData = async (range: '1H' | '1D' | '7D', retryCount = 0): Promise<void> => {
    try {
      const proxyUrl = 'https://api.allorigins.win/get?url=';
      const apiUrl = encodeURIComponent(
        `https://api.coinmarketcap.com/data-api/v3/cryptocurrency/detail/chart?id=1027&range=${range}`
      );
      
      const response = await axios.get(proxyUrl + apiUrl);
      const data = JSON.parse(response.data.contents);
  
      const points = data.data.points;
      const rawDataPoints = Object.entries(points).map(([timestamp, value]: [string, any]) => ({
        timestamp: parseInt(timestamp) * 1000,
        price: value.v[0],
        average: value.v[0],
      }));
  
      let dataPoints = rawDataPoints;
      
      // For 1H range, use 1D data as base and modify it
      if (range === '1H') {
        const oneDayPoints = priceHistory['1d'];
        if (oneDayPoints.length > 0) {
          const startTime = Date.now() - 3600 * 1000;
          const scaledPoints = oneDayPoints
            .filter(point => point.timestamp >= startTime)
            .map(point => ({
              ...point,
              timestamp: point.timestamp - (oneDayPoints[0].timestamp - startTime)
            }));
  
          dataPoints = scaledPoints.map(point => {
            const variation = 1 + (Math.random() * 0.1 - 0.05);
            return {
              ...point,
              price: point.price * variation,
              average: point.average * variation
            };
          });
        }
      }
  
      const period = {
        '1H': '1h',
        '1D': '1d',
        '7D': '7d',
      }[range];
  
      setPriceHistory(prev => ({
        ...prev,
        [period]: dataPoints,
      }));
    } catch (error) {
      console.error('Error fetching Ethereum historical data:', error);
      if (retryCount < 3) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
        return fetchHistoricalData(range, retryCount + 1);
      }
      throw error;
    }
  };

  // Fetch real-time price from Coinbase
  const fetchEthereumPrice = async (retryCount = 0): Promise<number | null> => {
    try {
      const response = await axios.get('https://api.coinbase.com/v2/prices/ETH-USD/spot', {
        timeout: 2000
      });
      return parseFloat(response.data.data.amount);
    } catch (error) {
      console.error('Error fetching Ethereum price:', error);
      if (retryCount < 3) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return fetchEthereumPrice(retryCount + 1);
      }
      return null;
    }
  };

  // Update price history
  const updatePriceHistory = async () => {
    const newPrice = await fetchEthereumPrice();
    if (newPrice === null) return;

    const now = Date.now();

    setPriceHistory(prev => {
      const newData = { ...prev };
      
      // Update ms history
      newData.ms = [...prev.ms, { timestamp: now, price: newPrice, average: newPrice }];
      if (newData.ms.length > 300) newData.ms.shift();

      // Update other periods
      const updatePeriod = (period: keyof PriceHistory, interval: number, maxPoints: number) => {
        if (prev[period].length === 0 || now - prev[period][prev[period].length - 1].timestamp >= interval) {
          const average = newData[period].reduce((sum, point) => sum + point.price, newPrice) / (newData[period].length + 1);
          newData[period] = [...prev[period], { timestamp: now, price: newPrice, average }];
          if (newData[period].length > maxPoints) newData[period].shift();
        }
      };

      updatePeriod('5m', 1000, 300);
      updatePeriod('1h', 10000, 360);
      updatePeriod('1d', 300000, 288);
      updatePeriod('7d', 1800000, 336);

      return newData;
    });

    setPreviousPrice(latestPrice);
    setLatestPrice(newPrice);
  };

  // Initialize data on mount
  useEffect(() => {
    fetchHistoricalData('1H');
    fetchHistoricalData('1D');
    fetchHistoricalData('7D');
  }, []);

  // Update real-time data
  useEffect(() => {
    const interval = setInterval(updatePriceHistory, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <EthereumPriceContext.Provider value={{ priceHistory, latestPrice, previousPrice }}>
      {children}
    </EthereumPriceContext.Provider>
  );
};

export const useEthereumPrice = () => {
  const context = useContext(EthereumPriceContext);
  if (!context) {
    throw new Error('useEthereumPrice must be used within an EthereumPriceProvider');
  }
  return context;
};