# InfraLens

InfraLens is a React + TypeScript cognition layer for Arista Systems Engineers and Sales teams (Account Managers, pre-sales SEs). It unifies calculators, design blueprints, labs, and narrative tools in one client experience.

## Deployment Context

- **Platform:** Google Cloud Run (containerized deployment)
- **Public domain:** `polymathsystem.com`
- **Serving layer:** NGINX serves the built Vite app on port `8080`

> This repository is the source and container build definition for that Cloud Run deployment.

---

# InfraLens Technical Design Doc

## Purpose & Scope

- **Goal:** Deliver a cognition layer that externalizes field complexity and supports defensible technical + business decision-making.
- **Audience:** Frontend contributors extending tools and data owners curating domain datasets.
- **Out of scope (current build):** auth, multi-user sync, backend persistence, and PII storage. The product is currently client-side.

## System Overview

- **Runtime:** React 19 + Vite + HashRouter.
- **Composition:** `App.tsx` wraps the tree with `InfraLensProvider`, mounts global toasts, controls theme class, and renders routed micro-apps through `RouteView` (`onNavigate` / `onBack` injection).
- **Routing backbone:** `config/toolsRegistry.ts` is the canonical map from `SectionType` to path + lazy-loaded component (+ optional parent/audience/props metadata).
- **Data backbone:** `InfraLensContext` exposes shared registries and config. State is seeded from `data/initialData.ts` and persisted in `localStorage` with a version guard.
- **Design layer:** tokens live in `styles/theme.css` and `design/theme.ts`; layout primitives in `components/layout`.

## Core Modules

### Shell & Navigation
- `App.tsx`: sticky top bar, theme toggle, router shell, `Toaster` mount.
- `toolsRegistry`: route contract + lazy chunk boundaries.
- `BentoGrid`: home surface with deep links into Forge/Codex/Nexus/Roadmap/SE Performance and workflow apps.

### State & Persistence
- `InfraLensContext`: versioned hydration, debounced writes, scoped reset.
- New apps should use context setters and avoid direct ad-hoc `localStorage` writes.

### Catalogs & Reference Surfaces
- `AppShowcase`, `BookShelf`, `VisualEssays`, `RoadmapRequests`, `SEPerformanceGuide`.
- Contract coverage enforced by `tests/dataContracts.test.ts`.

### Reasoning / Builder Apps (selected)
- **Financial/ROI:** `TCOCalculator`, `OperationalVelocityModeler`, `MTTRDowntimeInsurance`, `UnifiedOSTalentROI`, `WhyNowEngineApp`.
- **Architecture:** `AIClusterFabricDesigner`, `StorageFabricPlanner`, `SwitchSelector7050/7280`, `AVDStudio`, `LifeSciencesArchitect`, `VerticalMatrix`, `ProtocolsApp`, `ProtocolCollisionMapper`, `ValidatedDesignNavigator`.
- **Narrative/Delivery:** `BriefingTheater`, `DemoCommand`, `NarrativePlaybookStudio`, `SalesPlaybookCoach`, `ResourceHub`.
- **Lab/Practice:** `LinuxLab`, `LearnLinuxEOS`, `CloudVisionEnablement`, `KnowledgeGraph`.

## Data Architecture & Contracts

### Structured Data
Primary datasets live in `data/`:
- `initialData.ts` (global config, tiles, SE performance scaffolding)
- `linuxModules.ts`
- `protocolsContent.ts`
- `playbookData.ts`
- `switches/*.ts` + `switches.index.ts`
- `chassis/*.ts` + `chassis.index.ts`
- `datasetContract.ts` (expected model/family coverage)

Guidance: prefer aggregated indices (`switches.index.ts`, `chassis.index.ts`, etc.) over hardcoded component data.

### Data Contracts
- **Switches:** `SwitchSpec` requires key fields (e.g., id/model/series/description/interfaces; datasheet URL for field-ready SKUs).
- **Chassis:** `ChassisSpec` requires key fields (e.g., id/model/series/slots/datasheet URL).
- **Contract tests:** `tests/dataContracts.test.ts` validates dataset shape and expected models from `datasetContract`.

### Versioning
- `DATA_VERSION` in context controls rehydration when persisted schema changes.

## Theming & UX

- Theme classes: `.theme-dark` / `.theme-light` on `document.documentElement`.
- Semantic classes: `bg-page-bg`, `bg-card-bg`, `border-border`, `text-primary/secondary`, `surface-*`.
- Motion tokens/animations exist; reduced motion honors `prefers-reduced-motion`.
- Print styles normalize dark surfaces; a11y improvements should include ARIA labels on new controls.

## Build, Tooling, and Operations

