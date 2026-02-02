# InfraLens Technical Design

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
