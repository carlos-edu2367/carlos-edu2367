import { PROFILE } from '../config/profile';
import type { Dictionary } from '../i18n/en';

export type ProjectI18nKey = keyof Dictionary['projects']['items'];

export type ProjectStatus = 'public' | 'private' | 'hybrid' | 'live';

export interface ProjectItem {
  id: string;
  i18nKey: ProjectI18nKey;
  flagship: boolean;
  status: ProjectStatus;
  isPrivate: boolean;
  link?: string;
  accentColor: string;
  stack: string[];
}

export const PROJECTS: ProjectItem[] = [
  {
    id: 'orin',
    i18nKey: 'orin',
    flagship: true,
    status: 'public',
    isPrivate: false,
    link: PROFILE.projectLinks.orin,
    accentColor: '#ff1f3d',
    stack: [
      'Python 3.13',
      'FastAPI',
      'SQLAlchemy 2',
      'Alembic',
      'SQLite',
      'Pydantic',
      'React 19',
      'TypeScript',
      'Vite 8',
      'Tailwind CSS',
      'React Three Fiber',
      'Motion',
      'Electron 37',
      'MCP',
      'Playwright',
      'Vitest',
    ],
  },
  {
    id: 'auryly',
    i18nKey: 'auryly',
    flagship: true,
    status: 'private',
    isPrivate: true,
    accentColor: '#ff4d6d',
    stack: [
      'Python 3.12',
      'FastAPI',
      'SQLAlchemy 2 Async',
      'PostgreSQL 16',
      'Redis 7',
      'ARQ',
      'Stripe',
      'DuckDB + PyArrow',
      'React 19',
      'TypeScript',
      'Tailwind CSS 4',
      'TanStack Query',
      'Lingui i18n',
      'CodeMirror',
      'Docker Compose',
      'Caddy',
      'pytest + testcontainers',
    ],
  },
  {
    id: 'marketfy',
    i18nKey: 'marketfy',
    flagship: true,
    status: 'hybrid',
    isPrivate: false,
    link: PROFILE.projectLinks.marketfyFrontend,
    accentColor: '#e11d48',
    stack: [
      'FastAPI',
      'SQLAlchemy Async',
      'asyncpg',
      'Redis',
      'ARQ',
      'Mercado Pago Pix + SSE',
      'NFC-e Fiscal',
      'React 18',
      'Vite',
      'Tailwind CSS',
      'IndexedDB / Dexie',
      'Zod',
      'Recharts',
      'Leaflet',
      'S3 (boto3)',
      'fpdf2 + pandas',
    ],
  },
  {
    id: 'billing-core',
    i18nKey: 'billingCore',
    flagship: false,
    status: 'public',
    isPrivate: false,
    link: PROFILE.projectLinks.billingCore,
    accentColor: '#be123c',
    stack: [
      'FastAPI',
      'Python',
      'Subscriptions',
      'Webhooks',
      'Idempotency',
      'Async Jobs',
      'Rate Limiting',
      'Structured Logs',
    ],
  },
  {
    id: 'ashy',
    i18nKey: 'ashy',
    flagship: false,
    status: 'public',
    isPrivate: false,
    link: PROFILE.projectLinks.ashy,
    accentColor: '#f43f5e',
    stack: [
      'TypeScript',
      'Live2D Cubism 4',
      'LFM3-Omni Voice',
      'SQLite + FTS5',
      'FSRS-6',
      'AES-256-GCM',
      'Playwright E2E',
    ],
  },
  {
    id: 'neectify',
    i18nKey: 'neectify',
    flagship: false,
    status: 'live',
    isPrivate: false,
    link: PROFILE.projectLinks.neectify,
    accentColor: '#9f1239',
    stack: [
      'React 19',
      'TypeScript',
      'Python',
      'TanStack Query',
      'Radix UI',
      'dnd-kit',
      'MSW',
      'Playwright',
      'Vercel',
    ],
  },
  {
    id: 'agent-desk',
    i18nKey: 'agentDesk',
    flagship: false,
    status: 'public',
    isPrivate: false,
    link: PROFILE.projectLinks.agentDesk,
    accentColor: '#ff1f3d',
    stack: [
      'FastAPI',
      'SQLite',
      'React',
      'Electron',
      'Ollama',
      'OpenRouter',
      'MCP stdio',
      'Audit Logs',
    ],
  },
];

export const FLAGSHIP_PROJECTS = PROJECTS.filter((p) => p.flagship);
export const SECONDARY_PROJECTS = PROJECTS.filter((p) => !p.flagship);
