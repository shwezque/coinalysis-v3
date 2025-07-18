import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAllTokens } from '../../hooks/useTokenData';
import TokenRow from '../tokens/TokenRow';
import { useStarredTokens } from '../../hooks/useStarredTokens';
import { ArrowLeft, Layers, Brain, Globe, Image, Coins, Building, Laugh, Network } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { Token } from '../../types';
import { getCategoryById, getTokensForCategory } from '../../services/categoryService';
import AIInsightModal from '../insights/AIInsightModal';

const CategoryDetail: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { data: allTokens } = useAllTokens();
  const { toggleStar, isStarred } = useStarredTokens();
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);

  const categoryDef = categoryId ? getCategoryById(categoryId) : undefined;
  const categoryTokenIds = categoryId ? getTokensForCategory(categoryId) : [];
  
  const getIcon = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'Coins': <Coins className="w-6 h-6" />,
      'Brain': <Brain className="w-6 h-6" />,
      'Layers': <Layers className="w-6 h-6" />,
      'Image': <Image className="w-6 h-6" />,
      'Building': <Building className="w-6 h-6" />,
      'Globe': <Globe className="w-6 h-6" />,
    };
    return iconMap[iconName] || <Coins className="w-6 h-6" />;
  };

  // Create category object compatible with existing code
  const category = categoryDef ? {
    name: categoryDef.name,
    description: categoryDef.description,
    marketCap: Math.random() * 1000000000000 + 10000000000, // Mock data
    marketCapChange24h: (Math.random() - 0.5) * 20, // Mock data
    volume24h: Math.random() * 50000000000 + 1000000000, // Mock data
    icon: getIcon(categoryDef.icon),
    color: categoryDef.color,
  } : null;

  // Filter tokens based on category using centralized service
  const categoryTokens = (allTokens as Token[] | undefined)?.filter(token => {
    return categoryTokenIds.some(catToken => 
      catToken.symbol.toLowerCase() === token.symbol.toLowerCase() ||
      catToken.id.toLowerCase() === token.id.toLowerCase()
    );
  }) || [];

  const handleAIClick = (token: Token) => {
    setSelectedToken(token);
  };

  const getIconBgColor = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-500',
      purple: 'bg-purple-500',
      green: 'bg-green-500',
      pink: 'bg-pink-500',
      orange: 'bg-orange-500',
      indigo: 'bg-indigo-500',
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">Category not found</p>
          <button
            onClick={() => navigate('/categories')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Categories
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4">
      <button
        onClick={() => navigate('/categories')}
        className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Categories</span>
      </button>

      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className={`p-2 rounded-lg ${getIconBgColor(category.color)} text-white`}>
            {category.icon}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {category.name}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {category.description}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Market Cap</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {formatCurrency(category.marketCap)}
          </p>
          <p className={`text-xs ${
            category.marketCapChange24h > 0 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            {category.marketCapChange24h > 0 ? '+' : ''}
            {formatPercentage(category.marketCapChange24h)}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">24h Volume</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {formatCurrency(category.volume24h)}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Listed Tokens</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {categoryTokens.length}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {category.name} Tokens
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-2 sm:px-4 py-3 text-center">
                  <svg className="w-4 h-4 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </th>
                <th className="px-2 sm:px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  #
                </th>
                <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-2 sm:px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Price
                </th>
                <th className="hidden sm:table-cell px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Change
                </th>
                <th className="hidden md:table-cell px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Market Cap
                </th>
                <th className="hidden lg:table-cell px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Volume (24h)
                </th>
                <th className="hidden md:table-cell px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Last 7 Days
                </th>
                <th className="px-2 sm:px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  AI
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {categoryTokens.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    No tokens found in this category
                  </td>
                </tr>
              ) : (
                categoryTokens.map((token, index) => (
                  <TokenRow
                    key={token.id}
                    token={token}
                    index={index}
                    isStarred={isStarred(token.id)}
                    onStar={toggleStar}
                    onAIClick={handleAIClick}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedToken && (
        <AIInsightModal
          token={selectedToken}
          onClose={() => setSelectedToken(null)}
        />
      )}
    </div>
  );
};

export default CategoryDetail;