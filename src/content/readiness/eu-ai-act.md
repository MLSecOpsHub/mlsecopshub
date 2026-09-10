---
title: "EU AI Act Security Requirements Checklist | MLSecOpsHub"
description: "The EU AI Act security requirements checklist maps Articles 9 to 15, 53 and 55 to concrete MLSecOps controls, with evidence auditors accept. Free PDF."
keyword: "EU AI Act security requirements checklist"
answer: "MLSecOpsHub maps the security obligations of the EU AI Act (Regulation (EU) 2024/1689) to concrete MLSecOps controls: model provenance and signing, safe deserialization, prompt-injection defenses, agent permission boundaries, logging and incident reporting. This page explains who is in scope, the deadlines, and what evidence a notified body or market surveillance authority will ask for, with a downloadable checklist."
framework: "EU AI Act (Regulation (EU) 2024/1689)"
shortTitle: "EU AI Act"
summary: "Article-by-article mapping of the EU AI Act's risk management, data governance, logging, robustness and cybersecurity obligations to MLSecOps controls and audit evidence."
officialSource:
  label: "Regulation (EU) 2024/1689 on EUR-Lex"
  url: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj"
service: ai-governance-readiness
order: 1
controls:
  - obligation: "Establish and maintain a documented, iterative risk management system across the whole lifecycle of a high-risk AI system, covering known and reasonably foreseeable risks including misuse."
    reference: "Art. 9"
    control: "Threat model per system using MITRE ATLAS and OWASP Top 10 for LLM Applications; risks tracked in a register with owners and re-review on every model or prompt change."
    evidence: "Versioned threat model, risk register with change history, CI gate that blocks release when the register has unaccepted high risks."
  - obligation: "Training, validation and test data must be governed: relevant, representative, checked for errors and bias, with documented provenance and preparation steps."
    reference: "Art. 10"
    control: "Dataset cards with source, license and collection date; hashes for every dataset version; poisoning checks and outlier screening before training; access control on data stores."
    evidence: "Dataset manifest with content hashes, data lineage graph from the pipeline, screening job logs."
  - obligation: "Draw up technical documentation before placing the system on the market and keep it current, covering design, development, monitoring and the elements in Annex IV."
    reference: "Art. 11, Annex IV"
    control: "Model cards and system cards generated from the pipeline, including architecture, training data description, evaluation results and known limitations; documentation build is part of the release pipeline."
    evidence: "Generated Annex IV documentation package, with git commit and model artifact hash embedded."
  - obligation: "The system must automatically record events over its lifetime so that operation can be traced, risks identified and post-market monitoring supported."
    reference: "Art. 12"
    control: "Structured inference logging: input reference, model version, prompt template version, tool calls executed by agents, output, and human override events; retention set per Art. 19."
    evidence: "Log schema, retention policy, sample export for a given request ID showing the full trace."
  - obligation: "Design for transparency so deployers can interpret output and use the system correctly, with instructions for use that state capabilities, limitations and foreseeable misuse."
    reference: "Art. 13"
    control: "Instructions for use maintained alongside the model card; documented failure modes include prompt injection and confabulation for LLM-based systems."
    evidence: "Published instructions for use with version history."
  - obligation: "Build in effective human oversight: people must be able to understand, monitor, intervene, override or stop the system."
    reference: "Art. 14"
    control: "Kill switch and rollback tested in staging; agent actions above a risk threshold require human confirmation; oversight interfaces expose confidence and provenance."
    evidence: "Runbook, rollback drill record, screenshot or log of a confirmation gate firing."
  - obligation: "Achieve appropriate accuracy, robustness and cybersecurity, including resilience against data poisoning, model poisoning, adversarial examples, model evasion and confidentiality attacks."
    reference: "Art. 15"
    control: "Safetensors-only model loading enforced in CI; torch.load weights_only=True with a patched PyTorch (CVE-2025-32434); signed model artifacts verified at load; adversarial and prompt-injection test suites run per release."
    evidence: "CI policy configuration, signature verification logs, red-team report with pass/fail per attack class."
  - obligation: "Providers of high-risk systems must run a quality management system that covers compliance strategy, design control, testing, data management and incident handling."
    reference: "Art. 17"
    control: "MLSecOps pipeline policies documented as the QMS technical layer: branch protection, mandatory review, reproducible builds, evaluation thresholds and release approval."
    evidence: "QMS manual referencing pipeline configuration, audit trail of release approvals."
  - obligation: "Deployers must use the system according to its instructions, assign human oversight to competent people, monitor operation and keep logs generated by the system."
    reference: "Art. 26"
    control: "Deployer-side configuration baseline, log retention agreement with the provider, monitoring dashboards and an escalation path to the provider."
    evidence: "Signed deployment configuration, log retention record, monitoring runbook."
  - obligation: "Providers of general-purpose AI models must keep technical documentation, give downstream providers integration information, respect copyright and publish a training-content summary."
    reference: "Art. 53"
    control: "Model documentation pipeline with a downstream integration section (safe loading, input constraints, known jailbreak classes); training data summary produced from the dataset manifest."
    evidence: "Published model documentation and training-content summary with version tags."
  - obligation: "Providers of general-purpose AI models with systemic risk must perform adversarial testing, assess and mitigate systemic risks, track and report serious incidents, and ensure adequate cybersecurity for the model and its infrastructure."
    reference: "Art. 55"
    control: "Recurring red-team program covering prompt injection, jailbreaks and exfiltration; weight storage with hardware-backed keys and access logging; incident process wired to the Art. 73 timeline."
    evidence: "Red-team reports, key management and access review records, incident register."
  - obligation: "Deployers of emotion recognition, biometric categorization and generative systems must tell people they are interacting with AI and mark synthetic content in a machine-readable way."
    reference: "Art. 50"
    control: "Disclosure banner in the interface; content credentials or watermarking on generated output; disclosure not removable by prompt injection because it is set outside the model."
    evidence: "Interface screenshot, output sample with embedded provenance metadata."
  - obligation: "Operate a post-market monitoring system that collects and analyzes performance data throughout the system's life and feeds the risk management system."
    reference: "Art. 72"
    control: "Drift and abuse monitoring in production: injection attempt rates, tool-call anomalies, evaluation metric decay; findings routed back into the risk register."
    evidence: "Monitoring plan, dashboard export, risk register entries created from monitoring."
  - obligation: "Report serious incidents to the market surveillance authority of the Member State where the incident occurred, within the statutory deadlines and immediately after a causal link is established."
    reference: "Art. 73"
    control: "Incident response playbook with AI-specific triggers (model compromise, injection leading to harm) and a 15-day default clock; templates prepared for the notification."
    evidence: "Playbook, tabletop exercise record, filled-in notification template."
