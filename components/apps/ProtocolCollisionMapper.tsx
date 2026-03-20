import React, { useMemo, useState } from 'react';
import { ArrowLeft, AlertTriangle, Network, GitBranch, Shield, RefreshCw, Activity, Target, CheckCircle2 } from 'lucide-react';
import { SectionType } from '@/types';

interface ProtocolCollisionMapperProps {
  onBack: () => void;
  onNavigate?: (section: SectionType) => void;
}

type CollisionScenario = {
  id: string;
  title: string;
  description: string;
  signals: string[];
  mitigations: string[];
  detection: string[];
  preventive?: string[];
  references?: { title: string; url?: string }[];
  severity: 'High' | 'Medium' | 'Low';
};

const SCENARIOS: CollisionScenario[] = [
  {
    id: 'mlag-bgp-nexthop',
    title: 'BGP Next-Hop-Self Conflict Across MLAG Peer',
    description: 'MLAG peers advertising different next-hops for the same prefix cause asymmetric return paths. Traffic enters via leaf-A but returns via leaf-B, creating asymmetric flows that violate stateful inspection policies and confuse ECMP hash behavior.',
    signals: [
      'Asymmetric traffic flows (in via one leaf, out via peer)',
      'Stateful firewall or NAT inspection failures',
      'show ip route showing different next-hops per leaf for same prefix'
    ],
    detection: [
      'show bgp neighbors <peer> advertised-routes | incl <prefix>',
      'show ip route <prefix> detail (compare both MLAG peers)',
      'show mlag — confirm peer-link is UP and consistent'
    ],
    preventive: [
      'Consistent next-hop-self policy on both MLAG peers',
      'Use MLAG shared VTEP loopback — same loopback IP/MAC on both peers',
      'Validate BGP route advertisements match on both peers before cutover'
    ],
    mitigations: [
      'Add next-hop-self to both MLAG peer BGP sessions',
      'Use shared MLAG VTEP (same loopback IP/MAC on both peers)',
      'Verify: show bgp ipv4 unicast neighbors <spine> advertised-routes'
    ],
    references: [
      { title: 'EOS MLAG BGP configuration guide' },
      { title: 'EVPN MLAG VTEP shared loopback design' }
    ],
    severity: 'High'
  },
  {
    id: 'vlan-vni-mismatch',
    title: 'VLAN/VNI Mapping Mismatch (Black-Hole)',
    description: 'Inconsistent VLAN-to-VNI mappings between VTEPs create silent black-holes at fabric boundaries. Traffic encapsulated with VNI 10100 by leaf-A is dropped or mis-delivered by leaf-B if their mapping tables differ.',
    signals: [
      'MAC reachability present in BGP EVPN table but hosts unreachable',
      'Traffic drops at VXLAN decap without interface errors',
      'show vxlan address-table showing MACs with wrong VNI associations'
    ],
    detection: [
      'show vxlan vni (compare across all VTEPs — all must agree)',
      'show bgp evpn mac-ip | grep <MAC> (check VNI in RT-2 route)',
      'show interfaces Vxlan1 (confirm VNI-to-VLAN assignments)'
    ],
    preventive: [
      'Centralize VLAN-to-VNI mapping in AVD inventory — single source of truth',
      'Run show vxlan config-sanity detail after any VLAN change',
      'Use CloudVision compliance check to detect VNI inconsistencies across fabric'
    ],
    mitigations: [
      'Correct VNI mapping: interface Vxlan1 → vxlan vlan <X> vni <Y>',
      'Force RT-2 re-advertisement: clear bgp evpn <peer> soft',
      'Validate: show bgp evpn mac-ip — VNI must match on all leaves'
    ],
    references: [
      { title: 'EOS EVPN/VXLAN configuration guide' },
      { title: 'AVD VXLAN VNI consistency checks' }
    ],
    severity: 'High'
  },
  {
    id: 'mtu-mismatch-cascade',
    title: 'MTU Mismatch Cascades (VXLAN Overlay)',
    description: 'VXLAN adds 50 bytes of overhead per frame. If the underlay MTU is 1500 bytes, VXLAN-encapsulated frames exceeding 1450 bytes are silently dropped, causing application timeouts with no interface error counters.',
    signals: [
      'Application timeouts or data truncation at specific payload sizes',
      'Ping with large payloads fails, small payloads succeed',
      'VXLAN tunnels UP but TCP sessions stall after handshake'
    ],
    detection: [
      'ping <VTEP-IP> size 1550 df-bit — should FAIL if underlay MTU < 1600',
      'show interfaces <uplink> | grep MTU (must be ≥ 9214 for VXLAN)',
      'show ip route <VTEP-loopback> detail — verify next-hop MTU'
    ],
    preventive: [
      'Set underlay MTU to 9214 on all leaf-spine links at fabric build time',
      'Run show vxlan config-sanity detail — MTU check included',
      'Include MTU in CloudVision compliance template; alert on drift'
    ],
    mitigations: [
      'Set interface MTU: interface Ethernet<n> → mtu 9214 (all spine-facing links)',
      'Verify: ping <remote-VTEP> size 8972 df-bit must succeed end-to-end',
      'EOS: ip mtu is inherited from physical MTU on routed interfaces — check both'
    ],
    references: [
      { title: 'Arista VXLAN MTU planning guide' },
      { title: 'EOS VXLAN config-sanity checks' }
    ],
    severity: 'High'
  },
  {
    id: 'pfc-wrong-queue',
    title: 'PFC Pause on Wrong Queue Class',
    description: 'PFC is configured for a lossless queue (e.g., queue 3 for RoCE), but interactive traffic shares the same queue class. A storage burst triggers PFC PAUSE frames that freeze management and SSH sessions — blocking operator visibility during the incident.',
    signals: [
      'SSH sessions stall or disconnect during storage bursts',
      'CloudVision polling gaps aligning with storage throughput spikes',
      'show interfaces counters pfc showing PAUSE on unexpected queues'
    ],
    detection: [
      'show qos interface <port> — verify traffic class assignments',
      'show interfaces counters pfc — identify which queues generate PAUSE',
      'Correlate PFC PAUSE timestamps with application impact timeline'
    ],
    preventive: [
      'Isolate RoCE/storage into dedicated DSCP-mapped queue (e.g., DSCP 26 → queue 3)',
      'Ensure management/interactive traffic maps to a separate queue with no PFC',
      'Apply PFC watchdog to prevent deadlock: pfc watchdog interval 100 action drop'
    ],
    mitigations: [
      'Reclassify: management in queue 0 (no PFC), RoCE in queue 3 (PFC enabled)',
      'Verify DSCP→queue mapping: show qos maps — all classes in correct queues',
      'EOS: configure pfc-watchdog and verify show pfc watchdog status shows no deadlock'
    ],
    references: [
      { title: 'EOS QoS configuration guide for RoCEv2' },
      { title: 'Arista PFC watchdog design' }
    ],
    severity: 'High'
  },
  {
    id: 'evpn-type5-type2-conflict',
    title: 'EVPN Type-5 vs Type-2 Route Preference Conflict',
    description: 'When both an RT-2 (MAC/IP host route) and an RT-5 (IP prefix route) exist for the same IP, misconfigured preference ordering can cause host mobility failures — a host appears reachable in BGP but traffic routes via the wrong VTEP.',
    signals: [
      'Host unreachable after live VM migration to a new leaf',
      'BGP EVPN shows RT-2 for host but traffic follows RT-5 to wrong location',
      'Asymmetric MAC/IP visibility between leaf switches'
    ],
    detection: [
      'show bgp evpn mac-ip <host-IP> — check if RT-2 is the active route',
      'show ip route vrf <tenant> <host-IP> — verify next-hop points to local VTEP',
      'show bgp evpn route-type ip-prefix — check for overlapping RT-5 with higher preference'
    ],
    preventive: [
      'Use distinct RT schemas for L2 (10:VNI) and L3 (50:VNI) to avoid RT-2/RT-5 ambiguity',
      'Do not redistribute /32 host routes into EVPN as RT-5 if already present as RT-2',
      'Validate RT import/export policy: each VRF should prefer RT-2 for host /32 routes'
    ],
    mitigations: [
      'Clear stale RT-5: clear bgp evpn <vtep> soft (forces RT-2 re-advertisement)',
      'Verify: show bgp evpn summary — confirm RT-2 preferred over RT-5 for /32',
      'EOS: use ip prefix-list to filter /32 host prefixes from RT-5 redistribution'
    ],
    references: [
      { title: 'EVPN RT-2 vs RT-5 preference model (RFC 7432)' },
      { title: 'EOS EVPN host mobility configuration' }
    ],
    severity: 'Medium'
  },
  {
    id: 'ospf-bgp-loop',
    title: 'OSPF ↔ BGP Redistribution Loop',
    description: 'Mutual redistribution with mismatched tagging causes routes to loop between OSPF and BGP, inflating the RIB and triggering flaps.',
    signals: [
      'Excessive RIB churn / SPF runs',
      'Routes with unexpected tags reappearing',
      'Adjacency resets during redistribution'
    ],
    detection: [
      'show bgp ipv4 unicast | incl tag',
      'show ip route ospf | include tag',
      'Diff IMET/RT-2 visibility between peers'
    ],
    preventive: [
      'Single direction redistribution with default-origination',
      'Strict tag policy per domain (e.g., 42000-42999)',
      'Summaries at boundaries; avoid leaking specifics'
    ],
    mitigations: [
      'Use route-maps with explicit tag filtering',
      'Redistribute only summarized prefixes',
      'Prefer one-way redistribution with defaults'
    ],
    references: [
      { title: 'EVPN RT schema discipline' },
      { title: 'OSPF ↔ BGP redistribution best practices' }
    ],
    severity: 'High'
  },
  {
    id: 'default-infection',
    title: 'Default Route Infection',
    description: 'Default leaked from edge into core, reflected back via iBGP to OSPF areas, hijacking traffic paths.',
    signals: [
      'Default shows up in unexpected areas',
      'Asymmetric flows / suboptimal egress',
      'Spike in traffic through aggregation nodes'
    ],
    detection: [
      'show ip route 0.0.0.0/0 detail (tag/next-hop)',
      'Flow paths shifting between exits',
      'Monitor default-origination nodes for stability'
    ],
    preventive: [
      'Pin default to designated nodes with policy',
      'Communities on defaults; filter elsewhere',
      'Use next-hop-self + tag discipline'
    ],
    mitigations: [
      'Pin default-origination to trusted nodes',
      'Set communities on defaults; filter elsewhere',
      'Use next-hop-self discipline and tags'
    ],
    severity: 'Medium'
  },
  {
    id: 'community-collision',
    title: 'Community Collision',
    description: 'Overlapping communities used for policy and redistribution triggers unintended matches when routes cross domains.',
    signals: [
      'Policies matching broader than intended',
      'Unexpected prepends/local-pref changes',
      'Routes oscillating between exit points'
    ],
    detection: [
      'Policy hit-counts on community matches',
      'Unexpected local-pref/prepend on inbound routes',
      'Communities overlapping between domains'
    ],
    preventive: [
      'Namespace communities per domain (e.g., 65001:*)',
      'Strip/normalize at boundaries',
      'Reserve bits for fabric vs edge vs transit'
    ],
    mitigations: [
      'Namespace communities per domain',
      'Strip/normalize at boundaries',
      'Document reserved bits for fabric vs. edge'
    ],
    references: [
      { title: 'Community design guide' }
    ],
    severity: 'Medium'
  }
];

