export interface LifeSciencesPlay {
  id: string;
  persona: string;
  talkTrack: string;
  discovery: string[];
  objections: { title: string; response: string }[];
  proofPoints: string[];
  callToActions: string[];
  references?: { title: string; url?: string; summary?: string }[];
  tags?: string[];
  lastUpdated?: string;
  regulated?: boolean;
}

export const lifeSciencesPlays: LifeSciencesPlay[] = [
  {
    id: 'lifesciences-research',
    persona: 'Bio-IT / Research IT Director',
    talkTrack: 'Deterministic networks for genomics, imaging, and regulated pipelines with unified operations.',
    discovery: [
      'Which pipelines are most latency or throughput sensitive (genomics, cryo-EM, PACS)?',
      'How do you separate regulated vs research traffic today?',
      'What is your change control and audit process for GxP workloads?'
    ],
    objections: [
      { title: 'We need strict compliance and auditability', response: 'CloudVision provides change control with approval/rollback and telemetry replay for audits; segmentation via EVPN/VRF enforces regulated vs research zones.' },
      { title: 'We can’t risk outages during sequencing runs', response: 'Use maintenance windows with pre-flight checks and rollback checkpoints; deep-buffer platforms absorb bursty storage traffic without drops.' }
    ],
    proofPoints: [
      'EVPN segmentation for regulated vs research zones; Anycast GW minimizes outage domains',
      'Change control with approvals/rollback + telemetry “time machine” for audit evidence',
      'Deep buffers for genomics and imaging data bursts; MACsec where needed for data-in-transit protection'
    ],
    callToActions: [
      'Pilot a segmented VRF design for regulated vs research traffic',
      'Show change approval/rollback in CV for an audit-ready demo',
      'Run a burst test against deep-buffer platforms to prove lossless transfers'
    ],
    references: [
      { title: 'GxP Change Window Pattern', summary: 'Pre/post snapshot, approval, rollback script for regulated workloads.' },
      { title: 'EVPN Segmentation for Clinical & Research', summary: 'VRF isolation with Anycast GW and ARP suppression.' }
    ],
    tags: ['Compliance', 'Segmentation', 'Life Sciences'],
    lastUpdated: 'FY25-Q1',
    regulated: true
  },
  {
    id: 'lifesciences-clinical',
    persona: 'Clinical Ops / Compliance',
    talkTrack: 'GxP-safe change control, deterministic imaging pipelines, and compliant data-in-transit protection.',
    discovery: [
      'Which clinical modalities (PACS, microscopy, sequencing) are most sensitive to jitter or loss?',
      'How are clinical vs research vs vendor traffic segmented and audited?',
      'What evidence do auditors request for change windows and data protection?'
    ],
    objections: [
      { title: 'We can’t risk impacting clinical systems', response: 'Use maintenance windows with CVaaS pre/post snapshots, approval gates, and scripted rollback; blast radius is contained via EVPN segmentation.' },
      { title: 'Encryption overhead worries us', response: 'MACsec offload on supported optics with MTU headroom; we validate throughput and latency before production cutover.' }
    ],
    proofPoints: [
      'EVPN segmentation with Anycast Gateway; clinical VRFs isolated from research/guest',
      'Change control with approvals, snapshots, rollback; telemetry replay for audits',
      'MACsec on supported optics; deep-buffer platforms for imaging/backup bursts'
    ],
    callToActions: [
      'Demo a change window with approval + rollback on a clinical VRF',
      'Show telemetry replay and snapshot export as audit evidence',
      'Validate MACsec throughput and MTU headroom on target links'
    ],
    references: [
      { title: 'Clinical VRF Pattern', summary: 'Template for isolating imaging/clinical workloads with Anycast GW.' },
      { title: 'MACsec Validation Checklist', summary: 'Headroom, throughput, and MTU validation steps.' }
    ],
    tags: ['Compliance', 'MACsec', 'Life Sciences'],
    lastUpdated: 'FY25-Q1',
    regulated: true
  },
  {
    id: 'lifesciences-aiml',
    persona: 'AI/ML Lead (Bioinformatics)',
    talkTrack: 'AI training fabrics for omics/imaging with predictable latency, observability, and standards-first control plane.',
    discovery: [
      'Which training jobs or pipelines are bottlenecked by network jitter or congestion?',
      'How do you provision GPU pods and storage today; is there an approval path?',
      'Do you need encryption in-flight for datasets or inter-site replication?'
    ],
    objections: [
      { title: 'We already have InfiniBand', response: 'Standards-based VXLAN/EVPN with deep buffers and ECN can coexist; we provide deterministic paths plus telemetry replay for RCA.' },
      { title: 'Telemetry is too noisy', response: 'CVaaS time-machine plus targeted streaming on job VNIs; proof hooks to show ECN behavior and lossless lanes during runs.' }
    ],
    proofPoints: [
      'Non-blocking L3LS with deep buffers and ECN tuned for AI/omics workloads',
      'Telemetry replay to show per-job behavior; ERSPAN/sFlow ready',
      'API-first: AVD + CVaaS integrate with schedulers/pipelines'
    ],
    callToActions: [
      'Pilot a GPU/omics pod with ECN + deep buffers; capture telemetry replay',
      'Integrate CVaaS snapshots into a pipeline change window',
      'Show coexistence with IB or migration path using VXLAN/EVPN'
    ],
    references: [
      { title: 'AI/ML Pod Pattern', summary: 'ECN + deep buffer defaults for training pods.' },
      { title: 'Telemetry Replay for Jobs', summary: 'How to capture/replay job-specific telemetry for RCA.' }
    ],
    tags: ['AI/ML', 'Telemetry', 'Life Sciences'],
    lastUpdated: 'FY25-Q1'
  }
];

export const lifeSciencesReferences = [
  { title: 'EVPN Segmentation for Clinical & Research', summary: 'Template for regulated vs research VRFs with Anycast GW and ARP suppression.' },
  { title: 'GxP Change Window Pattern', summary: 'Pre/post snapshots, approvals, rollback script for regulated maintenance.' },
  { title: 'MACsec Validation Checklist', summary: 'Throughput, MTU, and latency validation before production enablement.' },
  { title: 'AI/ML Pod Pattern', summary: 'ECN + deep buffer defaults for AI/omics training workloads.' },
  { title: 'Telemetry Replay for Jobs', summary: 'Replay job-specific telemetry to prove stability and RCA.' }
];
