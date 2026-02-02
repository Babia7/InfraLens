
import { AppItem, BookItem, ConceptExplainer, RoadmapItem, GlobalConfig, SEPerformanceStep, SectionType, Suggestion } from '../types';
import { visualEssays } from './visualEssays';

export const initialApps: AppItem[] = [
  // --- REASONING (Constraint Mapping & Strategy) ---
  {
    id: 'app-tco-modeler',
    name: 'TCO ROI Calculator',
    description: 'Comparative financial analysis tool for SEs. Model the power and operational savings of Arista vs legacy monolithic vendors.',
    category: 'Reasoning',
    subCategory: 'Financial Logic',
    tags: ['Finance', 'Efficiency', 'TCO'],
    internalRoute: SectionType.TCO_CALCULATOR,
    color: 'from-emerald-600 to-teal-800',
    featured: true
  },
  {
    id: 'app-op-velocity',
    name: 'Operational Velocity Modeler',
    description: 'Calculate ROI based on man-hours saved using AVD automation and CloudVision snapshots vs. manual CLI interactions.',
    category: 'Reasoning',
    subCategory: 'Financial Logic',
    tags: ['Automation', 'ROI', 'Efficiency'],
    internalRoute: SectionType.OPERATIONAL_VELOCITY_MODELER,
    color: 'from-blue-500 to-indigo-700',
    featured: true
  },
  {
    id: 'app-mttr-downtime',
    name: 'MTTR Downtime Insurance',
    description: 'Contrast the financial risk of legacy monolithic software crashes vs. the Arista SysDB state-based reliability model.',
    category: 'Reasoning',
    subCategory: 'Financial Logic',
    tags: ['Reliability', 'Risk', 'MTTR'],
    internalRoute: SectionType.MTTR_DOWNTIME_INSURANCE,
    color: 'from-rose-600 to-red-800',
    featured: true
  },
  {
    id: 'app-unified-os-roi',
    name: 'Unified EOS Talent ROI',
    description: 'Model the reduction in OpEx training costs by using one binary (EOS) across Campus, WAN, Data Center, and Multi-Cloud.',
    category: 'Reasoning',
    subCategory: 'Financial Logic',
    tags: ['Operations', 'Skills', 'Unified'],
    internalRoute: SectionType.UNIFIED_OS_TALENT_ROI,
    color: 'from-amber-600 to-orange-800',
    featured: true
  },
  {
    id: 'app-why-now-engine',
    name: 'Why Now Engine',
    description: 'Quantify the cost of inaction across maintenance, operational drag, and risk. Export into Sales Coach, Narrative, or MTTR proof sets.',
    category: 'Sales',
    subCategory: 'Financial Logic',
    tags: ['Sales', 'Finance', 'Risk'],
    internalRoute: SectionType.WHY_NOW_ENGINE,
    color: 'from-emerald-500 to-blue-700',
    featured: true
  },
  {
    id: 'app-vertical-matrix',
    name: 'Life Sciences Stratum',
    description: 'GxP compliance, genomic sequencing bursts, and cryogenic storage fabrics. The architectural standard for Bio-Pharma.',
    category: 'Reasoning',
    subCategory: 'Vertical Strategy',
    tags: ['Verticals', 'Bio-Pharma', 'Genomics'],
    internalRoute: SectionType.VERTICAL_MATRIX,
    color: 'from-emerald-500 to-teal-700',
    featured: true
  },
  {
    id: 'app-ai-fabric-designer',
    name: 'AI Cluster Designer',
    description: 'Strategic architect for high-radix GPU fabrics. Optimize for non-blocking rail-alignment (H100/B200).',
    category: 'Reasoning',
    subCategory: 'Datacenter Design',
    tags: ['AI/ML', 'GPU', 'Non-Blocking', '800G'],
    internalRoute: SectionType.AI_FABRIC_DESIGNER,
    color: 'from-violet-600 to-indigo-900',
    featured: true,
    adminOnly: true
  },
  {
    id: 'app-storage-architect',
    name: 'Storage Fabric Planner',
    description: 'Optimal design for IP Storage (RoCE v2 / NVMe). Automated config generation for PFC and ECN loss-less profiles.',
    category: 'Reasoning',
    subCategory: 'Datacenter Design',
    tags: ['Storage', 'RoCE', 'Lossless', 'ECN'],
    internalRoute: SectionType.STORAGE_FABRIC_PLANNER,
    color: 'from-blue-700 to-cyan-900',
    featured: true,
    adminOnly: true
  },
  {
    id: 'app-7280-selector',
    name: '7280R3 Model Selector',
    description: 'The definitive platform selection engine. Filter Arista R3 series by throughput, routing scale, and specific deep-buffer requirements.',
    category: 'Reasoning',
    subCategory: 'Hardware Spec',
    tags: ['Hardware', 'R-Series', 'Spec'],
    internalRoute: undefined,
    color: 'from-cyan-600 to-blue-800',
    featured: false,
    hidden: true,
    adminOnly: true
  },
  {
    id: 'app-7050-selector',
    name: '7050X3/X4 Selector',
    description: 'Select the optimal Universal Leaf platform. Filter by Trident generation, interface density, and 400G readiness.',
    category: 'Reasoning',
    subCategory: 'Hardware Spec',
    tags: ['Hardware', 'X-Series', 'Trident'],
    internalRoute: undefined,
    color: 'from-blue-600 to-indigo-800',
    featured: false,
    hidden: true,
    adminOnly: true
  },
  
  // --- PRACTICE (Applied Skills & Drills) ---
  {
    id: 'app-linux-lab',
    name: 'Linux for EOS',
    description: 'Reference + guided drills: bash, filesystem, netns, eAPI, hardening.',
    category: 'Practice',
    subCategory: 'Technical Drills',
    tags: ['Linux', 'Bash', 'ACT', 'EOS'],
    internalRoute: SectionType.LINUX_LAB,
    color: 'from-emerald-500 to-teal-700',
    featured: true
  },
  {
    id: 'app-cloudvision-field-guide',
    name: 'CloudVision Field Guide',
    description: 'Day 0/1/2 guided runbooks for CloudVision provisioning, changes, and validation.',
    category: 'Practice',
    subCategory: 'Enablement',
    tags: ['CloudVision', 'Runbooks', 'Day 0/1/2'],
    internalRoute: SectionType.CLOUDVISION_ENABLEMENT,
    color: 'from-blue-600 to-indigo-900',
    featured: true
  },
  {
    id: 'app-avd-studio',
    name: 'AVD Fabric Studio',
    description: 'Ansible Validated Designs workbench. Generate complete leaf-spine fabric configurations from simple inventory definitions.',
    category: 'Practice',
    subCategory: 'Automation Drills',
    tags: ['Ansible', 'Automation', 'L3LS'],
    internalRoute: SectionType.AVD_STUDIO,
    color: 'from-blue-600 to-indigo-900',
    featured: true,
    adminOnly: true
  },
  {
    id: 'app-se-performance',
    name: 'SE Performance Guide',
    description: 'Protocols for physiological and cognitive performance to keep field execution sharp.',
    category: 'Practice',
    subCategory: 'Field Excellence',
    tags: ['Performance', 'Protocols', 'Field'],
    internalRoute: SectionType.SE_PERFORMANCE,
    color: 'from-emerald-600 to-lime-700',
    featured: false
  },
  
  // --- REFERENCE (Codex & Knowledge) ---
  {
    id: 'app-release-notes',
    name: 'Release Note Deconstructor',
    description: 'Deconstruct raw EOS Release Note PDFs into strategic value talk tracks. Identify the top 3 impactful features for specific verticals.',
    category: 'Reference',
    subCategory: 'Intelligence',
    tags: ['Firmware', 'Strategy', 'Analysis'],
    internalRoute: SectionType.RELEASE_NOTES_DECONSTRUCTOR,
    color: 'from-sky-600 to-blue-800',
    featured: true,
    adminOnly: true
  },
  {
    id: 'app-nexus-graph',
    name: 'The Nexus (Graph)',
    description: 'Visual knowledge graph mapping the interdependencies between EOS features, design patterns, and hardware capabilities.',
    category: 'Reference',
    subCategory: 'Architecture',
    tags: ['Graph', 'Visualization', 'Nexus'],
    internalRoute: SectionType.KNOWLEDGE_GRAPH,
    color: 'from-indigo-500 to-purple-700'
  },
  {
    id: 'app-architecture-codex',
    name: 'Architecture Codex',
    description: 'Verified design guides and architectural deep dives for repeatable field decisions.',
    category: 'Reference',
    subCategory: 'Architecture',
    tags: ['Codex', 'Design', 'Guides'],
    internalRoute: SectionType.BOOKS,
    color: 'from-orange-500 to-amber-700',
    featured: true
  },
  {
    id: 'app-cloudvision',
    name: 'CloudVision Portal',
    description: 'The cognitive management plane. Direct interface for telemetry, change management, and real-time fabric state.',
    category: 'Reference',
    subCategory: 'Management',
    tags: ['CVX', 'Telemetry', 'Operations'],
    link: 'https://cloudvision.arista.com',
    color: 'from-blue-400 to-blue-700',
    featured: true,
    adminOnly: true
  },
  {
    id: 'app-gap-analysis',
    name: 'Architectural Gap Analysis',
    description: 'Deconstruct the architectural gap between legacy messaging-based OSs and Arista state-streaming. Simulate failure modes.',
    category: 'Reference',
    subCategory: 'Competitive',
    tags: ['Legacy', 'Gap', 'Analysis'],
    internalRoute: SectionType.ARCHITECTURAL_GAP_ANALYSIS,
    color: 'from-rose-600 to-pink-800',
    featured: true
  },

  // --- DELIVERY (Storytelling & Enablement) ---
  {
    id: 'app-briefing-theater',
    name: 'Briefing Theater',
    description: 'Teleprompter-grade storytelling engine with visuals for high-stakes executive briefings.',
    category: 'Delivery',
    subCategory: 'Narrative',
    tags: ['Briefing', 'Narrative', 'Teleprompter'],
    internalRoute: SectionType.BRIEFING_THEATER,
    color: 'from-purple-600 to-indigo-900',
    featured: true
  },
  {
    id: 'app-demo-command',
    name: 'Demo Enablement',
    description: 'Scripted demo narratives with CTA cues and configuration examples for live walkthroughs.',
    category: 'Delivery',
    subCategory: 'Enablement',
    tags: ['Demo', 'Narrative', 'Enablement'],
    internalRoute: SectionType.DEMO_COMMAND,
    color: 'from-purple-500 to-indigo-800',
    featured: true
  },
  {
    id: 'app-narrative-playbook',
    name: 'Narrative Playbook Studio',
    description: 'Craft and version demo/briefing scripts with branching paths (audience, vertical, objection) and export to teleprompter.',
    category: 'Delivery',
    subCategory: 'Storytelling',
    tags: ['Narrative', 'Branching', 'Teleprompter'],
    internalRoute: SectionType.NARRATIVE_PLAYBOOK,
    color: 'from-blue-600 to-emerald-700',
    featured: true
  },
  {
    id: 'app-protocol-collision',
    name: 'Protocol Collision Mapper',
    description: 'Visualize control-plane conflicts and catch OSPF/BGP redistribution loops before they melt the network.',
    category: 'Reasoning',
    subCategory: 'Core',
    tags: ['Routing', 'Redistribution', 'Policy'],
    internalRoute: SectionType.PROTOCOL_COLLISION_MAPPER,
    color: 'from-sky-600 to-indigo-800',
    featured: false,
    adminOnly: true
  },
  {
    id: 'app-validated-designs',
    name: 'Validated Design Navigator',
    description: 'Browse Arista Validated Designs with topology, BOM, caveats, and cutover runbooks for AVD or CloudVision-driven workflows.',
    category: 'Reference',
    subCategory: 'Validated Designs',
    tags: ['Design', 'AVD', 'Runbooks'],
    internalRoute: SectionType.VALIDATED_DESIGN_NAVIGATOR,
    color: 'from-emerald-500 to-blue-700',
    featured: true
  },
  {
    id: 'app-sales-playbook',
    name: 'Sales Playbook Coach',
    description: 'Vertical-ready talk tracks with discovery, objections, proof points, and CTAs for Arista account teams.',
    category: 'Sales',
    subCategory: 'Sales Enablement',
    tags: ['Sales', 'Playbook', 'Objections'],
    internalRoute: SectionType.SALES_PLAYBOOK_COACH,
    color: 'from-indigo-500 to-emerald-600',
    featured: true
  },
  {
    id: 'app-lifesciences-architect',
    name: 'BioNet Architect',
    description: 'Decidable network architecture for Life Sciences: optics, buffers, and breakout guidance with defensible rationale.',
    category: 'Reasoning',
    subCategory: 'Life Sciences',
    tags: ['Life Sciences', 'Optics', 'Buffers'],
    internalRoute: undefined,
    color: 'from-emerald-500 to-blue-700',
    featured: false,
    hidden: true,
    adminOnly: true
  },
  {
    id: 'app-transceiver-economics',
    name: 'Optics & Power Optimizer',
    description: 'Model optics and cabling choices for a fabric—power draw, reach, and cost tradeoffs across QSFP-DD/OSFP/SR/LR.',
    category: 'Reasoning',
    subCategory: 'Hardware Spec',
    tags: ['Optics', 'Power', 'Cost'],
    featured: false,
    adminOnly: true
  },
  {
    id: 'app-campus-ai-ops',
    name: 'Cognitive Campus Ops',
    description: 'Campus observability bundle: client health, RF, wired anomalies, and recommended actions packaged for partners and customers.',
    category: 'Practice',
    subCategory: 'Operations',
    tags: ['Campus', 'Observability', 'AI Ops'],
    featured: false,
    hidden: true,
    adminOnly: true
  },
  {
    id: 'app-service-creation',
    name: 'Service Creation Studio',
    description: 'Blueprint repeatable services (DCI, segmentation, multicast) with inputs/outputs, validation rules, and one-click generation.',
    category: 'Delivery',
    subCategory: 'Enablement',
    tags: ['Services', 'Blueprints', 'Automation'],
    featured: false,
    adminOnly: true
  },
  {
    id: 'app-power-thermal',
    name: 'Power & Thermal Planner',
    description: 'Model rack power, airflow, and thermal envelopes for Arista platforms; highlight overdraw/derating risks before install.',
    category: 'Reasoning',
    subCategory: 'Hardware Spec',
    tags: ['Power', 'Thermal', 'Hardware'],
    featured: false,
    adminOnly: true
  },
  {
    id: 'app-ai-readiness',
    name: 'AI Fabric Readiness Checker',
    description: 'Assess fabrics for AI workloads: latency budget, non-blocking topology, buffer depth, optics mix, and cabling constraints.',
    category: 'Reasoning',
    subCategory: 'Datacenter Design',
    tags: ['AI/ML', 'Topology', 'Buffers'],
    featured: false,
    adminOnly: true
  },
  {
    id: 'app-runbook-builder',
    name: 'Operational Runbook Builder',
    description: 'Compose step-by-step SE/customer runbooks with commands, expected output, and rollback steps; export to PDF/Markdown.',
    category: 'Delivery',
    subCategory: 'Enablement',
    tags: ['Runbooks', 'Operations', 'Docs'],
    featured: false,
    adminOnly: true
  }
];

