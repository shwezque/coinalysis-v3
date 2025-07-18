import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, TrendingUp, TrendingDown } from 'lucide-react';
import { Token } from '../../types';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { usePortfolio } from '../../hooks/usePortfolio';

interface SearchResultsProps {
  results: Token[];
  isLoading: boolean;
  onClose: () => void;
  onTokenSelect?: (token: Token) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ 
  results, 
  isLoading, 
  onClose,
  onTokenSelect 
}) => {
  const navigate = useNavigate();
  const { addToken } = usePortfolio();

  const handleTokenClick = (token: Token) => {
    if (onTokenSelect) {
      onTokenSelect(token);
    }
    onClose();
  };

  const handleAddToPortfolio = (e: React.MouseEvent, token: Token) => {
    e.stopPropagation();
    addToken({
      id: '',
      tokenId: token.id,
      quantity: 0,
      buyPrice: token.current_price,
      addedAt: new Date().toISOString(),
    });
    navigate('/portfolio');
    onClose();
  };

  if (!results.length && !isLoading) {
    return null;
  }

  return (
    <div className="absolute top-full mt-2 w-full max-w-lg bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Search Results
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Searching...</p>
          </div>
        ) : results.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">No results found</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {results.slice(0, 10).map((token) => (
              <li
                key={token.id}
                className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                onClick={() => handleTokenClick(token)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={token.image}
                      alt={token.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {token.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                        {token.symbol}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(token.current_price)}
                      </p>
                      <p className={`text-xs flex items-center justify-end ${
                        token.price_change_percentage_24h && token.price_change_percentage_24h > 0
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {token.price_change_percentage_24h && token.price_change_percentage_24h > 0 ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        {formatPercentage(Math.abs(token.price_change_percentage_24h || 0))}
                      </p>
                    </div>

                    <button
                      onClick={(e) => handleAddToPortfolio(e, token)}
                      className="px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                    >
                      Add to Portfolio
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {results.length > 10 && (
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Showing top 10 results
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;