import { useNavigate } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { CgChevronLeft } from "react-icons/cg";
import { useUser } from '../context/UserContext';

const Profile = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { userData } = useUser();

  const bonusItems = [
    {
      title: 'INVETE FRIENDS',
      count: '4 friends',
      multiplier: 'x 10',
      bonus: '+2 Friends',
      reward: '+ 20'
    },
    {
      title: 'TICKETS PURCHASED BY FRIENDS',
      count: '24 tickets',
      multiplier: 'x 5',
      bonus: '24 Tickets',
      reward: '+ 120'
    },
    {
      title: 'DAILY BETTING',
      count: '6 days',
      multiplier: 'x 2',
      bonus: '7 Day',
      reward: '+ 14'
    },
    {
      title: 'TOP BUYER IN LOTTERY',
      count: '2 times',
      multiplier: 'x 200',
      bonus: '2 Times',
      reward: '+ 400'
    }
  ];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
      {/* Header */}
      <div className={`px-3 flex flex-col items-center sticky top-0 z-10 ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
        <div className={`flex flex-row justify-between w-full`}>
          <div className='flex flex-row gap-3 items-center py-1 px-2'>
            <CgChevronLeft size={16} className={`text-${theme === 'dark' ? 'slate-400 hover:text-slate-300' : 'slate-900 hover:text-slate-800'} cursor-pointer`} onClick={() => navigate("/home")}/>
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

      {/* Profile Info */}
      <div className="px-4 py-2">
        <div className="flex items-center gap-4 mb-6 pl-4">
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop"
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              {userData?.username? userData.username: "user"+ userData?.user_id}
            </h2>
            <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              @{userData?.username? userData.username : userData?.user_id}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-4 mb-4">
          <button className={`px-4 py-2 text-sm font-medium rounded-full ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            Settings
          </button>
          <button className={`px-4 py-1 text-sm font-medium rounded-xl ${
            theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
          }`}>
            Bonuses
          </button>
        </div>

        {/* Bonus Items */}
        <div className="space-y-2">
          {bonusItems.map((item, index) => (
            <div
              key={index}
              className={`px-4 py-2 rounded-lg flex flex-row justify-between cursor-pointer ${
                theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'
              }`}
            >
              <div className="items-center mb-2">
                <span className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-green-400' : 'text-green-600'
                }`}>
                  ✓ {item.title}
                </span>
                <div className="flex flex-row items-center gap-3 py-2">
                  <span className={`text-sm font-large px-2 ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}>
                    {item.count}
                  </span>
                  <span className={`text-md ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {item.multiplier}
                  </span>
                  <img src="https://s2.coinmarketcap.com/static/cloud/img/loyalty-program/diamond-icon.svg" className='cursor-pointer' width="16" height="16" />
                </div>
              </div>
              <div className="flex flex-col items-center justify-center cursor-pointer">
                <div className={`px-1 my-[6px] rounded-lg w-[80px] flex items-center ${
                  theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'
                }`}>
                  <div className="text-xs text-white text-center">{item.bonus}</div>
                  <img src="https://s2.coinmarketcap.com/static/cloud/img/loyalty-program/diamond-icon.svg" className='cursor-pointer' width="16" height="16" />
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