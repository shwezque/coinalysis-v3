import React, { useState } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import { useMarketStats } from '../../hooks/useTokenData';
import { formatCurrency, formatPercentage, getPriceChangeColor } from '../../utils/formatters';
import { TrendingUp, DollarSign, BarChart3, Activity, AlertTriangle } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { MarketStats as MarketStatsType } from '../../types';

const MarketStats: React.FC = () => {
  const { data: stats, isLoading, error } = useMarketStats();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // Mock data for charts (in production, this would come from API)
  const generateChartData = (values: number[], color: string) => ({
    labels: ['6h', '5h', '4h', '3h', '2h', '1h', 'Now'],
    datasets: [{
      data: values,
      borderColor: color,
      backgroundColor: `${color}20`,
      borderWidth: 2,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 3,
      fill: true,
    }]
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        titleColor: isDark ? '#ffffff' : '#111827',
        bodyColor: isDark ? '#d1d5db' : '#6b7280',
        borderColor: isDark ? '#374151' : '#e5e7eb',
        borderWidth: 1,
      }
    },
    scales: {
      x: { display: false },
      y: { display: false }
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
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        titleColor: isDark ? '#ffffff' : '#111827',
        bodyColor: isDark ? '#d1d5db' : '#6b7280',
        borderColor: isDark ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        callbacks: {
          label: (context: any) => `${context.label}: ${context.parsed.toFixed(1)}%`
        }
      }
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
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

  // Generate mock historical data
  const marketCapHistory = Array(7).fill(0).map((_, i) => 
    (typedStats?.total_market_cap || 0) * (1 + (Math.random() - 0.5) * 0.05)
  );
  const volumeHistory = Array(7).fill(0).map((_, i) => 
    (typedStats?.total_volume || 0) * (1 + (Math.random() - 0.5) * 0.1)
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
      {/* Market Cap */}
      <div 
        className={`bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm cursor-pointer transition-all ${
          expandedCard === 'marketcap' ? 'col-span-1 sm:col-span-2 lg:col-span-2' : ''
        }`}
        onClick={() => setExpandedCard(expandedCard === 'marketcap' ? null : 'marketcap')}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1">
            <p className="text-xs text-gray-600 dark:text-gray-400">Market Cap</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {formatCurrency(typedStats?.total_market_cap || 0)}
            </p>
            <p className={`text-xs ${getPriceChangeColor(typedStats?.market_cap_change_percentage_24h_usd || 0)}`}>
              {(typedStats?.market_cap_change_percentage_24h_usd || 0) > 0 ? '+' : ''}
              {formatPercentage(typedStats?.market_cap_change_percentage_24h_usd || 0)}
            </p>
          </div>
          <BarChart3 className="w-6 h-6 text-blue-500 flex-shrink-0" />
        </div>
        {expandedCard === 'marketcap' && (
          <div className="h-32 mt-2">
            <Line data={generateChartData(marketCapHistory, '#3b82f6')} options={chartOptions} />
          </div>
        )}
      </div>

      {/* 24h Volume */}
      <div 
        className={`bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm cursor-pointer transition-all ${
          expandedCard === 'volume' ? 'col-span-1 sm:col-span-2 lg:col-span-2' : ''
        }`}
        onClick={() => setExpandedCard(expandedCard === 'volume' ? null : 'volume')}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1">
            <p className="text-xs text-gray-600 dark:text-gray-400">24h Volume</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {formatCurrency(typedStats?.total_volume || 0)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Global trading
            </p>
          </div>
          <TrendingUp className="w-6 h-6 text-green-500 flex-shrink-0" />
        </div>
        {expandedCard === 'volume' && (
          <div className="h-32 mt-2">
            <Line data={generateChartData(volumeHistory, '#10b981')} options={chartOptions} />
          </div>
        )}
      </div>

      {/* BTC Dominance */}
      <div 
        className={`bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm cursor-pointer transition-all ${
          expandedCard === 'dominance' ? 'col-span-1 sm:col-span-2 lg:col-span-2' : ''
        }`}
        onClick={() => setExpandedCard(expandedCard === 'dominance' ? null : 'dominance')}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1">
            <p className="text-xs text-gray-600 dark:text-gray-400">BTC Dominance</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {formatPercentage(typedStats?.market_cap_percentage.btc || 0)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              ETH: {formatPercentage(typedStats?.market_cap_percentage.eth || 0)}
            </p>
          </div>
          <DollarSign className="w-6 h-6 text-yellow-500 flex-shrink-0" />
        </div>
        {expandedCard === 'dominance' && (
          <div className="h-32 mt-2">
            <Doughnut data={dominanceData} options={dominanceOptions} />
          </div>
        )}
      </div>

      {/* Fear & Greed Index */}
      <div 
        className={`bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm cursor-pointer transition-all ${
          expandedCard === 'feargreed' ? 'col-span-1 sm:col-span-2 lg:col-span-2' : ''
        }`}
        onClick={() => setExpandedCard(expandedCard === 'feargreed' ? null : 'feargreed')}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1">
            <p className="text-xs text-gray-600 dark:text-gray-400">Fear & Greed</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {fearGreedValue}
            </p>
            <p className={`text-xs font-medium`} style={{ color: getFearGreedColor(fearGreedValue) }}>
              {getFearGreedLabel(fearGreedValue)}
            </p>
          </div>
          <Activity className="w-6 h-6" style={{ color: getFearGreedColor(fearGreedValue) }} />
        </div>
        {expandedCard === 'feargreed' && (
          <div className="mt-3">
            <div className="relative h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full">
              <div 
                className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white dark:bg-gray-700 rounded-full shadow-md border-2 border-gray-300 dark:border-gray-600"
                style={{ left: `${fearGreedValue}%`, marginLeft: '-8px' }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span>0</span>
              <span>Fear</span>
              <span>Neutral</span>
              <span>Greed</span>
              <span>100</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketStats;