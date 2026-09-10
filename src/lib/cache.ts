import { readFile, writeFile, rename } from 'node:fs/promises';
import { resolve } from 'node:path';

/**
 * Build-time cache for remote data (GitHub, Substack).
 *
 * The cache files live under src/, which the dev server watches. Writing them
 * while `astro dev` renders a page triggers a full reload, the browser
 * re-requests the page, the page rewrites the cache, and so on forever. Writes
 * are therefore restricted to `astro build`, and are atomic (tmp + rename) so a
 * reload mid-write can never leave a truncated file behind.
 */
const WRITE_ENABLED = import.meta.env.PROD;

export function cachePath(name: string): string {
  return resolve(process.cwd(), 'src/data/cache', name);
}

export async function readCache<T>(file: string): Promise<T | null> {
  try {
    return JSON.parse(await readFile(file, 'utf8')) as T;
  } catch {
    return null;
  }
}

export async function writeCache(file: string, data: unknown): Promise<void> {
  if (!WRITE_ENABLED) return;
  const tmp = `${file}.${process.pid}.tmp`;
  try {
    await writeFile(tmp, JSON.stringify(data, null, 2) + '\n');
    await rename(tmp, file);
  } catch {
    /* a cache write must never break a build */
  }
}

/** Run `fn` once per process and share the result between pages. */
export function memoize<T>(fn: () => Promise<T>): () => Promise<T> {
  let inflight: Promise<T> | undefined;
  return () => {
    inflight ??= fn().catch((err) => {
      inflight = undefined;
      throw err;
    });
    return inflight;
  };
}
