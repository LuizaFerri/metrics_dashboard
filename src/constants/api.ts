
export const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3'

export const API_ENDPOINTS = {
  COINS_MARKETS: '/coins/markets',
  COIN_HISTORY: '/coins/{id}/market_chart/range',
  PING: '/ping'
} as const

export const DEFAULT_CURRENCY = 'usd'

export const API_RATE_LIMITS = {
  PUBLIC_API_CALLS_PER_MINUTE: 30,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000 // milliseconds
} as const

export const SUPPORTED_COINS = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
  { id: 'binancecoin', name: 'BNB', symbol: 'BNB' },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA' },
  { id: 'solana', name: 'Solana', symbol: 'SOL' },
  { id: 'polkadot', name: 'Polkadot', symbol: 'DOT' },
  { id: 'chainlink', name: 'Chainlink', symbol: 'LINK' },
  { id: 'polygon', name: 'Polygon', symbol: 'MATIC' }
] as const
