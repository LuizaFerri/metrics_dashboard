import { useState } from "react";
import {
  Search,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Grid,
  List,
} from "lucide-react";
import { useExpandedCoinList } from "@/hooks/usePaginatedCoins";
import { MetricCard } from "@/components/common/MetricCard";
import { CompactMetricCard } from "@/components/common/CompactMetricCard";
import { CoinPagination } from "@/components/common/CoinPagination";
import { ErrorState } from "@/components/common/ErrorStates";
import { transformMarketDataToMetrics } from "@/utils/dataTransformers";
import type { MetricData } from "@/types/dashboard";

interface ExpandedCoinViewProps {
  onClose: () => void;
  onCoinClick?: (coinId: string) => void;
  formatValue?: (value: string | number) => string;
}

export function ExpandedCoinView({
  onClose,
  onCoinClick,
  formatValue,
}: ExpandedCoinViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { coins, isLoading, error, pagination } = useExpandedCoinList();

  const filteredCoins = coins.filter((coin) => {
    if (!searchTerm.trim()) return true;

    const term = searchTerm.toLowerCase();
    return (
      coin.name.toLowerCase().includes(term) ||
      coin.symbol.toLowerCase().includes(term) ||
      coin.id.toLowerCase().includes(term)
    );
  });

  const transformedMetrics: MetricData[] =
    transformMarketDataToMetrics(filteredCoins);

  const defaultFormatValue = (value: string | number) => {
    const numValue =
      typeof value === "string"
        ? parseFloat(value.replace(/[^0-9.-]/g, ""))
        : value;
    if (isNaN(numValue) || !isFinite(numValue)) return "N/A";

    return numValue.toLocaleString("pt-BR", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: numValue < 1 ? 4 : 2,
      maximumFractionDigits: numValue < 1 ? 6 : 2,
    });
  };

  const handleCoinClick = (metric: MetricData) => {
    if (onCoinClick) {
      onCoinClick(metric.id);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen p-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 sticky top-4 bg-slate-900/95 backdrop-blur rounded-lg p-4 border border-slate-700">
            <div className="block md:hidden space-y-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={onClose}
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md bg-slate-800 text-slate-300 border border-slate-600 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Voltar
                </button>

                <div className="flex items-center bg-slate-800 rounded-md border border-slate-600">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-l-md transition-colors ${
                      viewMode === "grid"
                        ? "bg-cyan-500 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-r-md transition-colors ${
                      viewMode === "list"
                        ? "bg-cyan-500 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div>
                <h1 className="text-lg font-bold text-white">
                  Explorar Criptomoedas
                </h1>
                <p className="text-xs text-slate-400">
                  {pagination.totalItems} moedas • Página{" "}
                  {pagination.currentPage}/{pagination.totalPages}
                </p>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Buscar moeda..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-md text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="hidden md:flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={onClose}
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md bg-slate-800 text-slate-300 border border-slate-600 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Voltar
                </button>

                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Explorar Criptomoedas
                  </h1>
                  <p className="text-sm text-slate-400">
                    {pagination.totalItems} moedas disponíveis • Página{" "}
                    {pagination.currentPage} de {pagination.totalPages}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Buscar moeda..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-md text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center bg-slate-800 rounded-md border border-slate-600">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-l-md transition-colors ${
                      viewMode === "grid"
                        ? "bg-cyan-500 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-r-md transition-colors ${
                      viewMode === "list"
                        ? "bg-cyan-500 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-cyan-400 mx-auto mb-4" />
                <p className="text-slate-400">
                  Carregando lista de criptomoedas...
                </p>
              </div>
            </div>
          ) : error ? (
            <ErrorState
              variant="api"
              title="Falha ao carregar moedas"
              message="Não foi possível carregar a lista expandida de criptomoedas"
              onRetry={() => window.location.reload()}
              className="min-h-[400px]"
            />
          ) : filteredCoins.length === 0 ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-300 mb-2">
                  Nenhuma moeda encontrada
                </h3>
                <p className="text-slate-400">
                  Tente ajustar sua busca ou limpar o filtro
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="mt-4 px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors"
                  >
                    Limpar busca
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              {searchTerm && (
                <div className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-600">
                  <p className="text-slate-300">
                    <span className="font-semibold">
                      {filteredCoins.length}
                    </span>{" "}
                    resultado(s) para{" "}
                    <span className="text-cyan-400 font-semibold">
                      "{searchTerm}"
                    </span>
                  </p>
                </div>
              )}

              <CoinPagination
                items={transformedMetrics}
                itemsPerPage={viewMode === "grid" ? 12 : 20}
                renderItem={(metric) => (
                  <div
                    key={metric.id}
                    className="transform hover:scale-105 transition-all duration-200"
                  >
                    {viewMode === "grid" ? (
                      <MetricCard
                        metric={metric}
                        onClick={() => handleCoinClick(metric)}
                        formatValue={formatValue || defaultFormatValue}
                        subtitle="Dados em tempo real"
                        className="h-full min-h-[140px]"
                      />
                    ) : (
                      <CompactMetricCard
                        metric={metric}
                        onClick={() => handleCoinClick(metric)}
                        formatValue={formatValue || defaultFormatValue}
                      />
                    )}
                  </div>
                )}
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
                    : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
                }
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
