# Storage Fabric Planner Rules (Arista Ethernet, VAST NVMe-oF)

This document defines a lightweight rules engine for the Storage Fabric Planner.
It uses NVIDIA/VAST sizing presets for bandwidth context only. All outputs are
Arista Ethernet decisions and Arista-centric artifacts.

## Inputs

Required
- Design Preset: 2-4-3-200 | 2-8-5-200 | 2-8-9-400
- Port Speed: 200G | 400G
- Host Count: integer (total compute nodes)
- Storage Protocol: NVMe-oF RoCE v2 | NVMe-TCP

Optional
- Oversubscription Target: 1:1 | 2:1 | 3:1
- Traffic Mix: E-W heavy | N-S heavy | Balanced
- Latency Tier: Standard | Ultra-low
- Redundancy: Dual-fabric | Single-fabric

## Derived Values

- SU Count: ceil(hostCount / 4) for RA patterns that specify 4-node SUs.
- Per-Host Bandwidth: from Design Preset and Port Speed.
- Total Host Bandwidth: hostCount * perHostBandwidth.
- Leaf Ports Required: hostCount * hostPortsPerNode.
- Spine Uplinks Required: leafPortsRequired / oversubscriptionTarget.

## Decision Rules

Platform Selection
- If oversubscription > 2:1 OR traffic mix is N-S heavy OR latency tier is Ultra-low:
  prefer deep-buffer class (7280R3).
- Else:
  prefer low-latency class (7050X4).

Port Plan
- Port speed is always the user-selected 200G/400G, never hardcoded.
- For 200G selection, allow 2x200G per host for performance tiers when needed.
- For 400G selection, prefer 1x400G per host unless redundancy requires 2x400G.

Fabric Split
- E-W and N-S fabrics are modeled separately in outputs.
- VAST-facing traffic is mapped to the N-S profile.
- E-W is reserved for compute-to-compute patterns.

Lossless Profile
- RoCE v2: enable PFC and ECN; define a storage traffic class with strict MTU.
- NVMe-TCP: no PFC required by default; still enforce MTU alignment and ECN.

Validation Flags
- Oversubscription > 2:1 -> "Deep buffer recommended."
- Port utilization > 80% -> "Add leaf capacity."
- Mixed traffic classes on same queue -> "QoS split required."

## Outputs

Core Outputs
- Topology: leaf-spine or dual-leaf + spine with redundancy mode.
- Platform: 7050X4 or 7280R3 class with rationale.
- Port Map: per-SU host links, leaf ports used, spine uplinks.
- Fabric Split: E-W vs N-S summary and bandwidth allocation.
- Lossless Profile: PFC/ECN/MTU guidance for Arista EOS.

Artifacts
- Arista EOS snippet: MTU, DCB/PFC, ECN/WRED, queue profile.
- AVD seed: spines, leaves, uplinks per leaf, link speed, VRF list.
- Validation checklist: NIC speed, MTU alignment, PFC/ECN verification.

## Notes

- Presets are used for sizing context only; no vendor-specific switch guidance
  is presented in the outputs.
- Keep all user-facing language Arista-centric and Ethernet-first.
