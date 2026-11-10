import { STACK_CATEGORIES, type StackCategoryKey } from '../../data/stack';

export interface HubNode {
  id: StackCategoryKey;
  position: [number, number, number];
  color: string;
}

export interface TechNode {
  id: string;
  label: string;
  category: StackCategoryKey;
  position: [number, number, number];
  hubPosition: [number, number, number];
  color: string;
}

const HUB_COLORS: Record<StackCategoryKey, string> = {
  languages: '#ff1f3d',
  backend: '#ff4d6d',
  frontend: '#fb7185',
  desktopAi: '#e11d48',
  data: '#be123c',
  devops: '#9f1239',
  quality: '#f43f5e',
};

export function buildConstellationGraph(): {
  hubs: HubNode[];
  nodes: TechNode[];
} {
  const hubs: HubNode[] = [];
  const nodes: TechNode[] = [];
  const count = STACK_CATEGORIES.length;
  const ringRadius = 3.35;
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  STACK_CATEGORIES.forEach((cat, cIdx) => {
    const angle = (cIdx / count) * Math.PI * 2;
    const hx = Math.cos(angle) * ringRadius;
    const hy = Math.sin(angle * 2) * 0.95;
    const hz = Math.sin(angle) * ringRadius * 0.82;
    const hubPos: [number, number, number] = [hx, hy, hz];
    const color = HUB_COLORS[cat.id] ?? cat.accentColor;

    hubs.push({
      id: cat.id,
      position: hubPos,
      color,
    });

    const total = cat.items.length;
    cat.items.forEach((item, iIdx) => {
      const t = total > 1 ? iIdx / (total - 1) : 0.5;
      const yLocal = 1 - t * 2;
      const rLocal = Math.sqrt(Math.max(0.05, 1 - yLocal * yLocal));
      const theta = goldenAngle * (iIdx + cIdx * 7);
      const orbit = 1.05 + (iIdx % 3) * 0.24;

      const nx = hx + Math.cos(theta) * rLocal * orbit;
      const ny = hy + yLocal * orbit * 0.85;
      const nz = hz + Math.sin(theta) * rLocal * orbit;

      nodes.push({
        id: `${cat.id}-${item}`,
        label: item,
        category: cat.id,
        position: [nx, ny, nz],
        hubPosition: hubPos,
        color,
      });
    });
  });

  return { hubs, nodes };
}
