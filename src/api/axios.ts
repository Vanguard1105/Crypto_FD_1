import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// Create axios instance with base URL
const instance = axios.create({
  baseURL: 'https://crypto-bet-backend-fawn.vercel.app/api',
  timeout: 600000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle errors
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle specific status codes
      if (error.response.status === 401) {
        // Unauthorized - token expired or invalid
        const { logout } = useAuth();
        
        // Clear local storage
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        
        // Clear auth state
        logout();
        
        // Redirect to login page with expired flag
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default instance;