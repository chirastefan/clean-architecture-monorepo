# System Architecture & Architectural Patterns Guide

This document details the software architecture, design patterns, bounded context package boundaries, and directory layout of **`clean-architecture-monorepo`**.

---

## 🔗 Documentation Links

- 🏠 **[Project Readme](../README.md)** — Quickstart guide, test commands, and overview.
- 🛠️ **[Technology Stack Reference](tech-stack.md)** — Specifications for TypeScript, React, Expo, NestJS, Vite, Nx, and Vitest.

---

## 🏛️ Hexagonal Architecture Diagrams

### 1. The Hexagon (Inbound vs Outbound Ports)

In Hexagonal Architecture, the **Dependency Inversion Principle (DIP)** guarantees that all dependencies point **inward toward the Domain Core**:

```
                     HEXAGONAL ARCHITECTURE (PORTS & ADAPTERS)

      OUTSIDE THE HEXAGON                  INSIDE THE HEXAGON
 ┌──────────────────────────┐        ┌────────────────────────────┐
 │  3. PRESENTATION LAYER   │        │                            │
 │     (UI, React, Native)  │──────┐ │  2. APPLICATION LAYER      │
 └──────────────────────────┘      │ │     (Use Cases & Ports)    │
                                   ├──►                           │
 ┌──────────────────────────┐      │ │  1. DOMAIN LAYER           │
 │  3. INFRASTRUCTURE LAYER │──────┘ │     (Entities & Rules)     │
 │     (Adapters, DB, HTTP) │        │                            │
 └──────────────────────────┘        └────────────────────────────┘
```

- **Inbound Ports (Primary):** Use Case interfaces (`AddItemUseCase`, `CartUseCase`) called by UI Presentation Containers or Zustand Stores to trigger business actions.
- **Outbound Ports (Secondary):** Infrastructure contracts (`CartRepositoryPort`, `NotificationPort`) defined _inside_ the Core and implemented _outside_ by concrete adapters (`LocalStorageCartRepository`, `AsyncStorageCartRepository`).

---

### 2. Monorepo Architectural Layer Map

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. DOMAIN & APPLICATION LAYER (Inside the Hexagon · Shared Packages)        │
│    • Domain Entities: BudgetCart (packages/cart/src/domain/entities)        │
│    • Use Cases (Inbound Ports): AddItemUseCase, UpdateLimitUseCase          │
│    • Port Interfaces (Outbound Ports): CartRepositoryPort, NotificationPort │
├─────────────────────────────────────────────────────────────────────────────┤
│ 2. INFRASTRUCTURE LAYER (Outside the Hexagon · Platform Adapters)           │
│    • Web Storage: LocalStorageCartRepository (apps/web/src/adapters)        │
│    • Mobile Storage: AsyncStorageCartRepository (apps/mobile/src/adapters)  │
│    • HTTP Client: CachedHttpCartRepository                                  │
│    • Composition Root / DI: di-container.ts                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│ 3. PRESENTATION LAYER (Outside the Hexagon · UI Patterns)                   │
│    • UI State Store: useCartStore (Zustand with useShallow)                 │
│    • Container / Presenter: BudgetTrackerContainer (State & logic)          │
│    • Presentational View: BudgetTrackerView (Pure rendering layout)         │
│    • Headless UI Hooks: useHeadlessSelect (packages/ui-logic)               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🏛️ Architectural Patterns & Design Principles

### 1. Presentation Layer Pattern (Container / Presenter, Headless UI, & Stores)

- **Smart Container (`BudgetTrackerContainer`):** Handles presentation side-effects, subscribes to notification adapters, and orchestrates UI state via `useCartStore` with `useShallow` destructuring.
- **Dumb Presentational View (`BudgetTrackerView`):** Purely decorative component receiving props (`cart`, `loading`, `errorMessage`, event handlers) with zero business logic.
- **Headless UI State Hooks (`useHeadlessSelect` in `@clean/ui-logic`):** Manages keyboard navigation (`ArrowUp`/`ArrowDown`/`Escape`), ARIA attributes, and state machine transitions with **zero DOM rendering logic**.
- **Presentation State Store (`useCartStore`):** Lightweight Zustand store in `apps/web/src/ui/store/` and `apps/mobile/src/ui/store/`. Delegates all business operations to `@clean/cart` Use Cases.

