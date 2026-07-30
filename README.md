# Clean Architecture Monorepo (`clean-architecture-monorepo`)

A production-grade, multi-platform TypeScript monorepo demonstrating **Hexagonal Architecture (Ports & Adapters)**, **Domain-Driven Design (DDD)**, **Presentation Layer Patterns**, and **Multi-Platform Delivery (Web, Mobile & Backend)**.

> 💡 **Strict File Naming Convention:** 100% of workspace files and directories follow **kebab-case** (`di-container.ts`, `add-item-use-case.ts`, `budget-tracker-container.tsx`), eliminating cross-platform filesystem casing bugs on macOS, Linux CI/CD, and Windows.

---

## 📚 Architectural & Technical Documentation

All deep-dive system architecture, layer diagrams, and technical references are maintained in the `docs/` directory:

- 📐 **[System Architecture Guide](docs/architecture.md)** — Comprehensive reference on Hexagonal Architecture (Inbound/Outbound Ports), Domain-Driven Design, UI Presentation Patterns, Layer Maps, and Directory Structure.
- 🛠️ **[Technology Stack & Tooling Reference](docs/tech-stack.md)** — Core stack specifications for TypeScript 5.6, React 18, Expo 52, NestJS 10, Vite 6, Nx 20, Vitest 4, and Zustand.

---

## 🌟 Key Architecture Highlights

- **Shared Domain Core (`packages/cart`):** Pure, hardware-free business rules and use cases shared 100% across Web, Mobile, and Backend with zero UI or database framework dependencies.
- **Pluggable Infrastructure (`apps/*/src/adapters`):** Interchangeable storage and notification adapters (LocalStorage, AsyncStorage, Web Toasts, Native Alerts) implementing Domain Port interfaces.
- **1-to-1 Web & Mobile Symmetry:** Identical UI Container / Presentational patterns and Zustand stores (`useCartStore` with `useShallow`) across React Web and React Native.
- **Dependency Injection (`di-container.ts`):** Central composition root in each app instantiating adapters and injecting them into Use Cases.
- **Compile-Time Resilience (`Result<T, E>`):** Explicit discriminated unions replacing unhandled exception throwing across all use cases.

---

## 🏗️ Workspace Structure

```
packages/
  ├── cart/        --> @clean/cart (Domain Entities, Use Cases & Port Interfaces)
  ├── auth/        --> @clean/auth (User Domain Entities & Use Cases)
  ├── logger/      --> @clean/logger (Logger Port & Console Adapter)
  ├── telemetry/   --> @clean/telemetry (Telemetry Port & Console Adapter)
  └── ui-logic/    --> @clean/ui-logic (Headless UI Hooks)

apps/
  ├── web/         --> React 18 Web App (Vite, LocalStorage Adapter, Port 5173)
  ├── mobile/      --> React Native App (Expo, AsyncStorage Adapter)
  └── mock-api/    --> Standalone NestJS REST API Server (Port 4000)
```

---

## ⚡ Quick Start Commands

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Workspace Test Suite

```bash
npm test
# or
npx nx run-many -t test
```

### 3. Run Typecheck, Linter & Formatter

```bash
npx tsc --noEmit
npm run lint
npm run format
```

### 4. Run Application Dev Servers

```bash
# Start Web App (Port 5173)
npm start

# Start NestJS Mock API (Port 4000)
npm run dev:mock-api

# Start Expo Mobile App
npm run dev:mobile
```

### 5. Visualize Nx Graph

```bash
npx nx graph
```
