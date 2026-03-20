// Vault source: 04 Synthesis/Frameworks/Field Playbooks/Discovery - AI Networking.md
// Vault source: 04 Synthesis/Frameworks/Field Playbooks/Positioning - Ethernet AI Value.md

export interface DiscoveryAnswer {
  id: string;
  label: string;
  implication: string;
}

export interface DiscoveryQuestion {
  id: string;
  layer: string;
  layerDescription: string;
  question: string;
  answers: DiscoveryAnswer[];
}

export interface DiscoveryOutput {
  topologyTier: string;
  positioningAngle: string;
  proofSequence: string[];
  objectionAnticipation: string[];
  nextAction: string;
}

export const DISCOVERY_QUESTIONS: DiscoveryQuestion[] = [
  {
    id: 'workload',
    layer: 'Layer 1',
    layerDescription: 'Workload Type & Scale Target',
    question: 'What AI workloads are you running — and how large do you expect them to get?',
    answers: [
      {
        id: 'training-small',
        label: 'Training — up to 1,024 GPUs',
        implication: '2-tier Clos, single or dual-plane, fixed switches. DLB adds value but may not be critical yet. Standard All-Reduce and data-parallel patterns.'
      },
      {
        id: 'training-large',
        label: 'Training — 1,024+ GPUs or MoE workloads',
        implication: 'Multi-plane 2-tier Clos with DLB mandatory. CLB on spine. Near 1:1 oversubscription. All-to-All entropy requires adaptive routing.'
      },
      {
        id: 'inference',
        label: 'Inference at Scale',
        implication: 'Latency sensitivity drives hop-count minimization. Tensor parallelism common. Different buffer and congestion profile versus training. Locality over bandwidth.'
      },
      {
        id: 'mixed',
        label: 'Mixed training and inference on shared infrastructure',
        implication: 'Traffic isolation is critical — training and inference QoS classes must be separated. Risk of inference latency degradation during training collective bursts.'
      }
    ]
  },
  {
    id: 'scale-boundary',
    layer: 'Layer 2',
    layerDescription: 'Scale-Up vs Scale-Out Boundary',
    question: 'Are your GPUs primarily communicating within a single node (NVLink), within a pod, or across racks and halls?',
    answers: [
      {
        id: 'intra-node',
        label: 'Mostly intra-node (NVLink dominant)',
        implication: 'Ethernet fabric handles inter-node and storage. Lower traffic density on the fabric. Focus on storage fabric design and checkpoint paths.'
      },
      {
        id: 'intra-pod',
        label: 'Intra-pod (rack-to-rack within a cluster)',
        implication: '2-tier Clos per pod. Rail alignment within pod. DLB for All-Reduce. Standard port math for fixed-radix design.'
      },
      {
        id: 'cross-pod',
        label: 'Cross-pod (multiple halls or domains)',
        implication: '3-tier Clos or super-spine consideration. Inter-hall fiber allocation required. Failure domain boundaries must be designed across hall boundaries.'
      },
      {
        id: 'unknown',
        label: 'Still being defined / uncertain',
        implication: 'Design for pod-based growth with defined expansion interfaces. Reserve uplink ports. Port math must be revisited when scale target is confirmed.'
      }
    ]
  },
  {
    id: 'transport',
    layer: 'Layer 3',
    layerDescription: 'Transport & Congestion Assumptions',
    question: 'What is the current assumption for transport — and how mature is your congestion management plan?',
    answers: [
      {
        id: 'roce-configured',
        label: 'RoCEv2 with ECN + PFC already planned',
        implication: 'Validate ECN thresholds match workload patterns. PFC queue class assignment and watchdog design are critical. DLB and LANZ telemetry should be in scope.'
      },
      {
        id: 'roce-unconfigured',
        label: 'RoCEv2 intended but congestion management not yet designed',
        implication: 'Congestion design is a critical gap. ECN thresholds, PFC queue isolation, and DLB must be addressed before fabric goes live. POC should validate congestion behavior explicitly.'
      },
      {
        id: 'infiniband-replacing',
        label: 'Currently InfiniBand — evaluating Ethernet',
        implication: 'Ethernet AI value position required. Proof plan must demonstrate congestion management, DLB path balancing, and LANZ telemetry as operational equivalents. JCT comparison is the key proof metric.'
      },
      {
        id: 'ethernet-naive',
        label: 'Generic Ethernet — no RoCE planning',
        implication: 'Significant education gap. Customer may not know their application uses RDMA. Congestion behavior under collective workloads will surprise them. Position POC as discovery, not proof.'
      }
    ]
  },
  {
    id: 'operational-maturity',
    layer: 'Layer 4',
    layerDescription: 'Operational & Telemetry Maturity',
    question: 'How do you currently monitor and operate your network infrastructure?',
    answers: [
      {
        id: 'cv-ready',
        label: 'CloudVision or similar state-streaming platform already in use',
        implication: 'LANZ integration and queue telemetry are immediately relevant. Position CloudVision AI fabric observability as extension of existing motion. Validation evidence is in the existing platform.'
      },
      {
        id: 'snmp-polling',
        label: 'SNMP polling / traditional NMS',
        implication: 'Major observability gap for AI fabrics. SNMP misses sub-millisecond queue events that determine AI job performance. CloudVision state-streaming is a prerequisite, not an option.'
      },
      {
        id: 'minimal-monitoring',
        label: 'Minimal monitoring — mostly reactive',
        implication: 'Operational maturity is a prerequisite for AI fabric success. Fabric health, queue telemetry, and validation evidence cannot be reactive. CloudVision onboarding should be Phase 1 of any deployment.'
      },
      {
        id: 'custom-tooling',
        label: 'Custom telemetry / observability pipeline (Prometheus, Grafana, etc.)',
        implication: 'gNMI/OpenConfig streaming from EOS integrates natively. CloudVision can feed the existing pipeline. LANZ queue telemetry is the key AI-specific addition.'
      }
    ]
  },
  {
    id: 'proof-model',
    layer: 'Layer 5',
    layerDescription: 'Proof Requirements',
    question: 'What would convince your team that this fabric is ready for production AI workloads?',
    answers: [
      {
        id: 'jct-proof',
        label: 'Job completion time (JCT) improvement versus baseline',
        implication: 'POC must run actual synthetic collective workload (e.g., NCCL tests) and compare JCT with ECN + DLB versus ECMP-only baseline. JCT improvement under load is the proof deliverable.'
      },
      {
        id: 'congestion-proof',
        label: 'Congestion behavior under synthetic load',
        implication: 'POC must demonstrate ECN marking, PFC containment, and DLB path adaptation under controlled congestion. LANZ queue telemetry is the evidence medium.'
      },
      {
        id: 'recovery-proof',
        label: 'Failure and recovery behavior',
        implication: 'POC must include link flap and leaf reload recovery tests. Show MLAG continuity, BGP Graceful Restart, and EVPN reconvergence time under controlled failure conditions.'
      },
      {
        id: 'operational-proof',
        label: 'Operational visibility and change control',
        implication: 'CloudVision demo with real fabric: show time-machine forensics, LANZ queue telemetry during congestion, and Change Control with auto-rollback. Operations team confidence is the proof target.'
      }
    ]
  }
];

export const POSITIONING_ANGLES: Record<string, string> = {
  scale: 'Position on ecosystem scale and operational continuity: Arista Ethernet grows with the DC, reuses existing operations talent, and provides CloudVision observability across AI and non-AI fabrics from one platform.',
  operability: 'Position on observability and validation: LANZ sub-microsecond queue telemetry, CloudVision time-machine forensics, and DLB path balancing are operationally provable claims — not marketing assertions.',
  ecosystem: 'Position on multi-vendor flexibility: RoCEv2, NVIDIA NICs, Arista switches, standard optics, and CloudVision as management plane. No proprietary fabric tax or NIC-to-switch lock-in.',
  proof: 'Position on repeatable proof: Arista has a structured POC workflow — underlay health, QoS validation, congestion testing, DLB proof, failure recovery — that turns customer skepticism into signed evidence.'
};
