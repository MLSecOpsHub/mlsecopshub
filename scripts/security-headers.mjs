// Post-build: computes CSP hashes for every inline <script> and <style> in
// dist/ and writes vercel.json with the full security-header set, plus a
// portable dist/_headers file (Cloudflare Pages / Netlify format).
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
const scriptHashes = new Set();
const styleHashes = new Set();
const sha = (s) => `'sha256-${createHash('sha256').update(s, 'utf8').digest('base64')}'`;

(function walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.html')) scan(readFileSync(p, 'utf8'));
  }
})(DIST);

function scan(html) {
  for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (/\bsrc=/.test(m[1])) continue;
    if (/type=["']application\/ld\+json["']/.test(m[1])) continue; // data block, never executed
    if (m[2].trim()) scriptHashes.add(sha(m[2]));
  }
  for (const m of html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) {
    if (m[1].trim()) styleHashes.add(sha(m[1]));
  }
}

const csp = [
  "default-src 'self'",
  ["script-src 'self'", ...scriptHashes, 'https://app.cal.com'].join(' '),
  ["style-src 'self'", ...styleHashes, 'https://app.cal.com'].join(' '),
  "img-src 'self' data: https:",
  "font-src 'self'",
  "connect-src 'self' https://app.cal.com https://api.cal.com",
  'frame-src https://app.cal.com https://cal.com https://themlsecopshacker.com',
  "form-action 'self' https://themlsecopshacker.com",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
];

const vercel = {
  $schema: 'https://openapi.vercel.sh/vercel.json',
  framework: 'astro',
  buildCommand: 'npm run build',
  outputDirectory: 'dist',
  cleanUrls: true,
  trailingSlash: false,
  headers: [
    { source: '/(.*)', headers: securityHeaders },
    { source: '/_astro/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
    { source: '/fonts/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
    { source: '/og/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=86400' }] },
    { source: '/downloads/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=3600' }] },
    { source: '/data/agentic-attack-index.(json|csv)', headers: [{ key: 'Access-Control-Allow-Origin', value: '*' }, { key: 'Cache-Control', value: 'public, max-age=3600' }] },
    { source: '/llms.txt', headers: [{ key: 'Cache-Control', value: 'public, max-age=3600' }] },
  ],
};
writeFileSync('vercel.json', JSON.stringify(vercel, null, 2) + '\n');

const headersFile = ['/*', ...securityHeaders.map((h) => `  ${h.key}: ${h.value}`), '', '/_astro/*', '  Cache-Control: public, max-age=31536000, immutable', '', '/fonts/*', '  Cache-Control: public, max-age=31536000, immutable', ''].join('\n');
writeFileSync(join(DIST, '_headers'), headersFile);
console.log(`[headers] ${scriptHashes.size} script hashes, ${styleHashes.size} style hashes → vercel.json, dist/_headers`);
