---
title: "NIST AI RMF Controls Mapped to MLSecOps | MLSecOpsHub"
description: "NIST AI RMF controls mapped to MLSecOps: each GOVERN, MAP, MEASURE and MANAGE subcategory paired with a concrete pipeline control, evidence and checklist."
keyword: "NIST AI RMF controls"
answer: "NIST AI RMF controls are the outcomes described in the GOVERN, MAP, MEASURE and MANAGE functions of NIST AI 100-1. MLSecOpsHub maps each security-relevant subcategory to a concrete MLSecOps control, such as model signing, safe deserialization, prompt-injection testing and agent permission boundaries, with the evidence an assessor expects and a downloadable checklist."
framework: "NIST AI Risk Management Framework 1.0 (NIST AI 100-1) and the Generative AI Profile (NIST AI 600-1)"
shortTitle: "NIST AI RMF"
summary: "The four RMF functions and the Generative AI Profile translated into pipeline controls, evidence artifacts and a checklist you can run against your own ML systems."
officialSource:
  label: "NIST AI 100-1, Artificial Intelligence Risk Management Framework (AI RMF 1.0)"
  url: "https://doi.org/10.6028/NIST.AI.100-1"
service: ai-security-assessment
order: 3
controls:
  - obligation: "Policies and procedures for AI risk are documented, understood and enforced across the organization, including how legal and regulatory requirements are tracked."
    reference: "GOVERN 1.1, 1.2"
    control: "AI security policy that names the model supply chain, prompt injection and agent tooling as in-scope risk classes, with owners and review cadence."
    evidence: "Signed policy document, review log, mapping of policy clauses to pipeline checks."
  - obligation: "Roles and responsibilities for AI risk are defined and the people in those roles are trained."
    reference: "GOVERN 2.1, 2.2"
    control: "RACI for model intake, deployment approval and AI incident handling; secure-ML training for engineers who touch model artifacts."
    evidence: "RACI matrix, training completion records, on-call rota for AI incidents."
  - obligation: "Third-party AI components, data and software are governed by policies that address their risks."
    reference: "GOVERN 6.1, 6.2"
    control: "Model and dataset intake procedure: provenance check, license check, safetensors-only or scanned pickle, signature verification before a third-party model enters a registry."
    evidence: "Intake checklist per model, registry admission logs, scanner output, AI-BOM entries."
  - obligation: "Intended purpose, context and deployment setting of each AI system are documented, including interdependencies with other systems."
    reference: "MAP 1.1, 1.3"
    control: "System card per deployed model or agent that records the trust boundary, connected tools, data sources and downstream consumers."
    evidence: "System card in the repository, architecture diagram with trust boundaries marked."
  - obligation: "Risks and benefits of third-party components are mapped, including pre-trained models and external services."
    reference: "MAP 4.1, 4.2"
    control: "AI bill of materials (AI-BOM) listing base models, adapters, datasets, embedding services and MCP servers with version and origin."
    evidence: "Machine-readable AI-BOM generated in CI, diff on every model change."
  - obligation: "Likelihood and magnitude of impacts, including security impacts, are assessed for each identified risk."
    reference: "MAP 5.1"
    control: "Threat model per AI system using MITRE ATLAS tactics and the OWASP Top 10 for LLM Applications as enumeration inputs."
    evidence: "Threat model document with ATLAS technique identifiers and prioritized findings."
  - obligation: "Measurement approaches and metrics for trustworthiness characteristics are selected and documented."
    reference: "MEASURE 1.1, 2.1"
    control: "Security test plan that defines pass criteria for prompt-injection resistance, tool-call authorization and artifact integrity."
    evidence: "Test plan under version control, CI job definitions referencing it."
  - obligation: "AI system security and resilience are evaluated and documented."
    reference: "MEASURE 2.7"
    control: "Automated adversarial testing in CI: injection payload suites against every prompt template, fuzzing of tool schemas, deserialization scanning of every model artifact."
    evidence: "CI run history, red-team report, scanner findings with disposition."
  - obligation: "Privacy risk of the AI system is examined and documented."
    reference: "MEASURE 2.10"
    control: "Data-flow inventory for training data, retrieval corpora and agent tool outputs; exfiltration tests for indirect prompt injection paths."
    evidence: "Data-flow diagram, exfiltration test results, retention configuration."
  - obligation: "Mechanisms exist for tracking identified risks over time and for reporting AI incidents."
    reference: "MEASURE 3.1, 3.3"
    control: "AI risk register linked to the vulnerability tracker; runtime telemetry for prompt anomalies and unexpected tool invocations."
    evidence: "Risk register export, alert rules, dashboard screenshots with timestamps."
  - obligation: "Risk treatment plans are prioritized and documented, with residual risk accepted by a named owner."
    reference: "MANAGE 1.2, 1.3"
    control: "Findings triaged by exploitability against the deployed architecture; residual risk sign-off before release."
    evidence: "Triage decisions in the tracker, release approval record."
  - obligation: "Mechanisms are in place to respond to and recover from AI system failures and incidents."
    reference: "MANAGE 2.3, 2.4"
    control: "Incident response playbooks for model tampering, prompt-injection compromise and rogue agent actions, including model rollback and tool revocation steps."
    evidence: "Playbooks, tabletop exercise notes, rollback drill results."
  - obligation: "Third-party risks are monitored on an ongoing basis and controlled through defined mechanisms."
    reference: "MANAGE 3.1, 3.2"
    control: "Continuous re-verification of upstream models and MCP servers: pinned digests, signature checks on every pull, advisory monitoring for CVEs such as CVE-2025-32434."
    evidence: "Digest pins in configuration, verification logs, advisory subscription records."
  - obligation: "Post-deployment monitoring and incident communication are performed and improvements are fed back."
    reference: "MANAGE 4.1, 4.3"
    control: "Production monitoring for drift, injection attempts and tool misuse; post-incident reviews that update the threat model and test suites."
    evidence: "Monitoring configuration, post-incident review documents, updated test cases."
