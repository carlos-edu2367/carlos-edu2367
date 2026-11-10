import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { Magnetic } from '../../components/Magnetic';
import { PROFILE } from '../../config/profile';
import { useLenis } from '../../hooks/useLenis';
import { useI18n } from '../../i18n/I18nProvider';
import { playSound } from '../../lib/sound';

function formatGoianiaTime(): string {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: 'America/Sao_Paulo',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(new Date());
  } catch {
    return '00:00:00';
  }
}

export function FooterSection() {
  const { t } = useI18n();
  const { scrollTo } = useLenis();
  const [clock, setClock] = useState<string>(formatGoianiaTime);

  useEffect(() => {
    const id = window.setInterval(() => {
      setClock(formatGoianiaTime());
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const sectors = [
    { id: 'hero', label: t.nav.hero },
    { id: 'about', label: t.nav.about },
    { id: 'projects', label: t.nav.projects },
    { id: 'stack', label: t.nav.stack },
    { id: 'contact', label: t.nav.contact },
  ];

  return (
    <footer
      id="footer"
      className="relative z-10 border-t border-primary/20 bg-surface/65 font-mono text-xs text-muted"
    >
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 border-b border-primary/15 pb-8 lg:flex-row lg:items-center">
          {/* Telemetry Status & Goiânia Live Clock */}
          <div className="flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/35 bg-void px-3 py-1.5 text-[11px] text-ink">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary shadow-[0_0_10px_#ff1f3d]" />
              <span>{t.footer.rights}</span>
            </span>

            <div className="rounded-full border border-primary/20 bg-void/80 px-3 py-1.5 text-[11px]">
              <span className="text-dim">{t.footer.localTimeLabel}: </span>
              <span className="font-bold text-hot tabular-nums">
                {clock} ({PROFILE.timezone})
              </span>
            </div>
          </div>

          {/* Quick Sector Links */}
          <nav aria-label={t.footer.sectorsLabel} className="flex flex-wrap items-center gap-4">
            {sectors.map((sec) => (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  playSound('click');
                  scrollTo(`#${sec.id}`);
                }}
                className="text-[11px] tracking-wider text-muted uppercase transition hover:text-primary"
              >
                {sec.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} {PROFILE.shortName}. {t.footer.crafted}
          </p>

          <p className="rounded border border-primary/20 bg-void/70 px-2.5 py-1 text-[11px] text-dim">
            {t.footer.konamiHint}
          </p>

          <Magnetic strength={0.22}>
            <button
              type="button"
              onClick={() => {
                playSound('click');
                scrollTo('#hero');
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-primary/35 bg-void px-3.5 py-2 text-[11px] font-bold tracking-wider text-ink uppercase transition hover:border-primary hover:text-hot"
            >
              <span>{t.footer.backToTop}</span>
              <ArrowUp className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            </button>
          </Magnetic>
        </div>
      </div>
    </footer>
  );
}
