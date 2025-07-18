export interface CategoryToken {
  symbol: string;
  id: string;
}

export interface CategoryDefinition {
  id: string;
  name: string;
  description: string;
  tokens: CategoryToken[];
  icon: string;
  color: string;
}

// Comprehensive token categorization based on 2024 market data
export const categoryDefinitions: CategoryDefinition[] = [
  {
    id: 'defi',
    name: 'DeFi',
    description: 'Decentralized Finance protocols and platforms',
    icon: 'Coins',
    color: 'blue',
    tokens: [
      { symbol: 'UNI', id: 'uniswap' },
      { symbol: 'AAVE', id: 'aave' },
      { symbol: 'MKR', id: 'maker' },
      { symbol: 'COMP', id: 'compound' },
      { symbol: 'CRV', id: 'curve-dao-token' },
      { symbol: 'LDO', id: 'lido-dao' },
      { symbol: 'CAKE', id: 'pancakeswap-token' },
      { symbol: 'BAL', id: 'balancer' },
      { symbol: 'YFI', id: 'yearn-finance' },
      { symbol: '1INCH', id: '1inch' },
      { symbol: 'SUSHI', id: 'sushi' },
      { symbol: 'SNX', id: 'synthetix-network-token' },
      { symbol: 'DYDX', id: 'dydx' },
      { symbol: 'RUNE', id: 'thorchain' },
      { symbol: 'GMX', id: 'gmx' },
      { symbol: 'RPL', id: 'rocket-pool' },
      { symbol: 'PENDLE', id: 'pendle' },
      { symbol: 'ENA', id: 'ethena' },
      { symbol: 'ETHFI', id: 'ether-fi' },
      { symbol: 'JOE', id: 'trader-joe' },
    ]
  },
  {
    id: 'ai',
    name: 'AI',
    description: 'Artificial Intelligence and Machine Learning tokens',
    icon: 'Brain',
    color: 'purple',
    tokens: [
      { symbol: 'FET', id: 'fetch-ai' },
      { symbol: 'AGIX', id: 'singularitynet' },
      { symbol: 'OCEAN', id: 'ocean-protocol' },
      { symbol: 'RNDR', id: 'render-token' },
      { symbol: 'TAO', id: 'bittensor' },
      { symbol: 'GRT', id: 'the-graph' },
      { symbol: 'ORAI', id: 'oraichain-token' },
      { symbol: 'CTXC', id: 'cortex' },
      { symbol: 'PHB', id: 'phoenix-global' },
      { symbol: 'ARKM', id: 'arkham' },
      { symbol: 'AIOZ', id: 'aioz-network' },
      { symbol: 'NMR', id: 'numeraire' },
      { symbol: 'GLM', id: 'golem' },
      { symbol: 'AKASH', id: 'akash-network' },
      { symbol: 'AIT', id: 'aitradetokne' },
    ]
  },
  {
    id: 'layer-1',
    name: 'Layer 1',
    description: 'Base layer blockchain protocols',
    icon: 'Layers',
    color: 'green',
    tokens: [
      { symbol: 'BTC', id: 'bitcoin' },
      { symbol: 'ETH', id: 'ethereum' },
      { symbol: 'SOL', id: 'solana' },
      { symbol: 'ADA', id: 'cardano' },
      { symbol: 'AVAX', id: 'avalanche-2' },
      { symbol: 'DOT', id: 'polkadot' },
      { symbol: 'NEAR', id: 'near-protocol' },
      { symbol: 'ATOM', id: 'cosmos' },
      { symbol: 'ALGO', id: 'algorand' },
      { symbol: 'FTM', id: 'fantom' },
      { symbol: 'ICP', id: 'internet-computer' },
      { symbol: 'HBAR', id: 'hedera-hashgraph' },
      { symbol: 'VET', id: 'vechain' },
      { symbol: 'BNB', id: 'binancecoin' },
      { symbol: 'XRP', id: 'ripple' },
      { symbol: 'TRX', id: 'tron' },
      { symbol: 'TON', id: 'the-open-network' },
      { symbol: 'APT', id: 'aptos' },
      { symbol: 'SUI', id: 'sui' },
      { symbol: 'SEI', id: 'sei-network' },
      { symbol: 'TIA', id: 'celestia' },
      { symbol: 'KAS', id: 'kaspa' },
      { symbol: 'INJ', id: 'injective-protocol' },
    ]
  },
  {
    id: 'meme',
    name: 'Meme',
    description: 'Community-driven meme cryptocurrencies',
    icon: 'Image',
    color: 'pink',
    tokens: [
      { symbol: 'DOGE', id: 'dogecoin' },
      { symbol: 'SHIB', id: 'shiba-inu' },
      { symbol: 'PEPE', id: 'pepe' },
      { symbol: 'FLOKI', id: 'floki' },
      { symbol: 'BONK', id: 'bonk' },
      { symbol: 'WIF', id: 'dogwifhat' },
      { symbol: 'MEME', id: 'memecoin' },
      { symbol: 'BRETT', id: 'brett' },
      { symbol: 'BOME', id: 'book-of-meme' },
      { symbol: 'MEW', id: 'cat-in-a-dogs-world' },
      { symbol: 'POPCAT', id: 'popcat' },
      { symbol: 'PONKE', id: 'ponke' },
      { symbol: 'TURBO', id: 'turbo' },
      { symbol: 'MOG', id: 'mog-coin' },
      { symbol: 'BABYDOGE', id: 'baby-doge-coin' },
    ]
  },
  {
    id: 'rwa',
    name: 'RWA',
    description: 'Real World Assets tokenization',
    icon: 'Building',
    color: 'orange',
    tokens: [
      { symbol: 'ONDO', id: 'ondo-finance' },
      { symbol: 'MPL', id: 'maple' },
      { symbol: 'RIO', id: 'realio-network' },
      { symbol: 'ASTR', id: 'astar' },
      { symbol: 'CPOOL', id: 'clearpool' },
      { symbol: 'TRU', id: 'truefi' },
      { symbol: 'CFG', id: 'centrifuge' },
      { symbol: 'OM', id: 'mantra-dao' },
      { symbol: 'POLYX', id: 'polymesh' },
      { symbol: 'RSR', id: 'reserve-rights-token' },
      { symbol: 'DUSK', id: 'dusk-network' },
      { symbol: 'GFI', id: 'goldfinch-protocol' },
      { symbol: 'CRE', id: 'creditcoin' },
    ]
  },
  {
    id: 'depin',
    name: 'DePIN',
    description: 'Decentralized Physical Infrastructure Networks',
    icon: 'Globe',
    color: 'indigo',
    tokens: [
      { symbol: 'FIL', id: 'filecoin' },
      { symbol: 'AR', id: 'arweave' },
      { symbol: 'HNT', id: 'helium' },
      { symbol: 'RNDR', id: 'render-token' },
      { symbol: 'IOTX', id: 'iotex' },
      { symbol: 'MOBILE', id: 'helium-mobile' },
      { symbol: 'HONEY', id: 'hivemapper' },
      { symbol: 'DIMO', id: 'dimo' },
      { symbol: 'AKT', id: 'akash-network' },
      { symbol: 'STORJ', id: 'storj' },
      { symbol: 'SC', id: 'siacoin' },
      { symbol: 'THETA', id: 'theta-token' },
      { symbol: 'TFUEL', id: 'theta-fuel' },
    ]
  }
];

// Helper function to get token category
export const getTokenCategory = (token: { symbol: string; id: string; name: string }): string | null => {
  const symbol = token.symbol.toLowerCase();
  const id = token.id.toLowerCase();
  
  for (const category of categoryDefinitions) {
    const hasToken = category.tokens.some(t => 
      t.symbol.toLowerCase() === symbol || 
      t.id.toLowerCase() === id
    );
    
    if (hasToken) {
      return category.id;
    }
  }
  
  return null;
};

// Get category definition by ID
export const getCategoryById = (categoryId: string): CategoryDefinition | undefined => {
  return categoryDefinitions.find(cat => cat.id === categoryId);
};

// Get tokens for a specific category
export const getTokensForCategory = (categoryId: string): CategoryToken[] => {
  const category = getCategoryById(categoryId);
  return category ? category.tokens : [];
};