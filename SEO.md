# SEO, AEO and AI-SEO map for mlsecopshub.com

One primary keyword per page; no two pages target the same intent. Every page opens with a 40–60-word answer paragraph directly under the `<h1>`, carries a self-referencing canonical, `hreflang="en"`, one JSON-LD `@graph` (Organization, Person and WebSite on every page via the layout) and the booking CTA after the first section. Titles ≤ 60 characters, descriptions 140–155 characters (enforced by `scripts/check-site.mjs`).

## Route map

| Route | Primary keyword / intent | Title | Meta description | JSON-LD (in addition to Organization, Person, WebSite) | Internal links out |
|---|---|---|---|---|---|
| `/` | MLSecOps (entity); "what is MLSecOps" answered in the FAQ, linking to the Substack article | MLSecOps and AI Security Consulting \| MLSecOpsHub | MLSecOpsHub provides MLSecOps and AI security consulting: AI security assessments, MLSecOps pipeline hardening and AI governance readiness for AI teams. | WebPage, FAQPage | /services, all 3 service pages, /readiness + 4 readiness pages, /case-notes + 3 notes, /data, /newsletter, /about, /blog, /contact |
| `/services` | MLSecOps consulting | MLSecOps Consulting: Assessment, Hardening \| MLSecOpsHub | MLSecOps consulting from MLSecOpsHub: fixed-scope AI security assessments, MLSecOps pipeline hardening and AI governance readiness, quoted after a call. | CollectionPage, BreadcrumbList, FAQPage, Service ×3 | 3 service pages, 4 readiness pages, /data, /case-notes |
| `/services/ai-security-assessment` | AI security assessment | AI Security Assessment for LLM Apps and Agents \| MLSecOpsHub | An AI security assessment from MLSecOpsHub tests LLM apps, agents and ML pipelines for prompt injection, supply-chain and tool-permission flaws. | WebPage, BreadcrumbList, Service, FAQPage | /readiness/nist-ai-rmf, /readiness/eu-ai-act, /data, related case notes, sibling services |
| `/services/mlsecops-pipeline-hardening` | MLSecOps pipeline security | MLSecOps Pipeline Security and Hardening \| MLSecOpsHub | MLSecOps pipeline hardening from MLSecOpsHub secures training, registry and deployment pipelines: safe formats, signing, provenance, least-privilege CI. | WebPage, BreadcrumbList, Service, FAQPage | /readiness/cyber-resilience-act, /readiness/eu-ai-act, /data, related case notes, sibling services |
| `/services/ai-governance-readiness` | AI governance readiness | AI Governance Readiness: EU AI Act, ISO 42001 \| MLSecOpsHub | AI governance readiness from MLSecOpsHub maps EU AI Act, Cyber Resilience Act, NIST AI RMF and ISO/IEC 42001 duties to controls and builds the evidence. | WebPage, BreadcrumbList, Service, FAQPage | all 4 readiness pages, /data, related case notes, sibling services |
| `/readiness` | AI governance readiness hub (navigational) | AI Governance Readiness Hub: EU AI Act to ISO 42001 | MLSecOpsHub maps EU AI Act, Cyber Resilience Act, NIST AI RMF and ISO/IEC 42001 obligations to concrete MLSecOps controls, with a checklist for each one. | CollectionPage, BreadcrumbList | 4 readiness pages, /services/ai-governance-readiness, /data, /case-notes, checklist PDFs |
| `/readiness/eu-ai-act` | EU AI Act security requirements checklist | (from frontmatter, ≤ 60) | (from frontmatter) | TechArticle, BreadcrumbList, FAQPage | /services/ai-governance-readiness, /data, /readiness/cyber-resilience-act, other readiness pages, case note, checklist MD + PDF |
| `/readiness/cyber-resilience-act` | Cyber Resilience Act AI | (frontmatter) | (frontmatter) | TechArticle, BreadcrumbList, FAQPage | /services/mlsecops-pipeline-hardening, /data, /readiness/eu-ai-act, other readiness pages, case note, checklists |
| `/readiness/nist-ai-rmf` | NIST AI RMF controls | NIST AI RMF Controls Mapped to MLSecOps \| MLSecOpsHub | (frontmatter) | TechArticle, BreadcrumbList, FAQPage | /services/ai-security-assessment, /data, /readiness/iso-42001, other readiness pages, case note, checklists |
| `/readiness/iso-42001` | ISO 42001 checklist | ISO 42001 Checklist: Annex A Mapped to MLSecOps Controls | (frontmatter) | TechArticle, BreadcrumbList, FAQPage | /services/ai-governance-readiness, /data, /readiness/nist-ai-rmf, other readiness pages, checklists |
| `/case-notes` | MLSecOps case notes (supporting) | MLSecOps Case Notes: Anonymized Engagements \| MLSecOpsHub | Case notes from MLSecOpsHub: anonymized, illustrative write-ups of AI security engagements, each structured as context, finding, fix and outcome. | CollectionPage, BreadcrumbList | 3 case notes, /data, /services, /readiness, RSS |
| `/case-notes/pickle-models-in-ci` | pickle model loading CI (long tail) | (frontmatter) | (frontmatter) | Article, BreadcrumbList | /services/mlsecops-pipeline-hardening, /readiness/cyber-resilience-act, other notes, awesomemlsecops.com |
| `/case-notes/mcp-server-overbroad-permissions` | MCP server tool permissions (long tail) | (frontmatter) | (frontmatter) | Article, BreadcrumbList | /services/ai-security-assessment, /readiness/nist-ai-rmf, other notes |
| `/case-notes/unsigned-model-registry` | model registry signing (long tail) | (frontmatter) | (frontmatter) | Article, BreadcrumbList | /services/ai-governance-readiness, /readiness/eu-ai-act, other notes |
| `/data` | prompt injection incidents list / AI agent attack index | Agentic Attack Index: AI Agent Incidents \| MLSecOpsHub | The Agentic Attack Index by MLSecOpsHub lists documented prompt injection, AI agent and MCP incidents with vector, product, disclosure date and source. | Dataset (distribution → GitHub raw + /data/agentic-attack-index.json), BreadcrumbList, FAQPage | /services/ai-security-assessment, /readiness/nist-ai-rmf, MCP case note, GitHub repo, JSON, CSV |
| `/about` | Riccardo Biosas / MLSecOpsHub founder | About Riccardo Biosas and MLSecOpsHub \| MLSecOps | Riccardo Biosas is a security engineer, founder of MLSecOpsHub, author of The MLSecOps Hacker newsletter and maintainer of the awesome-MLSecOps list. | AboutPage (mainEntity → Person), BreadcrumbList | /services, /readiness, /case-notes, /data, /blog, Substack, GitHub, X, Instagram (rel="me") |
| `/newsletter` | The MLSecOps Hacker newsletter | The MLSecOps Hacker Newsletter: AI Security Biweekly | The MLSecOps Hacker is the biweekly AI security newsletter from MLSecOpsHub: MLSecOps practice, model supply-chain attacks, prompt injection, governance. | WebPage, BreadcrumbList | Substack archive and last 20 issues (canonical stays on Substack) |
| `/blog` | MLSecOpsHub announcements (navigational) | MLSecOpsHub Blog: Announcements and Data Releases | The MLSecOpsHub blog carries announcements and dataset releases that belong on this domain. Analysis and long-form articles stay on The MLSecOps Hacker. | CollectionPage, BreadcrumbList | posts, /newsletter, RSS |
| `/blog/<slug>` | per post | (frontmatter) | (frontmatter) | BlogPosting, BreadcrumbList; `canonical` frontmatter → rel=canonical to Substack when republished | per post |
| `/contact` | contact / book a call | Contact MLSecOpsHub: Book an AI Security Call | Contact MLSecOpsHub to book a 30-minute assessment call, email the practice directly, or send a short message about an AI security or MLSecOps engagement. | ContactPage, BreadcrumbList | /privacy |
| `/privacy`, `/imprint` | legal (low priority) | Privacy Notice \| MLSecOpsHub; Imprint (Legal Notice) \| MLSecOpsHub | (see pages) | WebPage, BreadcrumbList | /imprint ↔ /privacy |
| `/404`, `/contact/thanks` | noindex | | | WebPage | links back to main sections |

