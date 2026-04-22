InfraLens

InfraLens is a React + TypeScript web platform for Arista-facing systems engineering and technical architecture workflows.

It combines:
	•	architecture design tools
	•	infrastructure datasets
	•	financial and operational calculators
	•	learning labs
	•	narrative delivery tooling

into a single interface.

The goal is to externalize infrastructure reasoning so account teams can move from intuition to defensible architectural decisions.

⸻

Deployment

InfraLens is deployed as a containerized static web application.
	•	Platform: Google Cloud Run
	•	Domain: polymathsystem.com
	•	Runtime: NGINX serving the built Vite application
	•	Port: 8080

Authentication (Firebase)

InfraLens supports optional Firebase Authentication with Google sign-in.

To enable auth, provide the following environment variables at build/runtime:
	•	VITE_ENABLE_AUTH=true
	•	VITE_ALLOWED_GOOGLE_EMAILS (optional, comma-separated allowlist)
	•	VITE_FIREBASE_API_KEY
	•	VITE_FIREBASE_AUTH_DOMAIN
	•	VITE_FIREBASE_PROJECT_ID
	•	VITE_FIREBASE_APP_ID
	•	VITE_FIREBASE_STORAGE_BUCKET (optional)
	•	VITE_FIREBASE_MESSAGING_SENDER_ID (optional)

If `VITE_ENABLE_AUTH` is not set to `true`, InfraLens runs without auth gating.
If `VITE_ALLOWED_GOOGLE_EMAILS` is set (example: `tinurajan1@gmail.com`), only those Google accounts are permitted in-app.

For Firebase project bootstrap (Auth, Firestore rules/indexes, Storage rules, and emulators), use:

docs/firebase-setup.md

For Cloud Run Identity-Aware Proxy setup with Google OAuth, use:

docs/gcp-iap-setup.md

App PIN lock (mandatory)

InfraLens now always shows a PIN gate before app access.
The required PIN is `19901991`.

This repository contains the application source and container build definition used for that deployment.

⸻

Tech Stack

Frontend
	•	React 19
	•	TypeScript
	•	React Router

Build / Tooling
	•	Vite
	•	Vitest
	•	Testing Library
	•	jsdom

UI
	•	custom CSS theme tokens
	•	shared layout primitives
	•	lucide-react icons
	•	Sonner toast notifications

⸻

Repository Structure

.
├── App.tsx                     # Application shell and routing
├── index.tsx                   # React entrypoint
├── components/
│   ├── apps/                   # Feature applications and calculators
│   └── layout/                 # Shared layout primitives
├── config/
│   └── toolsRegistry.ts        # Canonical route registry
├── context/
│   └── InfraLensContext.tsx    # Global state, persistence, hydration
├── data/                       # Structured datasets and seed content
│   ├── switches/
│   └── chassis/
├── services/                   # Utilities (notifications, parsing, etc.)
├── styles/
│   └── theme.css               # Design tokens and utility classes
├── tests/                      # Vitest suites including dataset contracts
├── Dockerfile                  # Container build definition
├── nginx.conf                  # Static SPA hosting configuration
└── package.json


⸻

System Architecture

InfraLens is structured as a client-side micro-application platform.

Each tool runs as a routed React application within a shared shell.

Browser
   │
React App Shell
   │
toolsRegistry (route definitions)
   │
Feature Apps
   │
Shared Context + Data

Core principles
	•	Route-driven app composition
	•	Shared global state
	•	Data-driven UI tools
	•	Lazy-loaded feature modules

⸻

Application Architecture

Routing

Routes are defined in:

config/toolsRegistry.ts

Each SectionType maps to
	•	URL path
	•	lazy-loaded component
	•	optional parent relationship
	•	optional audience metadata

Routing uses HashRouter to keep navigation resilient for static hosting and deep links.

App.tsx mounts the router and renders all registered tools.

⸻

App Composition

App.tsx provides the main application shell.

Responsibilities include
	•	mounting InfraLensProvider
	•	rendering the global header and theme toggle
	•	registering the router
	•	mounting global toast notifications
	•	rendering feature apps

The home surface (BentoGrid) acts as the primary navigation entrypoint.

⸻

State and Persistence

Global state is centralized in:

context/InfraLensContext.tsx

Features
	•	initializes data from data/initialData.ts
	•	persists state to localStorage
	•	supports version-aware hydration via DATA_VERSION
	•	debounces persistence writes

Feature apps should always use context setters rather than writing directly to localStorage.

⸻

Data Architecture

InfraLens tools are data-driven.

Structured datasets live under /data.

Examples include

data/
  initialData.ts
  linuxModules.ts
  protocolsContent.ts
  playbookData.ts
  switches/
  chassis/

Switch and Chassis Data

Switch and chassis specifications are defined as structured TypeScript objects.

