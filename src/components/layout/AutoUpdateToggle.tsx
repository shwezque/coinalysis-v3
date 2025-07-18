import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { coinGeckoService } from '../../services/coinGeckoService';

const AutoUpdateToggle: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    // Clear the cache
    coinGeckoService.clearCache();
    
    // Invalidate all queries to force refetch
    await queryClient.invalidateQueries();
    
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handleRefresh}
        disabled={isRefreshing}
        className={`p-2 rounded-lg transition-colors ${
          isRefreshing
            ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 cursor-not-allowed'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-blue-200 dark:hover:bg-blue-800'
        }`}
        aria-label="Refresh data"
        title="Refresh all data"
      >
        <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
      </button>
      <span className="text-xs text-gray-500 dark:text-gray-400">
        {isRefreshing ? 'Refreshing...' : 'Refresh'}
      </span>
    </div>
  );
};

export default AutoUpdateToggle;