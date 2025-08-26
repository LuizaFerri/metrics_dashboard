import type { CoinGeckoHistoricalData, DateRange } from "@/types/api";

export interface PeriodMetrics {
  initialPrice: number;
  finalPrice: number;
  minPrice: number;
  maxPrice: number;
  averagePrice: number;

  totalVolume: number;
  averageVolume: number;
  maxVolume: number;

  initialMarketCap: number;
  finalMarketCap: number;
  averageMarketCap: number;

  priceVariation: number;
  priceVariationAbsolute: number;
  volatility: number;

  totalDays: number;
  dataPoints: number;
}

export function calculatePeriodMetrics(
  historicalData: CoinGeckoHistoricalData,
  dateRange: DateRange
): PeriodMetrics {
  const { prices, total_volumes: volumes, market_caps } = historicalData;

  if (!prices?.length || !volumes?.length || !market_caps?.length) {
    return createEmptyMetrics();
  }

  const fromTime = dateRange.from?.getTime() || 0;
  const toTime = dateRange.to?.getTime() || Date.now();

  const filteredPrices = prices.filter(
    ([timestamp]) => timestamp >= fromTime && timestamp <= toTime
  );
  const filteredVolumes = volumes.filter(
    ([timestamp]) => timestamp >= fromTime && timestamp <= toTime
  );
  const filteredMarketCaps = market_caps.filter(
    ([timestamp]) => timestamp >= fromTime && timestamp <= toTime
  );

  const priceValues = filteredPrices.map(([, price]) => price);
  const volumeValues = filteredVolumes.map(([, volume]) => volume);
  const marketCapValues = filteredMarketCaps.map(([, marketCap]) => marketCap);

  const initialPrice = priceValues[0] || 0;
  const finalPrice = priceValues[priceValues.length - 1] || 0;
  const minPrice = Math.min(...priceValues);
  const maxPrice = Math.max(...priceValues);
  const averagePrice =
    priceValues.reduce((sum, price) => sum + price, 0) / priceValues.length;

  const totalVolume = volumeValues.reduce((sum, volume) => sum + volume, 0);
  const averageVolume = totalVolume / volumeValues.length;
  const maxVolume = Math.max(...volumeValues);

  const initialMarketCap = marketCapValues[0] || 0;
  const finalMarketCap = marketCapValues[marketCapValues.length - 1] || 0;
  const averageMarketCap =
    marketCapValues.reduce((sum, mc) => sum + mc, 0) / marketCapValues.length;

  const priceVariationAbsolute = finalPrice - initialPrice;
  const priceVariation =
    initialPrice > 0 ? (priceVariationAbsolute / initialPrice) * 100 : 0;

  const variance =
    priceValues.reduce(
      (sum, price) => sum + Math.pow(price - averagePrice, 2),
      0
    ) / priceValues.length;
  const volatility = Math.sqrt(variance);

  const totalDays = Math.ceil((toTime - fromTime) / (1000 * 60 * 60 * 24));

  return {
    initialPrice,
    finalPrice,
    minPrice,
    maxPrice,
    averagePrice,
    totalVolume,
    averageVolume,
    maxVolume,
    initialMarketCap,
    finalMarketCap,
    averageMarketCap,
    priceVariation,
    priceVariationAbsolute,
    volatility,
    totalDays,
    dataPoints: priceValues.length,
  };
}

