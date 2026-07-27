# Clean Architecture Monorepo (`clean-architecture-monorepo`)

A production-grade, multi-platform TypeScript monorepo demonstrating **Presentation Layer Pattern (Container/Presenter, Headless UI, Zustand Store)**, **Hexagonal Architecture (Ports & Adapters)**, **Domain-Driven Design (DDD Bounded Contexts)**, **Result Pattern**, **Isomorphic Network Mocking (MSW v2 & Express)**, and **Nx Task Pipeline Orchestration**.

---

## 📚 Documentation Index

- 📐 **[System Architecture & Design Patterns Guide](docs/architecture.md)** — Detailed guide on Presentation Pattern, Hexagonal Architecture, DDD, Result Pattern, DTO isolation, and directory layout.
- 🛠️ **[Technology Stack & Tooling Reference](docs/tech-stack.md)** — Specifications for TypeScript 5.6, React 18, Vite 6, Nx 20, Vitest 4, Zustand, ESLint 9, Prettier, and MSW 2.

---

## 🏛️ Key Architectural Patterns Demonstrated

### 1. Presentation Layer Pattern (Container / Presenter, Headless UI, & Zustand Store)

- **Smart Container (`BudgetTrackerContainer.tsx`):** Orchestrates UI side-effects, notification subscriptions, and Zustand store dispatching.
- **Dumb Presentational View (`BudgetTrackerView.tsx`):** Purely decorative React component receiving props (`cart`, `loading`, `toasts`, event handlers) with zero business logic.
- **Headless UI State Hooks (`useHeadlessSelect.ts` in `@clean/ui-logic`):** Manages keyboard navigation (`ArrowUp`/`ArrowDown`/`Escape`), ARIA attributes, and state machine transitions with **zero DOM rendering logic**.
- **Presentation State Store (`useCartStore.ts`):** Lightweight Zustand store living in `apps/web/src/ui/store/`. Delegates all business operations to `@clean/cart` Use Cases and updates UI state with returned `BudgetCart` domain entities.

> 💡 **Recap of Pattern 1:** The Presentation Layer handles rendering and user interaction _only_. It consumes Use Cases as primary entry points and contains zero business rules or validation logic.

---

### 2. Hexagonal Architecture (Ports & Adapters)

- **Domain Center:** Pure business entities (`BudgetCart`) and Use Cases (`AddItemUseCase`) have **zero dependencies** on React, DOM APIs (`window`, `localStorage`), or backend databases.
- **Inbound Ports (Primary):** Use Case interfaces (`CartUseCase`, `AddItemUseCase`) invoked by Presentation Container components and Zustand stores.
- **Outbound Ports (Secondary):** Infrastructure interfaces (`CartRepositoryPort`, `NotificationPort`, `LoggerPort`) implemented by concrete platform infrastructure adapters (`LocalStorageCartRepository`, `ToastNotificationAdapter`, `ConsoleLoggerAdapter`).

> 💡 **Recap of Pattern 2:** Ports & Adapters decouple core domain logic from external frameworks, allowing you to swap infrastructure (e.g., LocalStorage vs HTTP REST vs React Native) without modifying business code.

---

### 3. Domain-Driven Design (DDD Bounded Contexts)

- **Strategic Slicing:** Code is partitioned vertically into independent Bounded Context feature packages (`@clean/cart`, `@clean/auth`).
- **Ubiquitous Language:** Domain entity names and use case operations (`BudgetCart.addItem()`, `AddItemUseCase`) match real-world business domain concepts directly.
- **Typed Domain Errors:** Custom error classes (`BudgetExceededError`, `InvalidBudgetLimitError`) encapsulate domain validation failure rules cleanly.

> 💡 **Recap of Pattern 3:** Slicing code into Bounded Context packages establishes clear ownership boundaries and provides the exact foundation required for micro-frontend (MFE) or microservice architecture.

---

### 4. Result / Either Functional Pattern

- Replaces unhandled try/catch exception throwing with a type-safe `Result<T, E>` discriminated union (`ok()` and `fail()`).
- Forces use case callers (UI containers and Zustand stores) to explicitly handle success and failure paths at compile time.

> 💡 **Recap of Pattern 4:** Treating failure as a first-class return value eliminates uncaught runtime exceptions and makes error handling explicit in TypeScript signatures.

---

### 5. Composition Root Dependency Injection Container

- `CompositionRoot.ts` in each application acts as the central Dependency Injection Container.
- Instantiates concrete platform adapters privately and exports _only_ Use Cases to the UI context provider (`DependencyContext.tsx`) or Zustand store, preserving strict architectural boundaries.

> 💡 **Recap of Pattern 5:** Centralizing object instantiation at the application entry point prevents components from importing concrete adapters directly, guaranteeing loose coupling.

---

## 🏗️ Workspace Package Overview

```
packages/
  ├── cart/           --> @clean/cart (BudgetCart Entity, Use Cases, Typed Errors)
  ├── auth/           --> @clean/auth (User Entity, Login Use Case)
  ├── shared-logger/  --> @clean/logger (LoggerPort, ConsoleLoggerAdapter)
  ├── shared-telemetry/-> @clean/telemetry (TelemetryPort, ConsoleTelemetryAdapter)
  └── shared-ui-logic/--> @clean/ui-logic (Platform-agnostic useHeadlessSelect)

apps/
  ├── web/            --> React 18 Web App (Presentation Layer, Zustand Store, CompositionRoot)
  ├── mobile/         --> React Native Mobile App (AsyncStorage Adapter, Native Alert Adapter)
  └── mock-api/       --> Standalone Express Mock REST Server (Port 4000)
```

---

## ⚡ Quick Start Commands

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Test Suite Across All 7 Workspace Projects (Nx Caching Enabled)

```bash
npm test
# or
npx nx run-many -t test
```

### 3. Run ESLint & Prettier

```bash
npm run lint
npm run format
```

### 4. Run Web App Dev Server

```bash
npm run dev -w web
```

### 5. Visualize Nx Workspace Graph

```bash
npx nx graph
```
