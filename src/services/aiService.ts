import { Token, AIInsight } from '../types';

// Mock AI service - in production, this would call OpenAI/Claude API
export const aiService = {
  async generateInsights(token: Token): Promise<AIInsight> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate mock insights based on token data
    const priceChange = token.price_change_percentage_24h || 0;
    const sentiment = priceChange > 5 ? 'bullish' : priceChange < -5 ? 'bearish' : 'neutral';
    
    // Generate price predictions
    const nearTermMultiplier = sentiment === 'bullish' ? 1.1 : sentiment === 'bearish' ? 0.95 : 1.02;
    const mediumTermMultiplier = sentiment === 'bullish' ? 1.25 : sentiment === 'bearish' ? 0.9 : 1.05;

    const factors = generateFactors(token, sentiment);
    const summary = generateSummary(token, sentiment);

    return {
      tokenId: token.id,
      summary,
      sentiment,
      predictions: {
        nearTerm: {
          price: token.current_price * nearTermMultiplier,
          confidence: Math.random() * 30 + 60, // 60-90%
          timeframe: '7-30 days',
        },
        mediumTerm: {
          price: token.current_price * mediumTermMultiplier,
          confidence: Math.random() * 25 + 50, // 50-75%
          timeframe: '1-3 months',
        },
      },
      factors,
      lastUpdated: new Date().toISOString(),
    };
  },
};

function generateFactors(token: Token, sentiment: string): string[] {
  const baseFactors = [
    `Market cap rank: #${token.market_cap_rank}`,
    `24h volume: $${(token.total_volume / 1e9).toFixed(2)}B`,
    `Circulating supply: ${((token.circulating_supply / token.total_supply!) * 100).toFixed(1)}%`,
  ];

  const sentimentFactors = {
    bullish: [
      'Strong buying pressure observed',
      'Breaking key resistance levels',
      'Positive market sentiment',
      'Institutional interest increasing',
    ],
    bearish: [
      'Selling pressure dominating',
      'Support levels being tested',
      'Market uncertainty rising',
      'Profit-taking activity observed',
    ],
    neutral: [
      'Consolidation phase ongoing',
      'Market awaiting catalyst',
      'Trading within range',
      'Mixed signals from indicators',
    ],
  };

  return [...baseFactors, ...sentimentFactors[sentiment as keyof typeof sentimentFactors]];
}

function generateSummary(token: Token, sentiment: string): string {
  const summaries = {
    bullish: `${token.name} is showing strong bullish momentum with ${token.price_change_percentage_24h?.toFixed(2)}% gains in the last 24 hours. Technical indicators suggest continued upward movement, supported by increasing volume and positive market sentiment. Key resistance levels are being tested, and a breakout could lead to further gains.`,
    bearish: `${token.name} is experiencing bearish pressure with a ${Math.abs(token.price_change_percentage_24h || 0).toFixed(2)}% decline in the last 24 hours. Technical analysis indicates potential further downside as support levels weaken. Traders should watch for key support zones and consider risk management strategies.`,
    neutral: `${token.name} is trading sideways with ${Math.abs(token.price_change_percentage_24h || 0).toFixed(2)}% movement in the last 24 hours. The market appears to be in a consolidation phase, with balanced buying and selling pressure. A catalyst may be needed to determine the next directional move.`,
  };

  return summaries[sentiment as keyof typeof summaries];
}