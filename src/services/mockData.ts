import { Token, MarketStats, Category } from '../types';

export const mockTokens: Token[] = [
  {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    current_price: 45000,
    market_cap: 880000000000,
    market_cap_rank: 1,
    fully_diluted_valuation: 945000000000,
    total_volume: 25000000000,
    high_24h: 46000,
    low_24h: 44000,
    price_change_24h: 500,
    price_change_percentage_24h: 1.12,
    price_change_percentage_7d_in_currency: 5.5,
    price_change_percentage_30d_in_currency: 15.2,
    market_cap_change_24h: 10000000000,
    market_cap_change_percentage_24h: 1.15,
    circulating_supply: 19500000,
    total_supply: 21000000,
    max_supply: 21000000,
    sparkline_in_7d: {
      price: Array(168).fill(0).map(() => 44000 + Math.random() * 2000)
    }
  },
  {
    id: 'ethereum',
    symbol: 'eth',
    name: 'Ethereum',
    image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    current_price: 2500,
    market_cap: 300000000000,
    market_cap_rank: 2,
    fully_diluted_valuation: 300000000000,
    total_volume: 15000000000,
    high_24h: 2600,
    low_24h: 2400,
    price_change_24h: 50,
    price_change_percentage_24h: 2.04,
    price_change_percentage_7d_in_currency: 8.3,
    price_change_percentage_30d_in_currency: 12.5,
    market_cap_change_24h: 6000000000,
    market_cap_change_percentage_24h: 2.04,
    circulating_supply: 120000000,
    total_supply: 120000000,
    max_supply: null,
    sparkline_in_7d: {
      price: Array(168).fill(0).map(() => 2400 + Math.random() * 200)
    }
  },
  // Add more mock tokens as needed
];

export const mockMarketStats: MarketStats = {
  total_market_cap: 1800000000000,
  total_volume: 85000000000,
  market_cap_percentage: {
    btc: 48.5,
    eth: 16.7
  },
  market_cap_change_percentage_24h_usd: 1.85
};

export const mockCategories: Category[] = [
  {
    id: 'decentralized-finance-defi',
    name: 'Decentralized Finance (DeFi)',
    market_cap: 45000000000,
    market_cap_change_24h: 3.45,
    content: 'DeFi protocols and platforms',
    top_3_coins: ['chainlink', 'uniswap', 'aave'],
    volume_24h: 8900000000,
    updated_at: new Date().toISOString()
  },
  {
    id: 'artificial-intelligence',
    name: 'Artificial Intelligence',
    market_cap: 23000000000,
    market_cap_change_24h: 8.92,
    content: 'AI and machine learning tokens',
    top_3_coins: ['fetch-ai', 'singularitynet', 'ocean-protocol'],
    volume_24h: 4500000000,
    updated_at: new Date().toISOString()
  },
  {
    id: 'decentralized-physical-infrastructure',
    name: 'DePIN (Decentralized Physical Infrastructure)',
    market_cap: 25000000000,
    market_cap_change_24h: 5.2,
    content: 'Decentralized Physical Infrastructure Networks (DePIN) protocols',
    top_3_coins: ['filecoin', 'arweave', 'helium'],
    volume_24h: 1500000000,
    updated_at: new Date().toISOString()
  }
];