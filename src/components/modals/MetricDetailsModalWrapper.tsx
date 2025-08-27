import { useToast } from "@/hooks/use-toast"
import { MetricDetailsModal } from "@/components/common/MetricDetailsModal"
import { useChartData } from "@/hooks/useChartData"
import type { MetricData } from '@/types/dashboard'
import type { DateRange } from 'react-day-picker'

interface MetricDetailsModalWrapperProps {
  metric: MetricData | null
  dateRange: DateRange
  isOpen: boolean
  onClose: () => void
}

export const MetricDetailsModalWrapper = ({
  metric,
  dateRange,
  isOpen,
  onClose
}: MetricDetailsModalWrapperProps) => {
  const { toast } = useToast()
  
  const {
    transformedData,
    isLoading,
    error,
    refetch
  } = useChartData(metric, dateRange, isOpen)

  const handleClose = () => {
    onClose()
  }

  const handleRetry = () => {
    if (!metric) {
      toast({
        title: "Erro",
        description: "Métrica não selecionada",
        variant: "destructive",
      })
      return
    }
    refetch()
    toast({
      title: "Tentando novamente...",
      description: "Recarregando dados do gráfico",
    })
  }

  if (!metric && isOpen) {
    toast({
      title: "Erro",
      description: "Métrica não selecionada",
      variant: "destructive",
    })
    return null
  }

  return (
    <MetricDetailsModal
      isOpen={isOpen}
      onClose={handleClose}
      metric={metric}
      chartData={transformedData}
      dateRange={dateRange}
      isLoading={isLoading}
      hasError={!!error}
      onRetry={handleRetry}
    />
  )
}
