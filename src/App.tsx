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
import { PriceProvider } from './context/PriceContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PriceProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/login" element={<Login />} />
              <Route path="/set-password" element={<SetPassword />} />
              <Route path="/home" element={<Home />} />
              <Route path="/track" element={<Track />} />
              <Route path="/lottery" element={<Lottery />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </BrowserRouter>
        </PriceProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;