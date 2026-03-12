# InfraLens Technical Design Doc

## Purpose & Scope
- **Goal:** Deliver a cognition layer for Arista Systems Engineers and Sales teams (Account Managers, pre-sales SEs) that unifies calculators, design blueprints, and narrative tooling in a single client experience.
- **Audience:** Frontend contributors extending tools and data owners curating domain datasets.
- **Out of scope (current build):** Auth, multi-user sync, backend persistence, and PII storage. Everything runs client-side.

## System Overview
- **Runtime:** React 19 + Vite + HashRouter; lazy routes defined in `config/toolsRegistry.ts` keyed by `SectionType`.
- **Composition:** `App.tsx` wraps the tree with `InfraLensProvider`, sets the theme class, and renders a sticky header + routed micro-apps via `RouteView` (injects `onNavigate`/`onBack` props).
- **Data backbone:** `InfraLensContext` exposes shared registries (apps, books, concepts, roadmap, SE performance, suggestions) and `config`. State is initialized from `data/initialData.ts` and persisted to `localStorage` with a `DATA_VERSION` guard.
- **Design layer:** Tokens live in `styles/theme.css` and `design/theme.ts`; shared layout primitives live in `components/layout`. Utility classes mimic Tailwind semantics without a build-time Tailwind pipeline.
## Core Modules
- **Shell & Navigation**
  - `App.tsx` header: theme toggle (persisted to `localStorage`), sticky top bar.
  - `toolsRegistry`: canonical map of `SectionType` → path → lazy component + optional parent/audience metadata.
  - `BentoGrid` home surface highlights hero tiles and deep-links into catalogs (Forge, Codex, Nexus, Roadmap, SE Performance, Briefing/Demo/Protocols).
- **State & Persistence**
  - `InfraLensContext`: versioned localStorage hydration via `loadState`, debounced writes (1s) for all registries/config, safe reset that clears only InfraLens keys and reloads.
  - New apps should prefer context setters to keep persistence consistent; avoid direct `localStorage` access.
- **Catalogs & Reference Surfaces**
  - `AppShowcase` (apps), `BookShelf` (codex), `VisualEssays` (concepts), `RoadmapRequests` (pipeline), `SEPerformanceGuide` (SE metrics). Each consumes context data and surfaces filters/details.
  - Data contracts enforced via `tests/dataContracts.test.ts` for switches/chassis/dataset coverage.
- **Reasoning/Builder Apps (selected)**
  - Financial/ROI: `TCOCalculator`, `OperationalVelocityModeler`, `MTTRDowntimeInsurance`, `UnifiedOSTalentROI`, `WhyNowEngineApp`.
  - Architecture: `AIClusterFabricDesigner`, `StorageFabricPlanner`, `SwitchSelector7050/7280`, `AVDStudio`, `LifeSciencesArchitect`, `VerticalMatrix`, `ProtocolsApp`, `ProtocolCollisionMapper`, `ValidatedDesignNavigator`.
  - Narrative/Delivery: `BriefingTheater`, `DemoCommand`, `NarrativePlaybookStudio`, `SalesPlaybookCoach`, `ResourceHub`.
  - Lab/Practice: `LinuxLab`, `LearnLinuxEOS`, `CloudVisionEnablement`, `KnowledgeGraph`.
## Data & Contracts
- **Static seeds:** `data/initialData.ts` seeds all registries plus `GlobalConfig.tiles`. Additional domain datasets: `linuxModules.ts`, `protocolsContent.ts`, `playbookData.ts`, `switches/*.ts` + `switches.index.ts`, `chassis/*.ts` + `chassis.index.ts`, `datasetContract.ts` (expected SKUs), optics/lifescience seeds, briefing/demo/feynman/gap-analysis seeds.
- **Contracts & tests:** `tests/dataContracts.test.ts` validates presence of required fields and expected models for switches/chassis against `datasetContract`. This guards against accidental data loss when editing datasets.
- **Versioning:** `DATA_VERSION` in `InfraLensContext` forces fresh hydration when schemas change; update when changing persisted shape.

## Theming & UX
- **Theme tokens:** CSS custom properties for page/card/bg/border/text surfaces; `.theme-dark` / `.theme-light` toggled on `<html>` by `App.tsx`.
- **Utility shims:** Classes like `bg-page-bg`, `bg-card-bg`, `border-border`, `text-primary/secondary` keep legacy tiles compatible with both themes.
- **Motion/feel:** Custom animations (float, breathe, slow spin) defined in CSS/tokens; motion reduced under `prefers-reduced-motion`.
- **Print & access:** Print styles neutralize dark backgrounds; scrollbar styling for desktop. No explicit a11y layer—apps should add ARIA labels for new controls.

## Build, Config, and Tooling
- **Scripts:** `npm run dev`, `npm run build`, `npm run preview`, `npm test`.
- **Config:** `vite.config.ts` defines aliases (`@`, `@components`, `@apps`, `@data`, `@services`, `@design`). Dev server defaults to `localhost:3000`.
- **Testing:** Vitest + Testing Library (`setupTests.ts`, jsdom). Current coverage focuses on data contracts; add component-level smoke tests for new apps.
- **Entry:** `index.tsx` mounts `App` and imports `styles/theme.css`. Hash routing avoids server config for deep links.

