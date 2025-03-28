import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { usePrice } from '../context/PriceContext';
import ImageCarousel from '../components/ImageCarousel';

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
    { name: 'Solana', count: 4, value: latestPrice, icon: <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png" className="rounded-full" height="35" width="35" alt="SOL" loading="lazy" decoding="async"/> },
    { name: 'Etherium', count: 3, value: 2011.88, icon: <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png" height="35" width="35" alt="ETH" loading="lazy" decoding="async"  /> },
    { name: 'Bitcoin', count: 3, value: 84297.15, icon: <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/1.png" height="35" width="35" alt="BTC" loading="lazy" decoding="async" /> },
  ];

  const winners = [
    { name: 'R. Mendes', amount: 157.32, rank: '48/52', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop' },
    { name: 'D.Micheal', amount: 72.54, rank: '39/71', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop' },
    { name: 'S.Danielle', amount: 48.92, rank: '11/13', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop' },
  ];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
      {/* Header */}
      <div className={`px-3 flex flex-col items-center justify-between sticky top-0 z-10 `}>
        <div className={`flex flex-row justify-between ${
        theme === 'dark' ? 'bg-slate-800/50 backdrop-blur-sm' : 'bg-white/50 backdrop-blur-sm'
      }`}>
          <div className="flex items-center gap-3 py-1">
            <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png" className="rounded-full" height="16" width="16" alt="SOL" loading="lazy" decoding="async"  />
            <span className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-blue-900'}`}>
              2.53
            </span>
            <img src="https://s2.coinmarketcap.com/static/cloud/img/loyalty-program/diamond-icon.svg" width="16" height="16" />
            <span className={`text-lg font-semibold ${theme === 'dark' ? 'text-red-400' : 'text-red-500'}`}>
              1000
            </span>
          </div>
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
        {/* Carousel */}
        <ImageCarousel images={carouselImages} theme={theme} />
      </div>

      {/* Main Content */}
      <div className="p-2">

        {/* Current Lotteries */}
        <div>
          <h2 className={`text-lg font-semibold mb-3 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            Current Lotteries
          </h2>
          <div className="space-y-2">
            {lotteries.map((lottery) => (
              <div
                key={lottery.name}
                onClick={() => navigate('/lottery')}
                className={`flex items-center justify-between px-3 py-1.5 rounded-lg border-2 shadow-md cursor-pointer
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
          <div className="flex items-center mb-3">
            <h2 className={`text-lg font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              Top Winners
            </h2>
            <button className={`text-sm ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Top Buyers
            </button>
          </div>
          <div className="space-y-2">
            {winners.map((winner) => (
              <div
                key={winner.name}
                className={`flex items-center justify-between p-3 rounded-lg border-2 ${
                  theme === 'dark' ? 'bg-slate-800 border-slate-800' : 'bg-slate-50 border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={winner.image}
                    alt={winner.name}
                    className="w-10 h-10 rounded-full"
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
                <span className={`text-sm ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  {winner.rank}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;