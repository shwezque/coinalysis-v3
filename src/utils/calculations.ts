import { PortfolioToken, Token } from '../types';

export const calculatePortfolioValue = (
  portfolioTokens: PortfolioToken[],
  marketTokens: Token[]
): number => {
  return portfolioTokens.reduce((total, portfolioToken) => {
    const marketToken = marketTokens.find(t => t.id === portfolioToken.tokenId);
    if (!marketToken) return total;
    return total + (portfolioToken.quantity * marketToken.current_price);
  }, 0);
};

export const calculatePortfolioCost = (portfolioTokens: PortfolioToken[]): number => {
  return portfolioTokens.reduce((total, token) => {
    return total + (token.quantity * token.buyPrice);
  }, 0);
};

export const calculateTokenValue = (portfolioToken: PortfolioToken, currentPrice: number): number => {
  return portfolioToken.quantity * currentPrice;
};

export const calculateTokenCost = (portfolioToken: PortfolioToken): number => {
  return portfolioToken.quantity * portfolioToken.buyPrice;
};

export const calculateProfitLoss = (currentValue: number, cost: number): number => {
  return currentValue - cost;
};

export const calculateProfitLossPercentage = (currentValue: number, cost: number): number => {
  if (cost === 0) return 0;
  return ((currentValue - cost) / cost) * 100;
};

export const calculatePortfolioAllocation = (
  tokenValue: number,
  totalPortfolioValue: number
): number => {
  if (totalPortfolioValue === 0) return 0;
  return (tokenValue / totalPortfolioValue) * 100;
};

export const generatePortfolioHistory = (
  portfolioTokens: PortfolioToken[],
  marketTokens: Token[],
  days: number = 7
): number[] => {
  // Generate mock historical data based on current values and sparkline data
  const currentValue = calculatePortfolioValue(portfolioTokens, marketTokens);
  const points = 24 * days; // Hourly data points
  
  // Create a weighted average of token sparklines
  const history: number[] = [];
  
  for (let i = 0; i < points; i++) {
    let totalValue = 0;
    
    portfolioTokens.forEach(portfolioToken => {
      const marketToken = marketTokens.find(t => t.id === portfolioToken.tokenId);
      if (!marketToken || !marketToken.sparkline_in_7d?.price) return;
      
      const sparklineIndex = Math.floor((i / points) * marketToken.sparkline_in_7d.price.length);
      const sparklineValue = marketToken.sparkline_in_7d.price[sparklineIndex];
      const currentPrice = marketToken.current_price;
      const priceRatio = sparklineValue / marketToken.sparkline_in_7d.price[marketToken.sparkline_in_7d.price.length - 1];
      
      totalValue += portfolioToken.quantity * currentPrice * priceRatio;
    });
    
    history.push(totalValue || currentValue);
  }
  
  return history;
};