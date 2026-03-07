export type MigrationRisk = 'Low' | 'Medium' | 'High';

export interface MigrationPhase {
  phase: number;
  title: string;
  risk: MigrationRisk;
  objective: string;
  steps: string[];
  validation: { command: string; expectedResult: string }[];
  rollback: string;
  successCriteria: string;
}

export interface MigrationPattern {
  id: string;
  title: string;
  from: string;
  to: string;
  useCase: string;
  overview: string;
  totalRisk: MigrationRisk;
  estimatedPhases: number;
  keyPrinciple: string;
  phases: MigrationPhase[];
  keyTools: string[];
  antiPatterns: string[];
}

export const BROWNFIELD_PATTERNS: MigrationPattern[] = [
  {
    id: 'stp-to-evpn',
    title: 'Cisco STP/VLAN → Arista EVPN/VXLAN',
    from: 'Cisco Catalyst STP + VPC access layer',
    to: 'Arista Leaf-Spine with EVPN/VXLAN overlay',
    useCase: 'DC core modernization: replace flat STP domains and VLAN-pruned trunks with a scalable, loop-free EVPN fabric.',
    overview: 'The migration proceeds in parallel: Arista leaf-spine is built alongside the legacy fabric. VLANs are migrated one segment at a time using VXLAN bridging. Gateways are moved last. STP is never fully removed until all VLANs are proven on the new fabric.',
    totalRisk: 'Medium',
    estimatedPhases: 5,
    keyPrinciple: 'Build new in parallel, migrate one VLAN at a time, never cut the return path until the new path is validated.',
    phases: [
      {
        phase: 1,
        title: 'Survey & Baseline',
        risk: 'Low',
        objective: 'Understand the existing topology, enumerate VLANs, document STP root bridges, and identify migration risks before touching production.',
        steps: [
          'Run `show spanning-tree summary` on all Cisco switches; identify root bridge and blocked ports for each VLAN',
          'Run `show vlan brief` to enumerate active VLANs and their port memberships',
          'Document gateway IPs per VLAN (HSRP/VRRP active node)',
          'Identify VLANs with L3 traffic (routed VLANs) vs pure L2 (stretched VLANs)',
          'Run `show ip arp` on gateway switches; capture ARP tables for each VLAN',
          'Identify any legacy protocols to remove: VTP, UDLD, PortFast inconsistencies',
          'Map physical cabling from servers/hypervisors to access switches — needed for port-channel migration'
        ],
        validation: [
          { command: 'show spanning-tree summary', expectedResult: 'Root bridge identified per VLAN. Blocked ports documented.' },
          { command: 'show vlan brief', expectedResult: 'Full VLAN inventory with active ports documented.' },
          { command: 'show ip route summary', expectedResult: 'Routed VLAN count documented — these require gateway migration in Phase 5.' }
        ],
        rollback: 'No changes made — purely read-only survey. No rollback needed.',
        successCriteria: 'Full VLAN inventory, STP topology map, ARP baseline, and gateway list documented and approved before proceeding.'
      },
      {
        phase: 2,
        title: 'Build Arista Leaf-Spine in Parallel',
        risk: 'Low',
        objective: 'Deploy the Arista fabric out-of-band (no production VLANs yet). Validate eBGP underlay, EVPN control plane, and VXLAN data plane before first migration.',
        steps: [
          'Deploy Arista spines and leaves with cabling per validated design',
          'Configure eBGP underlay on all leaf-spine links (RFC 5549 unnumbered preferred)',
          'Enable EVPN AF on all BGP sessions: `neighbor SPINE send-community extended`',
          'Configure VXLAN VNI-to-VLAN mappings for first migration VLAN (start with low-risk non-production VLAN)',
          'Enable Anycast Gateway (VARP) on leaf SVIs for target gateway IPs',
          'Configure CloudVision: onboard all new Arista switches, create baseline snapshot',
          'Run `show vxlan config-sanity detail` on all VTEPs — all checks must PASS'
        ],
        validation: [
          { command: 'show bgp evpn summary', expectedResult: 'All spine/leaf EVPN peers in Established state. RT-3 (IMET) routes exchanged.' },
          { command: 'show vxlan vtep', expectedResult: 'All VTEP loopbacks visible. Tunnel state UP.' },
          { command: 'show interfaces Vxlan1', expectedResult: 'Vxlan1 UP/UP. Source Loopback0. VNI-to-VLAN mappings present.' }
        ],
        rollback: 'New fabric is isolated. Simply disconnect cross-connect cables if any issues arise. No production impact.',
        successCriteria: 'L3LS EVPN/VXLAN fabric fully operational in isolation. VTEP tunnels UP. Anycast GW responds to ping from test endpoints on new fabric.'
      },
      {
        phase: 3,
        title: 'Pilot VLAN Migration (1 non-critical VLAN)',
        risk: 'Medium',
        objective: 'Migrate one non-critical VLAN from legacy fabric to Arista EVPN, validating the process end-to-end before touching production VLANs.',
        steps: [
          'Select a non-production VLAN (e.g., management VLAN for lab servers)',
          'Add the VLAN to the EVPN VNI-to-VLAN mapping on all leaves',
          'Connect trunk link between one legacy Cisco switch and one Arista leaf (add VLAN to trunk)',
          'Verify MAC learning: hosts on legacy fabric learned via EVPN RT-2 on Arista leaves',
          'Test east-west traffic between hosts on legacy fabric (via Cisco) and Arista fabric',
          'Gradually move physical server ports from Cisco access ports to Arista leaf ports',
          'Monitor STP convergence on legacy switches for any topology change notifications (TCNs)'
        ],
        validation: [
          { command: 'show bgp evpn mac-ip | grep <test-MAC>', expectedResult: 'Test MAC/IP visible as EVPN RT-2 route on all leaves.' },
          { command: 'show mac address-table vlan <VLAN>', expectedResult: 'Test MAC learned on expected Arista leaf port.' },
          { command: 'ping <test-host-IP> source Loopback0 repeat 10', expectedResult: 'All 10 pings succeed. Confirms VXLAN data plane.' }
        ],
        rollback: 'Remove the trunk link between legacy switch and Arista leaf. Remove VLAN from Arista VNI mapping. Hosts revert to legacy fabric within one STP convergence cycle.',
        successCriteria: 'All test hosts migrated to Arista leaf with full east-west connectivity. EVPN RT-2 routes stable for 30 minutes with no oscillation.'
      },
      {
        phase: 4,
        title: 'Production VLAN Migration (iterative)',
        risk: 'High',
        objective: 'Migrate remaining production VLANs one at a time using the same process proven in Phase 3. Maintain dual-fabric connectivity until each VLAN is fully cut over.',
        steps: [
          'Prioritize VLAN migration order: start with least-critical, highest-change-window VLANs',
          'For each VLAN: add VNI mapping → add trunk to legacy switch → validate → migrate hosts',
          'Do not migrate the gateway VLAN/SVI until all hosts are on Arista (gateway last)',
          'Schedule change windows; use CloudVision Change Control for each VLAN migration',
          'After each VLAN migration: take CloudVision snapshot, validate for 24 hours before next VLAN',
          'Remove VLANs from legacy switches ONLY after all hosts are migrated and validated',
          'Monitor for STP TCNs from legacy side during each migration — TCN storms indicate misconfig'
        ],
        validation: [
          { command: 'show bgp evpn mac-ip', expectedResult: 'All host MACs from migrated VLANs appearing as EVPN RT-2 routes. No duplicates.' },
          { command: 'show vxlan flood vtep', expectedResult: 'No excessive BUM flooding (if EVPN flood suppression enabled).' },
          { command: 'show interfaces counters errors', expectedResult: 'Zero input/output errors on new leaf ports for migrated hosts.' }
        ],
        rollback: 'Per-VLAN rollback: remove hosts from Arista leaf ports, reconnect to legacy switch, remove VLAN from Arista VNI mapping. Granular rollback per VLAN — production impact limited to that VLAN for < 2 minutes.',
        successCriteria: 'All non-gateway hosts migrated to Arista fabric. Legacy switches carry no production server traffic. Only cross-connect trunks remain for gateway transition.'
      },
      {
        phase: 5,
        title: 'Gateway Cutover & STP Decommission',
        risk: 'High',
        objective: 'Move default gateways from legacy Cisco SVIs (HSRP/VRRP) to Arista Anycast VARP. Decommission STP domain. Remove legacy switches.',
        steps: [
          'Pre-stage Anycast GW: configure `ip virtual-router address <GW-IP>` on ALL leaf SVIs — this sets up VARP but does not activate it yet',
          'For each VLAN gateway: lower HSRP priority on Cisco active to 50, raise Arista VARP preference',
          'Monitor traffic shift: `show ip route <GW-IP>` on servers should update to use new gateway',
          'Validate routing table on key servers: `ip route` or `arp -n` — default GW ARP should resolve to Arista VMAC',
          'After 30-minute stability window, remove HSRP from Cisco SVIs',
          'Remove cross-connect trunks between legacy and Arista fabric',
          'Run `no spanning-tree` globally on decommissioned Cisco switches after all links removed'
        ],
        validation: [
          { command: 'show ip virtual-router', expectedResult: 'All VARPs in Active state. VMAC generated and ARP responding.' },
          { command: 'show ip arp vlan <n>', expectedResult: 'Default gateway MAC is Arista VMAC (00:1c:73:xx:xx:xx format).' },
          { command: 'show ip route vrf <n> summary', expectedResult: 'All subnets reachable via Arista routing. No legacy next-hops.' }
        ],
        rollback: 'Re-raise HSRP priority on legacy Cisco to 200. Arista VARP steps down. Gateway reverts to legacy within one HSRP convergence cycle (< 10s). Cross-connect trunks must still be in place.',
        successCriteria: 'All gateways on Arista VARP. No Cisco switches carrying production traffic. Legacy fabric cleanly decommissioned. CloudVision compliance baseline updated.'
      }
    ],
    keyTools: ['CloudVision Change Control (snapshot + rollback)', 'AVD (generate leaf configs)', 'show spanning-tree (baseline survey)', 'show bgp evpn mac-ip (migration validation)', 'VARP (ip virtual-router)'],
    antiPatterns: [
      'Do NOT cut all VLANs at once — one VLAN at a time allows fast rollback',
      'Do NOT migrate gateways before hosts — always hosts first, then gateway',
      'Do NOT remove cross-connect trunks until gateway migration is validated for 30+ minutes',
      'Do NOT use VTP on Cisco side during migration — VTP domain can propagate unexpected VLAN deletions',
      'Do NOT disable STP until all physical connections to the legacy domain are removed'
    ]
  },

  {
    id: 'vpc-to-mlag',
    title: 'Cisco vPC/FEX → Arista MLAG + EVPN',
    from: 'Cisco Nexus vPC with FEX or standard access layer',
    to: 'Arista MLAG pair with EVPN single-active or all-active VTEP',
    useCase: 'Refresh a Cisco Nexus server-edge layer while maintaining zero-downtime for dual-homed servers with active LACP port-channels.',
    overview: 'Servers are dual-homed to both the old Cisco vPC pair and the new Arista MLAG pair simultaneously using a temporary four-way LACP group. Traffic is shifted to Arista by manipulating LACP priorities, then Cisco ports are cleanly removed.',
    totalRisk: 'Medium',
    estimatedPhases: 4,
    keyPrinciple: 'Never remove the old active link until the new link is proven active. Use LACP port-channel migration to achieve zero-downtime per server.',
    phases: [
      {
        phase: 1,
        title: 'Survey & MLAG Pre-staging',
        risk: 'Low',
        objective: 'Document all vPC port-channels, their server attachments, LAG IDs, and VLANs. Pre-stage Arista MLAG pair in isolation.',
        steps: [
          'Run `show vpc brief` on Cisco to enumerate all vPC port-channels and their member interfaces',
          'Run `show port-channel summary` to identify LAG IDs used — Arista port-channels must use different IDs initially',
          'Run `show vpc consistency-parameters` to find any vPC consistency violations to avoid replicating',
          'Deploy Arista MLAG pair: configure peer-link (Port-Channel100), MLAG domain, heartbeat SVI',
          'Validate MLAG health: `show mlag` → State: active, Peer: Connected',
          'Configure VXLAN and EVPN on MLAG pair (same VNI-to-VLAN mappings as target design)',
          'Configure MLAG port-channels for each server to migrate (do not connect yet)'
        ],
        validation: [
          { command: 'show mlag', expectedResult: 'State: active. Peer link: Up. Peer: Connected. No config inconsistencies.' },
          { command: 'show bgp evpn summary', expectedResult: 'EVPN sessions to spine established. IMET routes exchanged.' },
          { command: 'show mlag interfaces', expectedResult: 'Pre-staged server port-channels visible but inactive (no links yet).' }
        ],
        rollback: 'No production changes made. Arista MLAG is isolated. No rollback required.',
        successCriteria: 'Arista MLAG pair healthy. EVPN running to spine. VXLAN tunnels UP to all peer VTEPs. Server port-channels pre-staged.'
      },
      {
        phase: 2,
        title: 'Add Arista Links to Server Port-Channels',
        risk: 'Medium',
        objective: 'Connect each server to both its Cisco vPC and Arista MLAG simultaneously. Server LACP negotiates all four links into the existing port-channel with LACP standby/active management.',
        steps: [
          'Connect one server NIC pair to Arista MLAG leaf-A and leaf-B (without activating LACP yet)',
          'On Arista: `interface Port-Channel<n> → lacp rate fast → mlag <n>`',
          'Set Arista port-channel LACP port-priority to HIGH (lower number = higher priority): `interface Ethernet<n> → lacp port-priority 16384`',
          'Set Cisco vPC member LACP port-priority to LOW: `interface Ethernet<n> → lacp port-priority 32768`',
          'Verify LACP negotiation: server should now show 4 members, with Arista as "active" and Cisco as "standby"',
          'Monitor traffic: `show interfaces counters` on server-facing Arista ports — traffic should shift to Arista links',
          'Repeat for each server, one at a time, monitoring stability for 10+ minutes per server'
        ],
        validation: [
          { command: 'show lacp neighbor interface Port-Channel<n>', expectedResult: 'Arista ports shown as Active. Cisco ports shown as Standby.' },
          { command: 'show interfaces Port-Channel<n> counters rates', expectedResult: 'TX/RX bytes incrementing on Arista port-channel.' },
          { command: 'show bgp evpn mac-ip | grep <server-MAC>', expectedResult: 'Server MAC learned as EVPN RT-2 via Arista MLAG VTEP.' }
        ],
        rollback: 'Raise LACP priority on Cisco vPC member interfaces back to 16384 and lower Arista to 32768. LACP shifts back to Cisco links within seconds. No server downtime.',
        successCriteria: 'All server traffic flowing through Arista MLAG links. Cisco vPC links in LACP standby. Server MAC/IP routes visible in EVPN table on remote VTEPs.'
      },
      {
        phase: 3,
        title: 'Remove Cisco vPC Links',
        risk: 'Medium',
        objective: 'After validating Arista as the active path for all servers, remove Cisco vPC member links cleanly from each server port-channel.',
        steps: [
          'For each server: administratively shut Cisco vPC member interfaces: `interface Ethernet<n> → shutdown`',
          'Verify LACP re-negotiation: server now shows only 2 active members (Arista pair)',
          'Monitor for 15+ minutes after removal of each Cisco link: check for traffic drops, LACP flaps',
          'After all servers migrated: remove VLAN trunks between Cisco vPC and Arista (if any cross-connects used)',
          'Run `show vpc` on Cisco — should show no active vPC port-channels for migrated servers',
          'Take CloudVision snapshot after all servers migrated: this becomes the new compliance baseline'
        ],
        validation: [
          { command: 'show interfaces Port-Channel<n>', expectedResult: 'Port-channel members only show Arista interfaces. No Cisco interface in bundle.' },
          { command: 'show mlag interfaces', expectedResult: 'All server port-channels in "active-full" state on both MLAG peers.' },
          { command: 'show interfaces counters errors', expectedResult: 'Zero errors on all migrated port-channels for 15 minutes.' }
        ],
        rollback: 'Re-enable Cisco vPC member interfaces: `no shutdown`. LACP will renegotiate with all 4 links. Traffic can shift back to Cisco if Arista has issues.',
        successCriteria: 'All servers dual-homed exclusively to Arista MLAG. No Cisco vPC member interfaces in any server port-channel. MLAG health 100%.'
      },
      {
        phase: 4,
        title: 'Cisco Nexus Decommission',
        risk: 'Low',
        objective: 'Remove Cisco Nexus switches from the physical and logical topology after a stability monitoring period.',
        steps: [
          'Confirm no traffic on any Cisco Nexus interface: `show interface counters | grep -v "0\\s*0"` — all should show zero rates',
          'Power down Cisco Nexus in maintenance mode: `system mode maintenance` (if supported)',
          'Remove physical cables from Cisco Nexus switches',
          'Update IPAM, CMDB, and NMS to reflect removed devices',
          'Validate CloudVision compliance report — all remaining devices should be compliant'
        ],
        validation: [
          { command: 'show mlag', expectedResult: 'MLAG State: active. Peer: Connected. All server port-channels active-full.' },
          { command: 'show bgp evpn summary', expectedResult: 'All EVPN sessions Established. Full MAC/IP prefix table.' },
          { command: 'show vxlan flood vtep', expectedResult: 'All VTEPs reachable. No stale or DOWN tunnels.' }
        ],
        rollback: 'Cisco Nexus can be re-cabled and servers re-connected. At this phase, risk of needing rollback is minimal if Phases 1-3 succeeded.',
        successCriteria: 'Cisco Nexus switches physically removed. Arista MLAG fabric fully operational. CloudVision baseline clean.'
      }
    ],
    keyTools: ['CloudVision Change Control', 'LACP port-priority (traffic shift mechanism)', 'show mlag', 'show lacp neighbor', 'AVD (MLAG config generation)'],
    antiPatterns: [
      'Do NOT remove Cisco links before confirming Arista LACP is active — check `show lacp neighbor` first',
      'Do NOT migrate multiple servers simultaneously — do one at a time for isolated rollback',
      'Do NOT use vPC peer-switch feature on Cisco during migration — it can interfere with LACP negotiation',
      'Do NOT change server LACP hashing algorithm during migration — adds unnecessary risk',
      'Do NOT skip the 15-minute stability window per server — LACP flaps may not appear immediately'
    ]
  },

  {
    id: 'otv-to-dci',
    title: 'Cisco OTV/LISP → Arista EVPN Border Leaf DCI',
    from: 'Cisco OTV (Overlay Transport Virtualization) + LISP for L2/L3 DCI',
    to: 'Arista Border Leaf pair with EVPN Type-5 L3 DCI + selective VXLAN L2 stretch',
    useCase: 'Replace OTV flood-and-learn DCI with EVPN-controlled MAC/IP distribution across sites. Eliminate OTV\'s overhead, ARP storms, and operational complexity.',
    overview: 'OTV and EVPN DCI are run in parallel during migration. VRFs are migrated one at a time. For L2-stretched VLANs, VXLAN provides targeted stretch with ARP suppression replacing OTV\'s broadcast flooding. LISP site identifiers are replaced by EVPN RT-5 prefix advertisement.',
    totalRisk: 'High',
    estimatedPhases: 4,
    keyPrinciple: 'Run both DCI overlays in parallel. Route-leak one VRF at a time. Retire OTV only after EVPN is proven stable for all VRFs.',
    phases: [
      {
        phase: 1,
        title: 'OTV & LISP Inventory + Border Leaf Deployment',
        risk: 'Low',
        objective: 'Document all OTV flood domains, join interfaces, LISP EID-to-RLOC mappings, and stretched VLANs. Deploy Arista border leaf pair alongside existing DCI.',
        steps: [
          'Run `show otv overlay` on Cisco — document all overlay IDs, site VLANs, join interfaces',
          'Run `show lisp site` and `show lisp map-cache` — document all EID prefixes and RLOC mappings per VRF',
          'Identify which VLANs are OTV-stretched L2 vs which are LISP-based L3 — different migration paths',
          'Deploy Arista border leaf pair at each site with EVPN and VXLAN configured',
          'Connect border leaves to existing spine switches (physical cabling)',
          'Configure EVPN on border leaf BGP sessions (include `send-community extended`)',
          'Configure VXLAN DCI tunnel between site-A and site-B border leaf loopbacks over WAN underlay'
        ],
        validation: [
          { command: 'show bgp evpn summary', expectedResult: 'Border leaf EVPN sessions Established to all local spines.' },
          { command: 'show vxlan vtep', expectedResult: 'Remote site border leaf VTEP loopback visible and tunnel UP.' },
          { command: 'ping <remote-BL-loopback> source Loopback0 repeat 5', expectedResult: 'ICMP success across WAN underlay.' }
        ],
        rollback: 'Border leaves added but not yet carrying any traffic. OTV/LISP remains unchanged. No rollback required.',
        successCriteria: 'Border leaf EVPN fabric operational. VXLAN DCI tunnel between sites UP. No production traffic on new border leaves yet.'
      },
      {
        phase: 2,
        title: 'Migrate First L3 VRF (EVPN Type-5)',
        risk: 'High',
        objective: 'Migrate one non-critical L3 VRF from LISP to EVPN RT-5. Validate inter-site IP routing via the new path before touching production VRFs.',
        steps: [
          'Select a non-critical VRF (e.g., dev/test environment)',
          'On border leaf: configure VRF with matching RD and unique RT (separate from local fabric RT schema)',
          'Enable `redistribute connected` and `redistribute bgp` into EVPN for the target VRF',
          'Verify RT-5 routes for the VRF appear at the remote site border leaf',
          'Add static or BGP routing entries to steer new VRF traffic via Arista border leaf (lower admin distance than LISP)',
          'Test inter-site connectivity for the VRF: `ping vrf DEV <remote-host>` from both sites',
          'Monitor for 30 minutes; confirm LISP is no longer carrying traffic for this VRF'
        ],
        validation: [
          { command: 'show bgp evpn route-type ip-prefix vrf DEV', expectedResult: 'RT-5 prefixes from remote site visible in local VRF DEV routing table.' },
          { command: 'show ip route vrf DEV', expectedResult: 'Remote site subnets reachable via EVPN/VXLAN next-hop (border leaf VTEP).' },
          { command: 'show lisp site | grep DEV', expectedResult: 'LISP site entries for DEV VRF idle (no new map-requests) — traffic shifted to EVPN.' }
        ],
        rollback: 'Remove VRF from EVPN redistribution on border leaf. Raise LISP route admin distance back. LISP resumes routing for the VRF within one convergence cycle.',
        successCriteria: 'Target VRF routing via EVPN RT-5 for 24 hours with zero connectivity issues. LISP shows idle for that VRF\'s EIDs.'
      },
      {
        phase: 3,
        title: 'Migrate L2 Stretched VLANs (OTV → VXLAN)',
        risk: 'High',
        objective: 'Replace OTV flood domains with targeted VXLAN L2 stretch for VLANs that genuinely need L2 extension. Enable ARP suppression to eliminate OTV-style flooding.',
        steps: [
          'For each OTV-stretched VLAN: add VNI-to-VLAN mapping on border leaves at both sites',
          'Enable ARP suppression: `interface Vxlan1 → vxlan arp proxy`',
          'Add the VLAN to border leaf trunk (connect VLAN to local EVPN fabric)',
          'Verify EVPN IMET (RT-3) and MAC/IP (RT-2) routes flowing between sites for the VLAN',
          'Test L2 connectivity: ping between hosts at site-A and site-B on same VLAN via VXLAN',
          'Compare ARP broadcast counts: VXLAN ARP proxy should suppress flooding vs OTV baseline',
          'After validation, remove VLAN from OTV join-interface and OTV overlay'
        ],
        validation: [
          { command: 'show bgp evpn mac-ip | grep <host-MAC>', expectedResult: 'Host MACs from both sites visible as EVPN RT-2 routes on all border leaves.' },
          { command: 'show vxlan address-table', expectedResult: 'Remote-site host MACs in VXLAN address table (learned via EVPN, not flooding).' },
          { command: 'show otv overlay | grep <VLAN>', expectedResult: 'VLAN removed from OTV join-interface — no OTV traffic for this VLAN.' }
        ],
        rollback: 'Re-add the VLAN to OTV join-interface. Remove from VXLAN VNI mapping on border leaf. OTV flood-and-learn re-activates within one MAC flush cycle.',
        successCriteria: 'All L2-stretched VLANs running via VXLAN ARP proxy. ARP broadcast rate reduced vs OTV baseline. OTV overlay shows no active VLANs.'
      },
      {
        phase: 4,
        title: 'OTV/LISP Decommission',
        risk: 'Medium',
        objective: 'After all VRFs and VLANs are migrated and stable, cleanly remove OTV/LISP configuration from Cisco and decommission DCI edge switches if no longer needed.',
        steps: [
          'Confirm zero traffic on all OTV join interfaces: `show interfaces <join-if> counters rates`',
          'Confirm all LISP EID prefixes are inactive: `show lisp site` — no active registrations',
          'Remove OTV overlay configuration on Cisco ASR/Nexus DCI edges',
          'Remove LISP configuration on all site-edge routers',
          'Update BGP route policies to remove any LISP-based conditional advertisements',
          'Take CloudVision snapshot at both sites — new compliance baseline',
          'Update NOC monitoring: remove OTV/LISP health checks, add VXLAN tunnel health alerts'
        ],
        validation: [
          { command: 'show bgp evpn summary', expectedResult: 'All inter-site EVPN sessions Established. Full prefix exchange.' },
          { command: 'show vxlan vtep', expectedResult: 'Remote site VTEPs UP. Tunnel counters incrementing.' },
          { command: 'show ip route summary', expectedResult: 'All subnets at both sites routable. No LISP or OTV routes remaining.' }
        ],
        rollback: 'At this stage, re-enabling OTV/LISP would require full reconfiguration. Ensure 48-hour stability window before decommission to reduce risk.',
        successCriteria: 'OTV and LISP fully removed from all devices. EVPN DCI carrying 100% of inter-site traffic. NOC alerts updated for new monitoring plane.'
      }
    ],
    keyTools: ['CloudVision Change Control (snapshot per phase)', 'show otv overlay (OTV inventory)', 'show lisp site (LISP survey)', 'EVPN RT-5 + ARP suppression (replacement)'],
    antiPatterns: [
      'Do NOT remove OTV before validating EVPN carries ALL VRFs — even one missed VRF causes blackhole',
      'Do NOT enable EVPN RT-5 with the same RT as the local L3LS fabric — RT collision causes cross-VRF leaks',
      'Do NOT attempt L2 stretch migration without ARP suppression — you\'ll replicate OTV\'s flooding problem in VXLAN',
      'Do NOT migrate the most critical VRF first — always start with dev/test for process validation',
      'Do NOT rely on LISP fallback after EVPN is active — dual-path can cause asymmetric routing and hard-to-diagnose drops'
    ]
  }
];
