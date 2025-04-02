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

interface BitcoinPriceContextType {
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

const BitcoinPriceContext = createContext<BitcoinPriceContextType>({
  priceHistory: initialPriceHistory,
  latestPrice: 0,
  previousPrice: 0,
});

export const BitcoinPriceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [priceHistory, setPriceHistory] = useState<PriceHistory>(initialPriceHistory);
  const [latestPrice, setLatestPrice] = useState(0);
  const [previousPrice, setPreviousPrice] = useState(0);

  // Fetch historical data from CoinMarketCap API
  const fetchHistoricalData = async (range: '1H' | '1D' | '7D') => {
    try {
      const proxyUrl = 'https://cors-anywhere.herokuapp.com/'; // Use a CORS proxy
      const apiUrl = `https://api.coinmarketcap.com/data-api/v3/cryptocurrency/detail/chart?id=1&range=${range}`;
      
      const response = await axios.get(proxyUrl + apiUrl);
  
      const points = response.data.data.points;
      const dataPoints = Object.entries(points).map(([timestamp, value]: [string, any]) => ({
        timestamp: parseInt(timestamp) * 1000, // Convert to milliseconds
        price: value.v[0], // First value in the array is the price
        average: value.v[0], // Use the same value for average
      }));
  
      // Map the range to the correct period
      const period = {
        '1H': '1h',
        '1D': '1d',
        '7D': '7d',
      }[range];
  
      setPriceHistory(prev => ({
        ...prev,
        [period]: dataPoints,
        '5m': range === '1H' ? dataPoints : prev['5m'], // Initialize 5m with 1h data
      }));
    } catch (error) {
      console.error('Error fetching Bitcoin historical data:', error);
    }
  };

  // Fetch real-time price from Coinbase
  const fetchBitcoinPrice = async (retryCount = 0): Promise<number | null> => {
    try {
      const response = await axios.get('https://api.coinbase.com/v2/prices/BTC-USD/spot', {
        timeout: 2000
      });
      return parseFloat(response.data.data.amount);
    } catch (error) {
      console.error('Error fetching Bitcoin price:', error);
      if (retryCount < 3) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return fetchBitcoinPrice(retryCount + 1);
      }
      return null;
    }
  };

  // Update price history
  const updatePriceHistory = async () => {
    const newPrice = await fetchBitcoinPrice();
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

      updatePeriod('5m', 300000, 12); // 5 minutes interval
      updatePeriod('1h', 3600000, 60); // 1 hour interval
      updatePeriod('1d', 86400000, 288); // 1 day interval
      updatePeriod('7d', 604800000, 336); // 7 days interval

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
    const interval = setInterval(updatePriceHistory, 1000); // Fetch Bitcoin price every 1 second
    return () => clearInterval(interval);
  }, []);

  return (
    <BitcoinPriceContext.Provider value={{ priceHistory, latestPrice, previousPrice }}>
      {children}
    </BitcoinPriceContext.Provider>
  );
};

export const useBitcoinPrice = () => {
  const context = useContext(BitcoinPriceContext);
  if (!context) {
    throw new Error('useBitcoinPrice must be used within a BitcoinPriceProvider');
  }
  return context;
};