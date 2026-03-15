import { ProtocolDetail } from './types';

export const EVPN_PROTOCOL: ProtocolDetail = {
    id: 'evpn',
    name: 'EVPN',
    legacyTerm: 'LISP / OTV Control Plane',
    tagline: 'The Intelligent BGP Control Plane for Overlays.',
    description:
      'EVPN replaces flood-and-learn with a publish/subscribe MP-BGP control plane for MAC/IP reachability, enabling deterministic overlays with Anycast Gateways and all-active multi-homing.',
    keyBenefits: [
      'Anycast Gateway (VARP) for seamless mobility.',
      'ARP suppression eliminates most ARP flooding across the fabric — VTEP serves ARP replies from the RT-2 MAC/IP cache instead of flooding.',
      'All-active multi-homing (ESI) maximizes links.',
      'Policy-based logical segmentation via VRF-Lite/EVPN.'
    ],
    bestPractices: [
      'Always configure `send-community extended` on every EVPN BGP neighbor — omitting it silently drops all route-target extended communities and breaks the entire EVPN control plane with no error message.',
      'Peer EVPN sessions from a stable loopback (`update-source Loopback0`), not physical interfaces — physical interface flaps will reset EVPN sessions and cause traffic loss.',
      'For iBGP EVPN overlay, configure route-reflector-client on spines and use the same AS across all leaves — route reflection is an iBGP-only concept and cannot be mixed with eBGP ASNs in the same session. Alternatively, eBGP EVPN overlay (unique ASN per leaf, spines as eBGP next-hop) is equally valid and is the Arista AVD default for greenfield fabrics; in this design no route-reflector is needed.',
      'Standardize and document route-target conventions (e.g. L2 VNI RT = VNI:VNI, VRF RT = 50000+index:1) before deployment — ad-hoc RTs cause silent import/export mismatches during DCI or brownfield migrations.',
      'Enable `bgp log-neighbor-changes` on all EVPN speakers — session flaps are the most common source of MAC/IP withdrawal events and are otherwise invisible without logging.',
      'Prefer EVPN ESI all-active multi-homing over MLAG for leaf-to-spine uplinks where EVPN is already deployed — ESI eliminates the peer-link as a failure domain.',
      'After any topology change, verify RT-2, RT-3, and RT-5 route counts match expected values before declaring success — a missing route type is the most common symptom of a misconfigured import RT or missing redistribute learned.'
    ],
    cliTranslation: [
      { legacy: 'router lisp', arista: 'router bgp 65001' },
      { legacy: 'instance-id 101', arista: 'vlan 10' },
      { legacy: 'service ethernet...', arista: 'rd 1.1.1.1:10010' },
      { legacy: 'route-target export...', arista: 'route-target import/export evpn 10:10' }
    ],
    referenceLinks: [
      { title: 'Arista EOS User Manual — EVPN', summary: 'Authoritative EOS EVPN configuration and operational behavior.', url: 'https://www.arista.com/en/um-eos/eos-configuring-evpn' },
      { title: 'Arista EOS User Manual — VXLAN', summary: 'VXLAN dataplane and EVPN integration points in EOS.', url: 'https://www.arista.com/en/um-eos/eos-vxlan-configuration' },
      { title: 'RFC 7432 EVPN', summary: 'Control-plane route types and MAC/IP advertisement behavior.', url: 'https://www.rfc-editor.org/rfc/rfc7432' },
      { title: 'RFC 8365 NVO with EVPN', summary: 'EVPN as control plane for VXLAN/NVO overlays.', url: 'https://www.rfc-editor.org/rfc/rfc8365' }
    ],
    masteryPath: [
      {
        level: 'Foundation',
        heading: 'Overlay vs Underlay',
        body:
          'EVPN is the control plane (brain) while VXLAN is the data plane (body). Underlay IP reachability is mandatory for reliable overlays.',
        keyConcept: 'Control Plane vs Data Plane'
      },
      {
        level: 'Logic',
        heading: 'BGP Route Types',
        body:
          'RT2 advertises MAC/IP bindings, RT3 distributes BUM (IMET), RT5 advertises IP prefixes for L3 EVPN. Master these to debug reachability.',
        keyConcept: 'RT-2, RT-3, RT-5'
      },
      {
        level: 'Architecture',
        heading: 'ESI All-Active',
        body:
          'Ethernet Segment Identifiers allow a server to dual-home to two leaves with active-active forwarding, eliminating the peer-link dependency.',
        keyConcept: 'ESI & Split-Horizon'
      },
      {
        level: 'Architecture',
        heading: 'Route-Target Hygiene',
        body:
          'Standardize RT conventions (VLAN VNI: 10:10, VRF VNI: 50:001) and enforce import/export parity to avoid silent blackholes during brownfield migrations.',
        keyConcept: 'RT Discipline'
      },
      {
        level: 'Architecture',
        heading: 'ARP Suppression Mechanics',
        body: 'EVPN RT-2 routes carry host MAC+IP bindings. With ARP suppression enabled, the local VTEP intercepts ARP requests and responds with the cached binding — the request never crosses the VXLAN underlay. This is the dominant mechanism for reducing BUM traffic in mature EVPN deployments. Verify with: show vxlan address-table and show bgp evpn route-type macip detail.',
        keyConcept: 'Proxy ARP at VTEP'
      },
      {
        level: 'Architecture',
        heading: 'Type-5 Route Injection',
        body: 'RT-5 (IP Prefix Route) is the EVPN mechanism for advertising IP subnets between VRFs without requiring a MAC binding. It is used for: (1) inter-VRF routing where hosts in different VRFs need to communicate, (2) DCI prefix advertisement across sites, and (3) injecting external routes (redistributed from OSPF/BGP) into the EVPN fabric. Configure with redistribute connected/static inside the VRF BGP context.',
        keyConcept: 'RT-5 for L3 Prefix Reach'
      }
    ],
    overview: {
      title: 'EVPN Route Types Explained',
      intro: 'EVPN uses BGP route types (RTs) to carry different kinds of information. Each type serves a distinct purpose: RT-2 handles L2 host discovery, RT-3 handles BUM replication, RT-5 handles L3 prefix routing. Understanding which route type to look at when debugging a reachability problem cuts diagnosis time dramatically.',
      sections: [
        {
          title: 'RT-2 · MAC/IP Advertisement',
          body: 'Advertises a MAC address and its associated IP from the VTEP that learned it. Enables remote VTEPs to build ARP caches without flooding. A missing RT-2 means a host is not reachable by MAC or cannot get ARP responses.',
          bestFor: 'L2 reachability, ARP suppression, host mobility tracking.'
        },
        {
          title: 'RT-5 · IP Prefix Route',
          body: 'Advertises an IP prefix (not a MAC). Used for L3 routing between VRFs and DCI prefix distribution. An RT-5 is generated when you configure "redistribute connected" inside a VRF BGP context. No MAC is required.',
          bestFor: 'Inter-VRF routing, DCI L3 extension, external prefix injection.'
        }
      ],
      conclusion: 'Debug flow: missing host reachability → check RT-2 count. Missing subnet routing → check RT-5. Missing BUM replication → check RT-3 IMET routes. All three route types must be present and importing correctly on every VTEP that needs the service.'
    },
    primer: {
      title: 'BGP send-community — Why It Must Be There',
      body: 'EVPN route-targets are carried in BGP Extended Communities. By default, EOS (like most BGP implementations) does NOT send extended communities to neighbors — they are stripped on output. "send-community extended" is a per-neighbor command that re-enables Extended Community propagation. Without it, every BGP UPDATE from a leaf to a spine arrives with no route-targets attached. The spine has no idea which VNI or VRF the route belongs to and cannot reflect it correctly. The result: all EVPN sessions form, all routes are received, but zero traffic flows — and show bgp evpn shows routes with no RT attributes. This is the #1 cause of "EVPN is configured but nothing works" incidents in first-time deployments.'
    },
    roleConfigs: [
      {
        role: 'Leaf (VTEP)',
        description:
          'Maps local VLANs to VNIs, advertises host reachability via MP-BGP, and provides Anycast Gateway for L2/L3 services.',
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
        role: 'Spine (RR)',
        description: 'Reflects EVPN routes between leaves while running underlay routing.',
        config: `router bgp 65101
   bgp log-neighbor-changes
   neighbor 1.1.1.1 remote-as 65101
   neighbor 1.1.1.1 update-source Loopback0
   neighbor 1.1.1.1 send-community extended
   neighbor 2.2.2.2 remote-as 65101
   neighbor 2.2.2.2 update-source Loopback0
   neighbor 2.2.2.2 send-community extended
   address-family evpn
      neighbor 1.1.1.1 activate
      neighbor 1.1.1.1 route-reflector-client
      neighbor 2.2.2.2 activate
      neighbor 2.2.2.2 route-reflector-client`
      },
      {
        role: 'DCI / L3 EVPN',
        description: 'Extends VRFs between sites with RT5/IP prefix advertisements.',
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
        role: 'Symmetric IRB',
        description: 'Symmetric IRB: traffic enters and exits via the gateway leaf — preferred for multi-VRF deployments. Both ingress and egress VTEPs hold the L3 SVI.',
        config: `! Symmetric IRB — both leaves act as L3 gateway for all VLANs
interface vxlan1
   vxlan vlan 10 vni 10010
   vxlan vrf Prod vni 50001
!
interface Vlan10
   vrf Prod
   ip address virtual 10.10.10.1/24
!
router bgp 65101
   vlan 10
      rd 1.1.1.1:10010
      route-target import evpn 10:10010
      route-target export evpn 10:10010
      redistribute learned
   vrf Prod
      rd 1.1.1.1:50001
      route-target import evpn 50:50001
      route-target export evpn 50:50001
      redistribute connected`
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
      }
    ],
    dcContext: {
      small: {
        scale: '2-tier · 2 spines acting as RR · 4 leaves',
        topologyRole: 'eBGP underlay + EVPN AF on same session; spines are RR for RT-2/RT-5',
        keyConfig: 'neighbor SPINES activate  ! under address-family evpn',
        highlight: 'all'
      },
      medium: {
        scale: '3-tier · 4 dedicated RR spines · 8–16 leaves · 2 pods',
        topologyRole: 'Dedicated RR spines; per-pod iBGP optional; RT-2 and RT-5 across pods via border',
        keyConfig: 'bgp listen range 10.0.0.0/8 peer-group UNDERLAY remote-as external  ! dynamic peering',
        highlight: 'isl'
      },
      large: {
        scale: 'Multi-pod · super-spine RR hierarchy · 32+ leaves',
        topologyRole: 'Hierarchical BGP RR tiers; EVPN DCI via super-spine EVPN gateways',
        keyConfig: 'route-reflector-client  ! on super-spine for inter-pod EVPN',
        highlight: 'border'
      }
    }
  }
