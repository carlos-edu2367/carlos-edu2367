# Carlos Eduardo — 3D Interactive Portfolio

Crimson-on-obsidian, interactive 3D, lightly gamified engineering portfolio for **Carlos Eduardo da Silva** — Full-Stack Software Engineer specializing in **Backend Architecture, Multi-Tenant SaaS, Offline-First Systems, and Local-First AI Agents** (Goiânia, GO — Brazil · UTC-3).

---

## Overview

Designed as an operator-grade interactive dossier, the portfolio pairs brutalist editorial typography (`Syne`, `Space Grotesk`, `JetBrains Mono`) with React Three Fiber 3D scenes, smooth Lenis inertial scrolling, tactile micro-interactions, bilingual support (`EN` / `PT-BR`), and an unobtrusive RPG telemetry & achievement layer.

### Sections (`DESIGN.md` anchor contract)
1. **`#hero`** — Kinetic staggered headline with hover glyph-scramble, freelance availability pill, chamfered 4:5 operator portrait card with 3D pointer tilt & RGB-split overdrive layers, and a lazy-loaded 3D R3F `CrimsonCore` + `ParticleField` scene.
2. **`#about`** — Operator Character Sheet: qualitative attribute telemetry bars, equipped engineering perks, architectural doctrine pillars, and completed field quests (including Arcaika Engenharia process-automation systems).
3. **`#projects`** — Selected Works:
   - **Flagship Case Studies** (`Orin`, `Auryly`, `Marketfy`) in a sticky horizontal scroll-pinned showcase on desktop (stacking cleanly on mobile/reduced-motion) with quick-jump pills and a deep architecture inspection modal (`ProjectOverlay`).
   - **Extended Arsenal** (`Billing Core`, `Ashy`, `Neectify & Engify`, `AgentDesk`) in an interactive spotlight bento grid.
4. **`#stack`** — Equipped Arsenal: 7 categorized engineering domains, interactive 3D R3F `Constellation` orbit graph (with automatic 2D SVG tactical fallback), dual-row scroll-velocity marquee, and an accessible specification matrix.
5. **`#contact`** — Direct Uplink: freelance availability status, one-click clipboard email copy with live status feedback, `mailto:` CTA, and GitHub/LinkedIn uplinks.
6. **`#footer`** — Live Goiânia (`America/Sao_Paulo`, `UTC-3`) telemetry clock, sector quick links, Konami code hint, and smooth back-to-top action.

---

## Features

- **Real-Time 3D WebGL Scenes (`@react-three/fiber` + `@react-three/drei` + `@react-three/postprocessing`)**
  - Custom GLSL simplex-noise plasma `CrimsonCore` + cursor-reactive `ParticleField` with `Bloom` and `ChromaticAberration` in `#hero`.
  - Interactive 3D `Constellation` technology graph with `OrbitControls`, domain camera targeting, and projected 3D node telemetry readouts in `#stack`.
  - **Single Active WebGL Context Lifecycle**: offscreen `IntersectionObserver` gating mounts at most one `<Canvas>` at a time (`#hero` vs `#stack`), pauses `frameloop="never"` when offscreen or when the browser tab is hidden, and falls back gracefully when hardware WebGL is unavailable.
- **Light Gamification & Easter Eggs**
  - Persistent XP counter, level progression bar, and 9 unlockable achievements (`System Online`, `Full Reconnaissance`, `Bilingual Comms`, `Deep Inspector`, `Archivist of Flagships`, `Crimson Overdrive`, `Audio Telemetry`, `Power Operator`, `Signal Established`) stored in `localStorage` (`ce.game`).
  - **Command Palette (`Ctrl+K` / `⌘K`)** with fuzzy search, keyboard navigation, focus trapping, and instant actions.
  - **Konami Code (`↑ ↑ ↓ ↓ ← → ← → B A`)** unlocking **Arcade / Crimson Overdrive** mode across the HUD, viewport frame, portrait glitch layers, and 3D shaders.
  - Optional zero-asset **WebAudio synthesized SFX** (muted by default, toggleable in the HUD or Command Palette).
