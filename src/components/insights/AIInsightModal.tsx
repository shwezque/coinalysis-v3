import React, { useState, useEffect } from 'react';
import { X, Brain, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';
import { Token, AIInsight } from '../../types';
import { aiService } from '../../services/aiService';
import { useAIInsights } from '../../hooks/useAIInsights';
import PricePrediction from './PricePrediction';
import InsightCharts from './InsightCharts';

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

                  {/* Key Factors */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                      Key Factors
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