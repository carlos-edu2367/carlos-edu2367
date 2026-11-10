import { describe, expect, it } from 'vitest';
import { detectLocale } from './detect';
import { en } from './en';
import { ptBR } from './pt-BR';

function collectKeys(obj: unknown, prefix = ''): string[] {
  if (obj === null || typeof obj !== 'object') {
    return [prefix];
  }
  if (Array.isArray(obj)) {
    return obj.flatMap((item, idx) => collectKeys(item, `${prefix}[${idx}]`));
  }
  return Object.keys(obj)
    .sort()
    .flatMap((key) => {
      const next = prefix ? `${prefix}.${key}` : key;
      return collectKeys((obj as Record<string, unknown>)[key], next);
    });
}

describe('detectLocale', () => {
  it('defaults to en when inputs are empty or undefined', () => {
    expect(detectLocale(undefined, undefined)).toBe('en');
    expect(detectLocale([], null)).toBe('en');
  });

  it('honors stored valid choice over navigator languages', () => {
    expect(detectLocale(['pt-BR', 'pt'], 'en')).toBe('en');
    expect(detectLocale(['en-US', 'fr'], 'pt-BR')).toBe('pt-BR');
  });

  it('ignores invalid stored values and falls back to navigator languages', () => {
    expect(detectLocale(['pt-BR', 'en-US'], 'es')).toBe('pt-BR');
    expect(detectLocale(['en-GB'], 'invalid')).toBe('en');
  });

  it('detects any navigator language starting with pt (case-insensitive)', () => {
    expect(detectLocale(['pt-BR'])).toBe('pt-BR');
    expect(detectLocale(['en-US', 'pt-PT'])).toBe('pt-BR');
    expect(detectLocale(['PT'])).toBe('pt-BR');
  });

  it('returns en for non-Portuguese navigator languages', () => {
    expect(detectLocale(['en-US', 'es-ES', 'fr-FR'])).toBe('en');
  });
});

describe('i18n dictionary parity', () => {
  it('has identical recursive key sets and array lengths in EN and PT-BR', () => {
    const enKeys = collectKeys(en);
    const ptKeys = collectKeys(ptBR);
    expect(ptKeys).toEqual(enKeys);
  });
});
