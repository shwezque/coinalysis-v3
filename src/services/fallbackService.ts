import { Token, MarketStats } from '../types';

// Fallback to alternative API or cached data
export const fallbackService = {
  async getTokensFallback(): Promise<Token[]> {
    try {
      // Try alternative endpoint or method
      const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=24h,7d,30d');
      
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Fallback fetch failed:', error);
    }
    
    // Return empty array to show "no data" state instead of incorrect mock data
    return [];
  },
  
  async getMarketStatsFallback(): Promise<MarketStats | null> {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/global');
      
      if (response.ok) {
        const data = await response.json();
        return {
          total_market_cap: data.data.total_market_cap.usd,
          total_volume: data.data.total_volume.usd,
          market_cap_percentage: data.data.market_cap_percentage,
          market_cap_change_percentage_24h_usd: data.data.market_cap_change_percentage_24h_usd,
        };
      }
    } catch (error) {
      console.error('Market stats fallback failed:', error);
    }
    
    return null;
  }
};