---
title: "OpenClaw Now Scans Skills for You. Here's Why You Should Still Install Heimdall."
description: "VirusTotal integration is great. But 8 patterns vs 92 is a real gap."
pubDate: "2026-02-07"
---

OpenClaw just announced a partnership with VirusTotal to bring security scanning to ClawdHub. Every skill published to the marketplace now gets auto-scanned. This is genuinely impressive.

But here's the key: it's one layer.

Because 341 malicious skills were found on ClawdHub this week. Infostealers. Reverse shells. Credential theft. The VirusTotal integration catches known malware and suspicious behavioral patterns, but even OpenClaw's own announcement says it plainly: "this is not a silver bullet."

## I Built My Own Scanner

After reading Simon Willison's security analysis of how skills can be weaponized, I vibed my own scanner. Called it Heimdall — the Norse watchman who guards the bridge to Asgard.

Today Heimdall has 92 detection patterns across 19 threat categories. Plus an AI analysis mode that explains findings in plain English.

The comparison: OpenClaw's native scanner has 8 patterns. Heimdall has 92. The stuff in that gap is not obscure — heartbeat injection, MCP tool abuse, unicode tag injection, supply chain attacks, telemetry beacons, crypto wallet extraction.

341 malicious skills this week. Install Heimdall. Scan everything. Trust nothing.

- [Heimdall on GitHub](https://github.com/henrino3/heimdall)
- [Heimdall on ClawdHub](https://clawdhub.com/skills/heimdall)

---
*Originally published on [henrymascot.com](https://henrymascot.com/writing/why-you-should-still-install-heimdall). [Read the full article →](https://henrymascot.com/writing/why-you-should-still-install-heimdall)*