checklist:
  - section: "Scope and classification"
    items:
      - "Inventory every AI system and model in production, including third-party APIs and agents embedded in internal tools."
      - "Classify each system against Article 5 prohibited practices, Annex III high-risk use cases and Annex I product legislation."
      - "Record whether your organization is a provider, deployer, importer or distributor for each system."
      - "Flag general-purpose AI models you train or substantially modify; check the systemic-risk compute threshold."
      - "Assign an accountable owner per high-risk system and a compliance deadline based on the phased application dates."
  - section: "Model supply chain"
    items:
      - "Block pickle-based model formats in CI; allow Safetensors, ONNX or GGUF only."
      - "Run PyTorch 2.6 or later, patched for CVE-2025-32434, and keep torch.load weights_only=True everywhere."
      - "Sign every model artifact at build time and verify the signature at load time."
      - "Record provenance for each model: source repository, commit, training data hashes, base model and license."
      - "Generate an AI bill of materials (models, datasets, libraries) with every release."
      - "Scan third-party models from public hubs before use and quarantine them until scanned."
  - section: "Data governance and documentation"
    items:
      - "Maintain dataset cards with source, license, collection date and known biases."
      - "Hash and version every training, validation and test dataset."
      - "Screen training data for poisoning and label manipulation before every training run."
      - "Generate Annex IV technical documentation from the pipeline, not by hand."
      - "Keep instructions for use current, including documented failure modes for LLM components."
  - section: "Robustness, cybersecurity and testing"
    items:
      - "Run a prompt-injection and jailbreak test suite against every release of an LLM-based system."
      - "Test adversarial-example and model-evasion resistance for classifiers used in high-risk decisions."
      - "Enforce least-privilege scopes for agent tools and MCP servers; deny by default."
      - "Require human confirmation for agent actions that move money, change access or send external messages."
      - "Test kill switch and model rollback in staging at least quarterly."
      - "Store model weights with access logging and hardware-backed keys."
  - section: "Logging, monitoring and incidents"
    items:
      - "Log model version, prompt template version, tool calls and human overrides for every inference in a high-risk system."
      - "Set log retention to at least six months and document the retention policy."
      - "Monitor injection attempt rates, tool-call anomalies and evaluation drift in production."
      - "Define AI-specific serious-incident triggers and map them to the Article 73 reporting clock."
      - "Run a tabletop exercise for a model-compromise scenario and record the outcome."
