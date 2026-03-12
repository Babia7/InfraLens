import { ProtocolDetail } from './types';

export const NVME_OF_PROTOCOL: ProtocolDetail = {
    id: 'nvmeof',
    name: 'NVMe-oF',
    legacyTerm: 'Fibre Channel / iSCSI',
    tagline: 'Lossless, low-latency storage fabrics over Ethernet.',
    description:
      'NVMe over Fabrics extends NVMe semantics across the network with microsecond latency. Deployments typically choose NVMe/RoCE v2 for ultra-low latency or NVMe/TCP for simpler operations on standard Ethernet. Success depends on consistent MTU, clear QoS/traffic-class policy, and observable queue behavior.',
    keyBenefits: [
      'NVMe semantics over IP: low latency with end-to-end visibility.',
      'Routable RDMA (RoCE v2) across leaf-spine without FC islands.',
      'Lossless class isolation with PFC + ECN to minimize storage drops.',
      'Deterministic bandwidth allocation via QoS/traffic classes.',
      'Clear evidence: monitor pause storms, ECN marks, and queue depth.'
    ],
    bestPractices: [
      'Validate MTU is 9214 bytes end-to-end across every hop in the storage fabric before enabling RoCE v2 — any undersized MTU causes RDMA message fragmentation and produces latency spikes that are misdiagnosed as storage array problems.',
      'Never configure PFC without ECN on the same traffic class — PFC alone creates head-of-line blocking; ECN provides early congestion signaling that prevents pause propagation and pause storms.',
      'Isolate storage traffic to a single dedicated QoS traffic class (TC3 is the established RoCE v2 convention) and keep it strictly separate from all other traffic classes.',
      'Monitor `show interfaces Ethernet1 priority-flow-control` at steady state — any persistent pause frames indicate a congestion or misconfiguration event, not normal operating behaviour for a healthy lossless fabric.',
      'Mark RoCE v2 frames DSCP 26 (AF31) end-to-end from the host HBA through every fabric switch — inconsistent DSCP marking causes traffic to fall into the wrong traffic class and lose lossless treatment mid-path.',
      'Use `show queue-monitor length detail` as the primary fabric health check during and after every change — sustained queue depth on a storage class is the leading indicator of impending pause events or latency degradation.',
      'Choose NVMe/TCP for environments where full-fabric lossless discipline (consistent MTU, PFC, ECN across all hops) cannot be guaranteed — NVMe/TCP tolerates loss gracefully whereas RoCE v2 does not.'
    ],
    cliTranslation: [
      {
        legacy: `! FC/iSCSI: verify link and MTU on HBA/initiator
show interface fc1/1 brief
netstat -s | grep -i mtu`,
        arista: `show interfaces Ethernet1 | include MTU
show interfaces Ethernet1 counters | include drop|pause
show qos interfaces Ethernet1`
      },
      {
        legacy: `! FC: check buffer credits and congestion
show interface fc1/1 counters | grep -i credit
! iSCSI: check TCP retransmits on initiator
netstat -s | grep -i retransmit`,
        arista: `show queue-monitor length detail
show interfaces Ethernet1 priority-flow-control
show logging | include PFC`
      },
      {
        legacy: `! FC: check SFP/optic health on switch
show interface fc1/1 transceiver
! iSCSI: check session count and errors
iscsiadm -m session -P 1`,
        arista: `show interfaces status
show interfaces Ethernet1 transceiver details
show interfaces Ethernet1 priority-flow-control`
      }
    ],
    masteryPath: [
      {
        level: 'Foundation',
        heading: 'Transport Selection',
        body: 'NVMe/RoCE v2 favors microsecond latency with RDMA and lossless priorities. NVMe/TCP favors simpler ops on standard Ethernet at modestly higher latency.',
        keyConcept: 'RoCE v2 vs NVMe/TCP'
      },
      {
        level: 'Logic',
        heading: 'Lossless Behavior',
        body: 'RoCE v2 requires clean QoS classes with PFC and ECN to prevent drops while avoiding pause storms. Track queue depth and ECN marking rates.',
        keyConcept: 'PFC + ECN discipline'
      },
      {
        level: 'Architecture',
        heading: 'Fabric Guardrails',
        body: 'Standardize MTU end-to-end, isolate storage traffic class, and validate transceiver health to keep latency and loss predictable.',
        keyConcept: 'MTU + QoS + optics'
      },
      {
        level: 'Architecture',
        heading: 'Pause Storm Prevention',
        body: 'PFC PAUSE storms occur when a PAUSE frame propagates upstream through multiple switches, eventually halting traffic across the entire fabric. Prevent with: (1) Watchdog timers (priority-flow-control watchdog on supported platforms), (2) Isolating storage traffic class from other traffic on shared links, (3) Monitoring pause-frame counters at steady state — any persistent pause is a warning sign. On Arista 7050X4/7280R3, ECN threshold should be set below PFC threshold to trigger rate reduction before PAUSE is needed.',
        keyConcept: 'PFC Watchdog · ECN before PFC'
      },
      {
        level: 'Architecture',
        heading: 'RoCE v2 at Scale',
        body: 'At scale (100+ hosts), RoCE v2 fabrics require: (1) DSCP 26 (AF31) marking consistently from the HBA BIOS/driver through every hop — a single hop remarking to DSCP 0 drops the frame into best-effort, causing retransmits. (2) Separate storage VLAN/VRF from compute traffic to limit blast radius. (3) LANZ telemetry on every storage-facing switch port to capture microsecond-level queue events that correlate with I/O latency spikes. (4) NVMe discovery via Fibre Channel over Ethernet (FCoE) nameserver or DNS-SD — do not rely on broadcast discovery in large fabrics.',
        keyConcept: 'DSCP consistency · LANZ telemetry · VLAN isolation'
      }
    ],
    roleConfigs: [
      {
        role: 'Baseline Guardrails (Runbook)',
        description: 'Minimum checks before turn-up or change windows.',
        config: `1) Verify MTU end-to-end on storage links.
2) Confirm QoS/traffic class mapping for storage queues.
3) Validate PFC + ECN are enabled only on storage class.
4) Check queue depth trends during steady-state.
5) Capture a clean baseline: no pause storms, no drops.`
      },
      {
        role: 'RoCE v2 QoS + PFC (Config)',
        description: '7050X4 (EOS 4.34.4M) oriented example lossless class configuration for NVMe/RDMA on Ethernet (verify per platform).',
        config: `! 7050X4 + EOS 4.34.4M oriented example (illustrative; validate per platform)
qos map dscp 26 to traffic-class 3
qos map cos 5 to traffic-class 3
!
priority-flow-control
   priority 3 no-drop
!
interface Ethernet1
   mtu 9214
   priority-flow-control on
   service-policy type qos input STORAGE-QOS
!
class-map type qos match-any STORAGE
   match traffic-class 3
!
policy-map type qos STORAGE-QOS
   class STORAGE
      set traffic-class 3`
      },
      {
        role: 'Operational Commands',
        description: 'Quick checks for MTU, QoS, PFC/ECN, and queue depth.',
        config: `show interfaces Ethernet1 | include MTU
show interfaces Ethernet1 counters | include drop|pause
show qos interfaces Ethernet1 output
show hardware counter feature qos ecn
show queue-monitor length detail`
      },
      {
        role: 'Symptom Triage',
        description: 'Fast checks when storage latency or timeouts spike.',
        config: `1) Pause storms: show interfaces Ethernet1 counters | include pause
2) ECN marking: show qos interfaces Ethernet1 output | include ECN
3) Queue depth: show queue-monitor length detail
4) Optics health: show interfaces Ethernet1 transceiver details
5) Link errors: show interfaces Ethernet1 counters | include err|crc`
      },
      {
        role: 'NVMe/TCP Config',
        description: 'NVMe/TCP on standard Ethernet — no lossless required, simpler to deploy.',
        config: `! NVMe/TCP — standard Ethernet, no PFC/ECN required
! MTU still recommended at 9000+ for performance
interface Ethernet1
   mtu 9214
   no priority-flow-control
!
! DSCP marking for TCP storage (AF21 recommended)
qos map dscp 18 to traffic-class 2
!
! Verify TCP connections from Linux host:
! nvme list
! nvme discover -t tcp -a <target-ip> -s 4420
! nvme connect -t tcp -a <target-ip> -s 4420 -n <nqn>
!
! Switch visibility
show interfaces Ethernet1 | include MTU
show tcp brief`
      },
      {
        role: 'LANZ Storage Monitoring',
        description: 'Use LANZ latency analytics to capture storage fabric congestion events.',
        config: `! Enable LANZ on storage-facing ports
queue-monitor length
!
interface Ethernet1
   queue-monitor length threshold 10000
!
! View real-time queue depth
show queue-monitor length
show queue-monitor length detail
!
! View congestion events
show queue-monitor length events
!
! Stream to CloudVision (gNMI path)
! /Sysdb/qosManager/latencyMonitor/intfInfo`
      }
    ],
    referenceLinks: [
      { title: 'NVMe-oF Overview', summary: 'Protocol model and transport options (TCP/RDMA) with performance tradeoffs.' },
      { title: 'RoCE v2 Primer', summary: 'Routable RDMA and why ECN/PFC tuning matters.' },
      { title: 'Lossless Ethernet Checklist', summary: 'MTU, QoS, PFC/ECN, and telemetry guardrails for storage fabrics.' }
    ],
    overview: {
      title: 'NVMe-oF Overview',
      intro:
        'NVMe-oF carries NVMe semantics beyond the local PCIe bus by encapsulating commands and data over a fabric transport. The two common transports are NVMe/RDMA (often RoCE v2 on Ethernet) and NVMe/TCP, each trading operational simplicity against latency and CPU overhead.',
      sections: [
        {
          title: 'NVMe/RDMA (RoCE v2)',
          body: 'Lowest latency and jitter when lossless behavior is enforced. Requires disciplined QoS, PFC/ECN tuning, and consistent MTU across the path to avoid pause storms and queue buildup.',
          bestFor: 'Ultra-low latency storage tiers, GPU/AI fabrics, high IOPS workloads.'
        },
        {
          title: 'NVMe/TCP',
          body: 'Operates on standard Ethernet without lossless requirements. Simpler operations and easier troubleshooting, with slightly higher latency and more CPU overhead on hosts/targets.',
          bestFor: 'General purpose storage, brownfield networks, rapid scale-out.'
        }
      ],
      conclusion:
        'Choose the transport by mapping SLA to fabric discipline: prioritize RoCE v2 when you can enforce strict lossless behavior, and NVMe/TCP when operational simplicity and rapid deployment matter most.'
    },
    primer: {
      title: 'RoCE v2 Primer',
      body:
        'RoCE v2 (Routable RDMA over Converged Ethernet) encapsulates RDMA in UDP/IP so it can traverse L3 fabrics. It delivers low latency by avoiding CPU-heavy TCP processing, but it is sensitive to loss. ECN provides early congestion signaling, while PFC prevents drops on the lossless class. Together, they keep queues stable and avoid pause storms or head-of-line blocking that can destabilize storage traffic.'
    },
    dcContext: {
      small: {
        scale: '2-tier · dedicated storage fabric · 2 spines · 4 leaves · 25G hosts',
        topologyRole: 'Purpose-built lossless fabric; PFC + ECN on all ports; separate VLAN from general traffic',
        keyConfig: 'qos profile storage\n   trust dscp\n   pfc mode on',
        highlight: 'host-edge'
      },
      medium: {
        scale: '3-tier · converged compute+storage · 8 leaves · LANZ telemetry',
        topologyRole: 'Per-VLAN PFC policy; LANZ buffer monitoring on leaves; ECN threshold tuned per profile',
        keyConfig: 'hardware counter feature traffic-class\nlanz\n   enabled',
        highlight: 'leaf-spine'
      },
      large: {
        scale: 'Multi-pod · isolated storage spine plane · 32+ leaves · RoCEv2 DCQCN',
        topologyRole: 'Dedicated storage spine plane; RoCEv2 with DCQCN congestion control; deep-buffer 7050CX spines',
        keyConfig: 'qos profile dcqcn\n   ecn minimum-threshold 150000\n   ecn maximum-threshold 1500000',
        highlight: 'isl'
      }
    }
  }
