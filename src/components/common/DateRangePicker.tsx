import { useState } from 'react'
import { CalendarIcon, ChevronDown } from 'lucide-react'
import { format, subDays, startOfDay, endOfDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { DateRange } from 'react-day-picker'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { DATE_RANGES } from '@/constants'

interface DateRangePickerProps {
  dateRange?: DateRange
  onDateRangeChange?: (range: DateRange | undefined) => void
  className?: string
}

const datePresets = [
  {
    label: 'Últimos 7 dias',
    days: DATE_RANGES.LAST_7_DAYS,
    getValue: () => ({
      from: startOfDay(subDays(new Date(), 7)),
      to: endOfDay(new Date())
    })
  },
  {
    label: 'Últimos 30 dias',
    days: DATE_RANGES.LAST_30_DAYS,
    getValue: () => ({
      from: startOfDay(subDays(new Date(), 30)),
      to: endOfDay(new Date())
    })
  },
  {
    label: 'Últimos 90 dias',
    days: DATE_RANGES.LAST_90_DAYS,
    getValue: () => ({
      from: startOfDay(subDays(new Date(), 90)),
      to: endOfDay(new Date())
    })
  },
  {
    label: 'Último ano',
    days: DATE_RANGES.LAST_365_DAYS,
    getValue: () => ({
      from: startOfDay(subDays(new Date(), 365)),
      to: endOfDay(new Date())
    })
  }
]

export function DateRangePicker({
  dateRange,
  onDateRangeChange,
  className
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>(
    dateRange || datePresets[1].getValue() // Default: últimos 30 dias
  )

  const handleRangeSelect = (range: DateRange | undefined) => {
    setSelectedRange(range)
    onDateRangeChange?.(range)
  }

  const handlePresetClick = (preset: typeof datePresets[0]) => {
    const range = preset.getValue()
    handleRangeSelect(range)
    setIsOpen(false)
  }

  const formatDateRange = (range: DateRange | undefined) => {
    if (!range?.from) return 'Selecionar período'
    
    if (!range.to) {
      return format(range.from, 'dd/MM/yyyy', { locale: ptBR })
    }
    
    if (range.from.getTime() === range.to.getTime()) {
      return format(range.from, 'dd/MM/yyyy', { locale: ptBR })
    }
    
    return `${format(range.from, 'dd/MM/yyyy', { locale: ptBR })} - ${format(range.to, 'dd/MM/yyyy', { locale: ptBR })}`
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'justify-start text-left font-normal min-w-[280px]',
              'bg-slate-800/50 border-slate-700 text-slate-200',
              'hover:bg-slate-800/70 hover:border-slate-600',
              !selectedRange && 'text-slate-400'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDateRange(selectedRange)}
            <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto p-0 bg-slate-900 border-slate-700" 
          align="start"
        >
          <div className="flex">
            {/* Presets */}
            <div className="flex flex-col border-r border-slate-700 p-2">
              <div className="px-3 py-2 text-sm font-medium text-slate-300 border-b border-slate-700 mb-2">
                Períodos
              </div>
              {datePresets.map((preset) => (
                <Button
                  key={preset.label}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'justify-start text-slate-300 hover:bg-slate-800 hover:text-white',
                    'w-32 mb-1'
                  )}
                  onClick={() => handlePresetClick(preset)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
            
            {/* Calendar */}
            <div className="p-3">
              <Calendar
                mode="range"
                defaultMonth={selectedRange?.from}
                selected={selectedRange}
                onSelect={handleRangeSelect}
                numberOfMonths={2}
                className="text-slate-200"
                classNames={{
                  months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                  month: "space-y-4",
                  caption: "flex justify-center pt-1 relative items-center text-slate-200",
                  caption_label: "text-sm font-medium",
                  nav: "space-x-1 flex items-center",
                  nav_button: cn(
                    "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-slate-300 hover:bg-slate-800"
                  ),
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex",
                  head_cell: "text-slate-400 rounded-md w-9 font-normal text-[0.8rem]",
                  row: "flex w-full mt-2",
                  cell: "h-9 w-9 text-center text-sm p-0 relative text-slate-300",
                  day: cn(
                    "h-9 w-9 p-0 font-normal hover:bg-slate-800 hover:text-white",
                    "focus-visible:bg-slate-700"
                  ),
                  day_range_end: "day-range-end",
                  day_selected: "bg-cyan-600 text-white hover:bg-cyan-600 hover:text-white focus:bg-cyan-600 focus:text-white",
                  day_today: "bg-slate-700 text-white",
                  day_outside: "day-outside text-slate-600 opacity-50",
                  day_disabled: "text-slate-600 opacity-50",
                  day_range_middle: "aria-selected:bg-cyan-600/20 aria-selected:text-white",
                  day_hidden: "invisible",
                }}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
