import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DollarSign } from 'lucide-react'
import { MetricCard } from '../MetricCard'

const mockMetric = {
  id: 'test-metric',
  title: 'Test Metric',
  value: '$1,234.56',
  change: 5.5,
  changeType: 'positive' as const,
  icon: DollarSign,
  color: 'green' as const,
  subtitle: 'Test subtitle'
}

describe('MetricCard', () => {
  it('renders metric data correctly', () => {
    render(<MetricCard metric={mockMetric} />)
    
    expect(screen.getByText('Test Metric')).toBeInTheDocument()
    expect(screen.getByText('$1,234.56')).toBeInTheDocument()
    expect(screen.getByText('5.5%')).toBeInTheDocument()
  })

  it('applies correct color classes for green metric', () => {
    render(<MetricCard metric={mockMetric} />)
    
    const iconContainer = screen.getByText('Test Metric').closest('div')?.previousSibling
    expect(iconContainer).toHaveClass('bg-emerald-500/20', 'text-emerald-400')
  })

  it('calls onClick when clicked and clickable', () => {
    const handleClick = vi.fn()
    render(
      <MetricCard 
        metric={mockMetric} 
        onClick={handleClick}
      />
    )
    
    const card = screen.getByText('Test Metric').closest('div')?.closest('div')
    fireEvent.click(card!)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('does not render change indicator when change is undefined', () => {
    const metricWithoutChange = { ...mockMetric, change: undefined }
    render(<MetricCard metric={metricWithoutChange} />)
    
    expect(screen.queryByText('%')).not.toBeInTheDocument()
  })

  it('applies correct change colors for negative change', () => {
    const negativeMetric = {
      ...mockMetric,
      change: -3.2,
      changeType: 'negative' as const
    }
    
    render(<MetricCard metric={negativeMetric} />)
    
    const changeElement = screen.getByText('3.2%')
    expect(changeElement.parentElement).toHaveClass('bg-red-500/10', 'text-red-400')
  })

  it('truncates long titles and subtitles', () => {
    const longTextMetric = {
      ...mockMetric,
      title: 'This is a very long title that should be truncated'
    }
    
    render(<MetricCard metric={longTextMetric} />)
    
    const title = screen.getByText(longTextMetric.title)
    
    expect(title).toHaveClass('truncate')
  })

  it('formats large numbers correctly', () => {
    const largeNumberMetric = {
      ...mockMetric,
      value: '$1,234,567,890.12'
    }
    
    render(<MetricCard metric={largeNumberMetric} />)
    
    const valueElement = screen.getByText('$1,234,567,890.12')
    expect(valueElement).toHaveClass('text-lg')
  })
})
