// Holding mode for mlsecopshub.com.
//
// While HOLDING_PAGE is true the build ships only a minimalist landing page
// (the GitHub projects of the MLSecOpsHub organization and The MLSecOps Hacker
// newsletter), the legal pages, llms.txt and the 404 page. Everything that
// advertises consulting and auditing services is withheld:
//   - src/middleware.ts answers every other route with an empty 404 at build
//     time, so Astro skips generating it (services, readiness, case notes,
//     data, blog, about, newsletter, contact and their feeds and OG images);
//   - Header, Footer, Head, 404 and llms.txt render reduced variants;
//   - src/config/site.ts swaps the organization description used in JSON-LD.
//
// Nothing is deleted. To restore the full site set HOLDING_PAGE to false (or
// build once with PUBLIC_HOLDING_PAGE=false), then also revert the URL lists in
// lighthouserc.json and .pa11yci.json to include a service and a readiness page.
//
// Plain ESM so astro.config.mjs can import it for the sitemap filter.
export const HOLDING_PAGE = process.env.PUBLIC_HOLDING_PAGE !== 'false';

/** Routes that are still built in holding mode. Paths without trailing slash. */
export const HOLDING_ROUTES = new Set([
  '/',
  '/privacy',
  '/imprint',
  '/404',
  '/llms.txt',
  '/og/home.png',
  '/og/privacy.png',
  '/og/imprint.png',
]);

/** @param {string} pathname */
export function isHoldingRoute(pathname) {
  const p = pathname.replace(/\/$/, '') || '/';
  return HOLDING_ROUTES.has(p);
}
