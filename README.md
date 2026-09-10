# mlsecopshub.com

Production website for **MLSecOpsHub**, the MLSecOps and AI security practice behind [The MLSecOps Hacker](https://themlsecopshacker.com) newsletter and the [awesome-MLSecOps](https://github.com/RiccardoBiosas/awesome-MLSecOps) list. Static Astro site, TypeScript, Tailwind v4, deployed to Vercel.

The site ships no security tooling; it links to the open-source ecosystem curated on [awesomemlsecops.com](https://awesomemlsecops.com).

## Local development

```bash
nvm use            # Node 24 (see .nvmrc); Astro 7 requires ≥ 22.12
npm install
cp .env.example .env   # fill the placeholders (booking URL, analytics domain, …)
npm run dev            # http://localhost:4321
```

`npm run build` runs the full pipeline:

| Step | Script | What it does |
|---|---|---|
| prebuild | `scripts/build-icons.mjs` | Rasterizes `public/logo.svg` into PNG icons and `favicon.ico` |
| prebuild | `scripts/build-checklists.mjs` | Generates `public/downloads/<slug>-checklist.{md,pdf}` from each readiness page's `checklist` frontmatter |
| build | `astro build` | Fetches GitHub stars/contributors and the Substack feed (cached in `src/data/cache/` as fallback), renders pages, OG images (`/og/*.png`), `llms.txt`, RSS feeds, sitemap |
| postbuild | `scripts/security-headers.mjs` | Hashes every inline script/style in `dist/` and writes `vercel.json` (CSP, HSTS, etc.) plus `dist/_headers` |
| postbuild | `scripts/check-site.mjs` | Fails on broken internal links, orphan pages, JS > 30 KB or CSS > 40 KB gzipped per page, missing/oversized title or description, missing canonical or JSON-LD |

Other commands: `npm run check` (types), `npm run preview`, `npm run test:lighthouse` (needs Chrome), `npm run test:a11y` (needs the preview server on :4321).

## Project layout

```
src/
  config/site.ts          site constants and every placeholder (env-driven)
  content.config.ts       collection schemas (services, readiness, caseNotes, blog, datasets, attackIndex)
  content/                markdown for each collection
  layouts/Base.astro      html/head/header/main/footer, JSON-LD @graph
  components/             Head, Header, Footer, CtaBlock, NewsletterForm, BookingEmbed, Faq, Breadcrumbs, JsonLd, cards
  lib/                    jsonld.ts, github.ts, substack.ts, og.ts, routes.ts, content.ts, routes-lastmod.mjs
  pages/                  routes (see SEO.md for the full map)
  styles/global.css       design tokens (dark first, light via prefers-color-scheme), fonts, components
data/agentic-attack-index.json   canonical dataset rendered on /data (also served as JSON and CSV)
api/contact.ts            Vercel function for the contact form
scripts/                  build-time generators and checks
.github/workflows/ci.yml  build → check → Lighthouse (perf ≥ 95) → Pa11y → artifacts
```

## Placeholders to fill before launch

All are read from environment variables (`.env` locally, project settings on Vercel). Defaults live in `src/config/site.ts`.

| Variable | Used for |
|---|---|
| `PUBLIC_BOOKING_URL` | Every "Book a 30-minute assessment call" link (Cal.com or equivalent) |
| `PUBLIC_CAL_LINK` | Cal.com `calLink` for the lazy-loaded embed on /contact (e.g. `riccardobiosas/30min`) |
| `PUBLIC_ANALYTICS_DOMAIN` | Plausible `data-domain`; leave empty to disable analytics |
| `PUBLIC_ANALYTICS_SCRIPT` | Plausible script URL (self-hosted Plausible: change host and update the CSP in `scripts/security-headers.mjs`) |
| `PUBLIC_FORM_ENDPOINT` | Contact form action; defaults to the bundled `/api/contact` |
| `PUBLIC_CONTACT_EMAIL` | Shown on /contact, /privacy, /imprint and in Organization JSON-LD |
| `PUBLIC_GITHUB_LIST_REPO` | Repo for the stars badge; switch to `MLSecOpsHub/awesome-MLSecOps` after the transfer |
| `PUBLIC_GITHUB_DATA_REPO` | Repo that hosts the Agentic Attack Index |
| `PUBLIC_LINKEDIN_URL` | Optional; adds a `rel="me"` link and Person `sameAs` |
| `GITHUB_TOKEN` | Optional at build time; raises the GitHub API rate limit |
| `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` **or** `CONTACT_WEBHOOK_URL` | Server-side delivery for `/api/contact` |
| Imprint | Edit the bracketed placeholders in `src/pages/imprint.astro` (legal entity, address, registration) |

## Content authoring

Every collection is validated at build time by the Zod schemas in `src/content.config.ts`. Titles must be ≤ 60 characters and descriptions 140–155 characters; the build fails otherwise.

### Services (`src/content/services/<slug>.md`)

```yaml
title: "AI Security Assessment for LLM Apps and Agents | MLSecOpsHub"   # ≤ 60 chars, keyword first
description: "…"                 # 140–155 chars, written as an answer
keyword: "AI security assessment"
answer: "…"                      # 40–60 words, rendered directly under the h1
shortTitle: "AI security assessment"
summary: "…"                     # one sentence for cards
serviceType: "AI security assessment"   # Service.serviceType in JSON-LD
duration: "2 to 4 weeks, …"
order: 1
forWho: [ … ]                    # bullet list
scope: [ … ]                     # numbered scope
clientProvides: [ … ]
deliverables: [ … ]
readiness: [nist-ai-rmf, eu-ai-act]   # references to readiness slugs
faq: [{ q: "…", a: "… may contain <a href> …" }]   # 3–5 items → FAQPage JSON-LD
updated: 2026-09-08
```
Body: Markdown, no h1. Rendered after the structured sections.

### Readiness (`src/content/readiness/<slug>.md`)

Same `title`, `description`, `keyword`, `answer`, `shortTitle`, `summary`, `faq`, plus:

```yaml
framework: "EU AI Act (Regulation (EU) 2024/1689)"
officialSource: { label: "…", url: "https://…" }
service: ai-governance-readiness      # the service that implements the controls
order: 1
controls:                             # rendered as the mapping table
  - { obligation: "paraphrased", reference: "Art. 15", control: "…", evidence: "…" }
checklist:                            # rendered on the page AND exported to Markdown + PDF
  - section: "Model supply chain"
    items: ["Block pickle-based formats in CI", …]
published: 2026-09-08
updated: 2026-09-08
```
Body: 1,200–2,000 words, question-form h2s, obligations paraphrased and cited to `officialSource`, one link each to the matching service, to `/data`, and to a sibling readiness page. **To add a readiness page:** create the file, add its `order`, run `npm run build` (the checklist files, OG image, sitemap and llms.txt entry are generated), then add the route to `SEO.md`.

### Case notes (`src/content/case-notes/<slug>.md`)

```yaml
title: "Case note: pickle model loading in a CI pipeline"
description: "…"
summary: "…"
sector: "B2B SaaS, computer vision"
lane: model-supply-chain          # model-supply-chain | prompt-injection | agentic-mcp
service: mlsecops-pipeline-hardening
readiness: cyber-resilience-act
published: 2026-09-08
updated: 2026-09-08
```
Body: an opening 40–60-word paragraph, then h2 sections **Context → Finding → Fix → Outcome**, 500–800 words, a composite disclaimer blockquote at the top of Context, and one inline SVG in `<figure class="diagram">` using the classes `box`, `box-bad`, `box-good`, `arrow`, `arrowhead`, `label` (styled globally, theme-aware). Link once to the service and once to the readiness page. **To add a case note:** create the file; the listing, RSS item, OG image and internal-link check pick it up on the next build.

### Blog (`src/content/blog/<slug>.md`)

`title`, `description`, `published`, `updated`, `tags`, and optional `canonical` (set it to the Substack URL when republishing a newsletter article; it becomes `rel=canonical` and the RSS link).

### Datasets (`src/content/data/<slug>.md`) and the Agentic Attack Index

`src/content/data/agentic-attack-index.md` holds the page copy, columns, FAQ and distribution URLs. Rows live in `data/agentic-attack-index.json` (validated by the `attackIndex` schema: `id`, `disclosed`, `product`, `vendor`, `vector`, `surface`, `impact`, `summary`, `source`, `sourceName`, `status`). Add an entry with a primary source, keep the array sorted by `disclosed` descending, and bump `updated` in the markdown file. See `data/README.md` for the contribution rules.

## Deploy (Vercel)

1. Import the repository in Vercel. Framework preset: Astro; build command `npm run build`; output `dist`. Node 24 (set in Project Settings → General).
2. Add the `PUBLIC_*` variables and the contact-form secrets in Project Settings → Environment Variables.
3. `vercel.json` (generated by the build and committed) sets `cleanUrls`, `trailingSlash: false`, the CSP with per-build script/style hashes, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`, COOP/CORP and cache headers. CI fails if the committed `vercel.json` differs from the build output, so always commit it after `npm run build`.
4. `api/contact.ts` deploys automatically as a Vercel Function.
5. A weekly scheduled workflow rebuilds so GitHub stars and newsletter counts stay current; connect Vercel's Git integration or add a deploy hook to the workflow.

Cloudflare Pages alternative: the build also writes `dist/_headers` with the same security headers; set build output to `dist`, and move the contact function to a Pages Function.

## CI

`.github/workflows/ci.yml` runs on push, pull request and weekly: type-check → build (with all post-build checks) → Lighthouse CI on Home, one service page and one readiness page (fails under 95 performance, asserts LCP < 1.8 s and CLS < 0.05) → Pa11y (WCAG 2.2 AA via axe and HTML_CodeSniffer) → uploads `reports/lighthouse` and `reports/pa11y` as artifacts.
