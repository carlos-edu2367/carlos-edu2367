import { useMemo, useRef, type ComponentRef, type RefObject } from 'react';
import { Line, OrbitControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3, type Mesh } from 'three';
import type { StackCategoryKey } from '../../data/stack';
import { playSound } from '../../lib/sound';
import { buildConstellationGraph, type TechNode } from './constellationData';

export interface ConstellationSceneProps {
  activeCategory: StackCategoryKey | null;
  hoveredNode: TechNode | null;
  onHoverNode: (node: TechNode | null) => void;
  onSelectCategory: (cat: StackCategoryKey | null) => void;
  tooltipElRef: RefObject<HTMLDivElement | null>;
}

export function ConstellationScene({
  activeCategory,
  hoveredNode,
  onHoverNode,
  onSelectCategory,
  tooltipElRef,
}: ConstellationSceneProps) {
  const { hubs, nodes } = useMemo(() => buildConstellationGraph(), []);
  const coreRef = useRef<Mesh | null>(null);
  const controlsRef = useRef<ComponentRef<typeof OrbitControls> | null>(null);
  const desiredTarget = useMemo(() => new Vector3(0, 0, 0), []);
  const projVec = useMemo(() => new Vector3(), []);
  const { camera, size } = useThree();

  useFrame((_, delta) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.35;
      coreRef.current.rotation.x += delta * 0.18;
    }

    const activeHub = activeCategory ? hubs.find((h) => h.id === activeCategory) : null;
    if (activeHub) {
      desiredTarget.set(
        activeHub.position[0] * 0.68,
        activeHub.position[1] * 0.68,
        activeHub.position[2] * 0.68,
      );
    } else {
      desiredTarget.set(0, 0, 0);
    }

    const ctrl = controlsRef.current;
    if (ctrl && 'target' in ctrl) {
      ctrl.target.lerp(desiredTarget, Math.min(1, delta * 4.5));
      ctrl.update();
    }

    const tipEl = tooltipElRef.current;
    if (tipEl && hoveredNode) {
      projVec
        .set(hoveredNode.position[0], hoveredNode.position[1] + 0.28, hoveredNode.position[2])
        .project(camera);
      const sx = (projVec.x * 0.5 + 0.5) * size.width;
      const sy = (-projVec.y * 0.5 + 0.5) * size.height;
      tipEl.style.transform = `translate3d(${sx.toFixed(1)}px, ${sy.toFixed(1)}px, 0) translate(-50%, -100%)`;
    }
  });

  return (
    <>
      <ambientLight intensity={0.65} />
      <pointLight position={[0, 0, 0]} intensity={2.6} color="#ff1f3d" distance={14} />
      <pointLight position={[6, 5, 6]} intensity={1.4} color="#ff4d6d" />
      <pointLight position={[-6, -4, -5]} intensity={1.0} color="#9f1239" />

      {/* Central Telemetry Core */}
      <mesh
        ref={coreRef}
        onClick={(e) => {
          e.stopPropagation();
          playSound('click');
          onSelectCategory(null);
        }}
      >
        <icosahedronGeometry args={[0.52, 1]} />
        <meshStandardMaterial
          color="#ff1f3d"
          emissive="#ff1f3d"
          emissiveIntensity={0.85}
          wireframe
        />
      </mesh>

      {/* Hub Backbone Edges */}
      {hubs.map((hub) => {
        const focused = !activeCategory || activeCategory === hub.id;
        return (
          <group key={hub.id}>
            <Line
              points={[[0, 0, 0], hub.position]}
              color={focused ? hub.color : '#3b1520'}
              lineWidth={focused ? 1.4 : 0.6}
              transparent
              opacity={focused ? 0.55 : 0.16}
            />
            <mesh
              position={hub.position}
              onClick={(e) => {
                e.stopPropagation();
                playSound('click');
                onSelectCategory(activeCategory === hub.id ? null : hub.id);
              }}
            >
              <octahedronGeometry args={[focused ? 0.24 : 0.17, 0]} />
              <meshStandardMaterial
                color={hub.color}
                emissive={hub.color}
                emissiveIntensity={focused ? 1.15 : 0.25}
              />
            </mesh>
          </group>
        );
      })}

      {/* Satellite Technology Nodes */}
      {nodes.map((node) => {
        const inActiveCat = !activeCategory || activeCategory === node.category;
        const isHovered = hoveredNode?.id === node.id;
        const radius = isHovered ? 0.145 : inActiveCat ? 0.092 : 0.055;

        return (
          <group key={node.id}>
            <Line
              points={[node.hubPosition, node.position]}
              color={isHovered ? '#ff4d6d' : node.color}
              lineWidth={isHovered ? 1.8 : 0.9}
              transparent
              opacity={isHovered ? 0.9 : inActiveCat ? 0.36 : 0.08}
            />
            <mesh
              position={node.position}
              onPointerOver={(e) => {
                e.stopPropagation();
                onHoverNode(node);
                playSound('hover');
              }}
              onPointerOut={() => {
                if (hoveredNode?.id === node.id) {
                  onHoverNode(null);
                }
              }}
              onClick={(e) => {
                e.stopPropagation();
                playSound('click');
                onSelectCategory(node.category);
              }}
            >
              <sphereGeometry args={[radius, 14, 14]} />
              <meshStandardMaterial
                color={isHovered ? '#ffffff' : node.color}
                emissive={isHovered ? '#ff4d6d' : node.color}
                emissiveIntensity={isHovered ? 1.8 : inActiveCat ? 0.78 : 0.15}
              />
            </mesh>
          </group>
        );
      })}

      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom={false}
        enableDamping
        dampingFactor={0.07}
        autoRotate={!hoveredNode}
        autoRotateSpeed={activeCategory ? 0.45 : 0.8}
        minPolarAngle={Math.PI * 0.2}
        maxPolarAngle={Math.PI * 0.8}
      />
    </>
  );
}
