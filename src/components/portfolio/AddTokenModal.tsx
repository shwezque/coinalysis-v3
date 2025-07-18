import React, { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { Token, PortfolioToken } from '../../types';
import { useAllTokens, useSearchTokens } from '../../hooks/useTokenData';
import { formatPrice } from '../../utils/formatters';

interface AddTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (token: PortfolioToken) => void;
  editToken?: PortfolioToken | null;
}

const AddTokenModal: React.FC<AddTokenModalProps> = ({ isOpen, onClose, onAdd, editToken }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [quantity, setQuantity] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [showSearch, setShowSearch] = useState(true);

  const { data: allTokens } = useAllTokens();
  const { data: searchResults } = useSearchTokens(searchQuery);

  const displayTokens = searchQuery ? searchResults : allTokens;

  useEffect(() => {
    if (editToken && allTokens) {
      const token = (allTokens as Token[])?.find(t => t.id === editToken.tokenId);
      if (token) {
        setSelectedToken(token);
        setQuantity(editToken.quantity.toString());
        setBuyPrice(editToken.buyPrice.toString());
        setShowSearch(false);
      }
    }
  }, [editToken, allTokens]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedToken || !quantity || !buyPrice) return;

    const portfolioToken: PortfolioToken = {
      id: editToken?.id || '',
      tokenId: selectedToken.id,
      quantity: parseFloat(quantity),
      buyPrice: parseFloat(buyPrice),
      addedAt: editToken?.addedAt || new Date().toISOString(),
    };

    onAdd(portfolioToken);
    handleClose();
  };

  const handleClose = () => {
    setSearchQuery('');
    setSelectedToken(null);
    setQuantity('');
    setBuyPrice('');
    setShowSearch(true);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {editToken ? 'Edit Token' : 'Add Token to Portfolio'}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {showSearch && !editToken ? (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search Token
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or symbol..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {displayTokens && (displayTokens as Token[])?.length > 0 && (
                <div className="mt-2 max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                  {(displayTokens as Token[]).slice(0, 10).map((token) => (
                    <button
                      key={token.id}
                      type="button"
                      onClick={() => {
                        setSelectedToken(token);
                        setBuyPrice(token.current_price.toString());
                        setShowSearch(false);
                      }}
                      className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                    >
                      <img src={token.image} alt={token.name} className="w-6 h-6 rounded-full" />
                      <div className="flex-1 text-left">
                        <p className="font-medium text-gray-900 dark:text-white">{token.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 uppercase">{token.symbol}</p>
                      </div>
                      <p className="text-sm text-gray-900 dark:text-white">{formatPrice(token.current_price)}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : null}

          {selectedToken && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Selected Token
              </label>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <img src={selectedToken.image} alt={selectedToken.name} className="w-8 h-8 rounded-full" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{selectedToken.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Current: {formatPrice(selectedToken.current_price)}
                  </p>
                </div>
                {!editToken && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedToken(null);
                      setShowSearch(true);
                    }}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Change
                  </button>
                )}
              </div>
            </div>
          )}

          {selectedToken ? (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Buy Price
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  {editToken ? 'Update' : 'Add to Portfolio'}
                </button>
              </div>
            </>
          ) : null}
        </form>
      </div>
    </div>
  );
};

export default AddTokenModal;