---
title: "Case note: an MCP server with over-broad tool permissions"
description: "How an internal AI assistant whose MCP servers exposed write, delete and HTTP tools under one shared account was scoped, gated and tested in CI."
summary: "An indirect prompt injection in a support ticket could drive an internal agent to read files through one MCP tool and exfiltrate them through another."
sector: "Fintech, internal operations tooling"
lane: agentic-mcp
service: ai-security-assessment
readiness: nist-ai-rmf
published: 2026-09-08
updated: 2026-09-08
---

MLSecOpsHub assessed an internal operations assistant that connected an LLM agent to four Model Context Protocol servers. One server exposed write, delete and outbound HTTP tools under a shared service account, and a prompt injection in a ticket could chain them into data exfiltration. The engagement scoped every tool, added confirmation gates, and put adversarial tests in CI.

## Context

> This case note is an anonymized, illustrative composite of patterns seen across engagements. Names, numbers and architecture details are altered.

The client's operations team used an assistant built on an open-source agent framework. It answered questions about customer tickets, looked up records, and drafted responses. The agent reached its data through MCP servers: one for the ticketing system, one for a shared filesystem, one for an internal HTTP gateway, and one for a reporting database.

The MCP servers had been written quickly by the platform team. Each server registered every operation its backend supported. The filesystem server offered read, write and delete. The HTTP server accepted any URL. All four authenticated with a single service account whose permissions were the union of everything the assistant might ever need.

## Finding

The assessment mapped the tool surface against the OWASP Top 10 for LLM Applications and MITRE ATLAS and found two structural problems.

First, tool descriptions were untrusted input. The framework fetched each server's tool list at startup and rendered the descriptions verbatim into the system prompt. Anyone who could modify a server, or stand up a look-alike server on the internal network, could inject instructions into every session.

Second, the assistant had all three ingredients of what is often called the lethal trifecta: access to private data, exposure to untrusted content, and a channel to communicate externally. Ticket bodies are written by customers. The filesystem tool reads internal documents. The HTTP tool can send a request anywhere.

The proof of concept was a support ticket containing instructions disguised as a customer note. When an operator asked the assistant to summarize the ticket, the model followed the embedded instructions, read a configuration file through the filesystem tool, and posted its contents to an external URL through the HTTP tool. No exploit code was needed; the tools worked exactly as registered. This maps to LLM01 (prompt injection) and LLM06 (excessive agency) in the OWASP list.

<figure class="diagram">
  <svg viewBox="0 0 720 320" role="img" aria-labelledby="d2-title" xmlns="http://www.w3.org/2000/svg">
    <title id="d2-title">Indirect prompt injection in a ticket drives the agent to read a file over one MCP tool and exfiltrate it over another</title>
    <defs><marker id="arrowhead" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="arrowhead"/></marker></defs>
    <rect class="box-bad" x="20" y="120" width="150" height="60" rx="3"/>
    <text x="95" y="145" text-anchor="middle">Customer ticket</text>
    <text x="95" y="164" text-anchor="middle" class="label">hidden instructions</text>
    <rect class="box" x="250" y="120" width="150" height="60" rx="3"/>
    <text x="325" y="145" text-anchor="middle">LLM agent</text>
    <text x="325" y="164" text-anchor="middle" class="label">shared svc account</text>
    <rect class="box-bad" x="480" y="30" width="150" height="56" rx="3"/>
    <text x="555" y="53" text-anchor="middle">MCP: filesystem</text>
    <text x="555" y="72" text-anchor="middle" class="label">read/write/delete</text>
    <rect class="box-bad" x="480" y="120" width="150" height="56" rx="3"/>
    <text x="555" y="143" text-anchor="middle">MCP: HTTP</text>
    <text x="555" y="162" text-anchor="middle" class="label">any URL</text>
    <rect class="box" x="480" y="210" width="150" height="56" rx="3"/>
    <text x="555" y="233" text-anchor="middle">MCP: tickets, DB</text>
    <text x="555" y="252" text-anchor="middle" class="label">read tools</text>
    <path class="arrow" d="M170 150 L248 150"/>
    <text x="209" y="140" text-anchor="middle" class="label">summarize</text>
    <path class="arrow" d="M400 140 L478 62"/>
    <text x="430" y="88" text-anchor="middle" class="warn">1. read config</text>
    <path class="arrow" d="M400 150 L478 150"/>
    <text x="440" y="185" text-anchor="middle" class="warn">2. POST contents</text>
    <path class="arrow" d="M630 148 L700 148"/>
    <text x="665" y="138" text-anchor="middle" class="warn">exfil</text>
    <path class="arrow" d="M400 160 L478 236"/>
    <rect class="box" x="230" y="220" width="190" height="60" rx="3"/>
    <text x="325" y="243" text-anchor="middle">System prompt</text>
    <text x="325" y="262" text-anchor="middle" class="label">tool descriptions verbatim</text>
    <path class="arrow" d="M325 218 L325 182"/>
  </svg>
  <figcaption class="mono text-xs muted mt-2">Attack path: untrusted ticket content becomes agent instructions; the filesystem and HTTP tools complete the read-then-exfiltrate chain.</figcaption>
</figure>

## Fix

Remediation was delivered as part of the [AI security assessment](/services/ai-security-assessment) scope and ran in two tracks.

Tool surface reduction:

1. Every tool received an explicit scope. Read-only became the default; write and delete tools moved to a separately registered server that the assistant does not load by default.
2. State-changing tools require a human-in-the-loop confirmation. The agent proposes the call with its arguments and an operator approves it in the interface before execution.
3. The HTTP tool gained an egress allowlist of internal hostnames. Arbitrary URLs are rejected at the server, not by the prompt.
4. The shared service account was retired. Each session obtains credentials scoped to the requesting operator, so the agent can never read more than the person driving it.

Trust boundary hardening:

5. Tool descriptions are pinned. The framework loads a reviewed, checked-in manifest and refuses a server whose advertised tools differ from it.
6. Every tool call is logged with session, operator, arguments and result digest, and the logs feed the existing SIEM.
7. A suite of adversarial test cases, each mapped to a MITRE ATLAS technique, runs in CI against the assistant. The ticket-summary injection is now a regression test. Open-source injection and agent testing tools of the kind indexed at [awesomemlsecops.com](https://awesomemlsecops.com) drive the suite.

## Outcome

The lethal trifecta is broken on two of its three sides. The agent can still read untrusted ticket content, but it cannot reach arbitrary external endpoints, and it cannot change state without an operator confirming the exact call. Tool descriptions can no longer be altered without failing a manifest check. Every action is attributable to an operator, not to a shared account.

The client mapped the controls to the Govern, Map, Measure and Manage functions of the [NIST AI RMF](/readiness/nist-ai-rmf), giving its risk team a documented basis for the assistant's continued use.