checklist:
  - section: "GOVERN: policy and accountability"
    items:
      - "Publish an AI security policy that names model supply chain, prompt injection and agent tooling as risk classes."
      - "Assign a named owner for AI risk and a named owner for each production model or agent."
      - "Record the regulatory and contractual requirements that apply to each AI system."
      - "Define an intake procedure for third-party models, datasets and MCP servers."
      - "Train engineers who handle model artifacts on safe loading and provenance verification."
      - "Schedule a policy review at least annually and after any AI incident."
  - section: "MAP: context and inventory"
    items:
      - "Write a system card for every deployed model and agent, including trust boundaries."
      - "Generate an AI-BOM in CI covering base models, adapters, datasets and external tools."
      - "Diagram data flows for training, retrieval and agent tool outputs."
      - "Enumerate threats per system using MITRE ATLAS and the OWASP Top 10 for LLM Applications."
      - "Document which risks are accepted, transferred or mitigated for each third-party component."
  - section: "MEASURE: testing and metrics"
    items:
      - "Scan every model artifact for unsafe serialization before it enters the registry."
      - "Reject pickle-based artifacts unless a documented exception exists."
      - "Run a prompt-injection test suite against every prompt template in CI."
      - "Fuzz tool and MCP schemas for parameter abuse and privilege escalation."
      - "Test indirect injection paths for data exfiltration."
      - "Define pass and fail thresholds for each security test and record results per build."
      - "Commission an independent red-team exercise before major releases."
  - section: "MANAGE: response and monitoring"
    items:
      - "Maintain incident playbooks for model tampering, injection compromise and rogue agent actions."
      - "Rehearse model rollback and tool revocation at least twice a year."
      - "Pin upstream model digests and verify signatures on every pull."
      - "Subscribe to advisories for every ML framework and serving component in use."
      - "Alert on anomalous prompts, unexpected tool invocations and unusual output volumes."
      - "Feed post-incident findings back into the threat model and test suites."
  - section: "Generative AI Profile additions"
    items:
      - "Document the provenance and licensing of every foundation model and fine-tuning dataset."
      - "Apply least-privilege scopes to every tool an agent can call."
      - "Require human approval for irreversible agent actions."
      - "Log full prompt and tool-call traces with retention that supports incident investigation."
      - "Test for confabulation in security-relevant outputs such as code and configuration."
