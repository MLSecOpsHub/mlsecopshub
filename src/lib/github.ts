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
  /** Commits on the default branch; 0 for an empty repository. */
  commits: number;
}
export interface OrgRepos {
  repos: OrgRepo[];
  fetchedAt: string;
}

const ORG_CACHE = cachePath('github-org.json');

/**
 * Number of commits on the default branch, from the Link header of a
 * one-per-page listing. GitHub answers 409 for a repository with no commits.
 * Any other failure (typically an unauthenticated rate limit) returns the
 * previously cached value, or -1 when there is none, so a transient API error
 * never hides a repository that has content.
 */
async function countCommits(fullName: string, cached: number | undefined): Promise<number> {
  try {
    const res = await fetch(`https://api.github.com/repos/${fullName}/commits?per_page=1`, { headers: headers() });
    if (res.status === 409) return 0;
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
    const m = (res.headers.get('link') ?? '').match(/page=(\d+)>; rel="last"/);
    if (m) return Number(m[1]);
    return ((await res.json()) as unknown[]).length;
  } catch (err) {
    console.warn(`[github] commit count for ${fullName} unavailable: ${(err as Error).message}`);
    return cached ?? -1;
  }
}

/**
 * Public, non-archived repositories of the MLSecOpsHub organization that have
 * at least one commit, used by the holding landing page and llms.txt. Empty
 * repositories (no commits) are dropped. Same fetch-once, cache-on-success
 * policy as getGitHubStats. The awesome-MLSecOps list is pinned first; the
 * rest are ordered by last push.
 */
export const getOrgRepos = memoize(async (): Promise<OrgRepos> => {
  const org = SITE.github.orgName;
  try {
    const res = await fetch(`https://api.github.com/orgs/${org}/repos?per_page=100&type=public&sort=pushed`, { headers: headers() });
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
    const json = (await res.json()) as Array<Record<string, unknown>>;
    const previous = new Map(((await readCache<OrgRepos>(ORG_CACHE))?.repos ?? []).map((r) => [r.name, r.commits]));
    const listed = json.filter((r) => !r.archived && !r.private);
    const commits = await Promise.all(listed.map((r) => countCommits(String(r.full_name), previous.get(String(r.name)))));
    const repos: OrgRepo[] = listed
      .map((r, i) => ({
        name: String(r.name),
        url: String(r.html_url),
        description: typeof r.description === 'string' ? r.description.trim() : '',
        // Only https links: the value is set by repo admins and rendered as an href.
        homepage: typeof r.homepage === 'string' && /^https:\/\//i.test(r.homepage.trim()) ? r.homepage.trim() : '',
        language: typeof r.language === 'string' ? r.language : '',
        stars: Number(r.stargazers_count ?? 0),
        topics: Array.isArray(r.topics) ? (r.topics as string[]) : [],
        pushedAt: String(r.pushed_at),
        fork: Boolean(r.fork),
        commits: commits[i],
      }))
      .filter((r) => r.commits !== 0)
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
