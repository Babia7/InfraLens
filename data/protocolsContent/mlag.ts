import { ProtocolDetail } from './types';

export const MLAG_PROTOCOL: ProtocolDetail = {
    id: 'mlag',
    name: 'MLAG',
    legacyTerm: 'VPC / Stackwise',
    tagline: 'Non-stop Layer 2 Dual-Homing without Stack Dependence.',
    description:
      'Multi-Chassis Link Aggregation lets two independent switches act as a single logical LAG endpoint to downstream devices, keeping control planes independent while providing active-active connectivity.',
    keyBenefits: [
      'Active-active L2 without spanning tree blocking.',
      'Independent control planes—no chassis master/slave.',
      'Fast convergence on peer-link or member-link failure.',
      'Simple operational model compared to stacking.'
    ],
    bestPractices: [
      'Understand EOS MLAG split-brain behavior before adding dual-primary detection. When the peer-link goes down, EOS automatically places the secondary switch into MLAG-inactive (disabling its MLAG port-channels) using the last synchronized state — this behavior is built in and requires no configuration. The true split-brain condition occurs when the peer-link fails AND both peers lose visibility into each other\'s state, causing each to assume the primary role. To guard against this, configure an optional out-of-band heartbeat: `peer-address heartbeat <mgmt-ip> vrf MGMT` under `mlag configuration`. This UDP heartbeat travels over the management interface (not the peer-link) so it survives peer-link failure. Pair it with `dual-primary detection delay <n> action errdisable all-interfaces` — when a peer detects it is still reachable via heartbeat after peer-link loss, it recognizes dual-active and errdisables all its interfaces after the delay. Arista recommends a delay ≥ 10 seconds. Verify with `show mlag detail` and `show mlag dual-primary`.',
      'Set `reload-delay mlag 300` and `reload-delay non-mlag 330` on standard fixed-config platforms (7050X3, 720XP, etc.). High-end platforms (7280R, 7500R, 7800R) default to 900s — always verify with `show mlag detail` before overriding, as a value too short causes post-boot black holes.',
      'Resolve every `show mlag config-sanity` warning before go-live. Arista explicitly states these must be rectified in production — mismatched VLANs, STP config, or port-channel modes cause one-way forwarding failures that are difficult to diagnose under load.',
      'Apply `lacp timer fast` on each Ethernet member interface (not on the Port-Channel) — the default slow timer means a link failure goes undetected for up to 90 seconds. Fast timers reduce detection to ~3 seconds (1s PDU interval × 3 missed PDUs). Note: `lacp rate fast` is Cisco IOS syntax and is not valid in EOS.',
      'On Arista EOS, when a MLAG member link fails, the ASIC redirects affected data-plane flows across the peer-link in hardware at line rate — there is no software reconvergence delay. This means the peer-link must handle the full redirected data traffic of the failed peer in addition to its normal MLAG control-plane sync (MAC/ARP table synchronization). Size the peer-link so its aggregate bandwidth matches the maximum active MLAG uplink capacity on one peer (e.g., 4×100G uplinks → peer-link ≥ 400G). Monitor with `show interfaces Port-Channel1 counters` — an unexpected traffic spike on the peer-link is the first indicator that a MLAG member link has gone inactive.',
      'Reserve MLAG for server and access-layer dual-homing in brownfield environments. For greenfield VXLAN/EVPN fabrics, prefer EVPN ESI All-Active multi-homing for downstream devices — ESI eliminates the peer-link requirement. Leaf-to-spine uplinks are always independent routed links in both models, not LAGs.'
    ],
    cliTranslation: [
      { legacy: 'vpc domain 10', arista: 'mlag configuration\n   domain-id FABRIC' },
      { legacy: 'peer-keepalive destination 10.0.0.2', arista: 'peer-address 10.255.0.2\n   ! peer-address = peer\'s local-interface (Vlan4094) IP — in-band, default VRF only\n   ! No vrf qualifier exists on plain peer-address' },
      { legacy: 'peer-keepalive destination 10.0.0.2 (OOB / dual-primary detection)', arista: 'peer-address heartbeat 10.0.0.2 vrf MGMT\n   dual-primary detection delay 10 action errdisable all-interfaces\n   ! peer-address heartbeat = optional OOB UDP heartbeat for dual-primary detection\n   ! travels over mgmt interface, survives peer-link failure' },
      { legacy: 'vpc peer-link port-channel1', arista: 'peer-link Port-Channel1\n   reload-delay mlag 300\n   reload-delay non-mlag 330' },
      { legacy: 'interface port-channel10\n  vpc 10', arista: 'interface Port-Channel10\n   mlag 10\ninterface Ethernet1\n   channel-group 10 mode active\n   lacp timer fast' },
      { legacy: 'show vpc', arista: 'show mlag\nshow mlag detail' },
      { legacy: 'show vpc consistency-parameters', arista: 'show mlag config-sanity' },
      { legacy: 'show port-channel summary (NX-OS)', arista: 'show port-channel summary\nshow mlag interfaces' }
    ],
    referenceLinks: [
      { title: 'Arista EOS User Manual — MLAG', summary: 'Authoritative MLAG configuration, peer-link behavior, and troubleshooting commands.', url: 'https://www.arista.com/en/um-eos/eos-multi-chassis-link-aggregation' },
      { title: 'Arista EOS User Manual — LACP', summary: 'LACP timers, member behavior, and operational checks used with MLAG.', url: 'https://www.arista.com/en/um-eos/eos-link-aggregation-and-lacp' },
      { title: 'Arista EOS User Manual — STP', summary: 'STP interactions and edge-port guidance relevant to MLAG access design.', url: 'https://www.arista.com/en/um-eos/eos-spanning-tree-protocol' },
      { title: 'Arista EVPN Multi-Homing Documentation', summary: 'Design tradeoffs between classic MLAG and EVPN ESI all-active multi-homing.', url: 'https://www.arista.com/en/um-eos/eos-evpn-multi-homing' }
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
      intro: 'MLAG pairs two independent switches (PEER_A and PEER_B) to appear as a single logical switch to downstream LAG members. The peer-link carries both control-plane synchronization and data-plane failover traffic. Unlike Cisco vPC — where a separate peer-keepalive link is mandatory to form the vPC domain — Arista MLAG forms using only the peer-link SVI (`peer-address` references the peer\'s `local-interface` Vlan4094 IP). An optional out-of-band heartbeat (`peer-address heartbeat <IP> vrf MGMT`) exists solely for dual-primary detection and is not required for MLAG to operate.',
      sections: [
        {
          title: 'Peer-Link Role',
          body: 'The peer-link (typically Port-Channel1) carries: (1) control-plane synchronization (MAC/ARP tables, MLAG state), (2) data-plane traffic redirected in hardware when one peer loses a MLAG member link. It must be over-provisioned — during failover it absorbs 100% of the failed peer\'s traffic at line rate with no software reconvergence delay.',
          bestFor: '100G or 2×100G LAG peer-link. Never use a single physical link.'
        },
        {
          title: 'Peer-Address & Dual-Primary Detection',
          body: 'The `peer-address` (configured under `mlag configuration`) is the IP of the peer\'s `local-interface` SVI — in-band, default VRF only, no `vrf` qualifier is valid here. When the peer-link fails, EOS uses last-synchronized state to place the secondary into MLAG-inactive. For optional dual-primary detection, configure a separate OOB heartbeat: `peer-address heartbeat <mgmt-ip> vrf MGMT` paired with `dual-primary detection delay 10 action errdisable all-interfaces`. The heartbeat travels over the management interface, independent of the peer-link. Unlike Cisco vPC\'s mandatory peer-keepalive, this is entirely optional — MLAG forms and operates without it.',
          bestFor: 'peer-address = peer-link SVI IP (in-band, required). peer-address heartbeat = mgmt IP vrf MGMT (OOB, optional — dual-primary detection only).'
        }
      ],
      conclusion: 'MLAG summary: peer-link = data + state sync. peer-address = peer-link SVI IP (in-band, default VRF, required). peer-address heartbeat = mgmt IP vrf MGMT (OOB, optional — dual-primary detection only). Size the peer-link for full failover capacity and test peer-link failure before production.'
    },
    primer: {
      title: 'Why the Peer-Link is the Single Most Critical MLAG Component',
      body: 'Unlike Cisco vPC — where a peer-keepalive link is mandatory before the vPC domain forms — Arista MLAG requires no separate channel to operate. The peer-link carries both MLAG control-plane sync (MAC/ARP tables, MLAG state) and data-plane failover traffic. When a MLAG member link fails, EOS hardware immediately redirects affected flows across the peer-link at line rate with no software reconvergence. The peer-link must be sized to absorb 100% of one peer\'s active MLAG traffic. A peer-link failure is the highest-impact event: EOS uses last-synchronized state to place the secondary into MLAG-inactive and disable its port-channels. For optional dual-primary detection — to guard against true split-brain when both peers lose visibility into each other — configure `peer-address heartbeat <mgmt-ip> vrf MGMT` paired with `dual-primary detection delay 10 action errdisable all-interfaces`. This heartbeat travels over the management interface and is completely separate from `peer-address` (which is always the peer-link SVI IP, in-band, default VRF). Size the peer-link as a LAG (≥2 links), monitor it continuously, and test peer-link failure in lab before production.'
    },
    roleConfigs: [
      {
        role: 'Access LAG with MLAG',
        description: 'Dual-homed server with fast LACP timers. lacp timer fast is on Ethernet members, not the port-channel.',
        config: `! ── MLAG GLOBAL CONFIG ───────────────────────────────────────
mlag configuration
   domain-id FABRIC
   local-interface Vlan4094
   peer-address 10.255.0.2        ! peer's Vlan4094 IP — in-band, default VRF only
   peer-link Port-Channel1
   reload-delay mlag 300
   reload-delay non-mlag 330
   ! ── OPTIONAL: dual-primary detection via OOB mgmt heartbeat ──
   ! peer-address heartbeat 192.0.2.2 vrf MGMT
   ! dual-primary detection delay 10 action errdisable all-interfaces
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
        description: 'Peer-link with trunk group isolation (MLAG VLAN only crosses peer-link). peer-address uses the peer-link SVI IP (in-band, default VRF — no vrf qualifier). Optional dual-primary detection: peer-address heartbeat <mgmt-ip> vrf MGMT.',
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
! ── MLAG peer-link SVI (local-interface for MLAG control) ────
interface Vlan4094
   ip address 10.255.0.1/30
   no autostate
   no ip proxy-arp
!
! ── MLAG GLOBAL ───────────────────────────────────────────────
mlag configuration
   domain-id FABRIC
   local-interface Vlan4094
   peer-address 10.255.0.2        ! peer's Vlan4094 IP — in-band, default VRF only
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
! ── HEARTBEAT REACHABILITY (only if peer-address heartbeat configured) ─
! ping <peer-mgmt-ip> vrf MGMT repeat 10
! Only relevant if 'peer-address heartbeat <IP> vrf MGMT' is configured
! The heartbeat mgmt IP is separate from 10.255.0.x (Vlan4094/peer-link SVI)
! Default: peer-link SVI health = MLAG control-plane health (no heartbeat needed)
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
! ping <peer-mgmt-ip> vrf MGMT repeat 10  ! only if 'peer-address heartbeat <IP> vrf MGMT' is configured
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
! ── 2. PEER-LINK SVI REACHABILITY ───────────────────────────
ping 10.255.0.2 source Vlan4094 repeat 20 timeout 1  ! in-band peer-link SVI (default VRF)
! If OOB heartbeat configured (peer-address heartbeat <mgmt-ip> vrf MGMT), also test:
! ping <peer-mgmt-ip> vrf MGMT size 1500 df-bit  (MTU check on OOB heartbeat path)
! Note: 10.255.0.x (Vlan4094) is in the default VRF — it cannot be reached via vrf MGMT
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
! (if OOB peer-address via mgmt VRF is configured, it remains reachable during this drill)
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
! EOS uses last synchronized state to place secondary into inactive
! True split-brain: peer-link down AND both peers lose state visibility
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
ping <peer-vlan4094-ip> repeat 10  ! via peer-link SVI (in-band)
! Peer-link down = MLAG control-plane loss → secondary disables its MLAG port-channels
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
! both switches have lost visibility into each other's state
show mlag
! Watch for: State: active, Peer: inactive on BOTH peers simultaneously
!
! ── STEP 1: ESTABLISH OOB CONNECTIVITY FIRST ─────────────────
! Establish out-of-band access (console, mgmt cable) to both peers
! If 'peer-address heartbeat <IP> vrf MGMT' is configured, verify reachability:
ping <peer-mgmt-ip> vrf MGMT
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
  }
