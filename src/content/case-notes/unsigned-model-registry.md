---
title: "Case note: an unsigned model registry feeding production"
description: "How a healthcare model registry where anyone could overwrite versions and deployments pulled latest gained signing, provenance and admission control."
summary: "An internal model registry with no signatures, no provenance and mutable latest tags could not prove which model was running or where it came from."
sector: "Healthcare analytics, high-risk use case candidate under the EU AI Act"
lane: model-supply-chain
service: ai-governance-readiness
readiness: eu-ai-act
published: 2026-09-08
updated: 2026-09-08
---

MLSecOpsHub reviewed a healthcare analytics team's model registry and the pipeline that promoted models from it to Kubernetes inference servers. Any engineer could overwrite a version, deployments pulled a mutable latest tag, and no record tied an artifact to its training run. The engagement introduced immutable, signed versions with verified provenance enforced at admission time.

## Context

> This case note is an anonymized, illustrative composite of patterns seen across engagements. Names, numbers and architecture details are altered.

The client builds risk-stratification models on clinical data and expected at least one of them to fall in scope as a high-risk AI system under the EU AI Act. Their platform used an MLflow-style registry. Training jobs logged runs and registered model versions. A deployment pipeline packaged the registered model into a container and rolled it out to inference servers in a Kubernetes cluster.

The engagement was framed as governance readiness, but the first question a regulator or auditor would ask, "which model is running and where did it come from," could not be answered from the system of record.

## Finding

The registry was open. Every engineer with cluster access held credentials that allowed registering a new version, overwriting an existing one, or moving the production alias. There was no review step between a registry write and a deployment, because the deployment pipeline watched the `latest` alias and rolled whatever it pointed to.

Provenance did not exist as a linked chain. Training runs recorded parameters and metrics, but the registered artifact carried no reference to the code commit, the dataset snapshot, or the pipeline execution that produced it. A model version could be uploaded from a laptop with the same metadata shape as one produced by the pipeline.

Nothing was signed. The inference server pulled the container image by tag and trusted whatever the registry returned. Integrity could be asserted, not demonstrated.

Against the EU AI Act this left three concrete gaps. Article 11 expects technical documentation that describes how the system was developed, including data and training procedures; the client could not regenerate that from records. Article 12 expects automatic logging sufficient to trace the system's operation; training and deployment logs were not retained past the run. Article 15 expects accuracy, robustness and cybersecurity, including protection against attempts to alter the model; a mutable registry with no signatures cannot show that.

<figure class="diagram">
  <svg viewBox="0 0 720 320" role="img" aria-labelledby="d3-title" xmlns="http://www.w3.org/2000/svg">
    <title id="d3-title">Signed, provenance-attested model versions verified by cluster admission control before an inference server pulls them</title>
    <defs><marker id="arrowhead" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="arrowhead"/></marker></defs>
    <rect class="box-good" x="20" y="110" width="150" height="60" rx="3"/>
    <text x="95" y="135" text-anchor="middle">Training pipeline</text>
    <text x="95" y="154" text-anchor="middle" class="label">commit + data snapshot</text>
    <rect class="box-good" x="230" y="30" width="160" height="56" rx="3"/>
    <text x="310" y="53" text-anchor="middle">Sign + attest</text>
    <text x="310" y="72" text-anchor="middle" class="label">SLSA-style provenance</text>
    <rect class="box-good" x="230" y="110" width="160" height="60" rx="3"/>
    <text x="310" y="135" text-anchor="middle">Model registry</text>
    <text x="310" y="154" text-anchor="middle" class="label">immutable versions</text>
    <rect class="box-bad" x="230" y="210" width="160" height="56" rx="3"/>
    <text x="310" y="233" text-anchor="middle">Laptop upload</text>
    <text x="310" y="252" text-anchor="middle" class="label">no attestation</text>
    <rect class="box-good" x="450" y="110" width="150" height="60" rx="3"/>
    <text x="525" y="135" text-anchor="middle">Admission control</text>
    <text x="525" y="154" text-anchor="middle" class="label">verify sig + subject</text>
    <rect class="box" x="450" y="210" width="150" height="56" rx="3"/>
    <text x="525" y="233" text-anchor="middle">Model card, AI-BOM</text>
    <text x="525" y="252" text-anchor="middle" class="label">from same metadata</text>
    <rect class="box" x="640" y="110" width="70" height="60" rx="3"/>
    <text x="675" y="135" text-anchor="middle">Infer</text>
    <text x="675" y="154" text-anchor="middle" class="label">K8s</text>
    <path class="arrow" d="M170 140 L228 140"/>
    <path class="arrow" d="M170 130 L228 66"/>
    <path class="arrow" d="M310 88 L310 108"/>
    <path class="arrow" d="M390 140 L448 140"/>
    <path class="arrow" d="M310 208 L310 172"/>
    <text x="410" y="200" text-anchor="middle" class="warn">rejected: unsigned</text>
    <path class="arrow" d="M600 140 L638 140"/>
    <text x="619" y="130" text-anchor="middle" class="ok">pass</text>
    <path class="arrow" d="M390 150 L448 232"/>
    <text x="95" y="220" text-anchor="middle" class="label">Art. 11 docs, Art. 12 logs,</text>
    <text x="95" y="238" text-anchor="middle" class="label">Art. 15 integrity</text>
    <text x="95" y="256" text-anchor="middle" class="label">produced by the pipeline</text>
  </svg>
  <figcaption class="mono text-xs muted mt-2">Remediated path: only pipeline-produced, signed versions with matching provenance pass admission; documentation is generated from the same metadata.</figcaption>
</figure>

## Fix

The controls were sequenced under the [AI governance readiness](/services/ai-governance-readiness) service so that each one produced evidence the next one depended on.

1. **Immutable versions.** Registry permissions were split. The training pipeline's identity is the only principal that can register a version, and versions cannot be overwritten. Promotion to a production alias is a reviewed change with a recorded approver.
2. **Signed artifacts with provenance.** The pipeline signs every model artifact and emits an in-toto attestation in a SLSA-style format that names the code commit, the dataset snapshot digest, the pipeline run and the resulting artifact digest. Open-source signing and attestation tooling of the kind cataloged at [awesomemlsecops.com](https://awesomemlsecops.com) was used; the choice of tool matters less than the invariant.
3. **Admission control.** A cluster admission policy verifies the signature and checks that the attestation's subject matches the image the inference server is about to pull. Deployments reference a version digest, never `latest`. An artifact without a valid attestation is rejected before it runs.
4. **Documentation from metadata.** Model cards and an AI bill of materials are generated from the same attestation metadata, so the documentation describes what actually shipped rather than what someone remembered to write.
5. **Log retention.** Training run logs, registry events and admission decisions are retained on a schedule aligned with the system's expected lifetime and the Article 12 logging expectation.

## Outcome

The client can now answer the auditor's question from the system itself: every running model resolves to a digest, a signature, a pipeline run, a commit and a dataset snapshot. Nothing reaches an inference server without passing signature verification, and nothing can be registered outside the pipeline. Technical documentation is regenerated on each release rather than maintained by hand.

For the [EU AI Act](/readiness/eu-ai-act) readiness file, Articles 11, 12 and 15 moved from unanswerable to evidenced by artifacts the pipeline emits on every run.
