import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { en, type Dictionary, type Locale } from './en';
import { ptBR } from './pt-BR';
import { detectLocale, LOCALE_STORAGE_KEY } from './detect';

const DICTIONARIES: Record<Locale, Dictionary> = {
  en,
  'pt-BR': ptBR,
};

export interface I18nContextValue {
  locale: Locale;
  t: Dictionary;
  setLocale: (next: Locale) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function resolveInitialLocale(): Locale {
  if (typeof window === 'undefined') {
    return 'en';
  }
  let stored: string | null = null;
  try {
    stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  } catch {
    stored = null;
  }
  const navLangs =
    window.navigator.languages && window.navigator.languages.length > 0
      ? window.navigator.languages
      : window.navigator.language
        ? [window.navigator.language]
        : [];
  return detectLocale(navLangs, stored);
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(resolveInitialLocale);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      // Ignore storage quota/privacy failures
    }
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      t: DICTIONARIES[locale],
      setLocale,
    }),
    [locale, setLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return ctx;
}
