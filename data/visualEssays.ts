import { ConceptExplainer } from '../types';

export const visualEssays: ConceptExplainer[] = [
  {
    id: 'c-why-arista',
    title: 'Why Arista?',
    subtitle: 'The Software-Defined Revolution.',
    tags: ['EOS', 'SysDB', 'Strategy'],
    sections: [
      {
        heading: 'The Unified Image',
        body: 'Arista ships one binary across every platform. This eliminates version-drift and simplifies testing cycles. When you qualify EOS on one device, you qualify it for the whole fabric.',
        visualPrompt: 'A single glowing sphere representing a unified binary source.'
      },
      {
        heading: 'SysDB: State-Sharing',
        body: 'Processes communicate through a central state database, enabling hitless restarts and unparalleled reliability. State is decoupled from protocol logic.',
        visualPrompt: 'A central core with multiple nodes syncing state.'
      },
      {
        heading: 'Open Programmability',
        body: 'Built on an unmodified Linux kernel. Access a real bash shell, run Python on-box, and leverage eAPI for seamless integration with modern DevOps toolchains.',
        visualPrompt: 'Code brackets and terminal symbols pulsing with light.'
      },
      {
        heading: 'Cognitive Telemetry',
        body: 'Move from SNMP polling to state-streaming. CloudVision captures every state change in real-time, providing a "time-machine" for network forensics.',
        visualPrompt: 'A radar sweep across a field of data points.'
      }
    ]
  },
  {
    id: 'c-leaf-spine',
    title: 'Leaf-Spine Fundamentals',
    subtitle: 'Clos topology and the death of spanning tree.',
    tags: ['Architecture', 'Clos', 'ECMP', 'Leaf-Spine'],
    sections: [
      {
        heading: 'Why East-West Traffic Changed Everything',
        body: 'Traditional three-tier networks (access → distribution → core) were designed for north-south traffic — clients talking to servers in the same rack. Modern workloads are different: VMs migrating, storage replication, microservices communicating laterally. East-west traffic now dominates data centers, and three-tier designs bottleneck at the distribution layer. Leaf-spine eliminates that chokepoint.',
        visualPrompt: 'Two architectural diagrams side by side: left shows a hierarchical pyramid with traffic funneling upward, right shows a flat mesh grid where every node connects equally; the right diagram glows with even, distributed light.'
      },
      {
        heading: 'The Clos Topology',
        body: 'A Clos fabric — named after telephony engineer Charles Clos — provides non-blocking, rearrangeably non-blocking connectivity. In data center terms: two spine switches + four leaf switches means every leaf can reach every other leaf through exactly two hops, with equal-cost paths across all spines. Add capacity by adding leaves. Add bandwidth by adding spines. There is no spanning tree, no root bridge election, no blocked ports.',
        visualPrompt: 'A perfectly symmetrical bipartite graph: top row of spine switches connected to every leaf switch in the bottom row, all paths lit in equal-weight green lines.'
      },
      {
        heading: 'ECMP: Load Balancing Without STP',
        body: 'Equal-Cost Multi-Path routing allows traffic to flow across all available uplinks simultaneously. Where spanning tree would block redundant links, ECMP uses them all — hashing flows across paths by 5-tuple (src IP, dst IP, protocol, src port, dst port). On Arista EOS, ECMP is enabled by default across all L3 uplinks. A four-spine design delivers 4x the effective uplink bandwidth per leaf.',
        visualPrompt: 'Parallel highway lanes all flowing simultaneously, each labeled with a different hash value, converging at a single destination point.'
      },
      {
        heading: 'Two-Tier vs Three-Tier: The Decision',
        body: 'Two-tier (leaf-spine) scales to ~64 spines × 64 leaves = 4,096 leaf ports at 100G — enough for most enterprise and cloud data centers. Three-tier (leaf-spine-super-spine) extends to millions of ports but adds hop count and complexity. The rule: deploy two-tier until you exceed ~50 spine ports, then evaluate super-spine. On Arista 7800R4 or 7500R3 chassis spines, two-tier can reach enormous scale before super-spine is justified.',
        visualPrompt: 'Two architectural blueprints on a drafting board: the left shows a compact two-tier graph, the right shows a deeper three-tier graph with an extra layer; a decision arrow points between them based on scale.'
      }
    ]
  },
  {
    id: 'c-evpn-bgp',
    title: 'EVPN: How BGP Won the Data Center',
    subtitle: 'From VPLS to MP-BGP overlay — the evolution of multi-tenancy.',
    tags: ['EVPN', 'BGP', 'VXLAN', 'Multi-tenancy'],
    sections: [
      {
        heading: 'The Problem EVPN Solved',
        body: 'Before EVPN, multi-tenant overlays relied on VPLS (Martini/Kompella drafts), OTV, or proprietary FabricPath. These required manual flooding tables, had poor MAC scale, and lacked standardized interop. EVPN — Ethernet VPN, RFC 7432 — uses MP-BGP as a control plane to distribute MAC and IP reachability information. Flooding is eliminated. The MAC table is learned via BGP updates, not data-plane flooding.',
        visualPrompt: 'A before/after split: left panel shows chaotic flood-and-learn arrows bouncing between switches; right panel shows a clean BGP control plane with orderly update arrows flowing through a route reflector.'
      },
      {
        heading: 'Route Types: RT-2, RT-3, RT-5',
        body: 'EVPN defines several route types. RT-2 (MAC/IP Advertisement) carries a MAC address with its associated IP — this enables integrated routing and bridging (IRB) at the VTEP. RT-3 (Inclusive Multicast) signals BUM (broadcast/unknown/multicast) handling — typically ingress replication in Arista designs. RT-5 (IP Prefix Route) enables pure L3 routing between VRFs without requiring a MAC — critical for inter-VRF routing and DCI. Understanding which route type a troubleshooting command reveals is the first step in EVPN diagnosis.',
        visualPrompt: 'Three labeled route packets floating in a network diagram: RT-2 glowing blue (MAC+IP), RT-3 glowing orange (multicast), RT-5 glowing purple (prefix) — each flowing to different parts of the fabric.'
      },
      {
        heading: 'Anycast Gateway (VARP)',
        body: 'Traditional first-hop redundancy (HSRP, VRRP) elects one active gateway — half the bandwidth is wasted on the standby. Arista Virtual ARP (VARP) assigns the same MAC and IP address to every leaf acting as a gateway for a VLAN. Any leaf can answer ARP requests immediately. Traffic routes optimally from the closest point in the fabric. No election, no failover delay, no active/standby asymmetry. This is the primary reason Arista EVPN fabrics eliminate hairpinning.',
        visualPrompt: 'Multiple leaf switches all sharing the same gateway IP/MAC, each showing an ARP response arrow going directly to the host — no packets traveling up to a spine gateway.'
      },
      {
        heading: 'Route Targets: The Multi-tenancy Glue',
        body: 'Route Targets (RT) control which BGP routes are imported/exported per VRF. The convention in Arista designs: L2 RTs use 10:VNI format, L3 RTs use 50:VNI. Every tenant gets a unique VNI; every VNI maps to a unique RT pair. When a new tenant is provisioned, a new VLAN, VNI, and RT triplet is configured — isolating blast radius to that segment. RT mismatches are the most common cause of EVPN reachability failures in brownfield deployments.',
        visualPrompt: 'A key-and-lock diagram: each VRF has a unique RT "key" that unlocks only the matching route set, illustrated as colored doors opening to matching colored route tables.'
      }
    ]
  },
  {
    id: 'c-deep-buffers-ai',
    title: 'Deep Buffers & AI Networking',
    subtitle: 'Why your AI cluster demands buffer headroom — and what happens without it.',
    tags: ['AI', 'Buffers', 'RoCE', 'PFC', 'RDMA'],
    sections: [
      {
        heading: 'The Collective Communication Problem',
        body: 'AI training uses collective operations — AllReduce, AllGather, Broadcast — where hundreds of GPUs must synchronize gradient updates simultaneously. These create synchronized bursts: all-to-all traffic patterns where every GPU sends to every other GPU at the same moment. A shallow-buffer switch (4–8 MB) drops packets under this load. Dropped packets trigger RoCE retransmissions, which trigger more congestion, cascading into a performance collapse known as RDMA incast.',
        visualPrompt: 'A burst wave visualization: hundreds of arrows converging simultaneously at a switch, overwhelming a small buffer tank, with overflowing drops shown in red; next to it a deep buffer tank absorbing the same wave smoothly.'
      },
      {
        heading: 'PFC and ECN: The Lossless Toolbox',
        body: 'Priority Flow Control (PFC, IEEE 802.1Qbb) sends a PAUSE frame upstream when a queue fills — halting transmission on a specific priority class without dropping packets. ECN (Explicit Congestion Notification) marks packets before queue overflow, signaling senders to reduce rate. Arista recommends using both: ECN to signal early congestion, PFC as the last-resort backstop. Misconfigured PFC can create head-of-line blocking or pause storms — buffer tuning is a craft, not a checkbox.',
        visualPrompt: 'A traffic flow diagram showing ECN marks appearing on packets at 30% queue depth, with a PFC pause frame being sent at 80%, and both mechanisms preventing the overflow edge at 100%.'
      },
      {
        heading: 'Deep Buffer Platforms: When They Matter',
        body: 'Arista deep-buffer platforms ship with orders of magnitude more shared packet buffer than commodity merchant silicon (Trident4: ~64 MB). Deep buffer is critical for: AI training fabrics (RoCE/RDMA), storage fabrics (NVMe-oF over Ethernet), and HFT networks with micro-burst absorption needs. For standard enterprise or web-scale workloads, merchant silicon is often sufficient. The decision framework: if packet loss under burst causes application-level retransmits that cost more than the buffer hardware, deploy deep-buffer platforms.',
        visualPrompt: 'A platform comparison matrix: shallow-buffer switch shown as a thin tank, deep-buffer platform as a massive reservoir; overlaid with workload types mapped to each.'
      },
      {
        heading: 'LANZ: Latency Analytics',
        body: "Latency Analyzer (LANZ) is Arista's on-ASIC telemetry engine that captures queue depth at sub-microsecond granularity. It records when queues spike, for how long, and which flows contributed. SEs can demonstrate LANZ during POCs to show real-time AI fabric health — and post-incident, LANZ replays the microsecond timeline of a congestion event that caused a training job slowdown. This forensic capability is a meaningful differentiator over platforms that expose only counter deltas.",
        visualPrompt: 'A real-time graphing interface showing queue depth spikes at microsecond resolution, with color-coded flow identifiers and a replay timeline scrubber at the bottom.'
      }
    ]
  },
  {
    id: 'c-state-streaming',
    title: 'State Streaming vs Polling',
    subtitle: 'From SNMP blind spots to real-time observability.',
    tags: ['CloudVision', 'SysDB', 'Telemetry', 'SNMP', 'gNMI'],
    sections: [
      {
        heading: 'The Polling Blindspot',
        body: 'SNMP polling samples counters at fixed intervals — typically 5 minutes. In those 5 minutes, a link could flap 200 times, a queue could spike and recover, and a BGP session could reset and re-establish. The NMS sees: "interface is up, no errors." SNMP is structurally incapable of observing transient events because it only sees the state at the poll moment, not the state transitions between polls. For modern networks running sub-second failover and microsecond burst cycles, polling is observationally blind.',
        visualPrompt: 'A timeline showing a network event (link flap + recovery) occurring between two SNMP poll timestamps, with the event invisible to the NMS — a dotted line through the blind spot.'
      },
      {
        heading: 'SysDB: The State Substrate',
        body: 'EOS is built around SysDB — a publish/subscribe state database that every EOS agent uses as its source of truth. Protocols do not communicate directly; they publish and subscribe to SysDB paths. This design means state is always consistent, always queryable, and always streamable. When you stream telemetry from an Arista device, you are reading SysDB paths in real-time — not polling CLI output or scraping counters from a process.',
        visualPrompt: 'A central SysDB core with radiating spokes to BGP agent, interface agent, LANZ agent, and OpenConfig telemetry exporter — each agent reading and writing to the same state substrate.'
      },
      {
        heading: 'gNMI and OpenConfig Streaming',
        body: 'gRPC Network Management Interface (gNMI) with OpenConfig models enables streaming telemetry: the device pushes state changes as they occur, with sub-second granularity. CloudVision uses gNMI to collect every state change from every device continuously. The result: a complete, timestamped record of the network\'s state history — queryable backwards in time. An engineer can ask "what was the BGP state of this peer at 2:47 AM on Tuesday?" and get an exact answer.',
        visualPrompt: 'A streaming data river flowing from a switch into a CloudVision timeline, with individual state changes appearing as labeled droplets — each with a precise timestamp.'
      },
      {
        heading: 'Time-Machine: Forensics and Change Control',
        body: 'CloudVision\'s time-machine capability isn\'t just for troubleshooting — it\'s audit evidence. For GxP-regulated environments, every configuration change is attributed to an authenticated identity with a precise timestamp. For incident response, an engineer can replay the exact sequence of state changes that preceded an outage — interface error counters rising, route withdrawals, forwarding path shifts — without waiting for a vendor to analyze logs. This is the observability capability that SNMP-centric platforms cannot replicate.',
        visualPrompt: 'A forensic timeline interface: a horizontal scrollbar representing time, with flagged events (BGP withdrawal, interface flap, config change) that an engineer can click to expand into full state snapshots.'
      }
    ]
  },
  {
    id: 'c-zero-trust',
    title: 'Zero Trust Network Architecture',
    subtitle: 'Never trust, always verify — and what that means for fabric design.',
    tags: ['Security', 'Zero Trust', 'MSS', 'Segmentation', 'MACsec'],
    sections: [
      {
        heading: 'The Perimeter Fallacy',
        body: 'The castle-and-moat model assumed everything inside the firewall was trusted. Ransomware, lateral movement, and insider threats broke that assumption permanently. In a flat network, a single compromised endpoint can communicate freely with every other device — scanning, pivoting, exfiltrating. Zero Trust replaces "trusted network, untrusted internet" with "trust no connection by default, verify every identity, enforce least-privilege access regardless of source location."',
        visualPrompt: 'A crumbling castle wall with a network diagram inside showing unrestricted lateral movement arrows — contrasted with a segmented network where each zone requires explicit policy to communicate.'
      },
      {
        heading: 'Macro-Segmentation Service (MSS)',
        body: 'Arista MSS delivers dynamic network segmentation without requiring a physical firewall between every segment. MSS-Group and MSS-Firewall use the existing Arista fabric as a distributed enforcement point: security policy is pushed from CloudVision, and every switch enforces it in hardware at line rate. Segments are defined by device identity or user identity — not VLAN or IP address. This means a compromised endpoint in VLAN 10 cannot reach the database in VLAN 10 if policy denies it.',
        visualPrompt: 'A network fabric with policy enforcement points embedded at every leaf switch, with colored security zones visually isolated despite sharing the same physical infrastructure.'
      },
      {
        heading: 'Identity as the New Perimeter',
        body: '802.1X port authentication, dynamic VLAN assignment, and certificate-based device identity replace static VLANs as the segmentation primitive. An endpoint\'s network access rights follow its authenticated identity — regardless of which port, which building, or which time of day it connects. Combined with AVD-managed templates and CloudVision policy push, onboarding a new device category (IoT sensors, medical devices, kiosks) becomes a policy update, not a firewall rule change.',
        visualPrompt: 'An identity badge floating above a device, with green policy arrows flowing from the badge to allowed network segments and red walls blocking paths to forbidden zones.'
      },
      {
        heading: 'Network Detection and Response (NDR)',
        body: 'Arista NDR passively monitors all east-west traffic flows using a dedicated tap fabric or VTEP mirroring to identify behavioral anomalies. Unlike IDS signatures, NDR detects lateral movement by behavioral deviation: a server that never communicated with the HR subnet suddenly sending SMB traffic is flagged, regardless of whether the traffic matches a known attack signature. NDR integrates with CloudVision to correlate network behavior with device identity and configuration state.',
        visualPrompt: 'A network graph showing normal communication patterns in blue, with a sudden anomalous connection in red being flagged by an NDR sensor that correlates it with a behavioral baseline.'
      }
    ]
  },
  {
    id: 'c-macsec',
    title: 'MACsec: Wire-Speed Encryption',
    subtitle: 'Link-layer confidentiality without the tax of IPsec tunnels.',
    tags: ['MACsec', 'Security', 'Encryption', '802.1AE'],
    sections: [
      {
        heading: 'Why Not IPsec?',
        body: 'IPsec encrypts at L3 — it adds overhead, requires dedicated crypto hardware or CPU cycles, and introduces latency at line rate. In a 400G spine-leaf fabric, IPsec would require dedicated encrypt/decrypt appliances per link or a significant CPU burden. MACsec (IEEE 802.1AE) encrypts at L2 — within the Ethernet frame, between two directly connected devices. Modern merchant and custom silicon (Arista Jericho2/Jericho2C+) performs MACsec encryption in the ASIC forwarding pipeline at full line rate with zero latency penalty.',
        visualPrompt: 'Two switches connected by a link: the packet traveling the link is shown as an encrypted, sealed envelope with a key icon — decrypted only at the receiving ASIC before forwarding.'
      },
      {
        heading: 'MACsec Key Agreement (MKA)',
        body: 'MACsec uses MKA (802.1X-2010) for key exchange — specifically CAK (Connectivity Association Key) and SAK (Secure Association Key). CAK is pre-shared or distributed via 802.1X; SAK is derived per session and rotates periodically. This means you never pass the long-term secret over the wire — only session keys derived from it. On Arista EOS, MACsec configuration is applied per-interface with a keychain referencing the CAK. Key rotation is automatic and hitless in recent EOS trains.',
        visualPrompt: 'A key ceremony diagram: a shared CAK on both sides never leaves the device; derived session SAKs flow between switches with periodic rotation arrows.'
      },
      {
        heading: 'Where to Deploy MACsec',
        body: 'Deploy MACsec on: (1) inter-switch links traversing untrusted physical paths (colocation facilities, leased dark fiber, IDF closets with physical access risk), (2) links between data centers, (3) uplinks from high-value server segments. Do not deploy MACsec on every access port by default — the per-port overhead in management complexity and key infrastructure justifies selective, risk-based deployment. For inter-DC links, combine MACsec (L2 encryption) with EVPN route filtering for defense in depth.',
        visualPrompt: 'A network topology with MACsec padlocks selectively placed on inter-DC fiber links and colo cross-connects — highlighted in orange as high-risk paths — while intra-building links are shown as standard.'
      },
      {
        heading: 'Replay Protection and Cipher Suites',
        body: 'MACsec supports GCM-AES-128 and GCM-AES-256. The 256-bit variant is required for classified government environments (FIPS 140-2 Level 2). Replay protection uses a 32-bit or 64-bit packet number to reject out-of-order or replayed frames — critical for detecting man-in-the-middle attacks on dark fiber. On Arista platforms, cipher suite selection and replay window size are configurable per-interface. For regulated environments (HIPAA, PCI-DSS), document the cipher suite and replay window as evidence of encryption controls.',
        visualPrompt: 'A frame header showing the MACsec Security Tag (SecTAG) with a packet number counter incrementing, alongside a cipher suite selector showing AES-256 highlighted for regulated environments.'
      }
    ]
  },
  {
    id: 'c-ai-cluster-networking',
    title: 'AI Cluster Networking Constraints',
    subtitle: 'GPU-to-GPU bandwidth, rail alignment, and the physics of training at scale.',
    tags: ['AI', 'GPU', 'RDMA', 'RoCE', 'Rail', 'H100'],
    sections: [
      {
        heading: 'The Bisection Bandwidth Imperative',
        body: 'An AI training job is only as fast as its slowest communication step. If 128 GPUs are performing AllReduce across a fabric with insufficient bisection bandwidth, gradient synchronization becomes the bottleneck — not compute. True non-blocking fabrics guarantee that any set of source-destination pairs can communicate at full line rate simultaneously. For NVIDIA H100/B200 NVLink pods, this means the Ethernet fabric must match or exceed the NVLink bandwidth of 900 GB/s per GPU for the cross-pod portion of traffic.',
        visualPrompt: 'A bisection line cutting a network diagram in half, with equal-weight arrows flowing in both directions — each arrow labeled with its bandwidth contribution to a global AllReduce operation.'
      },
      {
        heading: 'Rail Alignment: Organizing the Fabric',
        body: 'Rail alignment places GPUs that communicate during AllReduce on the same leaf switch, or connected through the same spine "rail." In a dual-rail design, each GPU has two NICs — each connected to a different ToR leaf. Rail 0 handles gradient traffic for even-numbered layers; Rail 1 handles odd-numbered layers. This ensures that GPU-to-GPU traffic within a pod rarely crosses the spine boundary, preserving spine bandwidth for inter-pod communication. Arista AVD includes rail-aligned inventory templates for NVIDIA DGX H100 pods.',
        visualPrompt: 'A fabric diagram with GPU servers at the bottom, dual-homed to two different leaf rows (Rail 0 and Rail 1) shown in different colors, with spine connectivity shown above handling only inter-pod traffic.'
      },
      {
        heading: 'RDMA and RoCE v2',
        body: 'Remote Direct Memory Access (RDMA) bypasses the OS kernel — data moves directly between GPU memory and NIC memory without CPU involvement. RoCE v2 (RDMA over Converged Ethernet v2) encapsulates RDMA in UDP/IP, making it routable across a standard IP fabric. The constraint: RDMA is extremely sensitive to packet loss. A single dropped packet causes a full message retransmission at the RDMA layer — not just TCP segment retransmission. This is why PFC and ECN are non-optional for RoCE v2 fabrics; even 0.001% packet loss can cut training throughput by 30-50%.',
        visualPrompt: 'A GPU sending data directly to another GPU\'s memory via a NIC-to-NIC path, bypassing the CPU stack entirely — with a "kernel bypass" label and data flow arrows moving at wire speed.'
      },
      {
        heading: 'Scaling Beyond a Single Pod',
        body: 'H100 DGX A100 systems use NVLink for intra-node GPU communication (all-within-one-server), NVLink Switch for intra-pod (within a rack), and Ethernet for inter-pod (rack-to-rack). The Ethernet fabric becomes critical at scale: a 100-node cluster with 800 GPUs each generating 400G of gradient traffic requires ~320 Tbps of aggregate east-west bandwidth across the spine layer. Arista 7800R4 spines at 576 Tbps system capacity, deployed in a three-stage Clos, are the current standard for hyperscale AI training fabrics.',
        visualPrompt: 'A three-tier AI fabric diagram: GPUs within a node connected by NVLink, nodes in a rack connected by NVLink Switch, and racks connected by a multi-stage Arista Ethernet spine fabric at 400G.'
      }
    ]
  },
  {
    id: 'c-campus-vs-dc',
    title: 'Campus vs Data Center Network Design',
    subtitle: 'Same Arista EOS, different design philosophy — know which principles apply where.',
    tags: ['Campus', 'Data Center', 'Architecture', 'PoE', 'WLAN'],
    sections: [
      {
        heading: 'Trust Zones: The Fundamental Difference',
        body: 'Data center design assumes known, managed endpoints — servers with static IPs, known MAC addresses, controlled software stacks. Campus design assumes unknown, dynamic, often unmanaged endpoints: BYOD phones, IoT sensors, printers, medical devices. The campus network must authenticate and classify every device before granting network access. This inverts the design assumption: DC is "permit by default, segment by policy"; campus is "deny by default, permit by identity."',
        visualPrompt: 'Two network diagrams: left (DC) shows servers with green checkmarks connecting freely; right (Campus) shows diverse endpoints — phones, laptops, sensors — passing through an identity checkpoint before receiving network access.'
      },
      {
        heading: 'PoE: Power as a Network Service',
        body: 'Power over Ethernet (PoE) makes the network switch a power delivery infrastructure for IP phones, access points, cameras, and IoT devices. IEEE 802.3bt (PoE++) delivers up to 90W per port. Campus switches must budget total PoE wattage across all ports — a 48-port switch at 30W per port requires 1,440W of PoE budget, plus switch power. Arista CCS-710 and C-Series platforms are designed specifically for campus PoE deployments, with perpetual PoE that maintains endpoint power during switch software upgrades.',
        visualPrompt: 'A campus switch with power lightning bolt icons on each port, connected to IP phones, access points, and IP cameras — a watt budget meter displayed alongside the chassis.'
      },
      {
        heading: 'LLDP-MED and WLAN Convergence',
        body: 'LLDP-MED (Media Endpoint Discovery) lets network devices automatically provision voice VLANs, QoS markings, and PoE priority for IP phones and APs. When a Cisco or Arista IP phone connects to an Arista switch, LLDP-MED negotiates the voice VLAN automatically — no manual per-port configuration. For wireless, Arista CV-CUE and the Arista Cognitive WLAN platform integrate wired and wireless control planes: AP radio settings, WLAN policy, and client roaming events are all visible in the same CloudVision dashboard.',
        visualPrompt: 'An access switch connected to an IP phone and an access point, with LLDP-MED negotiation arrows auto-assigning voice VLAN and QoS — a single CloudVision pane showing both wired and wireless client state.'
      },
      {
        heading: 'The Collapsed Core: Campus Scale Math',
        body: 'Most campus deployments do not need a full leaf-spine fabric. The collapsed core model — distribution and core functions combined in a single pair of high-density switches — is appropriate for up to ~5,000 users. Beyond that, the "Cognitive Campus Spline" design distributes routing to the access layer using routed access with BGP unnumbered, eliminating Spanning Tree entirely. The decision point: if your access switches are running RSTP with blocked redundant uplinks, you have eliminated half your uplink bandwidth — routed access recovers it.',
        visualPrompt: 'A side-by-side campus design comparison: left shows a classic collapsed core with STP blocking redundant links; right shows routed access with BGP unnumbered and all links active, labeled with the recovered bandwidth.'
      }
    ]
  },
  {
    id: 'c-issu-reliability',
    title: 'ISSU & Network Reliability',
    subtitle: 'How Arista EOS achieves hitless upgrades — and what makes that architecturally possible.',
    tags: ['ISSU', 'SysDB', 'Reliability', 'EOS', 'Upgrades'],
    sections: [
      {
        heading: 'The Classic Upgrade Problem',
        body: 'On a monolithic network OS, a software upgrade means: halt all processes, load new image, restart OS, re-initialize hardware, re-run protocol convergence. During this window — often 3-8 minutes per device — the switch is forwarding nothing. In a 200-switch fabric, rolling upgrades without automation take 10-15 hours of maintenance windows. For financial services, healthcare, and manufacturing environments where continuous operation is required, this is unacceptable. ISSU (In-Service Software Upgrade) eliminates the forwarding disruption.',
        visualPrompt: 'A timeline showing traditional upgrade: a long red gap in forwarding activity; below it, an ISSU timeline showing continuous forwarding with only a brief agent restart flash.'
      },
      {
        heading: 'SysDB as the ISSU Enabler',
        body: 'ISSU is only possible because EOS agents are decoupled from the forwarding plane via SysDB. When a new EOS image is loaded, individual agents restart sequentially — but the ASIC forwarding tables are not cleared. The hardware continues forwarding based on its last programmed state while the control plane agents come back up. Because every agent re-subscribes to SysDB on restart, protocol state is reconstructed from the shared database rather than re-learned from the network. The "hitless" claim is accurate for most traffic; BFD sessions are the primary exception.',
        visualPrompt: 'A diagram showing EOS agents cycling through restart states (BGP agent → OSPF agent → LLDP agent) while the ASIC forwarding plane underneath continues uninterrupted, fed by unchanged SysDB forwarding entries.'
      },
      {
        heading: 'Agent Restart: The Reliability Model',
        body: 'On a traditional OS, a BGP process crash = BGP session loss = route withdrawal = traffic disruption. On EOS, if the BGP agent crashes, it restarts and re-reads its state from SysDB. BGP Graceful Restart (RFC 4724) ensures the peer maintains forwarding entries during the restart window. The result: a BGP agent crash on an Arista device is a software event, not a network event. This architectural property means software bugs are self-healing at the process level without requiring a full device reload.',
        visualPrompt: 'A process crash animation: BGP agent icon stops, SysDB state is shown preserved in the background, agent restarts and re-subscribes to SysDB, peer shows "Graceful Restart" banner — all without a forwarding table change.'
      },
      {
        heading: 'CloudVision and Automated Upgrades',
        body: 'CloudVision Lifecycle Management automates rolling ISSU across an entire fabric. It tracks the EOS version on every device, identifies devices eligible for upgrade, runs pre-checks (BGP session health, interface error rates, existing ISSU flags), executes the upgrade in a defined order (leaves before spines, or per-rack in AI fabrics), and validates post-upgrade state before moving to the next device. A 500-switch fabric upgrade can be completed in a maintenance window with zero human CLI interaction and full rollback capability if validation fails.',
        visualPrompt: 'A CloudVision dashboard showing a fabric upgrade in progress: devices shown in a topology map turning from red (old version) to green (new version) sequentially, with a progress bar and automatic validation checkmarks.'
      }
    ]
  },
  {
    id: 'c-optics-guide',
    title: 'Optics Selection Guide',
    subtitle: 'From SR to ZR — choosing the right transceiver for reach, fiber, and application.',
    tags: ['Optics', 'Transceivers', 'ZR', 'QSFP', 'Fiber'],
    sections: [
      {
        heading: 'The Reach Suffix Decoded',
        body: 'Every optical transceiver carries a reach suffix: SR (Short Range, multimode fiber, ~100m), DR (Direct Reach, SMF, ~500m), FR (Far Reach, SMF, ~2km), LR (Long Reach, SMF, ~10km), ER (Extended Reach, SMF, ~40km), ZR (Zero Reach, SMF, ~80–120km, with DSP). The suffix tells you the minimum optical budget the transceiver guarantees at its rated bandwidth. Mismatching SR optics on single-mode fiber does not create more reach — it creates a fiber mismatch that causes high insertion loss and unreliable links. Fiber type and transceiver suffix must match.',
        visualPrompt: 'A horizontal distance ruler labeled with transceiver suffixes at increasing distances — SR at 100m, DR at 500m, FR at 2km, LR at 10km, ER at 40km, ZR at 80km — fiber type icons shown below each.'
      },
      {
        heading: 'Breakout Logic: High-Density Port Strategies',
        body: 'A 400G QSFP-DD port can be broken out into 4× 100G or 8× 50G using a breakout cable (MPO-12 to 4× LC duplex) or a breakout transceiver. This is critical for ToR switches connecting to 25G or 100G server NICs: a 7050X4 with 32× 400G ports becomes 128× 100G ports via breakout — serving a full rack of dual-25G servers without needing intermediate 100G switches. Key constraint: breakout changes the port configuration; verify platform support and ASIC lane allocation before deploying.',
        visualPrompt: 'A 400G port splitting into 4 paths labeled 100G each via an MPO breakout cable, connecting to four separate server NICs — with a caution icon noting ASIC lane verification.'
      },
      {
        heading: 'DOM: Digital Optical Monitoring',
        body: 'Every modern SFP/QSFP includes DOM (Digital Optical Monitoring) registers that expose real-time: Tx power (dBm), Rx power (dBm), temperature (°C), bias current (mA), and supply voltage (V). These metrics are visible via EOS `show interfaces transceiver` and streamed via CloudVision telemetry. Proactive DOM monitoring catches fiber degradation before link failure: Rx power trending from -3 dBm toward -10 dBm over 30 days indicates a dirty connector or bend-radius issue — addressable before the link drops.',
        visualPrompt: 'A transceiver diagnostic panel showing real-time metrics: Tx Power -2.3 dBm (green), Rx Power -8.7 dBm (yellow warning), Temperature 45°C (green), with threshold lines showing alarm levels.'
      },
      {
        heading: 'ZR and Coherent DWDM: Optical Networking at the Routing Layer',
        body: '400G-ZR and OpenZR+ transceivers use coherent DSP (Digital Signal Processing) to achieve 80-120km reaches on a single SMF pair without inline amplifiers — previously requiring dedicated DWDM line systems. Arista 7280R3 and 7800R3 platforms support ZR transceivers natively, enabling IP-over-DWDM at the routing layer. For DCI (Data Center Interconnect) customers, this eliminates the optical transport layer entirely for metro distances: the Arista router IS the DWDM system. Licensing: 400G-ZR requires the DWDM license on supported platforms.',
        visualPrompt: 'A before/after DCI architecture: left shows a router → transponder → DWDM amplifier → transponder → router chain; right shows two routers connected directly via 400G-ZR transceivers over dark fiber, with the middle layer removed.'
      }
    ]
  },
  {
    id: 'c-polymathos',
    title: 'Nexus of Craft',
    subtitle: 'The collective behind InfraLens.',
    tags: ['PolymathOS', 'Design Ethos', 'Calm Tech'],
    sections: [
      {
        heading: 'The Polymathic Mandate',
        body: 'In a hyper-specialized world, we choose breadth as a deliberate edge. InfraLens exists to connect ideas where fields overlap.',
        visualPrompt: 'Intersecting geometric bands with a calm central glow; muted gradient, minimal noise.'
      },
      {
        heading: 'Bridge: PolymathOS → InfraLens',
        body: 'InfraLens is the PolymathOS thought experiment for the field—turning cross-domain synthesis into tools you can actually use.',
        visualPrompt: 'Two overlapping planes labeled PolymathOS and InfraLens converging into a single focused beam; clean, minimal lines.'
      },
      {
        heading: 'Engineering Aesthetics',
        body: 'Code is not just logic; it is a medium for art. InfraLens embraces “Calm Technology”—interfaces that respect attention, with predictable loading and composed motion.',
        visualPrompt: 'Minimal circuit silhouette under a soft glassy gradient with a single accent glow; restrained motion implied.'
      },
      {
        heading: 'The Infinite Game',
        body: 'We build for the long-term. PolymathOS is a living organism; InfraLens evolves alongside you with versioned modules and essays that grow, not reset.',
        visualPrompt: 'A looping pathway in low-saturation tones with a single accent glow, suggesting continuous growth.'
      },
      {
        heading: 'Craft Principles',
        body: 'Breadth over silos. Calm over spectacle. Durable over disposable.',
        visualPrompt: 'Three simple pillars with soft edge lighting, each labeled with a principle; neutral palette with one accent hue.'
      }
    ]
  }
];
