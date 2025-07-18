import React from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { useTheme } from '../../hooks/useTheme';
import { AIInsight } from '../../types';
import { Activity, PieChart } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface InsightChartsProps {
  currentPrice: number;
  predictions: AIInsight['predictions'];
  sentiment: AIInsight['sentiment'];
}

const InsightCharts: React.FC<InsightChartsProps> = ({ currentPrice, predictions, sentiment }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Generate prediction timeline data
  const timelineData = {
    labels: ['Current', '1 Week', '2 Weeks', '1 Month', '2 Months', '3 Months'],
    datasets: [
      {
        label: 'Price Projection',
        data: [
          currentPrice,
          currentPrice * 1.02,
          currentPrice * 1.05,
          predictions.nearTerm.price,
          predictions.mediumTerm.price * 0.95,
          predictions.mediumTerm.price,
        ],
        borderColor: sentiment === 'bullish' ? '#10b981' : sentiment === 'bearish' ? '#ef4444' : '#6366f1',
        backgroundColor: sentiment === 'bullish' 
          ? 'rgba(16, 185, 129, 0.1)' 
          : sentiment === 'bearish'
          ? 'rgba(239, 68, 68, 0.1)'
          : 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const timelineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        titleColor: isDark ? '#ffffff' : '#111827',
        bodyColor: isDark ? '#d1d5db' : '#6b7280',
        borderColor: isDark ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context: any) => {
            const value = context.parsed.y;
            const change = ((value - currentPrice) / currentPrice) * 100;
            return [
              `Price: $${value.toFixed(2)}`,
              `Change: ${change > 0 ? '+' : ''}${change.toFixed(2)}%`
            ];
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: isDark ? '#9ca3af' : '#6b7280',
        },
      },
      y: {
        grid: {
          color: isDark ? '#374151' : '#f3f4f6',
        },
        ticks: {
          color: isDark ? '#9ca3af' : '#6b7280',
          callback: (value: any) => `$${value.toFixed(0)}`,
        },
      },
    },
  };

  // Sentiment distribution data
  const sentimentData = {
    labels: ['Bullish Factors', 'Bearish Factors', 'Neutral Factors'],
    datasets: [
      {
        data: sentiment === 'bullish' ? [60, 20, 20] : sentiment === 'bearish' ? [20, 60, 20] : [20, 20, 60],
        backgroundColor: ['#10b981', '#ef4444', '#6b7280'],
        borderWidth: 0,
      },
    ],
  };

  const sentimentOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          color: isDark ? '#d1d5db' : '#4b5563',
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        titleColor: isDark ? '#ffffff' : '#111827',
        bodyColor: isDark ? '#d1d5db' : '#6b7280',
        borderColor: isDark ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (context: any) => {
            return `${context.label}: ${context.parsed}%`;
          },
        },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
        <div className="flex items-center mb-4">
          <Activity className="w-5 h-5 mr-2 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Price Projection Timeline
          </h3>
        </div>
        <div className="h-64">
          <Line data={timelineData} options={timelineOptions} />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
        <div className="flex items-center mb-4">
          <PieChart className="w-5 h-5 mr-2 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Market Sentiment Analysis
          </h3>
        </div>
        <div className="h-64">
          <Doughnut data={sentimentData} options={sentimentOptions} />
        </div>
      </div>
    </div>
  );
};

export default InsightCharts;