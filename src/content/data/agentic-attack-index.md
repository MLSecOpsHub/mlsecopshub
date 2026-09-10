---
title: "Agentic Attack Index: AI Agent Incidents | MLSecOpsHub"
description: "The Agentic Attack Index by MLSecOpsHub lists documented prompt injection, AI agent and MCP incidents with vector, product, disclosure date and source."
keyword: "AI agent attack index"
answer: "The Agentic Attack Index is an open dataset maintained by MLSecOpsHub that lists documented prompt injection, AI agent and Model Context Protocol incidents. Each entry records the attack vector, the affected product, the disclosure date, the impact and a primary source, so researchers and security teams can cite incidents instead of anecdotes."
name: "Agentic Attack Index"
file: "data/agentic-attack-index.json"
rawUrl: "https://raw.githubusercontent.com/MLSecOpsHub/agentic-attack-index/main/agentic-attack-index.json"
repoUrl: "https://github.com/MLSecOpsHub/agentic-attack-index"
license: "https://creativecommons.org/licenses/by/4.0/"
published: 2026-09-08
updated: 2026-09-08
columns:
  - key: disclosed
    label: Disclosed
    description: "Month (or day) the incident or vulnerability was publicly disclosed."
  - key: product
    label: Product
    description: "The product, agent or component affected, with the vendor."
  - key: vector
    label: Vector
    description: "Primary attack vector: indirect or direct prompt injection, tool-permission abuse, MCP server compromise, data exfiltration, agent hijacking."
  - key: surface
    label: Surface
    description: "Where the untrusted input entered or which capability was abused."
  - key: impact
    label: Impact
    description: "What the attacker achieved or could achieve."
  - key: status
    label: Status
    description: "fixed, mitigated, unpatched, disputed or unknown at the time of the last update."
  - key: source
    label: Source
    description: "Primary source: researcher write-up, vendor advisory or CVE record."
faq:
  - q: "What counts as an agentic attack in this index?"
    a: "An incident or vulnerability disclosure in which untrusted content or an over-privileged tool caused an LLM application, AI agent or Model Context Protocol server to act against its operator's intent. Prompt injection is the most common vector, but tool-permission abuse and MCP server compromise are tracked separately because their fixes differ."
  - q: "How do I cite the Agentic Attack Index?"
    a: "Cite it as: MLSecOpsHub, Agentic Attack Index, https://mlsecopshub.com/data, accessed on the date you used it. The dataset is licensed CC BY 4.0, so attribution is the only requirement."
  - q: "How is an entry added or corrected?"
    a: "Open a pull request or issue in the MLSecOpsHub GitHub repository with the primary source. Entries need a public, primary source; secondary coverage alone is not enough. Corrections with a better source are merged quickly."
  - q: "Is this a complete list of prompt injection incidents?"
    a: "No. It is a curated list of documented incidents that meet the inclusion criteria. Many prompt injection findings are never disclosed, and some disclosures lack a stable primary source. The index favors accuracy and citability over completeness."
---

The index exists because most conversations about agent security cite the same two or three stories. A shared, sourced list makes it possible to see patterns: which vectors recur, which product categories are affected, and how disclosure and fix timelines have changed as agents gained tools.

Entries are maintained in a single JSON file in the MLSecOpsHub GitHub organization. The table on this page is rendered from that file at build time. The raw file is the canonical distribution and is what papers and tools should link to.
