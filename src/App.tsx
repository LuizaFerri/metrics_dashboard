import { useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { Header } from "@/components/layout/Header"
import { MetricCard } from "@/components/common/MetricCard"
import { DateRangePicker } from "@/components/common/DateRangePicker"
import { MetricDetailsModal } from "@/components/common/MetricDetailsModal"
import { MetricCardSkeletonGrid } from "@/components/common/MetricCardSkeleton"
import { ErrorState } from "@/components/common/ErrorStates"
import { Toaster } from "@/components/ui/toaster"
import { useErrorHandler } from "@/hooks/useErrorHandler"
import { mockCryptoMetrics, formatters, generateMockChartData } from "@/utils/mockData"
import type { MetricData } from '@/types/dashboard'

function App() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [selectedMetric, setSelectedMetric] = useState<MetricData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isModalLoading, setIsModalLoading] = useState(false)
  const [shouldSimulateError, setShouldSimulateError] = useState(false)
  const { setError, clearError, hasError, createApiError, createNetworkError } = useErrorHandler()

  const handleMetricClick = async (metricId: string) => {
    const metric = mockCryptoMetrics.find(m => m.id === metricId)
    if (metric) {
      setSelectedMetric(metric)
      setIsModalOpen(true)
      setIsModalLoading(true)
      clearError('modal')
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        if (shouldSimulateError && Math.random() > 0.7) {
          throw new Error('API Error')
        }
        
        setIsModalLoading(false)

      } catch (error) {
        setIsModalLoading(false)
        setError('modal', createApiError('Falha ao carregar dados do gráfico'))
      }
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedMetric(null)
    setIsModalLoading(false)
    clearError('modal')
  }

  const handleDateRangeChange = async (range: DateRange | undefined) => {
    setDateRange(range)
    setIsLoading(true)
    clearError('metrics')
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (shouldSimulateError && Math.random() > 0.6) {
        throw new Error('Network Error')
      }
      
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      setError('metrics', createNetworkError('Falha ao carregar métricas'))
    }
    
    console.log('Date range changed:', range)
  }

  const handleRetryMetrics = () => {
    clearError('metrics')
    handleDateRangeChange(dateRange)
  }

  const handleRetryModal = () => {
    if (selectedMetric) {
      clearError('modal')
      handleMetricClick(selectedMetric.id)
    }
  }

  const chartData = selectedMetric ? generateMockChartData(selectedMetric.id, 30) : []

  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      
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

        {/* Metrics Grid */}
        <div className="mb-8">
          {isLoading ? (
            <MetricCardSkeletonGrid count={4} />
          ) : hasError('metrics') ? (
            <ErrorState
              variant="network"
              onRetry={handleRetryMetrics}
              className="min-h-[200px]"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mockCryptoMetrics.map((metric) => (
                <MetricCard
                  key={metric.id}
                  metric={metric}
                  onClick={() => handleMetricClick(metric.id)}
                  formatValue={metric.id.includes('price') || metric.id.includes('value') 
                    ? formatters.currency 
                    : formatters.compact}
                  subtitle="Últimas 24h"
                />
              ))}
            </div>
          )}
        </div>

     
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-8">
          <div className="text-center space-y-4">
           
          </div>
        </div>
      </main>

  {/* Modal the details of the metric */}
      <MetricDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        metric={selectedMetric}
        chartData={chartData}
        isLoading={isModalLoading}
        hasError={hasError('modal')}
        onRetry={handleRetryModal}
      />

      {/* Toast Container */}
      <Toaster />
    </div>
  )
}

export default App
