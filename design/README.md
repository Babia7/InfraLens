## Design Layer

Shared tokens and primitives for reuse across apps/micro-apps.

- `theme.ts` — color/font/animation tokens and a Tailwind theme object for reuse beyond the CDN setup.
- `index.ts` — barrel export for design tokens.
- `@design` alias — configured in `tsconfig.json`, `vite.config.ts`, and `vitest.config.ts` for consistent imports.

Usage:
- CSS tokens live in `styles/theme.css` (imported in `index.tsx`). If you move off the Tailwind CDN, wire `theme.ts` into your Tailwind config.
- Import tokens via `import { themeTokens, tailwindTheme } from '@design';`.
- For layout primitives, keep exporting via `@layout` barrels; if you add more shared UI, consider a `@design/layout` barrel.
