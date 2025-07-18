import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, TrendingUp, Brain, Globe, Image, Coins } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../utils/formatters';

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

  // Predefined categories with mock data
  const categories: Category[] = [
    {
      id: 'defi',
      name: 'DeFi',
      description: 'Decentralized Finance protocols and platforms',
      marketCap: 45234567890,
      marketCapChange24h: 3.45,
      volume24h: 8934567890,
      topCoins: ['UNI', 'AAVE', 'MKR', 'COMP', 'CRV'],
      icon: <Coins className="w-6 h-6" />,
      color: 'blue',
    },
    {
      id: 'ai',
      name: 'AI',
      description: 'Artificial Intelligence and Machine Learning tokens',
      marketCap: 23456789012,
      marketCapChange24h: 8.92,
      volume24h: 4567890123,
      topCoins: ['FET', 'AGIX', 'OCEAN', 'RNDR', 'TAO'],
      icon: <Brain className="w-6 h-6" />,
      color: 'purple',
    },
    {
      id: 'layer-1',
      name: 'Layer 1',
      description: 'Base layer blockchain protocols',
      marketCap: 1234567890123,
      marketCapChange24h: -1.23,
      volume24h: 234567890123,
      topCoins: ['BTC', 'ETH', 'SOL', 'ADA', 'AVAX'],
      icon: <Layers className="w-6 h-6" />,
      color: 'green',
    },
    {
      id: 'meme',
      name: 'Meme',
      description: 'Community-driven meme cryptocurrencies',
      marketCap: 34567890123,
      marketCapChange24h: 15.67,
      volume24h: 6789012345,
      topCoins: ['DOGE', 'SHIB', 'PEPE', 'FLOKI', 'BONK'],
      icon: <Image className="w-6 h-6" />,
      color: 'pink',
    },
    {
      id: 'rwa',
      name: 'RWA',
      description: 'Real World Assets tokenization',
      marketCap: 12345678901,
      marketCapChange24h: 4.56,
      volume24h: 2345678901,
      topCoins: ['ONDO', 'MPL', 'RIO', 'ASTR', 'DUSK'],
      icon: <Globe className="w-6 h-6" />,
      color: 'orange',
    },
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      green: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
      pink: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-800',
      orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800',
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
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Cryptocurrency Categories
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Explore tokens by category and sector
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => navigate(`/categories/${category.id}`)}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
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
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Top Coins</p>
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