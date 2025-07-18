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
      <td className="px-4 py-4">
        <div className="flex items-center space-x-3">
          <img
            src={marketToken.image}
            alt={marketToken.name}
            className="w-8 h-8 rounded-full"
          />
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{marketToken.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 uppercase">{marketToken.symbol}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 text-right text-gray-900 dark:text-white">
        {portfolioToken.quantity.toFixed(4)}
      </td>
      <td className="px-4 py-4 text-right">
        <p className="text-gray-900 dark:text-white">{formatPrice(marketToken.current_price)}</p>
        <p className={`text-sm ${getPriceChangeColor(priceChange)}`}>
          {priceChange > 0 ? '+' : ''}{formatPercentage(priceChange)}
        </p>
      </td>
      <td className="px-4 py-4 text-right text-gray-600 dark:text-gray-400">
        {formatPrice(portfolioToken.buyPrice)}
      </td>
      <td className="px-4 py-4">
        <MiniChart 
          data={marketToken.sparkline_in_7d.price.slice(-24)} 
          color={priceChange >= 0 ? '#10b981' : '#ef4444'} 
        />
      </td>
      <td className="px-4 py-4 text-right text-gray-900 dark:text-white">
        {formatCurrency(totalCost)}
      </td>
      <td className="px-4 py-4 text-right text-gray-900 dark:text-white">
        {formatCurrency(currentValue)}
      </td>
      <td className="px-4 py-4 text-right">
        <p className={`font-medium ${getPriceChangeColor(profitLoss)}`}>
          {profitLoss >= 0 ? '+' : ''}{formatCurrency(Math.abs(profitLoss))}
        </p>
        <p className={`text-sm ${getPriceChangeColor(profitLoss)}`}>
          ({profitLoss >= 0 ? '+' : ''}{formatPercentage(profitLossPercentage)})
        </p>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={() => onEdit(portfolioToken)}
            className="p-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onRemove(portfolioToken.id)}
            className="p-1.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
            aria-label="Remove"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default PortfolioRow;