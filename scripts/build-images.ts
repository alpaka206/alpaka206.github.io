// Turns the originals in /assets into responsive AVIF/WebP files in /public/media
// and writes src/media/manifest.json (intrinsic size, widths, placeholder colour).
// Incremental: an output is rebuilt only when its source is newer.
import { mkdir, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

type Format = 'avif' | 'webp';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'assets');
const OUT = path.join(ROOT, 'public/media');
const MANIFEST = path.join(ROOT, 'src/media/manifest.json');

/** Directory (searched recursively), widths, formats. */
const GROUPS: [string, number[], Format[]][] = [
  ['wallpapers', [1280, 1920, 2560], ['avif', 'webp']],
  ['icons', [128, 256], ['webp']],
  ['apps', [128, 256], ['webp']],
  ['brand', [64, 256], ['webp']],
  ['system', [128, 256, 512], ['webp']],
  ['profile', [240, 480, 645], ['avif', 'webp']],
  ['screens', [720, 1440, 2160], ['avif', 'webp']],
  ['projects', [480, 960, 1440], ['avif', 'webp']],
  // 64/128: file-icon and Dock-stack thumbnails (45-64 pt at 1x and 2x).
  ['awards', [64, 128, 640, 1280], ['webp']],
  ['pdf', [64, 128, 360, 1440, 2400], ['webp']],
];

const QUALITY: Record<Format, { quality: number; effort: number }> = {
  avif: { quality: 55, effort: 5 },
  webp: { quality: 80, effort: 5 },
};

interface Entry {
  width: number;
  height: number;
  widths: number[];
  formats: Format[];
  color: string;
}

async function isNewer(src: string, out: string) {
  try {
    return (await stat(src)).mtimeMs > (await stat(out)).mtimeMs;
  } catch {
    return true;
  }
}

const toHex = ({ r, g, b }: { r: number; g: number; b: number }) =>
  `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;

const manifest: Record<string, Entry> = {};
let written = 0;

for (const [dir, widths, formats] of GROUPS) {
  const entries = await readdir(path.join(SRC, dir), { withFileTypes: true, recursive: true });
  const files = entries.filter((f) => f.isFile() && /\.(png|jpe?g|webp)$/i.test(f.name));

  for (const file of files) {
    const src = path.join(file.parentPath, file.name);
    const rel = path.relative(SRC, src);
    const key = rel.replace(/\.[^.]+$/, '').split(path.sep).join('/');
    const outDir = path.join(OUT, path.dirname(rel));
    await mkdir(outDir, { recursive: true });

    const image = sharp(src);
    const { width = 0, height = 0 } = await image.metadata();
    // Never upscale: the largest variant is the source width.
    const sizes = [...new Set(widths.map((w) => Math.min(w, width)))];
    const { dominant } = await image.stats();

    for (const w of sizes) {
      for (const format of formats) {
        const out = path.join(outDir, `${path.basename(key)}-${w}.${format}`);
        if (!(await isNewer(src, out))) continue;
        await sharp(src).resize({ width: w }).toFormat(format, QUALITY[format]).toFile(out);
        written += 1;
      }
    }

    manifest[key] = { width, height, widths: sizes, formats, color: toHex(dominant) };
  }
}

await mkdir(path.dirname(MANIFEST), { recursive: true });
// Sorted keys: recursive readdir order differs between Node versions, and the file must not churn.
const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));
await writeFile(MANIFEST, `${JSON.stringify(sorted, null, 2)}\n`);
console.log(`images: ${Object.keys(manifest).length} sources, ${written} files written`);
