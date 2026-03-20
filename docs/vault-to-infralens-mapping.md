# Vault → InfraLens Mapping Spec

**Version:** 1.0
**Scope:** MLAG pilot (Phase 3). Governs all future protocol additions and content updates.

---

## Purpose

This document is the authoritative reference for translating Obsidian vault notes into InfraLens `ProtocolDetail` fields. It defines mapping rules by `note_type`, section pattern, and frontmatter field, plus structural conventions for each field type.

The vault is the source of truth. InfraLens content must be reconciled manually using this spec when vault notes are updated.

---

## 1. Mapping by `note_type` Frontmatter

| Vault `note_type` | Maps to InfraLens field(s) |
|---|---|
| `concept` | `bestPractices[]`, `masteryPath[]`, `overview`, `primer` |
| `reference` | `roleConfigs[]`, `cliTranslation[]` |
| `workflow` | `roleConfigs[]` (procedure-style entries) |

**Notes:**
- A `concept` note may contribute to `bestPractices[]` (key mechanisms, caveats) **and** `masteryPath[]` (conceptual clusters). Both can be populated from the same source note.
- A `reference` note with vendor CLI examples maps to `cliTranslation[]`; a reference note with full configuration blocks maps to `roleConfigs[]`.
- A `workflow` note (step-by-step verification or runbook) always becomes a `roleConfigs[]` entry with a `config` block that mirrors the workflow steps as CLI commands with comments.

---

## 2. Mapping by Vault Section Pattern

| Vault section | InfraLens field |
|---|---|
| "Problem It Solves" / purpose statement | `description`, `tagline` |
| "Key Mechanisms" / design principles | `bestPractices[]` — one item per mechanism |
| "Failure Modes" | `roleConfigs[]` — Troubleshooting Map entry |
| "EOS Configuration" / numbered code blocks | `roleConfigs[]` — one entry per logical config unit |
| "Verification Commands" / numbered steps | `roleConfigs[]` — Validation or Workflow entry |
| "Notes/Caveats" | `bestPractices[]` (novel items only) or inline config comments |
| "Related Notes" wikilinks | `referenceLinks[]` — translate to Arista doc URLs |

**Notes:**
- "Key Mechanisms" items that are purely operational caveats (not conceptual) go into `bestPractices[]`, not `masteryPath[]`.
- "Related Notes" wikilinks that point to vendor documentation should become `referenceLinks[]` entries with the Arista EOS User Manual URL. Internal vault links do not map to `referenceLinks[]`.
- If a caveat duplicates an existing `bestPractices[]` item, inline it as a `!` comment inside the relevant `roleConfigs[].config` block instead of adding a new item.

---

## 3. Mapping by Frontmatter Field

| Vault field | InfraLens usage |
|---|---|
| `domain: datacenter-networking` | Maps to a protocol file in `data/protocolsContent/` |
| `authority: vendor-doc` | `referenceLinks[]` should cite the Arista EOS User Manual |
| `study_stage: applied` | Content belongs in `roleConfigs[]` or `bestPractices[]` — not limited to `masteryPath[]` |

**Notes:**
- `domain: datacenter-networking` notes map to the `data/protocolsContent/` directory. One file per protocol (e.g., `mlag.ts`, `bgp.ts`).
- `authority: vendor-doc` means the source content is authoritative and may be used verbatim in `bestPractices[]` or `config` blocks. Always add a `referenceLinks[]` entry pointing to the Arista EOS User Manual chapter for the protocol.
- `study_stage: applied` indicates the content has been validated in a lab or production context. This content should appear in `roleConfigs[]` (config templates) or `bestPractices[]` (operational guidance), not only in `masteryPath[]`.

---

## 4. Structural Conventions

### `bestPractices[]`
- Each item is a **self-contained paragraph** (2–6 sentences).
- Maximum **8 items** per protocol. If more content exists, consolidate related items or inline caveats into `roleConfigs[].config` comments.
- Items should be operational — actionable by an engineer deploying or troubleshooting the protocol.
- Do not duplicate content already present in `overview`, `primer`, or `roleConfigs[]` descriptions.

### `roleConfigs[]`
- `role`: Short label (3–6 words). Describes the scenario, not the command.
- `description`: 1–2 sentences. States what the config accomplishes and any key constraint.
- `config`: Raw EOS CLI in a template literal. Use `! ── SECTION ──` comment headers to separate logical blocks. Inline `!` comments explain non-obvious choices.
- Insert entries in logical deployment order: global config → member config → verification.