### 2. Domain-Driven Design (DDD Bounded Contexts)

- **Strategic Package Slicing:** Code is partitioned vertically into independent Bounded Context feature packages (`@clean/cart`, `@clean/auth`).
- **Ubiquitous Language:** Domain entity names and use case operations (`BudgetCart.addItem()`, `AddItemUseCase`) match real-world business domain concepts directly.
- **Typed Domain Errors:** Custom error classes (`BudgetExceededError`, `InvalidBudgetLimitError`) encapsulate domain validation failure rules cleanly.

### 3. Result / Either Functional Pattern

- Replaces unhandled try/catch exception throwing with a type-safe `Result<T, E>` discriminated union (`ok()` and `fail()`).
- Forces callers (UI containers and Zustand stores) to explicitly handle success and failure paths at compile time.

### 4. Dependency Injection Container (`di-container.ts`)

- `di-container.ts` in each application acts as the central Dependency Injection (DI) Container.
- Instantiates concrete platform adapters privately and exports _only_ Use Cases to the UI context provider (`dependency-context.tsx`) or Zustand store (`use-cart-store.ts`), preserving strict architectural boundaries.

---

## 📂 Repository Directory Layout (Strict Kebab-Case)

```
clean-architecture-monorepo/
├── package.json                            <-- Root workspace configuration
├── nx.json                                 <-- Nx build pipeline & computation cache engine
├── tsconfig.json                           <-- Workspace TypeScript configuration
│
├── docs/                                   <-- Architecture & Tech Stack documentation
│   ├── architecture.md
│   └── tech-stack.md
│
├── packages/                               <-- SHARED DOMAIN & UTILITY PACKAGES
│   ├── cart/                               <-- @clean/cart (Cart Bounded Context Package)
│   │   ├── package.json
│   │   └── src/
│   │       ├── domain/
│   │       │   ├── entities/ (budget-cart.ts)
│   │       │   ├── errors/ (budget-exceeded-error.ts, domain-error.ts)
│   │       │   ├── result/ (result.ts)
│   │       │   └── use-cases/ (add-item-use-case.ts, cart-use-case.ts, etc.)
│   │       └── ports/ (cart-repository-port.ts, notification-port.ts, etc.)
│   │
│   ├── auth/                               <-- @clean/auth (Auth Bounded Context Package)
│   │   └── src/ (user-entity.ts, login-use-case.ts, auth-repository-port.ts)
│   ├── logger/                             <-- @clean/logger (logger-port.ts, console-logger-adapter.ts)
│   ├── telemetry/                          <-- @clean/telemetry (telemetry-port.ts, console-telemetry-adapter.ts)
│   └── ui-logic/                           <-- @clean/ui-logic (use-headless-select.ts)
│
└── apps/                                   <-- PLATFORM CONSUMPTION APPS
    ├── web/                                <-- REACT WEB APPLICATION (Port 5173)
    │   └── src/
    │       ├── adapters/ (local-storage-cart-repository.ts, cached-http-cart-repository.ts)
    │       └── ui/
    │           ├── store/ (use-cart-store.ts - Zustand Store with useShallow)
    │           ├── di-container.ts (Dependency Injection Container)
    │           ├── budget-tracker-container.tsx (Smart Container Component)
    │           └── budget-tracker-view.tsx (Dumb Presentational View Component)
    │
    ├── mobile/                             <-- REACT NATIVE MOBILE APPLICATION (Expo)
    │   └── src/
    │       ├── adapters/ (async-storage-cart-repository.ts, native-alert-notification-adapter.ts)
    │       └── ui/
    │           ├── store/ (use-cart-store.ts - Mobile Zustand Store)
    │           ├── di-container.ts (Mobile DI Container)
    │           ├── budget-tracker-container.tsx (Smart Container Component)
    │           └── budget-tracker-view.tsx (Native Presentational View Component)
    │
    └── mock-api/                           <-- NESTJS STANDALONE MOCK REST SERVER (Port 4000)
        └── src/ (app.module.ts, main.ts, cart/cart.controller.ts, cart/cart.service.ts)
```
