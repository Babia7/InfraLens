import { ProtocolDetail } from './types';

export const VXLAN_PROTOCOL: ProtocolDetail = {
  id: 'vxlan',
  name: 'VXLAN',
  legacyTerm: 'OTV / VPLS / FabricPath',
  tagline: 'Standardized L2-over-L3 Virtualization.',
  description:
    'Virtual Extensible LAN (VXLAN) is the industrial-strength standard for building large-scale, multi-tenant cloud networks. It stretches Layer 2 domains over a resilient Layer 3 underlay using UDP/IP encapsulation (port 4789), eliminating Spanning Tree and the 4096 VLAN ceiling with a 24-bit VNI (16.7M segments). VXLAN adds 50 bytes of encapsulation overhead; Arista EOS sets the outer DF bit on VXLAN packets, so fragmentation is disallowed — an undersized transport MTU causes drops, not fragmentation. Some ASIC families require an explicit TCAM profile (`hardware tcam system profile vxlan-routing`) before VXLAN routing is programmed in hardware — without it, the control plane looks healthy while the data plane silently fails. In MLAG leaf pairs, both peers must share the same VTEP IP (Loopback1) so downstream and remote VTEPs see a single logical VTEP.',

  keyBenefits: [
    'Scales to 16.7 million segments using a 24-bit VNI — eliminates the 4096 VLAN ceiling completely.',
    'Uses IP underlay ECMP for deterministic load balancing — underlay path selection independent of tenant topology.',
    'Hardware VTEPs for line-rate 100/400G encapsulation — no performance penalty for overlay forwarding on supported ASICs.',
    'Decouples physical topology from logical services — tenant L2 segments can span any subset of VTEPs without VLAN provisioning at intermediate switches.',
    'VTEP identity separation: Loopback0 for BGP peering (stable control-plane identity), Loopback1 for VTEP sourcing (data-plane identity) — decouples control from data plane failures.',
    'Deterministic change control: preflight underlay/MTU/RT schema before enabling overlays — all overlay problems are visible through BGP EVPN route types before traffic is sent.',
    'Telemetry-ready: LANZ/ERSPAN/sFlow + EOS queue-monitor to prove encapsulation and symmetry under real load.'
  ],

  bestPractices: [
    'Validate underlay MTU end-to-end (≥9214 bytes on all fabric links) before enabling any VXLAN overlay — VXLAN adds 50 bytes of overhead and EOS sets the outer DF bit, so undersized transport MTU causes drops, not fragmentation; silent packet loss that is hard to diagnose.',
    'On Arad, Jericho, and Jericho+ based platforms, verify and configure the TCAM profile before enabling VXLAN routing: `hardware tcam system profile vxlan-routing` — without the correct profile, VXLAN routing entries are not programmed in hardware while the control plane looks healthy; check platform release notes for the exact profile name per EOS version.',
    'On Jericho+ platforms, the recirculation port for VXLAN routing has fixed bandwidth — design the recirculation port bandwidth to be ≥ aggregate uplink bandwidth to the spines; if exceeded, VXLAN-routed packets drop silently with no obvious alarm.',
    'Use a dedicated source loopback (Loopback1) for VXLAN, separate from the BGP router-ID loopback (Loopback0), to decouple data-plane identity from control-plane peering.',
    'VRRP is NOT supported with VXLAN on EOS — use VARP (`ip address virtual`) for distributed gateway; never configure VRRP on a VXLAN SVI.',
    'The `ip address virtual` command provides the shared distributed gateway IP — it cannot be used to form routing adjacencies (BGP, OSPF). Use a separate unique physical SVI IP for any routing protocol peering on the same interface.',
    'In MLAG leaf pairs, both peers must share the same VTEP IP (Loopback1) — configure the same IP address on Loopback1 on both MLAG peers so remote VTEPs see a single logical VTEP. Loopback0 remains unique per node.',
    'Set ARP timeout less than MAC aging time — if MAC ages before ARP, remote VTEPs hold stale MAC entries pointing to the wrong VTEP. Arista reference: ARP timeout = 1 hour, MAC aging = 2 hours. The timer relationship matters more than absolute values; set consistently on all VTEPs.',
    'Always pair VXLAN with an EVPN control plane in production; static flood-lists do not scale, have no MAC mobility, and require manual maintenance.',
    'Run `service routing protocols model multi-agent` before enabling EVPN — without it, EVPN address-family commands will be rejected silently on many EOS versions.',
    'Define VNI allocations from a documented schema before deployment (e.g. L2 VNI = 10000 + VLAN, L3/VRF VNI = 50000 + VRF index) to prevent RT collisions across sites.',
    'Use `ip address virtual` for all Anycast Gateway SVIs — unique per-switch addresses prevent consistent gateway behavior and break host mobility.',
    'In DCI designs, validate whether L2 adjacency is truly required before stretching a VLAN — most failure scenarios, workload migrations, and storage dependencies can be solved with IP reachability and proper routing design; L2 DCI widens the failure domain and should be the exception.',
    'In DCI, ensure HER flood lists are symmetric — if site A includes site B VTEPs, site B must include site A VTEPs. Asymmetric HER causes one-way BUM delivery and produces ARP/ND failures that appear as random host unreachability.',
    'Configure a unique SNAT IP per VRF per VTEP (secondary IP higher than the virtual gateway IP) — without per-VTEP SNAT, traceroute and ping from the fabric cannot be attributed to a specific leaf, making inter-subnet routing failures ambiguous during troubleshooting.',
    'In MLAG + VXLAN deployments, validate consistency of all VXLAN-relevant parameters across both peers: VTI IP, VLAN-to-VNI mapping, HER flood list, UDP port, MAC aging timer, ARP timeout — inconsistency on any produces asymmetric forwarding that appears intermittent from a single node\'s perspective.',
    'Take a snapshot (`show tech-support`, EVPN route counts, ARP table) before and after every change window to enable rapid rollback and RCA.'
  ],

  cliTranslation: [
    {
      legacy: 'feature otv',
      arista: 'interface vxlan1'
    },
    {
      legacy: 'otv control-group 239.1.1.1',
      arista:
        'vxlan source-interface Loopback1  ! Loopback1 = VTEP identity (separate from Loopback0 used as BGP router-ID)'
    },
    {
      legacy: 'otv extend-vlan 10',
      arista: 'vxlan vlan 10 vni 10010'
    },
    {
      legacy: 'otv site-bridge-interface...',
      arista: 'vxlan flood vtep 1.1.1.1 2.2.2.2'
    },
    {
      legacy: 'mpls l2vpn bridge-domain / xconnect',
      arista:
        'vxlan udp-port 4789\nno mac address-table learning vlan 10  ! disable data-plane learn; use EVPN'
    },
    {
      legacy: 'ip directed-broadcast (flood reduction)',
      arista: 'vxlan arp-suppression  ! proxy ARP at VTEP; cuts ARP floods across fabric'
    },
    {
      legacy: '! No TCAM profile concept in classic NX-OS VXLAN\n! VXLAN routing entries just work after enabling feature nv overlay',
      arista:
        '! EOS: some ASICs require explicit TCAM profile for VXLAN routing\n! Arad, Jericho, Jericho+ — check platform release notes for correct name\nhardware tcam system profile vxlan-routing\n! Requires reload to take effect\n! Without this: control plane healthy, data plane silently fails\n!\n! Verify active TCAM profile\nshow hardware tcam profile'
    },
    {
      legacy: '! VRRP standby for default gateway (NX-OS)\ninterface Vlan10\n  vrrp 10 ip 10.10.10.254\n  vrrp 10 preempt',
      arista:
        '! VRRP is NOT supported with VXLAN on EOS — use ip address virtual (VARP)\n! ip address virtual = shared distributed gateway across all VTEPs\nip virtual-router mac-address 00:1c:73:aa:bb:cc\n!\ninterface Vlan10\n   ip address virtual 10.10.10.1/24\n   ! ip address virtual cannot be used for routing adjacencies\n   ! Add a unique IP for any underlay/overlay peering on this SVI\n   ip address 10.10.10.253/24 secondary   ! unique per VTEP for SNAT/diagnostics'
    }
  ],

  masteryPath: [
    {
      level: 'Foundation',
      heading: 'VXLAN Encapsulation and MTU',
      body: 'VXLAN encapsulates a full L2 Ethernet frame (including the original 802.1q tag if present) inside a UDP datagram with destination port 4789. The encapsulation adds: 8B outer Ethernet + 20B outer IP + 8B UDP + 8B VXLAN header = 50 bytes of overhead (54 bytes if an outer dot1q tag is carried). For a 1500-byte overlay MTU, the transport must support at least 1554 bytes (1558 with outer dot1q). Arista EOS sets the outer DF (Don\'t Fragment) bit on VXLAN-encapsulated packets — fragmentation is explicitly disallowed. An undersized transport MTU causes silent drops, not ICMP Fragmentation Needed. This makes MTU validation a mandatory prerequisite before enabling any overlay service — a single undersized link causes intermittent drops that appear as random packet loss across the fabric.',
      keyConcept: 'L2-in-UDP port 4789 · +50 bytes overhead · DF bit set · MTU ≥9214 required'
    },
    {
      level: 'Foundation',
      heading: 'VTEP Identity: Loopback0 vs Loopback1',
      body: 'Two loopbacks serve distinct roles in VXLAN/EVPN fabrics. Loopback0: BGP router-ID and iBGP/eBGP session source — the control-plane identity. Loopback1: VTEP source interface (`vxlan source-interface Loopback1`) — the data-plane identity encoded in the VXLAN outer IP header. Keeping these separate means a BGP session restart (Loopback0 flap) does not change the VTEP IP identity that remote VTEPs use to forward encapsulated traffic. In MLAG leaf pairs, both peers configure the same IP on Loopback1 (shared/anycast VTEP IP) — remote VTEPs see one logical VTEP. Each peer keeps a unique IP on Loopback0 for its BGP session.',
      keyConcept: 'Lo0=BGP identity · Lo1=VTEP identity · MLAG: shared Lo1 + unique Lo0'
    },
    {
      level: 'Logic',
      heading: 'BUM Handling: HER vs Multicast',
      body: 'Broadcast, Unknown Unicast, and Multicast (BUM) frames must be delivered to all VTEPs participating in a given L2VNI. Two delivery methods: Head-End Replication (HER) — the ingress VTEP sends a separate unicast copy to each remote VTEP in the flood list for that VNI; simpler, multicast-free, but replication cost scales with VTEP count. Multicast — a single multicast-group copy distributed by the underlay IP multicast tree; reduces ingress replication but requires multicast in the underlay transport. EVPN with IMET (RT-3) routes drives HER flood list construction dynamically — VTEPs signal BUM interest via BGP rather than static configuration. HER flood lists must be symmetric: if VTEP-A includes VTEP-B in the flood list for VNI X, VTEP-B must include VTEP-A. Asymmetric lists cause one-way BUM delivery and ARP/ND failures that appear as host unreachability.',
      keyConcept: 'HER = unicast copy per VTEP · multicast = underlay mcast · EVPN IMET drives HER lists · symmetric required'
    },
    {
      level: 'Logic',
      heading: 'Gateway Placement and VARP',
      body: 'Anycast Gateways on every leaf (SVI per VNI with `ip address virtual`) minimize hairpinning and enable host mobility — the host\'s default gateway IP and MAC are the same on every VTEP, so a host moving between VTEPs never needs to refresh its ARP entry. VRRP is not supported with VXLAN on EOS — do not configure VRRP on VXLAN SVIs. Use `ip address virtual` for distributed gateway. Key `ip address virtual` behavior: all VTEPs share the same IP and MAC for the virtual gateway; no periodic Gratuitous ARPs; cannot form routing adjacencies over the virtual address — add a unique secondary IP for SNAT/diagnostic traceability. Virtual MAC must be identical on all VTEPs presenting the same gateway: `ip virtual-router mac-address 00:1c:73:xx:xx:xx`.',
      keyConcept: 'ip address virtual on every leaf · VRRP not supported · shared MAC · SNAT secondary IP'
    },
    {
      level: 'Architecture',
      heading: 'Platform and Routing Considerations',
      body: 'Platform-specific requirements before enabling VXLAN routing: (1) TCAM profile — Arad, Jericho, and Jericho+ platforms require `hardware tcam system profile vxlan-routing` before VXLAN routing entries are programmed in hardware. Missing this causes the control plane to look healthy while the data plane silently drops routed traffic. Requires a reload; verify with `show hardware tcam profile`. (2) Jericho+ recirculation port — VXLAN-routed traffic uses a recirculation port with fixed bandwidth. If aggregate VXLAN-routed traffic exceeds recirculation port capacity, packets drop silently. Size recirculation port bandwidth ≥ aggregate leaf uplink bandwidth. (3) ARP and MAC timer discipline — ARP timeout must be less than MAC aging time. Arista reference: ARP timeout = 1 hour, MAC aging = 2 hours. If MAC ages before ARP, remote VTEPs hold stale MAC-to-VTEP mappings and route traffic to the wrong leaf.',
      keyConcept: 'TCAM profile = hardware gate · Jericho+ recirc bandwidth · ARP < MAC aging timer'
    },
    {
      level: 'Architecture',
      heading: 'DCI with VXLAN: Fault Isolation and HER Symmetry',
      body: 'Before designing L2 DCI, validate the actual requirement: does the application need Layer 2 adjacency (L2 multicast heartbeat, live migration with same IP/gateway) or just IP reachability? Most workloads are solvable with routing; L2 DCI widens the blast radius, amplifies BUM across the WAN, and creates non-linear operational complexity as tenant count grows. When L2 DCI is justified: border leaf is the DCI termination point — separate role from compute leaf to limit blast radius. HER flood list symmetry is mandatory — asymmetric lists cause one-way ARP and BUM delivery. Use import/export route policies to prevent remote-site MAC churn from filling local VTEP tables during WAN instability. A VXLAN tunnel-down event at the border leaf must not cause all tenant MAC tables to flush simultaneously — design graceful handling of remote VTEP reachability loss.',
      keyConcept: 'L2 DCI = exception not default · border leaf isolation · symmetric HER · policy against MAC churn'
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

  overview: {
    title: 'VXLAN Data Plane: Encapsulation, BUM, and Gateway Design',
    intro:
      'VXLAN separates tenant semantics from physical topology — a VLAN-to-VNI mapping error or a broken VTEP loopback produces reachability failure even when the physical fabric is fully operational. This makes VXLAN deployments operationally dependent on both overlay correctness and underlay health simultaneously. Understanding encapsulation overhead, BUM delivery choices, gateway placement, and platform-specific requirements is the foundation for operating VXLAN reliably.',
    sections: [
      {
        title: 'Encapsulation and MTU',
        body: 'VXLAN wraps an entire L2 frame in UDP/IP, adding 50 bytes overhead (54 with outer dot1q). EOS sets the outer DF bit — no fragmentation allowed. Transport MTU must be ≥9214 bytes on all fabric links. A single undersized link causes silent drops across the overlay, not ICMP Fragmentation Needed. Validate with: `ping <vtep-ip> source Loopback1 size 8950 df-bit` — if this fails, MTU is undersized.',
        bestFor: 'Day-0 validation. Run before enabling any VXLAN overlay service.'
      },
      {
        title: 'BUM Handling: HER vs Multicast',
        body: 'HER (Head-End Replication): the ingress VTEP sends a unicast copy to each remote VTEP in the flood list for that VNI. Simpler, no multicast required in the transport — the standard for most enterprise and DCI designs. EVPN IMET (RT-3) routes drive dynamic HER list construction: VTEPs signal BUM interest via BGP rather than static configuration. Flood lists must be symmetric — asymmetric lists cause one-way BUM and ARP/ND failure. Multicast: single mcast-group copy distributed by underlay; more efficient at scale but requires multicast in the transport.',
        bestFor: 'HER for all EVPN-controlled fabrics and DCI. Multicast for very large fabrics with native IP multicast underlay.'
      },
      {
        title: 'Distributed Gateway: ip address virtual',
        body: 'Every leaf VTEP hosts the same gateway IP and MAC for each VNI/SVI using `ip address virtual`. VRRP is not supported with VXLAN on EOS — do not configure it on VXLAN SVIs. The virtual MAC must be identical on all VTEPs: `ip virtual-router mac-address 00:1c:73:xx:xx:xx`. Add a unique secondary IP on each SVI for SNAT/diagnostic traceability. Set ARP timeout = 1 hour, MAC aging = 2 hours consistently on all VTEPs.',
        bestFor: 'Every EVPN/VXLAN leaf. ip address virtual is the Arista standard for VXLAN SVIs.'
      },
      {
        title: 'Platform Pre-flight: TCAM Profile',
        body: 'Arad, Jericho, and Jericho+ ASICs require `hardware tcam system profile vxlan-routing` before VXLAN routing is programmed in hardware. Without the correct profile, VXLAN routing entries are absent from the ASIC while the control plane shows healthy — silent data-plane failure. Verify the active profile with `show hardware tcam profile`. The profile change requires a reload — plan this during initial build, not after services are live.',
        bestFor: 'All Jericho/Jericho+ based platforms (7050X3, 7060X5, 7280R, 7500R series). Verify platform release notes.'
      }
    ],
    conclusion:
      'VXLAN deployment order: (1) Validate MTU ≥9214 end-to-end. (2) Verify TCAM profile on Jericho platforms. (3) Establish VTEP loopback reachability. (4) Enable EVPN for control-plane-driven BUM and endpoint discovery. (5) Configure `ip address virtual` (not VRRP) on all leaf SVIs with consistent virtual MAC. (6) Set ARP < MAC aging timers. (7) Verify HER flood-list symmetry. (8) Enable ARP suppression after EVPN converges.'
  },

  primer: {
    title: 'VNI Allocation Schema',
    body: 'A consistent VNI numbering scheme prevents route-target collisions during DCI and simplifies operations. Common convention on Arista: L2 VNIs = 10000 + VLAN ID (e.g., VLAN 100 → VNI 10100), L3/VRF VNIs = 50000 + VRF index (e.g., VRF Prod index 1 → VNI 50001). Route targets follow the VNI: RT for L2 = 10:10100, RT for VRF = 50:50001. Document this schema in a spreadsheet before deployment and treat it as infrastructure topology — changes after go-live require coordinated RT updates across all VTEPs and DCI peers.'
  },

  roleConfigs: [
    {
      role: 'Platform Pre-flight: TCAM Profile',
      description:
        'Required on Arad, Jericho, and Jericho+ platforms before enabling VXLAN routing. Without this, routing entries are absent from hardware while the control plane looks healthy.',
      config: `! Required on: Jericho (7050X3, 7060X5), Jericho2 (7280R, 7500R), Arad
! Without this: show bgp evpn looks healthy; data plane silently drops VXLAN-routed traffic
hardware tcam system profile vxlan-routing
! Requires system reload to take effect
!
! Verify active TCAM profile BEFORE enabling VXLAN services
show hardware tcam profile
! Confirm: active profile shows "vxlan-routing"
!
! Check platform compatibility (profile name varies by EOS version)
! On newer EOS: the profile may be required but have different name
! Always verify against platform-specific release notes before deployment`
    },
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
      description: 'Adds routed VRF services with per-VRF VNI and distributed gateway.',
      config: `! Virtual MAC — must be identical on ALL VTEPs presenting same gateway
ip virtual-router mac-address 00:1c:73:aa:bb:cc
!
interface vxlan1
   vxlan vrf Prod vni 50001
   vxlan vrf Sec vni 50002
!
interface Vlan10
   vrf Prod
   ip address virtual 10.10.10.1/24          ! shared gateway — same on all VTEPs
   ip address 10.10.10.253/24 secondary      ! unique per VTEP for SNAT/diagnostics
!
ip routing vrf Prod
!
! ARP and MAC timer discipline (must match on all VTEPs)
arp timeout 3600                              ! 1 hour — less than MAC aging
mac address-table aging-time 7200            ! 2 hours`
    },
    {
      role: 'MLAG Anycast VTEP',
      description:
        'MLAG leaf pair sharing a single VTEP IP (Loopback1). Both peers advertise the same VTEP IP; Loopback0 remains unique per peer for BGP.',
      config: `! ── LOOPBACK0: unique per peer (BGP router-ID) ───────────────
interface Loopback0
   ip address 1.1.1.1/32          ! Peer-A unique
! interface Loopback0
!    ip address 1.1.1.2/32        ! Peer-B unique
!
! ── LOOPBACK1: same on BOTH MLAG peers (shared VTEP IP) ──────
interface Loopback1
   ip address 1.1.1.100/32        ! Shared VTEP IP — identical on both peers
   ! This is the VXLAN outer IP that remote VTEPs use to encapsulate to this pair
!
! ── VXLAN INTERFACE ────────────────────────────────────────────
interface Vxlan1
   vxlan source-interface Loopback1   ! shared VTEP IP
!
! ── BOTH MLAG PEERS MUST MATCH ────────────────────────────────
! VTI IP (Loopback1): SAME
! VLAN-to-VNI mapping: IDENTICAL
! HER flood list: IDENTICAL per L2VNI
! UDP port: 4789 on both
! MAC aging timer: SAME value
! ARP timeout: SAME value
!
! ── VERIFY ────────────────────────────────────────────────────
show vxlan vtep
! Expect: shared VTEP IP appears as single entry to remote VTEPs
show bgp evpn summary         ! on both peers — route counts should match
show mlag                     ! MLAG healthy before debugging VXLAN`
    },
    {
      role: 'Replication / BUM',
      description: 'Static flood-list (HER) when EVPN is not present.',
      config: `interface vxlan1
   vxlan flood vtep 10.1.1.1 10.1.1.2 10.1.1.3
   ! HER flood list must be SYMMETRIC — if this VTEP includes remote VTEPs,
   ! remote VTEPs must include this VTEP in their flood lists
   ! Asymmetric lists = one-way BUM = ARP/ND failures
!
interface Vlan10
   ip address virtual 10.10.10.1/24
!
! Verify flood list
show vxlan flood vtep vlan 10`
    },
    {
      role: 'Preflight Checklist',
      description: 'Validate underlay and overlay preconditions before enabling VNIs.',
      config: `! ── 1. PLATFORM: TCAM profile on Jericho platforms ──────────
show hardware tcam profile
! Must show: vxlan-routing (if Jericho-based)
!
! ── 2. UNDERLAY: MTU and VTEP loopback reachability ──────────
show int eth1-4 | inc MTU
! All fabric links must show 9214 or higher
ping <remote-vtep-ip> source Loopback1 size 8950 df-bit
! DF-bit + size=8950 tests real transport MTU — failure = MTU undersized
show ip route <remote-vtep-loopback>
! Verify VTEP loopback installed with ECMP paths
!
! ── 3. CONTROL PLANE GUARDRAILS ──────────────────────────────
show interfaces vxlan1 | inc 4789
show interfaces vxlan1 counters
!
! ── 4. RT SCHEMA HYGIENE (EVPN deployments) ──────────────────
show bgp evpn route-type imet
show bgp evpn route-type macip
!
! ── 5. MLAG CONSISTENCY (if MLAG leaf pair) ──────────────────
show mlag
show mlag detail
! MLAG must be healthy before enabling VXLAN services`
    },
    {
      role: 'ARP and MAC Timer Discipline',
      description:
        'ARP timeout must be less than MAC aging time. Consistent values required on all VTEPs.',
      config: `! ARP must age before MAC — if MAC ages first, remote VTEPs
! hold stale MAC-to-VTEP mappings and route to wrong leaf
!
! Arista reference values (per EOS VXLAN Best Practices):
! ARP timeout = 1 hour (3600 seconds)
! MAC aging  = 2 hours (7200 seconds)
!
! Apply globally
arp timeout 3600          ! default is 14400 — reduce to 3600
mac address-table aging-time 7200   ! default is 300 — increase for stability
!
! Verify on BOTH MLAG peers — values must match
show arp timeout
show mac address-table aging-time
!
! Per-SVI override if needed (more specific than global)
interface Vlan10
   arp timeout 3600`
    },
    {
      role: 'DCI Border Leaf',
      description:
        'Border leaf as DCI termination point with HER and fault-domain isolation policy.',
      config: `! ── BORDER LEAF: DCI VTEP ────────────────────────────────────
! Border leaf terminates DCI VXLAN tunnels — separate role from compute leaf
!
interface Vxlan1
   vxlan source-interface Loopback1
   vxlan udp-port 4789
   vxlan vlan 10 vni 10010           ! L2 extension — only when truly needed
   vxlan vrf WAN vni 60001           ! L3 VRF for DCI routing
!
! ── HER FLOOD LIST (if EVPN IMET not available cross-site) ───
interface Vxlan1
   vxlan flood vtep <site-B-vtep1> <site-B-vtep2>
   ! Symmetric: site B must also include this VTEP in their flood list
!
! ── POLICY: prevent remote MAC churn from filling local tables ─
router bgp 65000
   neighbor <remote-site-VTEP> route-map DCI-IN in
   neighbor <remote-site-VTEP> maximum-routes 5000 warning-limit 80 percent warning-only
!
! ── VERIFY DCI HEALTH ─────────────────────────────────────────
show vxlan vtep
! Confirm: remote site VTEPs appear in VTEP table
show vxlan flood vtep vlan 10
! Confirm: flood list is complete and symmetric
show bgp evpn summary
! Confirm: cross-site EVPN sessions established and route counts expected`
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
!
! MTU proof under load
ping <remote-vtep> source Loopback1 size 8950 df-bit repeat 100`
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
! MTU / silent drops — DF bit test
ping 10.10.10.1 size 8950 df-bit source Loopback1
!
! Flood list / IMET
show bgp evpn route-type imet vni 10010
show vxlan flood vtep vlan 10
!
! VTEP reachability
show vxlan vtep
!
! Platform: check for TCAM profile issue
show hardware tcam profile
! If "vxlan-routing" not shown on Jericho platform: silent data plane failure`
    },
    {
      role: 'Safe Defaults (VXLAN/EVPN)',
      description: 'Baseline knobs to keep overlays stable and observable.',
      config: `interface vxlan1
   vxlan udp-port 4789
   vxlan source-interface Loopback1
!
! TCAM profile — Jericho platforms only (check platform release notes)
! hardware tcam
!    system profile vxlan-routing
!
service routing protocols model multi-agent
logging event link-status global
!
router bgp 65001
   neighbor SPINES peer-group
   neighbor SPINES send-community extended
!
! ERSPAN/sFlow ready
monitor session EVPN erspan ip-destination 10.10.200.10
!
! Timer discipline
arp timeout 3600
mac address-table aging-time 7200`
    },
    {
      role: 'ESI Multi-Homing',
      description:
        'Dual-homed server/leaf using EVPN ESI all-active (preferred over MLAG for spine uplinks).',
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
      role: 'ARP Suppression + Validation',
      description:
        'Enable EVPN ARP suppression on the VXLAN interface and verify the RT-2 MAC/IP cache is being used.',
      config: `! Enable ARP suppression on VXLAN interface (EOS 4.25+)
interface vxlan1
   vxlan arp-suppression
!
! ip proxy-arp is NOT needed for distributed Anycast GW (ip address virtual)
! EVPN ARP suppression intercepts ARP requests and answers from the RT-2 MAC/IP cache
!
! Verify ARP cache is populated at VTEP from EVPN RT-2 routes
show vxlan address-table vni 10010
show arp vrf Prod
show interfaces vxlan1 counters | include arp-suppress`
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
  ],

  referenceLinks: [
    {
      title: 'Arista EOS User Manual — VXLAN',
      summary: 'Authoritative EOS VXLAN configuration model and platform caveats.',
      url: 'https://www.arista.com/en/um-eos/eos-vxlan-configuration'
    },
    {
      title: 'Arista EOS User Manual — VARP / Anycast Gateway',
      summary: 'EOS behavior for Anycast gateway with distributed first-hop routing.',
      url: 'https://www.arista.com/en/um-eos/eos-varp-and-vxlan-anycast-gateway'
    },
    {
      title: 'RFC 7348 VXLAN',
      summary: 'Official VXLAN encapsulation and tunnel endpoint behavior.',
      url: 'https://www.rfc-editor.org/rfc/rfc7348'
    },
    {
      title: 'RFC 8365 NVO with EVPN',
      summary: 'Control-plane guidance when pairing VXLAN with EVPN.',
      url: 'https://www.rfc-editor.org/rfc/rfc8365'
    },
    {
      title: 'Arista AVD Documentation',
      summary: 'Validated deployment patterns and automation examples for EVPN/VXLAN fabrics.',
      url: 'https://avd.arista.com'
    },
    {
      title: 'Arista EOS VXLAN Platform and Routing Best Practices',
      summary:
        'Platform-specific guidance: TCAM profile, Jericho+ recirculation port sizing, VARP vs VRRP, ip address virtual mechanics, ARP/MAC timer discipline, and MLAG+VXLAN consistency requirements.'
    }
  ],

  dcContext: {
    small: {
      scale: '2-tier · 2 spines · 4 leaves · ≤ 200 hosts',
      topologyRole:
        'VTEP on every leaf; VNI-per-VLAN; spines are pure L3 underlay. TCAM profile verified on day-0. MTU 9214 on all links. ip address virtual on all SVIs with consistent virtual MAC.',
      keyConfig: 'vxlan vlan 10 vni 10010\nip address virtual 10.10.10.1/24',
      highlight: 'leaf-spine'
    },
    medium: {
      scale: '3-tier · 4 spines · 8–16 leaves · 2 pods',
      topologyRole:
        'MLAG leaf pairs with shared VTEP IP (Loopback1). EVPN IMET-driven HER flood lists. SNAT secondary IPs for diagnostic traceability. ARP < MAC aging timers consistent across all VTEPs.',
      keyConfig: `! MLAG anycast VTEP
interface Loopback1
   ip address 1.1.1.100/32        ! same on both MLAG peers`,
      highlight: 'isl'
    },
    large: {
      scale: 'Multi-pod · super-spine · 32+ leaves · 10k+ hosts',
      topologyRole:
        'DCI via border leaf (dedicated role, not compute leaf). L2 DCI only where truly required. HER flood list symmetry enforced. Route policy at DCI peer to prevent remote MAC churn from flooding local tables. EVPN IMET for dynamic flood list management.',
      keyConfig: `vxlan flood vtep learned  ! EVPN IMET-driven replication
! DCI border leaf: route policy
neighbor <remote-vtep> maximum-routes 5000 warning-limit 80 percent warning-only`,
      highlight: 'border'
    }
  }
};
