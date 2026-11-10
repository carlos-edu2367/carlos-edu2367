import type { projectsEn } from './projects.en';

export const projectsPtBR: typeof projectsEn = {
  eyebrow: '// 02 · SISTEMAS EM PRODUÇÃO & ESTUDOS DE CASO',
  title: 'Arquiteturas Flagship',
  subtitle:
    'Plataformas construídas ponta a ponta — de backends assíncronos em Python e motores de cobrança idempotentes a workspaces local-first de IA e PDV offline-first.',
  flagshipBadge: 'FLAGSHIP',
  secondaryEyebrow: '// ARSENAL EXPANDIDO',
  secondaryTitle: 'Ecossistema & Ferramentas Especializadas',
  secondarySubtitle:
    'Serviços dedicados, companions desktop e infraestrutura SaaS multiproduto.',
  statusPublic: 'Código Aberto',
  statusPrivate: 'Monorepo Privado',
  statusHybrid: 'UI Pública · Core Privado',
  statusLive: 'Ecossistema Ativo',
  inspectCta: 'Inspecionar Arquitetura',
  closeModal: 'Fechar Dossiê',
  viewRepo: 'Ver Repositório',
  viewLive: 'Abrir Painel',
  privateNotice: 'Código proprietário — demonstração arquitetural disponível sob demanda.',
  caseStudyNotice: 'Privado — Estudo de Caso sob Demanda',
  hybridNotice: 'Backend Privado (Estudo sob Demanda) · Repositório UI Público',
  scrollHint: 'ROLE PARA NAVEGAR PELOS FLAGSHIPS →',
  escHint: 'ESC',
  featuresHeading: 'Capacidades Principais',
  architectureHeading: 'Notas de Arquitetura & Engenharia',
  stackHeading: 'Stack Principal',
  items: {
    orin: {
      name: 'Orin',
      version: 'v0.12.8 · MIT',
      tagline: 'Workspace local-first de agentes de IA em Web, Electron e CLI sobre um único motor.',
      summary:
        'Unifica interface web, app desktop em Electron 37 e o terminal `orin code` sobre um motor durável em Python 3.13 + SQLite — orquestrando árvores de agentes especialistas nas assinaturas que você já possui.',
      role: 'Criador & Arquiteto Principal',
      features: [
        'Companion de voz PT-BR em tempo real (modo LIVE, wake word "Orin", interrupção instantânea, identidade SOUL.md e memória afetiva).',
        'Time hierárquico de agentes especialistas roteados por nó entre provedores Claude, Codex e Antigravity.',
        'Bancada de engenharia Orin Code com preview ao vivo, arquivos e diffs, terminal integrado, "Time Machine" e paridade com claude-agent-sdk.',
        'Hub de servidores MCP, plugins, skills e índice RAG local (cosseno via numpy) sobre SQLite.',
      ],
      architecture: [
        'Motor único em FastAPI + SQLAlchemy 2 + SQLite compartilhado entre Web UI, desktop Electron 37 e CLI.',
        'Runtime multiagente em árvore delegando subtarefas entre provedores distintos com escopo isolado de ferramentas.',
        'RAG vetorial local por similaridade de cosseno em numpy sem dependência de banco em nuvem.',
      ],
    },
    auryly: {
      name: 'Auryly',
      version: 'Clean Architecture + DDD',
      tagline: 'Plataforma gamificada para aprender IA com trilhas práticas, funis e Stripe.',
      summary:
        'Monorepo educacional e SaaS ponta a ponta unindo trilhas guiadas e projetos práticos de IA a uma infraestrutura completa de conversão: captura de leads, páginas de escolha, funis público/admin e design system exportável.',
      role: 'Arquiteto Full-Stack',
      features: [
        'Backend em Clean Architecture / DDD com Python 3.12 assíncrono (FastAPI, SQLAlchemy 2 + asyncpg, Redis 7 e workers ARQ).',
        'Pagamentos e assinaturas via Stripe, autenticação Argon2id + PyJWT, Web Push e integração MCP.',
        'Pipelines analíticos embarcados com DuckDB + PyArrow e armazenamento S3 compatível via Garage.',
        'Deploy automatizado com Caddy (TLS automático), Docker Compose e suíte com pytest + testcontainers, MSW, Vitest, ruff, mypy e import-linter.',
      ],
      architecture: [
        'Fronteiras estritas de Domain, Application, Infrastructure e Presentation validadas por import-linter em monorepo uv + pnpm.',
        'Processamento assíncrono com Redis 7 + workers ARQ combinado a analytics colunar em DuckDB + PyArrow.',
        'Topologia Docker Compose auto-hospedada sob Caddy auto-TLS com PostgreSQL 16 e storage S3 Garage.',
      ],
    },
    marketfy: {
      name: 'Marketfy (SGM)',
      version: 'SaaS Multi-Tenant + PDV',
      tagline: 'Gestão de mercados com PDV offline-first, emissão NFC-e e Pix em tempo real.',
      summary:
        'SaaS comercial multi-tenant projetado para operação real no varejo — mantendo o caixa operando sem internet enquanto automatiza emissão fiscal brasileira e conciliação financeira.',
      role: 'Engenheiro SaaS Full-Stack',
      features: [
        'PDV offline-first com IndexedDB/Dexie e sincronização em segundo plano, controle de estoque e fiado (crediário de clientes).',
        'Emissão fiscal de NFC-e via serviço próprio (Neectify Fiscal) com regras tributárias por produto e fluxo de aprovação.',
        'QR Code Pix dinâmico no caixa via Mercado Pago com status em tempo real por SSE, webhooks, conciliação e detecção de anomalias.',
        'Acesso multiusuário por papéis (admin, proprietário, gerente, contador, operador), relatórios XLSX/PDF e funis A/B em iframe sandbox com atribuição UTM e coortes.',
      ],
      architecture: [
        'Fila local estilo outbox em IndexedDB/Dexie sincronizando vendas do PDV automaticamente ao retomar conexão.',
        'Ponte Server-Sent Events (SSE) transmitindo liquidações de webhooks Pix do Mercado Pago direto ao caixa.',
        'Integração com microsserviço fiscal dedicado validando regras tributárias por produto antes da emissão da NFC-e.',
      ],
    },
    billingCore: {
      name: 'Billing Core',
      version: 'Microsserviço FastAPI',
      tagline: 'Motor de faturamento recorrente idempotente para múltiplos produtos SaaS.',
      summary:
        'Serviço FastAPI voltado à produção para o ecossistema Neectify: assinaturas, integração com gateways, recepção de webhooks, jobs assíncronos rastreáveis, rate limiting e runbooks de deploy.',
      role: 'Engenheiro de Sistemas Backend',
      features: [
        'Idempotência estrita, validação de webhooks e limitação de taxa.',
        'Rastreabilidade por job, logs estruturados, readiness checks e runbooks operacionais.',
      ],
      architecture: [
        'Isolamento multiproduto com garantias determinísticas de idempotência contra reenvios e replays de webhooks.',
        'Observabilidade estruturada com correlation IDs propagados da borda HTTP até os jobs em background.',
      ],
    },
    ashy: {
      name: 'Ashy',
      version: 'Desktop · Zero Telemetria',
      tagline: 'Companion virtual local-first com Live2D Cubism 4, voz omni e memória cifrada.',
      summary:
        'Companion desktop em TypeScript focado em privacidade, combinando voz LFM3-Omni em tempo real com lip-sync, afeto persistente em 4 níveis e memória espaçada FSRS-6 em SQLite + FTS5.',
      role: 'Criador & Engenheiro Desktop',
      features: [
        'Criptografia local AES-256-GCM, zero telemetria externa e testes E2E com Playwright.',
        'Palco Live2D Cubism 4 sincronizado em tempo real com síntese de voz.',
      ],
      architecture: [
        'Memória textual local em SQLite + FTS5 priorizada com agendamento de retenção espaçada FSRS-6.',
        'Criptografia autenticada AES-256-GCM em disco sem qualquer telemetria externa.',
      ],
    },
    neectify: {
      name: 'Neectify & Engify',
      version: 'Ecossistema SaaS',
      tagline: 'Painel central SaaS em React 19 + suíte operacional Engify.',
      summary:
        'Hub do ecossistema em painel.neectify.com com React 19, TypeScript, MSW, Playwright e oxlint na Vercel — integrado ao Engify (backend Python + frontend Radix, TanStack Query e dnd-kit).',
      role: 'Engenheiro Full-Stack',
      features: [
        'Painel em React 19 + TypeScript validado com MSW e Playwright.',
        'Workspace Engify com quadros drag-and-drop (dnd-kit), componentes Radix e APIs em Python.',
      ],
      architecture: [
        'Fluxo SPA validado por contratos com mocks MSW e testes ponta a ponta no Playwright.',
        'Sincronização de estado com TanStack Query e componentes acessíveis Radix UI nos quadros operacionais.',
      ],
    },
    agentDesk: {
      name: 'AgentDesk',
      version: 'Windows Local-First',
      tagline: 'Estúdio desktop para criar e governar agentes de IA com portões de aprovação.',
      summary:
        'Ambiente desktop Windows em Electron + FastAPI orquestrando modelos Ollama e OpenRouter com ferramentas MCP stdio, aprovação humana de ações e logs de auditoria em SQLite.',
      role: 'Criador & Engenheiro Full-Stack',
      features: [
        'Portões granulares de aprovação de ferramentas e trilha de auditoria local em SQLite.',
        'Execução híbrida entre modelos locais no Ollama e nuvem via OpenRouter com MCP stdio.',
      ],
      architecture: [
        'Execução MCP stdio governada por políticas que interceptam ferramentas sensíveis antes de efeitos colaterais.',
        'Trilha de auditoria imutável em SQLite registrando prompts, argumentos e aprovações humanas.',
      ],
    },
  },
};
