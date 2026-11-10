import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '../public');
const portraitPath = path.join(publicDir, 'images/portrait.jpg');
const outPngPath = path.join(publicDir, 'og-image.png');

const bgSvg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="crimsonGlow" cx="76%" cy="46%" r="58%">
      <stop offset="0%" stop-color="#ff1f3d" stop-opacity="0.34"/>
      <stop offset="48%" stop-color="#9f1239" stop-opacity="0.14"/>
      <stop offset="100%" stop-color="#07040a" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="leftGlow" cx="14%" cy="22%" r="45%">
      <stop offset="0%" stop-color="#7f1d1d" stop-opacity="0.32"/>
      <stop offset="100%" stop-color="#07040a" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="accentBar" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#9f1239"/>
      <stop offset="50%" stop-color="#ff1f3d"/>
      <stop offset="100%" stop-color="#ff4d6d"/>
    </linearGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#ff1f3d" stroke-opacity="0.09" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="1200" height="630" fill="#07040a"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <rect width="1200" height="630" fill="url(#crimsonGlow)"/>
  <rect width="1200" height="630" fill="url(#leftGlow)"/>

  <!-- Outer HUD Frame -->
  <rect x="28" y="28" width="1144" height="574" rx="18" fill="none" stroke="#ff1f3d" stroke-opacity="0.28" stroke-width="1.5"/>
  <rect x="28" y="28" width="1144" height="4" fill="url(#accentBar)"/>

  <!-- Corner Brackets -->
  <path d="M 28 58 L 28 28 L 58 28" fill="none" stroke="#ff4d6d" stroke-width="3"/>
  <path d="M 1142 28 L 1172 28 L 1172 58" fill="none" stroke="#ff4d6d" stroke-width="3"/>
  <path d="M 28 572 L 28 602 L 58 602" fill="none" stroke="#ff4d6d" stroke-width="3"/>
  <path d="M 1142 602 L 1172 602 L 1172 572" fill="none" stroke="#ff4d6d" stroke-width="3"/>

  <!-- Availability Pill -->
  <rect x="72" y="78" width="330" height="36" rx="18" fill="#160910" stroke="#ff1f3d" stroke-opacity="0.55" stroke-width="1.2"/>
  <circle cx="94" cy="96" r="5" fill="#ff1f3d"/>
  <text x="110" y="101" fill="#f5ece9" font-family="Consolas, monospace" font-size="13" font-weight="700" letter-spacing="2">AVAILABLE FOR FREELANCE</text>

  <rect x="416" y="78" width="212" height="36" rx="18" fill="#0d0609" stroke="#ff1f3d" stroke-opacity="0.28" stroke-width="1"/>
  <text x="436" y="101" fill="#b39e9b" font-family="Consolas, monospace" font-size="13" letter-spacing="1.5">GOIANIA, BR · UTC-3</text>

  <!-- Eyebrow -->
  <text x="72" y="164" fill="#ff4d6d" font-family="Consolas, monospace" font-size="15" font-weight="700" letter-spacing="3">// OPERATOR · CARLOS EDUARDO DA SILVA</text>

  <!-- Giant Display Name & Title -->
  <text x="72" y="246" fill="#f5ece9" font-family="Segoe UI, Arial, sans-serif" font-size="68" font-weight="800" letter-spacing="-1.5">CARLOS EDUARDO</text>
  <text x="72" y="314" fill="#ff1f3d" font-family="Segoe UI, Arial, sans-serif" font-size="40" font-weight="800" letter-spacing="-0.5">Full-Stack Software Engineer</text>

  <!-- Positioning Copy -->
  <text x="72" y="372" fill="#b39e9b" font-family="Segoe UI, Arial, sans-serif" font-size="22" font-weight="500">Backend Architecture · Multi-Tenant SaaS · Offline-First</text>
  <text x="72" y="404" fill="#b39e9b" font-family="Segoe UI, Arial, sans-serif" font-size="22" font-weight="500">&amp; Local-First AI Agent Systems</text>

  <!-- Flagship Chips -->
  <g transform="translate(72, 452)">
    <rect x="0" y="0" width="110" height="36" rx="8" fill="#160910" stroke="#ff1f3d" stroke-opacity="0.45"/>
    <text x="55" y="23" text-anchor="middle" fill="#f5ece9" font-family="Consolas, monospace" font-size="14" font-weight="700">ORIN AI</text>

    <rect x="124" y="0" width="114" height="36" rx="8" fill="#160910" stroke="#ff1f3d" stroke-opacity="0.45"/>
    <text x="181" y="23" text-anchor="middle" fill="#f5ece9" font-family="Consolas, monospace" font-size="14" font-weight="700">AURYLY</text>

    <rect x="252" y="0" width="134" height="36" rx="8" fill="#160910" stroke="#ff1f3d" stroke-opacity="0.45"/>
    <text x="319" y="23" text-anchor="middle" fill="#f5ece9" font-family="Consolas, monospace" font-size="14" font-weight="700">MARKETFY</text>

    <rect x="400" y="0" width="166" height="36" rx="8" fill="#160910" stroke="#ff1f3d" stroke-opacity="0.45"/>
    <text x="483" y="23" text-anchor="middle" fill="#f5ece9" font-family="Consolas, monospace" font-size="14" font-weight="700">PYTHON · REACT</text>
  </g>

  <!-- Footer Telemetry -->
  <line x1="72" y1="532" x2="740" y2="532" stroke="#ff1f3d" stroke-opacity="0.25" stroke-width="1"/>
  <text x="72" y="564" fill="#9a817e" font-family="Consolas, monospace" font-size="14" letter-spacing="1.5">github.com/carlos-edu2367  ·  contato.carlosedu2367@gmail.com</text>

  <!-- Portrait Frame Backdrop on Right -->
  <rect x="806" y="76" width="322" height="478" rx="16" fill="#0d0609" stroke="#ff1f3d" stroke-opacity="0.65" stroke-width="2"/>
</svg>`;

const portraitOverlaySvg = `<svg width="310" height="466" viewBox="0 0 310 466" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="fadeBottom" x1="0%" y1="45%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#07040a" stop-opacity="0"/>
      <stop offset="100%" stop-color="#07040a" stop-opacity="0.92"/>
    </linearGradient>
  </defs>
  <rect width="310" height="466" rx="12" fill="#9f1239" fill-opacity="0.08"/>
  <rect width="310" height="466" rx="12" fill="url(#fadeBottom)"/>
  <text x="18" y="426" fill="#ff4d6d" font-family="Consolas, monospace" font-size="11" font-weight="700" letter-spacing="2">OP // CE-01 · 3D PORTFOLIO</text>
  <text x="18" y="446" fill="#f5ece9" font-family="Consolas, monospace" font-size="12" font-weight="700">SYS.CORE // ONLINE</text>
</svg>`;

async function main() {
  const portraitThumb = await sharp(portraitPath)
    .resize(310, 466, { fit: 'cover', position: 'top' })
    .composite([{ input: Buffer.from(portraitOverlaySvg), top: 0, left: 0 }])
    .png()
    .toBuffer();

  await sharp(Buffer.from(bgSvg))
    .composite([{ input: portraitThumb, left: 812, top: 82 }])
    .png({ compressionLevel: 9, palette: false })
    .toFile(outPngPath);

  console.log('Generated public/og-image.png (1200x630)');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
