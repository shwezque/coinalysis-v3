import { api } from './api';
import { Token, MarketStats, Category } from '../types';
import { cacheService } from './cacheService';
import { marketHistoryService } from './marketHistoryService';
import { fallbackDataService } from './fallbackDataService';

const isDevelopment = process.env.NODE_ENV === 'development';

// Helper function to handle different API patterns for dev/prod
const apiGet = async (endpoint: string, params: any) => {
  try {
    if (isDevelopment) {
      // In development, call CoinGecko directly
      return await api.get(endpoint, { params });
    } else {
      // In production, use the proxy - the proxy expects endpoint as a query param
      const proxyParams = {
        endpoint: endpoint.startsWith('/') ? endpoint : `/${endpoint}`,
        ...params
      };
      
      console.log('Making production API call:', {
        baseURL: api.defaults.baseURL,
        proxyParams
      });
      
      // Call the proxy endpoint directly
      const response = await api.get('', { params: proxyParams });
      
      // Check if we got valid data
      if (!response.data) {
        throw new Error('No data received from API');
      }
      
      return response;
    }
  } catch (error: any) {
    console.error('API Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      endpoint,
      isDevelopment
    });
    
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
    
    try {
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
    } catch (error) {
      console.error('Failed to fetch tokens, using fallback data:', error);
      
      // Check cache one more time
      const cached = cacheService.get<Token[]>(cacheKey);
      if (cached) {
        console.log('Using stale cached data');
        return cached;
      }
      
      // Use fallback data
      console.log('Using fallback mock data');
      const fallbackData = fallbackDataService.getTokens();
      cacheService.set(cacheKey, fallbackData, 60000); // Cache for 1 minute
      return fallbackData;
    }
  },

  async getMarketStats(forceRefresh: boolean = false): Promise<MarketStats> {
    const cacheKey = 'market_stats';
    
    if (!forceRefresh) {
      const cached = cacheService.get<MarketStats>(cacheKey);
      if (cached) {
        return cached;
      }
    }
    
    try {
      const response = await apiGet('/global', {});
      
      const stats = {
        total_market_cap: response.data.data.total_market_cap.usd,
        total_volume: response.data.data.total_volume.usd,
        market_cap_percentage: response.data.data.market_cap_percentage,
        market_cap_change_percentage_24h_usd: response.data.data.market_cap_change_percentage_24h_usd,
      };
      
      cacheService.set(cacheKey, stats);
      return stats;
    } catch (error) {
      console.error('Failed to fetch market stats, using fallback data:', error);
      
      // Check cache one more time
      const cached = cacheService.get<MarketStats>(cacheKey);
      if (cached) {
        console.log('Using stale cached market stats');
        return cached;
      }
      
      // Use fallback data
      console.log('Using fallback market stats');
      const fallbackStats = fallbackDataService.getMarketStats();
      cacheService.set(cacheKey, fallbackStats, 60000); // Cache for 1 minute
      return fallbackStats;
    }
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