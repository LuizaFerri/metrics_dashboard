import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { VirtualizedChart } from '../VirtualizedChart'
import type { ChartDataTransformed } from '@/types/api'

vi.mock('recharts', () => ({
  LineChart: ({ children }: { children: React.ReactNode }) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="responsive-container">{children}</div>,
}))

const generateMockData = (count: number): ChartDataTransformed[] => {
  return Array.from({ length: count }, (_, i) => ({
    timestamp: Date.now() + i * 24 * 60 * 60 * 1000,
    date: new Date(Date.now() + i * 24 * 60 * 60 * 1000),
    price: 100 + Math.random() * 50,
    marketCap: 1000000 + Math.random() * 500000,
    volume: 50000 + Math.random() * 25000
  }))
}

describe('VirtualizedChart', () => {
  it('renders normal chart for small datasets (≤30 points)', () => {
    const smallData = generateMockData(25)
    
    render(
      <VirtualizedChart
        data={smallData}
        metricType="price"
        title="Test Chart"
      />
    )
    
    expect(screen.getByTestId('line-chart')).toBeInTheDocument()
    expect(screen.getByText('Test Chart')).toBeInTheDocument()
  })

  it('activates virtualization for large datasets (>30 points)', () => {
    const largeData = generateMockData(100)
    
    render(
      <VirtualizedChart
        data={largeData}
        metricType="price"
        title="Large Dataset"
        allowFullView={true}
      />
    )
    
    expect(screen.getByText('Inteligente')).toBeInTheDocument()
    expect(screen.getByText('Detalhado')).toBeInTheDocument()
    expect(screen.getByText('Completo')).toBeInTheDocument()
  })

  it('defaults to intelligent mode for large datasets', () => {
    const largeData = generateMockData(100)
    
    render(
      <VirtualizedChart
        data={largeData}
        metricType="price"
        title="Default Mode Test"
      />
    )
    
    expect(screen.getByText(/Modo Inteligente:/)).toBeInTheDocument()
  })

  it('switches between visualization modes', () => {
    const largeData = generateMockData(100)
    
    render(
      <VirtualizedChart
        data={largeData}
        metricType="price"
        title="Mode Switch Test"
        allowFullView={true}
      />
    )
    
    const detailedButton = screen.getByText('Detalhado')
    fireEvent.click(detailedButton)
    
    expect(screen.getByText(/Modo Detalhado:/)).toBeInTheDocument()
    
    const completeButton = screen.getByText('Completo')
    fireEvent.click(completeButton)
    
    expect(screen.getByText(/Modo Completo:/)).toBeInTheDocument()
  })

  it('shows help panel when help button is clicked', () => {
    const largeData = generateMockData(100)
    
    render(
      <VirtualizedChart
        data={largeData}
        metricType="price"
        title="Help Test"
        allowFullView={true}
      />
    )
    
    const helpButton = screen.getByTitle('Ver explicação dos modos de visualização')
    fireEvent.click(helpButton)
    
    expect(screen.getByText('Guia dos Modos de Visualização')).toBeInTheDocument()
    expect(screen.getByText('INTELIGENTE')).toBeInTheDocument()
    expect(screen.getByText('DETALHADO')).toBeInTheDocument()
    expect(screen.getByText('COMPLETO')).toBeInTheDocument()
  })

  it('shows navigation controls in detailed mode', () => {
    const largeData = generateMockData(200)
    
    render(
      <VirtualizedChart
        data={largeData}
        metricType="price"
        title="Navigation Test"
        allowFullView={true}
      />
    )
    
    const detailedButton = screen.getByText('Detalhado')
    fireEvent.click(detailedButton)
    
    expect(screen.getByText('Período Anterior')).toBeInTheDocument()
    expect(screen.getByText('Próximo Período')).toBeInTheDocument()
  })

  it('shows performance warning for large complete datasets', () => {
    const veryLargeData = generateMockData(600)
    
    render(
      <VirtualizedChart
        data={veryLargeData}
        metricType="price"
        title="Performance Warning Test"
        allowFullView={true}
      />
    )
    
    const completeButton = screen.getByText('Completo')
    fireEvent.click(completeButton)
    
    expect(screen.getByText(/Grande período/)).toBeInTheDocument()
    expect(screen.getByText(/considere modo "Inteligente"/)).toBeInTheDocument()
  })

  it('handles different metric types correctly', () => {
    const data = generateMockData(50)
    
    const { rerender } = render(
      <VirtualizedChart
        data={data}
        metricType="volume"
        title="Volume Chart"
      />
    )
    
    expect(screen.getByTestId('line-chart')).toBeInTheDocument()
    
    rerender(
      <VirtualizedChart
        data={data}
        metricType="market_cap"
        title="Market Cap Chart"
      />
    )
    
    expect(screen.getByTestId('line-chart')).toBeInTheDocument()
  })
})
