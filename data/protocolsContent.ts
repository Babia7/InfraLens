export interface MasteryLevel {
  level: 'Foundation' | 'Logic' | 'Architecture';
  heading: string;
  body: string;
  keyConcept: string;
}

export interface RoleConfig {
  role: string;
  description: string;
  config: string;
}

export interface ProtocolDetail {
  id: string;
  name: string;
  legacyTerm: string;
  tagline: string;
  description: string;
  keyBenefits: string[];
  cliTranslation: { legacy: string; arista: string }[];
  masteryPath?: MasteryLevel[];
  roleConfigs?: RoleConfig[];
  referenceLinks?: { title: string; summary?: string; url?: string }[];
  overview?: {
    title: string;
    intro: string;
    sections: { title: string; body: string; bestFor: string }[];
    conclusion: string;
  };
  primer?: {
    title: string;
    body: string;
  };
}

export const PROTOCOL_CONTENT: Record<string, ProtocolDetail> = {
  VXLAN: {
    id: 'vxlan',
    name: 'VXLAN',
    legacyTerm: 'OTV / VPLS / FabricPath',
    tagline: 'Standardized L2-over-L3 Virtualization.',
    description:
      'Virtual Extensible LAN (VXLAN) is the industrial-strength standard for building large-scale, multi-tenant cloud networks. It stretches Layer 2 domains over a resilient Layer 3 underlay, eliminating Spanning Tree and the 4096 VLAN ceiling.',
    keyBenefits: [
      'Scales to 16.7 million segments using a 24-bit VNI.',
      'Uses IP underlay ECMP for deterministic load balancing.',
      'Hardware VTEPs for line-rate 100/400G encapsulation.',
      'Decouples physical topology from logical services.',
      'Deterministic change control: preflight underlay/MTU/RT schema before enabling overlays.',
      'Telemetry-ready: snapshot/rollback + ERSPAN/sFlow/pcaps to prove encapsulation and symmetry.'
    ],
    cliTranslation: [
      { legacy: 'feature otv', arista: 'interface vxlan1' },
      { legacy: 'otv control-group 239.1.1.1', arista: 'vxlan source-interface Loopback0' },
      { legacy: 'otv extend-vlan 10', arista: 'vxlan vlan 10 vni 10010' },
      { legacy: 'otv site-bridge-interface...', arista: 'vxlan flood vtep 1.1.1.1 2.2.2.2' },
      { legacy: 'mpls l2vpn bridge-domain', arista: 'vxlan udp-port 4789\nvxlan learn-restrict off' },
      { legacy: 'storm-control broadcast', arista: 'vxlan arp-suppression off|on' }
    ],
    masteryPath: [
      {
        level: 'Foundation',
        heading: 'Overlay Mechanics',
        body: 'VXLAN encapsulates L2 frames into UDP (4789) over an IP underlay. Underlay ECMP gives deterministic scale; VNI replaces VLAN ID.',
        keyConcept: 'Encap: L2-in-UDP'
      },
      {
        level: 'Logic',
        heading: 'BUM Handling',
        body: 'Ingress replication or multicast for BUM. With EVPN, IMET routes drive replication lists instead of static flood-lists.',
        keyConcept: 'BUM Replication Choices'
      },
      {
        level: 'Architecture',
        heading: 'Gateway Placement',
        body: 'Anycast Gateways on leaves (SVI per VNI) minimize hairpinning and enable host mobility. Track MTU and symmetry for return paths.',
        keyConcept: 'Anycast GW & Symmetry'
      },
      {
        level: 'Architecture',
        heading: 'Day-2 Proof Points',
        body: 'Instrument VXLAN with telemetry (ERSPAN/sFlow) and packet captures on vxlan1 to prove encapsulation health and symmetry during change windows.',
        keyConcept: 'Telemetry & Change Safety'
      },
      {
        level: 'Architecture',
        heading: 'Brownfield Guardrails',
        body: 'Stage EVPN RT schema and Anycast GW without ripping VLANs; run dual control planes briefly while validating per-VNI reachability and MTU.',
        keyConcept: 'Stage, Validate, Cutover'
      }
    ],
    referenceLinks: [
      { title: 'Arista Design Guide: VXLAN/EVPN Foundations', summary: 'Why VXLAN + EVPN replace STP and legacy flood-and-learn overlays.' },
      { title: 'RFC 7348 VXLAN', summary: 'Official encapsulation spec and control-plane expectations.' },
      { title: 'EOS Verified Designs: Cloud-Scale L2 DCI', summary: 'Validated underlay/overlay blueprints for inter-DC stretch.' },
      { title: 'VXLAN Troubleshooting Map', summary: 'Checks for VNI/VLAN mapping, MTU, IMET or flood-list coverage.' },
      { title: 'Preflight Checklist', summary: 'Validate MTU, loopback reachability, ECMP hashing, RT schema, and CoPP before turning up VNIs.' },
      { title: 'Change Window Template', summary: 'Pre/post snapshots, rollback script, success metrics (ping/trace, EVPN route counts, ARP/ND sanity).' }
    ],
    roleConfigs: [
      {
        role: 'Leaf VTEP (L2)',
        description: 'Maps VLANs to VNIs and handles L2 bridging over the IP underlay.',
        config: `interface vxlan1
   vxlan source-interface Loopback1
   vxlan udp-port 4789
   vxlan vlan 10 vni 10010
   vxlan vlan 20 vni 10020
!
interface Vlan10
   ip address virtual 10.10.10.1/24
!
interface Vlan20
   ip address virtual 10.20.20.1/24`
      },
      {
        role: 'Leaf VTEP (L3/Anycast GW)',
        description: 'Adds routed VRF services with per-VRF VNI.',
        config: `interface vxlan1
   vxlan vrf Prod vni 50001
   vxlan vrf Sec vni 50002
!
interface Vlan10
   vrf Prod
   ip address virtual 10.10.10.1/24
!
ip routing vrf Prod`
      },
      {
        role: 'Replication / BUM',
        description: 'Static flood-list alternative if EVPN is not present.',
        config: `interface vxlan1
   vxlan flood vtep 10.1.1.1 10.1.1.2 10.1.1.3
   vxlan multicast-group 239.10.10.10
!
interface Vlan10
   vxlan encapsulation ipv4
   ip address virtual 10.10.10.1/24`
      },
      {
        role: 'Preflight Checklist',
        description: 'Validate underlay and overlay preconditions before enabling VNIs.',
        config: `! Underlay reachability
ping 10.255.0.1 source Loopback0 repeat 5
traceroute 10.255.0.1 source Loopback0
!
! MTU + hashing
show int eth1-4 | inc MTU
show ip route 10.255.0.1
! Ensure ECMP hashing is symmetric (default)
!
! Control plane guardrails
show interfaces vxlan1 | inc 4789
show hardware counter drop asic | inc decap
!
! RT schema hygiene (EVPN deployments)
show bgp evpn route-type imet
show bgp evpn route-type macip
!`
      },
      {
        role: 'Validation / Proof Hooks',
        description: 'Capture evidence for change windows and RCA.',
        config: `! Encapsulation proof
tcpdump -ni vxlan1 udp port 4789 -c 50
!
! ARP/ND suppression sanity
show interface vxlan1 counters | inc arp-suppress
!
! EVPN state
show bgp evpn summary
show bgp evpn route-type macip
!
! Symmetry checks
tracepath -b -p 33434 10.10.10.50
!`
      },
      {
        role: 'Troubleshooting Map',
        description: 'Fast checks for blackholes, duplicate MAC, and flood issues.',
        config: `! Blackhole (missing RT-5)
show bgp evpn route-type ip-prefix | inc 10.10.10.0
!
! Duplicate MAC detection
show bgp evpn route-type macip mac-address 0011.2233.4455 detail
!
! MTU / fragmentation
ping 10.10.10.1 size 8972 df-bit source Loopback0
!
! Flood list / IMET
show bgp evpn route-type imet vni 10010
!
! VTEP reachability
show vxlan vtep
!`
      },
      {
        role: 'Safe Defaults (VXLAN/EVPN)',
        description: 'Baseline knobs to keep overlays stable and observable.',
        config: `interface vxlan1
   vxlan udp-port 4789
   vxlan source-interface Loopback1
!
hardware tcam
   system profile vxlan-routing
!
! CoPP for BGP/EVPN
router bgp 65001
   neighbor SPINES peer-group
   neighbor SPINES ebgp-multihop 2
   neighbor SPINES send-community extended
!
service routing protocols model multi-agent
logging event link-status global
!
! ERSPAN/sFlow ready
monitor session EVPN erspan ip-destination 10.10.200.10`
      },
      {
        role: 'Brownfield Cutover Steps',
        description: 'Stage EVPN alongside existing VLANs before moving gateways.',
        config: `1) Build underlay + loopback reachability (no overlay yet).
2) Define RT schema (VNIs, VRFs) and enable EVPN sessions.
3) Map VLANs to VNIs; keep legacy gateway active.
4) Validate EVPN routes (RT2/RT3/RT5) and Anycast GW MACs.
5) Move gateway IPs to Anycast; monitor ARP/ND + traffic symmetry.
6) Remove legacy flood/learn after validation and rollback timer.`
      }
    ]
  },
  EVPN: {
    id: 'evpn',
    name: 'EVPN',
    legacyTerm: 'LISP / OTV Control Plane',
    tagline: 'The Intelligent BGP Control Plane for Overlays.',
    description:
      'EVPN replaces flood-and-learn with a publish/subscribe MP-BGP control plane for MAC/IP reachability, enabling deterministic overlays with Anycast Gateways and all-active multi-homing.',
    keyBenefits: [
      'Anycast Gateway (VARP) for seamless mobility.',
      'ARP suppression cuts broadcast by up to 70%.',
      'All-active multi-homing (ESI) maximizes links.',
      'Cryptographic segmentation via VRF-Lite/EVPN.'
    ],
    cliTranslation: [
      { legacy: 'router lisp', arista: 'router bgp 65001' },
      { legacy: 'instance-id 101', arista: 'vlan 10' },
      { legacy: 'service ethernet...', arista: 'rd 1.1.1.1:10010' },
      { legacy: 'route-target export...', arista: 'route-target import/export evpn 10:10' }
    ],
    referenceLinks: [
      { title: 'RFC 7432 EVPN', summary: 'Control-plane route types and MAC/IP advertisement behavior.' },
      { title: 'Arista EVPN-ESI Deployment Guide', summary: 'All-active multi-homing (ESI) and DF election caveats.' },
      { title: 'EOS Anycast Gateway Whitepaper', summary: 'Designing stable Anycast SVIs with consistent ARP/ND.' }
    ],
    masteryPath: [
      {
        level: 'Foundation',
        heading: 'Overlay vs Underlay',
        body:
          'EVPN is the control plane (brain) while VXLAN is the data plane (body). Underlay IP reachability is mandatory for reliable overlays.',
        keyConcept: 'Control Plane vs Data Plane'
      },
      {
        level: 'Logic',
        heading: 'BGP Route Types',
        body:
          'RT2 advertises MAC/IP bindings, RT3 distributes BUM (IMET), RT5 advertises IP prefixes for L3 EVPN. Master these to debug reachability.',
        keyConcept: 'RT-2, RT-3, RT-5'
      },
      {
        level: 'Architecture',
        heading: 'ESI All-Active',
        body:
          'Ethernet Segment Identifiers allow a server to dual-home to two leaves with active-active forwarding, eliminating the peer-link dependency.',
        keyConcept: 'ESI & Split-Horizon'
      },
      {
        level: 'Architecture',
        heading: 'Route-Target Hygiene',
        body:
          'Standardize RT conventions (VLAN VNI: 10:10, VRF VNI: 50:001) and enforce import/export parity to avoid silent blackholes during brownfield migrations.',
        keyConcept: 'RT Discipline'
      }
    ],
    roleConfigs: [
      {
        role: 'Leaf (VTEP)',
        description:
          'Maps local VLANs to VNIs, advertises host reachability via MP-BGP, and provides Anycast Gateway for L2/L3 services.',
        config: `interface vxlan1
   vxlan source-interface Loopback1
   vxlan udp-port 4789
   vxlan vlan 10 vni 10010
   vxlan vrf Prod vni 50001
!
interface Vlan10
   vrf Prod
   ip address virtual 10.10.10.1/24
!
router bgp 65101
   router-id 1.1.1.1
   neighbor 2.2.2.2 remote-as 65000
   address-family evpn
      neighbor 2.2.2.2 activate
   vlan 10
      rd 1.1.1.1:10010
      route-target import evpn 10:10
      route-target export evpn 10:10
      redistribute learned`
      },
      {
        role: 'Spine (RR)',
        description: 'Reflects EVPN routes between leaves while running underlay routing.',
        config: `router bgp 65000
   bgp log-neighbor-changes
   neighbor 1.1.1.1 remote-as 65101
   neighbor 2.2.2.2 remote-as 65102
   address-family evpn
      neighbor 1.1.1.1 activate
      neighbor 1.1.1.1 route-reflector-client
      neighbor 2.2.2.2 activate
      neighbor 2.2.2.2 route-reflector-client`
      },
      {
        role: 'DCI / L3 EVPN',
        description: 'Extends VRFs between sites with RT5/IP prefix advertisements.',
        config: `router bgp 65101
   router-id 1.1.1.1
   neighbor 203.0.113.1 remote-as 65200
   address-family evpn
      neighbor 203.0.113.1 activate
   vrf Prod
      rd 1.1.1.1:50001
      route-target import evpn 50:1
      route-target export evpn 50:1
      redistribute connected
!
interface Vlan10
   vrf Prod
   ip address 10.10.10.1/24`
      }
    ]
  },
  MLAG: {
    id: 'mlag',
    name: 'MLAG',
    legacyTerm: 'VPC / Stackwise',
    tagline: 'Non-stop Layer2 Dual-Homing without Stack Dependence.',
    description:
      'Multi-Chassis Link Aggregation lets two independent switches act as a single logical LAG endpoint to downstream devices, keeping control planes independent while providing active-active connectivity.',
    keyBenefits: [
      'Active-active L2 without spanning tree blocking.',
      'Independent control planes—no chassis master/slave.',
      'Fast convergence on peer-link/keepalive failure.',
      'Simple operational model compared to stacking.'
    ],
    cliTranslation: [
      { legacy: 'vpc domain 10', arista: 'mlag configuration' },
      { legacy: 'peer-keepalive destination 10.0.0.2', arista: 'peer-address 10.0.0.2 vrf MGMT' },
      { legacy: 'vpc peer-link port-channel1', arista: 'peer-link port-channel1' },
      { legacy: 'interface port-channel10\n  vpc 10', arista: 'interface Port-Channel10\n   mlag 10' }
    ],
    referenceLinks: [
      { title: 'Arista MLAG Tech Brief', summary: 'Peer-link, keepalive, and consistency-check guidance.' },
      { title: 'EOS MLAG Operations Guide', summary: 'Upgrade/ISSU considerations and failover behaviors.' },
      { title: 'Design Note: MLAG vs EVPN ESI', summary: 'When to prefer MLAG for access vs ESI upstream.' },
      { title: 'MLAG Day-2 Runbook', summary: 'Peer-link failure drills, split-brain prevention, and reload ordering.' }
    ],
    masteryPath: [
      {
        level: 'Foundation',
        heading: 'Keepalive Discipline',
        body: 'Keepalive must be out-of-band (Mgmt VRF) and rate-limited to avoid false splits. No user traffic on keepalive link.',
        keyConcept: 'Control-plane safety'
      },
      {
        level: 'Logic',
        heading: 'Consistency Checks',
        body: 'EOS performs MLAG config checks on VLANs/ports. Fix mismatches before turn-up to prevent secondary from blocking.',
        keyConcept: 'Consistent VLAN/Port-Channel'
      },
      {
        level: 'Architecture',
        heading: 'ISSU & Upgrade',
        body: 'Upgrade one peer at a time; track traffic symmetry and LACP timers. Prefer fast LACP (1s) during maintenance.',
        keyConcept: 'Rolling Upgrades'
      }
    ],
    roleConfigs: [
      {
        role: 'Access LAG with MLAG',
        description: 'Standard dual-homed server/leaf with fast LACP timers.',
        config: `mlag configuration
   domain-id A
   local-interface Vlan4094
   peer-address 10.0.0.2
   peer-link Port-Channel1
!
interface Port-Channel10
   switchport mode trunk
   mlag 10
   lacp rate fast`
      }
    ]
  },
  "NVMe-oF": {
    id: 'nvmeof',
    name: 'NVMe-oF',
    legacyTerm: 'Fibre Channel / iSCSI',
    tagline: 'Lossless, low-latency storage fabrics over Ethernet.',
    description:
      'NVMe over Fabrics extends NVMe semantics across the network with microsecond latency. Deployments typically choose NVMe/RoCE v2 for ultra-low latency or NVMe/TCP for simpler operations on standard Ethernet. Success depends on consistent MTU, clear QoS/traffic-class policy, and observable queue behavior. NVMe-oF Overview: Protocol model and transport options (TCP/RDMA) with performance tradeoffs.',
    keyBenefits: [
      'NVMe semantics over IP: low latency with end-to-end visibility.',
      'Routable RDMA (RoCE v2) across leaf-spine without FC islands.',
      'Lossless class isolation with PFC + ECN to minimize storage drops.',
      'Deterministic bandwidth allocation via QoS/traffic classes.',
      'Clear evidence: monitor pause storms, ECN marks, and queue depth.'
    ],
    cliTranslation: [
      {
        legacy: '',
        arista: `show interfaces Ethernet1 | include MTU
show interfaces Ethernet1 counters | include drop|pause
show qos interfaces Ethernet1`
      },
      {
        legacy: '',
        arista: `show ip ecn
show queue-monitor length detail
show logging | include PFC`
      },
      {
        legacy: '',
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
show qos interfaces Ethernet1
show ip ecn
show queue-monitor length detail`
      },
      {
        role: 'Symptom Triage',
        description: 'Fast checks when storage latency or timeouts spike.',
        config: `1) Pause storms: show interfaces Ethernet1 counters | include pause
2) ECN marking: show ip ecn
3) Queue depth: show queue-monitor length detail
4) Optics health: show interfaces Ethernet1 transceiver details
5) Link errors: show interfaces Ethernet1 counters | include err|crc`
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
    }
  },
  MULTICAST: {
    id: 'multicast',
    name: 'Multicast (PIM/IGMP)',
    legacyTerm: 'PIM Dense/Anycast-RP (vendor-specific)',
    tagline: 'Deterministic multicast with Anycast-RP and fast failover.',
    description:
      'Arista EOS provides standards-based multicast with PIM Sparse Mode, Anycast-RP, and SSM. It emphasizes simple RPs, clear RPF paths, and modern telemetry for visibility.',
    keyBenefits: [
      'Anycast-RP with RFC-compliant MSDP or PIM Anycast for RP resilience.',
      'SSM (Source-Specific Multicast) to reduce state and security risks versus ASM.',
      'Deterministic RPF via underlay routing; easy troubleshooting with on-box flow tracing.',
      'Inline telemetry and packet capture (tcpdump) for verifying joins/flows.'
    ],
    cliTranslation: [
      { legacy: 'ip multicast-routing', arista: 'ip multicast-routing' },
      { legacy: 'ip pim rp-address 10.10.10.10', arista: 'ip pim rp-address 10.10.10.10' },
      { legacy: 'ip pim sparse-mode', arista: 'ip pim sparse-mode' },
      { legacy: 'ip pim anycast-rp 10.10.10.10 10.10.20.20', arista: 'ip pim anycast-rp 10.10.10.10 10.10.20.20' },
      { legacy: 'ip igmp snooping', arista: 'ip igmp snooping vlan 10' },
      { legacy: 'ip igmp static-group 239.1.1.1', arista: 'ip igmp static-group 239.1.1.1' }
    ],
    referenceLinks: [
      { title: 'RFC 7761 PIM-SM', summary: 'Core sparse-mode behaviors, RPF, and state handling.' },
      { title: 'Anycast-RP Deployment Note', summary: 'Designing resilient RPs with EOS (PIM Anycast + MSDP).' },
      { title: 'Multicast Troubleshooting Runbook', summary: 'Stepwise checks: RPF, joins, OIL, and data-plane captures.' }
    ],
    masteryPath: [
      {
        level: 'Foundation',
        heading: 'ASM vs SSM',
        body: 'Any-Source Multicast uses RPs and shared trees; SSM (232/8) avoids RPs and uses (S,G). Prefer SSM when possible.',
        keyConcept: 'SSM reduces state'
      },
      {
        level: 'Logic',
        heading: 'Anycast-RP',
        body: 'Multiple RPs share a virtual address. EOS supports PIM Anycast-RP; RPF uses unicast routing to the nearest RP.',
        keyConcept: 'RP Resilience'
      },
      {
        level: 'Architecture',
        heading: 'Troubleshooting Flow',
        body: 'Check IGMP joins on access, PIM state on leaf/spine, verify RPF, then validate (S,G) in forwarding table.',
        keyConcept: 'RPF & (S,G) state'
      }
    ],
    roleConfigs: [
      {
        role: 'Leaf (Access with IGMP Snooping)',
        description: 'Enforces IGMP snooping and proxies joins upstream.',
        config: `ip multicast-routing
