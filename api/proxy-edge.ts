export const config = {
  runtime: 'edge',
};

const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';

export default async function handler(request: Request) {
  console.log('Edge proxy handler called');

  // Enable CORS
  const headers = new Headers({
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
    'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
  });

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  const url = new URL(request.url);
  const params = new URLSearchParams(url.search);
  const endpoint = params.get('endpoint');
  params.delete('endpoint');

  if (!endpoint) {
    return new Response(
      JSON.stringify({ error: 'Endpoint is required' }),
      { status: 400, headers }
    );
  }

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const queryString = params.toString();
  const apiUrl = `${COINGECKO_API_BASE}${cleanEndpoint}${queryString ? `?${queryString}` : ''}`;

  try {
    console.log('Making request to:', apiUrl);

    const apiHeaders: HeadersInit = {
      'Accept': 'application/json',
      'User-Agent': 'Coinalysis/1.0',
    };

    // Add API key if available
    const apiKey = process.env.COINGECKO_API_KEY;
    if (apiKey) {
      apiHeaders['x-cg-demo-api-key'] = apiKey;
      console.log('Using CoinGecko API key');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 second timeout

    const response = await fetch(apiUrl, {
      headers: apiHeaders,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        headers.set('Content-Type', 'application/json');
        return new Response(
          JSON.stringify({
            error: 'Rate limit exceeded',
            retryAfter: retryAfter || '60',
            message: 'CoinGecko API rate limit reached. Please try again later.',
          }),
          { status: 429, headers }
        );
      }
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    headers.set('Content-Type', 'application/json');
    headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    
    return new Response(JSON.stringify(data), { status: 200, headers });
  } catch (error: any) {
    console.error('Edge proxy error:', error);
    
    headers.set('Content-Type', 'application/json');
    
    if (error.name === 'AbortError') {
      return new Response(
        JSON.stringify({
          error: 'Request timeout',
          message: 'The request took too long to complete',
        }),
        { status: 504, headers }
      );
    }
    
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch data',
        message: error.message,
        endpoint: cleanEndpoint,
      }),
      { status: 500, headers }
    );
  }
}