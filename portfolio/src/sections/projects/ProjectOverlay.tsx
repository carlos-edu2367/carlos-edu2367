import { useEffect, useRef, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { ArrowUpRight, Cpu, Lock, ShieldCheck, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useScrollLock } from '../../components/ui/gsapScroll';
import type { ProjectItem } from '../../data/projects';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { useI18n } from '../../i18n/I18nProvider';
import { playSound } from '../../lib/sound';

export interface ProjectOverlayProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export function ProjectOverlay({ project, onClose }: ProjectOverlayProps) {
  const { t } = useI18n();
  const reducedMotion = usePrefersReducedMotion();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useScrollLock(Boolean(project));

  useEffect(() => {
    if (!project) {
      return;
    }
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const raf = window.requestAnimationFrame(() => {
      closeBtnRef.current?.focus();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        playSound('click');
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onKeyDown);
      previousFocusRef.current?.focus?.();
    };
  }, [project, onClose]);

  const handleTrapTab = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab' || !dialogRef.current) {
      return;
    }
    const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
      'button, a[href], [tabindex]:not([tabindex="-1"])',
    );
    if (focusables.length === 0) {
      return;
    }
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const isJsdom = typeof navigator !== 'undefined' && /jsdom/i.test(navigator.userAgent);
  const instant = reducedMotion || isJsdom;

  const renderModal = (active: ProjectItem) => {
    const copy = t.projects.items[active.i18nKey];
    const statusLabel =
      active.status === 'public'
        ? t.projects.statusPublic
        : active.status === 'private'
          ? t.projects.statusPrivate
          : active.status === 'hybrid'
            ? t.projects.statusHybrid
            : t.projects.statusLive;

    return (
      <motion.div
        key={active.id}
        initial={instant ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={instant ? undefined : { opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={() => {
          playSound('click');
          onClose();
        }}
        data-lenis-prevent=""
        className="fixed inset-0 z-[86] flex items-center justify-center overflow-y-auto bg-void/85 p-4 backdrop-blur-lg sm:p-6"
      >
        <motion.div
          ref={dialogRef}
          layoutId={instant ? undefined : `project-card-${active.id}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`dossier-title-${active.id}`}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={handleTrapTab}
          initial={instant ? false : { opacity: 0, y: 18, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={instant ? undefined : { opacity: 0, y: 14, scale: 0.98 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="relative my-auto max-h-[88dvh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-primary/45 bg-surface p-6 shadow-[0_28px_90px_rgba(255,31,61,0.32)] sm:p-8"
        >
          <div className="flex items-start justify-between gap-4 border-b border-primary/20 pb-5">
            <div>
              <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase">
                <span className="rounded border border-primary/45 bg-primary/15 px-2 py-0.5 font-bold text-primary">
                  {statusLabel}
                </span>
                <span className="text-muted">{copy.version}</span>
                <span className="text-dim">· {copy.role}</span>
              </div>
              <h3
                id={`dossier-title-${active.id}`}
                className="mt-2.5 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl"
              >
                {copy.name}
              </h3>
              <p className="mt-1.5 text-sm text-hot sm:text-base">{copy.tagline}</p>
            </div>

            <button
              ref={closeBtnRef}
              type="button"
              onClick={() => {
                playSound('click');
                onClose();
              }}
              aria-label={t.projects.closeModal}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-primary/35 bg-elevated px-3 py-1.5 font-mono text-xs text-muted transition hover:border-primary hover:text-ink"
            >
              <span>{t.projects.escHint}</span>
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <p className="mt-5 text-sm leading-relaxed text-muted sm:text-base">{copy.summary}</p>

          {(active.isPrivate || active.status === 'hybrid') && (
            <div className="mt-5 flex items-center gap-2.5 rounded-xl border border-primary/30 bg-elevated/80 px-4 py-3 font-mono text-xs text-ink">
              <Lock className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <span>
                {active.isPrivate ? t.projects.privateNotice : t.projects.hybridNotice}
              </span>
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h4 className="flex items-center gap-2 font-mono text-xs font-bold tracking-widest text-primary uppercase">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                {t.projects.featuresHeading}
              </h4>
              <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-muted">
                {copy.features.map((feat, i) => (
                  <li key={i} className="flex gap-2.5">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-primary" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="flex items-center gap-2 font-mono text-xs font-bold tracking-widest text-hot uppercase">
                <Cpu className="h-4 w-4" aria-hidden="true" />
                {t.projects.architectureHeading}
              </h4>
              <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-muted">
                {copy.architecture.map((note, i) => (
                  <li key={i} className="flex gap-2.5">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-hot" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 border-t border-primary/20 pt-5">
            <h4 className="font-mono text-xs font-bold tracking-widest text-muted uppercase">
              {t.projects.stackHeading}
            </h4>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {active.stack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-md border border-primary/25 bg-void px-2.5 py-1 font-mono text-[11px] text-ink"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-primary/20 pt-5">
            {active.link ? (
              <a
                href={active.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playSound('click')}
                className="btn-crimson inline-flex items-center gap-2 rounded-lg px-5 py-2.5 font-mono text-xs font-bold tracking-widest uppercase transition"
              >
                <span>
                  {active.status === 'live' ? t.projects.viewLive : t.projects.viewRepo}
                </span>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            ) : (
              <span className="font-mono text-xs text-dim uppercase">
                {t.projects.caseStudyNotice}
              </span>
            )}

            <button
              type="button"
              onClick={() => {
                playSound('click');
                onClose();
              }}
              className="rounded-lg border border-primary/30 px-4 py-2 font-mono text-xs tracking-wider text-muted uppercase transition hover:border-primary hover:text-ink"
            >
              {t.projects.closeModal}
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  if (instant) {
    return project ? renderModal(project) : null;
  }

  return <AnimatePresence>{project ? renderModal(project) : null}</AnimatePresence>;
}
