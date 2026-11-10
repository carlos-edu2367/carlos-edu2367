import { useRef, useState, type MouseEvent, type ReactNode } from 'react';
import { useIsTouch } from '../../hooks/useIsTouch';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { playSound } from '../../lib/sound';

export interface TiltCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  magneticStrength?: number;
  cursorLabel?: string;
  glareColor?: string;
}

export function TiltCard({
  children,
  className = '',
  maxTilt = 8,
  magneticStrength = 0.06,
  cursorLabel,
  glareColor = 'rgba(255, 31, 61, 0.22)',
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const isTouch = useIsTouch();
  const reducedMotion = usePrefersReducedMotion();
  const disabled = isTouch || reducedMotion;

  const [state, setState] = useState({
    rx: 0,
    ry: 0,
    tx: 0,
    ty: 0,
    gx: 50,
    gy: 50,
    active: false,
  });

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (disabled || !cardRef.current) {
      return;
    }
    const rect = cardRef.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;

    const ry = (px - 0.5) * maxTilt * 2;
    const rx = (0.5 - py) * maxTilt * 2;
    const tx = (event.clientX - (rect.left + rect.width / 2)) * magneticStrength;
    const ty = (event.clientY - (rect.top + rect.height / 2)) * magneticStrength;

    setState({
      rx,
      ry,
      tx,
      ty,
      gx: Math.round(px * 100),
      gy: Math.round(py * 100),
      active: true,
    });
  };

  const handleMouseEnter = () => {
    playSound('hover');
  };

  const handleMouseLeave = () => {
    setState((prev) => ({ ...prev, rx: 0, ry: 0, tx: 0, ty: 0, active: false }));
  };

  return (
    <div
      ref={cardRef}
      data-magnetic=""
      data-cursor-label={cursorLabel}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={
        disabled
          ? undefined
          : {
              transform: `perspective(1100px) translate3d(${state.tx.toFixed(1)}px, ${state.ty.toFixed(1)}px, 0) rotateX(${state.rx.toFixed(2)}deg) rotateY(${state.ry.toFixed(2)}deg)`,
              transition: state.active
                ? 'transform 90ms linear'
                : 'transform 480ms cubic-bezier(0.16, 1, 0.3, 1)',
            }
      }
      className={`group relative overflow-hidden rounded-2xl border border-primary/25 bg-surface/90 will-change-transform ${className}`.trim()}
    >
      {!disabled ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
          style={{
            opacity: state.active ? 1 : 0,
            background: `radial-gradient(420px circle at ${state.gx}% ${state.gy}%, ${glareColor}, transparent 68%)`,
          }}
        />
      ) : null}

      {/* Tactical corner brackets */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-2.5 left-2.5 z-20 h-2.5 w-2.5 border-t border-l border-primary/60 transition group-hover:border-hot"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-2.5 right-2.5 z-20 h-2.5 w-2.5 border-t border-r border-primary/60 transition group-hover:border-hot"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-2.5 left-2.5 z-20 h-2.5 w-2.5 border-b border-l border-primary/60 transition group-hover:border-hot"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-2.5 bottom-2.5 z-20 h-2.5 w-2.5 border-r border-b border-primary/60 transition group-hover:border-hot"
      />

      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
