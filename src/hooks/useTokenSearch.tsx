import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { coinGeckoService } from '../services/coinGeckoService';
import { Token } from '../types';

export const useTokenSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const { data: searchResults, isLoading } = useQuery<Token[]>({
    queryKey: ['tokenSearch', searchQuery],
    queryFn: async () => {
      if (!searchQuery || searchQuery.length < 2) return [];
      const results = await coinGeckoService.searchTokens(searchQuery);
      return results;
    },
    enabled: searchQuery.length >= 2 && isSearching,
    staleTime: 30 * 1000, // 30 seconds
  });

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setIsSearching(query.length >= 2);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setIsSearching(false);
  }, []);

  return {
    searchQuery,
    searchResults: searchResults || [],
    isLoading,
    isSearching,
    handleSearch,
    clearSearch,
  };
};