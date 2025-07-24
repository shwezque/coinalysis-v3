import React from 'react';
import { PortfolioToken, Token } from '../../types';
import { formatPrice, formatCurrency, formatPercentage, getPriceChangeColor } from '../../utils/formatters';
import { calculateTokenValue, calculateTokenCost, calculateProfitLoss, calculateProfitLossPercentage } from '../../utils/calculations';
import MiniChart from '../tokens/MiniChart';
import { Trash2, Edit2 } from 'lucide-react';

interface PortfolioRowProps {
  portfolioToken: PortfolioToken;
  marketToken: Token | undefined;
  onEdit: (token: PortfolioToken) => void;
  onRemove: (id: string) => void;
}

const PortfolioRow: React.FC<PortfolioRowProps> = ({ portfolioToken, marketToken, onEdit, onRemove }) => {
  if (!marketToken) {
    return (
      <tr className="border-b border-gray-200 dark:border-gray-700">
        <td colSpan={9} className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
          Token data not available
        </td>
      </tr>
    );
  }

  const currentValue = calculateTokenValue(portfolioToken, marketToken.current_price);
  const totalCost = calculateTokenCost(portfolioToken);
  const profitLoss = calculateProfitLoss(currentValue, totalCost);
  const profitLossPercentage = calculateProfitLossPercentage(currentValue, totalCost);
  const priceChange = marketToken.price_change_percentage_24h || 0;

  return (
    <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      <td className="px-2 sm:px-4 py-2 sm:py-4">
        <div className="flex items-center space-x-2">
          <img
            src={marketToken.image}
            alt={marketToken.name}
            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
          />
          <div className="min-w-0">
            <p className="font-medium text-gray-900 dark:text-white text-xs sm:text-base truncate">{marketToken.symbol.toUpperCase()}</p>
            <p className="hidden sm:block text-xs text-gray-500 dark:text-gray-400">{marketToken.name}</p>
          </div>
        </div>
      </td>
      <td className="px-2 sm:px-4 py-2 sm:py-4 text-right text-gray-900 dark:text-white text-xs sm:text-base">
        {portfolioToken.quantity.toFixed(4)}
      </td>
      <td className="hidden sm:table-cell px-4 py-4 text-right">
        <p className="text-gray-900 dark:text-white">{formatPrice(marketToken.current_price)}</p>
        <p className={`text-sm ${getPriceChangeColor(priceChange)}`}>
          {priceChange > 0 ? '+' : ''}{formatPercentage(priceChange)}
        </p>
      </td>
      <td className="hidden md:table-cell px-4 py-4 text-right text-gray-600 dark:text-gray-400">
        {formatPrice(portfolioToken.buyPrice)}
      </td>
      <td className="hidden lg:table-cell px-4 py-4">
        <MiniChart 
          data={marketToken.sparkline_in_7d.price.slice(-24)} 
          color={priceChange >= 0 ? '#10b981' : '#ef4444'} 
        />
      </td>
      <td className="hidden md:table-cell px-4 py-4 text-right text-gray-900 dark:text-white">
        {formatCurrency(totalCost)}
      </td>
      <td className="px-2 sm:px-4 py-2 sm:py-4 text-right text-gray-900 dark:text-white text-xs sm:text-base">
        {formatCurrency(currentValue)}
      </td>
      <td className="px-2 sm:px-4 py-2 sm:py-4 text-right">
        <p className={`font-medium text-xs sm:text-base ${getPriceChangeColor(profitLoss)}`}>
          {profitLoss >= 0 ? '+' : ''}{formatCurrency(Math.abs(profitLoss))}
        </p>
        <p className={`text-xs ${getPriceChangeColor(profitLoss)}`}>
          ({profitLoss >= 0 ? '+' : ''}{formatPercentage(profitLossPercentage)})
        </p>
      </td>
      <td className="px-2 sm:px-4 py-2 sm:py-4">
        <div className="flex items-center justify-end space-x-1">
          <button
            onClick={() => onEdit(portfolioToken)}
            className="p-1 sm:p-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Edit"
          >
            <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={() => onRemove(portfolioToken.id)}
            className="p-1 sm:p-1.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
            aria-label="Remove"
          >
            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default PortfolioRow;