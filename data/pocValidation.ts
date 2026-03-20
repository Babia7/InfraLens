// Vault source: 02 Knowledge/AI Infrastructure/Validation & Operations/AI Fabric POC Validation Workflow.md
// Vault source: 04 Synthesis/Frameworks/Field Playbooks/Proof - Ethernet AI Fabrics.md

export type POCPhaseStatus = 'pending' | 'in-progress' | 'complete' | 'skipped';

export interface POCTest {
  id: string;
  name: string;
  category: 'Control Plane' | 'QoS & Queue' | 'Load Balancing' | 'Congestion' | 'Negative Tests' | 'Recovery';
  objective: string;
  procedure: string[];
  successCriteria: string[];
  evidence: string[];
  eosCLI?: string[];
}

export interface POCPhase {
  id: string;
  name: string;
  sequence: number;
  objective: string;
  tests: POCTest[];
  criticalPath: boolean;
}

export const POC_PHASES: POCPhase[] = [
  {
    id: 'control-plane',
    name: 'Control Plane & Underlay Health',
    sequence: 1,
    objective: 'Prove that BGP underlay, EVPN overlay, and VXLAN data plane are fully operational before running any traffic tests.',
    criticalPath: true,
    tests: [
      {
        id: 'bgp-prefix-validation',
        name: 'BGP Prefix Advertisement Validation',
        category: 'Control Plane',
        objective: 'Verify all loopback prefixes and EVPN routes are visible across all peers.',
        procedure: [
          'On each leaf and spine: show bgp ipv4 unicast summary — all sessions must be Established',
          'Verify loopback prefixes appear in all BGP peers: show bgp ipv4 unicast | incl Loopback',
          'Verify EVPN IMET routes (RT-3) present on all VTEPs: show bgp evpn summary'
        ],
        successCriteria: [
          'All BGP sessions in Established state with zero prefix resets',
          'All loopback prefixes reachable from all leaves via BGP',
          'IMET routes visible across all leaf VTEPs'
        ],
        evidence: [
          'Screenshot: show bgp ipv4 unicast summary (all leaves and spines)',
          'Screenshot: show bgp evpn summary'
        ],
        eosCLI: [
          'show bgp ipv4 unicast summary',
          'show bgp evpn summary',
          'show vxlan vtep'
        ]
      },
      {
        id: 'qos-queue-verification',
        name: 'QoS Policy & Queue Verification',
        category: 'QoS & Queue',
        objective: 'Verify traffic classification, DSCP mapping, and queue assignments are correct before any traffic testing.',
        procedure: [
          'On each leaf: show qos interface <port> — verify DSCP-to-queue mappings',
          'Verify RoCE traffic class (DSCP 26 or per-design) maps to lossless queue',
          'Verify PFC enabled on lossless queue only: show interfaces Ethernet<n> pfc',
          'Verify PFC watchdog enabled: show pfc watchdog status'
        ],
        successCriteria: [
          'RoCE/RDMA DSCP maps to correct lossless queue on all leaf ports',
          'PFC enabled only on lossless queue — management in separate queue with no PFC',
          'PFC watchdog active and showing no deadlock'
        ],
        evidence: [
          'Screenshot: show qos interface (per-leaf)',
          'Screenshot: show interfaces pfc statistics'
        ],
        eosCLI: [
          'show qos interface Ethernet<n>',
          'show interfaces Ethernet<n> pfc statistics',
          'show pfc watchdog status'
        ]
      }
    ]
  },
  {
    id: 'steady-state',
    name: 'Steady-State Traffic Verification',
    sequence: 2,
    objective: 'Establish a clean traffic baseline before testing congestion or load balancing behavior.',
    criticalPath: true,
    tests: [
      {
        id: 'steady-state-traffic',
        name: 'Steady-State Traffic Baseline',
        category: 'Control Plane',
        objective: 'Verify end-to-end traffic flows correctly across the fabric with no drops at baseline load.',
        procedure: [
          'Generate steady-state synthetic traffic at 50% line rate across all leaf-to-leaf paths',
          'Monitor interface counters for 10 minutes: show interfaces counters rates',
          'Verify zero drops across all fabric links during steady-state period'
        ],
        successCriteria: [
          'Zero packet drops across all fabric links at 50% steady-state load',
          'ECMP distributes traffic across all spine uplinks within ±10% variance',
          'No BGP session resets or EVPN route flaps during steady-state'
        ],
        evidence: [
          'CloudVision screenshot: fabric-wide utilization dashboard during steady-state period',
          'show interfaces counters rates (per-leaf, before congestion tests)'
        ],
        eosCLI: [
          'show interfaces counters rates',
          'show interfaces counters errors'
        ]
      },
      {
        id: 'cv-lanz-onboarding',
        name: 'CloudVision & LANZ Validation',
        category: 'QoS & Queue',
        objective: 'Verify CloudVision is collecting telemetry from all devices and LANZ is capturing queue events.',
        procedure: [
          'Verify all POC devices are onboarded to CloudVision',
          'Enable LANZ on all leaf switches: queue-monitor length <ms>',
          'Generate a brief traffic burst; verify LANZ captures the queue event',
          'Confirm CloudVision shows real-time queue depth for LANZ-enabled ports'
        ],
        successCriteria: [
          'All POC devices visible in CloudVision inventory',
          'LANZ events visible in CloudVision telemetry during burst test',
          'Queue depth timeline shows sub-millisecond resolution'
        ],
        evidence: [
          'CloudVision screenshot: device inventory showing all POC devices',
          'CloudVision screenshot: LANZ queue depth during burst'
        ],
        eosCLI: [
          'show queue-monitor length',
          'show queue-monitor length detail'
        ]
      }
    ]
  },
  {
    id: 'load-balancing',
    name: 'Load Balancing Validation',
    sequence: 3,
    objective: 'Prove load balancing behavior across ECMP baseline, DLB, and CLB — showing that Arista adaptive routing improves path distribution under realistic AI traffic.',
    criticalPath: true,
    tests: [
      {
        id: 'ecmp-baseline',
        name: 'Hash-Based ECMP Baseline',
        category: 'Load Balancing',
        objective: 'Establish ECMP baseline performance with synchronized elephant flows.',
        procedure: [
          'Generate synchronized elephant flows (multiple large iperf or NCCL streams)',
          'Record per-spine uplink utilization: show interfaces counters rates (per-leaf)',
          'Identify uneven distribution caused by ECMP hash collisions',
          'Record job completion time (JCT) or throughput as baseline'
        ],
        successCriteria: [
          'ECMP baseline documented — uneven distribution expected due to hash polarization',
          'JCT baseline recorded for comparison with DLB test'
        ],
        evidence: [
          'show interfaces counters rates (per-leaf, all uplinks) during ECMP test',
          'JCT or throughput metric for baseline'
        ],
        eosCLI: [
          'show interfaces counters rates',
          'show bgp paths ecmp-path-count'
        ]
      },
      {
        id: 'dlb-validation',
        name: 'DLB Validation',
        category: 'Load Balancing',
        objective: 'Enable DLB on leaf (Strata ASICs) and demonstrate improved path distribution versus ECMP baseline.',
        procedure: [
          'Enable DLB on leaf switches: hardware profile port dlb mode <profile>',
          'Run the same synchronized elephant flow profile as ECMP baseline',
          'Record per-spine uplink utilization — compare distribution to ECMP baseline',
          'Record JCT improvement versus ECMP baseline'
        ],
        successCriteria: [
          'DLB shows more even spine uplink utilization than ECMP baseline (target: within ±5% vs ±30%+)',
          'JCT improves versus ECMP baseline under synchronized load',
          'No traffic drops or LANZ events during DLB test'
        ],
        evidence: [
          'show interfaces counters rates (DLB enabled) — compare to ECMP baseline',
          'JCT metric with DLB enabled versus baseline'
        ],
        eosCLI: [
          'show hardware profile port dlb',
          'show interfaces counters rates'
        ]
      },
      {
        id: 'clb-validation',
        name: 'CLB Validation (Spine)',
        category: 'Load Balancing',
        objective: 'Validate Cognitive Load Balancing on spine switches for cross-spine path adaptation.',
        procedure: [
          'Verify CVP multi-agent routing is configured on spine: show bgp path-selection',
          'Generate spine-crossing elephant flows',
          'Observe CLB path selection adapting to congestion on individual spine links',
          'Record cross-spine utilization distribution'
        ],
        successCriteria: [
          'CLB spine path selection adapts to congested paths',
          'Cross-spine utilization more even than static ECMP baseline',
          'No packet loss during path adaptation events'
        ],
        evidence: [
          'show interfaces counters rates (spine) during CLB test',
          'CloudVision: path selection events during test window'
        ],
        eosCLI: [
          'show bgp path-selection',
          'show interfaces counters rates'
        ]
      }
    ]
  },
  {
    id: 'congestion',
    name: 'Congestion Scenario Testing',
    sequence: 4,
    objective: 'Demonstrate that the fabric handles congestion predictably — with ECN marking, PFC containment, and LANZ visibility — without cascading failure.',
    criticalPath: true,
    tests: [
      {
        id: 'local-leaf-congestion',
        name: 'Local Leaf Congestion',
        category: 'Congestion',
        objective: 'Create a controlled congestion event on a leaf port and verify ECN marks packets, LANZ captures the queue event, and congestion is contained.',
        procedure: [
          'Generate incast traffic toward a single leaf port (many senders → one receiver)',
          'Verify ECN marks appear on packets before queue overflow: show queue-monitor length detail',
          'Verify PFC PAUSE frames only on the congested queue class',
          'Verify congestion does not spread to non-congested ports'
        ],
        successCriteria: [
          'ECN marks visible on congested queue before any packet drop',
          'LANZ records queue depth event with microsecond timestamp',
          'PFC contained to congested queue only — no other queues affected',
          'Zero packet drops if ECN + rate adaptation working correctly'
        ],
        evidence: [
          'LANZ queue depth timeline during incast event',
          'show interfaces counters pfc — congested queue only',
          'Packet capture showing ECN CE bits set'
        ],
        eosCLI: [
          'show queue-monitor length detail',
          'show interfaces Ethernet<n> counters pfc',
          'show interfaces counters errors'
        ]
      },
      {
        id: 'spine-congestion',
        name: 'Spine-to-Leaf Congestion',
        category: 'Congestion',
        objective: 'Create congestion on spine uplinks and verify DLB redirects flows and congestion does not collapse the fabric.',
        procedure: [
          'Saturate one spine uplink by concentrating elephant flows through it',
          'Verify DLB adapts within seconds — observe traffic shifting to alternate spines',
          'Record LANZ events on congested spine port',
          'Verify no cascading PFC propagation to other queues or ports'
        ],
        successCriteria: [
          'DLB shifts flows away from congested spine within adaptation window',
          'LANZ records queue depth on spine port',
          'No PFC propagation beyond congested spine port',
          'Job throughput recovers within seconds of DLB adaptation'
        ],
        evidence: [
          'show interfaces counters rates (before and after DLB adaptation)',
          'LANZ: spine queue depth timeline',
          'CloudVision: path selection change events'
        ],
        eosCLI: [
          'show interfaces counters rates',
          'show queue-monitor length detail'
        ]
      }
    ]
  },
  {
    id: 'negative-tests',
    name: 'Negative Tests',
    sequence: 5,
    objective: 'Verify that fabric safeguards work correctly: PFC flood protection, packet trimming, and watchdog behaviors operate as designed.',
    criticalPath: false,
    tests: [
      {
        id: 'pfc-flood-negative',
        name: 'PFC Flood Negative Test',
        category: 'Negative Tests',
        objective: 'Verify PFC watchdog engages if PFC PAUSE frames flood — preventing a deadlock from blocking non-PFC traffic.',
        procedure: [
          'Simulate a PFC PAUSE storm on a lossless queue (sustained PAUSE frames)',
          'Verify PFC watchdog triggers within configured interval',
          'Verify watchdog action (drop or errdisable) engages on the affected queue only',
          'Verify management traffic (SSH, CloudVision) is unaffected'
        ],
        successCriteria: [
          'PFC watchdog engages within configured interval (e.g., 100ms)',
          'Watchdog action prevents deadlock propagation',
          'Management traffic continues uninterrupted during PFC flood test',
          'show pfc watchdog status shows triggered event'
        ],
        evidence: [
          'show pfc watchdog status during and after test',
          'show interfaces counters pfc — watchdog action visible'
        ],
        eosCLI: [
          'show pfc watchdog status',
          'show interfaces Ethernet<n> counters pfc'
        ]
      }
    ]
  },
  {
    id: 'recovery',
    name: 'Failure & Recovery Testing',
    sequence: 6,
    objective: 'Prove that the fabric recovers gracefully from link failures, leaf reloads, and spine reloads — with documented impact and recovery time.',
    criticalPath: true,
    tests: [
      {
        id: 'link-flap-recovery',
        name: 'Link Flap Recovery',
        category: 'Recovery',
        objective: 'Verify BGP reconverges cleanly after a link flap and ECMP recovers within design parameters.',
        procedure: [
          'Shut a leaf-spine uplink during active traffic: interface Ethernet<n> → shutdown',
          'Record time to BGP convergence: show bgp ipv4 unicast summary',
          'Verify traffic redistributes via remaining ECMP paths',
          'Re-enable the link: no shutdown — verify BGP re-establishes and ECMP restores'
        ],
        successCriteria: [
          'BGP convergence within BFD + hold timer design (target: < 1 second with BFD)',
          'Traffic successfully rerouted to remaining ECMP paths',
          'Zero packet drops after convergence window (brief loss during reconvergence is expected)',
          'Link recovery restores full ECMP within one BGP reconvergence cycle'
        ],
        evidence: [
          'BGP convergence timestamp: show bgp ipv4 unicast summary before/after',
          'CloudVision event timeline showing link down and BGP withdrawal'
        ],
        eosCLI: [
          'show bgp ipv4 unicast summary',
          'show interfaces counters rates',
          'show bfd peers'
        ]
      },
      {
        id: 'leaf-reload-recovery',
        name: 'Leaf Reload Recovery',
        category: 'Recovery',
        objective: 'Verify that a leaf reload does not cause extended traffic disruption and MLAG continuity is maintained for dual-homed servers.',
        procedure: [
          'Reload one leaf in an MLAG pair: reload fast',
          'Verify MLAG peer takes over server traffic immediately',
          'Record time to leaf reload completion and BGP re-establishment',
          'Verify EVPN MAC/IP routes re-advertised correctly after reload'
        ],
        successCriteria: [
          'MLAG peer maintains server connectivity during peer reload (sub-second impact)',
          'Leaf BGP sessions re-establish within EOS reload time (target: < 90 seconds)',
          'EVPN MAC/IP routes fully restored after reload',
          'No stale VTEP entries or black-holes post-reload'
        ],
        evidence: [
          'show mlag during reload — peer-link takes over',
          'BGP reconvergence time (show bgp ipv4 unicast summary)',
          'CloudVision: VTEP state timeline during reload'
        ],
        eosCLI: [
          'show mlag',
          'show bgp evpn summary',
          'show vxlan vtep'
        ]
      },
      {
        id: 'spine-reload-recovery',
        name: 'Spine Reload Recovery',
        category: 'Recovery',
        objective: 'Verify that a spine reload redistributes traffic to remaining spines and reconverges within design parameters.',
        procedure: [
          'Reload one spine during active fabric traffic: reload fast',
          'Verify remaining spines absorb traffic via ECMP',
          'Record time to spine BGP re-establishment and full ECMP restore',
          'Monitor for BGP Graceful Restart peer maintenance during reload'
        ],
        successCriteria: [
          'Traffic redistributes to remaining spines within BFD convergence window',
          'Spine BGP sessions re-establish with all leaves within reload time',
          'No persistent black-holes or asymmetric paths after reload',
          'ECMP fully restored — show bgp ipv4 unicast confirms full path table'
        ],
        evidence: [
          'show bgp ipv4 unicast summary (spine recovered)',
          'CloudVision: path distribution before/during/after spine reload'
        ],
        eosCLI: [
          'show bgp ipv4 unicast summary',
          'show interfaces counters rates',
          'show bgp graceful-restart'
        ]
      }
    ]
  }
];