### Scripts
- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run test`

### Runtime / Serving
- Multi-stage Docker build: Node build stage → NGINX runtime stage.
- `nginx.conf` handles SPA fallback (`index.html`), cache headers, and security headers.
- Cloud Run compatibility via port `8080`.

### Environment Variables
- `VITE_ADMIN_PIN` (optional): used by `AdminConsole` for PIN-gated admin access behavior.

### Operational Considerations
- Persistence is browser-local (`localStorage`) and scoped to InfraLens keys.
- Sonner toaster is global; use notification helpers for user-visible failures.
- Lazy loading + debounced writes reduce startup and interaction cost.
- No auth/session model currently; avoid sensitive customer data persistence.

## Roadmap (User-Facing, Non-AI)

- **Accounts & Sync:** auth + per-user/cloud persistence, export/import.
- **Collaboration:** shared workspaces, role permissions, comments/presence.
- **Offline-first:** cached core datasets, queued writes, sync conflict handling.
- **Data governance:** dataset versioning + change logs + admin approvals.
- **Accessibility:** keyboard/focus/contrast audits and ARIA uplift.
- **Performance polish:** route-level loading states, list virtualization, filter throttling, optimistic update + undo patterns.
- **Testing expansion:** route smoke coverage for registry entries, navigation/theme/persistence integration tests, dataset snapshot/schema checks.

## Roadmap Hooks (Future Work)

- Add auth + user storage at existing context persistence seams.
- Expand route-level tests for all `toolsRegistry` entries.
- Add lightweight, opt-in, PII-safe observability for route and AI-helper outcomes.
- Complete accessibility + mobile responsiveness audit on key field tools.

---

# Architecture Overview

This section summarizes practical architecture decisions for day-to-day contributors.

## App Architecture

- React + Vite + HashRouter.
- `toolsRegistry` defines route id, path, component, and parent relationships.
- `App.tsx` hosts provider + theme + router shell.
- Feature apps are self-contained under `components/apps/` and share primitives from `components/layout/`.
- Home experience (`BentoGrid.tsx`) is the primary catalog and navigation surface.

## Repository Structure

```text
.
├── App.tsx
├── index.tsx
├── components/
│   ├── apps/
│   └── layout/
├── config/
│   └── toolsRegistry.ts
├── context/
│   └── InfraLensContext.tsx
├── data/
│   ├── switches/
│   └── chassis/
├── services/
├── styles/
│   └── theme.css
├── tests/
├── Dockerfile
├── nginx.conf
└── package.json
```

## Contribution Workflow

1. Add/modify app logic in `components/apps/`.
2. Register routes in `config/toolsRegistry.ts`.
3. Keep domain content in `data/`; avoid hardcoding reference specs in UI components.
4. Reuse design tokens/layout primitives for consistency.
5. Validate via build/test scripts before merging.

---

# InfraLens Notes

## Identity Core (Manifesto)

Version: 4.2.0 // Codename: HUMAN_PRIMACY  
Status: Operational // Field Ready

**InfraLens** is the cognition layer for Arista Systems Engineers and Sales teams. It externalizes complexity—from silicon physics to executive outcomes—so humans decide with clarity. It is not an agent; it amplifies judgment.

### The Problem: Cognitive Entropy
The SE role continuously shifts across micro-physics (buffers, SerDes), macro strategy (ROI/TCO), and stakeholder dynamics. InfraLens functions as an external SysDB for that cognitive load.

### Operating Modes
- **Reasoning (Constraint Mapping):** AI Fabric Designer, TCO Modeler, MTTR Insurance — “Don’t guess. Calculate.”
- **Practice (Applied Skills):** EOS Linux Lab, CloudVision Field Guide, Protocol Translation — “Skill is earned through repetition.”
- **Reference (High-Fidelity Grounding):** Release Note Deconstructor, Architecture Codex — “Verification over assumption.”
- **Delivery (Narrative Projection):** Briefing Theater, Demo Command — “Sales is the transfer of confidence.”

### Mandate
In a hyper-specialized era, PolymathOS treats breadth as a competitive advantage. InfraLens is built on intersections, not silos.

### Evolution
- Phase 1: Reference intelligence (completed)
- Phase 2: Structured reasoning (in progress)
- Phase 3: Durable cognition (future)

## Strategic Definition (Roadmap Extract)

North Star: InfraLens should produce durable, defensible artifacts that move account teams from “convincing” to “proving.”

- **Capability layers:** constraint mapping, failure pre-mortems, tradeoff matrices, ADR/briefing generators, live TCO snapshots, 5 Whys/checklists, causal chain contextualization.
- **Exclusion zones:** no roleplay personas, no agentic “do-er” behavior, no decorative gimmicks, no debate bots.
- **Before vs After:** from demo novelty to proof-driven execution; from transient screenshare to durable artifacts.

## Architectural Ledger (Sample Entry)

**Entry:** 2025-05-15T18:00:00Z — FORGE_EVOLUTION_0.6  
**Objective:** Shift identity from “app store” to “sense-making system.”  
**Implementation:** Renamed catalogs (Organic, Technic, Inference, Intel), updated `AppShowcase` labels, aligned data interfaces/initial data.  
**Outcome:** Repositions PolymathOS as a cognitive laboratory with cybernetic interventions.

---

## Local Development Quickstart

### Prerequisites
- Node.js 20+
- npm

### Commands
```bash
npm ci
npm run dev
npm run build
npm run preview
npm run test
```

### Container Example
```bash
docker build -t infralens:local --build-arg VITE_ADMIN_PIN=1234 .
docker run --rm -p 8080:8080 infralens:local
```
