import { TrendingUp, TrendingDown } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CHART_COLORS } from "@/constants";
import type { MetricData } from "@/types/dashboard";

interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

interface MetricDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  metric: MetricData | null;
  chartData: ChartDataPoint[];
  dateRange?: DateRange;
}

export function MetricDetailsModal({
  isOpen,
  onClose,
  metric,
  chartData,
  dateRange,
}: MetricDetailsModalProps) {
  if (!metric) return null;

  const { title, change, changeType, icon: Icon, color } = metric;

  const getChartColor = () => {
    switch (color) {
      case "green":
        return CHART_COLORS.SUCCESS;
      case "red":
        return CHART_COLORS.DANGER;
      case "yellow":
        return CHART_COLORS.WARNING;
      case "purple":
        return CHART_COLORS.PURPLE;
      default:
        return CHART_COLORS.PRIMARY;
    }
  };

  const formatTooltipValue = (value: number) => {
    if (metric.id.includes("price") || metric.id.includes("value")) {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "USD",
      }).format(value);
    }

    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(2)}B`;
    }

    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    }

    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const values = chartData.map((d) => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const avgValue = values.reduce((a, b) => a + b, 0) / values.length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] w-[95vw] sm:w-full bg-slate-900 border-slate-700 text-white overflow-y-auto">
        <DialogHeader className="space-y-4 pb-6">
          <div className="flex items-center space-x-3">
            {Icon && (
              <div
                className={cn(
                  "p-3 rounded-lg",
                  color === "green" && "bg-emerald-500/20 text-emerald-400",
                  color === "red" && "bg-red-500/20 text-red-400",
                  color === "yellow" && "bg-amber-500/20 text-amber-400",
                  color === "purple" && "bg-purple-500/20 text-purple-400",
                  (!color || color === "blue") && "bg-cyan-500/20 text-cyan-400"
                )}
              >
                <Icon className="h-6 w-6" />
              </div>
            )}
            <div>
              <DialogTitle className="text-2xl font-bold text-white">
                {title}
              </DialogTitle>
              <p className="text-slate-400 text-sm">
                {dateRange?.from && dateRange?.to
                  ? `${format(dateRange.from, "dd/MM/yyyy", {
                      locale: ptBR,
                    })} - ${format(dateRange.to, "dd/MM/yyyy", {
                      locale: ptBR,
                    })}`
                  : "Últimos 30 dias"}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-slate-400 text-sm">Valor Atual</p>
            <p className="text-2xl font-bold text-white">
              {formatTooltipValue(values[values.length - 1])}
            </p>
            {change !== undefined && (
              <div
                className={cn(
                  "flex items-center space-x-1 mt-2",
                  changeType === "positive"
                    ? "text-emerald-400"
                    : "text-red-400"
                )}
              >
                {changeType === "positive" ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span className="text-sm font-medium">{Math.abs(change)}%</span>
              </div>
            )}
          </div>

          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-slate-400 text-sm">Máximo</p>
            <p className="text-xl font-bold text-emerald-400">
              {formatTooltipValue(maxValue)}
            </p>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-slate-400 text-sm">Mínimo</p>
            <p className="text-xl font-bold text-red-400">
              {formatTooltipValue(minValue)}
            </p>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-slate-400 text-sm">Média</p>
            <p className="text-xl font-bold text-slate-300">
              {formatTooltipValue(avgValue)}
            </p>
          </div>
        </div>

        <div className="bg-slate-800/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-white">
            Evolução Histórica
          </h3>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={12}
                  tickFormatter={(value) => {
                    if (value >= 1000000000)
                      return `${(value / 1000000000).toFixed(1)}B`;
                    if (value >= 1000000)
                      return `${(value / 1000000).toFixed(1)}M`;
                    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
                    return value.toFixed(0);
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                    borderRadius: "8px",
                    color: "#f8fafc",
                  }}
                  formatter={(value: number) => [
                    formatTooltipValue(value),
                    title,
                  ]}
                  labelFormatter={(label) => `Data: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={getChartColor()}
                  strokeWidth={3}
                  dot={false}
                  activeDot={{
                    r: 6,
                    fill: getChartColor(),
                    stroke: "#1e293b",
                    strokeWidth: 2,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