export const initialSuggestions: Suggestion[] = [
  {
    id: 'sug-wireshark',
    name: 'Wireshark Arista Profile',
    description: 'Custom Wireshark profiles optimized for DANZ Monitoring and Post-Tap analysis.',
    subCategory: 'Troubleshooting',
    tags: ['Packets', 'DANZ', 'Analyze'],
    color: 'from-blue-900 to-zinc-900',
    reason: 'Essential for SEs performing deep-buffer packet analysis.'
  },
  {
    id: 'sug-ai-capacity',
    name: 'AI Capacity Forecaster',
    description: 'Model GPU pod expansion: rail alignment, optics mix, power/thermal headroom, and RMA spares.',
    subCategory: 'Datacenter Design',
    tags: ['AI/ML', 'Capacity', 'Power'],
    color: 'from-violet-700 to-blue-700',
    reason: 'Helps plan AI pod growth with hardware-aware constraints.'
  },
  {
    id: 'sug-macsec-planner',
    name: 'MACsec Deployment Planner',
    description: 'Check hardware/optic support, key rotation, and performance impact before turning on MACsec at scale.',
    subCategory: 'Security',
    tags: ['MACsec', 'Security', 'Compliance'],
    color: 'from-slate-800 to-emerald-800',
    reason: 'Reduces surprises when enabling MACsec on mixed platforms/optics.'
  },
  {
    id: 'sug-change-simulator',
    name: 'Change Simulator',
    description: 'Dry-run fabric changes with pre-flight checks, blast-radius estimation, and rollback artifacts.',
    subCategory: 'Operations',
    tags: ['Change Control', 'Simulation', 'Rollback'],
    color: 'from-amber-600 to-rose-700',
    reason: 'Gives SEs a safe rehearsal mode for risky maintenance windows.'
  },
  {
    id: 'sug-sales-playbook',
    name: 'Sales Playbook Coach',
    description: 'Vertical-aligned talk tracks with discovery questions, objection handling, and links to proof points.',
    subCategory: 'Sales Enablement',
    tags: ['Playbook', 'Objections', 'Verticals'],
    color: 'from-indigo-500 to-emerald-600',
    reason: 'Gives account managers crisp, defensible messaging per vertical.'
  },
  {
    id: 'sug-deal-proof-kit',
    name: 'Deal Proof Kit Builder',
    description: 'Assemble 3-slide proof kits: customer pain, Arista differentiation, and verified references tailored to the opportunity.',
    subCategory: 'Sales Enablement',
    tags: ['Proof', 'References', 'Slides'],
    color: 'from-blue-600 to-teal-700',
    reason: 'Helps AMs quickly build credible mini-decks grounded in validated designs and references.'
  },
  {
    id: 'sug-tco-fastlane',
    name: 'TCO Fastlane',
    description: 'Rapid TCO one-pager for AMs: optics/power savings, OpEx reduction, and CloudVision license ROI with customer inputs.',
    subCategory: 'Sales Enablement',
    tags: ['TCO', 'ROI', 'AM Quick'],
    color: 'from-amber-500 to-orange-700',
    reason: 'Gives AMs a fast, defensible financial story without deep modeling.'
  }
];

