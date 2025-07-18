import React, { useState } from 'react';
import { usePortfolio } from '../../hooks/usePortfolio';
import { useAllTokens } from '../../hooks/useTokenData';
import PortfolioRow from './PortfolioRow';
import AddTokenModal from './AddTokenModal';
import { PortfolioToken, Token } from '../../types';
import { Plus, Wallet, Download, FileText, Trash2 } from 'lucide-react';
import { calculatePortfolioValue, calculatePortfolioCost } from '../../utils/calculations';
import { formatCurrency } from '../../utils/formatters';
import { exportToCSV, exportToJSON } from '../../utils/exportUtils';

const PortfolioTable: React.FC = () => {
  const { portfolioTokens, addToken, updateToken, removeToken, clearPortfolio } = usePortfolio();
  const { data: marketTokens } = useAllTokens();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingToken, setEditingToken] = useState<PortfolioToken | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const totalValue = marketTokens ? calculatePortfolioValue(portfolioTokens, marketTokens as Token[]) : 0;
  const totalCost = calculatePortfolioCost(portfolioTokens);

  const handleAddOrUpdate = (token: PortfolioToken) => {
    if (editingToken) {
      updateToken(token.id, token);
    } else {
      addToken(token);
    }
  };

  const handleEdit = (token: PortfolioToken) => {
    setEditingToken(token);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingToken(null);
  };

  const handleClearAll = () => {
    clearPortfolio();
    setShowClearConfirm(false);
  };

  if (portfolioTokens.length === 0) {
    return (
      <>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
          <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Your portfolio is empty
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start tracking your cryptocurrency investments by adding tokens to your portfolio.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Your First Token
          </button>
        </div>
        <AddTokenModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onAdd={handleAddOrUpdate}
          editToken={editingToken}
        />
      </>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Portfolio Holdings
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total Value: {formatCurrency(totalValue)} | Total Cost: {formatCurrency(totalCost)}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center px-3 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors text-sm"
              title="Clear all portfolio records"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Clear All
            </button>
            <button
              onClick={() => {
                const prices = (marketTokens as Token[])?.reduce((acc, token) => {
                  acc[token.id] = token.current_price;
                  return acc;
                }, {} as { [key: string]: number }) || {};
                exportToCSV(portfolioTokens, prices);
              }}
              className="flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
              title="Export as CSV"
            >
              <FileText className="w-4 h-4 mr-1" />
              CSV
            </button>
            <button
              onClick={() => {
                const prices = (marketTokens as Token[])?.reduce((acc, token) => {
                  acc[token.id] = token.current_price;
                  return acc;
                }, {} as { [key: string]: number }) || {};
                exportToJSON(portfolioTokens, prices);
              }}
              className="flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
              title="Export as JSON"
            >
              <Download className="w-4 h-4 mr-1" />
              JSON
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Token
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Token
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Holdings
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Current Price
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Buy Price
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  24h Chart
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Total Cost
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Current Value
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  P&L
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {portfolioTokens.map((portfolioToken) => {
                const marketToken = (marketTokens as Token[])?.find(t => t.id === portfolioToken.tokenId);
                return (
                  <PortfolioRow
                    key={portfolioToken.id}
                    portfolioToken={portfolioToken}
                    marketToken={marketToken}
                    onEdit={handleEdit}
                    onRemove={removeToken}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AddTokenModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAdd={handleAddOrUpdate}
        editToken={editingToken}
      />

      {/* Clear All Confirmation Dialog */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75"
              onClick={() => setShowClearConfirm(false)}
            ></div>

            <div className="inline-block w-full max-w-md px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white dark:bg-gray-800 rounded-lg shadow-xl sm:my-8 sm:align-middle sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-red-100 dark:bg-red-900 rounded-full sm:mx-0 sm:h-10 sm:w-10">
                  <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                    Clear Portfolio
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Are you sure you want to clear all portfolio records? This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Clear All
                </button>
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(false)}
                  className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PortfolioTable;