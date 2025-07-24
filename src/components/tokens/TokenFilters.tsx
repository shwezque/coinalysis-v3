import React from 'react';
import { Filter, Star, Layers, Coins, Brain, Network, Laugh, Building, Globe } from 'lucide-react';

interface TokenFiltersProps {
  selectedCategory: string | null;
  showFavoritesOnly: boolean;
  onCategoryChange: (category: string | null) => void;
  onFavoritesToggle: () => void;
}

const CATEGORIES = [
  { id: 'defi', name: 'DeFi', color: 'bg-blue-500', icon: Coins },
  { id: 'ai', name: 'AI', color: 'bg-purple-500', icon: Brain },
  { id: 'layer-1', name: 'Layer 1', color: 'bg-green-500', icon: Network },
  { id: 'meme', name: 'Meme', color: 'bg-pink-500', icon: Laugh },
  { id: 'rwa', name: 'RWA', color: 'bg-orange-500', icon: Building },
  { id: 'depin', name: 'DePIN', color: 'bg-indigo-500', icon: Globe },
];

const TokenFilters: React.FC<TokenFiltersProps> = ({
  selectedCategory,
  showFavoritesOnly,
  onCategoryChange,
  onFavoritesToggle,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-1">
      {/* Favorites Filter */}
      <button
        onClick={onFavoritesToggle}
        className={`flex items-center px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-xs md:text-sm font-medium transition-colors ${
          showFavoritesOnly
            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        <Star className={`w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-1.5 ${showFavoritesOnly ? 'fill-current' : ''}`} />
        Favorites
      </button>

      {/* Category Filters */}
      <div className="flex items-center gap-1 md:gap-2 flex-wrap">
        <span className="hidden md:flex text-sm text-gray-500 dark:text-gray-400 items-center">
          <Layers className="w-4 h-4 mr-1" />
          Categories:
        </span>
        
        <button
          onClick={() => onCategoryChange(null)}
          className={`px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-xs md:text-sm font-medium transition-colors ${
            !selectedCategory
              ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          All
        </button>

        {CATEGORIES.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`flex items-center px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-xs md:text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? `${category.color} text-white`
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <Icon className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-1.5" />
              {category.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TokenFilters;