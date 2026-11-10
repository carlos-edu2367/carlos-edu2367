/**
 * Central profile configuration & single source of truth for personal assets and links.
 */

const baseUrl = import.meta.env.BASE_URL || '/';

export const PORTRAIT_ASSET = {
  jpg: `${baseUrl}images/portrait.jpg`,
  webp: `${baseUrl}images/portrait.webp`,
  webpSm: `${baseUrl}images/portrait-sm.webp`,
  avif: `${baseUrl}images/portrait.avif`,
  avifSm: `${baseUrl}images/portrait-sm.avif`,
  altEn: 'Editorial portrait illustration for Carlos Eduardo da Silva',
  altPt: 'Retrato editorial ilustrativo de Carlos Eduardo da Silva',
} as const;

export const PROFILE = {
  fullName: 'Carlos Eduardo da Silva',
  shortName: 'Carlos Eduardo',
  monogram: 'CE',
  location: 'Goiânia, GO — Brazil',
  timezone: 'UTC-3',
  email: 'contato.carlosedu2367@gmail.com',
  github: 'https://github.com/carlos-edu2367',
  githubHandle: '@carlos-edu2367',
  linkedin: 'https://linkedin.com/in/carloseduardo2367/',
  linkedinHandle: 'in/carloseduardo2367',
  degreeCompletionYear: 2026,
  englishLevel: 'B2',
  portrait: PORTRAIT_ASSET,
  projectLinks: {
    orin: 'https://github.com/carlos-edu2367/orin',
    marketfyFrontend: 'https://github.com/carlos-edu2367/marketfy-frontend-verc',
    billingCore: 'https://github.com/carlos-edu2367/billing-core',
    ashy: 'https://github.com/carlos-edu2367/ashy',
    neectify: 'https://painel.neectify.com',
    agentDesk: 'https://github.com/carlos-edu2367/AgentDesk',
  },
} as const;
