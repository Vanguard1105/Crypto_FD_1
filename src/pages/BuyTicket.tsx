import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sun, Moon, Timer, ArrowLeft } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchSolanaBalance } from '../utils/fetchSolanaBalance';
import PriceChart from '../components/PriceChart';
import { usePrice } from '../context/PriceContext';
import { useEthereumPrice } from '../context/EthereumPriceContext';
import { useBitcoinPrice } from '../context/BitcoinPriceContext';

interface Ticket {
  id: number;
  date: string;
  prediction: number;
  amount: number;
  status: 'pending' | 'won' | 'lost';
  actualPrice?: number;
}

const BuyTicket = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { userData, setUserData } = useUser();
  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [prediction, setPrediction] = useState<string>('');
  const [amount, setAmount] = useState<string>('1');
  const [showSuccess, setShowSuccess] = useState(false);
  const [countdown, setCountdown] = useState({ hours: 16, minutes: 43, seconds: 27 });
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const lotteryType = searchParams.get('type') || 'SOL';
  const lotteryId = searchParams.get('id');
  const status = searchParams.get('status');

  // Price data based on token type
  const { latestPrice: solanaPrice } = usePrice();
  const { latestPrice: ethereumPrice } = useEthereumPrice();
  const { latestPrice: bitcoinPrice } = useBitcoinPrice();

  const currentPrice = lotteryType === 'SOL' ? solanaPrice : 
                      lotteryType === 'ETH' ? ethereumPrice : bitcoinPrice;

  // Mock ticket history
  const [ticketHistory] = useState<Ticket[]>([
    {
      id: 1,
      date: '2025.03.23 09:00',
      prediction: 138.245,
      amount: 10,
      status: 'won',
      actualPrice: 138.251
    },
    {
      id: 2,
      date: '2025.03.23 12:00',
      prediction: 137.845,
      amount: 5,
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
    if (!prediction || !amount) return;
    
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      navigate('/lottery');
    }, 2000);
  };

  const renderTimeUnit = (value: number, label: string) => (
    <motion.div
      className={`flex flex-col items-center ${
        theme === 'dark' ? 'text-white' : 'text-slate-900'
      }`}
      initial={false}
      animate={{ rotateX: value === 0 ? 360 : 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`text-4xl font-bold mb-1 w-16 h-16 flex items-center justify-center rounded-lg ${
        theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'
      }`}>
        {String(value).padStart(2, '0')}
      </div>
      <span className="text-sm text-slate-500">{label}</span>
    </motion.div>
  );

  if (status === 'ended') {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
        <div className="px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate('/lottery')}
            className={`p-2 rounded-lg ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            <ArrowLeft size={20} />
          </button>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <div className="px-4 py-6">
          <h2 className={`text-2xl font-bold mb-6 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            Lottery #{lotteryId} Results
          </h2>

          <div className={`p-4 rounded-lg mb-6 ${
            theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <span className={`text-sm ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Final Price
              </span>
              <span className={`text-xl font-bold ${
                theme === 'dark' ? 'text-green-400' : 'text-green-600'
              }`}>
                ${currentPrice.toFixed(3)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className={`text-sm ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Total Participants
              </span>
              <span className={`text-xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                1,234
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className={`text-lg font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              Winners
            </h3>
            {[1, 2, 3].map((position) => (
              <div
                key={position}
                className={`p-4 rounded-lg flex items-center justify-between ${
                  theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    position === 1 ? 'bg-yellow-500' :
                    position === 2 ? 'bg-slate-400' :
                    'bg-amber-700'
                  }`}>
                    {position}
                  </div>
                  <div>
                    <p className={`font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}>
                      User{position}
                    </p>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      ${(currentPrice + (Math.random() * 0.01)).toFixed(3)}
                    </p>
                  </div>
                </div>
                <span className={`font-bold ${
                  theme === 'dark' ? 'text-green-400' : 'text-green-600'
                }`}>
                  +${(100 - (position - 1) * 25).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
      <div className="px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => navigate('/lottery')}
          className={`p-2 rounded-lg ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
          }`}
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-3">
          <img 
            src="https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png" 
            className="rounded-full" 
            height="20" 
            width="20" 
            alt="SOL" 
          />
          <span className={`font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            {solBalance?.toFixed(2) || '0.00'}
          </span>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>

      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            {lotteryType} Prediction #{lotteryId}
          </h2>
          <Timer size={24} className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} />
        </div>

        <div className="flex justify-center gap-4 mb-8">
          {renderTimeUnit(countdown.hours, 'HOURS')}
          {renderTimeUnit(countdown.minutes, 'MINUTES')}
          {renderTimeUnit(countdown.seconds, 'SECONDS')}
        </div>

        <div className={`p-4 rounded-lg mb-6 ${
          theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'
        }`}>
          <div className="flex justify-between items-center mb-4">
            <span className={`text-sm ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Current Price
            </span>
            <span className={`text-xl font-bold ${
              theme === 'dark' ? 'text-green-400' : 'text-green-600'
            }`}>
              ${currentPrice.toFixed(3)}
            </span>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Your Prediction
              </label>
              <input
                type="text"
                value={prediction}
                onChange={handlePredictionChange}
                placeholder="Enter price prediction"
                className={`w-full px-4 py-2 rounded-lg text-right ${
                  theme === 'dark'
                    ? 'bg-slate-700 text-white'
                    : 'bg-white text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${
                theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Bet Amount
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['1', '5', '10', '25'].map((value) => (
                  <button
                    key={value}
                    onClick={() => setAmount(value)}
                    className={`py-2 rounded-lg transition-colors ${
                      amount === value
                        ? 'bg-blue-500 text-white'
                        : theme === 'dark'
                        ? 'bg-slate-700 text-slate-300'
                        : 'bg-white text-slate-700'
                    }`}
                  >
                    ${value}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!prediction || !amount}
          className={`w-full py-3 rounded-lg font-medium transition-colors ${
            prediction && amount
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : theme === 'dark'
              ? 'bg-slate-700 text-slate-500'
              : 'bg-slate-200 text-slate-500'
          }`}
        >
          Place Prediction
        </button>

        {ticketHistory.length > 0 && (
          <div className="mt-8">
            <h3 className={`text-lg font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              Your Previous Tickets
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
                    <span className={`font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}>
                      ${ticket.amount.toFixed(2)}
                    </span>
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