import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, ChevronLeft } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Profile = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const bonusItems = [
    {
      title: 'INVETE FRIENDS',
      count: '4 friends',
      multiplier: 'x 10 💎',
      bonus: '+2 Friends',
      reward: '+ 20'
    },
    {
      title: 'TOTAL TICKETS PURCHASED BY FRIENDS',
      count: '24 tickets',
      multiplier: 'x 5 💎',
      bonus: '24 Tickets',
      reward: '+ 120'
    },
    {
      title: 'DAILY BETTING',
      count: '6 days',
      multiplier: 'x 2 💎',
      bonus: '7 Day',
      reward: '+ 14'
    },
    {
      title: 'TOP BUYER IN LOTTERY',
      count: '2 times',
      multiplier: 'x 200 💎',
      bonus: '2 Times',
      reward: '+ 400'
    }
  ];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
      {/* Header */}
      <div className={`px-4 py-3 flex items-center justify-between sticky top-0 z-10 ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
        <button
          onClick={() => navigate('/')}
          className={`p-1 rounded-full transition-colors ${
            theme === 'dark'
              ? 'text-slate-400 hover:text-slate-200'
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex items-center gap-3">
          <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png" className="rounded-full cursor-pointer" height="16" width="16" alt="SOL" />
          <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-blue-900'}`}>
            2.53
          </span>
          <img src="https://s2.coinmarketcap.com/static/cloud/img/loyalty-program/diamond-icon.svg" width="16" height="16" alt="Diamond" />
          <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-red-400' : 'text-red-500'}`}>
            1000
          </span>
          <button
            onClick={toggleTheme}
            className={`p-1 rounded-full transition-colors ${
              theme === 'dark'
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop"
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover"
          />
          <div>
            <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Peter Coiner
            </h2>
            <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              @cryptoboss009
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-4 mb-6">
          <button className={`px-4 py-2 text-sm font-medium rounded-full ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            Settings
          </button>
          <button className={`px-4 py-2 text-sm font-medium rounded-full ${
            theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
          }`}>
            Bonuses
          </button>
        </div>

        {/* Bonus Items */}
        <div className="space-y-4">
          {bonusItems.map((item, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-green-400' : 'text-green-600'
                }`}>
                  ✓ {item.title}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}>
                    {item.count}
                  </span>
                  <span className={`text-sm ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {item.multiplier}
                  </span>
                </div>
                <div className={`px-3 py-1 rounded-lg ${
                  theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'
                }`}>
                  <div className="text-xs text-white text-center">{item.bonus}</div>
                  <div className="text-xs text-white text-center">{item.reward}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;