## Operational Considerations
- **Persistence:** All state is localStorage-scoped; clearing site data resets to seeds. `resetToDefaults` removes only InfraLens keys to avoid nuking unrelated host data.
- **Error handling:** Sonner toaster is mounted globally; use `notifyError/notifySuccess` from `@services/notifications` for AI failures, persistence issues, or user actions. AI helpers throw on missing/invalid responses; `safeParseJSON` surfaces parse errors via toast and logs.
- **Performance:** Lazy-load all apps; debounce persistence writes; heavy datasets (switch specs) are static imports bundled by Vite.
- **Security:** No auth/session model yet—avoid storing sensitive customer data.

## Roadmap (User-Facing, Non-AI)
- **Accounts & Sync:** Add auth + per-user/cloud persistence for catalogs, SE performance notes, and roadmap votes; support export/import for air-gapped users.
- **Collaboration:** Shared workspaces with role-based permissions (viewer/editor), comment threads on roadmap items, and lightweight presence indicators.
- **Offline-first:** Cache core datasets and last-opened tools for travel mode; graceful queuing of writes and conflict resolution when back online.
- **Data governance:** Version switches/chassis/protocol datasets with change logs; add admin UI to approve edits before they reach field users.
- **Accessibility:** Audit keyboard navigation, focus states, and contrast; add ARIA labels to custom controls in planners and selectors.
- **Performance/UI polish:** 
  - Instrument route-level loading/skeletons tied to `React.Suspense` boundaries per tool to avoid blank frames while lazy chunks load.
  - Virtualize large lists/grids (catalogs, Roadmap, BookShelf) and throttle expensive filters/search to reduce jank on lower-end devices.
  - Provide optimistic updates with undo for destructive operations (`resetToDefaults`, suggestion deny/delete) using a short rollback window and toast affordances.
- **Testing expansion:** 
  - Component smoke tests per `toolsRegistry` entry to ensure each lazy route mounts without runtime errors (mock `InfraLensContext` + `HashRouter`).
  - Integration tests for navigation (fallback redirects, legacy `/system` redirect), theme toggle persistence, and context persistence cycles (edit → debounce → reload).
  - Data integrity: snapshot guards on key datasets (`switches.index`, `chassis.index`, `protocolsContent`, `initialData`) plus schema validations for any new collections.
  - Stubs: when external services are not central, provide local fallbacks and assert UI handles loading/error states gracefully.
  - Implemented: base metadata guard on `toolsRegistry` and persistence debounce test; extend with route-level smoke tests and dataset snapshots next.

## Roadmap Hooks (future work)
- Add auth + per-user storage (see `InfraLensContext` persistence seams) for shared workspaces.
- Expand test coverage: AI stub responses, routing smoke tests for each `toolsRegistry` entry, and regression tests for persistence/load.
- Observability: add lightweight event logging for AI call success/fail and route engagement; ensure opt-in and PII safe.
- Accessibility & mobile: audit keyboard focus states, contrast, and layout responsiveness across key apps (e.g., TCO, Fabric/Storage planners).

- 

# Architecture Overview

This document explains how InfraLens is structured: routing/composition, data sources, and design system.

## App Architecture
- React + Vite + HashRouter. Routes are defined in `config/toolsRegistry.ts`, keyed by `SectionType`. Each entry lazy-loads a component and defines path/parent relationships.
- `App.tsx` wraps everything in `InfraLensProvider` for shared config/state and applies the current theme. The router renders a `RouteView` that injects `onNavigate` / `onBack` helpers into each app.
- Feature apps (e.g., `components/apps/NarrativePlaybookStudio.tsx`, `LearnLinuxEOS.tsx`, `ProtocolsApp.tsx`) are self-contained but share layout primitives from `components/layout/`.
- Home (`BentoGrid.tsx`) is the primary showcase: hero + quick starts + featured tiles + catalog entry points.
- Tests: Vitest + Testing Library (`tests/*.tsx`), with `setupTests.ts` configuring the environment.

## Data Architecture
- Primary structured data lives under `data/`:
  - `initialData.ts`: global config, tiles, SE performance steps.
  - `linuxModules.ts`: canonical Linux training modules; consumed by Learn Linux and Linux Lab.
  - `protocolsContent.ts`: Protocol Translation Lab source of truth for VXLAN/EVPN/Multicast/MLAG/Linux.
  - `playbookData.ts`: Narrative Playbook Studio branching scripts.
  - `switches/*.ts` with `switches.index.ts`: switch specs (7050/7060/7280/7800) consumed by switch selector apps. Cards render model/ports/speeds/buffer/power from `SwitchSpec`, and datasheet links come from `datasheetUrl`—no hardcoded specs in components.
  - `chassis/*.ts` with `chassis.index.ts`: chassis data.