faq:
  - q: "What are the EU AI Act security requirements for high-risk AI systems?"
    a: "Article 15 requires high-risk AI systems to be accurate, robust and cybersecure across their lifecycle, with specific resilience against data poisoning, model poisoning, adversarial examples, model evasion and confidentiality attacks. Articles 9 to 14 add risk management, data governance, technical documentation, automatic logging, transparency and human oversight. MLSecOpsHub maps each of these to pipeline controls in the table on this page."
  - q: "Does the EU AI Act apply to companies outside the EU?"
    a: "Yes. The Regulation applies to providers who place AI systems on the EU market or put them into service in the EU, regardless of where they are established, and to providers and deployers in third countries when the system's output is used in the EU. A US or APAC company selling into Europe is in scope."
  - q: "When do the EU AI Act obligations apply?"
    a: "The Regulation entered into force on 1 August 2024. Prohibited practices applied from 2 February 2025, general-purpose AI model obligations from 2 August 2025, most high-risk obligations from 2 August 2026, and high-risk systems embedded in Annex I products from 2 August 2027. See the <a href=\"https://eur-lex.europa.eu/eli/reg/2024/1689/oj\">official text</a> for Article 113."
  - q: "How does MLSecOpsHub help with EU AI Act readiness?"
    a: "MLSecOpsHub runs a fixed-scope <a href=\"/services/ai-governance-readiness\">AI governance readiness</a> engagement: an inventory and classification of your AI systems, a gap analysis against the controls on this page, and a prioritized remediation plan with the evidence artifacts a notified body or market surveillance authority will expect."
published: 2026-09-08
updated: 2026-09-08
---

## What does the EU AI Act require from a security engineering perspective?