export const ProtocolCollisionMapper: React.FC<ProtocolCollisionMapperProps> = ({ onBack, onNavigate }) => {
  const [selected, setSelected] = useState<CollisionScenario>(SCENARIOS[0]);

  const severityColor = useMemo(() => {
    switch (selected.severity) {
      case 'High': return 'text-rose-400 border-rose-400/40';
      case 'Medium': return 'text-amber-400 border-amber-400/40';
      default: return 'text-emerald-400 border-emerald-400/40';
    }
  }, [selected.severity]);

  return (
    <div className="min-h-screen bg-page-bg text-primary font-sans flex flex-col">
      <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-card-bg/80 backdrop-blur z-20">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="group p-2 text-secondary hover:text-primary transition-colors">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400">
              <GitBranch size={18} />
            </div>
            <div>
              <h1 className="font-serif font-bold text-lg tracking-tight leading-none">Protocol Collision Mapper</h1>
              <span className="text-[10px] font-mono text-secondary uppercase tracking-widest mt-1 block">Config → Interaction Analysis</span>
            </div>
          </div>
        </div>
        {onNavigate && (
          <button
            onClick={() => onNavigate(SectionType.PROTOCOLS)}
            className="text-[10px] font-mono uppercase tracking-[0.3em] text-emerald-400 hover:text-primary"
          >
            Open Protocol Lab →
          </button>
        )}
      </header>

      <main className="flex-1 p-6 md:p-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-1 space-y-3">
          {SCENARIOS.map((sc) => (
            <button
              key={sc.id}
              onClick={() => setSelected(sc)}
              className={`w-full text-left p-4 rounded-2xl border ${selected.id === sc.id ? 'border-emerald-400/40 bg-card-bg' : 'border-border bg-card-bg/60 hover:border-emerald-300/30'} transition`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono uppercase tracking-widest text-secondary">{sc.title}</span>
                <Activity size={14} className="text-emerald-400" />
              </div>
              <p className="text-sm text-secondary leading-relaxed line-clamp-3">{sc.description}</p>
            </button>
          ))}
        </section>

        <section className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-3xl border border-border bg-card-bg">
            <div className="flex items-center gap-3 mb-4">
              <div className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest ${severityColor}`}>
                Severity: {selected.severity}
              </div>
              <div className="flex items-center gap-2 text-secondary text-[10px] uppercase tracking-[0.3em]">
                <AlertTriangle size={14} className="text-amber-400" /> Conflict Signal Map
              </div>
            </div>
            <p className="text-lg text-primary font-semibold mb-4">{selected.title}</p>
            <p className="text-secondary text-sm leading-relaxed">{selected.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="p-4 rounded-2xl border border-border bg-card-bg/60">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-secondary mb-2">
                    <Network size={14} className="text-blue-400" /> Signals
                  </div>
                  <ul className="space-y-2">
                    {selected.signals.map((s) => (
                      <li key={s} className="flex gap-2 text-sm text-secondary">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-1">Detection</p>
                    <ul className="space-y-2">
                      {selected.detection.map((d) => (
                        <li key={d} className="flex gap-2 text-sm text-secondary">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="p-4 rounded-2xl border border-border bg-card-bg/60">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-secondary mb-2">
                    <Shield size={14} className="text-emerald-400" /> Mitigations
                  </div>
                  <ul className="space-y-2">
                    {selected.mitigations.map((m) => (
                      <li key={m} className="flex gap-2 text-sm text-secondary">
                        <CheckCircle2 size={14} className="text-emerald-400 mt-0.5" />
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                  {selected.preventive && (
                    <div className="mt-3">
                      <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-1">Preventive</p>
                      <ul className="space-y-2">
                        {selected.preventive.map((p) => (
                          <li key={p} className="flex gap-2 text-sm text-secondary">
                            <CheckCircle2 size={14} className="text-emerald-400 mt-0.5" />
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

          <div className="p-5 rounded-2xl border border-border bg-card-bg/70 flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-secondary mb-2">
                <RefreshCw size={14} className="text-cyan-400" /> Recommended Flow
              </div>
              <p className="text-sm text-secondary leading-relaxed">
                1) Inventory redistribution points → 2) Tag discipline check → 3) Boundary filters on defaults/communities →
                4) Summaries where possible → 5) Simulate path impact before enabling.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-secondary">
              <Target size={14} className="text-emerald-400" /> Outcome: Stable policy convergence
            </div>
          </div>

          {selected.references && selected.references.length > 0 && (
            <div className="p-4 rounded-2xl border border-border bg-card-bg/60">
              <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-2">References</p>
              <ul className="space-y-1">
                {selected.references.map((ref) => (
                  <li key={ref.title} className="text-sm text-secondary flex gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5" />
                    {ref.url ? <a href={ref.url} target="_blank" rel="noreferrer" className="text-primary hover:text-emerald-400">{ref.title}</a> : ref.title}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
