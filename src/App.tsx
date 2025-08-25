

import { useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { Header } from "@/components/layout/Header"
import { MetricCard } from "@/components/common/MetricCard"
import { DateRangePicker } from "@/components/common/DateRangePicker"
import { MetricDetailsModal } from "@/components/common/MetricDetailsModal"
import { mockCryptoMetrics, formatters, generateMockChartData } from "@/utils/mockData"
import type { MetricData } from '@/types/dashboard'

function App() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [selectedMetric, setSelectedMetric] = useState<MetricData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleMetricClick = (metricId: string) => {
    const metric = mockCryptoMetrics.find(m => m.id === metricId)
    if (metric) {
      setSelectedMetric(metric)
      setIsModalOpen(true)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedMetric(null)
  }

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range)
    console.log('Date range changed:', range)
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

     
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 p-8 text-center">
          <p className="text-slate-400">
            🚧 Próximo: Loading States e Error Handling
          </p>
        </div>
      </main>

      {/* Modal the details of the metric */}
      <MetricDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        metric={selectedMetric}
        chartData={chartData}
      />
    </div>
  )
}

export default App
