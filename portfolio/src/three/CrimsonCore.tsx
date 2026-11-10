import { useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import {
  AdditiveBlending,
  Color,
  Group,
  IcosahedronGeometry,
  Mesh,
  MeshBasicMaterial,
  ShaderMaterial,
  TorusGeometry,
  Vector2,
} from 'three';
import { CORE_FRAGMENT_SHADER, CORE_VERTEX_SHADER } from './coreShaders';
import type { HeroPointerState } from './pointerStore';

export interface CrimsonCoreProps {
  pointerRef: MutableRefObject<HeroPointerState>;
  konamiActive: boolean;
  lowPerf: boolean;
}

export function CrimsonCore({ pointerRef, konamiActive, lowPerf }: CrimsonCoreProps) {
  const rootRef = useRef<Group | null>(null);
  const coreMeshRef = useRef<Mesh | null>(null);
  const wireMeshRef = useRef<Mesh | null>(null);
  const ringARef = useRef<Mesh | null>(null);
  const ringBRef = useRef<Mesh | null>(null);
  const shockRingRef = useRef<Mesh | null>(null);

  const { viewport } = useThree();
  const isCompact = viewport.width < 6.8;

  const detail = lowPerf ? 14 : 24;

  const coreGeometry = useMemo(() => new IcosahedronGeometry(1.28, detail), [detail]);
  const wireGeometry = useMemo(() => new IcosahedronGeometry(1.52, 2), []);
  const ringAGeometry = useMemo(() => new TorusGeometry(1.98, 0.011, 12, 128), []);
  const ringBGeometry = useMemo(() => new TorusGeometry(2.34, 0.008, 12, 128), []);
  const shockGeometry = useMemo(() => new TorusGeometry(1.45, 0.018, 12, 96), []);

  const coreMaterial = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: CORE_VERTEX_SHADER,
        fragmentShader: CORE_FRAGMENT_SHADER,
        transparent: true,
        uniforms: {
          uTime: { value: 0 },
          uDistort: { value: 0.24 },
          uPulse: { value: 0 },
          uKonami: { value: 0 },
          uPointer: { value: new Vector2(0, 0) },
        },
      }),
    [],
  );

  const wireMaterial = useMemo(
    () =>
      new MeshBasicMaterial({
        color: new Color('#ff1f3d'),
        wireframe: true,
        transparent: true,
        opacity: 0.14,
        blending: AdditiveBlending,
        depthWrite: false,
      }),
    [],
  );

  const ringAMaterial = useMemo(
    () =>
      new MeshBasicMaterial({
        color: new Color('#ff4d6d'),
        transparent: true,
        opacity: 0.34,
        blending: AdditiveBlending,
        depthWrite: false,
      }),
    [],
  );

  const ringBMaterial = useMemo(
    () =>
      new MeshBasicMaterial({
        color: new Color('#9f1239'),
        transparent: true,
        opacity: 0.26,
        blending: AdditiveBlending,
        depthWrite: false,
      }),
    [],
  );

  const shockMaterial = useMemo(
    () =>
      new MeshBasicMaterial({
        color: new Color('#ff4d6d'),
        transparent: true,
        opacity: 0,
        blending: AdditiveBlending,
        depthWrite: false,
      }),
    [],
  );

  useEffect(() => {
    return () => {
      coreGeometry.dispose();
      wireGeometry.dispose();
      ringAGeometry.dispose();
      ringBGeometry.dispose();
      shockGeometry.dispose();
      coreMaterial.dispose();
      wireMaterial.dispose();
      ringAMaterial.dispose();
      ringBMaterial.dispose();
      shockMaterial.dispose();
    };
  }, [
    coreGeometry,
    wireGeometry,
    ringAGeometry,
    ringBGeometry,
    shockGeometry,
    coreMaterial,
    wireMaterial,
    ringAMaterial,
    ringBMaterial,
    shockMaterial,
  ]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const elapsed = state.clock.elapsedTime;
    const pointer = pointerRef.current;

    const konamiTarget = konamiActive ? 1 : 0;
    const currentKonami = coreMaterial.uniforms.uKonami.value as number;
    coreMaterial.uniforms.uKonami.value = currentKonami + (konamiTarget - currentKonami) * 0.08;
    coreMaterial.uniforms.uTime.value = elapsed;
    coreMaterial.uniforms.uPulse.value = pointer.pulse;
    (coreMaterial.uniforms.uPointer.value as Vector2).set(pointer.smoothX, pointer.smoothY);

    const targetDistort = 0.22 + Math.min(0.42, pointer.velocity * 0.16) + (konamiActive ? 0.12 : 0);
    const curDistort = coreMaterial.uniforms.uDistort.value as number;
    coreMaterial.uniforms.uDistort.value = curDistort + (targetDistort - curDistort) * 0.12;

    if (rootRef.current) {
      const targetX = isCompact ? 0 : 0.55;
      const targetY = isCompact ? 0.65 : 0.08;
      rootRef.current.position.x += (targetX - rootRef.current.position.x) * 0.08;
      rootRef.current.position.y += (targetY - rootRef.current.position.y) * 0.08;

      rootRef.current.rotation.x = -pointer.smoothY * 0.38;
      rootRef.current.rotation.y = pointer.smoothX * 0.45;
    }

    const spinRate = konamiActive ? 0.62 : 0.24;
    if (coreMeshRef.current) {
      coreMeshRef.current.rotation.y += dt * spinRate;
      coreMeshRef.current.rotation.x += dt * (spinRate * 0.45);
      const scale = (isCompact ? 0.84 : 1) * (1 + pointer.pulse * 0.08);
      coreMeshRef.current.scale.setScalar(scale);
    }

    if (wireMeshRef.current) {
      wireMeshRef.current.rotation.y -= dt * (spinRate * 0.7);
      wireMeshRef.current.rotation.z += dt * 0.15;
      wireMaterial.opacity = konamiActive ? 0.52 : 0.12 + pointer.pulse * 0.25;
      wireMaterial.color.set(konamiActive ? '#ff4d6d' : '#ff1f3d');
    }

    if (ringARef.current) {
      ringARef.current.rotation.z += dt * (konamiActive ? 0.85 : 0.32);
      ringARef.current.rotation.x = 1.12 + Math.sin(elapsed * 0.45) * 0.14;
    }

    if (ringBRef.current) {
      ringBRef.current.rotation.z -= dt * (konamiActive ? 0.65 : 0.22);
      ringBRef.current.rotation.y = 0.68 + Math.cos(elapsed * 0.38) * 0.16;
    }

    if (shockRingRef.current) {
      if (pointer.pulse > 0.01) {
        const expand = 1 + (1 - pointer.pulse) * 1.85;
        shockRingRef.current.scale.setScalar(expand);
        shockMaterial.opacity = pointer.pulse * 0.72;
      } else {
        shockMaterial.opacity = 0;
      }
    }
  });

  return (
    <group ref={rootRef} position={[isCompact ? 0 : 0.55, isCompact ? 0.65 : 0.08, 0]}>
      <mesh ref={coreMeshRef} geometry={coreGeometry} material={coreMaterial} />
      <mesh ref={wireMeshRef} geometry={wireGeometry} material={wireMaterial} />
      <mesh ref={ringARef} geometry={ringAGeometry} material={ringAMaterial} />
      <mesh ref={ringBRef} geometry={ringBGeometry} material={ringBMaterial} />
      <mesh ref={shockRingRef} geometry={shockGeometry} material={shockMaterial} />
    </group>
  );
}
