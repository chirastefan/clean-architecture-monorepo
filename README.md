# Clean Architecture Monorepo (`clean-architecture-monorepo`)

A production-grade, multi-platform TypeScript monorepo demonstrating **Hexagonal Architecture (Ports & Adapters)**, **Domain-Driven Design (DDD Bounded Contexts)**, **Result Pattern**, **Headless UI State Hooks**, **Isomorphic MSW Network Mocking**, and **Nx Task Pipeline Orchestration**.

---

## 📚 Documentation Index

* 📐 **[System Architecture & Design Patterns Guide](docs/architecture.md)** — Detailed guide on Hexagonal Architecture, DDD, Result Pattern, DTO isolation, and directory layout.
* 🛠️ **[Technology Stack & Tooling Reference](docs/tech-stack.md)** — Specifications for TypeScript 5.6, React 18, Vite 6, Nx 20, Vitest 4, and MSW 2.

---

## 🏛️ Key Architectural Patterns Demonstrated

1. **Hexagonal Architecture (Ports & Adapters):** `@clean/cart` domain logic is 100% decoupled from Web DOM / React Native storage APIs via inbound/outbound ports.
2. **DDD Bounded Contexts:** Code is partitioned vertically into domain packages (`@clean/cart`, `@clean/auth`) with typed domain errors.
3. **Result / Either Functional Pattern:** Explicit `Result<T, E>` return types eliminate unhandled try/catch exceptions across use cases.
4. **DTO & Mapper Isolation:** `CartDTO` and `CartMapper` isolate `BudgetCart` entities from JSON serialization structures.
5. **Headless Presentational UI Hooks:** `@clean/ui-logic` exports platform-agnostic state hooks consumed by both Web (`apps/web`) and Mobile (`apps/mobile`).
6. **Composition Root DI Container:** `CompositionRoot.ts` in each app wires platform adapters to domain use cases privately.
7. **Isomorphic Network Mocking:** MSW v2 intercepts REST network requests during browser dev mode and Vitest test execution.
8. **Nx Monorepo Orchestration:** Nx computation caching and dependency graph management across 7 workspace projects.

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
  ├── web/            --> React 18 Web App (MSW, LocalStorage/HTTP Adapters, CompositionRoot)
  └── mobile/         --> React Native Mobile App (AsyncStorage Adapter, Native Alert Adapter)
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

### 3. Run Web App Dev Server
```bash
npm run dev -w web
```

### 4. Visualize Nx Workspace Graph
```bash
npx nx graph
```
