import { STACK_CATEGORIES, type StackCategoryKey } from '../../data/stack';
import { playSound } from '../../lib/sound';

export interface StackFallback2DProps {
  activeCategory: StackCategoryKey | null;
  categoryLabels: Record<StackCategoryKey, string>;
  fallbackNote: string;
  onSelectCategory: (cat: StackCategoryKey | null) => void;
}

export function StackFallback2D({
  activeCategory,
  categoryLabels,
  fallbackNote,
  onSelectCategory,
}: StackFallback2DProps) {
  const cx = 320;
  const cy = 190;
  const radius = 128;

  return (
    <div className="relative flex min-h-[420px] flex-col justify-between overflow-hidden rounded-2xl border border-primary/30 bg-surface/90 p-5 sm:min-h-[500px] sm:p-6">
      <div className="mb-3 flex items-center justify-between font-mono text-[10px] tracking-widest text-hot uppercase">
        <span>{fallbackNote}</span>
        <span>7 DOMAINS</span>
      </div>

      <svg viewBox="0 0 640 380" className="mx-auto my-auto max-h-[380px] w-full" role="img" aria-label={fallbackNote}>
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="rgba(255,31,61,0.18)" strokeDasharray="4 4" />
        <circle cx={cx} cy={cy} r={radius * 0.55} fill="none" stroke="rgba(255,31,61,0.12)" />

        {STACK_CATEGORIES.map((cat, idx) => {
          const angle = (idx / STACK_CATEGORIES.length) * Math.PI * 2 - Math.PI / 2;
          const hx = cx + Math.cos(angle) * radius;
          const hy = cy + Math.sin(angle) * radius;
          const focused = !activeCategory || activeCategory === cat.id;

          return (
            <g
              key={cat.id}
              onClick={() => {
                playSound('click');
                onSelectCategory(activeCategory === cat.id ? null : cat.id);
              }}
              className="cursor-pointer"
            >
              <line
                x1={cx}
                y1={cy}
                x2={hx}
                y2={hy}
                stroke={focused ? cat.accentColor : 'rgba(255,31,61,0.16)'}
                strokeWidth={focused ? 1.8 : 1}
              />
              {cat.items.slice(0, 6).map((item, sIdx) => {
                const subAngle = angle + (sIdx - 2.5) * 0.24;
                const sx = hx + Math.cos(subAngle) * 34;
                const sy = hy + Math.sin(subAngle) * 28;
                return (
                  <g key={item}>
                    <line
                      x1={hx}
                      y1={hy}
                      x2={sx}
                      y2={sy}
                      stroke={cat.accentColor}
                      strokeOpacity={focused ? 0.45 : 0.12}
                    />
                    <circle
                      cx={sx}
                      cy={sy}
                      r={focused ? 3.2 : 2}
                      fill={cat.accentColor}
                      fillOpacity={focused ? 0.9 : 0.25}
                    />
                  </g>
                );
              })}
              <circle
                cx={hx}
                cy={hy}
                r={focused ? 9 : 6}
                fill="#160910"
                stroke={cat.accentColor}
                strokeWidth="2"
              />
              <text
                x={hx}
                y={hy + (hy > cy ? 22 : -14)}
                textAnchor="middle"
                fill={focused ? '#f5ece9' : '#9a817e'}
                fontSize="10"
                fontFamily="JetBrains Mono, monospace"
              >
                {categoryLabels[cat.id]}
              </text>
            </g>
          );
        })}

        <circle cx={cx} cy={cy} r="14" fill="#ff1f3d" fillOpacity="0.22" stroke="#ff1f3d" strokeWidth="2" />
        <circle cx={cx} cy={cy} r="4.5" fill="#ff4d6d" />
      </svg>
    </div>
  );
}
