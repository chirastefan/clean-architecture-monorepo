# Technology Stack & Tooling Reference

This document outlines the core technology stack, tools, and execution environments powering this monorepo architecture.

---

## 1. Core Stack

* **Language:** TypeScript 5.6+ (Strict mode, ES2022 target, Bundler module resolution)
* **Framework:** React 18.3+ (JSX transform `"jsx": "react-jsx"`, React Hooks, Suspense)
* **Bundler & Dev Server:** Vite 6.0+ (Lightning-fast HMR, ES module loading)
* **Monorepo Engine:** Nx 20.8+ (Computation caching, task pipeline graph, `nx run-many`)
* **Workspace Engine:** npm Workspaces (`workspaces: ["packages/*", "apps/*"]`)

---

## 2. Testing & Network Mocking

* **Test Runner:** Vitest 4.1+ (Unit & Integration testing, JSDOM environment)
* **Network Mocking:** MSW 2.15+ (Mock Service Worker — Isomorphic REST API interception for CSR and SSR/Vitest)

---

## 3. Architectural Design Patterns

* **Domain-Driven Design (DDD):** Strategic Bounded Contexts (`packages/cart`, `packages/auth`)
* **Hexagonal Architecture (Ports & Adapters):** Strict inbound/outbound ports decoupling domain entities from React DOM/Storage APIs
* **Headless Presentational UI Hooks:** Platform-agnostic state hooks in `@shared/ui-logic` consumed by both Web and Mobile apps
