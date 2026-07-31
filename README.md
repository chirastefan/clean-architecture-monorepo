# Clean Architecture Monorepo (`clean-architecture-monorepo`)

A production-grade, multi-platform TypeScript monorepo powered by **pnpm 10+ workspaces**, demonstrating **Hexagonal Architecture (Ports & Adapters)**, **Domain-Driven Design (DDD)**, **Presentation Layer Patterns**, and **Multi-Platform Delivery (Vite SPA, Next.js 15, Mobile & Backend)**.

> 💡 **Strict File Naming Convention:** 100% of workspace files and directories follow **kebab-case** (`di-container.ts`, `add-item-use-case.ts`, `budget-tracker-container.tsx`), eliminating cross-platform filesystem casing bugs on macOS, Linux CI/CD, and Windows.

---

## 📚 Architectural & Technical Documentation

All deep-dive system architecture, layer diagrams, and technical references are maintained in the `docs/` directory:

- 📐 **[System Architecture Guide](docs/architecture.md)** — Comprehensive reference on Hexagonal Architecture (Inbound/Outbound Ports), Domain-Driven Design, UI Presentation Patterns, Layer Maps, and Directory Structure.
- 🛠️ **[Technology Stack & Tooling Reference](docs/tech-stack.md)** — Core stack specifications for pnpm 10, TypeScript 5.6, React 18, Next.js 15, Expo 52, NestJS 10, Vite 6, Nx 20, Vitest 4, and Zustand.

---

## 🌟 Key Architecture Highlights

- **Shared Domain Core (`packages/cart`):** Pure, hardware-free business rules and use cases shared 100% across Vite, Next.js 15, Mobile, and Backend with zero UI or database framework dependencies.
- **Shared Web Design System (`packages/web-ui-components`):** Reusable styled React web components (`SharedButton`, `SharedCard`, `SharedBadge`) shared between Vite (`apps/web`) and Next.js (`apps/web-next`).
- **Pluggable Infrastructure (`apps/*/src/adapters`):** Interchangeable storage and notification adapters (LocalStorage, AsyncStorage, Web Toasts, Native Alerts) implementing Domain Port interfaces.
- **Multi-Platform UI Symmetry:** Identical UI Container / Presentational patterns and Zustand stores (`useCartStore` with `useShallow`) across Vite, Next.js, and React Native.
- **Dependency Injection (`di-container.ts`):** Central composition root in each app instantiating adapters and injecting them into Use Cases.
- **Compile-Time Resilience (`Result<T, E>`):** Explicit discriminated unions replacing unhandled exception throwing across all use cases.

---

## 🏗️ Workspace Structure (`pnpm-workspace.yaml`)

```
packages/
  ├── cart/               --> @clean/cart (Domain Entities, Use Cases & Port Interfaces)
  ├── auth/               --> @clean/auth (User Domain Entities & Use Cases)
  ├── logger/             --> @clean/logger (Logger Port & Console Adapter)
  ├── telemetry/          --> @clean/telemetry (Telemetry Port & Console Adapter)
  ├── ui-logic/           --> @clean/ui-logic (Headless UI Hooks)
  └── web-ui-components/  --> @clean/web-ui-components (Shared Web Design System)

apps/
  ├── web/                --> React 18 Vite SPA (LocalStorage Adapter, Port 5173)
  ├── web-next/           --> Next.js 15 App Router App (LocalStorage Adapter, Port 3000)
  ├── mobile/             --> React Native App (Expo, AsyncStorage Adapter)
  └── mock-api/           --> Standalone NestJS REST API Server (Port 4000)
```

---

## ⚡ Quick Start Commands (pnpm)

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Run Workspace Test Suite

```bash
pnpm test
# or
npx nx run-many -t test
```

### 3. Run Typecheck, Linter & Formatter

```bash
npx tsc --noEmit
pnpm run lint
pnpm run format
```

### 4. Run Application Dev Servers

```bash
# Start Vite Web App (Port 5173)
pnpm start

# Start Next.js 15 Web App (Port 3000)
pnpm dev:next

# Start NestJS Mock API (Port 4000)
pnpm dev:mock-api

# Start Expo Mobile App
pnpm dev:mobile
```

### 5. Visualize Nx Graph

```bash
npx nx graph
```
