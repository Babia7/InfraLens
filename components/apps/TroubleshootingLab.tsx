import React, { useState } from 'react';
import { ArrowLeft, AlertTriangle, CheckCircle2, ChevronDown, ChevronRight, Terminal, Wrench, ShieldAlert, Eye, RotateCcw, Trophy, BadgeCheck, Filter } from 'lucide-react';
import { TROUBLESHOOT_SCENARIOS, TroubleshootScenario, TroubleshootProtocol } from '@data/troubleshootContent';
import { SectionType } from '@/types';

interface TroubleshootingLabProps {
  onBack: () => void;
  onNavigate?: (section: SectionType) => void;
}

const SEVERITY_STYLE: Record<string, string> = {
  Critical: 'border-red-500/40 bg-red-500/10 text-red-400',
  High:     'border-amber-500/40 bg-amber-500/10 text-amber-400',
  Medium:   'border-blue-500/40 bg-blue-500/10 text-blue-400',
};

const PROTOCOL_COLOR: Record<string, string> = {
  EVPN:   'border-emerald-500/30 text-emerald-400',
  VXLAN:  'border-blue-500/30 text-blue-400',
  BGP:    'border-sky-500/30 text-sky-400',
  MLAG:   'border-amber-500/30 text-amber-400',
  Linux:  'border-cyan-500/30 text-cyan-400',
  QoS:    'border-orange-500/30 text-orange-400',
  MACsec: 'border-teal-500/30 text-teal-400',
};

const PROTOCOL_TAGS: Array<TroubleshootProtocol | 'All'> = ['All', 'EVPN', 'VXLAN', 'BGP', 'MLAG', 'Linux', 'QoS', 'MACsec'];

