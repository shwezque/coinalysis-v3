import { PortfolioToken } from '../types';

export const exportToCSV = (
  portfolioTokens: PortfolioToken[],
  currentPrices: { [key: string]: number },
  filename: string = 'portfolio'
) => {
  const headers = ['Token ID', 'Quantity', 'Buy Price', 'Current Price', 'Total Value', 'P&L', 'P&L %'];
  
  const rows = portfolioTokens.map(token => {
    const currentPrice = currentPrices[token.tokenId] || 0;
    const totalValue = token.quantity * currentPrice;
    const totalCost = token.quantity * token.buyPrice;
    const pnl = totalValue - totalCost;
    const pnlPercentage = totalCost > 0 ? (pnl / totalCost) * 100 : 0;
    
    return [
      token.tokenId,
      token.quantity.toString(),
      token.buyPrice.toFixed(6),
      currentPrice.toFixed(6),
      totalValue.toFixed(2),
      pnl.toFixed(2),
      pnlPercentage.toFixed(2) + '%'
    ];
  });
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToJSON = (
  portfolioTokens: PortfolioToken[],
  currentPrices: { [key: string]: number },
  filename: string = 'portfolio'
) => {
  const exportData = {
    exportDate: new Date().toISOString(),
    portfolio: portfolioTokens.map(token => {
      const currentPrice = currentPrices[token.tokenId] || 0;
      const totalValue = token.quantity * currentPrice;
      const totalCost = token.quantity * token.buyPrice;
      const pnl = totalValue - totalCost;
      const pnlPercentage = totalCost > 0 ? (pnl / totalCost) * 100 : 0;
      
      return {
        ...token,
        currentPrice,
        totalValue,
        totalCost,
        pnl,
        pnlPercentage
      };
    }),
    summary: {
      totalValue: portfolioTokens.reduce((sum, token) => {
        const currentPrice = currentPrices[token.tokenId] || 0;
        return sum + (token.quantity * currentPrice);
      }, 0),
      totalCost: portfolioTokens.reduce((sum, token) => {
        return sum + (token.quantity * token.buyPrice);
      }, 0),
      totalPnl: 0,
      totalPnlPercentage: 0
    }
  };
  
  exportData.summary.totalPnl = exportData.summary.totalValue - exportData.summary.totalCost;
  exportData.summary.totalPnlPercentage = exportData.summary.totalCost > 0 
    ? (exportData.summary.totalPnl / exportData.summary.totalCost) * 100 
    : 0;
  
  const jsonContent = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.json`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};