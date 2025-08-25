import { Bitcoin, DollarSign, TrendingUp, BarChart3 } from 'lucide-react'
import type { MetricData } from '@/types/dashboard'

export const mockMetrics: MetricData[] = [
  {
    id: 'total_value',
    title: 'Total Value',
    value: '8,802',
    change: 12.5,
    changeType: 'positive',
    icon: DollarSign,
    color: 'green'
  },
  {
    id: 'total_sales',
    title: 'Total Sales',
    value: '96,812',
    change: 8.2,
    changeType: 'positive',
    icon: TrendingUp,
    color: 'blue'
  },
  {
    id: 'total_orders',
    title: 'Total Orders',
    value: '24,691',
    change: -3.1,
    changeType: 'negative',
    icon: BarChart3,
    color: 'red'
  },
  {
    id: 'total_customers',
    title: 'Total Customers',
    value: '34,529',
    change: 15.3,
    changeType: 'positive',
    icon: Bitcoin,
    color: 'purple'
  }
]

export const formatters = {
  currency: (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(num)
  },
  
  number: (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value
    return new Intl.NumberFormat('pt-BR').format(num)
  },
  
  percentage: (value: string | number) => {
    return `${value}%`
  },
  
  compact: (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return String(num)
  }
}

export const mockCryptoMetrics: MetricData[] = [
  {
    id: 'bitcoin_price',
    title: 'Bitcoin Price',
    value: '43,250.00',
    change: 2.4,
    changeType: 'positive',
    icon: Bitcoin,
    color: 'yellow'
  },
  {
    id: 'portfolio_value',
    title: 'Portfolio Value',
    value: '125,480.50',
    change: 5.7,
    changeType: 'positive',
    icon: DollarSign,
    color: 'green'
  },
  {
    id: 'daily_volume',
    title: '24h Volume',
    value: '2.8B',
    change: -1.2,
    changeType: 'negative',
    icon: BarChart3,
    color: 'red'
  },
  {
    id: 'market_cap',
    title: 'Market Cap',
    value: '845.2B',
    change: 3.8,
    changeType: 'positive',
    icon: TrendingUp,
    color: 'purple'
  }
]
