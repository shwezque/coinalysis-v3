// Direct API service that bypasses the proxy for testing
export const directApiService = {
  async fetchTokensDirect() {
    try {
      // Try multiple endpoints
      const endpoints = [
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=24h,7d,30d',
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false',
      ];

      for (const url of endpoints) {
        try {
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            console.log('Direct API call successful');
            return { success: true, data };
          }
        } catch (e) {
          console.error('Direct API attempt failed:', e);
        }
      }

      throw new Error('All direct API attempts failed');
    } catch (error) {
      console.error('Direct API service error:', error);
      return { success: false, error };
    }
  },

  // Alternative: Use a public CORS proxy as last resort
  async fetchViaPublicProxy() {
    try {
      const proxyUrl = 'https://corsproxy.io/?';
      const targetUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1';
      
      const response = await fetch(proxyUrl + encodeURIComponent(targetUrl));
      
      if (response.ok) {
        const data = await response.json();
        console.log('Public proxy call successful');
        return { success: true, data };
      }
      
      throw new Error('Public proxy request failed');
    } catch (error) {
      console.error('Public proxy error:', error);
      return { success: false, error };
    }
  }
};