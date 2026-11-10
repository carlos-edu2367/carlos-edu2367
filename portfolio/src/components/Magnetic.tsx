import { useRef, useState, type MouseEvent, type ReactNode } from 'react';
import { useIsTouch } from '../hooks/useIsTouch';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { playSound } from '../lib/sound';

export interface MagneticProps {
  children: ReactNode;
  strength?: number;
  cursorLabel?: string;
  className?: string;
}

export function Magnetic({
  children,
  strength = 0.28,
  cursorLabel,
  className = '',
}: MagneticProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const isTouch = useIsTouch();
  const reducedMotion = usePrefersReducedMotion();
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const disabled = isTouch || reducedMotion;

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (disabled || !ref.current) {
      return;
    }
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    setOffset({
      x: (event.clientX - centerX) * strength,
      y: (event.clientY - centerY) * strength,
    });
  };

  const handleMouseEnter = () => {
    playSound('hover');
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  return (
    <div
      ref={ref}
      data-magnetic=""
      data-cursor-label={cursorLabel}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={
        disabled
          ? undefined
          : {
              transform: `translate3d(${offset.x.toFixed(2)}px, ${offset.y.toFixed(2)}px, 0)`,
              transition:
                offset.x === 0 && offset.y === 0
                  ? 'transform 380ms cubic-bezier(0.16, 1, 0.3, 1)'
                  : 'transform 70ms linear',
            }
      }
      className={`inline-block ${className}`.trim()}
    >
      {children}
    </div>
  );
}
