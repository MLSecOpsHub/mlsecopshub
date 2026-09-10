---
title: "Cyber Resilience Act AI Requirements Checklist | MLSecOpsHub"
description: "The Cyber Resilience Act applies to AI models, agents and MCP servers shipped inside software products. This checklist maps Annex I to MLSecOps controls."
keyword: "Cyber Resilience Act AI"
answer: "MLSecOpsHub maps the Cyber Resilience Act (Regulation (EU) 2024/2847) to the ML pipeline. Models, agents and MCP servers inside a product are digital elements, so secure-by-default design, no known exploitable vulnerabilities at shipment, an SBOM, coordinated disclosure and 24-hour exploit reporting all apply to them. This page explains scope, deadlines and the controls that produce audit evidence."
framework: "Cyber Resilience Act (Regulation (EU) 2024/2847)"
shortTitle: "Cyber Resilience Act"
summary: "How the Cyber Resilience Act's essential requirements, vulnerability handling and 24-hour reporting duties apply to ML models, AI agents and MCP servers shipped inside products."
officialSource:
  label: "Regulation (EU) 2024/2847 on EUR-Lex"
  url: "https://eur-lex.europa.eu/eli/reg/2024/2847/oj"
service: mlsecops-pipeline-hardening
order: 2
controls:
  - obligation: "Design, develop and produce the product so that it delivers a level of cybersecurity appropriate to the risks, based on a documented cybersecurity risk assessment."
    reference: "Art. 13(2), Annex I Part I(1)"
    control: "Threat model that treats each model, agent and tool server as a component; MITRE ATLAS and OWASP Top 10 for LLM Applications used for the AI-specific threat catalog."
    evidence: "Cybersecurity risk assessment document with component inventory and threat list, versioned with the product."
  - obligation: "Place the product on the market without known exploitable vulnerabilities."
    reference: "Annex I Part I(2)(a)"
    control: "Dependency and model scanning in CI; release blocked on known exploitable CVEs in ML libraries (for example CVE-2025-32434 in torch.load) and on models that fail deserialization safety checks."
    evidence: "CI scan reports per release, exception register for accepted findings."
  - obligation: "Ship with a secure-by-default configuration and allow the user to reset to it."
    reference: "Annex I Part I(2)(b)"
    control: "Agents and MCP servers deny all tools by default; permissions are opt-in and documented; safe model loading (Safetensors, weights_only) is the default code path, not an option."
    evidence: "Default configuration file, permission manifest, reset procedure in the documentation."
  - obligation: "Protect against unauthorized access with appropriate controls, including authentication and identity management, and report on possible unauthorized access."
    reference: "Annex I Part I(2)(d)"
    control: "MCP servers require authenticated, scoped tokens; model registry pull requires signed identity; access anomalies alert."
    evidence: "Authentication configuration, registry access logs, alert rule definitions."
  - obligation: "Protect the confidentiality and integrity of stored, transmitted and processed data, commands, programs and configuration."
    reference: "Annex I Part I(2)(e), (f)"
    control: "Model artifacts signed at build and verified at load; prompt templates and tool manifests hash-pinned; encryption in transit for all model and tool traffic."
    evidence: "Signature verification logs, hash manifest, TLS configuration."
  - obligation: "Process only the data that is adequate, relevant and necessary for the intended purpose."
    reference: "Annex I Part I(2)(g)"
    control: "Agent context windows scoped to the task; tool results filtered before they re-enter the prompt; no unrestricted browsing or file access by default."
    evidence: "Context construction code review, tool output filter tests."
  - obligation: "Minimize attack surfaces, including external interfaces."
    reference: "Annex I Part I(2)(j)"
    control: "Tool and MCP server inventory with justification per exposed capability; unused tools removed; network egress from agents restricted to an allowlist."
    evidence: "Tool inventory with owners, egress policy, quarterly review record."
  - obligation: "Reduce the impact of an incident through exploitation mitigation mechanisms."
    reference: "Annex I Part I(2)(k)"
    control: "Model inference and tool execution sandboxed with least privilege; human confirmation gate on high-impact agent actions; blast radius per component documented."
    evidence: "Sandbox configuration, confirmation gate test, blast-radius table in the risk assessment."
  - obligation: "Record and monitor relevant internal activity, including access to and modification of data, services or functions."
    reference: "Annex I Part I(2)(l)"
    control: "Structured logging of model version, prompt version, tool calls and their arguments, with tamper-evident storage."
    evidence: "Log schema, sample trace, retention policy."
  - obligation: "Provide security updates that address vulnerabilities, with secure and automatic update mechanisms where appropriate."
    reference: "Annex I Part I(2)(c), Part II(7), (8)"
    control: "Model and prompt-template versions shipped through the same signed update channel as code; rollback tested; support period for each model version declared."
    evidence: "Update channel design, rollback drill record, published support period."
  - obligation: "Identify and document the components in the product, including a software bill of materials covering at least top-level dependencies."
    reference: "Annex I Part II(1)"
    control: "SBOM extended to an AI bill of materials: models (source, hash, license, base model), datasets, inference runtimes and tool servers, generated per release."
    evidence: "Machine-readable SBOM/AI-BOM file (CycloneDX or SPDX) attached to each release."
  - obligation: "Address and remediate vulnerabilities without delay, apply regular testing and reviews, and share information about fixed vulnerabilities publicly."
    reference: "Annex I Part II(2), (3), (4)"
    control: "Recurring adversarial testing of models and agents; model-specific advisories published when a weight file or prompt template is replaced for a security reason."
    evidence: "Test schedule and reports, advisory archive."
  - obligation: "Put in place and enforce a coordinated vulnerability disclosure policy with a contact address for reporting."
    reference: "Annex I Part II(5), (6)"
    control: "Disclosure policy that explicitly accepts model and prompt-injection findings; security.txt; triage SLA for AI-class reports."
    evidence: "Published policy, security.txt, triage log."
  - obligation: "Notify actively exploited vulnerabilities and severe incidents to the CSIRT and ENISA: early warning within 24 hours, notification within 72 hours, final report within 14 days of a fix being available."
    reference: "Art. 14"
    control: "Incident playbook with AI-specific triggers (malicious model in supply chain, injection exploited in the field) and templates for the single reporting platform; on-call rota able to file within 24 hours."
    evidence: "Playbook, tabletop exercise record, draft notifications."
