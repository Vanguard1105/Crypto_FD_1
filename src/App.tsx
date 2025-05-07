import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import SetPassword from './pages/SetPassword';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Track from './pages/Track';
import Lottery from './pages/Lottery';
import BuyTicket from './pages/BuyTicket';
import { PriceProvider } from './context/PriceContext';
import { EthereumPriceProvider } from './context/EthereumPriceContext';
import { BitcoinPriceProvider } from './context/BitcoinPriceContext';
import { PredictionProvider } from './context/PredictionContext';
import { GlobalPredictionProvider } from './context/GlobalPredictionContext';
import { PredictionService } from './services/PredictionService';
import { WebSocketProvider } from './context/WebSocketContext';
import { TimeSyncProvider } from './context/TimeSyncContext';
import { LotteryProvider } from './context/LotteryContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PriceProvider>
          <EthereumPriceProvider>
            <BitcoinPriceProvider>
              <PredictionProvider>
                <LotteryProvider>
                <GlobalPredictionProvider>
                  <TimeSyncProvider>
                    <WebSocketProvider>
                      <PredictionService />
                      <BrowserRouter>
                        <Routes>
                          <Route path="/" element={<Welcome />} />
                          <Route path="/login" element={<Login />} />
                          <Route path="/set-password" element={<SetPassword />} />
                          <Route path="/home" element={<Home />} />
                          <Route path="/track" element={<Track />} />
                          <Route path="/lottery" element={<Lottery />} />
                          <Route path="/buy-ticket" element={<BuyTicket />} />
                          <Route path="/profile" element={<Profile />} />
                        </Routes>
                      </BrowserRouter>
                    </WebSocketProvider>
                  </TimeSyncProvider>
                </GlobalPredictionProvider>
                </LotteryProvider>
              </PredictionProvider>
              
            </BitcoinPriceProvider>
          </EthereumPriceProvider>
        </PriceProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;