!
vlan 10
   name VIDEO
!
interface Vlan10
   ip address 10.10.10.1/24
   ip pim sparse-mode
   ip igmp version 3
!
ip igmp snooping vlan 10`
      },
      {
        role: 'Anycast RP Core',
        description: 'Defines Anycast-RP and PIM on loopbacks/uplinks.',
        config: `interface Loopback0
   ip address 10.10.10.10/32
   ip pim sparse-mode
!
ip pim rp-address 10.10.10.10
ip pim anycast-rp 10.10.10.10 10.10.20.20
!
interface Ethernet1
   ip address 192.0.2.1/31
   ip pim sparse-mode`
      },
      {
        role: 'Spine/Leaf PIM underlay',
        description: 'Enable PIM on routed links; rely on underlay for RPF.',
        config: `ip multicast-routing
!
interface Ethernet1
   ip address 172.16.0.1/31
   ip pim sparse-mode
!
router bgp 65000
   address-family ipv4 multicast`
      },
      {
        role: 'SSM Leaf Validation',
        description: 'Validates SSM-only behavior to reduce RP reliance.',
        config: `ip pim ssm range 232.0.0.0/8
!
interface Vlan20
   ip address 10.20.20.1/24
   ip pim sparse-mode
   ip igmp version 3
!
show ip mroute 232.10.10.10
show ip pim interface`
      }
    ]
  },
  LINUX: {
    id: 'linux',
    name: 'Linux Fundamentals on EOS',
    legacyTerm: 'Bash Access',
    tagline: 'Native Linux access for deep troubleshooting.',
    description:
      'EOS runs on Fedora Linux; you can drop into bash for process, filesystem, and network introspection. This is the bridge between EOS CLI and the underlying OS.',
    keyBenefits: [
      'Full GNU toolkit (bash, ps, tcpdump, curl).',
      'Direct access to processes managed by ProcMgr.',
      'On-box automation via Python/eAPI without scraping.',
      'Visibility into namespaces, storage, and sensors.',
      'Rapid packet capture for live control/data-plane validation.'
    ],
    cliTranslation: [
      { legacy: 'enable\nbash', arista: 'bash' },
      { legacy: 'show process', arista: 'ps aux | grep ProcMgr' },
      { legacy: 'monitor session', arista: 'tcpdump -i et1 -n vlan 10' },
      { legacy: 'copy', arista: 'curl -O http://repo/image.swi' }
    ],
    masteryPath: [
      {
        level: 'Foundation',
        heading: 'Process View',
        body: 'Every EOS feature runs as a Linux process managed by ProcMgr. Bash access exposes them via standard tools.',
        keyConcept: 'ProcMgr & Agents'
      },
      {
        level: 'Logic',
        heading: 'Namespaces',
        body: 'VRFs map to Linux namespaces; use ip netns exec for accurate per-VRF visibility.',
        keyConcept: 'netns awareness'
      },
      {
        level: 'Architecture',
        heading: 'On-box Validation',
        body: 'Pair tcpdump with protocol labs (VXLAN/EVPN) to prove encapsulation, or curl/eAPI calls for automation smoke tests before rollout.',
        keyConcept: 'CLI ↔ Bash bridging'
      }
    ],
    roleConfigs: [
      {
        role: 'Packet Capture (VXLAN aware)',
        description: 'Capture encapsulated traffic in the correct namespace.',
        config: `bash
ip netns exec Prod tcpdump -i vxlan1 -nn udp port 4789 -c 50
ip netns exec Prod tcpdump -i Ethernet2 -nn vlan 10 -c 20`
      },
      {
        role: 'Process & Storage Health',
        description: 'Check ProcMgr and flash health before upgrades.',
        config: `bash
ps -ef | grep ProcMgr
df -h /
lsblk
sudo journalctl -xe | head`
      }
    ],
    referenceLinks: [
      { title: 'EOS Linux Internals', summary: 'Mapping EOS features to Linux processes and namespaces.' },
      { title: 'On-box Troubleshooting Recipes', summary: 'Tcpdump, ip netns exec, python -m json.tool for eAPI responses.' }
    ]
  }
};