- UI components should not hardcode specs; import from these data files (e.g., switch selectors now read from `switches.index.ts`).
- Dataset contract in `data/datasetContract.ts` documents expected switch families/models and source documents.

### Data Contracts
- Switches: `SwitchSpec` requires `id`, `model`, `series`, `description`, at least one `interface`, and a `datasheetUrl` for field-ready SKUs. Validated by `tests/dataContracts.test.ts`.
- Chassis: `ChassisSpec` requires `id`, `model`, `series`, `slotsTotal`, and `datasheetUrl`.
- Contract expectations: `datasetContract` lists expected models per family and is enforced in `tests/dataContracts.test.ts`.
- Guidance: prefer consuming aggregated indices (`switches.index.ts`, `chassis.index.ts`, `protocolsContent.ts`, `linuxModules.ts`) instead of per-file imports to keep UIs data-driven and consistent.

## Design System
- Theme tokens live in `styles/theme.css` and `design/theme.ts`, applied via `.theme-dark` / `.theme-light` on `document.documentElement`.
  - Key tokens: `--page-bg`, `--card-bg`, `--border-color`, `--text-primary/secondary`, surface tokens, accent colors, and shared shadows.
  - Components should use semantic classes (`bg-page-bg`, `bg-card-bg`, `border-border`, `.surface-*`) instead of hardcoded dark colors for better light/dark parity.
- Shared layout primitives live in `components/layout/` (`HeroTile`, `ContentTiles`, `TileSystem`); prefer reusing these to keep consistent spacing and visual language.

## Routing & Navigation
- `SectionType` enum (`types.ts`) is the canonical list of route identifiers. `toolsRegistry` maps each to a `path` and component.
- `onNavigate`/`onBack` props are provided to all apps; avoid direct `window.location` usage.
- Theme toggle sits in the header within `App.tsx` and respects OS preference on first load (persisted to `localStorage`).

## Build/Test
- Scripts: `npm run build`, `npm run dev`, `npm run test`.
- Any new data-driven UI should include a minimal smoke test to ensure imports render without runtime errors.


# InfraLens Notes

## Identity Core (Manifesto)
Version: 4.2.0 // Codename: HUMAN_PRIMACY  
Status: Operational // Field Ready

**InfraLens** is the Cognition Layer for Arista Systems Engineers and Sales teams (Account Managers, pre-sales SEs). It externalizes complexity—spanning silicon physics to executive outcomes—so humans can decide with clarity. It is not an agent; it amplifies judgment.

### The Problem: Cognitive Entropy
The SE must oscillate between micro-physics (buffers, SerDes), macro-strategy (ROI, TCO), and human dynamics (stakeholder anxiety). Holding all of this in memory creates entropy; InfraLens acts as an external SysDB.

### Operating Modes
- **Reasoning (Constraint Mapping):** AI Fabric Designer, TCO Modeler, MTTR Insurance. Logic: “Don’t guess. Calculate.”
- **Practice (Applied Skills):** EOS Linux Lab, CloudVision Field Guide, Protocol Translation. Logic: “Skill is earned through repetition.”
- **Reference (High-Fidelity Grounding):** Release Note Deconstructor, Architecture Codex. Logic: “Verification over Assumption.”
- **Delivery (Narrative Projection):** Briefing Theater, Demo Command. Logic: “Sales is the transfer of confidence.”

### Mandate
In an era of hyper-specialization, We at PolymathOS as a collective choose breadth as a competitive advantage. InfraLens is built on the belief that the most interesting solutions occur at the intersection of disparate fields.

### Evolution
- Phase 1: Reference intelligence (guides, calculators, summarization) — completed.
- Phase 2: Structured reasoning (failure pre-mortem, constraint topology, ASIC pipeline X-ray) — in progress.
- Phase 3: Durable cognition (SCIF/air-gap, field vision scanning, guided RCA) — future.

## Strategic Definition (Roadmap Extract)
North Star: InfraLens is a cognition layer for infrastructure—producing durable, defensible artifacts that move account teams from “convincing” to “proving.”

- **Capability Layers:** constraint mapping, failure pre-mortem, tradeoff matrices; ADR/briefing memo generators; live TCO snapshots; 5 Whys/checklists; causal chain and metric contextualizers.
- **Exclusion Zones:** no AI roleplay/personas; no agentic “do-er” behaviors; no decorative gimmicks; no debate bots.
- **Before vs After:** from demo novelty to rigor and proof; from transient screen-share to durable artifacts.

## Architectural Ledger (Sample Entry)
**Entry:** 2025-05-15T18:00:00Z — FORGE_EVOLUTION_0.6  
**Objective:** Shift identity from “app store” to “sense-making system.”  
**Implementation:** Renamed catalogs (Organic, Technic, Inference, Intel); updated `AppShowcase` UI labels; aligned data interfaces/initial data.  
**Outcome:** Positions PolymathOS as a cognitive laboratory with “cybernetic interventions,” not just apps.


