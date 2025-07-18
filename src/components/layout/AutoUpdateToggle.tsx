import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { useAutoUpdate } from '../../hooks/useAutoUpdate';

const AutoUpdateToggle: React.FC = () => {
  const { isAutoUpdateEnabled, updateInterval, toggleAutoUpdate } = useAutoUpdate();
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    setLastUpdate(new Date());
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={toggleAutoUpdate}
        className={`p-2 rounded-lg transition-colors ${
          isAutoUpdateEnabled
            ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
        } hover:bg-blue-200 dark:hover:bg-blue-800`}
        aria-label="Toggle auto-update"
        title={isAutoUpdateEnabled ? `Auto-updating every ${updateInterval}s` : 'Enable auto-update'}
      >
        <RefreshCw className={`w-5 h-5 ${isAutoUpdateEnabled ? 'animate-spin' : ''}`} />
      </button>
      {isAutoUpdateEnabled && (
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Every {updateInterval}s
        </span>
      )}
    </div>
  );
};

export default AutoUpdateToggle;