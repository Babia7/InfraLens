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
