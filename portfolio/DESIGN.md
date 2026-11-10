# DESIGN.md — Carlos Eduardo 3D Gamified Portfolio

## 1. Visual Reference Synthesis
- **Ref 1 (`image.png` — Crimson Brutalist Editorial)**: Inspired our signature crimson-on-obsidian atmosphere, oversized tight-tracking display headlines, subtle telemetry crosshairs, and dramatic red rim-lit 4:5 portrait framing.
- **Ref 2 (`image (2).png` — Asymmetric Studio Case Grid)**: Informed the asymmetric 12-column editorial grid, numbered project index (`01`–`03`), high-contrast metadata rails, and disciplined typographic rhythm.
- **Ref 3 (`image (3).png` — Clean Architectural Hierarchy)**: Guided strict typographic scale contrast (giant display vs. crisp monospace micro-labels), structured spec tables, and tactile hover states.
- **Ref 4 (`image (4).png` — Obsidian Cyber-HUD Scroll)**: Inspired the pitch-dark `#07040a` void canvas, glowing crimson borders, RPG/operator character sheet telemetry bars, XP HUD, and kinetic marquee momentum.

## 2. Design Tokens
### Color System (`@theme`)
| Token | Value | Role |
| --- | --- | --- |
| `--color-void` | `#07040a` | Primary page canvas |
| `--color-surface` | `#0d0609` | Elevated cards, HUD, drawers |
| `--color-elevated` | `#160910` | Hover surfaces, active pills |
| `--color-primary` | `#ff1f3d` | Electric crimson primary accent & CTAs |
| `--color-crimson` | `#9f1239` | Secondary structural borders & badges |
| `--color-blood` | `#7f1d1d` | Deep ambient glow, gradients & shadows |
| `--color-hot` | `#ff4d6d` | Hover highlights, active telemetry & bloom |
| `--color-ink` | `#f5ece9` | Warm off-white primary text |
| `--color-muted` | `#b39e9b` | Secondary copy & descriptors |
| `--color-dim` | `#735c5a` | Coordinates, timestamps & disabled UI |

### Typography Scale
- **Display (`--font-display`)**: `'Syne', sans-serif` (700/800)
  - Hero Display: `clamp(2.75rem, 7.5vw, 6.5rem)` · line-height `0.94` · tracking `-0.03em`
  - Section Title: `clamp(2rem, 4.5vw, 3.75rem)` · line-height `1.0` · tracking `-0.025em`
  - Card Title: `clamp(1.35rem, 2.2vw, 2rem)` · line-height `1.1`
- **Body (`--font-sans`)**: `'Space Grotesk Variable', 'Inter Variable', sans-serif` (400/500/600)
  - Lead: `clamp(1.05rem, 1.3vw, 1.25rem)` · line-height `1.6`
  - Body: `1rem` (`16px`) · line-height `1.65`
- **HUD / Telemetry (`--font-mono`)**: `'JetBrains Mono', monospace` (400/500/700)
  - Micro-labels, XP counters, coordinates, badges, keyboard shortcuts (`0.75rem`–`0.85rem`, uppercase tracking `0.12em`).

### Portrait Framing Contract
- Source: `PORTRAIT_ASSET` (`src/config/profile.ts`) serving AVIF → WebP → JPG (`960x1200`, `4:5` aspect).
- Treatment: Sharp chamfered/bordered frame (`border-primary/30`), subtle scanline + crimson duotone rim glow, interactive tilt/RGB-split shader or layered card in `#hero` / `#about`.

### Motion & Accessibility Principles
- Smooth inertial scroll via `Lenis` (`useLenis`), disabled automatically when `prefers-reduced-motion: reduce`.
- Entrance animations use `motion` (`cubic-bezier(0.16, 1, 0.3, 1)`), collapsing transforms/durations under reduced motion.
- Custom magnetic cursor (`[data-magnetic]`, `[data-cursor-label]`) activates **only** on `(hover: hover) and (pointer: fine)` when `html.has-custom-cursor` is set.

## 3. Section Order & DOM ID Contract
Phase B agents must preserve these exact `<section id="...">` anchors (tracked by `useSectionVisit`, `Hud`, and `CommandPalette`):

1. **`#hero`** — Hero viewport: kinetic headline, availability badge, CTAs, 4:5 portrait card, and lazy-loaded R3F 3D scene (`const HeroCanvas = React.lazy(() => import('./three/HeroCanvas'))` wrapped in `<Suspense fallback={...}>` with WebGL/mobile fallback).
2. **`#about`** — Operator Profile / Character Sheet: bio, Arcaika Engenharia automation track record, ADS (2026) & English B2 telemetry, core architectural pillars & RPG attribute bars.
3. **`#projects`** — Selected Works:
   - **Flagship Case Studies** (`orin`, `auryly`, `marketfy`) with deep feature breakdowns & interactive inspection modal (triggers `curious` and `collector` achievements).
   - **Secondary Arsenal** (`billing-core`, `ashy`, `neectify`, `agent-desk`) in a compact high-density bento/grid.
4. **`#stack`** — Equipped Arsenal: 7 categorized domains (`languages`, `backend`, `frontend`, `desktopAi`, `data`, `devops`, `quality`) + interactive constellation/marquee.
5. **`#contact`** — Uplink / Hire CTA: freelance availability (`Goiânia, BR · UTC-3`), one-click email copy (triggers `contact` achievement), direct `mailto:`, GitHub & LinkedIn uplinks.
6. **`footer`** (`#footer`) — Telemetry status bar, copyright, quick links, Konami hint.