- **Bilingual i18n (`EN` ↔ `PT-BR`)**
  - Automatic browser locale detection (`navigator.languages` starting with `pt` → `pt-BR`, otherwise `en`), manual HUD/Command Palette switcher persisted in `localStorage` (`ce.locale`), and automatic `<html lang="...">` synchronization.
- **Accessibility & Reduced Motion (`100` Lighthouse Accessibility)**
  - WCAG AA color contrast across obsidian surfaces and crimson CTAs, skip-to-content link, focus-trapped modals (`aria-modal="true"`) with Escape dismissal and focus restoration, `aria-live="polite"` toast notifications, and full `prefers-reduced-motion: reduce` support (skips boot intro, disables Lenis smooth wheel & custom cursor, switches `#projects` to vertical stack and `#stack` to static 2D constellation).
- **Performance & SEO (`100` Lighthouse Best Practices & `100` SEO)**
  - Code-split `vendor-three`, `HeroCanvas`, and `Constellation` lazy chunks kept completely out of the initial critical modulepreload graph.
  - Build-time Vite plugin preloading `Syne 800` and `Space Grotesk` WOFF2 fonts alongside responsive AVIF (`480w` / `960w`) LCP portrait preloading with `fetchpriority="high"`.
  - Complete Open Graph & Twitter/X card tags, generated `1200x630` `public/og-image.png`, and `public/robots.txt`.

---

## Tech Stack

| Layer | Technologies |
| --- | --- |
| **Framework & Language** | React 19, TypeScript 5.8 (`strict`), Vite 6 |
| **Styling & Typography** | Tailwind CSS 4 (`@tailwindcss/vite`), `@fontsource/syne`, `@fontsource-variable/space-grotesk`, `@fontsource/jetbrains-mono` |
| **3D & Shaders** | Three.js `0.175`, `@react-three/fiber` 9, `@react-three/drei` 10, `@react-three/postprocessing` 3, custom GLSL shaders |
| **Motion & Scroll** | `motion` 12 (`motion/react`), `lenis` smooth scroll |
| **Icons & Audio** | `lucide-react`, native WebAudio API synthesizer |
| **Testing & Tooling** | Vitest 3, Testing Library (`@testing-library/react`, `jest-dom`), ESLint 9, `sharp` asset pipeline |

---

## Scripts

Run all commands from the `portfolio/` directory:

```bash
cd portfolio
npm install
```

| Script | Command | Description |
| --- | --- | --- |
| `npm run dev` | `vite --port 5173 --strictPort` | Start local HMR development server at `http://localhost:5173` |
| `npm run build` | `tsc -b && vite build` | Type-check and build optimized production bundle into `portfolio/dist/` |
| `npm run preview` | `vite preview --port 4173 --strictPort` | Serve the production build locally at `http://localhost:4173` |
| `npm test` | `vitest run` | Run the unit & component test suite once |
| `npm run test:watch` | `vitest` | Run Vitest in interactive watch mode |
| `npm run lint` | `eslint .` | Run ESLint across TypeScript and React files |

Asset helper scripts:
- `node scripts/prepare-portrait.mjs [path/to/photo.jpg]` — Generates responsive `4:5` (`960x1200` + `480x600`) AVIF, WebP, and JPEG portrait variants in `public/images/`.
- `node scripts/generate-og.mjs` — Generates `public/og-image.png` (`1200x630`) from `public/images/portrait.jpg` + crimson HUD SVG template.

---

## Deploying to GitHub Pages

An automated GitHub Actions workflow is already configured at **`.github/workflows/deploy-portfolio.yml`**.

