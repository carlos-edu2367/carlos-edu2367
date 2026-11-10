import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import type { StackCategoryKey } from '../../data/stack';
import type { TechNode } from './constellationData';
import { ConstellationScene } from './ConstellationScene';

export interface ConstellationProps {
  activeCategory: StackCategoryKey | null;
  categoryLabels: Record<StackCategoryKey, string>;
  hintText: string;
  onSelectCategory: (cat: StackCategoryKey | null) => void;
}

export default function Constellation({
  activeCategory,
  categoryLabels,
  hintText,
  onSelectCategory,
}: ConstellationProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const tooltipElRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<TechNode | null>(null);
  const [isTabVisible, setIsTabVisible] = useState<boolean>(() =>
    typeof document === 'undefined' ? true : document.visibilityState === 'visible',
  );

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el || typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        setInView(entries.some((entry) => entry.isIntersecting));
      },
      { rootMargin: '80px 0px', threshold: 0.02 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }
    const onVisibility = () => {
      setIsTabVisible(document.visibilityState === 'visible');
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  const frameloop: 'always' | 'never' = inView && isTabVisible ? 'always' : 'never';

  return (
    <div
      ref={wrapperRef}
      className="relative h-[420px] w-full overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-b from-surface/90 via-void to-surface/90 sm:h-[500px]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,31,61,0.12),transparent_68%)]"
      />

      <Canvas
        frameloop={frameloop}
        dpr={[1, 1.75]}
        camera={{ position: [0, 1.8, 8.2], fov: 46 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ConstellationScene
          activeCategory={activeCategory}
          hoveredNode={hoveredNode}
          onHoverNode={setHoveredNode}
          onSelectCategory={onSelectCategory}
          tooltipElRef={tooltipElRef}
        />
      </Canvas>

      {/* Top Active Domain Readout */}
      {activeCategory ? (
        <div className="pointer-events-none absolute top-3 left-4 flex items-center gap-2 rounded-lg border border-primary/55 bg-void/90 px-3 py-1.5 font-mono text-[10px] font-bold tracking-widest text-hot uppercase shadow-[0_0_18px_rgba(255,31,61,0.35)] backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-hot shadow-[0_0_8px_#ff4d6d]" />
          <span>{categoryLabels[activeCategory]}</span>
        </div>
      ) : null}

      {/* Floating 3D-Projected Hovered Node Label */}
      <div
        ref={tooltipElRef}
        aria-hidden="true"
        className={`pointer-events-none absolute top-0 left-0 z-20 rounded-lg border border-hot/70 bg-surface/95 px-3 py-1.5 shadow-[0_10px_30px_rgba(255,31,61,0.45)] backdrop-blur-md transition-opacity duration-150 ${
          hoveredNode ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {hoveredNode ? (
          <>
            <p className="font-mono text-[9px] tracking-widest whitespace-nowrap text-hot uppercase">
              {categoryLabels[hoveredNode.category]}
            </p>
            <p className="font-mono text-xs font-bold whitespace-nowrap text-ink">
              {hoveredNode.label}
            </p>
          </>
        ) : null}
      </div>

      <div className="pointer-events-none absolute right-4 bottom-3 left-4 flex items-center justify-between font-mono text-[10px] tracking-widest text-muted uppercase">
        <span className="rounded border border-primary/25 bg-void/85 px-2.5 py-1">{hintText}</span>
        <span className="hidden rounded border border-primary/25 bg-void/85 px-2.5 py-1 text-hot sm:inline">
          R3F // ORBIT TELEMETRY
        </span>
      </div>
    </div>
  );
}
