# 🚌 Rodoviária FIDS

Sistema de Gestão Operacional e Painel Público para Rodoviária, inspirado no estilo FIDS (Flight Information Display System) de aeroportos.

## ✨ Funcionalidades

- **Painel Público** (`/painel`) — Tabela de partidas e chegadas em tempo real, estilo aeroporto
- **Login Administrativo** (`/login`) — Autenticação com controle de sessão
- **Dashboard Admin** (`/admin`) — Métricas rápidas e acesso a todas as áreas
- **Gestão de Usuários** (`/admin/usuarios`) — CRUD completo com controle de perfis
- **Gestão de Linhas** (`/admin/linhas`) — CRUD com regras de calendário (dia útil, domingo, feriado)

## 🛠️ Stack

- **React 18** + **TypeScript**
- **Tailwind CSS** + **Shadcn/UI** (componentes)
- **React Router v6** (roteamento)
- **TanStack Query** (preparado para integração com API REST)
- **localStorage** como persistência inicial

## 🚀 Como Rodar

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`

**Credenciais de demo:**
- E-mail: `admin@rodoviaria.com`
- Senha: `admin123`

## 🌤️ Integração de Clima (opcional)

1. Crie uma conta gratuita em [openweathermap.org](https://openweathermap.org)
2. Copie `.env.example` para `.env`
3. Preencha `VITE_WEATHER_API_KEY` com sua chave
4. (Sem chave, exibe dados mockados: 28°C, Vila Velha)

## 📁 Estrutura

```
src/
├── components/     # Componentes reutilizáveis (FIDSTable, StatusBadge, UI)
├── context/        # AuthContext, DataContext
├── hooks/          # useClock, useWeather, useFilteredTrips
├── pages/          # LoginPage, PublicPanel, admin/
├── services/       # localStorage, weather API
└── types/          # Tipos TypeScript globais
```

## 🔌 Preparação para API REST

Substitua as funções em `src/services/localStorage.ts` por chamadas `fetch` para:
- `GET/POST/PUT/DELETE /api/trips`
- `GET/POST/PUT/DELETE /api/users`
- `GET/POST/PUT/DELETE /api/companies`

## 🗓️ Lógica de Calendário

O `useFilteredTrips` detecta automaticamente o tipo de dia (dia útil, sábado, domingo, feriado nacional) e filtra os horários cadastrados com a regra correspondente.
