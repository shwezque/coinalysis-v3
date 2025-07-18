import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';
  
  try {
    // Test basic connectivity
    const testUrl = `${COINGECKO_API_BASE}/ping`;
    
    const headers: any = {
      'Accept': 'application/json',
      'User-Agent': 'Coinalysis/1.0',
    };
    
    if (process.env.COINGECKO_API_KEY) {
      headers['x-cg-demo-api-key'] = process.env.COINGECKO_API_KEY;
    }
    
    console.log('Debug test - attempting to ping CoinGecko API');
    
    const response = await fetch(testUrl, { headers });
    const data = await response.json();
    
    // Try a real API call
    const marketUrl = `${COINGECKO_API_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=1&page=1`;
    const marketResponse = await fetch(marketUrl, { headers });
    const marketData = await marketResponse.json();
    
    res.status(200).json({
      success: true,
      ping: data,
      hasApiKey: !!process.env.COINGECKO_API_KEY,
      marketTest: {
        status: marketResponse.status,
        dataReceived: Array.isArray(marketData) && marketData.length > 0,
        firstCoin: marketData[0]?.name || 'No data'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      hasApiKey: !!process.env.COINGECKO_API_KEY,
      timestamp: new Date().toISOString()
    });
  }
}