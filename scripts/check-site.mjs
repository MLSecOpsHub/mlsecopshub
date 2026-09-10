// Post-build checks that fail CI:
//  1. broken internal links (href/src to a path that does not exist in dist/)
//  2. orphan pages (an HTML page no other page links to)
//  3. per-page budgets: JS ≤ 30 KB gzipped, CSS ≤ 40 KB gzipped
//  4. SEO invariants: one <h1>, title ≤ 60, description 140–155, canonical, lang, JSON-LD parses, img alt+dimensions
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { gzipSync } from 'node:zlib';

const DIST = 'dist';
const JS_BUDGET = 30 * 1024;
const CSS_BUDGET = 40 * 1024;
const ORPHAN_OK = new Set(['/404', '/contact/thanks']);
const errors = [];
const pages = [];

(function walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) { if (f !== '.prerender') walk(p); }
    else if (p.endsWith('.html')) pages.push(p);
  }
})(DIST);

const toRoute = (file) => '/' + file.replace(/^dist\//, '').replace(/index\.html$/, '').replace(/\.html$/, '').replace(/\/$/, '');
const exists = (path) => {
  const clean = path.split(/[?#]/)[0].replace(/\/$/, '');
  if (clean === '') return true;
  return [join(DIST, clean), join(DIST, clean, 'index.html'), join(DIST, clean + '.html')].some((p) => existsSync(p));
};
const gz = (s) => gzipSync(Buffer.from(s)).length;
const inbound = new Map(pages.map((p) => [toRoute(p) || '/', 0]));

for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  const route = toRoute(file) || '/';

  for (const m of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const ref = m[1];
    if (/^(https?:|mailto:|tel:|#|data:)/.test(ref)) continue;
    const abs = ref.startsWith('/') ? ref : resolve('/', dirname(route), ref);
    if (!exists(abs)) errors.push(`${route}: broken internal link → ${ref}`);
    const key = abs.split(/[?#]/)[0].replace(/\/$/, '') || '/';
    if (inbound.has(key) && key !== route) inbound.set(key, inbound.get(key) + 1);
  }

  let js = 0;
  for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (/application\/ld\+json/.test(m[1])) continue;
    const src = m[1].match(/src="([^"]+)"/)?.[1];
    if (src?.startsWith('/')) js += gz(readFileSync(join(DIST, src)));
    else if (!src) js += gz(m[2]);
  }
  let css = 0;
  for (const m of html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)) css += gz(readFileSync(join(DIST, m[1])));
  for (const m of html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) css += gz(m[1]);
  if (js > JS_BUDGET) errors.push(`${route}: JS ${js} B gzipped exceeds ${JS_BUDGET}`);
  if (css > CSS_BUDGET) errors.push(`${route}: CSS ${css} B gzipped exceeds ${CSS_BUDGET}`);

  const h1s = (html.match(/<h1\b/g) || []).length;
  if (h1s !== 1) errors.push(`${route}: expected 1 <h1>, found ${h1s}`);
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
  if (!title || title.length > 60) errors.push(`${route}: title missing or > 60 chars (${title.length})`);
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '';
  if (desc.length < 140 || desc.length > 155) errors.push(`${route}: description length ${desc.length}`);
  if (!/<link rel="canonical"/.test(html)) errors.push(`${route}: missing canonical`);
  if (!/<html lang="en"/.test(html)) errors.push(`${route}: missing lang="en"`);
  for (const img of html.matchAll(/<img\b([^>]*)>/g)) {
    if (!/\balt=/.test(img[1])) errors.push(`${route}: <img> without alt`);
    if (!/\bwidth=/.test(img[1]) || !/\bheight=/.test(img[1])) errors.push(`${route}: <img> without width/height`);
  }
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (ld.length !== 1) errors.push(`${route}: expected exactly one JSON-LD block, found ${ld.length}`);
  for (const m of ld) {
    try { if (!JSON.parse(m[1])['@graph']) errors.push(`${route}: JSON-LD without @graph`); }
    catch (e) { errors.push(`${route}: invalid JSON-LD (${e.message})`); }
  }
}

for (const [route, n] of inbound) if (n === 0 && !ORPHAN_OK.has(route)) errors.push(`orphan page: ${route}`);

if (errors.length) {
  console.error(`\n[check-site] ${errors.length} problem(s):\n` + errors.map((e) => '  - ' + e).join('\n'));
  process.exit(1);
}
console.log(`[check-site] ${pages.length} pages OK: internal links, orphans, budgets (JS ≤ ${JS_BUDGET / 1024} KB, CSS ≤ ${CSS_BUDGET / 1024} KB gz), SEO invariants, JSON-LD.`);
