
# 📊 Dashboard de Métricas - CoinGecko

Dashboard web para visualização e análise de métricas financeiras de criptomoedas usando a API pública do CoinGecko.

## 🚀 Tecnologias
- React 19 + TypeScript 5.8
- Vite 7.1
- Tailwind CSS 3.4
- shadcn/ui + Lucide React
- @tanstack/react-query
- Recharts
- date-fns

## 📁 Estrutura do Projeto
```
src/
├── assets/ # Recursos estáticos (imagens, ícones, fontes)
├── components/ # Componentes React reutilizáveis (UI, cards, gráficos, layout)
├── constants/ # Valores e configurações fixas
├── hooks/ # Custom hooks
├── lib/ # Configurações de bibliotecas e providers
├── services/ # Integração com APIs (CoinGecko)
├── types/ # Tipos TypeScript
└── utils/ # Funções utilitárias
```
## 🔧 Como Rodar
### Pré-requisitos
- Node.js 18+
- npm ou pnpm

### Instalação
```
npm install

### Executar localmente
npm run dev

### Build produção
npm run build
```
### Testes
```
npm run test
```
### Verificar tipos
```
npm run type-check
```
## 🎯 Funcionalidades
- Cards de métricas financeiras (preço, volume, market cap, variação 24h)
- Modal com gráficos históricos por moeda
- Filtro por período (7d, 30d, 90d, 1y)
- Layout responsivo mobile/tablet/desktop
- Loading states com skeleton components
- Dual view modes: Grid detalhado + List compacto
- Paginação de moedas (8 por página)
- Virtualização inteligente de gráficos (>30 registros)
- Lista curada de 10 criptomoedas principais
- LocalStorage para preferências de usuário
- Feedback visual com toasts e warnings contextuais
- Dark theme padrão

## 🌐 API CoinGecko
- Endpoints: /coins/{id}/market_chart/range, /coins/markets
- Rate limits respeitados com retry automático e cache

## 🏗️ Decisões Técnicas
- Lista fixa de moedas: performance e previsibilidade
- Virtualização adaptativa: garante performance para qualquer volume de dados
- shadcn/ui para componentes complexos; Tailwind puro para layout e cards customizados
- React Query: cache, retry e sincronização de dados
- React + Vite em vez de Next.js: projeto é um dashboard client-side, sem necessidade de SSR/SSG, mantendo o projeto leve e rápido de rodar
- TailwindCSS + shadcn/ui: acelera a prototipação de componentes com acessibilidade e consistência visual, mantendo flexibilidade de customização e foco na lógica de dados e UX

## 📊 Performance e Escalabilidade
- Lazy loading de componentes
- Memoização de cálculos
- Virtualização e paginamento para listas e gráficos grandes
- Threshold automático: gráficos >30 registros ativam virtualização

## 🐳 Docker (Opcional)
 Desenvolvimento
```
docker-compose -f docker-compose.dev.yml up
```
 Produção
```
docker-compose up -d
```

## ✅ Status do Projeto
- Dashboard funcional com integração à API CoinGecko
- UX responsiva, dark theme, loading e error states
- Performance otimizada com cache, virtualização e paginamento
- Código limpo e manutenível, pronto para extensão futura
