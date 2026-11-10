import { useEffect } from 'react';
import { useGame } from './GameProvider';

/**
 * Observes `#${id}` in the DOM and awards section discovery XP once when >=30% visible.
 */
export function useSectionVisit(id: string): void {
  const { state, visitSection } = useGame();
  const alreadyVisited = state.visitedSections.includes(id);

  useEffect(() => {
    if (alreadyVisited || typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    const element = document.getElementById(id);
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visitSection(id);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.06, rootMargin: '0px 0px -12% 0px' },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [id, alreadyVisited, visitSection]);
}
