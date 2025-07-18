import { Token, MarketStats, Category } from '../types';

// Return empty array to force API retry instead of showing incorrect prices
export const mockTokens: Token[] = [];

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