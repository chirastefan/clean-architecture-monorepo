# System Architecture & Architectural Patterns Guide

This document details the software architecture, design patterns, bounded context package boundaries, and directory layout of **`clean-architecture-monorepo`**.

---

## 🏛️ Architectural Patterns & Design Principles

This repository combines enterprise-grade architectural patterns to achieve 100% platform independence, testability, and micro-frontend readiness:

---

### 1. Presentation Layer Pattern (Container / Presenter, Headless UI, & Presentation Stores)

- **Smart Container Component (`BudgetTrackerContainer.tsx`):** Handles presentation side-effects, subscribes to notification adapters, and orchestrates UI state via Zustand (`useCartStore.ts`) or React hooks.
- **Dumb Presentational View (`BudgetTrackerView.tsx`):** Purely decorative React component receiving props (`cart`, `loading`, `toasts`, event handlers). Contains zero business logic, enabling instant snapshot testing and design iteration.
- **Headless UI State Hooks (`useHeadlessSelect.ts` in `@clean/ui-logic`):** Manages keyboard navigation (`ArrowUp`/`ArrowDown`/`Escape`), ARIA attributes, and state machine transitions with **zero DOM rendering logic**.
- **Presentation State Store (`useCartStore.ts`):** Lightweight Zustand store living inside `apps/web/src/ui/store/`. Delegates all business operations to `@clean/cart` Use Cases and updates UI state with returned `BudgetCart` domain entities.

#### ✅ Pros & Architectural Advantages:

- **Separation of Concerns:** View components remain 100% decorative and reusable without embedded side-effects.
- **Instant UI Testing:** Dumb presentational views can be unit-tested or iterated on in Storybook with plain props without mocking complex backend APIs.
- **Platform-Agnostic Headless Logic:** Headless state hooks can be shared directly across React Web and React Native.

---

### 2. Hexagonal Architecture (Ports & Adapters)

- **Domain Center:** Pure business entities (`BudgetCart`) and Use Cases (`AddItemUseCase`) have **zero dependencies** on React, DOM APIs (`window`, `localStorage`), or backend databases.
- **Inbound Ports (Primary):** Use Case interfaces (`CartUseCase`, `AddItemUseCase`, `RemoveItemUseCase`) invoked by Presentation Container components and Zustand stores.
- **Outbound Ports (Secondary):** Infrastructure interfaces (`CartRepositoryPort`, `NotificationPort`, `LoggerPort`) implemented by concrete platform infrastructure adapters (`LocalStorageCartRepository`, `ToastNotificationAdapter`, `ConsoleLoggerAdapter`).

#### ✅ Pros & Architectural Advantages:

- **100% Framework Independence:** Core business rules are insulated from UI or database framework replacements.
- **Pluggable Infrastructure:** Easily swap LocalStorage for HTTP REST APIs, or swap Web Toast notifications for Native Alerts without changing business code.
- **Fast In-Memory Unit Testing:** Business logic tests execute in pure Node.js in milliseconds without needing a browser or database.

---

### 3. Domain-Driven Design (DDD Bounded Contexts)

- **Strategic Slicing:** Code is partitioned vertically into independent Bounded Context feature packages (`@clean/cart`, `@clean/auth`).
- **Ubiquitous Language:** Domain entity names and use case operations (`BudgetCart.addItem()`, `AddItemUseCase`) match real-world business domain concepts directly.
- **Typed Domain Errors:** Custom error classes (`BudgetExceededError`, `InvalidBudgetLimitError`) encapsulate domain validation failure rules cleanly.

#### ✅ Pros & Architectural Advantages:

- **Micro-Frontend & Microservice Ready:** Independent package boundaries simplify splitting monorepos into separate micro-frontends or microservices later.
- **Clear Team Ownership:** Autonomous teams can work on different bounded context packages (`packages/cart`, `packages/auth`) with zero code collision.
- **Explicit Error Boundaries:** Domain rules fail with explicit, typed error objects rather than cryptic generic strings.

---

### 4. Result / Either Functional Pattern

- Replaces unhandled try/catch exception throwing with a type-safe `Result<T, E>` discriminated union (`ok()` and `fail()`).
- Forces use case callers (UI containers and Zustand stores) to explicitly handle success and failure paths at compile time.

#### ✅ Pros & Architectural Advantages:

- **Zero Uncaught Exceptions:** Eliminates unexpected runtime crashes caused by unhandled thrown errors.
- **Compile-Time Safety:** TypeScript forces callers to check `if (result.ok)` before accessing return values.
- **Predictable Error Propagation:** Errors flow predictably through the pipeline without polluting global error boundaries.

---

### 5. DTO & Mapper Translation Layer

