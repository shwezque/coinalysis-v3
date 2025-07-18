import type { VercelRequest, VercelResponse } from '@vercel/node';

const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('Proxy handler called:', {
    method: req.method,
    query: req.query,
    headers: req.headers
  });

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
    console.error('Missing endpoint parameter');
    return res.status(400).json({ 
      error: 'Endpoint is required',
      received: req.query 
    });
  }

  // Ensure endpoint starts with /
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  try {
    // Use native fetch instead of axios to avoid dependency issues
    const queryString = new URLSearchParams(params as any).toString();
    const url = `${COINGECKO_API_BASE}${cleanEndpoint}${queryString ? `?${queryString}` : ''}`;
    
    console.log('Proxy request:', {
      endpoint: cleanEndpoint,
      params,
      fullUrl: url
    });
    
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000); // 25 second timeout
    
    // Add API key if available (helps with rate limits)
    const headers: any = {
      'Accept': 'application/json',
      'User-Agent': 'Coinalysis/1.0',
    };
    
    if (process.env.COINGECKO_API_KEY) {
      headers['x-cg-demo-api-key'] = process.env.COINGECKO_API_KEY;
    }
    
    const response = await fetch(url, {
      headers,
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout));

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
    
    // Set cache headers
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    res.status(200).json(data);
  } catch (error: any) {
    console.error('Proxy error:', {
      message: error.message,
      name: error.name,
      endpoint: cleanEndpoint,
      params
    });
    
    // Handle specific error types
    let statusCode = 500;
    let errorMessage = 'Failed to fetch data from CoinGecko';
    
    if (error.name === 'AbortError') {
      statusCode = 504;
      errorMessage = 'Request timeout - CoinGecko API is slow to respond';
    } else if (error.message.includes('ECONNREFUSED')) {
      errorMessage = 'Cannot connect to CoinGecko API';
    } else if (error.message.includes('ETIMEDOUT')) {
      statusCode = 504;
      errorMessage = 'Connection to CoinGecko API timed out';
    }
    
    // Don't expose internal errors in production
    const isProduction = process.env.NODE_ENV === 'production';
    
    res.status(statusCode).json({
      error: errorMessage,
      message: isProduction ? 'Please try again in a few moments' : error.message,
      endpoint: cleanEndpoint,
      timestamp: new Date().toISOString(),
      details: isProduction ? undefined : {
        stack: error.stack,
        url: `${COINGECKO_API_BASE}${cleanEndpoint}`
      }
    });
  }
}