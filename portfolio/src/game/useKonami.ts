import { useEffect, useRef } from 'react';

const KONAMI_SEQUENCE = [
  'arrowup',
  'arrowup',
  'arrowdown',
  'arrowdown',
  'arrowleft',
  'arrowright',
  'arrowleft',
  'arrowright',
  'b',
  'a',
] as const;

export function useKonami(callback: () => void): void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    let cursor = 0;

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      const key = event.key.toLowerCase();
      if (key === KONAMI_SEQUENCE[cursor]) {
        cursor += 1;
        if (cursor === KONAMI_SEQUENCE.length) {
          cursor = 0;
          callbackRef.current();
        }
      } else {
        cursor = key === KONAMI_SEQUENCE[0] ? 1 : 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
}
