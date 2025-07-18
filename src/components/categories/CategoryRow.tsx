import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Category } from '../../types';
import { formatCurrency, formatPercentage, getPriceChangeColor } from '../../utils/formatters';
import MiniChart from '../tokens/MiniChart';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface CategoryRowProps {
  category: Category;
  index: number;
}

const CategoryRow: React.FC<CategoryRowProps> = ({ category, index }) => {
  const navigate = useNavigate();
  const priceChange = category.market_cap_change_24h;
  const isPositive = priceChange >= 0;
  
  // Generate mock sparkline data for demonstration
  // In a real app, you'd calculate this from the tokens in the category
  const generateSparkline = () => {
    const points = 24;
    const base = 100;
    const volatility = 5;
    const trend = isPositive ? 0.5 : -0.5;
    
    return Array.from({ length: points }, (_, i) => {
      const random = (Math.random() - 0.5) * volatility;
      const trendEffect = trend * i;
      return base + random + trendEffect;
    });
  };

  const handleClick = () => {
    navigate(`/categories/${category.id}`);
  };

  return (
    <tr 
      onClick={handleClick}
      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
    >
      <td className="px-4 py-4 text-center text-sm text-gray-600 dark:text-gray-400">
        {index + 1}
      </td>
      <td className="px-4 py-4">
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{category.name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {category.top_3_coins.slice(0, 3).join(', ')}
          </p>
        </div>
      </td>
      <td className="px-4 py-4 text-right">
        <p className="font-medium text-gray-900 dark:text-white">
          {formatCurrency(category.market_cap)}
        </p>
      </td>
      <td className="px-4 py-4 text-right">
        <div className="flex items-center justify-end space-x-1">
          {isPositive ? (
            <TrendingUp className="w-4 h-4 text-green-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500" />
          )}
          <span className={`font-medium ${getPriceChangeColor(priceChange)}`}>
            {isPositive ? '+' : ''}{formatPercentage(Math.abs(priceChange))}
          </span>
        </div>
      </td>
      <td className="px-4 py-4 text-right text-gray-900 dark:text-white">
        {formatCurrency(category.volume_24h)}
      </td>
      <td className="px-4 py-4">
        <MiniChart 
          data={generateSparkline()} 
          color={isPositive ? '#10b981' : '#ef4444'} 
        />
      </td>
    </tr>
  );
};

export default CategoryRow;