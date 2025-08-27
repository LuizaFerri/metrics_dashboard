import { useMemo } from 'react'
import { useHistoricalData } from './useCoinGeckoData'
import type { ChartDataPoint, MetricData } from '@/types/dashboard'
import type { DateRange } from 'react-day-picker'

export interface UseChartDataResult {
  transformedData: ChartDataPoint[]
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

export const useChartData = (
  metric: MetricData | null,
  dateRange: DateRange,
  isModalOpen: boolean
): UseChartDataResult => {
  const { 
    data: chartData, 
    isLoading, 
    error, 
    refetch 
  } = useHistoricalData(
    metric?.id || null,
    dateRange,
    isModalOpen && !!metric
  )

  const transformedData = useMemo(() => {
    if (!chartData?.length) return []
    
    return chartData
      .map(point => ({
        date: point.date.toISOString().split('T')[0],
        value: point.price || point.marketCap || point.volume || 0,
        label: point.date.toISOString().split('T')[0]
      }))
      .filter(point => point.value && isFinite(point.value))
  }, [chartData])

  return {
    transformedData,
    isLoading,
    error,
    refetch
  }
}
