import { useEffect, useRef } from 'react';

export interface HeroPointerState {
  targetX: number;
  targetY: number;
  smoothX: number;
  smoothY: number;
  tiltX: number;
  tiltY: number;
  velocity: number;
  pulse: number;
}

function createInitialPointerState(): HeroPointerState {
  return {
    targetX: 0,
    targetY: 0,
    smoothX: 0,
    smoothY: 0,
    tiltX: 0,
    tiltY: 0,
    velocity: 0,
    pulse: 0,
  };
}

export function stepPointerState(state: HeroPointerState, delta: number): void {
  const dt = Math.min(delta, 0.05);
  const lerp = 1 - Math.exp(-dt * 7.5);

  const combinedX = Math.max(-1, Math.min(1, state.targetX + state.tiltX * 0.45));
  const combinedY = Math.max(-1, Math.min(1, state.targetY + state.tiltY * 0.45));

  state.smoothX += (combinedX - state.smoothX) * lerp;
  state.smoothY += (combinedY - state.smoothY) * lerp;

  state.velocity *= Math.exp(-dt * 5.2);
  state.pulse *= Math.exp(-dt * 2.8);
  if (state.pulse < 0.002) {
    state.pulse = 0;
  }
}

export function useHeroPointer(enabled: boolean) {
  const stateRef = useRef<HeroPointerState>(createInitialPointerState());

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      return;
    }

    const state = stateRef.current;
    let prevX = 0;
    let prevY = 0;
    let hasPrev = false;

    const handlePointerMove = (event: PointerEvent) => {
      const width = window.innerWidth || 1;
      const height = window.innerHeight || 1;
      const nx = (event.clientX / width) * 2 - 1;
      const ny = -((event.clientY / height) * 2 - 1);

      if (hasPrev) {
        const dx = nx - prevX;
        const dy = ny - prevY;
        const dist = Math.hypot(dx, dy);
        state.velocity = Math.min(2.4, state.velocity + dist * 6.5);
      }

      prevX = nx;
      prevY = ny;
      hasPrev = true;
      state.targetX = nx;
      state.targetY = ny;
    };

    const handlePointerDown = (event: PointerEvent) => {
      const heroEl = document.getElementById('hero');
      if (heroEl && heroEl.contains(event.target as Node)) {
        state.pulse = 1;
        state.velocity = Math.min(2.4, state.velocity + 0.85);
      }
    };

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.gamma === null || event.beta === null) {
        return;
      }
      state.tiltX = Math.max(-1, Math.min(1, event.gamma / 32));
      state.tiltY = Math.max(-1, Math.min(1, (event.beta - 45) / 32));
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });

    const OrientationCtor = window.DeviceOrientationEvent as unknown as
      | { requestPermission?: () => Promise<string> }
      | undefined;
    const canListenOrientation =
      typeof window.DeviceOrientationEvent !== 'undefined' &&
      typeof OrientationCtor?.requestPermission !== 'function';

    if (canListenOrientation) {
      window.addEventListener('deviceorientation', handleOrientation, { passive: true });
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      if (canListenOrientation) {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
    };
  }, [enabled]);

  return stateRef;
}
