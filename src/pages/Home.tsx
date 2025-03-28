import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { usePrice } from '../context/PriceContext';
import ImageCarousel from '../components/ImageCarousel';
import { IoIosHome } from "react-icons/io";
import { FaUserCog } from "react-icons/fa";
import { FaMedal } from "react-icons/fa6";

const Home = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { latestPrice } = usePrice();

  const carouselImages = [
    './home_1.png',
    './home_2.jpg',
    './home_3.jpg',
    './home_4.jpg',
    './home_5.jpg',
    './home_6.jpg',
    './home_7.jpg',
  ];

  const lotteries = [
    { name: 'Solana', count: 4, value: latestPrice, icon: <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png" className="rounded-full" height="25" width="25" alt="SOL" loading="lazy" decoding="async"/> },
    { name: 'Etherium', count: 3, value: 2011.88, icon: <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png" height="25" width="25" alt="ETH" loading="lazy" decoding="async"  /> },
    { name: 'Bitcoin', count: 3, value: 84297.15, icon: <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/1.png" height="25" width="25" alt="BTC" loading="lazy" decoding="async" /> },
  ];

  const winners = [
    { name: 'R. Mendes', amount: 157.32, rank: '48/52', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop' },
    { name: 'D.Micheal', amount: 72.54, rank: '39/71', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop' },
    { name: 'S.Danielle', amount: 48.92, rank: '11/13', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop' },
  ];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
      {/* Header */}
      <div className={`px-3 pb-1 flex flex-col items-center sticky top-0 z-10 ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
        <div className={`flex flex-row justify-between w-full`}>
          <div className='flex flex-row gap-3 items-center py-1 px-2'>
            <IoIosHome className={`text-${theme === 'dark' ? 'slate-600' : 'slate-900'} cursor-pointer`} />  
            <FaUserCog className={`text-${theme === 'dark' ? 'slate-600' : 'slate-900'} cursor-pointer`} /> 
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
        {/* Carousel */}
        <ImageCarousel images={carouselImages} theme={theme} />
      </div>

      {/* Main Content */}
      <div className="px-5">
        {/* Current Lotteries */}
        <div>
          <h3 className={`text-lg font-semibold mb-2 cursor-pointer ${
           theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            Current Lotteries
          </h3> 
          <div className="space-y-1">
            {lotteries.map((lottery) => (
              <div
                key={lottery.name}
                onClick={() => navigate('/lottery')}
                className={`flex items-center justify-between px-2 rounded-lg border-2 shadow-md cursor-pointer
                  transform transition-all duration-200 hover:scale-[1.02] hover:shadow-lg ${
                  theme === 'dark' 
                    ? 'bg-slate-800 border-slate-800 hover:border-violet-500/30 hover:shadow-violet-500/20' 
                    : 'bg-slate-50 border-gray-300 hover:border-violet-500/30 hover:shadow-violet-500/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`rounded-full ${
                    theme === 'dark' ? 'bg-slate-700' : 'bg-white'
                  }`}>
                    {lottery.icon}
                  </div>
                  <div>
                    <p className={`font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}>
                      {lottery.name}
                    </p>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {lottery.count} lotteries
                    </p>
                  </div>
                </div>
                <span className={`font-semibold ${
                  theme === 'dark' ? 'text-green-400' : 'text-green-500'
                }`}>
                  ${lottery.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Winners */}
        <div>
          <div className="flex items-center mt-1 mb-2 gap-3">
            <h3 className={`text-lg font-semibold cursor-pointer ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              Top Winnders
            </h3> 
            <h3 className={`text-lg font-semibold  cursor-pointer ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              Top Buyers
            </h3> 
          </div>
          <div className="space-y-1">
            {winners.map((winner) => (
              <div
                key={winner.name}
                className={`flex items-center justify-between px-2 rounded-lg border-2 shadow-md cursor-pointer
                  transform transition-all duration-200 hover:scale-[1.02] hover:shadow-lg ${
                  theme === 'dark' 
                    ? 'bg-slate-800 border-slate-800 hover:border-violet-500/30 hover:shadow-violet-500/20' 
                    : 'bg-slate-50 border-gray-300 hover:border-violet-500/30 hover:shadow-violet-500/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={winner.image}
                    alt={winner.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className={`font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}>
                      {winner.name}
                    </p>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      Won {winner.amount} Sol
                    </p>
                  </div>
                </div>
                <div className='flex flex-col items-center'>
                  <svg
                    className='py-1'
                    style={{ width: '20px', height: '20px', overflow: 'visible', opacity: 1, zIndex: 1, fill: 'rgb(255, 149, 0)' }}
                    viewBox="0 0 384 512"
                  >
                    <path d="M288 358.3c13.98-8.088 17.53-30.04 28.88-41.39c11.35-11.35 33.3-14.88 41.39-28.87c7.98-13.79 .1658-34.54 4.373-50.29C366.7 222.5 383.1 208.5 383.1 192c0-16.5-17.27-30.52-21.34-45.73c-4.207-15.75 3.612-36.5-4.365-50.29c-8.086-13.98-30.03-17.52-41.38-28.87c-11.35-11.35-14.89-33.3-28.87-41.39c-13.79-7.979-34.54-.1637-50.29-4.375C222.5 17.27 208.5 0 192 0C175.5 0 161.5 17.27 146.3 21.34C130.5 25.54 109.8 17.73 95.98 25.7C82 33.79 78.46 55.74 67.11 67.08C55.77 78.43 33.81 81.97 25.72 95.95C17.74 109.7 25.56 130.5 21.35 146.2C17.27 161.5 .0008 175.5 .0008 192c0 16.5 17.27 30.52 21.34 45.73c4.207 15.75-3.615 36.5 4.361 50.29C33.8 302 55.74 305.5 67.08 316.9c11.35 11.35 14.89 33.3 28.88 41.4c13.79 7.979 34.53 .1582 50.28 4.369C161.5 366.7 175.5 384 192 384c16.5 0 30.52-17.27 45.74-21.34C253.5 358.5 274.2 366.3 288 358.3zM112 192c0-44.27 35.81-80 80-80s80 35.73 80 80c0 44.17-35.81 80-80 80S112 236.2 112 192zM1.719 433.2c-3.25 8.188-1.781 17.48 3.875 24.25c5.656 6.75 14.53 9.898 23.12 8.148l45.19-9.035l21.43 42.27C99.46 507 107.6 512 116.7 512c.3438 0 .6641-.0117 1.008-.0273c9.5-.375 17.65-6.082 21.24-14.88l33.58-82.08c-53.71-4.639-102-28.12-138.2-63.95L1.719 433.2zM349.6 351.1c-36.15 35.83-84.45 59.31-138.2 63.95l33.58 82.08c3.594 8.797 11.74 14.5 21.24 14.88C266.6 511.1 266.1 512 267.3 512c9.094 0 17.23-4.973 21.35-13.14l21.43-42.28l45.19 9.035c8.594 1.75 17.47-1.398 23.12-8.148c5.656-6.766 7.125-16.06 3.875-24.25L349.6 351.1z"></path>
                  </svg>
                  <span className={`text-sm ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {winner.rank}
                  </span>

                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;