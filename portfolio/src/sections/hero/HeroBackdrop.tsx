import { Component, type ReactNode } from 'react';

export interface HeroBackdropProps {
  konamiActive?: boolean;
  pulse?: boolean;
}

export function HeroBackdrop({ konamiActive = false, pulse = false }: HeroBackdropProps) {
  return (
    <div
      aria-hidden="true"
      data-testid="hero-backdrop"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <div
        className={`absolute top-1/2 left-[54%] h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px] transition-opacity duration-700 ${
          pulse ? 'animate-pulse opacity-85' : 'opacity-70'
        }`}
        style={{
          background: konamiActive
            ? 'radial-gradient(circle, rgba(255,77,109,0.42) 0%, rgba(255,31,61,0.24) 38%, rgba(7,4,10,0) 72%)'
            : 'radial-gradient(circle, rgba(255,31,61,0.34) 0%, rgba(159,18,57,0.22) 40%, rgba(7,4,10,0) 72%)',
        }}
      />

      <div
        className="absolute -top-28 -left-24 h-[28rem] w-[28rem] rounded-full opacity-55 blur-[110px]"
        style={{
          background:
            'radial-gradient(circle, rgba(127,29,29,0.42) 0%, rgba(159,18,57,0.14) 52%, transparent 75%)',
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,31,61,0.14) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,31,61,0.14) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage: 'radial-gradient(ellipse 80% 70% at 55% 48%, #000 25%, transparent 80%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 80% 70% at 55% 48%, #000 25%, transparent 80%)',
        }}
      />

      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-void via-void/70 to-transparent" />

      <span className="absolute top-6 left-6 hidden font-mono text-[11px] text-primary/40 select-none sm:block">
        +
      </span>
      <span className="absolute top-6 right-6 hidden font-mono text-[11px] text-primary/40 select-none sm:block">
        +
      </span>
      <span className="absolute bottom-8 left-6 hidden font-mono text-[11px] text-primary/40 select-none sm:block">
        +
      </span>
      <span className="absolute right-6 bottom-8 hidden font-mono text-[11px] text-primary/40 select-none sm:block">
        +
      </span>
    </div>
  );
}

interface BoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
}

interface BoundaryState {
  hasError: boolean;
}

export class CanvasErrorBoundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { hasError: false };

  static getDerivedStateFromError(): BoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
