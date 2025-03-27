import React, { useEffect, useState } from 'react';  
import { useNavigate } from 'react-router-dom';  
import { Sun, Moon } from 'lucide-react';  
import { useTheme } from '../context/ThemeContext';  
import { useAuth } from '../context/AuthContext';  
import { useTelegram } from '../components/useTelegram';  

const Welcome = () => {  
  const navigate = useNavigate();  
  const { theme, toggleTheme } = useTheme();  
  const { isAuthenticated } = useAuth();  
  const { user } = useTelegram();  
  const [loading, setLoading] = useState(false);  

  useEffect(() => {  
    if (isAuthenticated) {  
      navigate('/home');  
    }  
  }, [isAuthenticated, navigate]);  

  const handleStartBetting = async () => {  
    try {  
      setLoading(true);  
      navigate('/set-password');  
    } catch (error) {  
      console.error('Error fetching user data:', error);  
    } finally {  
      setLoading(false);  
    }  
  };  

  return (  
    <div className={`flex flex-col items-center justify-between min-h-screen p-5 ${  
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
      <div className="flex flex-col items-center gap-8 max-w-sm w-full py-5 flex-grow px-[14px]">  
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
        <div className="text-center pt-6 h-[46px]">  
          <h1 className={`text-[40px] font-bold mb-2 ${  
            theme === 'dark' ? 'text-white' : 'text-slate-900'  
          }`}>  
            CryptoBet  
          </h1>  
          <p className={`text-sm py-5 ${  
            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'  
          }`}>  
            Predict cryptocurrency prices and place bets.  
          </p>  
        </div>  
      </div>  

      {/* CTA Button Container */}  
      <div className = "mb-[89px] w-full  px-[14px]">  
        <button  
          onClick={handleStartBetting}  
          className="w-full h-[48px] bg-blue-500 text-white py-2 rounded-lg font-medium text-lg items-center  
            hover:bg-blue-600 active:bg-blue-700 transition-colors duration-200"  
        >  
          Play  
        </button>  
      </div>  
    </div>  
  );  
};  

export default Welcome;  