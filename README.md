# Clean Architecture Monorepo (`clean-architecture-monorepo`)

A production-grade, multi-platform TypeScript monorepo demonstrating **Presentation Layer Pattern (Container/Presenter, Headless UI, Zustand Store)**, **Hexagonal Architecture (Ports & Adapters)**, **Domain-Driven Design (DDD Bounded Contexts)**, **Result Pattern**, **NestJS Mock API**, and **Nx Task Pipeline Orchestration**.

---

## 📚 Documentation Index

- 📐 **[System Architecture & Design Patterns Guide](docs/architecture.md)** — Comprehensive guide on Presentation Pattern, Hexagonal Architecture, DDD, Result Pattern, DTO isolation, and directory layout.
- 🛠️ **[Technology Stack & Tooling Reference](docs/tech-stack.md)** — Specifications for TypeScript 5.6, React 18, Vite 6, Nx 20, Vitest 4, Zustand, NestJS, ESLint 9, and Prettier.

---

## 🌟 Why Combined Hexagonal & DDD Architecture is the Enterprise Standard

Combining **Presentation Layer Patterns**, **Hexagonal Architecture (Ports & Adapters)**, and **Domain-Driven Design (DDD)** represents the industry gold standard for modern multi-platform frontend and full-stack software development:

1. 📱 **Multi-Platform Delivery (Web & Mobile Share 100% Core Business Logic):** Pure hardware-free domain packages (`@clean/cart`) run on both React Web (`apps/web`) and React Native (`apps/mobile`) without duplicating business rules or validation logic.
2. 🛡️ **Total Decoupling from Framework Volatility:** Insulates core business logic from UI framework updates (React 18 -> 19) or state management migrations (Redux -> Zustand). Frameworks sit on the outside as pluggable adapters.
3. ⚡ **Lightning-Fast, Non-Flaky Unit Testing:** Business use cases (`AddItemUseCase.execute()`) run in pure Node.js memory in **under 3 milliseconds**, eliminating heavy UI DOM rendering in unit tests.
4. 🧱 **Micro-Frontend (MFE) & Microservice Readiness:** Vertical package slicing by DDD Bounded Contexts (`@clean/cart`, `@clean/auth`) establishes strict encapsulation boundaries, making it effortless to extract packages into independent micro-frontends or microservices later.
5. 🔒 **Type-Safe Operational Resilience (Result Pattern):** Explicit `Result<T, E>` unions force TypeScript callers to handle success and failure paths at compile time, eliminating uncaught runtime crashes.

---

## 🏛️ Key Architectural Patterns Demonstrated

### 1. Presentation Layer Pattern (Container / Presenter, Headless UI, & Zustand Store)

- **Smart Container (`BudgetTrackerContainer.tsx`):** Orchestrates UI side-effects, notification subscriptions, and Zustand store dispatching.
- **Dumb Presentational View (`BudgetTrackerView.tsx`):** Purely decorative React component receiving props (`cart`, `loading`, `toasts`, event handlers) with zero business logic.
- **Headless UI State Hooks (`useHeadlessSelect.ts` in `@clean/ui-logic`):** Manages keyboard navigation (`ArrowUp`/`ArrowDown`/`Escape`), ARIA attributes, and state machine transitions with **zero DOM rendering logic**.
- **Presentation State Store (`useCartStore.ts`):** Lightweight Zustand store living in `apps/web/src/ui/store/`. Delegates all business operations to `@clean/cart` Use Cases and updates UI state with returned `BudgetCart` domain entities.

#### ✅ Pros & Architectural Advantages:

- **Separation of Concerns:** View components remain 100% decorative and reusable without embedded side-effects.
- **Instant UI Testing:** Dumb presentational views can be unit-tested or iterated on in Storybook with plain props without mocking complex backend APIs.
- **Platform-Agnostic Headless Logic:** Headless state hooks can be shared directly across React Web and React Native.

---

### 2. Hexagonal Architecture (Ports & Adapters)

- **Domain Center:** Pure business entities (`BudgetCart`) and Use Cases (`AddItemUseCase`) have **zero dependencies** on React, DOM APIs (`window`, `localStorage`), or backend databases.
- **Inbound Ports (Primary):** Use Case interfaces (`CartUseCase`, `AddItemUseCase`) invoked by Presentation Container components and Zustand stores.
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

### 5. Composition Root Dependency Injection Container

- `CompositionRoot.ts` in each application acts as the central Dependency Injection Container.
- Instantiates concrete platform adapters privately and exports _only_ Use Cases to the UI context provider (`DependencyContext.tsx`) or Zustand store, preserving strict architectural boundaries.

#### ✅ Pros & Architectural Advantages:

- **Zero Component Coupling:** Components and stores never import concrete adapters directly.
- **Single Configuration Point:** Changing an infrastructure implementation (e.g. enabling a NestJS Mock API) happens in one central file.

---

## 🏗️ Workspace Package Overview

```
packages/
  ├── cart/        --> @clean/cart (BudgetCart Entity, Use Cases, Typed Errors)
  ├── auth/        --> @clean/auth (User Entity, Login Use Case)
  ├── logger/      --> @clean/logger (LoggerPort, ConsoleLoggerAdapter)
  ├── telemetry/   --> @clean/telemetry (TelemetryPort, ConsoleTelemetryAdapter)
  └── ui-logic/    --> @clean/ui-logic (Platform-agnostic useHeadlessSelect)

apps/
  ├── web/         --> React 18 Web App (Presentation Layer, Zustand Store, CompositionRoot)
  ├── mobile/      --> React Native Mobile App (AsyncStorage Adapter, Native Alert Adapter)
  └── mock-api/    --> Standalone NestJS Mock REST Server (Port 4000)
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
npm start
# or
npm run dev -w web
```

### 5. Run NestJS Mock API Server

```bash
npm run dev:mock-api
```

### 6. Visualize Nx Workspace Graph

```bash
npx nx graph
```
