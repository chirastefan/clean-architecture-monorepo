# Technology Stack & Tooling Reference

This document outlines the core technology stack, tools, and execution environments powering this monorepo architecture.

---

## 🔗 Documentation Links

- 🏠 **[Project Readme](../README.md)** — Quickstart guide, test commands, and overview.
- 📐 **[System Architecture Guide](architecture.md)** — Deep-dive reference on Hexagonal Architecture, DDD, and UI Patterns.

---

## 1. Core Stack & Frameworks

- **Package Manager:** pnpm 10+ (`pnpm-workspace.yaml`)
- **Language:** TypeScript 5.6+ (Strict mode, ES2022 target, Bundler module resolution)
- **Web App:** React 18.3+ (Vite 6, JSX transform `"jsx": "react-jsx"`, React Hooks)
- **Mobile App:** React Native 0.76+ & Expo 52+ (Native components, AsyncStorage)
- **Mock Backend:** NestJS 10+ (`@nestjs/core`, `@nestjs/common`, Port 4000)
- **Bundler & Dev Server:** Vite 6.0+ (Web HMR and Web Component bundling with `@r2wc/react-to-web-component`)
- **Monorepo & Build Pipeline:** Nx 20.8+ (Computation caching, task pipeline graph, `nx run-many`)

---

## 2. State Management & Presentation Patterns

- **UI State Management:** Zustand 4.5+ (With `useShallow` for optimized component re-rendering)
- **Headless UI Pattern:** Custom headless hooks (`useHeadlessSelect` in `@clean/ui-logic`)
- **Container / Presenter Pattern:** Smart Container components (`BudgetTrackerContainer`) and Dumb Views (`BudgetTrackerView`)

---

## 3. Testing & Code Quality

- **Test Runner:** Vitest 4.1+ (Unit & Integration testing across all 7 workspace projects)
- **Linter & Formatter:** ESLint 9+ (Flat config `eslint.config.js`) & Prettier (Strict 100 print width, 2-space tab width)
- **Naming Convention:** 100% strict `kebab-case` for all workspace files and directories

---

## 4. Architectural Design Patterns

- **Domain-Driven Design (DDD):** Strategic Bounded Context packages (`@clean/cart`, `@clean/auth`)
- **Hexagonal Architecture (Ports & Adapters):** Inbound Ports (Use Cases), Outbound Ports (Repository Interfaces), and Infrastructure Adapters (`LocalStorageCartRepository`, `AsyncStorageCartRepository`)
- **Dependency Injection (DI):** `di-container.ts` composition root instantiating adapters and injecting into use cases
- **Result Pattern:** Type-safe `Result<T, E>` discriminated unions replacing unhandled exception throwing
