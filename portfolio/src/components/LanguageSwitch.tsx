import { useGame } from '../game/GameProvider';
import { useI18n } from '../i18n/I18nProvider';
import type { Locale } from '../i18n/en';
import { playSound } from '../lib/sound';

const OPTIONS: { value: Locale; label: string }[] = [
  { value: 'en', label: 'EN' },
  { value: 'pt-BR', label: 'PT-BR' },
];

export function LanguageSwitch() {
  const { locale, t, setLocale } = useI18n();
  const { unlock } = useGame();

  const handleSelect = (next: Locale) => {
    if (next === locale) {
      return;
    }
    playSound('click');
    setLocale(next);
    unlock('polyglot');
  };

  return (
    <div
      role="group"
      aria-label={t.hud.switchLangAria}
      className="inline-flex items-center rounded-full border border-primary/25 bg-surface/90 p-0.5 font-mono text-[11px] tracking-wider"
    >
      {OPTIONS.map((opt) => {
        const active = locale === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            data-magnetic=""
            aria-pressed={active}
            onClick={() => handleSelect(opt.value)}
            className={`rounded-full px-2.5 py-1 transition-colors ${
              active
                ? 'btn-crimson font-bold'
                : 'text-muted hover:text-ink'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
