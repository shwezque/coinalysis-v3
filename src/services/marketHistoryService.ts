import { api } from './api';
import { cacheService } from './cacheService';
import { MarketStats } from '../types';

const isDevelopment = process.env.NODE_ENV === 'development';

interface MarketHistory {
  prices: number[];
  market_caps: number[];
  total_volumes: number[];
  timestamps: number[];
}

// Helper function to handle different API patterns for dev/prod
const apiGet = async (endpoint: string, params: any) => {
  try {
    if (isDevelopment) {
      return await api.get(endpoint, { params });
    } else {
      return await api.get('', { params: { endpoint, ...params } });
    }
  } catch (error: any) {
    console.error('Market History API Error:', error.message);
    throw error;
  }
};

export const marketHistoryService = {
  async getMarketChart(days: number = 7, forceRefresh: boolean = false): Promise<MarketHistory> {
    const cacheKey = `market_chart_${days}`;
    
    if (!forceRefresh) {
      const cached = cacheService.get<MarketHistory>(cacheKey);
      if (cached) {
        console.log('Using cached market history data');
        return cached;
      }
    }
    
    try {
      // For now, use Bitcoin's history as a proxy for overall market movement
      // CoinGecko doesn't have a direct global market cap chart endpoint
      console.log(`Fetching market chart data for ${days} days`);
      const response = await apiGet('/coins/bitcoin/market_chart', {
        vs_currency: 'usd',
        days,
        interval: days <= 1 ? 'hourly' : 'daily'
      });
      
      // Scale the data to match current market stats
      const currentMarketCap = cacheService.get<MarketStats>('market_stats')?.total_market_cap || 2000000000000;
      const currentVolume = cacheService.get<MarketStats>('market_stats')?.total_volume || 100000000000;
      const btcMarketCapRatio = currentMarketCap / 1000000000000; // Approximate BTC market cap
      const volumeRatio = currentVolume / 50000000000; // Approximate BTC volume
      
      console.log('API Response:', response.data);
      
      const data: MarketHistory = {
        prices: response.data.prices || [],
        market_caps: response.data.market_caps?.map((item: number[]) => 
          [item[0], item[1] * btcMarketCapRatio]
        ) || [],
        total_volumes: response.data.total_volumes?.map((item: number[]) => 
          [item[0], item[1] * volumeRatio]
        ) || [],
        timestamps: response.data.prices?.map((p: number[]) => p[0]) || []
      };
      
      console.log('Processed market history:', {
        pricesLength: data.prices.length,
        marketCapsLength: data.market_caps.length,
        volumesLength: data.total_volumes.length
      });
      
      cacheService.set(cacheKey, data, 5 * 60 * 1000); // Cache for 5 minutes
      return data;
    } catch (error) {
      console.error('Failed to fetch market chart:', error);
      // Return mock data as fallback
      return generateMockHistory(days);
    }
  },

  async getFearGreedHistory(days: number = 7, forceRefresh: boolean = false): Promise<number[]> {
    const cacheKey = `fear_greed_${days}`;
    
    if (!forceRefresh) {
      const cached = cacheService.get<number[]>(cacheKey);
      if (cached) {
        return cached;
      }
    }
    
    // Mock data for fear & greed since it's not available from CoinGecko
    // In production, you'd integrate with an actual Fear & Greed API
    const data = Array(days * 24).fill(0).map(() => 
      Math.floor(Math.random() * 30) + 50 // Values between 50-80
    );
    
    cacheService.set(cacheKey, data, 5 * 60 * 1000);
    return data;
  },

  clearCache(): void {
    cacheService.clearByPattern('market_chart_');
    cacheService.clearByPattern('fear_greed_');
  }
};

// Generate mock historical data when API fails
function generateMockHistory(days: number): MarketHistory {
  const now = Date.now();
  const hourlyData = days * 24;
  const baseMarketCap = 2000000000000; // $2T
  const baseVolume = 100000000000; // $100B
  
  const timestamps: number[] = [];
  const market_caps: number[] = [];
  const total_volumes: number[] = [];
  const prices: number[] = [];
  
  for (let i = 0; i < hourlyData; i++) {
    const timestamp = now - (hourlyData - i) * 60 * 60 * 1000;
    timestamps.push(timestamp);
    
    // Generate realistic fluctuations
    const marketCapVariation = 1 + (Math.sin(i / 24) * 0.02) + (Math.random() - 0.5) * 0.01;
    const volumeVariation = 1 + (Math.cos(i / 12) * 0.1) + (Math.random() - 0.5) * 0.05;
    
    market_caps.push(baseMarketCap * marketCapVariation);
    total_volumes.push(baseVolume * volumeVariation);
    prices.push(0); // Not used for global market data
  }
  
  return {
    prices,
    market_caps,
    total_volumes,
    timestamps
  };
}