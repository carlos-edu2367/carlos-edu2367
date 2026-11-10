import { useCallback, useEffect } from 'react';
import Lenis from 'lenis';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

export interface ScrollToOptions {
  offset?: number;
  immediate?: boolean;
}

let sharedLenis: Lenis | null = null;
let sharedRafId: number | null = null;
let subscriberCount = 0;

function startSharedLenis(): void {
  if (sharedLenis || typeof window === 'undefined') {
    return;
  }
  const instance = new Lenis({
    lerp: 0.1,
    smoothWheel: true,
  });
  sharedLenis = instance;

  const tick = (time: number) => {
    instance.raf(time);
    sharedRafId = window.requestAnimationFrame(tick);
  };
  sharedRafId = window.requestAnimationFrame(tick);
}

function stopSharedLenis(): void {
  if (sharedRafId !== null && typeof window !== 'undefined') {
    window.cancelAnimationFrame(sharedRafId);
    sharedRafId = null;
  }
  if (sharedLenis) {
    sharedLenis.destroy();
    sharedLenis = null;
  }
}

export function useLenis() {
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      stopSharedLenis();
      return;
    }

    subscriberCount += 1;
    startSharedLenis();

    return () => {
      subscriberCount = Math.max(0, subscriberCount - 1);
      if (subscriberCount === 0) {
        stopSharedLenis();
      }
    };
  }, [reducedMotion]);

  const scrollTo = useCallback(
    (target: string | number | HTMLElement, options?: ScrollToOptions) => {
      if (typeof window === 'undefined') {
        return;
      }

      const headerEl = document.querySelector('header');
      const defaultOffset = headerEl ? -(headerEl.offsetHeight + 8) : -72;
      const offset = options?.offset ?? defaultOffset;
      const normalized =
        typeof target === 'string' && !target.startsWith('#') ? `#${target}` : target;

      if (sharedLenis && !reducedMotion) {
        sharedLenis.scrollTo(normalized, {
          offset,
          immediate: options?.immediate ?? false,
        });
        return;
      }

      const behavior: ScrollBehavior =
        reducedMotion || options?.immediate ? 'auto' : 'smooth';

      if (typeof normalized === 'number') {
        window.scrollTo({ top: normalized, behavior });
        return;
      }

      const el =
        typeof normalized === 'string'
          ? document.querySelector<HTMLElement>(normalized)
          : normalized;

      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY + offset;
        window.scrollTo({ top: Math.max(0, top), behavior });
      }
    },
    [reducedMotion],
  );

  return { scrollTo };
}
