import { useQuery, useQueryClient } from '@tanstack/react-query'
import { BarChart3, TrendingUp, Activity } from 'lucide-react'
import { coinGeckoApi } from '@/services/coinGeckoApi'
import { 
  transformMarketDataToMetrics, 
  createPortfolioMetrics,
  transformHistoricalDataToChart,
  extractCoinIdFromMetric,
  getMetricTypeFromId,
  validateMarketData,
  validateHistoricalData
} from '@/utils/dataTransformers'
import { calculatePeriodMetrics, createAggregatedMetrics, type PeriodMetrics } from '@/utils/periodCalculations'
import { getCachedPeriodComparison } from '@/utils/periodComparison'
import { SUPPORTED_COINS, CACHE_TIMES } from '@/constants/api'
import type { DateRange, CoinGeckoHistoricalData } from '@/types/api'
import type { MetricData } from '@/types/dashboard'

interface CoinHistoricalDataWithMetrics {
  coinId: string
  name: string
  symbol: string
  metrics: PeriodMetrics
  rawData: CoinGeckoHistoricalData
}

export function useMarketData() {
  return useQuery({
    queryKey: ['market-data', SUPPORTED_COINS],
    queryFn: async () => {
      const data = await coinGeckoApi.getMarketData([...SUPPORTED_COINS])
      
      if (!validateMarketData(data)) {
        throw new Error('Dados de mercado inválidos recebidos')
      }
      
      return data
    },
    staleTime: CACHE_TIMES.MARKET_DATA,
    refetchInterval: CACHE_TIMES.MARKET_DATA,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

export function useAllCoinsHistoricalData(dateRange: DateRange) {
  return useQuery({
    queryKey: ['all-coins-historical', SUPPORTED_COINS, dateRange.from, dateRange.to],
    queryFn: async () => {
      const allCoinsData = await Promise.all(
        SUPPORTED_COINS.map(async (coinId) => {
          try {
            const data = await coinGeckoApi.getHistoricalData(coinId, dateRange)
            const metrics = calculatePeriodMetrics(data, dateRange)
            
            return {
              coinId,
              name: coinId.charAt(0).toUpperCase() + coinId.slice(1),
              symbol: coinId.toUpperCase(),
              metrics,
              rawData: data
            }
          } catch {
            return null
          }
        })
      )

      const validCoinsData = allCoinsData.filter(Boolean) as CoinHistoricalDataWithMetrics[]
      
      return validCoinsData
    },
    enabled: dateRange.from && dateRange.to && Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)) >= 1,
    staleTime: CACHE_TIMES.HISTORICAL_DATA,
    retry: 2,
  })
}

export function useDashboardMetrics(dateRange: DateRange): {
  data: MetricData[] | undefined
  isLoading: boolean
  error: Error | null
  refetch: () => void
} {
  const { data: marketData, isLoading: isLoadingMarket, error: marketError, refetch: refetchMarket } = useMarketData()
  const { data: historicalData, isLoading: isLoadingHistorical, error: historicalError, refetch: refetchHistorical } = useAllCoinsHistoricalData(dateRange)
  
  const isLoading = isLoadingMarket || isLoadingHistorical
  const error = marketError || historicalError
  
  const transformedData = marketData ? [
    ...transformMarketDataToMetrics(marketData),
    ...(historicalData ? createPeriodBasedMetrics(historicalData, dateRange) : createPortfolioMetrics(marketData))
  ] : undefined

  const refetch = () => {
    refetchMarket()
    refetchHistorical()
  }

  return {
    data: transformedData,
    isLoading,
    error,
    refetch
  }
}

export function useHistoricalData(
  metricId: string | null,
  dateRange: DateRange,
  enabled: boolean = true
) {
  const coinId = metricId ? extractCoinIdFromMetric(metricId) : ''
  const metricType = metricId ? getMetricTypeFromId(metricId) : 'price'

  return useQuery({
    queryKey: ['historical-data', coinId, dateRange.from, dateRange.to, metricType],
    queryFn: async () => {
      const data = await coinGeckoApi.getHistoricalData(coinId, dateRange)
      
      if (!validateHistoricalData(data)) {
        throw new Error('Dados históricos inválidos recebidos')
      }

      const chartData = transformHistoricalDataToChart(data, metricType)
      
      return chartData
    },
    enabled: enabled && !!coinId && dateRange.from && dateRange.to && 
      Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)) >= 1,
    staleTime: CACHE_TIMES.HISTORICAL_DATA,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

export function useCoinDetails(coinId: string | null, enabled: boolean = true) {
  return useQuery({
    queryKey: ['coin-details', coinId],
    queryFn: async () => {
      if (!coinId) throw new Error('Coin ID é obrigatório')
      
      const data = await coinGeckoApi.getCoinDetails(coinId)
      
      return data
    },
    enabled: enabled && !!coinId,
    staleTime: CACHE_TIMES.COIN_DETAILS,
    retry: 2,
  })
}

export function useApiStatus() {
  return useQuery({
    queryKey: ['api-status'],
    queryFn: async () => {
      const startTime = Date.now()
      const isOnline = await coinGeckoApi.ping()
      const responseTime = Date.now() - startTime
      
      return {
        isOnline,
        lastChecked: new Date(),
        responseTime
      }
    },
    staleTime: CACHE_TIMES.API_STATUS,
    refetchInterval: CACHE_TIMES.API_STATUS,
    retry: 1,
  })
}

export function useInvalidateQueries() {
  const queryClient = useQueryClient()

  const invalidateMarketData = () => {
    queryClient.invalidateQueries({ queryKey: ['market-data'] })
  }

  const invalidateHistoricalData = (coinId?: string) => {
    if (coinId) {
      queryClient.invalidateQueries({ 
        queryKey: ['historical-data'], 
        predicate: (query) => query.queryKey[1] === coinId 
      })
    } else {
      queryClient.invalidateQueries({ queryKey: ['historical-data'] })
    }
  }

  const invalidateCoinDetails = (coinId?: string) => {
    if (coinId) {
      queryClient.invalidateQueries({ queryKey: ['coin-details', coinId] })
    } else {
      queryClient.invalidateQueries({ queryKey: ['coin-details'] })
    }
  }

  const invalidateAll = () => {
    queryClient.invalidateQueries()
  }

  return {
    invalidateMarketData,
    invalidateHistoricalData,
    invalidateCoinDetails,
    invalidateAll
  }
}

export function usePrefetchData() {
  const queryClient = useQueryClient()

  const prefetchHistoricalData = async (coinId: string, dateRange: DateRange) => {
    await queryClient.prefetchQuery({
      queryKey: ['historical-data', coinId, dateRange.from, dateRange.to, 'price'],
      queryFn: async () => {
        const data = await coinGeckoApi.getHistoricalData(coinId, dateRange)
        return transformHistoricalDataToChart(data, 'price')
      },
      staleTime: CACHE_TIMES.HISTORICAL_DATA,
    })
  }

  const prefetchCoinDetails = async (coinId: string) => {
    await queryClient.prefetchQuery({
      queryKey: ['coin-details', coinId],
      queryFn: () => coinGeckoApi.getCoinDetails(coinId),
      staleTime: CACHE_TIMES.COIN_DETAILS,
    })
  }

  return {
    prefetchHistoricalData,
    prefetchCoinDetails
  }
}

export function useDashboard(dateRange: DateRange) {
  const metrics = useDashboardMetrics(dateRange)
  const apiStatus = useApiStatus()
  
  return {
    metrics: metrics.data,
    isLoadingMetrics: metrics.isLoading,
    metricsError: metrics.error,
    refetchMetrics: metrics.refetch,
    apiStatus: apiStatus.data,
    isApiOnline: apiStatus.data?.isOnline ?? false,
  }
}

export function usePeriodComparison(dateRange: DateRange) {
  return useQuery({
    queryKey: ['period-comparison', dateRange.from, dateRange.to],
    queryFn: async () => {
      const comparison = await getCachedPeriodComparison(dateRange)
      return comparison || { volumeChangePercent: 0, marketCapChangePercent: 0, volatilityChangePercent: 0 }
    },
    enabled: dateRange.from && dateRange.to && Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)) >= 1,
    staleTime: CACHE_TIMES.HISTORICAL_DATA,
    retry: 1,
  })
}

