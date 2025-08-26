import { useState, useEffect } from "react";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DATE_RANGES } from "@/constants";

interface DateRangePickerProps {
  dateRange?: DateRange;
  onDateRangeChange?: (range: DateRange | undefined) => void;
  className?: string;
}

const datePresets = [
  {
    label: "Hoje",
    days: 0,
    getValue: () => ({
      from: startOfDay(new Date()),
      to: endOfDay(new Date()),
    }),
  },
  {
    label: "Últimos 7 dias",
    days: DATE_RANGES.LAST_7_DAYS,
    getValue: () => ({
      from: startOfDay(subDays(new Date(), 7)),
      to: endOfDay(new Date()),
    }),
  },
  {
    label: "Últimos 30 dias",
    days: DATE_RANGES.LAST_30_DAYS,
    getValue: () => ({
      from: startOfDay(subDays(new Date(), 30)),
      to: endOfDay(new Date()),
    }),
  },
  {
    label: "Últimos 90 dias",
    days: DATE_RANGES.LAST_90_DAYS,
    getValue: () => ({
      from: startOfDay(subDays(new Date(), 90)),
      to: endOfDay(new Date()),
    }),
  },
  {
    label: "Último ano",
    days: DATE_RANGES.LAST_365_DAYS,
    getValue: () => ({
      from: startOfDay(subDays(new Date(), 365)),
      to: endOfDay(new Date()),
    }),
  },
];

export function DateRangePicker({
  dateRange,
  onDateRangeChange,
  className,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>(
    dateRange || datePresets[2].getValue()
  );
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleRangeSelect = (range: DateRange | undefined) => {
    setSelectedRange(range);
    onDateRangeChange?.(range);
  };

  const handlePresetClick = (preset: (typeof datePresets)[0]) => {
    const range = preset.getValue();
    handleRangeSelect(range);
    setIsOpen(false);
  };

  const formatDateRange = (range: DateRange | undefined) => {
    if (!range?.from) return "Selecionar período";

    if (!range.to) {
      return format(range.from, "dd/MM/yyyy", { locale: ptBR });
    }

    if (range.from.getTime() === range.to.getTime()) {
      return format(range.from, "dd/MM/yyyy", { locale: ptBR });
    }

    return `${format(range.from, "dd/MM/yyyy", { locale: ptBR })} - ${format(
      range.to,
      "dd/MM/yyyy",
      { locale: ptBR }
    )}`;
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start text-left font-normal w-full sm:min-w-[280px]",
              "bg-slate-800/50 border-slate-700 text-slate-200",
              "hover:bg-slate-800/70 hover:border-slate-600",
              !selectedRange && "text-slate-400"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDateRange(selectedRange)}
            <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto max-w-[95vw] p-0 bg-slate-900 border-slate-700"
          align="start"
          side="bottom"
          sideOffset={5}
        >
          <div className="flex flex-col lg:flex-row">
            <div className="flex flex-col lg:border-r lg:border-slate-700 p-2 lg:w-auto w-full">
              <div className="px-3 py-2 text-sm font-medium text-slate-300 border-b border-slate-700 mb-2">
                Períodos
              </div>
              <div className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible">
                {datePresets.map((preset) => (
                  <Button
                    key={preset.label}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "justify-start text-slate-300 hover:bg-slate-800 hover:text-white whitespace-nowrap",
                      "lg:w-32 lg:mb-1 flex-shrink-0"
                    )}
                    onClick={() => handlePresetClick(preset)}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="p-2 sm:p-3 w-full overflow-hidden">
              <Calendar
                mode="range"
                defaultMonth={selectedRange?.from}
                selected={selectedRange}
                onSelect={handleRangeSelect}
                numberOfMonths={isMobile ? 1 : 2}
                className="text-slate-200"
                classNames={{
                  months:
                    "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                  month: "space-y-4 w-full",
                  caption:
                    "flex justify-center pt-1 relative items-center text-slate-200 px-8",
                  caption_label: "text-sm font-medium",
                  nav: "space-x-1 flex items-center",
                  nav_button: cn(
                    "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-slate-300 hover:bg-slate-800"
                  ),
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex w-full",
                  head_cell:
                    "text-slate-400 rounded-md flex-1 font-normal text-[0.8rem] text-center min-w-8",
                  row: "flex w-full mt-2",
                  cell: "flex-1 text-center text-sm p-0 relative text-slate-300 min-w-8",
                  day: cn(
                    "h-8 w-8 mx-auto p-0 font-normal hover:bg-slate-800 hover:text-white",
                    "focus-visible:bg-slate-700 text-xs sm:text-sm"
                  ),
                  day_range_end: "day-range-end",
                  day_selected:
                    "bg-cyan-600 text-white hover:bg-cyan-600 hover:text-white focus:bg-cyan-600 focus:text-white",
                  day_today: "bg-slate-700 text-white",
                  day_outside: "day-outside text-slate-600 opacity-50",
                  day_disabled: "text-slate-600 opacity-50",
                  day_range_middle:
                    "aria-selected:bg-cyan-600/20 aria-selected:text-white",
                  day_hidden: "invisible",
                }}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
