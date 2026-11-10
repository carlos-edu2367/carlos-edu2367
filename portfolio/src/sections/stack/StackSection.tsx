import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Counter } from '../../components/ui/Counter';
import { useSectionPolish } from '../../components/ui/gsapScroll';
import { Marquee } from '../../components/ui/Marquee';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { STACK_CATEGORIES, type StackCategoryKey } from '../../data/stack';
import { useSectionVisit } from '../../game/useSectionVisit';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { useI18n } from '../../i18n/I18nProvider';
import { playSound } from '../../lib/sound';
import { StackFallback2D } from './StackFallback2D';
import { StackMatrix } from './StackMatrix';

const LazyConstellation = lazy(() => import('../../three/constellation/Constellation'));

function detectCanRender3D(): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false;
  }
  if (typeof navigator !== 'undefined' && /jsdom/i.test(navigator.userAgent)) {
    return false;
  }
  const cores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 4 : 4;
  if (window.innerWidth < 480 && cores <= 2) {
    return false;
  }
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: true }) ||
      canvas.getContext('webgl', { failIfMajorPerformanceCaveat: true });
    return Boolean(gl);
  } catch {
    return false;
  }
}

export function StackSection() {
  const { t } = useI18n();
  const reducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const constellationSlotRef = useRef<HTMLDivElement | null>(null);
  const [activeCategory, setActiveCategory] = useState<StackCategoryKey | null>(null);
  const [canWebGL, setCanWebGL] = useState(false);
  const [isNearStack, setIsNearStack] = useState(false);

  useSectionVisit('stack');
  useSectionPolish(sectionRef);

  useEffect(() => {
    setCanWebGL(detectCanRender3D());
  }, []);

  useEffect(() => {
    const slot = constellationSlotRef.current;
    if (!slot || typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsNearStack(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.some((entry) => entry.isIntersecting);
        window.setTimeout(() => setIsNearStack(intersecting), 0);
      },
      { rootMargin: '550px 0px', threshold: 0 },
    );
    observer.observe(slot);
    return () => observer.disconnect();
  }, []);

  const allTech = useMemo(() => STACK_CATEGORIES.flatMap((c) => c.items), []);
  const midpoint = Math.ceil(allTech.length / 2);
  const rowA = useMemo(() => allTech.slice(0, midpoint), [allTech, midpoint]);
  const rowB = useMemo(() => allTech.slice(midpoint), [allTech, midpoint]);

  const show3D = canWebGL && !reducedMotion && isNearStack;

  return (
    <section
      ref={sectionRef}
      id="stack"
      aria-label={t.stack.title}
      className="relative overflow-x-clip border-b border-primary/15 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          index="03"
          eyebrow={t.stack.eyebrow}
          title={t.stack.title}
          subtitle={t.stack.subtitle}
          rightSlot={
            <div className="flex items-center gap-5 rounded-xl border border-primary/25 bg-surface/80 px-4 py-2.5 font-mono text-xs">
              <div>
                <span className="block text-[10px] tracking-widest text-dim uppercase">
                  {t.stack.nodesLabel}
                </span>
                <Counter value={allTech.length} className="text-base font-bold text-ink" />
              </div>
              <div className="h-6 w-px bg-primary/20" />
              <div>
                <span className="block text-[10px] tracking-widest text-dim uppercase">
                  {t.stack.domainsLabel}
                </span>
                <Counter
                  value={STACK_CATEGORIES.length}
                  prefix="0"
                  className="text-base font-bold text-primary"
                />
              </div>
            </div>
          }
        />

        {/* Domain Filter Bar */}
        <div
          role="toolbar"
          aria-label={t.stack.domainsLabel}
          className="mt-8 flex flex-wrap gap-2"
        >
          <button
            type="button"
            aria-pressed={activeCategory === null}
            onClick={() => {
              playSound('click');
              setActiveCategory(null);
            }}
            className={`rounded-full border px-3.5 py-1.5 font-mono text-xs tracking-wider uppercase transition ${
              activeCategory === null
                ? 'btn-crimson font-bold'
                : 'border-primary/25 bg-surface text-muted hover:border-primary/50 hover:text-ink'
            }`}
          >
            {t.stack.allFilter}
          </button>

          {STACK_CATEGORIES.map((cat) => {
            const active = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  playSound('click');
                  setActiveCategory(active ? null : cat.id);
                }}
                className={`rounded-full border px-3.5 py-1.5 font-mono text-xs tracking-wider uppercase transition ${
                  active
                    ? 'border-primary bg-primary/20 font-bold text-hot shadow-[0_0_16px_rgba(255,31,61,0.3)]'
                    : 'border-primary/25 bg-surface text-muted hover:border-primary/50 hover:text-ink'
                }`}
              >
                {t.stack.categories[cat.id]}
              </button>
            );
          })}
        </div>

        {/* 3D Constellation or 2D Tactical Fallback */}
        <div ref={constellationSlotRef} className="mt-6">
          {show3D ? (
            <Suspense
              fallback={
                <StackFallback2D
                  activeCategory={activeCategory}
                  categoryLabels={t.stack.categories}
                  fallbackNote={t.stack.fallbackNote}
                  onSelectCategory={setActiveCategory}
                />
              }
            >
              <LazyConstellation
                activeCategory={activeCategory}
                categoryLabels={t.stack.categories}
                hintText={t.stack.constellationHint}
                onSelectCategory={setActiveCategory}
              />
            </Suspense>
          ) : (
            <StackFallback2D
              activeCategory={activeCategory}
              categoryLabels={t.stack.categories}
              fallbackNote={t.stack.fallbackNote}
              onSelectCategory={setActiveCategory}
            />
          )}
        </div>
      </div>

      {/* Dual-Row Velocity Marquee */}
      <div className="mt-12 border-y border-primary/15 bg-surface/55 py-3">
        <Marquee items={rowA} baseSpeed={34} />
        <Marquee items={rowB} baseSpeed={30} reverse />
      </div>

      {/* Accessible SEO Specification Matrix */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <StackMatrix activeCategory={activeCategory} onSelectCategory={setActiveCategory} />
      </div>
    </section>
  );
}
