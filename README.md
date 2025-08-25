# 📊 Dashboard de Métricas - CoinGecko

Dashboard web para visualização e análise de métricas financeiras de criptomoedas usando a API pública do CoinGecko.

## 🚀 Tecnologias e Dependências

### Stack Principal
- **React 19** - Biblioteca de UI com recursos mais recentes
- **Vite 7.1** - Build tool moderna e rápida
- **TypeScript 5.8** - Tipagem estática para maior segurança
- **Tailwind CSS 3.4** - Framework de CSS utilitário para styling responsivo

### UI/UX e Componentes
- **shadcn/ui** - Biblioteca de componentes acessíveis e elegantes
  - `button`, `card`, `calendar`, `input`, `label`, `popover`, `select`
- **Lucide React** - Ícones SVG modernos e consistentes
- **tailwindcss-animate** - Animações suaves integradas ao Tailwind

### Gerenciamento de Estado e API
- **@tanstack/react-query** - Cache, sincronização e gerenciamento de estado de servidor
- **date-fns** - Biblioteca moderna para manipulação de datas

### Visualização de Dados
- **Recharts** - Biblioteca de gráficos React com boa performance

### Utilitários de Desenvolvimento
- **class-variance-authority** - Variantes de classes CSS tipadas
- **clsx** - Utilitário para construção de classNames condicionais
- **tailwind-merge** - Merge inteligente de classes Tailwind

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── ui/                 # Componentes shadcn/ui (complexos)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── calendar.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── popover.tsx
│   │   └── select.tsx
│   ├── layout/             # Layout base (manual com Tailwind)
│   ├── dashboard/          # Componentes específicos do dashboard
│   └── common/             # Componentes reutilizáveis customizados
├── services/              # Serviços de API e integração externa
├── hooks/                 # Custom hooks React
├── types/                 # Definições de tipos TypeScript
│   ├── api.ts             # Tipos da API CoinGecko
│   ├── dashboard.ts       # Tipos dos componentes do dashboard
│   └── index.ts           # Exportações centralizadas
├── utils/                 # Funções utilitárias
├── constants/             # 📌 Constantes e configurações da aplicação
│   ├── api.ts             # URLs, rate limits, moedas suportadas
│   ├── dashboard.ts       # Layout, cores, períodos, localStorage
│   └── index.ts           # Exportações centralizadas
├── lib/                   # Configurações de bibliotecas
└── assets/                # Recursos estáticos
```

## 🏗️ Decisões Arquiteturais

### Onde usar shadcn/ui (Componentes complexos)
- **Date Picker** - Componente robusto com calendário navegável
- **Modal/Dialog** - Para visualização detalhada de métricas com gráficos
- **Dropdown/Select** - Para filtros de seleção de métricas
- **Skeleton/Loading** - Estados de carregamento elegantes

### Onde desenvolver manualmente (Demonstrar expertise)
- **Layout responsivo** - Navbar + Grid usando Tailwind puro
- **MetricCard** - Componente customizado e reutilizável
- **Error/Empty states** - Mensagens UX personalizadas
- **Styling de gráficos** - Configuração manual do Recharts

### Tratamento de API
- **React Query** para cache e sincronização de dados
- **Tratamento robusto de erros** (timeouts, códigos HTTP)
- **Loading states** elegantes durante requisições
- **Retry logic** para falhas temporárias

## 📌 Organização de Constantes

### Filosofia
A pasta `constants/` centraliza todos os **valores fixos e configurações** da aplicação, evitando "números mágicos" e strings espalhadas pelo código. Isso facilita manutenção, previne erros e melhora a legibilidade.

### `constants/api.ts` - Configurações da API
```typescript
// URLs e Endpoints
COINGECKO_BASE_URL          # URL base da API CoinGecko
API_ENDPOINTS               # Mapeamento de todos os endpoints
DEFAULT_CURRENCY            # Moeda padrão (USD)

// Rate Limits e Retry
API_RATE_LIMITS = {
  PUBLIC_API_CALLS_PER_MINUTE: 30,    # Limite da API gratuita
  RETRY_ATTEMPTS: 3,                  # Tentativas de retry
  RETRY_DELAY: 1000                   # Delay entre tentativas (ms)
}

// Moedas Suportadas
SUPPORTED_COINS             # Lista pré-selecionada de criptomoedas principais
```

**Benefícios:**
- ✅ Mudança de API centralizada em um local
- ✅ Respeita limites de rate da API pública
- ✅ Lista curada de moedas melhora UX

### `constants/dashboard.ts` - Configurações da Interface
```typescript
// Tipos de Métricas
METRIC_TYPES = {
  PRICE: 'price',           # Preço atual
  VOLUME: 'volume',         # Volume de negociação
  MARKET_CAP: 'market_cap', # Capitalização de mercado
  CHANGE_24H: 'change_24h'  # Variação 24h
}

