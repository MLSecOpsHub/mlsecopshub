import type { APIRoute } from 'astro';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

export const GET: APIRoute = async () => {
  const json = await readFile(resolve(process.cwd(), 'data/agentic-attack-index.json'), 'utf8');
  return new Response(json, { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
