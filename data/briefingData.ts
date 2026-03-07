
import { BriefingNarrative } from '../types';

export const SIGNATURE_NARRATIVES: Record<string, BriefingNarrative> = {
  'why-arista': {
    title: 'The Arista Advantage',
    subtitle: 'A Masterclass in Software-Defined Networking',
    scenes: [
      {
        heading: 'The Legacy Monolith',
        caption: 'Legacy networking is defined by fragmentation and fragile software.',
        teleprompter: "Start by addressing the elephant in the room. Most vendors ship dozens of different software images for their hardware. This is 'version-drift' entropy. It creates an environment where every upgrade is a gamble and every bug is a snowflake. We aren't just fighting complexity; we are fighting the history of 1990s software architecture.",
        visualIntent: 'Chaotic, fragmented geometric shapes in dull grey, slowly rotating and colliding.'
      },
      {
        heading: 'The Unified Binary',
        caption: 'One Image. Every platform. Zero compromise.',
        teleprompter: "Contrast the chaos with Arista's EOS. We ship a single binary image that runs across our entire portfolio—from the smallest 1G campus switch to the massive 400G spine. This reduces testing cycles from months to days. It is the definition of operational consistency. When you qualify EOS once, you qualify your entire network.",
        visualIntent: 'A single, perfectly symmetrical glowing sphere of blue light at the center of a dark void.'
      },
      {
        heading: 'SysDB: The Heart of State',
        caption: 'Reliability is a software problem solved by state-based architecture.',
        teleprompter: "Explain SysDB. Traditional switches use messaging between processes—if one process dies, the chain breaks. In EOS, all processes write to a central state database. This allows for hitless process restarts and unprecedented system stability. We decoupled the state from the logic, making the system virtually uncrashable.",
        visualIntent: 'A central core with radiant light pulses flowing out to surrounding nodes in a rhythmic, calm pattern.'
      },
      {
        heading: 'Open Programmability',
        caption: 'API-First architecture built on an unmodified Linux kernel.',
        teleprompter: "Arista isn't a black box. EOS is built on an open Linux kernel. This means you have a real shell, a real Python environment, and full access to NetDB via APIs. We don't just provide a CLI; we provide a programmable platform that integrates into your existing DevOps toolchain. We enable you to treat your network as a cloud, not a collection of boxes.",
        visualIntent: 'A layered architectural stack with glowing API entry points and code syntax highlights.'
      },
      {
        heading: 'The Automation Pivot',
        caption: 'AVD: Moving from Imperative CLI to Declarative Designs.',
        teleprompter: "The era of the 'human-as-a-middleware' is over. Arista Validated Designs (AVD) allow you to define your fabric in YAML. The system then generates the config, validates the state, and ensures compliance. We aren't just automating scripts; we are automating the entire lifecycle of the network fabric.",
        visualIntent: 'Digital lines of code transforming into a structured, crystalline 3D lattice.'
      },
      {
        heading: 'The AI Revolution',
        caption: 'Ethernet is the new backplane for the GPU cluster.',
        teleprompter: "AI workloads change everything. The GPU-to-GPU traffic is aggressive, massive, and unforgiving. Arista is the standard for AI backends. We provide the non-blocking, high-radix fabrics that InfiniBand used to own, but with the scale, openness, and familiarity of Ethernet. We are the backbone of the trillion-parameter model era.",
        visualIntent: 'High-speed data streams in magenta and violet converging on a massive neural-inspired processor core.'
      },
      {
        heading: 'Deep Buffer Resilience',
        caption: 'Shock absorbers for the incast micro-burst.',
        teleprompter: "In a world of sub-millisecond AI bursts, shallow buffers lead to packet loss and 'tail-latency' disasters. Arista 7280 and 7800 series provide ultra-deep buffers. We absorb the congestion that would otherwise crash an AI training job. It's the difference between a network that merely connects and a network that performs.",
        visualIntent: 'A translucent indigo rectangular prism acting as a fluid buffer for incoming high-pressure data streams.'
      },
      {
        heading: 'Zero Trust Security',
        caption: 'MSS: Micro-segmentation without the complexity.',
        teleprompter: "Security should be an architectural property, not an afterthought. Arista Multi-Domain Segmentation (MSS) allows you to apply security policies based on identity, not IP addresses. We isolate threats at the edge, ensuring that a breach in the campus never reaches the crown jewels in the data center.",
        visualIntent: 'A protective blue dome overlaying a pulsing grid, with red threat nodes being boxed out by white energy barriers.'
      },
      {
        heading: 'Cognitive Management',
        caption: 'CloudVision: The time-machine for your network.',
        teleprompter: "Management isn't about SNMP polling anymore. CloudVision records every state change across the fabric. We don't just show you what's happening now; we allow you to scroll back in time to root-cause an anomaly that happened at 2 AM on a Sunday. We provide absolute forensic clarity for every packet and every process.",
        visualIntent: 'A high-contrast grid of light extending into an infinite horizon, representing telemetry data points.'
      },
      {
        heading: 'Cloud-Grade Operations',
        caption: 'Consistency from the Edge to the Cloud.',
        teleprompter: "Your network shouldn't stop at the edge of the data center. Arista extends EOS to the campus, the WAN, and the public cloud. Whether you are in AWS, Azure, or your own rack, the operations are identical. We provide a single management plane for your entire digital estate.",
        visualIntent: 'Multiple concentric circles representing different domains merging into a single unified globe.'
      },
      {
        heading: 'Operational TCO',
        caption: 'Efficiency that scales with your business.',
        teleprompter: "Efficiency isn't just about power—it's about people. By reducing the complexity of the stack, we allow your team to move faster with fewer errors. Arista reduces OpEx by up to 40% compared to legacy architectures. We make the network an accelerator for the business, not a bottleneck.",
        visualIntent: 'A graph showing a sharp decline in complexity metrics while performance metrics climb exponentially.'
      },
      {
        heading: 'The Network Renaissance',
        caption: 'Building the foundation for the next century of computing.',
        teleprompter: "End on the vision. We aren't just selling boxes; we are building the substrate for AI, Cloud, and high-performance society. Our mission is architectural clarity and unshakeable reliability. That is the Arista Way. Thank you for joining the Renaissance.",
        visualIntent: 'An expanding geometric sunburst of blue and white light, filling the screen with energy.'
      }
    ]
  },
  'why-arista-2': {
    title: 'Why Arista 2.0',
    subtitle: 'The Inevitable Outcome of Modern Constraints',
    scenes: [
      {
        heading: 'The Real Constraint',
        caption: 'Complexity scales faster than human cognition.',
        teleprompter: "Modern networks do not fail because of insufficient bandwidth or broken hardware. They fail because the systems have become too complex for humans to reason about safely. As environments grow, the number of interactions grows non-linearly. Each change introduces state that cannot be fully observed, predicted, or validated manually. At scale, human intervention becomes the primary source of outages, not the solution. The bottleneck is no longer performance. The bottleneck is cognitive load.",
        visualIntent: 'A complex web of knots tightening around a central point, symbolizing cognitive overload.'
      },
      {
        heading: 'Why the Traditional Model Breaks',
        caption: 'Configuration is not a control plane.',
        teleprompter: "Most networks are still operated through static configuration and post-hoc verification. This assumes three things that are no longer true: that configuration reflects actual state, that operators can infer behavior from snapshots, and that errors are visible before impact. In reality: State drifts. Failures emerge from interactions, not individual commands. Problems are discovered after users notice them. When change velocity increases, this model collapses. You cannot reason about a dynamic system using static artifacts.",
        visualIntent: 'Blueprints crumbling into dust as a dynamic digital stream flows through them.'
      },
      {
        heading: 'The Missing Primitive',
        caption: 'Observability must be foundational, not an overlay.',
        teleprompter: "Observability is often treated as a dashboard problem. In reality, it is an architectural primitive. A network that cannot continuously describe its own state cannot be safely automated, upgraded, or secured. Without trustworthy, streaming state: Automation amplifies mistakes. Troubleshooting becomes forensic. Mean time to innocence increases. Mean time to resolution explodes. Visibility is not about seeing more data. It is about knowing which data is true.",
        visualIntent: 'A chaotic cloud of data points snapping into a crystal-clear, structured lattice.'
      },
      {
        heading: 'Why the OS Matters',
        caption: 'Operational consistency comes from a single behavioral model.',
        teleprompter: "At scale, the network operating system becomes the system of record for behavior. When platforms behave differently: Automation fragments. Upgrades become bespoke projects. Operational knowledge stops compounding. A single OS with consistent semantics allows: Predictable behavior under change. Uniform automation. Reusable operational patterns. This is not about features. It is about reducing variance in how the network behaves.",
        visualIntent: 'Fragmented geometric shapes merging into a single, unified, glowing sphere.'
      },
      {
        heading: 'Change Is the Real Workload',
        caption: 'Networks must be designed for constant change.',
        teleprompter: "Modern networks are upgraded continuously. Hardware refreshes, software updates, policy changes, segmentation changes. If upgrades require maintenance windows, heroics, or rollback fear, the architecture is already obsolete. Change safety is not a process problem. It is an architectural property. Networks must be built so that: Upgrades are routine. Rollback is safe. Failure domains are controlled. Change velocity does not increase risk.",
        visualIntent: 'A fluid, metallic structure morphing shape smoothly without breaking connections.'
      },
      {
        heading: 'Wireless Is the Stress Test',
        caption: 'Wireless exposes operational debt first.',
        teleprompter: "Wireless networks surface complexity faster than any other domain: Clients behave unpredictably. RF is probabilistic. Failures are intermittent. Symptoms rarely map cleanly to root cause. Most wireless incidents are not RF problems. They are visibility and reasoning problems. If your operational model cannot explain wireless behavior, it cannot scale anywhere else. Wireless is not a separate problem. It is the most honest one.",
        visualIntent: 'Invisible waveforms organizing themselves into a rigorous, readable data grid.'
      },
      {
        heading: 'The Inevitable Outcome',
        caption: 'Once these constraints are accepted, the architecture chooses itself.',
        teleprompter: "If you accept that: Human cognition is the limiting factor. Configuration is insufficient. Observability must be native. Consistency enables automation. Change is the dominant workload. Then the solution is no longer a vendor comparison. It is an architectural inevitability. Arista emerges not because of individual features, but because it aligns with these constraints: A single, consistent operating system. Streaming state as a first-class primitive. Automation built on real state, not assumptions. Wireless, campus, and datacenter treated as one operational system.",
        visualIntent: 'A horizon line where multiple paths converge into a single, illuminated road forward.'
      },
      {
        heading: 'Addressing the Skeptic',
        caption: 'Logic prevails over legacy.',
        teleprompter: "“Why not just improve processes?” Process cannot compensate for missing state. “Isn’t this just better tooling?” Tools observe. Architecture determines behavior. “What about lock-in?” Operational lock-in comes from inconsistency, not from standardization. “Why does wireless matter here?” Because it reveals the same failure modes earlier.",
        visualIntent: 'A heavy stone wall giving way to a clean, steel bridge.'
      },
      {
        heading: 'Synthesis',
        caption: 'The limiting factor stops being hardware and starts being confidence.',
        teleprompter: "At scale, outages are rarely caused by missing capabilities. They are caused by uncertainty during change. Networks that can stream trusted state, behave consistently, and isolate failure domains allow teams to move faster with less risk. As networks grow, the limiting factor stops being hardware and starts being confidence. Organizations that can see what is happening, understand why it is happening, and change safely move faster with fewer failures. Arista succeeds where these conditions matter most because its architecture was designed to make large systems understandable.",
        visualIntent: 'A perfect, sunrise-lit horizon with a clean, geometric line extending infinitely.'
      }
    ]
  },
  'wireless-diff': {
    title: 'Cognitive Campus Wireless',
    subtitle: 'Beyond Connectivity: The Quality-First Experience',
    scenes: [
      {
        heading: 'The Connectivity Illusion',
        caption: 'Traditional Wi-Fi focuses on UP/DOWN status, missing the user reality.',
        teleprompter: "Start here: Most campus Wi-Fi dashboards are 'Green' while users are suffering. This is the 'Connectivity Illusion.' We've been measuring the wrong thing for 20 years. In the modern campus, a 'connected' user with 1000ms latency is effectively 'down.' Arista Wireless shifts the conversation from signal strength to application performance.",
        visualIntent: 'A field of green dots where some dots are vibrating violently in red, representing hidden latency.'
      },
      {
        heading: 'The 6GHz Frontier',
        caption: 'Wi-Fi 6E and Wi-Fi 7 are the clean-slate opportunity.',
        teleprompter: "The 2.4GHz and 5GHz bands are congested cities. 6GHz is the open highway. Arista's latest APs leverage the full potential of 6GHz with Multi-Link Operation (MLO). We are providing wired-like reliability over the air, clearing the path for high-bandwidth video and zero-latency XR workloads.",
        visualIntent: 'Three distinct bands of light (Gold, Blue, Purple) with the Purple band (6GHz) being perfectly clear and fast.'
      },
      {
        heading: 'The Dedicated 3rd Radio',
        caption: 'WIPS and Auto-RF without sacrificing client service.',
        teleprompter: "Most vendors 'time-slice' their radios—stopping client traffic to scan for threats. Arista APs include a dedicated 3rd radio. It is a 24/7 guardian. It performs continuous WIPS, handles Auto-RF optimization, and captures packet traces without dropping a single user packet. It is the secret to our forensic depth.",
        visualIntent: 'A central hexagonal hub with three distinct scanning beams rotating independently.'
      },
      {
        heading: 'Cognitive Client Journey',
        caption: 'Visualization of every association handshake in real-time.',
        teleprompter: "When a user calls the helpdesk, you shouldn't ask 'What's wrong?' You should say 'I see exactly what happened.' Our Client Journey maps every step: Association, Authentication, DHCP, and DNS. If the user failed at the 3rd step, we show you the exact packet diff. We turn guessing into knowing.",
        visualIntent: 'A linear timeline of white dots where one dot turns orange and expands into a packet-header view.'
      },
      {
        heading: 'Application Awareness',
        caption: 'Visibility into Teams, Zoom, and latent SaaS bottlenecks.',
        teleprompter: "Wi-Fi is just the transport. Arista Wireless understands the apps. We identify over 2,000 applications. We can tell you if a Microsoft Teams call is stuttering because of the air, the switch, or the ISP. We provide the end-to-end visibility that eliminates the 'Wi-Fi is slow' finger-pointing.",
        visualIntent: 'Multiple application icons (Teams, Zoom, Salesforce) floating in a stream of prioritized blue light.'
      },
      {
        heading: 'Root Cause Synthesis',
        caption: 'AI that explains the "Why" in plain English.',
        teleprompter: "We don't just give you logs; we give you answers. Our Inference Engine analyzes the state of the air and the network. It synthesizes a plain-English explanation: 'User failed due to an expired certificate on the RADIUS server.' We empower junior admins to solve senior-level problems.",
        visualIntent: 'A brain-like network of cyan nodes converging into a clear, bright text block.'
      },
      {
        heading: 'WIPS: The Air Guardian',
        caption: 'Automated mitigation of rogue APs and Man-in-the-Middle attacks.',
        teleprompter: "Security in the air is often neglected. Our integrated WIPS can identify and neutralize rogue access points in seconds. We protect against honeypots and unauthorized bridges by using the 3rd radio to 'shield' the environment. It is the most robust wireless security in the industry.",
        visualIntent: 'A protective blue dome overlaying a mesh, with a red "rogue" node being boxed out by white energy barriers.'
      },
      {
        heading: 'Location Intelligence',
        caption: 'High-accuracy triangulation for assets and people.',
        teleprompter: "The network is a sensor. Arista Wireless provides high-fidelity location services. Whether it's tracking medical equipment in a hospital or analyzing foot traffic in a retail store, we provide the X/Y coordinates without requiring expensive overlay hardware.",
        visualIntent: 'A grid-like floor plan with small pulsing beacons and triangular scan lines calculating a center point.'
      },
      {
        heading: 'Unified Edge Operations',
        caption: 'One management plane for Wired and Wireless.',
        teleprompter: "The silo between the switch and the AP is dead. Under CloudVision, the Wired and Wireless networks are a single entity. You apply tags, you run change controls, and you view telemetry in one place. One team, one tool, one fabric. This is the definition of operational efficiency.",
        visualIntent: 'A switch icon and an AP icon merging into a single powerful core represented by a large blue shield.'
      },
      {
        heading: 'Automated RF Planning',
        caption: 'Cognitive RRM: The air that manages itself.',
        teleprompter: "Manual channel planning is a fool's errand. Our Cognitive Radio Resource Management (RRM) uses the 3rd radio to build a 'neighbor map.' It automatically adjusts power and channels to maximize throughput and minimize interference. It is like having a PhD-level RF engineer inside every AP.",
        visualIntent: 'A complex web of overlapping circles self-adjusting their sizes and colors into a harmonious pattern.'
      },
      {
        heading: 'Cloud vs On-Prem Freedom',
        caption: 'Same software, same experience, your choice of substrate.',
        teleprompter: "Arista doesn't force you into a subscription box. Our management is a software image. You can run it in the Arista Cloud, your own private cloud, or as an on-prem appliance. The feature set is identical. We provide the flexibility that the enterprise demands.",
        visualIntent: 'A set of scales perfectly balanced between a "Cloud" icon and a "Data Center" icon.'
      },
      {
        heading: 'The Wireless Renaissance',
        caption: 'Zero-Touch. Zero-Downtime. Zero-Frustration.',
        teleprompter: "Conclude with the vision. We are building the air for the next generation of work. Reliable, secure, and cognitive. Arista Wireless isn't just about radios; it's about the mission-critical experience. Welcome to the Wireless Renaissance.",
        visualIntent: 'A radiant sunburst of cyan and white light expanding from the center, signaling clarity and power.'
      }
    ]
  },
  'ai-fabrics': {
    title: 'The AI Data Center',
    subtitle: 'Architecting for the GPU Tsunami',
    scenes: [
      {
        heading: 'The Compute Shift',
        caption: 'AI workloads change the fundamental nature of traffic flows.',
        teleprompter: "Data Center traffic is no longer client-server. It is now all-to-all GPU communication. This creates 'incast' micro-bursts that can destroy performance on traditional shallow-buffer switches.",
        visualIntent: 'Dense, aggressive pulses of magenta light colliding in a high-speed tunnel.'
      },
      {
        heading: 'Deep Buffer Architecture',
        caption: 'The Shock Absorber for AI.',
        teleprompter: "Arista deep-buffer platforms shine here. With orders of magnitude more shared packet buffer than shallow-buffer alternatives, and Virtual Output Queuing, we absorb the bursts that would cause packet loss elsewhere. In AI, a single dropped packet can stall a training job for hours. We ensure that doesn't happen.",
        visualIntent: 'A large, translucent indigo rectangular prism acting as a buffer for incoming data streams.'
      },
      {
        heading: 'RoCE & RDMA Scaling',
        caption: 'Lossless Ethernet for extreme low latency.',
        teleprompter: "We enable high-performance AI via RoCE v2. By bypassing the CPU and moving data directly between GPU memories, we achieve InfiniBand-like performance with the openness and scale of Ethernet.",
        visualIntent: 'Parallel tracks of pure white light moving in perfect sync at extreme speed.'
      },
      {
        heading: 'Visible Telemetry',
        caption: 'LANZ: Seeing the micro-bursts in real-time.',
        teleprompter: "You can't manage what you can't see. Our LANZ telemetry gives you nanosecond-level visibility into buffer utilization. We show you exactly where the congestion is before it impacts your training completion time.",
        visualIntent: 'A dynamic oscilloscope-style wave graph glowing in indigo and cyan.'
      },
      {
        heading: 'Non-Blocking Scale',
        caption: 'The foundation for 100,000+ GPU clusters.',
        teleprompter: "Arista high-radix platforms let you build non-blocking CLOS fabrics that scale to tens of thousands of ports. We are the proven foundation for the world's largest AI clouds.",
        visualIntent: 'A massive, interlocking grid of light nodes expanding exponentially.'
      },
      {
        heading: 'DCQCN & ECN',
        caption: 'Flow control without head-of-line blocking.',
        teleprompter: "Lossless Ethernet for RoCEv2 requires congestion signals, not drops. Arista applies ECN marking early — at roughly 30% queue fill — so the GPU NIC throttles before the buffer fills. PFC is held in reserve as a last resort at 80%. The result is the DCQCN feedback loop: GPU-to-GPU flows self-regulate without congesting unrelated traffic. This is the difference between a fabric that performs and one that simply survives.",
        visualIntent: 'A queue-fill bar with two threshold lines and feedback arrows returning to source.'
      },
      {
        heading: 'The Rail Architecture',
        caption: 'Separate fabrics for compute and storage.',
        teleprompter: "The largest AI clusters split the network into independent rails. The compute rail carries gradient synchronization traffic — AllReduce, AllGather — between GPUs during training. The storage rail handles checkpoint I/O to distributed storage. By separating failure domains, a storage event cannot interrupt the training iteration, and vice versa. Arista builds both rails on the same OS with unified management.",
        visualIntent: 'Two parallel horizontal bands — one indigo for compute, one cyan for storage — with distinct traffic flows.'
      },
      {
        heading: 'Ethernet vs InfiniBand',
        caption: 'Why open Ethernet wins at scale.',
        teleprompter: "InfiniBand still dominates small-pod AI deployments, but at hyperscale the economics and ecosystem shift decisively. The Ultra Ethernet Consortium — led by Arista, AMD, Broadcom, Cisco, Intel, Meta, Microsoft, and others — is closing the latency gap at 100G and 400G. The cost of InfiniBand lock-in: single-vendor hardware, proprietary management, and a separate skills stack. Arista delivers ROCEv2 performance with standard Ethernet tooling, standard optics, and the existing operations team.",
        visualIntent: 'A balance scale: InfiniBand logo on one side, Ethernet open consortium logos on the other, tipping toward Ethernet.'
      },
      {
        heading: 'Job Completion Time',
        caption: 'The one metric that matters in AI.',
        teleprompter: "GPU clusters are measured in Job Completion Time — how long a training run takes from start to finish. A single dropped packet in an AllReduce collective can pause all 1,024 GPUs while the NIC retransmits. The latency tail compounds. The training throughput falls off a cliff. Arista lossless fabric eliminates that single-packet event. When every burst is absorbed and every flow completes without retransmit, JCT is predictable and optimal.",
        visualIntent: 'A job-completion timeline that fractures and restarts on a packet drop, vs a smooth unbroken line on Arista fabric.'
      },
      {
        heading: 'Scale to 100,000 GPUs',
        caption: 'The proof point.',
        teleprompter: "Arista CLOS fabrics are deployed in the world's largest AI training clusters. Three tiers: GPU servers connected to ToR leaf switches, leaf switches connected to spine, spine connected to super-spine — each hop non-blocking. At 100,000 GPUs the bisection bandwidth must remain full across every tier simultaneously. Arista has delivered this at hyperscale. We are the network that runs the trillion-parameter models.",
        visualIntent: 'A three-tier CLOS topology expanding outward to fill the frame — ToR, Spine, Super-Spine — all lit green.'
      }
    ]
  },
  'zero-trust': {
    title: 'Zero Trust Networking',
    subtitle: 'Security as a Fabric Property',
    scenes: [
      {
        heading: 'The Perimeter Fallacy',
        caption: 'The castle-and-moat model is obsolete.',
        teleprompter: "We start by dismantling the assumption that the edge is the only battleground. 80% of modern threats move laterally, East-West, inside the data center. A firewall at the perimeter is a Maginot Line—easily bypassed and useless once the adversary is inside. We need security that lives in every port, not just the front door.",
        visualIntent: 'A heavy fortress wall dissolving into dust, revealing a complex, vulnerable city inside.'
      },
      {
        heading: 'Macro-Segmentation (MSS)',
        caption: 'Isolating the blast radius.',
        teleprompter: "Arista MSS decouples security policy from physical topology. We create logical zones—User, App, Database—that exist across the entire fabric. If a web server is compromised, MSS ensures it cannot talk to the database, even if they are on the same switch. We shrink the attack surface from the entire network to a single workload.",
        visualIntent: 'A chaotic field of dots separating into distinct, color-coded clusters protected by invisible barriers.'
      },
      {
        heading: 'NDR: The All-Seeing Eye',
        caption: 'Network Detection and Response sees what logs miss.',
        teleprompter: "Signatures only catch known threats. Arista NDR (formerly Awake) analyzes the behavior of the entity. It knows that a printer shouldn't be running an SSH tunnel to an external IP at 3 AM. By analyzing the full packet, not just the flow data, we detect the 'unknown unknowns'—the zero-day exploits and insider threats.",
        visualIntent: 'A digital eye scanning a stream of code, highlighting a single red anomaly line.'
      },
      {
        heading: 'Encryption Everywhere',
        caption: 'MACsec at line-rate.',
        teleprompter: "Data in motion must be opaque. Arista switches support MACsec encryption on every port, from the leaf to the spine to the WAN. We render the physical wire useless to a wiretap. This isn't IPsec tunnels that crush CPU performance; this is silicon-speed encryption that is completely transparent to the application.",
        visualIntent: 'Data packets turning into solid metallic blocks as they traverse a line.'
      },
      {
        heading: 'The Secure Foundation',
        caption: 'Trust is built on visibility.',
        teleprompter: "Zero Trust isn't a product; it's a strategy. By combining Segmentation, NDR, and Encryption into the fabric itself, Arista turns the network into a sensor and an enforcer. We don't just move packets; we protect the business.",
        visualIntent: 'A massive, interlocking shield forming over a glowing digital landscape.'
      },
      {
        heading: 'Identity-Based Policy',
        caption: 'Policy follows the workload, not the port.',
        teleprompter: "IP addresses are a poor security primitive — they change, they get reused, they are easily spoofed. Arista MSS applies policy based on user identity and device security posture, not port numbers. Security group tags travel with the VM or container. The policy is enforced at the first-hop leaf switch the moment the workload connects. When the workload moves, the policy moves with it — no ACL rewrite, no change control, no lag.",
        visualIntent: 'A badge icon with a workload VM migrating between leaves, policy shield following it throughout.'
      },
      {
        heading: 'CloudEdge & SASE',
        caption: 'Zero trust extends to the branch.',
        teleprompter: "The perimeter died at the branch office years ago. Arista CloudEdge routers integrate with cloud-delivered security services — Prisma Access, Zscaler, and others — to steer branch traffic through a cloud-based policy engine. No backhauling to a central data center. No VPN bottleneck. The user gets the same identity-verified, encrypted, inspected experience whether they are in HQ, a branch, or a hotel room.",
        visualIntent: 'A branch office icon with traffic arrows flowing up to a cloud security engine before reaching SaaS destinations.'
      },
      {
        heading: 'Compliance Posture',
        caption: 'Continuous proof, not point-in-time audits.',
        teleprompter: "Security compliance is traditionally a snapshot exercise — a pen test once a year, a config audit once a quarter. Arista CloudVision generates a continuous compliance diff: the network's actual state versus the golden security policy. NDR health, MSS zone integrity, MACsec status — all tracked in real time. When the auditor arrives, you produce the report instantly. You don't scramble.",
        visualIntent: 'A compliance dashboard showing a golden-config checkmark and live drift indicators resolving to green.'
      }
    ]
  },
  'life-sciences-gxp': {
    title: 'GxP Compliance Strategy',
    subtitle: 'The Audit-Ready Infrastructure',
    scenes: [
      {
        heading: 'The Regulatory Burden',
        caption: '21 CFR Part 11 is not a suggestion. It is a survival requirement.',
        teleprompter: "Start with the stakes. In Life Sciences, data integrity is paramount. 21 CFR Part 11 requires that electronic records be trustworthy, reliable, and equivalent to paper records. A single 'Warning Letter' from the FDA regarding data integrity can shut down a production line or pause a clinical trial. The cost of non-compliance isn't just a fine; it's existential market delay.",
        visualIntent: 'A heavy, imposing stack of documents transforming into a digital lock.'
      },
      {
        heading: 'The Polling Blind Spot',
        caption: 'Legacy SNMP polling creates dangerous visibility gaps.',
        teleprompter: "Legacy monitoring relies on SNMP polling every 5 to 10 minutes. In high-speed manufacturing or sequencing, a route flap or buffer overflow can happen and resolve in milliseconds. If the poller isn't looking, it didn't happen. This creates a 'Data Integrity Gap.' You cannot prove to an auditor that the network was stable during a critical batch run if you were blind for 4 minutes and 59 seconds.",
        visualIntent: 'A timeline with gaps where red anomalies hide in the white space.'
      },
      {
        heading: 'State Streaming',
        caption: 'Continuous, unbroken truth from the kernel.',
        teleprompter: "Arista changes the physics of observability. We replace polling with State Streaming (TerminAttr). The moment a bit changes in the SysDB kernel—whether it's an interface counter, a routing entry, or a fan speed—it is streamed to CloudVision instantly. We capture 100% of state changes, 100% of the time. There are no blind spots. The network becomes a high-fidelity recorder of truth.",
        visualIntent: 'A continuous, glowing stream of data points flowing without interruption.'
      },
      {
        heading: 'Forensic Time-Travel',
        caption: 'Rewind the network to any second in history.',
        teleprompter: "Auditors don't ask 'What is happening now?' They ask 'What happened last Tuesday at 2:14 AM when the batch yield dropped?' CloudVision allows you to scroll back time like a DVR. You see the exact state of the routing table, the ACLs, and the buffer utilization at the precise moment of the anomaly. We provide absolute forensic clarity for past events.",
        visualIntent: 'A clock rewinding rapidly, with network nodes shifting colors in reverse.'
      },
      {
        heading: 'Identity & Attribution',
        caption: 'Cryptographic chain of custody for every change.',
        teleprompter: "Compliance requires attribution. Who changed the config? When? Why? We don't just log the command; we link the specific user identity to the specific state change via AAA. We provide a cryptographic chain of custody for every action. 'Admin' didn't change the VLAN; 'John Smith' did, at 14:02:33, via this specific terminal. This satisfies the strict attribution requirements of GxP.",
        visualIntent: 'A user profile connected by a secure chain to a configuration block.'
      },
      {
        heading: 'Segmentation as Control',
        caption: 'Reducing the blast radius and the audit scope.',
        teleprompter: "Not every port needs to be GxP validated. By using EVPN-VXLAN and MSS (Macro-Segmentation Service), we logically isolate the Manufacturing and Lab zones from the Guest and Office networks. This segmentation is enforced in hardware. It prevents lateral movement of threats and, crucially, allows you to limit the scope of your validation efforts to just the critical zones, saving massive amounts of OpEx.",
        visualIntent: 'A network map separating into distinct, isolated color-coded zones.'
      },
      {
        heading: 'Encryption in Flight',
        caption: 'Protecting intellectual property on the wire.',
        teleprompter: "The formula for your drug or the genomic data of your patient is your most valuable asset. It cannot travel in cleartext. Arista supports MACsec encryption on every port, from the leaf to the spine. We encrypt data at line-rate without performance penalties. This ensures that even if a physical tap is placed on the fiber, the data remains opaque and secure.",
        visualIntent: 'Data packets turning into solid metallic locks as they traverse a line.'
      },
      {
        heading: 'Automated IQ/OQ',
        caption: 'Turning validation documents into executable code.',
        teleprompter: "Installation Qualification (IQ) and Operational Qualification (OQ) used to be manual binders filled with screenshots. With Arista Validated Designs (AVD), your architecture is defined as code. We can automatically generate the 'As-Built' documentation and run automated tests to verify that the operational state matches the design intent. We turn a 3-week paper exercise into a 3-minute script.",
        visualIntent: 'A code snippet transforming into a stamped official document.'
      },
      {
        heading: 'The Validation Artifact',
        caption: 'Push-button evidence for regulatory audits.',
        teleprompter: "When the auditor arrives, you don't scramble. You go to CloudVision and generate the Compliance Report. It proves that for the duration of the clinical trial, the network configuration matched the Golden Config, no unauthorized changes occurred, and segmentation was intact. We give you the artifact that ends the audit quickly.",
        visualIntent: 'A verified document stamp appearing over a complex network map.'
      },
      {
        heading: 'The Audit Defense',
        caption: 'Confidence in the face of scrutiny.',
        teleprompter: "In conclusion, Arista doesn't just move packets; we protect the integrity of your data. We provide the visibility, the security, and the automated evidence you need to operate a GxP environment with absolute confidence. We turn the infrastructure from a compliance risk into your strongest witness for the defense.",
        visualIntent: 'A shield protecting a glowing core data asset.'
      }
    ]
  },
  'cloudvision-netops': {
    title: 'CloudVision & NetOps',
    subtitle: 'The Network Operating System for the Modern Era',
    scenes: [
      {
        heading: 'The Management Gap',
        caption: 'SNMP polling cannot see microsecond events.',
        teleprompter: "Traditional network management was designed for a slower era. SNMP polls every five minutes — or ten. In that window, a route flap can occur and recover. A buffer overflow can spike and drain. A BGP session can bounce. None of it appears in your dashboard. You are managing a high-speed system with a low-speed sensor. That gap is where outages hide and auditors find failures.",
        visualIntent: 'A timeline of poll ticks with a red anomaly spike hidden between them — invisible to the poller.'
      },
      {
        heading: 'State Streaming',
        caption: 'TerminAttr: every SysDB change, instantly.',
        teleprompter: "Arista EOS is built on SysDB — a central state database that all processes read and write. TerminAttr is the always-on telemetry agent that watches SysDB and streams every change to CloudVision the moment it occurs. Interface counters, routing table updates, process restarts, hardware telemetry — all streamed at sub-second granularity over gNMI. The network describes itself continuously. You don't poll for truth; truth arrives.",
        visualIntent: 'A SysDB hub with continuous streaming arrows flowing to a CloudVision cloud node — no gaps, no polling gaps.'
      },
      {
        heading: 'The Time Machine',
        caption: 'Scroll back to any second in network history.',
        teleprompter: "When an issue occurs at 2 AM on a Sunday and the ticket is filed Monday morning, the question is always: what was the state of the network at the exact moment of failure? CloudVision stores every streamed state change. You can rewind to 02:14:33 and see the routing table, the ACLs, the buffer occupancy, and the BGP session state at that precise instant. No inference, no guessing — exact state replay. This is forensic clarity.",
        visualIntent: 'A clock rewinding with a timeline scrubber showing exact network state at the selected moment.'
      },
      {
        heading: 'Change Control',
        caption: 'Peer review, snapshot, and rollback for every config push.',
        teleprompter: "Every network change is a risk event. CloudVision change control enforces a workflow: propose the change, snapshot the before-state, get peer approval, execute, compare the after-state against intent. If the diff is wrong, roll back in one click. This isn't just a safety net — it is an audit trail. Every change has an author, a reviewer, a timestamp, and a cryptographic record. Network operations becomes as disciplined as software development.",
        visualIntent: 'A before-config block and after-config block with a peer-approval badge and a diff comparison between them.'
      },
      {
        heading: 'Zero-Touch Provisioning',
        caption: 'Cable it in. Walk away.',
        teleprompter: "Deploying a new switch used to require a pre-staged laptop, a console cable, and a seasoned engineer on-site. With Arista ZTP, the switch boots, contacts the ZTP server, downloads its EOS image and startup config, and is fully operational — all without human intervention. Scale this to a 48-switch data center build-out and the math is compelling: days of configuration work becomes a few hours of racking and cabling.",
        visualIntent: 'A three-step horizontal flow: cable plug → boot spinner → CONFIGURED green badge.'
      },
      {
        heading: 'Network as Code',
        caption: 'AVD: YAML declares intent. EOS reflects truth.',
        teleprompter: "Arista Validated Designs (AVD) turns network design into code. You define your fabric in structured YAML: device roles, BGP ASNs, VLAN allocations, VXLAN VNIs, and security policies. AVD generates the complete EOS configuration for every device, validates it against design rules, and deploys it with full rollback capability. The YAML becomes the source of truth. The running config is the artefact. Change the YAML, redeploy, done.",
        visualIntent: 'A YAML code block with an animated arrow flowing into a validated EOS configuration block.'
      },
      {
        heading: 'Studio: Intent-Based',
        caption: 'Draw the topology. Generate the configs.',
        teleprompter: "CloudVision Studio takes network-as-code further. Engineers describe intent through structured inputs — topology builder, IP address management, tag-based assignment — without writing raw YAML. Studio validates the intent against the platform capabilities and generates the configs. It bridges the gap between network design and network automation, making AVD accessible to engineers who have never touched Python or Jinja2.",
        visualIntent: 'A topology drag-and-drop canvas with a new link being drawn between two nodes, configs auto-generating on the right.'
      },
      {
        heading: 'Compliance Enforcement',
        caption: 'Golden-config drift detection and auto-remediation.',
        teleprompter: "Once the design is in AVD, CloudVision enforces it continuously. If a manual CLI change drifts a device away from the golden config, CloudVision flags the deviation and optionally remediates it automatically. Security-relevant drift — ACL changes, VLAN additions, interface policy modifications — triggers alerts immediately. Compliance is no longer a quarterly audit exercise; it is a real-time property of the network.",
        visualIntent: 'A golden-config checkmark on the left, a drifted config X on the right, with a remediation arrow returning to compliance.'
      },
      {
        heading: 'Multi-Site Visibility',
        caption: 'Single pane of glass across 100+ sites.',
        teleprompter: "Enterprise networks span data centers, campus buildings, branch offices, and cloud regions. CloudVision aggregates telemetry from all of them into one operational view. Device health, change history, compliance posture, and software currency — all visible across the entire estate simultaneously. When an issue surfaces in the Singapore branch, the NOC in New York sees it in the same dashboard, with the same forensic depth.",
        visualIntent: 'Three geographically distinct site nodes connected to a central CloudVision globe — all green and streaming.'
      },
      {
        heading: 'The Operating Model',
        caption: "From 'per-device CLI' to 'fabric as a system'.",
        teleprompter: "This is the shift that matters most. Legacy operations: log in to a device, type commands, hope for the best, document manually afterward. CloudVision operations: define intent, execute with full auditability, validate automatically, detect drift immediately. The team stops being the middleware between design and running state. The platform is. This reduces MTTR, reduces error rate, and — critically — allows a smaller team to manage a larger network with higher confidence.",
        visualIntent: 'Many individual CLI boxes on the left condensing into a single unified Fabric OS block on the right.'
      }
    ]
  },
  'ip-fabric': {
    title: 'BGP/EVPN IP Fabric',
    subtitle: 'The Modern Data Center Network Architecture',
    scenes: [
      {
        heading: 'STP: The Root Problem',
        caption: 'Spanning tree blocks half your bandwidth by design.',
        teleprompter: "Spanning Tree Protocol was designed in 1985 for networks with tens of ports. It works by blocking redundant links to prevent loops. In a data center with hundreds of servers and sub-millisecond failover requirements, STP is structurally wrong. Active-standby uplinks waste 50% of capacity. STP reconvergence takes seconds — an eternity for storage replication and clustering workloads. The protocol that kept your 1990s campus alive is killing your modern data center.",
        visualIntent: 'A topology diagram with half the links shown in amber with X marks — blocked by STP — while only a spanning tree of paths is active.'
      },
      {
        heading: 'The Leaf-Spine Topology',
        caption: 'Equal-cost multipath to every port in the fabric.',
        teleprompter: "The leaf-spine topology eliminates the STP problem by design. Every leaf connects to every spine. There are no blocked links — all paths are active simultaneously. Any server can reach any other server in exactly two hops. Traffic is load-balanced across all available paths via ECMP. When a spine fails, traffic instantly redistributes across the remaining spines with no reconvergence event. The architecture makes reliability a structural property, not a recovery procedure.",
        visualIntent: 'A clean SVG leaf-spine diagram: 2 spines connected to 4 leaves, all links green and active, ECMP label visible.'
      },
      {
        heading: 'eBGP Underlay',
        caption: 'RFC 5549 unnumbered: BGP without the IP assignment overhead.',
        teleprompter: "The leaf-spine fabric runs BGP as its underlay routing protocol. Arista recommends RFC 5549 unnumbered eBGP — interfaces are addressed with link-local IPv6 addresses, eliminating the need to assign and manage point-to-point IPv4 subnets across every fabric link. Each leaf gets a unique ASN. The spines share an ASN. BGP naturally prevents routing loops and provides per-prefix load balancing via ECMP. The underlay is operationally simple and proven at massive scale.",
        visualIntent: 'A leaf and spine connected by a link labeled "RFC 5549 unnumbered" — no IP addresses on the link, just BGP session arrows.'
      },
      {
        heading: 'EVPN: The Control Plane',
        caption: 'BGP carries MAC/IP instead of flooding.',
        teleprompter: "Before EVPN, VXLAN fabrics flooded BUM traffic — Broadcast, Unknown Unicast, and Multicast — across every VTEP in the fabric. This does not scale. EVPN replaces flooding with a BGP control plane. VTEPs advertise the MAC and IP addresses of locally connected hosts as BGP EVPN routes. Remote VTEPs learn host reachability from the control plane, not from data-plane flooding. The fabric becomes as scalable as BGP itself.",
        visualIntent: 'A BGP control-plane hub replacing a flood cloud — RT-2 and RT-5 route-type pills flowing outward to VTEPs.'
      },
      {
        heading: 'Route Type 2: MAC/IP',
        caption: 'End-host reachability without flooding.',
        teleprompter: "EVPN Route Type 2 is the MAC/IP advertisement route. When a server connects to a leaf, the leaf generates a Type 2 BGP update containing the server's MAC address, its IP address, and the VNI of the VXLAN segment. All remote VTEPs receive this update and install the MAC/IP binding locally. The result: any VTEP in the fabric can forward directly to any host without an ARP flood, without unknown unicast flooding, and without any data-plane learning.",
        visualIntent: 'A BGP update packet containing a MAC address and IP address, being received and installed in remote VTEP MAC tables.'
      },
      {
        heading: 'Route Type 5: IP Prefix',
        caption: 'Inter-VRF routing at the leaf.',
        teleprompter: "EVPN Route Type 5 carries IP prefixes — enabling inter-VRF routing within the fabric without a centralized router. Each tenant VRF gets a unique L3 VNI. When traffic needs to cross from the Application VRF to the Database VRF, the leaf performs symmetric IRB: it de-encapsulates the VXLAN frame, routes the packet in the destination VRF, and re-encapsulates. The routing happens at line rate in the ASIC, distributed across every leaf in the fabric.",
        visualIntent: 'A VRF routing table with an IP prefix entry pointing to a VXLAN tunnel — symmetric IRB arrows at the leaf.'
      },
      {
        heading: 'Anycast Gateway',
        caption: 'Every leaf shares the same gateway IP.',
        teleprompter: "In a traditional data center, the default gateway for a VLAN lives on a specific switch. If that switch fails or the server moves to a different rack, the default gateway moves too — causing disruption. Arista VARP (Virtual ARP) implements an Anycast Gateway: every leaf switch in the fabric responds to ARP requests for the same gateway IP and MAC address. Servers see a single, stable gateway regardless of which leaf they connect to. Host mobility is instantaneous.",
        visualIntent: 'Three leaf nodes all showing the same gateway IP and MAC — a VARP ring indicating anycast operation.'
      },
      {
        heading: 'MLAG: Server Dual-Homing',
        caption: 'Active-active LAG to two leaves simultaneously.',
        teleprompter: "Servers need link redundancy without sacrificing bandwidth. Arista MLAG allows a server to form a single Link Aggregation Group across two different leaf switches. Both links are active simultaneously. If one leaf fails, the server continues forwarding on the surviving link with no application disruption. MLAG runs over a dedicated peer-link between the two leaves and a keepalive path for split-brain detection. It is the standard dual-homing mechanism for servers in Arista leaf-spine fabrics.",
        visualIntent: 'A server with two uplinks to an MLAG leaf pair — both links active, peer-link ISL visible between the leaves.'
      },
      {
        heading: 'DCI: Stretch the Fabric',
        caption: 'VXLAN tunnel between sites via border leaf.',
        teleprompter: "Data Center Interconnect extends the IP fabric across sites. Border leaf switches sit at the edge of each fabric and establish VXLAN tunnels to their counterparts at the remote site. EVPN route targets control which VNIs are extended across the DCI link. Workloads can migrate between sites without changing their IP addresses. The same BGP EVPN control plane that manages intra-site reachability manages inter-site reachability — no additional protocols required.",
        visualIntent: 'A border leaf on each side connected by a VXLAN tunnel arc spanning two sites — route-target labels controlling what crosses.'
      },
      {
        heading: 'One Fabric, One OS',
        caption: 'EVPN for campus, data center, and cloud edge.',
        teleprompter: "The BGP/EVPN architecture is not limited to the data center. Arista runs the same leaf-spine IP fabric model in campus buildings, at cloud on-ramp locations, and at the WAN edge. The same EOS, the same EVPN control plane, the same CloudVision management. When your campus, your data center, and your cloud connectivity all speak the same protocol with the same operational model, the network stops being a collection of silos and becomes a single cohesive fabric.",
        visualIntent: 'A campus switch, a DC leaf, and a cloud PE node — all labeled with the same EOS version, connected to a single CloudVision icon.'
      }
    ]
  }
};
