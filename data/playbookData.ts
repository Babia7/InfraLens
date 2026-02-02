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
  }
];
