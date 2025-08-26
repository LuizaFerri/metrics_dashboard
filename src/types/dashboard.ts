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
}

export interface ChartDataPoint {
  date: string
  value: number
  label?: string
}

export interface MetricDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  metric: MetricData
  chartData: ChartDataPoint[]
  dateRange: {
    from: Date
    to: Date
  }
}

export type MetricType = 'price' | 'volume' | 'market_cap' | 'change_24h'

export interface DashboardFilters {
  dateRange: {
    from: Date
    to: Date
  }
  selectedMetrics: MetricType[]
  coinId: string
}
