import type { APIRoute } from 'astro';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const COLS = ['id', 'disclosed', 'product', 'vendor', 'vector', 'surface', 'impact', 'status', 'summary', 'source', 'sourceName'] as const;
const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;

export const GET: APIRoute = async () => {
  const rows = JSON.parse(await readFile(resolve(process.cwd(), 'data/agentic-attack-index.json'), 'utf8')) as Record<string, unknown>[];
  const csv = [COLS.join(','), ...rows.map((r) => COLS.map((c) => esc(r[c])).join(','))].join('\n') + '\n';
  return new Response(csv, { headers: { 'Content-Type': 'text/csv; charset=utf-8' } });
};