function createPeriodBasedMetrics(
  historicalData: CoinHistoricalDataWithMetrics[],
  dateRange: DateRange,
  periodComparison?: { volumeChangePercent: number, marketCapChangePercent: number, volatilityChangePercent: number }
): MetricData[] {
  if (!historicalData?.length) return []

  const aggregated = createAggregatedMetrics(historicalData)
  const days = dateRange.from && dateRange.to ? Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)) : 0

  const volumeChange = periodComparison?.volumeChangePercent ?? aggregated.volumeChangePercent
  const marketCapChange = periodComparison?.marketCapChangePercent ?? aggregated.marketCapChangePercent
  const volatilityChange = periodComparison?.volatilityChangePercent ?? aggregated.volatilityChangePercent

  return [
    {
      id: 'total-volume-period',
      title: `Volume Total (${days} dias)`,
      value: aggregated.totalVolumeAllCoins,
      change: Math.abs(volumeChange),
      changeType: volumeChange >= 0 ? 'positive' : 'negative' as const,
      icon: BarChart3,
      color: 'purple' as const,
      subtitle: 'Soma do período'
    },
    {
      id: 'market-movement-period',
      title: `Movimento de Mercado (${days} dias)`,
      value: aggregated.totalMarketMovement,
      change: Math.abs(marketCapChange),
      changeType: marketCapChange >= 0 ? 'positive' : 'negative' as const,
      icon: TrendingUp,
      color: marketCapChange >= 0 ? 'green' : 'red' as const,
      subtitle: 'Variação total market cap'
    },
    {
      id: 'volatility-average-period',
      title: `Volatilidade Média (${days} dias)`,
      value: aggregated.averageVolatility,
      change: Math.abs(volatilityChange),
      changeType: volatilityChange >= 0 ? 'positive' : 'negative' as const,
      icon: Activity,
      color: 'yellow' as const,
      subtitle: 'Desvio padrão médio'
    }
  ]
}
