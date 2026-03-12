import { ProtocolDetail } from './types';

export const BGP_PROTOCOL: ProtocolDetail = {
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
  }
