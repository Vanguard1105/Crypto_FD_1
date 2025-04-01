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

interface PriceContextType {
  solana: {
    priceHistory: PriceHistory;
    latestPrice: number;
    previousPrice: number;
  };
  ethereum: {
    priceHistory: PriceHistory;
    latestPrice: number;
    previousPrice: number;
  };
  bitcoin: {
    priceHistory: PriceHistory;
    latestPrice: number;
    previousPrice: number;
  };
}

const initialPriceHistory: PriceHistory = {
  ms: [],
  '5m': [],
  '1h': [],
  '1d': [],
  '7d': [],
};

const PriceContext = createContext<PriceContextType>({
  solana: {
    priceHistory: initialPriceHistory,
    latestPrice: 0,
    previousPrice: 0,
  },
  ethereum: {
    priceHistory: initialPriceHistory,
    latestPrice: 0,
    previousPrice: 0,
  },
  bitcoin: {
    priceHistory: initialPriceHistory,
    latestPrice: 0,
    previousPrice: 0,
  },
});

const BIRDEYE_API_KEY = 'b59a1173ffe2443fb6a0b37b11ad892a';
const SOLANA_TOKEN_ADDRESS = 'So11111111111111111111111111111111111111112';
const ETHEREUM_TOKEN_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'; // WETH address
const BITCOIN_TOKEN_ADDRESS = '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'; // WBTC address

export const PriceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [solana, setSolana] = useState({
    priceHistory: initialPriceHistory,
    latestPrice: 0,
    previousPrice: 0,
  });
  const [ethereum, setEthereum] = useState({
    priceHistory: initialPriceHistory,
    latestPrice: 0,
    previousPrice: 0,
  });
  const [bitcoin, setBitcoin] = useState({
    priceHistory: initialPriceHistory,
    latestPrice: 0,
    previousPrice: 0,
  });

  // Fetch historical data from Birdeye API
  const fetchHistoricalData = async (tokenAddress: string, chain: 'solana' | 'ethereum', period: '1h' | '1d' | '7d') => {
    try {
      const now = Math.floor(Date.now() / 1000);
      const timeFrom = {
        '1h': now - 3600,
        '1d': now - 86400,
        '7d': now - 604800,
      }[period];
      
      const response = await axios.get('https://public-api.birdeye.so/defi/history_price', {
        params: {
          address: tokenAddress,
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
          'x-chain': chain,
        },
      });
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const items = response.data.data.items;
      const dataPoints = items.map((item: any) => ({
        timestamp: item.unixTime * 1000,
        price: item.value,
        average: item.value,
      }));

      if (chain === 'solana') {
        setSolana(prev => ({
          ...prev,
          priceHistory: {
            ...prev.priceHistory,
            [period]: dataPoints,
          },
        }));
      } else if (chain === 'ethereum') {
        setEthereum(prev => ({
          ...prev,
          priceHistory: {
            ...prev.priceHistory,
            [period]: dataPoints,
          },
        }));
      }
    } catch (error) {
      console.error(`Error fetching ${chain} historical data:`, error);
    }
  };

  // Fetch real-time price from Coinbase
  const fetchRealTimePrice = async (symbol: 'SOL' | 'ETH' | 'BTC', retryCount = 0): Promise<number | null> => {
    try {
      const response = await axios.get(`https://api.coinbase.com/v2/prices/${symbol}-USD/spot`, {
        timeout: 2000
      });
      return parseFloat(response.data.data.amount);
    } catch (error) {
      console.error(`Error fetching ${symbol} price:`, error);
      if (retryCount < 3) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return fetchRealTimePrice(symbol, retryCount + 1);
      }
      return null;
    }
  };

  // Update price history
  const updatePriceHistory = async (symbol: 'SOL' | 'ETH' | 'BTC', setState: React.Dispatch<React.SetStateAction<{ priceHistory: PriceHistory; latestPrice: number; previousPrice: number }>>) => {
    const newPrice = await fetchRealTimePrice(symbol);
    if (newPrice === null) return;

    const now = Date.now();

    setState(prev => {
      const newData = { ...prev };
      
      // Update ms history
      newData.priceHistory.ms = [...prev.priceHistory.ms, { timestamp: now, price: newPrice, average: newPrice }];
      if (newData.priceHistory.ms.length > 300) newData.priceHistory.ms.shift();

      // Update other periods
      const updatePeriod = (period: keyof PriceHistory, interval: number, maxPoints: number) => {
        if (prev.priceHistory[period].length === 0 || now - prev.priceHistory[period][prev.priceHistory[period].length - 1].timestamp >= interval) {
          const average = newData.priceHistory[period].reduce((sum, point) => sum + point.price, newPrice) / (newData.priceHistory[period].length + 1);
          newData.priceHistory[period] = [...prev.priceHistory[period], { timestamp: now, price: newPrice, average }];
          if (newData.priceHistory[period].length > maxPoints) newData.priceHistory[period].shift();
        }
      };

      updatePeriod('5m', 1000, 300);
      updatePeriod('1h', 10000, 360);
      updatePeriod('1d', 300000, 288);    // 5 minutes interval
      updatePeriod('7d', 1800000, 336);   // 30 minutes interval

      return {
        ...newData,
        previousPrice: prev.latestPrice,
        latestPrice: newPrice,
      };
    });
  };

  // Initialize data on mount
  useEffect(() => {
    fetchHistoricalData(SOLANA_TOKEN_ADDRESS, 'solana', '1h'); 
    fetchHistoricalData(SOLANA_TOKEN_ADDRESS, 'solana', '1d');
    fetchHistoricalData(SOLANA_TOKEN_ADDRESS, 'solana', '7d');

    fetchHistoricalData(ETHEREUM_TOKEN_ADDRESS, 'ethereum', '1h');
    fetchHistoricalData(ETHEREUM_TOKEN_ADDRESS, 'ethereum', '1d');
    fetchHistoricalData(ETHEREUM_TOKEN_ADDRESS, 'ethereum', '7d');
  }, []);

  // Update real-time data
  useEffect(() => {
    const interval = setInterval(() => {
      updatePriceHistory('SOL', setSolana);
      updatePriceHistory('ETH', setEthereum);
      updatePriceHistory('BTC', setBitcoin);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <PriceContext.Provider value={{ solana, ethereum, bitcoin }}>
      {children}
    </PriceContext.Provider>
  );
};

export const usePrice = () => {
  const context = useContext(PriceContext);
  if (!context) {
    throw new Error('usePrice must be used within a PriceProvider');
  }
  return context;
};