import { useMemo, useState } from "react";
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
import {
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Eye,
  Layers,
  TrendingUp,
  Info,
} from "lucide-react";
import type { ChartDataTransformed } from "@/types/api";

interface VirtualizedChartProps {
  data: ChartDataTransformed[];
  metricType: "price" | "volume" | "market_cap";
  title: string;
  maxPointsPerView?: number;
  allowFullView?: boolean;
}

export function VirtualizedChart({
  data,
  metricType,
  title,
  maxPointsPerView = 50,
  allowFullView = true,
}: VirtualizedChartProps) {
  const [currentChunk, setCurrentChunk] = useState(0);
  const [viewMode, setViewMode] = useState<
    "virtualized" | "complete" | "overview"
  >("overview");
  const [showHelp, setShowHelp] = useState(false);

  const { totalChunks, currentData, overviewData } = useMemo(() => {
    if (data.length <= maxPointsPerView) {
      return {
        totalChunks: 1,
        currentData: data,
        overviewData: data,
      };
    }

    const chunksArray = [];
    for (let i = 0; i < data.length; i += maxPointsPerView) {
      chunksArray.push(data.slice(i, i + maxPointsPerView));
    }

    const overviewPoints = 100;
    const step = Math.ceil(data.length / overviewPoints);
    const overview = data.filter((_, index) => index % step === 0);

    return {
      totalChunks: chunksArray.length,
      currentData: chunksArray[currentChunk] || [],
      overviewData: overview,
    };
  }, [data, maxPointsPerView, currentChunk]);

  const getValueFromData = (item: ChartDataTransformed) => {
    switch (metricType) {
      case "price":
        return item.price;
      case "volume":
        return item.volume;
      case "market_cap":
        return item.marketCap;
      default:
        return item.price;
    }
  };

  const formatValue = (value: number) => {
    if (metricType === "price") {
      return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: value < 1 ? 4 : 2,
        maximumFractionDigits: value < 1 ? 6 : 2,
      });
    }

    if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(0)}K`;
    return `$${value.toFixed(2)}`;
  };

  const handlePreviousChunk = () => {
    setCurrentChunk((prev) => Math.max(0, prev - 1));
  };

  const handleNextChunk = () => {
    setCurrentChunk((prev) => Math.min(totalChunks - 1, prev + 1));
  };

  const getDisplayData = () => {
    switch (viewMode) {
      case "complete":
        return data;
      case "overview":
        return overviewData;
      default:
        return currentData;
    }
  };

  const getChartInfo = () => {
    const displayData = getDisplayData();
    const totalPoints = data.length;

    switch (viewMode) {
      case "complete":
        return `Modo Completo: ${totalPoints} registros históricos (todas as datas)`;
      case "overview":
        return `Modo Inteligente: ${displayData.length} de ${totalPoints} registros (amostragem otimizada)`;
      default:
        return `Modo Detalhado: ${displayData.length} de ${totalPoints} registros (navegável por período)`;
    }
  };

  const getDateRange = () => {
    const displayData = getDisplayData();
    if (displayData.length === 0) return "";

    const sortedData = [...displayData].sort(
      (a, b) => a.timestamp - b.timestamp
    );
    const firstDate = format(sortedData[0].date, "dd/MM/yyyy");
    const lastDate = format(
      sortedData[sortedData.length - 1].date,
      "dd/MM/yyyy"
    );

    return firstDate === lastDate ? firstDate : `${firstDate} - ${lastDate}`;
  };

  const getCustomTicks = () => {
    const displayData = getDisplayData();
    if (displayData.length === 0) return [];

    const sortedData = [...displayData].sort(
      (a, b) => a.timestamp - b.timestamp
    );
    const startTime = sortedData[0].timestamp;
    const endTime = sortedData[sortedData.length - 1].timestamp;
    const totalDuration = endTime - startTime;

    const daysDiff = Math.ceil(totalDuration / (1000 * 60 * 60 * 24));
    let tickCount: number;

    if (daysDiff <= 7) tickCount = Math.min(daysDiff, sortedData.length);
    else if (daysDiff <= 30) tickCount = 5;
    else if (daysDiff <= 90) tickCount = 4;
    else if (daysDiff <= 365) tickCount = 5;
    else tickCount = 6;

    if (tickCount < 2) tickCount = 2;

    const ticks = [];
    for (let i = 0; i < tickCount; i++) {
      const ratio = i / (tickCount - 1);
      const tickTime = startTime + totalDuration * ratio;
      ticks.push(tickTime);
    }

    return ticks;
  };

  const getSmartDateFormat = () => {
    const displayData = getDisplayData();
    if (displayData.length === 0) return "dd/MM";

    const sortedData = [...displayData].sort(
      (a, b) => a.timestamp - b.timestamp
    );
    const firstDate = sortedData[0].date;
    const lastDate = sortedData[sortedData.length - 1].date;

    const daysDiff = Math.ceil(
      (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff <= 3) return "dd/MM HH:mm";
    if (daysDiff <= 7) return "dd/MM";
    if (daysDiff <= 30) return "dd/MM";
    if (daysDiff <= 90) return "dd MMM";
    if (daysDiff <= 365) return "MMM yy";
    return "MMM yy";
  };

  const getPerformanceWarning = () => {
    const displayData = getDisplayData();

    if (viewMode === "complete" && data.length > 500) {
      const sortedData = [...displayData].sort(
        (a, b) => a.timestamp - b.timestamp
      );
      const daysDiff =
        sortedData.length > 0
          ? Math.ceil(
              (sortedData[sortedData.length - 1].date.getTime() -
                sortedData[0].date.getTime()) /
                (1000 * 60 * 60 * 24)
            )
          : 0;

      return (
        <div className="flex items-center gap-2 px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <div className="h-2 w-2 bg-amber-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-amber-400">
            Grande período ({daysDiff} dias, {data.length} pontos) - considere
            modo "Inteligente" para melhor performance
          </span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full flex flex-col space-y-4">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-slate-800 rounded-lg border border-slate-700">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-cyan-400" />
            <div>
              <h3 className="text-lg font-medium text-slate-200">{title}</h3>
              <p className="text-sm text-slate-400">{getChartInfo()}</p>
            </div>
          </div>

          {allowFullView && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="text-xs text-slate-500 hidden sm:block">
                  Modo de visualização:
                </div>
                <button
                  onClick={() => setShowHelp(!showHelp)}
                  className="flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
                  title="Ver explicação dos modos de visualização"
                >
                  <Info className="h-3 w-3" />
                  <span className="hidden sm:inline">Ajuda</span>
                </button>
              </div>
              <div className="flex bg-slate-900 rounded-lg p-1 gap-1">
                <button
                  onClick={() => setViewMode("overview")}
                  className={`flex items-center gap-1 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    viewMode === "overview"
                      ? "bg-cyan-500 text-white"
                      : "text-slate-400 hover:text-slate-300 hover:bg-slate-800"
                  }`}
                  title="INTELIGENTE: Amostragem otimizada (~100 registros de datas) - Melhor custo-benefício entre performance e contexto completo. Recomendado para análise geral."
                >
                  <TrendingUp className="h-3 w-3" />
                  <span className="hidden sm:inline">Inteligente</span>
                </button>
                <button
                  onClick={() => setViewMode("virtualized")}
                  className={`flex items-center gap-1 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    viewMode === "virtualized"
                      ? "bg-cyan-500 text-white"
                      : "text-slate-400 hover:text-slate-300 hover:bg-slate-800"
                  }`}
                  title=" DETALHADO: Navegação por períodos (50 registros de datas cada) - Análise granular com controles de navegação temporal. Ideal para investigação profunda."
                >
                  <Layers className="h-3 w-3" />
                  <span className="hidden sm:inline">Detalhado</span>
                </button>
                <button
                  onClick={() => setViewMode("complete")}
                  className={`flex items-center gap-1 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    viewMode === "complete"
                      ? "bg-cyan-500 text-white"
                      : "text-slate-400 hover:text-slate-300 hover:bg-slate-800"
                  }`}
                  title="COMPLETO: Todos os registros históricos de uma vez (${data.length} datas) - Contexto temporal total sem navegação. Pode ser lento com muitos dados."
                >
                  <Eye className="h-3 w-3" />
                  <span className="hidden sm:inline">Completo</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {showHelp && (
          <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <Info className="h-4 w-4 text-cyan-400" />
              <h4 className="text-sm font-medium text-slate-200">
                Guia dos Modos de Visualização
              </h4>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-3 w-3 text-cyan-400" />
                  <span className="text-xs font-medium text-cyan-400">
                    INTELIGENTE
                  </span>
                  <span className="text-xs bg-green-500/20 text-green-400 px-1 rounded">
                    Recomendado
                  </span>
                </div>
                <p className="text-xs text-slate-300 mb-2">
                  Amostragem automática otimizada
                </p>
                <ul className="text-xs text-slate-400 space-y-1">
                  <li>• ~100 registros de datas representativas</li>
                  <li>• Mantém todas as tendências importantes</li>
                  <li>• Performance excelente</li>
                  <li>• Visão geral completa do período</li>
                </ul>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <Layers className="h-3 w-3 text-purple-400" />
                  <span className="text-xs font-medium text-purple-400">
                    DETALHADO
                  </span>
                </div>
                <p className="text-xs text-slate-300 mb-2">
                  Navegação por períodos
                </p>
                <ul className="text-xs text-slate-400 space-y-1">
                  <li>• 50 registros de datas por período</li>
                  <li>• Controles de navegação temporal</li>
                  <li>• Análise detalhada de cada período</li>
                  <li>• Máxima performance</li>
                </ul>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="h-3 w-3 text-amber-400" />
                  <span className="text-xs font-medium text-amber-400">
                    COMPLETO
                  </span>
                </div>
                <p className="text-xs text-slate-300 mb-2">
                  Todos os dados simultaneamente
                </p>
                <ul className="text-xs text-slate-400 space-y-1">
                  <li>• {data.length} registros históricos totais</li>
                  <li>• Todas as datas do período</li>
                  <li>• Sem navegação necessária</li>
                  <li>• Pode ser mais lento com muitos dados</li>
                </ul>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-600">
              <p className="text-xs text-slate-400">
                💡 <strong>Dica:</strong> Use "Inteligente" para análise geral
                do período, "Detalhado" para investigação específica, e
                "Completo" quando precisar ver todas as datas históricas
                simultaneamente.
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-600">
            <div className="h-2 w-2 bg-cyan-400 rounded-full"></div>
            <span className="text-sm text-slate-300">{getDateRange()}</span>
          </div>

          {viewMode === "virtualized" && totalChunks > 1 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-600">
              <span className="text-xs text-slate-400">
                Período {currentChunk + 1} de {totalChunks}
              </span>
            </div>
          )}

          {getPerformanceWarning()}
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={getDisplayData()}
            margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="timestamp"
              type="number"
              scale="time"
              domain={["dataMin", "dataMax"]}
              ticks={getCustomTicks()}
              tickFormatter={(timestamp) =>
                format(new Date(timestamp), getSmartDateFormat())
              }
              stroke="#9CA3AF"
              fontSize={11}
              angle={-45}
              textAnchor="end"
              height={70}
              interval={0}
            />
            <YAxis tickFormatter={formatValue} stroke="#9CA3AF" fontSize={12} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload[0]) return null;

                const data = payload[0].payload as ChartDataTransformed;
                const value = getValueFromData(data);

                return (
                  <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-lg">
                    <p className="text-slate-300 text-sm font-medium mb-1">
                      {label
                        ? format(new Date(label), "dd/MM/yyyy - HH:mm")
                        : "Data inválida"}
                    </p>
                    <p className="text-cyan-400 font-semibold">
                      {formatValue(value)}
                    </p>
                  </div>
                );
              }}
            />
            <Line
              type="monotone"
              dataKey={metricType}
              stroke="#06b6d4"
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 4,
                stroke: "#06b6d4",
                strokeWidth: 2,
                fill: "#0891b2",
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {viewMode === "virtualized" && totalChunks > 1 && (
        <div className="flex items-center justify-center space-x-4 p-3 bg-slate-800/50 rounded-lg border border-slate-600">
          <button
            onClick={handlePreviousChunk}
            disabled={currentChunk === 0}
            className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md bg-slate-800 text-slate-300 border border-slate-600 hover:bg-slate-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Período Anterior
          </button>

          <div className="text-center px-4">
            <div className="text-sm font-medium text-slate-300">
              {currentChunk + 1} / {totalChunks}
            </div>
            <div className="text-xs text-slate-500">
              {currentData.length} pontos neste período
            </div>
          </div>

          <button
            onClick={handleNextChunk}
            disabled={currentChunk === totalChunks - 1}
            className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md bg-slate-800 text-slate-300 border border-slate-600 hover:bg-slate-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Próximo Período
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