Non-HTML: `/sitemap-index.xml` (with lastmod from frontmatter), `/robots.txt` (allows all crawlers incl. GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Bingbot, CCBot), `/llms.txt`, `/blog/rss.xml`, `/case-notes/rss.xml`, `/og/<path>.png` (generated 1200×630), `/downloads/<framework>-checklist.{md,pdf}`, `/data/agentic-attack-index.{json,csv}`.

## Answer-engine conventions used

- The answer paragraph after every `<h1>` states the entity by name ("MLSecOpsHub provides…") and the deliverable in plain sentences.
- Question-form `<h2>`s on readiness pages; 3–5 Q&A FAQ blocks with FAQPage JSON-LD on Home, each service page, each readiness page and /data.
- "What is MLSecOps?" is answered only on Home (FAQ) and links to the Substack article, so no page on this domain competes with it.
- Domain division: tools, resources and glossary live on awesomemlsecops.com; this site links there once in the footer and on /about and never mirrors that content. Newsletter content is canonical on Substack.
- Facts are limited to citable sources: JFrog (Feb 2024) malicious Hugging Face models, PyTorch 2.6 `weights_only` default, CVE-2025-32434, OWASP LLM Top 10, OWASP ML Security Top 10 (v0.3 draft), MITRE ATLAS, NIST AI RMF, Google SAIF, the EU AI Act and CRA texts on EUR-Lex.

