export interface MetricConfig {
  id: string;
  enabled: boolean;
  order: number;
}

export interface CoinConfig {
  id: string;
  enabled: boolean;
  order: number;
}

export interface UserPreferences {
  periodMetrics: MetricConfig[];
  coinMetrics: CoinConfig[];

  defaultDateRange: {
    preset: string | null;
    customDays?: number;
  };

  display: {
    showPeriodMetrics: boolean;
    showCoinPrices: boolean;
    compactView: boolean;
    autoRefresh: boolean;
  };

  version: string;
  lastUpdated: string;
}

export interface MetricCategory {
  id: string;
  label: string;
  description: string;
  metrics: {
    id: string;
    label: string;
    description: string;
    enabled: boolean;
    required?: boolean;
  }[];
}

export interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onSave: (preferences: UserPreferences) => void;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  periodMetrics: [
    { id: "total-volume-period", enabled: true, order: 1 },
    { id: "market-movement-period", enabled: true, order: 2 },
    { id: "volatility-average-period", enabled: true, order: 3 },
  ],
  coinMetrics: [
    { id: "bitcoin", enabled: true, order: 1 },
    { id: "ethereum", enabled: true, order: 2 },
    { id: "binancecoin", enabled: true, order: 3 },
    { id: "cardano", enabled: true, order: 4 },
    { id: "solana", enabled: true, order: 5 },
    { id: "ripple", enabled: true, order: 6 },
    { id: "dogecoin", enabled: true, order: 7 },
    { id: "matic-network", enabled: true, order: 8 },
    { id: "avalanche-2", enabled: true, order: 9 },
    { id: "chainlink", enabled: true, order: 10 },
  ],
  defaultDateRange: {
    preset: "last-30-days",
  },
  display: {
    showPeriodMetrics: true,
    showCoinPrices: true,
    compactView: false,
    autoRefresh: true,
  },
  version: "1.0.0",
  lastUpdated: new Date().toISOString(),
};

export const METRIC_CATEGORIES: MetricCategory[] = [
  {
    id: "period-metrics",
    label: "Métricas do Período",
    description: "Dados calculados baseados no período selecionado",
    metrics: [
      {
        id: "total-volume-period",
        label: "Volume Total",
        description: "Soma de todos os volumes no período",
        enabled: true,
        required: false,
      },
      {
        id: "market-movement-period",
        label: "Movimento de Mercado",
        description: "Variação total de market cap",
        enabled: true,
        required: false,
      },
      {
        id: "volatility-average-period",
        label: "Volatilidade Média",
        description: "Desvio padrão médio das moedas",
        enabled: true,
        required: false,
      },
    ],
  },
  {
    id: "coin-prices",
    label: "Preços das Moedas",
    description: "Dados em tempo real das criptomoedas",
    metrics: [
      {
        id: "bitcoin",
        label: "Bitcoin (BTC)",
        description: "Primeira e maior criptomoeda",
        enabled: true,
        required: true,
      },
      {
        id: "ethereum",
        label: "Ethereum (ETH)",
        description: "Plataforma de contratos inteligentes",
        enabled: true,
        required: false,
      },
      {
        id: "binancecoin",
        label: "BNB (BNB)",
        description: "Token da Binance",
        enabled: true,
        required: false,
      },
      {
        id: "cardano",
        label: "Cardano (ADA)",
        description: "Blockchain sustentável",
        enabled: true,
        required: false,
      },
      {
        id: "solana",
        label: "Solana (SOL)",
        description: "Blockchain de alta performance",
        enabled: true,
        required: false,
      },
      {
        id: "ripple",
        label: "XRP (XRP)",
        description: "Sistema de pagamentos globais",
        enabled: true,
        required: false,
      },
      {
        id: "dogecoin",
        label: "Dogecoin (DOGE)",
        description: "Criptomoeda meme popular",
        enabled: true,
        required: false,
      },
      {
        id: "matic-network",
        label: "Polygon (MATIC)",
        description: "Solução de scaling para Ethereum",
        enabled: true,
        required: false,
      },
      {
        id: "avalanche-2",
        label: "Avalanche (AVAX)",
        description: "Plataforma DeFi rápida",
        enabled: true,
        required: false,
      },
      {
        id: "chainlink",
        label: "Chainlink (LINK)",
        description: "Rede de oráculos descentralizada",
        enabled: true,
        required: false,
      },
    ],
  },
];
