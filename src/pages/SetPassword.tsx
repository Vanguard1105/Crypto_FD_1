import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sun, Moon, Mail, Lock, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { useTelegram } from '../components/useTelegram';  

const SetPassword = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const { user } = useTelegram();  
  

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const errors = [];
    if (password.length < 8) errors.push("Password must be at least 8 characters long");
    else if (!/[A-Z]/.test(password)) errors.push("Password must contain at least one uppercase letter");
    else if (!/[a-z]/.test(password)) errors.push("Password must contain at least one lowercase letter");
    else if (!/[0-9]/.test(password)) errors.push("Password must contain at least one number");
    return errors;
  };

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Email validation
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Password validation
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      setError(passwordErrors.join(', '));
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('https://crypto-bet-backend.vercel.app/api/auth/set-password', {
        email,
        password
      });
      
      if (response.status === 200) {
        navigate('/login');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to set password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-col items-center justify-between min-h-screen p-1 ${  
      theme === 'dark' ? 'bg-slate-900' : 'bg-white'  
    }`}>  
      {loading && (  
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">  
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>  
        </div>  
      )}  

      <div className="w-full flex justify-end">  
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
      <div className="flex flex-col items-center max-w-sm w-full pt-2 flex-grow px-[30px]">  
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

      {/* Signup Form */}
      <div className="w-full max-w-sm mb-2 px-[30px]">
        <form onSubmit={handleSetPassword} className="space-y-1">
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
                placeholder="Create your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg text-sm ${
                  theme === 'dark'
                    ? 'bg-slate-800 text-white border-slate-700'
                    : 'bg-slate-50 text-slate-900 border-slate-200'
                } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Confirm Password *
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg text-sm ${
                  theme === 'dark'
                    ? 'bg-slate-800 text-white border-slate-700'
                    : 'bg-slate-50 text-slate-900 border-slate-200'
                } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>
          {error? (
            <div className="text-red-500 text-sm text-center h-[20px]">
              {error}
            </div>
          ): <div className = "h-[20px]"></div>}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg text-sm font-medium 
              hover:bg-blue-600 active:bg-blue-700 transition-colors duration-200"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center mt-4">
          <span className={`${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            Have already registered?{' '}
          </span>
          <Link
            to="/login"
            className="text-blue-500 font-medium hover:text-blue-600"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SetPassword;