switches/*.ts
switches.index.ts
chassis/*.ts
chassis.index.ts

UI tools such as switch selectors import these datasets rather than hardcoding specifications.

⸻

Dataset Contracts

Dataset integrity is enforced by contract tests.

tests/dataContracts.test.ts

Contracts validate required fields such as:

SwitchSpec
	•	id
	•	model
	•	series
	•	description
	•	interface definitions
	•	datasheetUrl

ChassisSpec
	•	id
	•	model
	•	series
	•	slotsTotal
	•	datasheetUrl

Expected model coverage is defined in:

data/datasetContract.ts

These tests prevent accidental dataset regressions.

⸻

Design System

Theme tokens live in:

styles/theme.css
design/theme.ts

Themes are applied via:

.theme-dark
.theme-light

on document.documentElement.

Key tokens include
	•	--page-bg
	•	--card-bg
	•	--border-color
	•	--text-primary
	•	--text-secondary

Components should use semantic utility classes such as

bg-page-bg
bg-card-bg
border-border
text-primary

instead of hardcoded colors.

Shared layout primitives are located in:

components/layout/

Examples
	•	HeroTile
	•	ContentTiles
	•	TileSystem

⸻

Feature Domains

InfraLens tools fall into several domains.

Reference
	•	App catalog
	•	Codex / bookshelf
	•	visual essays
	•	roadmap surfaces

Financial / Business Modeling
	•	TCO calculator
	•	operational velocity model
	•	MTTR insurance model
	•	talent ROI analysis
	•	why-now framing

Architecture Design
	•	AI fabric designer
	•	storage architecture planner
	•	switch selectors
	•	protocol modeling tools

Enablement and Practice
	•	Linux / EOS labs
	•	CloudVision enablement
	•	troubleshooting scenarios

Narrative Delivery
	•	Briefing Theater
	•	Demo Command
	•	playbook coaching

⸻

Development

Prerequisites

Node.js 20+
npm

Install

npm ci

Run Development Server

npm run dev

Build Production Assets

npm run build

Preview Production Build

npm run preview

Run Tests

npm run test


⸻

Environment Variables

Optional environment variable

VITE_ADMIN_PIN

Used by the AdminConsole for PIN-gated access behavior.

During container builds the value is passed via Docker build arguments.

⸻

Container Deployment

The Docker image uses a multi-stage build.

Stage 1

Build static assets with Node.

Stage 2

Serve compiled assets via NGINX.

NGINX configuration
	•	listens on port 8080
	•	routes unknown paths to index.html
	•	applies security headers
	•	caches static assets

Example container commands

docker build -t infralens:local --build-arg VITE_ADMIN_PIN=1234 .
docker run --rm -p 8080:8080 infralens:local


⸻

Operational Considerations

Persistence
	•	all state stored in localStorage
	•	reset operations remove only InfraLens keys

Error Handling
	•	Sonner toaster provides user feedback
	•	utilities in services/notifications

Performance
	•	feature apps lazy-loaded
	•	persistence writes debounced
	•	large datasets statically bundled

Security
	•	no authentication model yet
	•	avoid storing sensitive customer data

⸻

Contribution Guidelines

When adding a new tool
	1.	create the feature inside components/apps
	2.	register the route in config/toolsRegistry.ts
	3.	use shared design tokens from styles/theme.css
	4.	keep domain data inside /data
	5.	add tests for any new datasets

⸻

Roadmap

Future development areas include

Accounts & Sync
	•	user authentication
	•	per-user persistence
	•	export/import for air-gapped users

Collaboration
	•	shared workspaces
	•	role-based access
	•	roadmap commenting

Offline Mode
	•	dataset caching
	•	queued writes

Data Governance
	•	versioned infrastructure datasets
	•	change logs
	•	admin approval workflows

Testing
	•	route-level smoke tests
	•	dataset snapshot validation
	•	persistence cycle tests

Accessibility
	•	keyboard navigation
	•	focus states
	•	improved color contrast

⸻

InfraLens Identity

Version 4.2.0 — Codename HUMAN_PRIMACY

InfraLens is a cognition layer for infrastructure engineering.

It externalizes complexity across:
	•	silicon physics
	•	network architecture
	•	operational economics
	•	human decision making

so engineers can reason clearly.

It is not an agent.
It is a system for amplifying judgment.

⸻

Operating Modes

Reasoning
Constraint mapping, architecture modeling, financial analysis.

Practice
Linux/EOS labs and CloudVision workflows.

Reference
Architecture codex and technical datasets.

Delivery
Briefing Theater and Demo Command.

⸻

Strategic Direction

InfraLens aims to produce durable engineering artifacts that move infrastructure conversations from persuasion to proof.

Key capability layers include
	•	constraint mapping
	•	failure pre-mortems
	•	tradeoff matrices
	•	architecture decision records
	•	causal chain analysis

⸻

Architectural Ledger (Example)

Entry: 2025-05-15 — FORGE_EVOLUTION_0.6

Objective
Shift InfraLens from an “app catalog” to a sense-making system.

Implementation
	•	renamed catalogs
	•	aligned data models
	•	updated UI taxonomy

Outcome

InfraLens now behaves as a cognitive laboratory for infrastructure reasoning rather than a simple tool collection.
