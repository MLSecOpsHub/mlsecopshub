// Used by astro.config.mjs (sitemap lastmod) and scripts/. Plain ESM so it can
// run outside the Astro runtime. Content dates come from the `updated`
// frontmatter field; static routes use the dates below and must be bumped
// when the page copy changes materially.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export const STATIC_LASTMOD = {
  '/': '2026-09-08',
  '/services': '2026-09-08',
  '/readiness': '2026-09-08',
  '/case-notes': '2026-09-08',
  '/data': '2026-09-08',
  '/about': '2026-09-08',
  '/newsletter': '2026-09-08',
  '/blog': '2026-09-08',
  '/contact': '2026-09-08',
  '/privacy': '2026-09-08',
  '/imprint': '2026-09-08',
};

const COLLECTION_DIRS = {
  '/services': 'src/content/services',
  '/readiness': 'src/content/readiness',
  '/case-notes': 'src/content/case-notes',
  '/blog': 'src/content/blog',
};

function readUpdated(dir) {
  const map = {};
  if (!existsSync(dir)) return map;
  for (const f of readdirSync(dir)) {
    if (!f.endsWith('.md')) continue;
    const text = readFileSync(join(dir, f), 'utf8');
    const m = text.match(/^updated:\s*['"]?(\d{4}-\d{2}-\d{2})/m);
    if (m) map[f.replace(/\.md$/, '')] = m[1];
  }
  return map;
}

let cache;
function table() {
  if (cache) return cache;
  cache = { ...STATIC_LASTMOD };
  for (const [prefix, dir] of Object.entries(COLLECTION_DIRS)) {
    for (const [slug, date] of Object.entries(readUpdated(dir))) cache[`${prefix}/${slug}`] = date;
  }
  const dataDir = 'src/content/data';
  for (const [slug, date] of Object.entries(readUpdated(dataDir))) cache[`/data/${slug}`] = date;
  return cache;
}

/** @param {string} url absolute or relative URL */
export function lastmodFor(url) {
  let path = url;
  try { path = new URL(url).pathname; } catch { /* relative */ }
  path = path.replace(/\/$/, '') || '/';
  const d = table()[path];
  return d ? new Date(`${d}T00:00:00Z`) : undefined;
}
