import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AIInsight } from '../types';

interface AIInsightsCache {
  [tokenId: string]: {
    insight: AIInsight;
    timestamp: number;
  };
}

interface AIInsightsContextValue {
  cache: AIInsightsCache;
  getInsight: (tokenId: string) => AIInsight | null;
  setInsight: (tokenId: string, insight: AIInsight) => void;
  isStale: (tokenId: string) => boolean;
}

const AIInsightsContext = createContext<AIInsightsContextValue | undefined>(undefined);

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export const AIInsightsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cache, setCache] = useState<AIInsightsCache>({});

  const getInsight = (tokenId: string): AIInsight | null => {
    const cached = cache[tokenId];
    if (!cached) return null;
    
    // Check if the cache is stale
    if (Date.now() - cached.timestamp > CACHE_DURATION) {
      // Remove stale entry
      setCache((prev: AIInsightsCache) => {
        const newCache = { ...prev };
        delete newCache[tokenId];
        return newCache;
      });
      return null;
    }
    
    return cached.insight;
  };

  const setInsight = (tokenId: string, insight: AIInsight) => {
    setCache((prev: AIInsightsCache) => ({
      ...prev,
      [tokenId]: {
        insight,
        timestamp: Date.now(),
      },
    }));
  };

  const isStale = (tokenId: string): boolean => {
    const cached = cache[tokenId];
    if (!cached) return true;
    return Date.now() - cached.timestamp > CACHE_DURATION;
  };

  return (
    <AIInsightsContext.Provider value={{ cache, getInsight, setInsight, isStale }}>
      {children}
    </AIInsightsContext.Provider>
  );
};

export const useAIInsights = () => {
  const context = useContext(AIInsightsContext);
  if (!context) {
    throw new Error('useAIInsights must be used within an AIInsightsProvider');
  }
  return context;
};