export const projectsEn = {
  eyebrow: '// 02 · DEPLOYED SYSTEMS & CASE STUDIES',
  title: 'Flagship Architectures',
  subtitle:
    'Production-minded platforms built end-to-end — from async Python backends and idempotent billing engines to local-first AI workspaces and offline-resilient POS.',
  flagshipBadge: 'FLAGSHIP',
  secondaryEyebrow: '// EXTENDED ARSENAL',
  secondaryTitle: 'Ecosystem & Specialized Tooling',
  secondarySubtitle:
    'Focused services, desktop companions, and multi-product SaaS infrastructure.',
  statusPublic: 'Open Source',
  statusPrivate: 'Private Monorepo',
  statusHybrid: 'Public UI · Private Core',
  statusLive: 'Live Ecosystem',
  inspectCta: 'Inspect Architecture',
  closeModal: 'Close Dossier',
  viewRepo: 'View Repository',
  viewLive: 'Open Live Panel',
  privateNotice: 'Proprietary codebase — architecture walkthrough available on request.',
  caseStudyNotice: 'Private — Case Study on Request',
  hybridNotice: 'Private Backend (Case Study on Request) · Public Frontend Repo',
  scrollHint: 'SCROLL TO CYCLE FLAGSHIPS →',
  escHint: 'ESC',
  featuresHeading: 'Key Capabilities',
  architectureHeading: 'Architecture & Engineering Notes',
  stackHeading: 'Core Stack',
  items: {
    orin: {
      name: 'Orin',
      version: 'v0.12.8 · MIT',
      tagline: 'Local-first AI agent workspace across Web, Electron & CLI on one durable engine.',
      summary:
        'Unifies a web workbench, Electron 37 desktop shell, and the `orin code` terminal over a single SQLite-backed Python 3.13 engine — orchestrating specialist agent trees across the subscriptions you already own.',
      role: 'Creator & Lead Architect',
      features: [
        'Realtime PT-BR voice companion (LIVE mode, wake word "Orin", instant barge-in interruption, SOUL.md identity, affective memory).',
        'Hierarchical team of specialist agents routed per node across Claude, Codex, and Antigravity providers.',
        'Orin Code engineering bench with live preview, file/diff inspector, integrated terminal, "Time Machine" checkpoints, and claude-agent-sdk parity.',
        'Extensible MCP server hub, plugin & skill registry, and local numpy cosine RAG index over SQLite.',
      ],
      architecture: [
        'Single durable FastAPI + SQLAlchemy 2 + SQLite core shared identically by Web UI, Electron 37 desktop, and CLI.',
        'Tree-based multi-agent runtime delegating sub-tasks across heterogeneous LLM providers with isolated tool contexts.',
        'Local cosine-similarity vector RAG with numpy and zero cloud database dependencies.',
      ],
    },
    auryly: {
      name: 'Auryly',
      version: 'Clean Architecture + DDD',
      tagline: 'Gamified AI learning platform with guided tracks, conversion funnels & Stripe billing.',
      summary:
        'End-to-end education & SaaS monorepo pairing hands-on AI learning tracks with built-in growth infrastructure: lead capture, choice pages, public/admin sales funnels, and an exportable design system.',
      role: 'Full-Stack Architect',
      features: [
        'Strict Clean Architecture / DDD backend in async Python 3.12 (FastAPI, SQLAlchemy 2 + asyncpg, Redis 7, ARQ background workers).',
        'Stripe checkout & subscription lifecycle, Argon2id + PyJWT auth, Web Push notifications, and MCP integrations.',
        'Embedded DuckDB + PyArrow analytical pipelines and S3-compatible object storage via Garage.',
        'Automated Caddy TLS deployment on Docker Compose with pytest + testcontainers, MSW, Vitest, ruff, mypy, and import-linter gates.',
      ],
      architecture: [
        'import-linter enforced Domain, Application, Infrastructure, and Presentation boundaries inside a uv + pnpm workspace monorepo.',
        'Async event & job processing via Redis 7 + ARQ workers paired with DuckDB + PyArrow analytics.',
        'Self-hosted Docker Compose topology behind Caddy auto-TLS with PostgreSQL 16 and Garage S3 storage.',
      ],
    },
    marketfy: {
      name: 'Marketfy (SGM)',
      version: 'Multi-Tenant SaaS + POS',
      tagline: 'Offline-first grocery management, NFC-e fiscal invoicing & realtime Pix POS.',
      summary:
        'Commercial multi-tenant SaaS engineered for real-world retail reliability — keeping checkout registers running without internet while automating Brazilian fiscal compliance and payment reconciliation.',
      role: 'Full-Stack SaaS Engineer',
      features: [
        'Offline-first POS powered by IndexedDB/Dexie with resilient background synchronization, inventory control, and customer credit ledger.',
        'Automated NFC-e fiscal invoicing via dedicated Neectify Fiscal service with per-product tax rules and approval workflows.',
        'In-store dynamic Mercado Pago Pix QR codes with realtime SSE settlement status, webhook reconciliation, and anomaly detection.',
        'Role-based multi-user access (admin, owner, manager, accountant, cashier), XLSX/PDF financial reports, and sandboxed-iframe A/B sales funnels with UTM & cohort analytics.',
      ],
      architecture: [
        'Outbox-style IndexedDB/Dexie local queue syncing POS transactions cleanly once connectivity resumes.',
        'Realtime Server-Sent Events (SSE) bridge streaming Mercado Pago Pix webhook settlements straight to the active register.',
        'Dedicated fiscal microservice integration validating NCM/CFOP product tax rules prior to NFC-e emission.',
      ],
    },
    billingCore: {
      name: 'Billing Core',
      version: 'FastAPI Microservice',
      tagline: 'Idempotent recurring billing engine powering multiple SaaS products.',
      summary:
        'Production-oriented billing backbone for the Neectify ecosystem handling subscriptions, payment gateway webhooks, rate limiting, structured logs, readiness probes, and traceable async jobs.',
      role: 'Backend Systems Engineer',
      features: [
        'Strict idempotency keys and signature-verified webhook intake.',
        'Per-job correlation tracing, structured logging, readiness checks, and deployment runbooks.',
      ],
      architecture: [
        'Multi-product tenant isolation with deterministic idempotency guarantees across retries and webhook replays.',
        'Structured observability via correlation IDs propagated from HTTP ingress through async background jobs.',
      ],
    },
    ashy: {
      name: 'Ashy',
      version: 'Desktop · Zero Telemetry',
      tagline: 'Local-first virtual companion with Live2D Cubism 4, omni voice & encrypted memory.',
      summary:
        'Privacy-first TypeScript desktop companion combining realtime LFM3-Omni voice with lip-sync, a persistent 4-tier affective state model, and FSRS-6 spaced-memory recall over SQLite + FTS5.',
      role: 'Creator & Desktop Engineer',
      features: [
        'AES-256-GCM local encryption with zero external telemetry and Playwright E2E coverage.',
        'Live2D Cubism 4 stage synchronized to realtime voice synthesis.',
      ],
      architecture: [
        'Local SQLite + FTS5 full-text memory ranked with FSRS-6 spaced-retention scheduling.',
        'Envelope encryption using AES-256-GCM on disk with zero outbound telemetry.',
      ],
    },
    neectify: {
      name: 'Neectify & Engify',
      version: 'SaaS Ecosystem',
      tagline: 'Unified SaaS control plane on React 19 + Engify operational suite.',
      summary:
        'Ecosystem hub at painel.neectify.com built with React 19, TypeScript, MSW, Playwright, and oxlint on Vercel — paired with Engify (Python backend + Radix, TanStack Query & dnd-kit workspace).',
      role: 'Full-Stack Engineer',
      features: [
        'React 19 + TypeScript control panel tested end-to-end with MSW and Playwright.',
        'Engify workflow interface featuring drag-and-drop boards (dnd-kit), Radix primitives, and Python APIs.',
      ],
      architecture: [
        'Contract-tested SPA workflow backed by Mock Service Worker (MSW) fixtures and Playwright suites.',
        'Accessible Radix UI + TanStack Query state synchronization across operational kanban views.',
      ],
    },
    agentDesk: {
      name: 'AgentDesk',
      version: 'Windows Local-First',
      tagline: 'Desktop studio for building and governing local AI agents with approval gates.',
      summary:
        'Windows Electron + FastAPI desktop environment orchestrating Ollama and OpenRouter models with MCP stdio tools, human-in-the-loop approval gates, and immutable SQLite audit logs.',
      role: 'Creator & Full-Stack Engineer',
      features: [
        'Granular tool-execution approval gates and local SQLite audit trails.',
        'Seamless switching between local Ollama models and cloud OpenRouter endpoints via MCP stdio.',
      ],
      architecture: [
        'Policy-gated MCP stdio execution intercepting sensitive tool calls before side effects occur.',
        'Append-only SQLite audit log recording prompts, tool payloads, and operator approvals.',
      ],
    },
  },
};
