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
