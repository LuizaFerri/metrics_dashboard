import { TrendingUp, BarChart3, Settings } from "lucide-react";

interface HeaderProps {
  onSettingsClick?: () => void;
}

export function Header({ onSettingsClick }: HeaderProps) {
  return (
    <header className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <TrendingUp className="h-8 w-8 text-cyan-400" />
                <BarChart3 className="h-4 w-4 text-cyan-300 absolute -bottom-1 -right-1" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  Crypto Dashboard
                </h1>
                <p className="text-xs text-slate-400 hidden sm:block">
                  Métricas em tempo real
                </p>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4 text-sm text-slate-300">
            <span className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span>Dados atualizados</span>
            </span>
            <span className="text-slate-500">|</span>
            <span>CoinGecko API</span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="md:hidden">
              <div className="flex items-center space-x-1 text-xs text-slate-300">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span>Online</span>
              </div>
            </div>

            <button
              onClick={onSettingsClick}
              className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md bg-slate-800 text-slate-300 border border-slate-600 hover:bg-slate-700 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              <Settings className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Configurações</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
