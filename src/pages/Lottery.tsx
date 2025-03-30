import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, Timer, Trophy, Calendar } from 'lucide-react';
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
  const [selectedType, setSelectedType] = useState<LotteryType>("vote");

  const lotteries = [
    { id: 13, date: '2025.03.24', startTime: '12:00:00', status: 'upcoming', type: 'vote' },
    { id: 12, date: '2025.03.24', startTime: '09:30:00', status: 'upcoming', type: 'predict' },
    { id: 11, date: '2025.03.23', startTime: '11:20:00', status: 'ended', type: 'vote' },
    { id: 10, date: '2025.03.22', startTime: '18:00:00', status: 'ended', type: 'predict' },
    { id: 12, date: '2025.03.24', startTime: '12:00:00', status: 'upcoming', type: 'vote' },
    { id: 13, date: '2025.03.24', startTime: '09:30:00', status: 'upcoming', type: 'predict' },
    { id: 10, date: '2025.03.23', startTime: '11:20:00', status: 'ended', type: 'vote' },
    { id: 11, date: '2025.03.22', startTime: '18:00:00', status: 'ended', type: 'predict' },
  ];

  const filteredLotteries = lotteries.filter(lottery => lottery.type === selectedType);
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
            className={`flex items-center w-1/2 justify-center py-1 rounded-md font-medium transition-all duration-200 hover:shadow-purple-500/30 ${
              selectedType === 'vote'
                ? theme === 'dark'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-blue-500 text-white shadow-lg'
                : theme === 'dark'
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            Vote
          </button>
          <button
            onClick={() => setSelectedType('predict')}
            className={`flex items-center w-1/2 justify-center py-1 rounded-md font-medium transition-all duration-200 hover:shadow-purple-500/30 ${
              selectedType === 'predict'
                ? theme === 'dark'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-blue-500 text-white shadow-lg'
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
      <div className="px-4 space-y-1 py-2">
        {filteredLotteries.map((lottery) => (
          <div
          key={lottery.id}
          className={`relative rounded-xl overflow-hidden group cursor-pointer ${
            theme === 'dark' ? 'bg-slate-800' : 'bg-white'
          } shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-md ${
            lottery.status === 'ended' ? 'opacity-80' : ''
          } ${
            lottery.type === 'vote' 
              ? 'hover:shadow-blue-500/20' 
              : 'hover:shadow-purple-500/20'
          }`}
        >
          <div className={`absolute inset-0 ${
            lottery.type === 'vote'
              ? 'bg-gradient-to-r from-blue-500/10 to-transparent'
              : 'bg-gradient-to-r from-purple-500/10 to-transparent'
          } transition-opacity duration-300 opacity-0 group-hover:opacity-100`} />
          
          <div className="absolute top-0 left-0 w-full h-full">
            <div className={`h-full w-1 ${
              lottery.type === 'vote'
                ? 'bg-blue-500'
                : 'bg-purple-500'
            } opacity-50 group-hover:opacity-100 transition-opacity duration-300`} />
          </div>

          <div className={`px-2 py-1 h-full flex flex-col justify-between relative ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Calendar size={16} className={lottery.type === 'vote' ? 'text-blue-400' : 'text-purple-400'} />
                  <span className={`text-sm font-medium ${
                    lottery.type === 'vote' ? 'text-blue-400' : 'text-purple-400'
                  }`}>
                    {lottery.date}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Timer size={16} className={`
                    ${lottery.status === 'ended' 
                      ? theme === 'dark' ? 'text-red-400' : 'text-red-500'
                      : theme === 'dark' ? 'text-green-400' : 'text-green-500'
                    }
                  `} />
                  <span className={`text-sm font-medium ${
                    lottery.status === 'ended' 
                      ? theme === 'dark' ? 'text-red-400' : 'text-red-500'
                      : theme === 'dark' ? 'text-green-400' : 'text-green-500'
                  }`}>
                    {lottery.status === 'ended' ? 'Ended:' : 'Start:'} {lottery.startTime}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Trophy size={20} className="text-yellow-500" />
                <span className="text-2xl font-bold text-yellow-500">
                  #{lottery.id}
                </span>
              </div>
            </div>
            
            <div className="flex justify-between items-end">
              <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                lottery.type === 'vote'
                  ? 'bg-blue-500/10 text-blue-500'
                  : 'bg-purple-500/10 text-purple-500'
              }`}>
                {lottery.type === 'vote' ? '3rd SOL Vote' : '3rd SOL Predict'}
              </span>
              <div className={`w-24 h-24 absolute bottom-4 right-4 rounded-full ${
                lottery.type === 'vote'
                  ? 'bg-blue-500/5'
                  : 'bg-purple-500/5'
              } transition-transform duration-300 group-hover:scale-110`} />
            </div>
          </div>
        </div>
        ))}
      </div>
    </div>
  );
};

export default Lottery;