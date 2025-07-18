import { Token, MarketStats } from '../types';

// Mock data to use when API fails
export const fallbackDataService = {
  getTokens(): Token[] {
    return [
      {
        id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
        current_price: 67000,
        market_cap: 1300000000000,
        market_cap_rank: 1,
        fully_diluted_valuation: 1400000000000,
        total_volume: 25000000000,
        high_24h: 68000,
        low_24h: 66000,
        price_change_24h: 1000,
        price_change_percentage_24h: 1.5,
        market_cap_change_24h: 20000000000,
        market_cap_change_percentage_24h: 1.5,
        circulating_supply: 19500000,
        total_supply: 21000000,
        max_supply: 21000000,
        ath: 69000,
        ath_change_percentage: -2.9,
        ath_date: '2021-11-10T14:24:11.849Z',
        atl: 67.81,
        atl_change_percentage: 98750,
        atl_date: '2013-07-06T00:00:00.000Z',
        roi: null,
        last_updated: new Date().toISOString(),
        sparkline_in_7d: {
          price: Array(168).fill(0).map((_, i) => 65000 + Math.random() * 4000)
        },
        price_change_percentage_24h_in_currency: 1.5,
        price_change_percentage_7d_in_currency: 5.2,
        price_change_percentage_30d_in_currency: 15.3
      },
      {
        id: 'ethereum',
        symbol: 'eth',
        name: 'Ethereum',
        image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
        current_price: 3500,
        market_cap: 420000000000,
        market_cap_rank: 2,
        fully_diluted_valuation: 420000000000,
        total_volume: 12000000000,
        high_24h: 3600,
        low_24h: 3400,
        price_change_24h: 50,
        price_change_percentage_24h: 1.4,
        market_cap_change_24h: 6000000000,
        market_cap_change_percentage_24h: 1.4,
        circulating_supply: 120000000,
        total_supply: 120000000,
        max_supply: null,
        ath: 4878,
        ath_change_percentage: -28.2,
        ath_date: '2021-11-10T14:24:19.604Z',
        atl: 0.432979,
        atl_change_percentage: 807500,
        atl_date: '2015-10-20T00:00:00.000Z',
        roi: null,
        last_updated: new Date().toISOString(),
        sparkline_in_7d: {
          price: Array(168).fill(0).map((_, i) => 3400 + Math.random() * 200)
        },
        price_change_percentage_24h_in_currency: 1.4,
        price_change_percentage_7d_in_currency: 3.8,
        price_change_percentage_30d_in_currency: 12.5
      },
      // Add more fallback tokens as needed
    ];
  },

  getMarketStats(): MarketStats {
    return {
      total_market_cap: 2500000000000,
      total_volume: 100000000000,
      market_cap_percentage: {
        btc: 52,
        eth: 16.8,
        usdt: 3.3,
        bnb: 2.5,
        sol: 2.1,
        xrp: 1.9,
        usdc: 1.8,
        steth: 1.2,
        ada: 1.1,
        avax: 0.9
      },
      market_cap_change_percentage_24h_usd: 1.8
    };
  }
};