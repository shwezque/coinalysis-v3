import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, TrendingUp, Brain, Globe, Image, Coins, Building } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import { categoryDefinitions } from '../services/categoryService';

interface Category {
  id: string;
  name: string;
  description: string;
  marketCap: number;
  marketCapChange24h: number;
  volume24h: number;
  topCoins: string[];
  icon: React.ReactNode;
  color: string;
}

const CategoriesPage: React.FC = () => {
  const navigate = useNavigate();

  const getIcon = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'Coins': <Coins className="w-5 h-5 md:w-6 md:h-6" />,
      'Brain': <Brain className="w-5 h-5 md:w-6 md:h-6" />,
      'Layers': <Layers className="w-5 h-5 md:w-6 md:h-6" />,
      'Image': <Image className="w-5 h-5 md:w-6 md:h-6" />,
      'Building': <Building className="w-5 h-5 md:w-6 md:h-6" />,
      'Globe': <Globe className="w-5 h-5 md:w-6 md:h-6" />,
    };
    return iconMap[iconName] || <Coins className="w-6 h-6" />;
  };

  // Generate categories from centralized definitions with mock market data
  const categories: Category[] = categoryDefinitions.map(def => ({
    id: def.id,
    name: def.name,
    description: def.description,
    marketCap: Math.random() * 1000000000000 + 10000000000, // Mock data
    marketCapChange24h: (Math.random() - 0.5) * 20, // Mock data -10% to +10%
    volume24h: Math.random() * 50000000000 + 1000000000, // Mock data
    topCoins: def.tokens.slice(0, 5).map(t => t.symbol),
    icon: getIcon(def.icon),
    color: def.color,
  }));

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      green: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
      pink: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-800',
      orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800',
      indigo: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
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

  return (
    <div className="container mx-auto px-3 md:px-4 py-2 md:py-4">
      <div className="mb-3 md:mb-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          Cryptocurrency Categories
        </h1>
        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
          Explore tokens by category and sector
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => navigate(`/categories/${category.id}`)}
            className="bg-white dark:bg-gray-800 rounded-lg p-3 md:p-4 shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${getIconBgColor(category.color)} text-white`}>
                  {category.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {category.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {category.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Market Cap</span>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
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
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">24h Volume</span>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(category.volume24h)}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Top Tokens</p>
                <div className="flex flex-wrap gap-1">
                  {category.topCoins.map((coin) => (
                    <span
                      key={coin}
                      className={`px-2 py-0.5 text-xs font-medium rounded-full ${getColorClasses(category.color)} border`}
                    >
                      {coin}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;