checklist:
  - section: "Scope and classification"
    items:
      - "List every product with digital elements you place on the EU market, including SaaS components delivered as software and internal tools you distribute."
      - "Identify every ML model, AI agent, plugin and MCP server inside each product and record it as a component."
      - "Determine whether the product is default, important class I, important class II or critical under Annex III and IV."
      - "Record your role for each product: manufacturer, importer, distributor or open-source steward."
      - "Set the support period for each product and each model version, and document the reasoning."
  - section: "Secure by design and by default"
    items:
      - "Write a cybersecurity risk assessment that names AI-specific threats: unsafe deserialization, model poisoning, prompt injection, tool abuse."
      - "Make Safetensors, ONNX or GGUF the only accepted model formats in the build."
      - "Run PyTorch 2.6 or later patched for CVE-2025-32434 and keep weights_only=True as the only loader path."
      - "Ship agents and MCP servers with all tools denied by default and permissions declared in a manifest."
      - "Restrict agent network egress to an allowlist and remove unused tool integrations."
      - "Add a human confirmation gate for agent actions that change access, move money or send messages externally."
      - "Sandbox model inference and tool execution with least privilege."
  - section: "Supply chain and SBOM"
    items:
      - "Generate a CycloneDX or SPDX SBOM per release and extend it with models, datasets and inference runtimes."
      - "Sign every model artifact at build time and verify signatures at load time."
      - "Record provenance for third-party models: hub, repository, commit, hash, license and scan result."
      - "Quarantine and scan any model downloaded from a public hub before it enters the registry."
      - "Pin prompt templates and tool manifests by hash and treat changes as releases."
  - section: "Vulnerability handling"
    items:
      - "Publish a coordinated vulnerability disclosure policy that explicitly covers model and prompt-injection findings."
      - "Add a security.txt file with a working contact address."
      - "Define a triage SLA for AI-class reports and a process for replacing a model version securely."
      - "Publish advisories when a model or prompt template is replaced for a security reason."
      - "Deliver security updates for models through the same signed update channel as code."
      - "Test rollback of a model version in staging at least quarterly."
  - section: "Reporting and monitoring"
    items:
      - "Map AI-specific incidents (malicious model in the supply chain, injection exploited in the field) to Article 14 triggers."
      - "Prepare templates for the 24-hour early warning, 72-hour notification and 14-day final report."
      - "Ensure an on-call role can file a notification on the ENISA single reporting platform within 24 hours."
      - "Log model version, prompt version and tool calls for every inference, with tamper-evident storage."
      - "Run a tabletop exercise for a compromised model artifact scenario before 11 September 2026."
