import type { Dictionary } from '../i18n/en';

export type StackCategoryKey = keyof Dictionary['stack']['categories'];

export interface StackCategory {
  id: StackCategoryKey;
  accentColor: string;
  items: string[];
}

export const STACK_CATEGORIES: StackCategory[] = [
  {
    id: 'languages',
    accentColor: '#ff1f3d',
    items: ['Python', 'TypeScript', 'JavaScript', 'SQL', 'Java (Academic)', 'HTML / CSS'],
  },
  {
    id: 'backend',
    accentColor: '#ff4d6d',
    items: [
      'FastAPI',
      'Pydantic v2',
      'SQLAlchemy 2 (Async)',
      'asyncpg',
      'Alembic',
      'Redis',
      'ARQ',
      'structlog',
      'Argon2 / JWT',
      'Stripe',
      'Mercado Pago',
      'SSE',
      'Webhooks',
      'MCP',
    ],
  },
  {
    id: 'frontend',
    accentColor: '#e11d48',
    items: [
      'React 19',
      'TypeScript',
      'Vite',
      'Tailwind CSS 4',
      'Motion',
      'React Three Fiber / Three.js',
      'TanStack Query',
      'React Router 7',
      'Lingui',
      'Radix UI',
      'Zod',
      'react-hook-form',
    ],
  },
  {
    id: 'desktopAi',
    accentColor: '#ff1f3d',
    items: [
      'Electron',
      'Local-First SQLite',
      'Ollama',
      'OpenRouter',
      'Claude / Codex / Gemini Agents',
      'Local RAG',
      'Realtime Voice',
    ],
  },
  {
    id: 'data',
    accentColor: '#be123c',
    items: [
      'PostgreSQL 16',
      'SQLite (+FTS5)',
      'Redis 7',
      'DuckDB',
      'IndexedDB / Dexie',
      'S3-Compatible Storage',
    ],
  },
  {
    id: 'devops',
    accentColor: '#9f1239',
    items: [
      'Docker',
      'Docker Compose',
      'Caddy',
      'Linux VPS',
      'GitHub Actions',
      'Vercel',
      'uv',
      'pnpm',
      'just',
    ],
  },
  {
    id: 'quality',
    accentColor: '#f43f5e',
    items: [
      'pytest + testcontainers',
      'Vitest',
      'Testing Library',
      'Playwright',
      'MSW',
      'ruff',
      'mypy',
      'import-linter',
      'ESLint',
      'Prettier',
    ],
  },
];
