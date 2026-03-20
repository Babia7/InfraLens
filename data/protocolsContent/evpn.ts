import { ProtocolDetail } from './types';

export const EVPN_PROTOCOL: ProtocolDetail = {
  id: 'evpn',
  name: 'EVPN',
  legacyTerm: 'LISP / OTV Control Plane',
  tagline: 'The Intelligent BGP Control Plane for Overlays.',
  description:
    'EVPN replaces flood-and-learn with a publish/subscribe MP-BGP control plane for MAC/IP reachability, enabling deterministic overlays with distributed anycast gateways and all-active multi-homing. The VTEP sourcing loopback (Loopback1) carries the tunnel endpoint identity; a management/routing loopback (Loopback0) carries the BGP peer identity — keep these distinct. Service models: `vlan-aware-bundle` groups multiple VLANs under one RD/RT, reducing control-plane overhead and is the Arista default; VLAN-based MAC-VRF uses one RD per VLAN and is required for some multi-vendor scenarios. Symmetric IRB — where both ingress and egress VTEPs route — is the recommended scaling model; it limits each VTEP to locally attached VLANs rather than requiring all VTEPs to host all VLANs.',

  keyBenefits: [
    'Control-plane-driven endpoint discovery — RT-2 MAC/IP routes replace flood-and-learn, making overlay state inspectable and provable at every VTEP.',
    'ARP suppression eliminates most ARP flooding across the fabric — VTEP serves ARP replies from the RT-2 MAC/IP cache instead of flooding, reducing BUM traffic in mature deployments.',
    'RT-3 IMET routes drive dynamic HER flood lists — VTEPs signal BUM interest via BGP rather than static configuration, ensuring consistent flood-list state as topology changes.',
    'Symmetric IRB scales cleanly to multi-subnet tenants — each VTEP hosts only locally attached VLANs; the L3VNI transports routed traffic across the underlay without VLAN sprawl.',
    'EVPN ESI all-active multi-homing eliminates the peer-link dependency of MLAG — downstream devices dual-home with active-active forwarding and mass withdrawal on failure.',
    'Route types provide layered diagnostic clarity — RT-2 for host reachability, RT-3 for BUM participation, RT-5 for L3 prefix routing; a missing route type immediately identifies which service layer has failed.',
    'Anycast gateway (`ip address virtual`) on every leaf VTEP enables seamless host mobility without centralized routing.'
  ],

  bestPractices: [
    'Always configure `send-community extended` on every EVPN BGP neighbor — omitting it silently drops all route-target extended communities and breaks the entire EVPN control plane with no error message.',
    'Peer EVPN sessions from a stable loopback (`update-source Loopback0`), not physical interfaces — physical interface flaps will reset EVPN sessions and cause traffic loss.',
    'For iBGP EVPN overlay, configure `route-reflector-client` on spines with `bgp cluster-id` set on all spine RRs in the same cluster — cluster-id prevents loops when two RRs reflect to each other.',
    'Enable `bgp additional-paths send any` on RR spine neighbors — without add-path, the RR reflects only the best path to each leaf, collapsing ECMP to a single VTEP path across the entire fabric.',
    'Use a minimum of 2 route reflectors per cluster, not in the same failure domain — a single RR failure causes all its clients to lose their EVPN peer with no path to restore service.',
    'Set IP MTU to 9214 on all routed underlay interfaces and SVIs — VXLAN adds 50 bytes of overhead (54 with outer dot1q). EOS sets the DF bit on VXLAN-encapsulated packets, so an undersized transport MTU causes drops, not fragmentation — silent packet loss during deployment.',
    'Verify VTEP loopback is reachable from all remote VTEPs before activating tenant services: `ping <remote-vtep-ip> source Loopback1` — if this fails, the overlay session will not form.',
    'All VTEPs sharing an L2VNI must use the same VXLAN UDP port (EOS default 4789) — a single VTEP with a different port causes silent forwarding failure for BUM traffic.',
    'HER flood lists must be identical on all VTEPs sharing a given L2VNI — a missing VTEP entry means that VTEP silently misses all BUM traffic for that segment.',
    'Do not L2-stretch the native VLAN across VXLAN — native VLAN bypasses dot1q tagging and corrupts VXLAN encapsulation assumption, causing silent frame misdelivery.',
    'Standardize and document route-target conventions (e.g. L2 VNI RT = VNI:VNI, VRF RT = 50000+index:1) before deployment — ad-hoc RTs cause silent import/export mismatches during DCI or brownfield migrations.',
    'Prefer `vlan-aware-bundle` over per-VLAN RD/RT for new deployments — it groups multiple VLANs under one RD/RT, reducing BGP control-plane overhead; per-VLAN (MAC-VRF) is required for some multi-vendor interoperability scenarios.',
    'Prefer Symmetric IRB over Asymmetric IRB for multi-subnet deployments — asymmetric requires all VTEPs to host all VLANs (VLAN sprawl); symmetric limits each VTEP to locally attached VLANs and routes via L3VNI.',
    'Enable `bgp log-neighbor-changes` on all EVPN speakers — session flaps are the most common source of MAC/IP withdrawal events and are otherwise invisible without logging.',
    'After any topology change, verify RT-2, RT-3, and RT-5 route counts match expected values before declaring success — a missing route type is the most common symptom of a misconfigured import RT or missing `redistribute learned`.'
  ],

  cliTranslation: [
    {
      legacy: '! OTV/LISP: static flood list or locator-set\nrouter lisp\n  instance-id 101\n  service ethernet',
      arista:
        '! EOS EVPN: VTEP interface + VNI mapping\ninterface Loopback1\n   ip address 1.1.1.1/32\n!\ninterface Vxlan1\n   vxlan source-interface Loopback1\n   vxlan udp-port 4789\n   vxlan vlan 10 vni 10010\n   vxlan vrf Prod vni 50001'
    },
    {
      legacy: '! OTV: per-VLAN adjacency-server\nroute-target export 10:10\nroute-target import 10:10',
      arista:
        '! EOS EVPN: vlan-aware-bundle (preferred — groups multiple VLANs under one RD/RT)\nrouter bgp 65101\n   vlan-aware-bundle TENANT-A\n      rd 1.1.1.101:1\n      route-target both 1:1\n      redistribute learned\n      vlan 10-49\n!\n! Verify RT is present\nshow bgp evpn route-type mac-ip detail | include RT'
    },
    {
      legacy: '! OTV/LISP: no native VRF-aware L3 overlay concept\n! Typically requires external router or GRE tunnel for inter-site L3',
      arista:
        '! EOS EVPN: Symmetric IRB — L3VNI per VRF for distributed routing\nvrf instance Prod\n!\ninterface Vxlan1\n   vxlan vrf Prod vni 50001\n!\ninterface Vlan10\n   vrf Prod\n   ip address virtual 10.10.10.1/24\n!\nrouter bgp 65101\n   vrf Prod\n      rd 1.1.1.101:50001\n      route-target import evpn 50:50001\n      route-target export evpn 50:50001\n      redistribute connected'
    },
    {
      legacy: '! MLAG: peer-link carries multihomed state\n! No standards-based multi-vendor multihoming model',
      arista:
        '! EOS EVPN ESI multihoming (standards-based, no peer-link required)\n! ESI identifies the Ethernet Segment — same value on both co-attached VTEPs\ninterface Port-Channel10\n   evpn ethernet-segment\n      identifier 0000:0000:0000:0001:0001   ! unique per segment\n      route-target import 00:00:00:01:00:01\n   lacp system-id 0000.0000.0001\n!\n! Verify DF election and multihoming state\nshow bgp evpn route-type es-import-rt\nshow bgp evpn route-type ethernet-segment detail'
    },
    {
      legacy: '! OTV: show otep, show lisp session\nshow lisp site',
      arista:
        '! EOS EVPN verification sequence\nshow bgp evpn summary              ! session state + route counts\nshow bgp evpn route-type mac-ip | count    ! RT-2 endpoint reachability\nshow bgp evpn route-type imet | count      ! RT-3 BUM participation\nshow bgp evpn route-type ip-prefix | count ! RT-5 routed prefixes\nshow vxlan address-table           ! remote MACs via VXLAN\nshow vxlan flood vtep vlan 10      ! HER flood list for VNI'
    }
  ],

  masteryPath: [
    {
      level: 'Foundation',
      heading: 'Overlay vs Underlay',
      body: 'EVPN is the control plane (brain) — it distributes endpoint reachability, BUM membership, and tenant prefix state via BGP route types. VXLAN is the data plane (body) — it encapsulates frames in UDP/IP for transport. Underlay IP reachability between VTEP loopbacks is the mandatory prerequisite for any overlay function. If the underlay cannot reach the remote VTEP loopback, the overlay BGP session cannot form and no tenant state is exchanged. The Loopback0 is the BGP peer identity; Loopback1 is the VTEP sourcing interface. Keep these distinct — they serve different roles and must be independently stable.',
      keyConcept: 'control plane (EVPN) + data plane (VXLAN) · underlay loopbacks first · Lo0=BGP · Lo1=VTEP'
    },
    {
      level: 'Foundation',
      heading: 'Symmetric vs Asymmetric IRB',
      body: 'Asymmetric IRB: the ingress VTEP both routes and bridges in a single pass; the egress VTEP only bridges. No L3VNI is required. But every VTEP must host every VLAN in the tenant — VLAN sprawl across the fabric grows with tenant scale. Symmetric IRB: both ingress and egress VTEPs route and bridge. The ingress VTEP routes into the tenant VRF, encapsulates the packet using the L3VNI (one per VRF), and the egress VTEP routes it to the destination host. Each VTEP only carries the VLANs it locally serves. Arista defaults to Symmetric IRB for all design guides because it limits VLAN scope per VTEP and scales cleanly — asymmetric is functionally correct but operationally unsustainable at scale.',
      keyConcept: 'asymmetric = all VLANs everywhere · symmetric = local VLANs + L3VNI · Arista default = symmetric'
    },
    {
      level: 'Logic',
      heading: 'BGP Route Types — The EVPN Diagnostic Layers',
      body: 'EVPN uses five route types to carry different overlay state. Type 2 (MAC/IP Advertisement): carries a MAC address and optional IP from the VTEP that learned it — enables ARP suppression and remote VTEP MAC-to-IP binding. A missing RT-2 means a host is not reachable by MAC or cannot receive ARP responses. Type 3 (IMET): signals that a VTEP wants to receive BUM traffic for a given L2VNI — drives dynamic HER flood lists. A missing RT-3 means the VTEP is invisible as a BUM destination for that VNI. Type 5 (IP Prefix): carries tenant IP subnets for inter-subnet routing and DCI; generated when `redistribute connected` is configured in a VRF BGP context. Import/export RT mismatch on RT-5 causes selective inter-subnet failure while L2 adjacency looks healthy. Type 1 and Type 4 are only present in ESI multihoming designs: RT-1 enables fast convergence (mass withdrawal) and MAC aliasing; RT-4 enables ESI discovery and DF election.',
      keyConcept: 'RT-2=MAC/IP · RT-3=BUM · RT-5=L3 prefix · RT-1/4=multihoming only'
    },
    {
      level: 'Logic',
      heading: 'EVPN Multihoming: ESI, DF Election, and Fast Convergence',
      body: 'EVPN ESI multihoming allows a downstream device to dual-home to two VTEPs with active-active forwarding — no peer-link required. Each co-attached VTEP is configured with the same Ethernet Segment Identifier (ESI) — a 10-byte value either auto-derived from the LACP system-ID or statically configured. VTEPs sharing an ESI exchange Type 4 (ES Route) to discover each other and elect a Designated Forwarder (DF) per EVI. Only the DF forwards BUM traffic to the multihomed segment; non-DF peers drop it to prevent duplication. On link or node failure: the VTEP withdraws its Type 1 per-ES route, triggering mass withdrawal at all remote VTEPs — they immediately invalidate all MAC/IP routes for that ESI without waiting for each RT-2 to age out individually. This is the primary fast-convergence mechanism. MAC aliasing via RT-1 per-EVI allows remote VTEPs to load-balance unicast traffic to any of the co-attached VTEPs.',
      keyConcept: 'ESI = segment identity · DF = BUM forwarder · RT-1 mass withdrawal = fast convergence'
    },
    {
      level: 'Architecture',
      heading: 'Route-Target Hygiene',
      body: 'Standardize RT conventions before deployment and enforce them at scale. Common model: L2VNI RT = `VNI:VNI` (e.g. 10010:10010), L3VNI/VRF RT = `50000+index:1`. The RT convention must be consistent across all VTEPs — a single mismatched import RT causes selective tenant disappearance with no obvious diagnostic indicator. For DCI, RTs must be consistent across sites if tenants span the WAN. Avoid ad-hoc per-VLAN exceptions — keep route leaking exceptional and documented. Verify import/export parity with `show bgp evpn route-type ip-prefix detail | include RT` before production.',
      keyConcept: 'VNI:VNI for L2 · 50k:1 for VRF · consistent across all VTEPs · no ad-hoc exceptions'
    },
    {
      level: 'Architecture',
      heading: 'Route Reflector Design: Add-Path and Cluster-ID',
      body: 'Default route-reflector behavior reflects only the best path to each client — in an EVPN fabric, this collapses ECMP to a single VTEP path for every prefix, even when multiple VTEPs source the same endpoint. Fix: configure `additional-paths send any` on the RR toward all EVPN clients. This causes the RR to reflect all paths it has received, preserving path diversity. Both the RR and its clients must negotiate add-path — verify with `show bgp neighbors <ip> | grep additional-paths`. Configure `bgp cluster-id` on all spine RRs in the same cluster — same cluster-id on all spines ensures reflections from one spine are not re-reflected by another (loop prevention). Use a minimum of 2 RRs per cluster in different failure domains — a single RR failure causes all leaf EVPN sessions to lose their peer.',
      keyConcept: 'additional-paths send any · bgp cluster-id · ≥2 RRs · different failure domains'
    },
    {
      level: 'Architecture',
      heading: 'ARP Suppression and Type-5 Prefix Injection',
      body: 'ARP suppression: when a VTEP receives an ARP request for a host whose MAC/IP binding exists in its RT-2 cache, it generates an ARP reply locally and drops the flood — the request never traverses the VXLAN underlay. This is the dominant mechanism for reducing BUM traffic in mature EVPN deployments. Verify with `show vxlan address-table` (remote MAC/IP entries populated) and `show bgp evpn route-type macip detail`. RT-5 (IP Prefix Route): used when an IP subnet must be advertised without a MAC binding — inter-VRF routing between subnets in different VRFs, DCI prefix advertisement across sites, or injecting external routes from OSPF/BGP into the EVPN fabric. Generated by `redistribute connected` inside a VRF BGP context. RT-5 is the L3 layer of EVPN; without it, hosts in different subnets cannot route through the fabric.',
      keyConcept: 'proxy ARP at VTEP · RT-2 cache · RT-5 for L3 · redistribute connected in VRF BGP'
    },
    {
      level: 'Architecture',
      heading: 'EVPN-VXLAN Validation Sequence',
      body: 'Layer-by-layer validation — do not skip ahead: (1) Underlay first — `show ip bgp summary`, `show ip route <remote-vtep-loopback>`, `show interfaces status`, `ping <remote-vtep-ip> source Loopback1`. If any loopback is unreachable, stop — overlay diagnosis is premature. (2) VTEP and VNI state — `show interface vxlan1`, `show vxlan vni` — Vxlan1 up, expected VLAN/VNI and VRF/VNI mappings present. (3) EVPN session health — `show bgp evpn summary`, `show bgp evpn route-type imet`, `show bgp evpn route-type mac-ip` — sessions established, route types present. (4) BUM handling — `show vxlan flood vtep vlan 10`, `show bgp evpn route-type imet vni 10010 detail` — flood lists complete, all expected VTEPs participating. (5) Tenant gateway — `show ip virtual-router`, `show arp vrf all`, `show mac address-table vlan 10` — virtual gateway active, MAC/ARP state consistent. (6) MLAG health (if applicable) — `show mlag`, `show mlag detail` — a sick MLAG pair often presents as a remote EVPN problem.',
      keyConcept: 'underlay → VTEP/VNI → session → BUM → tenant gateway → MLAG'
    }
  ],

  overview: {
    title: 'EVPN Route Types Explained',
    intro:
      'EVPN uses BGP route types (RTs) to carry different kinds of overlay state. Each type serves a distinct purpose: RT-2 handles L2 host discovery, RT-3 handles BUM replication membership, RT-5 handles L3 prefix routing. RT-1 and RT-4 are exclusive to ESI multihoming. Understanding which route type to check when debugging a reachability problem cuts diagnosis time dramatically — a missing route type immediately points to the service layer that has failed, not the entire overlay.',
    sections: [
      {
        title: 'RT-2 · MAC/IP Advertisement',
        body: 'Advertises a MAC address and its associated IP from the VTEP that learned it. Enables remote VTEPs to build ARP caches without flooding (ARP suppression). A missing RT-2 means a host is not reachable by MAC or cannot get ARP responses — the VTEP floods instead of proxying.',
        bestFor: 'L2 reachability, ARP suppression, host mobility tracking.'
      },
      {
        title: 'RT-3 · IMET (BUM Replication)',
        body: 'Signals that a VTEP wants to receive BUM traffic for a given L2VNI — drives dynamic HER (Head-End Replication) flood lists. A missing RT-3 means the VTEP is invisible as a BUM destination for that VNI and will miss all flooded traffic for that segment.',
        bestFor: 'BUM flood list construction, HER membership. Verify: show vxlan flood vtep vlan X.'
      },
      {
        title: 'RT-5 · IP Prefix Route',
        body: 'Advertises an IP prefix (not a MAC). Used for L3 routing between VRFs and DCI prefix distribution. An RT-5 is generated when you configure `redistribute connected` inside a VRF BGP context. No MAC is required — this is the L3 layer of EVPN.',
        bestFor: 'Inter-VRF routing, DCI L3 extension, external prefix injection.'
      },
      {
        title: 'MTU and Service Model Pre-flight',
        body: 'MTU 9214 on all underlay interfaces is required — VXLAN overhead is 50 bytes (54 with outer dot1q). EOS sets the DF bit on VXLAN-encapsulated packets, so fragmentation is disallowed; an undersized underlay MTU causes silent drops. Service model choice: `vlan-aware-bundle` (multiple VLANs under one RD/RT, preferred for new deployments) vs VLAN-based MAC-VRF (one RD per VLAN, required for some multi-vendor interoperability).',
        bestFor: 'Every EVPN/VXLAN deployment. Set MTU and service model before adding tenant services.'
      }
    ],
    conclusion:
      'Debug flow: missing host reachability → check RT-2 count. Missing subnet routing → check RT-5. Missing BUM replication → check RT-3 IMET routes. Missing multihoming convergence → check RT-1 (mass withdrawal) and RT-4 (DF election). All route types must be present and importing correctly on every VTEP that needs the service. Underlay loopback reachability must be proven before any overlay route type diagnosis.'
  },

  primer: {
    title: 'BGP send-community — Why It Must Be There',
    body: 'EVPN route-targets are carried in BGP Extended Communities. By default, EOS (like most BGP implementations) does NOT send extended communities to neighbors — they are stripped on output. `send-community extended` is a per-neighbor command that re-enables Extended Community propagation. Without it, every BGP UPDATE from a leaf to a spine arrives with no route-targets attached. The spine has no idea which VNI or VRF the route belongs to and cannot reflect it correctly. The result: all EVPN sessions form, all routes are received, but zero traffic flows — and `show bgp evpn` shows routes with no RT attributes. This is the #1 cause of "EVPN is configured but nothing works" incidents in first-time deployments.'
  },

  roleConfigs: [
    {
      role: 'EVPN-VXLAN Deployment Baseline',
      description:
        'Complete EOS EVPN/VXLAN baseline: VTEP interface, vlan-aware-bundle L2, Symmetric IRB L3, distributed gateway, and EVPN peering. From the Arista deployment baseline.',
      config: `! ── 1. VTEP LOOPBACK AND INTERFACE ───────────────────────────
interface Loopback1
   ip address 1.1.1.101/32
!
interface Vxlan1
   vxlan source-interface Loopback1
   vxlan udp-port 4789
   vxlan vlan 10-49 vni 10010-10049   ! VLAN-to-VNI mapping
   vxlan vrf A vni 50001              ! VRF-to-L3VNI mapping
   vxlan vrf B vni 50002
!
! ── 2. L2 SERVICE: vlan-aware-bundle (preferred) ──────────────
router bgp 65101
   router-id 1.1.1.101
   !
   vlan-aware-bundle TENANT-A
      rd 1.1.1.101:1
      route-target both 1:1
      redistribute learned
      vlan 10-49
   !
   vlan-aware-bundle TENANT-B
      rd 1.1.1.101:2
      route-target both 2:2
      redistribute learned
      vlan 50-69
!
! ── 3. L3 SERVICE: Symmetric IRB (VRF + L3VNI) ───────────────
vrf instance A
vrf instance B
!
router bgp 65101
   vrf A
      rd 1.1.1.101:1
      route-target import evpn 1:1
      route-target export evpn 1:1
      redistribute connected
   vrf B
      rd 1.1.1.101:2
      route-target import evpn 2:2
      route-target export evpn 2:2
      redistribute connected
!
! ── 4. DISTRIBUTED GATEWAY (ip address virtual) ──────────────
ip virtual-router mac-address 00:1c:73:aa:bb:cc   ! same on all leaves
!
interface Vlan10
   vrf forwarding A
   ip address virtual 10.10.10.1/24
interface Vlan50
   vrf forwarding B
   ip address virtual 50.50.50.1/24
!
! ── 5. EVPN BGP PEERING ────────────────────────────────────────
router bgp 65101
   neighbor EVPN-OVERLAY-PEERS peer group
   neighbor EVPN-OVERLAY-PEERS update-source Loopback0
   neighbor EVPN-OVERLAY-PEERS send-community standard extended
   !
   address-family evpn
      neighbor EVPN-OVERLAY-PEERS activate`
    },
    {
      role: 'Leaf (VTEP)',
      description: 'Maps local VLANs to VNIs, advertises host reachability via MP-BGP, and provides Anycast Gateway for L2/L3 services.',
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
      route-target import evpn 10:10010
      route-target export evpn 10:10010
      redistribute learned`
    },
    {
      role: 'Spine (RR) with Add-Path',
      description: 'Reflects EVPN routes between leaves with add-path for ECMP preservation and bgp cluster-id for loop prevention.',
      config: `router bgp 65101
   bgp log-neighbor-changes
   bgp cluster-id 1.1.1.200       ! same on all spine RRs in this cluster
   !
   neighbor EVPN-CLIENTS peer group
   neighbor EVPN-CLIENTS remote-as 65101
   neighbor EVPN-CLIENTS update-source Loopback0
   neighbor EVPN-CLIENTS send-community standard extended
   !
   ! add-path: reflects ALL paths (not just best) — required for ECMP
   neighbor EVPN-CLIENTS additional-paths send any
   !
   neighbor 1.1.1.1 peer group EVPN-CLIENTS
   neighbor 2.2.2.2 peer group EVPN-CLIENTS
   !
   address-family evpn
      neighbor EVPN-CLIENTS activate
      neighbor EVPN-CLIENTS route-reflector-client
!
! Verify add-path is negotiated
show bgp neighbors 1.1.1.1 | grep additional-paths
! Expect: "additional-paths capability has been enabled"`
    },
    {
      role: 'ESI Multihoming (All-Active)',
      description: 'EVPN all-active multihoming via Ethernet Segment Identifier. Same ESI on both co-attached VTEPs. No peer-link required.',
      config: `! Both co-attached VTEPs must have IDENTICAL ESI and LACP system-ID
!
! ── VTEP-A and VTEP-B — same config on both ──────────────────
interface Port-Channel10
   ! evpn ethernet-segment assigns this port-channel to an Ethernet Segment
   evpn ethernet-segment
      identifier 0000:0000:0000:0001:0001   ! unique per segment; identical on both VTEPs
      route-target import 00:00:00:01:00:01
   ! LACP system-ID must be consistent across both peers for the same segment
   lacp system-id 0000.0000.0001
!
! ── VERIFY ────────────────────────────────────────────────────
! Check ESI state and DF election
show bgp evpn route-type ethernet-segment detail
! Expect: both VTEPs advertising same ESI; DF elected for each EVI
!
show bgp evpn route-type es-import-rt detail
! Check RT-1 mass withdrawal is configured
!
show bgp evpn route-type auto-discovery detail
! Confirm RT-1 per-EVI (MAC aliasing) and RT-1 per-ES present
!
! Mass withdrawal on failure: when a co-attached VTEP loses the segment,
! RT-1 per-ES withdrawal causes remote VTEPs to immediately invalidate
! all MAC/IP routes for this ESI — no RT-2 age-out wait`
    },
    {
      role: 'DCI / L3 EVPN',
      description: 'Extends VRFs between sites with RT-5/IP prefix advertisements.',
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
    },
    {
      role: 'EVPN-VXLAN Validation Sequence',
      description: 'Layer-by-layer validation from underlay to tenant service. Do not skip layers.',
      config: `! Phase 1: Underlay — prove loopback reachability first
show ip bgp summary                    ! all BGP sessions Established
show ip route <remote-vtep-loopback>   ! loopback installed with ECMP paths
show interfaces status                  ! all uplinks connected
ping <remote-vtep-ip> source Loopback1 ! VTEP-to-VTEP reachability (NOT Loopback0)
!
! Phase 2: VTEP and VNI state
show interface vxlan1
show vxlan vni
! Vxlan1 must be up; expected VLAN/VNI and VRF/VNI mappings present
!
! Phase 3: EVPN session health
show bgp evpn summary
show bgp evpn route-type imet | count          ! RT-3 — BUM participation
show bgp evpn route-type mac-ip | count        ! RT-2 — host reachability
show bgp evpn route-type ip-prefix | count     ! RT-5 — L3 tenant routing
!
! Phase 4: BUM handling
show vxlan flood vtep vlan 10             ! HER flood list for this VNI
show bgp evpn route-type imet vni 10010 detail  ! RT-3 from all expected VTEPs
!
! Phase 5: Tenant gateway and MAC/ARP state
show ip virtual-router
show arp vrf all                          ! check BOTH peers if MLAG
show mac address-table vlan 10
show running-config section vxlan
!
! Phase 6: MLAG health (if applicable — do NOT skip)
show mlag
show mlag detail
! A sick MLAG pair often presents as a remote EVPN problem at first glance`
    }
  ],

  referenceLinks: [
    {
      title: 'Arista EOS User Manual — EVPN',
      summary: 'Authoritative EOS EVPN configuration and operational behavior.',
      url: 'https://www.arista.com/en/um-eos/eos-configuring-evpn'
    },
    {
      title: 'Arista EOS User Manual — VXLAN',
      summary: 'VXLAN dataplane and EVPN integration points in EOS.',
      url: 'https://www.arista.com/en/um-eos/eos-vxlan-configuration'
    },
    {
      title: 'RFC 7432 EVPN',
      summary: 'Control-plane route types and MAC/IP advertisement behavior — authoritative spec for RT-1 through RT-5.',
      url: 'https://www.rfc-editor.org/rfc/rfc7432'
    },
    {
      title: 'RFC 8365 NVO with EVPN',
      summary: 'EVPN as control plane for VXLAN/NVO overlays.',
      url: 'https://www.rfc-editor.org/rfc/rfc8365'
    },
    {
      title: 'Arista AVD — L3LS EVPN Design Guide',
      summary: 'Reference topology and variable model for EVPN/VXLAN fabrics — vlan-aware-bundle, Symmetric IRB, ESI, and RR configurations.'
    }
  ],

  dcContext: {
    small: {
      scale: '2-tier · 2 spines acting as RR · 4 leaves',
      topologyRole:
        'eBGP underlay + EVPN AF on same session; spines are RR with cluster-id for RT-2/RT-5. vlan-aware-bundle for L2. Symmetric IRB for L3 tenant routing. MTU 9214 on all underlay links.',
      keyConfig:
        'neighbor SPINES activate  ! under address-family evpn\nbgp cluster-id 1.1.1.200  ! spine RR',
      highlight: 'all'
    },
    medium: {
      scale: '3-tier · 4 dedicated RR spines · 8–16 leaves · 2 pods',
      topologyRole:
        'Dedicated RR spines with add-path enabled; per-pod iBGP optional; RT-2 and RT-5 across pods via border. ESI multihoming for dual-attached servers. At least 2 RRs per cluster in different failure domains.',
      keyConfig: `bgp listen range 10.0.0.0/8 peer-group UNDERLAY remote-as external
neighbor EVPN-CLIENTS additional-paths send any`,
      highlight: 'isl'
    },
    large: {
      scale: 'Multi-pod · super-spine RR hierarchy · 32+ leaves · DCI',
      topologyRole:
        'Hierarchical BGP RR tiers; EVPN DCI via super-spine EVPN gateways; RT-5 for inter-pod L3 routing; ESI multihoming fabric-wide. vlan-aware-bundle mandatory at scale. add-path on all RR tiers.',
      keyConfig:
        'neighbor EVPN-CLIENTS additional-paths send any\nbgp cluster-id 1.1.1.200   ! per RR cluster\nroute-reflector-client  ! on super-spine for inter-pod EVPN',
      highlight: 'border'
    }
  }
};
