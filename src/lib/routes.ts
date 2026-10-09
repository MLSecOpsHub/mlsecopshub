/**
 * Registry of every indexable page, used for OG images, llms.txt and the
 * orphan check. Collection entries are appended at build time.
 */
import { getServices, getReadiness, getCaseNotes, getPosts, noteTitle } from './content';
import { HOLDING_PAGE } from '../config/holding.mjs';

export interface RouteMeta { path: string; title: string; kicker: string; subtitle?: string; section: string }

const HOME: RouteMeta = HOLDING_PAGE
  ? { path: '/', title: 'MLSecOps and AI security, built in the open', kicker: 'MLSecOpsHub', subtitle: 'Open-source tooling and research on GitHub · The MLSecOps Hacker newsletter', section: 'Home' }
  : { path: '/', title: 'MLSecOps and AI security for teams that ship models and agents', kicker: 'MLSecOpsHub', subtitle: 'AI security assessment · MLSecOps pipeline hardening · AI governance readiness', section: 'Home' };

export const STATIC_ROUTES: RouteMeta[] = [
  HOME,
  { path: '/services', title: 'MLSecOps consulting: three fixed-scope engagements', kicker: 'Services', subtitle: 'Quoted after a 30-minute call. Artifacts your engineers merge and your auditors read.', section: 'Services' },
  { path: '/readiness', title: 'AI governance readiness: obligations mapped to controls', kicker: 'Readiness', subtitle: 'EU AI Act · Cyber Resilience Act · NIST AI RMF · ISO/IEC 42001', section: 'Readiness' },
  { path: '/case-notes', title: 'Case notes: what an MLSecOps engagement changes', kicker: 'Case notes', subtitle: 'Context → Finding → Fix → Outcome. Anonymized composites.', section: 'Case notes' },
  { path: '/data', title: 'Agentic Attack Index', kicker: 'Data', subtitle: 'Documented prompt injection, AI agent and MCP incidents with primary sources. CC BY 4.0.', section: 'Data' },
  { path: '/about', title: 'Riccardo Biosas, security engineer, founder of MLSecOpsHub', kicker: 'About', subtitle: 'The MLSecOps Hacker newsletter · awesome-MLSecOps', section: 'About' },
  { path: '/newsletter', title: 'The MLSecOps Hacker: AI security every two weeks', kicker: 'Newsletter', subtitle: 'MLSecOps practice, model supply chain, prompt injection, agent security, governance.', section: 'Newsletter' },
  { path: '/blog', title: 'Announcements and data releases', kicker: 'Blog', section: 'Blog' },
  { path: '/contact', title: 'Contact MLSecOpsHub', kicker: 'Contact', subtitle: 'Book a 30-minute assessment call, email, or a two-field form.', section: 'Contact' },
  { path: '/privacy', title: 'Privacy notice', kicker: 'Legal', section: 'Legal' },
  { path: '/imprint', title: 'Imprint', kicker: 'Legal', section: 'Legal' },
];

export async function allRoutes(): Promise<RouteMeta[]> {
  const [services, readiness, notes, posts] = await Promise.all([getServices(), getReadiness(), getCaseNotes(), getPosts()]);
  return [
    ...STATIC_ROUTES,
    ...services.map((s) => ({ path: `/services/${s.id}`, title: s.data.shortTitle, kicker: 'Service', subtitle: s.data.summary, section: 'Services' })),
    ...readiness.map((r) => ({ path: `/readiness/${r.id}`, title: r.data.title.replace(/\s*\|\s*MLSecOpsHub$/, ''), kicker: `Readiness · ${r.data.framework}`, subtitle: r.data.summary, section: 'Readiness' })),
    ...notes.map((n) => ({ path: `/case-notes/${n.id}`, title: noteTitle(n.data.title), kicker: 'Case note · illustrative composite', subtitle: n.data.summary, section: 'Case notes' })),
    ...posts.map((p) => ({ path: `/blog/${p.id}`, title: p.data.title, kicker: 'Blog', subtitle: p.data.description, section: 'Blog' })),
  ];
}
