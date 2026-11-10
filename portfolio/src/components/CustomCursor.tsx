import { useEffect, useRef, useState } from 'react';
import { useIsTouch } from '../hooks/useIsTouch';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

export function CustomCursor() {
  const isTouch = useIsTouch();
  const hasFinePointer = useMediaQuery('(hover: hover) and (pointer: fine)');
  const reducedMotion = usePrefersReducedMotion();

  const enabled = hasFinePointer && !isTouch && !reducedMotion;

  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      document.documentElement.classList.remove('has-custom-cursor');
      return;
    }

    document.documentElement.classList.add('has-custom-cursor');

    const target = { x: -100, y: -100 };
    const ring = { x: -100, y: -100 };
    let rafId = 0;

    const updateInteractiveState = (el: Element | null) => {
      if (!el) {
        setHovered(false);
        setLabel(null);
        return;
      }
      const labelled = el.closest('[data-cursor-label]');
      const magnetic = el.closest('[data-magnetic], a, button, [role="button"]');
      setHovered(Boolean(magnetic || labelled));
      setLabel(labelled?.getAttribute('data-cursor-label') || null);
    };

    const animate = () => {
      const dx = target.x - ring.x;
      const dy = target.y - ring.y;
      ring.x += dx * 0.18;
      ring.y += dy * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x.toFixed(2)}px, ${ring.y.toFixed(2)}px, 0) translate(-50%, -50%)`;
      }
      if (Math.abs(dx) > 0.15 || Math.abs(dy) > 0.15) {
        rafId = window.requestAnimationFrame(animate);
      } else {
        rafId = 0;
      }
    };

    const startRingFollow = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(animate);
      }
    };

    const onMove = (event: MouseEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
      if (!visible) {
        ring.x = event.clientX;
        ring.y = event.clientY;
        setVisible(true);
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`;
      }
      startRingFollow();
      updateInteractiveState(event.target as Element | null);
    };

    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onLeave = () => setVisible(false);

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.addEventListener('mouseleave', onLeave);

    return () => {
      document.documentElement.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseleave', onLeave);
      window.cancelAnimationFrame(rafId);
    };
  }, [enabled, visible]);

  if (!enabled) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-[90] transition-opacity duration-200 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_#ff1f3d] transition-transform duration-150 ${
          pressed ? 'scale-75' : ''
        }`}
      />
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 flex items-center justify-center rounded-full border transition-[width,height,border-color,background-color] duration-200 ${
          hovered
            ? 'h-12 w-12 border-hot bg-primary/15 shadow-[0_0_24px_rgba(255,31,61,0.35)]'
            : 'h-8 w-8 border-primary/55 bg-transparent'
        } ${pressed ? 'scale-90' : ''}`}
      >
        {label ? (
          <span className="translate-y-8 rounded border border-primary/40 bg-surface/95 px-2 py-0.5 font-mono text-[10px] font-semibold tracking-widest whitespace-nowrap text-ink uppercase">
            {label}
          </span>
        ) : null}
      </div>
    </div>
  );
}
