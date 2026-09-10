import { XMLParser } from 'fast-xml-parser';
import { SITE } from '../config/site';
import { cachePath, memoize, readCache, writeCache } from './cache';

export interface Issue {
  title: string;
  url: string;
  date: string; // ISO
  summary: string;
}
export interface NewsletterData {
  issues: Issue[];
  count: number;
  fetchedAt: string;
}

const CACHE = cachePath('substack.json');
const UA = { 'User-Agent': 'Mozilla/5.0 (compatible; mlsecopshub-build/1.0; +https://mlsecopshub.com)' };

function stripHtml(s: string): string {
  return s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

async function fetchFeed(): Promise<Issue[]> {
  const res = await fetch(SITE.newsletter.feed, { headers: UA });
  if (!res.ok) throw new Error(`Substack feed ${res.status}`);
  const xml = await res.text();
  const parser = new XMLParser({ ignoreAttributes: false, cdataPropName: '__cdata' });
  const doc = parser.parse(xml);
  const raw = doc?.rss?.channel?.item ?? [];
  const items = Array.isArray(raw) ? raw : [raw];
  const text = (v: unknown): string => {
    if (v == null) return '';
    if (typeof v === 'object' && '__cdata' in (v as object)) return String((v as { __cdata: unknown }).__cdata);
    return String(v);
  };
  return items.map((it: Record<string, unknown>) => ({
    title: text(it.title),
    url: text(it.link).split('?')[0],
    date: new Date(text(it.pubDate)).toISOString(),
    summary: stripHtml(text(it.description)).slice(0, 220),
  }));
}

/** Total published posts via the archive API (paginated), falling back to the feed length. */
async function fetchCount(feedLength: number): Promise<number> {
  let total = 0;
  let offset = 0;
  for (let page = 0; page < 20; page++) {
    const res = await fetch(`${SITE.newsletter.archiveApi}?sort=new&limit=50&offset=${offset}`, { headers: UA });
    if (!res.ok) return Math.max(total, feedLength);
    const arr = (await res.json()) as unknown[];
    total += arr.length;
    offset += arr.length;
    if (arr.length < 50) break;
  }
  return Math.max(total, feedLength);
}

/**
 * Latest newsletter issues and total issue count, read from Substack once per
 * build. Cached in the repo as a fallback for offline or failed builds.
 * In `astro dev` the cache is read but never written (see ./cache.ts).
 */
export const getNewsletter = memoize(async (): Promise<NewsletterData> => {
  try {
    const issues = await fetchFeed();
    const count = await fetchCount(issues.length);
    const data: NewsletterData = { issues: issues.slice(0, 20), count, fetchedAt: new Date().toISOString() };
    await writeCache(CACHE, data);
    return data;
  } catch (err) {
    const cached = await readCache<NewsletterData>(CACHE);
    if (cached) {
      console.warn(`[substack] using cached issues from ${cached.fetchedAt}: ${(err as Error).message}`);
      return cached;
    }
    throw err;
  }
});
