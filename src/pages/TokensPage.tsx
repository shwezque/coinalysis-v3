import React from 'react';
import MarketStats from '../components/tokens/MarketStats';
import TokenTable from '../components/tokens/TokenTable';

const TokensPage: React.FC = () => {
  return (
    <div className="container mx-auto px-3 md:px-4 py-2 md:py-4">
      <div className="mb-3 md:mb-4 mt-4 md:mt-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          Cryptocurrency Market
        </h1>
        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
          Real-time prices and market analysis
        </p>
      </div>
      
      <MarketStats />
      <TokenTable />
    </div>
  );
};

export default TokensPage;