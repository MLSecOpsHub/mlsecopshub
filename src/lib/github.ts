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

export interface OrgRepo {
  name: string;
  url: string;
  description: string;
  homepage: string;
  language: string;
  stars: number;
  topics: string[];
  pushedAt: string;
  fork: boolean;
}
export interface OrgRepos {
  repos: OrgRepo[];
  fetchedAt: string;
}

const ORG_CACHE = cachePath('github-org.json');

/**
 * Public, non-archived repositories of the MLSecOpsHub organization, used by
 * the holding landing page. Same fetch-once, cache-on-success policy as
 * getGitHubStats. The awesome-MLSecOps list is pinned first; the rest are
 * ordered by last push.
 */
export const getOrgRepos = memoize(async (): Promise<OrgRepos> => {
  const org = SITE.github.orgName;
  try {
    const res = await fetch(`https://api.github.com/orgs/${org}/repos?per_page=100&type=public&sort=pushed`, { headers: headers() });
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
    const json = (await res.json()) as Array<Record<string, unknown>>;
    const repos: OrgRepo[] = json
      .filter((r) => !r.archived && !r.private)
      .map((r) => ({
        name: String(r.name),
        url: String(r.html_url),
        description: typeof r.description === 'string' ? r.description.trim() : '',
        homepage: typeof r.homepage === 'string' ? r.homepage.trim() : '',
        language: typeof r.language === 'string' ? r.language : '',
        stars: Number(r.stargazers_count ?? 0),
        topics: Array.isArray(r.topics) ? (r.topics as string[]) : [],
        pushedAt: String(r.pushed_at),
        fork: Boolean(r.fork),
      }))
      .sort((a, b) => {
        const pin = (x: OrgRepo) => (x.name.toLowerCase() === 'awesome-mlsecops' ? 0 : 1);
        return pin(a) - pin(b) || b.pushedAt.localeCompare(a.pushedAt);
      });
    const data: OrgRepos = { repos, fetchedAt: new Date().toISOString() };
    await writeCache(ORG_CACHE, data);
    return data;
  } catch (err) {
    const cached = await readCache<OrgRepos>(ORG_CACHE);
    if (cached) {
      console.warn(`[github] using cached org repos from ${cached.fetchedAt}: ${(err as Error).message}`);
      return cached;
    }
    throw err;
  }
});
