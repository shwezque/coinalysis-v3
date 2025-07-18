import axios from 'axios';

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

// In development, use CoinGecko API directly (may hit CORS issues)
// In production on Vercel, use the proxy
const API_BASE_URL = isDevelopment 
  ? 'https://api.coingecko.com/api/v3'
  : '/api/proxy';

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      console.error('Rate limit exceeded. Please try again later.');
      // Show user-friendly message
      const retryAfter = error.response.data?.retryAfter || '60';
      console.error(`Please wait ${retryAfter} seconds before retrying.`);
    } else if (error.response?.status === 500) {
      console.error('Server error. Using cached data or fallback.');
    }
    return Promise.reject(error);
  }
);