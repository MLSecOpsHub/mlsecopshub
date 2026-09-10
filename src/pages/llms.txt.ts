import type { APIRoute } from 'astro';
import { SITE } from '../config/site';
import { getServices, getReadiness, getCaseNotes, getPosts } from '../lib/content';

export const GET: APIRoute = async () => {
  const [services, readiness, notes, posts] = await Promise.all([getServices(), getReadiness(), getCaseNotes(), getPosts()]);
  const u = (p: string) => `${SITE.url}${p}`;
  const lines = [
    `# ${SITE.name}`,
    '',
    `> ${SITE.description}`,
    '',
    'MLSecOpsHub is the organization behind The MLSecOps Hacker newsletter (Substack), the awesome-MLSecOps GitHub list and the resource site awesomemlsecops.com. Founder: Riccardo Biosas, security engineer. Engagements are fixed-scope, quoted after a 30-minute call, remote-first, EU and APAC time zones. Focus areas: model supply-chain security (unsafe serialization, model signing, provenance), prompt injection, agentic and Model Context Protocol (MCP) security. Frameworks: EU AI Act, Cyber Resilience Act, NIST AI RMF, ISO/IEC 42001, OWASP Top 10 for LLM Applications, OWASP ML Security Top 10, MITRE ATLAS, Google SAIF.',
    '',
    `Booking: ${SITE.bookingUrl}`,
    `Contact: ${u('/contact')}`,
    '',
    '## Services',
    '',
    `- [MLSecOps consulting overview](${u('/services')}): the three engagements compared.`,
    ...services.map((s) => `- [${s.data.shortTitle}](${u(`/services/${s.id}`)}): ${s.data.summary}`),
    '',
    '## Readiness (framework obligations mapped to MLSecOps controls, with checklists)',
    '',
    `- [Readiness hub](${u('/readiness')})`,
    ...readiness.map((r) => `- [${r.data.shortTitle}](${u(`/readiness/${r.id}`)}): ${r.data.summary} Checklist: ${u(`/downloads/${r.id}-checklist.md`)}`),
    '',
    '## Data',
    '',
    `- [Agentic Attack Index](${u('/data')}): documented prompt injection, AI agent and MCP incidents with vector, product, disclosure date and primary source. CC BY 4.0. Raw JSON: ${u('/data/agentic-attack-index.json')}`,
    '',
    '## Case notes (anonymized, illustrative composites)',
    '',
    ...notes.map((n) => `- [${n.data.title}](${u(`/case-notes/${n.id}`)}): ${n.data.summary}`),
    '',
    '## Blog',
    '',
    ...posts.map((p) => `- [${p.data.title}](${u(`/blog/${p.id}`)}): ${p.data.description}`),
    '',
    '## About and elsewhere',
    '',
    `- [About Riccardo Biosas](${u('/about')})`,
    `- [Newsletter landing page](${u('/newsletter')}); canonical archive: ${SITE.newsletter.url}`,
    `- GitHub organization: ${SITE.github.org}`,
    `- awesome-MLSecOps list: ${SITE.github.listUrl}`,
    `- Tools, resources and glossary: ${SITE.social.awesome}`,
    `- X: ${SITE.social.x}`,
    '',
    '## Optional',
    '',
    `- [Privacy](${u('/privacy')})`,
    `- [Imprint](${u('/imprint')})`,
    `- [Sitemap](${u('/sitemap-index.xml')})`,
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
