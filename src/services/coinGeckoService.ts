import { api } from './api';
import { Token, MarketStats, Category } from '../types';

export const coinGeckoService = {
  async getTokens(page: number = 1, perPage: number = 100): Promise<Token[]> {
    const response = await api.get('/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: perPage,
        page,
        sparkline: true,
        price_change_percentage: '24h,7d,30d',
      },
    });
    return response.data;
  },

  async getMarketStats(): Promise<MarketStats> {
    const response = await api.get('/global');
    return {
      total_market_cap: response.data.data.total_market_cap.usd,
      total_volume: response.data.data.total_volume.usd,
      market_cap_percentage: response.data.data.market_cap_percentage,
      market_cap_change_percentage_24h_usd: response.data.data.market_cap_change_percentage_24h_usd,
    };
  },

  async getCategories(): Promise<Category[]> {
    const response = await api.get('/coins/categories');
    return response.data;
  },

  async searchTokens(query: string): Promise<Token[]> {
    const response = await api.get('/search', {
      params: { query },
    });
    
    const coinIds = response.data.coins.slice(0, 10).map((coin: any) => coin.id).join(',');
    
    if (!coinIds) return [];
    
    return this.getTokensByIds(coinIds);
  },

  async getTokensByIds(ids: string): Promise<Token[]> {
    const response = await api.get('/coins/markets', {
      params: {
        vs_currency: 'usd',
        ids,
        order: 'market_cap_desc',
        sparkline: true,
        price_change_percentage: '24h,7d,30d',
      },
    });
    return response.data;
  },
};