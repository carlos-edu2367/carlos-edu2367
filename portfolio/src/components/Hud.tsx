import { useEffect, useState, useSyncExternalStore } from 'react';
import { Command, Flame, Volume2, VolumeX } from 'lucide-react';
import { PROFILE } from '../config/profile';
import { useGame } from '../game/GameProvider';
import { useLenis } from '../hooks/useLenis';
import { useI18n } from '../i18n/I18nProvider';
import { isSoundEnabled, playSound, subscribeSound, toggleSound } from '../lib/sound';
import { LanguageSwitch } from './LanguageSwitch';
import { Magnetic } from './Magnetic';

export const OPEN_PALETTE_EVENT = 'ce:open-palette';
const SPY_SECTIONS = ['hero', 'about', 'projects', 'stack', 'contact'] as const;

export interface HudProps {
  onOpenPalette?: () => void;
}

export function Hud({ onOpenPalette }: HudProps) {
  const { t } = useI18n();
  const { state, levelInfo, unlock } = useGame();
  const { scrollTo } = useLenis();
  const soundOn = useSyncExternalStore(subscribeSound, isSoundEnabled, () => false);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [scrollPct, setScrollPct] = useState<number>(0);
  const konamiActive = state.unlocked.includes('konami');

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    let rafId = 0;
    const updateScrollHud = () => {
      rafId = 0;
      const doc = document.documentElement;
      const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
      const y = window.scrollY;
      setScrollPct(Math.min(100, Math.max(0, (y / maxScroll) * 100)));

      const probeY = y + window.innerHeight * 0.32;
      let current = 'hero';
      for (const secId of SPY_SECTIONS) {
        const el = document.getElementById(secId);
        if (el) {
          const top = el.getBoundingClientRect().top + y;
          if (probeY >= top) {
            current = secId;
          }
        }
      }
      setActiveSection(current);
    };

    const onScroll = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(updateScrollHud);
      }
    };

    updateScrollHud();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const navItems = [
    { id: 'about', label: t.nav.about },
    { id: 'projects', label: t.nav.projects },
    { id: 'stack', label: t.nav.stack },
    { id: 'contact', label: t.nav.contact },
  ];

  const handleNavClick = (sectionId: string) => {
    playSound('click');
    scrollTo(`#${sectionId}`);
  };

  const handleSoundToggle = () => {
    const enabled = toggleSound();
    if (enabled) {
      unlock('sound');
    }
  };

  const handlePaletteClick = () => {
    playSound('click');
    if (onOpenPalette) {
      onOpenPalette();
    } else if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(OPEN_PALETTE_EVENT));
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-primary/20 bg-void/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Magnetic strength={0.22}>
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('hero');
            }}
            className="group inline-flex items-center gap-2.5 font-display text-lg font-extrabold tracking-tight text-ink"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/50 bg-primary/15 font-mono text-xs font-bold text-primary transition group-hover:bg-primary group-hover:text-ink">
              {PROFILE.monogram}
            </span>
            <span className="hidden items-center gap-1.5 font-mono text-[10px] font-medium tracking-widest text-muted xl:inline-flex">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary shadow-[0_0_8px_#ff1f3d]" />
              {t.hud.availableBadge}
            </span>
          </a>
        </Magnetic>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                data-magnetic=""
                aria-current={isActive ? 'location' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.id);
                }}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 font-mono text-xs tracking-wider uppercase transition ${
                  isActive
                    ? 'bg-primary/15 font-semibold text-ink shadow-[inset_0_0_12px_rgba(255,31,61,0.18)]'
                    : 'text-muted hover:bg-elevated hover:text-ink'
                }`}
              >
                {isActive ? (
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rounded-full bg-hot shadow-[0_0_8px_#ff4d6d]"
                  />
                ) : null}
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {konamiActive ? (
            <span
              data-testid="hud-overdrive-pill"
              className="hidden items-center gap-1 rounded-full border border-hot/70 bg-primary/20 px-2.5 py-1 font-mono text-[10px] font-bold tracking-widest text-hot uppercase lg:inline-flex"
            >
              <Flame className="h-3 w-3" aria-hidden="true" />
              OVERDRIVE
            </span>
          ) : null}

          <div
            className="flex items-center gap-1.5 rounded-full border border-primary/25 bg-surface/90 px-2.5 py-1 font-mono text-[10px] sm:gap-2 sm:px-3 sm:text-[11px]"
            title={`${state.xp} ${t.hud.xpSuffix}`}
          >
            <span className="font-bold text-primary">
              {t.hud.levelPrefix} {levelInfo.level}
            </span>
            <div className="hidden h-1.5 w-12 overflow-hidden rounded-full bg-elevated sm:block md:w-14">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-hot transition-[width] duration-300"
                style={{ width: `${Math.round(levelInfo.progress * 100)}%` }}
              />
            </div>
            <span className="text-muted tabular-nums">
              {state.xp} <span className="hidden sm:inline">{t.hud.xpSuffix}</span>
            </span>
          </div>

          <button
            type="button"
            data-magnetic=""
            onClick={handlePaletteClick}
            aria-label={`${t.nav.openPalette} (${t.hud.cmdHint})`}
            className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-surface/90 px-2 py-1.5 font-mono text-[11px] text-muted transition hover:border-primary/60 hover:text-ink sm:px-2.5"
          >
            <Command className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            <span className="hidden sm:inline">{t.hud.cmdHint}</span>
          </button>

          <button
            type="button"
            data-magnetic=""
            onClick={handleSoundToggle}
            aria-label={`${t.hud.toggleSoundAria} (${soundOn ? t.hud.soundOn : t.hud.soundOff})`}
            aria-pressed={soundOn}
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-1.5 font-mono text-[11px] transition sm:px-2.5 ${
              soundOn
                ? 'border-primary/60 bg-primary/15 text-ink'
                : 'border-primary/25 bg-surface/90 text-muted hover:text-ink'
            }`}
          >
            {soundOn ? (
              <Volume2 className="h-3.5 w-3.5 text-hot" aria-hidden="true" />
            ) : (
              <VolumeX className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            <span className="hidden xl:inline">
              {soundOn ? t.hud.soundOn : t.hud.soundOff}
            </span>
          </button>

          <LanguageSwitch />
        </div>
      </div>

      <nav
        aria-label="Mobile sections"
        className="flex items-center justify-around border-t border-primary/15 bg-surface/85 px-2 py-1.5 md:hidden"
      >
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={isActive ? 'location' : undefined}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item.id);
              }}
              className={`rounded px-2 py-1 font-mono text-[11px] tracking-wider uppercase transition ${
                isActive ? 'bg-primary/15 font-bold text-hot' : 'text-muted hover:text-ink'
              }`}
            >
              {item.label}
            </a>
          );
        })}
      </nav>

      <div aria-hidden="true" className="h-[2px] w-full bg-primary/10">
        <div
          className="h-full bg-gradient-to-r from-crimson via-primary to-hot shadow-[0_0_10px_#ff1f3d] transition-[width] duration-75"
          style={{ width: `${scrollPct.toFixed(1)}%` }}
        />
      </div>
    </header>
  );
}
