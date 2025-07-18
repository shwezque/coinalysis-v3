import type { VercelRequest, VercelResponse } from '@vercel/node';

const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { endpoint, ...params } = req.query;

  if (!endpoint || typeof endpoint !== 'string') {
    return res.status(400).json({ error: 'Endpoint is required' });
  }

  try {
    // Use native fetch instead of axios to avoid dependency issues
    const queryString = new URLSearchParams(params as any).toString();
    const url = `${COINGECKO_API_BASE}${endpoint}${queryString ? `?${queryString}` : ''}`;
    
    console.log('Fetching from:', url);
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Coinalysis/1.0',
      },
    });

    if (!response.ok) {
      // Check for rate limit
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        res.status(429).json({
          error: 'Rate limit exceeded',
          retryAfter: retryAfter || '60',
          message: 'CoinGecko API rate limit reached. Please try again later.',
        });
        return;
      }
      throw new Error(`CoinGecko API responded with status: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error: any) {
    console.error('Proxy error:', error.message);
    
    res.status(500).json({
      error: 'Failed to fetch data from CoinGecko',
      message: error.message,
      endpoint: endpoint,
    });
  }
}