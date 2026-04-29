# 🏛️ Micro Frontend Architecture (Module Federation) — Architect's Deep Dive

> **Audience:** Lead / Staff / Principal Frontend Architects
> **Goal:** Not just "how" — but **why**, **when**, **trade-offs**, and **production realities**.
> **Stack:** React 18 + Webpack 5 Module Federation (concepts apply to Vite/Rspack too).

---

## 📑 Table of Contents

1. [Why Micro Frontends Exist (The Real Reason)](#1-why-micro-frontends-exist-the-real-reason)
2. [When NOT to Use MFE (Architect's Decision Tree)](#2-when-not-to-use-mfe-architects-decision-tree)
3. [High-Level Architecture](#3-high-level-architecture)
4. [Folder Structure (Mono vs Poly Repo)](#4-folder-structure-mono-vs-poly-repo)
5. [Module Federation Setup — Line by Line](#5-module-federation-setup--line-by-line)
6. [How Module Federation Works Under the Hood](#6-how-module-federation-works-under-the-hood)
7. [Runtime Flow — Sequence Diagram](#7-runtime-flow--sequence-diagram)
8. [Shared Dependencies Deep Dive](#8-shared-dependencies-deep-dive)
9. [Build Time vs Runtime](#9-build-time-vs-runtime)
10. [Production-Grade Improvements](#10-production-grade-improvements)
11. [Deployment Architecture (CDN + CI/CD)](#11-deployment-architecture-cdn--cicd)
12. [State Sharing Patterns](#12-state-sharing-patterns)
13. [Error Handling & Resilience](#13-error-handling--resilience)
14. [Performance Considerations](#14-performance-considerations)
15. [Security Concerns](#15-security-concerns)
16. [Observability & Debugging](#16-observability--debugging)
17. [Team Topology (Conway's Law)](#17-team-topology-conways-law)
18. [Migration Strategy (Strangler Fig)](#18-migration-strategy-strangler-fig)
19. [Trade-offs vs Alternatives](#19-trade-offs-vs-alternatives)
20. [Real-World Challenges](#20-real-world-challenges)
21. [Interview-Ready Architect Answer](#21-interview-ready-architect-answer)
22. [Full Implementation From Scratch](#22-full-implementation-from-scratch)
23. [Next-Level Extensions](#23-next-level-extensions)

---

## 1. Why Micro Frontends Exist (The Real Reason)

Micro Frontends are **NOT a technical solution** — they are an **organizational solution** to a technical problem. The architect's first job is to understand this distinction.

### The Real Problems MFE Solves

| Problem                | Monolith Pain                       | MFE Solution                            |
| ---------------------- | ----------------------------------- | --------------------------------------- |
| **Team Coupling**      | 50 devs blocked by 1 PR queue       | Each team owns + ships independently    |
| **Release Cadence**    | Quarterly mega-releases             | Per-team continuous deployment          |
| **Tech Heterogeneity** | "React only" mandate                | Team A uses React 18, Team B uses Vue 3 |
| **Build Time**         | 15-min builds for 1-line change     | Each MFE builds in 30s                  |
| **Cognitive Load**     | New dev needs full codebase context | New dev only learns their MFE           |
| **Blast Radius**       | One bug breaks entire app           | Bug confined to one MFE                 |

### The Architect's Mental Shift

```mermaid
mindmap
  root((Why MFE?))
    Organizational
      Independent Teams
      Conway's Law alignment
      Domain ownership
      Faster decisions
    Technical
      Independent Deploy
      Smaller Bundles
      Tech Diversity
      Isolated Failures
    Business
      Faster Time-to-Market
      Lower coordination cost
      Team scalability
      A/B test per feature
    Risks
      Network overhead
      Version conflicts
      State sharing complexity
      Distributed debugging
```

> **Architect's Rule:** If you have **1 team of 5 devs**, MFE is over-engineering. If you have **8+ teams across 3+ domains**, monolith is under-engineering.

---

## 2. When NOT to Use MFE (Architect's Decision Tree)

Most "MFE failures" come from premature adoption. Use this decision tree:

```mermaid
flowchart TD
    Start([Should we use MFE?]) --> Q1{More than 3 teams<br/>working on same UI?}
    Q1 -->|No| Mono[✅ Use Monolith<br/>or Modular Monolith]
    Q1 -->|Yes| Q2{Independent<br/>deployment needed?}
    Q2 -->|No| Monorepo[✅ Use Monorepo<br/>Nx / Turborepo]
    Q2 -->|Yes| Q3{Different tech stacks<br/>required per team?}
    Q3 -->|No| Q4{Org has DevOps<br/>maturity?}
    Q3 -->|Yes| MFE_Strong[✅ MFE — Strong fit]
    Q4 -->|No| Warning[⚠️ Build DevOps first<br/>then MFE]
    Q4 -->|Yes| Q5{Can you handle<br/>distributed tracing<br/>and contract testing?}
    Q5 -->|No| Warning2[⚠️ Invest in tooling first]
    Q5 -->|Yes| MFE_Good[✅ MFE — Good fit]

    style Mono fill:#90EE90,color:#000
    style Monorepo fill:#90EE90,color:#000
    style MFE_Strong fill:#87CEEB,color:#000
    style MFE_Good fill:#87CEEB,color:#000
    style Warning fill:#FFD700,color:#000
    style Warning2 fill:#FFD700,color:#000
```

### Anti-Patterns (Smells of Bad MFE Adoption)

- **MFE per page** → Just use code-splitting + lazy loading.
- **MFE per component** → That's a component library, not MFE.
- **All MFEs deployed together** → You haven't gained independence; you have a distributed monolith.
- **Shared global state across MFEs via window object** → You're recreating a monolith with extra steps.

---

## 3. High-Level Architecture

### Real-World Setup

| Application            | Role                      | Port (dev) | Owner Team     |
| ---------------------- | ------------------------- | ---------- | -------------- |
| `shell-app` (MFE1)     | Host / Composition layer  | `:3000`    | Platform Team  |
| `dashboard-app` (MFE2) | Remote (Analytics domain) | `:3002`    | Analytics Team |
| `cart-app` (MFE3)      | Remote (Commerce domain)  | `:3003`    | Commerce Team  |

### Architecture Diagram

```mermaid
graph TB
    User([👤 User Browser])

    subgraph Shell["🏛️ Shell App (Host) :3000"]
        Router[React Router]
        Layout[Shared Layout<br/>Navbar / Footer]
        AuthCtx[Auth Context]
        EventBus[Event Bus]
    end

    subgraph CDN_MFE2["☁️ CDN — Dashboard MFE :3002"]
        RE2[remoteEntry.js<br/>📋 Module Manifest]
        DC[Dashboard Component]
        DA[Analytics Module]
    end

    subgraph CDN_MFE3["☁️ CDN — Cart MFE :3003"]
        RE3[remoteEntry.js<br/>📋 Module Manifest]
        CC[Cart Component]
        CO[Checkout Module]
    end

    subgraph Backend["🗄️ Backend Services"]
        BFF1[BFF Dashboard]
        BFF2[BFF Cart]
    end

    User -->|1. Initial Load| Shell
    Shell -->|2. Fetch manifest| RE2
    Shell -->|2. Fetch manifest| RE3
    RE2 -->|3. Lazy load chunk| DC
    RE3 -->|3. Lazy load chunk| CC
    DC -.->|API calls| BFF1
    CC -.->|API calls| BFF2

    style Shell fill:#FFE4B5,color:#000
    style CDN_MFE2 fill:#B0E0E6,color:#000
    style CDN_MFE3 fill:#B0E0E6,color:#000
    style Backend fill:#DDA0DD,color:#000
```

### Roles & Responsibilities

#### ✅ Shell (Host) — The Composition Layer

- **Single entry point** — owns `index.html`, root mount, hydration.
- **Cross-cutting concerns** — auth, theming, i18n, analytics, error boundaries.
- **Routing** — top-level routes; sub-routes delegated to MFEs.
- **Shared infrastructure** — design system bridge, event bus, feature flags.
- **What it does NOT do** — business logic of any specific domain.

#### ✅ Remotes (MFE2, MFE3) — Domain Owners

- **Bounded context** — one domain per MFE (DDD principle).
- **Independently deployable** — own CI/CD, own release cadence.
- **Self-contained** — can run standalone (critical for dev experience).
- **Expose contracts** — well-defined component APIs / props.

---

## 4. Folder Structure (Mono vs Poly Repo)

### Option A: Polyrepo (Each MFE in its own repo)

```
github.com/company/
├── shell-app/        ← own repo, own CI
├── dashboard-app/    ← own repo, own CI
├── cart-app/         ← own repo, own CI
└── design-system/    ← shared component library
```

✅ True independence • ❌ Harder cross-cutting changes

### Option B: Monorepo (All MFEs in one repo, e.g., Nx/Turborepo)

```
mfe-platform/
├── apps/
│   ├── shell-app/
│   ├── dashboard-app/
│   └── cart-app/
├── packages/
│   ├── design-system/
│   ├── shared-types/
│   └── event-bus/
├── nx.json
└── package.json
```

✅ Easy refactors • ❌ Risk of accidental coupling

```mermaid
graph LR
    subgraph Polyrepo["Polyrepo (True Independence)"]
        P1[shell-app repo] -.->|npm/CDN| P2[dashboard repo]
        P1 -.->|npm/CDN| P3[cart repo]
    end
    subgraph Monorepo["Monorepo (Coordinated)"]
        M[Single Repo] --> M1[apps/shell]
        M --> M2[apps/dashboard]
        M --> M3[apps/cart]
        M --> M4[packages/shared]
    end

    style Polyrepo fill:#FFE4E1,color:#000
    style Monorepo fill:#E0FFE0,color:#000
```

> **Architect's Choice:** Start with monorepo for shared tooling, but enforce **deployment independence** via separate CI pipelines per app.

---

## 5. Module Federation Setup — Line by Line

### 🔥 MFE2 (Dashboard Remote)

```js
// webpack.config.js
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
  devServer: {
    port: 3002, // Dev server port — unique per remote
  },

  plugins: [
    new ModuleFederationPlugin({
      // 🎯 'name' — the global identifier this MFE registers under window
      // After build, accessible as window.mfe2 in the browser.
      // MUST be unique across the entire ecosystem.
      name: 'mfe2',

      // 🎯 'filename' — the manifest file webpack generates.
      // Convention: 'remoteEntry.js'. This is the ONLY file the host
      // needs to know about — it's a tiny bootstrap that knows how
      // to load every exposed module.
      filename: 'remoteEntry.js',

      // 🎯 'exposes' — the public API of this MFE.
      // Key = path consumers will import (e.g., "mfe2/Dashboard")
      // Value = local file in this repo
      // Treat this like a npm package's `main` field — it's a CONTRACT.
      exposes: {
        './Dashboard': './src/Dashboard',
      },

      // 🎯 'shared' — dependencies that should be deduplicated.
      // singleton: true means "there must be ONLY ONE React in the page".
      // Without this, host React + remote React = broken hooks.
      shared: {
        react: {
          singleton: true,
          requiredVersion: '^18.0.0', // Strict version range
          eager: false, // Lazy-load React (faster first paint)
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '^18.0.0',
        },
      },
    }),
  ],
};
```

### 🔥 MFE1 (Shell / Host)

```js
new ModuleFederationPlugin({
  name: "shell",

  // 🎯 'remotes' — declarative list of MFEs this host can consume.
  // Format: "<remoteName>@<URL-to-remoteEntry.js>"
  // The URL is fetched at RUNTIME — not bundled.
  // Hardcoding URLs here is a code smell; use env vars in production.
  remotes: {
    mfe2: "mfe2@http://localhost:3002/remoteEntry.js",
    mfe3: "mfe3@http://localhost:3003/remoteEntry.js",
  },

  // Same shared config as remotes — they MUST agree on shared deps.
  shared: {
    react: { singleton: true, requiredVersion: "^18.0.0" },
    "react-dom": { singleton: true, requiredVersion: "^18.0.0" },
  },
}),
```

### Consuming Remote in React

```jsx
import React, { Suspense } from 'react';

// 🎯 React.lazy() returns a Promise — webpack rewrites this import
// at build time to fetch the remote chunk at runtime.
// Path format: "<remoteName>/<exposedKey>"
const Dashboard = React.lazy(() => import('mfe2/Dashboard'));
const Cart = React.lazy(() => import('mfe3/Cart'));

function App() {
  return (
    // Suspense is MANDATORY — remote loading is async.
    // Without it, React throws "suspended while rendering".
    <Suspense fallback={<div>Loading...</div>}>
      <Dashboard />
      <Cart />
    </Suspense>
  );
}
```

---

## 6. How Module Federation Works Under the Hood

This is what separates a senior from a staff/principal engineer — knowing the **internals**.

### What Webpack Actually Does

When you write `import("mfe2/Dashboard")`, webpack does NOT bundle the dashboard code. Instead, it generates code roughly equivalent to:

```js
// Pseudo-code of what webpack generates for the host
async function loadRemoteModule() {
  // 1. Inject <script src="http://localhost:3002/remoteEntry.js">
  await loadScript('http://localhost:3002/remoteEntry.js');

  // 2. remoteEntry.js registers window.mfe2 = { get, init }
  const container = window.mfe2;

  // 3. Initialize the container with shared scope (deduplication)
  await container.init(__webpack_share_scopes__.default);

  // 4. Get the factory function for the requested module
  const factory = await container.get('./Dashboard');

  // 5. Execute factory to get the module
  const Module = factory();
  return Module;
}
```

### The Module Federation Container Protocol

Every remote exports a **container object** with two methods:

```ts
interface RemoteContainer {
  init(shareScope: ShareScope): Promise<void>;
  get(moduleName: string): Promise<() => Module>;
}
```

### Visual Internals

```mermaid
graph TB
    subgraph Build["🏗️ Build Time"]
        Code["import('mfe2/Dashboard')"]
        Webpack["Webpack 5"]
        ContainerRef["Generates 'container reference' NOT actual import"]
        Code --> Webpack
        Webpack --> ContainerRef
    end

    subgraph Runtime["⚡ Runtime in Browser"]
        Bootstrap["Host bootstraps"]
        InjectScript["Inject script tag → remoteEntry.js"]
        Container["window.mfe2 container { init, get }"]
        InitScope["container.init shared scope"]
        Negotiate["Negotiate React version singleton check"]
        GetModule["container.get './Dashboard'"]
        Factory["Returns factory function"]
        Execute["factory → Module"]
        Render["React renders Dashboard"]

        Bootstrap --> InjectScript
        InjectScript --> Container
        Container --> InitScope
        InitScope --> Negotiate
        Negotiate --> GetModule
        GetModule --> Factory
        Factory --> Execute
        Execute --> Render
    end

    ContainerRef -.->|Compiled output| Bootstrap

    style Build fill:#FFF8DC,color:#000
    style Runtime fill:#E0F0FF,color:#000
```

### The Shared Scope — How Singletons Work

```mermaid
sequenceDiagram
    participant H as Host (Shell)
    participant SS as Shared Scope<br/>(window.__webpack_share_scopes__)
    participant R as Remote (MFE2)

    Note over H,R: Both apps registered React@18.2.0 as singleton
    H->>SS: Register react@18.2.0 (eager: false)
    H->>R: Inject remoteEntry.js
    R->>SS: container.init(shareScope)
    SS->>R: Found react@18.2.0 already → use host's React
    Note over R: ✅ No duplicate React loaded
    R->>H: Module ready
    H->>R: container.get('./Dashboard')
    R-->>H: Returns Dashboard component
    Note over H,R: Dashboard uses host's React → hooks work correctly
```

> **Why singleton matters:** React stores hook state in module-scoped variables. Two React instances = two separate state stores = `Invalid hook call` errors and broken context.

---

## 7. Runtime Flow — Sequence Diagram

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant Shell as Shell :3000
    participant CDN_M2 as MFE2 CDN :3002
    participant CDN_M3 as MFE3 CDN :3003

    User->>Browser: Navigate to app.com
    Browser->>Shell: GET /
    Shell-->>Browser: index.html + main.js
    Browser->>Browser: React hydrates Shell

    User->>Browser: Click /dashboard

    Note over Browser,Shell: React.lazy triggers
    Browser->>CDN_M2: GET /remoteEntry.js
    CDN_M2-->>Browser: remoteEntry.js (~5KB)
    Browser->>Browser: Register window.mfe2

    Note over Browser: container.init(sharedScope)<br/>Negotiate React singleton
    Browser->>Browser: container.get('./Dashboard')
    Browser->>CDN_M2: GET /dashboard.[hash].js
    CDN_M2-->>Browser: Dashboard chunk
    Browser->>Browser: Render <Dashboard />

    User->>Browser: Click /cart
    Browser->>CDN_M3: GET /remoteEntry.js
    CDN_M3-->>Browser: remoteEntry.js
    Browser->>CDN_M3: GET /cart.[hash].js
    CDN_M3-->>Browser: Cart chunk
    Note over Browser: React reused from shared scope<br/>NO second React download
    Browser->>Browser: Render <Cart />
```

### Critical Path Analysis

| Phase                    | Cost           | Optimization                            |
| ------------------------ | -------------- | --------------------------------------- |
| Initial Shell load       | ~150KB gzipped | Server-render shell, cache aggressively |
| `remoteEntry.js` fetch   | ~5–10KB        | Preload `<link rel="preload">` on hover |
| MFE chunk fetch          | 50–200KB       | HTTP/2 multiplexing, code splitting     |
| Shared scope negotiation | <5ms           | Negligible — but matters at scale       |

---

## 8. Shared Dependencies Deep Dive

This is where most teams get burned. Understand it cold.

### Configuration Options

```js
shared: {
  react: {
    singleton: true,        // Force ONE instance globally
    requiredVersion: "^18.0.0",
    strictVersion: false,   // true = throw on mismatch; false = warn
    eager: false,           // true = bundle in initial chunk; false = lazy
    shareScope: "default",  // Multiple scopes possible (advanced)
  }
}
```

### Singleton Resolution Algorithm

```mermaid
flowchart TD
    Start([App requests react]) --> Check{Is react in<br/>shared scope?}
    Check -->|No| Load[Load app's own version<br/>Register in scope]
    Check -->|Yes| Compare{Version<br/>satisfies<br/>requiredVersion?}
    Compare -->|Yes| Reuse[✅ Reuse existing version]
    Compare -->|No, singleton: true| Warn[⚠️ Warn in console<br/>Use highest version anyway]
    Compare -->|No, strictVersion: true| Error[❌ Throw error<br/>App breaks]
    Compare -->|No, singleton: false| Duplicate[⚠️ Load duplicate<br/>Different versions coexist]

    style Reuse fill:#90EE90,color:#000
    style Warn fill:#FFD700,color:#000
    style Error fill:#FF6B6B,color:#000
    style Duplicate fill:#FFA500,color:#000
```

### Dependency Strategy by Type

| Dependency Type                   | Strategy                          | Reason                                      |
| --------------------------------- | --------------------------------- | ------------------------------------------- |
| `react`, `react-dom`              | `singleton: true`                 | Hooks, context, rendering — must be unified |
| State management (Redux, Zustand) | `singleton: true` if shared store | Otherwise duplicate stores                  |
| UI library (MUI, AntD)            | `singleton: true` for theming     | Separate themes = visual chaos              |
| Utilities (lodash, date-fns)      | `singleton: false`                | OK to have multiple versions                |
| Internal design system            | `singleton: true`                 | Brand consistency                           |

### Eager vs Lazy Loading

```mermaid
graph LR
    subgraph Eager["eager: true"]
        E1[Bundled in initial chunk] --> E2[✅ No async overhead]
        E2 --> E3[❌ Larger initial bundle]
        E3 --> E4[❌ Loads even if MFE never used]
    end

    subgraph Lazy["eager: false (default)"]
        L1[Loaded on first import] --> L2[✅ Smaller initial bundle]
        L2 --> L3[✅ Pay only when used]
        L3 --> L4[❌ Async wrapper required]
    end

    style Eager fill:#FFE4E1,color:#000
    style Lazy fill:#E0FFE0,color:#000
```

> **Rule of thumb:** Use `eager: true` for shell (always loaded). Use `eager: false` for remotes.

---

## 9. Build Time vs Runtime

The mental model that separates beginners from architects.

```mermaid
graph TB
    subgraph BuildTime["🏗️ BUILD TIME (CI Pipeline)"]
        direction LR
        BT1[Shell builds independently] --> BT2[Knows: 'mfe2 will exist at runtime']
        BT2 --> BT3[Generates container references<br/>NOT bundled remote code]
        BT3 --> BT4[Outputs: shell.js + remoteEntry.js manifest]

        BT5[MFE2 builds independently] --> BT6[Generates own remoteEntry.js]
        BT6 --> BT7[Outputs: dashboard chunks]
    end

    subgraph RunTime["⚡ RUN TIME (Browser)"]
        direction LR
        RT1[User loads app] --> RT2[Shell.js executes]
        RT2 --> RT3[Encounters 'import mfe2/Dashboard']
        RT3 --> RT4[Network call → remoteEntry.js]
        RT4 --> RT5[Network call → Dashboard chunk]
        RT5 --> RT6[Render]
    end

    BuildTime -.->|"Decouples deployments"| RunTime

    style BuildTime fill:#FFF8DC,color:#000
    style RunTime fill:#E0F0FF,color:#000
```

### Implication: Independent Deployment

| Property                   | Traditional Build        | Module Federation             |
| -------------------------- | ------------------------ | ----------------------------- |
| Cross-app changes          | Requires rebuild of both | Only the changed app rebuilds |
| Deployment                 | Atomic (all or nothing)  | Independent (per app)         |
| Rollback                   | Roll back entire app     | Roll back single MFE          |
| Version mismatch detection | Compile time             | **Runtime** ⚠️                |

> **The big trade-off:** You gain deployment independence but lose compile-time safety. **Contract tests + TypeScript shared types are NOT optional in production.**

---

## 10. Production-Grade Improvements

### 🔹 Dynamic Remote URLs (Environment-Based)

```js
// webpack.config.js
const remoteUrl = (name) =>
  `${name}@${process.env[`${name.toUpperCase()}_URL`]}/remoteEntry.js`;

new ModuleFederationPlugin({
  name: 'shell',
  remotes: {
    mfe2: remoteUrl('mfe2'), // mfe2@https://cdn.prod.com/dashboard/remoteEntry.js
    mfe3: remoteUrl('mfe3'),
  },
});
```

### 🔹 Truly Dynamic Remotes (Runtime URL Resolution)

When you don't know remote URLs at build time (multi-tenant, A/B tests):

```js
// Promise-based remote — resolved at runtime
const loadRemote = (scope, module, url) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.onload = async () => {
      await __webpack_init_sharing__('default');
      const container = window[scope];
      await container.init(__webpack_share_scopes__.default);
      const factory = await container.get(module);
      resolve(factory());
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

// Usage — fetch URLs from a config service first
const config = await fetch('/api/mfe-registry').then((r) => r.json());
const Dashboard = await loadRemote('mfe2', './Dashboard', config.dashboardUrl);
```

### 🔹 Route-Based Lazy Loading

```jsx
import { Routes, Route } from 'react-router-dom';

const Dashboard = React.lazy(() => import('mfe2/Dashboard'));
const Cart = React.lazy(() => import('mfe3/Cart'));

<Routes>
  <Route
    path='/dashboard/*'
    element={
      <Suspense fallback={<Skeleton />}>
        <ErrorBoundary fallback={<DashboardError />}>
          <Dashboard />
        </ErrorBoundary>
      </Suspense>
    }
  />
  <Route
    path='/cart/*'
    element={
      <Suspense fallback={<Skeleton />}>
        <ErrorBoundary fallback={<CartError />}>
          <Cart />
        </ErrorBoundary>
      </Suspense>
    }
  />
</Routes>;
```

### 🔹 Preload on Intent (UX Win)

```jsx
// Preload remote when user hovers over nav link — feels instant
<Link to='/dashboard' onMouseEnter={() => import('mfe2/Dashboard')}>
  Dashboard
</Link>
```

### 🔹 Versioned Manifest (Production Pattern)

```
https://cdn.company.com/dashboard/v1.4.2/remoteEntry.js  ← immutable
https://cdn.company.com/dashboard/latest/remoteEntry.js  ← pointer (rollback target)
```

---

## 11. Deployment Architecture (CDN + CI/CD)

### Production Deployment Topology

```mermaid
graph TB
    subgraph CI["🔄 CI/CD Pipelines (Independent)"]
        CI1[Shell Pipeline]
        CI2[Dashboard Pipeline]
        CI3[Cart Pipeline]
    end

    subgraph Storage["☁️ Object Storage (S3 / GCS)"]
        S3_S[shell/v2.1.0/]
        S3_D[dashboard/v1.4.2/]
        S3_C[cart/v3.0.1/]
    end

    subgraph CDN["🌍 CDN Edge (CloudFront / Fastly)"]
        Edge1[us-east edge]
        Edge2[eu-west edge]
        Edge3[ap-south edge]
    end

    subgraph Registry["📋 MFE Registry Service"]
        Reg[(Version Registry<br/>tenant → version map)]
    end

    User([👤 User])

    CI1 -->|deploy| S3_S
    CI2 -->|deploy| S3_D
    CI3 -->|deploy| S3_C

    S3_S --> Edge1 & Edge2 & Edge3
    S3_D --> Edge1 & Edge2 & Edge3
    S3_C --> Edge1 & Edge2 & Edge3

    User -->|1. Load shell| Edge1
    User -->|2. Query versions| Reg
    Reg -->|3. Return URLs| User
    User -->|4. Fetch remoteEntry.js| Edge1

    style CI fill:#E0FFE0,color:#000
    style Storage fill:#FFE4B5,color:#000
    style CDN fill:#B0E0E6,color:#000
    style Registry fill:#DDA0DD,color:#000
```

### CI/CD Pipeline per MFE

```mermaid
flowchart TD
    Dev[👨‍💻 Dev pushes to main] --> Test[Run unit tests]
    Test --> Contract[Run contract tests<br/>against shell]
    Contract --> Build[Build with version hash]
    Build --> Upload[Upload to S3<br/>cdn.com/dashboard/v1.4.2/]
    Upload --> Smoke[Smoke test<br/>against staging shell]
    Smoke --> Canary[Canary: 5% traffic<br/>to new version]
    Canary --> Monitor{Error rate<br/>OK?}
    Monitor -->|Yes| Promote[Promote: update<br/>'latest' pointer]
    Monitor -->|No| Rollback[Auto-rollback<br/>revert pointer]

    style Promote fill:#90EE90,color:#000
    style Rollback fill:#FF6B6B,color:#000
```

---

## 12. State Sharing Patterns

The hardest problem in MFE. Choose your weapon carefully.

```mermaid
graph TB
    Question{Need to share<br/>state across MFEs?}
    Question -->|URL state OK?| URL[✅ URL Params<br/>Simplest, most decoupled]
    Question -->|Cross-MFE events?| EventBus[✅ Event Bus<br/>Pub/Sub pattern]
    Question -->|Auth/User data?| Context[✅ Context Bridge<br/>via shell injection]
    Question -->|Heavy shared state?| Store[⚠️ Shared Store<br/>Redux singleton]
    Question -->|Same domain?| Reconsider[❌ Reconsider —<br/>maybe not separate MFEs]

    style URL fill:#90EE90,color:#000
    style EventBus fill:#90EE90,color:#000
    style Context fill:#FFD700,color:#000
    style Store fill:#FFA500,color:#000
    style Reconsider fill:#FF6B6B,color:#000
```

### Pattern 1: URL as State (Best — Most Decoupled)

```jsx
// Cart MFE writes to URL
navigate(`/checkout?items=${cart.length}`);

// Header MFE reads from URL
const items = new URLSearchParams(location.search).get('items');
```

✅ No coupling • ✅ Bookmarkable • ❌ Limited data size

### Pattern 2: Event Bus (Pub/Sub)

```js
// shared/event-bus.js — exposed by shell
class EventBus extends EventTarget {
  emit(event, detail) {
    this.dispatchEvent(new CustomEvent(event, { detail }));
  }
  on(event, handler) {
    this.addEventListener(event, (e) => handler(e.detail));
  }
}
window.__eventBus__ = new EventBus();

// Cart MFE
window.__eventBus__.emit('cart:updated', { count: 3 });

// Header MFE
window.__eventBus__.on('cart:updated', ({ count }) => {
  setCartBadge(count);
});
```

```mermaid
sequenceDiagram
    participant Cart as Cart MFE
    participant Bus as Event Bus<br/>(in Shell)
    participant Header as Header MFE
    participant Analytics as Analytics MFE

    Cart->>Bus: emit('cart:updated', {count: 3})
    Bus->>Header: notify (subscribed)
    Bus->>Analytics: notify (subscribed)
    Header->>Header: Update badge UI
    Analytics->>Analytics: Track event
    Note over Cart,Analytics: ✅ Decoupled — Cart doesn't<br/>know who's listening
```

✅ Decoupled • ✅ Multi-listener • ❌ Hard to debug, no type safety (use TypeScript discriminated unions)

### Pattern 3: Context Bridge

```jsx
// Shell wraps remotes with shared context
<AuthContext.Provider value={authState}>
  <ThemeContext.Provider value={theme}>
    <Suspense fallback='...'>
      <RemoteDashboard /> {/* Inherits context — IF singleton React */}
    </Suspense>
  </ThemeContext.Provider>
</AuthContext.Provider>
```

⚠️ **Only works with `react: { singleton: true }`** — otherwise contexts are scoped to different React instances.

### Pattern 4: Shared Store (Use Sparingly)

```js
// Shell exposes store via Module Federation
// shell webpack.config.js
exposes: {
  "./store": "./src/store"
}

// MFE2 imports store
import { useAppStore } from "shell/store";
```

⚠️ **Coupling alert** — now MFE2 depends on Shell's internal store shape. If shell refactors, all MFEs break. Use only for cross-cutting concerns (auth user object, theme).

---

## 13. Error Handling & Resilience

A remote can fail to load: network error, 404, JS exception, version mismatch. **The shell must NEVER crash.**

```mermaid
flowchart TD
    Load[Try load remote] --> Success{Load OK?}
    Success -->|Yes| Render[Render component]
    Success -->|No| ErrorType{Error type?}
    ErrorType -->|Network| Retry[Retry with backoff<br/>3 attempts]
    ErrorType -->|404 Not Found| Stale[Manifest stale —<br/>force reload page]
    ErrorType -->|JS exception| Boundary[Error Boundary<br/>show fallback UI]
    ErrorType -->|Version mismatch| Log[Log to Sentry<br/>show degraded UI]

    Retry --> Success
    Stale --> Reload[window.location.reload]
    Boundary --> Fallback[<DashboardUnavailable />]
    Log --> Fallback

    style Render fill:#90EE90,color:#000
    style Reload fill:#FFA500,color:#000
    style Fallback fill:#FFD700,color:#000
```

### Production-Grade Error Boundary

```jsx
class RemoteErrorBoundary extends React.Component {
  state = { hasError: false, retryCount: 0 };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Send to monitoring with MFE context
    Sentry.captureException(error, {
      tags: {
        mfe: this.props.mfeName,
        type: 'remote-load-failure',
      },
      extra: info,
    });
  }

  retry = () => {
    this.setState((s) => ({
      hasError: false,
      retryCount: s.retryCount + 1,
    }));
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className='mfe-error'>
          <p>{this.props.mfeName} is temporarily unavailable.</p>
          {this.state.retryCount < 3 && (
            <button onClick={this.retry}>Retry</button>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

// Usage
<RemoteErrorBoundary mfeName='dashboard'>
  <Suspense fallback={<Skeleton />}>
    <Dashboard />
  </Suspense>
</RemoteErrorBoundary>;
```

---

## 14. Performance Considerations

### Network Waterfall Analysis

```mermaid
gantt
    title Network Waterfall — Initial Page Load
    dateFormat X
    axisFormat %Lms

    section Critical Path
    HTML                     :h, 0, 100
    Shell main.js            :s, after h, 300
    Shell hydrate            :sh, after s, 100

    section Remote 1
    remoteEntry.js (mfe2)    :re2, after sh, 80
    Dashboard chunk          :d, after re2, 200
    Dashboard hydrate        :dh, after d, 80

    section Remote 2 (parallel)
    remoteEntry.js (mfe3)    :re3, after sh, 80
    Cart chunk               :c, after re3, 180
```

### Optimization Checklist

| Technique                         | Impact             | When                 |
| --------------------------------- | ------------------ | -------------------- |
| HTTP/2 multiplexing               | 🔥 High            | Always (CDN config)  |
| Preload `remoteEntry.js`          | 🔥 High            | Known critical paths |
| Prefetch on hover                 | High               | Navigation links     |
| Tree-shaking exposed modules      | High               | Always               |
| Aggressive `shared` deduplication | 🔥 High            | Always               |
| CDN with edge caching             | 🔥 High            | Production           |
| Brotli compression                | Medium             | Always               |
| Service Worker caching            | Medium             | PWA scenarios        |
| Skeleton screens                  | Medium (perceived) | Always               |
| Server-side composition           | High               | High-traffic apps    |

### Anti-Pattern: The Waterfall of Doom

```js
// ❌ BAD — sequential loading
const Dashboard = React.lazy(() => import('mfe2/Dashboard'));
const Widget = React.lazy(
  () => import('mfe2/Dashboard').then(() => import('mfe2/Widget')) // serial!
);

// ✅ GOOD — parallel loading
const [Dashboard, Widget] = await Promise.all([
  import('mfe2/Dashboard'),
  import('mfe2/Widget'),
]);
```

---

## 15. Security Concerns

MFEs introduce a **supply chain attack surface**. The shell is loading and executing JavaScript from URLs at runtime — treat this with the same rigor as third-party scripts.

### Threat Model

```mermaid
graph TB
    Attacker([🎭 Attacker]) -->|1. Compromise<br/>CDN/origin| Compromised[Compromised remoteEntry.js]
    Compromised -->|2. Served to all users| Users[All app users]
    Users -->|3. Executes malicious code<br/>in shell context| Damage[Steal cookies, tokens,<br/>inject phishing UI]

    Defense1[CSP with hash/nonce]
    Defense2[Subresource Integrity]
    Defense3[Trusted Types]
    Defense4[CDN access controls]
    Defense5[Manifest signing]

    Defense1 -.->|Mitigates| Compromised
    Defense2 -.->|Mitigates| Compromised
    Defense3 -.->|Mitigates| Damage
    Defense4 -.->|Prevents| Compromised
    Defense5 -.->|Detects| Compromised

    style Attacker fill:#FF6B6B,color:#000
    style Compromised fill:#FFA500,color:#000
    style Damage fill:#FF6B6B,color:#000
```

### Hardening Checklist

| Concern                         | Mitigation                                                           |
| ------------------------------- | -------------------------------------------------------------------- |
| **CSP**                         | `script-src 'self' https://cdn.company.com` (allowlist remotes only) |
| **CORS**                        | Remote CDN must set `Access-Control-Allow-Origin` correctly          |
| **SRI (Subresource Integrity)** | Hash `remoteEntry.js` in manifest; reject mismatches                 |
| **CDN access**                  | Signed URLs / IAM-restricted writes; no public write                 |
| **Dependency confusion**        | Lock `requiredVersion` strictly; audit shared deps                   |
| **XSS via remote**              | Trusted Types policy on shell                                        |
| **Token leakage**               | Never put auth tokens in `window`; use HttpOnly cookies              |

---

## 16. Observability & Debugging

Distributed systems need distributed tracing. MFE is no different.

```mermaid
graph LR
    subgraph Browser["🌐 Browser"]
        Shell --> M2[MFE2]
        Shell --> M3[MFE3]
    end

    subgraph Telemetry["📊 Telemetry Pipeline"]
        Shell -->|trace_id: abc| Sentry
        M2 -->|trace_id: abc<br/>span: dashboard| Sentry
        M3 -->|trace_id: abc<br/>span: cart| Sentry

        Shell -->|RUM metrics| DD[Datadog]
        M2 -->|RUM metrics| DD
        M3 -->|RUM metrics| DD
    end

    subgraph Insights["🔍 Insights"]
        Sentry --> Errors[Error correlation<br/>by MFE + version]
        DD --> Perf[Performance per MFE<br/>+ shared deps]
    end

    style Telemetry fill:#E0F0FF,color:#000
    style Insights fill:#E0FFE0,color:#000
```

### Key Metrics per MFE

- **TTFB** for `remoteEntry.js`
- **Chunk size** trend over time (regression detector)
- **Error rate** per MFE per version
- **Hydration time** per MFE
- **Shared dep version drift** (alert if MFE2 wants react@18.1, host has 18.3)

### Debugging Tip — `__webpack_share_scopes__`

In Chrome DevTools console of the host:

```js
// See all shared modules and their resolved versions
console.log(__webpack_share_scopes__.default);
// Output:
// {
//   react: { '18.2.0': { from: 'shell', loaded: true, ... } },
//   'react-dom': { ... }
// }
```

---

## 17. Team Topology (Conway's Law)

> _"Any organization that designs a system will produce a design whose structure is a copy of the organization's communication structure."_ — Melvin Conway

MFE architecture is a direct expression of team topology. **Get this wrong and the architecture rots.**

```mermaid
graph TB
    subgraph Org["🏢 Organization"]
        PT[Platform Team<br/>👥 5 devs]
        AT[Analytics Team<br/>👥 8 devs]
        CT[Commerce Team<br/>👥 12 devs]
        DS[Design System Team<br/>👥 4 devs]
    end

    subgraph Arch["🏛️ Architecture (mirrors org)"]
        Shell[Shell App]
        Dashboard[Dashboard MFE]
        Cart[Cart MFE]
        DSLib[Design System Library]
    end

    PT -->|owns| Shell
    AT -->|owns| Dashboard
    CT -->|owns| Cart
    DS -->|owns| DSLib

    Shell -.->|consumes| DSLib
    Dashboard -.->|consumes| DSLib
    Cart -.->|consumes| DSLib

    style Org fill:#FFE4B5,color:#000
    style Arch fill:#B0E0E6,color:#000
```

### Team Type Mapping (Team Topologies)

| MFE              | Team Type          | Cognitive Load       |
| ---------------- | ------------------ | -------------------- |
| Shell            | **Platform Team**  | Enabling other teams |
| Dashboard / Cart | **Stream-Aligned** | Domain-focused       |
| Design System    | **Enabling Team**  | Provides components  |
| MFE Tooling      | **Platform Team**  | CI/CD, registry      |

> **Architect's law:** If two teams are constantly stepping on each other in the same MFE, **split the MFE**. If two MFEs always deploy together, **merge them**.

---

## 18. Migration Strategy (Strangler Fig)

You don't rewrite. You **strangle**.

```mermaid
flowchart TB
    subgraph Phase1["Phase 1: Monolith"]
        M1[Big Monolithic React App]
    end

    subgraph Phase2["Phase 2: Introduce Shell"]
        Shell2[New Shell] -->|iframe / proxy| M2[Legacy App]
    end

    subgraph Phase3["Phase 3: Extract First MFE"]
        Shell3[Shell] --> NewCart[New Cart MFE]
        Shell3 -->|legacy routes| M3[Legacy App shrinking]
    end

    subgraph Phase4["Phase 4: Strangled"]
        Shell4[Shell] --> Cart4[Cart MFE]
        Shell4 --> Dash4[Dashboard MFE]
        Shell4 --> Profile4[Profile MFE]
    end

    Phase1 --> Phase2
    Phase2 --> Phase3
    Phase3 --> Phase4

    style Phase1 fill:#FFE4E1,color:#000
    style Phase4 fill:#90EE90,color:#000
```

### Migration Playbook

1. **Stand up the shell** — empty container, owns auth + routing.
2. **Iframe the legacy app** initially — it's ugly but works.
3. **Extract one route at a time** — start with the lowest-risk feature.
4. **Replace iframe with MFE** when each feature migrates.
5. **Delete legacy app** when last route migrates.

> **Architect's tip:** Pick the **smallest, most-deployed** feature first. You learn the deployment pipeline with low risk.

---

## 19. Trade-offs vs Alternatives

```mermaid
flowchart TD
    classDef low fill:#d4f1f9,stroke:#333;
    classDef medium fill:#fff3cd,stroke:#333;
    classDef high fill:#f8d7da,stroke:#333;

    A["Monolith\nLow Complexity\nLow Independence"]:::low
    B["Modular Monolith\nMedium Complexity\nMedium Independence"]:::medium
    C["Monorepo + Code Split\nMedium Complexity\nMedium Independence"]:::medium
    D["iframe Composition\nMedium Complexity\nHigh Independence"]:::medium
    E["MFE Build-time\nMedium Complexity\nHigh Independence"]:::medium
    F["MFE Runtime (MF)\nHigh Complexity\nVery High Independence"]:::high
    G["Web Components MFE\nHigh Complexity\nVery High Independence"]:::high

    A --> B --> C --> D --> E --> F --> G
```

### Comparison Matrix

| Approach              | Complexity | Team Independence | Performance | Best For                          |
| --------------------- | ---------- | ----------------- | ----------- | --------------------------------- |
| Monolith              | 🟢 Low     | ❌ None           | 🟢 Best     | <10 devs, single domain           |
| Modular Monolith      | 🟢 Low     | ⚠️ Logical only   | 🟢 Best     | 10–30 devs, related domains       |
| Monorepo + Code Split | 🟡 Medium  | ⚠️ Code-level     | 🟢 Great    | Single deployable, multiple teams |
| iframe MFE            | 🟡 Medium  | ✅ Full           | 🔴 Poor     | Legacy integration                |
| Build-time MFE        | 🟡 Medium  | ⚠️ Partial        | 🟢 Great    | Coordinated deploys OK            |
| **Runtime MFE (MF)**  | 🔴 High    | ✅ Full           | 🟡 Good     | Many teams, independent deploys   |
| Web Components        | 🔴 High    | ✅ Full           | 🟡 Good     | Multi-framework requirement       |

---

## 20. Real-World Challenges

### ❌ Version Conflicts

**Symptom:** `Invalid hook call. Hooks can only be called inside the body of a function component.`

**Root cause:** Two React instances loaded.

**Fix:**

```js
shared: {
  react: { singleton: true, requiredVersion: "^18.0.0", strictVersion: false }
}
```

And audit with: `console.log(__webpack_share_scopes__.default)`.

### ❌ The "Works in Dev, Breaks in Prod" Trap

Dev = same domain (localhost). Prod = different CDNs. CORS bites.

**Fix:** Configure CDN with `Access-Control-Allow-Origin: https://app.company.com`.

### ❌ Shared CSS Collisions

MFE2 uses `.button { color: red }`. MFE3 uses `.button { color: blue }`. Last loaded wins.

**Fixes (in order of preference):**

1. CSS Modules (scoped class names) per MFE.
2. CSS-in-JS (Emotion/styled-components) with theme.
3. Shadow DOM (last resort).
4. CSS layers (`@layer mfe2 {...}`).

### ❌ Routing Conflicts

Shell uses React Router v6. MFE2 uses v5. Pain.

**Fix:** Standardize router version via `shared`. Sub-route ownership: shell owns `/dashboard/*`, dashboard MFE handles internal routing.

### ❌ Bundle Size Creep

Each MFE accidentally includes lodash. 300KB extra.

**Fix:** Audit with `webpack-bundle-analyzer` per MFE. Add to `shared` for common libs.

---

## 21. Interview-Ready Architect Answer

> _"At my previous role, we had 8 product teams blocked by a single monolithic React app — releases took 3 weeks because every team's code shipped together. We migrated to a Module Federation–based micro-frontend architecture with a shell host and 6 domain-aligned remotes deployed independently to a CDN._
>
> _The shell owns cross-cutting concerns — auth, routing, telemetry, and the design system bridge — while each remote exposes a stable component contract via `remoteEntry.js`. We share React, React DOM, and our design system as singletons to prevent duplication and context fragmentation._
>
> _Key architectural decisions: (1) URL-as-state and an event bus for cross-MFE communication — we explicitly avoided shared global stores to prevent coupling; (2) per-MFE CI/CD with canary deploys behind a manifest registry, enabling instant rollback by pointer-flipping; (3) contract tests in each remote's pipeline against the shell, since runtime composition loses compile-time safety; (4) error boundaries around every remote so one MFE's failure degrades gracefully rather than crashing the app._
>
> _The trade-offs we accepted: increased operational complexity, the need for distributed tracing across MFE boundaries, and a stricter governance model for shared dependencies. The wins: deploy frequency went from bi-weekly to multiple times per day per team, and team onboarding time dropped because new engineers only needed to learn their MFE."_

---

## 22. Full Implementation From Scratch

### 📦 Step 1: Create Apps

```bash
npx create-react-app shell-app
npx create-react-app mfe2-app
```

### 📦 Step 2: Install Dependencies (Both Apps)

```bash
npm install webpack webpack-cli webpack-dev-server html-webpack-plugin --save-dev
npm install @babel/core babel-loader @babel/preset-react --save-dev
```

### ⚠️ Step 3: Remove CRA, Use Custom Webpack

Remove `react-scripts`. Update `package.json`:

```json
"scripts": {
  "start": "webpack serve --mode development",
  "build": "webpack --mode production"
}
```

### ⚙️ Step 4: MFE2 (Remote) Configuration

**`mfe2-app/webpack.config.js`**

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
  entry: './src/index.js',
  mode: 'development',

  devServer: {
    port: 3002,
  },

  output: {
    publicPath: 'auto', // Required for dynamic chunk loading
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-react'],
        },
      },
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: 'mfe2',
      filename: 'remoteEntry.js',
      exposes: {
        './Dashboard': './src/Dashboard',
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
      },
    }),

    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};
```

**`mfe2-app/src/Dashboard.js`**

```jsx
import React from 'react';

const Dashboard = () => {
  return (
    <div style={{ border: '2px solid blue', padding: '20px' }}>
      <h2>Dashboard from MFE2</h2>
    </div>
  );
};

export default Dashboard;
```

**`mfe2-app/src/index.js`**

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import Dashboard from './Dashboard';

// Standalone mount — required for dev experience
// (each MFE must run independently)
ReactDOM.render(<Dashboard />, document.getElementById('root'));
```

### ⚙️ Step 5: MFE3 (Cart Remote) Configuration

**`mfe3-app/webpack.config.js`**

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
  entry: './src/index.js',
  mode: 'development',

  devServer: { port: 3003 },
  output: { publicPath: 'auto' },

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: { presets: ['@babel/preset-react'] },
      },
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: 'mfe3',
      filename: 'remoteEntry.js',
      exposes: {
        './Cart': './src/Cart',
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
      },
    }),

    new HtmlWebpackPlugin({ template: './public/index.html' }),
  ],
};
```

**`mfe3-app/src/Cart.js`**

```jsx
import React from 'react';

const Cart = () => {
  return (
    <div style={{ border: '2px solid green', padding: '20px' }}>
      <h2>Cart from MFE3</h2>
    </div>
  );
};

export default Cart;
```

### ⚙️ Step 6: Shell (Host) Configuration

**`shell-app/webpack.config.js`**

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
  entry: './src/index.js',
  mode: 'development',

  devServer: { port: 3000 },
  output: { publicPath: 'auto' },

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: { presets: ['@babel/preset-react'] },
      },
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: 'shell',

      // Connection to remote MFEs
      // In production, replace URLs with env-based config
      remotes: {
        mfe2: 'mfe2@http://localhost:3002/remoteEntry.js',
        mfe3: 'mfe3@http://localhost:3003/remoteEntry.js',
      },

      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
      },
    }),

    new HtmlWebpackPlugin({ template: './public/index.html' }),
  ],
};
```

**`shell-app/src/App.js`**

```jsx
import React, { Suspense } from 'react';

// Remote imports — webpack rewrites these to runtime fetches
const RemoteDashboard = React.lazy(() => import('mfe2/Dashboard'));
const RemoteCart = React.lazy(() => import('mfe3/Cart'));

// Production-grade error boundary for remote failures
class RemoteErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.error(`[MFE Error] ${this.props.name}:`, error);
  }
  render() {
    if (this.state.hasError) {
      return <div>⚠️ {this.props.name} unavailable</div>;
    }
    return this.props.children;
  }
}

const App = () => {
  return (
    <div>
      <h1>Shell App (Host)</h1>

      <RemoteErrorBoundary name='Dashboard'>
        <Suspense fallback={<div>Loading Dashboard...</div>}>
          <RemoteDashboard />
        </Suspense>
      </RemoteErrorBoundary>

      <RemoteErrorBoundary name='Cart'>
        <Suspense fallback={<div>Loading Cart...</div>}>
          <RemoteCart />
        </Suspense>
      </RemoteErrorBoundary>
    </div>
  );
};

export default App;
```

**`shell-app/src/index.js`**

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));
```

### 🚀 Step 7: Run All Apps

```bash
# Terminal 1
cd mfe2-app && npm start    # http://localhost:3002

# Terminal 2
cd mfe3-app && npm start    # http://localhost:3003

# Terminal 3
cd shell-app && npm start   # http://localhost:3000
```

Open `http://localhost:3000` — you'll see the shell rendering both remote components loaded **at runtime over the network**.

### 🔍 Step 8: Verify in DevTools

Open Network tab and filter by `remoteEntry.js`:

```
GET http://localhost:3002/remoteEntry.js → 200 OK (~5KB)
GET http://localhost:3003/remoteEntry.js → 200 OK (~5KB)
GET http://localhost:3002/src_Dashboard_js.js → 200 OK
GET http://localhost:3003/src_Cart_js.js → 200 OK
```

Console check:

```js
console.log(__webpack_share_scopes__.default);
// Should show single React entry, used by all 3 apps
```

---

## 23. Next-Level Extensions

```mermaid
timeline
title MFE Maturity Roadmap

    section Foundation
      Done : Module Federation setup
           : Shared dependencies
           : Error boundaries

    section Production
      2026-Q2 : CDN deployment
              : CI/CD per MFE
      2026-Q3 : Manifest registry

    section Scale
      2026-Q3 : Cross-framework React + Vue
      2026-Q4 : SSR / Streaming
      2027-Q1 : Edge-side composition

    section Excellence
      2027-Q1 : Contract testing pipeline
      2027-Q2 : Distributed tracing
              : Versioned API governance
```

### What to Build Next

1. **🌐 Multi-framework integration** — React shell + Vue MFE via Web Components wrapper.
2. **🔐 Federated auth** — single sign-on with token sharing via secure context.
3. **📊 Distributed tracing** — propagate `trace-id` across MFE boundaries.
4. **📜 Contract testing** — Pact-style consumer/provider tests in CI.
5. **🚀 SSR + Streaming** — server-side composition for SEO + TTFB.
6. **🎨 Federated design tokens** — runtime theme switching across MFEs.
7. **📦 MFE versioning strategy** — semver enforcement at the manifest registry.
8. **🛰️ Edge-side includes (ESI)** — compose MFEs at the CDN edge layer.

---

## 🧠 Final Mental Model

```mermaid
graph TB
    Shell["🏛️ Shell (Host)<br/>━━━━━━━━━━━━━<br/>• Owns routing<br/>• Owns auth<br/>• Owns layout<br/>• Composes remotes"]

    Shell -->|loads at runtime| RE2["📋 remoteEntry.js<br/>Module Manifest"]
    RE2 -->|exposes| Comp2["⚛️ Dashboard Component"]

    Shell -->|loads at runtime| RE3["📋 remoteEntry.js<br/>Module Manifest"]
    RE3 -->|exposes| Comp3["⚛️ Cart Component"]

    Shared["♻️ Shared Scope<br/>react@18.2.0<br/>react-dom@18.2.0<br/>(singleton)"]

    Comp2 -.->|uses| Shared
    Comp3 -.->|uses| Shared
    Shell -.->|provides| Shared

    style Shell fill:#FFE4B5,color:#000
    style Shared fill:#90EE90,color:#000
    style RE2 fill:#B0E0E6,color:#000
    style RE3 fill:#B0E0E6,color:#000
```

### The Three Sentences That Define MFE

> 1. **The host does NOT bundle the remotes — it loads them at runtime.**
> 2. **`remoteEntry.js` is the contract — a manifest webpack generates that maps exposed names to async-loadable chunks.**
> 3. **Shared dependencies must be deduplicated via the shared scope — otherwise React breaks in subtle, debugging-nightmare ways.**

---

## 📚 References & Further Reading

- [Webpack Module Federation Docs](https://webpack.js.org/concepts/module-federation/)
- [Micro Frontends — martinfowler.com](https://martinfowler.com/articles/micro-frontends.html)
- [Team Topologies (Skelton & Pais)](https://teamtopologies.com/)
- [Strangler Fig Application Pattern](https://martinfowler.com/bliki/StranglerFigApplication.html)

---

> **Architect's closing thought:** Module Federation is a powerful tool, but the hardest problems in MFE are organizational, not technical. Get the team boundaries right first. The architecture will follow.
