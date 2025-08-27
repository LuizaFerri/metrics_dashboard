import { useMemo } from "react"
import { CoinPagination } from "@/components/common/CoinPagination"
import { MetricCard } from "@/components/common/MetricCard"
import { MetricCardSkeletonGrid } from "@/components/common/MetricCardSkeleton"
import { ErrorState } from "@/components/common/ErrorStates"
import type { DashboardHook } from '@/types/dashboard'
import type { DateRange } from 'react-day-picker'

interface CoinPricesSectionProps {
  metrics: DashboardHook['metrics']
  isLoading: DashboardHook['isLoading']
  error: DashboardHook['error']
  dateRange: DashboardHook['dateRange']
  getVisibleCoins: DashboardHook['getVisibleCoins']
  handleMetricClick: DashboardHook['handleMetricClick']
  handleRetryMetrics: DashboardHook['handleRetryMetrics']
  getFormatterForMetric: DashboardHook['getFormatterForMetric']
  isValidChartPeriod: (range?: DateRange) => boolean
  getDaysDifference: (range?: DateRange) => number
  onExploreMore: () => void
}

export const CoinPricesSection = ({
  metrics,
  isLoading,
  error,
  dateRange,
  getVisibleCoins,
  handleMetricClick,
  handleRetryMetrics,
  getFormatterForMetric,
  isValidChartPeriod,
  getDaysDifference,
  onExploreMore
}: CoinPricesSectionProps) => {
  const visibleCoins = useMemo(() => {
    if (!metrics) return []
    return metrics.filter(metric => {
      const isCoinMetric = !metric.id.includes('-period')
      const isVisible = getVisibleCoins().includes(metric.id)
      return isCoinMetric && isVisible
    })
  }, [metrics, getVisibleCoins])

  return (
    <section className="mb-8 space-y-6">
      <div className="block sm:hidden space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-100 flex items-center gap-2">
            🪙 Preços das Moedas
          </h2>
          <button
            onClick={onExploreMore}
            className="px-3 py-2 text-sm font-medium rounded-md bg-cyan-500 text-white hover:bg-cyan-600 transition-colors"
          >
            Explorar
          </button>
        </div>
        <div className="text-left">
          <span className="text-sm text-gray-400 block">
            {getVisibleCoins().length} criptomoedas
          </span>
          <span className="text-xs text-gray-500">
            Dados em tempo real
          </span>
        </div>
      </div>

      <div className="hidden sm:flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-100 flex items-center gap-3">
          🪙 Preços das Moedas
        </h2>
        <div className="flex items-center gap-4">
          <button
            onClick={onExploreMore}
            className="px-3 py-2 text-sm font-medium rounded-md bg-cyan-500 text-white hover:bg-cyan-600 transition-colors"
          >
            Explorar Mais
          </button>
          <div className="text-right">
            <span className="text-sm text-gray-400 block">
              {getVisibleCoins().length} criptomoedas
            </span>
            <span className="text-xs text-gray-500">
              Dados em tempo real
            </span>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <MetricCardSkeletonGrid count={getVisibleCoins().length || 10} />
      ) : error ? (
        <ErrorState
          variant="api"
          title="Falha ao carregar preços"
          message={error.message || "Erro ao conectar com a CoinGecko API"}
          onRetry={handleRetryMetrics}
          className="min-h-[150px]"
        />
      ) : (
        <CoinPagination
          items={visibleCoins}
          itemsPerPage={8}
          renderItem={(metric) => (
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
          )}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 items-stretch"
        />
      )}
    </section>
  )
}
