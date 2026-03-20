import React, { useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2, Filter, Globe2, Layers, Map, ShieldCheck, BookOpen, ArrowUpRight, RefreshCw, GitBranch, FileDown, ExternalLink, Network } from 'lucide-react';
import { SectionType, ValidatedDesign } from '@/types';
import { RelatedActions } from '@/components/RelatedActions';
import { EvidenceDrawer } from '@/components/EvidenceDrawer';

interface ValidatedDesignNavigatorProps {
  onBack: () => void;
  onNavigate?: (section: SectionType) => void;
}

const DESIGNS: ValidatedDesign[] = [
  {
    id: 'l3ls',
    name: 'Cloud Spine-Leaf (L3LS)',
    fabricType: 'L3 Leaf-Spine',
    brownfieldReady: true,
    scale: '200–2000 racks · 100/400G',
    useCases: ['Cloud DC', 'AI/ML Pods', 'IP Storage', 'Regulated DC'],
    topology: 'Clos 2–3 stage, rail-aligned for AI options',
    rtSchema: 'RT L2: 10:VLAN · RT L3: 50:VRF',
    mtuPlan: '9216 underlay/overlay',
    underlay: 'ISIS or OSPF with PIM-SM multicast (optional SSM)',
    overlay: 'EVPN RT-2/3/5 with Anycast Gateway (VARP)',
    avdSeed: { spines: 4, leaves: 24, linksPerLeaf: 4, uplinkSpeed: '100/400G', vrfs: ['Prod', 'Sec'], notes: 'Rail-aligned option for AI pods' },
    bom: [
      { item: 'Spine: 4x 100/400G RR-capable', count: '4', notes: 'RR enabled' },
      { item: 'Leaf: 48x 25/100G TOR', count: '24', notes: 'Anycast GW enabled' },
      { item: 'Optics: 100/400G', notes: 'Validate breakout matrix' }
    ],
    mandatory: [
      'MTU parity host→leaf→spine',
      'Route-target discipline for L2/L3 VNIs',
      'Symmetric IRB with consistent hashing'
    ],
    optional: [
      'EVPN Multicast with IGMP proxy',
      'ERSPAN/sFlow telemetry feeds',
      'Flow hashing tuned for AI workloads',
      'PTP enabled only where timing required'
    ],
    bomNotes: [
      '100/400G optics validated; check breakout matrix for leaf uplinks',
      'Anycast GW on leafs; spines RR-capable',
      'PTP optional; enable only where timing required'
    ],
    preflight: [
      'Verify MTU 9216 across underlay and VTEPs',
      'Check RT schema consistency (10:VLAN, 50:VRF)',
      'Validate ECMP hashing vs desired symmetry',
      'Confirm RR reachability and session stability'
    ],
    runbook: [
      'Enable underlay routing + PIM on loopbacks/uplinks',
      'Turn up EVPN AF on RR/leaf with route-target schema',
      'Validate IMET/RT-2 visibility; test Anycast GW reachability',
      'Telemetry on: ERSPAN/sFlow; capture vxlan1 for proof',
      'Save snapshot + rollback plan in CV'
    ],
    evidence: {
      source: 'AVD Regression · Lab CVaaS',
      url: 'https://www.arista.com/en/solutions/validated-designs',
      lastValidated: 'Q1 FY25',
      eosTrain: '4.31.2F (R)',
      avdVersion: 'v5.0.0',
      caveats: [
        'Avoid mixed MTU on TOR → Spine links',
        'Ensure RT uniqueness when peering brownfield VRFs',
        'Prefer SSM for telemetry multicast to reduce state'
      ]
    },
    exports: [
      { type: 'AVD Inventory', description: 'Starter inventory for 4x spine / 24x leaf fabric' },
      { type: 'Config Snippet', description: 'EVPN AF + Anycast GW template' },
      { type: 'PDF', description: 'Cutover play with pre-flight and rollback' },
      { type: 'Markdown', description: 'Field kit for sharing internally' }
    ]
  },
  {
    id: 'campus',
    name: 'Cognitive Campus Spline',
    fabricType: 'Campus Spline',
    brownfieldReady: true,
    scale: '5k–50k users · PoE/Multigig',
    useCases: ['Enterprise Campus', 'Edge-WAN', 'IoT', 'Life Sciences Edge'],
    topology: 'Collapsed Spline with redundant uplinks',
    rtSchema: 'VRF-lite; optional EVPN RT 10:VLAN, 50:VRF',
    mtuPlan: 'Default MTU; jumbo optional in core',
    underlay: 'OSPF/ISIS L3 access; DHCP relay validated',
    overlay: 'VRF-lite with optional EVPN for segmentation',
    avdSeed: { spines: 2, leaves: 12, linksPerLeaf: 2, uplinkSpeed: '10/25G', vrfs: ['Campus'], notes: 'Spline collapsed core' },
    bom: [
      { item: 'Spline/Core switches', count: '2', notes: 'M-LAG peers' },
      { item: 'Edge/Access (PoE/Multigig)', count: '12', notes: 'LLDP-MED profiles' },
      { item: 'APs/Edge devices', notes: 'Ensure PoE budget per floor' }
    ],
    mandatory: [
      'LLDP-MED profiles aligned to PoE priority',
      'Consistent DHCP helper policy on gateways',
      'M-LAG health checks before cutover'
    ],
    optional: [
      'Segmentation via EVPN if multi-tenant',
      'Multigig with PoE++ where required',
      'CV Change Control for push/rollback',
      'MACsec on WAN/edge where required'
    ],
    bomNotes: [
      'Check PoE budgets per floor; prefer modular PSUs',
      'Unified EOS image across AP/edge/core',
      'M-LAG capable edge for high-availability closets'
    ],
    preflight: [
      'Validate LLDP-MED policy + PoE load',
      'Confirm DHCP relay reachability per VLAN/VRF',
      'Run CVaaS M-LAG checks and optic DOMs',
      'If EVPN, verify RT schema does not overlap DC'
    ],
    runbook: [
      'Stage config in CV Change Control',
      'Turn up M-LAG peer-links and keepalives',
      'Enable routing + DHCP helpers; verify client onboarding',
      'Observe PoE draw/DOMs; rollback via CV snapshot if needed',
      'If EVPN, validate IMET/RT-2 visibility in test VRF'
    ],
    evidence: {
      source: 'Campus Spline VdC',
      lastValidated: 'Q4 FY24',
      eosTrain: '4.30.5M (M)',
      avdVersion: 'v4.9.0',
      caveats: [
        'Avoid mixed jumbo defaults on access',
        'Ensure DHCP relay VRF is reachable from core',
        'Document PoE priority for critical endpoints'
      ]
    },
    exports: [
      { type: 'AVD Inventory', description: 'Campus Spline starter inventory with closets' },
      { type: 'Config Snippet', description: 'M-LAG edge with DHCP helper templates' },
      { type: 'PDF', description: 'Campus cutover play' }
    ]
  },
  {
    id: 'dci',
    name: 'Secure DCI (EVPN DCI)',
    fabricType: 'DCI EVPN',
    brownfieldReady: true,
    scale: 'Metro/Inter-DC · 100G/400G',
    useCases: ['Active/Active DC', 'Edge Colos', 'Regulated'],
    topology: 'EVPN DCI with RT-5 and MACsec-capable uplinks',
    rtSchema: 'RT-5 for VRFs; avoid overlap with campus',
    mtuPlan: 'DCI MTU +50–100 bytes over underlay',
    underlay: 'IP transit with QoS; optional MACsec',
    overlay: 'EVPN RT-5 for L3 DCI; RT-2/3 for stretched VLANs (limited)',
    avdSeed: { spines: 2, leaves: 4, linksPerLeaf: 2, uplinkSpeed: '100/400G', vrfs: ['Prod', 'DMZ'], notes: 'DCI edge template' },
    bom: [
      { item: 'DCI Edge (MACsec capable)', count: '2 per site', notes: 'Check optic support' },
      { item: 'Optics: 100/400G MACsec', notes: 'Where compliance requires' },
      { item: 'RR-capable nodes', notes: 'Regional RR optional' }
    ],
    mandatory: [
      'RT uniqueness across sites; avoid RT collisions',
      'MACsec only where hardware/optic capable',
      'DCI MTU > underlay by 50–100 bytes'
    ],
    optional: [
      'DCI route-reflectors per region',
      'Per-VRF QoS shaping on DCI edge',
      'Telemetry tap via ERSPAN on DCI links'
    ],
    bomNotes: [
      'MACsec optics on DCI if compliance required',
      'Leverage R-series for deep buffers if mixed traffic',
      'Document RT schema for DCI vs campus/edge'
    ],
    preflight: [
      'Confirm MACsec capability + keying on both ends (CAK/CKN match, cipher suite aligned)',
      'Validate WAN underlay MTU ≥ 9100 (VXLAN overhead = 50 bytes; target inner MTU 9000)',
      'Check RT schema: DCI export RTs must not collide with local fabric RT 10:VLAN / 50:VRF',
      'Verify VTEP loopback reachability across WAN: ping from BL loopback to remote BL loopback',
      'Run `show vxlan config-sanity detail` on border leaves — all checks PASS before enabling DCI VNIs',
      'Confirm ARP suppression planned for L2-stretched VLANs to avoid OTV-style flooding over DCI'
    ],
    runbook: [
      'Enable WAN underlay: eBGP or static routing between border leaf loopbacks; validate ping',
      'Configure VXLAN DCI tunnel: `interface Vxlan1 → vxlan source-interface Loopback0`',
      'Enable EVPN AF with RT-5 for L3 VRFs: `address-family evpn → redistribute connected`',
      'Validate RT-5 advertisements: `show bgp evpn route-type ip-prefix` at both sites',
      'For L2 stretch: add VNI-to-VLAN mapping + ARP suppression; verify IMET/RT-2 exchange',
      'Enable MACsec on DCI uplinks if compliance required; revalidate MTU and throughput',
      'Test failover: shut one border leaf — verify routes reconverge at remote site in < 5s',
      'Take CloudVision snapshot at both sites; update compliance baseline'
    ],
    evidence: {
      source: 'EVPN DCI Validation',
      lastValidated: 'Q1 FY25',
      eosTrain: '4.31.1F (R)',
      avdVersion: 'v4.10.2',
      caveats: [
        'RT collisions with campus VRFs can blackhole',
        'MACsec throughput depends on platform/optic',
        'Limit L2 stretch; prefer L3 DCI with RT-5'
      ]
    },
    exports: [
      { type: 'AVD Inventory', description: 'DCI edge inventory with RT schema' },
      { type: 'Config Snippet', description: 'RT-5 DCI template + MACsec option' },
      { type: 'PDF', description: 'DCI cutover + rollback play' }
    ]
  },
  {
    id: 'ai-rail',
    name: 'AI Rail Pod (Lossless)',
    fabricType: 'L3 Leaf-Spine (Rail-Aligned)',
    brownfieldReady: true,
    scale: '4–16 leaf pods · 100/400G',
    useCases: ['AI/ML Pods', 'HPC', 'Storage Burst'],
    topology: 'Rail-aligned leaf pairs, deep buffers, ECN tuned',
    rtSchema: 'RT L2: 10:VLAN · RT L3: 50:VRF (per rail/pod)',
    mtuPlan: '9216 underlay/overlay',
    underlay: 'ISIS/OSPF with consistent hashing; ECN capable',
    overlay: 'EVPN RT-2/3/5 with Anycast GW; optional PFC/ECN',
    avdSeed: { spines: 2, leaves: 8, linksPerLeaf: 4, uplinkSpeed: '100/400G', vrfs: ['AI'], notes: 'Rail-paired leaves for pod' },
    bom: [
      { item: '7280R3 or 7060X5 leaf (deep buffer, 400G)', count: '8', notes: 'Rail-aligned pairs; verify ECN + buffer profile' },
      { item: '7280R3 spine (400G QSFP-DD)', count: '2', notes: 'Deep buffer spine; 800G+ aggregate capacity' },
      { item: 'QSFP-DD 400G SR8 / DR4 optics', notes: 'Validate breakout matrix per platform; avoid mixed optic classes' },
      { item: 'GPU host NICs (100/400G)', notes: 'Ensure RoCEv2 or RDMA capable; align with ECN thresholds' }
    ],
    bomNotes: [
      'Deep-buffer leaves preferred; verify ECN defaults match buffer profile',
      '400G optics validated; check breakout rules per platform support matrix',
      'PTP optional; enable only if GPU workload requires sub-μs timing'
    ],
    mandatory: [
      'Enable ECN + buffer profile per Arista AI Validated Design (queue-monitor + dscp-map)',
      'MTU parity 9216 host→leaf→spine end-to-end — silent drops if mismatched',
      'Consistent ECMP hashing: flow hash tuned for RDMA traffic symmetry',
      'Rail alignment: GPU rail A/B on separate leaf pairs to prevent congestion spreading'
    ],
    optional: [
      'PFC where strictly required — limit scope to GPU rail VLAN only',
      'PTP only if workload requires timing (avoid if possible — adds state)',
      'ERSPAN/sFlow telemetry per job/pod for per-GPU visibility',
      'CloudVision LANZ for micro-burst and buffer utilization trending'
    ],
    preflight: [
      'Verify ECN thresholds match buffer profile: show hardware counter drop asic on each leaf',
      'Confirm MTU 9216 end-to-end: ping sweep with df-bit from GPU host to peer GPU',
      'Check RT schema per rail/pod: no VNI overlap between AI pods and tenant fabric',
      'Validate consistent hashing algorithm: show platform environment all | inc hash',
      'Run show queue-monitor length on all leaves — baseline buffer usage before traffic',
      'Confirm Anycast GW (ip address virtual) consistent on all leafs in rail'
    ],
    runbook: [
      'Stage underlay: ISIS/OSPF with BFD; validate loopback reachability across all leaves',
      'Apply buffer profile + ECN policy per Arista AI PoD validated config; verify with show queue-monitor',
      'Enable EVPN AF + RT schema (RT L2: 10:VNI, RT L3: 50:VRF); verify IMET routes',
      'Configure Anycast GW SVIs per pod VRF; validate IP reachability from GPU hosts',
      'Run lossless/lossy traffic test: inject RDMA traffic + background TCP; confirm no ECN-induced drops on lossless queue',
      'Capture sFlow/ERSPAN baseline for per-job telemetry; verify CloudVision LANZ is recording buffer events',
      'Take CV snapshot; document buffer thresholds + ECN config as deployment baseline'
    ],
    evidence: {
      source: 'AI Pod Regression',
      lastValidated: 'Q1 FY25',
      eosTrain: '4.31.2F (R)',
      avdVersion: 'v5.0.0',
      caveats: ['Limit PFC domain; avoid end-to-end unless required', 'Ensure ECN thresholds match buffer profile', 'Breakout only per platform support matrix']
    },
    exports: [
      { type: 'AVD Inventory', description: 'AI pod starter inventory with rail pairs' },
      { type: 'Config Snippet', description: 'EVPN + ECN baseline template' },
      { type: 'PDF', description: 'AI pod cutover + validation steps' }
    ]
  },
  {
    id: 'campus-sm',
    name: 'Campus Spline Small/Medium',
    fabricType: 'Collapsed Spline (M-LAG)',
    brownfieldReady: true,
    scale: '100–500 users · PoE/Multigig',
    useCases: ['Campus', 'PoE', 'Enterprise Campus'],
    topology: 'Collapsed Spline 2-node M-LAG core; Multigig/PoE access',
    rtSchema: 'VRF-lite; no EVPN required at this scale',
    mtuPlan: '1500 default; 9000 optional on uplinks',
    underlay: 'Routed access BGP unnumbered or OSPF; DHCP relay per VLAN',
    overlay: 'VRF-lite (Corp / Guest / IoT); optional MACsec on uplinks',
    avdSeed: { spines: 2, leaves: 4, linksPerLeaf: 2, uplinkSpeed: '10/25G', vrfs: ['Corp', 'Guest', 'IoT'], notes: 'M-LAG core pair; ZTP via CloudVision' },
    bom: [
      { item: '720DP-48S (PoE access)', count: '4', notes: 'LLDP-MED profiles per port' },
      { item: '720XP-24ZY4 (Multigig spline)', count: '2', notes: 'M-LAG peers; PoE++ on access ports' },
      { item: 'Optics: 10/25G SFP+/SFP28', notes: 'Validate breakout for uplinks' }
    ],
    mandatory: [
      'MTU consistency core→access',
      'PoE class discipline per endpoint profile',
      'M-LAG consistency-check before cutover',
      'DHCP snooping on access VLANs'
    ],
    optional: [
      'MACsec on uplinks (720XP supports AES-128)',
      'CloudVision ZTP for access switches',
      'DHCP guard + ARP inspection per VLAN',
      'sFlow on uplinks for visibility'
    ],
    preflight: [
      'Verify PoE budget per closet (W per port × connected devices)',
      'Confirm DHCP relay VRF reachability from core',
      'Run M-LAG consistency-check: show mlag config-sanity',
      'Validate uplink MTU: ping sweep with df-bit set'
    ],
    runbook: [
      'Stage config in CV Change Control; snapshot before push',
      'Bring up M-LAG peer-link and keepalive; verify: show mlag',
      'Enable routing + DHCP helpers; test client onboarding per VLAN',
      'Monitor PoE draw: show power inline; confirm DOMs on optics',
      'Enable MACsec on uplinks if required; revalidate throughput',
      'Rollback via CV snapshot if any validation step fails'
    ],
    evidence: {
      source: 'Campus Spline VdC (Small/Medium)',
      lastValidated: 'Q4 FY24',
      eosTrain: '4.30.5M (M)',
      avdVersion: 'v4.9.0',
      caveats: [
        'Avoid mixed jumbo defaults on access ports',
        'Document PoE priority for phones, APs, and cameras',
        'M-LAG keepalive must survive peer-link failure — use separate path'
      ]
    },
    exports: [
      { type: 'AVD Inventory', description: 'Small campus starter: 2x spline, 4x access' },
      { type: 'Config Snippet', description: 'M-LAG core + DHCP relay + VRF-lite template' },
      { type: 'Markdown', description: 'Field kit for campus cutover' }
    ]
  },
  {
    id: 'zero-trust',
    name: 'Zero Trust Secure Fabric',
    fabricType: 'L3 Leaf-Spine (MSS + MACsec)',
    brownfieldReady: false,
    scale: '50–500 racks · 25/100G',
    useCases: ['Security', 'Cloud DC', 'Regulated DC'],
    topology: 'L3LS with MSS-Group micro-segmentation; MACsec on all ISL; NDR tap ports per leaf',
    rtSchema: 'RT L2: 20:VLAN · RT L3: 60:VRF (one VRF per security zone)',
    mtuPlan: '9216 underlay; 9116 effective after MACsec overhead (100B)',
    underlay: 'ISIS with BFD; MACsec AES-256 on all ISL and spine uplinks',
    overlay: 'EVPN RT-2/RT-5 with VRF per zone; MSS-Group for intra-VRF micro-segmentation',
    avdSeed: { spines: 4, leaves: 16, linksPerLeaf: 4, uplinkSpeed: '100G', vrfs: ['Prod', 'PCI', 'DMZ', 'Mgmt'], notes: 'MSS-Group per zone; MACsec on all ISL' },
    bom: [
      { item: '7280R3 spine (MACsec + deep buffer)', count: '4', notes: 'RR-capable; MACsec line cards' },
      { item: '7050X4 leaf (MACsec capable)', count: '16', notes: 'MSS-Group + NDR tap per leaf' },
      { item: 'MACsec-capable QSFP100 optics', notes: 'Verify per-platform support matrix' },
      { item: 'NDR probes / tap aggregator', notes: 'Mirror port per leaf for visibility' }
    ],
    mandatory: [
      'MACsec on all ISL — static CAK or MKA',
      'MSS-Group policy anchored per security zone VRF',
      'VRF boundary enforcement — no RT leaks across zones without policy',
      'MACsec overhead: lower MTU to 9116 on all affected links'
    ],
    optional: [
      'NDR tap via ERSPAN/mirror to security SIEM',
      'PTP if compliance requires timing (PCI, HIPAA)',
      'LANZ telemetry streaming to CloudVision for anomaly detection',
      'CloudVision Compliance for config drift alerting'
    ],
    preflight: [
      'Confirm MACsec key parity on both ends of every ISL',
      'Audit VRF RT uniqueness — no overlap across zones',
      'Validate MSS-Group rule order; explicit deny at zone boundary',
      'Verify MACsec capable optics per platform support matrix',
      'Check MTU: underlay 9216 → reduce to 9116 after MACsec'
    ],
    runbook: [
      'Bring up ISIS underlay with BFD; validate reachability',
      'Enable MACsec on ISL one link at a time; verify: show mac security',
      'Enable EVPN AF per zone VRF; validate RT-2/RT-5 advertisements',
      'Apply MSS-Group policies per zone; test intra-zone and inter-zone traffic',
      'Configure NDR tap mirror ports; validate probe connectivity',
      'Capture full show tech before handing off; save CV snapshot'
    ],
    evidence: {
      source: 'Arista Zero Trust Validated Design',
      url: 'https://www.arista.com/en/solutions/validated-designs',
      lastValidated: 'Q1 FY25',
      eosTrain: '4.31.2F (R)',
      avdVersion: 'v5.0.0',
      caveats: [
        'Greenfield recommended — MACsec overhead breaks brownfield MTU assumptions',
        'MSS-Group rule audit required before production — default deny is aggressive',
        'MACsec throughput varies by platform and line card — verify datasheet'
      ]
    },
    exports: [
      { type: 'AVD Inventory', description: 'Zero Trust spine-leaf with zone VRFs' },
      { type: 'Config Snippet', description: 'MACsec ISL + MSS-Group zone template' },
      { type: 'Markdown', description: 'Security fabric field kit' }
    ]
  },
  {
    id: 'branch-wan',
    name: 'Branch / WAN Edge ZTP',
    fabricType: 'Branch Collapsed (ZTP)',
    brownfieldReady: true,
    scale: '10–100 users · 1/10G WAN',
    useCases: ['Campus', 'Edge-WAN', 'IoT'],
    topology: 'Single or dual-switch collapsed branch; CloudVision ZTP; dual WAN uplink with BFD failover',
    rtSchema: 'VRF-lite; 10:VLAN campus backhaul, 50:VRF WAN',
    mtuPlan: '1500 WAN; 9000 internal optional',
    underlay: 'Static or eBGP WAN uplink with BFD; DHCP relay; VRF-aware routing',
    overlay: 'VRF-lite; optional EVPN RT-5 for campus backhaul via SD-WAN handoff',
    avdSeed: { spines: 0, leaves: 2, linksPerLeaf: 2, uplinkSpeed: '1/10G', vrfs: ['Corp', 'Guest'], notes: 'ZTP via CVaaS; dual WAN uplink BFD' },
    bom: [
      { item: '720XP-24ZY4 (PoE/Multigig branch)', count: '1–2', notes: 'ZTP-capable; dual uplink' },
      { item: 'WAN router or SD-WAN CPE', notes: 'Handoff to Arista on LAN side' },
      { item: 'CloudVision-as-a-Service license', notes: 'Required for ZTP provisioning' }
    ],
    mandatory: [
      'CloudVision ZTP — device token pre-staged in CVaaS',
      'Dual WAN uplink with BFD for fast failover',
      'DHCP snooping on all access VLANs',
      'VRF separation: Corp vs Guest traffic'
    ],
    optional: [
      'PoE class policy (phones, APs, cameras)',
      'MACsec on WAN uplink (720XP supports AES-128)',
      'sFlow sampling to CVaaS for branch visibility',
      'LLDP-MED profiles for phone/AP auto-config'
    ],
    preflight: [
      'Validate ZTP token registration in CloudVision',
      'Confirm both WAN circuits reachable; test BFD timer alignment',
      'Check VRF RT schema does not collide with campus or DC',
      'Verify 720XP optics compatibility for WAN handoff interface'
    ],
    runbook: [
      'Pre-stage ZTP token in CVaaS; connect switch to WAN — auto-provisions',
      'Validate: show cloudvision status; confirm CV connectivity',
      'Test WAN uplink failover: shut primary; verify BFD reconvergence',
      'Enable DHCP relay per VLAN; test Corp and Guest client onboarding',
      'Monitor PoE draw if APs/phones attached; enable sFlow if needed',
      'Rollback: restore CV snapshot or push baseline via CVaaS'
    ],
    evidence: {
      source: 'Branch ZTP Reference Design',
      lastValidated: 'Q4 FY24',
      eosTrain: '4.30.5M (M)',
      avdVersion: 'v4.9.0',
      caveats: [
        'ZTP requires CVaaS reachability at boot — ensure OOB or WAN is up',
        'Dual WAN BFD timer alignment matters — mismatch causes flapping',
        'Guest VLAN isolation is mandatory for IoT/BYOD compliance'
      ]
    },
    exports: [
      { type: 'AVD Inventory', description: 'Branch ZTP starter with dual WAN' },
      { type: 'Config Snippet', description: 'ZTP bootstrap + dual WAN BFD template' },
      { type: 'Markdown', description: 'Branch deployment field kit' }
    ]
  },
  {
    id: 'storage',
    name: 'NVMe-oF Storage Fabric',
    fabricType: 'Lossless Leaf-Spine (Storage)',
    brownfieldReady: false,
    scale: '4–32 leaf pairs · 25/100G',
    useCases: ['Storage', 'IP Storage', 'AI/ML Pods'],
    topology: 'Purpose-built lossless leaf-spine; PFC on storage class; ECN on all queues; LANZ on every leaf',
    rtSchema: 'RT L2: 30:VLAN · or pure L3 routed access per storage subnet',
    mtuPlan: '9216 end-to-end; validate NVMe/RoCEv2 MTU on host NICs (must match)',
    underlay: 'ISIS/OSPF with BFD; ECN + PFC enabled per storage traffic class',
    overlay: 'EVPN RT-2 for L2 storage VLANs; or pure routed access per VRF',
    avdSeed: { spines: 2, leaves: 8, linksPerLeaf: 4, uplinkSpeed: '100G', vrfs: ['Storage'], notes: 'PFC + ECN lossless; LANZ on every leaf' },
    bom: [
      { item: '7050X4 leaf (deep buffer, ECN)', count: '8', notes: 'LANZ + PFC capable; 25/100G host ports' },
      { item: '7050X4 spine (deep buffer)', count: '2', notes: 'Deep buffer for storage burst absorption' },
      { item: '25G/100G DAC or optics per host', notes: 'Validate RoCEv2 NIC driver on hosts' },
      { item: 'CloudVision LANZ license', notes: 'Required for latency telemetry streaming' }
    ],
    mandatory: [
      'PFC enabled on storage traffic class (TC3 typical)',
      'ECN threshold tuned per buffer profile (not default)',
      'MTU parity 9216 host NIC → leaf → spine — no exceptions',
      'LANZ enabled on all leaf ports carrying storage traffic'
    ],
    optional: [
      'NVMe/TCP as fallback (no PFC required for TCP path)',
      'LANZ streaming to CloudVision for latency anomaly detection',
      'sFlow per storage VLAN for flow visibility',
      'Separate lossless and lossy fabrics if mixed workloads'
    ],
    preflight: [
      'Audit PFC + ECN config: show qos interface; show traffic-policy',
      'Confirm buffer profile applied on all storage-facing interfaces',
      'Validate RoCEv2 NIC driver and firmware on all hosts',
      'MTU sweep: ping 9000 with df-bit from host → remote host',
      'Verify LANZ license active: show lanz status'
    ],
    runbook: [
      'Apply buffer profile + PFC/ECN on all leaf/spine interfaces',
      'Bring up underlay with BFD; verify: show ip ospf neighbor / bgp summary',
      'Enable LANZ on leaf ports; stream to CloudVision',
      'Connect hosts; validate RoCEv2 traffic lossless via LANZ latency graph',
      'Run NVMe/TCP as parallel test if fallback path required',
      'Capture show tech + LANZ baseline before handing off to storage team'
    ],
    evidence: {
      source: 'NVMe-oF Storage Fabric Validation',
      url: 'https://www.arista.com/en/solutions/validated-designs',
      lastValidated: 'Q1 FY25',
      eosTrain: '4.31.2F (R)',
      avdVersion: 'v5.0.0',
      caveats: [
        'Do not mix general-purpose and storage traffic on same PFC domain',
        'ECN threshold defaults are NOT correct for NVMe-oF — must tune per buffer profile',
        'Host NIC firmware must support RoCEv2 — validate before fabric turn-up'
      ]
    },
    exports: [
      { type: 'AVD Inventory', description: 'Storage leaf-spine with LANZ + PFC config' },
      { type: 'Config Snippet', description: 'PFC + ECN + LANZ lossless template' },
      { type: 'Markdown', description: 'Storage fabric field kit' }
    ]
  }
];

