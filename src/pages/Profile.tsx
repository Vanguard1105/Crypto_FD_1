import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, ChevronDown, ChevronUp, Mail, Lock, Wallet, User, CheckCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { CgChevronLeft } from "react-icons/cg";
import { useUser } from '../context/UserContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserEdit } from "react-icons/fa";

const Profile = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { userData } = useUser();
  const [activeTab, setActiveTab] = useState<'settings' | 'bonuses'>('settings');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [username, setUsername] = useState(userData?.username || 'User' + userData?.user_id);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState(userData?.email);
  const [error, setError] = useState('');

  const validatePassword = (password: string) => {
    const errors = [];
    if (password.length < 8) errors.push("Password must be at least 8 characters long");
    else if (!/[A-Z]/.test(password)) errors.push("Password must contain at least one uppercase letter");
    else if (!/[a-z]/.test(password)) errors.push("Password must contain at least one lowercase letter");
    else if (!/[0-9]/.test(password)) errors.push("Password must contain at least one number");
    return errors;
  };

  const bonusItems = [
    {
      title: 'INVITE FRIENDS',
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

  const handleSaveChanges = () => {
    // Handle save changes logic here
    console.log('Saving changes...', { username, password });
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const renderSettings = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-3"
    >
      {/* Account Settings */}
      <div className={`rounded-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'}`}>
        <button
          onClick={() => toggleSection('account')}
          className="w-full p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <User className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'} size={20} />
            <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Account settings
            </h3>
          </div>
          {expandedSection === 'account' ? (
            <ChevronUp className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'} size={20} />
          ) : (
            <ChevronDown className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'} size={20} />
          )}
        </button>
        
        <AnimatePresence>
          {expandedSection === 'account' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-2 pt-0 space-y-2">
                
                <div>
                    <label className={`block text-sm font-medium mb-1 ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                    Username *
                    </label>
                    <div className="relative">
                    <input
                        type="text"
                        placeholder="Enter your email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={`w-full px-4 py-2 rounded-lg text-sm ${
                        theme === 'dark'
                            ? 'bg-slate-800 text-white border-slate-700'
                            : 'bg-slate-50 text-slate-900 border-slate-200'
                        } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    <FaUserEdit className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    </div>
                </div>
                
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Wallet Management */}
      <div className={`rounded-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'}`}>
        <button
          onClick={() => toggleSection('wallet')}
          className="w-full p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Wallet className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'} size={20} />
            <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Wallet management
            </h3>
          </div>
          {expandedSection === 'wallet' ? (
            <ChevronUp className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'} size={20} />
          ) : (
            <ChevronDown className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'} size={20} />
          )}
        </button>

        <AnimatePresence>
          {expandedSection === 'wallet' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-4 pt-0 space-y-2">
                <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-slate-700' : 'bg-white'}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                      Sol wallet address
                    </span>
                    <span className={`text-sm text-bold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-900'}`}>
                      available: 2.53
                    </span>
                  </div>
                  <div className={`mt-1 text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-600'}`}>
                    {userData?.publicKey}
                  </div>
                </div>

                <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-slate-700' : 'bg-white'}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                      Available Diamonds
                    </span>
                    <span className={`text-sm ${theme === 'dark' ? 'text-red-400' : 'text-red-500'}`}>
                      1000
                    </span>
                  </div>
                  <button className="mt-2 w-full py-1 px-4 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors">
                    Charge
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Security */}
      <div className={`rounded-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'}`}>
        <button
          onClick={() => toggleSection('security')}
          className="w-full p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Lock className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'} size={16} />
            <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Security
            </h3>
          </div>
          {expandedSection === 'security' ? (
            <ChevronUp className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'} size={16} />
          ) : (
            <ChevronDown className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'} size={16} />
          )}
        </button>

        <AnimatePresence>
          {expandedSection === 'security' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pt-0 space-y-2">
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
                        className={`w-full pr-8 pl-4 py-2 rounded-lg text-sm ${
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
                        className={`w-full pr-8 pl-4 py-2 rounded-lg text-sm ${
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
                    ): <div className = "h-[20px]">
                    </div>
                    }
                </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {expandedSection && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          onClick={handleSaveChanges}
          className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Save Changes
        </motion.button>
      )}
    </motion.div>
  );

  const renderBonuses = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-2"
    >
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
              <span className={`text-sm font-large px-2 w-[90px] ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                {item.count}
              </span>
              <span className={`text-md w-[50px] ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>
                {item.multiplier}
              </span>
              <img src="https://s2.coinmarketcap.com/static/cloud/img/loyalty-program/diamond-icon.svg" className='cursor-pointer' width="16" height="16" />
            </div>
          </div>
          <div className="flex items-center justify-center cursor-pointer py-0.5">
            <div className={`px-1 my-[6px] rounded-lg w-[80px] items-center ${
              theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'
            }`}>
              <div className="text-xs text-white text-center">{item.bonus}</div>
              <div className='w-full flex justify-center py-1'>
                <img src="https://s2.coinmarketcap.com/static/cloud/img/loyalty-program/diamond-icon.svg" width="16" height="16" />
              </div>
              <div className="text-xs text-white text-center">{item.reward}</div>
            </div>
          </div>
        </div>
      ))}
    </motion.div>
  );

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
        <div className="flex items-center gap-4 mb-6">
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop"
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              {username}
            </h2>
            <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              @{userData?.username || 'cryptoboss009'}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-4 mb-4">
          <button 
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === 'settings'
                ? theme === 'dark'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-500 text-white'
                : theme === 'dark'
                ? 'text-white hover:bg-slate-800'
                : 'text-slate-900 hover:bg-slate-100'
            }`}
          >
            Settings
          </button>
          <button 
            onClick={() => setActiveTab('bonuses')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === 'bonuses'
                ? theme === 'dark'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-500 text-white'
                : theme === 'dark'
                ? 'text-white hover:bg-slate-800'
                : 'text-slate-900 hover:bg-slate-100'
            }`}
          >
            Bonuses
          </button>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'settings' ? renderSettings() : renderBonuses()}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Profile;