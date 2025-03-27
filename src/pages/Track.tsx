import React, { useState } from 'react';
import PriceChart from '../components/PriceChart';
import { usePrice } from '../context/PriceContext';
import { useTheme } from '../context/ThemeContext';
import { Bitcoin, Sun, Moon } from 'lucide-react';
import { TimePeriod } from '../types';

function Track() {
  const { priceHistory, latestPrice, previousPrice } = usePrice();
  const { theme, toggleTheme } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('ms');
  const [error, setError] = useState<string | null>(null);

  const timeFilters: { label: string; value: TimePeriod }[] = [
    { label: 'MS', value: 'ms' },
    { label: '5M', value: '5m' },
    { label: '1H', value: '1h' },
    { label: '1D', value: '1d' },
    { label: '7D', value: '7d' },
  ];

  return (
    <div className={`min-h-screen text-xs transition-colors duration-200 ${
      theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'
    }`}>
      <div className="max-w-full mx-auto px-2 py-2">
        <div className="flex items-center gap-2 mb-2">
          <Bitcoin className={`w-6 h-6 ${
            theme === 'dark' ? 'text-violet-400' : 'text-violet-600'
          }`} />
          <h1 className={`text-lg font-bold ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            Crypto Price Tracker
          </h1>
          <div 
            className={`ml-auto px-3 py-1 rounded-lg flex items-center gap-1 ${
              latestPrice >= previousPrice 
                ? theme === 'dark' 
                  ? 'bg-green-500/10 text-green-400'
                  : 'bg-green-500/20 text-green-600'
                : theme === 'dark'
                  ? 'bg-red-500/10 text-red-400'
                  : 'bg-red-500/20 text-red-600'
            }`}
          >
            <span className="font-semibold">
              ${latestPrice.toFixed(2)}
            </span>
            <span className="text-[10px]">
              ({((latestPrice - previousPrice) / previousPrice * 100).toFixed(2)}%)
            </span>
          </div>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                : 'bg-white text-slate-600 hover:bg-slate-200 shadow-sm'
            }`}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
        
        {error && (
          <div className="mb-2 px-3 py-2 rounded-lg bg-red-500/10 text-red-400 text-xs">
            {error}
          </div>
        )}
        
        <div className="mb-2 flex justify-end gap-1">
          {timeFilters.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setSelectedPeriod(value)}
              className={`px-2 py-1 rounded-md font-medium transition-all duration-200 text-[10px] ${
                selectedPeriod === value
                  ? theme === 'dark'
                    ? 'bg-violet-500 text-white'
                    : 'bg-violet-600 text-white'
                  : theme === 'dark'
                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    : 'bg-white text-slate-600 hover:bg-slate-200 shadow-sm'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        
        <PriceChart
          data={priceHistory[selectedPeriod]}
          latestPrice={latestPrice}
          previousPrice={previousPrice}
          period={selectedPeriod}
          theme={theme}
        />

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button className={`rounded-lg p-3 text-center transition-all duration-200 ${
            theme === 'dark'
              ? 'bg-violet-500/10 text-violet-400 hover:bg-violet-500/20'
              : 'bg-violet-500/20 text-violet-600 hover:bg-violet-500/30'
          }`}>
            Buy
          </button>
          <button className={`rounded-lg p-3 text-center transition-all duration-200 ${
            theme === 'dark'
              ? 'bg-violet-500/10 text-violet-400 hover:bg-violet-500/20'
              : 'bg-violet-500/20 text-violet-600 hover:bg-violet-500/30'
          }`}>
            Sell
          </button>
        </div>
      </div>
    </div>
  );
}

export default Track;