import React, { useState } from 'react';
import { Token } from '../../types';
import { formatPrice, formatCurrency, formatPercentage, getPriceChangeColor, getPriceChangeIcon } from '../../utils/formatters';
import MiniChart from './MiniChart';
import StarButton from '../common/StarButton';

interface TokenRowProps {
  token: Token;
  index: number;
  isStarred?: boolean;
  onStar?: (tokenId: string) => void;
  onAIClick?: (token: Token) => void;
}

const TokenRow: React.FC<TokenRowProps> = ({ token, index, isStarred = false, onStar, onAIClick }) => {
  const [priceChangeMode, setPriceChangeMode] = useState<'24h' | '7d' | '30d'>('24h');

  const getPriceChange = () => {
    switch (priceChangeMode) {
      case '7d':
        return token.price_change_percentage_7d_in_currency || 0;
      case '30d':
        return token.price_change_percentage_30d_in_currency || 0;
      default:
        return token.price_change_percentage_24h || 0;
    }
  };

  const priceChange = getPriceChange();
  const chartColor = priceChange >= 0 ? '#10b981' : '#ef4444';

  return (
    <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      <td className="px-1 sm:px-4 py-2 sm:py-4 text-center">
        <StarButton tokenId={token.id} isStarred={isStarred} onToggle={onStar} />
      </td>
      <td className="px-1 sm:px-4 py-2 sm:py-4 text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
        {index + 1}
      </td>
      <td className="px-1 sm:px-4 py-2 sm:py-4">
        <div className="flex items-center space-x-1 sm:space-x-3">
          <img
            src={token.image}
            alt={token.name}
            className="w-5 h-5 sm:w-8 sm:h-8 rounded-full"
          />
          <div className="min-w-0">
            <p className="font-medium text-gray-900 dark:text-white text-xs sm:text-base truncate">{token.symbol.toUpperCase()}</p>
            <p className="hidden sm:block text-xs text-gray-500 dark:text-gray-400">{token.name}</p>
          </div>
        </div>
      </td>
      <td className="px-1 sm:px-4 py-2 sm:py-4 text-right">
        <p className="font-medium text-gray-900 dark:text-white text-xs sm:text-base">{formatPrice(token.current_price)}</p>
        <p className={`text-xs sm:hidden ${getPriceChangeColor(priceChange)}`}>
          {priceChange >= 0 ? '+' : ''}{formatPercentage(priceChange)}
        </p>
      </td>
      <td className="hidden sm:table-cell px-4 py-4 text-right">
        <button
          onClick={() => setPriceChangeMode(prev => 
            prev === '24h' ? '7d' : prev === '7d' ? '30d' : '24h'
          )}
          className={`text-sm font-medium ${getPriceChangeColor(priceChange)}`}
        >
          <span className="mr-1">{getPriceChangeIcon(priceChange)}</span>
          {formatPercentage(Math.abs(priceChange))}
          <span className="text-xs ml-1 text-gray-500">({priceChangeMode})</span>
        </button>
      </td>
      <td className="px-1 sm:px-4 py-2 sm:py-4 text-right text-gray-900 dark:text-white">
        <p className="text-xs sm:text-base">${(token.market_cap / 1000000000).toFixed(1)}B</p>
      </td>
      <td className="hidden lg:table-cell px-4 py-4 text-right text-gray-900 dark:text-white">
        {formatCurrency(token.total_volume)}
      </td>
      <td className="hidden md:table-cell px-4 py-4">
        <MiniChart data={token.sparkline_in_7d.price.slice(-24)} color={chartColor} />
      </td>
      <td className="px-1 sm:px-4 py-2 sm:py-4 text-center">
        <button
          onClick={() => onAIClick && onAIClick(token)}
          className="px-1.5 py-0.5 sm:px-3 sm:py-1.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors font-semibold text-xs"
          aria-label="AI Insights"
        >
          AI
        </button>
      </td>
    </tr>
  );
};

export default TokenRow;