function ScenarioCard({
  scenario,
  isActive,
  isCompleted,
  onClick
}: {
  scenario: TroubleshootScenario;
  isActive: boolean;
  isCompleted: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border transition-all space-y-2 ${
        isActive
          ? 'border-blue-500/40 bg-blue-500/5'
          : 'border-border bg-card-bg/40 hover:border-border'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold text-primary leading-snug">{scenario.title}</div>
        </div>
        {isCompleted && <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />}
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded border ${PROTOCOL_COLOR[scenario.protocol]}`}>
          {scenario.protocol}
        </span>
        <span className={`text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded border ${SEVERITY_STYLE[scenario.severity]}`}>
          {scenario.severity}
        </span>
      </div>
    </button>
  );
}

function ScenarioDetail({
  scenario,
  isCompleted,
  onComplete
}: {
  scenario: TroubleshootScenario;
  isCompleted: boolean;
  onComplete: () => void;
}) {
  const [revealedSteps, setRevealedSteps] = useState<number>(0);
  const [showRootCause, setShowRootCause] = useState(false);

  const revealNextStep = () => {
    setRevealedSteps((n) => Math.min(n + 1, scenario.steps.length));
  };

  const allStepsRevealed = revealedSteps === scenario.steps.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 flex-wrap">
          <span className={`text-[9px] font-mono uppercase tracking-widest px-2 py-1 rounded border ${PROTOCOL_COLOR[scenario.protocol]}`}>
            {scenario.protocol}
          </span>
          <span className={`text-[9px] font-mono uppercase tracking-widest px-2 py-1 rounded border ${SEVERITY_STYLE[scenario.severity]}`}>
            {scenario.severity}
          </span>
        </div>
        <h2 className="text-xl font-bold text-primary leading-tight">{scenario.title}</h2>
      </div>

      {/* Symptom */}
      <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl space-y-2">
        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-red-400">
          <AlertTriangle size={13} /> Symptom
        </div>
        <p className="text-sm text-primary leading-relaxed">{scenario.symptom}</p>
      </div>

      {/* Context */}
      <div className="p-4 bg-card-bg/60 border border-border rounded-xl space-y-2">
        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-secondary">
          <Eye size={13} /> Environment Context
        </div>
        <p className="text-sm text-secondary leading-relaxed">{scenario.context}</p>
      </div>

      {/* Diagnosis Steps */}
      <div className="space-y-3">
        <div className="text-[10px] font-mono uppercase tracking-[0.35em] text-secondary flex items-center gap-2">
          <Terminal size={13} className="text-blue-400" /> Diagnosis Steps — reveal one at a time
        </div>

        {scenario.steps.map((step, idx) => {
          const revealed = idx < revealedSteps;
          return (
            <div
              key={idx}
              className={`rounded-xl border transition-all overflow-hidden ${
                revealed ? 'border-border bg-card-bg/50' : 'border-border/50 bg-page-bg/30 opacity-40'
              }`}
            >
              <div className="p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[10px] font-mono font-bold text-blue-400">
                    {idx + 1}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="text-sm font-semibold text-primary">{step.check}</div>
                    {revealed && (
                      <>
                        <div className="p-3 bg-surface-muted border border-border rounded-lg font-mono text-[11px] text-emerald-400 whitespace-pre-wrap">
                          {step.command}
                        </div>
                        <div className="grid md:grid-cols-2 gap-3 mt-2">
                          <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg space-y-1">
                            <div className="text-[9px] font-mono uppercase tracking-wider text-emerald-500">Expected</div>
                            <p className="text-xs text-primary leading-relaxed">{step.expected}</p>
                          </div>
                          <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg space-y-1">
                            <div className="text-[9px] font-mono uppercase tracking-wider text-amber-500">If Different</div>
                            <p className="text-xs text-primary leading-relaxed">{step.divergence}</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {!allStepsRevealed && (
          <button
            onClick={revealNextStep}
            className="w-full py-3 rounded-xl border border-blue-500/30 bg-blue-500/5 text-sm font-semibold text-blue-400 hover:bg-blue-500/10 transition flex items-center justify-center gap-2"
          >
            <ChevronDown size={16} /> Reveal Step {revealedSteps + 1} of {scenario.steps.length}
          </button>
        )}
      </div>

      {/* Root Cause + Fix — only show after all steps */}
      {allStepsRevealed && (
        <div className="space-y-4 animate-fade-in">
          <button
            onClick={() => setShowRootCause(!showRootCause)}
            className={`w-full p-4 rounded-xl border text-left transition-all space-y-1 ${
              showRootCause ? 'border-red-500/30 bg-red-500/5' : 'border-border bg-card-bg/50 hover:border-red-500/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-red-400">
                <ShieldAlert size={13} /> Root Cause
              </div>
              {showRootCause ? <ChevronDown size={14} className="text-secondary" /> : <ChevronRight size={14} className="text-secondary" />}
            </div>
            {showRootCause && (
              <p className="text-sm text-primary leading-relaxed mt-2">{scenario.rootCause}</p>
            )}
          </button>

          {showRootCause && (
            <>
              <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-emerald-400">
                  <Wrench size={13} /> Fix
                </div>
                <pre className="font-mono text-[11px] text-emerald-400 whitespace-pre-wrap leading-relaxed overflow-x-auto">{scenario.fix}</pre>
              </div>

              <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-blue-400">
                  <BadgeCheck size={13} /> Prevention
                </div>
                <p className="text-sm text-primary leading-relaxed">{scenario.prevention}</p>
              </div>

              {!isCompleted && (
                <button
                  onClick={onComplete}
                  className="w-full py-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-sm font-bold text-emerald-400 hover:bg-emerald-500/15 transition flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={16} /> Mark Scenario Complete
                </button>
              )}

              {isCompleted && (
                <div className="flex items-center justify-center gap-2 py-3 rounded-xl border border-emerald-500/30 text-emerald-500 text-sm font-semibold">
                  <Trophy size={16} /> Scenario mastered
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export const TroubleshootingLab: React.FC<TroubleshootingLabProps> = ({ onBack }) => {
  const [protocolFilter, setProtocolFilter] = useState<TroubleshootProtocol | 'All'>('All');
  const [activeId, setActiveId] = useState<string>(TROUBLESHOOT_SCENARIOS[0].id);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  const filtered = TROUBLESHOOT_SCENARIOS.filter(
    (s) => protocolFilter === 'All' || s.protocol === protocolFilter
  );

  const activeScenario = TROUBLESHOOT_SCENARIOS.find((s) => s.id === activeId) ?? TROUBLESHOOT_SCENARIOS[0];

  const completionPct = Math.round(
    (Object.values(completed).filter(Boolean).length / TROUBLESHOOT_SCENARIOS.length) * 100
  );

  const handleSelectScenario = (id: string) => {
    setActiveId(id);
  };

  return (
    <div className="min-h-screen bg-page-bg text-primary font-sans flex flex-col selection:bg-blue-500/30">
      {/* Header */}
      <header className="h-16 border-b border-border flex items-center justify-between px-8 bg-page-bg shrink-0 z-50">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="group p-2 text-secondary hover:text-primary transition-colors">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h1 className="text-sm font-bold uppercase tracking-wider">Troubleshooting Lab</h1>
              <span className="tool-label">Break-Fix Scenarios · 12 Field Cases</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest">
            {completionPct}% Complete · {Object.values(completed).filter(Boolean).length}/{TROUBLESHOOT_SCENARIOS.length}
          </div>
          <button
            onClick={() => setCompleted({})}
            className="p-1.5 text-secondary hover:text-secondary transition"
            title="Reset progress"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </header>

      <div className="flex-1 flex min-h-0">
        {/* Left sidebar: protocol filter + scenario list */}
        <aside className="w-72 shrink-0 border-r border-border bg-page-bg flex flex-col overflow-hidden">
          {/* Protocol filter */}
          <div className="p-4 border-b border-border space-y-2">
            <div className="flex items-center gap-2 text-[9px] font-mono uppercase tracking-[0.3em] text-secondary">
              <Filter size={11} /> Filter by Protocol
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PROTOCOL_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setProtocolFilter(tag)}
                  className={`text-[9px] font-mono uppercase tracking-wider px-2 py-1 rounded border transition-all ${
                    protocolFilter === tag
                      ? 'border-blue-500/50 bg-blue-500/10 text-blue-400'
                      : 'border-border text-secondary hover:border-border hover:text-primary'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Scenario list */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filtered.map((scenario) => (
              <ScenarioCard
                key={scenario.id}
                scenario={scenario}
                isActive={activeId === scenario.id}
                isCompleted={!!completed[scenario.id]}
                onClick={() => handleSelectScenario(scenario.id)}
              />
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-8 text-secondary text-sm">No scenarios for this filter.</div>
            )}
          </div>
        </aside>

        {/* Main scenario detail */}
        <main className="flex-1 overflow-y-auto p-8 md:p-12">
          <div className="max-w-3xl mx-auto">
            <ScenarioDetail
              key={activeScenario.id}
              scenario={activeScenario}
              isCompleted={!!completed[activeScenario.id]}
              onComplete={() => setCompleted((prev) => ({ ...prev, [activeScenario.id]: true }))}
            />
          </div>
        </main>

        {/* Right: progress sidebar */}
        <aside className="w-56 shrink-0 border-l border-border bg-page-bg p-4 space-y-4 hidden xl:block overflow-y-auto">
          <div className="text-[9px] font-mono uppercase tracking-[0.3em] text-secondary flex items-center gap-2">
            <Trophy size={11} className="text-amber-500" /> Progress
          </div>

          {/* Overall progress bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[9px] text-secondary">
              <span>Field Ready</span>
              <span className="text-emerald-400">{completionPct}%</span>
            </div>
            <div className="h-1.5 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${completionPct}%` }}
              />
            </div>
          </div>

          {/* Per-protocol progress */}
          <div className="space-y-2 mt-4">
            {(['EVPN', 'VXLAN', 'BGP', 'MLAG', 'Linux', 'QoS', 'MACsec'] as TroubleshootProtocol[]).map((proto) => {
              const total = TROUBLESHOOT_SCENARIOS.filter((s) => s.protocol === proto).length;
              const done = TROUBLESHOOT_SCENARIOS.filter((s) => s.protocol === proto && completed[s.id]).length;
              return (
                <div key={proto} className="space-y-1">
                  <div className="flex justify-between text-[9px]">
                    <span className={`font-mono uppercase ${PROTOCOL_COLOR[proto].split(' ')[1]}`}>{proto}</span>
                    <span className="text-secondary">{done}/{total}</span>
                  </div>
                  <div className="h-1 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-secondary rounded-full transition-all"
                      style={{ width: total > 0 ? `${(done / total) * 100}%` : '0%' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tips */}
          <div className="mt-6 p-3 bg-card-bg/60 border border-border rounded-xl space-y-2">
            <div className="text-[9px] font-mono uppercase tracking-[0.3em] text-secondary">Field Tips</div>
            <ul className="text-[10px] text-secondary space-y-2">
              <li>• Reveal steps one by one — diagnose before reading the answer.</li>
              <li>• Root cause unlocks only after all steps are shown.</li>
              <li>• Complete all in a domain for field readiness.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};
