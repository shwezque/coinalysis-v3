export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  const url = new URL(request.url);
  
  try {
    // Test direct API access with edge runtime
    const testEndpoints = [
      'https://api.coingecko.com/api/v3/ping',
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=1&page=1'
    ];
    
    const results = await Promise.all(testEndpoints.map(async (endpoint) => {
      try {
        const headers: HeadersInit = {
          'Accept': 'application/json',
          'User-Agent': 'Coinalysis/1.0',
        };
        
        if (process.env.COINGECKO_API_KEY) {
          headers['x-cg-demo-api-key'] = process.env.COINGECKO_API_KEY;
        }
        
        const response = await fetch(endpoint, { headers });
        const data = await response.json();
        
        return {
          endpoint,
          status: response.status,
          success: response.ok,
          data: endpoint.includes('ping') ? data : 'Data received'
        };
      } catch (error: any) {
        return {
          endpoint,
          success: false,
          error: error.message
        };
      }
    }));
    
    return new Response(
      JSON.stringify({
        runtime: 'edge',
        hasApiKey: !!process.env.COINGECKO_API_KEY,
        timestamp: new Date().toISOString(),
        tests: results,
        suggestion: 'If all tests fail, ensure COINGECKO_API_KEY is set in Vercel environment variables'
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        runtime: 'edge',
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }
}