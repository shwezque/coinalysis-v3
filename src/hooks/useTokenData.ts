import { useQuery } from '@tanstack/react-query';
import { coinGeckoService } from '../services/coinGeckoService';
import { Token, MarketStats, Category } from '../types';
import { useAutoUpdate } from './useAutoUpdate';

export const useTokenData = (page: number = 1, perPage: number = 100) => {
  const { isAutoUpdateEnabled, updateInterval } = useAutoUpdate();
  
  return useQuery<Token[], Error>({
    queryKey: ['tokens', page, perPage],
    queryFn: () => coinGeckoService.getTokens(page, perPage),
    staleTime: 30000, // 30 seconds
    refetchInterval: isAutoUpdateEnabled ? updateInterval * 1000 : false,
  });
};

export const useMarketStats = () => {
  const { isAutoUpdateEnabled, updateInterval } = useAutoUpdate();
  
  return useQuery<MarketStats, Error>({
    queryKey: ['marketStats'],
    queryFn: coinGeckoService.getMarketStats,
    staleTime: 60000, // 1 minute
    refetchInterval: isAutoUpdateEnabled ? updateInterval * 1000 : false,
  });
};

export const useSearchTokens = (query: string) => {
  return useQuery<Token[], Error>({
    queryKey: ['searchTokens', query],
    queryFn: () => coinGeckoService.searchTokens(query),
    enabled: query.length > 0,
    staleTime: 30000,
  });
};

export const useCategories = () => {
  return useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: coinGeckoService.getCategories,
    staleTime: 300000, // 5 minutes
    refetchInterval: 300000, // Auto-refresh every 5 minutes
  });
};