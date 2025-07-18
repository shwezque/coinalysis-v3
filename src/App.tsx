import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './hooks/useTheme';
import { PortfolioProvider } from './hooks/usePortfolio';
import { AIInsightsProvider } from './hooks/useAIInsights';
import { AutoUpdateProvider } from './hooks/useAutoUpdate';
import { StarredTokensProvider } from './hooks/useStarredTokens';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import TokensPage from './pages/TokensPage';
import CategoriesPage from './pages/CategoriesPage';
import PortfolioPage from './pages/PortfolioPage';
import CategoryDetail from './components/categories/CategoryDetail';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AutoUpdateProvider>
          <StarredTokensProvider>
            <PortfolioProvider>
              <AIInsightsProvider>
                <Router>
                  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
                    <Header />
                    <main className="pt-16 flex-1 pb-8">
                      <Routes>
                        <Route path="/" element={<TokensPage />} />
                        <Route path="/categories" element={<CategoriesPage />} />
                        <Route path="/categories/:categoryId" element={<CategoryDetail />} />
                        <Route path="/portfolio" element={<PortfolioPage />} />
                      </Routes>
                    </main>
                    <Footer />
                  </div>
                </Router>
              </AIInsightsProvider>
            </PortfolioProvider>
          </StarredTokensProvider>
        </AutoUpdateProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
