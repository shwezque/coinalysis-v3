import { api } from './api';
import { Token, MarketStats, Category } from '../types';
import { cacheService } from './cacheService';
import { marketHistoryService } from './marketHistoryService';

const isDevelopment = process.env.NODE_ENV === 'development';

// Helper function to handle different API patterns for dev/prod
const apiGet = async (endpoint: string, params: any) => {
  try {
    if (isDevelopment) {
      return await api.get(endpoint, { params });
    } else {
      return await api.get('', { params: { endpoint, ...params } });
    }
  } catch (error: any) {
    console.error('API Error:', error.message);
    
    // Check if we're in production and should retry
    if (!isDevelopment && error.response?.status !== 429) {
      // Log the error for debugging
      console.error('CoinGecko API Error in production:', {
        endpoint,
        params,
        error: error.message,
        status: error.response?.status
      });
    }
    
    // Throw error to trigger React Query retry logic
    throw error;
  }
};

export const coinGeckoService = {
  async getTokens(page: number = 1, perPage: number = 100, forceRefresh: boolean = false): Promise<Token[]> {
    const cacheKey = `tokens_${page}_${perPage}`;
    
    if (!forceRefresh) {
      const cached = cacheService.get<Token[]>(cacheKey);
      if (cached) {
        return cached;
      }
    }
    
    const response = await apiGet('/coins/markets', {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: perPage,
      page,
      sparkline: true,
      price_change_percentage: '24h,7d,30d',
    });
    
    cacheService.set(cacheKey, response.data);
    return response.data;
  },

  async getMarketStats(forceRefresh: boolean = false): Promise<MarketStats> {
    const cacheKey = 'market_stats';
    
    if (!forceRefresh) {
      const cached = cacheService.get<MarketStats>(cacheKey);
      if (cached) {
        return cached;
      }
    }
    
    const response = await apiGet('/global', {});
    
    const stats = {
      total_market_cap: response.data.data.total_market_cap.usd,
      total_volume: response.data.data.total_volume.usd,
      market_cap_percentage: response.data.data.market_cap_percentage,
      market_cap_change_percentage_24h_usd: response.data.data.market_cap_change_percentage_24h_usd,
    };
    
    cacheService.set(cacheKey, stats);
    return stats;
  },

  async getCategories(forceRefresh: boolean = false): Promise<Category[]> {
    const cacheKey = 'categories';
    
    if (!forceRefresh) {
      const cached = cacheService.get<Category[]>(cacheKey);
      if (cached) {
        return cached;
      }
    }
    
    const response = await apiGet('/coins/categories', {});
    
    cacheService.set(cacheKey, response.data);
    return response.data;
  },

  async searchTokens(query: string): Promise<Token[]> {
    const response = await apiGet('/search', { query });
    
    const coinIds = response.data.coins.slice(0, 10).map((coin: any) => coin.id).join(',');
    
    if (!coinIds) return [];
    
    return this.getTokensByIds(coinIds);
  },

  async getTokensByIds(ids: string, forceRefresh: boolean = false): Promise<Token[]> {
    const cacheKey = `tokens_by_ids_${ids}`;
    
    if (!forceRefresh) {
      const cached = cacheService.get<Token[]>(cacheKey);
      if (cached) {
        return cached;
      }
    }
    
    const response = await apiGet('/coins/markets', {
      vs_currency: 'usd',
      ids,
      order: 'market_cap_desc',
      sparkline: true,
      price_change_percentage: '24h,7d,30d',
    });
    
    cacheService.set(cacheKey, response.data);
    return response.data;
  },
  
  clearCache(): void {
    cacheService.clear();
    marketHistoryService.clearCache();
  },
};