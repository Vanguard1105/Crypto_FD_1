import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import PriceChart from '../components/PriceChart';
import { usePrice } from '../context/PriceContext';
import { TimePeriod } from '../types';
import { FaUserCog } from "react-icons/fa";
import { CgChevronLeft } from "react-icons/cg";
type LotteryType = 'vote' | 'predict';

const Lottery = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { priceHistory, latestPrice, previousPrice } = usePrice();
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('5m');
  const [selectedType, setSelectedType] = useState<LotteryType>('vote');

  const vote_lotteries = [
    { id: 13, date: '2025.03.24', startTime: '12:00:00', status: 'upcoming' },
    { id: 12, date: '2025.03.24', startTime: '09:30:00', status: 'upcoming' },
    { id: 11, date: '2025.03.23', startTime: '11:20:00', status: 'ended' },
    { id: 10, date: '2025.03.22', startTime: '18:00:00', status: 'ended' },
  ];

  const predict_lotteries = [
    { id: 13, date: '2025.03.24', startTime: '09:00:00', status: 'upcoming' },
    { id: 12, date: '2025.03.24', startTime: '09:09:00', status: 'upcoming' },
    { id: 11, date: '2025.03.23', startTime: '09:09:00', status: 'ended' },
    { id: 10, date: '2025.03.22', startTime: '09:00:00', status: 'ended' },
  ];
  const handlePeriodChange = (period: TimePeriod) => {
    setSelectedPeriod(period);
  };
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
      {/* Header */}
      <div className={`px-3 flex flex-col items-center sticky top-0 z-10 ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
        <div className={`flex flex-row justify-between w-full`}>
          <div className='flex flex-row gap-3 items-center py-1 px-2'>
            <CgChevronLeft size={20} className={`text-${theme === 'dark' ? 'slate-400 hover:text-slate-300' : 'slate-900 hover:text-slate-800'} cursor-pointer`} onClick={() => navigate("/home")}/>
            <FaUserCog className={`text-${theme === 'dark' ? 'slate-400 hover:text-slate-300' : 'slate-900 hover:text-slate-800'} cursor-pointer`} /> 
          </div>
          <div className="flex items-center gap-3 py-1">
            <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png" className="rounded-full cursor-pointer" height="16" width="16" alt="SOL" loading="lazy" decoding="async"  />
            <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-blue-900'} cursor-pointer`}>
              2.53
            </span>
            <img src="https://s2.coinmarketcap.com/static/cloud/img/loyalty-program/diamond-icon.svg" className='cursor-pointer' width="16" height="16" />
            <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-red-400' : 'text-red-500'} cursor-pointer`}>
              1000
            </span>
            <button
              onClick={toggleTheme}
              className={`px-2 py-1 rounded-full transition-colors ${
                theme === 'dark'
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-600 hover:text-slate-800'
              }`}
              >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="pb-2 px-4">
        <PriceChart
          data={priceHistory[selectedPeriod]}
          latestPrice={latestPrice}
          previousPrice={previousPrice}
          period={selectedPeriod}
          theme={theme}
          onPeriodChange={handlePeriodChange}
        />
      </div>

      <div className="flex px-4">
        <div className={`inline-flex rounded-lg px-1 py-0.5 ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'} w-full`}>
          <button
            onClick={() => setSelectedType('vote')}
            className={`flex items-center w-1/2 justify-center py-1 rounded-md font-medium transition-all duration-200 ${
              selectedType === 'vote'
                ? theme === 'dark'
                  ? 'bg-blue-500 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-blue-500 text-white shadow-lg shadow-purple-500/30'
                : theme === 'dark'
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            Vote
          </button>
          <button
            onClick={() => setSelectedType('predict')}
            className={`flex items-center w-1/2 justify-center py-1 rounded-md font-medium transition-all duration-200 ${
              selectedType === 'predict'
                ? theme === 'dark'
                  ? 'bg-blue-500 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-blue-500 text-white shadow-lg shadow-purple-500/30'
                : theme === 'dark'
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            Predict
          </button>
        </div>
      </div>

      {/* Lottery List */}
      <div className="px-4 mt-6 space-y-2 pb-6">
        {selectedType == "vote"? (vote_lotteries.map((lottery) => (
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
        ))):
        (predict_lotteries.map((lottery) => (
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
        )))
        }
      </div>
    </div>
  );
};

export default Lottery;