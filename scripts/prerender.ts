// After `vite build` (client) and `vite build --ssr src/reader/prerender.tsx --outDir .ssr`:
// writes one static HTML file per route with its own title, description, canonical
// URL and the text version inside <main id="reader">, plus 404.html and sitemap.xml.
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import type { PageMeta } from '../src/reader/pageMeta.ts';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');
const SITE = 'https://alpaka206.github.io';

const { pages } = (await import(pathToFileURL(path.join(ROOT, '.ssr/prerender.js')).href)) as {
  pages: () => PageMeta[];
};
const template = await readFile(path.join(DIST, 'index.html'), 'utf8');

const escape = (text: string) => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const urlOf = (route: string) => `${SITE}${route === '/' ? '/' : `${route}/`}`;

function render({ path: route, title, description, html, canonical }: PageMeta) {
  const url = urlOf(canonical ?? route);
  return template
    .replace(/<title>.*?<\/title>/, `<title>${escape(title)}</title>`)
    .replace(/(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${escape(description)}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${escape(title)}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${escape(description)}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
    .replace('<!--reader-->', html);
}

const list = pages();
for (const page of list) {
  const dir = page.path === '/' ? DIST : path.join(DIST, page.path);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, 'index.html'), render(page));
}

// Unknown paths still boot the app: GitHub Pages serves 404.html for them.
await writeFile(path.join(DIST, '404.html'), render(list[0]!));

const today = new Date().toISOString().slice(0, 10);
const urls = list
  .filter((page) => !page.canonical)
  .map((page) => `  <url><loc>${urlOf(page.path)}</loc><lastmod>${today}</lastmod></url>`)
  .join('\n');
await writeFile(
  path.join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);
await writeFile(path.join(DIST, '.nojekyll'), '');
await rm(path.join(ROOT, '.ssr'), { recursive: true, force: true });
console.log(`prerendered ${list.length} pages`);
