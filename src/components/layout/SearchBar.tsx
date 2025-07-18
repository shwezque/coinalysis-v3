import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useTokenSearch } from '../../hooks/useTokenSearch';
import SearchResults from '../search/SearchResults';
import { Token } from '../../types';

interface SearchBarProps {
  onTokenSelect?: (token: Token) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onTokenSelect }) => {
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const {
    searchQuery,
    searchResults,
    isLoading,
    isSearching,
    handleSearch,
    clearSearch,
  } = useTokenSearch();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleClear = () => {
    clearSearch();
    inputRef.current?.focus();
  };

  const handleClose = () => {
    setIsFocused(false);
    clearSearch();
  };

  const showResults = isFocused && (isSearching || searchResults.length > 0);

  return (
    <div ref={searchRef} className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="Search tokens..."
            className="pl-10 pr-10 py-2 w-64 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      {showResults && (
        <SearchResults
          results={searchResults}
          isLoading={isLoading}
          onClose={handleClose}
          onTokenSelect={onTokenSelect}
        />
      )}
    </div>
  );
};

export default SearchBar;