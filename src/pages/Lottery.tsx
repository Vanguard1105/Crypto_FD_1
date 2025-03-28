import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import PriceChart from '../components/PriceChart';
import { usePrice } from '../context/PriceContext';
import { TimePeriod } from '../types';

const Lottery = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { priceHistory, latestPrice, previousPrice } = usePrice();
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('5m');

  const timeFilters = [
    { label: '5M', value: '5m' },
    { label: '1H', value: '1h' },
    { label: '1D', value: '1d' },
    { label: '7D', value: '7d' },
  ];

  const lotteries = [
    { id: 13, date: '2025.03.24', startTime: '12:00:00', status: 'upcoming' },
    { id: 12, date: '2025.03.24', startTime: '09:30:00', status: 'upcoming' },
    { id: 11, date: '2025.03.23', startTime: '11:20:00', status: 'ended' },
    { id: 10, date: '2025.03.22', startTime: '18:00:00', status: 'ended' },
  ];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
      {/* Header */}
      <div className={`px-4 py-3 flex items-center justify-between sticky top-0 z-10 ${
        theme === 'dark' ? 'bg-slate-800/50 backdrop-blur-sm' : 'bg-white/50 backdrop-blur-sm'
      }`}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/home')}
            className={`p-1 rounded-lg transition-colors ${
              theme === 'dark' ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <ArrowLeft size={20} />
          </button>
          <span className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-blue-900'}`}>
            SOL/USD ${latestPrice.toFixed(3)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 rounded-lg p-0.5">
            {timeFilters.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setSelectedPeriod(value as TimePeriod)}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all duration-200 ${
                  selectedPeriod === value
                    ? 'bg-white text-blue-600 shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            onClick={toggleTheme}
            className={`p-1.5 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>

      {/* Chart Section */}
      <div className="p-4">
        <PriceChart
          data={priceHistory[selectedPeriod]}
          latestPrice={latestPrice}
          previousPrice={previousPrice}
          period={selectedPeriod}
          theme={theme}
        />
      </div>

      {/* Action Buttons */}
      <div className="px-4 mt-4 grid grid-cols-2 gap-2">
        <button className="bg-violet-600 text-white py-2.5 rounded-lg font-medium">
          Vote
        </button>
        <button className="bg-slate-100 text-slate-900 py-2.5 rounded-lg font-medium">
          Predict
        </button>
      </div>

      {/* Lottery List */}
      <div className="px-4 mt-6 space-y-2 pb-6">
        {lotteries.map((lottery) => (
          <div
            key={lottery.id}
            className={`relative rounded-lg overflow-hidden ${
              lottery.status === 'ended' ? 'opacity-80' : ''
            }`}
          >
            <img
              src="/ticket.jpg"
              alt={`Lottery ${lottery.id}`}
              className="w-full h-auto"
            />
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className={`text-blue-400 font-medium`}>
                {lottery.date}
              </span>
            </div>
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <span className={`${
                lottery.status === 'ended' ? 'text-red-400' : 'text-green-400'
              } font-medium`}>
                {lottery.status === 'ended' ? 'Ended:' : 'Start:'} {lottery.startTime}
              </span>
            </div>
            <div className="absolute top-1/2 right-6 transform -translate-y-1/2">
              <span className="text-yellow-400 text-xl font-bold">
                #{lottery.id}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Lottery;