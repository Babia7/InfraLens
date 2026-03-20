import { ProtocolDetail } from './types';

export const QOS_PROTOCOL: ProtocolDetail = {
  id: 'qos',
  name: 'QoS & Traffic-Policy',
  legacyTerm: 'MQC class-map / policy-map',
  tagline: 'Deterministic treatment for every traffic class — from voice to RoCE.',
  description:
    'Quality of Service on Arista EOS uses the traffic-policy model for per-class classification and scheduling across all platforms. For AI/GPU fabrics, QoS is the foundational prerequisite for RoCEv2 lossless transport: deliberate traffic class design, ECN-driven congestion signaling, PFC as a per-priority backstop, and DCQCN as the end-to-end control loop. The standard Arista AI fabric class model maps CS7 (DSCP 56) → Q7 for CNP and network control at strict priority, CS3 (DSCP 24) → Q3 as the lossless RDMA data class with PFC enabled, and best-effort traffic into Q1 (lossy). ECN marks the no-drop queue before loss occurs; DCQCN converts that mark into a flow-level rate reduction at the NIC; PFC provides the instantaneous backstop if DCQCN cannot react in time. Getting QoS wrong in an AI fabric means silent congestion, cascading PFC pause storms, or DCQCN feedback loops that break silently when ECN marks never reach the host.',

  keyBenefits: [
    'EOS traffic-policy model provides a single consistent QoS syntax across Campus, DC, and AI platforms — one operational model for all roles.',
    'Standard AI fabric class model (CS7→Q7, CS3→Q3, Q1=best-effort) establishes deliberate queue isolation between CNP, RDMA data, and lossy traffic on every switch.',
    'DCQCN loop — switch marks ECN at Q3, receiver NIC generates CNP, sender NIC reduces rate — provides flow-level rate control that is more precise than port-level PFC pause.',
    'PFC on Q3 (no-drop class only) provides the instantaneous backstop for RDMA data while DCQCN feedback completes, preventing loss during the feedback loop delay.',
    'PFC watchdog self-heals PFC deadlock by disabling pause on a frozen queue — without it, a stuck queue stalls indefinitely and requires manual intervention.',
    'DSCP trust on access ports ensures end-to-end marking fidelity without re-marking at every hop — broken at any single switch, lossless behavior fails silently.',
    'Per-ASIC ECN telemetry (LANZ on Strata, `hardware counter feature ecn out` on Jericho) provides queue-depth evidence that a configuration is actually working under load.'
  ],

  bestPractices: [
    'Define a DSCP-to-TC mapping table before deployment and enforce it consistently at every switch — a single switch with a different mapping silently re-marks flows into the wrong traffic class, breaking lossless behavior end-to-end.',
    'Always set trust DSCP at the network edge (access port facing servers/GPU NICs) — trust at the host-facing edge, not at the core, so re-marking is not required at every hop.',
    'Map CNP (Congestion Notification Packets) to CS7/Q7 strict-priority at every switch — if CNP shares a queue with RDMA data, the DCQCN feedback loop is delayed, PFC becomes dominant, and flow-level rate control is lost.',
    'Enable PFC on the RDMA data queue (CS3/Q3) only — enabling PFC on best-effort classes causes cascading pause propagation that couples unrelated victim flows and can stall traffic fabric-wide.',
    'Always enable PFC watchdog on all lossless ports: `pfc watchdog action no-drop disable-pfc-first` with a 100–200ms deadlock timer — without watchdog, a frozen no-drop queue never recovers without manual intervention.',
    'Set ECN threshold at 30–40% of queue depth for AllReduce workloads (synchronized incast) and 20–30% for MoE/all-to-all — ECN must appear before sustained PFC; target mark rate < 5% of packets at 70% load.',
    'On Jericho ASICs, enable `hardware counter feature ecn out` globally — ECN marks occur correctly without this command, but counters are invisible, making DCQCN validation impossible during POC or troubleshooting.',
    'In VXLAN overlay fabrics, explicitly configure `vxlan qos ecn propagation` on the VTEP interface — without it, ECN marks generated at the underlay switch are not propagated to the overlay; the NIC never sees the congestion signal and the DCQCN loop breaks silently.',
    'Do not use DLB on port-channel ECMP members — DLB silently falls back to hash-ECMP when applied to LAG members without error; restructure leaf uplinks as routed L3 or use CLB on spine only.',
    'CLB on spine requires `service routing protocols model multi-agent` on all participating switches — CLB config is accepted without it but produces no spine flow redistribution.',
    'Validate QoS with `show qos interfaces <intf>`, `show priority-flow-control counters detail`, and `show queue-monitor length detail` under real load — configuration review does not prove correct behavior; only measured queue depth and counter movement does.',
    'Validate DCQCN end-to-end: confirm EOS ECN mark counter increments, CNP generation is active at the host NIC, and RDMA rate reduction appears in NIC stats — a broken loop at any component means PFC dominates without flow-level control.'
  ],

  cliTranslation: [
    {
      legacy: '! Cisco MQC class-map\nclass-map match-all VOICE\n  match dscp ef',
      arista:
        '! EOS traffic-policy match\ntraffic-policy INGRESS-POLICY\n   match VOICE\n      dscp ef\n      actions\n         set traffic class 7'
    },
    {
      legacy: '! Cisco policy-map\npolicy-map QOS-INGRESS\n  class VOICE\n    set dscp ef\n    priority percent 20',
      arista:
        '! EOS traffic-policy with set traffic-class\ntraffic-policy QOS-INGRESS\n   match STORAGE dscp af31\n      actions\n         set traffic class 3'
    },
    {
      legacy: '! Cisco service-policy apply\ninterface Gig0/1\n  service-policy input QOS-INGRESS',
      arista:
        '! EOS traffic-policy apply\ninterface Ethernet1\n   traffic-policy input QOS-INGRESS\n   traffic-policy output QOS-EGRESS'
    },
    {
      legacy: '! Cisco show policy-map interface\nshow policy-map interface Gig0/1',
      arista:
        '! EOS show traffic-policy\nshow traffic-policy interface Ethernet1 input\nshow qos interfaces Ethernet1'
    },
    {
      legacy: '! Cisco: manual per-class ACL, no AI fabric class model standard\nclass-map RDMA-DATA\n  match dscp 24\nclass-map CNP\n  match dscp 56\nclass-map RDMA-CTRL\n  match dscp 16',
      arista:
        '! Arista AI Fabric Standard Traffic Class Model\n! CS7 (DSCP 56) → Q7: CNP + network control (strict priority)\n! CS6 (DSCP 48) → Q6: BGP, BFD routing control\n! CS2 (DSCP 16) → Q5: RDMA control (RC/UD signaling)\n! CS3 (DSCP 24) → Q3: RDMA data (lossless, PFC-enabled)\n! CS0/1/4/5     → Q1: best-effort (lossy)\nqos map dscp 56 to traffic-class 7   ! CS7 → Q7 (CNP/control)\nqos map dscp 48 to traffic-class 6   ! CS6 → Q6 (BGP/BFD)\nqos map dscp 16 to traffic-class 5   ! CS2 → Q5 (RDMA control)\nqos map dscp 24 to traffic-class 3   ! CS3 → Q3 (RDMA data, lossless)\nqos map dscp 0  to traffic-class 1   ! BE  → Q1 (best-effort)'
    },
    {
      legacy: '! Cisco: WRED per DSCP — complex, no per-queue ECN threshold\nrandom-detect dscp-based\nrandom-detect dscp 24 20 40 10',
      arista:
        '! EOS ECN — Strata ASIC (EOS 4.31+, preferred)\nqos profile AI-FABRIC\n   uc-tx-queue 3\n      ecn threshold 1500000 bytes   ! ~30% of buffer; adjust per workload\n      bandwidth percent 40\n      priority strict\n!\n! EOS ECN — Jericho ASIC (per-interface)\ninterface Ethernet<N>\n   qos tx-queue 3 ecn minimum-threshold 1500000 maximum-threshold 1500000\n!\n! Required for ECN counter visibility on Jericho — without this, marks\n! occur but counters are invisible; DCQCN cannot be validated\nhardware counter feature ecn out'
    },
    {
      legacy: '! VXLAN encapsulation strips ECN in most vendor implementations\n! No standard mechanism for ECN propagation across tunnel',
      arista:
        '! EOS: explicit VXLAN ECN propagation on VTEP interface\n! Required when RoCE traffic crosses a VXLAN overlay\n! Without this, ECN marks at underlay are not seen by the host NIC;\n! DCQCN loop breaks silently\ninterface Vxlan1\n   vxlan qos ecn propagation\n!\n! Verify propagation is active\nshow vxlan qos\nshow qos interfaces <interface-name> ecn counters queue'
    }
  ],

  masteryPath: [
    {
      level: 'Foundation',
      heading: 'DSCP Basics',
      body: 'DSCP (Differentiated Services Code Point) is a 6-bit field in the IP header that marks forwarding priority. Key values for Arista AI fabrics: CS7 (DSCP 56) for CNP and network control, CS3 (DSCP 24) for RDMA data (the lossless class), CS2 (DSCP 16) for RDMA control signals, CS6 (DSCP 48) for BGP/BFD, and CS0 (DSCP 0) for best-effort. DSCP is preserved hop-to-hop across IP networks — unlike 802.1p CoS which is stripped at L3 boundaries — making it the correct marking choice for multi-hop AI fabrics. A single switch with a misconfigured DSCP-to-TC mapping silently breaks lossless transport end-to-end.',
      keyConcept: 'CS7=56 · CS3=24 · CS0=0 · preserved across L3'
    },
    {
      level: 'Foundation',
      heading: 'RoCE v2: Routable RDMA over Ethernet',
      body: 'RoCE v1 encapsulated InfiniBand packets directly into Ethernet frames — L2 only, not routable, confined to a single broadcast domain. RoCE v2 wraps the same IB packet inside UDP/IP (destination port 4791), making it fully routable across a leaf-spine fabric. The UDP header also provides entropy for ECMP load balancing across uplinks. RoCE v2 is far less forgiving than TCP: it carries no built-in congestion recovery — packet loss translates directly to RDMA retransmission timeouts and training job slowdown. Lossless behavior for RDMA data is not a fabric default; it requires explicit QoS class design at every switch in the path.',
      keyConcept: 'UDP/IP port 4791 · routable · ECMP entropy · loss = job slowdown'
    },
    {
      level: 'Logic',
      heading: 'AI Fabric Queue Model',
      body: 'Each DSCP value maps to an internal traffic class (TC/queue 0–7) at the ASIC. The Arista AI fabric standard: Q7 = CNP and network control, strict priority — CNP must drain before everything else so DCQCN feedback is never delayed. Q5 = RDMA control (RC/UD connection setup). Q3 = RDMA data, lossless, PFC-enabled no-drop — this is the protected class. Q1 = best-effort, lossy. The ordering is intentional: CNP in Q7 ensures rate-reduction signals travel faster than the congestion data that caused them. Best-effort in Q1 absorbs drops rather than triggering pause on shared queues. Never co-locate RDMA data and best-effort in the same queue — storage burst into Q3 causes PFC pause on the lossless class, stalling compute traffic that had nothing to do with the congestion.',
      keyConcept: 'Q7=CNP strict · Q5=RDMA ctrl · Q3=lossless PFC · Q1=best-effort lossy'
    },
    {
      level: 'Logic',
      heading: 'DCQCN: The Three-Role Congestion Loop',
      body: 'DCQCN (Data Center Quantized Congestion Notification) is a NIC-side rate control scheme triggered by switch-originated ECN signals. Three roles: Congestion Point (CP) — the switch marks ECN bits (CE) on packets in Q3 when queue occupancy exceeds the configured ECN threshold; this is the switch\'s only active role. Notification Point (NP) — the receiving GPU NIC sees CE-marked packets and generates a Congestion Notification Packet (CNP) back toward the sender, identifying the specific queue pair (QP) under pressure — only that flow is rate-limited. Reaction Point (RP) — the sending NIC receives the CNP and reduces rate for the affected QP; rate gradually recovers as queue pressure subsides. The feedback loop: queue grows → switch marks CE on RDMA data → receiver sends CNP → sender reduces rate → queue drains → sender recovers. All rate adjustment logic lives in the NIC, not the switch. If CNP shares a queue with RDMA data and gets delayed, rate reduction happens too late and PFC becomes the dominant control mechanism instead of DCQCN.',
      keyConcept: 'CP=switch ECN marks · NP=receiver CNP · RP=sender rate-reduces'
    },
    {
      level: 'Logic',
      heading: 'PFC: Safety Backstop, Not Performance Mechanism',
      body: 'Priority Flow Control (PFC) pauses a selected priority on the upstream link when the protected egress queue hits the protection threshold. In an AI fabric, PFC is the instantaneous backstop for the RDMA no-drop class — it prevents loss while the DCQCN feedback loop (ECN mark → CNP → NIC rate reduction) completes. PFC operates at priority level, not flow level: one congested flow can pause unrelated victim flows sharing the same priority. Pause can propagate hop-by-hop upstream, expanding the impact zone beyond the original congestion point. The healthy pattern is: ECN marks appear → DCQCN rate reduction begins → brief PFC absorbs the short-timescale shock → queue recovers. If PFC dominates before ECN becomes meaningful, the control loop is mis-tuned: ECN thresholds too high, CNP path delayed, or DCQCN parameters wrong at the NIC. PFC watchdog detects a frozen no-drop queue (one that never resumes) and self-heals by disabling PFC on that queue, preventing indefinite deadlock.',
      keyConcept: 'priority-scoped backstop · propagates upstream · ECN first · watchdog self-heals'
    },
    {
      level: 'Architecture',
      heading: 'EOS Traffic-Policy Configuration',
      body: 'The EOS traffic-policy block replaces Cisco MQC class-map/policy-map with a unified syntax. Structure: `traffic-policy <NAME>` → `match <MATCH-NAME> <criteria>` → `actions` → `set traffic class <TC>`. Apply to interfaces: `traffic-policy input/output <NAME>`. For AI fabrics, global classification via `qos map dscp <value> to traffic-class <tc>` is more efficient — apply the 5-class model on every switch consistently. A single misconfigured hop breaks lossless behavior end-to-end. Verify mapping: `show qos map dscp`. Verify policy applied: `show traffic-policy interface <intf> input`. Verify queue behavior: `show qos interfaces <intf>`.',
      keyConcept: 'traffic-policy → match → actions → set tc · global qos map · verify under load'
    },
    {
      level: 'Architecture',
      heading: 'AI Fabric QoS: 5-Step Congestion Design Procedure',
      body: 'Design sequence for RoCEv2 congestion management: (1) Classify the workload — AllReduce-heavy (synchronized incast bursts, high leaf-uplink risk), MoE/all-to-all (wider irregular bursts), Mixed training+inference (phase-dependent), or Checkpoint-heavy (periodic storage bursts that collide with compute if not isolated). (2) Set ECN threshold — starting point: 30–40% of available buffer for AllReduce, 20–30% for MoE. Target ECN mark rate < 5% of packets at 70% load. Sustained > 15% mark rate = threshold too low or topology hotspot. (3) Scope PFC to Q3 only — never enable PFC on CS0/1/4/5 (best-effort) classes; always enable PFC watchdog on all lossless ports (100–200ms deadlock timer). (4) Select load balancing — DLB on Strata leaf (not on port-channels), CLB on spine (requires multi-agent routing model), hash-ECMP as baseline to measure before adding DLB/CLB. (5) Validate DCQCN end-to-end — confirm switch ECN marks increment, host CNP generation is active, and NIC rate reduction is observable; a broken loop at any one component means PFC dominates without flow-level control.',
      keyConcept: 'classify → ECN threshold → PFC scope → LB selection → DCQCN validation'
    },
    {
      level: 'Architecture',
      heading: 'RoCEv2 QoS Validation Sequence',
      body: 'Five-phase verification after deploying AI fabric QoS — config review is not sufficient; each phase requires live counter evidence: (1) Confirm policy attachment — `show class-map`, `show qos profile`, `show running-config section qos`. (2) Validate queue mapping — `show qos interfaces`, `show qos maps`, `show interface counters queue detail` — RDMA data must land in Q3, CNP in Q7, best-effort in Q1; wrong queue makes all subsequent ECN/PFC interpretation invalid. (3) Validate PFC — `show priority-flow-control counters detail`, `show priority-flow-control counters watchdog` — PFC should increment only on priority 3; other priorities quiet; watchdog armed not triggered. (4) Validate congestion behavior under two separate test cases: non-RoCE congestion (best-effort drops, no ECN/PFC on Q3); RoCE congestion (ECN marks then PFC on Q3, no RDMA data drop, CNP in Q7 unaffected). (5) Validate visibility — CloudVision/LANZ queue events align with traffic generator; in VXLAN paths, `vxlan qos ecn propagation` active, ECN marks visible at overlay switch, CNP visible at host NIC. Pass = correct queue mapping, best-effort drops first, RDMA congestion shows ECN before PFC, telemetry matches scenario.',
      keyConcept: 'policy attachment → queue map → PFC scoped → congestion dual-test → LANZ/CVP'
    }
  ],

  overview: {
    title: 'EOS QoS for AI Fabrics: Traffic Class Model and Congestion Design',
    intro:
      'QoS on Arista EOS is built around the traffic-policy model for classification and the ASIC queue scheduler for enforcement. For AI and storage fabrics, the design objective extends beyond traffic shaping: the QoS policy must create a lossless RDMA transport class, enable ECN-driven congestion signaling, scope PFC to a single no-drop queue, and ensure the DCQCN end-to-end feedback loop operates correctly. The five-class traffic model (CNP/control, RDMA control, RDMA data, BGP/BFD, best-effort) and the deliberate queue assignments are what make RoCEv2 lossless transport possible at scale.',
    sections: [
      {
        title: 'Traffic Class Model: Five Classes, Five Rules',
        body: 'The Arista AI fabric standard: CS7 (DSCP 56) → Q7 strict-priority for CNP and network control — CNP must not be delayed or it breaks DCQCN feedback. CS6 (DSCP 48) → Q6 for BGP/BFD routing control. CS2 (DSCP 16) → Q5 for RDMA control (RC/UD connection setup). CS3 (DSCP 24) → Q3 lossless no-drop for RDMA data — PFC enabled here only. CS0/1/4/5 → Q1 lossy best-effort. Apply identically at every switch. A single misconfigured hop breaks lossless behavior silently.',
        bestFor: 'Every fabric switch in an AI/GPU cluster. Applied globally via qos map dscp commands.'
      },
      {
        title: 'ECN and DCQCN: Congestion Before Loss',
        body: 'ECN (Explicit Congestion Notification) marks packets in Q3 when queue occupancy crosses the configured threshold — the packet continues, but the CE bit tells the receiving NIC that congestion is forming. The NIC generates a CNP (Congestion Notification Packet) back to the sender. The sender NIC rate-limits the affected queue pair. This is DCQCN — the switch marks, the receiver notifies, the sender reacts. ECN threshold must be calibrated to the workload: 30–40% of buffer for AllReduce-heavy incast, 20–30% for MoE. On Strata, configure via `qos profile`. On Jericho, per-interface `qos tx-queue 3 ecn` plus `hardware counter feature ecn out` for counter visibility.',
        bestFor: 'Any GPU fabric where RDMA transport quality affects training job completion time.'
      },
      {
        title: 'PFC Scope and Watchdog',
        body: 'PFC pauses the upstream link for the protected priority when Q3 approaches overflow — it is the instantaneous backstop while DCQCN reacts. Enable on Q3 (RoCE data) only. Never on best-effort classes — PFC on lossy traffic causes cascading pause propagation across the fabric. Always enable PFC watchdog: `pfc watchdog action no-drop disable-pfc-first` with a 100–200ms timer. Watchdog detects PFC deadlock (a queue that never resumes) and self-heals by disabling pause on the frozen queue. Without watchdog, a deadlocked queue requires manual recovery.',
        bestFor: 'All lossless ports in the AI fabric — leaf host-facing and spine-facing uplinks.'
      },
      {
        title: 'Load Balancing: DLB, CLB, and ECMP',
        body: 'Path distribution is part of the QoS system for AI fabrics: poor load balancing creates hotspots that drive ECN and PFC on specific paths, masking what would be balanced under correct distribution. Hash-ECMP first — establish baseline. Add DLB (Dynamic Load Balancing) on Strata leaf switches: measures data transmitted + enqueued per port and steers new flows to less-loaded paths. DLB cannot be used on port-channel ECMP members — use routed L3 uplinks or CLB on spine instead. CLB (Cluster Load Balancing) on spine: RDMA/RoCE-aware collective flow placement; requires `service routing protocols model multi-agent` on all participating spines.',
        bestFor: 'Strata-based AI fabrics. Confirm ASIC family before enabling DLB or CLB.'
      }
    ],
    conclusion:
      'QoS design order for AI fabrics: (1) Identify workload type and burst profile. (2) Apply 5-class DSCP model consistently at every switch. (3) Set ECN threshold at 30–40% of Q3 buffer. (4) Enable PFC on Q3 only with watchdog. (5) Select DLB/CLB per ASIC family. (6) Validate DCQCN end-to-end: ECN marks at switch, CNP at host NIC, rate reduction in NIC stats. (7) Confirm with LANZ/CloudVision under real load — counter movement is proof; configuration review is not.'
  },

  primer: {
    title: 'DSCP: The 6-Bit Field That Controls Everything',
    body: 'DSCP (Differentiated Services Code Point) lives in the TOS/DS byte of the IP header — 6 bits providing 64 possible marking values. The key standard classes: Expedited Forwarding (EF, DSCP 46) for delay-sensitive traffic like voice and PTP; Assured Forwarding (AF) in four classes (AF11/AF21/AF31/AF41) with three drop precedence levels each; Class Selector (CS) for backward compatibility with IP Precedence; and Default (BE, DSCP 0) for everything else. On Arista, DSCP values are mapped to internal traffic classes (TC0-TC7) using "qos map dscp <value> to traffic-class <tc>". The TC number determines queue assignment on the ASIC. For AI fabrics, the critical mappings are CS7 (DSCP 56) → TC7 for CNP, CS3 (DSCP 24) → TC3 for RDMA data (the lossless class), and CS0 → TC1 for best-effort. DSCP survives L3 routing hops; 802.1p CoS does not — use DSCP for any multi-hop QoS policy.'
  },

  roleConfigs: [
    {
      role: 'AI Fabric Traffic Class Model',
      description: 'Standard Arista 5-class DSCP-to-TC mapping for RoCEv2 AI fabrics. Apply at every switch globally.',
      config: `! Standard Arista AI Fabric Traffic Class Model
! CS7 (DSCP 56) → Q7: CNP + network control (strict priority)
! CS6 (DSCP 48) → Q6: BGP, BFD routing control
! CS2 (DSCP 16) → Q5: RDMA control (RC/UD signaling)
! CS3 (DSCP 24) → Q3: RDMA data — lossless, PFC-enabled
! CS0/1/4/5    → Q1: best-effort (lossy)
!
qos map dscp 56 to traffic-class 7   ! CS7 → Q7 (CNP/control)
qos map dscp 48 to traffic-class 6   ! CS6 → Q6 (BGP/BFD)
qos map dscp 16 to traffic-class 5   ! CS2 → Q5 (RDMA control)
qos map dscp 24 to traffic-class 3   ! CS3 → Q3 (RDMA data, lossless)
qos map dscp 0  to traffic-class 1   ! BE  → Q1 (best-effort)
!
! Trust DSCP on all host-facing ports
interface Ethernet1
   qos trust dscp
!
! Verify mapping table
show qos map dscp`
    },
    {
      role: 'PFC Watchdog + Lossless Config',
      description: 'Enable PFC on Q3 (RDMA data) only with PFC watchdog for deadlock detection. Never enable PFC on best-effort classes.',
      config: `! Enable PFC on RoCE data queue (Q3 = priority 3) only
qos pfc-priority 3
!
! PFC watchdog — always enable on lossless ports
! Detects deadlock; disables PFC on frozen queue and self-heals
! Watchdog timer: 100-200ms typical
qos pfc watchdog timer 150
!
interface Ethernet<N>
   priority-flow-control on
   pfc watchdog action no-drop disable-pfc-first
!
! Verify PFC state
show interfaces ethernet <N> pfc watchdog
show interfaces ethernet <N> counters pfc
show priority-flow-control counters detail
!
! Watchdog should show "armed" not "triggered" under normal operation.
! "Triggered" state = deadlock occurred and self-healed — investigate root cause.`
    },
    {
      role: 'ECN Config — Strata ASIC',
      description: 'ECN threshold configuration for Strata ASICs (EOS 4.31+). Set at ~30% of Q3 buffer depth.',
      config: `! EOS 4.31+ — Strata ASIC (preferred: configure once, apply to many interfaces)
qos profile AI-FABRIC
   uc-tx-queue 3
      ecn threshold 1500000 bytes   ! ~30% of queue buffer
      bandwidth percent 40
      priority strict
!
! Older Strata syntax (per-interface)
interface Ethernet<N>
   qos tx-queue 3 ecn minimum-threshold 1500000 maximum-threshold 1500000
!
! Verify ECN is active
show queue-monitor length detail
show interfaces ethernet <N> counters queue
!
! Target: ECN marks visible at ~70% load test
! Mark rate < 5% of packets = healthy starting point
! Sustained > 15% mark rate = threshold too low or hotspot`
    },
    {
      role: 'ECN Config — Jericho ASIC',
      description: 'ECN threshold + counter visibility for Jericho/Sand ASICs. Counter feature flag is required for DCQCN validation.',
      config: `! Jericho: per-interface ECN threshold
interface Ethernet<N>
   qos tx-queue 3 ecn minimum-threshold 1500000 maximum-threshold 1500000
!
! Required for ECN counter visibility on Jericho
! Without this: ECN marks occur but counters are invisible
! Cannot validate DCQCN behavior during POC
hardware counter feature ecn out
!
! Verify ECN counters are visible
show hardware counter feature ecn out
!
! Note: Jericho2/Jericho2C support LANZ by default (deep buffer)
! DLB is NOT supported on Jericho ASICs — use CLB on spine only`
    },
    {
      role: 'CLB Config — Spine',
      description: 'Cluster Load Balancing on spine switches for RDMA/RoCE-aware collective flow placement. Requires multi-agent routing model.',
      config: `! Required on ALL CLB-participating spine switches
service routing protocols model multi-agent
!
! CLB configuration on spine
load-balance profile CLB-SPINE
   cluster load-balance
   load-balance method flow spine port-index
!
! Verify CLB is active (not just configured)
show ip route summary
! Routing model should show "multi-agent" — if not, CLB is not active
show load-balance profile CLB-SPINE
!
! DLB — Strata leaf only (NOT on port-channel ECMP members)
load-balance profile DLB-AI
   dynamic load-balance
!
interface Ethernet<N>
   load-balance profile DLB-AI
!
show load-balance profile DLB-AI   ! DLB counters should show flow migration events`
    },
    {
      role: 'VXLAN ECN Propagation',
      description: 'Required in EVPN AI fabrics where RoCE traffic traverses a VXLAN overlay. Without this, the DCQCN loop breaks silently.',
      config: `! Required when RoCEv2 traffic crosses a VXLAN overlay
! Without this: ECN marks generated at underlay switch are NOT propagated
! to the overlay; NIC never receives ECN signal; DCQCN loop broken silently
interface Vxlan1
   vxlan qos ecn propagation
!
! Verify propagation is active
show vxlan qos
show qos interfaces <interface-name> ecn counters queue
!
! Expected result: ECN marks visible at overlay switch AND CNP visible at host NIC
! If switch shows ECN but host NIC shows no CNP: ECN propagation broken`
    },
    {
      role: 'DSCP Trust Port',
      description: 'Trust DSCP markings from GPU servers/NICs at the access layer.',
      config: `! Trust DSCP from server NICs (default is to trust)
interface Ethernet1
   qos trust dscp
!
! AI fabric global DSCP map (apply before enabling PFC)
qos map dscp 56 to traffic-class 7   ! CS7 → Q7 (CNP/control)
qos map dscp 24 to traffic-class 3   ! CS3 → Q3 (RDMA data)
qos map dscp 0  to traffic-class 1   ! BE  → Q1 (default)
!
! Verify mapping
show qos map dscp
show qos interfaces Ethernet1`
    },
    {
      role: 'Traffic-Policy Ingress',
      description: 'EOS traffic-policy matching DSCP values to traffic classes on ingress — general-purpose model.',
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
      role: 'QoS Verification Sequence',
      description: 'Full five-phase verification workflow for RoCEv2 QoS deployment.',
      config: `! Phase 1: Confirm policy and profile attachment
show class-map
show qos profile
show running-config section qos
show running-config interfaces
!
! Phase 2: Validate queue mappings
show qos interfaces
show qos maps
show interface counters queue detail
! Expected: RDMA data in Q3, CNP in Q7, best-effort in Q1
!
! Phase 3: Validate PFC behavior
show priority-flow-control counters detail
show priority-flow-control counters watchdog
! Expected: PFC increments ONLY on priority 3; watchdog armed not triggered
!
! Phase 4a: Non-RoCE congestion test
! Expected: best-effort drops, NO ECN/PFC on Q3
!
! Phase 4b: RoCE congestion test
! Expected: ECN then PFC on Q3, no RDMA data drop, Q7 (CNP) unaffected
!
! Phase 5: Validate telemetry visibility
show vxlan qos                                          ! VXLAN paths only
show qos interfaces <interface-name> ecn counters queue
show queue-monitor length detail
! Expected: CVP/LANZ queue events align with traffic generator results`
    },
    {
      role: 'QoS Debugging',
      description: 'Diagnose unexpected drops, wrong queue assignment, or QoS policy not matching.',
      config: `! Step 1: Verify policy is applied
show traffic-policy interface Ethernet1 input | include match
!
! Step 2: Check DSCP mapping on packets (capture)
bash tcpdump -i Ethernet1 -nn -c 20 | grep -i dscp
!
! Step 3: Check if drops are in wrong TC
show qos interfaces Ethernet1 output
!
! Step 4: Check DSCP trust setting
show interfaces Ethernet1 | include trust|qos
!
! Step 5: Verify queue is not saturated (sustained depth = problem)
show queue-monitor length events
!
! Step 6: Verify PFC is on correct priority only
show priority-flow-control counters detail
!
! Step 7: Verify ECN marks are appearing before PFC dominates
show queue-monitor length detail
show hardware counter feature ecn out   ! Jericho only`
    }
  ],

  referenceLinks: [
    {
      title: 'EOS QoS Configuration Guide',
      summary: 'Platform-specific traffic-policy, qos map, and queue scheduling configuration.'
    },
    {
      title: 'RFC 2474 DiffServ',
      summary: 'DSCP marking standards and per-hop behavior definitions.'
    },
    {
      title: 'Arista AI Fabric QoS Guide (Tech Library)',
      summary: 'RoCEv2 lossless class configuration with PFC/ECN/DCQCN for H100/B200 AI fabrics. Authoritative source for CS3→Q3 model and PFC watchdog configuration.'
    },
    {
      title: 'LANZ Telemetry Guide',
      summary: 'Latency Analytics for microsecond-level queue visibility on Arista platforms.'
    },
    {
      title: 'RoCEv2 Congestion Design Procedure',
      summary: 'Five-step procedure: workload classification → ECN threshold → PFC scope → load balancing selection → DCQCN end-to-end validation. Includes failure-mode table and worked example for 2,048-GPU AllReduce cluster.'
    }
  ],

  dcContext: {
    small: {
      scale: '2-tier · 32–128 GPUs · 4-class model · all ports',
      topologyRole:
        'Leaf-spine with single-tier spines. Standard 4-class or 5-class policy on all ports. ECN on Q3, PFC watchdog enabled. Hash-ECMP for path distribution. Validate DSCP trust on all leaf server-facing ports.',
      keyConfig: `qos map dscp 56 to traffic-class 7
qos map dscp 24 to traffic-class 3
qos map dscp 0  to traffic-class 1
qos pfc-priority 3
qos pfc watchdog timer 150`,
      highlight: 'host-edge'
    },
    medium: {
      scale: '3-tier · 128–1024 GPUs · DLB on Strata leaf · ECN tuning required',
      topologyRole:
        'Three-tier Clos. ECN thresholds tuned by workload type (AllReduce vs MoE). DLB on Strata leaf switches where uplinks are routed L3 (not port-channels). CLB on spine with multi-agent routing model. PFC watchdog on all lossless ports. Validate DCQCN loop with counter evidence before declaring POC pass.',
      keyConfig: `! ECN — Strata leaf
qos profile AI-FABRIC
   uc-tx-queue 3
      ecn threshold 1500000 bytes
      priority strict
!
! CLB — spine
service routing protocols model multi-agent
load-balance profile CLB-SPINE
   cluster load-balance`,
      highlight: 'leaf-spine'
    },
    large: {
      scale: 'Multi-pod · 1000+ GPUs · CLB all spines · full DCQCN validation · LANZ telemetry',
      topologyRole:
        'Multi-pod AI fabric. CLB on all spines (multi-agent required). DLB on Strata leaf uplinks. PFC watchdog enabled fabric-wide. LANZ streaming to CloudVision for real-time queue-depth evidence. DCQCN validated per pod before production: confirm switch ECN marks, host CNP generation, NIC rate reduction active simultaneously. In VXLAN overlay deployments, vxlan qos ecn propagation on all VTEPs.',
      keyConfig: `hardware counter feature traffic-class
hardware counter feature ecn out       ! Jericho pods
!
queue-monitor streaming
   no shutdown
!
! LANZ threshold (cells; platform-specific)
queue-monitor length 10000
!
interface Vxlan1
   vxlan qos ecn propagation            ! EVPN overlay pods`,
      highlight: 'all'
    }
  }
};
