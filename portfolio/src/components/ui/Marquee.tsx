import { useEffect, useRef, type ReactNode } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export interface MarqueeProps {
  items: string[];
  baseSpeed?: number;
  reverse?: boolean;
  className?: string;
  renderItem?: (item: string, index: number) => ReactNode;
}

export function Marquee({
  items,
  baseSpeed = 38,
  reverse = false,
  className = '',
  renderItem,
}: MarqueeProps) {
  const reducedMotion = usePrefersReducedMotion();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    if (reducedMotion || typeof window === 'undefined') {
      return;
    }
    if (typeof navigator !== 'undefined' && /jsdom/i.test(navigator.userAgent)) {
      return;
    }

    const wrapper = wrapperRef.current;
    const track = trackRef.current;
    if (!wrapper || !track) {
      return;
    }

    let rafId = 0;
    let inView = false;
    let halfWidth = 0;
    let offset = 0;
    let lastTime = performance.now();
    let lastScrollY = window.scrollY;
    let velocityBoost = 0;
    let directionSign = reverse ? -1 : 1;

    const measure = () => {
      halfWidth = track.scrollWidth / 2;
    };
    measure();

    const resizeObs =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => measure()) : null;
    resizeObs?.observe(track);

    const tick = (now: number) => {
      if (!inView) {
        rafId = 0;
        return;
      }
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      if (Math.abs(scrollDelta) > 0.5) {
        const scrollSign = scrollDelta > 0 ? 1 : -1;
        directionSign = (reverse ? -1 : 1) * scrollSign;
        velocityBoost = Math.min(220, velocityBoost + Math.abs(scrollDelta) * 2.4);
      } else {
        velocityBoost *= 0.92;
      }

      if (!pausedRef.current && halfWidth > 0) {
        const speed = baseSpeed + velocityBoost;
        offset -= directionSign * speed * dt;
        if (offset <= -halfWidth) {
          offset += halfWidth;
        } else if (offset > 0) {
          offset -= halfWidth;
        }
        track.style.transform = `translate3d(${offset.toFixed(2)}px, 0, 0)`;
      }

      rafId = window.requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (!rafId) {
        lastTime = performance.now();
        lastScrollY = window.scrollY;
        rafId = window.requestAnimationFrame(tick);
      }
    };

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) => {
          inView = entries.some((e) => e.isIntersecting);
          if (inView) {
            if (halfWidth <= 0) {
              measure();
            }
            startLoop();
          } else if (rafId) {
            window.cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { rootMargin: '160px 0px', threshold: 0 },
      );
      io.observe(wrapper);

      return () => {
        io.disconnect();
        resizeObs?.disconnect();
        if (rafId) {
          window.cancelAnimationFrame(rafId);
        }
      };
    }

    inView = true;
    startLoop();
    return () => {
      resizeObs?.disconnect();
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [baseSpeed, reducedMotion, reverse]);

  const defaultRender = (item: string, idx: number) => (
    <span
      key={`${item}-${idx}`}
      className="inline-flex items-center gap-3 font-mono text-xs tracking-widest text-muted uppercase transition hover:text-ink"
    >
      <span className="h-1.5 w-1.5 rotate-45 bg-primary/80" aria-hidden="true" />
      <span>{item}</span>
    </span>
  );

  const render = renderItem ?? defaultRender;

  if (reducedMotion) {
    return (
      <div className={`flex flex-wrap gap-4 py-2 ${className}`.trim()}>
        {items.map((item, idx) => render(item, idx))}
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
      className={`relative overflow-hidden mask-x-fade select-none ${className}`.trim()}
      style={{
        maskImage:
          'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
      }}
    >
      <div ref={trackRef} className="flex w-max items-center gap-8 py-2.5 will-change-transform">
        <div className="flex shrink-0 items-center gap-8">
          {items.map((item, idx) => render(item, idx))}
        </div>
        <div aria-hidden="true" className="flex shrink-0 items-center gap-8">
          {items.map((item, idx) => render(item, idx + items.length))}
        </div>
      </div>
    </div>
  );
}
