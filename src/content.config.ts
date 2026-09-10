import { defineCollection, reference } from 'astro:content';
import { z } from 'astro/zod';
import { glob, file } from 'astro/loaders';

const faq = z.array(z.object({ q: z.string(), a: z.string() }));

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string().max(60),
    description: z.string().min(140).max(155),
    keyword: z.string(),
    answer: z.string(),
    shortTitle: z.string(),
    summary: z.string(),
    serviceType: z.string(),
    duration: z.string(),
    order: z.number().int(),
    forWho: z.array(z.string()),
    scope: z.array(z.string()),
    clientProvides: z.array(z.string()),
    deliverables: z.array(z.string()),
    readiness: z.array(reference('readiness')).default([]),
    faq,
    updated: z.coerce.date(),
  }),
});

const readiness = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/readiness' }),
  schema: z.object({
    title: z.string().max(60),
    description: z.string().min(140).max(155),
    keyword: z.string(),
    answer: z.string(),
    framework: z.string(),
    shortTitle: z.string(),
    summary: z.string(),
    officialSource: z.object({ label: z.string(), url: z.url() }),
    service: reference('services'),
    order: z.number().int(),
    controls: z.array(
      z.object({
        obligation: z.string(),
        reference: z.string(),
        control: z.string(),
        evidence: z.string(),
      }),
    ),
    checklist: z.array(z.object({ section: z.string(), items: z.array(z.string()) })),
    faq,
    published: z.coerce.date(),
    updated: z.coerce.date(),
  }),
});

const caseNotes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/case-notes' }),
  schema: z.object({
    title: z.string().max(60),
    description: z.string().min(140).max(155),
    summary: z.string(),
    sector: z.string(),
    lane: z.enum(['model-supply-chain', 'prompt-injection', 'agentic-mcp']),
    service: reference('services'),
    readiness: reference('readiness'),
    published: z.coerce.date(),
    updated: z.coerce.date(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string().max(60),
    description: z.string().min(140).max(155),
    published: z.coerce.date(),
    updated: z.coerce.date(),
    /** Set only when republishing a newsletter article; becomes rel=canonical. */
    canonical: z.url().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

const datasets = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/data' }),
  schema: z.object({
    title: z.string().max(60),
    description: z.string().min(140).max(155),
    keyword: z.string(),
    answer: z.string(),
    name: z.string(),
    file: z.string(),
    rawUrl: z.url(),
    repoUrl: z.url(),
    license: z.url(),
    published: z.coerce.date(),
    updated: z.coerce.date(),
    columns: z.array(z.object({ key: z.string(), label: z.string(), description: z.string() })),
    faq,
  }),
});

const attackIndex = defineCollection({
  loader: file('./data/agentic-attack-index.json'),
  schema: z.object({
    id: z.string(),
    disclosed: z.string().regex(/^\d{4}-\d{2}(-\d{2})?$/),
    product: z.string(),
    vendor: z.string(),
    vector: z.enum([
      'indirect-prompt-injection',
      'direct-prompt-injection',
      'tool-permission-abuse',
      'mcp-server-compromise',
      'data-exfiltration',
      'agent-hijacking',
    ]),
    surface: z.string(),
    impact: z.string(),
    summary: z.string(),
    source: z.url(),
    sourceName: z.string(),
    status: z.enum(['fixed', 'mitigated', 'unpatched', 'disputed', 'unknown']),
  }),
});

export const collections = { services, readiness, caseNotes, blog, datasets, attackIndex };
