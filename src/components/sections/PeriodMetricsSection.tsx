import { useMemo } from "react"
import { MetricCard } from "@/components/common/MetricCard"
import { MetricCardSkeletonGrid } from "@/components/common/MetricCardSkeleton"
import { ErrorState } from "@/components/common/ErrorStates"
import type { DashboardHook } from '@/types/dashboard'
import type { DateRange } from 'react-day-picker'

interface PeriodMetricsSectionProps {
  metrics: DashboardHook['metrics']
  isLoading: DashboardHook['isLoading']
  error: DashboardHook['error']
  dateRange: DashboardHook['dateRange']
  getDaysDifference: (range?: DateRange) => number
  getVisiblePeriodMetrics: DashboardHook['getVisiblePeriodMetrics']
  handleMetricClick: DashboardHook['handleMetricClick']
  handleRetryMetrics: DashboardHook['handleRetryMetrics']
  getFormatterForMetric: DashboardHook['getFormatterForMetric']
}

export const PeriodMetricsSection = ({
  metrics,
  isLoading,
  error,
  dateRange,
  getDaysDifference,
  getVisiblePeriodMetrics,
  handleMetricClick,
  handleRetryMetrics,
  getFormatterForMetric
}: PeriodMetricsSectionProps) => {
  const visibleMetrics = useMemo(() => {
    if (!metrics) return []
    return metrics.filter(metric => {
      const isPeriodMetric = metric.id.includes('-period')
      const isVisible = getVisiblePeriodMetrics().includes(metric.id)
      return isPeriodMetric && isVisible
    })
  }, [metrics, getVisiblePeriodMetrics])

  return (
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
      
      {isLoading ? (
        <MetricCardSkeletonGrid count={getVisiblePeriodMetrics().length || 3} />
      ) : error ? (
        <ErrorState
          variant="api"
          title="Falha ao carregar métricas do período"
          message={error.message || "Erro ao conectar com a CoinGecko API"}
          onRetry={handleRetryMetrics}
          className="min-h-[200px]"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {visibleMetrics.map((metric) => (
            <div key={metric.id} className="transform hover:scale-105 transition-all duration-200">
              <MetricCard
                metric={metric}
                onClick={() => handleMetricClick(metric.id)}
                formatValue={getFormatterForMetric(metric)}
                subtitle={metric.subtitle || "Calculado para o período selecionado"}
                className="border-l-4 border-l-purple-500/50 bg-gradient-to-br from-slate-800/80 to-slate-900/80 h-full min-h-[160px]"
              />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
