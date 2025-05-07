import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, Timer, Calendar, ArrowUp, ArrowDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import PriceChart from '../components/PriceChart';
import PredictChart from '../components/PredictChart';
import { usePrice } from '../context/PriceContext';
import { useEthereumPrice } from '../context/EthereumPriceContext';
import { useBitcoinPrice } from '../context/BitcoinPriceContext';
import { usePrediction } from '../context/PredictionContext';
import { PriceData, TimePeriod, DrawingState } from '../types';
import { FaUserCog } from "react-icons/fa";
import { CgChevronLeft } from "react-icons/cg";
import { useUser } from '../context/UserContext';
import { fetchSolanaBalance } from '../utils/fetchSolanaBalance';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useWebSocket } from '../context/WebSocketContext';
import axios from '../api/axios';
import { useTimeSync } from '../context/TimeSyncContext';

type LotteryType = 'predict' | 'lottery';
type VoteType = 'up' | 'down' | null;

const DRAW_DURATION = 90000; // 1.5 minutes in milliseconds
const PREPARATION_TIME = 30000; // 30 seconds in milliseconds

interface Lottery {
  _id: string;
  date: string;
  buyTicketTime: string;
  startTime: number;
  endTime: number;
  buyersLength: number;
  currencyType: string;
  totalValue: number;
  price: number;
}

