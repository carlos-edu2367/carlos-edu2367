import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useGame } from '../game/GameProvider';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useI18n } from '../i18n/I18nProvider';
import { playSound } from '../lib/sound';

const BOOT_SESSION_KEY = 'ce.booted';
const BOOT_DURATION_MS = 420;

function hasBootedThisSession(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  try {
    return window.sessionStorage.getItem(BOOT_SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

export function BootLoader() {
  const { t } = useI18n();
  const { unlock } = useGame();
  const reducedMotion = usePrefersReducedMotion();

  const [active, setActive] = useState<boolean>(() => !hasBootedThisSession());
  const [stepIndex, setStepIndex] = useState<number>(0);
  const pctRef = useRef<HTMLSpanElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const statusRef = useRef<HTMLParagraphElement | null>(null);

  const finishBoot = useCallback(() => {
    try {
      window.sessionStorage.setItem(BOOT_SESSION_KEY, '1');
    } catch {
      // Ignore session storage issues
    }
    playSound('boot');
    unlock('boot');
    setActive(false);
  }, [unlock]);

  useEffect(() => {
    if (!active) {
      unlock('boot');
      return;
    }

    if (reducedMotion) {
      finishBoot();
      return;
    }

    const startedAt = performance.now();
    let rafId = 0;
    let finishTimer = 0;
    let prevStep = 0;
    const stepCount = t.boot.steps.length;

    const tick = (now: number) => {
      const elapsed = now - startedAt;
      const pct = Math.min(100, Math.round((elapsed / BOOT_DURATION_MS) * 100));
      if (pctRef.current) {
        pctRef.current.textContent = `${pct}%`;
      }
      if (barRef.current) {
        barRef.current.style.width = `${pct}%`;
      }
      if (pct >= 100 && statusRef.current) {
        statusRef.current.textContent = t.boot.ready;
      }
      const nextStep = Math.min(stepCount - 1, Math.floor((pct / 100) * stepCount));
      if (nextStep !== prevStep) {
        prevStep = nextStep;
        setStepIndex(nextStep);
      }

      if (elapsed < BOOT_DURATION_MS) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        finishTimer = window.setTimeout(finishBoot, 60);
      }
    };

    rafId = window.requestAnimationFrame(tick);

    const handleKey = () => finishBoot();
    window.addEventListener('keydown', handleKey);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(finishTimer);
      window.removeEventListener('keydown', handleKey);
    };
  }, [active, reducedMotion, finishBoot, unlock, t.boot.steps.length, t.boot.ready]);

  return (
    <AnimatePresence>
      {active ? (
        <motion.div
          key="boot-loader"
          role="dialog"
          aria-modal="true"
          aria-label={t.boot.systemTag}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } }}
          onClick={finishBoot}
          className="fixed inset-0 z-[95] flex cursor-pointer flex-col items-center justify-center bg-void/85 px-6 text-ink backdrop-blur-md"
        >
          <div className="w-full max-w-md space-y-6 rounded-xl border border-primary/35 bg-surface/95 p-7 shadow-[0_0_80px_-20px_rgba(255,31,61,0.45)]">
            <div className="flex items-center justify-between font-mono text-xs tracking-widest text-hot">
              <span>{t.boot.systemTag}</span>
              <span ref={pctRef}>0%</span>
            </div>

            <div className="space-y-2">
              <p
                ref={statusRef}
                className="font-display text-xl font-extrabold tracking-tight text-ink"
              >
                {t.boot.initializing}
              </p>
              <p className="min-h-[1.25rem] font-mono text-xs text-muted">
                &gt; {t.boot.steps[stepIndex]}
              </p>
            </div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-elevated">
              <div
                ref={barRef}
                className="h-full rounded-full bg-gradient-to-r from-crimson via-primary to-hot"
                style={{ width: '0%' }}
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  finishBoot();
                }}
                className="btn-crimson rounded px-3 py-1.5 font-mono text-[11px] font-bold tracking-widest uppercase transition"
              >
                {t.boot.pressStart}
              </button>
              <span className="font-mono text-[10px] tracking-wider text-dim">
                {t.boot.skip}
              </span>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
