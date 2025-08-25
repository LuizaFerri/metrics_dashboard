

import { Header } from "@/components/layout/Header"
import { MetricCard } from "@/components/common/MetricCard"
import { mockCryptoMetrics, formatters } from "@/utils/mockData"

function App() {
  const handleMetricClick = (metricId: string) => {
    console.log('Metric clicked:', metricId)

  }

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
            Dashboard em construção
          </p>
        </div>
      </main>
    </div>
  )
}

export default App