## Submission checklist (after DNS is live)

Google Search Console
1. Add a Domain property for `mlsecopshub.com` and verify with the DNS TXT record (covers http/https and www).
2. Submit `https://mlsecopshub.com/sitemap-index.xml`.
3. Request indexing for `/`, `/services`, `/data` and the four readiness pages via URL Inspection.
4. Check Enhancements → FAQ, Breadcrumbs, Dataset after the first crawl; fix any warnings. Validate a page in the Rich Results Test.
5. Settings → Crawl stats after a week: confirm no 5xx and that `/og/*.png` and `/downloads/*` are crawled.

Bing Webmaster Tools
1. Import the site from Google Search Console (one click) or verify with the DNS CNAME.
2. Submit the same sitemap. Enable IndexNow with a key file if you want instant updates (add the key to `public/` and ping on deploy).
3. Run the Site Scan once and clear any HTML issues.

AI answer engines
1. Confirm `robots.txt` still allows GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended and CCBot after any host-level bot rules are added (Vercel Firewall / Cloudflare bot fight mode can block them).
2. Check `https://mlsecopshub.com/llms.txt` renders and lists the current services and datasets.
3. Query "who does MLSecOps consulting", "what is MLSecOps", "EU AI Act security requirements checklist" and "prompt injection incidents list" in ChatGPT search, Perplexity and Google AI Overviews monthly; record whether mlsecopshub.com is cited.

Entity signals
1. Point the GitHub organization profile README and the awesome-MLSecOps README to `https://mlsecopshub.com/services`.
2. Add `https://mlsecopshub.com` to the Substack "About" page, the X and Instagram bios and the awesomemlsecops.com footer, all with the same organization name "MLSecOpsHub".
3. Keep the Organization `sameAs` list in `src/lib/jsonld.ts` in sync with those profiles.

Monitoring
- Search Console performance report filtered by the keywords above, monthly.
- Lighthouse and Pa11y run in CI on every push; `scripts/check-site.mjs` fails the build on broken links, orphans, budgets and title/description length.
