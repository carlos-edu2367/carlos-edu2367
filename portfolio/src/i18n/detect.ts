import type { Locale } from './en';

export const LOCALE_STORAGE_KEY = 'ce.locale';

export function isValidLocale(value: unknown): value is Locale {
  return value === 'en' || value === 'pt-BR';
}

/**
 * Pure locale resolver:
 * 1. Valid stored preference ('en' | 'pt-BR') always wins.
 * 2. Otherwise, if any browser language tag starts with 'pt' (case-insensitive), returns 'pt-BR'.
 * 3. Defaults to 'en'.
 */
export function detectLocale(
  navigatorLanguages?: readonly string[] | null,
  stored?: string | null,
): Locale {
  if (isValidLocale(stored)) {
    return stored;
  }

  if (Array.isArray(navigatorLanguages)) {
    for (const raw of navigatorLanguages) {
      if (typeof raw === 'string' && raw.trim().toLowerCase().startsWith('pt')) {
        return 'pt-BR';
      }
    }
  }

  return 'en';
}
