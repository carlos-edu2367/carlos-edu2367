import { useEffect, type RefObject } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

/**
 * Lightweight RAF scroll-linked vertical parallax for `[data-parallax]` elements
 * inside a section — zero GSAP/ScrollTrigger runtime dependency (~110 KB saved).
 */
export function useSectionPolish(sectionRef: RefObject<HTMLElement | null>): void {
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion || typeof window === 'undefined') {
      return;
    }
    if (typeof navigator !== 'undefined' && /jsdom/i.test(navigator.userAgent)) {
      return;
    }

    const el = sectionRef.current;
    if (!el) {
      return;
    }

    const parallaxTargets = Array.from(el.querySelectorAll<HTMLElement>('[data-parallax]'));
    if (parallaxTargets.length === 0) {
      return;
    }

    let rafId = 0;

    const updateParallax = () => {
      rafId = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      if (rect.bottom < -200 || rect.top > vh + 200) {
        return;
      }
      const totalTravel = vh + rect.height;
      const progress = Math.min(1, Math.max(0, (vh - rect.top) / Math.max(1, totalTravel)));
      const centered = 1 - progress * 2; // +1 entering bottom -> -1 leaving top

      for (const node of parallaxTargets) {
        const speed = Number(node.dataset.parallax || '28');
        const yOffset = centered * speed;
        node.style.transform = `translate3d(0, ${yOffset.toFixed(1)}px, 0)`;
      }
    };

    const onScroll = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(updateParallax);
      }
    };

    updateParallax();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      for (const node of parallaxTargets) {
        node.style.transform = '';
      }
    };
  }, [sectionRef, reducedMotion]);
}

/**
 * Locks page & Lenis background scroll while a modal overlay is open.
 */
export function useScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked || typeof document === 'undefined') {
      return;
    }
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.setAttribute('data-lenis-prevent', '');

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.documentElement.removeAttribute('data-lenis-prevent');
    };
  }, [locked]);
}
