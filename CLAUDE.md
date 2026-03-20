# CLAUDE.md — InfraLens

InfraLens v4.2.0 (HUMAN_PRIMACY) — cognition layer for infrastructure engineering. Externalizes complexity across silicon physics, network architecture, operational economics, and human decision-making so engineers reason clearly. Amplifies judgment, not automation. Not an agent.

GitHub: github.com/Babia7/InfraLens | Deployed: polymathsystem.com (Cloud Run / NGINX)

Tech stack: React 19, TypeScript, Vite, Vitest, React Router (HashRouter).

---

## Operating Modes and Key Data Paths

| Mode | Purpose | Key data paths |
|------|---------|----------------|
| Reasoning | Constraint mapping, architecture modeling, financial analysis | `data/switches/`, `data/chassis/`, `data/designScenarios/` |
| Practice | Linux/EOS labs, CloudVision workflows | `data/protocolsContent/`, `data/linuxModules.ts`, `data/playbookData.ts` |
| Reference | Architecture codex, technical datasets | `data/switches/`, `data/chassis/`, `data/troubleshootContent.ts` |
| Delivery | Briefing Theater, Demo Command | `data/demoContent/`, narrative components |

Key capability layers: constraint mapping, failure pre-mortems, tradeoff matrices, architecture decision records, causal chain analysis.

---

## Vault Connection

PolymathOS vault root: `~/Library/Mobile Documents/iCloud~md~obsidian/Documents/PolymathOS/`

**Mapping spec:** `docs/vault-to-infralens-mapping.md` — authoritative rules for translating vault notes into InfraLens ProtocolDetail fields (note_type → field mapping, structural conventions, reconciliation workflow). Read this before any vault → data file sync.

**Repeatable update prompt:** `[vault root]/03 Projects/InfraLens/Protocol Lab Update Prompt.md` — step-by-step workflow for vault → protocol .ts updates. Contains per-protocol vault note lists and the field-mapping procedure. Use this for any protocol content update session instead of improvising.

The vault is the source of truth. InfraLens content must be reconciled manually against vault notes using the mapping spec when vault notes are updated.

---

## Protocol File Inventory (current state)

| Protocol | InfraLens file | Status |
|----------|----------------|--------|
| MLAG | `data/protocolsContent/mlag.ts` | Reconciled 2026-03-19 |
| BGP | `data/protocolsContent/bgp.ts` | Reconciled 2026-03-19 |
| EVPN | `data/protocolsContent/evpn.ts` | Reconciled 2026-03-19 |
| VXLAN | `data/protocolsContent/vxlan.ts` | Reconciled 2026-03-19 |
| QoS | `data/protocolsContent/qos.ts` | Reconciled 2026-03-19 |
| Multicast | `data/protocolsContent/multicast.ts` | Not yet reconciled |
| MACsec | `data/protocolsContent/macsec.ts` | Not yet reconciled |
| NVMe-oF | `data/protocolsContent/nvmeof.ts` | Not yet reconciled |

Next reconciliation candidates when vault depth warrants: NVMe-oF, Multicast, MACsec, Linux (when vault notes reach applied-stage depth).

---

## Session Protocol

**Protocol content update:** Open Protocol Lab Update Prompt.md → follow its steps in order: read current .ts, read vault notes, gap analysis (report before writing), write updated .ts, run `npx tsc --noEmit`. Do not skip the gap analysis step.

**New feature / component work:** Read the relevant component file and referenced data types. Compact after exploration, before implementation.

**"What's been done?":** Check Protocol File Inventory above. For vault work state, read `work-log.md` at vault root.

**Structural or multi-mode work:** Read `docs/readme.md` for architecture overview, then relevant data files.

---

## TypeScript Conventions

- After writing any `.ts` file: run `npx tsc --noEmit` from the project root.
- Pre-existing TypeScript errors in unrelated files are not your responsibility — do not fix unless asked.
- Write EOS CLI config blocks verbatim from vault notes. Do not paraphrase CLI syntax.
- `bestPractices[]`: operator-voice, actionable, 2–6 sentences each, max 8 per protocol.
- `roleConfigs[].config`: raw EOS CLI in template literal with `! ── SECTION ──` comment headers.
- `masteryPath[]` levels: exactly Foundation, Logic, or Architecture.
- Do not infer EOS platform behavior from general knowledge when vault notes exist.
- Component routing: register new tools in `config/toolsRegistry.ts`. Use shared design tokens from `styles/theme.css`.

---

## ECC Token Guidance

**Compact triggers for InfraLens sessions:**
- After reading vault notes (research phase), before writing the `.ts` file (implementation phase) — use `/compact "ready to write [protocol].ts"`
- After completing a protocol update, before starting the next — use `/compact`
- Do NOT compact mid-implementation of a `.ts` file (loses field-by-field context)

**Model routing:** Sonnet for main session. Use Haiku subagents for vault exploration (reading 5+ vault notes to build context summaries). One subagent reading 10 vault notes is cheaper than reading all 10 in the main context.

**Settings (add to `~/.claude/settings.json` if not already set):**
```json
{
  "env": {
    "CLAUDE_AUTOCOMPACT_PCT_OVERRIDE": "50",
    "CLAUDE_CODE_SUBAGENT_MODEL": "haiku"
  }
}
```

**Run from project root for project-scoped instinct detection:**
```
cd ~/Localdesignengineering/InfraLens && claude
```
The ECC `continuous-learning-v2` hook (already globally active) will scope learned InfraLens instincts to this repo via git remote detection.
