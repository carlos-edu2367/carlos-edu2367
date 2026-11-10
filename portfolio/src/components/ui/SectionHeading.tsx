import type { ReactNode } from 'react';
import { RevealText } from './RevealText';
import { ScrambleText } from './ScrambleText';

export interface SectionHeadingProps {
  index: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  rightSlot?: ReactNode;
  className?: string;
}

export function SectionHeading({
  index,
  eyebrow,
  title,
  subtitle,
  rightSlot,
  className = '',
}: SectionHeadingProps) {
  return (
    <div
      className={`relative grid grid-cols-1 items-end gap-6 border-b border-primary/20 pb-8 lg:grid-cols-12 lg:gap-8 ${className}`.trim()}
    >
      <div className="lg:col-span-8">
        <div className="flex flex-wrap items-center gap-3">
          <span
            aria-hidden="true"
            className="inline-flex items-center justify-center rounded border border-primary/45 bg-primary/15 px-2.5 py-0.5 font-mono text-xs font-bold tracking-widest text-primary shadow-[0_0_16px_rgba(255,31,61,0.28)]"
          >
            {index}
          </span>
          <span className="h-px w-6 bg-primary/40" aria-hidden="true" />
          <p className="font-mono text-xs font-semibold tracking-[0.14em] text-hot uppercase">
            <ScrambleText text={eyebrow} />
          </p>
        </div>

        <h2 className="mt-4 font-display text-[clamp(2rem,4.5vw,3.75rem)] leading-[1.0] font-extrabold tracking-[-0.025em] text-ink">
          <RevealText text={title} />
        </h2>

        {subtitle ? (
          <p className="mt-4 max-w-2xl text-[clamp(1rem,1.2vw,1.15rem)] leading-relaxed text-muted">
            {subtitle}
          </p>
        ) : null}
      </div>

      <div className="flex items-end justify-between gap-4 lg:col-span-4 lg:justify-end">
        {rightSlot ? (
          rightSlot
        ) : (
          <svg
            aria-hidden="true"
            viewBox="0 0 160 96"
            className="hidden h-20 w-36 select-none overflow-visible lg:block xl:h-24 xl:w-40"
          >
            <text
              x="158"
              y="84"
              textAnchor="end"
              fill="rgba(255, 31, 61, 0.08)"
              stroke="rgba(255, 31, 61, 0.34)"
              strokeWidth="1.5"
              fontFamily="Syne, sans-serif"
              fontWeight="800"
              fontSize="88"
              letterSpacing="-3"
            >
              {index}
            </text>
          </svg>
        )}
      </div>
    </div>
  );
}
