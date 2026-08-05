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
- **Vite Web App:** React 18.3+ (Vite 6, JSX transform `"jsx": "react-jsx"`, React Hooks)
- **Next.js Web App:** Next.js 15+ App Router (`apps/web-next`)
- **Mobile App:** React Native 0.76+ & Expo 52+ (Native components, AsyncStorage)
- **Mock Backend:** NestJS 10+ (`@nestjs/core`, `@nestjs/common`, Port 4000)
- **Bundler & Dev Server:** Vite 6.0+ & Next.js 15
- **Monorepo & Build Pipeline:** Nx 20.8+ (Computation caching, task pipeline graph, `nx run-many`)

---

## 2. State Management & Presentation Packages

- **Shared Redux Store Package:** `@clean/cart-store` (Redux Toolkit 2.6+, RTK Async Thunks, Slices)
- **Mobile UI State Management:** Zustand 5+ (With `useShallow` for optimized component re-rendering)
- **HTTP Client:** Native browser `fetch()` inside Infrastructure Adapters (`HttpCartRepository`)
- **Shared Web Design System:** `@clean/web-ui-components` (Shared `SharedButton`, `SharedCard`, `SharedBadge`)
- **Headless UI Pattern:** Custom headless hooks (`useHeadlessSelect` in `@clean/ui-logic`)

---

## 3. Testing & Code Quality

- **Test Runner:** Vitest 4.1+ (Unit & Integration testing across all 10 workspace projects)
- **Linter & Formatter:** ESLint 9+ (Flat config `eslint.config.js`) & Prettier (Strict 100 print width, 2-space tab width)
- **Naming Convention:** 100% strict `kebab-case` for all workspace files and directories
