import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchSolanaBalance } from '../utils/fetchSolanaBalance';
import PriceChart from '../components/PriceChart';
import { usePrice } from '../context/PriceContext';
import { useEthereumPrice } from '../context/EthereumPriceContext';
import { useBitcoinPrice } from '../context/BitcoinPriceContext';
import FlipNumber from '../components/FlipNumber';
import { FaUserCog } from "react-icons/fa";
import { CgChevronLeft } from "react-icons/cg";
import { PriceData, TimePeriod } from '../types';


interface Ticket {
  id: number;
  date: string;
  prediction: number;
  status: 'pending' | 'won' | 'lost';
  actualPrice?: number;
}

const BuyTicket = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { userData, setUserData } = useUser();
  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [prediction, setPrediction] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [countdown, setCountdown] = useState({ hours: 16, minutes: 43, seconds: 27 });
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const lotteryType = searchParams.get('type') || 'SOL';
  const timePeriod = searchParams.get('timePeriod') || '5m';
  const lotteryId = searchParams.get('id');
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>(timePeriod as TimePeriod);

  // Get price data based on token type
  const { priceHistory: solanaHistory, latestPrice: solanaLatestPrice, previousPrice: solanaPreviousPrice } = usePrice();
  const { priceHistory: ethereumHistory, latestPrice: ethereumLatestPrice, previousPrice: ethereumPreviousPrice } = useEthereumPrice();
  const { priceHistory: bitcoinHistory, latestPrice: bitcoinLatestPrice, previousPrice: bitcoinPreviousPrice } = useBitcoinPrice();

  let priceHistory: PriceData[], latestPrice, previousPrice;

  switch (lotteryType) {
    case 'SOL':
      priceHistory = solanaHistory[selectedPeriod];
      latestPrice = solanaLatestPrice;
      previousPrice = solanaPreviousPrice;
      break;
    case 'ETH':
      priceHistory = ethereumHistory[selectedPeriod];
      latestPrice = ethereumLatestPrice;
      previousPrice = ethereumPreviousPrice;
      break;
    case 'BTC':
      priceHistory = bitcoinHistory[selectedPeriod];
      latestPrice = bitcoinLatestPrice;
      previousPrice = bitcoinPreviousPrice;
      break;
    default:
      priceHistory = solanaHistory[selectedPeriod];
      latestPrice = solanaLatestPrice;
      previousPrice = solanaPreviousPrice;
      break;
  }

  // Mock ticket history
  const [ticketHistory] = useState<Ticket[]>([
    {
      id: 1,
      date: '2025.03.23 09:00',
      prediction: 138.245,
      status: 'won',
      actualPrice: 138.251
    },
    {
      id: 2,
      date: '2025.03.23 12:00',
      prediction: 137.845,
      status: 'lost',
      actualPrice: 136.982
    }
  ]);

  useEffect(() => {
    if (userData?.publicKey) {
      const fetchBalance = async () => {
        const balance = await fetchSolanaBalance(userData.publicKey);
        setSolBalance(balance);
        setUserData({ ...userData, solBalance: balance });
      };
      fetchBalance();
    }
  }, [userData?.publicKey]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handlePredictionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setPrediction(value);
    }
  };

  const handleSubmit = () => {
    if (!prediction) return;
    
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 2000);
  };

  const handlePeriodChange = (period: TimePeriod) => {
    setSelectedPeriod(period);
  };

  const renderTimeUnit = (value: number, label: string) => (
    <div className="flex flex-col items-center">
      <FlipNumber value={value} theme={theme} />
      <span className={`text-[11px]  text-[#814c02] font-semibold pt-1`}>
        {label}
      </span>
    </div>
  );

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
      {/* Header */}
      <div className={`px-3 flex flex-col items-center sticky top-0 z-10 ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
        <div className={`flex flex-row justify-between w-full`}>
          <div className='flex flex-row gap-3 items-center py-1 px-2'>
            <CgChevronLeft 
              size={16} 
              className={`text-${theme === 'dark' ? 'slate-400 hover:text-slate-300' : 'slate-900 hover:text-slate-800'} cursor-pointer`} 
              onClick={() => navigate(`/lottery?predictType=${"lottery"}&type=${lotteryType}`)}
            />
            <FaUserCog 
              className={`text-${theme === 'dark' ? 'slate-400 hover:text-slate-300' : 'slate-900 hover:text-slate-800'} cursor-pointer`} 
              onClick={() => navigate('/profile')}
            />
          </div>
          <div className="flex items-center gap-3 py-1">
            <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png" className="rounded-full cursor-pointer" height="16" width="16" alt="SOL" loading="lazy" decoding="async"  />
            <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-blue-900'} cursor-pointer`}>
              {solBalance? solBalance.toFixed(2): "0.00"}
            </span>
            <img src="https://s2.coinmarketcap.com/static/cloud/img/loyalty-program/diamond-icon.svg" className='cursor-pointer' width="16" height="16" />
            <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-red-400' : 'text-red-500'} cursor-pointer`}>
              {userData?.diamond_count? userData?.diamond_count : 0 }
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

      {/* Chart */}
      <div className="px-4 mb-2">
        <PriceChart
            data={priceHistory}
            latestPrice={latestPrice}
            previousPrice={previousPrice}
            period={selectedPeriod}
            title={lotteryType}
            theme={theme}
            onPeriodChange={handlePeriodChange}
          />
      </div>

      {/* Content */}
      <div className="px-4">
        <div className="mb-2">
          <h2 className={`text-xl font-bold mb-4`}>
            <span className='text-[#814c02]'>{lotteryType} PREDICTION </span>
            <span className={`font-semibold ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>for Mar 26, 12:00</span>
          </h2>
          
          <div className="flex justify-between items-center mb-4 px-3">
            <span className={`text-[20px] font-bold ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Start:
            </span>
            <div className="flex gap-6">
              {renderTimeUnit(countdown.hours, 'HOURS')}
              {renderTimeUnit(countdown.minutes, 'MINUTES')}
              {renderTimeUnit(countdown.seconds, 'SECONDS')}
            </div>
          </div>

          <div className={`p-2 rounded-lg ${
            theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'
          }`}>
            <div className="space-y-4">
              <div>
                <div className="flex text-md items-center mb-2">
                <span className={`font-semibold ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}>
                    Current Price:
                </span>
                <span className={`font-bold px-2 text-[#32bb4a]`}>
                    {latestPrice.toFixed(3)}
                </span>
                <span className={`font-semibold ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}>USD</span>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setPrediction((Number(prediction || latestPrice) - 0.001).toFixed(3))}
                    className={`absolute right-1 px-4 py-2 ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    -
                  </button>
                  <input
                    type="text"
                    value={prediction || latestPrice.toFixed(3)}
                    onChange={handlePredictionChange}
                    className={`flex-1 text-center w-full pr-8 pl-4 py-2 rounded-lg text-sm ${
                        theme === 'dark'
                          ? 'bg-slate-800 text-white border-slate-700'
                          : 'bg-slate-50 text-slate-900 border-slate-200'
                      } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  <button
                    onClick={() => setPrediction((Number(prediction || latestPrice) + 0.001).toFixed(3))}
                    className={`absolute left-1 px-4 py-2 ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full flex py-1.5 bg-blue-600 justify-center items-center text-white rounded-lg font-medium hover:bg-blue-500 transition-colors"
              >
                Buy Ticket with 
                <img 
                    src="https://s2.coinmarketcap.com/static/cloud/img/loyalty-program/diamond-icon.svg"
                    className="w-4 h-4 items-center self-center mr-2 ml-1"
                />
                <span className={`text-white`}>
                    50
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Ticket History */}
        {ticketHistory.length > 0 && (
          <div className="mb-8">
            <h3 className={`text-lg font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              My tickets:
            </h3>
            <div className="space-y-3">
              {ticketHistory.map((ticket) => (
                <div
                  key={ticket.id}
                  className={`p-4 rounded-lg ${
                    theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-sm ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {ticket.date}
                    </span>
                    <span className={`text-sm font-medium ${
                      ticket.status === 'won'
                        ? 'text-green-500'
                        : ticket.status === 'lost'
                        ? 'text-red-500'
                        : theme === 'dark'
                        ? 'text-slate-400'
                        : 'text-slate-600'
                    }`}>
                      {ticket.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        Prediction: ${ticket.prediction.toFixed(3)}
                      </p>
                      {ticket.actualPrice && (
                        <p className={`text-sm ${
                          theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          Actual: ${ticket.actualPrice.toFixed(3)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-4 left-4 right-4 p-4 rounded-lg ${
              theme === 'dark' ? 'bg-green-900' : 'bg-green-100'
            }`}
          >
            <div className="flex items-center justify-center">
              <span className={`font-medium ${
                theme === 'dark' ? 'text-green-400' : 'text-green-600'
              }`}>
                Prediction placed successfully!
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BuyTicket;