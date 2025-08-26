import { useState, useEffect } from "react";
import { Settings, RotateCcw, Check, X, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import type { UserPreferences } from "@/types/preferences";
import { METRIC_CATEGORIES } from "@/types/preferences";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onSave: (preferences: UserPreferences) => void;
  onReset: () => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  preferences,
  onSave,
  onReset,
}: SettingsModalProps) {
  const [localPreferences, setLocalPreferences] =
    useState<UserPreferences>(preferences);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLocalPreferences(preferences);
      setHasChanges(false);
    }
  }, [isOpen, preferences]);

  useEffect(() => {
    const hasChanged =
      JSON.stringify(localPreferences) !== JSON.stringify(preferences);
    setHasChanges(hasChanged);
  }, [localPreferences, preferences]);

  const handleSave = () => {
    onSave(localPreferences);
    onClose();
  };

  const handleReset = () => {
    onReset();
    onClose();
  };

  const handleCancel = () => {
    setLocalPreferences(preferences);
    setHasChanges(false);
    onClose();
  };

  const updateDisplaySetting = (
    key: keyof UserPreferences["display"],
    value: boolean
  ) => {
    setLocalPreferences((prev) => ({
      ...prev,
      display: {
        ...prev.display,
        [key]: value,
      },
    }));
  };

  const updatePeriodMetric = (metricId: string, enabled: boolean) => {
    setLocalPreferences((prev) => ({
      ...prev,
      periodMetrics: prev.periodMetrics.map((metric) =>
        metric.id === metricId ? { ...metric, enabled } : metric
      ),
    }));
  };

  const updateCoinMetric = (coinId: string, enabled: boolean) => {
    setLocalPreferences((prev) => ({
      ...prev,
      coinMetrics: prev.coinMetrics.map((coin) =>
        coin.id === coinId ? { ...coin, enabled } : coin
      ),
    }));
  };

  const getMetricEnabled = (categoryId: string, metricId: string) => {
    if (categoryId === "period-metrics") {
      return (
        localPreferences.periodMetrics.find((m) => m.id === metricId)
          ?.enabled ?? false
      );
    } else {
      return (
        localPreferences.coinMetrics.find((c) => c.id === metricId)?.enabled ??
        false
      );
    }
  };

  const enabledPeriodCount = localPreferences.periodMetrics.filter(
    (m) => m.enabled
  ).length;
  const enabledCoinCount = localPreferences.coinMetrics.filter(
    (c) => c.enabled
  ).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-400" />
            Configurações do Dashboard
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Personalize quais métricas e moedas você deseja visualizar no
            dashboard.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="metrics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800">
            <TabsTrigger
              value="metrics"
              className="data-[state=active]:bg-blue-600"
            >
              Métricas
            </TabsTrigger>
            <TabsTrigger
              value="display"
              className="data-[state=active]:bg-blue-600"
            >
              Exibição
            </TabsTrigger>
          </TabsList>

          <TabsContent value="metrics" className="space-y-6">
            {METRIC_CATEGORIES.map((category) => (
              <div key={category.id} className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    {category.label}
                    <span className="text-sm font-normal text-slate-400">
                      (
                      {category.id === "period-metrics"
                        ? enabledPeriodCount
                        : enabledCoinCount}{" "}
                      ativas)
                    </span>
                  </h3>
                  <p className="text-sm text-slate-400">
                    {category.description}
                  </p>
                </div>

                <div className="grid gap-3">
                  {category.metrics.map((metric) => {
                    const isEnabled = getMetricEnabled(category.id, metric.id);
                    const isRequired = metric.required;

                    return (
                      <div
                        key={metric.id}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-lg border transition-colors",
                          isEnabled
                            ? "bg-slate-800/50 border-slate-600"
                            : "bg-slate-800/20 border-slate-700/50",
                          isRequired && "border-blue-500/30 bg-blue-500/5"
                        )}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div
                            className={cn(
                              "p-1 rounded",
                              isEnabled ? "text-green-400" : "text-slate-500"
                            )}
                          >
                            {isEnabled ? (
                              <Eye className="h-4 w-4" />
                            ) : (
                              <EyeOff className="h-4 w-4" />
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Label className="text-sm font-medium text-white">
                                {metric.label}
                              </Label>
                              {isRequired && (
                                <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full">
                                  Obrigatório
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 mt-1">
                              {metric.description}
                            </p>
                          </div>
                        </div>

                        <Switch
                          checked={isEnabled}
                          onCheckedChange={(enabled) => {
                            if (category.id === "period-metrics") {
                              updatePeriodMetric(metric.id, enabled);
                            } else {
                              updateCoinMetric(metric.id, enabled);
                            }
                          }}
                          disabled={isRequired}
                          className="data-[state=checked]:bg-blue-600"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="display" className="space-y-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  Configurações de Layout
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-600">
                    <div>
                      <Label className="text-sm font-medium text-white">
                        Mostrar Métricas do Período
                      </Label>
                      <p className="text-xs text-slate-400 mt-1">
                        Exibir seção com métricas calculadas do período
                      </p>
                    </div>
                    <Switch
                      checked={localPreferences.display.showPeriodMetrics}
                      onCheckedChange={(checked) =>
                        updateDisplaySetting("showPeriodMetrics", checked)
                      }
                      className="data-[state=checked]:bg-blue-600"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-600">
                    <div>
                      <Label className="text-sm font-medium text-white">
                        Mostrar Preços das Moedas
                      </Label>
                      <p className="text-xs text-slate-400 mt-1">
                        Exibir seção com preços atuais das criptomoedas
                      </p>
                    </div>
                    <Switch
                      checked={localPreferences.display.showCoinPrices}
                      onCheckedChange={(checked) =>
                        updateDisplaySetting("showCoinPrices", checked)
                      }
                      className="data-[state=checked]:bg-blue-600"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-600">
                    <div>
                      <Label className="text-sm font-medium text-white">
                        Atualização Automática
                      </Label>
                      <p className="text-xs text-slate-400 mt-1">
                        Atualizar dados automaticamente a cada minuto
                      </p>
                    </div>
                    <Switch
                      checked={localPreferences.display.autoRefresh}
                      onCheckedChange={(checked) =>
                        updateDisplaySetting("autoRefresh", checked)
                      }
                      className="data-[state=checked]:bg-blue-600"
                    />
                  </div>
                </div>
              </div>

              <Separator className="bg-slate-700" />

              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  Resumo das Configurações
                </h3>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-300">
                    <span>Métricas do período ativas:</span>
                    <span className="text-blue-400 font-medium">
                      {enabledPeriodCount}/3
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Moedas ativas:</span>
                    <span className="text-green-400 font-medium">
                      {enabledCoinCount}/10
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Total de métricas:</span>
                    <span className="text-purple-400 font-medium">
                      {enabledPeriodCount + enabledCoinCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between pt-4 border-t border-slate-700 gap-4">
          <button
            onClick={handleReset}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md bg-slate-800 text-slate-300 border border-slate-600 hover:bg-slate-700 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Restaurar Padrão
          </button>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 w-full sm:w-auto">
            <button
              onClick={handleCancel}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md bg-slate-800 text-slate-300 border border-slate-600 hover:bg-slate-700 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Check className="h-4 w-4 mr-2" />
              Salvar Alterações
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
