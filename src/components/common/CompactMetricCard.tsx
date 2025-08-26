import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MetricData } from "@/types/dashboard";

interface CompactMetricCardProps {
  metric: MetricData;
  onClick?: () => void;
  formatValue?: (value: string | number) => string;
}

export function CompactMetricCard({
  metric,
  onClick,
  formatValue = (value) => String(value),
}: CompactMetricCardProps) {
  const {
    title,
    value,
    change,
    changeType,
    icon: Icon,
    color = "blue",
  } = metric;

  const getChangeIcon = () => {
    switch (changeType) {
      case "positive":
        return TrendingUp;
      case "negative":
        return TrendingDown;
      default:
        return Minus;
    }
  };

  const getCardColors = () => {
    switch (color) {
      case "green":
        return "border-emerald-500/30 bg-emerald-500/10";
      case "red":
        return "border-red-500/30 bg-red-500/10";
      case "yellow":
        return "border-amber-500/30 bg-amber-500/10";
      case "purple":
        return "border-purple-500/30 bg-purple-500/10";
      default:
        return "border-cyan-500/30 bg-cyan-500/10";
    }
  };

  const getIconColor = () => {
    switch (color) {
      case "green":
        return "text-emerald-400";
      case "red":
        return "text-red-400";
      case "yellow":
        return "text-amber-400";
      case "purple":
        return "text-purple-400";
      default:
        return "text-cyan-400";
    }
  };

  const ChangeIcon = getChangeIcon();
  const formattedValue = formatValue(value);

  return (
    <div
      className={cn(
        "relative p-4 rounded-xl border transition-all duration-200",
        "bg-slate-800/60 backdrop-blur-sm border-slate-700/50",
        "hover:bg-slate-800/80 hover:border-slate-600/50 hover:shadow-lg",
        onClick && "cursor-pointer hover:scale-[1.02]",
        getCardColors(),
        "min-h-[120px]"
      )}
      onClick={onClick}
    >
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-1 rounded-t-xl",
          color === "green" && "bg-emerald-500",
          color === "red" && "bg-red-500",
          color === "yellow" && "bg-amber-500",
          color === "purple" && "bg-purple-500",
          (!color || color === "blue") && "bg-cyan-500"
        )}
      />

      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {Icon && (
            <div
              className={cn(
                "p-1.5 rounded-lg flex-shrink-0",
                color === "green" && "bg-emerald-500/20",
                color === "red" && "bg-red-500/20",
                color === "yellow" && "bg-amber-500/20",
                color === "purple" && "bg-purple-500/20",
                (!color || color === "blue") && "bg-cyan-500/20"
              )}
            >
              <Icon className={cn("h-4 w-4", getIconColor())} />
            </div>
          )}
          <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wide truncate">
            {title}
          </h3>
        </div>

        {change !== undefined && (
          <div
            className={cn(
              "flex items-center gap-1 ml-2 flex-shrink-0 px-2 py-1 rounded-full text-xs font-medium",
              changeType === "positive" && "bg-emerald-500/10 text-emerald-400",
              changeType === "negative" && "bg-red-500/10 text-red-400",
              changeType === "neutral" && "bg-slate-500/10 text-slate-400"
            )}
          >
            <ChangeIcon className="h-3 w-3" />
            <span>{Math.abs(change).toFixed(1)}%</span>
          </div>
        )}
      </div>

      <div>
        <p
          className={cn(
            "font-bold text-white break-words overflow-hidden leading-tight",
            formattedValue.length > 15
              ? "text-base"
              : formattedValue.length > 10
              ? "text-lg"
              : "text-xl"
          )}
        >
          {formattedValue}
        </p>
      </div>
    </div>
  );
}
