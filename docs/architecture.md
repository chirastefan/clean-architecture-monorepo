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
   Core business entities (`budget-cart.ts`) and use cases (`add-item-use-case.ts`) live in pure hardware-free packages (`@clean/cart`) with **zero dependencies on React, Web DOM (`window`), or React Native**.
   - `apps/web` (Vite SPA) consumes `@clean/cart` domain + `@clean/web-ui-components`.
   - `apps/web-next` (Next.js 15 App Router) consumes `@clean/cart` domain + `@clean/web-ui-components`.
   - `apps/mobile` (Expo React Native) consumes `@clean/cart` domain + native adapters.
   - All three platforms consume **100% identical domain logic and use cases**.

2. 🛡️ **Total Decoupling from Framework Volatility:**
   Hexagonal Architecture places frameworks on the _outside_ as interchangeable **Infrastructure Adapters**. Replacing React with Vue, or LocalStorage with a NestJS backend, requires **zero changes** to your core domain business rules.

3. 🎨 **Shared Web Design System (`@clean/web-ui-components`):**
   Reusable, styled React web UI components (`SharedButton`, `SharedCard`, `SharedBadge`) live in `packages/web-ui-components` and are imported by both `apps/web` (Vite) and `apps/web-next` (Next.js).

4. 🧱 **Micro-Frontend (MFE) Readiness:**
   Vertical package slicing by DDD Bounded Contexts (`@clean/cart`, `@clean/auth`) establishes strict encapsulation boundaries, making it effortless to extract packages into independent micro-frontends or microservices.

5. 🔒 **Type-Safe Operational Resilience (Result Pattern):**
   Domain operations return explicit `Result<T, E>` discriminated unions (`ok()` and `fail()`) instead of throwing uncaught exceptions.

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
│    • Mobile Storage: AsyncStorageCartRepository (apps/mobile/src/adapters)  │
│    • HTTP Client: CachedHttpCartRepository                                  │
│    • Composition Root / DI: di-container.ts in each app                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ 3. PRESENTATION LAYER (Outside the Hexagon · UI Patterns)                   │
│    • Shared Web UI Components: SharedButton, SharedCard (@clean/web-ui-comp)│
│    • Headless UI Hooks: useHeadlessSelect (@clean/ui-logic)                 │
│    • Vite SPA App: apps/web (React 18 + Web Component export)               │
│    • Next.js App: apps/web-next (Next.js 15 App Router)                      │
│    • Mobile App: apps/mobile (Expo React Native)                            │
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
│   ├── auth/                               <-- @clean/auth (Auth Bounded Context Package)
│   ├── logger/                             <-- @clean/logger (logger-port.ts, console-logger-adapter.ts)
│   ├── telemetry/                          <-- @clean/telemetry (telemetry-port.ts, console-telemetry-adapter.ts)
│   ├── ui-logic/                           <-- @clean/ui-logic (use-headless-select.ts)
│   └── web-ui-components/                  <-- [RENAMED] @clean/web-ui-components (Shared Web Design System)
│
└── apps/                                   <-- PLATFORM CONSUMPTION APPS
    ├── web/                                <-- REACT VITE SPA (Port 5173)
    ├── web-next/                           <-- NEXT.JS 15 APP ROUTER APP (Port 3000)
    ├── mobile/                             <-- REACT NATIVE MOBILE APP (Expo)
    └── mock-api/                           <-- NESTJS STANDALONE MOCK REST SERVER (Port 4000)
```
