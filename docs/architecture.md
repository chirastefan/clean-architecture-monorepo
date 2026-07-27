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

#### 💡 Recap of Pattern 1: Presentation Layer Pattern

> **Key Takeaway:** The Presentation Layer is responsible _only_ for rendering UI components, managing user interactions, and holding ephemeral UI state. It consumes Clean Use Cases as primary entry points (Inbound Adapters) and never contains business rules or domain validation logic.

---

### 2. Hexagonal Architecture (Ports & Adapters)

- **Domain Center:** Pure business entities (`BudgetCart`) and Use Cases (`AddItemUseCase`) have **zero dependencies** on React, DOM APIs (`window`, `localStorage`), or backend databases.
- **Inbound Ports (Primary):** Use Case interfaces (`CartUseCase`, `AddItemUseCase`, `RemoveItemUseCase`) invoked by Presentation Container components and Zustand stores.
- **Outbound Ports (Secondary):** Infrastructure interfaces (`CartRepositoryPort`, `NotificationPort`, `LoggerPort`) implemented by concrete platform infrastructure adapters (`LocalStorageCartRepository`, `ToastNotificationAdapter`, `ConsoleLoggerAdapter`).

#### 💡 Recap of Pattern 2: Hexagonal Architecture

> **Key Takeaway:** By decoupling core domain logic from external frameworks via Ports & Adapters, you can swap out infrastructure (e.g., replace LocalStorage with HTTP REST, or React Web with React Native) without modifying a single line of business code.

---

### 3. Domain-Driven Design (DDD Bounded Contexts)

- **Strategic Slicing:** Code is partitioned vertically into independent Bounded Context feature packages (`@clean/cart`, `@clean/auth`).
- **Ubiquitous Language:** Domain entity names and use case operations (`BudgetCart.addItem()`, `AddItemUseCase`) match real-world business domain concepts directly.
- **Typed Domain Errors:** Custom error classes (`BudgetExceededError`, `InvalidBudgetLimitError`) encapsulate domain validation failure rules cleanly.

#### 💡 Recap of Pattern 3: Domain-Driven Design

> **Key Takeaway:** Vertical slicing into Bounded Context packages creates clear ownership boundaries, prevents domain concept pollution, and lays the exact foundation required for micro-frontend (MFE) or microservice architecture.

---

### 4. Result / Either Functional Pattern

- Replaces unhandled try/catch exception throwing with a type-safe `Result<T, E>` discriminated union (`ok()` and `fail()`).
- Forces use case callers (UI containers and Zustand stores) to explicitly handle success and failure paths at compile time.

#### 💡 Recap of Pattern 4: Result / Either Pattern

> **Key Takeaway:** Treating failure as a first-class return value eliminates runtime uncaught exceptions, makes error handling explicit in TypeScript signatures, and streamlines UI error reporting.

---

### 5. DTO & Mapper Translation Layer

- **Data Transfer Objects (`CartDTO`):** Define JSON network/storage payload structures.
- **Mappers (`CartMapper`):** Translate raw DTOs to rich `BudgetCart` domain entities at the infrastructure adapter boundary.

#### 💡 Recap of Pattern 5: DTO & Mapper Isolation

> **Key Takeaway:** Network payloads change frequently. Mappers shield your domain models from backend schema changes, API versioning updates, or database column renames.

---

### 6. Composition Root Dependency Injection Container

- `CompositionRoot.ts` in each application acts as the central Dependency Injection Container.
- Instantiates concrete platform adapters privately and exports _only_ Use Cases to the UI context provider (`DependencyContext.tsx`) or Zustand store, preserving strict architectural boundaries.

#### 💡 Recap of Pattern 6: Composition Root

> **Key Takeaway:** Centralizing object instantiation at the entry point of your application prevents components from importing concrete adapters directly, guaranteeing 100% loose coupling.

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
├── packages/                               <-- SHARED HARDWARE-FREE DOMAIN & UTILITY PACKAGES
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
│   ├── shared-logger/                      <-- @clean/logger (LoggerPort, ConsoleLoggerAdapter)
│   │   ├── package.json
│   │   └── src/
│   │
│   ├── shared-telemetry/                   <-- @clean/telemetry (TelemetryPort, ConsoleTelemetryAdapter)
│   │   ├── package.json
│   │   └── src/
│   │
│   └── shared-ui-logic/                    <-- @clean/ui-logic (useHeadlessSelect hook)
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
