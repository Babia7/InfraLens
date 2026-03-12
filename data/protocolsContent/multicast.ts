import { ProtocolDetail } from './types';

export const MULTICAST_PROTOCOL: ProtocolDetail = {
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
  }
