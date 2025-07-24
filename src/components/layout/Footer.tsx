import React from 'react';
import { Github, Twitter, ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-2">
              <img 
                src="/coinalysis-logo.png" 
                alt="Coinalysis" 
                className="w-8 h-8 object-contain"
              />
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Coinalysis</h3>
            </div>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-3">
              Track prices, manage portfolios, and get AI insights.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs md:text-sm font-semibold text-gray-900 dark:text-white mb-2">Quick Links</h4>
            <ul className="space-y-1">
              <li>
                <a href="/" className="text-xs md:text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Token Prices
                </a>
              </li>
              <li>
                <a href="/categories" className="text-xs md:text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Categories
                </a>
              </li>
              <li>
                <a href="/portfolio" className="text-xs md:text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Portfolio
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs md:text-sm font-semibold text-gray-900 dark:text-white mb-2">Resources</h4>
            <ul className="space-y-1">
              <li>
                <a 
                  href="https://www.coingecko.com/api" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs md:text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center"
                >
                  API Documentation
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-xs md:text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-xs md:text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-xs text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Coinalysis. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;