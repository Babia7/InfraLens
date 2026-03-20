import { ProtocolDetail } from './types';

export const BGP_PROTOCOL: ProtocolDetail = {
  id: 'bgp',
  name: 'BGP',
  legacyTerm: 'OSPF / IS-IS (DC Underlay)',
  tagline: 'The universal routing protocol for the data center and beyond.',
  description:
    'Border Gateway Protocol (BGP) is the dominant routing protocol for modern IP fabrics. In Arista designs, eBGP underlay with unique leaf ASNs and a shared spine ASN is the standard L3LS model — adjacency boundaries stay explicit, failure domains are clear, and underlay proof is fast. MP-BGP EVPN overlays add tenant state without collapsing the two routing problems into one. For large multi-pod fabrics, 4-byte private ASNs (4200000000–4294967294) provide a far larger namespace than the 2-byte private range. At the internet edge, BGP Session Security (GTSM + MD5) and strict inbound/outbound route policy at the border leaf are non-optional. Mastering path selection, BGP timers, convergence optimization, and internet edge policy is foundational for reliable operations at any scale.',

  keyBenefits: [
    'eBGP underlay scales to thousands of routers without flooding OSPF LSAs or IS-IS LSPs.',
    'BGP unnumbered eliminates IP address management on point-to-point links using IPv6 link-local.',
    'EVPN overlay uses iBGP with route reflectors — the same session carries both underlay and overlay.',
    'BFD (Bi-directional Forwarding Detection) provides sub-second failure detection independent of BGP hold timers.',
    'Graceful Restart and Long-Lived Graceful Restart (LLGR) maintain forwarding during BGP session resets.',
    'Route policies (route-maps, prefix-lists) enable fine-grained traffic engineering without touching the underlay.',
    'Border leaf model isolates all external eBGP sessions at the edge — internal spine and leaf switches never peer directly with ISPs, preserving fabric-internal routing integrity.'
  ],

  bestPractices: [
    'Define a consistent ASN schema before deployment: spines use a single ASN (e.g., 65000), leaves use unique ASNs (65001–65999). For large multi-pod fabrics, use 4-byte private ASNs (4200000000–4294967294) — the 2-byte range (65001–65535) has only 535 usable values and can exhaust in large multi-pod fabrics with per-leaf ASN assignment.',
    'Always enable `bfd` on BGP sessions toward critical peers — BGP hold timers default to 180s; BFD detects link failures in <1 second and triggers BGP session teardown immediately.',
    'When BFD is not deployed on a BGP session, reduce timers from the default (60s keepalive / 180s hold) to 5s/15s: `neighbor <peer-group> timers 5 15` — the defaults are far too slow for DC failure detection. Do not tune below 5/15 without validating physical link stability.',
    'Enable `graceful-restart` and `graceful-restart-helper` on all BGP speakers — during ISSU or BGP agent restart, forwarding continues using stale RIB entries while BGP reconverges.',
    'Use `maximum-paths` that matches the actual fabric width — leaf = number of spine uplinks, spine = platform maximum (32, 64, or 128). A default number that does not reflect real topology silently fails to install ECMP and wastes uplink capacity.',
    'Replace hard `maximum-routes` limits with the warning-only pattern: `neighbor <peer-group> maximum-routes 15000 warning-limit 80 percent warning-only` — a hard limit abruptly tears the BGP session at the limit with no advance warning, causing an outage. The warning-only pattern logs at 80% and gives operators time to respond.',
    'Enable `update wait-install` on both leaf and spine — this prevents BGP from advertising a route to peers before the hardware ASIC has programmed it, avoiding forwarding black holes during convergence.',
    'Enable `update wait-for-convergence` on spine only — prevents the spine from programming hardware or advertising routes until a full convergence event resolves. Do not configure on leaf — it delays leaf forwarding unnecessarily.',
    'Use spine p2p prefix aggregation: `aggregate-address 10.120.240.0/24 summary-only` on each spine to suppress individual /31 p2p entries from the RIB. Each spine owns a contiguous /24 block of p2p addresses.',
    'Never use `redistribute connected` on spine BGP peers without a prefix-list filter — unfiltered redistribution advertises all connected subnets including management interfaces and loopbacks that should not be in the fabric routing table.',
    'Set `update-source Loopback0` on all iBGP EVPN sessions — physical interface flaps reset the BGP session, but loopback-based sessions survive link failures as long as any ECMP path to the loopback exists.',
    'Enable `bgp log-neighbor-changes` globally — BGP session events (up/down/reset) are the single most useful data point for correlating network events with application incidents.',
    'Use peer-groups to avoid per-neighbor configuration drift — define SPINES and LEAVES peer-groups with all shared attributes; add only the neighbor-specific parameters per-neighbor.',
    'On internet-facing eBGP peers, always apply GTSM (TTL security): `neighbor <ISP-IP> ttl-security hops 1` — this drops any BGP packet arriving with TTL < 254, preventing off-path TCP injection attacks with essentially zero overhead.',
    'On internet-facing peers, apply `remove-private-as` on outbound advertisements — omitting this leaks internal private ASNs into the public BGP table and can trigger loop-detection drops at remote peers.',
    'Configure explicit `prefix-list IN` and `prefix-list OUT` on every internet-facing peer — never leave internet edge policy implicit. Inbound: accept only what the fabric needs (default route or specific aggregates). Outbound: only your own aggregate address blocks, never internal /31 p2p links or loopbacks.'
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
      arista:
        '! BGP unnumbered — no IPs needed on p2p link\ninterface Ethernet1\n   no switchport\n   ip address unnumbered Loopback0\n   ipv6 enable'
    },
    {
      legacy: '! OSPF fast-hello (sub-second)\nip ospf dead-interval minimal hello-multiplier 4',
      arista: '! BGP BFD fast detection\nrouter bgp 65001\n   neighbor SPINES bfd'
    },
    {
      legacy: '! Cisco IOS: hard maximum-prefix limit\nneighbor <peer> maximum-prefix 12000\n! Session tears down at limit — no warning',
      arista:
        '! EOS: maximum-routes with warning-only (safe pattern)\nneighbor <peer-group> maximum-routes 15000 warning-limit 80 percent warning-only\n! Logs at 12,000 routes; does NOT tear session down\n!\n! BGP convergence optimization (both leaf and spine)\nrouter bgp <ASN>\n   update wait-install              ! wait for ASIC programming before advertising\n!\n! Spine ONLY:\nrouter bgp 65000\n   update wait-for-convergence      ! wait for full convergence before hardware install'
    },
    {
      legacy: '! No standard internet-facing BGP security equivalent in classic IOS\nneighbor <ISP-IP> password WEAK-KEY\n! No TTL protection',
      arista:
        '! EOS: GTSM + MD5 on internet-facing eBGP peers\nrouter bgp 65000\n   neighbor <ISP-IP> ttl-security hops 1   ! drops packets with TTL < 254\n   neighbor <ISP-IP> password <key>         ! MD5 — must match exactly on both peers\n   neighbor <ISP-IP> remove-private-as      ! strip private ASNs from outbound AS_PATH\n   neighbor <ISP-IP> route-map INTERNET-IN in\n   neighbor <ISP-IP> route-map INTERNET-OUT out\n!\n! Verify\nshow bgp neighbors <ISP-IP> | include TTL|password|MD5|State\nshow ip bgp neighbors <ISP-IP> advertised-routes\nshow ip bgp neighbors <ISP-IP> received-routes'
    }
  ],

  masteryPath: [
    {
      level: 'Foundation',
      heading: 'eBGP Underlay Basics',
      body: 'Each leaf uses a unique ASN. Each spine uses a shared ASN. Leaves form eBGP sessions to all spines over point-to-point links. Redistribute connected (loopbacks only) to advertise VTEP loopbacks. No OSPF, no IS-IS — just BGP. The value of this model is explicit adjacency boundaries: when a session is down, you know exactly which two devices and which link are involved. There is no LSA flooding, no SPF, no shared topology database. For large multi-pod fabrics, use 4-byte private ASNs (4200000000–4294967294) — the 2-byte private range (65001–65535) has only 535 usable values.',
      keyConcept: 'unique leaf ASN · shared spine ASN · eBGP over p2p · 4-byte private ASN'
    },
    {
      level: 'Logic',
      heading: 'BGP Unnumbered',
      body: 'BGP unnumbered uses IPv6 link-local addresses for BGP session formation — no /30 or /31 IPs needed on point-to-point links. EOS discovers neighbors via IPv6 ND and forms the BGP session. All IPv4 prefixes are still exchanged; only the transport is IPv6. Enables zero-touch fabric provisioning with AVD. A 64-leaf, 4-spine fabric requires 256 /31 subnets for underlay links — BGP unnumbered eliminates all of this IP address management.',
      keyConcept: 'ip address unnumbered Loopback0 · ipv6 enable · zero p2p IP management'
    },
    {
      level: 'Logic',
      heading: 'Underlay Proof Sequence',
      body: 'Validate the underlay completely before touching EVPN or tenant services. Prove loopback reachability and intended ECMP before diagnosing overlay symptoms — overlays cannot converge if remote loopbacks are missing or multipath is not installed. Sequence: (1) `show bgp summary` — all sessions Established. (2) `show ip route <remote-loopback>` — loopback present with ECMP paths. (3) `show ip interface brief` — all routed uplinks and loopbacks up. (4) Only then move to overlay. The most common BGP troubleshooting mistake is chasing overlay state when the underlay is the actual root cause.',
      keyConcept: 'sessions → loopback reachability → ECMP paths → then overlay'
    },
    {
      level: 'Logic',
      heading: 'BGP Timers and Convergence Optimization',
      body: 'BGP default timers (60s keepalive / 180s hold) are far too slow for DC failure detection without BFD. When BFD is deployed on a session, leave timers at defaults — BFD handles detection. When BFD is not deployed, reduce to 5s/15s: `neighbor <peer-group> timers 5 15`. Do not go below 5/15 without validating physical link stability — excessively short timers cause session flaps on transient events. Convergence optimization: enable `update wait-install` on both leaf and spine to prevent advertising routes before the ASIC has programmed them (prevents black holes). Enable `update wait-for-convergence` on spine only — do not configure on leaf.',
      keyConcept: '5s/15s when no BFD · update wait-install both · wait-for-convergence spine only'
    },
    {
      level: 'Architecture',
      heading: 'iBGP Overlay with Route Reflection',
      body: 'EVPN uses iBGP — all devices share the same ASN for overlay peering. Spines act as Route Reflectors (RR): they reflect EVPN routes from any leaf to all other leaves. Without route reflection, every leaf must peer with every other leaf in a full mesh. Key config: `neighbor <leaf> route-reflector-client` on spines, and `neighbor <spine> update-source Loopback0` + `send-community extended` on leaves. Route reflectors should appear because scale requires them, not because they sound more sophisticated — simple eBGP for smaller fabrics is the easier operator model. When moving to RR, standard RRs advertise only the best path — preserving ECMP requires `bgp additional-paths` or careful RR cluster design.',
      keyConcept: 'iBGP RR on spine · send-community extended · update-source Lo0 · add-path for ECMP'
    },
    {
      level: 'Architecture',
      heading: 'BFD + Graceful Restart',
      body: 'BFD runs independently of BGP and detects link/path failures in 50–300ms depending on timer config. When BFD detects a failure, it notifies BGP immediately — the BGP hold timer is irrelevant. Graceful Restart preserves forwarding state during BGP agent restarts (ISSU, process crash): neighbors continue forwarding using stale RIB entries marked as "stale" for the `graceful-restart restart-time` duration (default 300s). Long-Lived Graceful Restart (LLGR) extends preservation to minutes for satellite/WAN links where normal GR timeout is insufficient.',
      keyConcept: 'BFD < 300ms · GR preserves RIB during restart · LLGR for slow paths'
    },
    {
      level: 'Architecture',
      heading: 'Internet Edge Design',
      body: 'Border leaves hold all external eBGP sessions — internal spine and leaf switches never peer directly with ISPs. The border leaf enforces strict inbound/outbound route policy before prefixes enter or leave the fabric. Inbound: accept only what the fabric needs (default route or specific aggregates); never accept the full internet routing table without a hardware capacity decision. Outbound: advertise only your own aggregate blocks; apply `remove-private-as` to strip private ASNs from AS_PATH. Multi-homing: two border leaves with independent ISP sessions — active-active (equal MED/LP) or active-standby (manipulate LP or MED). Always test inbound and outbound policy independently with `show ip bgp neighbors <ISP-IP> received-routes` and `show ip bgp neighbors <ISP-IP> advertised-routes`.',
      keyConcept: 'border leaf isolates ISP sessions · prefix-list IN/OUT · remove-private-as · redundant border leaves'
    },
    {
      level: 'Architecture',
      heading: 'BGP Session Security',
      body: 'Two mechanisms protect internet-facing BGP sessions: GTSM (TTL security, RFC 5082) and MD5 authentication. GTSM sets TTL = 255 on outgoing BGP packets and drops any incoming packet with TTL < `255 - hops`. For directly connected eBGP (hops 1), any spoofed packet from the internet arrives with far lower TTL and is dropped before the TCP stack processes it. MD5 adds a TCP hash to every segment; mismatched or missing hash is dropped at the TCP layer. Apply both together on internet-facing peers: `neighbor <ISP-IP> ttl-security hops 1`, `neighbor <ISP-IP> password <key>`. MD5 key must match exactly (case-sensitive, spaces matter). L3LS underlay peers in a trusted physical fabric do not need GTSM or MD5 — the overhead adds no security benefit in that context.',
      keyConcept: 'GTSM TTL=255 · MD5 TCP hash · internet-facing only · not on L3LS underlay'
    },
    {
      level: 'Architecture',
      heading: 'Route Reflector Decision',
      body: 'Route reflectors should appear because scale requires them, not because they sound more sophisticated. Simple eBGP full-mesh between leaves and spines is the better operator model for smaller fabrics — easier to reason about, no RR as a single blast radius. When you move to RR, multipath behavior changes: a standard RR advertises only the best path, so preserving ECMP requires `bgp additional-paths` or careful RR cluster design. Introduce RR only when the full-mesh peer count becomes unmanageable.',
      keyConcept: 'RR only when scale demands · additional-paths for ECMP · no RR blast radius in small fabrics'
    }
  ],

  overview: {
    title: 'Why BGP Replaced OSPF in the DC',
    intro:
      'OSPF and IS-IS flood topology state to every router in the area — a 1,000-switch fabric means every switch holds 1,000 LSAs and recomputes SPF on every link-state change. BGP is path-vector: each router only knows next-hops, not the full topology. Changes propagate as incremental updates, not full topology floods. BGP scales to internet size; OSPF does not. At the internet edge, BGP provides the policy enforcement point that separates internal routing from external routing — a separation OSPF cannot provide.',
    sections: [
      {
        title: 'eBGP Underlay Topology',
        body: 'Leaf switches run eBGP sessions to their directly connected spine switches. Each leaf has a unique ASN; all spines share one ASN. Loopback addresses are redistributed into BGP for VTEP reachability. ECMP is enabled with maximum-paths (leaf = number of spines, spine = platform max). No RP, no DR, no OSPF area design. BGP session events provide the failure visibility that OSPF hides inside LSA flooding.',
        bestFor: 'Leaf-spine data center fabrics from 4 switches to 4,000 switches.'
      },
      {
        title: 'iBGP EVPN Overlay',
        body: 'EVPN requires iBGP (all same ASN) so route-reflector-client works on spines. A separate address-family evpn section activates EVPN NLRI exchange. The same BGP session carries both IPv4 underlay prefixes and EVPN MAC/IP routes — just different address families. Loopback-sourced sessions survive uplink failures as long as any ECMP path to the loopback exists.',
        bestFor: 'VXLAN/EVPN overlay on top of any eBGP or OSPF underlay.'
      },
      {
        title: 'Internet Edge and BGP Security',
        body: 'Border leaves terminate all external eBGP sessions. Internal switches never peer with ISPs. The border leaf applies strict prefix-list IN (accept only default route or specific aggregates) and prefix-list OUT (advertise only your own aggregate blocks). Apply GTSM (`ttl-security hops 1`) and MD5 authentication on all internet-facing peers. Use `remove-private-as` on outbound advertisements to prevent private ASN leakage into the public BGP table.',
        bestFor: 'Any fabric with internet connectivity, DCI, or WAN eBGP sessions.'
      }
    ],
    conclusion:
      'For new Arista leaf-spine deployments: eBGP underlay with BGP unnumbered for zero-IP p2p links, iBGP EVPN with spine route reflectors for overlay. Enable `update wait-install` on all nodes and `update wait-for-convergence` on spines. At the internet edge, border leaves with GTSM + MD5 + explicit prefix-list IN/OUT. This is the Arista validated design standard and the starting point for all AVD templates.'
  },

  primer: {
    title: 'BGP Unnumbered: No IPs Required on Interfaces',
    body: "Traditional BGP requires IP addresses on every point-to-point link — a 64-leaf, 4-spine fabric needs 256 /31 subnets just for underlay links. BGP unnumbered borrows the loopback IP and uses IPv6 link-local addresses for session establishment, eliminating all p2p IP address management. Config: interface Ethernet1 → no switchport → ip address unnumbered Loopback0 → ipv6 enable. Then in BGP: neighbor interface Ethernet1 peer-group SPINES. EOS uses the IPv6 link-local address discovered via IPv6 ND to form the BGP session. All IPv4 routes are still exchanged — only the transport is IPv6. AVD generates all BGP unnumbered configs from a simple inventory YAML file."
  },

  roleConfigs: [
    {
      role: 'eBGP Leaf',
      description: 'Standard eBGP underlay leaf with peer-group and loopback redistribution.',
      config: `router bgp 65001
   router-id 1.1.1.1
   maximum-paths 4 ecmp 4
   update wait-install            ! wait for ASIC programming before advertising
   !
   neighbor SPINES peer group
   neighbor SPINES remote-as 65000
   neighbor SPINES send-community extended
   neighbor SPINES maximum-routes 15000 warning-limit 80 percent warning-only
   neighbor SPINES bfd
   !
   neighbor 10.0.0.1 peer group SPINES
   neighbor 10.0.0.3 peer group SPINES
   !
   network 1.1.1.1/32    ! advertise loopback directly (vs redistribute connected)
!
! Verify ECMP paths installed
show ip route 1.1.1.1 detail | include via`
    },
    {
      role: 'eBGP Spine',
      description: 'Spine with eBGP underlay to leaves and iBGP route-reflection for EVPN overlay.',
      config: `router bgp 65000
   router-id 10.0.0.1
   maximum-paths 8 ecmp 8
   update wait-install
   update wait-for-convergence    ! spine only — do not configure on leaf
   bgp log-neighbor-changes
   !
   neighbor LEAVES peer group
   neighbor LEAVES send-community extended
   neighbor LEAVES bfd
   neighbor LEAVES maximum-routes 15000 warning-limit 80 percent warning-only
   !
   ! Suppress /31 p2p entries from RIB — each spine owns a /24 block
   aggregate-address 10.120.240.0/24 summary-only
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
      role: 'Dynamic Neighbor Discovery',
      description:
        'bgp listen range lets spines auto-accept neighbors from a prefix range + peer-filter, eliminating per-leaf static config.',
      config: `! ── PEER FILTER: permit leaf ASNs only ───────────────────────
peer-filter LEAF-AS-RANGE
   match as-range 65100-65999 result accept
!
! ── SPINE: dynamic listen-range model ────────────────────────
router bgp 65000
   router-id 1.1.1.201
   maximum-paths 64                  ! spine: set to platform max (32/64/128)
   update wait-for-convergence       ! spine only
   update wait-install               ! on both leaf and spine
   !
   neighbor IPv4-UNDERLAY-PEERS peer group
   neighbor IPv4-UNDERLAY-PEERS send-community extended
   neighbor IPv4-UNDERLAY-PEERS maximum-routes 15000 warning-limit 80 percent warning-only
   neighbor IPv4-UNDERLAY-PEERS timers 5 15    ! when BFD not used on p2p links
   !
   bgp listen range 10.120.240.0/24 peer-group IPv4-UNDERLAY-PEERS peer-filter LEAF-AS-RANGE
   !
   aggregate-address 10.120.240.0/24 summary-only  ! suppress /31 p2p entries from RIB
   !
   address-family ipv4
      neighbor IPv4-UNDERLAY-PEERS activate
!
! ── VERIFY ────────────────────────────────────────────────────
show ip bgp summary
! Expect: all leaf peer IPs appear in neighbor table, state = Established
show ip route summary
! Confirm aggregate route installed, /31 components suppressed`
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
   neighbor SPINES maximum-routes 15000 warning-limit 80 percent warning-only
   neighbor SPINES send-community extended
   !
   neighbor interface Ethernet1 peer-group SPINES
   neighbor interface Ethernet2 peer-group SPINES
   !
   network 1.1.1.1/32
!
! Verify unnumbered session
show bgp neighbors | include BGP neighbor is`
    },
    {
      role: 'MLAG Leaf-Pair iBGP Baseline',
      description:
        'MLAG leaf pairs run iBGP between peers for underlay failure handling. next-hop-self required; allowas-in required when MLAG peers share the same leaf ASN.',
      config: `! ── MLAG LEAF PAIR: shared ASN + iBGP peer session ───────────
router bgp 65020
   neighbor iBGP-MLAG-PEER peer group
   neighbor iBGP-MLAG-PEER remote-as 65020           ! same ASN = iBGP
   neighbor iBGP-MLAG-PEER next-hop-self             ! required: sets own address as NH
   neighbor iBGP-MLAG-PEER allowas-in 1              ! required when leaves share ASN
   neighbor iBGP-MLAG-PEER maximum-routes 15000 warning-limit 80 percent warning-only
   neighbor iBGP-MLAG-PEER send-community extended
   !
   neighbor 10.0.0.2 peer group iBGP-MLAG-PEER       ! peer's peer-link IP
!
! ── VERIFY ────────────────────────────────────────────────────
show ip bgp summary
! Confirm MLAG peer neighbor appears as Established
show ip bgp neighbors 10.0.0.2
! Verify: next-hop-self applied, allowas-in count = 1
show mlag
! Confirm MLAG domain is healthy — iBGP relies on peer-link being up`
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
   graceful-restart restart-time 300     ! default 300s
   graceful-restart stalepath-time 300   ! default 300s
   !
   neighbor SPINES bfd
   !
   ! When BFD NOT deployed — reduce BGP timers
   ! neighbor SPINES timers 5 15
!
! Verify BFD sessions
show bfd peers
show bgp neighbors 10.0.0.1 | include BFD|Hold|State|Graceful`
    },
    {
      role: 'Internet Edge / Border Leaf',
      description:
        'Border leaf external eBGP with strict inbound/outbound prefix-list policy. Applies GTSM + MD5 security.',
      config: `! ── BORDER LEAF: internet-facing eBGP ────────────────────────
router bgp 65000
   neighbor <ISP-IP> remote-as <ISP-ASN>
   neighbor <ISP-IP> description ISP-PRIMARY
   neighbor <ISP-IP> remove-private-as    ! strip private ASNs from outbound AS_PATH
   neighbor <ISP-IP> ttl-security hops 1  ! GTSM: drops packets with TTL < 254
   neighbor <ISP-IP> password <key>       ! MD5: must match exactly on both peers
   neighbor <ISP-IP> route-map INTERNET-IN in
   neighbor <ISP-IP> route-map INTERNET-OUT out
!
! ── INBOUND POLICY (ISP → border leaf → fabric) ──────────────
! Accept only what the fabric needs — default route, or specific aggregates
ip prefix-list INTERNET-IN seq 10 permit 0.0.0.0/0           ! default route
ip prefix-list INTERNET-IN seq 20 deny 10.0.0.0/8 le 32      ! block RFC 1918
ip prefix-list INTERNET-IN seq 30 deny 172.16.0.0/12 le 32
ip prefix-list INTERNET-IN seq 40 deny 192.168.0.0/16 le 32
ip prefix-list INTERNET-IN seq 50 deny 0.0.0.0/0 le 32       ! deny rest
!
route-map INTERNET-IN permit 10
   match ip address prefix-list INTERNET-IN
!
! ── OUTBOUND POLICY (fabric → border leaf → ISP) ─────────────
! Advertise only your own aggregate — never internal /31 links or loopbacks
ip prefix-list INTERNET-OUT seq 10 permit <your-aggregate>/prefix
ip prefix-list INTERNET-OUT seq 20 deny 0.0.0.0/0 le 32
!
route-map INTERNET-OUT permit 10
   match ip address prefix-list INTERNET-OUT
!
! ── VERIFY ────────────────────────────────────────────────────
show bgp neighbors <ISP-IP> | include TTL|password|MD5|State
show ip bgp neighbors <ISP-IP> advertised-routes
! Confirm: ONLY your aggregate is advertised — no internal prefixes
show ip bgp neighbors <ISP-IP> received-routes
! Confirm: only expected routes received
show ip route 0.0.0.0
! Confirm: default route installed from ISP`
    },
    {
      role: 'BGP Session Security',
      description:
        'GTSM (TTL security) + MD5 for internet-facing peers. Neither is needed on L3LS underlay peers in a trusted fabric.',
      config: `! ── INTERNET-FACING PEER: apply both mechanisms ──────────────
router bgp 65000
   neighbor <ISP-IP> ttl-security hops 1   ! directly connected eBGP
   ! neighbor <ISP-IP> ttl-security hops 2 ! eBGP multihop or DCI — adjust to actual hop count
   neighbor <ISP-IP> password <key>
   ! Key must match exactly on both peers — case-sensitive, spaces matter
!
! ── VERIFY ───────────────────────────────────────────────────
show bgp neighbors <ISP-IP> | include TTL|password|MD5|State
! Expect: TTL security configured, MD5 enabled, BGP state = Established
show tcp statistics
! Elevated TCP RSTs = attack traffic being dropped by GTSM (expected behavior)
!
! ── FAILURE MODES ────────────────────────────────────────────
! MD5 key mismatch: session stuck in Active, no OPEN message exchanged
! GTSM hops too low: legitimate packets dropped, session bounces
!   Fix: show bgp neighbors <IP> | include TTL + traceroute <ISP-IP>
! Password on one side only: same as key mismatch
!
! ── L3LS UNDERLAY: do NOT apply GTSM or MD5 ─────────────────
! L3LS underlay peers are directly connected in trusted DC environment
! GTSM and MD5 add key-rotation burden with no security benefit here`
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
      config: `! ── UNDERLAY: validate first, before overlay ─────────────────
! Step 1: Session state
show bgp summary
!
! Step 2: Remote loopback reachability + ECMP paths
show ip route <remote-loopback> detail | include via
!
! Step 3: Interface hygiene
show interfaces status
show ip interface brief
! Confirm: all routed uplinks and loopbacks are up
!
! Step 4: Prefix count per neighbor
show bgp neighbors <ip> | include prefixes
!
! ── OVERLAY: only after underlay is proven ────────────────────
show bgp evpn summary
show bgp evpn route-type mac-ip | count
!
! ── MLAG PEER UNDERLAY ────────────────────────────────────────
show mlag
! Confirm MLAG domain active and peer-link up before checking iBGP
show ip bgp neighbors 10.0.0.2
! Confirm MLAG peer iBGP session is Established; next-hop-self applied`
    }
  ],

  referenceLinks: [
    {
      title: 'Arista EOS User Manual — BGP',
      summary: 'Authoritative EOS command behavior for BGP neighbors, AFI/SAFI, and policy.',
      url: 'https://www.arista.com/en/um-eos/eos-border-gateway-protocol-bgp'
    },
    {
      title: 'Arista AVD Documentation',
      summary: 'Reference implementation patterns for eBGP/iBGP fabrics and EVPN overlays.',
      url: 'https://avd.arista.com'
    },
    {
      title: 'RFC 4271 BGP-4',
      summary: 'Core BGP specification: path vector protocol, UPDATE messages, OPEN/KEEPALIVE/NOTIFICATION.',
      url: 'https://www.rfc-editor.org/rfc/rfc4271'
    },
    {
      title: 'RFC 7938 BGP in Data Centers',
      summary: 'IETF operational guidance for BGP in data center fabrics — underlay design recommendations.',
      url: 'https://www.rfc-editor.org/rfc/rfc7938'
    },
    {
      title: 'RFC 5880/5882 BFD',
      summary: 'Sub-second failure detection and BFD interaction with BGP.',
      url: 'https://www.rfc-editor.org/rfc/rfc5880'
    },
    {
      title: 'RFC 5082 GTSM — TTL Security',
      summary:
        'BGP session security via TTL-based protection against off-path TCP injection attacks. Apply on all internet-facing eBGP peers.'
    }
  ],

  dcContext: {
    small: {
      scale: '2-tier · eBGP unnumbered · 2 spines · 4 leaves',
      topologyRole:
        'eBGP unnumbered underlay; loopback peerings; iBGP EVPN with spine RR for overlay. All peers with BFD. `update wait-install` on all nodes.',
      keyConfig:
        'neighbor interface Ethernet1 peer-group UNDERLAY\nbgp listen range 10.0.0.0/8 peer-group UNDERLAY remote-as external',
      highlight: 'leaf-spine'
    },
    medium: {
      scale: '3-tier · eBGP underlay + EVPN overlay · BFD on all peers',
      topologyRole:
        'Dedicated spine ASNs; BFD on all BGP sessions; EVPN AF for RT-2/RT-5 overlay; `update wait-for-convergence` on spines; `maximum-routes warning-only` on all peers.',
      keyConfig:
        'neighbor SPINES bfd\nupdate wait-for-convergence   ! spine only\naddress-family evpn\n   neighbor SPINES activate',
      highlight: 'isl'
    },
    large: {
      scale: 'Multi-pod · hierarchical eBGP · super-spine route policy · border leaf internet edge',
      topologyRole:
        'Leaf → spine → super-spine eBGP tiers; route policy at every boundary; prefix summarization per pod; border leaves with GTSM + MD5 + prefix-list IN/OUT on all ISP sessions. 4-byte private ASNs for namespace scale.',
      keyConfig: `route-map LEAF-OUT permit 10
   set community 65000:100  ! tag by pod
!
! Border leaf internet edge
neighbor <ISP-IP> ttl-security hops 1
neighbor <ISP-IP> remove-private-as`,
      highlight: 'border'
    }
  }
};
