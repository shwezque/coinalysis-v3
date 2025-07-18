import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

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
    const response = await axios.get(`${COINGECKO_API_BASE}${endpoint}`, {
      params,
      headers: {
        'Accept': 'application/json',
      },
    });

    res.status(200).json(response.data);
  } catch (error: any) {
    console.error('Proxy error:', error.message);
    
    if (error.response) {
      res.status(error.response.status).json({
        error: error.response.data || 'An error occurred',
        status: error.response.status,
      });
    } else {
      res.status(500).json({
        error: 'Failed to fetch data from CoinGecko',
      });
    }
  }
}