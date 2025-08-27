import { useState } from 'react'
import { subDays, startOfDay, endOfDay } from 'date-fns'
import type { DateRange } from 'react-day-picker'
import { useToast } from '@/hooks/use-toast'
import { useDashboardMetrics } from './useCoinGeckoData'
import { useUserPreferences } from './useUserPreferences'
import type { MetricData } from '@/types/dashboard'

export const useDashboard = () => {
  const defaultDateRange: DateRange = {
    from: startOfDay(subDays(new Date(), 30)),
    to: endOfDay(new Date())
  }
  
  const [dateRange, setDateRange] = useState<DateRange>(defaultDateRange)
  const [selectedMetric, setSelectedMetric] = useState<MetricData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isExpandedViewOpen, setIsExpandedViewOpen] = useState(false)

  const { toast } = useToast()
  const {
    preferences,
    getVisiblePeriodMetrics,
    getVisibleCoins,
    shouldShowPeriodMetrics,
    shouldShowCoinPrices
  } = useUserPreferences()

  const {
    data: metrics,
    isLoading,
    error,
    refetch
  } = useDashboardMetrics(dateRange)

  const getDaysDifference = (range: DateRange): number => {
    if (!range?.from || !range?.to) return 0
    return Math.ceil((range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24))
  }

  const getDaysDifferenceSafe = (range?: DateRange): number => {
    return getDaysDifference(range || dateRange)
  }

  const isValidChartPeriod = (range: DateRange): boolean => getDaysDifference(range) >= 2

  const isValidChartPeriodSafe = (range?: DateRange): boolean => {
    return isValidChartPeriod(range || dateRange)
  }

  const handleMetricClick = (metricId: string): void => {
    const metric = metrics?.find(m => m.id === metricId)
    if (!metric) return

    if (!isValidChartPeriod(dateRange)) {
      const days = getDaysDifference(dateRange)
      toast({
        title: 'Período insuficiente para gráfico',
        description: `Selecione pelo menos 2 dias para visualizar a evolução. Período atual: ${days} dia(s)`,
        variant: 'destructive',
        duration: 4000
      })
      return
    }

    setSelectedMetric(metric)
    setIsModalOpen(true)

    const days = getDaysDifference(dateRange)
    toast({
      title: 'Carregando dados históricos',
      description: `Buscando ${days} dias de dados de ${metric.title}...`,
      duration: 2000
    })
  }

  const handleRetryMetrics = (): void => {
    refetch()
    toast({
      title: 'Tentando novamente...',
      description: 'Recarregando métricas do dashboard'
    })
  }

  const setDateRangeWithToast = (range: DateRange): void => {
    setDateRange(range)
    const days = getDaysDifference(range)
    toast({
      title: 'Período atualizado',
      description: `Analisando ${days} dias de dados`,
      duration: 2000
    })
  }

  const handleCloseModal = (): void => {
    setIsModalOpen(false)
    setSelectedMetric(null)
  }

  const getFormatterForMetric = (metric: MetricData): (value: string | number) => string => {
    if (metric.id.includes('price') || metric.id.includes('portfolio')) {
      return (value: string | number): string => {
        const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : value
        if (isNaN(numValue) || !isFinite(numValue)) return 'N/A'
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: numValue < 1 ? 6 : 2,
          maximumFractionDigits: numValue < 1 ? 6 : 2
        }).format(numValue)
      }
    }
    return (value: string | number): string => {
      const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : value
      if (isNaN(numValue) || !isFinite(numValue)) return 'N/A'
      const absValue = Math.abs(numValue)
      const sign = numValue < 0 ? '-' : ''
      if (absValue >= 1e15) return `${sign}$${(absValue / 1e15).toFixed(0)}Q`
      if (absValue >= 1e12) return `${sign}$${(absValue / 1e12).toFixed(1)}T`
      if (absValue >= 1e9) return `${sign}$${(absValue / 1e9).toFixed(1)}B`
      if (absValue >= 1e6) return `${sign}$${(absValue / 1e6).toFixed(1)}M`
      if (absValue >= 1e3) return `${sign}$${(absValue / 1e3).toFixed(0)}K`
      if (absValue >= 100) return `${sign}$${absValue.toFixed(0)}`
      return numValue.toLocaleString('pt-BR', { style: 'currency', currency: 'USD' })
    }
  }

  return {
    dateRange,
    selectedMetric,
    isModalOpen,
    isSettingsOpen,
    isExpandedViewOpen,
    
    setDateRangeWithToast,
    setSelectedMetric,
    setIsModalOpen,
    setIsSettingsOpen,
    setIsExpandedViewOpen,
    handleMetricClick,
    handleRetryMetrics,
    handleCloseModal,
    
    metrics,
    isLoading,
    error,
    
    getDaysDifference,
    getDaysDifferenceSafe,
    isValidChartPeriod,
    isValidChartPeriodSafe,
    getFormatterForMetric,
    
    preferences,
    getVisiblePeriodMetrics,
    getVisibleCoins,
    shouldShowPeriodMetrics,
    shouldShowCoinPrices,
  }
}
