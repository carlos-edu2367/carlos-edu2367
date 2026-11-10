import { useEffect, useMemo, type MutableRefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  ShaderMaterial,
  Vector3,
} from 'three';
import { PARTICLE_FRAGMENT_SHADER, PARTICLE_VERTEX_SHADER } from './particleShaders';
import type { HeroPointerState } from './pointerStore';

export interface ParticleFieldProps {
  pointerRef: MutableRefObject<HeroPointerState>;
  konamiActive: boolean;
  isMobile: boolean;
  lowPerf: boolean;
}

function createSeededRandom(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function ParticleField({
  pointerRef,
  konamiActive,
  isMobile,
  lowPerf,
}: ParticleFieldProps) {
  const { gl, viewport } = useThree();

  const count = isMobile ? 1200 : lowPerf ? 1800 : 3200;

  const geometry = useMemo(() => {
    const rand = createSeededRandom(2367);
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const phases = new Float32Array(count);
    const speeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const u = rand();
      const theta = rand() * Math.PI * 2;
      const radius = 1.65 + Math.pow(u, 0.72) * 5.6;
      const spreadY = (rand() - 0.5) * (1.8 + radius * 0.48);

      positions[idx] = Math.cos(theta) * radius;
      positions[idx + 1] = spreadY;
      positions[idx + 2] = Math.sin(theta) * radius * 0.78 - 0.5;

      scales[i] = 0.45 + rand() * 1.45;
      phases[i] = rand() * Math.PI * 2;
      speeds[i] = (0.35 + rand() * 0.95) * (rand() > 0.25 ? 1 : -0.6);
    }

    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(positions, 3));
    geo.setAttribute('aScale', new BufferAttribute(scales, 1));
    geo.setAttribute('aPhase', new BufferAttribute(phases, 1));
    geo.setAttribute('aSpeed', new BufferAttribute(speeds, 1));
    return geo;
  }, [count]);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: PARTICLE_VERTEX_SHADER,
        fragmentShader: PARTICLE_FRAGMENT_SHADER,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uPixelRatio: { value: Math.min(gl.getPixelRatio(), 1.75) },
          uPulse: { value: 0 },
          uKonami: { value: 0 },
          uCursorWorld: { value: new Vector3(0, 0, 10) },
        },
      }),
    [gl],
  );

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame((state) => {
    const pointer = pointerRef.current;
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uPixelRatio.value = Math.min(state.gl.getPixelRatio(), 1.75);
    material.uniforms.uPulse.value = pointer.pulse;

    const targetKonami = konamiActive ? 1 : 0;
    const curKonami = material.uniforms.uKonami.value as number;
    material.uniforms.uKonami.value = curKonami + (targetKonami - curKonami) * 0.08;

    const cursorVec = material.uniforms.uCursorWorld.value as Vector3;
    cursorVec.set(
      pointer.smoothX * (viewport.width * 0.5),
      pointer.smoothY * (viewport.height * 0.5),
      0.2,
    );
  });

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}
