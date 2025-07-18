import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface StarredTokensContextValue {
  starredTokens: Set<string>;
  toggleStar: (tokenId: string) => void;
  isStarred: (tokenId: string) => boolean;
}

const StarredTokensContext = createContext<StarredTokensContextValue | undefined>(undefined);

export const StarredTokensProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [starredTokens, setStarredTokens] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('starredTokens');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  useEffect(() => {
    localStorage.setItem('starredTokens', JSON.stringify(Array.from(starredTokens)));
  }, [starredTokens]);

  const toggleStar = (tokenId: string) => {
    setStarredTokens((prev: Set<string>) => {
      const newSet = new Set(prev);
      if (newSet.has(tokenId)) {
        newSet.delete(tokenId);
      } else {
        newSet.add(tokenId);
      }
      return newSet;
    });
  };

  const isStarred = (tokenId: string) => {
    return starredTokens.has(tokenId);
  };

  return (
    <StarredTokensContext.Provider value={{ starredTokens, toggleStar, isStarred }}>
      {children}
    </StarredTokensContext.Provider>
  );
};

export const useStarredTokens = () => {
  const context = useContext(StarredTokensContext);
  if (!context) {
    throw new Error('useStarredTokens must be used within a StarredTokensProvider');
  }
  return context;
};