import { ProtocolDetail } from './types';

export const MLAG_PROTOCOL: ProtocolDetail = {
  id: 'mlag',
  name: 'MLAG',
  legacyTerm: 'VPC / Stackwise',
  tagline: 'Non-stop Layer 2 Dual-Homing without Stack Dependence.',
  description:
    'Multi-Chassis Link Aggregation lets two independent switches act as a single logical LAG endpoint to downstream devices, keeping control planes independent while providing active-active connectivity. Arista MLAG derives a shared MLAG system-ID from the lowest MAC address (locally administered bit set) when the pair forms — downstream LACP neighbors see one logical switch, and the system-ID is preserved across reboots so RMA replacements do not require LACP renegotiation on the far end. Spanning-tree runs only on the primary peer; the secondary holds the STP agent in standby. MAC address and IGMP state are synchronized continuously between peers; ARP is not — each peer builds its own ARP table independently, which creates asymmetric ARP state during failover scenarios.',

  keyBenefits: [
    'Active-active L2 without spanning tree blocking — both peers forward for every MLAG port-channel simultaneously.',
    'Independent control planes — no chassis master/slave dependency; either peer can operate independently during partial failure.',
    'MLAG system-ID is shared to downstream LACP peers and preserved across reboots — RMA replacement of one peer does not require LACP renegotiation on downstream servers or storage.',
    'Spanning-tree runs on the primary peer only (secondary holds STP agent in standby) — STP topology is consistent because it is driven by one authoritative peer.',
    'MAC address table and IGMP snooping state are synchronized continuously between peers — failover does not require MAC re-learning.',
    'ARP table is not synchronized — each peer builds ARP independently; this is a design characteristic to account for during failover planning, not a bug.',
    'Fast convergence on peer-link or member-link failure — EOS hardware redirects affected flows across the peer-link at line rate with no software reconvergence delay.',
    'Simple operational model compared to stacking — no shared control plane, no split-brain from a single supervisor failure.'
  ],

  bestPractices: [
    'Understand EOS MLAG split-brain behavior. When the peer-link goes down, EOS automatically places the secondary switch into MLAG-inactive (disabling its MLAG port-channels) using the last synchronized state — this behavior is built in and requires no configuration. The true split-brain condition occurs when the peer-link fails AND both peers lose visibility into each other\'s state, causing each to assume the primary role. Verify MLAG state with `show mlag detail`.',
    'Set `reload-delay mlag 300` and `reload-delay non-mlag 330` on standard fixed-config platforms (7050X3, 720XP, etc.). High-end platforms (7280R, 7500R, 7800R) default to 900s — always verify with `show mlag detail` before overriding, as a value too short causes post-boot black holes.',
    'Resolve every `show mlag config-sanity` warning before go-live. Arista explicitly states these must be rectified in production — mismatched VLANs, STP config, or port-channel modes cause one-way forwarding failures that are difficult to diagnose under load.',
    'Apply `lacp timer fast` on each Ethernet member interface (not on the Port-Channel) — the default slow timer means a link failure goes undetected for up to 90 seconds. Fast timers reduce detection to ~3 seconds (1s PDU interval × 3 missed PDUs). Note: `lacp rate fast` is Cisco IOS syntax and is not valid in EOS.',
    'On Arista EOS, when a MLAG member link fails, the ASIC redirects affected data-plane flows across the peer-link in hardware at line rate — there is no software reconvergence delay. The peer-link must handle the full redirected data traffic of the failed peer. Size the peer-link so its aggregate bandwidth matches the maximum active MLAG uplink capacity on one peer (e.g., 4×100G uplinks → peer-link ≥ 400G). Monitor with `show interfaces Port-Channel1000 counters` — an unexpected traffic spike on the peer-link is the first indicator that a MLAG member link has gone inactive.',
    'Peer-link physical members must span across ASICs on fixed-config platforms and across line cards on modular platforms — a single-ASIC or single-line-card peer-link is not resilient and loses redundancy on a single hardware failure. This is a hard requirement, not optional.',
    'Use Port-Channel1000 as the peer-link port-channel ID — it visually distinguishes the peer-link from downstream MLAG port-channels (which use low IDs matching the MLAG ID) and eliminates a common source of operational confusion in troubleshooting.',
    'Set MTU 9214 on the MLAG peer SVI (Vlan4094) — without it, jumbo-frame control traffic is silently fragmented, which can cause intermittent MLAG negotiation issues under load without a clear error.',
    'Apply `switchport trunk native vlan tag` on the peer-link port-channel — prevents untagged frame leakage where the peer-link native VLAN bleeds into the wrong L2 domain.',
    'Disable spanning-tree on VLAN 4094 with `no spanning-tree vlan 4094` — without this, the peer-link SVI can enter a discarding state, breaking MLAG control-plane without triggering a clear alarm.',
    'MLAG ID should match the port-channel ID on downstream MLAG port-channels — this is a strong operational convention that eliminates a common confusion source during troubleshooting and support calls.',
    'Reserve MLAG for server and access-layer dual-homing in brownfield environments. For greenfield VXLAN/EVPN fabrics, prefer EVPN ESI All-Active multi-homing for downstream devices — ESI eliminates the peer-link requirement. Leaf-to-spine uplinks are always independent routed links in both models, not LAGs.',
    'EOS MLAG control-plane synchronization uses TCP/UDP port 4432 between peers. If a control-plane ACL is applied to management interfaces or Vlan4094, verify port 4432 is explicitly permitted — blocking it silently disrupts MAC/IGMP state sync without triggering a peer-link down alarm.',
    'EOS MLAG synchronizes MAC tables and IGMP snooping state across peers; ARP tables are not synchronized. After a peer reloads, ARP convergence depends on live data-plane traffic or explicit ARP requests. For active-active L3 gateways on MLAG SVIs, configure VARP (`ip virtual-router mac-address` + `ip virtual-router address`) so both peers respond identically to ARP for the shared gateway IP.'
  ],

  cliTranslation: [
    {
      legacy: 'vpc domain 10',
      arista: 'mlag configuration\n   domain-id FABRIC'
    },
    {
      legacy: 'peer-keepalive destination 10.0.0.2',
      arista:
        "peer-address 10.255.0.2\n   ! peer-address = peer's local-interface (Vlan4094) IP — in-band, default VRF only\n   ! No vrf qualifier exists on plain peer-address"
    },
    {
      legacy: 'vpc peer-link port-channel1',
      arista:
        'peer-link Port-Channel1000\n   reload-delay mlag 300\n   reload-delay non-mlag 330\n   ! Port-Channel1000 convention: visually separates peer-link from downstream MLAG PCs'
    },
    {
      legacy: 'interface port-channel10\n  vpc 10',
      arista:
        'interface Port-Channel10\n   mlag 10\ninterface Ethernet1\n   channel-group 10 mode active\n   lacp timer fast'
    },
    {
      legacy: 'show vpc',
      arista: 'show mlag\nshow mlag detail'
    },
    {
      legacy: 'show vpc consistency-parameters',
      arista: 'show mlag config-sanity'
    },
    {
      legacy: 'show port-channel summary (NX-OS)',
      arista: 'show port-channel summary\nshow mlag interfaces'
    }
  ],

  masteryPath: [
    {
      level: 'Foundation',
      heading: 'MLAG Control Plane and State Synchronization',
      body: 'MLAG creates a shared logical switch identity without a shared control plane. When the peer-link forms, EOS derives a shared MLAG system-ID from the lowest MAC address between the two peers (locally administered bit set). Downstream LACP neighbors see this system-ID and believe they are connected to a single switch. The system-ID is preserved across reboots — an RMA replacement does not require LACP renegotiation on downstream devices. State synchronization model: MAC address table and IGMP snooping state are synchronized continuously between peers; ARP table is not synchronized (each peer builds its own ARP state independently). Spanning-tree runs only on the primary peer — the secondary holds the STP agent in standby, and STP topology decisions are driven entirely by the primary. STP global configuration (mode, VLAN priority) and per-MLAG-interface STP configuration must be identical on both peers.',
      keyConcept: 'shared system-ID · MAC/IGMP sync · ARP not sync · STP on primary only'
    },
    {
      level: 'Logic',
      heading: 'Peer-Link: Design Object, Not a Checkbox',
      body: 'The peer-link carries both MLAG control-plane synchronization (MAC/IGMP tables, MLAG negotiation) and data-plane failover traffic. When a MLAG member link fails, EOS hardware immediately redirects affected flows across the peer-link at line rate with no software reconvergence delay — the peer-link absorbs 100% of the failed peer\'s active MLAG traffic instantaneously. Sizing rule: peer-link aggregate bandwidth must equal the total leaf-to-spine uplink capacity of one peer. Physical member selection: span across ASICs on fixed platforms, across line cards on modular platforms — a single-ASIC peer-link loses all redundancy on a single ASIC failure, not a hard failure. Use Port-Channel1000 (high ID) as the peer-link — it visually separates the peer-link from downstream MLAG port-channels (low IDs matching MLAG ID) and eliminates operational confusion. Set MTU 9214 on the peer SVI and `switchport trunk native vlan tag` on the peer-link to prevent silent fragmentation and untagged frame leakage.',
      keyConcept: 'size for full uplink capacity · span ASICs · Port-Channel1000 · MTU 9214'
    },
    {
      level: 'Logic',
      heading: 'Config Sanity and Consistency',
      body: 'MLAG requires identical configuration on both peers for all MLAG-relevant attributes: VLAN trunk allowed lists, native VLAN, port-channel mode, STP global and per-interface config, IGMP snooping config. A mismatch does not always prevent MLAG from forming — it causes forwarding asymmetry that appears healthy from the host side (traffic works in one direction but not the other). EOS surfaces mismatches via `show mlag config-sanity`, which shows the Feature | Attribute | Local Value | Peer Value table. Arista explicitly states these must be resolved before production. The failure mode is difficult to diagnose under load because the host-facing LAG appears up on both sides while one direction silently drops. Run config-sanity on both peers before any go-live or change window.',
      keyConcept: 'VLAN/STP/IGMP must match · show mlag config-sanity · asymmetric forwarding'
    },
    {
      level: 'Architecture',
      heading: 'Reload-Delay Logic',
      body: 'reload-delay is the time an MLAG switch waits after boot before advertising itself as active. Without it, the switch starts forwarding before MLAG state is synchronized, causing transient black holes. `reload-delay mlag 300` holds MLAG interfaces down for 300 seconds after reboot — covers BGP reconvergence, MLAG state sync, and STP re-topology. `reload-delay non-mlag 330` adds 30 seconds for non-MLAG interfaces to prevent them from taking traffic before the MLAG state is confirmed. High-end platforms (7280R, 7500R, 7800R) default to 900s — verify with `show mlag detail` before overriding. reload-delay is a boot-time timer only — it does not apply to peer-link recovery (MLAG re-syncs within seconds after peer-link restores, not after a reload-delay window). Always set on both peers.',
      keyConcept: 'reload-delay 300 mlag · 330 non-mlag · boot-time only · verify before override'
    },
    {
      level: 'Architecture',
      heading: 'MLAG vs EVPN ESI: Decision Framework',
      body: 'Use MLAG when: downstream devices do not support EVPN ESI (standard servers, storage arrays), you need L2 active-active dual-homing without BGP/EVPN at the edge, or brownfield environments where EVPN cannot be added. MLAG limitations: peer-link is a single blast radius, ARP is not synchronized (asymmetric failover), scales operationally to ~10-20 MLAG pairs per DC fabric before it becomes a management burden. Use EVPN ESI All-Active when: the fabric already runs EVPN, you want to eliminate the peer-link completely, or you need multi-site DCI with consistent multi-homing. Both can coexist: MLAG for access-layer dual-homing where servers do not support ESI, ESI for leaf-to-leaf and DCI multi-homing. Leaf-to-spine uplinks are always independent routed links in both models.',
      keyConcept: 'MLAG = access / brownfield · ESI = fabric / DCI / greenfield'
    },
    {
      level: 'Architecture',
      heading: 'MLAG Verification Sequence',
      body: 'Seven-step MLAG verification workflow — start at the pair, not the host: (1) Confirm pair health — `show mlag`, `show mlag detail` — both peers must show state: active, peer: connected, identical system-ID. (2) Validate peer-link — `show interfaces port-channel 1000`, `show ip interface brief | include Vlan4094` — peer-link bundled, peer SVI up; Vlan4094 SVI down = full MLAG control-plane loss. (3) Validate downstream attachment — `show port-channel dense`, `show running-config section mlag` — MLAG port-channels formed, config matches intent. (4) Check config consistency — `show mlag config-sanity` — must be clean before investigating host or overlay issues; any output = forwarding asymmetry risk. (5) Check gateway and VLAN state — `show ip virtual-router`, `show arp`, `show mac address-table vlan 100` — virtual gateway identity exists; ARP must be checked on both peers independently. (6) Access-layer hygiene — `show spanning-tree interface ethernet 21 detail`, `show interfaces ethernet 21 switchport` — portfast, bpduguard set as intended. (7) If EVPN/VXLAN: `show bgp evpn summary`, `show vxlan vtep` — if MLAG is healthy, move up to overlay.',
      keyConcept: 'pair health → peer-link → attachment → config-sanity → gateway → access → overlay'
    }
  ],

  overview: {
    title: 'MLAG Topology',
    intro:
      "MLAG pairs two independent switches (PEER_A and PEER_B) to appear as a single logical switch to downstream LAG members. The peer-link carries both MLAG control-plane synchronization (MAC/IGMP state, negotiation) and data-plane failover traffic. Unlike Cisco vPC — where a separate peer-keepalive link is mandatory to form the vPC domain — Arista MLAG forms using only the peer-link SVI (`peer-address` references the peer's `local-interface` Vlan4094 IP). The MLAG system-ID (derived from lowest peer MAC, locally administered bit set) is shared to all downstream LACP neighbors and preserved across reboots.",
    sections: [
      {
        title: 'Peer-Link Role',
        body: "The peer-link (Port-Channel1000 by convention) carries: (1) control-plane synchronization (MAC/IGMP tables, MLAG state), (2) data-plane traffic redirected in hardware when one peer loses a MLAG member link. EOS redirects at line rate with no software reconvergence delay — the peer-link must absorb 100% of the failed peer's active MLAG traffic instantaneously. Span physical members across ASICs (fixed platforms) or line cards (modular platforms) — a single-ASIC peer-link loses redundancy on ASIC failure, not just physical link failure.",
        bestFor:
          '≥2×100G LAG peer-link (Port-Channel1000). Span across ASICs. Never a single physical link or single-ASIC.'
      },
      {
        title: 'Peer-Address Role',
        body: "The `peer-address` (configured under `mlag configuration`) is the IP of the peer's `local-interface` SVI (Vlan4094) — in-band, default VRF only. No `vrf` qualifier is valid here. When the peer-link fails, EOS uses last-synchronized state to place the secondary into MLAG-inactive. The peer SVI requires `no autostate` (keeps SVI up when member ports are removed) and MTU 9214 (prevents silent fragmentation of jumbo control traffic).",
        bestFor:
          'peer-address = peer-link SVI IP (in-band, default VRF). no autostate + MTU 9214 required on Vlan4094.'
      }
    ],
    conclusion:
      'MLAG summary: peer-link = data failover + state sync (size for full uplink capacity of one peer). peer-address = peer-link SVI IP (in-band, default VRF, no vrf qualifier). ARP is not synchronized — both peers build ARP state independently. Config-sanity must be clean before production. Test peer-link failure behavior in lab before go-live.'
  },

  primer: {
    title: 'Why the Peer-Link is the Single Most Critical MLAG Component',
    body: "Unlike Cisco vPC — where a peer-keepalive link is mandatory before the vPC domain forms — Arista MLAG requires no separate channel to operate. The peer-link carries both MLAG control-plane sync (MAC/IGMP tables, MLAG state) and data-plane failover traffic. When a MLAG member link fails, EOS hardware immediately redirects affected flows across the peer-link at line rate with no software reconvergence. The peer-link must be sized to absorb 100% of one peer's active MLAG traffic. Peer-link physical members must span ASICs (fixed platforms) or line cards (modular) — a single-ASIC peer-link is not resilient. A peer-link failure is the highest-impact event: EOS uses last-synchronized state to place the secondary into MLAG-inactive and disable its port-channels. Size the peer-link as a LAG with ≥2 members (Port-Channel1000 by convention), monitor it continuously, and test peer-link failure in lab before production."
  },

  roleConfigs: [
    {
      role: 'MLAG Deployment Baseline',
      description:
        'Complete EOS MLAG deployment configuration from Arista baseline — peer VLAN isolation, peer SVI, peer-link, MLAG global, and VARP gateway.',
      config: `! ── 1. PEER VLAN — isolate and protect ───────────────────────
no spanning-tree vlan 4094

vlan 4094
   name mlag-peer-link
   trunk group mlag-peer

! ── 2. PEER VLAN SVI ──────────────────────────────────────────
interface Vlan4094
   description MLAG-Peer-SVI
   ip address 1.1.1.1/30          ! peer uses 1.1.1.2/30
   no autostate                    ! SVI stays up when members removed
   mtu 9214                        ! prevents silent fragmentation of control traffic

! ── 3. PEER-LINK PORT-CHANNEL ─────────────────────────────────
! Port-Channel1000 = convention: visually separates peer-link from
! downstream MLAG PCs (which use low IDs matching MLAG ID)
interface Port-Channel1000
   description MLAG-Peer-Link
   switchport mode trunk
   switchport trunk group mlag-peer
   switchport trunk native vlan tag     ! prevents untagged frame leakage
   no spanning-tree portfast

! ── 4. PEER-LINK PHYSICAL MEMBERS ────────────────────────────
! Span across ASICs (fixed platforms) or line cards (modular)
interface Ethernet51/1
   description MLAG-Peer-Link-Member
   channel-group 1000 mode active
interface Ethernet52/1
   description MLAG-Peer-Link-Member
   channel-group 1000 mode active

! ── 5. MLAG GLOBAL ────────────────────────────────────────────
mlag configuration
   domain-id <unique-per-leaf-pair>   ! unique across all MLAG pairs in the DC
   local-interface Vlan4094
   peer-address 1.1.1.2               ! peer's Vlan4094 IP — in-band, default VRF
   peer-link Port-Channel1000
   reload-delay mlag 300
   reload-delay non-mlag 330

! ── 6. VARP VIRTUAL GATEWAY ───────────────────────────────────
ip virtual-router mac-address 00:1c:73:00:00:99

interface Vlan100
   description SVI-VLAN-100
   mtu 9214
   ip address 172.20.0.2/24           ! unique per peer
   ip virtual-router address 172.20.0.1/24   ! shared — same on both peers
   arp timeout 900
   no shutdown

! ── 7. DOWNSTREAM MLAG PORT-CHANNEL ──────────────────────────
! MLAG ID matches port-channel ID (operational convention)
interface Port-Channel10
   switchport mode trunk
   mlag 10

interface Ethernet11
   description host-mlag-link
   channel-group 10 mode active
   lacp timer fast`
    },
    {
      role: 'Access LAG with MLAG',
      description:
        'Dual-homed server with fast LACP timers. lacp timer fast is on Ethernet members, not the port-channel.',
      config: `! ── MLAG GLOBAL CONFIG ───────────────────────────────────────
mlag configuration
   domain-id FABRIC
   local-interface Vlan4094
   peer-address 10.255.0.2        ! peer's Vlan4094 IP — in-band, default VRF only
   peer-link Port-Channel1000
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
      role: 'VARP — Active-Active Gateway',
      description:
        'Virtual ARP (VARP) makes both MLAG peers respond to ARP for the same gateway IP using a shared virtual MAC. Required for active-active L3 forwarding on MLAG SVIs.',
      config: `! ── VARP GLOBAL (same on both peers) ─────────────────────────
ip virtual-router mac-address 001c.7300.0099
!
! ── SVI WITH VARP (repeat per tenant VLAN) ───────────────────
interface Vlan100
   ip address 10.100.0.1/24        ! unique per peer (each peer has its own IP)
   ip virtual-router address 10.100.0.254   ! shared gateway — same on both peers
!
! ── VERIFY ────────────────────────────────────────────────────
show ip virtual-router
! Expected: virtual MAC 001c.7300.0099, virtual IP 10.100.0.254, state: active
show arp vrf default
! Both peers should ARP-respond for 10.100.0.254`
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
      role: 'MLAG Verification Sequence',
      description: 'Seven-phase operational health verification — start at the pair, not the host.',
      config: `! Phase 1: Confirm pair health
show mlag
show mlag detail
! Both peers: State=active, Peer State=active, identical system-ID
!
! Phase 2: Validate peer-link and peer SVI
show interfaces port-channel 1000
show ip interface brief | include Vlan4094
show vlan id 4094
! Peer SVI down = full MLAG control-plane loss
!
! Phase 3: Downstream attachment consistency
show port-channel dense
show interfaces status connected
show running-config section mlag
!
! Phase 4: Config consistency across peers (must be clean)
show mlag config-sanity
! Any output = config mismatch → forwarding asymmetry
!
! Phase 5: Gateway and VLAN state
show ip virtual-router
show arp
show mac address-table vlan 100
! ARP: check both peers independently — not synchronized
!
! Phase 6: Access-layer hygiene
show spanning-tree interface ethernet 21 detail
show interfaces ethernet 21 switchport
!
! Phase 7: If EVPN/VXLAN — MLAG is prerequisite layer
show bgp evpn summary
show vxlan vtep`
    },
    {
      role: 'MLAG Upgrade Runbook',
      description: 'Rolling MLAG upgrade: secondary first, validate re-sync, then primary.',
      config: `! ── PRE-UPGRADE HEALTH CHECKS (both peers) ──────────────────
show mlag                          ! state: active, peer: connected
show mlag detail                   ! note reload-delay values and primary/secondary
show mlag interfaces               ! all interfaces: active (local + peer)
show mlag config-sanity            ! must be clean — resolve any mismatch first
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
show interfaces Port-Channel1000 counters  ! no drops on peer-link
show mlag                                  ! peer: disconnected = normal
!
! ── STEP 4: VALIDATE SECONDARY AFTER RETURN ──────────────────
! Wait for full reload-delay mlag period — verify exact value with
! 'show mlag detail' before overriding; too short = post-boot black holes
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
      role: 'Peer-Link Failure Drill',
      description:
        'Safely test peer-link loss behavior (split-brain prevention) in a maintenance window.',
      config: `! ── PRE-DRILL BASELINE ───────────────────────────────────────
show mlag detail
! Note which peer is "negotiated primary" and which is "secondary"
! Primary = higher MLAG priority (lower number wins, default 32767)
show mlag interfaces         ! baseline: all MLAG IDs active
!
! ── SIMULATE PEER-LINK FAILURE ───────────────────────────────
! Shut peer-link on SECONDARY peer only
interface Port-Channel1000
   shutdown
!
! ── OBSERVE SPLIT-BRAIN PREVENTION ──────────────────────────
! On PRIMARY peer — should remain active and forward:
show mlag
! Expected: Peer link: Down, State: active (primary retains MLAG port-channels)
!
! On SECONDARY peer — should disable MLAG port-channels:
show mlag
! Expected: MLAG interfaces errdisabled (peer-link down, no peer)
! EOS uses last synchronized state to place secondary into inactive
!
! ── RESTORE PEER-LINK ────────────────────────────────────────
interface Port-Channel1000
   no shutdown
!
! MLAG re-syncs quickly (seconds) after peer-link restore — no reload-delay wait.
! reload-delay is a BOOT-TIME timer only; does not apply to peer-link recovery.
show mlag
show mlag interfaces         ! all MLAG IDs must return to active within seconds
show mlag config-sanity      ! must be clean after restore`
    },
    {
      role: 'Troubleshooting Map',
      description:
        'Common MLAG failure symptoms, root causes, and targeted show commands.',
      config: `! ── SYMPTOM: MLAG interfaces in "inactive" or "errdisabled" ──
show mlag interfaces
! Check "local" and "peer" columns — both must show "active"
! errdisabled reason "mlag-issu" = normal during reload-delay window
show mlag
! Check: Peer State (connected vs disconnected), Peer link (Up/Down)
show mlag config-sanity
! Non-empty output = config mismatch causing MLAG to hold interface
ping <peer-vlan4094-ip> repeat 10  ! via peer-link SVI (in-band)
! Peer-link down = MLAG control-plane loss → secondary disables MLAG port-channels
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
show interfaces Port-Channel1000 counters
! Rate spike = one MLAG port is inactive → all traffic via peer-link
show mac address-table | include Peer-Link
! Excess MACs via peer-link = asymmetric MAC learning / inactive port
!
! ── SYMPTOM: LACP PDU timeout / port-channel not bundling ────
show lacp counters
! RX PDU counter not incrementing = no PDUs arriving from far end
! Cause: far end slow LACP (30s default) vs fast (1s)
show lacp neighbor
! Mismatch in system IDs = MLAG system-ID not applied correctly
!
! ── SYMPTOM: Config-sanity reports VLAN or mode mismatch ─────
show mlag config-sanity
! Feature | Attribute | Local Value | Peer Value
! Fix VLANs: ensure "switchport trunk allowed vlan" identical both peers`
    },
    {
      role: 'Split-Brain Recovery',
      description:
        'Recover from an MLAG split-brain where both peers are independently active.',
      config: `! ── DETECT SPLIT-BRAIN ───────────────────────────────────────
! Both peers show "state: active" but peer link is down AND
! both switches have lost visibility into each other's state
show mlag
! Watch for: State: active, Peer: inactive on BOTH peers simultaneously
!
! ── STEP 1: ESTABLISH OOB CONNECTIVITY FIRST ─────────────────
! Establish out-of-band access (console, mgmt cable) to both peers
!
! ── STEP 2: BRING ONE PEER DOWN GRACEFULLY ───────────────────
! Disable MLAG on the secondary (lower priority) peer:
! On secondary:
mlag configuration
   no peer-link Port-Channel1000  ! forces secondary into inactive
!
! ── STEP 3: RESTORE PEER-LINK ────────────────────────────────
interface Port-Channel1000
   no shutdown
!
! ── STEP 4: RE-ENABLE MLAG ON SECONDARY ──────────────────────
mlag configuration
   peer-link Port-Channel1000
!
! ── STEP 5: VERIFY FULL RECOVERY ─────────────────────────────
show mlag                   ! both peers active, peer: connected
show mlag interfaces        ! all MLAG IDs back to active
show mlag config-sanity     ! clean
show mac address-table      ! flush stale entries if needed: clear mac address-table dynamic`
    }
  ],

  referenceLinks: [
    {
      title: 'Arista EOS User Manual — MLAG',
      summary:
        'Authoritative MLAG configuration, peer-link behavior, reload-delay, and troubleshooting commands.',
      url: 'https://www.arista.com/en/um-eos/eos-multi-chassis-link-aggregation'
    },
    {
      title: 'Arista EOS User Manual — LACP',
      summary: 'LACP timers, member behavior, and operational checks used with MLAG.',
      url: 'https://www.arista.com/en/um-eos/eos-link-aggregation-and-lacp'
    },
    {
      title: 'Arista EOS User Manual — STP',
      summary:
        'STP interactions and edge-port guidance relevant to MLAG access design — STP runs on primary peer only.',
      url: 'https://www.arista.com/en/um-eos/eos-spanning-tree-protocol'
    },
    {
      title: 'Arista EVPN Multi-Homing Documentation',
      summary:
        'Design tradeoffs between classic MLAG and EVPN ESI all-active multi-homing — when to use each.',
      url: 'https://www.arista.com/en/um-eos/eos-evpn-multi-homing'
    }
  ],

  dcContext: {
    small: {
      scale: '2-tier · 2-node MLAG core · 4 access leaves',
      topologyRole:
        'MLAG core pair acts as spines; servers dual-home to core. Peer-link on ≥2×100G spanning ASICs. VARP for active-active gateway on all tenant SVIs. `no spanning-tree vlan 4094` and trunk group isolation in place.',
      keyConfig: `mlag configuration
   domain-id CORE
   local-interface Vlan4094
   peer-link Port-Channel1000
   reload-delay mlag 300`,
      highlight: 'isl'
    },
    medium: {
      scale: '3-tier · 8 MLAG leaf pairs · dedicated spines',
      topologyRole:
        'MLAG per leaf pair for server active-active. Each leaf pair: unique domain-id, Port-Channel1000 peer-link, VARP on all tenant SVIs. Leaf-to-spine uplinks are independent routed L3 links (not LAGs). Port 4432 permitted in any control-plane ACL.',
      keyConfig: `mlag configuration
   peer-link Port-Channel1000
   reload-delay mlag 300
   reload-delay non-mlag 330
!
ip virtual-router mac-address 001c.7300.0099`,
      highlight: 'host-edge'
    },
    large: {
      scale: 'Multi-pod · MLAG at leaf only · ESI-LAG preferred for new deployments',
      topologyRole:
        'MLAG restricted to leaf pairs for brownfield server attachment. Spine-level redundancy via ECMP (independent routed uplinks, no MLAG at spine). For new leaf pairs in greenfield pods, EVPN ESI all-active preferred over MLAG — eliminates peer-link blast radius and scales better in EVPN fabrics.',
      keyConfig: `evpn ethernet-segment
   identifier 0000:0001:0002  ! ESI-LAG replaces MLAG at scale in EVPN fabrics`,
      highlight: 'host-edge'
    }
  }
};