export const initialBooks: BookItem[] = [
  {
    id: 'art-leaf-spine',
    title: 'The Case for Leaf-Spine Architecture',
    author: 'Arista Networks',
    type: 'White Paper',
    coverColor: 'from-blue-700 to-indigo-900',
    review: 'The foundational blueprint for modern cloud networking. Essential for understanding non-blocking fabric design and scale-out principles.',
    rating: 5,
    tags: ['L3LS', 'Design', 'CLOS'],
    hidden: false,
    preloadedSummary: {
      intro: "Transitioning from legacy three-tier hierarchical designs to a two-tier Leaf-Spine (CLOS) architecture is the fundamental shift enabling modern cloud-scale data centers. This document establishes the first principles of non-blocking, predictable performance.",
      keyIdeas: [
        {
          heading: "Layer 3 Determinism",
          body: "By moving the Layer 2/Layer 3 boundary to the leaf, we eliminate the complexity of Spanning Tree (STP) and leverage Equal-Cost Multi-Path (ECMP) routing for massive horizontal bandwidth."
        },
        {
          heading: "Fixed Latency Profiles",
          body: "In a CLOS fabric, every leaf is exactly two hops away from every other leaf. This creates a uniform latency profile critical for distributed applications and IP storage workloads."
        },
        {
          heading: "Non-Blocking Scaling",
          body: "Scaling is achieved by adding spines for bandwidth or leafs for port density. This modularity allows the fabric to grow from a few racks to tens of thousands of nodes without re-architecting."
        }
      ],
      conclusion: "Leaf-Spine architecture provides the reliable, scalable, and high-performance substrate required for Software-Defined Cloud Networking, providing a future-proof design for the AI era."
    }
  },
  {
    id: 'art-evpn-guide',
    title: 'EVPN-VXLAN Design Guide',
    author: 'Systems Engineering',
    type: 'Design Guide',
    coverColor: 'from-slate-700 to-slate-900',
    review: 'A comprehensive deep-dive into multi-tenant overlay architectures using BGP control planes. Focuses on redundancy, ARP suppression, and anycast gateways.',
    rating: 5,
    tags: ['EVPN', 'VXLAN', 'BGP'],
    hidden: false,
    preloadedSummary: {
      intro: "Ethernet VPN (EVPN) with VXLAN encapsulation represents the evolution of network virtualization, providing a standards-based, multi-vendor control plane for scalable data center fabrics.",
      keyIdeas: [
        {
          heading: "BGP Control Plane Efficiency",
          body: "EVPN uses BGP to distribute MAC and IP reachability, replacing the inefficient 'Flood and Learn' mechanism of traditional Layer 2 networks with a deterministic, protocol-based approach."
        },
        {
          heading: "Anycast Gateway Architecture",
          body: "Implementing the default gateway on all leaf switches allows for seamless virtual machine and container mobility, optimizing East-West traffic flows and reducing hair-pinning."
        },
        {
          heading: "Multi-Homing & Redundancy",
          body: "EVPN provides all-active multi-homing support (ESI), enabling higher bandwidth and hitless failover for server connections without the complexity of MLAG or proprietary stacking."
        }
      ],
      conclusion: "Adopting EVPN-VXLAN enables the creation of high-scale, multi-tenant cloud environments that are robust, interoperable, and operationally simple to manage."
    }
  },
  {
    id: 'art-jericho2',
    title: 'Jericho2: Deep Buffer ASIC Architecture',
    author: 'Hardware Engineering',
    type: 'ASIC Deep-Dive',
    coverColor: 'from-rose-800 to-rose-950',
    review: 'Technical analysis of the R-Series pipeline. Understand Virtual Output Queuing (VOQ) and how deep buffers prevent TCP incast collapse in IP storage.',
    rating: 4,
    tags: ['Jericho2', 'R-Series', 'VOQ'],
    hidden: false,
    preloadedSummary: {
      intro: "The Jericho2 ASIC powers Arista's R-Series platforms, offering a unique combination of high-density throughput and ultra-deep packet buffers required for modern IP Storage and AI workloads.",
      keyIdeas: [
        {
          heading: "Virtual Output Queuing (VOQ)",
          body: "VOQ architecture prevents Head-of-Line Blocking by buffering packets at the ingress port until the egress port is ready, ensuring that congestion on one port does not impact unrelated traffic flows."
        },
        {
          heading: "Absorption of Micro-Bursts",
          body: "Deep buffers act as shock absorbers for the 'Incast' problem common in IP storage (NVMe/RoCE), preventing packet drops during high-pressure traffic spikes that would overwhelm commodity ASICs."
        },
        {
          heading: "Large Scale Routing Tables",
          body: "Jericho2 supports massive routing and MAC table scales, making it the ideal choice for internet peering, DCI, and high-scale core aggregation roles."
        }
      ],
      conclusion: "By prioritizing buffer depth and stateful queue management, Jericho2-based systems provide the high-fidelity performance necessary for mission-critical data center backbones."
    }
  },
  {
    id: 'art-campus-spline',
    title: 'Cognitive Campus: The Spline Design',
    author: 'Campus Architecture',
    type: 'Design Guide',
    coverColor: 'from-emerald-700 to-emerald-900',
    review: 'Modernizing the enterprise edge. This guide deconstructs the shift from legacy 3-tier chassis designs to the simplified, high-bandwidth Spline architecture.',
    rating: 5,
    tags: ['Campus', 'Spline', 'PoE'],
    hidden: false,
    preloadedSummary: {
      intro: "Legacy campus networks are often over-engineered and fragile. The Arista Cognitive Campus 'Spline' design simplifies the hierarchy to improve performance, reliability, and automated management.",
      keyIdeas: [
        {
          heading: "The Spline Layer",
          body: "Collapsing the core and distribution layers into a high-performance 'Spline' reduces latency and eliminates the complexity of proprietary chassis-based aggregation protocols."
        },
        {
          heading: "Unified EOS Substrate",
          body: "Running the exact same EOS binary from the campus edge to the data center spine ensures total feature consistency and simplifies image management across the enterprise."
        },
        {
          heading: "Cognitive Telemetry Integration",
          body: "Integrated streaming telemetry across Wired and Wireless fabrics provides CloudVision with the data needed for automated root-cause analysis and proactive security monitoring."
        }
      ],
      conclusion: "The Spline design enables a zero-touch, automated enterprise network that delivers a superior user experience while reducing both capital and operational expenditure."
    }
  },
  {
    id: 'art-hft-low-latency',
    title: 'Ultra-Low Latency for HFT',
    author: 'Solutions Architecture',
    type: 'White Paper',
    coverColor: 'from-amber-600 to-orange-800',
    review: 'Optimizing for the nanosecond. Covers the 7130 series and FPGA-based networking for high-frequency trading and market data distribution.',
    rating: 5,
    tags: ['HFT', '7130', 'L1'],
    hidden: false,
    preloadedSummary: {
      intro: "In High-Frequency Trading (HFT), every nanosecond counts. Arista's 7130 series platforms leverage Layer 1 switching and FPGA technology to deliver deterministic performance for the most demanding environments.",
      keyIdeas: [
        {
          heading: "Layer 1 Switching Determinism",
          body: "By performing replication and switching at the physical layer, Arista 7130 devices achieve latencies as low as 4 nanoseconds, virtually eliminating the jitter introduced by traditional packet-based switches."
        },
        {
          heading: "FPGA Application Acceleration",
          body: "Integrated FPGAs allow users to run custom trading logic, risk checks, and market data normalization directly in the network path, further reducing end-to-end transaction times."
        },
        {
          heading: "Precision Time Management",
          body: "The architecture prioritizes hardware-based PTP (Precision Time Protocol) synchronization, ensuring nanosecond-level accuracy for market-data timestamping and regulatory compliance (MiFID II)."
        }
      ],
      conclusion: "Combining ultra-low latency hardware with programmable FPGAs provides a competitive edge for financial institutions requiring absolute speed and reliability."
    }
  }
];

export const initialConcepts: ConceptExplainer[] = [...visualEssays];

export const initialRoadmap: RoadmapItem[] = [
  // --- REASONING (Constraint Mapping) ---
  {
    id: 'core-failure-mode',
    title: 'Failure Mode Pre-Mortem',
    description: 'Topology stress-tester. Select a fabric design and a specific failure (e.g., "Spine 1 Power Loss" or "BGP Process Crash"). The system visualizes the exact cascading impact on traffic flows and convergence.',
    category: 'Core',
    status: 'planned',
    type: 'feature',
    votes: 310
  },
  {
    id: 'core-constraint-map',
    title: 'Constraint Topology Mapper',
    description: 'Design fabrics based on limits, not just connectivity. Input power budgets, cooling capacity, and cable reach. The tool highlights topologies that violate physical constraints before any config is written.',
    category: 'Core',
    status: 'in-progress',
    type: 'feature',
    votes: 285
  },
  {
    id: 'core-asic-xray',
    title: 'ASIC Pipeline X-Ray',
    description: 'Visual trace of a packet through the chipset. Highlights latency penalties for features like NAT, ACLs, or VXLAN decap at the silicon level. Reveals hidden serialization delays.',
    category: 'Core',
    status: 'planned',
    type: 'feature',
    votes: 420
  },

  // --- PRACTICE (Drills & Skills) ---
  {
    id: 'drill-troubleshoot',
    title: 'Troubleshooting Drill Generator',
    description: 'Practice scenarios for rapid RCA. The system presents a set of symptoms (e.g., "High latency on VLAN 10") and you must select the correct diagnostic commands to isolate the fault.',
    category: 'Content',
    status: 'planned',
    type: 'feature',
    votes: 395
  },
  {
    id: 'drill-decision-tree',
    title: 'Decision Tree Builder',
    description: 'Interactive tool to build and test architectural decision trees. "If X then Y" logic mapping for redundancy and failover planning.',
    category: 'System',
    status: 'request',
    type: 'feature',
    votes: 180
  },

  // --- REFERENCE (Artifacts) ---
  {
    id: 'art-adr-generator',
    title: 'Decision Record (ADR) Export',
    description: 'Generates a formal "Architecture Decision Record" PDF. Captures the "Why" behind design choices (e.g., "Why EVPN vs OSPF?"), citing specific tradeoffs, ensuring the decision is defensible long after the SE has left the room.',
    category: 'Content',
    status: 'planned',
    type: 'feature',
    votes: 245
  },
  {
    id: 'art-snapshot-share',
    title: 'TCO Snapshot Links',
    description: 'Generate immutable, versioned URLs for specific TCO/ROI models. Allows stakeholders to view the exact calculation logic used to justify a deal without needing to re-enter data.',
    category: 'Integration',
    status: 'in-progress',
    type: 'refinement',
    votes: 190
  },
  
  // --- DELIVERY (Clarifying Interaction) ---
  {
    id: 'int-causal-chain',
    title: 'Causal Dependency Graph',
    description: 'Interactive visualization of the "Blast Radius." Hover over a core switch to see every downstream service, application, and user segment dependent on its state.',
    category: 'System',
    status: 'planned',
    type: 'feature',
    votes: 140
  },
  {
    id: 'req-collision-map',
    title: 'Protocol Collision Mapper',
    description: 'Visualizer for Control Plane conflicts. Highlights route redistribution loops between OSPF and BGP before they cause a melt-down. Moves from "configuration" to "interaction analysis".',
    category: 'Core',
    status: 'request',
    type: 'feature',
    votes: 412
  },
  
  // --- REFINEMENTS ---
  {
    id: 'ref-search-grounding',
    title: 'Search Grounding V2',
    description: 'Enhanced indexing of Arista.com TOI (Technical Operational Information). Ensures the Knowledge Graph is grounded in the absolute latest feature caveats and hardware limitations.',
    category: 'Core',
    status: 'released',
    type: 'refinement',
    votes: 350
  },
  {
    id: 'sys-airgap',
    title: 'SCIF / Air-Gap Mode',
    description: 'Local caching of reasoning models allows TCO, Power, and Transceiver logic to function inside secure facilities without an active internet connection. Durable operation in hostile environments.',
    category: 'System',
    status: 'in-progress',
    type: 'refinement',
    votes: 500
  },
  {
    id: 'sys-offline-sync',
    title: 'Offline Workspace Sync',
    description: 'Enable offline editing for catalogs/roadmaps with queued writes and conflict resolution when connectivity resumes; add explicit “travel mode” indicator.',
    category: 'System',
    status: 'planned',
    type: 'feature',
    votes: 210
  },
  {
    id: 'ref-visual-essays-cms',
    title: 'Visual Essays Content Layer',
    description: 'Separate visual essays into a dedicated content source (markdown/JSON) with preview tooling so non-devs can iterate safely.',
    category: 'Content',
    status: 'planned',
    type: 'refinement',
    votes: 165
  },
  {
    id: 'core-telemetry-ux',
    title: 'UX Telemetry & Toast Audit',
    description: 'Instrument route-level loading states, errors, and toast events for observability; ship opt-in privacy-safe metrics with per-route drill-downs.',
    category: 'Core',
    status: 'planned',
    type: 'refinement',
    votes: 180
  }
];

export const initialGlobalConfig: GlobalConfig = {
  hero: {
    titlePrefix: 'Infra',
    titleSuffix: 'Lens',
    subtitle: 'Turning ideas into skills, skills into clarity, and clarity into field execution',
    version: 'v4.2.0',
    linkedinUrl: 'https://linkedin.com/company/arista-networks'
  },
  tiles: {
    forge: { title: 'Fabric Labs', subtext: 'Reasoning & Design Tooling', visible: true, label: 'Reasoning', category: 'Reasoning' },
    library: { title: 'Architecture Codex', subtext: 'Verified Design Guides', visible: false, label: 'Reference', category: 'Reference' },
    essays: { title: 'Visual Essays', subtext: 'Illustrated architectural stories', visible: false, label: 'Reference', category: 'Reference' },
    about: { title: 'System', subtext: 'Mission Control', visible: true, label: 'System', category: 'System' },
    roadmap: { title: 'Pipeline', subtext: 'System Evolution', visible: true, label: 'System', category: 'System' },
    sePerformance: { title: 'SE Performance Guide', subtext: 'Protocols for Field Excellence', visible: false, label: 'Field Guide', category: 'Practice' },
    briefing: { title: 'Briefing Theater', subtext: 'High-Impact Narrative Engine', visible: true, label: 'Delivery', category: 'Delivery' },
    salesPlaybook: { title: 'Sales Playbook Coach', subtext: 'Vertical talk tracks, objections, and CTA kits', visible: true, label: 'Sales', category: 'Sales' },
    demo: { title: 'Demo Enablement', subtext: 'Architectural Logic Architect', visible: true, label: 'Delivery', category: 'Delivery' },
    cvEnablement: { title: 'CloudVision Field Guide', subtext: 'Day 0 Provisioning & Beyond', visible: true, label: 'Practice', category: 'Practice' },
    links: { title: 'Resource Hub', subtext: 'Strategic Arista Portals', visible: true, label: 'Reference', category: 'Reference' },
    protocols: { title: 'Protocol Translation Lab', subtext: 'Legacy to EOS Translation Engine', visible: true, label: 'Practice', category: 'Practice' },
    linuxLab: { title: 'EOS Linux Lab', subtext: 'Bash & Kernel Access', visible: true, label: 'Practice', category: 'Practice' }
  }
};

export const initialSEPerformance: SEPerformanceStep[] = [
  {
    id: 'bio-1',
    title: 'The Trusted Advisor',
    description: 'The elite SE is an extension of the customer’s engineering team. Focus on outcomes, not SKUs. Identity is built on technical integrity.',
    actionLabel: 'Protocol 1.0',
    actionText: 'Map Features to Business Pains'
  },
  {
    id: 'bio-2',
    title: 'Circadian Calibration',
    description: 'The Master Clock (SCN) governs cognitive acuity. View solar light within 60 minutes of waking to anchor cortisol release and ensure evening melatonin.',
    actionLabel: 'Protocol 2.0',
    actionText: '10m Outdoor Light / No Phone'
  },
  {
    id: 'bio-3',
    title: 'The Weekly Cadence',
    description: 'Structure the week. Front-load creative/heavy architecture work (Mon-Wed). Push admin and meetings to the tail (Thu-Fri).',
    actionLabel: 'Protocol 3.0',
    actionText: 'Theme Your Days'
  },
  {
    id: 'bio-4',
    title: 'The 30-Day Sprint',
    description: 'Sales cycles are long, but progress must be monthly. Define one "Big Rock" (Cert, Deal, PoC) to move every 30 days.',
    actionLabel: 'Protocol 4.0',
    actionText: 'Define Monthly Mission'
  },
  {
    id: 'bio-5',
    title: 'Deep Work Protocol',
    description: 'Architecture requires depth. Elimination of "Context Switching" is the highest ROI activity for a Systems Engineer.',
    actionLabel: 'Protocol 5.0',
    actionText: 'Notifications Off / Door Closed'
  },
  {
    id: 'bio-6',
    title: 'Active Recovery',
    description: 'Stress accumulates like thermal load. Use physiological sighs, NSDR (Non-Sleep Deep Rest), or walks to dump the cache.',
    actionLabel: 'Protocol 6.0',
    actionText: 'Physiological Sigh (2 In / 1 Out)'
  },
  {
    id: 'bio-7',
    title: 'The Mastery Curve',
    description: 'Technical stagnation is death. Dedicate time to the "Feynman Technique"—simplifying complex topics to verify understanding.',
    actionLabel: 'Protocol 7.0',
    actionText: 'Teach it to a 5-Year-Old'
  },
  {
    id: 'bio-8',
    title: 'The 10-Year Horizon',
    description: 'Burnout is an architectural failure. Optimize for the long game. Sustainability > Intensity.',
    actionLabel: 'Protocol 8.0',
    actionText: 'Define "Enough" for Today'
  },
  {
    id: 'bio-9',
    title: 'Bio-Telemetry',
    description: 'You cannot manage what you do not measure. Track HRV (Heart Rate Variability) as a proxy for nervous system recovery.',
    actionLabel: 'Protocol 9.0',
    actionText: 'Check Readiness Score Daily'
  },
  {
    id: 'bio-10',
    title: 'Tribal Synchrony',
    description: 'Sales Engineering is a contact sport. Build trust through "Limbic Resonance"—listening deeply before solving.',
    actionLabel: 'Protocol 10.0',
    actionText: 'Listen 80% / Speak 20%'
  },
  {
    id: 'bio-11',
    title: 'The Evening Launchpad',
    description: 'Decision fatigue kills morning momentum. Define the "One Thing" for tomorrow before you sleep tonight.',
    actionLabel: 'Protocol 11.0',
    actionText: 'Script the First Hour'
  }
];
