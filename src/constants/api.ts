export const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";

export const COINGECKO_DEV_URL = "/api/coingecko";

export const COINGECKO_API_KEY = import.meta.env.VITE_COINGECKO_API_KEY 

export const getApiBaseUrl = (): string => {
  if (import.meta.env.DEV) {
    return COINGECKO_DEV_URL;
  }
  return COINGECKO_BASE_URL;
};

export const shouldUseApiKey = (): boolean => {
  return !!COINGECKO_API_KEY;
};

export const API_ENDPOINTS = {
  MARKET_DATA: "/coins/markets",
  HISTORICAL_RANGE: "/coins",
  COIN_DETAILS: "/coins",
  TRENDING: "/search/trending",
  GLOBAL: "/global",
  PING: "/ping",
} as const;

export const RATE_LIMIT_DELAY = 5000; 

export const SUPPORTED_COINS = [
  "bitcoin",
  "ethereum",
  "binancecoin",
  "cardano",
  "solana",
  "ripple",
  "dogecoin",
  "matic-network",
  "avalanche-2",
  "chainlink",
] as const;

export const SUPPORTED_COINS_DETAILS = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC" },
  { id: "ethereum", name: "Ethereum", symbol: "ETH" },
  { id: "binancecoin", name: "BNB", symbol: "BNB" },
  { id: "cardano", name: "Cardano", symbol: "ADA" },
  { id: "solana", name: "Solana", symbol: "SOL" },
  { id: "polygon", name: "Polygon", symbol: "MATIC" },
] as const;

export const REQUEST_TIMEOUT = 15000;

export const MAX_RETRIES = 3;

export const CACHE_TIMES = {
  MARKET_DATA: 60 * 1000,
  HISTORICAL_DATA: 5 * 60 * 1000,
  COIN_DETAILS: 10 * 60 * 1000,
  API_STATUS: 30 * 1000,
} as const;

export const RETRY_CONFIG = {
  INITIAL_DELAY: 1000,
  MAX_DELAY: 30000,
  BACKOFF_FACTOR: 2,
} as const;

export const DEFAULT_PARAMS = {
  vs_currency: "usd",
  include_24hr_change: true,
  include_market_cap: true,
  include_24hr_vol: true,
  price_change_percentage: "24h,7d,30d,1y",
} as const;

export const API_LIMITS = {
  CALLS_PER_MINUTE: 50,
  CALLS_PER_MONTH: 10000,
  DEMO_MODE_TIMEOUT: 30000,
} as const;

export const DEFAULT_CURRENCY = "usd";

export const API_RATE_LIMITS = {
  PUBLIC_API_CALLS_PER_MINUTE: 30,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;
