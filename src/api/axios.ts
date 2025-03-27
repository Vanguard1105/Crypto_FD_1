import axios from 'axios';

// Create axios instance with base URL
const instance = axios.create({
  baseURL: 'https://crypto-bet-backend.vercel.app/api/',
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
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default instance;