const FILTERS = ['Cloud DC', 'AI/ML Pods', 'Campus', 'DCI', 'Storage', 'Security', 'PoE'];

export const ValidatedDesignNavigator: React.FC<ValidatedDesignNavigatorProps> = ({ onBack, onNavigate }) => {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [brownfieldOnly, setBrownfieldOnly] = useState(false);
  const [brownfieldMode, setBrownfieldMode] = useState(true);
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const filteredDesigns = useMemo(() => {
    let list = DESIGNS;
    if (activeFilter !== 'All') {
      list = list.filter((d) => d.useCases.some((u) => u.toLowerCase().includes(activeFilter.toLowerCase())));
    }
    if (brownfieldOnly) {
      list = list.filter((d) => d.brownfieldReady);
    }
    return list;
  }, [activeFilter, brownfieldOnly]);

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((p) => p !== id);
      if (prev.length >= 2) return [prev[1], id]; // keep last selected + new
      return [...prev, id];
    });
  };

  const handleExport = (design: ValidatedDesign, type: ValidatedDesign['exports'][number]['type']) => {
    const download = (filename: string, content: string) => {
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    };

    if (type === 'AVD Inventory') {
      const payload = {
        fabric: design.fabricType,
        avdVersion: design.evidence.avdVersion ?? 'unspecified',
        topology: design.topology,
        rtSchema: design.rtSchema,
        mtuPlan: design.mtuPlan,
        underlay: design.underlay,
        overlay: design.overlay,
        vrfs: design.avdSeed?.vrfs ?? [],
        spines: design.avdSeed?.spines,
        leaves: design.avdSeed?.leaves,
        linksPerLeaf: design.avdSeed?.linksPerLeaf,
        uplinkSpeed: design.avdSeed?.uplinkSpeed,
        notes: design.avdSeed?.notes ?? design.bomNotes
      };
      download(`${design.id}-avd-inventory.json`, JSON.stringify(payload, null, 2));
    } else if (type === 'Config Snippet') {
      const snippet = `! ${design.name} starter
! Underlay: ${design.underlay}
! Overlay: ${design.overlay}
! RT Schema: ${design.rtSchema || 'define'}
! MTU Plan: ${design.mtuPlan || 'define'}
! Mandatory:
${design.mandatory.map((m) => `! - ${m}`).join('\n')}
! Caveats:
${design.evidence.caveats.map((c) => `! - ${c}`).join('\n')}`;
      download(`${design.id}-config-snippet.txt`, snippet);
    } else {
      const md = `# ${design.name} Field Kit
- Fabric: ${design.fabricType}
- Scale: ${design.scale}
- EOS Train: ${design.evidence.eosTrain}
- Last Validated: ${design.evidence.lastValidated}
- RT Schema: ${design.rtSchema || 'define'}
- MTU Plan: ${design.mtuPlan || 'define'}

## Pre-flight
${design.preflight.map((p) => `- ${p}`).join('\n')}

## Runbook
${design.runbook.map((r, idx) => `${idx + 1}. ${r}`).join('\n')}
`;
      download(`${design.id}-field-kit.${type === 'PDF' ? 'md' : 'md'}`, md);
    }
  };

  return (
    <div className="min-h-screen bg-page-bg text-primary flex flex-col">
      <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-card-bg/80 backdrop-blur z-20">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="group p-2 text-secondary hover:text-primary transition-colors">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400">
              <Map size={18} />
            </div>
            <div>
              <h1 className="font-serif font-bold text-lg tracking-tight leading-none">Validated Design Navigator</h1>
              <span className="text-[10px] font-mono text-secondary uppercase tracking-widest mt-1 block">Arista Verified · Exportable Kits</span>
            </div>
          </div>
        </div>
        {onNavigate && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate(SectionType.PROTOCOLS)}
              className="text-[10px] font-mono uppercase tracking-[0.3em] text-emerald-400 hover:text-primary"
            >
              Protocol Lab →
            </button>
            <button
              onClick={() => onNavigate(SectionType.AVD_STUDIO)}
              className="text-[10px] font-mono uppercase tracking-[0.3em] text-blue-400 hover:text-primary"
            >
              AVD Studio →
            </button>
          </div>
        )}
      </header>

      <main className="flex-1 p-6 md:p-10 space-y-8">
        <RelatedActions
          actions={[
            ...(onNavigate ? [{
              label: 'AVD Studio',
              onClick: () => onNavigate(SectionType.AVD_STUDIO),
              icon: <ArrowUpRight size={12} />,
              tone: 'emerald'
            }] : []),
            ...(onNavigate ? [{
              label: 'CloudVision',
              onClick: () => onNavigate(SectionType.CLOUDVISION_ENABLEMENT),
              icon: <ArrowUpRight size={12} />,
              tone: 'blue'
            }] : []),
            ...(onNavigate ? [{
              label: 'Protocol Lab',
              onClick: () => onNavigate(SectionType.PROTOCOLS),
              icon: <ArrowUpRight size={12} />
            }] : [])
          ]}
        />
        <EvidenceDrawer contextTags={['Navigator']} />
        <section className="p-6 rounded-3xl border border-border bg-card-bg flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-mono uppercase tracking-[0.3em] text-secondary flex items-center gap-2">
              <Globe2 size={14} className="text-emerald-400" /> Grounded in Arista Validated Designs
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary leading-tight">Pick a design, export a field kit.</h2>
            <p className="text-secondary text-sm md:text-base">
              Each profile bundles topology, EOS train, BoM notes, caveats, and Day-2 runbooks. Filter by use-case or scale, then push into AVD or CloudVision change control (and Protocol Lab) for validation.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold border border-emerald-400/40 text-emerald-400 bg-emerald-500/5">Latest: Q1 FY25</span>
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold border border-blue-400/40 text-blue-400 bg-blue-500/5">Export: PDF / .MD</span>
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold border border-amber-400/40 text-amber-400 bg-amber-500/5">Cutover Ready</span>
          </div>
        </section>

        <section className="p-4 rounded-2xl border border-border bg-card-bg/60">
          <div className="flex items-center gap-3 mb-4">
            <Filter size={16} className="text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-secondary">Filter by mission</span>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <button
              onClick={() => setActiveFilter('All')}
              className={`px-3 py-1 rounded-full text-sm border transition ${activeFilter === 'All' ? 'border-emerald-400/60 text-primary bg-card-bg' : 'border-border text-secondary hover:text-primary'}`}
            >
              All
            </button>
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1 rounded-full text-sm border transition ${activeFilter === f ? 'border-emerald-400/60 text-primary bg-card-bg' : 'border-border text-secondary hover:text-primary'}`}
              >
                {f}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-2 text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-secondary hover:text-primary">
                <input
                  type="checkbox"
                  className="accent-emerald-500"
                  checked={brownfieldOnly}
                  onChange={(e) => setBrownfieldOnly(e.target.checked)}
                />
                Brownfield ready
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-secondary hover:text-primary">
                <input
                  type="checkbox"
                  className="accent-emerald-500"
                  checked={brownfieldMode}
                  onChange={(e) => setBrownfieldMode(e.target.checked)}
                />
                Brownfield guidance
              </label>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDesigns.map((design) => (
            <div key={design.id} className="p-6 rounded-3xl border border-border bg-card-bg shadow-lg space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-secondary flex items-center gap-2">
                    <Layers size={14} className="text-blue-400" /> {design.scale}
                  </p>
                  <h3 className="text-2xl font-serif font-bold text-primary mt-1">{design.name}</h3>
                  <p className="text-xs text-secondary mt-1">Fabric: {design.fabricType}</p>
                  <p className="text-xs text-secondary mt-0.5">Underlay: {design.underlay}</p>
                  <p className="text-xs text-secondary mt-0.5">Overlay: {design.overlay}</p>
                </div>
              <div className="flex flex-col items-end gap-2">
                <div className="px-3 py-1 rounded-full text-[11px] font-semibold border border-emerald-400/40 text-emerald-400 bg-emerald-500/5">
                  EOS {design.evidence.eosTrain}
                </div>
                {design.evidence.avdVersion && (
                  <div className="px-3 py-1 rounded-full text-[11px] font-semibold border border-blue-400/40 text-blue-400 bg-blue-500/5">
                    AVD {design.evidence.avdVersion}
                  </div>
                )}
                {design.brownfieldReady && (
                  <span className="px-3 py-1 rounded-full text-[10px] font-semibold border border-amber-400/40 text-amber-400 bg-amber-500/5">
                    Brownfield Ready
                  </span>
                )}
                  <label className="text-[11px] text-secondary flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="accent-emerald-500"
                      checked={compareIds.includes(design.id)}
                      onChange={() => toggleCompare(design.id)}
                    />
                    Compare
                  </label>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-border bg-card-bg/60">
                <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-secondary mb-2">Topology sketch</p>
                <div className="grid grid-cols-4 gap-2 text-center text-[11px] text-secondary">
                  <div className="rounded-lg border border-border py-2 bg-card-bg/60">Spines: {design.avdSeed?.spines ?? '-'}</div>
                  <div className="rounded-lg border border-border py-2 bg-card-bg/60">Leaves: {design.avdSeed?.leaves ?? '-'}</div>
                  <div className="rounded-lg border border-border py-2 bg-card-bg/60">Links/Leaf: {design.avdSeed?.linksPerLeaf ?? '-'}</div>
                  <div className="rounded-lg border border-border py-2 bg-card-bg/60">Uplink: {design.avdSeed?.uplinkSpeed ?? '-'}</div>
                </div>
                {design.avdSeed?.notes && <p className="text-xs text-secondary mt-2">{design.avdSeed.notes}</p>}
                <div className="mt-3 p-3 rounded-xl border border-border bg-card-bg/70 text-[11px] text-secondary space-y-1">
                  <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                    <Network size={14} className="text-emerald-400" /> Control/Data Points
                  </div>
                  <div>RT Schema: {design.rtSchema || 'Define'}</div>
                  <div>MTU Plan: {design.mtuPlan || 'Define'}</div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-secondary">Use Cases</p>
                <div className="flex flex-wrap gap-2">
                  {design.useCases.map((u) => (
                    <span key={u} className="text-[11px] font-semibold px-2 py-1 rounded-lg bg-card-bg/60 border border-border text-secondary">
                      {u}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-secondary">Highlights</p>
                <ul className="space-y-2">
                  {design.mandatory.map((m) => (
                    <li key={m} className="flex gap-2 text-sm text-secondary">
                      <CheckCircle2 size={14} className="text-emerald-400 mt-0.5" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-secondary">Optional / Caveats</p>
                <ul className="space-y-2">
                  {design.optional.map((opt) => (
                    <li key={opt} className="flex gap-2 text-sm text-secondary">
                      <ShieldCheck size={14} className="text-blue-400 mt-0.5" />
                      <span>{opt}</span>
                    </li>
                  ))}
                  {design.evidence.caveats.map((c) => (
                    <li key={c} className="flex gap-2 text-sm text-secondary">
                      <ShieldCheck size={14} className="text-amber-400 mt-0.5" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="p-3 rounded-2xl border border-border bg-card-bg/60">
                  <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-secondary mb-2">BoM / Prep</p>
                  {design.bom && design.bom.length > 0 ? (
                    <ul className="space-y-1">
                      {design.bom.map((b) => (
                        <li key={`${design.id}-${b.item}-${b.notes}`} className="text-sm text-secondary flex flex-wrap gap-2 items-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span className="font-semibold text-primary">{b.item}</span>
                          {b.count && <span className="text-xs text-secondary">({b.count})</span>}
                          {b.notes && <span className="text-xs text-secondary">— {b.notes}</span>}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <ul className="space-y-1">
                      {design.bomNotes.map((b) => (
                        <li key={b} className="text-sm text-secondary flex gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="p-3 rounded-2xl border border-border bg-card-bg/60">
                  <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-secondary mb-2">Pre-flight</p>
                  <ul className="space-y-1">
                    {(brownfieldMode ? [...design.preflight, 'Validate interop/brownfield RT overlap before turn-up'] : design.preflight).map((p) => (
                      <li key={p} className="text-sm text-secondary flex gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-3 rounded-2xl border border-border bg-card-bg/60">
                  <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-secondary mb-2">Runbook</p>
                  <ol className="space-y-1 list-decimal list-inside text-sm text-secondary">
                    {(brownfieldMode ? [...design.runbook, 'Post-change: verify legacy interop + rollback checkpoint saved'] : design.runbook).map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/60">
                <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-secondary flex items-center gap-2">
                  <BookOpen size={14} className="text-blue-400" /> Export Field Kit
                </div>
                <div className="flex items-center gap-2">
                  {design.exports.map((ex) => (
                    <button
                      key={ex.type}
                      onClick={() => handleExport(design, ex.type)}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg border border-border text-xs text-secondary hover:text-primary hover:border-emerald-400/40 transition"
                    >
                      <FileDown size={12} /> {ex.type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </section>

        {compareIds.length > 0 && (
          <section className="p-6 rounded-3xl border border-border bg-card-bg/80 space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-[0.3em] text-secondary flex items-center gap-2">
                <GitBranch size={14} className="text-emerald-400" /> Compare ({compareIds.length}/2)
              </div>
              <button
                className="text-[11px] text-secondary hover:text-primary underline"
                onClick={() => setCompareIds([])}
              >
                Clear
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {compareIds.map((id) => {
                const design = DESIGNS.find((d) => d.id === id);
                if (!design) return null;
                return (
                  <div key={design.id} className="p-4 rounded-2xl border border-border bg-card-bg/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-serif font-bold text-primary">{design.name}</h4>
                      <span className="text-[10px] font-mono text-secondary">{design.scale}</span>
                    </div>
                    <p className="text-sm text-secondary">Underlay: {design.underlay}</p>
                    <p className="text-sm text-secondary">Overlay: {design.overlay}</p>
                    <p className="text-sm text-secondary">RT Schema: {design.rtSchema || 'N/A'}</p>
                    <p className="text-sm text-secondary">MTU: {design.mtuPlan || 'N/A'}</p>
                    <p className="text-sm text-secondary">EOS: {design.evidence.eosTrain}</p>
                    {design.evidence.avdVersion && <p className="text-sm text-secondary">AVD: {design.evidence.avdVersion}</p>}
                    <p className="text-sm text-secondary">Last Validated: {design.evidence.lastValidated}</p>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary mt-2">Top caveats</p>
                    <ul className="space-y-1 text-sm text-secondary">
                      {design.evidence.caveats.slice(0, 3).map((c) => (
                        <li key={c} className="flex gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <section className="p-6 rounded-3xl border border-border bg-card-bg/70 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-secondary">Workflow</p>
            <p className="text-sm text-secondary leading-relaxed">
              Select design → validate prerequisites → export AVD inventory → push to Protocol Lab for control-plane drill → capture Day-2 runbook.
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-secondary flex items-center gap-2">
              <RefreshCw size={14} className="text-emerald-400" /> Change Windows
            </p>
            <p className="text-sm text-secondary leading-relaxed">
              Pre-flight checks (MTU/RT/cert) → maintenance window guidance → rollback plan with config checkpoints.
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-secondary flex items-center gap-2">
              <ShieldCheck size={14} className="text-emerald-400" /> Evidence
            </p>
            <div className="text-sm text-secondary leading-relaxed space-y-2">
              {DESIGNS.map((d) => (
                <div key={d.id} className="p-3 rounded-2xl border border-border bg-card-bg/60">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-[0.2em]">{d.name}</span>
                    <span className="text-[10px] font-mono text-secondary">Last: {d.evidence.lastValidated}</span>
                  </div>
                  <p className="text-xs text-secondary mt-1">EOS: {d.evidence.eosTrain}{d.evidence.avdVersion ? ` · AVD ${d.evidence.avdVersion}` : ''}</p>
                  <div className="flex items-center gap-2 mt-2 text-[11px] text-emerald-400">
                    <GitBranch size={12} /> {d.evidence.source}
                    {d.evidence.url && (
                      <a href={d.evidence.url} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-primary inline-flex items-center gap-1">
                        Link <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
