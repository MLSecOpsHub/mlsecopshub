# Agentic Attack Index

Maintained by [MLSecOpsHub](https://mlsecopshub.com). Rendered at
<https://mlsecopshub.com/data>.

A structured list of publicly documented prompt-injection and agent/MCP
security incidents and vulnerability disclosures. The file
`agentic-attack-index.json` in this directory is the canonical dataset.

## Fields

| Field | Description |
|---|---|
| `id` | Unique kebab-case identifier, prefixed with the disclosure year and month. |
| `disclosed` | Public disclosure date, `YYYY-MM` or `YYYY-MM-DD`. |
| `product` | The affected product, library or service. |
| `vendor` | The organization responsible for the product. |
| `vector` | One of `indirect-prompt-injection`, `direct-prompt-injection`, `tool-permission-abuse`, `mcp-server-compromise`, `data-exfiltration`, `agent-hijacking`. |
| `surface` | Where untrusted input entered the system (for example a browser agent reading web pages). |
| `impact` | What an attacker achieved or could achieve. |
| `summary` | One or two plain sentences describing the issue. |
| `source` | URL of the primary disclosure: researcher write-up, vendor advisory or CVE record. |
| `sourceName` | Name of the disclosing party or publication. |
| `status` | One of `fixed`, `mitigated`, `unpatched`, `disputed`, `unknown`. |

## Inclusion criteria

An entry is included only if all of the following hold:

1. It is publicly documented by a primary source (researcher publication, vendor advisory, CVE record or equivalent).
2. It affects an AI agent, an LLM-integrated application or a Model Context Protocol (MCP) client or server.
3. The attack path involves untrusted input reaching a model or its tools (prompt injection, tool abuse, MCP compromise or agent hijacking).

Speculative attacks, demonstrations without a named product, and issues that are only theoretical are not included. Where a detail is uncertain the summary stays general and `status` is set to `unknown`.

## Contributing

Open a pull request against the GitHub repository
[MLSecOpsHub/agentic-attack-index](https://github.com/MLSecOpsHub/agentic-attack-index).
Add one object to `agentic-attack-index.json`, keep the array sorted by
`disclosed` descending, and cite a primary source. Corrections to existing
entries are welcome; please link the evidence in the PR.

## License

[Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).

## Citation

> MLSecOpsHub, Agentic Attack Index, https://mlsecopshub.com/data
