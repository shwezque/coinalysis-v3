import React, { useState, useEffect } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import { useMarketStats } from '../../hooks/useTokenData';
import { formatCurrency, formatPercentage, getPriceChangeColor } from '../../utils/formatters';
import { TrendingUp, DollarSign, BarChart3, Activity } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { MarketStats as MarketStatsType } from '../../types';
import MetricInsightModal from '../insights/MetricInsightModal';
import { marketHistoryService } from '../../services/marketHistoryService';

const MarketStats: React.FC = () => {
  const { data: stats, isLoading, error } = useMarketStats();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [selectedMetric, setSelectedMetric] = useState<'marketcap' | 'volume' | 'dominance' | 'feargreed' | null>(null);
  const [marketHistory, setMarketHistory] = useState<any>(null);
  const [fearGreedHistory, setFearGreedHistory] = useState<number[]>([]);

  // Fetch historical data
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        console.log('Fetching market history...');
        const [marketData, fearGreedData] = await Promise.all([
          marketHistoryService.getMarketChart(7), // Last 7 days for more data points
          marketHistoryService.getFearGreedHistory(7)
        ]);
        console.log('Market history data:', marketData);
        setMarketHistory(marketData);
        setFearGreedHistory(fearGreedData);
      } catch (error) {
        console.error('Failed to fetch market history:', error);
      }
    };
    
    if (stats) {
      fetchHistory();
    }
  }, [stats]);

  // Generate chart data with real or mock values
  const generateChartData = (values: number[], color: string, label: string = '') => ({
    labels: values.map((_, i) => {
      if (values.length <= 24) {
        // Hourly data
        const hours = values.length - i - 1;
        if (hours === 0) return 'Now';
        if (hours % 6 === 0) return `${hours}h ago`;
        return '';
      } else {
        // Daily data for 7 days
        const totalPoints = values.length;
        const pointsPerDay = Math.floor(totalPoints / 7);
        if (i === totalPoints - 1) return 'Now';
        if (i % pointsPerDay === 0) {
          const days = Math.floor((totalPoints - i - 1) / pointsPerDay);
          if (days === 0) return 'Today';
          if (days === 1) return '1d ago';
          return `${days}d ago`;
        }
        return '';
      }
    }),
    datasets: [{
      data: values,
      borderColor: color,
      backgroundColor: `${color}20`,
      borderWidth: 2,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: color,
      pointHoverBorderColor: isDark ? '#1f2937' : '#ffffff',
      pointHoverBorderWidth: 2,
      fill: true,
      label: label,
    }]
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        titleColor: isDark ? '#ffffff' : '#111827',
        bodyColor: isDark ? '#d1d5db' : '#6b7280',
        borderColor: isDark ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        padding: 8,
        displayColors: false,
        callbacks: {
          label: (context: any) => {
            const value = context.parsed.y;
            if (context.dataset.label === 'Market Cap' || context.dataset.label === 'Volume') {
              return formatCurrency(value);
            }
            return value.toFixed(2);
          }
        }
      }
    },
    scales: {
      x: { 
        display: false,
        grid: { display: false }
      },
      y: { 
        display: false,
        grid: { display: false }
      }
    },
    hover: {
      mode: 'index' as const,
      intersect: false
    }
  };

  // Mock Fear & Greed Index (in production, this would come from API)
  const fearGreedValue = 65;
  const getFearGreedColor = (value: number) => {
    if (value <= 25) return '#ef4444'; // Extreme Fear
    if (value <= 45) return '#f97316'; // Fear
    if (value <= 55) return '#eab308'; // Neutral
    if (value <= 75) return '#22c55e'; // Greed
    return '#16a34a'; // Extreme Greed
  };

  const getFearGreedLabel = (value: number) => {
    if (value <= 25) return 'Extreme Fear';
    if (value <= 45) return 'Fear';
    if (value <= 55) return 'Neutral';
    if (value <= 75) return 'Greed';
    return 'Extreme Greed';
  };

  const typedStats = stats as MarketStatsType | undefined;

  const dominanceData = {
    labels: ['BTC', 'ETH', 'Others'],
    datasets: [{
      data: [
        typedStats?.market_cap_percentage.btc || 0,
        typedStats?.market_cap_percentage.eth || 0,
        100 - (typedStats?.market_cap_percentage.btc || 0) - (typedStats?.market_cap_percentage.eth || 0)
      ],
      backgroundColor: ['#f7931a', '#627eea', '#6b7280'],
      borderWidth: 0,
    }]
  };

  const dominanceOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        titleColor: isDark ? '#ffffff' : '#111827',
        bodyColor: isDark ? '#d1d5db' : '#6b7280',
        borderColor: isDark ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        padding: 8,
        callbacks: {
          label: (context: any) => `${context.label}: ${context.parsed.toFixed(1)}%`
        }
      }
    },
    hover: {
      mode: 'index' as const
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 mb-3 md:mb-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-3 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return null;
  }

  // Use real data if available, otherwise generate mock data
  let marketCapHistory: number[];
  let volumeHistory: number[];
  
  if (marketHistory?.market_caps?.length > 0) {
    // Check if data is in array format [[timestamp, value], ...]
    if (Array.isArray(marketHistory.market_caps[0])) {
      marketCapHistory = marketHistory.market_caps.map((item: number[]) => item[1]);
    } else {
      marketCapHistory = marketHistory.market_caps;
    }
  } else {
    // Generate 7 days of hourly data (168 points)
    marketCapHistory = Array(168).fill(0).map((_, i) => 
      (typedStats?.total_market_cap || 0) * (1 + Math.sin(i / 24) * 0.02 + (Math.random() - 0.5) * 0.01)
    );
  }
  
  if (marketHistory?.total_volumes?.length > 0) {
    // Check if data is in array format [[timestamp, value], ...]
    if (Array.isArray(marketHistory.total_volumes[0])) {
      volumeHistory = marketHistory.total_volumes.map((item: number[]) => item[1]);
    } else {
      volumeHistory = marketHistory.total_volumes;
    }
  } else {
    // Generate 7 days of hourly data (168 points)
    volumeHistory = Array(168).fill(0).map((_, i) => 
      (typedStats?.total_volume || 0) * (1 + Math.cos(i / 12) * 0.05 + (Math.random() - 0.5) * 0.02)
    );
  }
  
  console.log('Chart data:', {
    marketCapLength: marketCapHistory.length,
    volumeLength: volumeHistory.length,
    sampleMarketCap: marketCapHistory.slice(-3),
    sampleVolume: volumeHistory.slice(-3)
  });

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 mb-3 md:mb-4">
      {/* Market Cap */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-2 md:p-3 shadow-sm transition-all">
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-500" />
              <p className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">Market Cap</p>
            </div>
            <p className="text-sm md:text-lg font-bold text-gray-900 dark:text-white">
              {formatCurrency(typedStats?.total_market_cap || 0)}
            </p>
            <p className={`text-xs ${getPriceChangeColor(typedStats?.market_cap_change_percentage_24h_usd || 0)}`}>
              {(typedStats?.market_cap_change_percentage_24h_usd || 0) > 0 ? '+' : ''}
              {formatPercentage(typedStats?.market_cap_change_percentage_24h_usd || 0)}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedMetric('marketcap');
            }}
            className="px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors font-semibold text-xs"
            title="AI Insights"
          >
            AI
          </button>
        </div>
        <div className="h-16 md:h-20 mt-2 cursor-pointer hover:opacity-90 transition-opacity">
          <Line data={generateChartData(marketCapHistory, '#3b82f6', 'Market Cap')} options={chartOptions} />
        </div>
      </div>

      {/* 24h Volume */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-2 md:p-3 shadow-sm transition-all">
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <p className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">24h Volume</p>
            </div>
            <p className="text-sm md:text-lg font-bold text-gray-900 dark:text-white">
              {formatCurrency(typedStats?.total_volume || 0)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Global trading
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedMetric('volume');
            }}
            className="px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors font-semibold text-xs"
            title="AI Insights"
          >
            AI
          </button>
        </div>
        <div className="h-16 md:h-20 mt-2 cursor-pointer hover:opacity-90 transition-opacity">
          <Line data={generateChartData(volumeHistory, '#10b981', 'Volume')} options={chartOptions} />
        </div>
      </div>

      {/* BTC Dominance */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-2 md:p-3 shadow-sm transition-all">
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-yellow-500" />
              <p className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">BTC Dominance</p>
            </div>
            <p className="text-sm md:text-lg font-bold text-gray-900 dark:text-white">
              {formatPercentage(typedStats?.market_cap_percentage.btc || 0)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              ETH: {formatPercentage(typedStats?.market_cap_percentage.eth || 0)}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedMetric('dominance');
            }}
            className="px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors font-semibold text-xs"
            title="AI Insights"
          >
            AI
          </button>
        </div>
        <div className="h-16 md:h-20 mt-2 cursor-pointer hover:opacity-90 transition-opacity">
          <Doughnut data={dominanceData} options={dominanceOptions} />
        </div>
      </div>

      {/* Fear & Greed Index */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-2 md:p-3 shadow-sm transition-all">
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4" style={{ color: getFearGreedColor(fearGreedValue) }} />
              <p className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">Fear & Greed</p>
            </div>
            <p className="text-sm md:text-lg font-bold text-gray-900 dark:text-white">
              {fearGreedValue}
            </p>
            <p className={`text-xs font-medium`} style={{ color: getFearGreedColor(fearGreedValue) }}>
              {getFearGreedLabel(fearGreedValue)}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedMetric('feargreed');
            }}
            className="px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors font-semibold text-xs"
            title="AI Insights"
          >
            AI
          </button>
        </div>
        <div className="mt-3">
          <div className="relative h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full">
            <div 
              className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white dark:bg-gray-700 rounded-full shadow-md border-2 border-gray-300 dark:border-gray-600"
              style={{ left: `${fearGreedValue}%`, marginLeft: '-8px' }}
            />
          </div>
          <div className="hidden md:flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span>0</span>
            <span>Fear</span>
            <span>Neutral</span>
            <span>Greed</span>
            <span>100</span>
          </div>
        </div>
      </div>

      {selectedMetric && (
        <MetricInsightModal
          metric={selectedMetric}
          currentValue={
            selectedMetric === 'marketcap' ? (typedStats?.total_market_cap || 0) :
            selectedMetric === 'volume' ? (typedStats?.total_volume || 0) :
            selectedMetric === 'dominance' ? { btc: typedStats?.market_cap_percentage.btc || 0, eth: typedStats?.market_cap_percentage.eth || 0 } :
            fearGreedValue
          }
          onClose={() => setSelectedMetric(null)}
        />
      )}
    </div>
  );
};

export default MarketStats;