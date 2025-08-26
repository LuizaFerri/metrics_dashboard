import { useState, useEffect, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import type {
  UserPreferences,
  MetricConfig,
  CoinConfig,
} from "@/types/preferences";
import { DEFAULT_PREFERENCES } from "@/types/preferences";

const STORAGE_KEY = "metrics_dashboard_preferences";

export function useUserPreferences() {
  const [preferences, setPreferences] =
    useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);

  const loadPreferences = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as UserPreferences;

        if (parsed.version === DEFAULT_PREFERENCES.version) {
          setPreferences(parsed);
        } else {
          const migrated = {
            ...DEFAULT_PREFERENCES,
            ...parsed,
            version: DEFAULT_PREFERENCES.version,
            lastUpdated: new Date().toISOString(),
          };
          setPreferences(migrated);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
        }
      }
    } catch (error) {
      console.error("Erro ao carregar preferências:", error);
      toast({
        title: "Erro ao carregar configurações",
        description: "Usando configurações padrão",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const savePreferences = useCallback((newPreferences: UserPreferences) => {
    try {
      const toSave = {
        ...newPreferences,
        lastUpdated: new Date().toISOString(),
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
      setPreferences(toSave);

      toast({
        title: "Configurações salvas",
        description: "Suas preferências foram atualizadas com sucesso",
        duration: 2000,
      });
    } catch (error) {
      console.error("Erro ao salvar preferências:", error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações",
        variant: "destructive",
      });
    }
  }, []);

  const resetPreferences = useCallback(() => {
    const defaultWithTimestamp = {
      ...DEFAULT_PREFERENCES,
      lastUpdated: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultWithTimestamp));
    setPreferences(defaultWithTimestamp);

    toast({
      title: "Configurações restauradas",
      description: "Todas as configurações foram resetadas para o padrão",
      duration: 3000,
    });
  }, []);

  const updatePeriodMetric = useCallback(
    (metricId: string, updates: Partial<MetricConfig>) => {
      setPreferences((prev) => ({
        ...prev,
        periodMetrics: prev.periodMetrics.map((metric) =>
          metric.id === metricId ? { ...metric, ...updates } : metric
        ),
      }));
    },
    []
  );

  const updateCoinMetric = useCallback(
    (coinId: string, updates: Partial<CoinConfig>) => {
      setPreferences((prev) => ({
        ...prev,
        coinMetrics: prev.coinMetrics.map((coin) =>
          coin.id === coinId ? { ...coin, ...updates } : coin
        ),
      }));
    },
    []
  );

  const getVisiblePeriodMetrics = useCallback(() => {
    return preferences.periodMetrics
      .filter((metric) => metric.enabled)
      .sort((a, b) => a.order - b.order)
      .map((metric) => metric.id);
  }, [preferences.periodMetrics]);

  const getVisibleCoins = useCallback(() => {
    return preferences.coinMetrics
      .filter((coin) => coin.enabled)
      .sort((a, b) => a.order - b.order)
      .map((coin) => coin.id);
  }, [preferences.coinMetrics]);

  const shouldShowPeriodMetrics = useCallback(() => {
    return (
      preferences.display.showPeriodMetrics &&
      preferences.periodMetrics.some((metric) => metric.enabled)
    );
  }, [preferences.display.showPeriodMetrics, preferences.periodMetrics]);

  const shouldShowCoinPrices = useCallback(() => {
    return (
      preferences.display.showCoinPrices &&
      preferences.coinMetrics.some((coin) => coin.enabled)
    );
  }, [preferences.display.showCoinPrices, preferences.coinMetrics]);

  const getPreferencesStats = useCallback(() => {
    const enabledPeriodMetrics = preferences.periodMetrics.filter(
      (m) => m.enabled
    ).length;
    const enabledCoins = preferences.coinMetrics.filter(
      (c) => c.enabled
    ).length;
    const totalMetrics = enabledPeriodMetrics + enabledCoins;

    return {
      enabledPeriodMetrics,
      enabledCoins,
      totalMetrics,
      isCompactView: preferences.display.compactView,
      autoRefresh: preferences.display.autoRefresh,
    };
  }, [preferences]);

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  return {
    preferences,
    isLoading,

    savePreferences,
    resetPreferences,
    updatePeriodMetric,
    updateCoinMetric,

    getVisiblePeriodMetrics,
    getVisibleCoins,
    shouldShowPeriodMetrics,
    shouldShowCoinPrices,
    getPreferencesStats,
  };
}
