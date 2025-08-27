import type { DateRange } from 'react-day-picker'
import { DateRangePicker } from "@/components/common/DateRangePicker"

interface DashboardHeaderProps {
  dateRange: DateRange | undefined
  onDateRangeChange: (range: DateRange | undefined) => void
}

export const DashboardHeader = ({
  dateRange,
  onDateRangeChange
}: DashboardHeaderProps) => {
  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold text-white mb-4">
        Dashboard de Métricas Financeiras
      </h2>
      <p className="text-lg text-slate-300 mb-8">
        Acompanhe o desempenho das principais criptomoedas em tempo real
      </p>

      <div className="flex justify-center mb-8">
        <DateRangePicker
          dateRange={dateRange}
          onDateRangeChange={onDateRangeChange}
        />
      </div>
    </div>
  )
}
