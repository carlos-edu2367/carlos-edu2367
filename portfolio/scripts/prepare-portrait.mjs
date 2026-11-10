import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, '../public/images');

const CANDIDATES = [
  {
    url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=85',
    credit: 'Photo by Albert Dera on Unsplash (https://unsplash.com/photos/ILip77SbmOE)',
  },
  {
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=85',
    credit: 'Photo by Joseph Gonzalez on Unsplash (https://unsplash.com/photos/iFgRcqHznqg)',
  },
  {
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=85',
    credit: 'Photo by Jurica Koletić on Unsplash (https://unsplash.com/photos/7YVZYZeITc8)',
  },
];

async function resolveInputBuffer() {
  const customArg = process.argv[2];
  if (customArg) {
    const resolved = path.resolve(process.cwd(), customArg);
    const buffer = await fs.readFile(resolved);
    return { buffer, source: resolved, credit: 'Custom local portrait' };
  }

  const existingJpg = path.join(outDir, 'portrait.jpg');
  try {
    const stat = await fs.stat(existingJpg);
    if (stat.size > 10_000 && !process.argv.includes('--refetch')) {
      const buffer = await fs.readFile(existingJpg);
      return {
        buffer,
        source: existingJpg,
        credit: CANDIDATES[0].credit,
      };
    }
  } catch {
    // Fall back to remote download
  }

  for (const candidate of CANDIDATES) {
    try {
      const response = await fetch(candidate.url, {
        headers: { 'User-Agent': 'Mozilla/5.0 PortfolioBuilder/1.0' },
      });
      if (!response.ok) {
        console.warn(`Candidate failed (${response.status}): ${candidate.url}`);
        continue;
      }
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      if (buffer.byteLength < 10_000) {
        continue;
      }
      return { buffer, source: candidate.url, credit: candidate.credit };
    } catch (err) {
      console.warn(`Error fetching ${candidate.url}:`, err);
    }
  }

  throw new Error('Could not resolve portrait source buffer.');
}

async function main() {
  await fs.mkdir(outDir, { recursive: true });
  const input = await resolveInputBuffer();

  const jpgPath = path.join(outDir, 'portrait.jpg');
  const webpPath = path.join(outDir, 'portrait.webp');
  const avifPath = path.join(outDir, 'portrait.avif');
  const webpSmPath = path.join(outDir, 'portrait-sm.webp');
  const avifSmPath = path.join(outDir, 'portrait-sm.avif');

  const fullPipeline = sharp(input.buffer).resize(960, 1200, {
    fit: 'cover',
    position: 'attention',
  });

  const smPipeline = sharp(input.buffer).resize(480, 600, {
    fit: 'cover',
    position: 'attention',
  });

  await Promise.all([
    fullPipeline.clone().jpeg({ quality: 82, mozjpeg: true }).toFile(jpgPath),
    fullPipeline.clone().webp({ quality: 74 }).toFile(webpPath),
    fullPipeline.clone().avif({ quality: 50, effort: 6 }).toFile(avifPath),
    smPipeline.clone().webp({ quality: 72 }).toFile(webpSmPath),
    smPipeline.clone().avif({ quality: 48, effort: 6 }).toFile(avifSmPath),
  ]);

  const [jpgStat, webpStat, avifStat, webpSmStat, avifSmStat] = await Promise.all([
    fs.stat(jpgPath),
    fs.stat(webpPath),
    fs.stat(avifPath),
    fs.stat(webpSmPath),
    fs.stat(avifSmPath),
  ]);

  console.log(`Portrait variants generated from: ${input.source}`);
  console.log(`Credit: ${input.credit}`);
  console.log(
    `960x1200 -> JPG: ${(jpgStat.size / 1024).toFixed(1)} KB | WebP: ${(webpStat.size / 1024).toFixed(1)} KB | AVIF: ${(avifStat.size / 1024).toFixed(1)} KB`,
  );
  console.log(
    `480x600  -> WebP: ${(webpSmStat.size / 1024).toFixed(1)} KB | AVIF: ${(avifSmStat.size / 1024).toFixed(1)} KB`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
