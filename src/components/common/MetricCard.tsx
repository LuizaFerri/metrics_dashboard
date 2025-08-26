import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { MetricData } from '@/types/dashboard'

interface MetricCardProps {
  metric: MetricData
  onClick?: () => void
  isLoading?: boolean
  className?: string
  subtitle?: string
  formatValue?: (value: string | number) => string
}

export function MetricCard({ 
  metric, 
  onClick, 
  isLoading = false, 
  className,
  subtitle,
  formatValue = (value) => String(value)
}: MetricCardProps) {
  const { title, value, change, changeType, icon: Icon, color = 'blue' } = metric

  const getChangeColors = () => {
    switch (changeType) {
      case 'positive':
        return {
          text: 'text-emerald-400',
          bg: 'bg-emerald-500/10',
          icon: TrendingUp
        }
      case 'negative':
        return {
          text: 'text-red-400',
          bg: 'bg-red-500/10',
          icon: TrendingDown
        }
      default:
        return {
          text: 'text-slate-400',
          bg: 'bg-slate-500/10',
          icon: Minus
        }
    }
  }

  const changeColors = getChangeColors()
  const ChangeIcon = changeColors.icon

  const getCardColors = () => {
    switch (color) {
      case 'green':
        return 'border-emerald-500/20 bg-emerald-500/5'
      case 'red':
        return 'border-red-500/20 bg-red-500/5'
      case 'yellow':
        return 'border-amber-500/20 bg-amber-500/5'
      case 'purple':
        return 'border-purple-500/20 bg-purple-500/5'
      default:
        return 'border-cyan-500/20 bg-cyan-500/5'
    }
  }

  return (
    <div
      className={cn(
        "relative p-6 rounded-xl border transition-all duration-200",
        "bg-slate-800/40 backdrop-blur-sm border-slate-700/50",
        "hover:bg-slate-800/60 hover:border-slate-600/50 hover:shadow-lg hover:shadow-slate-900/20",
        onClick && "cursor-pointer hover:scale-[1.02]",
        isLoading && "animate-pulse",
        color && getCardColors(),
        className
      )}
      onClick={onClick}
    >
      <div className={cn(
        "absolute top-0 left-0 right-0 h-1 rounded-t-xl",
        color === 'green' && "bg-emerald-500",
        color === 'red' && "bg-red-500",
        color === 'yellow' && "bg-amber-500",
        color === 'purple' && "bg-purple-500",
        (!color || color === 'blue') && "bg-cyan-500"
      )} />

      <div className="flex items-start justify-between mb-4 gap-2">
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          {Icon && (
            <div className={cn(
              "p-2 rounded-lg flex-shrink-0",
              color === 'green' && "bg-emerald-500/20 text-emerald-400",
              color === 'red' && "bg-red-500/20 text-red-400",
              color === 'yellow' && "bg-amber-500/20 text-amber-400",
              color === 'purple' && "bg-purple-500/20 text-purple-400",
              (!color || color === 'blue') && "bg-cyan-500/20 text-cyan-400"
            )}>
              <Icon className="h-5 w-5" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wide truncate">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-slate-500 mt-1 truncate">{subtitle}</p>
            )}
          </div>
        </div>

        {change !== undefined && (
          <div className={cn(
            "flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium flex-shrink-0",
            changeColors.bg,
            changeColors.text
          )}>
            <ChangeIcon className="h-3 w-3 flex-shrink-0" />
            <span className="whitespace-nowrap">{Math.abs(change).toFixed(1)}%</span>
          </div>
        )}
      </div>

      <div className="mb-2">
        {isLoading ? (
          <div className="h-8 bg-slate-700 rounded animate-pulse"></div>
        ) : (
          <p className={cn(
            "font-bold text-white break-words overflow-hidden leading-tight",
            formatValue(value).length > 15 ? "text-lg" :
            formatValue(value).length > 12 ? "text-xl" : 
            formatValue(value).length > 8 ? "text-2xl" : "text-3xl"
          )}>
            {formatValue(value)}
          </p>
        )}
      </div>

      {onClick && (
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <TrendingUp className="h-4 w-4 text-slate-500" />
        </div>
      )}

      {isLoading && (
        <div className="absolute inset-0 bg-slate-800/20 rounded-xl flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  )
}
