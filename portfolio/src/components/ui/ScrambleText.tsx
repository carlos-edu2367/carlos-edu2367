import { useCallback, useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789//<>[]#_*+';

export interface ScrambleTextProps {
  text: string;
  className?: string;
  scrambleOnHover?: boolean;
  durationMs?: number;
}

export function ScrambleText({
  text,
  className = '',
  scrambleOnHover = true,
  durationMs = 520,
}: ScrambleTextProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [display, setDisplay] = useState<string>(text);
  const spanRef = useRef<HTMLSpanElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    setDisplay(text);
  }, [text]);

  const runScramble = useCallback(() => {
    if (reducedMotion || typeof window === 'undefined') {
      setDisplay(text);
      return;
    }
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
    }

    const start = performance.now();
    const chars = Array.from(text);

    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / durationMs);
      const settledCount = Math.floor(progress * chars.length);

      const next = chars
        .map((ch, idx) => {
          if (ch === ' ' || idx < settledCount) {
            return ch;
          }
          const randIdx = Math.floor((idx * 17 + now * 0.19) % GLYPHS.length);
          return GLYPHS[randIdx];
        })
        .join('');

      setDisplay(next);

      if (progress < 1) {
        rafRef.current = window.requestAnimationFrame(step);
      } else {
        setDisplay(text);
        rafRef.current = null;
      }
    };

    rafRef.current = window.requestAnimationFrame(step);
  }, [durationMs, reducedMotion, text]);

  useEffect(() => {
    const el = spanRef.current;
    if (!el || reducedMotion || typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !hasPlayedRef.current) {
          hasPlayedRef.current = true;
          runScramble();
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [reducedMotion, runScramble]);

  return (
    <span
      ref={spanRef}
      aria-label={text}
      onMouseEnter={scrambleOnHover ? runScramble : undefined}
      className={className}
    >
      {display}
    </span>
  );
}
