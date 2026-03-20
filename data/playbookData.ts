export interface PlaybookBranch {
  id: string;
  title: string;
  audience: string;
  vertical: string;
  objection?: string;
  beats: { heading: string; content: string; cue?: string }[];
}

export const PLAYBOOKS: PlaybookBranch[] = [
  {
    id: 'cxo-ai-fabric',
    title: 'CXO: AI Fabric Brief',
    audience: 'Executive',
    vertical: 'AI / HPC',
    objection: 'Risk of vendor lock-in',
    beats: [
      { heading: 'Context', content: 'AI training demand is outpacing traditional fabrics. You need predictable scale and time-to-first-model.' },
      { heading: 'Non-Blocking', content: 'Rail-aligned leaf-spine with deterministic latency; VXLAN/EVPN control plane removes flood/learn risk.' },
      { heading: 'Cost Proof', content: 'TCO delta vs monolithic: power draw, cooling, and operational hours saved with automation.' },
      { heading: 'Lock-in Rebuttal', content: 'Standards-first (BGP EVPN, VXLAN) + open eAPI; no proprietary controllers required.' }
    ]
  },
  {
    id: 'sec-zero-trust',
    title: 'Security: Zero Trust & Segmentation',
    audience: 'Security',
    vertical: 'Enterprise',
    objection: 'Concern about east-west visibility',
    beats: [
      { heading: 'Threat Model', content: 'Lateral movement and credential abuse are primary risks inside the data center.' },
      { heading: 'Segmentation', content: 'VRF/EVPN isolation with route-targets; per-tenant firewall insertion and MAC/IP bindings.' },
      { heading: 'Observability', content: 'Inline mirror and TAP aggregation via DANZ; ERSPAN with metadata; deterministic path tracing.' },
      { heading: 'Outcome', content: 'Reduced dwell time; measurable blast-radius reduction for compliance frameworks.' }
    ]
  },
  {
    id: 'ops-issu',
    title: 'Operations: ISSU & Reliability',
    audience: 'Operations',
    vertical: 'Finance',
    objection: 'Maintenance windows risk outages',
    beats: [
      { heading: 'State Model', content: 'SysDB separates control and data plane; processes restart hitlessly.' },
      { heading: 'ISSU Flow', content: 'Stage, pre-check (agents, storage), hitless upgrade, rollback plan; telemetry guardrails.' },
      { heading: 'Proof', content: 'Reference customer stats: upgrade durations, packet loss metrics, rollback frequency.' },
      { heading: 'Outcome', content: 'Shorter windows, fewer SE shifts, better SLA adherence.' }
    ]
  },
  {
    id: 'wireless-rca',
    title: 'Wireless: RCA Narrative',
    audience: 'IT / Infra',
    vertical: 'Campus',
    objection: 'Perception that Wi-Fi issues are opaque',
    beats: [
      { heading: 'Problem', content: 'Users report intermittent drops; legacy dashboards show “all green”.' },
      { heading: 'Evidence', content: 'Client journey (Assoc/Auth/DHCP/DNS) with failure spotlight; spectrum view for noise and DFS.' },
      { heading: 'Fix', content: '3rd radio scanning, auto-RCA, prescriptive actions; integration with CV Wi-Fi.' },
      { heading: 'Outcome', content: 'Reduced tickets; measurable MTTR improvement; trust in IT restored.' }
    ]
  },
  {
    id: 'vertical-life-sciences',
    title: 'Life Sciences: GxP & Auditability',
    audience: 'Executive / Ops',
    vertical: 'Life Sciences',
    objection: 'Regulatory audit readiness',
    beats: [
      { heading: 'Risk', content: 'FDA 21 CFR Part 11 requires audit trails; unstructured ops create exposure.' },
      { heading: 'Architecture', content: 'Streaming state (SysDB) + CloudVision snapshots for immutable audit trails.' },
      { heading: 'Controls', content: 'RBAC, eAPI logging, tech-support bundles as evidence; versioned change control.' },
      { heading: 'Outcome', content: 'Reduced audit findings; faster validation cycles; lower compliance overhead.' }
    ]
  },
  {
    id: 'brownfield-refresh',
    title: 'Brownfield Refresh: Modernize Without Rip-and-Replace',
    audience: 'Operations / Architecture',
    vertical: 'Enterprise / Data Center',
    objection: 'Too risky to replace running infrastructure',
    beats: [
      { heading: 'Context', content: 'Legacy STP/VLAN or vPC fabrics create operational debt: STP convergence risk, VLAN scale ceilings, and blocked redundant links wasting bandwidth. The risk of staying is accumulating — not just the risk of migrating.' },
      { heading: 'Migration Model', content: 'Parallel build, phase-by-phase VLAN migration, host-before-gateway sequencing. Each phase is independently reversible. CloudVision Change Control takes snapshots before each step and enables automated rollback if KPIs regress.' },
      { heading: 'Proof Pattern', content: 'Start with a non-critical VLAN to prove the process. Demonstrate EVPN RT-2 route stability, VARP ARP response time, and CloudVision baseline capture before committing production VLANs. Let the customer validate at each phase gate.' },
      { heading: 'Outcome', content: 'Loop-free fabric, 2x effective uplink bandwidth (ECMP vs STP blocking), EVPN multi-tenancy, and a CloudVision compliance baseline — without a single maintenance-window outage across the production migration.' }
    ]
  },
  {
    id: 'ethernet-vs-infiniband',
    title: 'Ethernet AI Fabric vs. InfiniBand',
    audience: 'Technical / Executive',
    vertical: 'AI / HPC',
    objection: 'InfiniBand is proven for AI — why change?',
    beats: [
      { heading: 'Frame the Comparison Correctly', content: 'InfiniBand was designed for HPC isolation; Ethernet was designed for scale and interoperability. The question is not which transport has lower paper latency — it is which ecosystem can build, operate, validate, and evolve AI fabrics at the speed and scale modern AI demands.' },
      { heading: 'Ethernet Ecosystem Advantage', content: 'Multi-vendor NICs, switches, and optics. Operations teams already know Ethernet tooling. CloudVision observability works across the same platform as the rest of the DC. RoCEv2 with ECN + DLB narrows the latency gap substantially for real-world collective communication patterns.' },
      { heading: 'Proof Design', content: 'Run a POC that proves congestion behavior, not just reachability. Show DLB path balancing under AllReduce load. Show LANZ queue telemetry during a synthetic congestion event. Show job completion time (JCT) improvement with properly tuned ECN and DLB versus baseline ECMP.' },
      { heading: 'Outcome', content: 'Operational continuity, vendor flexibility, and proven collective communication performance under realistic AI traffic. The fabric extends the same management plane, same tooling, and same talent already running the rest of the data center.' }
    ]
  },
  {
    id: 'nvmeof-storage-fabric',
    title: 'NVMe-oF Storage Fabric Design',
    audience: 'Technical / Architecture',
    vertical: 'AI / Storage',
    objection: 'Fibre Channel is the standard for enterprise storage',
    beats: [
      { heading: 'Context', content: 'NVMe-oF over RoCEv2 delivers NVMe storage performance across an Ethernet fabric — eliminating Fibre Channel infrastructure while matching or exceeding FC latency characteristics. For AI clusters, this enables high-throughput dataset ingest and checkpoint operations on the same Ethernet platform.' },
      { heading: 'Fabric Design Principles', content: 'Storage fabric must be lossless: ECN + PFC on the storage priority class. Separate the storage fabric (frontend) from the AI training fabric (backend) — either physically or via VRF separation and dedicated QoS queues. Checkpoint bursts are episodic but intense; design buffer depth for the burst, not the average.' },
      { heading: 'Arista Advantage', content: 'Arista platforms support NVMe-oF RoCEv2 with per-queue PFC containment, ECN marking, and LANZ queue telemetry on the same platform as the AI training fabric. AVD can generate both storage and compute fabric configs from a single inventory. CloudVision monitors both fabrics in one pane.' },
      { heading: 'Outcome', content: 'Sub-100μs storage latency at scale. Eliminated Fibre Channel infrastructure and HBA costs. Unified management plane for storage and compute networking. Checkpoint burst absorption without impacting training fabric through queue isolation.' }
    ]
  },
  {
    id: 'arista-vs-cisco',
    title: 'Competitive: Arista vs. Cisco',
    audience: 'Technical / Executive',
    vertical: 'Enterprise / Data Center',
    objection: 'We have Cisco everywhere — switching creates risk',
    beats: [
      { heading: 'The Risk Reframe', content: 'The question is not "risk of switching" — it is "cost of staying." Legacy Cisco Catalyst/Nexus platforms carry STP complexity, vPC operational overhead, and upgrade windows that require outages. The accumulated technical debt has a cost that compounds every year.' },
      { heading: 'Architectural Advantage', content: 'Single EOS binary across all platforms — no version fragmentation across product lines. SysDB multi-agent architecture enables hitless upgrades (ISSU), process isolation for reliability, and true state streaming telemetry. CloudVision provides a time-machine for forensics, change control with auto-rollback, and fabric-wide compliance baselines.' },
      { heading: 'Migration Path', content: 'Parallel-build brownfield methodology: Arista fabric is deployed alongside Cisco, VLANs migrate one at a time with per-VLAN rollback, LACP priority migration for servers with zero downtime. The migration is as safe as any Cisco-to-Cisco upgrade, with explicit rollback steps at every phase gate.' },
      { heading: 'Outcome', content: 'Operational simplicity: one OS, one image, one management plane. CloudVision audit trails for compliance. ISSU upgrades without maintenance windows. EVPN/VXLAN overlay replacing STP/vPC operational debt. Reference customers with documented migration playbooks.' }
    ]
  }
];
