import { getCollection, type CollectionEntry } from 'astro:content';

export type Service = CollectionEntry<'services'>;
export type Readiness = CollectionEntry<'readiness'>;
export type CaseNote = CollectionEntry<'caseNotes'>;
export type Post = CollectionEntry<'blog'>;

export async function getServices(): Promise<Service[]> {
  return (await getCollection('services')).sort((a, b) => a.data.order - b.data.order);
}
export async function getReadiness(): Promise<Readiness[]> {
  return (await getCollection('readiness')).sort((a, b) => a.data.order - b.data.order);
}
export async function getCaseNotes(): Promise<CaseNote[]> {
  return (await getCollection('caseNotes')).sort((a, b) => b.data.published.getTime() - a.data.published.getTime());
}
export async function getPosts(): Promise<Post[]> {
  return (await getCollection('blog')).sort((a, b) => b.data.published.getTime() - a.data.published.getTime());
}
export const fmtDate = (d: Date | string) =>
  new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });

export const LANE_LABEL: Record<string, string> = {
  'model-supply-chain': 'Model supply chain',
  'prompt-injection': 'Prompt injection',
  'agentic-mcp': 'Agentic / MCP',
};

/** "Case note: pickle model loading…" → "Pickle model loading…" */
export function noteTitle(title: string): string {
  const t = title.replace(/^Case note:\s*/i, '');
  return t.charAt(0).toUpperCase() + t.slice(1);
}