faq:
  - q: "Is the NIST AI RMF mandatory?"
    a: "No. NIST AI 100-1 is voluntary guidance. It becomes binding only when a contract, a procurement rule or a regulator references it. US federal agencies and many enterprise procurement teams do reference it, and ISO/IEC 42001 and the EU AI Act crosswalks published by NIST make it a practical baseline for organizations that must satisfy several frameworks at once."
  - q: "What are the NIST AI RMF controls?"
    a: "The RMF does not contain a control catalog in the ISO or NIST SP 800-53 sense. It defines outcomes, called subcategories, under four functions: GOVERN, MAP, MEASURE and MANAGE. Organizations choose their own controls to achieve those outcomes. MLSecOpsHub maps each security-relevant subcategory to a specific MLSecOps control and the evidence that proves it is in place."
  - q: "How does the Generative AI Profile change the mapping?"
    a: "NIST AI 600-1 adds risks specific to generative systems, including information security, data privacy, confabulation, information integrity and value chain integration, and suggests actions for each. In practice this adds prompt-injection testing, agent tool scoping, foundation model provenance and trace logging to the controls already needed for classical ML."
  - q: "Can MLSecOpsHub assess an existing pipeline against the RMF?"
    a: "Yes. The <a href=\"/services/ai-security-assessment\">AI security assessment</a> uses this mapping as its reporting structure, so every finding is tagged with the RMF subcategory it affects and the control that closes it. Book a 30-minute call to scope it."
published: 2026-09-08
updated: 2026-09-08
---

## What is the NIST AI RMF and who uses it?