faq:
  - q: "Does the Cyber Resilience Act apply to AI models and AI agents?"
    a: "Yes, when they are part of a product with digital elements placed on the EU market. A model file, an agent runtime, a plugin or an MCP server shipped inside a product is a component of that product, so the essential requirements in Annex I and the vulnerability handling duties apply to it. Standalone models offered as a service are covered by other rules, but the moment they ship as software they are in scope."
  - q: "When do the Cyber Resilience Act obligations apply?"
    a: "The Regulation entered into force on 10 December 2024. The Article 14 reporting obligations for actively exploited vulnerabilities and severe incidents apply from 11 September 2026. The remaining obligations, including the essential requirements and conformity assessment, apply from 11 December 2027. See the <a href=\"https://eur-lex.europa.eu/eli/reg/2024/2847/oj\">official text</a> for Article 71."
  - q: "How do the Cyber Resilience Act and the EU AI Act interact?"
    a: "They overlap for high-risk AI systems that are also products with digital elements. The AI Act's Article 15 cybersecurity requirement can be demonstrated through CRA compliance for those systems, so one hardened pipeline and one evidence file serve both. MLSecOpsHub keeps the two mappings aligned; see the <a href=\"/readiness/eu-ai-act\">EU AI Act readiness page</a>."
  - q: "What is an AI bill of materials and does the CRA require one?"
    a: "The CRA requires a software bill of materials covering at least the top-level dependencies of the product. An AI bill of materials extends that to the models, datasets and inference runtimes the product contains. It is the practical way to satisfy the SBOM duty for a product that ships models, and MLSecOpsHub generates it from the pipeline as part of <a href=\"/services/mlsecops-pipeline-hardening\">MLSecOps pipeline hardening</a>."
published: 2026-09-08
updated: 2026-09-08
---

## What does the Cyber Resilience Act mean for products that ship AI?

