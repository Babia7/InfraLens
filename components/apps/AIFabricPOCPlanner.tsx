import React, { useState, useMemo } from 'react';
import { ArrowLeft, ClipboardCheck, ChevronDown, ChevronRight, Download, CheckSquare, Square, AlertTriangle, Terminal } from 'lucide-react';
import { POC_PHASES, POCPhase, POCTest, POC_BRIEF_TEMPLATE } from '@data/pocValidation';

interface AIFabricPOCPlannerProps {
  onBack: () => void;
}

export const AIFabricPOCPlanner: React.FC<AIFabricPOCPlannerProps> = ({ onBack }) => {
  const [selectedPhase, setSelectedPhase] = useState<POCPhase>(POC_PHASES[0]);
  const [selectedTest, setSelectedTest] = useState<POCTest>(POC_PHASES[0].tests[0]);
  const [completedTests, setCompletedTests] = useState<Set<string>>(new Set());
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set(['control-plane']));
  const [showBrief, setShowBrief] = useState(false);

  const toggleTest = (testId: string) => {
    const next = new Set(completedTests);
    if (next.has(testId)) next.delete(testId);
    else next.add(testId);
    setCompletedTests(next);
  };

  const togglePhaseExpanded = (phaseId: string) => {
    const next = new Set(expandedPhases);
    if (next.has(phaseId)) next.delete(phaseId);
    else next.add(phaseId);
    setExpandedPhases(next);
  };

  const allTests = useMemo(() => POC_PHASES.flatMap((p) => p.tests), []);
  const progress = Math.round((completedTests.size / allTests.length) * 100);

  const CATEGORY_COLOR: Record<string, string> = {
    'Control Plane': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    'QoS & Queue': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    'Load Balancing': 'text-violet-400 bg-violet-500/10 border-violet-500/20',
    'Congestion': 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    'Negative Tests': 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    'Recovery': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
  };

  return (
    <div className="min-h-screen bg-page-bg text-primary font-sans flex flex-col">
      <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-card-bg/80 backdrop-blur z-20">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="group p-2 text-secondary hover:text-primary transition-colors">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400">
              <ClipboardCheck size={18} />
            </div>
            <div>
              <h1 className="app-header-title">AI Fabric POC Planner</h1>
              <span className="app-header-subtitle">Proof Framework · Vault: AI Fabric POC Validation Workflow</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-24 bg-card-bg rounded-full border border-border">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs font-mono text-secondary">{completedTests.size}/{allTests.length} tests</span>
          </div>
          <button
            onClick={() => setShowBrief(!showBrief)}
            className="px-3 py-1.5 border border-border text-xs font-mono uppercase tracking-widest text-secondary hover:text-primary rounded-xl transition"
          >
            {showBrief ? 'Back to Tests' : 'POC Brief Template'}
          </button>
        </div>
      </header>

      {showBrief ? (
        <div className="flex-1 p-6 md:p-10">
          <div className="flex items-center justify-between mb-4">
            <p className="tool-label">POC Brief Template</p>
            <button
              onClick={() => {
                const el = document.createElement('a');
                el.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(POC_BRIEF_TEMPLATE);
                el.download = 'ai-fabric-poc-brief.md';
                el.click();
              }}
              className="flex items-center gap-2 text-xs text-emerald-400 hover:text-primary transition"
            >
              <Download size={14} /> Download
            </button>
          </div>
          <pre className="p-6 rounded-2xl border border-border bg-card-bg text-xs text-secondary leading-relaxed whitespace-pre-wrap font-mono overflow-auto max-h-[calc(100vh-12rem)]">
            {POC_BRIEF_TEMPLATE}
          </pre>
        </div>
      ) : (
        <main className="flex-1 p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
          {/* Phase + test navigation */}
          <section className="lg:col-span-1 overflow-y-auto space-y-2 pr-1">
            {POC_PHASES.map((phase) => {
              const phaseTests = phase.tests;
              const phaseCompleted = phaseTests.filter((t) => completedTests.has(t.id)).length;
              const isExpanded = expandedPhases.has(phase.id);
              return (
                <div key={phase.id} className="rounded-2xl border border-border bg-card-bg overflow-hidden">
                  <button
                    onClick={() => togglePhaseExpanded(phase.id)}
                    className="w-full flex items-center justify-between p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full border border-border flex items-center justify-center text-[10px] font-bold text-secondary">
                        {phase.sequence}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-primary">{phase.name}</p>
                        <p className="text-[10px] text-secondary font-mono">{phaseCompleted}/{phaseTests.length} tests complete</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {phase.criticalPath && (
                        <span className="text-[9px] font-bold text-rose-400 border border-rose-400/30 px-1.5 py-0.5 rounded-full">CRITICAL</span>
                      )}
                      {isExpanded ? <ChevronDown size={14} className="text-secondary" /> : <ChevronRight size={14} className="text-secondary" />}
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="border-t border-border">
                      {phaseTests.map((test) => {
                        const isCompleted = completedTests.has(test.id);
                        const isSelected = selectedTest.id === test.id;
                        return (
                          <button
                            key={test.id}
                            onClick={() => { setSelectedTest(test); setSelectedPhase(phase); }}
                            className={`w-full text-left flex items-center gap-3 px-4 py-3 border-t border-border/50 transition ${
                              isSelected ? 'bg-emerald-500/5' : 'hover:bg-card-bg/50'
                            }`}
                          >
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleTest(test.id); }}
                              className="shrink-0 text-secondary hover:text-emerald-400 transition"
                            >
                              {isCompleted
                                ? <CheckSquare size={16} className="text-emerald-400" />
                                : <Square size={16} />
                              }
                            </button>
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs font-semibold truncate ${isSelected ? 'text-primary' : 'text-secondary'}`}>
                                {test.name}
                              </p>
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${CATEGORY_COLOR[test.category] ?? 'text-secondary border-border'}`}>
                                {test.category}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </section>

          {/* Test detail */}
          <section className="lg:col-span-2 overflow-y-auto space-y-4 pr-1">
            <div className="tool-card-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${CATEGORY_COLOR[selectedTest.category] ?? 'text-secondary border-border'}`}>
                    {selectedTest.category}
                  </span>
                  {selectedPhase.criticalPath && (
                    <span className="text-[9px] font-bold text-rose-400 border border-rose-400/30 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                      <AlertTriangle size={10} /> Critical Path
                    </span>
                  )}
                </div>
                <button
                  onClick={() => toggleTest(selectedTest.id)}
                  className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-xl border transition ${
                    completedTests.has(selectedTest.id)
                      ? 'text-emerald-400 border-emerald-400/40 bg-emerald-500/10'
                      : 'text-secondary border-border hover:border-emerald-400/40'
                  }`}
                >
                  {completedTests.has(selectedTest.id)
                    ? <><CheckSquare size={14} /> Complete</>
                    : <><Square size={14} /> Mark Complete</>
                  }
                </button>
              </div>
              <h2 className="text-xl font-bold text-primary mb-2">{selectedTest.name}</h2>
              <p className="text-secondary text-sm leading-relaxed">{selectedTest.objective}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="tool-note">
                <p className="tool-label mb-3">Procedure</p>
                <ol className="space-y-2">
                  {selectedTest.procedure.map((step, i) => (
                    <li key={step} className="flex gap-3 text-sm text-secondary">
                      <span className="text-secondary font-mono text-xs mt-0.5 shrink-0">{i + 1}.</span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="tool-note">
                <p className="tool-label mb-3">Success Criteria</p>
                <ul className="space-y-2">
                  {selectedTest.successCriteria.map((c) => (
                    <li key={c} className="flex gap-2 text-sm text-secondary">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="tool-note">
              <p className="tool-label mb-3">Evidence to Capture</p>
              <ul className="space-y-2">
                {selectedTest.evidence.map((e) => (
                  <li key={e} className="flex gap-2 text-sm text-secondary">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
            </div>

            {selectedTest.eosCLI && selectedTest.eosCLI.length > 0 && (
              <div className="tool-note">
                <div className="flex items-center gap-2 mb-3 tool-label">
                  <Terminal size={12} /> EOS Validation Commands
                </div>
                <div className="space-y-2">
                  {selectedTest.eosCLI.map((cmd) => (
                    <code key={cmd} className="block text-xs font-mono text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 rounded-lg px-3 py-2">
                      {cmd}
                    </code>
                  ))}
                </div>
              </div>
            )}
          </section>
        </main>
      )}
    </div>
  );
};
