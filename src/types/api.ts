export interface CoinGeckoMarketData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: {
    times: number;
    currency: string;
    percentage: number;
  } | null;
  last_updated: string;
}

export interface CoinGeckoHistoricalData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

export interface CoinGeckoDetails {
  id: string;
  symbol: string;
  name: string;
  description: {
    en: string;
  };
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  market_cap_rank: number;
  market_data: {
    current_price: {
      usd: number;
    };
    market_cap: {
      usd: number;
    };
    total_volume: {
      usd: number;
    };
    high_24h: {
      usd: number;
    };
    low_24h: {
      usd: number;
    };
    price_change_24h: number;
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_30d: number;
    price_change_percentage_1y: number;
    ath: {
      usd: number;
    };
    ath_date: {
      usd: string;
    };
    atl: {
      usd: number;
    };
    atl_date: {
      usd: string;
    };
    circulating_supply: number;
    total_supply: number | null;
    max_supply: number | null;
  };
  last_updated: string;
}

export interface DateRange {
  from?: Date;
  to?: Date;
}

export interface ApiError {
  type: "network" | "api" | "rate_limit" | "server" | "validation";
  message: string;
  code?: string;
  status?: number;
  originalError?: Error;
}

export interface HistoricalDataParams {
  coinId: string;
  dateRange: DateRange;
  vs_currency?: string;
  interval?: "hourly" | "daily";
}

export interface ApiStatus {
  isOnline: boolean;
  lastChecked: Date;
  responseTime?: number;
}

export interface CoinDataTransformed {
  id: string;
  name: string;
  symbol: string;
  price: number;
  marketCap: number;
  volume24h: number;
  change24h: number;
  changePercent24h: number;
  rank: number;
  lastUpdated: Date;
}

export interface ChartDataTransformed {
  timestamp: number;
  date: Date;
  price: number;
  marketCap: number;
  volume: number;
}
