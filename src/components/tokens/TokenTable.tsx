import React, { useState, useRef, useEffect } from 'react';
import { useTokenData } from '../../hooks/useTokenData';
import { useStarredTokens } from '../../hooks/useStarredTokens';
import TokenRow from './TokenRow';
import TokenFilters from './TokenFilters';
import Pagination from '../common/Pagination';
import AIInsightModal from '../insights/AIInsightModal';
import { Token } from '../../types';
import { ChevronDown } from 'lucide-react';
import { getTokenCategory } from '../../services/categoryService';

interface TokenTableProps {
  onTokenSelect?: (token: Token) => void;
}

const TokenTable: React.FC<TokenTableProps> = ({ onTokenSelect }) => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: tokens, isLoading, error } = useTokenData(page, perPage);
  const { toggleStar, isStarred, starredTokens } = useStarredTokens();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAIClick = (token: Token) => {
    setSelectedToken(token);
  };

  const handlePerPageChange = (value: number) => {
    setPerPage(value);
    setShowDropdown(false);
    setPage(1); // Reset to first page
  };

  // Filter tokens based on category and favorites
  const filteredTokens = tokens?.filter(token => {
    if (showFavoritesOnly && !isStarred(token.id)) {
      return false;
    }
    if (selectedCategory) {
      // Mock category assignment based on token properties
      // In a real app, this would come from the API
      const tokenCategory = getTokenCategory(token);
      if (tokenCategory !== selectedCategory) {
        return false;
      }
    }
    return true;
  });

  if (error) {
    console.error('TokenTable Error:', error);
    
    // Try to use cached data if available
    const cachedTokens = tokens;
    if (cachedTokens && cachedTokens.length > 0) {
      console.log('Using cached token data');
    }
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
        <p className="text-red-600 dark:text-red-400 mb-4">Failed to load real-time prices</p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Unable to connect to CoinGecko API. This may be due to rate limiting or network issues.
        </p>
        <div className="space-y-2 mb-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Error details: {error.message || 'Unknown error'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            You can try using a VPN or wait a few minutes before retrying.
          </p>
        </div>
        <div className="flex justify-center gap-2">
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
          <a
            href="/api/test"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Test API
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <div className="p-3 border-b border-gray-200 dark:border-gray-700 space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Top Cryptocurrencies
          </h2>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Show: {perPage}</span>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-1 w-24 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                {[10, 25, 50, 100].map(value => (
                  <button
                    key={value}
                    onClick={() => handlePerPageChange(value)}
                    className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                      perPage === value ? 'bg-gray-50 dark:bg-gray-700 font-semibold' : ''
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <TokenFilters
          selectedCategory={selectedCategory}
          showFavoritesOnly={showFavoritesOnly}
          onCategoryChange={setSelectedCategory}
          onFavoritesToggle={() => setShowFavoritesOnly(!showFavoritesOnly)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <tr>
              <th className="px-1 sm:px-4 py-2 sm:py-3 text-center">
                <Star className="w-3 h-3 sm:w-4 sm:h-4" />
              </th>
              <th className="px-1 sm:px-4 py-2 sm:py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                #
              </th>
              <th className="px-1 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th className="px-1 sm:px-4 py-2 sm:py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Price
              </th>
              <th className="hidden sm:table-cell px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Change
              </th>
              <th className="px-1 sm:px-4 py-2 sm:py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <span className="hidden sm:inline">Market Cap</span>
                <span className="sm:hidden">MCap</span>
              </th>
              <th className="hidden lg:table-cell px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Volume (24h)
              </th>
              <th className="hidden md:table-cell px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Last 7 Days
              </th>
              <th className="px-1 sm:px-4 py-2 sm:py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                AI
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {isLoading ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                </td>
              </tr>
            ) : (
              filteredTokens?.map((token, index) => (
                <TokenRow
                  key={token.id}
                  token={token}
                  index={(page - 1) * perPage + index}
                  isStarred={isStarred(token.id)}
                  onStar={toggleStar}
                  onAIClick={handleAIClick}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {filteredTokens && filteredTokens.length > 0 && (
        <Pagination
          currentPage={page}
          onPageChange={setPage}
          hasNextPage={filteredTokens.length === perPage}
        />
      )}

      {selectedToken && (
        <AIInsightModal
          token={selectedToken}
          onClose={() => setSelectedToken(null)}
        />
      )}
    </div>
  );
};

export default TokenTable;

// Fix the import issue
const Star = () => (
  <svg className="w-4 h-4 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);