The EU AI Act, formally [Regulation (EU) 2024/1689](https://eur-lex.europa.eu/eli/reg/2024/1689/oj), is a product-safety law. It does not tell you which firewall to buy. It tells you that a high-risk AI system must be designed so that it is accurate, robust and resilient to attack, that its development must be documented and traceable, and that someone must be able to stop it. Most of the text is written for lawyers and conformity assessors, but nearly every obligation in Chapter III Section 2 turns into an engineering control once you ask "what artifact would prove this?"

MLSecOpsHub maps those obligations to MLSecOps controls: what runs in the CI pipeline, what is logged at inference time, what is signed, and what is tested before release. The table above is that mapping. The rest of this page explains the framework, who has to comply and by when, and where organizations typically fall short.

## Which AI systems does the EU AI Act classify as high-risk?

The Regulation sorts AI systems into four buckets.

**Prohibited practices (Article 5).** Certain uses are banned outright: manipulative techniques that cause significant harm, exploitation of vulnerabilities based on age or disability, social scoring by public authorities, untargeted scraping of facial images to build recognition databases, and most real-time remote biometric identification in public spaces by law enforcement. These prohibitions have applied since 2 February 2025.

**High-risk systems (Article 6 and Annexes I and III).** A system is high-risk if it is a safety component of a product covered by EU harmonization legislation listed in Annex I (machinery, medical devices, vehicles, and others) or if it falls into an Annex III use case. Annex III covers biometrics, critical infrastructure management, education and vocational training, employment and worker management, access to essential private and public services, law enforcement, migration and border control, and administration of justice. A resume-screening model, a credit-scoring model or a model that prioritizes emergency dispatch is high-risk.

**General-purpose AI models (Chapter V).** Models trained on broad data and capable of many tasks have their own obligations under Article 53, and a heavier set under Article 55 if they present systemic risk. The Regulation presumes systemic risk above a cumulative training compute threshold of 10^25 floating-point operations, and the Commission can designate models below it.

**Limited and minimal risk.** Everything else is subject only to the transparency duties in Article 50 (for chatbots, emotion recognition, deepfakes and synthetic content) or to nothing beyond existing law.

The classification decision is the first thing an authority will ask about, and it is the decision most organizations have not documented. MLSecOpsHub treats it as a control: every system in the inventory carries a written classification with the reasoning.

## When do the obligations apply?

The Regulation entered into force on 1 August 2024. The application dates are staggered:

- 2 February 2025: prohibited practices and the AI-literacy duty for staff.
- 2 August 2025: obligations for providers of general-purpose AI models, governance structures, and penalties.
- 2 August 2026: most remaining provisions, including the Annex III high-risk obligations and the Article 50 transparency duties.
- 2 August 2027: high-risk systems that are safety components of Annex I products.

Providers of general-purpose models placed on the market before 2 August 2025 have until 2 August 2027 to comply. For a company shipping an Annex III system today, the practical deadline is already here, and the notified-body pipeline is short on capacity.

## How do the high-risk obligations map to MLSecOps controls?

Articles 9 through 15 read as a lifecycle, and each one maps to a place in an ML pipeline.

### Risk management (Article 9)

The obligation is a continuous, documented risk management process covering the entire lifecycle, including risks from reasonably foreseeable misuse. In practice this is a threat model that is versioned with the system and re-reviewed when the model, the prompt template or the tool set changes. MLSecOpsHub builds these threat models on MITRE ATLAS for the adversarial-ML techniques and on the OWASP Top 10 for LLM Applications for the prompt-injection and agent surface. The evidence is a risk register with owners, and a release gate that refuses to ship while high risks are unaccepted.

### Data governance (Article 10)

Training, validation and test data must be relevant, representative, error-checked and documented, including its origin and preparation. The MLSecOps translation is a dataset manifest with content hashes for each version, a lineage graph from the pipeline, and a poisoning screen before training. Data poisoning is named explicitly in Article 15, so the screening step also supports that article.

### Technical documentation and logging (Articles 11 and 12, Annex IV)

Annex IV lists what the technical documentation must contain: general description, development process, monitoring and control, performance metrics, risk management, and lifecycle changes. Producing this by hand at the end of a project does not survive a second release. MLSecOpsHub generates the documentation package from the pipeline, with the git commit and model artifact hash embedded, so the documentation for version N is reproducible.

Article 12 requires automatic event recording that allows traceability. For an LLM-based system this means logging the model version, the prompt template version, every tool call the agent made, the output, and any human override, keyed by request ID. Article 19 sets the retention floor at six months.

### Transparency and human oversight (Articles 13 and 14)

Instructions for use must state capabilities, limitations and foreseeable misuse. For an LLM component the honest list of limitations includes prompt injection and confabulation, and an auditor who does not see them listed will ask why. Human oversight requires that a person can understand, monitor, intervene and stop the system. Engineering evidence is a tested kill switch, a rollback procedure, and, for agents, a confirmation gate on actions above a risk threshold.

### Accuracy, robustness and cybersecurity (Article 15)

This is the article that names the adversarial-ML attack classes: data poisoning, model poisoning, adversarial examples, model evasion, and confidentiality attacks. It is where the model supply chain lane becomes a compliance matter.

Model poisoning through unsafe serialization is the most concrete case. Pickle-based model files execute arbitrary code on load. JFrog reported in February 2024 that it had found roughly 100 malicious models on Hugging Face abusing pickle deserialization. PyTorch 2.6 changed the default of `torch.load` to `weights_only=True`, and CVE-2025-32434 later showed that even the restricted loader could be bypassed in affected versions. An Article 15 control set therefore includes: Safetensors-only loading enforced in CI, a patched PyTorch, artifact signing at build with verification at load, and quarantine plus scanning for any third-party model. The evidence is the CI policy, the verification logs, and the scan reports.

For prompt injection and agent security, Article 15 supports a per-release adversarial test suite and least-privilege tool scopes. The [Agentic Attack Index](/data) maintained by MLSecOpsHub is a useful source of test cases: it lists documented prompt-injection and agent incidents by vector and product, which is exactly the "reasonably foreseeable" set an assessor will ask whether you tested against.

### Quality management and deployer duties (Articles 17 and 26)

Article 17 requires providers to run a quality management system. Most of it can be satisfied by documenting the MLSecOps pipeline as the technical layer of the QMS: branch protection, mandatory review, reproducible builds, evaluation thresholds and approval records. Article 26 puts duties on deployers: use according to instructions, competent human oversight, monitoring, and keeping the logs the system generates. A deployer buying a high-risk system should negotiate log retention and an escalation path into the contract.

## What do general-purpose model providers have to do?

Article 53 requires providers of general-purpose AI models to keep technical documentation, give downstream integrators enough information to comply themselves, adopt a copyright policy, and publish a summary of training content. Article 55 adds, for systemic-risk models, adversarial testing including red-teaming, systemic-risk assessment and mitigation, serious-incident tracking and reporting, and an adequate level of cybersecurity for the model and its physical infrastructure.

The downstream information duty is often overlooked. If you publish a model, the integration notes should say how to load it safely (format, signature, expected hash), what input constraints it needs, and which jailbreak classes are known. That is information a downstream provider needs for its own Article 15 file. The Commission's General-Purpose AI Code of Practice offers one route to demonstrate compliance; following it is voluntary but reduces the burden of proof.

## What about generative and interactive systems that are not high-risk?

Article 50 applies regardless of risk class. Users must be told they are interacting with an AI system unless it is obvious. Synthetic audio, image, video and text output must be marked in a machine-readable way, and deepfakes must be disclosed. The MLSecOps point is that the disclosure must be set outside the model, in the interface or the output pipeline, so that a prompt injection cannot remove it.

## What happens after deployment?

Article 72 requires a post-market monitoring system that collects performance data throughout the system's life and feeds the risk management process. Article 73 requires providers to report serious incidents to the market surveillance authority of the Member State where the incident occurred, with a default deadline of 15 days after awareness and shorter deadlines for widespread infringements and deaths. Serious incident includes a malfunction that leads to harm to health, property, the environment or fundamental rights, so a model compromise that causes a wrong decision at scale can qualify.

MLSecOpsHub wires production monitoring (injection attempt rates, tool-call anomalies, evaluation drift) back into the risk register, and pairs it with an incident playbook that has AI-specific triggers and a pre-filled notification template. A tabletop exercise for a model-compromise scenario is cheap and produces exactly the record an authority wants to see.

## What will auditors and notified bodies ask for?

Based on the Annex IV structure and the conformity assessment procedure in Article 43 of [Regulation (EU) 2024/1689](https://eur-lex.europa.eu/eli/reg/2024/1689/oj), expect requests for:

1. The system inventory and the written classification for each entry.
2. The current threat model and risk register, with change history.
3. Dataset manifests with hashes, and evidence of poisoning screening.
4. The generated technical documentation package for the shipped version.
5. Model provenance: source, signature, verification logs, and the AI bill of materials.
6. Test reports covering the Article 15 attack classes, including prompt injection for LLM components.
7. Log samples showing end-to-end traceability for a single request.
8. The human oversight runbook and evidence that the kill switch was tested.
9. The post-market monitoring plan and the incident playbook.

Organizations that already ship products under the Cyber Resilience Act can reuse a large part of this file. Article 15 cross-references the CRA, and MLSecOpsHub keeps the two mappings aligned; see the [Cyber Resilience Act readiness page](/readiness/cyber-resilience-act).

## Where do organizations usually fall short?

The same gaps appear across sectors:

- **No written classification.** Systems are informally assumed to be minimal risk, and the reasoning is not recorded.
- **Documentation produced by hand.** The Annex IV package exists for the first release and never again.
- **Unsafe model loading.** Pickle files are still accepted from internal registries because "they are ours," with no signing or verification.
- **No adversarial testing for LLM components.** The evaluation suite measures accuracy, not resistance to injection or evasion.
- **Agents with over-broad tool scopes.** An assistant that can read email, browse and execute shell commands has no confirmation gate, and Article 14 oversight is nominal.
- **Logs that cannot reconstruct a decision.** Inference is logged, but not the prompt template version or the tool calls, so traceability fails at the first real incident.

MLSecOpsHub provides a fixed-scope [AI governance readiness](/services/ai-governance-readiness) engagement that closes these gaps in order of exposure: classification first, then supply chain and testing, then documentation automation and monitoring. Download the checklist above to run the first pass yourself.
