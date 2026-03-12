import { ProtocolDetail } from './types';

export const QOS_PROTOCOL: ProtocolDetail = {
    id: 'qos',
    name: 'QoS & Traffic-Policy',
    legacyTerm: 'MQC class-map / policy-map',
    tagline: 'Deterministic treatment for every traffic class — from voice to RoCE.',
    description:
      'Quality of Service on Arista EOS uses the traffic-policy model — a cleaner, more expressive alternative to Cisco\'s MQC. Traffic classes are matched by DSCP, CoS, or ACL, mapped to internal traffic classes (TC0-TC7), and scheduled by the ASIC queue hardware. Getting QoS right is foundational for AI/storage fabrics and voice/video deployments.',
    keyBenefits: [
      'EOS traffic-policy model provides a single consistent QoS syntax across Campus, DC, and AI platforms.',
      'DSCP trust on access ports ensures end-to-end marking fidelity without re-marking at every hop.',
      'Priority queueing for EF (DSCP 46) guarantees bounded latency for voice and PTP timing traffic.',
      'Strict isolation of RoCE v2 storage traffic (TC3) prevents compute traffic from triggering PFC PAUSEs.',
      'queue-monitor with LANZ provides real-time and historical visibility into which flows caused congestion.',
      'Per-port policing prevents a single traffic class from monopolizing shared buffer or uplink bandwidth.'
    ],
    bestPractices: [
      'Define a DSCP-to-TC mapping table before deployment and enforce it consistently at every switch — a single switch with a different mapping silently re-marks flows into the wrong traffic class.',
      'Always set trust DSCP at the network edge (access port facing servers/endpoints) — trust inside the network, not at the core, so you do not need to re-mark at every hop.',
      'Never share the same traffic class for PFC lossless traffic (RoCE, NVMe) and best-effort traffic — PFC PAUSE on a shared TC halts all traffic on that class, including non-storage flows.',
      'Use DSCP 46 (EF) for voice and PTP with strict-priority scheduling — any best-effort traffic in the same queue introduces jitter that cannot be recovered downstream.',
      'Validate QoS with `show qos interfaces <intf>` and `show queue-monitor length detail` under load — paper configs do not prove correct behavior; only measured queue depth does.',
      'For AI/storage fabrics, set ECN threshold at ~30% of queue depth and PFC threshold at ~80% — this ensures ECN provides rate reduction before PFC PAUSE is triggered.',
      'Always test QoS changes in a maintenance window with a traffic generator — QoS misconfiguration can cause unexpected drops or priority inversion that is only visible under load.'
    ],
    cliTranslation: [
      {
        legacy: '! Cisco MQC class-map\nclass-map match-all VOICE\n  match dscp ef',
        arista: '! EOS traffic-policy match\ntraffic-policy INGRESS-POLICY\n   match VOICE\n      dscp ef\n      actions\n         set traffic class 7'
      },
      {
        legacy: '! Cisco policy-map\npolicy-map QOS-INGRESS\n  class VOICE\n    set dscp ef\n    priority percent 20',
        arista: '! EOS traffic-policy with set traffic-class\ntraffic-policy QOS-INGRESS\n   match STORAGE dscp af31\n      actions\n         set traffic class 3'
      },
      {
        legacy: '! Cisco service-policy apply\ninterface Gig0/1\n  service-policy input QOS-INGRESS',
        arista: '! EOS traffic-policy apply\ninterface Ethernet1\n   traffic-policy input QOS-INGRESS\n   traffic-policy output QOS-EGRESS'
      },
      {
        legacy: '! Cisco show policy-map interface\nshow policy-map interface Gig0/1',
        arista: '! EOS show traffic-policy\nshow traffic-policy interface Ethernet1 input\nshow qos interfaces Ethernet1'
      }
    ],
    masteryPath: [
      {
        level: 'Foundation',
        heading: 'DSCP Basics',
        body: 'DSCP (Differentiated Services Code Point) is a 6-bit field in the IP header that marks the forwarding priority of a packet. Key values: EF (46) = voice/PTP, AF31 (26) = storage/RoCE, AF21 (18) = video, CS0 (0) = best effort. DSCP is preserved hop-to-hop across IP networks — unlike CoS (802.1p) which is stripped at L3 boundaries.',
        keyConcept: 'EF=46 · AF31=26 · CS0=0'
      },
      {
        level: 'Logic',
        heading: 'Queue Scheduling',
        body: 'Each traffic class maps to a hardware queue on the ASIC egress scheduler. Strict priority (SP) queues are served before weighted round-robin (WRR) queues. TC7 (EF/voice) uses strict priority — it drains completely before any other queue receives bandwidth. TC0 (best-effort) uses WRR and only gets bandwidth after higher queues are satisfied.',
        keyConcept: 'TC7=strict priority · TC0=WRR · ASIC queue map'
      },
      {
        level: 'Architecture',
        heading: 'EOS Traffic-Policy Model',
        body: 'The EOS traffic-policy configuration block replaces Cisco MQC class-map/policy-map. Structure: traffic-policy <NAME> → match <MATCH-NAME> <criteria> → actions → set traffic class <TC>. Apply to interface with: traffic-policy input/output <NAME>. Verify with: show traffic-policy interface <intf> input.',
        keyConcept: 'traffic-policy → match → actions → set traffic class'
      },
      {
        level: 'Architecture',
        heading: 'AI Fabric QoS: RoCE Isolation',
        body: 'For RoCE v2 AI/storage fabrics: (1) Map DSCP 26 (AF31) to TC3 at every hop. (2) Enable PFC no-drop on TC3 only — no other TC shares lossless treatment. (3) Set ECN threshold at ~30% of TC3 queue depth to trigger DCQCN rate reduction before PAUSE. (4) Monitor with show queue-monitor length detail and LANZ. (5) Never co-mingle compute (best-effort) with storage (lossless) in the same TC.',
        keyConcept: 'TC3=lossless · ECN 30% · PFC 80% · DSCP 26 end-to-end'
      }
    ],
    overview: {
      title: 'EOS Traffic-Policy Model',
      intro: 'EOS uses the traffic-policy model for QoS configuration. Unlike Cisco MQC (class-map → policy-map → service-policy), the EOS model consolidates match and action in a single traffic-policy block. The model is applied per-interface in the input or output direction.',
      sections: [
        {
          title: 'DSCP → Traffic Class Mapping',
          body: 'The DSCP value is mapped to an internal traffic class (TC0-TC7) by a global qos map command or within a traffic-policy match block. TC7 = highest priority (strict), TC0 = lowest (best-effort). Traffic class determines which ASIC queue the packet enters.',
          bestFor: 'Underlay switches, access ports, any hop that must classify traffic by DSCP.'
        },
        {
          title: 'Egress Queue Scheduling',
          body: 'Once a packet is in a queue (TC0-TC7), the ASIC scheduler determines when it is transmitted. Strict priority queues (SP) transmit before WRR queues. Bandwidth allocation across WRR queues is configurable per-platform. Check the EOS QoS platform guide for your specific switch model.',
          bestFor: 'Core/distribution switches, spine switches, any congestion point.'
        }
      ],
      conclusion: 'QoS design order: (1) Define DSCP marking at the source (HBA BIOS, server NIC driver). (2) Trust DSCP at the first network hop. (3) Map DSCP to TC at every fabric switch. (4) Allocate queue scheduling per TC. (5) Monitor under real load — paper configs are not proof.'
    },
    primer: {
      title: 'DSCP: The 6-Bit Field That Controls Everything',
      body: 'DSCP (Differentiated Services Code Point) lives in the TOS/DS byte of the IP header — 6 bits providing 64 possible marking values. The key standard classes: Expedited Forwarding (EF, DSCP 46) for delay-sensitive traffic like voice and PTP; Assured Forwarding (AF) in four classes (AF11/AF21/AF31/AF41) with three drop precedence levels each; Class Selector (CS) for backward compatibility with IP Precedence; and Default (BE, DSCP 0) for everything else. On Arista, DSCP values are mapped to internal traffic classes (TC0-TC7) using "qos map dscp <value> to traffic-class <tc>". The TC number then determines queue assignment on the ASIC. DSCP survives L3 routing hops; 802.1p CoS does not — use DSCP for any multi-hop QoS policy.'
    },
    roleConfigs: [
      {
        role: 'DSCP Trust Port',
        description: 'Trust DSCP markings from servers/endpoints at the access layer.',
        config: `! Trust DSCP from server NICs (default is to trust)
interface Ethernet1
   qos trust dscp
!
! Map DSCP to TC globally
qos map dscp 46 to traffic-class 7   ! EF -> TC7 (Voice/PTP)
qos map dscp 40 to traffic-class 6   ! CS5 -> TC6 (Video)
qos map dscp 26 to traffic-class 3   ! AF31 -> TC3 (Storage/RoCE)
qos map dscp 18 to traffic-class 2   ! AF21 -> TC2 (Bulk)
qos map dscp 0  to traffic-class 0   ! BE -> TC0 (Default)
!
! Verify mapping
show qos map dscp
show qos interfaces Ethernet1`
      },
      {
        role: 'Traffic-Policy Ingress',
        description: 'EOS traffic-policy matching DSCP values to traffic classes on ingress.',
        config: `traffic-policy FABRIC-INGRESS
   !
   match VOICE
      dscp ef
      actions
         set traffic class 7
   !
   match STORAGE
      dscp af31
      actions
         set traffic class 3
   !
   match VIDEO
      dscp cs5
      actions
         set traffic class 6
   !
   match DEFAULT
      actions
         set traffic class 0
!
interface Ethernet1
   traffic-policy input FABRIC-INGRESS`
      },
      {
        role: 'RoCE QoS + PFC',
        description: 'Lossless traffic class for RoCE v2/NVMe-oF — TC3 with PFC no-drop and ECN.',
        config: `! Map RoCE v2 (DSCP AF31) to TC3
qos map dscp 26 to traffic-class 3
!
! Enable lossless treatment on TC3
priority-flow-control
   priority 3 no-drop
!
! Set ECN on TC3 queue (threshold ~30% of queue depth)
! (Platform-specific — verify for your switch model)
!
interface Ethernet1
   mtu 9214
   priority-flow-control on
!
! Monitor TC3 queue health
show queue-monitor length detail
show interfaces Ethernet1 priority-flow-control`
      },
      {
        role: 'Priority Queue EF',
        description: 'Strict priority scheduling for EF (voice/PTP) traffic — guaranteed low latency.',
        config: `! DSCP EF (46) → TC7 strict priority
qos map dscp 46 to traffic-class 7
!
! Verify TC7 is configured as strict priority on egress
show qos interfaces Ethernet1 output
!
! Validate EF traffic is getting priority
show qos interfaces Ethernet1 counters
!
! For PTP traffic — also mark CoS 7
qos map cos 7 to traffic-class 7`
      },
      {
        role: 'Policing Rate',
        description: 'Rate-limit a traffic class to prevent one class consuming all bandwidth.',
        config: `traffic-policy EDGE-RATELIMIT
   !
   match BULK
      dscp cs1
      actions
         set traffic class 1
         police rate 1 gbps burst-size 4 mb  ! Limit bulk to 1G on 10G uplink
   !
   match DEFAULT
      actions
         set traffic class 0
!
interface Ethernet1
   traffic-policy input EDGE-RATELIMIT`
      },
      {
        role: 'QoS Validation',
        description: 'Verify QoS policies are applied and traffic classes are being used correctly.',
        config: `! Check traffic-policy applied to interface
show traffic-policy interface Ethernet1 input
!
! Check queue counters (per TC transmit/drop)
show qos interfaces Ethernet1 output
!
! Real-time queue depth
show queue-monitor length
show queue-monitor length detail
!
! Check DSCP mapping table
show qos map dscp
!
! PFC/ECN state
show interfaces Ethernet1 priority-flow-control
show ip ecn`
      },
      {
        role: 'QoS Debugging',
        description: 'Diagnose unexpected drops, wrong queue assignment, or QoS policy not matching.',
        config: `! Step 1: Verify policy is applied
show traffic-policy interface Ethernet1 input | include match
!
! Step 2: Check DSCP marking on packets (capture)
bash tcpdump -i Ethernet1 -nn -c 20 | grep -i dscp
!
! Step 3: Check if drops are in wrong TC
show qos interfaces Ethernet1 output
!
! Step 4: Check DSCP trust setting
show interfaces Ethernet1 | include trust|qos
!
! Step 5: Verify queue is not saturated (sustained depth = problem)
show queue-monitor length events`
      }
    ],
    referenceLinks: [
      { title: 'EOS QoS Configuration Guide', summary: 'Platform-specific traffic-policy, qos map, and queue scheduling configuration.' },
      { title: 'RFC 2474 DiffServ', summary: 'DSCP marking standards and per-hop behavior definitions.' },
      { title: 'Arista AI Fabric QoS Guide', summary: 'RoCE v2 lossless class configuration with PFC/ECN for H100/B200 fabrics.' },
      { title: 'LANZ Telemetry Guide', summary: 'Latency Analytics for microsecond-level queue visibility on Arista platforms.' }
    ],
    dcContext: {
      small: {
        scale: '2-tier · 4-class policy · all ports',
        topologyRole: '4-class traffic-policy on all ports; default EF/BE/AF31/CS5 queues; DSCP trust on server ports',
        keyConfig: 'traffic-policy TP-4CLASS\n   match VOICE dscp ef\n   set traffic-class 7',
        highlight: 'host-edge'
      },
      medium: {
        scale: '3-tier · per-VRF traffic policy · PFC for storage class',
        topologyRole: 'Per-VRF traffic policy; storage class PFC-enabled on leaf ports; DSCP remarking at border-leaf',
        keyConfig: 'qos map dscp 46 to traffic-class 7\npriority-flow-control on  ! on storage uplinks',
        highlight: 'leaf-spine'
      },
      large: {
        scale: 'Multi-pod · 8-queue model · per-switch buffer profiles · DTEL',
        topologyRole: 'Full 8-queue model per switch; per-switch buffer profiles tuned for workload; DTEL/LANZ telemetry per queue',
        keyConfig: 'hardware counter feature traffic-class\nlanz\n   enabled\n   action-threshold 500000',
        highlight: 'all'
      }
    }
  }
