# System Architecture & Architectural Patterns Guide

This document details the software architecture, design patterns, bounded context package boundaries, and directory layout of **`clean-architecture-monorepo`**.

---

## 🔗 Documentation Links

- 🏠 **[Project Readme](../README.md)** — Quickstart guide, test commands, and overview.
- 🛠️ **[Technology Stack Reference](tech-stack.md)** — Specifications for TypeScript, React, Next.js, Expo, NestJS, Vite, Nx, and Vitest.

---

## 🌟 Why Combined Hexagonal & DDD Architecture is the Enterprise Standard

Combining **Presentation Layer Patterns**, **Hexagonal Architecture (Ports & Adapters)**, and **Domain-Driven Design (DDD)** represents the industry gold standard for modern multi-platform software development.

### 🔑 Key Industry Advantages:

1. 📱 **Multi-Platform Delivery (Vite, Next.js & React Native Share 100% Business Logic):**
   Core business entities (`budget-cart.ts`) and use cases (`add-item-use-case.ts`) live in pure hardware-free packages (`@clean/cart`) with **zero dependencies on React, Redux, Web DOM (`window`), or React Native**.
   - `apps/web` (Vite SPA) consumes `@clean/cart` domain via `@clean/cart-store`.
   - `apps/web-next` (Next.js 15 App Router) consumes `@clean/cart` domain via `@clean/cart-store`.
   - `apps/mobile` (Expo React Native) consumes `@clean/cart` domain via `@clean/cart-store`.
   - All three platforms consume **100% identical domain logic, use cases, and Redux store state**.

2. 🛡️ **Total Decoupling from Framework Volatility:**
   Hexagonal Architecture places frameworks on the _outside_ as interchangeable **Infrastructure Adapters and Presentation Store Packages**. Replacing RTK with Zustand, or replacing React with Vue, requires **zero changes** to your core domain business rules.

3. 📦 **Shared Presentation Store Package (`@clean/cart-store`):**
   Shared Redux Toolkit thunks (`fetchCartThunk`, `addItemThunk`, `updateLimitThunk`) and slice reducers (`cartSlice`) live in a dedicated workspace package (`packages/cart-store`), providing 100% state synchronization across Vite, Next.js, and React Native apps.

4. 🎨 **Shared Web Design System (`@clean/web-ui-components`):**
   Reusable, styled React web UI components (`SharedButton`, `SharedCard`, `SharedBadge`) live in `packages/web-ui-components` and are imported by both `apps/web` (Vite) and `apps/web-next` (Next.js).

5. 🧱 **Micro-Frontend (MFE) Readiness:**
   Vertical package slicing by DDD Bounded Contexts (`@clean/cart`, `@clean/auth`) establishes strict encapsulation boundaries, making it effortless to extract packages into independent micro-frontends or microservices.

6. 🔒 **Type-Safe Operational Resilience (Result Pattern):**
   Domain operations return explicit `Result<T, E>` discriminated unions (`ok()` and `fail()`) instead of throwing uncaught exceptions.

---

## ⚡ The Dual Role of Redux Toolkit in Hexagonal Architecture

In this codebase, **Redux Toolkit (RTK)** is deliberately split across two distinct outer layers. RTK is restricted from containing business logic, acting strictly as an **Infrastructure HTTP Cache** and a **Presentation View Store**.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ PRESENTATION LAYER (Global UI Memory & View Controller)                     │
│                                                                             │
│  packages/cart-store                                                        │
│    ├── cart-thunks.ts   ← RTK createAsyncThunk (executes Use Cases)         │
│    ├── cart-slice.ts    ← RTK createSlice extraReducers (stores Entities)   │
│    └── store.ts         ← RTK configureStore + typed hooks                  │
│                                                                             │
│  Role: Acts as the reactive View Store for React components (useSelector). │
│        Zero business logic in reducers; only stores Use Case output.       │
├─────────────────────────────────────────────────────────────────────────────┤
│ DOMAIN LAYER (Pure Business Logic · ZERO Redux)                             │
│                                                                             │
│  packages/cart                                                              │
│    ├── BudgetCart entity (validates budget limits, calculates totals)       │
│    ├── AddItemUseCase (orchestrates domain workflows)                       │
│    └── CartRepositoryPort (outbound port interface)                         │
│                                                                             │
│  Role: 100% Pure TypeScript. Owns all business rules and state machines.    │
├─────────────────────────────────────────────────────────────────────────────┤
│ INFRASTRUCTURE LAYER (HTTP Transport & Response Caching)                    │
│                                                                             │
│  apps/web/src/adapters/                                                     │
│    ├── cart-api.ts             ← RTK Query createApi (endpoint & cache)   │
│    └── http-cart-repository.ts ← Implements CartRepositoryPort via cartApi  │
│                                                                             │
│  Role: Handles network I/O, DTO mapping, and response caching.              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 🎯 Layer Responsibilities Breakdown:

