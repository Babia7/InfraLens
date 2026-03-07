export type TroubleshootProtocol = 'EVPN' | 'VXLAN' | 'BGP' | 'MLAG' | 'Linux' | 'QoS' | 'MACsec';
export type TroubleshootSeverity = 'Critical' | 'High' | 'Medium';

export interface TroubleshootStep {
  check: string;
  command: string;
  expected: string;
  divergence: string;
}

export interface TroubleshootScenario {
  id: string;
  title: string;
  protocol: TroubleshootProtocol;
  severity: TroubleshootSeverity;
  symptom: string;
  context: string;
  steps: TroubleshootStep[];
  rootCause: string;
  fix: string;
  prevention: string;
}

export const TROUBLESHOOT_SCENARIOS: TroubleshootScenario[] = [
  // ── EVPN ──────────────────────────────────────────────────────────────────
  {
    id: 'evpn-rt-miss',
    title: 'EVPN Route Not Propagating to Remote Leaf',
    protocol: 'EVPN',
    severity: 'Critical',
    symptom: 'MAC/IP entries visible locally via `show bgp evpn` but absent on a remote leaf. East-west traffic drops silently.',
    context: 'EOS 4.28+. L3LS fabric: 2 spines as Route Reflectors, 4 leaf VTEPs. EVPN AF enabled on all nodes.',
    steps: [
      {
        check: 'Is EVPN AF established with the RR?',
        command: 'show bgp evpn summary',
        expected: 'All RR neighbors show "Estab" state with non-zero Prefixes Received.',
        divergence: 'If state is "Active" or "Idle", BGP session issue precedes EVPN — fix TCP 179 reachability first.'
      },
      {
        check: 'Are EVPN routes locally originated?',
        command: 'show bgp evpn | grep "Local\\ \\|10.0.0"',
        expected: 'RT-2/RT-3 entries marked "Local" from local VNI-to-VLAN bindings.',
        divergence: 'No local routes means VNI is not configured or VTEP is not registered. Check `show vxlan vtep` and `show vxlan vni`.'
      },
      {
        check: 'Is send-community configured toward the RR?',
        command: 'show bgp neighbors <RR-IP> detail | grep -i community',
        expected: '"community: standard extended" sent — both standard and extended communities enabled.',
        divergence: 'If "extended" is missing, routes are advertised without RT — RR will reject them. This is the most common EVPN Day-1 miss.'
      },
      {
        check: 'Does the RR see the route and re-advertise it?',
        command: 'show bgp evpn detail | grep -A5 "Route Distinguisher"',
        expected: 'RD present with correct RT tags (e.g., 65001:10010 for VNI 10010). Multiple NEXT_HOP entries if RR reflects to multiple peers.',
        divergence: 'If RD/RT is malformed or missing, check `vlan <n> → vni <n> → rd auto → route-target both <n>:10010` in the BGP EVPN config.'
      }
    ],
    rootCause: 'Missing `send-community extended` on BGP neighbor toward the Route Reflector. Without it, EVPN UPDATE messages carry no RT attributes and are silently dropped by the RR.',
    fix: `router bgp <ASN>
  neighbor <RR-IP> send-community extended
  ! Or for a peer-group:
  neighbor SPINE send-community extended`,
    prevention: 'Add `send-community extended` to all EVPN peer-groups in your BGP template. Include a preflight check: `show bgp neighbors | grep community` on every new leaf before cutover.'
  },

  {
    id: 'evpn-dup-mac',
    title: 'Duplicate MAC Alert Causing Route Oscillation',
    protocol: 'EVPN',
    severity: 'High',
    symptom: 'EOS logs show "Duplicate MAC detected" events. A specific MAC appears with two different VTEPs in the BGP EVPN table. Traffic to the affected host is intermittent.',
    context: 'MLAG pair acting as VTEP. Both peers share an ESI. Host migrates (VM vMotion) or is dual-homed to both MLAG peers.',
    steps: [
      {
        check: 'Confirm duplicate MAC in BGP EVPN table.',
        command: 'show bgp evpn mac-ip detail | grep -A10 <MAC>',
        expected: 'Single route per MAC with one VTEP next-hop.',
        divergence: 'Two entries with different VTEP IPs means two VTEPs are advertising the same MAC — one is incorrect.'
      },
      {
        check: 'Check ESI consistency on MLAG peers.',
        command: 'show mlag | grep "ESI\\|Peer"',
        expected: 'ESI identical on both MLAG peers. MLAG peer state = "connected".',
        divergence: 'Mismatched ESI means each peer advertises independent RT-2 routes for the same MAC instead of a shared MLAG route with identical ESI.'
      },
      {
        check: 'Check MLAG port-channel state.',
        command: 'show mlag interfaces | grep <port-channel>',
        expected: '"active-full" on both peers for the server-facing port-channel.',
        divergence: 'If one peer shows "inactive", that peer\'s VTEP may be originating orphan MAC advertisements without the ESI.'
      },
      {
        check: 'Is the MAC genuinely mobile (VM migration)?',
        command: 'show mac address-table | grep <MAC>',
        expected: 'MAC learned on expected port-channel. Timestamp stable.',
        divergence: 'Rapid interface changes indicate a flapping host port or an ongoing migration. EVPN mobility sequence numbers handle orderly migration — check `show bgp evpn detail` for sequence increments.'
      }
    ],
    rootCause: 'ESI mismatch between MLAG peers causes each to independently advertise RT-2 for the same MAC with different VTEP next-hops. RR cannot determine which is authoritative and forwards both, causing oscillation.',
    fix: `interface Port-Channel<n>
  evpn ethernet-segment
    identifier 0000:0000:0001:0002:0003   ! Must match on both peers
    route-target import 00:01:00:02:00:03`,
    prevention: 'Validate ESI via `show evpn ethernet-segment` on both MLAG peers before adding any dual-homed hosts. Add to pre-cutover checklist.'
  },

  {
    id: 'evpn-type5-miss',
    title: 'EVPN Type-5 VRF Route Not Leaking Between VRFs',
    protocol: 'EVPN',
    severity: 'High',
    symptom: 'Inter-VRF traffic between two VRFs (e.g., Prod and Sec) fails. Each VRF can reach its own prefixes but not the other\'s. No BGP route for the remote prefix.',
    context: 'Symmetric IRB with EVPN RT-5. Two VRFs on each leaf. Route-target import/export configured per VRF.',
    steps: [
      {
        check: 'Are VRF-specific EVPN prefixes being originated?',
        command: 'show bgp evpn route-type ip-prefix | grep "VRF\\|Prod\\|Sec"',
        expected: 'RT-5 routes from each VRF present with correct RD and RT tags.',
        divergence: 'Missing RT-5 entries means the VRF is not redistributing routes into EVPN. Check `redistribute connected` or `redistribute bgp` under the BGP EVPN VRF context.'
      },
      {
        check: 'Verify RT import/export schema.',
        command: 'show bgp evpn detail | grep "Extended Community"',
        expected: 'RT-5 routes carry the RT that the receiving VRF imports. E.g., Prod exports 65001:50 and Sec imports 65001:50.',
        divergence: 'Schema mismatch (e.g., Prod exports 65001:50, Sec imports 65001:500) is the most common cause. One character difference = full blackhole.'
      },
      {
        check: 'Is EVPN AF redistributing IPv4 prefixes?',
        command: 'show bgp evpn | grep "ip-prefix"',
        expected: 'Prefixes from both VRFs visible as RT-5 entries.',
        divergence: 'If only one VRF appears, check that `router bgp → vrf Prod → address-family evpn → redistribute connected` is configured.'
      },
      {
        check: 'Check the receiving VRF\'s BGP table.',
        command: 'show bgp vpn-ipv4 vrf Sec | grep <target-prefix>',
        expected: 'The prefix from Prod VRF visible in Sec\'s BGP VPNv4 table with correct next-hop.',
        divergence: 'If absent, the import RT is not matching. Re-check RT import statement in `router bgp → vrf Sec → rd auto → route-target import <RT>`.'
      }
    ],
    rootCause: 'Route-target import/export schema mismatch between VRFs. EVPN RT-5 routes are present on the originating VTEP but rejected by the receiving VRF because the imported RT does not match the exported one.',
    fix: `! VRF Prod (source):
router bgp <ASN>
  vrf Prod
    rd auto
    route-target export evpn 65001:50010
    route-target import evpn 65001:50020

! VRF Sec (destination):
router bgp <ASN>
  vrf Sec
    rd auto
    route-target export evpn 65001:50020
    route-target import evpn 65001:50010  ! Must match Prod's export`,
    prevention: 'Maintain a per-fabric RT schema document (e.g., L2 RT = 10:VNI, L3 VRF RT = 50:VRF-ID). Review on every VRF add/change. Validate with `show bgp evpn detail | grep "Extended Community"` before sign-off.'
  },

  // ── VXLAN ─────────────────────────────────────────────────────────────────
  {
    id: 'vxlan-mtu-black',
    title: 'VXLAN Silent Drop: Large Packets Never Arrive',
    protocol: 'VXLAN',
    severity: 'Critical',
    symptom: 'Small pings succeed across VXLAN tunnel but large file transfers or application sessions silently hang or reset. TCP handshake works; data transfer fails.',
    context: 'L3LS fabric with VXLAN overlay. Hosts have default MTU (1500). Underlay links have default MTU.',
    steps: [
      {
        check: 'Confirm the MTU fragmentation pattern.',
        command: 'ping <destination> repeat 5 size 1450 df-bit\nping <destination> repeat 5 size 1300 df-bit',
        expected: '1300-byte pings succeed; 1450-byte pings fail — confirms MTU boundary.',
        divergence: 'If both fail, it may be a routing or tunnel issue, not MTU. If both succeed, the problem is application-level.'
      },
      {
        check: 'Check underlay interface MTU.',
        command: 'show interfaces Ethernet1 | grep MTU\nshow interfaces Vxlan1 | grep MTU',
        expected: 'Underlay (Ethernet) MTU = 9214 or higher. VXLAN interface shows L2 MTU = underlay MTU − 50 bytes overhead.',
        divergence: 'If underlay MTU is 1500, VXLAN adds 50 bytes of overhead, making max payload ~1450. Fix: set underlay MTU to 9214 on all leaf/spine interfaces.'
      },
      {
        check: 'Verify the VXLAN VTEP source interface.',
        command: 'show vxlan config-sanity detail',
        expected: 'All sanity checks PASS. No warnings about MTU or loopback interface.',
        divergence: 'MTU warnings mean the loopback or VTEP source is advertising an MTU that does not match the underlay path.'
      },
      {
        check: 'Check if ICMP unreachable (fragmentation needed) messages are reaching the host.',
        command: 'tcpdump -i et1 -n "icmp" -c 20',
        expected: 'No "Fragmentation Needed" ICMP messages if PMTUD is working. If present, the DF-bit-set packet is hitting the boundary.',
        divergence: 'If hosts never receive ICMP fragmentation needed, path ICMP filtering is preventing PMTUD from working — a double failure.'
      }
    ],
    rootCause: 'Underlay interfaces have default MTU (1500). VXLAN adds 50 bytes of overhead (8 VXLAN + 8 UDP + 20 IP + 14 Ethernet). Max payload becomes 1450 bytes. Packets with DF bit set that exceed this are silently dropped if ICMP unreachable is blocked.',
    fix: `! Set on ALL leaf uplinks, spine downlinks, and P2P interfaces:
interface Ethernet1
  mtu 9214
! Also set on VTEP loopback (if used as source):
interface Loopback0
  ! MTU irrelevant for loopback, but verify underlay IGP path MTU`,
    prevention: 'Add MTU validation to your Day-1 runbook: `show interfaces | grep "MTU 9214"` on all fabric links before enabling any VXLAN VNIs. Include in CloudVision compliance template.'
  },

  {
    id: 'vxlan-tunnel-down',
    title: 'VXLAN Tunnel Remains Down Between VTEPs',
    protocol: 'VXLAN',
    severity: 'High',
    symptom: 'VXLAN tunnel state shows "DOWN" between two specific VTEPs. MAC/IP routes exist in BGP EVPN but traffic does not flow across the tunnel.',
    context: 'EVPN-VXLAN fabric. Remote VTEP loopback reachable via underlay. BGP EVPN session established.',
    steps: [
      {
        check: 'Check VXLAN tunnel/VTEP state.',
        command: 'show vxlan vtep\nshow vxlan flood vtep',
        expected: 'Remote VTEP IP visible in VTEP table with tunnel state "UP".',
        divergence: 'If VTEP is missing from the table, the VTEP loopback IP is not being learned via EVPN RT-3 (IMET route).'
      },
      {
        check: 'Verify VTEP loopback reachability.',
        command: 'ping <remote-VTEP-loopback> source Loopback0 repeat 5',
        expected: 'Ping succeeds from local loopback to remote VTEP loopback.',
        divergence: 'Ping failure = underlay routing issue. Check IGP neighbor state: `show isis neighbors` or `show ip ospf neighbor`.'
      },
      {
        check: 'Check EVPN IMET (RT-3) route presence.',
        command: 'show bgp evpn route-type imet',
        expected: 'IMET routes from all remote VTEPs visible with correct VTEP loopback next-hop.',
        divergence: 'Missing IMET from remote = BGP EVPN session down, or remote VTEP has VXLAN not enabled (`interface Vxlan1` missing or shutdown).'
      },
      {
        check: 'Verify VXLAN source interface.',
        command: 'show vxlan config-sanity\nshow interfaces Vxlan1',
        expected: 'Vxlan1 UP/UP. Source interface = Loopback0. No sanity warnings.',
        divergence: 'If Vxlan1 is down, check `interface Vxlan1 → no shutdown` and `vxlan source-interface Loopback0` are present.'
      }
    ],
    rootCause: 'Most common causes: (1) VTEP source interface (Loopback0) not reachable via underlay, (2) `interface Vxlan1` administratively down or missing `vxlan source-interface`, (3) EVPN IMET route not received because remote VTEP has EVPN not enabled.',
    fix: `interface Vxlan1
  vxlan source-interface Loopback0
  vxlan udp-port 4789
  no shutdown
! Then verify: show vxlan config-sanity`,
    prevention: 'Include `show vxlan config-sanity detail` and `show vxlan vtep` in your bring-up checklist for every new VTEP. Automate via CloudVision compliance check.'
  },

  // ── BGP ───────────────────────────────────────────────────────────────────
  {
    id: 'bgp-idle',
    title: 'BGP Neighbor Stuck in Idle State',
    protocol: 'BGP',
    severity: 'Critical',
    symptom: 'BGP neighbor never progresses past "Idle" or "Active" state. No TCP connection is established. Underlay ping succeeds.',
    context: 'eBGP peering between leaf and spine. Interface-based or loopback-based peering configured.',
    steps: [
      {
        check: 'Confirm BGP session state and uptime.',
        command: 'show bgp neighbors <peer-IP> | grep "BGP state"',
        expected: '"BGP state is Established, up for..."',
        divergence: '"Idle" = no attempt to connect. "Active" = TCP SYN sent but not answered. Check if interface is up and peer IP is reachable.'
      },
      {
        check: 'Verify TCP 179 reachability.',
        command: 'bash sudo tcpdump -i et1 -n "tcp port 179" -c 10',
        expected: 'SYN and SYN-ACK packets visible, completing the TCP handshake.',
        divergence: 'SYN sent but no SYN-ACK: peer not listening. No SYN at all: local ACL or route issue. SYN-ACK then RST: peer rejects (ASN mismatch, MD5, TTL).'
      },
      {
        check: 'Check for ACL blocking TCP 179.',
        command: 'show ip access-lists | grep -i "deny.*179\\|179.*deny"',
        expected: 'No deny rule matching TCP port 179 in any applied ACL.',
        divergence: 'Deny rule found = remove or add a preceding permit for the BGP peer range on TCP 179.'
      },
      {
        check: 'Verify ASN and peer configuration.',
        command: 'show bgp neighbors <peer-IP> | grep "remote AS\\|local AS"',
        expected: 'remote-as matches the peer\'s configured local AS. No AS override in play.',
        divergence: 'ASN mismatch: peer sends OPEN with different AS than configured. Check `remote-as` on both sides. Common in eBGP unnumbered setups.'
      },
      {
        check: 'Check GTSM/TTL-security config.',
        command: 'show bgp neighbors <peer-IP> | grep "TTL\\|GTSM"',
        expected: 'TTL = 1 for eBGP (default direct peer). If TTL-security is set, verify it matches on both ends.',
        divergence: 'TTL-security mismatch causes TCP packets to be silently dropped at the GTSM check. Remove or align `neighbor <peer> ttl-security hops <n>` on both sides.'
      }
    ],
    rootCause: 'Most common: (1) ACL blocking TCP 179, (2) ASN misconfiguration, (3) TTL mismatch when multihop BGP is configured without `ebgp-multihop`, (4) MD5 authentication mismatch.',
    fix: `router bgp <ASN>
  ! Verify remote-as matches the peer's AS:
  neighbor <peer-IP> remote-as <peer-ASN>
  ! For multihop (loopback peering):
  neighbor <peer-IP> ebgp-multihop 2
  ! Remove MD5 if not consistently configured:
  no neighbor <peer-IP> password`,
    prevention: 'For eBGP underlay, use interface-based peering with `neighbor interface Ethernet1 peer-group LEAF` and RFC 5549 unnumbered — eliminates IP addressing errors. Always validate with `show bgp neighbors | grep "BGP state"` before proceeding.'
  },

  {
    id: 'bgp-route-withdraw',
    title: 'BGP Prefix Disappears After Redistribution',
    protocol: 'BGP',
    severity: 'High',
    symptom: 'A connected prefix is visible in the IP routing table but absent from BGP. Downstream peers never learn it. Traffic blackholes after reconvergence.',
    context: 'BGP with `redistribute connected` or `redistribute static` configured. Route-map applied.',
    steps: [
      {
        check: 'Confirm prefix in local RIB.',
        command: 'show ip route <prefix>',
        expected: 'Prefix present in IP routing table as "C" (connected) or "S" (static).',
        divergence: 'If absent from RIB, the interface is down or the static route next-hop is unreachable. Fix the underlying reachability first.'
      },
      {
        check: 'Check if prefix appears in BGP table.',
        command: 'show bgp ipv4 unicast <prefix>',
        expected: 'Prefix visible in BGP with "redistributed" origin or "i" from redistribution.',
        divergence: 'Not in BGP table = redistribution is not working. Check if `redistribute connected route-map <name>` has a matching permit clause for this prefix.'
      },
      {
        check: 'Audit the redistribution route-map.',
        command: 'show route-map <name>',
        expected: 'The route-map has a `permit` clause matching the prefix\'s network/tag/community.',
        divergence: 'A `deny` clause matching before the `permit` = prefix is filtered. Or route-map ends with implicit deny. Add explicit `permit` for the subnet.'
      },
      {
        check: 'Verify BGP is advertising the prefix to peers.',
        command: 'show bgp neighbors <peer-IP> advertised-routes | grep <prefix>',
        expected: 'Prefix visible in advertised-routes output.',
        divergence: 'Not in advertised-routes but in BGP table = outbound route-map or prefix-list filtering the advertisement. Check `neighbor <peer> route-map <out-name> out`.'
      }
    ],
    rootCause: 'Route-map denial at redistribution (inbound filter too broad) or at BGP outbound advertisement (outbound prefix-list blocking the specific prefix). Often a wildcard in the deny clause that accidentally matches the needed prefix.',
    fix: `route-map REDIST-CONNECTED permit 10
  match ip address prefix-list ALLOWED-CONNECTED
! Ensure the prefix-list includes your subnet:
ip prefix-list ALLOWED-CONNECTED permit 10.0.0.0/24 le 32`,
    prevention: 'Test redistribution with `show bgp ipv4 unicast` immediately after each route-map change. Use `permit any` as a debug catch-all with a high sequence number to identify what is being implicitly denied.'
  },

  // ── MLAG ──────────────────────────────────────────────────────────────────
  {
    id: 'mlag-peer-inactive',
    title: 'MLAG Peer Heartbeat Down; Server Traffic Asymmetric',
    protocol: 'MLAG',
    severity: 'Critical',
    symptom: 'One MLAG peer shows "peer link down" or "inactive" state. Server traffic routes only through one peer. MLAG is not providing redundancy.',
    context: 'Standard MLAG pair with dedicated peer-link (Port-Channel). Heartbeat over out-of-band management or dedicated VLAN.',
    steps: [
      {
        check: 'Check overall MLAG health.',
        command: 'show mlag',
        expected: 'State: "active". Peer link: "Up". Peer: "Connected". Role: "primary" or "secondary".',
        divergence: 'If "Peer: Inactive", the heartbeat is not reaching the peer. If "Peer link: Down", physical port-channel has failed.'
      },
      {
        check: 'Verify peer-link port-channel is up.',
        command: 'show interfaces Port-Channel<n> | grep "line protocol"',
        expected: 'Port-Channel<n> is up, line protocol is up.',
        divergence: 'Down = all member links failed. Check `show interfaces Port-Channel<n> detail` for member link states and error counters.'
      },
      {
        check: 'Verify MLAG heartbeat reachability.',
        command: 'ping <mlag-peer-address> source <mlag-local-address>',
        expected: 'Ping succeeds with < 5ms latency.',
        divergence: 'Heartbeat ping fails = VLAN or IP misconfiguration on the peer-link SVI. Check `interface Vlan4094 → ip address` on both peers.'
      },
      {
        check: 'Check MLAG domain and port-channel consistency.',
        command: 'show mlag detail | grep "domain\\|port-channel\\|reload"',
        expected: 'Same domain ID on both peers. Port-channel ID used as peer-link identical on both sides.',
        divergence: 'Domain ID mismatch = peers refuse to form MLAG. Domain ID must be identical on both switches. Not the same as the port-channel number itself.'
      }
    ],
    rootCause: 'Most common: (1) Peer-link SVI (Vlan4094) missing or in wrong VRF, (2) Peer-link port-channel member links all down, (3) MLAG domain ID mismatch between peers.',
    fix: `! Ensure these match exactly on both peers:
mlag
  domain-id PROD-MLAG
  local-interface Vlan4094
  peer-address 10.255.255.2
  peer-link Port-Channel100
  reload-delay 300

interface Vlan4094
  ip address 10.255.255.1/30
  no autostate`,
    prevention: 'Add `show mlag` and `show interfaces Port-Channel<peer-link>` to your pre-cutover checklist. Validate heartbeat reachability from both peers before bringing up server-facing port-channels.'
  },

  // ── Linux ─────────────────────────────────────────────────────────────────
  {
    id: 'linux-netns-miss',
    title: 'tcpdump Shows No Traffic in VRF — Empty Capture',
    protocol: 'Linux',
    severity: 'Medium',
    symptom: 'Running `tcpdump` in bash shows no packets on et1 despite traffic visibly flowing. The capture file is empty or shows only broadcast noise.',
    context: 'EOS with multiple VRFs configured. Each VRF maps to a Linux network namespace (netns). Traffic is in a non-default VRF.',
    steps: [
      {
        check: 'Identify which VRF the traffic is in.',
        command: 'FastCli -p 15 -c "show ip route vrf <VRF-name>"',
        expected: 'Route table shows the destination prefix in VRF <VRF-name>.',
        divergence: 'If the route is in the default VRF, standard tcpdump on et1 should work. Try `ip netns list` to see if VRFs exist as namespaces.'
      },
      {
        check: 'List available network namespaces.',
        command: 'ip netns list',
        expected: 'ns-<VRF-name> visible in the list (e.g., ns-PROD, ns-MGMT).',
        divergence: 'If only "ns-default" exists, all VRFs are in the default namespace — run tcpdump without netns exec.'
      },
      {
        check: 'Run tcpdump inside the correct namespace.',
        command: 'ip netns exec ns-PROD tcpdump -i et1 -n -c 20',
        expected: 'Packets visible from the correct VRF traffic flow.',
        divergence: 'Still empty: confirm the interface exists in that namespace: `ip netns exec ns-PROD ip link show et1`.'
      },
      {
        check: 'Confirm interface exists in the namespace.',
        command: 'ip netns exec ns-PROD ip link show',
        expected: 'et1 (or the relevant interface) listed as UP.',
        divergence: 'If et1 is not in ns-PROD, the traffic goes through a different interface in that VRF. Use `ip netns exec ns-PROD ip route show` to find the egress interface.'
      }
    ],
    rootCause: 'tcpdump run outside a netns captures all VRF traffic on the interface but may show different VRF traffic than expected, or none if traffic uses a namespace-specific interface. EOS VRFs map to Linux netns; you must `ip netns exec` into the correct one.',
    fix: `# Correct approach:
ip netns list                          # List all VRF namespaces
ip netns exec ns-PROD tcpdump -i et1 -n -c 100 -w /mnt/flash/prod.pcap

# For BGP traffic specifically:
ip netns exec ns-PROD tcpdump -i et1 -n 'tcp port 179' -c 50`,
    prevention: 'Document the netns-to-VRF mapping in your team runbook: `ns-<VRF-name>`. Always specify the namespace when capturing in multi-VRF environments.'
  },

  // ── QoS ───────────────────────────────────────────────────────────────────
  {
    id: 'qos-pfc-storm',
    title: 'PFC Pause Storm Causing Head-of-Line Blocking',
    protocol: 'QoS',
    severity: 'Critical',
    symptom: 'All traffic — including high-priority — experiencing drops on a specific port. Interface RX counters normal but TX drops increasing. GPU jobs stalling with excessive retransmissions.',
    context: 'AI/ML fabric with RoCE v2. PFC enabled on priority 3 (or 4). DCQCN active. Some interfaces showing high buffer occupancy.',
    steps: [
      {
        check: 'Check for PFC pause frames on the suspected interface.',
        command: 'show interfaces Ethernet1 | grep -i "pause\\|PFC"',
        expected: 'PFC pause frames sent/received should be minimal (< 100/sec in steady state).',
        divergence: 'High PFC sent/received counts (thousands/sec) = pause storm. One interface is receiving PAUSE and propagating it upstream.'
      },
      {
        check: 'Identify which priority class is paused.',
        command: 'show qos interfaces Ethernet1 counters',
        expected: 'All priority class drop counters near zero. TX counters proportional to expected traffic mix.',
        divergence: 'High drops on priority class 3 (RoCE) = congestion at that class. High drops on priority class 7 (highest) during a PFC storm = HoL blocking spilling into other queues.'
      },
      {
        check: 'Check DCQCN / ECN marking thresholds.',
        command: 'show qos profile ecn',
        expected: 'ECN min-threshold set below PFC threshold. Typical: ECN at 30% buffer, PFC at 80% buffer.',
        divergence: 'If ECN threshold is missing or set above PFC threshold, ECN never fires before PFC triggers. Senders are never signaled to back off gracefully.'
      },
      {
        check: 'Check for buffer occupancy on the problematic port.',
        command: 'show interfaces Ethernet1 queues',
        expected: 'Queue depth below configured ECN/PFC thresholds in steady state.',
        divergence: 'Sustained 100% queue depth = traffic arrival rate exceeds physical port capacity. Classic congestion — not a config issue, but requires traffic engineering or additional capacity.'
      }
    ],
    rootCause: 'DCQCN ECN thresholds not configured or set too high. When a queue fills, PFC PAUSE fires instead of ECN signaling. The upstream sender is hard-stopped via PAUSE frames which propagates upstream (pause storm), eventually blocking all traffic including high-priority.',
    fix: `! Set ECN to trigger BEFORE PFC to give senders time to back off:
qos profile DCQCN
  ecn minimum-threshold 100000     ! ~30% of buffer (bytes)
  ecn maximum-threshold 200000     ! ~50% of buffer
  pfc threshold 300000             ! ~80% of buffer

! Apply to the interface:
interface Ethernet1
  qos trust dscp
  service-policy type qos QOS-POLICY`,
    prevention: 'For AI/RoCE fabrics, always configure ECN at 30% of buffer and PFC at 80%. Never enable PFC without DCQCN. Monitor PFC pause counters in CloudVision; alert at > 1000/sec sustained for 60 seconds.'
  },

  // ── MACsec ────────────────────────────────────────────────────────────────
  {
    id: 'macsec-session-fail',
    title: 'MACsec Session Stays in secFailed State',
    protocol: 'MACsec',
    severity: 'High',
    symptom: 'Interface stuck in `secFailed` state after enabling MACsec. Link is physically up but no traffic passes. BGP or other protocols over this link are down.',
    context: 'EOS MACsec with MKA key agreement. Static CAK/CKN configured or dynamic keying via 802.1X.',
    steps: [
      {
        check: 'Check MACsec session state.',
        command: 'show macsec summary\nshow macsec detail',
        expected: '"Secured" state on all MACsec interfaces. SA counters incrementing.',
        divergence: '"secFailed" or "Pending" = MKA handshake failed. MKA failure is almost always key mismatch or cipher suite mismatch.'
      },
      {
        check: 'Verify CAK/CKN are identical on both ends.',
        command: 'show macsec policy <policy-name>',
        expected: 'Both ends report same policy name, CKN, and cipher suite.',
        divergence: 'CKN values differ = MKA HELLO messages will not match. CAK (the actual key) must also match but is not shown in CLI — verify via configuration audit.'
      },
      {
        check: 'Check cipher suite compatibility.',
        command: 'show macsec detail | grep "Cipher\\|cipher"',
        expected: 'Both peers negotiate the same cipher suite (e.g., GCM-AES-128 or GCM-AES-256).',
        divergence: 'If one end configures GCM-AES-256 and the other GCM-AES-128, the negotiation fails. Verify both sides have matching `cipher aes128-gcm` or `cipher aes256-gcm`.'
      },
      {
        check: 'Verify the interface has MACsec policy applied.',
        command: 'show interfaces Ethernet1 | grep "mac-sec\\|macsec\\|MACsec"',
        expected: 'MACsec policy applied. "SecureConnectivity" or "Secured" state.',
        divergence: 'Policy not applied = forgot `macsec profile <name>` under interface configuration. Check `interface Ethernet1 → macsec profile`.'
      }
    ],
    rootCause: 'MKA handshake failure due to: (1) CAK/CKN mismatch between peers — most common, (2) cipher suite mismatch, (3) MKA hello timer timeout if link delay is high. In `secFailed`, the interface is in a secure fail-close state where traffic is blocked until MKA succeeds.',
    fix: `! On both sides, ensure identical config:
mac security
  profile PROD-MACSEC
    key 0000000000000000000000000000000a ckn 00000000000000000000000000000001
    cipher aes128-gcm
    send-secure-announcement enable

interface Ethernet1
  macsec profile PROD-MACSEC`,
    prevention: 'Before enabling MACsec on production links, test the key exchange on a lab/staging link. Document CAK/CKN values in a vault (never in plain text). Add a post-change health check: `show macsec summary` and confirm "Secured" state within 30 seconds of enabling.'
  }
];

// Cross-reference map: protocol ID (as used in ProtocolsApp) → scenario IDs for the inline Troubleshoot section
export const PROTOCOL_TROUBLESHOOT_MAP: Record<string, string[]> = {
  EVPN:    ['evpn-rt-miss', 'evpn-dup-mac', 'evpn-type5-miss'],
  VXLAN:   ['vxlan-mtu-black', 'vxlan-tunnel-down'],
  BGP:     ['bgp-idle', 'bgp-route-withdraw'],
  MLAG:    ['mlag-peer-inactive'],
  LINUX:   ['linux-netns-miss'],
  QOS:     ['qos-pfc-storm'],
  MACSEC:  ['macsec-session-fail'],
};
