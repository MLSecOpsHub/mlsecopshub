import { SITE } from '../config/site';
import { cachePath, memoize, readCache, writeCache } from './cache';

export interface GitHubStats {
  stars: number;
  forks: number;
  contributors: number;
  pushedAt: string;
  fetchedAt: string;
}

const CACHE = cachePath('github.json');

function headers(): HeadersInit {
  const h: Record<string, string> = { Accept: 'application/vnd.github+json', 'User-Agent': 'mlsecopshub-build' };
  const token = process.env.GITHUB_TOKEN;
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

/**
 * Stars, forks and contributor count for the awesome-MLSecOps repository.
 * Fetched once per build; the last successful response is cached in the repo
 * so an API rate limit never breaks a build or ships a hard-coded number.
 * In `astro dev` the cache is read but never written (see ./cache.ts).
 */
export const getGitHubStats = memoize(async (): Promise<GitHubStats> => {
  const repo = SITE.github.listRepo;
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, { headers: headers() });
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
    const json = (await res.json()) as { stargazers_count: number; forks_count: number; pushed_at: string };
    const c = await fetch(`https://api.github.com/repos/${repo}/contributors?per_page=1&anon=true`, { headers: headers() });
    let contributors = 0;
    if (c.ok) {
      const link = c.headers.get('link') ?? '';
      const m = link.match(/page=(\d+)>; rel="last"/);
      contributors = m ? Number(m[1]) : ((await c.json()) as unknown[]).length;
    }
    const stats: GitHubStats = {
      stars: json.stargazers_count,
      forks: json.forks_count,
      contributors,
      pushedAt: json.pushed_at,
      fetchedAt: new Date().toISOString(),
    };
    await writeCache(CACHE, stats);
    return stats;
  } catch (err) {
    const cached = await readCache<GitHubStats>(CACHE);
    if (cached) {
      console.warn(`[github] using cached stats from ${cached.fetchedAt}: ${(err as Error).message}`);
      return cached;
    }
    throw err;
  }
});
