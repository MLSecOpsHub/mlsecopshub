/**
 * Single source of truth for site-wide constants and the placeholders that
 * must be filled before launch. Placeholders are read from environment
 * variables (see .env.example) so that no secret or account-specific value
 * has to be committed.
 */
import { HOLDING_PAGE } from './holding.mjs';

const env = import.meta.env;

export const SITE = {
  name: 'MLSecOpsHub',
  legalName: 'MLSecOpsHub',
  url: 'https://mlsecopshub.com',
  tagline: HOLDING_PAGE ? 'Open-source MLSecOps and AI security' : 'MLSecOps and AI security consulting',
  description: HOLDING_PAGE
    ? 'MLSecOpsHub is a GitHub organization and community building open-source MLSecOps and AI security tooling, datasets and research for securing ML pipelines, LLM applications, AI agents and autonomous AI architectures. It publishes The MLSecOps Hacker newsletter.'
    // Withheld for now (education and career hub), previously before the newsletter sentence: 'It also aims to be the central hub for education and career resources in the field: courses and learning material on AI security, AI governance and MLSecOps, the AI security job market, the certification landscape, and the conferences, events and meetups in the space.'
    // Withheld for now (explicit project listing): ' It publishes The MLSecOps Hacker newsletter, the awesome-MLSecOps list and the Agentic Attack Index.'
    : 'MLSecOpsHub is the MLSecOps and AI security practice behind The MLSecOps Hacker newsletter and the awesome-MLSecOps list. It delivers AI security assessments, MLSecOps pipeline hardening and AI governance readiness.',
  locale: 'en',
  founder: {
    name: 'Riccardo Biosas',
    jobTitle: 'Security Engineer, Founder of MLSecOpsHub',
    /** The about page is not built in holding mode, so the founder URL falls back to the home page. */
    url: HOLDING_PAGE ? 'https://mlsecopshub.com/' : 'https://mlsecopshub.com/about',
  },
  // ---- Placeholders (set in .env / host environment) -----------------------
  /** Cal.com (or equivalent) booking page. */
  bookingUrl: env.PUBLIC_BOOKING_URL ?? 'https://cal.com/riccardobiosas/30min',
  /** Cal.com "calLink" used by the lazy-loaded embed, e.g. "riccardobiosas/30min". */
  calLink: env.PUBLIC_CAL_LINK ?? 'riccardobiosas/30min',
  /**
   * Vercel Web Analytics. On by default only in Vercel builds, because the
   * /_vercel/insights script exists nowhere else; PUBLIC_ANALYTICS=on|off overrides.
   */
  analytics: env.PUBLIC_ANALYTICS ? env.PUBLIC_ANALYTICS === 'on' : process.env.VERCEL === '1',
  /** Contact form endpoint. Defaults to the bundled Vercel function in /api/contact.ts. */
  formEndpoint: env.PUBLIC_FORM_ENDPOINT ?? '/api/contact',
  contactEmail: env.PUBLIC_CONTACT_EMAIL ?? 'hello@mlsecopshub.com',
  // ---- Fixed brand properties ---------------------------------------------
  cta: {
    booking: 'Book a 30-minute assessment call',
    bookingShort: 'Book a call',
    heroPrimary: 'Book an assessment',
    heroSecondary: 'Read the newsletter',
    newsletter: 'Subscribe to The MLSecOps Hacker',
  },
  newsletter: {
    name: 'The MLSecOps Hacker',
    url: 'https://themlsecopshacker.com',
    feed: 'https://themlsecopshacker.com/feed',
    archiveApi: 'https://themlsecopshacker.com/api/v1/archive',
    embed: 'https://themlsecopshacker.com/embed',
    subscribeAction: 'https://themlsecopshacker.com/api/v1/free',
    whatIsMlsecops: 'https://themlsecopshacker.com/p/what-is-mlsecops',
  },
  github: {
    org: 'https://github.com/MLSecOpsHub',
    orgName: 'MLSecOpsHub',
    /** Repository the stars badge is read from. Update after the transfer to the org. */
    listRepo: env.PUBLIC_GITHUB_LIST_REPO ?? 'RiccardoBiosas/awesome-MLSecOps',
    listUrl: `https://github.com/${env.PUBLIC_GITHUB_LIST_REPO ?? 'RiccardoBiosas/awesome-MLSecOps'}`,
    dataRepo: env.PUBLIC_GITHUB_DATA_REPO ?? 'MLSecOpsHub/agentic-attack-index',
  },
  social: {
    x: 'https://x.com/MLSecOpsHacker',
    instagram: 'https://instagram.com/aisecurity.hacker',
    substack: 'https://themlsecopshacker.com',
    githubOrg: 'https://github.com/MLSecOpsHub',
    awesome: 'https://awesomemlsecops.com',
    linkedin: env.PUBLIC_LINKEDIN_URL ?? '',
  },
  utm: '?utm_source=mlsecopshub&utm_medium=website',
} as const;

const FULL_NAV = [
  { href: '/services', label: 'Services' },
  { href: '/readiness', label: 'Readiness' },
  { href: '/case-notes', label: 'Case notes' },
  { href: '/data', label: 'Data' },
  { href: '/newsletter', label: 'Newsletter' },
  { href: '/about', label: 'About' },
] as const;

/** Holding mode has no internal sections to navigate to; the header shows outbound links only. */
export const NAV: readonly { href: string; label: string }[] = HOLDING_PAGE ? [] : FULL_NAV;

/** Append the UTM parameters to an outbound Substack or GitHub URL. */
export function utm(url: string): string {
  return url.includes('?') ? `${url}&utm_source=mlsecopshub&utm_medium=website` : `${url}${SITE.utm}`;
}
