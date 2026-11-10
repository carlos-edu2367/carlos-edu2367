import { useEffect, useState } from 'react';
import { AdaptiveDpr, PerformanceMonitor } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { CrimsonCore } from './CrimsonCore';
import { ParticleField } from './ParticleField';
import { useHeroPointer } from './pointerStore';
import { CameraRig, HeroPostProcessing } from './SceneRig';
import { isSoftwareWebGL, isWebGLAvailable } from './webglSupport';

export interface HeroCanvasProps {
  konamiActive: boolean;
  reducedMotion: boolean;
  isVisible: boolean;
  isMobile: boolean;
  fallbackLabel: string;
}

export default function HeroCanvas({
  konamiActive,
  reducedMotion,
  isVisible,
  isMobile,
  fallbackLabel,
}: HeroCanvasProps) {
  const [webglReady, setWebglReady] = useState<boolean>(() => isWebGLAvailable());
  const [softwareGl] = useState<boolean>(() => isSoftwareWebGL());
  const [lowPerf, setLowPerf] = useState<boolean>(() => isSoftwareWebGL());
  const [postFxReady, setPostFxReady] = useState<boolean>(false);
  const [isTabVisible, setIsTabVisible] = useState<boolean>(() =>
    typeof document === 'undefined' ? true : document.visibilityState === 'visible',
  );

  const pointerRef = useHeroPointer(webglReady && !reducedMotion && isVisible && isTabVisible);

  useEffect(() => {
    if (lowPerf || reducedMotion || typeof window === 'undefined') {
      return;
    }
    const timer = window.setTimeout(() => setPostFxReady(true), 240);
    return () => window.clearTimeout(timer);
  }, [lowPerf, reducedMotion]);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }
    const onVisibilityChange = () => {
      setIsTabVisible(document.visibilityState === 'visible');
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  if (!webglReady) {
    return (
      <div
        data-testid="hero-webgl-fallback"
        className="pointer-events-none absolute right-4 bottom-4 z-10 rounded border border-primary/25 bg-surface/80 px-2.5 py-1 font-mono text-[10px] tracking-widest text-dim uppercase backdrop-blur-sm sm:right-8"
      >
        {fallbackLabel}
      </div>
    );
  }

  const frameloop: 'always' | 'demand' | 'never' =
    !isVisible || !isTabVisible ? 'never' : reducedMotion || softwareGl ? 'demand' : 'always';

  return (
    <div
      data-testid="hero-canvas-layer"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
    >
      <Canvas
        dpr={softwareGl ? 1 : [1, 1.75]}
        frameloop={frameloop}
        camera={{ position: [0, 0, 5.5], fov: 44, near: 0.1, far: 40 }}
        gl={{
          antialias: false,
          alpha: true,
          stencil: false,
          powerPreference: 'high-performance',
        }}
        style={{ pointerEvents: 'none', width: '100%', height: '100%' }}
        onCreated={({ gl }) => {
          const dom = gl.domElement;
          const handleLost = (event: Event) => {
            event.preventDefault();
            setWebglReady(false);
          };
          dom.addEventListener('webglcontextlost', handleLost, { once: true });
        }}
      >
        <PerformanceMonitor
          flipflops={2}
          onDecline={() => setLowPerf(true)}
          onFallback={() => setLowPerf(true)}
        />
        <AdaptiveDpr pixelated />

        <CameraRig pointerRef={pointerRef} />
        <CrimsonCore
          pointerRef={pointerRef}
          konamiActive={konamiActive}
          lowPerf={lowPerf || isMobile}
        />
        <ParticleField
          pointerRef={pointerRef}
          konamiActive={konamiActive}
          isMobile={isMobile}
          lowPerf={lowPerf}
        />

        {postFxReady && !lowPerf && !reducedMotion ? (
          <HeroPostProcessing konamiActive={konamiActive} />
        ) : null}
      </Canvas>
    </div>
  );
}
