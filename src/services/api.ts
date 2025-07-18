import axios from 'axios';

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

// In development, use CoinGecko API directly (may hit CORS issues)
// In production on Vercel, use the proxy
const API_BASE_URL = isDevelopment 
  ? 'https://api.coingecko.com/api/v3'
  : '/api/proxy';

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
    }
    return Promise.reject(error);
  }
);