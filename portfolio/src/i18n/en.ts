import { projectsEn } from './projects.en';

export type Locale = 'en' | 'pt-BR';

export const en = {
  skipLink: 'Skip to main content',
  boot: {
    systemTag: 'CE-OS // KERNEL v2.6',
    initializing: 'INITIALIZING NEURAL & SAAS RUNTIME...',
    steps: [
      'Mounting async FastAPI & SQLite local engine...',
      'Calibrating crimson shaders & 3D telemetry...',
      'Syncing multi-agent MCP channels...',
    ],
    ready: 'SYSTEM READY',
    pressStart: 'PRESS START / CLICK OR HIT ANY KEY',
    skip: 'Skip Intro [ESC]',
  },
  nav: {
    hero: 'Home',
    about: 'Operator',
    projects: 'Systems',
    stack: 'Arsenal',
    contact: 'Hire Me',
    openPalette: 'Command Palette',
  },
  hud: {
    levelPrefix: 'LVL',
    xpSuffix: 'XP',
    soundOn: 'SFX ON',
    soundOff: 'SFX MUTED',
    toggleSoundAria: 'Toggle interface sound effects',
    switchLangAria: 'Switch site language',
    availableBadge: 'AVAILABLE FOR FREELANCE',
    cmdHint: '⌘K',
  },
  hero: {
    eyebrow: 'GOIÂNIA, BRAZIL (UTC-3) · AVAILABLE FOR FREELANCE',
    role: 'Full-Stack Software Engineer',
    domains: 'Backend · Multi-Tenant SaaS · Local-First AI Agent Systems',
    headlineLine1: 'ARCHITECTING',
    headlineAccent: 'RELENTLESS',
    headlineLine2: 'SOFTWARE SYSTEMS.',
    description:
      'I build production backends, multi-tenant SaaS products, resilient payment & fiscal pipelines, and local-first AI agent workspaces — shipped end-to-end from domain model to interactive UI.',
    primaryCta: 'Start a Project',
    secondaryCta: 'Explore Flagships',
    scrollHint: 'SCROLL TO INSPECT',
    portraitCaption: 'OPERATOR // CARLOS EDUARDO DA SILVA',
    webglFallback: '3D core running in lightweight telemetry mode',
  },
  about: {
    eyebrow: '// 01 · OPERATOR DOSSIER & CHARACTER SHEET',
    title: 'Built for Real-World Complexity',
    lead: 'Full-Stack Software Engineer focused on Clean Architecture, Domain-Driven Design, async Python, and high-craft React & Electron interfaces.',
    bio: 'I take products from blank repository to Linux VPS production. Previously engineered internal process-automation systems for Arcaika Engenharia — delivering a request-management backend and web platform, a dedicated client portal, and an Android APK for field operations.',
    stats: {
      classLabel: 'CLASS',
      classValue: 'Full-Stack Systems Engineer',
      baseLabel: 'BASE',
      baseValue: 'Goiânia, GO — Brazil (UTC-3)',
      degreeLabel: 'EDUCATION',
      degreeValue: 'Systems Analysis & Development (2026)',
      langLabel: 'COMMS',
      langValue: 'Portuguese (Native) · English (B2)',
      statusLabel: 'STATUS',
      statusValue: 'Open for Freelance & Contract',
      specLabel: 'SPECIALIZATION',
      specValue: 'Backend · Multi-Tenant SaaS · AI Agents',
    },
    attributesTitle: 'OPERATOR ATTRIBUTES',
    attributesNote: 'Qualitative self-assessment',
    attributes: [
      { label: 'Backend & Async Systems', code: 'BCK', tier: 'CORE', fill: 94 },
      { label: 'AI Agents & MCP Runtime', code: 'AGT', tier: 'CORE', fill: 92 },
      { label: 'Frontend, Motion & 3D', code: 'UIX', tier: 'HIGH', fill: 88 },
      { label: 'Product & UX Craft', code: 'PRD', tier: 'HIGH', fill: 87 },
      { label: 'DevOps & Linux VPS', code: 'OPS', tier: 'SOLID', fill: 85 },
    ],
    perksTitle: 'EQUIPPED TRAITS & PERKS',
    perks: [
      'Clean Architecture / DDD',
      'Offline-First Sync',
      'Idempotent Payments',
      'Local-First AI',
      'Async Python 3.13',
      'Realtime Voice & SSE',
      'Multi-Tenant SaaS',
      'Linux VPS + Auto-TLS',
    ],
    questsTitle: 'QUESTS COMPLETED // FIELD LOG',
    quests: [
      {
        code: 'QST-01',
        tag: 'FIELD AUTOMATION',
        title: 'Arcaika Engenharia Process Suite',
        detail:
          'Engineered internal request-management backend & web platform, client portal, and field Android APK.',
      },
      {
        code: 'QST-02',
        tag: 'MULTI-TENANT RETAIL',
        title: 'Marketfy Offline POS & Fiscal Engine',
        detail:
          'Shipped IndexedDB offline checkout, automated NFC-e fiscal invoicing, and realtime Mercado Pago Pix over SSE.',
      },
      {
        code: 'QST-03',
        tag: 'DDD SAAS MONOREPO',
        title: 'Auryly Gamified AI Platform',
        detail:
          'Built Clean Architecture Python 3.12 backend, guided tracks, sales funnels, Stripe subscriptions, and DuckDB analytics.',
      },
      {
        code: 'QST-04',
        tag: 'LOCAL-FIRST AI',
        title: 'Orin Multi-Agent Workspace (v0.12.8)',
        detail:
          'Unified Web, Electron 37, and CLI over one SQLite engine with realtime PT-BR voice and specialist agent trees.',
      },
    ],
    pillarsTitle: 'ARCHITECTURAL DOCTRINE',
    pillars: [
      {
        title: 'Clean Architecture & Async Backend',
        detail: 'FastAPI, SQLAlchemy 2 async, Pydantic v2, Redis/ARQ workers, and strict DDD boundaries.',
      },
      {
        title: 'Multi-Tenant SaaS & Revenue',
        detail: 'Idempotent Stripe & Mercado Pago billing, dynamic Pix over SSE, and automated NFC-e invoicing.',
      },
      {
        title: 'Local-First AI & Desktop',
        detail: 'Multi-agent trees, MCP servers, realtime voice companions, local RAG, Electron + SQLite.',
      },
      {
        title: 'Offline-First & DevOps Ownership',
        detail: 'IndexedDB/Dexie sync, Docker Compose, Caddy auto-TLS on Linux VPS, and testcontainers CI.',
      },
    ],
  },
  projects: projectsEn,
  stack: {
    eyebrow: '// 03 · EQUIPPED ARSENAL',
    title: 'Battle-Tested Tech Stack',
    subtitle:
      'Every tool selected for reliability, type safety, and operational clarity across backend, web, desktop, and infrastructure.',
    categories: {
      languages: 'Languages',
      backend: 'Backend & Billing',
      frontend: 'Frontend & 3D',
      desktopAi: 'Desktop & AI Agents',
      data: 'Data & Storage',
      devops: 'Infra & DevOps',
      quality: 'Testing & Quality',
    },
    allFilter: 'All Domains',
    constellationHint: 'DRAG TO ORBIT · HOVER NODES · CLICK DOMAIN TO FOCUS',
    fallbackNote: '2D Tactical Constellation Active',
    nodesLabel: 'MAPPED TECHNOLOGIES',
    domainsLabel: 'ACTIVE DOMAINS',
    matrixTitle: 'COMPLETE ARSENAL SPECIFICATION',
  },
  contact: {
    eyebrow: '// 04 · DIRECT UPLINK',
    title: 'Need an Engineer Who Ships the Whole Stack?',
    kineticHeadline: "Let's build something that makes people say wow.",
    subtitle:
      'Available for freelance builds, SaaS MVPs, backend architecture, billing integrations, and custom AI agent systems. Expect clear communication and production-grade delivery.',
    copyEmail: 'Copy Email Address',
    copiedEmail: 'Copied to Clipboard!',
    sendEmail: 'Send Direct Email',
    githubLabel: 'GitHub Profile',
    linkedinLabel: 'LinkedIn Profile',
    responseNote: 'Timezone UTC-3 · Async-friendly in English (B2) or Portuguese.',
    availabilityLabel: 'AVAILABILITY',
    availabilityValue: 'Open for Freelance & Contract',
    timezoneLabel: 'BASE & TIMEZONE',
    commsLabel: 'ASYNC COMMS',
    commsValue: 'English (B2) · Portuguese (Native)',
  },
  footer: {
    crafted: 'Designed & engineered by Carlos Eduardo da Silva.',
    rights: 'All systems nominal.',
    localTimeLabel: 'GOIÂNIA LOCAL TIME',
    sectorsLabel: 'SECTORS',
    konamiHint: 'Hint: try ↑ ↑ ↓ ↓ ← → ← → B A',
    backToTop: 'Back to Top ↑',
  },
  palette: {
    placeholder: 'Type a command or jump to section...',
    empty: 'No matching command found.',
    closeEsc: 'ESC to close',
    groups: {
      navigation: 'Navigation',
      actions: 'System Actions',
      links: 'External Links',
    },
    commands: {
      goHero: 'Go to Top / Hero',
      goAbout: 'Go to Operator Character Sheet',
      goProjects: 'Go to Flagship Systems',
      goStack: 'Go to Tech Stack Arsenal',
      goContact: 'Go to Hire / Contact',
      switchLang: 'Switch Language (EN ↔ PT-BR)',
      toggleSound: 'Toggle Interface Sound Effects',
      copyEmail: 'Copy Email (contato.carlosedu2367@gmail.com)',
      openGithub: 'Open GitHub (@carlos-edu2367)',
      openLinkedin: 'Open LinkedIn',
    },
  },
  achievements: {
    unlockedHeader: 'ACHIEVEMENT UNLOCKED',
    items: {
      boot: {
        title: 'System Online',
        description: 'Initialized the portfolio runtime.',
      },
      explorer: {
        title: 'Full Reconnaissance',
        description: 'Visited every sector of the portfolio.',
      },
      polyglot: {
        title: 'Bilingual Comms',
        description: 'Switched interface language between EN and PT-BR.',
      },
      curious: {
        title: 'Deep Inspector',
        description: 'Opened a technical architecture dossier.',
      },
      collector: {
        title: 'Archivist of Flagships',
        description: 'Inspected all three flagship architectures.',
      },
      konami: {
        title: 'Crimson Overdrive',
        description: 'Entered the classic Konami sequence.',
      },
      sound: {
        title: 'Audio Telemetry',
        description: 'Activated synthesized WebAudio feedback.',
      },
      palette: {
        title: 'Power Operator',
        description: 'Opened the Command Palette.',
      },
      contact: {
        title: 'Signal Established',
        description: 'Copied Carlos Eduardo’s direct email.',
      },
    },
  },
  toasts: {
    emailCopied: 'Email copied to clipboard',
    langSwitched: 'Language updated to English',
    konamiActivated: 'CRIMSON OVERDRIVE ENGAGED (+100 XP)',
  },
};

export type Dictionary = typeof en;
