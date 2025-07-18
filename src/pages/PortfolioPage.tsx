import React from 'react';
import { usePortfolio } from '../hooks/usePortfolio';
import { useTokenData } from '../hooks/useTokenData';
import PortfolioChart from '../components/portfolio/PortfolioChart';
import PortfolioTable from '../components/portfolio/PortfolioTable';
import { calculatePortfolioValue, calculatePortfolioCost, generatePortfolioHistory } from '../utils/calculations';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import { TrendingUp, DollarSign, Percent, PieChart } from 'lucide-react';

const PortfolioPage: React.FC = () => {
  const { portfolioTokens } = usePortfolio();
  const { data: marketTokens } = useTokenData(1, 100);

  const totalValue = marketTokens ? calculatePortfolioValue(portfolioTokens, marketTokens) : 0;
  const totalCost = calculatePortfolioCost(portfolioTokens);
  const profitLoss = totalValue - totalCost;
  const profitLossPercentage = totalCost > 0 ? (profitLoss / totalCost) * 100 : 0;
  
  const portfolioHistory = marketTokens && portfolioTokens.length > 0
    ? generatePortfolioHistory(portfolioTokens, marketTokens, 7)
    : [];

  const stats = [
    {
      label: 'Total Value',
      value: formatCurrency(totalValue),
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      label: 'Total Cost',
      value: formatCurrency(totalCost),
      icon: PieChart,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
    },
    {
      label: 'Total P&L',
      value: `${profitLoss >= 0 ? '+' : ''}${formatCurrency(Math.abs(profitLoss))}`,
      icon: TrendingUp,
      color: profitLoss >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: profitLoss >= 0 ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900',
    },
    {
      label: 'P&L %',
      value: `${profitLossPercentage >= 0 ? '+' : ''}${formatPercentage(profitLossPercentage)}`,
      icon: Percent,
      color: profitLossPercentage >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: profitLossPercentage >= 0 ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          My Portfolio
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your cryptocurrency investments and performance
        </p>
      </div>

      {portfolioTokens.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                    <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {portfolioHistory.length > 0 && (
            <div className="mb-6">
              <PortfolioChart
                data={portfolioHistory}
                currentValue={totalValue}
                totalCost={totalCost}
              />
            </div>
          )}
        </>
      )}

      <PortfolioTable />
    </div>
  );
};

export default PortfolioPage;