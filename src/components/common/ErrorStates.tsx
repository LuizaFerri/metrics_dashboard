import { AlertTriangle, RefreshCw, WifiOff, TrendingDown, FileX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ErrorStateProps {
  variant?: 'network' | 'api' | 'data' | 'generic' | 'empty'
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
  showRetry?: boolean
}

export function ErrorState({
  variant = 'generic',
  title,
  message,
  onRetry,
  className,
  showRetry = true
}: ErrorStateProps) {
  const variants = {
    network: {
      icon: WifiOff,
      title: 'Erro de Conexão',
      message: 'Verifique sua conexão com a internet e tente novamente.',
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20'
    },
    api: {
      icon: AlertTriangle,
      title: 'Erro na API',
      message: 'Não foi possível carregar os dados. A API pode estar temporariamente indisponível.',
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20'
    },
    data: {
      icon: TrendingDown,
      title: 'Dados Indisponíveis',
      message: 'Os dados solicitados não estão disponíveis para o período selecionado.',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    empty: {
      icon: FileX,
      title: 'Nenhum Dado Encontrado',
      message: 'Não há dados disponíveis para exibir neste momento.',
      color: 'text-slate-400',
      bgColor: 'bg-slate-500/10',
      borderColor: 'border-slate-500/20'
    },
    generic: {
      icon: AlertTriangle,
      title: 'Algo deu errado',
      message: 'Ocorreu um erro inesperado. Por favor, tente novamente.',
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20'
    }
  }

  const config = variants[variant]
  const Icon = config.icon

  return (
    <div className={cn(
      'flex flex-col items-center justify-center p-8 rounded-lg border',
      'bg-slate-800/40 backdrop-blur-sm',
      config.bgColor,
      config.borderColor,
      className
    )}>
      <div className={cn(
        'p-4 rounded-full mb-4',
        config.bgColor,
        config.borderColor,
        'border'
      )}>
        <Icon className={cn('h-8 w-8', config.color)} />
      </div>

      <h3 className="text-lg font-semibold text-white mb-2">
        {title || config.title}
      </h3>

      <p className="text-slate-300 text-center text-sm mb-6 max-w-md">
        {message || config.message}
      </p>

      {showRetry && onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          className={cn(
            'bg-slate-800/50 border-slate-600 text-slate-200',
            'hover:bg-slate-700/50 hover:border-slate-500',
            'transition-colors duration-200'
          )}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Tentar Novamente
        </Button>
      )}
    </div>
  )
}

export function MetricErrorCard({ 
  onRetry, 
  className 
}: { 
  onRetry?: () => void
  className?: string 
}) {
  return (
    <div className={cn(
      'relative p-6 rounded-xl border transition-all duration-200',
      'bg-slate-800/40 backdrop-blur-sm border-red-500/20',
      'hover:border-red-500/30',
      className
    )}>
      <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl bg-red-500" />

      <div className="flex items-center justify-center h-32">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-red-400 mx-auto mb-3" />
          <p className="text-sm text-red-300 mb-3">Erro ao carregar</p>
          {onRetry && (
            <Button
              onClick={onRetry}
              size="sm"
              variant="outline"
              className="bg-red-500/10 border-red-500/30 text-red-300 hover:bg-red-500/20"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export function ChartErrorState({ 
  onRetry,
  height = "h-64 sm:h-80" 
}: { 
  onRetry?: () => void
  height?: string
}) {
  return (
    <div className="bg-slate-800/30 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-white">
        Evolução Histórica
      </h3>
      <div className={cn(height, "flex items-center justify-center")}>
        <ErrorState
          variant="data"
          title="Gráfico Indisponível"
          message="Não foi possível carregar os dados do gráfico."
          onRetry={onRetry}
          className="border-none bg-transparent"
        />
      </div>
    </div>
  )
}

export function PageErrorState({
  onRetry,
  onGoHome
}: {
  onRetry?: () => void
  onGoHome?: () => void
}) {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-4">
          <div className="mx-auto w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
            <AlertTriangle className="w-12 h-12 text-red-400" />
          </div>
          
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Ops! Algo deu errado
            </h1>
            <p className="text-slate-400">
              Não foi possível carregar o dashboard. Verifique sua conexão e tente novamente.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRetry && (
            <Button
              onClick={onRetry}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar Novamente
            </Button>
          )}
          {onGoHome && (
            <Button
              onClick={onGoHome}
              variant="outline"
              className="bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700"
            >
              Voltar ao Início
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

