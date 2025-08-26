import { describe, it, expect } from 'vitest'

const formatCurrency = (value: number): string => {
  if (!isFinite(value) || isNaN(value)) return '$0.00'
  
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

const formatCompactNumber = (value: number): string => {
  if (!isFinite(value) || isNaN(value)) return '0'
  
  if (value >= 1e15) return `${(value / 1e15).toFixed(0)}Q`
  if (value >= 1e12) return `${(value / 1e12).toFixed(0)}T`
  if (value >= 1e9) return `${(value / 1e9).toFixed(0)}B`
  if (value >= 1e6) return `${(value / 1e6).toFixed(0)}M`
  if (value >= 1e3) return `${(value / 1e3).toFixed(0)}K`
  return value.toFixed(0)
}

describe('formatters', () => {
  describe('formatCurrency', () => {
    it('formats valid numbers correctly', () => {
      const result1 = formatCurrency(1234.56)
      const result2 = formatCurrency(0)
      const result3 = formatCurrency(100)
      
      expect(result1).toContain('1.234,56')
      expect(result2).toContain('0,00')
      expect(result3).toContain('100,00')
    })

    it('handles invalid values', () => {
      expect(formatCurrency(NaN)).toBe('$0.00')
      expect(formatCurrency(Infinity)).toBe('$0.00')
      expect(formatCurrency(-Infinity)).toBe('$0.00')
    })
  })

  describe('formatCompactNumber', () => {
    it('formats large numbers with suffixes', () => {
      expect(formatCompactNumber(1000)).toBe('1K')
      expect(formatCompactNumber(1000000)).toBe('1M')
      expect(formatCompactNumber(1000000000)).toBe('1B')
      expect(formatCompactNumber(1000000000000)).toBe('1T')
      expect(formatCompactNumber(1000000000000000)).toBe('1Q')
    })

    it('formats small numbers without suffixes', () => {
      expect(formatCompactNumber(999)).toBe('999')
      expect(formatCompactNumber(0)).toBe('0')
      expect(formatCompactNumber(1)).toBe('1')
    })

    it('handles invalid values', () => {
      expect(formatCompactNumber(NaN)).toBe('0')
      expect(formatCompactNumber(Infinity)).toBe('0')
      expect(formatCompactNumber(-Infinity)).toBe('0')
    })
  })
})
