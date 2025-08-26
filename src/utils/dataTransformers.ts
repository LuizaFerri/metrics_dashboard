import { Bitcoin, DollarSign, TrendingUp, BarChart3 } from "lucide-react";
import type {
  CoinGeckoMarketData,
  CoinGeckoHistoricalData,
  ChartDataTransformed,
} from "@/types/api";
import type { MetricData } from "@/types/dashboard";
import { SUPPORTED_COINS } from "@/constants/api";

const COIN_ICONS = {
  bitcoin: Bitcoin,
  ethereum: DollarSign,
  binancecoin: TrendingUp,
  cardano: BarChart3,
  solana: TrendingUp,
  "matic-network": BarChart3,
  ripple: DollarSign,
  dogecoin: Bitcoin,
  "avalanche-2": TrendingUp,
  chainlink: BarChart3,
} as const;

const COIN_COLORS = {
  bitcoin: "yellow",
  ethereum: "blue",
  binancecoin: "yellow",
  cardano: "green",
  solana: "purple",
  "matic-network": "blue",
  ripple: "blue",
  dogecoin: "yellow",
  "avalanche-2": "red",
  chainlink: "green",
} as const;

export function transformMarketDataToMetrics(
  coinData: CoinGeckoMarketData[]
): MetricData[] {
  return coinData.map((coin) => {
    const changeType: "positive" | "negative" =
      (coin.price_change_percentage_24h || 0) >= 0 ? "positive" : "negative";
    const icon = COIN_ICONS[coin.id as keyof typeof COIN_ICONS] || Bitcoin;
    const color: "blue" | "green" | "red" | "yellow" | "purple" =
      COIN_COLORS[coin.id as keyof typeof COIN_COLORS] || "blue";

    const currentPrice = isFinite(coin.current_price) ? coin.current_price : 0;
    const priceChange = isFinite(coin.price_change_percentage_24h || 0)
      ? Math.abs(coin.price_change_percentage_24h || 0)
      : 0;

    return {
      id: coin.id,
      title: `${coin.name} Price`,
      value: currentPrice,
      change: priceChange,
      changeType,
      icon,
      color,
      subtitle: coin.symbol.toUpperCase(),
      metadata: {
        marketCap: coin.market_cap,
        volume24h: coin.total_volume,
        rank: coin.market_cap_rank,
        high24h: coin.high_24h,
        low24h: coin.low_24h,
        lastUpdated: new Date(coin.last_updated),
      },
    };
  });
}

export function createPortfolioMetrics(
  coinData: CoinGeckoMarketData[]
): MetricData[] {
  const totalMarketCap = coinData.reduce(
    (sum, coin) => sum + (coin.market_cap || 0),
    0
  );
  const totalVolume = coinData.reduce(
    (sum, coin) => sum + (coin.total_volume || 0),
    0
  );

  const portfolioValue = coinData.reduce((sum, coin) => {
    const holdings = Math.max(1, 6 - (coin.market_cap_rank || 1)) * 0.1;
    return sum + (coin.current_price || 0) * holdings;
  }, 0);

  const portfolioChange = coinData.reduce((sum, coin) => {
    const holdings = Math.max(1, 6 - (coin.market_cap_rank || 1)) * 0.1;
    return sum + (coin.price_change_24h || 0) * holdings;
  }, 0);

  const portfolioChangePercent =
    portfolioValue > 0 &&
    isFinite(portfolioChange) &&
    portfolioValue - portfolioChange !== 0
      ? (portfolioChange / (portfolioValue - portfolioChange)) * 100
      : 0;

  const portfolioMetrics = [
    {
      id: "portfolio-value",
      title: "Portfolio Value",
      value: isFinite(portfolioValue) ? portfolioValue : 0,
      change: isFinite(portfolioChangePercent)
        ? Math.abs(portfolioChangePercent)
        : 0,
      changeType: (portfolioChangePercent >= 0 ? "positive" : "negative") as
        | "positive"
        | "negative",
      icon: DollarSign,
      color: "green" as const,
      subtitle: "Total Holdings",
    },
    {
      id: "total-market-cap",
      title: "Total Market Cap",
      value: isFinite(totalMarketCap) ? totalMarketCap : 0,
      change:
        Math.abs(
          coinData.reduce(
            (sum, coin) => sum + (coin.market_cap_change_percentage_24h || 0),
            0
          ) / coinData.length
        ) || 0,
      changeType: "positive" as const,
      icon: BarChart3,
      color: "blue" as const,
      subtitle: "Combined",
    },
    {
      id: "total-volume",
      title: "24h Volume",
      value: isFinite(totalVolume) ? totalVolume : 0,
      change: 12.5,
      changeType: "positive" as const,
      icon: TrendingUp,
      color: "purple" as const,
      subtitle: "Trading Activity",
    },
  ];

  return portfolioMetrics;
}

