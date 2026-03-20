import React, { useState } from 'react';
import { ArrowLeft, Activity, AlertTriangle, Shield, Eye, Zap, Server } from 'lucide-react';
import { AI_TRAFFIC_PATTERNS, AITrafficPattern, FabricRisk } from '@data/aiTrafficPatterns';

interface AITrafficPatternExplorerProps {
  onBack: () => void;
}

const RISK_COLOR: Record<FabricRisk, string> = {
  Critical: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
  High: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  Medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  Low: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
};

const CATEGORY_COLOR: Record<string, string> = {
  Collective: 'text-violet-400 border-violet-400/30 bg-violet-500/10',
  Parallel: 'text-blue-400 border-blue-400/30 bg-blue-500/10',
  Storage: 'text-cyan-400 border-cyan-400/30 bg-cyan-500/10',
  Control: 'text-emerald-400 border-emerald-400/30 bg-emerald-500/10'
};

export const AITrafficPatternExplorer: React.FC<AITrafficPatternExplorerProps> = ({ onBack }) => {
  const [selected, setSelected] = useState<AITrafficPattern>(AI_TRAFFIC_PATTERNS[0]);
  const [activeTab, setActiveTab] = useState<'risks' | 'design' | 'ops'>('risks');

  return (
    <div className="min-h-screen bg-page-bg text-primary font-sans flex flex-col">
      <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-card-bg/80 backdrop-blur z-20">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="group p-2 text-secondary hover:text-primary transition-colors">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-500/10 border border-violet-500/30 rounded-lg text-violet-400">
              <Activity size={18} />
            </div>
            <div>
              <h1 className="font-serif font-bold text-lg tracking-tight leading-none">AI Traffic Pattern Explorer</h1>
              <span className="text-[10px] font-mono text-secondary uppercase tracking-widest mt-1 block">Workload → Fabric Risk → Design Response</span>
            </div>
          </div>
        </div>
        <div className="text-[10px] font-mono text-secondary uppercase tracking-widest">
          {AI_TRAFFIC_PATTERNS.length} Patterns · Vault: AI Traffic Pattern Atlas
        </div>
      </header>

      <main className="flex-1 p-6 md:p-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pattern list */}
        <section className="lg:col-span-1 space-y-2">
          <p className="text-[10px] font-mono text-secondary uppercase tracking-widest mb-3">Patterns</p>
          {AI_TRAFFIC_PATTERNS.map((p) => (
            <button
              key={p.id}
              onClick={() => { setSelected(p); setActiveTab('risks'); }}
              className={`w-full text-left p-4 rounded-2xl border transition ${
                selected.id === p.id
                  ? 'border-violet-400/40 bg-card-bg'
                  : 'border-border bg-card-bg/60 hover:border-violet-300/30'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-primary">{p.name}</span>
                <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${CATEGORY_COLOR[p.category]}`}>
                  {p.category}
                </span>
              </div>
              <p className="text-xs text-secondary leading-relaxed line-clamp-2">{p.description}</p>
              <div className="flex gap-1 mt-2 flex-wrap">
                {p.fabricRisks.slice(0, 2).map((r) => (
                  <span key={r.risk} className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${RISK_COLOR[r.severity]}`}>
                    {r.severity}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </section>

        {/* Detail panel */}
        <section className="lg:col-span-2 space-y-4">
          {/* Header card */}
          <div className="p-6 rounded-3xl border border-border bg-card-bg">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${CATEGORY_COLOR[selected.category]}`}>
                    {selected.category}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-primary">{selected.name}</h2>
              </div>
            </div>
            <p className="text-secondary text-sm leading-relaxed mb-4">{selected.description}</p>

            <div className="p-4 rounded-2xl border border-border bg-card-bg/50">
              <p className="text-[10px] font-mono text-secondary uppercase tracking-widest mb-2">Traffic Signature</p>
              <p className="text-sm text-primary leading-relaxed">{selected.trafficSignature}</p>
            </div>

            {selected.whereItShowsUp.length > 0 && (
              <div className="mt-4">
                <p className="text-[10px] font-mono text-secondary uppercase tracking-widest mb-2">Where It Shows Up</p>
                <ul className="space-y-1">
                  {selected.whereItShowsUp.map((w) => (
                    <li key={w} className="flex gap-2 text-sm text-secondary">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 shrink-0" />
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-border pb-0">
            {(['risks', 'design', 'ops'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-xs font-mono uppercase tracking-widest transition border-b-2 -mb-px ${
                  activeTab === tab
                    ? 'text-primary border-violet-400'
                    : 'text-secondary border-transparent hover:text-primary'
                }`}
              >
                {tab === 'risks' ? 'Fabric Risks' : tab === 'design' ? 'Design Response' : 'Ops Watch'}
              </button>
            ))}
          </div>

          {activeTab === 'risks' && (
            <div className="space-y-3">
              {selected.fabricRisks.map((r) => (
                <div key={r.risk} className={`p-4 rounded-2xl border flex items-start gap-3 ${RISK_COLOR[r.severity]}`}>
                  <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <span className={`text-[9px] font-bold uppercase tracking-widest mr-2`}>{r.severity}</span>
                    <span className="text-sm">{r.risk}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'design' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl border border-border bg-card-bg/60">
                <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-widest text-secondary">
                  <Zap size={14} className="text-violet-400" /> Load Balancing
                </div>
                <p className="text-sm text-secondary leading-relaxed">{selected.designResponses.loadBalancing}</p>
              </div>
              <div className="p-4 rounded-2xl border border-border bg-card-bg/60">
                <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-widest text-secondary">
                  <Server size={14} className="text-blue-400" /> Buffer Strategy
                </div>
                <p className="text-sm text-secondary leading-relaxed">{selected.designResponses.bufferStrategy}</p>
              </div>
              <div className="p-4 rounded-2xl border border-border bg-card-bg/60">
                <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-widest text-secondary">
                  <Activity size={14} className="text-amber-400" /> ECN Thresholds
                </div>
                <p className="text-sm text-secondary leading-relaxed">{selected.designResponses.ecnThresholds}</p>
              </div>
              <div className="p-4 rounded-2xl border border-border bg-card-bg/60">
                <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-widest text-secondary">
                  <Shield size={14} className="text-emerald-400" /> Topology Requirements
                </div>
                <p className="text-sm text-secondary leading-relaxed">{selected.designResponses.topologyRequirements}</p>
              </div>
            </div>
          )}

          {activeTab === 'ops' && (
            <div className="p-5 rounded-2xl border border-border bg-card-bg">
              <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-widest text-secondary">
                <Eye size={14} className="text-cyan-400" /> Operational Watch Points
              </div>
              <ul className="space-y-3">
                {selected.operationalWatchPoints.map((w) => (
                  <li key={w} className="flex gap-3 text-sm text-secondary">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
              {selected.seNote && (
                <div className="mt-5 p-4 rounded-2xl border border-amber-400/20 bg-amber-500/5">
                  <p className="text-[10px] font-mono text-amber-400 uppercase tracking-widest mb-1">SE Field Note</p>
                  <p className="text-sm text-secondary leading-relaxed">{selected.seNote}</p>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
