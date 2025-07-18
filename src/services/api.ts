import axios from 'axios';

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

// In development, use CoinGecko API directly (may hit CORS issues)
// In production on Vercel, use the edge proxy for better performance
const API_BASE_URL = isDevelopment 
  ? 'https://api.coingecko.com/api/v3'
  : '/api/proxy-edge';

console.log('API Configuration:', {
  isDevelopment,
  isProduction,
  NODE_ENV: process.env.NODE_ENV,
  API_BASE_URL
});

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for retry logic
api.interceptors.request.use(
  (config) => {
    config.timeout = 25000; // 25 second timeout
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor with retry logic
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 429) {
      console.error('Rate limit exceeded. Please try again later.');
      const retryAfter = error.response.data?.retryAfter || '60';
      console.error(`Please wait ${retryAfter} seconds before retrying.`);
    } else if (error.response?.status === 500 || error.code === 'ECONNABORTED') {
      console.error('Server error or timeout. Using cached data or fallback.');
      
      // Retry logic for server errors
      if (!originalRequest._retry && originalRequest._retryCount < 3) {
        originalRequest._retry = true;
        originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
        
        // Exponential backoff
        const delay = Math.min(1000 * Math.pow(2, originalRequest._retryCount), 10000);
        await new Promise(resolve => setTimeout(resolve, delay));
        
        console.log(`Retrying request (attempt ${originalRequest._retryCount}/3)...`);
        return api(originalRequest);
      }
    }
    
    return Promise.reject(error);
  }
);