### How it works
1. Triggers automatically on pushes to `main` touching `portfolio/**` or `.github/workflows/deploy-portfolio.yml` (or manually via **Actions → Run workflow**).
2. Installs dependencies (`npm ci`), runs `npm run lint` and `npm test`, and builds with:
   ```bash
   VITE_BASE_PATH=/carlos-edu2367/ npm run build
   ```
   (`vite.config.ts` reads `process.env.VITE_BASE_PATH` and sets Vite's `base`, automatically prefixing `%BASE_URL%` assets, preloaded fonts, `PORTRAIT_ASSET`, and `og-image.png`).
3. Uploads `portfolio/dist` and deploys via `actions/deploy-pages@v4`.

### One-time repository setup
1. Open your GitHub repository **Settings → Pages**.
2. Under **Build and deployment → Source**, select **GitHub Actions** (instead of *Deploy from a branch*).
3. Push to `main` (or trigger **Deploy Portfolio to GitHub Pages** from the **Actions** tab). Your site will publish at `https://carlos-edu2367.github.io/carlos-edu2367/`.
4. *(Custom domain)*: If deploying at a root domain (`/`), change `VITE_BASE_PATH` in `.github/workflows/deploy-portfolio.yml` to `/`.

---

## How to Swap the Stock Portrait

The hero portrait currently uses a royalty-free editorial placeholder. To replace it with your own photo across the entire app and Open Graph card:

1. **Generate optimized `4:5` variants with `prepare-portrait.mjs`**:
   ```bash
   cd portfolio
   node scripts/prepare-portrait.mjs /path/to/your-photo.png
   node scripts/generate-og.mjs
   ```
   This crops (`960x1200` and `480x600`, `position: 'attention'`) and writes:
   - `public/images/portrait.avif` & `public/images/portrait-sm.avif`
   - `public/images/portrait.webp` & `public/images/portrait-sm.webp`
   - `public/images/portrait.jpg`
   - `public/og-image.png` (`1200x630` social preview)
2. *(Alternative manual swap)*: Replace `public/images/portrait.{avif,webp,jpg}` and `public/images/portrait-sm.{avif,webp}` directly with `4:5` aspect-ratio files.
3. **Update metadata / alt text if desired**: Edit `PORTRAIT_ASSET` and `PROFILE` in `src/config/profile.ts` (and remove or update the stock photo credit comment at the top of `src/config/profile.ts`).

---

## Project Structure

```text
portfolio/
├── index.html                  # SEO/OG meta tags + responsive LCP portrait preload
├── vite.config.ts              # Vite 6 + Tailwind 4 + lazy chunking + font preload plugin
├── DESIGN.md                   # Visual tokens, typography scale & section ID contract
├── public/
│   ├── favicon.svg             # Crimson monogram favicon
│   ├── og-image.png            # 1200x630 Open Graph / social preview image
│   ├── robots.txt              # Search crawler allow rules
│   └── images/                 # Responsive 4:5 portrait variants (AVIF, WebP, JPG)
├── scripts/
│   ├── prepare-portrait.mjs    # Sharp pipeline for 960x1200 & 480x600 portrait assets
│   └── generate-og.mjs         # Sharp generator for 1200x630 public/og-image.png
└── src/
    ├── App.tsx                 # Shell wiring providers, HUD, overlays, and sections
    ├── config/profile.ts       # Single source of truth for profile links & portrait paths
    ├── data/                   # Flagship/secondary project specs & 7-domain stack data
    ├── game/                   # XP/level reducer, 9 achievements, Konami & section hooks
    ├── hooks/                  # Lenis smooth scroll, media queries, touch & reduced-motion
    ├── i18n/                   # EN & PT-BR dictionaries, locale detector & provider
    ├── lib/sound.ts            # Synthesized WebAudio SFX engine
    ├── components/             # BootLoader, Hud, CommandPalette, CustomCursor, Toasts, ui/
    ├── sections/               # hero/, about/, projects/, stack/, contact/, footer/
    └── three/                  # Lazy HeroCanvas (CrimsonCore, ParticleField) & Constellation
```

---

## Credits

- **Design & Engineering**: Carlos Eduardo da Silva (`@carlos-edu2367`).
- **Placeholder Portrait**: Photo by [Albert Dera](https://unsplash.com/photos/ILip77SbmOE) on Unsplash (royalty-free [Unsplash License](https://unsplash.com/license)), documented in `src/config/profile.ts`.
