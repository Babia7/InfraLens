import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle, ChevronDown, ChevronRight, Shield, Terminal, RefreshCw, Target, XCircle } from 'lucide-react';
import { BROWNFIELD_PATTERNS, MigrationPattern, MigrationRisk } from '@data/brownfieldContent';
import { SectionType } from '@/types';

interface BrownfieldMigrationProps {
  onBack: () => void;
  onNavigate?: (section: SectionType) => void;
}

const RISK_STYLE: Record<MigrationRisk, string> = {
  Low:    'border-emerald-500/30 bg-emerald-500/5 text-emerald-400',
  Medium: 'border-amber-500/30 bg-amber-500/5 text-amber-400',
  High:   'border-red-500/30 bg-red-500/5 text-red-400',
};

const RISK_DOT: Record<MigrationRisk, string> = {
  Low:    'bg-emerald-400',
  Medium: 'bg-amber-400',
  High:   'bg-red-400',
};

function PatternSelector({
  patterns,
  activeId,
  onSelect
}: {
  patterns: MigrationPattern[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {patterns.map((p) => (
        <button
          key={p.id}
          onClick={() => onSelect(p.id)}
          className={`text-left p-5 rounded-2xl border transition-all space-y-3 ${
            activeId === p.id
              ? 'border-blue-500/40 bg-blue-500/5'
              : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700'
          }`}
        >
          <div className="space-y-1">
            <div className="text-xs font-bold text-zinc-200 leading-snug">{p.title}</div>
            <div className="text-[11px] text-zinc-500 leading-relaxed">{p.useCase}</div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded border ${RISK_STYLE[p.totalRisk]}`}>
              {p.totalRisk} Risk
            </span>
            <span className="text-[9px] text-zinc-600 font-mono">{p.estimatedPhases} phases</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-zinc-600">
            <span className="text-zinc-700">{p.from}</span>
            <ArrowRight size={10} className="shrink-0 text-zinc-600" />
            <span className="text-blue-400/70">{p.to.split(' ')[0]}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

function PhaseDetail({ phase }: { phase: MigrationPattern['phases'][number] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`rounded-2xl border transition-all ${RISK_STYLE[phase.risk]} overflow-hidden`}>
      <button
        className="w-full text-left p-5 flex items-start gap-4"
        onClick={() => setExpanded(!expanded)}
      >
        <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border ${RISK_STYLE[phase.risk]}`}>
          {phase.phase}
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-bold text-zinc-200">{phase.title}</span>
            <span className={`text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded border ${RISK_STYLE[phase.risk]}`}>
              {phase.risk} Risk
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 leading-relaxed">{phase.objective}</p>
        </div>
        {expanded ? <ChevronDown size={16} className="text-zinc-500 shrink-0 mt-1" /> : <ChevronRight size={16} className="text-zinc-500 shrink-0 mt-1" />}
      </button>

      {expanded && (
        <div className="border-t border-zinc-800 p-5 space-y-6">

          {/* Steps */}
          <div className="space-y-3">
            <div className="text-[9px] font-mono uppercase tracking-[0.35em] text-zinc-500 flex items-center gap-2">
              <Target size={11} className="text-blue-400" /> Steps
            </div>
            <ol className="space-y-2">
              {phase.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="shrink-0 text-[9px] font-mono text-zinc-600 mt-0.5 w-4">{i + 1}.</span>
                  <span className="text-xs text-zinc-300 leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Validation */}
          <div className="space-y-3">
            <div className="text-[9px] font-mono uppercase tracking-[0.35em] text-zinc-500 flex items-center gap-2">
              <Terminal size={11} className="text-emerald-400" /> Validation
            </div>
            <div className="space-y-2">
              {phase.validation.map((v, i) => (
                <div key={i} className="p-3 bg-zinc-950/60 border border-zinc-800 rounded-xl space-y-2">
                  <div className="font-mono text-[11px] text-emerald-400">{v.command}</div>
                  <div className="text-[11px] text-zinc-400 leading-relaxed">
                    <span className="text-zinc-600 mr-1">→</span>{v.expectedResult}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rollback */}
          <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl space-y-2">
            <div className="text-[9px] font-mono uppercase tracking-[0.35em] text-amber-500 flex items-center gap-2">
              <RefreshCw size={11} /> Rollback Procedure
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">{phase.rollback}</p>
          </div>

          {/* Success Criteria */}
          <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl space-y-2">
            <div className="text-[9px] font-mono uppercase tracking-[0.35em] text-emerald-500 flex items-center gap-2">
              <CheckCircle2 size={11} /> Success Criteria
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">{phase.successCriteria}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function PatternDetail({ pattern }: { pattern: MigrationPattern }) {
  return (
    <div className="space-y-8">
      {/* Overview */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[9px] font-mono uppercase tracking-widest px-2 py-1 rounded border border-zinc-700 text-zinc-500">
            {pattern.from}
          </span>
          <ArrowRight size={12} className="text-blue-400" />
          <span className="text-[9px] font-mono uppercase tracking-widest px-2 py-1 rounded border border-blue-500/30 text-blue-400">
            {pattern.to}
          </span>
        </div>
        <h2 className="text-xl font-bold text-white">{pattern.title}</h2>
        <p className="text-sm text-zinc-400 leading-relaxed">{pattern.overview}</p>

        <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
          <div className="text-[9px] font-mono uppercase tracking-[0.35em] text-blue-400 mb-2">Key Principle</div>
          <p className="text-sm text-zinc-300 leading-relaxed italic">"{pattern.keyPrinciple}"</p>
        </div>
      </div>

      {/* Phases */}
      <div className="space-y-3">
        <div className="text-[9px] font-mono uppercase tracking-[0.35em] text-zinc-500">
          Migration Phases — click to expand each
        </div>
        {pattern.phases.map((phase) => (
          <PhaseDetail key={phase.phase} phase={phase} />
        ))}
      </div>

      {/* Anti-patterns */}
      <div className="space-y-3">
        <div className="text-[9px] font-mono uppercase tracking-[0.35em] text-zinc-500 flex items-center gap-2">
          <XCircle size={11} className="text-red-400" /> Anti-patterns to Avoid
        </div>
        <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl space-y-3">
          {pattern.antiPatterns.map((ap, i) => (
            <div key={i} className="flex items-start gap-3">
              <AlertTriangle size={13} className="text-red-400 shrink-0 mt-0.5" />
              <p className="text-xs text-zinc-300 leading-relaxed">{ap}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Key Tools */}
      <div className="space-y-3">
        <div className="text-[9px] font-mono uppercase tracking-[0.35em] text-zinc-500 flex items-center gap-2">
          <Shield size={11} className="text-emerald-400" /> Key Tools
        </div>
        <div className="flex flex-wrap gap-2">
          {pattern.keyTools.map((tool) => (
            <span key={tool} className="text-[10px] font-mono px-2.5 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/50 text-zinc-400">
              {tool}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export const BrownfieldMigration: React.FC<BrownfieldMigrationProps> = ({ onBack }) => {
  const [activeId, setActiveId] = useState<string>(BROWNFIELD_PATTERNS[0].id);
  const activePattern = BROWNFIELD_PATTERNS.find((p) => p.id === activeId) ?? BROWNFIELD_PATTERNS[0];

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col selection:bg-blue-500/30">
      {/* Header */}
      <header className="h-16 border-b border-zinc-800 flex items-center gap-6 px-8 bg-zinc-950 shrink-0">
        <button onClick={onBack} className="group p-2 text-zinc-500 hover:text-white transition-colors">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        </button>
        <div className="h-4 w-px bg-zinc-800" />
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400">
            <RefreshCw size={20} />
          </div>
          <div>
            <h1 className="text-sm font-bold uppercase tracking-wider">Brownfield Migration Playbook</h1>
            <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Cisco → Arista · Phase-by-Phase · Rollback at Every Step</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-8 md:p-12">
        <div className="max-w-5xl mx-auto space-y-8">

          {/* Pattern selector */}
          <PatternSelector patterns={BROWNFIELD_PATTERNS} activeId={activeId} onSelect={setActiveId} />

          {/* Divider */}
          <div className="border-t border-zinc-800" />

          {/* Active pattern detail */}
          <PatternDetail pattern={activePattern} />
        </div>
      </main>
    </div>
  );
};
