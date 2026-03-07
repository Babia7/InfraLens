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

export interface DCContextEntry {
  scale: string;
  topologyRole: string;
  keyConfig: string;
  highlight: 'leaf-spine' | 'isl' | 'host-edge' | 'border' | 'all';
}

export interface DCContext {
  small: DCContextEntry;
  medium: DCContextEntry;
  large: DCContextEntry;
}

export interface ProtocolDetail {
  id: string;
  name: string;
  legacyTerm: string;
  tagline: string;
  description: string;
  keyBenefits: string[];
  bestPractices?: string[];
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
  dcContext?: DCContext;
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
    bestPractices: [
      'Validate underlay MTU end-to-end (≥1600 bytes) before enabling any VXLAN overlay — MTU mismatches cause silent black holes that are hard to diagnose.',
      'Use a dedicated source loopback (Loopback1) for VXLAN, separate from the BGP router-ID loopback (Loopback0), to decouple data-plane identity from control-plane peering.',
      'Always pair VXLAN with an EVPN control plane in production; static flood-lists do not scale, have no MAC mobility, and require manual maintenance.',
      'Run `service routing protocols model multi-agent` before enabling EVPN — without it, EVPN address-family commands will be rejected silently on many EOS versions.',
      'Define VNI allocations from a documented schema before deployment (e.g. L2 VNI = 10000 + VLAN, L3/VRF VNI = 50000 + VRF index) to prevent RT collisions across sites.',
      'Use `ip address virtual` for all Anycast Gateway SVIs — unique per-switch addresses prevent consistent gateway behavior and break host mobility.',
      'Verify symmetric routing end-to-end: asymmetric IRB causes return traffic to miss the Anycast GW and creates intermittent connectivity failures under load.',
      'Take a snapshot (`show tech-support`, EVPN route counts, ARP table) before and after every change window to enable rapid rollback and RCA.'
    ],
    cliTranslation: [
      { legacy: 'feature otv', arista: 'interface vxlan1' },
      { legacy: 'otv control-group 239.1.1.1', arista: 'vxlan source-interface Loopback0' },
      { legacy: 'otv extend-vlan 10', arista: 'vxlan vlan 10 vni 10010' },
      { legacy: 'otv site-bridge-interface...', arista: 'vxlan flood vtep 1.1.1.1 2.2.2.2' },
      { legacy: 'mpls l2vpn bridge-domain / xconnect', arista: 'vxlan udp-port 4789\nno mac address-table learning vlan 10  ! disable data-plane learn; use EVPN' },
      { legacy: 'ip directed-broadcast (flood reduction)', arista: 'vxlan arp-suppression  ! proxy ARP at VTEP; cuts ARP floods across fabric' }
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
      },
      {
        level: 'Architecture',
        heading: 'Production Hardening',
        body: 'After cutover: enable ARP suppression, validate symmetric routing with tracepath from both directions, set up ERSPAN for continuous encapsulation visibility, and configure CloudVision snapshots on every change window. Limit default flooding with selective multicast or EVPN IMET replication lists.',
        keyConcept: 'ARP Suppression · ERSPAN · Snapshot'
      }
    ],
    primer: {
      title: 'VNI Allocation Schema',
      body: 'A consistent VNI numbering scheme prevents route-target collisions during DCI and simplifies operations. Common convention on Arista: L2 VNIs = 10000 + VLAN ID (e.g., VLAN 100 → VNI 10100), L3/VRF VNIs = 50000 + VRF index (e.g., VRF Prod index 1 → VNI 50001). Route targets follow the VNI: RT for L2 = 10:10100, RT for VRF = 50:50001. Document this schema in a spreadsheet before deployment and treat it as infrastructure topology — changes after go-live require coordinated RT updates across all VTEPs and DCI peers.'
    },
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
      },
      {
        role: 'ESI Multi-Homing',
        description: 'Dual-homed server/leaf using EVPN ESI all-active (preferred over MLAG for spine uplinks).',
        config: `! On both leaf peers (Leaf-A and Leaf-B)
interface Port-Channel10
   switchport trunk allowed vlan 10,20
   evpn ethernet-segment
      identifier 0010:0010:0010:0010:0010
      route-target import 00:10:00:10:00:10
   lacp system-id 0010.0010.0010
!
! Verify ESI on both leaves
show bgp evpn route-type ethernet-segment
show evpn esi`
      },
      {
        role: 'BGP Unnumbered Underlay',
        description: 'IPv6 link-local eBGP underlay — no IP addressing on p2p links, full ECMP.',
        config: `! Leaf
router bgp 65001
   neighbor SPINES peer group
   neighbor SPINES remote-as 65000
   neighbor SPINES maximum-routes 12000
   neighbor interface Ethernet1 peer-group SPINES
   neighbor interface Ethernet2 peer-group SPINES
   redistribute connected
!
! Spine
router bgp 65000
   neighbor LEAVES peer group
   neighbor LEAVES remote-as external
   neighbor interface Ethernet1 peer-group LEAVES
   neighbor interface Ethernet2 peer-group LEAVES
   neighbor LEAVES route-reflector-client`
      },
      {
        role: 'ARP Suppression + Validation',
        description: 'Enable ARP suppression per VNI and verify proxy ARP is active.',
        config: `! Enable ARP suppression on VXLAN interface (EOS 4.25+)
interface vxlan1
   vxlan arp-suppression
!
! Per-VNI arp-proxy (if using EVPN centralized gateway)
interface Vlan10
   ip proxy-arp
!
! Verify ARP cache is populated at VTEP
show vxlan address-table vni 10010
show arp vrf Prod
show interfaces vxlan1 counters | include arp-suppress`
      }
    ],
    dcContext: {
      small: {
        scale: '2-tier · 2 spines · 4 leaves · ≤ 200 hosts',
        topologyRole: 'VTEP on every leaf; VNI-per-VLAN; spines are pure L3 underlay',
        keyConfig: 'vxlan vlan 10 vni 10010',
        highlight: 'leaf-spine'
      },
      medium: {
        scale: '3-tier · 4 spines · 8–16 leaves · 2 pods',
        topologyRole: 'Anycast VTEP pairs per leaf pair; DCI via border-leaf; MTU ≥ 9214 end-to-end',
        keyConfig: 'ip address virtual 10.10.10.1/24  ! Anycast GW per pod',
        highlight: 'isl'
      },
      large: {
        scale: 'Multi-pod · super-spine · 32+ leaves · 10k+ hosts',
        topologyRole: 'Centralized VTEP on border-leaf for inter-pod; distributed VTEPs within pod',
        keyConfig: 'vxlan flood vtep learned  ! EVPN IMET-driven replication',
        highlight: 'border'
      }
    }
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
      'Policy-based logical segmentation via VRF-Lite/EVPN.'
    ],
    bestPractices: [
      'Always configure `send-community extended` on every EVPN BGP neighbor — omitting it silently drops all route-target extended communities and breaks the entire EVPN control plane with no error message.',
      'Peer EVPN sessions from a stable loopback (`update-source Loopback0`), not physical interfaces — physical interface flaps will reset EVPN sessions and cause traffic loss.',
      'Use iBGP with route-reflector-client for EVPN overlay peering on spines; never mix eBGP ASNs with route-reflector-client in the same session — route reflection is an iBGP-only concept.',
      'Standardize and document route-target conventions (e.g. L2 VNI RT = VNI:VNI, VRF RT = 50000+index:1) before deployment — ad-hoc RTs cause silent import/export mismatches during DCI or brownfield migrations.',
      'Enable `bgp log-neighbor-changes` on all EVPN speakers — session flaps are the most common source of MAC/IP withdrawal events and are otherwise invisible without logging.',
      'Prefer EVPN ESI all-active multi-homing over MLAG for leaf-to-spine uplinks where EVPN is already deployed — ESI eliminates the peer-link as a failure domain.',
      'After any topology change, verify RT-2, RT-3, and RT-5 route counts match expected values before declaring success — a missing route type is the most common symptom of a misconfigured import RT or missing redistribute learned.'
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
      },
      {
        level: 'Architecture',
        heading: 'ARP Suppression Mechanics',
        body: 'EVPN RT-2 routes carry host MAC+IP bindings. With ARP suppression enabled, the local VTEP intercepts ARP requests and responds with the cached binding — the request never crosses the VXLAN underlay. This is the dominant mechanism for reducing BUM traffic in mature EVPN deployments. Verify with: show vxlan address-table and show bgp evpn route-type macip detail.',
        keyConcept: 'Proxy ARP at VTEP'
      },
      {
        level: 'Architecture',
        heading: 'Type-5 Route Injection',
        body: 'RT-5 (IP Prefix Route) is the EVPN mechanism for advertising IP subnets between VRFs without requiring a MAC binding. It is used for: (1) inter-VRF routing where hosts in different VRFs need to communicate, (2) DCI prefix advertisement across sites, and (3) injecting external routes (redistributed from OSPF/BGP) into the EVPN fabric. Configure with redistribute connected/static inside the VRF BGP context.',
        keyConcept: 'RT-5 for L3 Prefix Reach'
      }
    ],
    overview: {
      title: 'EVPN Route Types Explained',
      intro: 'EVPN uses BGP route types (RTs) to carry different kinds of information. Each type serves a distinct purpose: RT-2 handles L2 host discovery, RT-3 handles BUM replication, RT-5 handles L3 prefix routing. Understanding which route type to look at when debugging a reachability problem cuts diagnosis time dramatically.',
      sections: [
        {
          title: 'RT-2 · MAC/IP Advertisement',
          body: 'Advertises a MAC address and its associated IP from the VTEP that learned it. Enables remote VTEPs to build ARP caches without flooding. A missing RT-2 means a host is not reachable by MAC or cannot get ARP responses.',
          bestFor: 'L2 reachability, ARP suppression, host mobility tracking.'
        },
        {
          title: 'RT-5 · IP Prefix Route',
          body: 'Advertises an IP prefix (not a MAC). Used for L3 routing between VRFs and DCI prefix distribution. An RT-5 is generated when you configure "redistribute connected" inside a VRF BGP context. No MAC is required.',
          bestFor: 'Inter-VRF routing, DCI L3 extension, external prefix injection.'
        }
      ],
      conclusion: 'Debug flow: missing host reachability → check RT-2 count. Missing subnet routing → check RT-5. Missing BUM replication → check RT-3 IMET routes. All three route types must be present and importing correctly on every VTEP that needs the service.'
    },
    primer: {
      title: 'BGP send-community — Why It Must Be There',
      body: 'EVPN route-targets are carried in BGP Extended Communities. By default, EOS (like most BGP implementations) does NOT send extended communities to neighbors — they are stripped on output. "send-community extended" is a per-neighbor command that re-enables Extended Community propagation. Without it, every BGP UPDATE from a leaf to a spine arrives with no route-targets attached. The spine has no idea which VNI or VRF the route belongs to and cannot reflect it correctly. The result: all EVPN sessions form, all routes are received, but zero traffic flows — and show bgp evpn shows routes with no RT attributes. This is the #1 cause of "EVPN is configured but nothing works" incidents in first-time deployments.'
    },
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
   neighbor 2.2.2.2 remote-as 65101
   neighbor 2.2.2.2 update-source Loopback0
   neighbor 2.2.2.2 send-community extended
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
        config: `router bgp 65101
   bgp log-neighbor-changes
   neighbor 1.1.1.1 remote-as 65101
   neighbor 1.1.1.1 update-source Loopback0
   neighbor 1.1.1.1 send-community extended
   neighbor 2.2.2.2 remote-as 65101
   neighbor 2.2.2.2 update-source Loopback0
   neighbor 2.2.2.2 send-community extended
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
   neighbor 203.0.113.1 send-community extended
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
   ip address virtual 10.10.10.1/24`
      },
      {
        role: 'Symmetric IRB',
        description: 'Symmetric IRB: traffic enters and exits via the gateway leaf — preferred for multi-VRF deployments. Both ingress and egress VTEPs hold the L3 SVI.',
        config: `! Symmetric IRB — both leaves act as L3 gateway for all VLANs
interface vxlan1
   vxlan vlan 10 vni 10010
   vxlan vrf Prod vni 50001
!
interface Vlan10
   vrf Prod
   ip address virtual 10.10.10.1/24
!
router bgp 65101
   vlan 10
      rd 1.1.1.1:10010
      route-target import evpn 10:10
      route-target export evpn 10:10
      redistribute learned
   vrf Prod
      rd 1.1.1.1:50001
      route-target import evpn 50:50001
      route-target export evpn 50:50001
      redistribute connected`
      },
      {
        role: 'ARP Suppression Debug',
        description: 'Validate ARP suppression is working and RT-2 MAC/IP bindings are present.',
        config: `! Check VTEP ARP table (should be populated from EVPN RT-2)
show vxlan address-table vni 10010
show bgp evpn route-type macip vni 10010 detail
!
! Confirm ARP suppress counters are incrementing
show interfaces vxlan1 counters | include suppress
!
! Verify local ARP proxy
show arp vrf Prod
!
! If host still flooding ARP, check:
show bgp evpn summary | include 0/0
! — zero received routes = send-community extended missing on peer`
      },
      {
        role: 'RT Debug & Troubleshoot',
        description: 'Systematically diagnose RT-2/3/5 import/export failures.',
        config: `! Count all route types — spot missing RTs immediately
show bgp evpn route-type mac-ip | count
show bgp evpn route-type imet | count
show bgp evpn route-type ip-prefix | count
!
! Check RT attributes on a specific route
show bgp evpn route-type mac-ip detail | head 40
!
! Verify import RT matches export RT
show bgp evpn route-type ip-prefix 10.10.10.0/24 detail
!
! Check neighbor session carries communities
show bgp neighbors 2.2.2.2 | include community
! Should show: Extended Community: yes`
      }
    ],
    dcContext: {
      small: {
        scale: '2-tier · 2 spines acting as RR · 4 leaves',
        topologyRole: 'eBGP underlay + EVPN AF on same session; spines are RR for RT-2/RT-5',
        keyConfig: 'neighbor SPINES activate  ! under address-family evpn',
        highlight: 'all'
      },
      medium: {
        scale: '3-tier · 4 dedicated RR spines · 8–16 leaves · 2 pods',
        topologyRole: 'Dedicated RR spines; per-pod iBGP optional; RT-2 and RT-5 across pods via border',
        keyConfig: 'bgp listen range 10.0.0.0/8 peer-group UNDERLAY remote-as external  ! dynamic peering',
        highlight: 'isl'
      },
      large: {
        scale: 'Multi-pod · super-spine RR hierarchy · 32+ leaves',
        topologyRole: 'Hierarchical BGP RR tiers; EVPN DCI via super-spine EVPN gateways',
        keyConfig: 'route-reflector-client  ! on super-spine for inter-pod EVPN',
        highlight: 'border'
      }
    }
  },
  MLAG: {
    id: 'mlag',
    name: 'MLAG',
    legacyTerm: 'VPC / Stackwise',
    tagline: 'Non-stop Layer 2 Dual-Homing without Stack Dependence.',
    description:
      'Multi-Chassis Link Aggregation lets two independent switches act as a single logical LAG endpoint to downstream devices, keeping control planes independent while providing active-active connectivity.',
    keyBenefits: [
      'Active-active L2 without spanning tree blocking.',
      'Independent control planes—no chassis master/slave.',
      'Fast convergence on peer-link/keepalive failure.',
      'Simple operational model compared to stacking.'
    ],
    bestPractices: [
      'Understand EOS MLAG split-brain behavior before adding `dual-primary detection`: when the peer-link goes down and the keepalive is reachable, EOS automatically disables the secondary\'s MLAG port-channels — this is built-in, no configuration required. `dual-primary detection delay <n> action errdisable all-interfaces` under `mlag configuration` adds a secondary safeguard using BFD-based heartbeats over uplinks to detect when both peers simultaneously believe they are primary (the true split-brain scenario, where both peer-link and keepalive are lost). Set the delay long enough for MLAG to naturally reconverge before the action fires (Arista recommends ≥10s; verify with `show mlag detail` to confirm the feature is active).',
      'Set `reload-delay mlag 300` and `reload-delay non-mlag 330` on standard fixed-config platforms (7050X3, 720XP, etc.). High-end platforms (7280R, 7500R, 7800R) default to 900s — always verify with `show mlag detail` before overriding, as a value too short causes post-boot black holes.',
      'Resolve every `show mlag config-sanity` warning before go-live. Arista explicitly states these must be rectified in production — mismatched VLANs, STP config, or port-channel modes cause one-way forwarding failures that are difficult to diagnose under load.',
      'Apply `lacp timer fast` on each Ethernet member interface (not on the Port-Channel) — the default slow timer means a link failure goes undetected for up to 90 seconds. Fast timers reduce detection to ~3 seconds (1s PDU interval × 3 missed PDUs). Note: `lacp rate fast` is Cisco IOS syntax and is not valid in EOS.',
      'On Arista EOS, when a MLAG member link fails, the ASIC redirects affected data-plane flows across the peer-link in hardware at line rate — there is no software reconvergence delay. This means the peer-link must handle the full redirected data traffic of the failed peer in addition to its normal MLAG control-plane sync (MAC/ARP table synchronization). Size the peer-link so its aggregate bandwidth matches the maximum active MLAG uplink capacity on one peer (e.g., 4×100G uplinks → peer-link ≥ 400G). Monitor with `show interfaces Port-Channel1 counters` — an unexpected traffic spike on the peer-link is the first indicator that a MLAG member link has gone inactive.',
      'Reserve MLAG for server and access-layer dual-homing in brownfield environments. For greenfield VXLAN/EVPN fabrics, prefer EVPN ESI All-Active multi-homing for downstream devices — ESI eliminates the peer-link requirement. Leaf-to-spine uplinks are always independent routed links in both models, not LAGs.'
    ],
    cliTranslation: [
      { legacy: 'vpc domain 10', arista: 'mlag configuration\n   domain-id FABRIC' },
      { legacy: 'peer-keepalive destination 10.0.0.2', arista: 'peer-address 10.0.0.2 vrf MGMT\n   ! OR: peer-address 10.255.0.2  (in-band via peer-link SVI)' },
      { legacy: 'vpc peer-link port-channel1', arista: 'peer-link Port-Channel1\n   reload-delay mlag 300\n   reload-delay non-mlag 330' },
      { legacy: 'interface port-channel10\n  vpc 10', arista: 'interface Port-Channel10\n   mlag 10\ninterface Ethernet1\n   channel-group 10 mode active\n   lacp timer fast' },
      { legacy: 'show vpc', arista: 'show mlag\nshow mlag detail' },
      { legacy: 'show vpc consistency-parameters', arista: 'show mlag config-sanity' },
      { legacy: 'show port-channel summary (NX-OS)', arista: 'show port-channel summary\nshow mlag interfaces' }
    ],
    referenceLinks: [
      { title: 'Arista MLAG Tech Brief', summary: 'Peer-link, keepalive, and consistency-check guidance.' },
      { title: 'EOS MLAG Operations Guide', summary: 'Upgrade/ISSU considerations and failover behaviors.' },
      { title: 'Design Note: MLAG vs EVPN ESI', summary: 'When to prefer MLAG for access vs ESI upstream.' },
      { title: 'MLAG Day-2 Runbook', summary: 'Peer-link failure drills, split-brain prevention, and reload ordering.' }
    ],
    masteryPath: [
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
      },
      {
        level: 'Architecture',
        heading: 'Reload-Delay Logic',
        body: 'reload-delay is the time an MLAG switch waits after boot before advertising itself as active. Without it, the switch starts forwarding before MLAG state is synchronized, causing transient black holes. The recommended value of 300s covers BGP reconvergence, MLAG state sync, and STP re-topology. Always set reload-delay on both peers, not just one.',
        keyConcept: 'reload-delay 300 mlag'
      },
      {
        level: 'Architecture',
        heading: 'MLAG vs ESI: Decision',
        body: 'Use MLAG when: downstream devices do not support EVPN ESI (servers, storage), you need L2-only dual-homing without BGP, or you have a small access layer under 10 MLAG domains. Use EVPN ESI all-active when: the fabric already runs EVPN, you want to eliminate the peer-link as a blast radius, or you need multi-site DCI with consistent multi-homing. Both can coexist: MLAG for access, ESI for leaf-to-spine uplinks.',
        keyConcept: 'MLAG = access · ESI = fabric'
      }
    ],
    overview: {
      title: 'MLAG Topology',
      intro: 'MLAG pairs two independent switches (PEER_A and PEER_B) to appear as a single logical switch to downstream LAG members. The peer-link carries synchronization and failover traffic. The keepalive is a heartbeat on a separate path. Both must be healthy for full MLAG operation.',
      sections: [
        {
          title: 'Peer-Link Role',
          body: 'The peer-link (typically Port-Channel1) carries: (1) control-plane synchronization (MAC/ARP tables, MLAG config), (2) data-plane traffic when one peer loses a MLAG member link. It must be over-provisioned — during failover it absorbs 100% of the failed peer\'s traffic.',
          bestFor: '100G or 2×10G LAG peer-link. Never use a single physical link.'
        },
        {
          title: 'Keepalive Role',
          body: 'The keepalive is a separate IP heartbeat between PEER_A and PEER_B management interfaces. It detects peer failure when the peer-link goes down. Without a healthy keepalive, a peer-link failure triggers split-brain prevention: one peer disables its MLAG port-channels to avoid forwarding duplicates.',
          bestFor: 'Dedicated management interface in MGMT VRF, not the peer-link VLAN.'
        }
      ],
      conclusion: 'MLAG summary: peer-link = data + state. keepalive = health only. Both must be sized and path-diverse. Test peer-link failure before production.'
    },
    primer: {
      title: 'Why MLAG Keepalive Matters More Than the Peer-Link',
      body: 'When the peer-link fails, both switches still have independent connectivity to the network. The keepalive determines which switch "wins" and stays active. Without keepalive, EOS cannot tell whether the peer is dead or the peer-link cable is just unplugged — so it fails safe and disables one peer\'s MLAG port-channels. If keepalive is running over the data network (not a dedicated mgmt path), a congestion event can suppress it, triggering a false split-brain and unnecessary traffic loss. The keepalive is a $0 insurance policy: a single management cable or out-of-band path prevents the most common MLAG operational failure mode.'
    },
    roleConfigs: [
      {
        role: 'Access LAG with MLAG',
        description: 'Dual-homed server with fast LACP timers. lacp timer fast is on Ethernet members, not the port-channel.',
        config: `! ── MLAG GLOBAL CONFIG ───────────────────────────────────────
mlag configuration
   domain-id FABRIC
   local-interface Vlan4094
   peer-address 10.0.0.2 vrf MGMT
   peer-link Port-Channel1
   reload-delay mlag 300
   reload-delay non-mlag 330
!
! ── MLAG PORT-CHANNEL (same ID on both peers) ─────────────────
interface Port-Channel10
   switchport mode trunk
   mlag 10
!
! ── ETHERNET MEMBERS — lacp timer fast goes here, not on PC ───
interface Ethernet3
   channel-group 10 mode active
   lacp timer fast
interface Ethernet4
   channel-group 10 mode active
   lacp timer fast`
      },
      {
        role: 'Peer-Link Config',
        description: 'Peer-link with trunk group isolation (MLAG VLAN only crosses peer-link) and MGMT VRF keepalive.',
        config: `! ── TRUNK GROUP: isolate MLAG VLAN to peer-link only ──────────
! VLAN 4094 only traverses Port-Channel1 (peer-link)
vlan 4094
   trunk group mlagpeer
!
! ── PEER-LINK port-channel ────────────────────────────────────
interface Port-Channel1
   switchport mode trunk
   switchport trunk group mlagpeer
   no spanning-tree portfast
!
! ── ETHERNET MEMBERS of peer-link ────────────────────────────
interface Ethernet1
   channel-group 1 mode active
interface Ethernet2
   channel-group 1 mode active
!
! ── MLAG keepalive SVI (in-band fallback; prefer MGMT VRF) ───
interface Vlan4094
   ip address 10.255.0.1/30
   no autostate
   no ip proxy-arp
!
! ── MLAG GLOBAL ───────────────────────────────────────────────
mlag configuration
   domain-id FABRIC
   local-interface Vlan4094
   peer-address 10.255.0.2
   ! Prefer MGMT VRF: peer-address 10.0.0.2 vrf MGMT
   peer-link Port-Channel1
   reload-delay mlag 300
   reload-delay non-mlag 330`
      },
      {
        role: 'Consistency Check',
        description: 'Validate MLAG config consistency between peers before go-live.',
        config: `! Run on both peers — mismatch = operational issue
show mlag config-sanity
show mlag detail
!
! Check MLAG interface state
show mlag interfaces
!
! Check for mismatched VLANs on port-channels
show interfaces Port-Channel10 trunk
!
! Verify LACP PDU exchange
show lacp counters Port-Channel10`
      },
      {
        role: 'MLAG Validation',
        description: 'Operational health checks after changes, failover testing, or go-live.',
        config: `! ── OVERALL MLAG STATE ───────────────────────────────────────
show mlag
! Key fields: State=active, Peer State=active, Peer link=Up
!
show mlag detail
! Shows: system-id, negotiated-primary/secondary, MLAG counts
!
! ── MLAG INTERFACE STATE ─────────────────────────────────────
show mlag interfaces
! Expect: all MLAG IDs show "active" local AND "active" peer
!
! ── PEER-LINK HEALTH ─────────────────────────────────────────
show interfaces Port-Channel1 status
show interfaces Port-Channel1 counters
! Watch for: input/output errors, drops — none acceptable on peer-link
!
! ── PORT-CHANNEL MEMBERSHIP ──────────────────────────────────
show port-channel summary
! Confirm: (P) flag on all member ports = bundled and active
! (I) = individual/not bundled — indicates LACP issue
!
! ── KEEPALIVE PATH ───────────────────────────────────────────
ping 10.255.0.2 vrf MGMT repeat 10
! Must be 100% — any loss is a pre-failure warning
!
! ── LACP STATE ───────────────────────────────────────────────
show lacp neighbor
! Confirm peer system ID matches expected MLAG system ID`
      },
      {
        role: 'MLAG Upgrade Runbook',
        description: 'Rolling MLAG upgrade: secondary first, validate re-sync, then primary.',
        config: `! ── PRE-UPGRADE HEALTH CHECKS (both peers) ──────────────────
show mlag                          ! state: active, peer: connected
show mlag detail                   ! note reload-delay values and primary/secondary
show mlag interfaces               ! all interfaces: active (local + peer)
show mlag config-sanity            ! must be clean — resolve any mismatch first
ping 10.255.0.2 vrf MGMT repeat 10 ! keepalive must be 100% success
show version                       ! confirm current EOS version on both peers
!
! ── STEP 1: IDENTIFY SECONDARY PEER ─────────────────────────
! Upgrade secondary first; primary absorbs all traffic during reload
! Confirm secondary via: show mlag detail | include negotiated
!
! ── STEP 2: RELOAD SECONDARY ─────────────────────────────────
! On secondary peer:
reload
! Secondary MLAG ports go errdisabled (reason: mlag-issu) — expected
! Primary now carries 100% of traffic; peer-link load increases
!
! ── STEP 3: MONITOR PRIMARY DURING SECONDARY RELOAD ─────────
show interfaces Port-Channel1 counters  ! no drops on peer-link
show mlag                               ! peer: disconnected = normal
!
! ── STEP 4: VALIDATE SECONDARY AFTER RETURN ──────────────────
! Wait for full reload-delay mlag period (default 300s fixed, up to
! 1200s on Trident-II, 600s on 7020/7280 Sand fixed)
! mlag-issu errdisabled clears automatically after reload-delay expires
show mlag                     ! state: active, peer: connected
show mlag interfaces          ! all MLAG IDs: active (local + peer)
show mlag detail              ! negotiated-state consistent
show port-channel summary     ! all members (P) flag
!
! ── STEP 5: RELOAD PRIMARY ───────────────────────────────────
! On primary peer:
reload
!
! ── STEP 6: POST-UPGRADE VALIDATION (both peers) ─────────────
show mlag
show mlag interfaces
show version                  ! confirm new EOS version on both
show mlag config-sanity       ! must remain clean
show lacp neighbor            ! confirm MLAG shared system-id intact`
      },
      {
        role: 'Preflight Checklist',
        description: 'Validate MLAG domain health before any change window or go-live.',
        config: `! ── 1. MLAG DOMAIN STATE ─────────────────────────────────────
show mlag
! Expected output:
!   State                 : active
!   Negotiated state      : active (primary or secondary)
!   Peer state            : active
!   Peer link             : Port-Channel1
!   Peer link status      : Up
! (Reload delay values are shown in: show mlag detail)
!
! ── 2. KEEPALIVE PATH ────────────────────────────────────────
ping 10.255.0.2 vrf MGMT repeat 20 timeout 1
! Must be 100% success — any loss = keepalive risk under load
! Also try: ping 10.255.0.2 vrf MGMT size 1500 df-bit  (MTU check)
!
! ── 3. CONFIG CONSISTENCY ────────────────────────────────────
show mlag config-sanity
! Must show: No global configuration inconsistencies found
!            No interface configuration inconsistencies found
!
! ── 4. MLAG INTERFACES ───────────────────────────────────────
show mlag interfaces
! All MLAG IDs must show:
!   local: active   peer: active
! Any "inactive" or "errdisabled" = blocking issue
!
! ── 5. PORT-CHANNEL MEMBERSHIP ───────────────────────────────
show port-channel summary
! Member ports must show (P) flag = bundled and forwarding
! (I) = individual = LACP not negotiated = investigate
!
! ── 6. LACP TIMER VERIFICATION ───────────────────────────────
show lacp neighbor
! Confirm LACP system-id is the MLAG shared system-id (same on both peers)
! LACP timer: check "Actor Timeout" = short (1s/fast) not long (30s/slow)
show lacp counters
! Confirm PDU RX counters incrementing on all MLAG member interfaces`
      },
      {
        role: 'Peer-Link Failure Drill',
        description: 'Safely test peer-link loss behavior (split-brain prevention) in a maintenance window.',
        config: `! ── PRE-DRILL BASELINE ───────────────────────────────────────
show mlag detail
! Note which peer is "negotiated primary" and which is "secondary"
! Primary = higher MLAG priority (lower number wins, default 32767)
show mlag interfaces         ! baseline: all MLAG IDs active
!
! ── SIMULATE PEER-LINK FAILURE ───────────────────────────────
! Shut peer-link on SECONDARY peer only
! (keepalive path must remain up on both peers throughout this drill)
interface Port-Channel1
   shutdown
!
! ── OBSERVE SPLIT-BRAIN PREVENTION ──────────────────────────
! On PRIMARY peer — should remain active and forward:
show mlag
! Expected: Peer link: Down, Peer link status: Inactive
!           State: active (primary retains MLAG port-channels)
!
! On SECONDARY peer — should disable MLAG port-channels:
show mlag
! Expected: State: active, but MLAG interfaces errdisabled
show mlag interfaces
! Expected: all MLAG IDs show errdisabled (peer-link down, no peer)
! Note: if keepalive is reachable, secondary disables ports (correct)
!       if keepalive is ALSO down, both peers stay active = split-brain
!
! ── RESTORE PEER-LINK ────────────────────────────────────────
interface Port-Channel1
   no shutdown
!
! MLAG re-syncs quickly (seconds) after peer-link restore — no reload-delay wait.
! reload-delay is a BOOT-TIME timer only; it does not apply to peer-link recovery.
show mlag
show mlag interfaces         ! all MLAG IDs must return to active within seconds
show mlag config-sanity      ! must be clean after restore`
      },
      {
        role: 'Troubleshooting Map',
        description: 'Common MLAG failure symptoms, root causes, and targeted show commands.',
        config: `! ── SYMPTOM: MLAG interfaces in "inactive" or "errdisabled" ──
show mlag interfaces
! Check "local" and "peer" columns — both must show "active"
! errdisabled reason "mlag-issu" = normal during reload-delay window
show mlag
! Check: Peer State (connected vs disconnected), Peer link (Up/Down)
show mlag config-sanity
! Non-empty output = config mismatch causing MLAG to hold interface
ping <peer-keepalive-ip> vrf MGMT repeat 10
! Loss here = keepalive failure → secondary disables MLAG ports
!
! ── SYMPTOM: One-way traffic through MLAG port-channel ───────
show mlag interfaces
! Look for "misconfig" flag in the local or peer column
show mlag config-sanity
! VLAN or port-mode mismatch on one peer = asymmetric forwarding
show interfaces Port-Channel<N> trunk
! Confirm allowed VLAN list is identical on both peers
!
! ── SYMPTOM: Peer-link carrying unexpectedly high traffic ────
show interfaces Port-Channel1 counters
! Rate spike = one MLAG port is inactive → all traffic via peer-link
show mac address-table | include Peer-Link
! Excess MACs via peer-link = asymmetric MAC learning / inactive port
show mlag interfaces
! Find which MLAG ID is "inactive" — trace back to config mismatch
!
! ── SYMPTOM: LACP PDU timeout / port-channel not bundling ────
show lacp counters
! RX PDU counter not incrementing = no PDUs arriving from far end
! Cause: far end configured slow LACP (30s default) vs fast (1s)
show lacp neighbor
! Compare system IDs — mismatch means MLAG system-ID not applied
! EOS MLAG overrides LACP system-ID; verify with: show mlag detail
!
! ── SYMPTOM: Config-sanity reports VLAN or mode mismatch ─────
show mlag config-sanity
! Shows: Feature | Attribute | Local Value | Peer Value
! Fix VLANs: ensure "switchport trunk allowed vlan" identical both peers
! Fix mode: ensure "switchport mode" identical on both port-channels`
      },
      {
        role: 'Split-Brain Recovery',
        description: 'Recover from an MLAG split-brain condition where both peers are independently active.',
        config: `! ── DETECT SPLIT-BRAIN ───────────────────────────────────────
! Both peers show "state: active" but peer link is down AND
! keepalive is also down — both peers are forwarding independently
show mlag
! Watch for: State: active, Peer: inactive, keepalive: down on BOTH
!
! ── STEP 1: RESTORE KEEPALIVE PATH FIRST ─────────────────────
! Restore OOB connectivity (mgmt cable, console) before peer-link
! Confirm keepalive reachable:
ping <peer-keepalive-ip> vrf MGMT
!
! ── STEP 2: BRING ONE PEER DOWN GRACEFULLY ───────────────────
! Disable MLAG on the secondary (lower priority) peer:
! On secondary:
mlag configuration
   no peer-link Port-Channel1  ! forces secondary into inactive
!
! ── STEP 3: RESTORE PEER-LINK ────────────────────────────────
interface Port-Channel1
   no shutdown
!
! ── STEP 4: RE-ENABLE MLAG ON SECONDARY ──────────────────────
mlag configuration
   peer-link Port-Channel1
!
! ── STEP 5: VERIFY FULL RECOVERY ─────────────────────────────
show mlag                   ! both peers active, peer: connected
show mlag interfaces        ! all MLAG IDs back to active
show mlag config-sanity     ! clean
show mac address-table      ! flush stale entries if needed: clear mac address-table dynamic`
      }
    ],
    dcContext: {
      small: {
        scale: '2-tier · 2-node MLAG core · 4 access leaves',
        topologyRole: 'MLAG core pair acts as spines; servers dual-home to core; peer-link on 40G/100G',
        keyConfig: 'mlag configuration\n   domain-id CORE\n   local-interface Vlan4094',
        highlight: 'isl'
      },
      medium: {
        scale: '3-tier · 8 MLAG leaf pairs · dedicated spines',
        topologyRole: 'MLAG per leaf pair for server active-active; each leaf pair shares MLAG domain',
        keyConfig: 'mlag configuration\n   peer-link Port-Channel1\n   reload-delay mlag 300',
        highlight: 'host-edge'
      },
      large: {
        scale: 'Multi-pod · MLAG at leaf only · ESI-LAG preferred',
        topologyRole: 'MLAG restricted to leaf pairs; spine-level redundancy via ECMP; ESI-LAG/EVPN preferred at scale',
        keyConfig: 'evpn ethernet-segment\n   identifier 0000:0001:0002  ! ESI-LAG replaces MLAG at scale',
        highlight: 'host-edge'
      }
    }
  },
  "NVMe-oF": {
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
  },
  MULTICAST: {
    id: 'multicast',
    name: 'Multicast (PIM/IGMP)',
    legacyTerm: 'PIM Dense Mode / Static RP',
    tagline: 'Deterministic multicast with Anycast-RP and fast failover.',
    description:
      'Arista EOS provides standards-based multicast with PIM Sparse Mode, Anycast-RP, and SSM. It emphasizes simple RPs, clear RPF paths, and modern telemetry for visibility.',
    keyBenefits: [
      'Anycast-RP with RFC-compliant MSDP or PIM Anycast for RP resilience.',
      'SSM (Source-Specific Multicast) to reduce state and security risks versus ASM.',
      'Deterministic RPF via underlay routing; easy troubleshooting with on-box flow tracing.',
      'Inline telemetry and packet capture (tcpdump) for verifying joins/flows.'
    ],
    bestPractices: [
      'Prefer SSM (232/8) over ASM wherever applications support IGMPv3 — SSM eliminates the RP entirely for source-known flows, drastically reduces multicast state, and removes the security risk of receivers joining any-source groups.',
      'Deploy Anycast-RP in redundant pairs with MSDP or PIM Anycast-RP inter-RP signaling — a single RP is a network-wide single point of failure for all multicast traffic.',
      'Enable IGMP snooping on every Layer 2 VLAN (`ip igmp snooping vlan X`) — without it, all multicast frames flood to every port in the VLAN, consuming bandwidth on non-subscribing hosts.',
      'Maintain a documented multicast group address allocation plan — unmanaged group sprawl leads to address collisions, unintended cross-VRF leakage, and very difficult RCA when traffic appears on unexpected ports.',
      'Treat RPF as the first check in any multicast black-hole investigation — the vast majority of multicast forwarding failures are caused by a missing or incorrect RPF entry in the unicast routing table, not a multicast configuration error.',
      'Configure `ip igmp version 3` on all access interfaces — IGMPv3 is required for SSM joins and provides per-source leave capability that reduces leave latency compared to IGMPv2.',
      'Collect `show ip pim neighbor`, `show ip mroute`, and `show ip igmp groups` as the standard first-response diagnostic set for any multicast incident — these three commands answer 90% of multicast troubleshooting questions.'
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
      },
      {
        level: 'Architecture',
        heading: 'IGMP Snooping Tuning',
        body: 'IGMP snooping without an IGMP Querier causes membership reports to stop flowing when there is no L3 device in the VLAN. Configure an IGMP snooping querier (ip igmp snooping querier) on the SVI to send periodic membership queries. Without a querier, subscriber ports age out after the IGMP membership timeout and multicast traffic stops — a common failure mode in pure L2 segments.',
        keyConcept: 'IGMP Querier required in L2 VLANs'
      },
      {
        level: 'Architecture',
        heading: 'VXLAN + Multicast Integration',
        body: 'When EVPN is deployed over VXLAN, BUM (broadcast/unknown unicast/multicast) traffic is handled by EVPN IMET (RT-3) routes driving ingress replication lists — not by underlay PIM multicast. PIM in VXLAN/EVPN fabrics is used only for customer overlay multicast (e.g., video multicast within a tenant VRF). If a customer VRF requires PIM, deploy it inside the VRF: ip multicast-routing vrf Prod, with PIM interfaces on the SVI and RP in the VRF routing table.',
        keyConcept: 'PIM in VRF for tenant multicast'
      }
    ],
    primer: {
      title: 'RPF: The Single Concept That Explains All Multicast Failure Modes',
      body: 'RPF (Reverse Path Forwarding) is the reason multicast packets arrive or do not arrive. Before forwarding a multicast packet, the router checks: "Does the source IP of this packet arrive via the interface I would use to reach it in the unicast routing table?" If yes, forward. If no, drop silently. This is why: (1) asymmetric routing breaks multicast — if the unicast path to the source goes out a different interface than the one the multicast packet arrived on, RPF fails. (2) Floating static routes and unequal ECMP break multicast. (3) The first thing to check in any multicast blackhole is show ip rpf <source-ip> — if the RPF interface is wrong, fix the unicast routing table, not the multicast config.'
    },
    overview: {
      title: 'PIM-SM Join & Data Path',
      intro: 'PIM Sparse Mode uses two phases: a shared tree (RPT) rooted at the Rendezvous Point for initial joins, followed by a Shortest Path Tree (SPT) switchover when the source begins sending. Understanding both paths is essential for diagnosing multicast reachability.',
      sections: [
        {
          title: 'ASM with RP (PIM-SM)',
          body: 'Receivers send IGMP joins to the last-hop router, which sends PIM (*, G) joins toward the RP. The source registers with the RP via PIM Register messages. Once source and receiver are both known to the RP, a shared tree (RPT) forms. After threshold traffic, the last-hop router may build an SPT directly to the source.',
          bestFor: 'Legacy applications not supporting SSM, broadcast video, trading floor data.'
        },
        {
          title: 'SSM (Source-Specific Multicast)',
          body: 'Receivers use IGMPv3 to specify both group AND source: (S, G). No RP is needed. PIM immediately builds an SPT directly from receiver to source. SSM eliminates the RP as a single point of failure and the security risk of anyone joining (*,G).',
          bestFor: 'Modern streaming apps, IP video, IPTV, financial market data feeds.'
        }
      ],
      conclusion: 'Default to SSM (232/8) with IGMPv3 for all new deployments. Reserve ASM for legacy applications that cannot be updated to send IGMPv3 joins. Anycast-RP is the standard RP design for all ASM deployments on Arista fabrics.'
    },
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
      },
      {
        role: 'IGMP Querier',
        description: 'Deploy IGMP snooping querier on L2 VLANs without an L3 gateway.',
        config: `! Required in L2-only VLANs where no SVI exists
ip igmp snooping querier
ip igmp snooping querier address 10.10.10.254
!
! Per-VLAN querier
ip igmp snooping querier vlan 10 address 10.10.10.254
!
! Verify querier is elected and sending queries
show ip igmp snooping querier
show ip igmp snooping groups vlan 10`
      },
      {
        role: 'Mroute Validation',
        description: 'Verify multicast state table is populated correctly after joins.',
        config: `! Check (*, G) and (S, G) entries
show ip mroute
show ip mroute 239.1.1.1 detail
!
! Check PIM neighbors (all routed links should show neighbor)
show ip pim neighbor
!
! Check RPF for a source
show ip rpf 10.10.10.100
!
! Check OIL (outgoing interface list)
show ip mroute 239.1.1.1 | include OIL
!
! Debug IGMP joins
debug ip igmp vlan 10`
      }
    ],
    dcContext: {
      small: {
        scale: '2-tier · single RP on spine · PIM-SM · ≤ 100 groups',
        topologyRole: 'Single RP on spine; PIM-SM for BUM in VXLAN multicast underlay; IGMP v2/v3 on leaves',
        keyConfig: 'ip pim rp-address 10.0.0.1\nip pim sparse-mode  ! on all L3 interfaces',
        highlight: 'leaf-spine'
      },
      medium: {
        scale: '3-tier · Anycast RP pair · PIM-SSM · video/storage groups',
        topologyRole: 'Anycast RP pair on spines for redundancy; PIM-SSM for video and storage apps; IGMP snooping on all leaves',
        keyConfig: 'ip pim anycast-rp 10.10.10.10 10.0.0.1\nip pim anycast-rp 10.10.10.10 10.0.0.2',
        highlight: 'isl'
      },
      large: {
        scale: 'Multi-pod · MSDP inter-pod · per-pod RP · 1k+ groups',
        topologyRole: 'MSDP between pods for inter-pod group propagation; per-pod RP; selective groups per VRF',
        keyConfig: 'ip msdp peer 10.1.0.1 connect-source Loopback0\nip msdp originator-id Loopback0',
        highlight: 'border'
      }
    }
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
    bestPractices: [
      'Always prefix diagnostic commands with `ip netns exec <vrf-name>` when working inside a VRF — standard Linux tools executed in the default namespace have no VRF awareness and will return empty or misleading results.',
      'Never make persistent configuration changes through the bash shell; use EOS CLI or CloudVision for all production configuration — bash changes bypass EOS configuration validation, rollback, and audit logging.',
      'Always pass `-c <count>` to `tcpdump` — runaway captures with no packet limit will fill flash storage, which can crash EOS processes and cause an unplanned reload.',
      'Avoid destructive Linux commands (`rm -rf`, `kill -9` on ProcMgr agents, `dd` to block devices) without explicit Arista TAC guidance — EOS process recovery from manual agent kills is not guaranteed.',
      'Prefer Python eAPI scripts over ad-hoc bash scripts for any automation that will run repeatedly — eAPI returns structured JSON, integrates with CI/CD, and supports dry-run validation before commit.',
      'Check flash utilisation (`df -h /`) before and after upgrades or extended troubleshooting sessions — large pcap files and accumulated log files are the most common and easily overlooked cause of flash exhaustion.',
      'Be aware that EOS AAA logging captures CLI commands but does not log all activity inside a bash session — enable syslog forwarding of bash history to a central collector for audit compliance in regulated environments.'
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
      },
      {
        level: 'Architecture',
        heading: 'VRF-Aware Debugging',
        body: 'EOS VRFs are Linux network namespaces. When you drop into bash, you are in the default namespace — the management VRF. Use "ip netns list" to see all VRF namespaces and "ip netns exec <vrf>" to run commands inside a specific VRF. This is the fundamental difference between bash on EOS and bash on a standard server: the routing table, ARP cache, and socket listeners are all namespace-specific.',
        keyConcept: 'ip netns exec <VRF>'
      },
      {
        level: 'Architecture',
        heading: 'Automation Scripting',
        body: 'EOS includes Python 3 and the eAPI JSON-RPC interface accessible at localhost. The pattern: use requests or the Arista pyeapi library to send EOS show/config commands and get structured JSON back. This enables on-box scripts that run at startup (event-handler), on a schedule (daemon), or triggered by EOS events (trigger). Combined with CloudVision configlets, on-box scripts become part of declarative fabric management.',
        keyConcept: 'pyeapi · event-handler · structured JSON'
      }
    ],
    overview: {
      title: 'EOS Linux Architecture',
      intro: 'EOS is Fedora Linux under the hood. Every EOS feature — BGP, OSPF, LLDP, STP — runs as an independent Linux process managed by ProcMgr. They communicate via SysDB, Arista\'s publish/subscribe state database. This architecture enables hitless agent restarts without clearing forwarding tables.',
      sections: [
        {
          title: 'ProcMgr & Agents',
          body: 'ProcMgr monitors all EOS agent processes. If an agent crashes, ProcMgr automatically restarts it. The agent re-subscribes to SysDB and recovers state without a protocol reconvergence event. Visible via: ps aux | grep -E "Bgp|Ospf|Lldp|ProcMgr".',
          bestFor: 'Understanding why EOS is more resilient than monolithic network OS.'
        },
        {
          title: 'SysDB & eAPI',
          body: 'SysDB is the in-memory state database that all agents read and write. The eAPI JSON-RPC endpoint at localhost:8765 provides direct read/write access to SysDB — enabling on-box automation, health checks, and event-driven scripts without SSH or CLI scraping.',
          bestFor: 'On-box automation, event-handler scripts, pre/post-change validation.'
        }
      ],
      conclusion: 'The bash shell on EOS is a diagnostic and automation surface, not a configuration surface. Use CLI or CVP for config. Use bash for deep inspection, packet capture, and on-box scripting.'
    },
    primer: {
      title: 'tcpdump Safety Rules on EOS Flash',
      body: 'Flash storage on EOS is typically 4-8 GB. A 10 Gbps interface running tcpdump without a packet count limit can fill flash in under 60 seconds, crashing EOS log writers and potentially triggering a reload. Always use: (1) -c <count> to limit packets (e.g., -c 100), (2) -w /tmp/capture.pcap to write to volatile memory instead of flash, (3) port filters to narrow the capture (tcpdump -nn port 4789 -c 100), and (4) tcpdump on a specific interface, never on "any" in production. The safest practice: capture to /tmp (RAM disk), copy off the switch with scp, then delete the file.'
    },
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
      },
      {
        role: 'VRF Namespace Debug',
        description: 'Inspect routing tables, ARP, and connectivity inside a specific VRF.',
        config: `bash
# List all VRF namespaces
ip netns list
!
# Routing table for VRF Prod
ip netns exec Prod ip route show
!
# ARP cache for VRF Prod
ip netns exec Prod arp -n
!
# Test connectivity from inside VRF
ip netns exec Prod ping -c 3 10.10.10.50
!
# Traceroute within VRF
ip netns exec Prod traceroute 10.10.10.50`
      },
      {
        role: 'Python eAPI Script',
        description: 'On-box eAPI automation using Python — get structured JSON from EOS.',
        config: `#!/usr/bin/env python3
# Save as /mnt/flash/check_bgp.py, run: bash python3 /mnt/flash/check_bgp.py
import json, urllib.request, base64

url = 'http://localhost/command-api'  # EOS eAPI default HTTP port 80
creds = base64.b64encode(b'admin:').decode()
payload = json.dumps({
    'jsonrpc': '2.0',
    'method': 'runCmds',
    'params': {'version': 1, 'cmds': ['show bgp summary'], 'format': 'json'},
    'id': 1
})
req = urllib.request.Request(url, payload.encode(), {
    'Content-Type': 'application/json',
    'Authorization': f'Basic {creds}'
})
resp = json.loads(urllib.request.urlopen(req).read())
peers = resp['result'][0]['vrfs']['default']['peers']
for peer, data in peers.items():
    print(f"{peer}: {data['peerState']} prefixes={data['prefixReceived']}")`
      },
      {
        role: 'Log Capture',
        description: 'Collect EOS logs and event history for incident analysis.',
        config: `bash
# Recent EOS events (last 100 lines)
sudo journalctl -u Bgp --no-pager | tail -100
!
# Search for BGP or interface events
sudo grep -i "bgp\|neighbor\|state" /var/log/messages | tail -50
!
# EOS event log (accessible from CLI too)
# show logging last 100
!
# Save logs to /tmp before copying off-switch
sudo journalctl --no-pager > /tmp/eos_journal.txt
scp admin@<switch>:/tmp/eos_journal.txt .`
      },
      {
        role: 'Flash Management',
        description: 'Safe flash cleanup before upgrades to ensure adequate free space.',
        config: `bash
# Check flash usage
df -h /
!
# Find large files
find /mnt/flash -size +50M -ls 2>/dev/null
!
# List EOS images
ls -lh /mnt/flash/*.swi 2>/dev/null
!
# Delete old images (keep current + 1 backup max)
# rm /mnt/flash/EOS-old.swi
!
# Truncate large log files safely
sudo truncate -s 0 /var/log/messages
!
# Check after cleanup
df -h /`
      }
    ],
    referenceLinks: [
      { title: 'EOS Linux Internals', summary: 'Mapping EOS features to Linux processes and namespaces.' },
      { title: 'On-box Troubleshooting Recipes', summary: 'Tcpdump, ip netns exec, python -m json.tool for eAPI responses.' }
    ],
    dcContext: {
      small: {
        scale: '2-tier · single switch · EOS bash + eAPI',
        topologyRole: 'ZTP script customization; on-box Python for day-1 automation; sysdb interaction via Bash',
        keyConfig: 'bash\npython3 /mnt/flash/ztp_init.py  ! ZTP on-box hook',
        highlight: 'host-edge'
      },
      medium: {
        scale: '3-tier · CloudVision + eAPI · multi-switch automation',
        topologyRole: 'CloudVision API for multi-switch config push; eAPI JSON for programmatic show commands; Python SDK',
        keyConfig: 'show version | json  ! eAPI: curl http://localhost/command-api',
        highlight: 'leaf-spine'
      },
      large: {
        scale: 'Multi-pod · gNMI/gRPC telemetry · Ansible + AVD at scale',
        topologyRole: 'CVP Telemetry streaming via gNMI; Ansible AVD for Day-2 config; gRPC for real-time state',
        keyConfig: 'management gnmi\n   provider eos-native\n   transport grpc default',
        highlight: 'all'
      }
    }
  },
  BGP: {
    id: 'bgp',
    name: 'BGP',
    legacyTerm: 'OSPF / IS-IS (DC Underlay)',
    tagline: 'The universal routing protocol for the data center and beyond.',
    description:
      'Border Gateway Protocol (BGP) has become the dominant underlay and overlay routing protocol in modern data centers. eBGP replaces OSPF/IS-IS for leaf-spine underlay routing; iBGP with route reflection drives EVPN overlays. BGP unnumbered eliminates IP address planning on point-to-point links. Mastering BGP path selection, communities, and graceful restart is foundational for any Arista SE.',
    keyBenefits: [
      'eBGP underlay scales to thousands of routers without flooding OSPF LSAs or IS-IS LSPs.',
      'BGP unnumbered eliminates IP address management on point-to-point links using IPv6 link-local.',
      'EVPN overlay uses iBGP with route reflectors — the same session carries both underlay and overlay.',
      'BFD (Bi-directional Forwarding Detection) provides sub-second failure detection independent of BGP hold timers.',
      'Graceful Restart and Long-Lived Graceful Restart (LLGR) maintain forwarding during BGP session resets.',
      'Route policies (route-maps, prefix-lists) enable fine-grained traffic engineering without touching the underlay.'
    ],
    bestPractices: [
      'Define a consistent ASN schema before deployment: spines use a single ASN (e.g., 65000), leaves use unique ASNs (65001-65999). This simplifies BGP policy and prevents AS_PATH loop detection issues.',
      'Always enable `bfd` on BGP sessions toward critical peers — BGP hold timers default to 90s/30s; BFD detects link failures in <1 second and triggers BGP session teardown immediately.',
      'Enable `graceful-restart` and `graceful-restart-helper` on all BGP speakers — during ISSU or BGP agent restart, forwarding continues using stale RIB entries while BGP reconverges.',
      'Use `maximum-paths 4 ecmp 4` on all leaf BGP sessions — without it, EOS installs only one next-hop per prefix, wasting 75% of available uplink bandwidth.',
      'Never use `redistribute connected` on spine BGP peers without a prefix-list filter — unfiltered redistribution advertises all connected subnets including management interfaces and loopbacks that should not be in the fabric routing table.',
      'Set `update-source Loopback0` on all iBGP EVPN sessions — physical interface flaps reset the BGP session, but loopback-based sessions survive link failures as long as any ECMP path to the loopback exists.',
      'Enable `bgp log-neighbor-changes` globally — BGP session events (up/down/reset) are the single most useful data point for correlating network events with application incidents.',
      'Use peer-groups to avoid per-neighbor configuration drift — define SPINES and LEAVES peer-groups with all shared attributes; add only the neighbor-specific parameters per-neighbor.'
    ],
    cliTranslation: [
      {
        legacy: '! OSPF area definition\nrouter ospf 1\n  area 0.0.0.0',
        arista: '! BGP ASN per device\nrouter bgp 65001\n   router-id 1.1.1.1'
      },
      {
        legacy: '! OSPF redistribute connected\nredistribute connected subnets',
        arista: '! BGP redistribute connected (with filter)\nredistribute connected route-map LEAF-CONNECTED'
      },
      {
        legacy: '! OSPF p2p link — requires /30 IPs\ninterface Ethernet1\n  ip address 192.0.2.1 255.255.255.252\n  ip ospf network point-to-point',
        arista: '! BGP unnumbered — no IPs needed on p2p link\ninterface Ethernet1\n   no switchport\n   ip address unnumbered Loopback0\n   ipv6 enable'
      },
      {
        legacy: '! OSPF fast-hello (sub-second)\nip ospf dead-interval minimal hello-multiplier 4',
        arista: '! BGP BFD fast detection\nrouter bgp 65001\n   neighbor SPINES bfd'
      }
    ],
    masteryPath: [
      {
        level: 'Foundation',
        heading: 'eBGP Underlay Basics',
        body: 'Each leaf uses a unique ASN. Each spine uses a shared ASN. Leaves form eBGP sessions to all spines over point-to-point links. Redistribute connected (loopbacks only) to advertise VTEP loopbacks. No OSPF, no IS-IS — just BGP.',
        keyConcept: 'Unique leaf ASN · shared spine ASN · eBGP over p2p'
      },
      {
        level: 'Logic',
        heading: 'BGP Unnumbered',
        body: 'BGP unnumbered uses IPv6 link-local addresses for BGP session formation — no /30 or /31 IPs needed on point-to-point links. EOS discovers neighbors via IPv6 ND and forms the BGP session. All IPv4 prefixes are still exchanged; only the transport is IPv6. Enables zero-touch fabric provisioning with AVD.',
        keyConcept: 'ip address unnumbered Loopback0 · ipv6 enable'
      },
      {
        level: 'Architecture',
        heading: 'iBGP Overlay with Route Reflection',
        body: 'EVPN uses iBGP — all devices share the same ASN for overlay peering. Spines act as Route Reflectors (RR): they reflect EVPN routes from any leaf to all other leaves. Without route reflection, every leaf must peer with every other leaf in a full mesh. The key config: neighbor <leaf> route-reflector-client on spines, and neighbor <spine> update-source Loopback0 + send-community extended on leaves.',
        keyConcept: 'iBGP RR on spine · send-community extended · update-source Lo0'
      },
      {
        level: 'Architecture',
        heading: 'BFD + Graceful Restart',
        body: 'BFD runs independently of BGP and detects link/path failures in 50-300ms depending on timer config. When BFD detects a failure, it notifies BGP immediately — the 90-second BGP hold timer is irrelevant. Graceful Restart preserves forwarding state during BGP agent restarts (ISSU, process crash). Long-Lived Graceful Restart (LLGR) extends preservation to minutes for satellite/WAN links.',
        keyConcept: 'BFD < 300ms · graceful-restart preserves RIB'
      }
    ],
    overview: {
      title: 'Why BGP Replaced OSPF in the DC',
      intro: 'OSPF and IS-IS flood topology state to every router in the area — a 1,000-switch fabric means every switch holds 1,000 LSAs and recomputes SPF on every link-state change. BGP is path-vector: each router only knows next-hops, not the full topology. Changes propagate as incremental updates, not full topology floods. BGP scales to internet size; OSPF does not.',
      sections: [
        {
          title: 'eBGP Underlay Topology',
          body: 'Leaf switches run eBGP sessions to their directly connected spine switches. Each leaf has a unique ASN; all spines share one ASN. Loopback addresses are redistributed into BGP for VTEP reachability. ECMP is enabled with maximum-paths. No RP, no DR, no OSPF area design.',
          bestFor: 'Leaf-spine data center fabrics from 4 switches to 4,000 switches.'
        },
        {
          title: 'iBGP EVPN Overlay',
          body: 'EVPN requires iBGP (all same ASN) so route-reflector-client works on spines. A separate address-family evpn section activates EVPN NLRI exchange. The same BGP session carries both IPv4 underlay prefixes and EVPN MAC/IP routes — just different address families.',
          bestFor: 'VXLAN/EVPN overlay on top of any eBGP or OSPF underlay.'
        }
      ],
      conclusion: 'For new Arista leaf-spine deployments: eBGP underlay with BGP unnumbered for zero-IP p2p links, iBGP EVPN with spine route reflectors for overlay. This is the Arista validated design standard and the starting point for all AVD templates.'
    },
    primer: {
      title: 'BGP Unnumbered: No IPs Required on Interfaces',
      body: 'Traditional BGP requires IP addresses on every point-to-point link — a 64-leaf, 4-spine fabric needs 256 /31 subnets just for underlay links. BGP unnumbered borrows the loopback IP and uses IPv6 link-local addresses for session establishment, eliminating all p2p IP address management. Config: interface Ethernet1 → no switchport → ip address unnumbered Loopback0 → ipv6 enable. Then in BGP: neighbor interface Ethernet1 peer-group SPINES. EOS uses the IPv6 link-local address discovered via IPv6 ND to form the BGP session. All IPv4 routes are still exchanged — only the transport is IPv6. AVD generates all BGP unnumbered configs from a simple inventory YAML file.'
    },
    roleConfigs: [
      {
        role: 'eBGP Leaf',
        description: 'Standard eBGP underlay leaf with peer-group and loopback redistribution.',
        config: `router bgp 65001
   router-id 1.1.1.1
   maximum-paths 4 ecmp 4
   !
   neighbor SPINES peer group
   neighbor SPINES remote-as 65000
   neighbor SPINES send-community extended
   neighbor SPINES maximum-routes 12000
   neighbor SPINES bfd
   !
   neighbor 10.0.0.1 peer group SPINES
   neighbor 10.0.0.3 peer group SPINES
   !
   redistribute connected route-map LOOPBACKS-ONLY
!
ip prefix-list LOOPBACKS-ONLY seq 10 permit 1.1.1.1/32
route-map LOOPBACKS-ONLY permit 10
   match ip address prefix-list LOOPBACKS-ONLY`
      },
      {
        role: 'eBGP Spine',
        description: 'Spine with eBGP underlay to leaves and iBGP route-reflection for EVPN overlay.',
        config: `router bgp 65000
   router-id 10.0.0.1
   maximum-paths 8 ecmp 8
   bgp log-neighbor-changes
   !
   neighbor LEAVES peer group
   neighbor LEAVES send-community extended
   neighbor LEAVES bfd
   neighbor LEAVES maximum-routes 12000
   !
   ! EVPN RR (iBGP to leaves)
   neighbor LEAVES-EVPN peer group
   neighbor LEAVES-EVPN remote-as 65000
   neighbor LEAVES-EVPN update-source Loopback0
   neighbor LEAVES-EVPN route-reflector-client
   neighbor LEAVES-EVPN send-community extended
   !
   address-family evpn
      neighbor LEAVES-EVPN activate`
      },
      {
        role: 'BGP Unnumbered',
        description: 'Zero-IP underlay using IPv6 link-local BGP sessions — AVD standard.',
        config: `! Leaf interface — no IP needed on p2p
interface Ethernet1
   no switchport
   ip address unnumbered Loopback0
   ipv6 enable
!
router bgp 65001
   neighbor SPINES peer group
   neighbor SPINES remote-as 65000
   neighbor SPINES maximum-routes 12000
   neighbor SPINES send-community extended
   !
   neighbor interface Ethernet1 peer-group SPINES
   neighbor interface Ethernet2 peer-group SPINES
   !
   redistribute connected
   !
   ! Verify unnumbered session
   ! show bgp neighbors | include BGP neighbor is`
      },
      {
        role: 'iBGP EVPN Leaf',
        description: 'Leaf EVPN iBGP peering to spine route reflectors.',
        config: `router bgp 65000
   router-id 1.1.1.1
   !
   ! iBGP EVPN peering (same ASN as spines)
   neighbor SPINE-RR peer group
   neighbor SPINE-RR remote-as 65000
   neighbor SPINE-RR update-source Loopback0
   neighbor SPINE-RR send-community extended
   !
   neighbor 10.0.0.1 peer group SPINE-RR
   neighbor 10.0.0.2 peer group SPINE-RR
   !
   address-family evpn
      neighbor SPINE-RR activate`
      },
      {
        role: 'BFD + Graceful Restart',
        description: 'Sub-second failure detection and hitless restart for BGP sessions.',
        config: `router bgp 65001
   graceful-restart
   graceful-restart-helper
   !
   neighbor SPINES bfd
   !
   ! Tune BFD timers (optional — default 300ms)
   ! bfd interval 100 min_rx 100 multiplier 3
!
! Verify BFD sessions
show bfd peers
show bgp neighbors 10.0.0.1 | include BFD|Hold|State`
      },
      {
        role: 'Route-Map Policy',
        description: 'Filter and manipulate BGP routes with prefix-lists and route-maps.',
        config: `! Allow only loopbacks from leaves
ip prefix-list LOOPBACKS seq 10 permit 0.0.0.0/0 le 32 ge 32
!
route-map LEAF-IN permit 10
   match ip address prefix-list LOOPBACKS
   set local-preference 100
!
route-map LEAF-IN deny 20
!
router bgp 65000
   neighbor LEAVES route-map LEAF-IN in
!
! Verify policy
show route-map LEAF-IN
show bgp neighbors 10.0.0.2 | include Policy`
      },
      {
        role: 'BGP Validation',
        description: 'Systematic BGP health checks: sessions, prefixes, ECMP paths.',
        config: `! Session state
show bgp summary
!
! Prefix count per neighbor
show bgp neighbors <ip> | include prefixes
!
! ECMP paths installed
show ip route 1.1.1.1 detail | include via
!
! Missing session — check timers
show bgp neighbors <ip> | include Hold|State|BGP
!
! EVPN route counts
show bgp evpn summary
show bgp evpn route-type mac-ip | count`
      },
      {
        role: 'BGP Graceful Restart Verify',
        description: 'Validate graceful restart is negotiated and stale routes are preserved during restart.',
        config: `! Verify GR negotiated with peers
show bgp neighbors | include Graceful|restart
!
! During BGP restart — stale routes visible
show ip route | include stale
!
! EVPN stale entries
show bgp evpn detail | include Stale
!
! Tune GR timer (default 300s)
router bgp 65001
   graceful-restart restart-time 300
   graceful-restart stalepath-time 300`
      }
    ],
    referenceLinks: [
      { title: 'RFC 4271 BGP-4', summary: 'Core BGP specification: path vector protocol, UPDATE messages, OPEN/KEEPALIVE/NOTIFICATION.' },
      { title: 'RFC 7938 BGP in DC', summary: 'IETF best practices for BGP in large-scale data centers — Arista follows this model.' },
      { title: 'Arista AVD BGP Design', summary: 'AVD-generated BGP unnumbered templates for leaf-spine fabrics.' },
      { title: 'BFD for BGP (RFC 5882)', summary: 'Sub-second failure detection for BGP neighbors.' }
    ],
    dcContext: {
      small: {
        scale: '2-tier · eBGP unnumbered · 2 spines · 4 leaves',
        topologyRole: 'eBGP unnumbered underlay; loopback peerings; optional RR on spines for EVPN overlay',
        keyConfig: 'neighbor interface Ethernet1 peer-group UNDERLAY\nbgp listen range 10.0.0.0/8 peer-group UNDERLAY remote-as external',
        highlight: 'leaf-spine'
      },
      medium: {
        scale: '3-tier · eBGP underlay + EVPN overlay · BFD on all peers',
        topologyRole: 'Dedicated spine ASNs; BFD on all BGP sessions; EVPN AF for RT-2/RT-5 overlay',
        keyConfig: 'neighbor SPINES bfd\naddress-family evpn\n   neighbor SPINES activate',
        highlight: 'isl'
      },
      large: {
        scale: 'Multi-pod · hierarchical eBGP · super-spine route policy',
        topologyRole: 'Leaf → spine → super-spine eBGP tiers; route policy at every boundary; prefix summarization per pod',
        keyConfig: 'route-map LEAF-OUT permit 10\n   set community 65000:100  ! tag by pod',
        highlight: 'border'
      }
    }
  },
  QOS: {
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
  },
  MACSEC: {
    id: 'macsec',
    name: 'MACsec',
    legacyTerm: 'IPsec / GRE tunnels',
    tagline: 'Wire-speed L2 encryption — zero latency, zero trust.',
    description:
      'MACsec (IEEE 802.1AE) encrypts Ethernet frames at the link layer — inside the ASIC forwarding pipeline at full line rate. Unlike IPsec, which adds overhead and latency at L3, MACsec operates transparently at L2 with no visible latency penalty. EOS supports both static CAK (pre-shared) and dynamic MKA (802.1X-based) key management on supported platforms.',
    keyBenefits: [
      'Wire-speed AES-128 or AES-256 encryption with GCM authentication — no CPU overhead.',
      'Link-layer encryption: protects against passive tapping on dark fiber, colo cross-connects, and IDF closets.',
      'MKA (MACsec Key Agreement) automates key rotation without manual intervention or traffic interruption.',
      'Replay protection using per-frame sequence numbers prevents man-in-the-middle injection attacks.',
      'Combines with EVPN segmentation for defense in depth: MACsec encrypts the link, EVPN segments the fabric.',
      'Supported on Arista 7050X4/7280R3/7500R3 and select campus platforms with ASIC-offloaded encryption.'
    ],
    bestPractices: [
      'Deploy MACsec selectively on high-risk links: dark fiber DCI connections, colo cross-connects, and IDF closets with physical access risk — blanket deployment on all links creates key management overhead without proportional security value.',
      'Use AES-256-GCM-XPN for FIPS 140-2 Level 2 compliance (government, DoD, regulated financial environments) — AES-128-GCM is sufficient for most enterprise deployments.',
      'Never configure MACsec fallback to an unprotected association in regulated environments — if the MACsec session fails to establish, fallback to clear-text is a compliance violation.',
      'Verify replay protection window size matches your network jitter — too small a window causes legitimate out-of-order frames to be dropped; too large reduces protection against replay attacks.',
      'Test MACsec configuration with show mac security interfaces and show mac security counters before enabling on production links — a misconfigured cipher suite or key mismatch causes link traffic to drop silently.',
      'For inter-switch MACsec on 400G ZR/ZR+ coherent links, verify platform support — some coherent transport ASICs have MACsec offload constraints at 400G line rate.',
      'Document CAK key material in a secure vault and establish a key rotation procedure — lost CAK keys require a maintenance window to replace and force a link reset.'
    ],
    cliTranslation: [
      {
        legacy: '! IPsec: define transform-set\ncrypto ipsec transform-set MYXFORM esp-aes esp-sha-hmac',
        arista: '! MACsec: define profile with cipher suite\nmac security\n   profile MACSEC-PROFILE\n      cipher aes128-gcm'
      },
      {
        legacy: '! IPsec: crypto map + apply to interface\ncrypto map MYMAP 10 ipsec-isakmp\ninterface Gig0/0\n  crypto map MYMAP',
        arista: '! MACsec: apply profile to interface\ninterface Ethernet1\n   mac security profile MACSEC-PROFILE'
      },
      {
        legacy: '! IPsec: show crypto session\nshow crypto ipsec sa\nshow crypto session',
        arista: '! MACsec: show sessions\nshow mac security\nshow mac security interfaces\nshow mac security counters'
      }
    ],
    masteryPath: [
      {
        level: 'Foundation',
        heading: '802.1AE Basics',
        body: 'MACsec (IEEE 802.1AE) encrypts the payload of each Ethernet frame between two directly connected devices. The MAC header is not encrypted (needed for switching), but the EtherType field is replaced with MACsec EtherType (0x88E5) and a Security Tag (SecTAG) is added. The payload (IP packet) is encrypted with AES-GCM and authenticated with a GCM tag.',
        keyConcept: 'L2 frame encryption · AES-GCM · SecTAG'
      },
      {
        level: 'Logic',
        heading: 'MKA Key Exchange',
        body: 'MACsec Key Agreement (MKA, IEEE 802.1X-2010) manages key distribution. Two long-term keys: CAK (Connectivity Association Key, pre-shared or 802.1X-derived) and CKN (Connectivity Key Name, the CAK identifier). From these, SAKs (Secure Association Keys) are derived per-session and rotate automatically. CAK never traverses the wire — only derived session SAKs do. Key rotation is transparent to traffic.',
        keyConcept: 'CAK → SAK derivation · automatic rotation'
      },
      {
        level: 'Architecture',
        heading: 'EOS Config Patterns',
        body: 'EOS MACsec config: (1) Define a profile under "mac security": cipher suite, key, fallback policy. (2) Apply the profile to the interface. (3) Verify with "show mac security interfaces". Static CAK is simplest; MKA with 802.1X is preferred for automated key management at scale. Both options are in the mac security CLI hierarchy.',
        keyConcept: 'mac security → profile → cipher → key → interface'
      },
      {
        level: 'Architecture',
        heading: 'Compliance & Cipher Selection',
        body: 'For FIPS 140-2 compliance: use AES-256-GCM-XPN (Extended Packet Numbering for 400G+ links). For PCI-DSS: document cipher suite, key length, and replay window as evidence of encryption controls. For NDA-protected DC links: MACsec + EVPN VRF segmentation + NDR monitoring creates a three-layer defense. Replay window size: set to 32 for low-jitter links, 64 for long-haul or high-latency paths.',
        keyConcept: 'AES-256-GCM-XPN · FIPS 140-2 · replay-window 32'
      }
    ],
    overview: {
      title: 'Where MACsec Fits in the Security Stack',
      intro: 'MACsec fills the link-layer encryption gap between physical security and IP-level encryption. It operates between two directly connected devices — it cannot traverse a router or L3 hop. This makes it ideal for specific deployment scenarios where physical access risk exists on the cable path.',
      sections: [
        {
          title: 'MACsec vs IPsec',
          body: 'IPsec encrypts L3 packets, can traverse multiple hops, requires CPU or dedicated crypto hardware, and adds latency. MACsec encrypts L2 frames, works only hop-by-hop, runs in the ASIC at line rate with zero latency, and requires no CPU. Use MACsec for DC fabric links; use IPsec for WAN/VPN where multi-hop encryption is required.',
          bestFor: 'Dark fiber DCI links, colo cross-connects, IDF closets, leaf-spine inter-switch links in regulated environments.'
        },
        {
          title: 'Deployment Decision Matrix',
          body: 'Deploy MACsec when: (1) cable path has uncontrolled physical access (colo, leased fiber), (2) compliance mandate requires link encryption (FedRAMP, PCI-DSS, HIPAA PHI transport), (3) insider threat model includes physical tap risk. Do not deploy when: cost of key management exceeds risk reduction (all-trusted internal DC), or platform does not support hardware offload.',
          bestFor: 'Risk-based selection: colocation, regulated industries, government, financial services DCI.'
        }
      ],
      conclusion: 'MACsec is a point-to-point control. Combine it with EVPN segmentation (VRF isolation), MSS micro-segmentation, and NDR monitoring for layered network security. MACsec alone does not protect against insider threats at the OS layer — it only protects the wire.'
    },
    primer: {
      title: 'CAK vs SAK: The Two Keys of MACsec',
      body: 'MACsec uses a two-level key hierarchy. The CAK (Connectivity Association Key) is the long-term secret — either pre-configured on both switches (static CAK) or distributed via 802.1X authentication. The CAK never appears in clear text on the wire. From the CAK, EOS derives the SAK (Secure Association Key) for each session using NIST-approved KDF. The SAK is the actual encryption key applied to each frame. SAKs rotate periodically (default every 2^32 frames or configurable timer) without traffic interruption — the MKA protocol negotiates a new SAK and both sides switch simultaneously. The security model: even if an attacker captures all encrypted frames, they cannot decrypt them without the CAK; even if they somehow obtain one SAK, it decrypts only frames from that rotation window.'
    },
    roleConfigs: [
      {
        role: 'Static CAK Config',
        description: 'Pre-shared CAK MACsec — simplest deployment, no 802.1X infrastructure required.',
        config: `! Define MAC security profile with static CAK
mac security
   profile MACSEC-DC
      cipher aes128-gcm
      key 0 1234567890ABCDEF1234567890ABCDEF fallback
      mka key-server priority 255
      replay protection window-size 32
!
! Apply to inter-switch link
interface Ethernet1
   mac security profile MACSEC-DC
!
! Verify session established
show mac security interfaces Ethernet1
show mac security counters Ethernet1`
      },
      {
        role: 'MKA Dynamic Config',
        description: 'MKA with automatic SAK rotation — preferred for production environments.',
        config: `mac security
   profile MACSEC-MKA
      cipher aes128-gcm
      ! CAK in hex (minimum 32 hex chars for AES-128)
      key 01 3132333435363738313233343536373831323334353637383132333435363738
      mka session rekey-period 0   ! Rekey on counter rollover
      replay protection window-size 32
!
interface Ethernet1
   mac security profile MACSEC-MKA
!
! Verify MKA session and SAK rotation
show mac security
show mac security interfaces
show mac security detail`
      },
      {
        role: 'AES-256 FIPS Mode',
        description: 'AES-256-GCM-XPN for FIPS 140-2 and high-speed (400G) link compliance.',
        config: `mac security
   profile MACSEC-FIPS
      cipher aes256-gcm-xpn
      key 0 <64-hex-char-cak> fallback
      mka key-server priority 255
      replay protection window-size 64
      ! No fallback to no-encryption
!
interface Ethernet1
   mac security profile MACSEC-FIPS
!
! Confirm cipher negotiated
show mac security interfaces Ethernet1 | include cipher|AES`
      },
      {
        role: 'Fallback Policy',
        description: 'Configure behavior when MACsec fails to establish — allow or deny traffic.',
        config: `mac security
   profile MACSEC-STRICT
      cipher aes128-gcm
      key 0 1234567890ABCDEF1234567890ABCDEF
      ! No fallback line = block traffic if MACsec fails
!
! Compare: permissive fallback (unencrypted allowed)
mac security
   profile MACSEC-PERMISSIVE
      cipher aes128-gcm
      key 0 1234567890ABCDEF1234567890ABCDEF fallback
!
! Check if traffic is flowing encrypted or as fallback
show mac security interfaces Ethernet1 | include Secure|Fallback`
      },
      {
        role: 'MACsec Verification',
        description: 'Validate MACsec session state, counters, and troubleshoot common issues.',
        config: `! Full MACsec status
show mac security
show mac security interfaces
!
! Detailed session state and cipher
show mac security detail
!
! Frame counters (encrypted frames should increment)
show mac security counters
!
! Common failure: key mismatch
! — show mac security will show 'MKA-Failed' or 'CAK-Mismatch'
! Fix: ensure identical CAK hex string on both ends
!
! Common failure: cipher mismatch
! — both ends must configure identical cipher suite
show mac security interfaces | include cipher`
      },
      {
        role: 'Compliance Documentation',
        description: 'Evidence template for regulated environments (PCI-DSS, HIPAA, FedRAMP).',
        config: `! Evidence checklist for MACsec compliance audit:
!
! 1. Cipher suite: AES-128-GCM or AES-256-GCM-XPN
show mac security interfaces | include cipher
!
! 2. Replay protection enabled
show mac security detail | include replay
!
! 3. Session state: Secured (not fallback)
show mac security interfaces | include Secured
!
! 4. Key rotation occurring
show mac security counters | include SAK
!
! 5. No unencrypted fallback in regulated interfaces
! (verify profile has no 'fallback' keyword)
show running-config | section mac.security
!
! 6. Encrypt inter-site and colo links
! Document: which interfaces protected, cipher, rotation period`
      }
    ],
    referenceLinks: [
      { title: 'IEEE 802.1AE MACsec Standard', summary: 'Core specification for frame encryption, SecTAG structure, and GCM-AES cipher.' },
      { title: 'IEEE 802.1X-2010 MKA', summary: 'Key agreement protocol — CAK/SAK management and automatic rotation.' },
      { title: 'Arista MACsec Configuration Guide', summary: 'Platform support matrix, EOS config examples, and FIPS compliance notes.' },
      { title: 'MACsec vs IPsec Comparison', summary: 'Use-case decision guide for link-layer vs network-layer encryption.' }
    ],
    dcContext: {
      small: {
        scale: '2-tier · MACsec on spine↔leaf ISL · GCM-AES-128',
        topologyRole: 'MACsec on all spine-to-leaf ISL links; CAK pre-shared via EOS keychain; GCM-AES-128',
        keyConfig: 'mac security profile ISL-MACSEC\n   cipher aes128-gcm\n   key 0 <cak> ckn <ckn>',
        highlight: 'isl'
      },
      medium: {
        scale: '3-tier · MACsec on all ISL + border uplinks · RADIUS CAK',
        topologyRole: 'MACsec on all ISL and DCI/border uplinks; CAK distributed via RADIUS for centralized management',
        keyConfig: 'mac security profile BORDER-MACSEC\n   cipher aes256-gcm-xpn\n   mka policy MKA-STRICT',
        highlight: 'border'
      },
      large: {
        scale: 'Multi-pod · MACsec everywhere · automated SAK rotation · CKMS',
        topologyRole: 'MACsec on ISL, host NIC-to-leaf, and DCI; automated SAK rotation; CKMS for centralized key management',
        keyConfig: 'mka policy MKA-CKMS\n   key-server priority 16\n   sak-rekey interval 3600',
        highlight: 'all'
      }
    }
  }
};
