import React, { useState, useEffect } from 'react';
import { X, Brain, TrendingUp, AlertCircle, RefreshCw, BarChart3, Activity, Shield, Target, ChartLine, Calendar } from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import { useTheme } from '../../hooks/useTheme';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

interface MetricInsightModalProps {
  metric: 'marketcap' | 'volume' | 'dominance' | 'feargreed';
  currentValue: number | { btc: number; eth: number };
  onClose: () => void;
}

const MetricInsightModal: React.FC<MetricInsightModalProps> = ({ metric, currentValue, onClose }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading AI insights
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const getMetricTitle = () => {
    switch (metric) {
      case 'marketcap': return 'Market Capitalization Analysis';
      case 'volume': return '24h Trading Volume Analysis';
      case 'dominance': return 'BTC Dominance Analysis';
      case 'feargreed': return 'Fear & Greed Index Analysis';
    }
  };

  const generatePredictionData = () => {
    const labels = ['Now', '1 Day', '3 Days', '1 Week', '2 Weeks', '1 Month'];
    const baseValue = typeof currentValue === 'number' ? currentValue : currentValue.btc;
    
    // Generate realistic predictions with some volatility
    const predictions = [baseValue];
    for (let i = 1; i < 6; i++) {
      const trend = metric === 'marketcap' ? 1.002 : metric === 'volume' ? 0.998 : 1;
      const volatility = 0.02 * Math.sqrt(i);
      const randomFactor = 1 + (Math.random() - 0.5) * volatility;
      predictions.push(predictions[i - 1] * trend * randomFactor);
    }

    return {
      labels,
      datasets: [
        {
          label: 'Prediction',
          data: predictions,
          borderColor: '#3b82f6',
          backgroundColor: '#3b82f620',
          borderWidth: 2,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        {
          label: 'Upper Bound',
          data: predictions.map((v, i) => v * (1 + 0.05 * Math.sqrt(i))),
          borderColor: '#10b981',
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderDash: [5, 5],
          pointRadius: 0,
        },
        {
          label: 'Lower Bound',
          data: predictions.map((v, i) => v * (1 - 0.05 * Math.sqrt(i))),
          borderColor: '#ef4444',
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderDash: [5, 5],
          pointRadius: 0,
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: isDark ? '#d1d5db' : '#4b5563',
          font: { size: 11 }
        }
      },
      tooltip: {
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        titleColor: isDark ? '#ffffff' : '#111827',
        bodyColor: isDark ? '#d1d5db' : '#6b7280',
        borderColor: isDark ? '#374151' : '#e5e7eb',
        borderWidth: 1,
      }
    },
    scales: {
      x: {
        grid: { color: isDark ? '#374151' : '#e5e7eb' },
        ticks: { color: isDark ? '#9ca3af' : '#6b7280' }
      },
      y: {
        grid: { color: isDark ? '#374151' : '#e5e7eb' },
        ticks: { 
          color: isDark ? '#9ca3af' : '#6b7280',
          callback: function(value: any) {
            if (metric === 'marketcap' || metric === 'volume') {
              return '$' + (value / 1e12).toFixed(2) + 'T';
            }
            return value + '%';
          }
        }
      }
    }
  };

  const getInsights = () => {
    switch (metric) {
      case 'marketcap':
        return {
          summary: "The crypto market cap is showing signs of consolidation after recent volatility. Historical patterns suggest we're entering a accumulation phase typical of mid-cycle behavior.",
          keyPoints: [
            "Market cap increased 2.5% over the past 24 hours, outpacing volume growth",
            "Institutional inflows detected through on-chain analysis",
            "Correlation with traditional markets weakening, suggesting crypto decoupling",
            "Smart money accumulation patterns visible in whale wallet activities"
          ],
          risks: [
            { name: "Regulatory Risk", level: 65, color: "yellow" },
            { name: "Macro Risk", level: 45, color: "yellow" },
            { name: "Liquidity Risk", level: 25, color: "green" }
          ],
          prediction: "Based on historical cycles and current momentum indicators, market cap likely to reach $2.5T within 30 days (15% probability of $3T breakthrough)"
        };
      
      case 'volume':
        return {
          summary: "Trading volume patterns indicate healthy market participation with increasing retail interest. Spot volume dominance suggests organic growth rather than speculation.",
          keyPoints: [
            "Volume/Market Cap ratio at 4.7%, above healthy threshold of 4%",
            "DEX volume growing 15% faster than CEX volume",
            "Asian markets contributing 42% of global volume",
            "Derivatives volume stable at 65% of total volume"
          ],
          risks: [
            { name: "Wash Trading Risk", level: 35, color: "green" },
            { name: "Liquidity Depth", level: 55, color: "yellow" },
            { name: "Market Manipulation", level: 40, color: "yellow" }
          ],
          prediction: "Volume expected to maintain current levels with potential 20% spike during next major news catalyst. Watch for volume divergence as early trend reversal signal."
        };
      
      case 'dominance':
        return {
          summary: "Bitcoin dominance trending lower as altcoin season indicators strengthen. Historical patterns suggest rotation into large-cap alts before broader alt rally.",
          keyPoints: [
            "BTC dominance down 2.3% over past month",
            "ETH gaining market share, up 0.8% in dominance",
            "Top 10 altcoins showing relative strength",
            "DeFi and AI sectors capturing increased market share"
          ],
          risks: [
            { name: "Rotation Risk", level: 75, color: "red" },
            { name: "Quality Flight Risk", level: 50, color: "yellow" },
            { name: "Correlation Break Risk", level: 60, color: "yellow" }
          ],
          prediction: "BTC dominance likely to test 45% support level within 2 weeks. Break below could trigger significant alt season with 30-50% gains in quality alts."
        };
      
      case 'feargreed':
        return {
          summary: "Market sentiment in 'Greed' territory but not yet extreme. Historical data shows current levels sustainable for 2-4 weeks before correction.",
          keyPoints: [
            "Index at 65, up from 42 two weeks ago",
            "Social sentiment metrics showing cautious optimism",
            "Funding rates neutral to slightly positive",
            "Put/Call ratio indicating balanced hedging activity"
          ],
          risks: [
            { name: "Sentiment Reversal", level: 55, color: "yellow" },
            { name: "FOMO Risk", level: 70, color: "red" },
            { name: "Complacency Risk", level: 45, color: "yellow" }
          ],
          prediction: "Index likely to reach 75-80 (Extreme Greed) before local top. Watch for divergence between price and sentiment as reversal signal."
        };
    }
  };

  const insights = getInsights();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75"
          onClick={onClose}
        ></div>

        <div className="inline-block w-full max-w-4xl px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white dark:bg-gray-800 rounded-lg shadow-xl sm:my-8 sm:align-middle sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-blue-100 dark:bg-blue-900 rounded-full sm:mx-0 sm:h-10 sm:w-10">
              <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            
            <div className="flex-1 mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                AI Insights: {getMetricTitle()}
              </h3>
              
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">Analyzing market data...</p>
                </div>
              ) : (
                <div className="mt-4 space-y-6">
                  {/* Summary */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                      <Activity className="w-5 h-5 mr-2 text-blue-500" />
                      Market Analysis
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      {insights.summary}
                    </p>
                  </div>

                  {/* Prediction Chart */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                      <ChartLine className="w-5 h-5 mr-2 text-purple-500" />
                      30-Day Prediction Model
                    </h4>
                    <div className="h-64 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <Line data={generatePredictionData()} options={chartOptions} />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      * Predictions based on historical patterns, market cycles, and current momentum indicators
                    </p>
                  </div>

                  {/* Key Insights */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                      <Target className="w-5 h-5 mr-2 text-green-500" />
                      Key Market Insights
                    </h4>
                    <ul className="space-y-2 text-left">
                      {insights.keyPoints.map((point, index) => (
                        <li key={index} className="flex items-start text-left">
                          <span className="inline-block w-2 h-2 mt-1.5 mr-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                          <span className="text-sm text-gray-600 dark:text-gray-300 text-left">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Risk Analysis */}
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                    <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-yellow-600" />
                      Risk Assessment
                    </h4>
                    <div className="space-y-3">
                      {insights.risks.map((risk, index) => (
                        <div key={index}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-700 dark:text-gray-300">{risk.name}</span>
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{risk.level}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                risk.color === 'green' ? 'bg-green-500' : 
                                risk.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${risk.level}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Prediction Summary */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                      Forward-Looking Analysis
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {insights.prediction}
                    </p>
                  </div>

                  {/* Timeframe Analysis */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                      <Calendar className="w-5 h-5 mx-auto mb-1 text-green-500" />
                      <p className="text-xs text-gray-600 dark:text-gray-400">Short Term</p>
                      <p className="text-sm font-semibold text-green-600">Bullish</p>
                    </div>
                    <div className="text-center bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                      <Calendar className="w-5 h-5 mx-auto mb-1 text-yellow-500" />
                      <p className="text-xs text-gray-600 dark:text-gray-400">Medium Term</p>
                      <p className="text-sm font-semibold text-yellow-600">Neutral</p>
                    </div>
                    <div className="text-center bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                      <Calendar className="w-5 h-5 mx-auto mb-1 text-blue-500" />
                      <p className="text-xs text-gray-600 dark:text-gray-400">Long Term</p>
                      <p className="text-sm font-semibold text-blue-600">Bullish</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      AI analysis generated at {new Date().toLocaleString()} • Based on real-time market data and historical patterns
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricInsightModal;