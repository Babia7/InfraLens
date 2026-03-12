import { ProtocolDetail } from './types';

export const VXLAN_PROTOCOL: ProtocolDetail = {
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
      'Validate underlay MTU end-to-end (≥9214 bytes on all fabric links) before enabling any VXLAN overlay — VXLAN adds 50 bytes of encapsulation overhead and Arista requires jumbo MTU on all fabric interfaces; mismatches cause silent black holes that are hard to diagnose.',
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
      { legacy: 'otv control-group 239.1.1.1', arista: 'vxlan source-interface Loopback1  ! Loopback1 = VTEP identity (separate from Loopback0 used as BGP router-ID)' },
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
show interfaces vxlan1 counters
show platform fap dropped packets | inc decap  ! Jericho/Jericho2 platforms (7050X3, 7060X5)
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
! IMPORTANT: TCAM profile change requires system reload to take effect
hardware tcam
   system profile vxlan-routing
!
! CoPP for BGP/EVPN
router bgp 65001
   neighbor SPINES peer-group
   neighbor SPINES ebgp-multihop 2  ! Only for eBGP overlay peering over loopbacks; remove for iBGP+RR design
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
        description: 'Enable EVPN ARP suppression on the VXLAN interface and verify the RT-2 MAC/IP cache is being used.',
        config: `! Enable ARP suppression on VXLAN interface (EOS 4.25+)
interface vxlan1
   vxlan arp-suppression
!
! ip proxy-arp is NOT needed for distributed Anycast GW (ip address virtual)
! EVPN ARP suppression intercepts ARP requests and answers from the RT-2 MAC/IP cache
! ip proxy-arp is only for legacy centralized gateway configurations
!
! Verify ARP cache is populated at VTEP from EVPN RT-2 routes
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
  }
