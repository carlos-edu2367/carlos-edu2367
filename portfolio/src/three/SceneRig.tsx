import { useMemo, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { Bloom, ChromaticAberration, EffectComposer } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { Vector2 } from 'three';
import { stepPointerState, type HeroPointerState } from './pointerStore';

export interface CameraRigProps {
  pointerRef: MutableRefObject<HeroPointerState>;
}

export function CameraRig({ pointerRef }: CameraRigProps) {
  useFrame((state, delta) => {
    const pointer = pointerRef.current;
    stepPointerState(pointer, delta);

    const targetX = pointer.smoothX * 0.42;
    const targetY = pointer.smoothY * 0.28;

    state.camera.position.x += (targetX - state.camera.position.x) * 0.07;
    state.camera.position.y += (targetY - state.camera.position.y) * 0.07;
    state.camera.lookAt(0.12, 0, 0);
  });

  return null;
}

export interface HeroPostProcessingProps {
  konamiActive: boolean;
}

export function HeroPostProcessing({ konamiActive }: HeroPostProcessingProps) {
  const aberrationOffset = useMemo(
    () => (konamiActive ? new Vector2(0.0042, 0.0028) : new Vector2(0.0009, 0.0006)),
    [konamiActive],
  );

  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <Bloom
        mipmapBlur
        luminanceThreshold={0.55}
        luminanceSmoothing={0.3}
        intensity={konamiActive ? 1.55 : 0.95}
        radius={0.68}
      />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={aberrationOffset}
        radialModulation={false}
        modulationOffset={0.15}
      />
    </EffectComposer>
  );
}
