import type { DateRange } from 'react-day-picker'

export interface MetricData {
  id: string
  title: string
  value: string | number
  change?: number
  changeType?: 'positive' | 'negative' | 'neutral'
  icon?: React.ComponentType<{ className?: string }>
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple'
  subtitle?: string
  metadata?: Record<string, unknown>
}

export interface MetricCardProps {
  metric: MetricData
  onClick?: () => void
  isLoading?: boolean
  className?: string
  formatValue?: (value: string | number) => string
  subtitle?: string
}

export interface ChartDataPoint {
  date: string
  value: number
  label?: string
}

export interface MetricDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  metric: MetricData | null
  chartData: ChartDataPoint[]
  dateRange: DateRange
  isLoading?: boolean
  hasError?: boolean
  onRetry?: () => void
}

export type MetricType = 'price' | 'volume' | 'market_cap' | 'change_24h'

export interface DashboardFilters {
  dateRange: DateRange
  selectedMetrics: MetricType[]
  coinId: string
}

export interface DashboardState {
  dateRange: DateRange
  selectedMetric: MetricData | null
  isModalOpen: boolean
  isSettingsOpen: boolean
  isExpandedViewOpen: boolean
}

export interface DashboardActions {
  setDateRangeWithToast: (range: DateRange) => void
  setSelectedMetric: (metric: MetricData | null) => void
  setIsModalOpen: (open: boolean) => void
  setIsSettingsOpen: (open: boolean) => void
  setIsExpandedViewOpen: (open: boolean) => void
  handleMetricClick: (metricId: string) => void
  handleRetryMetrics: () => void
  handleCloseModal: () => void
}

export interface DashboardData {
  metrics: MetricData[] | undefined
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

export interface DashboardUtils {
  getDaysDifference: (range: DateRange) => number
  getDaysDifferenceSafe: (range?: DateRange) => number
  isValidChartPeriod: (range: DateRange) => boolean
  isValidChartPeriodSafe: (range?: DateRange) => boolean
  getFormatterForMetric: (metric: MetricData) => (value: string | number) => string
}

export interface DashboardPreferences {
  shouldShowPeriodMetrics: () => boolean
  shouldShowCoinPrices: () => boolean
  getVisiblePeriodMetrics: () => string[]
  getVisibleCoins: () => string[]
}

export type DashboardHook = DashboardState & DashboardActions & DashboardData & DashboardUtils & DashboardPreferences