1. **Infrastructure Layer (`cartApi` via `createApi`):**
   - Uses RTK Query's `createApi` and `fetchBaseQuery` to define HTTP endpoints (`getCartById`, `updateCart`) and manage response tag invalidation.
   - `HttpCartRepository` wraps `cartApi.endpoints` to fulfill the domain's `CartRepositoryPort`.

2. **Domain Layer (`@clean/cart`):**
   - Contains **zero Redux dependencies**.
   - Owns all state machine invariants, budget limits, item validations, and domain calculations.

3. **Presentation Layer (`@clean/cart-store`):**
   - **`createAsyncThunk`:** Takes UI requests and delegates them to Domain Use Cases (`addItemUseCase.execute()`).
   - **`createSlice`:** Does NOT contain business rules in `reducers`. Its `extraReducers` simply listen for thunk resolution and save the returned `BudgetCart` entity into Redux memory for React components (`useSelector`) to render reactively.

---

## 🏛️ Monorepo Architectural Layer Map

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. DOMAIN & APPLICATION LAYER (Inside the Hexagon · Shared Packages)        │
│    • Domain Entities: BudgetCart (packages/cart/src/domain/entities)        │
│    • Use Cases (Inbound Ports): AddItemUseCase, UpdateLimitUseCase          │
│    • Port Interfaces (Outbound Ports): CartRepositoryPort, NotificationPort │
├─────────────────────────────────────────────────────────────────────────────┤
│ 2. INFRASTRUCTURE LAYER (Outside the Hexagon · Platform Adapters)           │
│    • Web Storage: LocalStorageCartRepository (apps/web & apps/web-next)     │
│    • RTK Query HTTP API: cartApi via createApi (apps/web/src/adapters)      │
│    • HTTP Repository Adapter: HttpCartRepository (apps/web/src/adapters)    │
│    • Mobile Storage: AsyncStorageCartRepository (apps/mobile/src/adapters)  │
│    • Composition Root / DI: di-container.ts in each app                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ 3. PRESENTATION LAYER (Outside the Hexagon · UI & State Packages)           │
│    • Shared Presentation Store: @clean/cart-store (RTK Thunks & Slices)     │
│    • Shared Web UI Components: SharedButton, SharedCard (@clean/web-ui-comp)│
│    • Headless UI Hooks: useHeadlessSelect (@clean/ui-logic)                 │
│    • Vite SPA App: apps/web (React 18 + Redux Toolkit + Web Component)     │
│    • Next.js App: apps/web-next (Next.js 15 App Router + Redux Toolkit)     │
│    • Mobile App: apps/mobile (Expo React Native + Redux Toolkit)            │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📂 Repository Directory Layout (Strict Kebab-Case)

```
clean-architecture-monorepo/
├── pnpm-workspace.yaml                     <-- Monorepo workspace configuration
├── package.json                            <-- Root scripts (pnpm start, pnpm dev:next, etc.)
├── nx.json                                 <-- Nx build & test pipeline engine
├── tsconfig.json                           <-- Workspace TypeScript configuration
│
├── docs/                                   <-- Architecture & Tech Stack documentation
│   ├── architecture.md
│   └── tech-stack.md
│
├── packages/                               <-- SHARED DOMAIN & UI PACKAGES
│   ├── cart/                               <-- @clean/cart (Cart Bounded Context Package)
│   ├── cart-store/                         <-- @clean/cart-store (Shared Redux Store & Thunks)
│   ├── auth/                               <-- @clean/auth (Auth Bounded Context Package)
│   ├── logger/                             <-- @clean/logger (logger-port.ts, console-logger-adapter.ts)
│   ├── telemetry/                          <-- @clean/telemetry (telemetry-port.ts, console-telemetry-adapter.ts)
│   ├── ui-logic/                           <-- @clean/ui-logic (use-headless-select.ts)
│   └── web-ui-components/                  <-- @clean/web-ui-components (Shared Web Design System)
│
└── apps/                                   <-- PLATFORM CONSUMPTION APPS
    ├── web/                                <-- REACT VITE SPA (Port 5173 + Redux Toolkit + RTK Query)
    ├── web-next/                           <-- NEXT.JS 15 APP ROUTER APP (Port 3000 + Redux Toolkit)
    ├── mobile/                             <-- REACT NATIVE MOBILE APP (Expo + Redux Toolkit)
    └── mock-api/                           <-- NESTJS STANDALONE MOCK REST SERVER (Port 4000)
```
