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

const BIRDEYE_API_KEY = 'b59a1173ffe2443fb6a0b37b11ad892a';
const ETHEREUM_TOKEN_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'; // WETH address

export const EthereumPriceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [priceHistory, setPriceHistory] = useState<PriceHistory>(initialPriceHistory);
  const [latestPrice, setLatestPrice] = useState(0);
  const [previousPrice, setPreviousPrice] = useState(0);

  // Fetch historical data from Birdeye API
  const fetchHistoricalData = async (period: '1h' | '1d' | '7d') => {
    try {
      const now = Math.floor(Date.now() / 1000);
      const timeFrom = {
        '1h': now - 3600,
        '1d': now - 86400,
        '7d': now - 604800,
      }[period];
      
      const response = await axios.get('https://public-api.birdeye.so/defi/history_price', {
        params: {
          address: ETHEREUM_TOKEN_ADDRESS,
          address_type: 'token',
          type: {
            '1h': '1m',
            '1d': '5m',
            '7d': '30m',
          }[period],
          time_from: timeFrom,
          time_to: now,
        },
        headers: {
          'X-API-KEY': BIRDEYE_API_KEY,
          'x-chain': 'ethereum',
        },
      });

      const items = response.data.data.items;
      const dataPoints = items.map((item: any) => ({
        timestamp: item.unixTime * 1000,
        price: item.value,
        average: item.value,
      }));

      setPriceHistory(prev => ({
        ...prev,
        [period]: dataPoints,
      }));
    } catch (error) {
      console.error('Error fetching Ethereum historical data:', error);
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
      updatePeriod('1d', 300000, 288);    // 5 minutes interval
      updatePeriod('7d', 1800000, 336);   // 30 minutes interval

      return newData;
    });

    setPreviousPrice(latestPrice);
    setLatestPrice(newPrice);
  };

  // Initialize data on mount
  useEffect(() => {
    fetchHistoricalData('1h');
    fetchHistoricalData('1d');
    fetchHistoricalData('7d');
  }, []);

  // Update real-time data
  useEffect(() => {
    const interval = setInterval(updatePriceHistory, 1000); // Fetch Ethereum price every 1 second
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