### `masteryPath[]`
- Levels must be exactly one of: `Foundation`, `Logic`, or `Architecture`.
- One item per **major concept cluster** — not per individual command or feature.
- `heading`: Noun phrase (3–5 words).
- `body`: 2–4 sentences explaining the concept and its operational significance.
- `keyConcept`: The single most important term or command for the cluster (shown as a chip in the UI).

### `overview.sections[]`
- Maximum **2–3 sections** per protocol.
- Each section covers one architectural sub-topic (e.g., peer-link role, peer-address role).
- `bestFor`: One sentence. States the recommended config or constraint for the sub-topic.

---

## 5. Reconciliation Workflow

When a vault note is updated:

1. Identify which `note_type` and sections changed.
2. Use the mapping tables above to determine which InfraLens fields are affected.
3. Update the relevant `data/protocolsContent/<protocol>.ts` file directly.
4. Run `cd InfraLens && npx tsc --noEmit` to verify no TypeScript errors.
5. Visual review: open InfraLens app and navigate to the protocol to confirm rendering.

No automated build tooling is required. Manual reconciliation is the approved workflow for the vault → InfraLens pipeline.

---

## 6. Protocol File Inventory

| Protocol | Vault notes | InfraLens file | Status |
|---|---|---|---|
| MLAG | MLAG Best Practices.md, EOS MLAG Deployment Baseline.md, EOS MLAG Verification Workflow.md | `data/protocolsContent/mlag.ts` | Reconciled 2026-03-19 |
| BGP | BGP in Datacenter Fabrics.md, BGP ASN Strategy.md, BGP Internet Edge Design.md, BGP Underlay Best Practices.md, BGP Session Security.md, EOS BGP Underlay Deployment Baseline.md, EOS BGP Underlay Verification Commands.md | `data/protocolsContent/bgp.ts` | Reconciled 2026-03-19 |
| EVPN | EVPN Control Plane.md, EVPN Route Types.md, EVPN MAC Learning.md, EVPN Multihoming.md, Route Reflector Design for EVPN.md, L2/L3 EVPN Services.md, Symmetric IRB.md, EVPN-VXLAN Best Practices.md, EOS EVPN-VXLAN Deployment Baseline.md | `data/protocolsContent/evpn.ts` | Reconciled 2026-03-19 |
| VXLAN | VXLAN Data Plane.md, VXLAN Flooding Behavior.md, Head End Replication.md, DCI with VXLAN.md, Anycast Gateway and VARP.md, EOS VXLAN Platform and Routing Best Practices.md | `data/protocolsContent/vxlan.ts` | Reconciled 2026-03-19 |
| QoS | RoCE v2.md, PFC Behavior.md, PFC and ECN.md, ECN Congestion Signaling.md, DCQCN.md, Lossless Ethernet for RoCEv2.md, QoS Verification Workflow.md, ECN Tuning Workflow.md, EOS QoS Configuration Template for AI Fabrics.md, RoCEv2 Congestion Design Procedure.md | `data/protocolsContent/qos.ts` | Reconciled 2026-03-19 |
| Multicast | — | `data/protocolsContent/multicast.ts` | Not yet reconciled |
| MACsec | — | `data/protocolsContent/macsec.ts` | Not yet reconciled |
| NVMe-oF | — | `data/protocolsContent/nvmeof.ts` | Not yet reconciled |

---

## 7. Reconciliation Triggers

A reconciliation run is warranted when:

1. **New vault notes reach `study_stage: applied`** in a domain that maps to an existing InfraLens protocol file. Check `processing_state` in the vault note's frontmatter — `promoted` means the content is reconciliation-ready.

2. **An existing protocol file has WEAK or MISSING fields** identified during a gap analysis. Trigger reconciliation for that protocol's full note set, not just the new note.

3. **A new protocol** accumulates 3+ vault notes at `study_stage: applied` — threshold for opening a new InfraLens file. Current candidates: NVMe-oF, Multicast, MACsec, Linux labs.

4. **Vault note is updated after reconciliation** (e.g., new EOS platform behavior added, CLI syntax corrected). Re-run reconciliation for the affected fields only — not the full file.

**Trigger check:** Before starting a vault → InfraLens session, read `work-log.md` at the vault root to see what was recently updated. Cross-reference with Protocol File Inventory above to identify what needs reconciliation.
