import { Header } from "@/components/layout/Header"
import { DashboardHeader } from "@/components/layout/DashboardHeader"
import { PeriodMetricsSection } from "@/components/sections/PeriodMetricsSection"
import { CoinPricesSection } from "@/components/sections/CoinPricesSection"
import { VisualSeparator } from "@/components/common/VisualSeparator"
import { MetricDetailsModalWrapper } from "@/components/modals/MetricDetailsModalWrapper"
import { SettingsModalWrapper } from "@/components/modals/SettingsModalWrapper"
import { ExpandedCoinViewWrapper } from "@/components/modals/ExpandedCoinViewWrapper"
import { Toaster } from "@/components/ui/toaster"
import { useDashboard } from "@/hooks/useDashboard"
import type { DateRange } from 'react-day-picker'

function App() {
  const dashboard = useDashboard()

  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      dashboard.setDateRangeWithToast(range)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Header onSettingsClick={() => dashboard.setIsSettingsOpen(true)} />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardHeader
          dateRange={dashboard.dateRange}
          onDateRangeChange={handleDateRangeChange}
        />

        {dashboard.shouldShowPeriodMetrics() && (
          <PeriodMetricsSection
            metrics={dashboard.metrics}
            isLoading={dashboard.isLoading}
            error={dashboard.error}
            dateRange={dashboard.dateRange}
            getDaysDifference={dashboard.getDaysDifferenceSafe}
            getVisiblePeriodMetrics={dashboard.getVisiblePeriodMetrics}
            handleMetricClick={dashboard.handleMetricClick}
            handleRetryMetrics={dashboard.handleRetryMetrics}
            getFormatterForMetric={dashboard.getFormatterForMetric}
          />
        )}

        <VisualSeparator 
          show={dashboard.shouldShowPeriodMetrics() && dashboard.shouldShowCoinPrices()} 
        />

        {dashboard.shouldShowCoinPrices() && (
          <CoinPricesSection
            metrics={dashboard.metrics}
            isLoading={dashboard.isLoading}
            error={dashboard.error}
            dateRange={dashboard.dateRange}
            getVisibleCoins={dashboard.getVisibleCoins}
            handleMetricClick={dashboard.handleMetricClick}
            handleRetryMetrics={dashboard.handleRetryMetrics}
            getFormatterForMetric={dashboard.getFormatterForMetric}
            isValidChartPeriod={dashboard.isValidChartPeriodSafe}
            getDaysDifference={dashboard.getDaysDifferenceSafe}
            onExploreMore={() => dashboard.setIsExpandedViewOpen(true)}
          />
        )}
      </main>

      {dashboard.dateRange && (
        <MetricDetailsModalWrapper
          metric={dashboard.selectedMetric}
          dateRange={dashboard.dateRange}
          isOpen={dashboard.isModalOpen}
          onClose={dashboard.handleCloseModal}
        />
      )}

      <SettingsModalWrapper
        isOpen={dashboard.isSettingsOpen}
        onClose={() => dashboard.setIsSettingsOpen(false)}
      />

      <ExpandedCoinViewWrapper
        isOpen={dashboard.isExpandedViewOpen}
        onClose={() => dashboard.setIsExpandedViewOpen(false)}
        onCoinClick={dashboard.handleMetricClick}
      />

      <Toaster />
    </div>
  )
}

export default App