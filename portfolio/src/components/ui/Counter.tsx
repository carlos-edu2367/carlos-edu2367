import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export interface CounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  durationMs?: number;
  className?: string;
}

export function Counter({
  value,
  prefix = '',
  suffix = '',
  durationMs = 1100,
  className = '',
}: CounterProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [current, setCurrent] = useState<number>(value);
  const spanRef = useRef<HTMLSpanElement | null>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    setCurrent(value);
  }, [value]);

  useEffect(() => {
    const el = spanRef.current;
    if (!el || reducedMotion || typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    let rafId = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !animatedRef.current) {
          animatedRef.current = true;
          const start = performance.now();
          setCurrent(0);

          const tick = (now: number) => {
            const progress = Math.min(1, (now - start) / durationMs);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCurrent(Math.round(eased * value));
            if (progress < 1) {
              rafId = window.requestAnimationFrame(tick);
            }
          };

          rafId = window.requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [durationMs, reducedMotion, value]);

  return (
    <span ref={spanRef} className={`tabular-nums ${className}`.trim()}>
      {prefix}
      {current}
      {suffix}
    </span>
  );
}
