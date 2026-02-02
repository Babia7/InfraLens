## Contributing / Project Layout

- `components/apps/` — routed experiences (Briefing Theater, Protocols, Linux Lab, etc.).
- `components/layout/` — shared layout primitives and tiles; exported via `@layout`.
- `design/` — shared design tokens (`theme.ts`) with `@design` alias; CSS tokens live in `styles/theme.css`.
- `config/toolsRegistry.ts` — route registry; add new apps here.
- `context/InfraLensContext.tsx` — state + persistence.
- `data/` — static datasets; prefer importing via `@data`.
- `services/` — API/service helpers (e.g., gemini); import via `@services`.
- `tests/` — Vitest + Testing Library smoke tests.

Aliases (tsconfig/vite/vitest): `@`, `@components`, `@layout`, `@apps`, `@design`, `@data`, `@services`.

Scripts:
- `npm run dev` — local dev.
- `npm run build` — production bundle.
- `npm run test` — vitest smoke tests (jsdom).

Adding a new routed app:
1) Create component in `components/apps/`.
2) Add lazy entry to `config/toolsRegistry.ts`.
3) Import any shared UI via `@layout` and data via `@data`.

Styling:
- Global tokens are in `styles/theme.css`; design tokens/Tailwind theme in `design/theme.ts`. Use the aliases for consistency.