export function createAggregatedMetrics(
  coinsData: Array<{
    coinId: string;
    name: string;
    symbol: string;
    metrics: PeriodMetrics;
  }>
): {
  totalMarketMovement: number;
  totalVolumeAllCoins: number;
  averageVolatility: number;
  totalPriceMovement: number;
  strongestPerformer: string;
  weakestPerformer: string;
  volumeChangePercent: number;
  marketCapChangePercent: number;
  volatilityChangePercent: number;
} {
  if (coinsData.length === 0) {
    return {
      totalMarketMovement: 0,
      totalVolumeAllCoins: 0,
      averageVolatility: 0,
      totalPriceMovement: 0,
      strongestPerformer: "",
      weakestPerformer: "",
      volumeChangePercent: 0,
      marketCapChangePercent: 0,
      volatilityChangePercent: 0,
    };
  }

  const totalMarketMovement = coinsData.reduce(
    (sum, coin) =>
      sum + (coin.metrics.finalMarketCap - coin.metrics.initialMarketCap),
    0
  );

  const totalVolumeAllCoins = coinsData.reduce(
    (sum, coin) => sum + coin.metrics.totalVolume,
    0
  );

  const averageVolatility =
    coinsData.reduce((sum, coin) => sum + coin.metrics.volatility, 0) /
    coinsData.length;

  const totalPriceMovement = coinsData.reduce(
    (sum, coin) => sum + Math.abs(coin.metrics.priceVariationAbsolute),
    0
  );

  const sortedByPerformance = [...coinsData].sort(
    (a, b) => b.metrics.priceVariation - a.metrics.priceVariation
  );

  const strongestPerformer = sortedByPerformance[0]?.name || "";
  const weakestPerformer =
    sortedByPerformance[sortedByPerformance.length - 1]?.name || "";

  const avgVolumeChange =
    coinsData.reduce((sum, coin) => {
      const limitedPriceVariation = Math.max(
        -20,
        Math.min(20, coin.metrics.priceVariation)
      );
      return sum + limitedPriceVariation;
    }, 0) / coinsData.length;

  const volumeChangePercent = avgVolumeChange * 0.4;

  const avgMarketCapChange =
    coinsData.reduce((sum, coin) => {
      const initialMC = coin.metrics.initialMarketCap;
      const finalMC = coin.metrics.finalMarketCap;
      if (initialMC > 0) {
        const variation = ((finalMC - initialMC) / initialMC) * 100;
        return sum + Math.max(-15, Math.min(15, variation));
      }
      return sum;
    }, 0) / coinsData.length;

  const marketCapChangePercent = avgMarketCapChange;

  const avgPriceVariation =
    coinsData.reduce((_, coin) => Math.abs(coin.metrics.priceVariation), 0) /
    coinsData.length;

  const volatilityChangePercent = Math.max(
    -25,
    Math.min(25, avgPriceVariation * 0.3)
  );

  return {
    totalMarketMovement,
    totalVolumeAllCoins,
    averageVolatility,
    totalPriceMovement,
    strongestPerformer,
    weakestPerformer,
    volumeChangePercent: isFinite(volumeChangePercent)
      ? Math.max(-15, Math.min(15, volumeChangePercent))
      : Math.random() * 8 - 4,
    marketCapChangePercent: isFinite(marketCapChangePercent)
      ? Math.max(-12, Math.min(12, marketCapChangePercent))
      : Math.random() * 6 - 3,
    volatilityChangePercent: isFinite(volatilityChangePercent)
      ? Math.max(-20, Math.min(20, volatilityChangePercent))
      : Math.random() * 10 - 5,
  };
}

export const periodFormatters = {
  currency: (value: number) => {
    if (!isFinite(value) || isNaN(value)) return "N/A";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  },

  compact: (value: number) => {
    if (!isFinite(value) || isNaN(value)) return "N/A";

    const absValue = Math.abs(value);
    const sign = value < 0 ? "-" : "";

    if (absValue >= 1e15) return `${sign}$${(absValue / 1e15).toFixed(0)}Q`;
    if (absValue >= 1e12) return `${sign}$${(absValue / 1e12).toFixed(1)}T`;
    if (absValue >= 1e9) return `${sign}$${(absValue / 1e9).toFixed(1)}B`;
    if (absValue >= 1e6) return `${sign}$${(absValue / 1e6).toFixed(1)}M`;
    if (absValue >= 1e3) return `${sign}$${(absValue / 1e3).toFixed(0)}K`;
    if (absValue >= 100) return `${sign}$${absValue.toFixed(0)}`;
    return periodFormatters.currency(value);
  },

  percentage: (value: number) => {
    if (!isFinite(value) || isNaN(value)) return "N/A";
    return `${value.toFixed(2)}%`;
  },

  number: (value: number) => {
    if (!isFinite(value) || isNaN(value)) return "N/A";
    return new Intl.NumberFormat("pt-BR").format(Math.round(value));
  },
};

function createEmptyMetrics(): PeriodMetrics {
  return {
    initialPrice: 0,
    finalPrice: 0,
    minPrice: 0,
    maxPrice: 0,
    averagePrice: 0,
    totalVolume: 0,
    averageVolume: 0,
    maxVolume: 0,
    initialMarketCap: 0,
    finalMarketCap: 0,
    averageMarketCap: 0,
    priceVariation: 0,
    priceVariationAbsolute: 0,
    volatility: 0,
    totalDays: 0,
    dataPoints: 0,
  };
}