export const POC_BRIEF_TEMPLATE = `# AI Fabric POC Brief

## Scope
- POC environment: [describe topology — leaves, spines, GPU node count]
- Traffic generator: [iperf3, NCCL tests, or synthetic traffic tool]
- CloudVision: [onboarded / in-scope for this POC]
- LANZ: [enabled on all leaves / specific ports]

## Proof Objectives
1. Control plane health validation (BGP, EVPN, VXLAN)
2. QoS and queue policy verification (DSCP mapping, PFC, ECN)
3. Load balancing proof (ECMP baseline → DLB improvement → CLB)
4. Congestion behavior (ECN marking, LANZ telemetry, PFC containment)
5. Failure recovery (link flap, leaf reload, spine reload)

## Acceptance Criteria
- [ ] All BGP sessions Established with zero prefix resets
- [ ] DLB shows ≥ 20% improvement in spine link utilization evenness vs ECMP baseline
- [ ] ECN marks visible before any PFC PAUSE during incast test
- [ ] LANZ captures queue events with sub-millisecond resolution
- [ ] Leaf reload < 90 seconds with MLAG continuity maintained
- [ ] Zero persistent black-holes after any recovery scenario

## Validation Sequence
Phase 1 → Phase 2 → Phase 3 (load balancing) → Phase 4 (congestion) → Phase 5 (negative) → Phase 6 (recovery)
Do not advance past Phase 2 until control plane health is confirmed.

## Evidence Deliverables
- Screenshot package: CloudVision topology, LANZ queue telemetry, BGP summary, PFC counters
- JCT comparison: ECMP baseline vs DLB enabled
- Recovery time log: link flap, leaf reload, spine reload timestamps
- POC summary: which tests passed, which changed customer confidence materially
`;
