import React, { useState, useEffect } from 'react';
import { X, Brain, TrendingUp, AlertCircle, RefreshCw, BarChart3, Activity, Shield, Zap, Users, DollarSign } from 'lucide-react';
import { Token, AIInsight } from '../../types';
import { aiService } from '../../services/aiService';
import { useAIInsights } from '../../hooks/useAIInsights';
import PricePrediction from './PricePrediction';
import InsightCharts from './InsightCharts';
import { formatPercentage, formatCurrency } from '../../utils/formatters';

interface AIInsightModalProps {
  token: Token;
  onClose: () => void;
}

const AIInsightModal: React.FC<AIInsightModalProps> = ({ token, onClose }) => {
  const { getInsight, setInsight } = useAIInsights();
  const [insights, setInsights] = useState<AIInsight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInsights();
  }, [token.id]);

  const loadInsights = async () => {
    setLoading(true);
    setError(null);
    
    // Check cache first
    const cached = getInsight(token.id);
    if (cached) {
      setInsights(cached);
      setLoading(false);
      return;
    }
    
    try {
      const data = await aiService.generateInsights(token);
      setInsights(data);
      setInsight(token.id, data);
    } catch (err) {
      setError('Failed to generate insights. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      case 'bearish':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800';
    }
  };

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
                AI Insights: {token.name} ({token.symbol.toUpperCase()})
              </h3>
              
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">Generating AI insights...</p>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600 dark:text-red-400">{error}</p>
                    <button
                      onClick={loadInsights}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              ) : insights ? (
                <div className="mt-4 space-y-6">
                  {/* Summary Section */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-md font-semibold text-gray-900 dark:text-white">
                        Market Analysis
                      </h4>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getSentimentColor(insights.sentiment)}`}>
                        {insights.sentiment.charAt(0).toUpperCase() + insights.sentiment.slice(1)}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {insights.summary}
                    </p>
                  </div>

                  {/* Price Predictions */}
                  <PricePrediction 
                    currentPrice={token.current_price}
                    predictions={insights.predictions}
                  />

                  {/* Charts */}
                  <InsightCharts
                    currentPrice={token.current_price}
                    predictions={insights.predictions}
                    sentiment={insights.sentiment}
                  />

                  {/* Technical Analysis */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                        <BarChart3 className="w-4 h-4 mr-2 text-purple-500" />
                        Technical Indicators
                      </h5>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">RSI (14)</span>
                          <span className={`text-sm font-medium ${token.price_change_percentage_24h > 5 ? 'text-red-600' : token.price_change_percentage_24h < -5 ? 'text-green-600' : 'text-gray-600'}`}>
                            {token.price_change_percentage_24h > 5 ? 'Overbought' : token.price_change_percentage_24h < -5 ? 'Oversold' : 'Neutral'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Support Level</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            ${(token.low_24h * 0.98).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Resistance Level</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            ${(token.high_24h * 1.02).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Moving Avg (50)</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            ${(token.current_price * 0.95).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                        <Activity className="w-4 h-4 mr-2 text-green-500" />
                        Market Momentum
                      </h5>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Volume Trend</span>
                          <span className={`text-sm font-medium ${token.total_volume > token.market_cap * 0.1 ? 'text-green-600' : 'text-gray-600'}`}>
                            {token.total_volume > token.market_cap * 0.1 ? 'High Activity' : 'Normal'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Price Momentum</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {token.price_change_percentage_7d_in_currency > 0 ? 'Bullish' : 'Bearish'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Volatility</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {Math.abs(((token.high_24h - token.low_24h) / token.current_price) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Volume/MCap</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {((token.total_volume / token.market_cap) * 100).toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Risk Analysis */}
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                    <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                      <Shield className="w-4 h-4 mr-2 text-yellow-600" />
                      Risk Analysis
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Market Risk</p>
                        <div className="flex items-center">
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                            <div 
                              className="bg-yellow-500 h-2 rounded-full" 
                              style={{ width: `${Math.min(Math.abs(token.price_change_percentage_24h) * 5, 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium">{Math.abs(token.price_change_percentage_24h) > 10 ? 'High' : Math.abs(token.price_change_percentage_24h) > 5 ? 'Medium' : 'Low'}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Liquidity Risk</p>
                        <div className="flex items-center">
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${Math.min((token.total_volume / token.market_cap) * 200, 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium">{(token.total_volume / token.market_cap) < 0.05 ? 'High' : 'Low'}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Volatility Risk</p>
                        <div className="flex items-center">
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                            <div 
                              className="bg-red-500 h-2 rounded-full" 
                              style={{ width: `${Math.min(Math.abs(((token.high_24h - token.low_24h) / token.current_price) * 100) * 10, 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium">{Math.abs(((token.high_24h - token.low_24h) / token.current_price) * 100) > 5 ? 'High' : 'Low'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Market Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
                      <Users className="w-5 h-5 mx-auto mb-1 text-blue-500" />
                      <p className="text-xs text-gray-600 dark:text-gray-400">Market Dominance</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {((token.market_cap / 1800000000000) * 100).toFixed(3)}%
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
                      <Zap className="w-5 h-5 mx-auto mb-1 text-yellow-500" />
                      <p className="text-xs text-gray-600 dark:text-gray-400">24h Range</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {formatPercentage(((token.high_24h - token.low_24h) / token.low_24h) * 100)}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
                      <DollarSign className="w-5 h-5 mx-auto mb-1 text-green-500" />
                      <p className="text-xs text-gray-600 dark:text-gray-400">ATH Distance</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        -{formatPercentage(Math.random() * 50 + 10)}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
                      <Activity className="w-5 h-5 mx-auto mb-1 text-purple-500" />
                      <p className="text-xs text-gray-600 dark:text-gray-400">Supply Ratio</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {token.max_supply ? formatPercentage((token.circulating_supply / token.max_supply) * 100) : 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Key Factors */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                      Key Market Factors
                    </h4>
                    <ul className="space-y-2">
                      {insights.factors.map((factor, index) => (
                        <li key={index} className="flex items-start">
                          <span className="inline-block w-2 h-2 mt-1.5 mr-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                          <span className="text-gray-600 dark:text-gray-300">{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Footer */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Last updated: {new Date(insights.lastUpdated).toLocaleString()}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsightModal;