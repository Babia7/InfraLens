
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
        heading: 'Deep Buffer Resilience',
        caption: '7280R3: The Shock Absorber for AI.',
        teleprompter: "This is where the 7280R3 series shines. With deep buffers and Virtual Output Queuing, we absorb the bursts that would cause packet loss elsewhere. In AI, a single dropped packet can stall a training job for hours. We ensure that doesn't happen.",
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
        teleprompter: "The Arista 7800 and 7280 series allow you to build non-blocking CLOS fabrics that scale to tens of thousands of ports. We are the proven foundation for the world's largest AI clouds.",
        visualIntent: 'A massive, interlocking grid of light nodes expanding exponentially.'
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
  }
};
