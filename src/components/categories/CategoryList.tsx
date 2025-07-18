import React, { useState } from 'react';
import { useCategories } from '../../hooks/useTokenData';
import CategoryRow from './CategoryRow';
import { Grid3X3 } from 'lucide-react';
import { Category } from '../../types';

const CategoryList: React.FC = () => {
  const { data: categories, isLoading, error } = useCategories();
  const [sortBy, setSortBy] = useState<'market_cap' | 'change' | 'volume'>('market_cap');

  const sortedCategories = (categories as Category[] | undefined)?.slice().sort((a, b) => {
    switch (sortBy) {
      case 'change':
        return b.market_cap_change_24h - a.market_cap_change_24h;
      case 'volume':
        return b.volume_24h - a.volume_24h;
      default:
        return b.market_cap - a.market_cap;
    }
  });

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
        <p className="text-red-600 dark:text-red-400">Failed to load categories. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Grid3X3 className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Token Categories
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="market_cap">Market Cap</option>
            <option value="change">24h Change</option>
            <option value="volume">Volume</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <tr>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Category
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Market Cap
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                24h Change
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Volume (24h)
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Price Chart
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                </td>
              </tr>
            ) : (
              sortedCategories?.map((category, index) => (
                <CategoryRow
                  key={category.id}
                  category={category}
                  index={index}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {sortedCategories && sortedCategories.length === 0 && (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          No categories found.
        </div>
      )}
    </div>
  );
};

export default CategoryList;