const Lottery = () => {
  const navigate = useNavigate();
  const { lotteryUpdates } = useWebSocket();
  const { theme, toggleTheme } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('5m');
  const { userData, setUserData} = useUser();
  const [solBalance, setSolBalance] = useState<number | null | undefined>(userData?.solBalance);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const lotteryType = searchParams.get('type') || 'SOL';
  const predictType = searchParams.get('predictType') || 'predict';
  const [selectedType, setSelectedType] = useState<LotteryType>(predictType as LotteryType);
  const [selectedVote, setSelectedVote] = useState<VoteType>(null);
  const [betAmount, setBetAmount] = useState<string>('1');
  const [showVoteSuccess, setShowVoteSuccess] = useState(false);
  const [lotteries, setLotteries] = useState<Lottery [] | null>(null);
  const { syncedTime } = useTimeSync();
  const [drawingState, setDrawingState] = useState<DrawingState>({
    isActive: false,
    startTime: 0,
    endTime: 0,
    startPrice: 0,
  });
  const [countdown, setCountdown] = useState(30);
  const { predictData } = usePrediction();
  // Get price data based on token type
  const { priceHistory: solanaHistory, latestPrice: solanaLatestPrice, previousPrice: solanaPreviousPrice } = usePrice();
  const { priceHistory: ethereumHistory, latestPrice: ethereumLatestPrice, previousPrice: ethereumPreviousPrice } = useEthereumPrice();
  const { priceHistory: bitcoinHistory, latestPrice: bitcoinLatestPrice, previousPrice: bitcoinPreviousPrice } = useBitcoinPrice();
  
  let priceHistory: PriceData[], latestPrice, previousPrice;
  console.log(syncedTime);
  useEffect(() => {
    const fetchLotteries = async () => {
      try {
        const response = await axios.post('https://crypto-bet-backend-fawn.vercel.app/api/lottery/get-top-lotteries', {
          index: 1,
          currencyType: lotteryType,
        });
        // Ensure the response data is an array
        console.log("get_list", response.data)

        if (Array.isArray(response.data)) {
          setLotteries(response.data);
        } else {
          console.error('Invalid bonuses data format:', response.data);
          setLotteries(null);
        }
      } catch (error) {
        console.error('Error fetching bonuses:', error);
        setLotteries(null);
      }
    };
    fetchLotteries();
  }, []);

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

  // Handle drawing state and countdown
  useEffect(() => {
    if (userData?.publicKey) {
      const fetchBalance = async () => {
        const balance = await fetchSolanaBalance(userData.publicKey);
        const balanceInSol = balance !== null ? balance  : 0; // Convert lamports to SOL
        setSolBalance(balanceInSol);
        setUserData({ 
          ...userData,
          solBalance: balanceInSol
        });
        // setUserData({ username, user_id, email, publicKey, has_password, nickname, diamond_count, avatar, solBalance});
      };
      fetchBalance();
    }
  }, [userData?.publicKey]);

  useEffect(() => {
    console.log(lotteryUpdates)
  }, [lotteryUpdates]);

  useEffect(() => {
    if (!drawingState.isActive) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            const now = Date.now();
            setDrawingState({
              isActive: true,
              startTime: now,
              endTime: now + DRAW_DURATION,
              startPrice: latestPrice,
            });
            return DRAW_DURATION / 1000;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    } else {
      const timer = setInterval(() => {
        const now = Date.now();
        if (now >= drawingState.endTime) {
          setDrawingState(prev => ({ ...prev, isActive: false }));
          setCountdown(PREPARATION_TIME / 1000);
          setSelectedVote(null);
        } else {
          setCountdown(Math.ceil((drawingState.endTime - now) / 1000));
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [drawingState.isActive, drawingState.endTime, latestPrice]);
  

  
  const handleVote = (type: VoteType) => {
    if (!drawingState.isActive || selectedVote !== null) return;
    
    setSelectedVote(type);
    setShowVoteSuccess(true);
    setTimeout(() => setShowVoteSuccess(false), 2000);
  };
  
  const handlePeriodChange = (period: TimePeriod) => {
    setSelectedPeriod(period);
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp); // Convert seconds to milliseconds
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
  
    return `${year}-${month}-${day}, ${hours}:${minutes}`;
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
      {/* Header */}
      <div className={`px-3 flex flex-col items-center sticky top-0 z-10 ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
        <div className={`flex flex-row justify-between w-full`}>
          <div className='flex flex-row gap-3 items-center py-1 px-2'>
            <CgChevronLeft 
              size={16} 
              className={`text-${theme === 'dark' ? 'slate-400 hover:text-slate-300' : 'slate-900 hover:text-slate-800'} cursor-pointer`} 
              onClick={() => navigate("/home")}
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

      {/* Chart Section */}
      <div className="pb-2 px-4">
        {selectedType === 'predict' ? (
          <PredictChart
            data={predictData}
            latestPrice={latestPrice}
            theme={theme}
            isDrawing={drawingState.isActive}
            startTime={drawingState.startTime}
            endTime={drawingState.endTime}
            startPrice={drawingState.startPrice}
          />
        ) : (
          <PriceChart
            data={priceHistory}
            latestPrice={latestPrice}
            previousPrice={previousPrice}
            period={selectedPeriod}
            title={lotteryType}
            theme={theme}
            onPeriodChange={handlePeriodChange}
          />
        )}
      </div>

      {/* Mode Selection */}
      <div className="flex px-4">
        <div className={`inline-flex rounded-lg p-1 ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'} w-full`}>
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
          <button
            onClick={() => setSelectedType('lottery')}
            className={`flex items-center w-1/2 justify-center py-1 rounded-md font-medium transition-all duration-200 hover:shadow-purple-500/30 ${
              selectedType === 'lottery'
                ? theme === 'dark'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-blue-500 text-white shadow-lg'
                : theme === 'dark'
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            Lottery
          </button>
        </div>
      </div>

      {/* Content based on selected type */}
      {selectedType === 'predict' ? (
        <div className="px-4 mt-4 space-y-4">
          {/* Timer */}
          <div className={`relative overflow-hidden rounded-xl ${theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-100'}`}>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className={`font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                  {drawingState.isActive ? 'DRAWING' : 'NEXT DRAW IN'}
                </span>
                <Timer className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} size={20} />
              </div>
              <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} mb-1`}>
                {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
              </div>
            </div>
          </div>

          {/* Bet Amount Selection */}
          <div className="grid grid-cols-7 gap-2">
            {['1', '3', '5', '10', '15', '20', '25'].map((amount) => (
              <motion.button
                key={amount}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setBetAmount(amount)}
                className={`py-2 px-1 rounded-lg text-center transition-all duration-200 ${
                  betAmount === amount
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                    : theme === 'dark'
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                ${amount}
              </motion.button>
            ))}
          </div>

          {/* Vote Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleVote('up')}
              disabled={!drawingState.isActive || selectedVote !== null}
              className={`py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 ${
                selectedVote === 'up'
                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                  : theme === 'dark'
                  ? 'bg-green-900/20 text-green-400 hover:bg-green-900/30'
                  : 'bg-green-100 text-green-600 hover:bg-green-200'
              } ${(!drawingState.isActive || selectedVote !== null) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <ArrowUp size={24} />
              <span className="font-bold text-lg">UP</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleVote('down')}
              disabled={!drawingState.isActive || selectedVote !== null}
              className={`py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 ${
                selectedVote === 'down'
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                  : theme === 'dark'
                  ? 'bg-red-900/20 text-red-400 hover:bg-red-900/30'
                  : 'bg-red-100 text-red-600 hover:bg-red-200'
              } ${(!drawingState.isActive || selectedVote !== null) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <ArrowDown size={24} />
              <span className="font-bold text-lg">DOWN</span>
            </motion.button>
          </div>
        </div>
      ) : (
        /* Lottery List */
        <div className="px-4 space-y-1 mt-4">
          {lotteries?.map((lottery) => (
          <div
          key={lottery?._id}
          onClick={() => navigate(`/buy-ticket?type=${lotteryType}&id=${lottery?._id}&timePeriod=${selectedPeriod}`)}
          className={`relative rounded-xl overflow-hidden group cursor-pointer border ${
            theme === 'dark' ? 'bg-slate-800 border-slate-800' : 'bg-slate-100 border-slate-400'
          } shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-md ${
            lottery?.endTime < syncedTime ? 'opacity-80' : ''
          } hover:shadow-purple-500/20`}
        >
          <div className={`px-2 py-1 h-full flex flex-col justify-between relative ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Calendar size={16} className="text-purple-400" />
                  <span className="text-sm font-medium text-purple-400">
                    {new Date(lottery?.buyTicketTime).toISOString().split('T')[0]}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Timer size={16} className={`
                    ${lottery?.endTime < syncedTime 
                      ? theme === 'dark' ? 'text-red-400' : 'text-red-500'
                      : theme === 'dark' ? 'text-green-400' : 'text-green-500'
                    }
                  `} />
                  <span className={`text-sm font-medium ${
                    lottery?.endTime < syncedTime 
                      ? theme === 'dark' ? 'text-red-400' : 'text-red-500'
                      : theme === 'dark' ? 'text-green-400' : 'text-green-500'
                  }`}>
                    {lottery?.endTime < syncedTime ? 'Ended:' : 'Start:'} {formatTimestamp(lottery?.startTime)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-end">
              <span className={`px-4 py-1 rounded-md text-sm font-medium bg-purple-500/10 text-purple-500`}>
              3rd SOL Lottery
              </span>
              <div className={`w-24 h-24 absolute bottom-4 right-4 rounded-lg bg-purple-500/5 transition-transform duration-300 group-hover:scale-110`} />
            </div>
          </div>
        </div>
        ))}
      </div>
      )}
      {/* Vote Success Message */}
      <AnimatePresence>
        {showVoteSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-xl shadow-lg ${
              theme === 'dark' ? 'bg-slate-800' : 'bg-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${
                selectedVote === 'up' ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                {selectedVote === 'up' ? '🎯 Voted Up!' : '🎯 Voted Down!'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Lottery;