The NIST Artificial Intelligence Risk Management Framework, published as [NIST AI 100-1](https://doi.org/10.6028/NIST.AI.100-1) in January 2023, is a voluntary framework for managing risks to individuals, organizations and society from AI systems. It was written under a mandate in the National AI Initiative Act of 2020 and developed through public workshops and drafts. Unlike a certification standard, it prescribes no audits and issues no certificates. It describes outcomes and leaves the choice of controls to the organization.

Three groups use it in practice. US federal agencies and their suppliers use it because procurement guidance and executive-branch memoranda point to it. Enterprises that sell into regulated sectors use it as the common vocabulary for AI risk in vendor questionnaires. And organizations preparing for [ISO/IEC 42001](/readiness/iso-42001) or the EU AI Act (Regulation (EU) 2024/1689) use it as a bridge, because NIST publishes crosswalks that align RMF subcategories with both.

MLSecOpsHub treats the RMF as the reporting backbone for security work on AI systems. It is broad enough to cover fairness and explainability, but this page focuses on the subcategories where an MLSecOps control is the direct answer: supply chain, security and resilience, monitoring and incident response.

## How is the framework structured?

The document has two parts. Part 1 frames AI risk and defines seven characteristics of trustworthy AI. Part 2, the Core, defines four functions, each broken into categories and subcategories that describe outcomes.

### The seven trustworthiness characteristics

The RMF says a trustworthy AI system is valid and reliable; safe; secure and resilient; accountable and transparent; explainable and interpretable; privacy-enhanced; and fair with harmful bias managed. Security work touches all seven, but it owns one outright: secure and resilient. The framework describes this characteristic as the ability to withstand adversarial events and unauthorized use, and to return to normal function after disruption. That is the definition of the security assessment scope.

### The four functions

**GOVERN** is cross-cutting. It covers policies, accountability, workforce, organizational culture, engagement with affected communities and, in GOVERN 6, the governance of third-party software, data and models. GOVERN 6 is where model supply chain security is anchored: the framework expects policies that address third-party risks and contingency plans for third-party failures.

**MAP** establishes context. MAP 1 documents intended purpose, deployment setting and interdependencies. MAP 3 examines benefits and costs. MAP 4 maps risks from third-party components, including pre-trained models and external APIs. MAP 5 assesses the likelihood and magnitude of impacts. For a security engineer, MAP is the threat-modeling phase.

**MEASURE** turns identified risks into tests and metrics. MEASURE 1 selects the approaches. MEASURE 2 evaluates each trustworthiness characteristic, with MEASURE 2.7 dedicated to security and resilience and MEASURE 2.10 to privacy. MEASURE 3 tracks risks over time and captures incidents. MEASURE 4 checks that the measurement itself is effective.

**MANAGE** allocates resources and responds. MANAGE 1 prioritizes and documents risk treatment. MANAGE 2 covers response strategies and the mechanisms to recover from failures. MANAGE 3 handles ongoing third-party risk. MANAGE 4 covers post-deployment monitoring, incident communication and continual improvement.

## Which subcategories does a security assessment answer?

The mapping table on this page lists the subcategories that MLSecOpsHub reports against, the control that satisfies each, and the evidence an assessor will ask for. The narrative below explains why each cluster exists and where organizations usually fall short.

### GOVERN 6 and MAP 4: third-party models and the supply chain

Most production AI systems are built on models nobody in the organization trained. The RMF asks for policies and mappings that address that dependency. The security substance behind it is model provenance, integrity and safe loading.

Model files serialized with Python pickle execute arbitrary code when loaded. In February 2024 JFrog reported roughly one hundred malicious models on Hugging Face that abused pickle deserialization to run a payload at load time. PyTorch 2.6 changed the default of `torch.load` to `weights_only=True` in response to this class of attack, and CVE-2025-32434 later showed that the restricted loader itself could be bypassed in affected versions. A GOVERN 6 policy that does not name these mechanics is a paper control.

MLSecOpsHub maps GOVERN 6.1 and MAP 4.1 to an intake gate: every third-party model is fetched by pinned digest, verified against a signature where the publisher provides one, converted or rejected if it uses pickle, scanned for embedded code, and recorded in an AI bill of materials. The evidence is the registry admission log and the AI-BOM diff in the pull request that introduced the model.

### MAP 1 and MAP 5: context and threat modeling

MAP 1.1 asks for documented intended purpose and deployment context. MAP 5.1 asks for an assessment of impact likelihood and magnitude. Together they describe a threat model. MLSecOpsHub uses MITRE ATLAS as the tactic and technique catalog and the OWASP Top 10 for LLM Applications plus the OWASP ML Security Top 10 (v0.3 draft) as enumeration checklists, so that each threat carries an identifier the client can track across releases.

The common gap here is agent systems. A system card that lists "chatbot" as the purpose but omits the eleven tools the agent can call, the MCP servers it connects to and the shared credentials those servers hold has not mapped the context. The [Agentic Attack Index](/data) documents how often that omission turns into an incident.

### MEASURE 2.7: security and resilience testing

MEASURE 2.7 is the subcategory most organizations claim and least often evidence. The RMF expects security and resilience to be evaluated and documented. For a language model application that means at minimum:

- A prompt-injection test suite, both direct and indirect, executed against every prompt template on every change, with pass thresholds recorded.
- Authorization tests for tool calls, proving that an injected instruction cannot invoke a tool outside the caller's scope.
- Deserialization and code scanning of every model artifact before and after the registry.
- Resilience tests: what happens when the model endpoint returns garbage, when a tool times out, when a retrieval source is poisoned.

Google SAIF and MITRE ATLAS both provide language for these tests. MLSecOpsHub provides the harness and the pass criteria as part of the [AI security assessment](/services/ai-security-assessment), and leaves them in the client's CI so MEASURE 2.7 evidence is regenerated on every build rather than once a year.

### MEASURE 3 and MANAGE 4: monitoring and incidents

MEASURE 3.3 asks for mechanisms to track and report AI incidents. MANAGE 4.1 asks for post-deployment monitoring. The security reading is runtime telemetry: prompt anomaly detection, alerts on unexpected tool invocations, output-volume monitoring for exfiltration, and full trace logging with a retention period long enough to investigate.

The gap MLSecOpsHub sees most often is that logging exists for cost accounting but not for security. Token counts are retained; prompts and tool arguments are not. An investigation of a suspected injection then has nothing to read.

### MANAGE 2 and MANAGE 3: response and third-party lifecycle

MANAGE 2.3 and 2.4 expect the organization to be able to respond to and recover from AI failures. For model systems that means practiced rollback to a previous signed artifact, revocation of an agent's tool credentials, and a way to purge a poisoned retrieval index. MANAGE 3 expects third-party risks to be monitored continually, which in practice means advisory subscriptions for every ML framework in the stack and re-verification of upstream artifacts on every pull, not only at first intake.

## What does the Generative AI Profile add?

[NIST AI 600-1](https://doi.org/10.6028/NIST.AI.600-1), the Generative AI Profile published in July 2024, is a companion document that identifies risks unique to or amplified by generative AI and suggests actions organized by the same four functions. The risk categories with direct security consequences are:

- **Information security.** Lowered barriers to offensive capability and new attack surfaces such as prompt injection and data poisoning.
- **Data privacy.** Leakage of training data, memorization, and inference of sensitive attributes.
- **Confabulation.** Confident false output, which matters for security when the output is code, configuration or an access decision.
- **Information integrity.** Generated content that is difficult to distinguish from authentic content.
- **Intellectual property.** Training on or reproducing protected material.
- **Value chain and component integration.** Opaque upstream components, third-party models and datasets with unknown provenance.

The Profile's suggested actions include provenance tracking for foundation models and datasets, adversarial testing including red-teaming, content provenance techniques, and human oversight of consequential actions. MLSecOpsHub folds these into the mapping as the "Generative AI Profile additions" section of the checklist: least-privilege tool scopes, approval gates for irreversible agent actions, trace logging, and confabulation tests on security-relevant outputs.

## How does the RMF relate to ISO/IEC 42001 and the EU AI Act?

NIST maintains crosswalk documents that align RMF subcategories with ISO/IEC 42001 clauses and with EU AI Act articles. The crosswalks are not equivalence tables. The RMF describes outcomes; ISO/IEC 42001 requires a certifiable management system; the EU AI Act imposes legal obligations on providers and deployers of high-risk systems. An organization that implements the controls on this page will have most of the technical evidence needed for the other two, but will still need the management-system clauses for certification and the conformity documentation for regulation. MLSecOpsHub structures its readiness work so that a single evidence set serves all three.

## What do assessors ask for?

Because the RMF has no auditors, "assessor" here means whoever evaluates the organization: a customer's security team, an internal audit function, a certification body using the crosswalk, or MLSecOpsHub during an engagement. The questions converge on the same artifacts:

1. The policy that names AI-specific risk classes and its review history.
2. The inventory: system cards and an AI-BOM that can be regenerated, not a spreadsheet.
3. The threat model with technique identifiers and the date it was last updated.
4. The test evidence: CI history showing security tests running and passing, plus the most recent red-team report.
5. The monitoring configuration and an example alert that fired.
6. The playbooks and proof that they were exercised.
7. The risk register with residual-risk acceptances signed by a named owner.

If any of these cannot be produced within a day, the corresponding subcategory should be marked as not achieved regardless of what the policy says.

## Where do organizations usually fall short?

Three patterns account for most of the findings MLSecOpsHub records against the RMF. First, governance exists at the policy layer but no pipeline control enforces it; a model intake policy without a registry gate. Second, MEASURE 2.7 is satisfied by a single penetration test of the web application in front of the model, which never touches the model artifact, the prompt templates or the tool layer. Third, agent systems are inventoried as applications rather than as principals with credentials, so MAP 1 and MANAGE 2 never account for what the agent can do once compromised.

Each of these is fixable within a normal engineering cycle. The controls table and checklist on this page are the starting point. To have them run against your own pipeline, book a 30-minute call.