The Cyber Resilience Act, formally [Regulation (EU) 2024/2847](https://eur-lex.europa.eu/eli/reg/2024/2847/oj), is horizontal product legislation. It applies to any product with digital elements placed on the EU market: hardware, software, and the remote data processing that the product depends on. There is no AI exemption. A trained model weight file, an inference runtime, an agent framework, a plugin, or a Model Context Protocol server shipped inside a product is a component of that product, and the manufacturer is responsible for its security in the same way as for a cryptographic library or a web server.

That reframing is the point of this page. Most engineering teams read the CRA as a firmware and dependency-management problem. MLSecOpsHub maps it to the ML pipeline: what is allowed into the model registry, what the agent can do by default, what goes into the bill of materials, and how a compromised model file becomes a reportable incident inside 24 hours.

## Who is in scope and what are the roles?

The obligations fall primarily on the **manufacturer**: whoever develops or has developed a product and places it on the market under its own name. **Importers** and **distributors** carry lighter duties to verify conformity and pass on information. Two provisions matter especially for the AI ecosystem.

**Open-source stewards.** Legal persons that systematically support the development of open-source products intended for commercial activities, without themselves monetizing them, have a light regime: they must put in place a cybersecurity policy, cooperate with authorities, and report actively exploited vulnerabilities they become aware of. Free and open-source software that is not supplied in the course of a commercial activity is outside the CRA. A model published on a public hub by an individual is generally not in scope; the same model integrated into a commercial product by a manufacturer is the manufacturer's problem.

**Substantial modification.** Anyone who substantially modifies a product already on the market becomes its manufacturer. Fine-tuning a third-party model and shipping it inside your product, or wrapping a third-party agent with your own tools, is an integration decision that assigns you the obligations.

## What are the deadlines?

The Regulation entered into force on 10 December 2024. The obligations apply in two steps:

- 11 September 2026: the Article 14 reporting obligations for actively exploited vulnerabilities and severe incidents.
- 11 December 2027: everything else, including the essential requirements, conformity assessment and CE marking.

The reporting deadline arrives first, and it is the one that requires an operational capability rather than a design change. A team that cannot identify a malicious model in its supply chain, or a prompt injection exploited against customers, within 24 hours cannot meet Article 14.

## What are the essential cybersecurity requirements?

Annex I Part I lists the design-time requirements. Paraphrased, a product must be built on a documented risk assessment and must:

- be shipped without known exploitable vulnerabilities;
- come with a secure-by-default configuration that the user can reset to;
- receive security updates, automatically where appropriate;
- protect against unauthorized access with authentication and identity management;
- protect the confidentiality and integrity of data, commands, programs and configuration;
- process only the data needed for its purpose;
- protect availability and limit its own effect on other systems;
- minimize attack surfaces, including external interfaces;
- reduce the impact of incidents through exploitation mitigation;
- record and monitor relevant internal activity;
- let users securely and easily remove their data.

Each of these has a direct reading in the three MLSecOps content lanes.

### Model supply chain: known exploitable vulnerabilities and integrity

"No known exploitable vulnerabilities at shipment" is the requirement that most directly indicts the state of ML model distribution. Pickle-based formats execute arbitrary code when loaded. JFrog reported in February 2024 that it had found roughly 100 malicious models on Hugging Face abusing pickle deserialization. PyTorch 2.6 changed the default of `torch.load` to `weights_only=True`, and CVE-2025-32434 showed that affected versions could still be exploited through that loader. A manufacturer shipping a product that loads pickle files from a registry, or running an unpatched PyTorch, is shipping a known exploitable vulnerability.

The controls are unglamorous: allow only Safetensors, ONNX or GGUF in the build; keep the inference runtime patched; sign model artifacts at build and verify signatures at load; quarantine and scan any model pulled from a public hub before it enters the registry. The integrity requirement in Annex I extends to prompt templates and tool manifests, which should be hash-pinned and released like code. MLSecOpsHub provides these controls as part of [MLSecOps pipeline hardening](/services/mlsecops-pipeline-hardening), with the CI configuration as the evidence artifact.

### Agentic and MCP security: secure by default, attack surface, exploitation mitigation

An AI agent inside a product is an external interface with a very large attack surface. Every tool it can call, every MCP server it connects to, and every document it reads is an input path. The secure-by-default requirement means the agent ships with tools denied unless declared; the attack-surface requirement means unused integrations are removed and network egress is allowlisted; the exploitation-mitigation requirement means inference and tool execution are sandboxed with least privilege and high-impact actions need a human confirmation. The documented incidents in the [Agentic Attack Index](/data) show the recurring pattern: an agent with broad permissions reads attacker-controlled content and acts on it. Under the CRA, that design is a nonconformity, not just a bug.

### Prompt injection: data minimization and logging

Prompt injection is a confidentiality and integrity attack on commands and data, both of which Annex I requires the product to protect. The practical controls are: constrain the agent's context to the task, filter tool output before it re-enters the prompt, and log the model version, prompt template version and every tool call with its arguments in tamper-evident storage. The logging requirement in Annex I is what makes the Article 14 clock survivable, because a team that cannot reconstruct what the agent did cannot decide whether an exploit occurred.

## What are the vulnerability handling requirements?

Annex I Part II covers the product's life after release. The manufacturer must:

- identify and document components, including a software bill of materials covering at least the top-level dependencies;
- address and remediate vulnerabilities without delay, including by providing security updates;
- test and review the product's security regularly;
- publicly share information about fixed vulnerabilities;
- enforce a coordinated vulnerability disclosure policy;
- distribute security updates without delay and, by default, free of charge for the support period, separately from functionality updates.

The support period must reflect the expected time the product is in use, and the Regulation sets an expectation of at least five years unless the product's lifetime is shorter.

For AI components, the SBOM duty becomes an **AI bill of materials**: models with source, hash, license and base model; datasets; inference runtimes; tool servers. CycloneDX has a machine-learning extension for exactly this. The "regular testing" duty maps to recurring adversarial testing of models and agents against the OWASP Top 10 for LLM Applications and the OWASP ML Security Top 10 (v0.3 draft). The disclosure policy must explicitly accept model and prompt-injection findings, because many researchers are still told those are "not a vulnerability" by triage teams that only recognize code bugs. And the update duty implies that model versions ship through the same signed channel as code, with a tested rollback.

## What does Article 14 require you to report, and how fast?

Article 14 of [Regulation (EU) 2024/2847](https://eur-lex.europa.eu/eli/reg/2024/2847/oj) obliges manufacturers to notify any actively exploited vulnerability in the product, and any severe incident affecting its security, to the designated CSIRT and to ENISA through a single reporting platform. The clock has three steps:

1. An early warning within 24 hours of becoming aware.
2. A notification with more detail within 72 hours.
3. A final report within 14 days of a corrective measure being available, or within one month for severe incidents.

Users must also be informed. AI-specific triggers that a playbook should name include: a malicious model artifact discovered in the supply chain; a prompt injection exploited in the field to exfiltrate data or execute tool actions; and a compromise of an MCP server that a shipped agent connects to. MLSecOpsHub recommends preparing the three notification templates in advance and running a tabletop exercise for the compromised-model scenario before 11 September 2026.

## Which conformity assessment route applies?

Products fall into four groups. The **default** category, which covers most software, allows the manufacturer to self-assess against the essential requirements. **Important products class I** (for example password managers, VPNs, browsers, operating systems) can self-assess only if they apply a harmonized standard or a common specification; otherwise third-party assessment is required. **Important products class II** (for example firewalls, hypervisors, intrusion detection systems) always require third-party assessment. **Critical products** (hardware security modules, smart meter gateways, smartcards) may require European cybersecurity certification.

An AI component does not by itself move a product into a higher class, but the product it lives in might already be there. A security product that adds an LLM-based analysis agent is a class II product with an agent inside, and its assessment body will look at the agent. Conforming products carry the CE marking and are accompanied by the technical documentation described in Annex VII.

## How does the CRA interact with the EU AI Act?

The two regulations overlap for high-risk AI systems that are also products with digital elements. Article 15 of the AI Act addresses cybersecurity and cross-references the CRA: high-risk AI systems that fall under the CRA and comply with its essential requirements are deemed to meet the AI Act's cybersecurity requirement, provided the CRA declaration of conformity demonstrates it. In practice this means one hardened pipeline and one evidence file can serve both laws. MLSecOpsHub maintains the two mappings side by side; the AI Act half is on the [EU AI Act readiness page](/readiness/eu-ai-act).

The interplay also cuts the other way. A team preparing an AI Act technical file will find that the CRA's SBOM, disclosure policy and update duties are the missing operational pieces, while the AI Act's logging, human oversight and post-market monitoring articles supply structure the CRA leaves open.

## Where do organizations usually fall short?

- **Models are not treated as components.** The SBOM lists libraries but not weights, datasets or inference runtimes.
- **Pickle is still accepted from "trusted" internal registries**, with no signing and no scan.
- **Agents ship with allow-all tool permissions** because denial-by-default was inconvenient during development and never revisited.
- **The disclosure policy rejects AI findings**, so exploited prompt injections are never triaged as vulnerabilities and the Article 14 clock never starts.
- **No 24-hour capability.** The security team can respond in days, and the ML team is not on the incident bridge.
- **Support period undefined for models.** A model version is retired silently, and customers on the old version receive no security update.

MLSecOpsHub provides a fixed-scope pipeline hardening engagement that closes these gaps in order of exposure: model loading and signing first, then agent permission boundaries, then the AI bill of materials and the reporting playbook. The checklist above is the first pass; the frameworks referenced here (MITRE ATLAS, NIST AI RMF, Google SAIF, OWASP) supply the vocabulary that an assessment body will recognize.
