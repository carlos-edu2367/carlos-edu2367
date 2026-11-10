import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, ExternalLink, Search } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { PROFILE } from '../config/profile';
import { useGame } from '../game/GameProvider';
import { useLenis } from '../hooks/useLenis';
import { useI18n } from '../i18n/I18nProvider';
import { playSound, toggleSound } from '../lib/sound';
import { OPEN_PALETTE_EVENT } from './Hud';

interface PaletteItem {
  id: string;
  label: string;
  group: string;
  external?: boolean;
  run: () => void;
}

function fuzzyMatch(query: string, text: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const target = text.toLowerCase();
  if (target.includes(q)) return true;
  let qi = 0;
  for (let i = 0; i < target.length && qi < q.length; i++) {
    if (target[i] === q[qi]) qi += 1;
  }
  return qi === q.length;
}

export function CommandPalette() {
  const { locale, t, setLocale } = useI18n();
  const { unlock } = useGame();
  const { scrollTo } = useLenis();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const dialogRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const openPalette = useCallback(() => {
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    setQuery('');
    setActiveIndex(0);
    setOpen(true);
    unlock('palette');
  }, [unlock]);

  const closePalette = useCallback(() => {
    setOpen(false);
    window.requestAnimationFrame(() => {
      previousFocusRef.current?.focus?.();
    });
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (open) closePalette();
        else openPalette();
      } else if (open && e.key === 'Escape') {
        e.preventDefault();
        closePalette();
      }
    };
    const onCustomOpen = () => openPalette();
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener(OPEN_PALETTE_EVENT, onCustomOpen);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener(OPEN_PALETTE_EVENT, onCustomOpen);
    };
  }, [open, openPalette, closePalette]);

  useEffect(() => {
    if (open) {
      window.requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const commands = useMemo<PaletteItem[]>(
    () => [
      { id: 'hero', label: t.palette.commands.goHero, group: t.palette.groups.navigation, run: () => scrollTo('#hero') },
      { id: 'about', label: t.palette.commands.goAbout, group: t.palette.groups.navigation, run: () => scrollTo('#about') },
      { id: 'projects', label: t.palette.commands.goProjects, group: t.palette.groups.navigation, run: () => scrollTo('#projects') },
      { id: 'stack', label: t.palette.commands.goStack, group: t.palette.groups.navigation, run: () => scrollTo('#stack') },
      { id: 'contact', label: t.palette.commands.goContact, group: t.palette.groups.navigation, run: () => scrollTo('#contact') },
      {
        id: 'lang',
        label: t.palette.commands.switchLang,
        group: t.palette.groups.actions,
        run: () => {
          setLocale(locale === 'en' ? 'pt-BR' : 'en');
          unlock('polyglot');
        },
      },
      {
        id: 'sound',
        label: t.palette.commands.toggleSound,
        group: t.palette.groups.actions,
        run: () => {
          if (toggleSound()) unlock('sound');
        },
      },
      {
        id: 'email',
        label: t.palette.commands.copyEmail,
        group: t.palette.groups.actions,
        run: () => {
          void navigator.clipboard?.writeText(PROFILE.email);
          unlock('contact');
        },
      },
      {
        id: 'github',
        label: t.palette.commands.openGithub,
        group: t.palette.groups.links,
        external: true,
        run: () => window.open(PROFILE.github, '_blank', 'noopener,noreferrer'),
      },
      {
        id: 'linkedin',
        label: t.palette.commands.openLinkedin,
        group: t.palette.groups.links,
        external: true,
        run: () => window.open(PROFILE.linkedin, '_blank', 'noopener,noreferrer'),
      },
    ],
    [locale, scrollTo, setLocale, t, unlock],
  );

  const filtered = useMemo(
    () => commands.filter((cmd) => fuzzyMatch(query, `${cmd.group} ${cmd.label}`)),
    [commands, query],
  );

  const executeItem = (item: PaletteItem | undefined) => {
    if (!item) return;
    playSound('click');
    closePalette();
    item.run();
  };

  const handleDialogKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (filtered.length ? (prev + 1) % filtered.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) =>
        filtered.length ? (prev - 1 + filtered.length) % filtered.length : 0,
      );
    } else if (e.key === 'Enter' && filtered.length > 0) {
      e.preventDefault();
      executeItem(filtered[Math.min(activeIndex, filtered.length - 1)]);
    } else if (e.key === 'Tab' && dialogRef.current) {
      const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
        'input, button, [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          onClick={closePalette}
          className="fixed inset-0 z-[88] flex items-start justify-center bg-void/80 px-4 pt-20 backdrop-blur-md sm:pt-28"
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={t.nav.openPalette}
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -12 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleDialogKeyDown}
            className="w-full max-w-lg overflow-hidden rounded-xl border border-primary/40 bg-surface shadow-[0_24px_80px_rgba(255,31,61,0.3)]"
          >
            <div className="flex items-center gap-3 border-b border-primary/20 px-4 py-3">
              <Search className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                placeholder={t.palette.placeholder}
                className="w-full bg-transparent text-sm text-ink placeholder:text-dim focus:outline-none"
              />
              <button
                type="button"
                onClick={closePalette}
                className="rounded border border-primary/25 px-2 py-0.5 font-mono text-[10px] text-muted hover:text-ink"
              >
                {t.palette.closeEsc}
              </button>
            </div>

            <div role="listbox" className="max-h-80 overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <p className="px-3 py-8 text-center font-mono text-xs text-muted">
                  {t.palette.empty}
                </p>
              ) : (
                filtered.map((item, idx) => {
                  const active = idx === activeIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="option"
                      aria-selected={active}
                      onMouseEnter={() => setActiveIndex(idx)}
                      onClick={() => executeItem(item)}
                      className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                        active ? 'bg-primary/20 text-ink' : 'text-muted hover:text-ink'
                      }`}
                    >
                      <div>
                        <span className="block font-mono text-[10px] tracking-widest text-dim uppercase">
                          {item.group}
                        </span>
                        <span className="font-medium">{item.label}</span>
                      </div>
                      {item.external ? (
                        <ExternalLink className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                      ) : (
                        <ArrowRight className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
