---
title: "Case note: pickle model loading in a CI pipeline"
description: "How a CI pipeline that loaded pickle-based PyTorch checkpoints on a privileged runner was moved to safetensors, pinned revisions and signed artifacts."
summary: "A GitHub Actions pipeline deserialized unpinned Hugging Face checkpoints with torch.load on a runner that held cloud credentials and registry push rights."
sector: "B2B SaaS, computer vision"
lane: model-supply-chain
service: mlsecops-pipeline-hardening
readiness: cyber-resilience-act
published: 2026-09-08
updated: 2026-09-08
---

MLSecOpsHub assessed a computer vision team's CI pipeline that downloaded PyTorch checkpoints from Hugging Face Hub and internal S3 and loaded them with `torch.load` on a self-hosted runner holding cloud credentials. The engagement replaced pickle deserialization with a safetensors-only policy, pinned model revisions, and added signature verification before packaging.

## Context

> This case note is an anonymized, illustrative composite of patterns seen across engagements. Names, numbers and architecture details are altered.

The client ships a computer vision product whose backbone models are fine-tuned from public checkpoints. A GitHub Actions workflow ran on a self-hosted runner inside the company's cloud account. On every merge to main it pulled a base checkpoint from Hugging Face Hub, pulled the latest fine-tuned checkpoint from an internal S3 bucket, ran an evaluation suite, then packaged the model into a container image and pushed it to the production registry.

The runner was long-lived. It carried a static cloud access key with write access to the model bucket and push rights to the container registry, because the same job did evaluation and packaging. Nobody had classified model files as executable input. They were treated like data.

## Finding

Both checkpoint sources delivered pickle-based files (`.bin` and `.pt`). Pickle is a code-execution format: deserializing an attacker-controlled file runs whatever the file specifies. This is not theoretical. In February 2024 JFrog reported roughly 100 malicious models on Hugging Face that abused pickle deserialization to run code on load.

Three conditions compounded the risk:

1. The base checkpoint was referenced by repository name only, with no pinned revision. Any change to the upstream repository, whether by the maintainer or through a compromised account, flowed straight into the next build.
2. The fine-tuned checkpoint in S3 could be overwritten by any principal with bucket write access, and the packaging job trusted whatever object carried the expected key.
3. `torch.load` ran with default settings on a PyTorch version older than 2.6, so `weights_only` was off. PyTorch 2.6 later switched the default to `weights_only=True`, but CVE-2025-32434 showed that `weights_only=True` on versions before 2.6 could still be bypassed, so the flag alone was never a sufficient control on the client's version.

The blast radius was the runner's credentials. A malicious checkpoint executing during evaluation could read the static access key, overwrite other models in the bucket, and push an arbitrary image to the production registry under a legitimate tag.

<figure class="diagram">
  <svg viewBox="0 0 720 300" role="img" aria-labelledby="d1-title" xmlns="http://www.w3.org/2000/svg">
    <title id="d1-title">Unpinned pickle checkpoints deserialized on a CI runner with static credentials and registry push rights</title>
    <defs><marker id="arrowhead" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="arrowhead"/></marker></defs>
    <rect class="box-bad" x="20" y="40" width="150" height="56" rx="3"/>
    <text x="95" y="63" text-anchor="middle">Hugging Face Hub</text>
    <text x="95" y="82" text-anchor="middle" class="label">unpinned revision</text>
    <rect class="box-bad" x="20" y="180" width="150" height="56" rx="3"/>
    <text x="95" y="203" text-anchor="middle">Internal S3</text>
    <text x="95" y="222" text-anchor="middle" class="label">overwritable .pt</text>
    <rect class="box-bad" x="280" y="110" width="160" height="60" rx="3"/>
    <text x="360" y="135" text-anchor="middle">torch.load()</text>
    <text x="360" y="154" text-anchor="middle" class="label">pickle = code exec</text>
    <rect class="box" x="260" y="20" width="200" height="30" rx="3"/>
    <text x="360" y="40" text-anchor="middle" class="label">self-hosted runner</text>
    <rect class="box-bad" x="280" y="210" width="160" height="56" rx="3"/>
    <text x="360" y="233" text-anchor="middle">Static cloud key</text>
    <text x="360" y="252" text-anchor="middle" class="label">bucket + registry</text>
    <rect class="box-bad" x="550" y="110" width="150" height="60" rx="3"/>
    <text x="625" y="135" text-anchor="middle">Prod registry</text>
    <text x="625" y="154" text-anchor="middle" class="label">push as legit tag</text>
    <path class="arrow" d="M170 68 L278 128"/>
    <path class="arrow" d="M170 208 L278 152"/>
    <path class="arrow" d="M360 170 L360 208"/>
    <path class="arrow" d="M440 238 L625 238 L625 172"/>
    <text x="510" y="230" text-anchor="middle" class="warn">exec reads key, pushes image</text>
  </svg>
  <figcaption class="mono text-xs muted mt-2">Vulnerable path: a malicious checkpoint executes inside torch.load, harvests the runner's static key, and pushes to production.</figcaption>
</figure>

## Fix

The remediation followed the scope of the [MLSecOps pipeline hardening](/services/mlsecops-pipeline-hardening) service and was applied in this order:

1. **Format allowlist.** The pipeline accepts only `.safetensors` files. A pre-load step rejects any other extension and any file whose header does not parse as safetensors. Pickle files never reach the evaluation step.
2. **Runtime upgrade.** PyTorch was upgraded to 2.6 or later, where `torch.load` defaults to `weights_only=True`. The team treats this as defense in depth behind the allowlist, not as the primary control, because of the CVE-2025-32434 history.
3. **Pinned revisions.** Hub downloads reference a commit SHA, not a branch. Changing the base model is a reviewed pull request that updates the SHA.
4. **Model scanning.** A scanning step inspects every artifact before it is loaded, using open-source scanners of the kind listed at [awesomemlsecops.com](https://awesomemlsecops.com). The scan is a gate, not a report.
5. **Least-privilege runner.** The static access key was removed. The job obtains short-lived credentials through OIDC federation, scoped to read the model bucket. Registry push moved to a separate job with its own narrowly scoped identity.
6. **Signing and verification.** The training pipeline signs each fine-tuned checkpoint and emits a Sigstore-style attestation. The packaging job verifies the signature and the attestation's subject digest before it builds the image. An unsigned or mismatched artifact fails the build.

## Outcome

The control points are now observable rather than assumed. No pickle file can reach the packaging step; the format allowlist and the scanner both fail closed. Every model artifact that enters a production image carries a verified signature and a provenance attestation naming the pipeline run that produced it. The evaluation runner can no longer push to the registry at all.

The client also gained the evidence it needs for the [Cyber Resilience Act](/readiness/cyber-resilience-act) obligations around secure-by-default configuration and supply-chain integrity, because the pipeline now produces the records those obligations ask for as a by-product of running.