// Períodos Pré-definidos
DATE_RANGES = {
  LAST_7_DAYS: 7,           # Última semana
  LAST_30_DAYS: 30,         # Último mês
  LAST_90_DAYS: 90,         # Últimos 3 meses
  LAST_365_DAYS: 365        # Último ano
}

// Design System - Cores
CHART_COLORS = {
  PRIMARY: '#3B82F6',       # Azul (blue-500)
  SUCCESS: '#10B981',       # Verde (emerald-500) - alta
  DANGER: '#EF4444',        # Vermelho (red-500) - baixa
  WARNING: '#F59E0B',       # Amarelo (amber-500) - neutro
  PURPLE: '#8B5CF6',        # Roxo (violet-500) - destaque
  GRADIENT: ['#3B82F6', '#8B5CF6']  # Gradiente para gráficos
}

// Layout Responsivo
DASHBOARD_CONFIG = {
  GRID_COLS: {
    MOBILE: 1,              # 1 card por linha no mobile
    TABLET: 2,              # 2 cards por linha no tablet
    DESKTOP: 3,             # 3 cards por linha no desktop
    LARGE: 4                # 4 cards em telas grandes
  },
  ANIMATION_DURATION: 200,        # Duração padrão das animações
  AUTO_REFRESH_INTERVAL: 60000,   # Auto-refresh a cada 1min
  LOADING_DEBOUNCE: 300           # Debounce para evitar spam
}

// LocalStorage Keys
STORAGE_KEYS = {
  USER_PREFERENCES: 'metrics_dashboard_preferences',
  SELECTED_METRICS: 'selected_metrics',
  DEFAULT_DATE_RANGE: 'default_date_range',
  FAVORITE_COINS: 'favorite_coins'
}
```

**Benefícios:**
- ✅ Cores semânticas consistentes (verde = positivo, vermelho = negativo)
- ✅ Layout responsivo configurado declarativamente
- ✅ Chaves do localStorage organizadas e sem conflitos
- ✅ Períodos de análise financeira padronizados

### Exemplo de Uso
```typescript
// ❌ Antes (valores mágicos espalhados)
const color = '#3B82F6'
setTimeout(retry, 1000)
localStorage.setItem('prefs', data)

// ✅ Depois (constantes organizadas)
import { CHART_COLORS, API_RATE_LIMITS, STORAGE_KEYS } from '@/constants'

const color = CHART_COLORS.PRIMARY
setTimeout(retry, API_RATE_LIMITS.RETRY_DELAY)
localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, data)
```

## 🔧 Configuração de Desenvolvimento

### Pré-requisitos
- Node.js 18+ 
- npm ou pnpm

### Instalação
```bash
npm install
```

### Executar localmente
```bash
npm run dev
```

### Build para produção
```bash
npm run build
```

### Verificar tipos TypeScript
```bash
npm run type-check
```

## 🎯 Funcionalidades Planejadas

### Obrigatórias
- [ ] Filtro de intervalo de datas funcional
- [ ] Consumo robusto da API CoinGecko
- [ ] Cálculo e exibição de métricas totais do período
- [ ] Dashboard com cards/widgets de métricas
- [ ] Visualização detalhada com gráficos
- [ ] Layout responsivo e intuitivo

### Extras (Bônus)
- [ ] Seleção de métricas personalizáveis
- [ ] Preferências salvas no localStorage
- [ ] States de loading elegantes
- [ ] Containerização com Docker
- [ ] Testes unitários
- [ ] Paginação/virtualização para grandes datasets

## 🌐 API CoinGecko

### Endpoints Utilizados
- `/coins/{id}/market_chart/range` - Dados históricos por intervalo
- `/coins/markets` - Lista de criptomoedas disponíveis

### Rate Limits
- API pública: 10-50 chamadas/minuto
- Implementação de throttling e retry

## 🧪 Testes

### Estratégia de Testes
- **Testes unitários** para funções utilitárias
- **Testes de componente** para componentes chave
- **Testes de integração** para fluxos da API

### Executar testes
```bash
npm run test
```

## 📈 Performance

### Otimizações Implementadas
- **Lazy loading** de componentes
- **Memoização** de cálculos pesados
- **Virtualização** para grandes listas
- **Debounce** em filtros de busca

## 🐳 Docker (Opcional)

```dockerfile
# Dockerfile e docker-compose.yml serão adicionados
```

## 🤝 Contribuição

### Padrões de Código
- **ESLint** + **Prettier** para formatação
- **Conventional Commits** para mensagens
- **TypeScript strict mode** habilitado

---

> 🚧 **Status**: Em desenvolvimento ativo
> 
> 📅 **Última atualização**: Agosto 2025
