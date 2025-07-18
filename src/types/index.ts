export interface Token {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency: number;
  price_change_percentage_30d_in_currency: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  sparkline_in_7d: {
    price: number[];
  };
}

export interface Category {
  id: string;
  name: string;
  market_cap: number;
  market_cap_change_24h: number;
  content: string;
  top_3_coins: string[];
  volume_24h: number;
  updated_at: string;
}

export interface PortfolioToken {
  id: string;
  tokenId: string;
  quantity: number;
  buyPrice: number;
  addedAt: string;
}

export interface MarketStats {
  total_market_cap: number;
  total_volume: number;
  market_cap_percentage: {
    btc: number;
    eth: number;
  };
  market_cap_change_percentage_24h_usd: number;
}

export interface AIInsight {
  tokenId: string;
  summary: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  predictions: {
    nearTerm: {
      price: number;
      confidence: number;
      timeframe: string;
    };
    mediumTerm: {
      price: number;
      confidence: number;
      timeframe: string;
    };
  };
  factors: string[];
  lastUpdated: string;
}