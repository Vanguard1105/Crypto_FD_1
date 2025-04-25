import React, { useState, useEffect, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, ChevronDown, ChevronUp, Mail, Lock, Wallet, User , CheckCircle, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { CgChevronLeft } from "react-icons/cg";
import { useUser } from '../context/UserContext';
import { motion, AnimatePresence } from 'framer-motion';
import GemAnimation from '../components/GemAnimation';
import { FaUserEdit } from "react-icons/fa";
import { fetchSolanaBalance } from '../utils/fetchSolanaBalance';
import axios from '../api/axios';

interface GemAnimationState {
  id: number;
  startX: number;
  startY: number;
  arrived: boolean;
  value: number;
}
interface BonusItem {
  total_ref_count: number;
  diamond_per_ref: number;
  current_ref_count: number;
  index: number;
  // Add other properties if needed
}
const Profile = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { userData, setUserData} = useUser();
  const [activeTab, setActiveTab] = useState<'settings' | 'bonuses'>('settings');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [username, setUsername] = useState(userData?.username || 'User' + userData?.user_id);
  const [password, setPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [animatingGems, setAnimatingGems] = useState<GemAnimationState[]>([]);
  const [currentGemCount, setCurrentGemCount] = useState(userData?.diamond_count || 0);
  const [targetGemCount, setTargetGemCount] = useState(userData?.diamond_count || 0);
  const headerRef = useRef<HTMLDivElement>(null);
  const [claimedBonuses, setClaimedBonuses] = useState<number[]>([]);
  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [email, setEmail] = useState(userData?.email);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const user_id = userData?.user_id; 
  const [loading, setLoading] = useState(false);
  const [bonuses, setBonuses] = useState<BonusItem[]>([
    {  
      index: 0,
      total_ref_count: 0,
      diamond_per_ref: 0,
      current_ref_count: 10,
    },
    {  
      index: 1,
      total_ref_count: 0,
      diamond_per_ref: 0,
      current_ref_count: 5,
    },
    {  
      index: 2,
      total_ref_count: 0,
      diamond_per_ref: 0,
      current_ref_count: 2,
    },
    {  
      index: 3,
      total_ref_count: 0,
      diamond_per_ref: 0,
      current_ref_count: 100,
    },
  ]);
  const [bonusItems, setBonusItems] = useState<any[]>([]);
  const [isUpdatingBonuses, setIsUpdatingBonuses] = useState(false);
  const validateEmail = (email: string | undefined) => {
    if (email == undefined) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const ErrorNotification = () => (
    <AnimatePresence>
      {showError && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-8 end-2 transform px-4 py-2 rounded-md flex items-center gap-2 ${
            theme === 'dark' ? 'bg-red-900 text-red-300' : 'bg-red-50 text-red-600'
          } shadow-lg`}
        >
          <span className="text-sm font-medium">{error}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const validatePassword = (password: string) => {
    const errors = [];
    if (password.length < 8) errors.push("Password must be at least 8 characters long");
    else if (!/[A-Z]/.test(password)) errors.push("Password must contain at least one uppercase letter");
    else if (!/[a-z]/.test(password)) errors.push("Password must contain at least one lowercase letter");
    else if (!/[0-9]/.test(password)) errors.push("Password must contain at least one number");
    return errors;
  };
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
      });
  };

  useEffect(() => {
    if (userData?.publicKey) {
      const fetchBalance = async () => {
        const balance = await fetchSolanaBalance(userData.publicKey);
        const balanceInSol = balance !== null ? balance : 0;
        setSolBalance(balanceInSol);
        setUserData({ 
          ...userData,
          solBalance: balanceInSol
        });
      };
      fetchBalance();
    }
  }, [userData?.publicKey]);
  
  useEffect(() => {
    const fetchBonuses = async () => {
      try {
        const response = await axios.post('https://crypto-bet-backend-fawn.vercel.app/api/user/get-bonus');
        // Ensure the response data is an array
        console.log("get_bonus", response.data.bonuses)

        if (Array.isArray(response.data.bonuses)) {
          setBonuses(response.data.bonuses);
        } else {
          console.error('Invalid bonuses data format:', response.data);
          setBonuses([]);
        }
      } catch (error) {
        console.error('Error fetching bonuses:', error);
        setBonuses([]);
      }
    };
    fetchBonuses();
  }, []);

  const handleGemAnimationComplete = (gemId: number) => {
    setAnimatingGems(prev => {
      const updatedGems = prev.map(gem => {
        if (gem.id === gemId) {
          // Calculate the increment value based on the remaining distance to target
          const remainingGems = prev.filter(g => !g.arrived).length;
          const remainingDistance = targetGemCount - currentGemCount;
          const increment = Math.ceil(remainingDistance / remainingGems);
          
          setCurrentGemCount(current => Math.min(current + increment, targetGemCount));
          return { ...gem, arrived: true };
        }
        return gem;
      });
      
      // Remove all gems if they've all arrived
      if (updatedGems.every(gem => gem.arrived)) {
        return [];
      }
      
      return updatedGems;
    });
  };

  const handleClaimBonus = (index: number, reward: number, event: React.MouseEvent<HTMLDivElement>) => {
    if (claimedBonuses.includes(index)) return;

    const buttonRect = event.currentTarget.getBoundingClientRect();
    const targetGemElement = headerRef.current?.querySelector('.target-gem');
    const targetRect = targetGemElement?.getBoundingClientRect();

    if (!targetRect) return;

    const startX = buttonRect.left + buttonRect.width / 2;
    const startY = buttonRect.top + buttonRect.height / 2;

    setClaimedBonuses(prev => [...prev, index]);
    setTargetGemCount(currentGemCount + reward);

    // Create 5 gems for the animation
    const gemsToAnimate = Array.from({ length: 5 }, (_, i) => ({
      id: Date.now() + i,
      startX,
      startY,
      arrived: false,
      value: Math.ceil(reward / 5)
    }));

    // Stagger the animation of each gem
    gemsToAnimate.forEach((gem, i) => {
      setTimeout(() => {
        setAnimatingGems(prev => [...prev, gem]);
      }, i * 200);
    });
  };

  const CopyNotification = () => (
    <AnimatePresence>
      {isCopied && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-8 end-2 transform  px-4 py-2 rounded-md flex items-center gap-2 ${
            theme === 'dark' ? 'bg-slate-800 text-green-400' : 'bg-green-50 text-green-600'
          } shadow-lg`}
        >
          <Check size={16} className="text-green-500" />
          <span className="text-sm font-medium">Your wallet address copied!</span>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Update bonusItems whenever bonuses changes
  useEffect(() => {
    setIsUpdatingBonuses(true);
    const updatedBonusItems = bonuses.map((bonus, index) => {
      const titles = [
        'INVITE FRIENDS',
        'TICKETS PURCHASED BY FRIENDS',
        'DAILY BETTING',
        'TOP BUYER IN LOTTERY'
      ];
      const units = ['friends', 'tickets', 'days', 'times'];
      const unitLabels = ['Friends', 'Tickets', 'Day', 'Times'];
      
      return {
        title: titles[index] || 'BONUS',
        count: `${bonus.total_ref_count || 0} ${units[index] || ''}`,
        multiplier: `x ${bonus.diamond_per_ref || 0}`,
        bonus: index === 0 ? 
          `+${bonus.current_ref_count || 0} ${unitLabels[index] || ''}` : 
          `${bonus.current_ref_count || 0} ${unitLabels[index] || ''}`,
        reward: (bonus.current_ref_count || 0) * (bonus.diamond_per_ref || 0)
      };
    });

    setTimeout(() => {
      setBonusItems(updatedBonusItems);
      setIsUpdatingBonuses(false);
    }, 300); // Adjust the delay as needed

  }, [bonuses]);

  const handleSaveChanges = async () => {
    setError('');
    setShowError(false);
    
    // Email validation
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }
    
    // Old Password validation
    if (oldPassword.length < 8) {
      setError("Please input old password correctly..");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    if (password != "" && confirmPassword != ""){
      // Password validation
      const passwordErrors = validatePassword(password);
      if (passwordErrors.length > 0) {
        setError(passwordErrors.join(', '));
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
        return;
      }
      
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
        return;
      }
    }
    setLoading(true);

    try {
      const response = await axios.post('https://crypto-bet-backend-fawn.vercel.app/api/user/user-update', {
        username,
        email,
        password,
        oldPassword,
      });
      
      if (response.status === 200) {
        const username = response?.data?.user.username;
        const publicKey = userData?.publicKey;
        const has_password = userData?.has_password;
        const diamond_count = userData?.diamond_count;
        const nickname = userData?.nickname;
        const avatar = userData?.avatar;
        const solBalance = userData?.solBalance? userData?.solBalance: 0;

        setUserData({ username, user_id, email, publicKey, has_password, nickname, diamond_count, avatar, solBalance});
        setTimeout(() => {
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`fixed top-8 end-2 transform  px-4 py-2 rounded-md flex items-center gap-2 ${
                theme === 'dark' ? 'bg-slate-800 text-green-400' : 'bg-green-50 text-green-600'
              } shadow-lg`}
            >
              <Check size={16} className="text-green-500" />
              <span className="text-sm font-medium">Successfully updated!</span>
            </motion.div>
          </AnimatePresence>
        }, 100); 
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to set password. Please try again.');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
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
                  <div className="flex items-center justify-between py-2">
                    <span className={`text-sm text-bold ${theme === 'dark' ? 'text-slate-100' : 'text-slate-600'}`}>
                      Sol wallet address
                    </span>
                    <span className={`text-sm ${theme === 'dark' ? 'text-red-400' : 'text-red-500'} flex flex-row items-center gap-2`}>
                      <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png" className="rounded-full cursor-pointer" height="16" width="16" alt="SOL" loading="lazy" decoding="async"  />
                      {solBalance !== null ? solBalance.toFixed(2): "0.00"}
                    </span>
                  </div>
                  <motion.div
                    className={`cursor-pointer mt-1 text-xs text-blue-400 hover:text-blue-600 transition-colors duration-200`}
                    onClick={() => copyToClipboard(userData?.publicKey || '')}
                    whileTap={{ scale: 0.95 }}
                  >
                    {userData?.publicKey}
                  </motion.div>
                </div>
                <CopyNotification />

                <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-slate-700' : 'bg-white'}`}>
                  <div className="flex items-center justify-between py-[6px]">
                    <span className={`text-sm text-bold ${theme === 'dark' ? 'text-slate-100' : 'text-slate-600'}`}>
                      Available Diamonds
                    </span>
                    <span className={`text-sm ${theme === 'dark' ? 'text-red-400' : 'text-red-500'} flex flew-row items-center gap-2`}>
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
              <div className="px-4 pt-0 space-y-1 pb-2">
                <div>
                    <label className={`block text-sm font-medium mb-1 ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                    Old Password *
                    </label>
                    <div className="relative">
                    <input
                        type="password"
                        placeholder="Enter old password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className={`w-full pr-8 pl-4 py-1.5 rounded-lg text-sm ${
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
                    New Password *
                    </label>
                    <div className="relative">
                    <input
                        type="password"
                        placeholder="Create New password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full pr-8 pl-4 py-1.5 rounded-lg text-sm ${
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
                        className={`w-full pr-8 pl-4 py-1.5 rounded-lg text-sm ${
                        theme === 'dark'
                            ? 'bg-slate-800 text-white border-slate-700'
                            : 'bg-slate-50 text-slate-900 border-slate-200'
                        } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    </div>
                </div>
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
          className="w-full py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
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
      {isUpdatingBonuses ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        bonusItems.map((item, index) => (
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
                  !item.reward
                    ? theme === 'dark'
                      ? 'bg-slate-700'
                      : 'bg-slate-300'
                    : theme === 'dark'
                      ? 'bg-blue-600'
                      : 'bg-blue-500'
                }`}
                whileHover={item.reward ? { scale: 1.05 } : {}}
                whileTap={item.reward ? { scale: 0.95 } : {}}
              >
                <div className="text-xs text-white text-center">{item.bonus}</div>
                <div className='w-full flex justify-center py-1'>
                  <motion.img 
                    src="https://s2.coinmarketcap.com/static/cloud/img/loyalty-program/diamond-icon.svg"
                    width="16"
                    height="16"
                    className={item.reward ? 'opacity-50' : ''}
                  />
                </div>
                <div className="text-xs text-white text-center">+ {item.reward}</div>
              </motion.div>
            </div>
          </div>
        ))
      )}
        
    </motion.div>
  );

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
      {loading && (  
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">  
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>  
        </div>  
      )}  
      <ErrorNotification />
      <div ref={headerRef} className={`px-3 flex flex-col items-center sticky top-0 z-10 ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
        <div className={`flex flex-row justify-between w-full`}>
          <div className='flex flex-row gap-3 items-center py-1 px-2'>
            <CgChevronLeft 
              size={16} 
              className={`text-${theme === 'dark' ? 'slate-400 hover:text-slate-300' : 'slate-900 hover:text-slate-800'} cursor-pointer`} 
              onClick={() => navigate("/home")}
            />
          </div>
          <div className="flex items-center gap-3 py-1">
            <img 
              src="https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png" 
              className="rounded-full cursor-pointer" 
              height="16" 
              width="16" 
              alt="SOL" 
            />
            <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-blue-900'} cursor-pointer`}>
              {solBalance !== null ? solBalance.toFixed(2) : "0.00"}
            </span>
            <img 
              src="https://s2.coinmarketcap.com/static/cloud/img/loyalty-program/diamond-icon.svg" 
              className='cursor-pointer target-gem' 
              width="16" 
              height="16" 
            />
            <motion.span 
              key={currentGemCount}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.3 }}
              className={`text-sm font-semibold ${theme === 'dark' ? 'text-red-400' : 'text-red-500'} cursor-pointer`}
            >
              {currentGemCount}
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
            src={userData?.avatar}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              {username}
            </h2>
            <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              @{userData?.nickname || 'User' + userData?.user_id}
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