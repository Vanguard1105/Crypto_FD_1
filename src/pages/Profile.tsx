import React, { useState, useEffect, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, ChevronDown, ChevronUp, Mail, Lock, Wallet, User , CheckCircle} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { CgChevronLeft } from "react-icons/cg";
import { useUser } from '../context/UserContext';
import { motion, AnimatePresence } from 'framer-motion';
import GemAnimation from '../components/GemAnimation';
import { FaUserEdit } from "react-icons/fa";
import { fetchSolanaBalance } from '../utils/fetchSolanaBalance';

const Profile = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { userData, setUserData} = useUser();
  const [activeTab, setActiveTab] = useState<'settings' | 'bonuses'>('settings');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [username, setUsername] = useState(userData?.username || 'Peter Coiner');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [animatingGems, setAnimatingGems] = useState<{ id: number; startX: number; startY: number }[]>([]);
  const [topGemCount, setTopGemCount] = useState(userData?.diamond_count);
  const headerRef = useRef<HTMLDivElement>(null);
  const [claimedBonuses, setClaimedBonuses] = useState<number[]>([]);
  const [solBalance, setSolBalance] = useState<number | null>(null);

  useEffect(() => {
    if (userData?.publicKey) {
      const fetchBalance = async () => {
        const balance = await fetchSolanaBalance(userData.publicKey);
        const balanceInSol = balance !== null ? balance : 0; // Convert lamports to SOL
        const username = userData?.username;
        const user_id = userData?.user_id;
        const email = userData?.email;
        const publicKey = userData?.publicKey;
        const has_password = userData?.has_password;
        const diamond_count = userData?.diamond_count;
        const nickname = userData?.nickname;
        const solBalance = balanceInSol;
        setSolBalance(balanceInSol);
        setUserData({ username, user_id, email, publicKey, has_password, nickname, diamond_count, solBalance});
      };
      fetchBalance();
    }
  }, [userData?.publicKey]);
  const [email, setEmail] = useState(userData?.email);
  const [error, setError] = useState('');
  const bonusItems = [
    {
      title: 'INVITE FRIENDS',
      count: '4 friends',
      multiplier: 'x 10',
      bonus: '+2 Friends',
      reward: 20
    },
    {
      title: 'TICKETS PURCHASED BY FRIENDS',
      count: '24 tickets',
      multiplier: 'x 5',
      bonus: '24 Tickets',
      reward: 120
    },
    {
      title: 'DAILY BETTING',
      count: '6 days',
      multiplier: 'x 2',
      bonus: '7 Day',
      reward: 14
    },
    {
      title: 'TOP BUYER IN LOTTERY',
      count: '2 times',
      multiplier: 'x 200',
      bonus: '2 Times',
      reward: 400
    }
  ];

  const handleSaveChanges = () => {
    console.log('Saving changes...', { username, password });
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleClaimBonus = (index: number, reward: number, event: React.MouseEvent<HTMLDivElement>) => {
    if (claimedBonuses.includes(index)) return;

    const buttonRect = event.currentTarget.getBoundingClientRect();
    const headerRect = headerRef.current?.getBoundingClientRect();
    const targetGemElement = headerRef.current?.querySelector('.target-gem');
    const targetRect = targetGemElement?.getBoundingClientRect();

    if (!headerRect || !targetRect) return;

    const startX = buttonRect.left + buttonRect.width / 2;
    const startY = buttonRect.top + buttonRect.height / 2;

    const gemsToAnimate = Array.from({ length: Math.min(5, reward) }, (_, i) => ({
      id: Date.now() + i,
      startX,
      startY
    }));

    setClaimedBonuses(prev => [...prev, index]);
    
    gemsToAnimate.forEach((gem, i) => {
      setTimeout(() => {
        setAnimatingGems(prev => [...prev, gem]);
        
        if (i === gemsToAnimate.length - 1) {
          setTimeout(() => {
            setTopGemCount(prev => prev? prev + reward: reward);
          }, 800);
        }
      }, i * 200);
    });
  };

  const handleGemAnimationComplete = (gemId: number) => {
    setAnimatingGems(prev => prev.filter(gem => gem.id !== gemId));
  };

  const renderSettings = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-2"
    >
      {/* Account Settings */}
      <div className={`rounded-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'}`}>
        <button
          onClick={() => toggleSection('account')}
          className="w-full py-3 px-4 flex items-center justify-between"
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
          className="w-full py-3 px-4 flex items-center justify-between"
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
              <div className="py-4 px-2 pt-0 space-y-2">
                <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-slate-700' : 'bg-white'}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                      Sol wallet address
                    </span>
                    <span className={`text-sm ${theme === 'dark' ? 'text-red-400' : 'text-red-500'}`}>
                      <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png" className="rounded-full cursor-pointer" height="16" width="16" alt="SOL" loading="lazy" decoding="async"  />
                      {solBalance !== null ? solBalance.toFixed(2): "0.00"}
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
                      <img src="https://s2.coinmarketcap.com/static/cloud/img/loyalty-program/diamond-icon.svg" className='cursor-pointer' width="16" height="16" />
                      {userData?.diamond_count}
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
          className="w-full py-3 px-4 flex items-center justify-between"
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
                    New Password *
                    </label>
                    <div className="relative">
                    <input
                        type="password"
                        placeholder="Create New password"
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
          <div 
            className="flex items-center justify-center cursor-pointer py-0.5"
            onClick={(e) => handleClaimBonus(index, item.reward, e)}
          >
            <motion.div 
              className={`px-1 my-[6px] rounded-lg w-[80px] items-center ${
                claimedBonuses.includes(index)
                  ? theme === 'dark'
                    ? 'bg-slate-700'
                    : 'bg-slate-300'
                  : theme === 'dark'
                    ? 'bg-blue-600'
                    : 'bg-blue-500'
              }`}
              whileHover={!claimedBonuses.includes(index) ? { scale: 1.05 } : {}}
              whileTap={!claimedBonuses.includes(index) ? { scale: 0.95 } : {}}
            >
              <div className="text-xs text-white text-center">{item.bonus}</div>
              <div className='w-full flex justify-center py-1'>
                <motion.img 
                  src="https://s2.coinmarketcap.com/static/cloud/img/loyalty-program/diamond-icon.svg"
                  width="16"
                  height="16"
                  className={claimedBonuses.includes(index) ? 'opacity-50' : ''}
                />
              </div>
              <div className="text-xs text-white text-center">+ {item.reward}</div>
            </motion.div>
          </div>
        </div>
      ))}
    </motion.div>
  );

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
      {/* Header */}
      <div 
        ref={headerRef}
        className={`px-3 flex flex-col items-center sticky top-0 z-10 ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}
      >
        <div className={`flex flex-row justify-between w-full`}>
          <div className='flex flex-row gap-3 items-center py-1 px-2'>
            <CgChevronLeft size={16} className={`text-${theme === 'dark' ? 'slate-400 hover:text-slate-300' : 'slate-900 hover:text-slate-800'} cursor-pointer`} onClick={() => navigate("/home")}/>
          </div>
          <div className="flex items-center gap-3 py-1">
            <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png" className="rounded-full cursor-pointer" height="16" width="16" alt="SOL" loading="lazy" decoding="async"  />
            <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-blue-900'} cursor-pointer`}>
              {solBalance !== null ? solBalance.toFixed(2): "0.00"}
            </span>
            <img 
              src="https://s2.coinmarketcap.com/static/cloud/img/loyalty-program/diamond-icon.svg" 
              className='cursor-pointer target-gem' 
              width="16" 
              height="16" 
            />
            <motion.span 
              key={topGemCount}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.3 }}
              className={`text-sm font-semibold ${theme === 'dark' ? 'text-red-400' : 'text-red-500'} cursor-pointer`}
            >
              {topGemCount}
            </motion.span>
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

      {/* Floating Gems Animation */}
      {animatingGems.map(gem => {
        const targetGemElement = headerRef.current?.querySelector('.target-gem');
        const targetRect = targetGemElement?.getBoundingClientRect();
        
        if (!targetRect) return null;

        return (
          <GemAnimation
            key={gem.id}
            startX={gem.startX}
            startY={gem.startY}
            endX={targetRect.left + targetRect.width / 2}
            endY={targetRect.top + targetRect.height / 2}
            onComplete={() => handleGemAnimationComplete(gem.id)}
            theme={theme}
          />
        );
      })}

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
