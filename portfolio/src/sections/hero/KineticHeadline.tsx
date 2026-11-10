import { useEffect, useRef, useState } from 'react';
import { PROFILE } from '../../config/profile';
import { playSound } from '../../lib/sound';

const SCRAMBLE_GLYPHS = ['#', '/', 'Δ', '0', '1', 'Ξ', 'Σ', '×', 'λ'] as const;

interface KineticCharProps {
  char: string;
  index: number;
  isAccent: boolean;
  bootReady: boolean;
  reducedMotion: boolean;
  konamiActive: boolean;
}

function KineticChar({
  char,
  index,
  isAccent,
  bootReady,
  reducedMotion,
  konamiActive,
}: KineticCharProps) {
  const [displayChar, setDisplayChar] = useState<string>(char);
  const [hovered, setHovered] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setDisplayChar(char);
  }, [char]);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
      }
    };
  }, []);

  const handleEnter = () => {
    if (reducedMotion) {
      return;
    }
    setHovered(true);
    playSound('hover');
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
    }
    let step = 0;
    timerRef.current = window.setInterval(() => {
      step += 1;
      if (step >= 4) {
        if (timerRef.current !== null) {
          window.clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setDisplayChar(char);
      } else {
        const glyph = SCRAMBLE_GLYPHS[(index + step * 3) % SCRAMBLE_GLYPHS.length];
        setDisplayChar(glyph);
      }
    }, 38);
  };

  const handleLeave = () => {
    setHovered(false);
  };

  const colorClass = isAccent
    ? konamiActive
      ? 'text-hot text-glow-red'
      : 'text-primary text-glow-red'
    : 'text-ink';

  if (reducedMotion) {
    return <span className={`inline-block ${colorClass}`}>{char}</span>;
  }

  return (
    <span className="inline-block py-[0.04em] align-bottom [clip-path:inset(-40%_-35%_-6%_-35%)]">
      <span
        onPointerEnter={handleEnter}
        onPointerLeave={handleLeave}
        style={{
          transitionDelay: hovered ? '0ms' : `${Math.min(index * 16, 560)}ms`,
          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className={`inline-block cursor-default select-none will-change-transform ${colorClass} ${
          bootReady ? 'translate-y-0 opacity-100' : 'translate-y-[105%] opacity-0'
        } ${
          hovered
            ? '-translate-y-1 scale-110 -skew-x-6 !text-hot drop-shadow-[0_0_16px_rgba(255,77,109,0.9)] duration-150'
            : 'transition-[transform,opacity] duration-500'
        }`}
      >
        {displayChar}
      </span>
    </span>
  );
}

interface WordGroupProps {
  text: string;
  startIndex: number;
  isAccent: boolean;
  bootReady: boolean;
  reducedMotion: boolean;
  konamiActive: boolean;
}

function WordGroup({
  text,
  startIndex,
  isAccent,
  bootReady,
  reducedMotion,
  konamiActive,
}: WordGroupProps) {
  const words = text.trim().split(/\s+/);
  let cursor = startIndex;

  return (
    <>
      {words.map((word, wIdx) => {
        const wordStart = cursor;
        cursor += word.length;
        return (
          <span key={`${word}-${wIdx}`} className="inline-block whitespace-nowrap">
            {Array.from(word).map((ch, cIdx) => (
              <KineticChar
                key={`${wIdx}-${cIdx}`}
                char={ch}
                index={wordStart + cIdx}
                isAccent={isAccent}
                bootReady={bootReady}
                reducedMotion={reducedMotion}
                konamiActive={konamiActive}
              />
            ))}
            {wIdx < words.length - 1 ? <span className="inline-block">&nbsp;</span> : null}
          </span>
        );
      })}
    </>
  );
}

export interface KineticHeadlineProps {
  availableBadge: string;
  role: string;
  line1: string;
  accent: string;
  line2: string;
  bootReady: boolean;
  reducedMotion: boolean;
  konamiActive: boolean;
}

export function KineticHeadline({
  availableBadge,
  role,
  line1,
  accent,
  line2,
  bootReady,
  reducedMotion,
  konamiActive,
}: KineticHeadlineProps) {
  const fullLabel = `${line1} ${accent} ${line2}`;
  const accentOffset = line1.replace(/\s+/g, '').length;
  const line2Offset = accentOffset + accent.replace(/\s+/g, '').length;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-elevated/85 px-3 py-1 font-mono text-[10px] font-semibold tracking-[0.13em] text-ink uppercase shadow-[0_0_24px_-6px_rgba(255,31,61,0.45)] backdrop-blur-md sm:px-3.5 sm:py-1.5 sm:text-[11px] sm:tracking-[0.14em]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-hot opacity-80" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_#ff1f3d]" />
          </span>
          {availableBadge}
        </span>

        <span className="rounded-full border border-primary/20 bg-surface/75 px-2.5 py-1 font-mono text-[10px] tracking-[0.12em] text-muted uppercase backdrop-blur-sm sm:px-3 sm:py-1.5 sm:text-[11px]">
          GOIÂNIA, BR · {PROFILE.timezone}
        </span>

        {konamiActive ? (
          <span className="glow-hot rounded-full border border-hot/70 bg-primary/25 px-3 py-1 font-mono text-[10px] font-bold tracking-[0.16em] text-hot uppercase">
            OVERDRIVE // KONAMI
          </span>
        ) : null}
      </div>

      <p className="mt-3.5 font-mono text-[11px] font-semibold tracking-[0.15em] text-hot uppercase sm:mt-5 sm:text-xs sm:tracking-[0.16em]">
        // 00 · {PROFILE.shortName.toUpperCase()} — {role}
      </p>

      <h1
        aria-label={fullLabel}
        className="mt-2 font-display text-[clamp(1.95rem,7.8vw,3.15rem)] leading-[0.94] font-extrabold tracking-[-0.035em] sm:mt-3 sm:text-[clamp(2.85rem,5.4vw,4.35rem)] lg:text-[clamp(2.95rem,4.5vw,4.65rem)]"
      >
        <span aria-hidden="true" className="block">
          <WordGroup
            text={line1}
            startIndex={0}
            isAccent={false}
            bootReady={bootReady}
            reducedMotion={reducedMotion}
            konamiActive={konamiActive}
          />
        </span>
        <span aria-hidden="true" className="block">
          <WordGroup
            text={accent}
            startIndex={accentOffset}
            isAccent={true}
            bootReady={bootReady}
            reducedMotion={reducedMotion}
            konamiActive={konamiActive}
          />
        </span>
        <span aria-hidden="true" className="block">
          <WordGroup
            text={line2}
            startIndex={line2Offset}
            isAccent={false}
            bootReady={bootReady}
            reducedMotion={reducedMotion}
            konamiActive={konamiActive}
          />
        </span>
      </h1>
    </div>
  );
}
