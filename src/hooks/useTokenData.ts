import { useQuery } from '@tanstack/react-query';
import { coinGeckoService } from '../services/coinGeckoService';
import { Token, MarketStats, Category } from '../types';

export const useTokenData = (page: number = 1, perPage: number = 100) => {
  return useQuery({
    queryKey: ['tokens', page, perPage],
    queryFn: () => coinGeckoService.getTokens(page, perPage),
    staleTime: Infinity, // Never consider data stale
    gcTime: Infinity, // Keep in cache forever
    refetchInterval: false, // Disable auto-refresh
    refetchOnWindowFocus: false, // Disable refetch on window focus
    refetchOnMount: false, // Don't refetch on mount if data exists
  });
};

export const useMarketStats = () => {
  return useQuery({
    queryKey: ['marketStats'],
    queryFn: () => coinGeckoService.getMarketStats(),
    staleTime: Infinity,
    gcTime: Infinity,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useSearchTokens = (query: string) => {
  return useQuery({
    queryKey: ['searchTokens', query],
    queryFn: () => coinGeckoService.searchTokens(query),
    enabled: query.length > 0,
    staleTime: Infinity,
    gcTime: 300000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => coinGeckoService.getCategories(),
    staleTime: Infinity,
    gcTime: Infinity,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useAllTokens = () => {
  return useQuery({
    queryKey: ['allTokens'],
    queryFn: () => coinGeckoService.getTokens(1, 250),
    staleTime: Infinity,
    gcTime: Infinity,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};