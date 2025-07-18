import { useState, useEffect, createContext, useContext } from 'react';
import { PortfolioToken } from '../types';

interface PortfolioContextType {
  portfolioTokens: PortfolioToken[];
  addToken: (token: PortfolioToken) => void;
  updateToken: (id: string, updates: Partial<PortfolioToken>) => void;
  removeToken: (id: string) => void;
  clearPortfolio: () => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

const PORTFOLIO_STORAGE_KEY = 'coinalysis_portfolio';

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within PortfolioProvider');
  }
  return context;
};

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [portfolioTokens, setPortfolioTokens] = useState<PortfolioToken[]>(() => {
    const saved = localStorage.getItem(PORTFOLIO_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(portfolioTokens));
  }, [portfolioTokens]);

  const addToken = (token: PortfolioToken) => {
    setPortfolioTokens(prev => {
      const existing = prev.find(t => t.tokenId === token.tokenId);
      if (existing) {
        // Update existing token by adding quantities
        return prev.map(t => 
          t.tokenId === token.tokenId 
            ? { 
                ...t, 
                quantity: t.quantity + token.quantity,
                // Weighted average buy price
                buyPrice: ((t.quantity * t.buyPrice) + (token.quantity * token.buyPrice)) / (t.quantity + token.quantity)
              }
            : t
        );
      }
      return [...prev, { ...token, id: Date.now().toString() }];
    });
  };

  const updateToken = (id: string, updates: Partial<PortfolioToken>) => {
    setPortfolioTokens(prev => 
      prev.map(token => 
        token.id === id ? { ...token, ...updates } : token
      )
    );
  };

  const removeToken = (id: string) => {
    setPortfolioTokens(prev => prev.filter(token => token.id !== id));
  };

  const clearPortfolio = () => {
    setPortfolioTokens([]);
  };

  return (
    <PortfolioContext.Provider value={{
      portfolioTokens,
      addToken,
      updateToken,
      removeToken,
      clearPortfolio,
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};