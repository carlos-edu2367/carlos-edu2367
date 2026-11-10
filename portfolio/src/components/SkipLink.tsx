import { useI18n } from '../i18n/I18nProvider';

export function SkipLink() {
  const { t } = useI18n();

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:font-bold focus:tracking-widest focus:text-ink focus:uppercase focus:shadow-lg"
    >
      {t.skipLink}
    </a>
  );
}
