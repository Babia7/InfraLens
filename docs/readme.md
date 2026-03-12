# InfraLens

InfraLens is a React + TypeScript web application for Arista-facing systems engineering and technical sales workflows. It combines calculators, reference datasets, architecture design tools, learning labs, and narrative tooling into one UI.

## Deployment Context

- **Platform:** Google Cloud Run (containerized deployment)
- **Public domain:** `polymathsystem.com`
- **Container runtime:** NGINX serves the built Vite app on port `8080`

> This repo is the application source and container build definition for that Cloud Run deployment.

## Tech Stack

- **Frontend:** React 19, TypeScript, React Router
- **Build tool:** Vite
- **Testing:** Vitest + Testing Library + jsdom
- **UI assets:** custom CSS theme tokens, shared layout components, lucide-react icons, Sonner toasts

## Repository Structure

```text
.
├── App.tsx                     # App shell, HashRouter, top nav/theme toggle
├── index.tsx                   # React entrypoint
├── components/
│   ├── apps/                   # Routed feature apps and calculators
│   └── layout/                 # Shared layout primitives
├── config/
│   └── toolsRegistry.ts        # Canonical route/app registry
├── context/
│   └── InfraLensContext.tsx    # Shared state, hydration, persistence
├── data/                       # Seed content, datasets, data contracts
│   ├── switches/               # Switch model datasets
│   └── chassis/                # Chassis datasets
├── services/                   # Service utilities (notifications, parsing, etc.)
├── styles/
│   └── theme.css               # Light/dark design tokens + utility classes
├── tests/                      # Vitest test suites (including dataset contract tests)
├── Dockerfile                  # Multi-stage container build
├── nginx.conf                  # Static hosting config for SPA + headers
└── package.json                # Scripts and dependencies
```

## Application Architecture

### Routing and App Composition

- `App.tsx` wraps the app with `InfraLensProvider`, mounts global toasts, and renders all routes from `toolsRegistry`.
- Routing uses `HashRouter`, which keeps navigation resilient for static hosting and SPA deep links.
- `config/toolsRegistry.ts` maps each `SectionType` to:
  - URL path
  - lazy-loaded component
  - optional parent relationship
  - optional audience metadata

### Shared State and Persistence

- `context/InfraLensContext.tsx` centralizes app data/state.
- Initial values come from `data/initialData.ts`.
- State is persisted in browser `localStorage` with version-aware hydration.
- Use context setters instead of writing directly to localStorage from feature apps.

### Data-Driven Features

- Structured datasets live in `data/` (switches, chassis, Linux modules, protocols, playbooks, etc.).
- UI tools should read from these datasets rather than hardcoding specs.
- Contract expectations are enforced by tests (`tests/dataContracts.test.ts`).

## Key Feature Areas

- **Reference/Catalogs:** app index, codex/bookshelf, visual essays, roadmap
- **Financial/Business tools:** TCO, velocity, MTTR, talent ROI, why-now framing
- **Architecture/Design tools:** AI fabric designer, storage planner, switch selectors, protocol tooling
- **Enablement/Labs:** Linux/EOS practice, CloudVision enablement, troubleshooting scenarios
- **Narrative/Delivery:** briefing theater, demo command, playbook coaching

## Local Development

### Prerequisites

- Node.js 20+
- npm

### Install

```bash
npm ci
```

### Run locally

```bash
npm run dev
```

Default Vite behavior serves locally for development.

### Build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Test

```bash
npm run test
```

## Environment Variables

- `VITE_ADMIN_PIN` (optional): used by `AdminConsole` for PIN-gated access behavior.

For container builds, this value is passed as a Docker build arg (`ARG VITE_ADMIN_PIN`) and exposed as an environment variable in the build stage.

## Container and Cloud Run Notes

- Docker build is multi-stage:
  1. Build static assets with Node
  2. Serve `/dist` with NGINX
- NGINX is configured to:
  - listen on port `8080` (Cloud Run compatible)
  - route unknown paths to `index.html` for SPA behavior
  - set security headers
  - cache static assets aggressively

### Example container commands

```bash
docker build -t infralens:local --build-arg VITE_ADMIN_PIN=1234 .
docker run --rm -p 8080:8080 infralens:local
```

## Contribution Notes

- Add new routed apps in `components/apps/`.
- Register new routes in `config/toolsRegistry.ts`.
- Prefer shared tokens/components in `styles/theme.css`, `design/theme.ts`, and `components/layout/`.
- Keep large domain content in `data/` and maintain contract coverage in tests.

See `CONTRIBUTING.md` for contributor-oriented quick guidance.
