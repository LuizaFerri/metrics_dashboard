import {
  getApiBaseUrl,
  COINGECKO_API_KEY,
  SUPPORTED_COINS,
  API_ENDPOINTS,
  RATE_LIMIT_DELAY,
} from "@/constants/api";
import type {
  CoinGeckoMarketData,
  CoinGeckoHistoricalData,
  CoinGeckoDetails,
  ApiError,
  DateRange,
} from "@/types/api";

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export class CoinGeckoApiService {
  private baseUrl = getApiBaseUrl();
  private lastRequestTime = 0;

  private async enforceRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    const currentDelay = COINGECKO_API_KEY ? 1000 : RATE_LIMIT_DELAY;

    if (timeSinceLastRequest < currentDelay) {
      const waitTime = currentDelay - timeSinceLastRequest;
      await delay(waitTime);
    }

    this.lastRequestTime = Date.now();
  }

  private async fetchWithRetry(
    url: string,
    maxRetries: number = 3
  ): Promise<Response> {
    await this.enforceRateLimit();

    let finalUrl = url;
    if (COINGECKO_API_KEY) {
      const separator = url.includes('?') ? '&' : '?';
      finalUrl = `${url}${separator}x_cg_demo_api_key=${COINGECKO_API_KEY}`;
    }

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const headers: Record<string, string> = {
          'User-Agent': 'Mozilla/5.0 (compatible; MetricsDashboard/1.0)',
          'Accept': 'application/json',
        };

        if (COINGECKO_API_KEY) {
          headers['X-CG-API-KEY'] = COINGECKO_API_KEY;
        } else {
          console.log('API Key não encontrada');
        }

        const response = await fetch(finalUrl, { headers });

        if (response.ok) {
          return response;
        }

        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After');
          const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 2000 * attempt;
          
          await delay(waitTime);
          continue;
        }

        if (response.status >= 500) {
          if (attempt < maxRetries) {
            const waitTime = 1000 * attempt;
            await delay(waitTime);
            continue;
          }
        }

        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      } catch (error) {
        if (error instanceof TypeError && attempt < maxRetries) {
          const waitTime = 1000 * attempt;
          await delay(waitTime);
          continue;
        }

        if (attempt === maxRetries) {
          throw this.createApiError(error as Error);
        }
      }
    }

    throw new Error("Todas as tentativas falharam");
  }

  private createApiError(error: Error): ApiError {
    if (error instanceof TypeError) {
      return {
        type: "network",
        message: "Verifique sua conexão com a internet",
        originalError: error,
      };
    }

    if (error.message.includes("429")) {
      return {
        type: "rate_limit",
        message: "Muitas requisições. Aguarde alguns minutos.",
        originalError: error,
      };
    }

    if (
      error.message.includes("500") ||
      error.message.includes("502") ||
      error.message.includes("503")
    ) {
      return {
        type: "server",
        message: "Serviço temporariamente indisponível",
        originalError: error,
      };
    }

    return {
      type: "api",
      message: "Falha ao carregar dados da CoinGecko",
      originalError: error,
    };
  }

  async getMarketData(
    coinIds: readonly string[] = SUPPORTED_COINS
  ): Promise<CoinGeckoMarketData[]> {
    const ids = coinIds.join(",");
    const url = `${this.baseUrl}${API_ENDPOINTS.MARKET_DATA}?ids=${ids}&vs_currency=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true`;

    try {
      const response = await this.fetchWithRetry(url);
      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Erro ao buscar market data:", error);
      throw error;
    }
  }

  async getHistoricalData(
    coinId: string,
    dateRange: DateRange
  ): Promise<CoinGeckoHistoricalData> {
    if (!dateRange.from || !dateRange.to) {
      throw new Error("Date range inválido");
    }

    const fromTimestamp = Math.floor(dateRange.from.getTime() / 1000);
    const toTimestamp = Math.floor(dateRange.to.getTime() / 1000);

    const daysDiff = Math.ceil(
      (dateRange.to.getTime() - dateRange.from.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    let url: string;
    if (daysDiff <= 90) {
      url = `${this.baseUrl}${API_ENDPOINTS.HISTORICAL_RANGE}/${coinId}/market_chart/range?vs_currency=usd&from=${fromTimestamp}&to=${toTimestamp}`;
    } else {
      url = `${this.baseUrl}${API_ENDPOINTS.HISTORICAL_RANGE}/${coinId}/market_chart?vs_currency=usd&days=${daysDiff}`;
    }

    try {
      const response = await this.fetchWithRetry(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(
        ` Erro ao buscar dados históricos para ${coinId}:`,
        error
      );
      throw error;
    }
  }

  async getCoinDetails(coinId: string): Promise<CoinGeckoDetails> {
    const url = `${this.baseUrl}${API_ENDPOINTS.COIN_DETAILS}/${coinId}?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false`;

    try {
      const response = await this.fetchWithRetry(url);
      const data = await response.json();

      return data;
    } catch (error) {
      console.error(` Erro ao buscar detalhes para ${coinId}:`, error);
      throw error;
    }
  }

  async ping(): Promise<boolean> {
    try {
      const url = `${this.baseUrl}/ping`;
      const response = await this.fetchWithRetry(url, 1);
      const data = await response.json();

      return data.gecko_says === "(V3) To the Moon!";
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}

export const coinGeckoApi = new CoinGeckoApiService();

export const { getMarketData, getHistoricalData, getCoinDetails, ping } =
  coinGeckoApi;