- **Data Transfer Objects (`CartDTO`):** Define JSON network/storage payload structures.
- **Mappers (`CartMapper`):** Translate raw DTOs to rich `BudgetCart` domain entities at the infrastructure adapter boundary.

#### ✅ Pros & Architectural Advantages:

- **API Schema Insulation:** Backend database or REST API schema changes only affect Mappers, protecting Domain Entities.
- **Rich Domain Behavior:** Domain entities retain rich methods (`cart.getTotalSpent()`, `cart.getRemainingBudget()`) instead of remaining plain JSON data buckets.

---

### 6. Composition Root Dependency Injection Container

- `CompositionRoot.ts` in each application acts as the central Dependency Injection Container.
- Instantiates concrete platform adapters privately and exports _only_ Use Cases to the UI context provider (`DependencyContext.tsx`) or Zustand store, preserving strict architectural boundaries.

#### ✅ Pros & Architectural Advantages:

- **Zero Component Coupling:** Components and stores never import concrete adapters directly.
- **Single Configuration Point:** Changing an infrastructure implementation (e.g. enabling a Mock API) happens in one central file.

---

## 📐 System Layer Diagram

```
                     ┌──────────────────────────────────────────┐
                     │    PRESENTATION LAYER (UI Delivery)      │
                     │   - Container / Presenter Components     │
                     │   - Headless UI Hooks (@clean/ui-logic)  │
                     │   - Zustand Presentation Stores          │
                     └────────────────────┬─────────────────────┘
                                          │
                     ┌────────────────────▼─────────────────────┐
                     │    HEXAGONAL PORTS & ADAPTERS LAYER      │
                     │   - Inbound Ports (Use Cases)            │
                     │   - Outbound Ports (Repository/Logger)   │
                     │   - Infrastructure Adapters (Web/Native) │
                     └────────────────────┬─────────────────────┘
                                          │
                     ┌────────────────────▼─────────────────────┐
                     │   FEATURE DOMAIN PACKAGES (DDD Layer)    │
                     │   - @clean/cart (BudgetCart Entity)      │
                     │   - @clean/auth (User Entity)            │
                     └──────────────────────────────────────────┘
```

---

## 📂 Repository Directory Layout

```
clean-architecture-monorepo/
├── package.json                            <-- Root workspace configuration
├── nx.json                                 <-- Nx build pipeline & computation cache engine
├── tsconfig.json                           <-- Workspace TypeScript references
│
├── docs/                                   <-- Architecture & Tech Stack documentation
│   ├── architecture.md
│   └── tech-stack.md
│
├── packages/                               <-- SHARED DOMAIN & UTILITY PACKAGES
│   ├── cart/                               <-- @clean/cart (Cart Bounded Context Package)
│   │   ├── package.json
│   │   └── src/
│   │       ├── domain/ (BudgetCart, BudgetExceededError, Result, UseCases)
│   │       └── ports/ (CartRepositoryPort, NotificationPort, etc.)
│   │
│   ├── auth/                               <-- @clean/auth (Auth Bounded Context Package)
│   │   ├── package.json
│   │   └── src/
│   │       ├── domain/ (UserEntity, LoginUseCase)
│   │       └── ports/ (AuthRepositoryPort)
│   │
│   ├── logger/                             <-- @clean/logger (LoggerPort, ConsoleLoggerAdapter)
│   │   ├── package.json
│   │   └── src/
│   │
│   ├── telemetry/                          <-- @clean/telemetry (TelemetryPort, ConsoleTelemetryAdapter)
│   │   ├── package.json
│   │   └── src/
│   │
│   └── ui-logic/                           <-- @clean/ui-logic (useHeadlessSelect hook)
│       ├── package.json
│       └── src/
│
└── apps/                                   <-- PLATFORM CONSUMPTION APPS
    ├── web/                                <-- REACT WEB APPLICATION
    │   ├── package.json
    │   ├── public/ (mockServiceWorker.js)
    │   └── src/
    │       ├── adapters/ (LocalStorage, HttpCart, CachedHttp, Toast)
    │       ├── mocks/ (MSW REST handlers, browser worker, Node server)
    │       └── ui/
    │           ├── store/ (useCartStore.ts - Zustand Presentation Store)
    │           ├── CompositionRoot.ts (Dependency Injection Container)
    │           ├── BudgetTrackerContainer.tsx (Smart Container Component)
    │           └── BudgetTrackerView.tsx (Dumb Presentational View Component)
    │
    └── mobile/                             <-- REACT NATIVE MOBILE APPLICATION
        ├── package.json
        └── src/
            ├── adapters/ (AsyncStorageCartRepository, NativeAlertAdapter)
            └── ui/ (Mobile CompositionRoot)
```
