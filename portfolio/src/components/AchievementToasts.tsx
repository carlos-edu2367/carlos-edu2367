import { useEffect } from 'react';
import { Trophy, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { ACHIEVEMENTS, type AchievementId } from '../game/achievements';
import { useGame } from '../game/GameProvider';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useI18n } from '../i18n/I18nProvider';

function ToastItem({
  id,
  onDismiss,
}: {
  id: AchievementId;
  onDismiss: (id: AchievementId) => void;
}) {
  const { t } = useI18n();
  const reducedMotion = usePrefersReducedMotion();
  const copy = t.achievements.items[id];
  const def = ACHIEVEMENTS[id];

  useEffect(() => {
    const timer = window.setTimeout(() => {
      onDismiss(id);
    }, 4200);
    return () => window.clearTimeout(timer);
  }, [id, onDismiss]);

  return (
    <motion.div
      layout={!reducedMotion}
      initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: 40, scale: 0.96 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className="pointer-events-auto flex w-80 max-w-[calc(100vw-2rem)] items-start gap-3 rounded-xl border border-primary/45 bg-surface/95 p-3.5 shadow-[0_12px_40px_rgba(255,31,61,0.28)] backdrop-blur-md"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/40 bg-primary/15 text-primary">
        <Trophy className="h-4 w-4" aria-hidden="true" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[10px] font-bold tracking-widest text-hot uppercase">
            {t.achievements.unlockedHeader}
          </span>
          <span className="rounded bg-primary/20 px-1.5 py-0.5 font-mono text-[10px] font-bold text-ink">
            +{def.xp} {t.hud.xpSuffix}
          </span>
        </div>
        <p className="mt-0.5 truncate font-display text-sm font-bold text-ink">{copy.title}</p>
        <p className="mt-0.5 text-xs leading-snug text-muted">{copy.description}</p>
      </div>

      <button
        type="button"
        onClick={() => onDismiss(id)}
        aria-label="Dismiss notification"
        className="rounded p-1 text-dim transition hover:bg-elevated hover:text-ink"
      >
        <X className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </motion.div>
  );
}

export function AchievementToasts() {
  const { state, dismissToast } = useGame();
  const visibleToasts = state.toastQueue.slice(-3);

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed right-4 bottom-4 z-[85] flex flex-col gap-2.5"
    >
      <AnimatePresence mode="popLayout">
        {visibleToasts.map((id) => (
          <ToastItem key={id} id={id} onDismiss={dismissToast} />
        ))}
      </AnimatePresence>
    </div>
  );
}
