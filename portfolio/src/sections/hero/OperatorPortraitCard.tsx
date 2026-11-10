import { useRef, useState, type PointerEvent } from 'react';
import { PORTRAIT_ASSET, PROFILE } from '../../config/profile';
import { useIsTouch } from '../../hooks/useIsTouch';
import { playSound } from '../../lib/sound';

const CHAMFER_CLIP =
  'polygon(0 18px, 18px 0, calc(100% - 26px) 0, 100% 26px, 100% calc(100% - 18px), calc(100% - 18px) 100%, 26px 100%, 0 calc(100% - 26px))';

export interface OperatorPortraitCardProps {
  locale: 'en' | 'pt-BR';
  caption: string;
  role: string;
  levelPrefix: string;
  xpSuffix: string;
  level: number;
  xp: number;
  levelProgress: number;
  reducedMotion: boolean;
  konamiActive: boolean;
}

export function OperatorPortraitCard({
  locale,
  caption,
  role,
  levelPrefix,
  xpSuffix,
  level,
  xp,
  levelProgress,
  reducedMotion,
  konamiActive,
}: OperatorPortraitCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const isTouch = useIsTouch();
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 38, active: false });

  const canTilt = !isTouch && !reducedMotion;
  const altText = locale === 'pt-BR' ? PORTRAIT_ASSET.altPt : PORTRAIT_ASSET.altEn;
  const glitchOn = (tilt.active || konamiActive) && !reducedMotion;

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!canTilt || !cardRef.current) {
      return;
    }
    const rect = cardRef.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / Math.max(rect.width, 1);
    const py = (event.clientY - rect.top) / Math.max(rect.height, 1);
    const clampedX = Math.max(0, Math.min(1, px));
    const clampedY = Math.max(0, Math.min(1, py));

    setTilt({
      rx: (0.5 - clampedY) * 14,
      ry: (clampedX - 0.5) * 16,
      gx: Math.round(clampedX * 100),
      gy: Math.round(clampedY * 100),
      active: true,
    });
  };

  const handlePointerEnter = () => {
    playSound('hover');
    if (canTilt) {
      setTilt((prev) => ({ ...prev, active: true }));
    }
  };

  const handlePointerLeave = () => {
    setTilt({ rx: 0, ry: 0, gx: 50, gy: 38, active: false });
  };

  const transformStyle = canTilt
    ? {
        transform: `perspective(1100px) rotateX(${tilt.rx.toFixed(2)}deg) rotateY(${tilt.ry.toFixed(2)}deg) scale3d(${tilt.active ? '1.018, 1.018, 1.018' : '1, 1, 1'})`,
        transition: tilt.active
          ? 'transform 90ms linear'
          : 'transform 480ms cubic-bezier(0.16, 1, 0.3, 1)',
      }
    : undefined;

  return (
    <div className="relative mx-auto w-full max-w-[350px] sm:max-w-[390px] lg:mr-0 lg:ml-auto lg:max-w-[420px]">
      <div
        ref={cardRef}
        data-testid="operator-portrait-card"
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        style={transformStyle}
        className="group relative aspect-[4/5] w-full select-none will-change-transform"
      >
        {/* Outer HUD Corner Brackets */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-2 -left-2 z-20 h-5 w-5 border-t-2 border-l-2 border-primary transition-colors duration-300 group-hover:border-hot"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-2 -right-2 z-20 h-5 w-5 border-t-2 border-r-2 border-primary transition-colors duration-300 group-hover:border-hot"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-2 -left-2 z-20 h-5 w-5 border-b-2 border-l-2 border-primary transition-colors duration-300 group-hover:border-hot"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-2 -bottom-2 z-20 h-5 w-5 border-r-2 border-b-2 border-primary transition-colors duration-300 group-hover:border-hot"
        />

        {/* Chamfered Glowing Outer Rim */}
        <div
          style={{ clipPath: CHAMFER_CLIP }}
          className="relative h-full w-full bg-gradient-to-br from-hot/75 via-primary/35 to-crimson/65 p-[1.5px] shadow-[0_0_60px_-15px_rgba(255,31,61,0.55)]"
        >
          {/* Inner Chamfered Card Viewport */}
          <div
            style={{ clipPath: CHAMFER_CLIP }}
            className="relative h-full w-full overflow-hidden bg-surface"
          >
            {/* Primary Responsive Portrait (<picture> AVIF -> WebP -> JPG) */}
            <picture>
              <source
                srcSet={`${PORTRAIT_ASSET.avifSm} 480w, ${PORTRAIT_ASSET.avif} 960w`}
                sizes="(max-width: 640px) 350px, 420px"
                type="image/avif"
              />
              <source
                srcSet={`${PORTRAIT_ASSET.webpSm} 480w, ${PORTRAIT_ASSET.webp} 960w`}
                sizes="(max-width: 640px) 350px, 420px"
                type="image/webp"
              />
              <img
                src={PORTRAIT_ASSET.jpg}
                alt={altText}
                width={960}
                height={1200}
                decoding="async"
                fetchPriority="high"
                className="h-full w-full object-cover object-top contrast-125 brightness-95 grayscale-[72%] transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </picture>

            {/* RGB-Split Glitch Layers on Hover / Konami (lazy/cached AVIF so no duplicate WebP download on LCP) */}
            {glitchOn ? (
              <>
                <img
                  src={PORTRAIT_ASSET.avif}
                  alt=""
                  aria-hidden="true"
                  width={960}
                  height={1200}
                  decoding="async"
                  className="pointer-events-none absolute inset-0 h-full w-full translate-x-[-6px] translate-y-[-2px] object-cover object-top opacity-55 mix-blend-screen transition-all duration-150"
                  style={{ filter: 'grayscale(100%) sepia(100%) hue-rotate(325deg) saturate(600%)' }}
                />
                <img
                  src={PORTRAIT_ASSET.avif}
                  alt=""
                  aria-hidden="true"
                  width={960}
                  height={1200}
                  decoding="async"
                  className="pointer-events-none absolute inset-0 h-full w-full translate-x-[6px] translate-y-[2px] object-cover object-top opacity-40 mix-blend-screen transition-all duration-150"
                  style={{
                    filter: 'grayscale(100%) sepia(100%) hue-rotate(155deg) saturate(500%)',
                    clipPath: 'polygon(0 18%, 100% 18%, 100% 66%, 0 66%)',
                  }}
                />
              </>
            ) : null}

            {/* Crimson Duotone + Rim Lighting + Scanlines */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-blood/80 via-crimson/35 to-primary/25 mix-blend-multiply"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 mix-blend-screen"
              style={{
                background:
                  'radial-gradient(circle at 82% 18%, rgba(255,31,61,0.48), transparent 52%), radial-gradient(circle at 15% 65%, rgba(159,18,57,0.35), transparent 55%)',
              }}
            />
            <div aria-hidden="true" className="bg-scanlines pointer-events-none absolute inset-0" />

            {/* Cursor-Following Glare Highlight */}
            {canTilt ? (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 transition-opacity duration-300"
                style={{
                  opacity: tilt.active ? 1 : 0.35,
                  background: `radial-gradient(circle at ${tilt.gx}% ${tilt.gy}%, rgba(255,77,109,0.34) 0%, rgba(255,31,61,0.08) 34%, transparent 62%)`,
                }}
              />
            ) : null}

            {/* Top Character-Select Telemetry Bar */}
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between bg-gradient-to-b from-void/90 via-void/55 to-transparent px-4 pt-3.5 pb-6 font-mono text-[10px] tracking-[0.14em] uppercase">
              <span className="inline-flex items-center gap-1.5 text-ink/90">
                <span className="h-1.5 w-1.5 rounded-full bg-hot shadow-[0_0_8px_#ff4d6d]" />
                OP // {PROFILE.monogram}-01
              </span>

              <div className="flex items-center gap-2 rounded-full border border-primary/45 bg-void/85 px-2.5 py-1 backdrop-blur-md">
                <span className="font-bold text-primary">
                  {levelPrefix} {String(level).padStart(2, '0')}
                </span>
                <span className="h-1.5 w-10 overflow-hidden rounded-full bg-elevated">
                  <span
                    className="block h-full rounded-full bg-gradient-to-r from-primary to-hot"
                    style={{ width: `${Math.round(levelProgress * 100)}%` }}
                  />
                </span>
                <span className="text-muted">
                  {xp} {xpSuffix}
                </span>
              </div>
            </div>

            {/* Bottom Operator Dossier Plate */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-void via-void/92 to-transparent px-4 pt-12 pb-4">
              <p className="font-mono text-[10px] font-semibold tracking-[0.16em] text-hot uppercase">
                {caption}
              </p>
              <p className="mt-0.5 font-display text-lg leading-tight font-extrabold tracking-tight text-ink">
                {PROFILE.shortName}
              </p>
              <p className="font-sans text-xs text-muted">{role}</p>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-primary/25 pt-2.5 font-mono text-[10px] tracking-[0.12em] text-muted uppercase">
                <span>GOIÂNIA, BR</span>
                <span className="text-primary">·</span>
                <span>{PROFILE.timezone}</span>
                <span className="text-primary">·</span>
                <span className="text-ink">
                  {konamiActive ? 'OVERDRIVE' : `${levelPrefix} 0${level}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
