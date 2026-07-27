# System Architecture & Architectural Patterns Guide

This document details the software architecture, design patterns, bounded context package boundaries, and directory layout of **`clean-architecture-monorepo`**.

---

## 🏛️ Architectural Patterns & Design Principles

This repository combines enterprise-grade architectural patterns to achieve 100% platform independence, testability, and micro-frontend readiness:

### 1. Hexagonal Architecture (Ports & Adapters)
* **Domain Center:** Pure business entities (`BudgetCart`) and Use Cases (`AddItemUseCase`) have **zero dependencies** on React, DOM APIs (`window`, `localStorage`), or backend databases.
* **Inbound Ports:** Primary interfaces (Use Cases) exposed to the UI presentation layer.
* **Outbound Ports:** Secondary interfaces (`CartRepositoryPort`, `NotificationPort`, `LoggerPort`) implemented by concrete platform infrastructure adapters (`LocalStorageCartRepository`, `ToastNotificationAdapter`, `ConsoleLoggerAdapter`).

### 2. Domain-Driven Design (DDD Bounded Contexts)
* **Strategic Slicing:** Code is partitioned vertically into Bounded Context feature packages (`@clean/cart`, `@clean/auth`).
* **Ubiquitous Language:** Domain entity names and use case operations (`BudgetCart.addItem()`, `AddItemUseCase`) match business domain concepts directly.
* **Typed Domain Errors:** Custom error classes (`BudgetExceededError`, `InvalidBudgetLimitError`) encapsulate domain validation failure rules.

### 3. Result / Either Functional Pattern
* Replaces unhandled try/catch exception throwing with a type-safe `Result<T, E>` discriminated union (`ok()` and `fail()`).
* Forces use case callers (UI containers) to explicitly handle success and failure paths at compile time.

### 4. DTO & Mapper Translation Layer
* **Data Transfer Objects (`CartDTO`):** Define JSON network/storage payload structures.
* **Mappers (`CartMapper`):** Translate DTOs to rich `BudgetCart` domain entities at the infrastructure adapter boundary.

### 5. Headless Presentational UI Hooks
* Platform-agnostic UI state management hooks (`useHeadlessSelect.ts` in `@clean/ui-logic`) manage state, keyboard navigation (`ArrowUp`/`ArrowDown`/`Escape`/`Enter`), and ARIA attributes with **zero DOM rendering code**.
* Consumed seamlessly by both React Web (`apps/web`) and React Native (`apps/mobile`).

### 6. Composition Root Dependency Injection
* `CompositionRoot.ts` in each application acts as the Dependency Injection Container.
* Instantiates concrete platform adapters privately and exports *only* Use Cases to the UI context provider (`DependencyContext.tsx`), preserving strict architectural boundaries.

### 7. Isomorphic Network Mocking (MSW v2)
* Intercepts REST network requests at the boundary during development (`msw/browser` Service Worker) and testing (`msw/node` in Vitest) without modifying domain models.

---

## 📐 System Layer Diagram

```
                     ┌──────────────────────────────────────────┐
                     │    APPS LAYER (Platform Delivery)        │
                     │   - apps/web (React 18 / Vite 6)         │
                     │   - apps/mobile (React Native Platform)  │
                     └────────────────────┬─────────────────────┘
                                          │
                     ┌────────────────────▼─────────────────────┐
                     │   CROSS-CUTTING SHARED UTILITIES LAYER   │
                     │   - @clean/logger                        │
                     │   - @clean/telemetry                     │
                     │   - @clean/ui-logic                      │
                     └────────────────────┬─────────────────────┘
                                          │
                     ┌────────────────────▼─────────────────────┐
                     │   FEATURE DOMAIN PACKAGES (DDD Layer)    │
                     │   - @clean/cart                          │
                     │   - @clean/auth                          │
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
    │       └── ui/ (CompositionRoot, DependencyContext, BudgetTrackerContainer)
    │
    └── mobile/                             <-- REACT NATIVE MOBILE APPLICATION
        ├── package.json
        └── src/
            ├── adapters/ (AsyncStorageCartRepository, NativeAlertAdapter)
            └── ui/ (Mobile CompositionRoot)
```
