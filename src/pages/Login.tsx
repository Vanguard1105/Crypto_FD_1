import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sun, Moon, Mail, Lock } from 'lucide-react';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useTelegram } from '../components/useTelegram';
import { useUser } from '../context/UserContext';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showExpiredAlert, setShowExpiredAlert] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { login } = useAuth();
  const { user, user_id } = useTelegram();
  const { userData } = useUser();
  const [email, setEmail] = useState(userData?.email || '');

  // Handle session expiration
  useEffect(() => {
    const isExpired = new URLSearchParams(location.search).get('expired') === 'true';
    if (isExpired) {
      setShowExpiredAlert(true);
      setTimeout(() => setShowExpiredAlert(false), 5000);
    }
  }, [location]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignUpNavigation = () => {
    if (!userData?.email) {
      navigate('/set-password');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!password) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('https://crypto-bet-backend-fawn.vercel.app/api/auth/login', {
        user_id,
        password
      });
      login(response.data.token, userData);
      navigate('/home');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-col items-center justify-between min-h-screen p-1 ${  
      theme === 'dark' ? 'bg-slate-900' : 'bg-white'  
    }`}>  
      {/* Loading Spinner */}
      {loading && (  
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">  
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>  
        </div>  
      )}  

      {/* Theme Toggle */}
      <div className="w-full flex justify-end p-2">  
        <button  
          onClick={toggleTheme}  
          className={`p-2 rounded-full transition-colors ${  
            theme === 'dark'  
              ? 'text-slate-400 hover:text-slate-200'  
              : 'text-slate-600 hover:text-slate-800'  
          }`}  
        >  
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}  
        </button>  
      </div>   

      {/* Main Content */}  
      <div className="flex flex-col items-center max-w-sm w-full pt-2 px-5 flex-grow">  
        {/* Hero Image */}  
        <div className="w-full h-[173px] aspect-[4/3] relative rounded-md overflow-hidden">  
          <img  
            src="./crypto.jpg"  
            alt="Crypto Trading"  
            className="w-full h-full object-cover"  
          />  
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/30 to-violet-500/30 mix-blend-overlay" />  
        </div>  

        {/* Title */}  
        <div className="text-center">  
          <p className={`text-[18px] font-bold pt-2 ${  
            theme === 'dark' ? 'text-white' : 'text-slate-900'  
          }`}>  
          Welcome to cryptoBet {user?.username && user.username.length > 6 ? user.username.substring(0, 6) + ".." : user?.username}  
          </p>  
          <p className={`text-sm py-1 ${  
            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'  
          }`}>  
            Join now to start crypto betting.  
          </p>  
        </div>  
      </div>  

      {/* Login Form */}
      <div className="w-full max-w-sm mb-2 px-[30px]">
        <form onSubmit={handleLogin} className="space-y-3">
          <div>
            <label className={`block text-sm font-medium mb-1 ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Email *
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg text-sm ${
                  theme === 'dark'
                    ? 'bg-slate-800 text-white border-slate-700'
                    : 'bg-slate-50 text-slate-900 border-slate-200'
                } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Password *
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pr-8 pl-4 py-2 rounded-lg text-sm ${
                  theme === 'dark'
                    ? 'bg-slate-800 text-white border-slate-700'
                    : 'bg-slate-50 text-slate-900 border-slate-200'
                } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>

          {error?  (
            <div className="text-red-500 text-sm text-center h-[20px]">
              {error}
            </div>
          ) : <div className='h-[20px]'></div>}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg text-sm font-medium
              hover:bg-blue-600 active:bg-blue-700 transition-colors duration-200"
          >
            Log In
          </button>
        </form>

        <p className="text-center mt-4">
          <span className={`${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            New to cryptobet?{' '}
          </span>
          <button
            onClick={handleSignUpNavigation}
            className="text-blue-500 font-medium hover:text-blue-600"
          >
            Sign Up
          </button>
        </p>
      </div>

      {/* Session Expired Alert */}
      <AnimatePresence>
        {showExpiredAlert && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-xl shadow-lg ${
              theme === 'dark' ? 'bg-slate-800' : 'bg-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Your session has expired. Please log in again.
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;