import { ExpandedCoinView } from "@/components/common/ExpandedCoinView"

interface ExpandedCoinViewWrapperProps {
  isOpen: boolean
  onClose: () => void
  onCoinClick: (metricId: string) => void
}

export const ExpandedCoinViewWrapper = ({
  isOpen,
  onClose,
  onCoinClick
}: ExpandedCoinViewWrapperProps) => {
  if (!isOpen) return null

  return (
    <ExpandedCoinView
      onClose={onClose}
      onCoinClick={onCoinClick}
      formatValue={(value: string | number) => {
        const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : value
        if (isNaN(numValue) || !isFinite(numValue)) return 'N/A'
        
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: numValue < 1 ? 6 : 2,
          maximumFractionDigits: numValue < 1 ? 6 : 2,
        }).format(numValue)
      }}
    />
  )
}
