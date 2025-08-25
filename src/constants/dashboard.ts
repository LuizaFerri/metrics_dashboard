
export const METRIC_TYPES = {
  PRICE: 'price',
  VOLUME: 'volume', 
  MARKET_CAP: 'market_cap',
  CHANGE_24H: 'change_24h'
} as const

export const DATE_RANGES = {
  LAST_7_DAYS: 7,
  LAST_30_DAYS: 30,
  LAST_90_DAYS: 90,
  LAST_365_DAYS: 365
} as const

export const CHART_COLORS = {
  PRIMARY: '#06B6D4',     // cyan-500 - azul ciano como na imagem
  SUCCESS: '#10B981',     // emerald-500 - verde para valores positivos
  DANGER: '#EF4444',      // red-500 - vermelho para valores negativos
  WARNING: '#F59E0B',     // amber-500 - amarelo para neutro
  PURPLE: '#8B5CF6',      // violet-500 - roxo para destaque
  ACCENT: '#22D3EE',      // cyan-400 - ciano claro
  GRADIENT: ['#06B6D4', '#22D3EE']  // Gradiente ciano
} as const

export const STORAGE_KEYS = {
  USER_PREFERENCES: 'metrics_dashboard_preferences',
  SELECTED_METRICS: 'selected_metrics',
  DEFAULT_DATE_RANGE: 'default_date_range',
  FAVORITE_COINS: 'favorite_coins'
} as const

export const DASHBOARD_CONFIG = {
  GRID_COLS: {
    MOBILE: 1,
    TABLET: 2,
    DESKTOP: 3,
    LARGE: 4
  },
  ANIMATION_DURATION: 200,
  AUTO_REFRESH_INTERVAL: 60000, // 1 minute
  LOADING_DEBOUNCE: 300
} as const
