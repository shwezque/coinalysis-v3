import React from 'react';
import { AIInsight } from '../../types';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { TrendingUp, Calendar, Target } from 'lucide-react';

interface PricePredictionProps {
  currentPrice: number;
  predictions: AIInsight['predictions'];
}

const PricePrediction: React.FC<PricePredictionProps> = ({ currentPrice, predictions }) => {
  const nearTermChange = ((predictions.nearTerm.price - currentPrice) / currentPrice) * 100;
  const mediumTermChange = ((predictions.mediumTerm.price - currentPrice) / currentPrice) * 100;

  const getPredictionColor = (change: number) => {
    if (change > 0) return 'text-green-600 dark:text-green-400';
    if (change < 0) return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-500';
    if (confidence >= 60) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
        <Target className="w-5 h-5 mr-2 text-blue-500" />
        Price Predictions
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-gray-500" />
              <h4 className="font-medium text-gray-900 dark:text-white">Near Term</h4>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {predictions.nearTerm.timeframe}
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(predictions.nearTerm.price)}
              </p>
              <p className={`text-sm font-medium ${getPredictionColor(nearTermChange)}`}>
                {nearTermChange > 0 ? '+' : ''}{formatPercentage(nearTermChange)} from current
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Confidence</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {predictions.nearTerm.confidence.toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getConfidenceColor(predictions.nearTerm.confidence)}`}
                  style={{ width: `${predictions.nearTerm.confidence}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <h4 className="font-medium text-gray-900 dark:text-white">Medium Term</h4>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {predictions.mediumTerm.timeframe}
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(predictions.mediumTerm.price)}
              </p>
              <p className={`text-sm font-medium ${getPredictionColor(mediumTermChange)}`}>
                {mediumTermChange > 0 ? '+' : ''}{formatPercentage(mediumTermChange)} from current
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Confidence</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {predictions.mediumTerm.confidence.toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getConfidenceColor(predictions.mediumTerm.confidence)}`}
                  style={{ width: `${predictions.mediumTerm.confidence}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
        <p>Predictions are generated using AI analysis and should not be considered financial advice.</p>
      </div>
    </div>
  );
};

export default PricePrediction;