export function transformHistoricalDataToChart(
  data: CoinGeckoHistoricalData,
  metricType: "price" | "market_cap" | "volume" = "price"
): ChartDataTransformed[] {
  let sourceData: [number, number][];

  switch (metricType) {
    case "price":
      sourceData = data.prices || [];
      break;
    case "market_cap":
      sourceData = data.market_caps || [];
      break;
    case "volume":
      sourceData = data.total_volumes || [];
      break;
    default:
      sourceData = data.prices || [];
  }

  return sourceData.map(([timestamp, value]) => ({
    timestamp,
    date: new Date(timestamp),
    price: metricType === "price" ? value : 0,
    marketCap: metricType === "market_cap" ? value : 0,
    volume: metricType === "volume" ? value : 0,
  }));
}

export function findCoinData(
  coinData: CoinGeckoMarketData[],
  coinId: string
): CoinGeckoMarketData | null {
  return coinData.find((coin) => coin.id === coinId) || null;
}

export function calculateChartStats(chartData: ChartDataTransformed[]) {
  if (chartData.length === 0) {
    return {
      current: 0,
      max: 0,
      min: 0,
      avg: 0,
      change: 0,
      changePercent: 0,
    };
  }

  const values = chartData.map((d) => d.price || d.marketCap || d.volume || 0);
  const current = values[values.length - 1];
  const first = values[0];
  const max = Math.max(...values);
  const min = Math.min(...values);
  const avg = values.reduce((sum, val) => sum + val, 0) / values.length;

  const change = current - first;
  const changePercent = first > 0 ? (change / first) * 100 : 0;

  return {
    current,
    max,
    min,
    avg,
    change,
    changePercent,
  };
}

export function getMetricTypeFromId(
  metricId: string
): "price" | "market_cap" | "volume" {
  if (metricId.includes("market-cap") || metricId.includes("marketcap")) {
    return "market_cap";
  }
  if (metricId.includes("volume")) {
    return "volume";
  }
  return "price";
}

export function extractCoinIdFromMetric(metricId: string): string {
  if (metricId.includes("portfolio") || metricId.includes("total")) {
    return "bitcoin";
  }

  const supportedCoin = SUPPORTED_COINS.find(
    (coinId) => metricId.includes(coinId) || metricId.startsWith(coinId)
  );

  return supportedCoin || "bitcoin";
}

export function getCoinVisualConfig(coinId: string) {
  return {
    icon: COIN_ICONS[coinId as keyof typeof COIN_ICONS] || Bitcoin,
    color: COIN_COLORS[coinId as keyof typeof COIN_COLORS] || "text-cyan-400",
  };
}

export function validateMarketData(
  data: unknown
): data is CoinGeckoMarketData[] {
  return (
    Array.isArray(data) &&
    data.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        "id" in item &&
        typeof item.id === "string" &&
        "current_price" in item &&
        typeof item.current_price === "number" &&
        "market_cap" in item &&
        typeof item.market_cap === "number"
    )
  );
}

export function validateHistoricalData(
  data: unknown
): data is CoinGeckoHistoricalData {
  return (
    typeof data === "object" &&
    data !== null &&
    "prices" in data &&
    Array.isArray(data.prices) &&
    "market_caps" in data &&
    Array.isArray(data.market_caps) &&
    "total_volumes" in data &&
    Array.isArray(data.total_volumes)
  );
}
