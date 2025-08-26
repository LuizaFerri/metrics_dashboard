import { useState } from 'react'
import { subDays, startOfDay, endOfDay } from 'date-fns'
import type { DateRange } from 'react-day-picker'
import { Header } from "@/components/layout/Header"
import { MetricCard } from "@/components/common/MetricCard"
import { DateRangePicker } from "@/components/common/DateRangePicker"
import { MetricDetailsModal } from "@/components/common/MetricDetailsModal"
import { MetricCardSkeletonGrid } from "@/components/common/MetricCardSkeleton"
import { ErrorState } from "@/components/common/ErrorStates"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { useDashboardMetrics, useHistoricalData } from "@/hooks/useCoinGeckoData"
import { useUserPreferences } from "@/hooks/useUserPreferences"
import { SettingsModal } from "@/components/common/SettingsModal"

import type { MetricData } from '@/types/dashboard'

function App() {
  const defaultDateRange: DateRange = {
    from: startOfDay(subDays(new Date(), 30)),
    to: endOfDay(new Date())
  }
  
  const [dateRange, setDateRange] = useState<DateRange | undefined>(defaultDateRange)
  const [selectedMetric, setSelectedMetric] = useState<MetricData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const { toast } = useToast()

  const {
    preferences,
    isLoading: isLoadingPreferences,
    savePreferences,
    resetPreferences,
    getVisiblePeriodMetrics,
    getVisibleCoins,
    shouldShowPeriodMetrics,
    shouldShowCoinPrices
  } = useUserPreferences()


  const getDaysDifference = (range: DateRange | undefined): number => {
    if (!range?.from || !range?.to) return 0
    return Math.ceil((range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24))
  }


  const isValidChartPeriod = (range: DateRange | undefined): boolean => {
    const days = getDaysDifference(range)
    return days >= 2 // Mínimo 2 dias para mostrar evolução
  }


  const formatCurrency = (value: string | number) => {
    const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : value
    if (isNaN(numValue) || !isFinite(numValue)) return 'N/A'
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: numValue < 1 ? 6 : 2,
      maximumFractionDigits: numValue < 1 ? 6 : 2,
    }).format(numValue)
  }

  const formatCompact = (value: string | number) => {
    const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : value
    if (isNaN(numValue) || !isFinite(numValue)) return 'N/A'
    
    const absValue = Math.abs(numValue)
    const sign = numValue < 0 ? '-' : ''
    
    if (absValue >= 1e15) {
      return `${sign}$${(absValue / 1e15).toFixed(0)}Q`
    }
    if (absValue >= 1e12) {
      return `${sign}$${(absValue / 1e12).toFixed(1)}T`
    }
    if (absValue >= 1e9) {
      return `${sign}$${(absValue / 1e9).toFixed(1)}B`
    }
    if (absValue >= 1e6) {
      return `${sign}$${(absValue / 1e6).toFixed(1)}M`
    }
    if (absValue >= 1e3) {
      return `${sign}$${(absValue / 1e3).toFixed(0)}K`
    }
    if (absValue >= 100) {
      return `${sign}$${absValue.toFixed(0)}`
    }
    return formatCurrency(numValue)
  }

  const getFormatterForMetric = (metric: MetricData) => {
    if (metric.id.includes('price') || metric.id.includes('portfolio')) {
      return formatCurrency
    }
    return formatCompact
  }


  const { 
    data: metrics, 
    isLoading: isLoadingMetrics, 
    error: metricsError, 
    refetch: refetchMetrics 
  } = useDashboardMetrics(dateRange)



  const { 
    data: chartData, 
    isLoading: isModalLoading, 
    error: modalError, 
    refetch: refetchModal 
  } = useHistoricalData(
    selectedMetric?.id || null,
    dateRange,
    isModalOpen && !!selectedMetric
  )


  const handleMetricClick = (metricId: string) => {
    const metric = metrics?.find(m => m.id === metricId)
    if (!metric) return

    if (!isValidChartPeriod(dateRange)) {
      const days = getDaysDifference(dateRange)
      toast({
        title: "Período insuficiente para gráfico",
        description: `Selecione pelo menos 2 dias para visualizar a evolução. Período atual: ${days} dia(s)`,
        variant: "destructive",
        duration: 4000,
      })
      return
    }

    setSelectedMetric(metric)
    setIsModalOpen(true)
    
    const days = getDaysDifference(dateRange)
    toast({
      title: "Carregando dados históricos",
      description: `Buscando ${days} dias de dados de ${metric.title}...`,
      duration: 2000,
    })
  }


  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedMetric(null)
  }


  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range)
    
    if (range?.from && range?.to) {
      const days = Math.ceil((range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24))
      toast({
        title: "Período atualizado",
        description: `Analisando ${days} dias de dados`,
        duration: 2000,
      })
    }
    
  }


  const handleRetryMetrics = () => {
    refetchMetrics()
    toast({
      title: "Tentando novamente...",
      description: "Recarregando métricas do dashboard",
    })
  }

  const handleRetryModal = () => {
    refetchModal()
    toast({
      title: "Tentando novamente...",
      description: "Recarregando dados do gráfico",
    })
  }


  const transformedChartData = chartData?.length ? chartData.map(point => ({
    date: point.date.toISOString().split('T')[0],
    value: point.price || point.marketCap || point.volume || 0,
    timestamp: point.timestamp
  })).filter(point => point.value && isFinite(point.value)) : []



  return (
    <div className="min-h-screen bg-slate-950">
      <Header onSettingsClick={() => setIsSettingsOpen(true)} />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Dashboard de Métricas Financeiras
          </h2>
          <p className="text-lg text-slate-300 mb-8">
            Acompanhe o desempenho das principais criptomoedas em tempo real
          </p>

          {/* Date Range Picker */}
          <div className="flex justify-center mb-8">
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={handleDateRangeChange}
            />
          </div>
        </div>

        {/* Metrics Section */}
        {shouldShowPeriodMetrics() && (
          <section className="mb-12 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-100 flex items-center gap-3">
                📊 Métricas do Período
              </h2>
              <div className="text-right">
                <span className="text-sm text-gray-400 block">
                  {getDaysDifference(dateRange)} dia(s) selecionado(s)
                </span>
                <span className="text-xs text-gray-500">
                  Dados agregados do período
                </span>
              </div>
            </div>
            
            {isLoadingMetrics || isLoadingPreferences ? (
              <MetricCardSkeletonGrid count={getVisiblePeriodMetrics().length || 3} />
            ) : metricsError ? (
              <ErrorState
                variant="api"
                title="Falha ao carregar métricas do período"
                message={metricsError.message || "Erro ao conectar com a CoinGecko API"}
                onRetry={handleRetryMetrics}
                className="min-h-[200px]"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                {metrics
                  ?.filter(metric => {
                    const isPeriodMetric = metric.id.includes('-period')
                    const isVisible = getVisiblePeriodMetrics().includes(metric.id)
                    return isPeriodMetric && isVisible
                  })
                  .map((metric) => (
                    <div key={metric.id} className="transform hover:scale-105 transition-all duration-200">
                      <MetricCard
                        metric={metric}
                        onClick={() => handleMetricClick(metric.id)}
                        formatValue={getFormatterForMetric(metric)}
                        subtitle={metric.subtitle || "Calculado para o período selecionado"}
                        className="border-l-4 border-l-purple-500/50 bg-gradient-to-br from-slate-800/80 to-slate-900/80 h-full min-h-[160px]"
                      />
                    </div>
                  ))
                }
              </div>
            )}
          </section>
        )}

        {/* Visual Separator */}
        {shouldShowPeriodMetrics() && shouldShowCoinPrices() && (
          <div className="relative mb-12">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-slate-950 px-4 text-slate-400">•••</span>
            </div>
          </div>
        )}

        {/* Prices Section */}
        {shouldShowCoinPrices() && (
          <section className="mb-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-100 flex items-center gap-3">
                🪙 Preços das Moedas
              </h2>
              <div className="text-right">
                <span className="text-sm text-gray-400 block">
                  {getVisibleCoins().length} criptomoedas
                </span>
                <span className="text-xs text-gray-500">
                  Dados em tempo real
                </span>
              </div>
            </div>
            
            {isLoadingMetrics || isLoadingPreferences ? (
              <MetricCardSkeletonGrid count={getVisibleCoins().length || 10} />
            ) : metricsError ? (
              <ErrorState
                variant="api"
                title="Falha ao carregar preços"
                message={metricsError.message || "Erro ao conectar com a CoinGecko API"}
                onRetry={handleRetryMetrics}
                className="min-h-[150px]"
              />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 items-stretch">
                {metrics
                  ?.filter(metric => {
                    const isCoinMetric = !metric.id.includes('-period')
                    const isVisible = getVisibleCoins().includes(metric.id)
                    return isCoinMetric && isVisible
                  })
                  .map((metric) => (
                    <MetricCard
                      key={metric.id}
                      metric={metric}
                      onClick={() => handleMetricClick(metric.id)}
                      formatValue={getFormatterForMetric(metric)}
                      subtitle={
                        isValidChartPeriod(dateRange) 
                          ? "Últimas 24h" 
                          : `${getDaysDifference(dateRange)} dia(s) - Gráfico indisponível`
                      }
                      className="text-sm h-full min-h-[140px]"
                    />
                  ))
                }
              </div>
            )}
          </section>
        )}

      
      </main>

      {/* Details Modal */}
      <MetricDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        metric={selectedMetric}
        chartData={transformedChartData}
        dateRange={dateRange}
        isLoading={isModalLoading}
        hasError={!!modalError}
        onRetry={handleRetryModal}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        preferences={preferences}
        onSave={savePreferences}
        onReset={resetPreferences}
      />

      {/* Toast Container */}
      <Toaster />
    </div>
  )
}

export default App