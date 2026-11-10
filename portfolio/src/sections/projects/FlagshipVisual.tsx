import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export interface FlagshipVisualProps {
  projectId: string;
}

function OrinVisual({ animate }: { animate: boolean }) {
  const bars = [38, 72, 94, 54, 86, 64, 98, 46, 78, 60, 88, 42];
  const childrenNodes = [
    { x: 56, y: 124, label: 'CLAUDE' },
    { x: 140, y: 136, label: 'CODEX' },
    { x: 224, y: 136, label: 'ANTIGRAVITY' },
    { x: 308, y: 124, label: 'LOCAL RAG' },
  ];

  return (
    <div className="relative flex h-full min-h-[250px] flex-col justify-between bg-scanlines p-5">
      <div className="flex items-center justify-between font-mono text-[10px] tracking-widest text-muted uppercase">
        <span className="inline-flex items-center gap-1.5 text-hot">
          <span className={`h-2 w-2 rounded-full bg-primary ${animate ? 'animate-ping' : ''}`} />
          VOICE LIVE · PT-BR
        </span>
        <span>SQLITE + MCP TREE</span>
      </div>

      <svg viewBox="0 0 364 172" className="my-2 w-full overflow-visible" aria-hidden="true">
        {childrenNodes.map((n, idx) => (
          <g key={n.label}>
            <path
              d={`M 182 34 C 182 80, ${n.x} 76, ${n.x} ${n.y}`}
              fill="none"
              stroke="rgba(255,31,61,0.38)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            {animate ? (
              <circle r="3" fill="#ff4d6d">
                <animateMotion
                  dur={`${1.9 + idx * 0.35}s`}
                  repeatCount="indefinite"
                  path={`M 182 34 C 182 80, ${n.x} 76, ${n.x} ${n.y}`}
                />
              </circle>
            ) : null}
            <rect
              x={n.x - 36}
              y={n.y - 12}
              width="72"
              height="24"
              rx="6"
              fill="#160910"
              stroke="rgba(255,31,61,0.55)"
            />
            <text
              x={n.x}
              y={n.y + 3}
              textAnchor="middle"
              fill="#f5ece9"
              fontSize="8.5"
              fontFamily="JetBrains Mono, monospace"
            >
              {n.label}
            </text>
          </g>
        ))}

        <rect
          x="118"
          y="12"
          width="128"
          height="30"
          rx="8"
          fill="#ff1f3d"
          fillOpacity="0.2"
          stroke="#ff1f3d"
          strokeWidth="1.5"
        />
        <text
          x="182"
          y="30"
          textAnchor="middle"
          fill="#f5ece9"
          fontSize="10"
          fontWeight="700"
          fontFamily="JetBrains Mono, monospace"
        >
          ORIN CORE v0.12.8
        </text>
      </svg>

      <div className="flex items-end justify-between gap-3 rounded-xl border border-primary/25 bg-void/80 px-3.5 py-2.5">
        <span className="font-mono text-[10px] tracking-widest text-dim uppercase">WAKE: &quot;ORIN&quot;</span>
        <div className="flex h-7 items-end gap-1" aria-hidden="true">
          {bars.map((h, i) => (
            <span
              key={i}
              className="w-1.5 rounded-full bg-gradient-to-t from-crimson via-primary to-hot"
              style={{
                height: `${h}%`,
                animation: animate ? `pulse ${0.9 + (i % 4) * 0.22}s ease-in-out infinite` : undefined,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function AurylyVisual({ animate }: { animate: boolean }) {
  const steps = [
    { x: 52, y: 122, xp: '+120 XP', label: 'TRACK 01' },
    { x: 142, y: 84, xp: '+240 XP', label: 'AGENTS LAB' },
    { x: 232, y: 106, xp: '+380 XP', label: 'RAG BUILD' },
    { x: 314, y: 46, xp: 'UNLOCKED', label: 'SHIP SAAS' },
  ];

  return (
    <div className="relative flex h-full min-h-[250px] flex-col justify-between bg-scanlines p-5">
      <div className="flex items-center justify-between font-mono text-[10px] tracking-widest text-muted uppercase">
        <span className="text-hot">DDD MONOREPO · CLEAN ARCH</span>
        <span className="rounded border border-primary/40 bg-primary/15 px-2 py-0.5 text-ink">
          STRIPE + DUCKDB
        </span>
      </div>

      <svg viewBox="0 0 364 164" className="my-2 w-full" aria-hidden="true">
        <circle cx="182" cy="84" r="68" fill="none" stroke="rgba(255,31,61,0.14)" strokeDasharray="3 5" />
        <circle cx="182" cy="84" r="42" fill="none" stroke="rgba(255,77,109,0.2)" />
        <polyline
          points={steps.map((s) => `${s.x},${s.y}`).join(' ')}
          fill="none"
          stroke="#ff1f3d"
          strokeWidth="2.2"
        />
        {steps.map((s, idx) => (
          <g key={s.label}>
            <circle
              cx={s.x}
              cy={s.y}
              r={idx === 3 ? 11 : 8}
              fill="#160910"
              stroke="#ff4d6d"
              strokeWidth="2"
            />
            <circle
              cx={s.x}
              cy={s.y}
              r="3.5"
              fill="#ff1f3d"
              className={animate ? 'animate-pulse' : ''}
            />
            <text
              x={s.x}
              y={s.y - 16}
              textAnchor="middle"
              fill="#ff4d6d"
              fontSize="8.5"
              fontWeight="700"
              fontFamily="JetBrains Mono, monospace"
            >
              {s.xp}
            </text>
            <text
              x={s.x}
              y={s.y + 22}
              textAnchor="middle"
              fill="#b39e9b"
              fontSize="8"
              fontFamily="JetBrains Mono, monospace"
            >
              {s.label}
            </text>
          </g>
        ))}
      </svg>

      <div className="grid grid-cols-3 gap-2 font-mono text-[10px] text-muted">
        <div className="rounded-lg border border-primary/20 bg-void/80 px-2.5 py-1.5 text-center">
          DOMAIN
        </div>
        <div className="rounded-lg border border-primary/35 bg-primary/10 px-2.5 py-1.5 text-center text-ink">
          APPLICATION
        </div>
        <div className="rounded-lg border border-primary/20 bg-void/80 px-2.5 py-1.5 text-center">
          INFRA · ARQ
        </div>
      </div>
    </div>
  );
}

function MarketfyVisual({ animate }: { animate: boolean }) {
  const qrCells = [
    1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0,
    1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1,
  ];

  return (
    <div className="relative flex h-full min-h-[250px] flex-col justify-between bg-scanlines p-5">
      <div className="flex items-center justify-between font-mono text-[10px] tracking-widest uppercase">
        <span className="text-hot">DEXIE OFFLINE POS</span>
        <span className="rounded border border-primary/40 bg-primary/15 px-2 py-0.5 text-ink">
          NFC-e FISCAL
        </span>
      </div>

      <div className="my-3 grid grid-cols-12 items-center gap-3">
        <div className="col-span-7 space-y-2 rounded-xl border border-primary/25 bg-void/85 p-3 font-mono text-[10px]">
          <div className="flex justify-between text-dim">
            <span>REG #04 · SYNC</span>
            <span className="text-primary">INDEXEDDB</span>
          </div>
          <div className="h-px bg-primary/20" />
          <div className="flex justify-between text-muted">
            <span>NCM / CFOP TAX</span>
            <span className="text-ink">VALIDATED</span>
          </div>
          <div className="flex justify-between text-muted">
            <span>PIX WEBHOOK SSE</span>
            <span className="text-hot">REALTIME</span>
          </div>
          <div className="flex justify-between font-bold text-ink">
            <span>STATUS</span>
            <span className="text-primary">SETTLED ✓</span>
          </div>
        </div>

        <div className="relative col-span-5 flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-primary/45 bg-void p-3">
          <div className="grid grid-cols-7 gap-1" aria-hidden="true">
            {qrCells.map((filled, idx) => (
              <span
                key={idx}
                className={`h-2.5 w-2.5 rounded-[2px] ${
                  filled ? 'bg-ink/90' : 'bg-primary/15'
                }`}
              />
            ))}
          </div>
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-x-1 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_12px_#ff1f3d] ${
              animate ? 'animate-bounce' : 'top-1/2'
            }`}
          />
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-void/80 px-3 py-1.5 font-mono text-[10px] text-muted">
        <span>MERCADO PAGO PIX</span>
        <span className="text-hot">OUTBOX QUEUE: 0 PENDING</span>
      </div>
    </div>
  );
}

export function FlagshipVisual({ projectId }: FlagshipVisualProps) {
  const reducedMotion = usePrefersReducedMotion();
  const animate = !reducedMotion;

  if (projectId === 'auryly') {
    return <AurylyVisual animate={animate} />;
  }
  if (projectId === 'marketfy') {
    return <MarketfyVisual animate={animate} />;
  }
  return <OrinVisual animate={animate} />;
}
