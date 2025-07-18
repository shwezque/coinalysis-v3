import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import Navigation from './Navigation';
import SearchBar from './SearchBar';
import ThemeToggle from './ThemeToggle';
import AutoUpdateToggle from './AutoUpdateToggle';
import MobileMenu from './MobileMenu';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Desktop Navigation */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <img 
                  src="/coinalysis-logo.png" 
                  alt="Coinalysis" 
                  className="w-8 h-8 object-contain"
                />
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Coinalysis</h1>
              </div>
              <div className="hidden lg:block">
                <Navigation />
              </div>
            </div>
            
            {/* Desktop Controls */}
            <div className="hidden md:flex items-center space-x-4">
              <SearchBar />
              <ThemeToggle />
              <AutoUpdateToggle />
            </div>

            {/* Mobile Controls */}
            <div className="flex md:hidden items-center space-x-2">
              <ThemeToggle />
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Menu className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden pb-3">
            <SearchBar />
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </>
  );
};

export default Header;