import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, ChevronRight, Download, RotateCcw, CheckCircle2 } from 'lucide-react';
import { DISCOVERY_QUESTIONS, POSITIONING_ANGLES, DiscoveryAnswer } from '@data/discoveryPlaybook';

interface AINetworkingDiscoveryProps {
  onBack: () => void;
}

type Answers = Record<string, DiscoveryAnswer>;

export const AINetworkingDiscovery: React.FC<AINetworkingDiscoveryProps> = ({ onBack }) => {
  const [answers, setAnswers] = useState<Answers>({});
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [showOutput, setShowOutput] = useState(false);

  const allAnswered = useMemo(
    () => DISCOVERY_QUESTIONS.every((q) => answers[q.id]),
    [answers]
  );

  const handleAnswer = (questionId: string, answer: DiscoveryAnswer) => {
    const updated = { ...answers, [questionId]: answer };
    setAnswers(updated);
    if (activeQuestion < DISCOVERY_QUESTIONS.length - 1) {
      setActiveQuestion(activeQuestion + 1);
    }
  };

  const reset = () => {
    setAnswers({});
    setActiveQuestion(0);
    setShowOutput(false);
  };

  // Derive output from answers
  const output = useMemo(() => {
    const workload = answers['workload']?.id ?? '';
    const scaleBoundary = answers['scale-boundary']?.id ?? '';
    const transport = answers['transport']?.id ?? '';
    const ops = answers['operational-maturity']?.id ?? '';
    const proof = answers['proof-model']?.id ?? '';

    // Topology recommendation
    let topologyTier = 'Two-tier Clos, fixed switches, single or dual-plane';
    if (workload === 'training-large' || scaleBoundary === 'cross-pod') {
      topologyTier = 'Multi-plane 2-tier Clos with DLB (leaf) + CLB (spine). Evaluate 3-tier for cross-hall deployments.';
    } else if (workload === 'inference') {
      topologyTier = 'Two-tier Clos optimized for low hop count and locality. Tensor parallelism groups should stay within same leaf.';
    }

    // Positioning angle
    let positioningKey = 'scale';
    if (transport === 'infiniband-replacing') positioningKey = 'proof';
    else if (ops === 'snmp-polling' || ops === 'minimal-monitoring') positioningKey = 'operability';
    else if (workload === 'training-large') positioningKey = 'ecosystem';

    // Proof sequence
    const proofSequence: string[] = [];
    if (proof === 'jct-proof' || transport === 'infiniband-replacing') {
      proofSequence.push('Run NCCL/collective synthetic workload: measure JCT with ECMP baseline vs DLB enabled');
    }
    if (proof === 'congestion-proof' || transport === 'roce-unconfigured') {
      proofSequence.push('Congestion test: incast load → verify ECN marking, LANZ queue telemetry, PFC containment');
    }
    if (proof === 'recovery-proof') {
      proofSequence.push('Failure recovery: link flap → BGP convergence time; leaf reload → MLAG continuity');
    }
    if (proof === 'operational-proof' || ops === 'snmp-polling') {
      proofSequence.push('CloudVision demo: LANZ time-machine forensics during synthetic congestion event');
    }
    proofSequence.push('Control plane health validation (BGP, EVPN, VXLAN) — always Phase 1');
    proofSequence.push('QoS policy verification — DSCP→queue mapping, PFC queue isolation');

    // Objection anticipation
    const objections: string[] = [];
    if (transport === 'infiniband-replacing') {
      objections.push('IB objection: "Ethernet latency is not competitive" → Reframe: latency vs. ecosystem operability. Show JCT comparison under AllReduce load, not ping.');
    }
    if (ops === 'snmp-polling') {
      objections.push('Visibility gap: "We can monitor this with SNMP" → SNMP misses sub-millisecond queue events. LANZ captures what SNMP cannot see at all.');
    }
    if (scaleBoundary === 'unknown') {
      objections.push('Scale uncertainty: "We don\'t know our final GPU count" → Port math worksheet + defined growth path with uplink reservation.');
    }
    if (workload === 'training-large') {
      objections.push('MoE skepticism: "Static ECMP works for us now" → Demonstrate DLB improvement under synchronized elephant flows at production scale.');
    }

    return {
      topologyTier,
      positioningAngle: POSITIONING_ANGLES[positioningKey],
      proofSequence: proofSequence.slice(0, 5),
      objectionAnticipation: objections,
      nextAction: transport === 'infiniband-replacing'
        ? 'Schedule a POC proof plan session — JCT comparison is the key deliverable for this account.'
        : transport === 'roce-unconfigured'
          ? 'Start with QoS design review — congestion management gaps must be resolved before fabric goes live.'
          : 'Run Port Math Worksheet to size the fabric, then build the POC plan from discovery outputs.'
    };
  }, [answers]);

  const exportText = useMemo(() => {
    if (!allAnswered) return '';
    const lines = ['# AI Networking Pre-Call Discovery Card\n'];
    DISCOVERY_QUESTIONS.forEach((q) => {
      const a = answers[q.id];
      if (a) lines.push(`## ${q.layer}: ${q.layerDescription}\nAnswer: ${a.label}\nImplication: ${a.implication}\n`);
    });
    lines.push('## Recommended Topology\n' + output.topologyTier + '\n');
    lines.push('## Positioning Angle\n' + output.positioningAngle + '\n');
    lines.push('## Proof Sequence\n' + output.proofSequence.map((p, i) => `${i + 1}. ${p}`).join('\n') + '\n');
    if (output.objectionAnticipation.length > 0) {
      lines.push('## Objection Anticipation\n' + output.objectionAnticipation.map((o) => `· ${o}`).join('\n') + '\n');
    }
    lines.push('## Next Action\n' + output.nextAction);
    return lines.join('\n');
  }, [answers, allAnswered, output]);

  return (
    <div className="min-h-screen bg-page-bg text-primary font-sans flex flex-col">
      <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-card-bg/80 backdrop-blur z-20">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="group p-2 text-secondary hover:text-primary transition-colors">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400">
              <Search size={18} />
            </div>
            <div>
              <h1 className="font-serif font-bold text-lg tracking-tight leading-none">AI Networking Discovery</h1>
              <span className="text-[10px] font-mono text-secondary uppercase tracking-widest mt-1 block">5-Layer Pre-Call Framework · Vault: Discovery Playbook</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {Object.keys(answers).length > 0 && (
            <button onClick={reset} className="flex items-center gap-2 text-xs text-secondary hover:text-primary transition">
              <RotateCcw size={14} /> Reset
            </button>
          )}
          {allAnswered && !showOutput && (
            <button
              onClick={() => setShowOutput(true)}
              className="px-4 py-2 bg-emerald-500/10 border border-emerald-400/40 text-emerald-400 text-xs font-mono uppercase tracking-widest rounded-xl hover:bg-emerald-500/20 transition"
            >
              View Pre-Call Card →
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 p-6 md:p-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress sidebar */}
        <section className="lg:col-span-1 space-y-3">
          <p className="text-[10px] font-mono text-secondary uppercase tracking-widest mb-3">Discovery Layers</p>
          {DISCOVERY_QUESTIONS.map((q, i) => {
            const answered = !!answers[q.id];
            const isActive = i === activeQuestion && !showOutput;
            return (
              <button
                key={q.id}
                onClick={() => { setActiveQuestion(i); setShowOutput(false); }}
                className={`w-full text-left p-4 rounded-2xl border transition ${
                  isActive ? 'border-emerald-400/40 bg-card-bg'
                  : answered ? 'border-emerald-400/20 bg-card-bg/60'
                  : 'border-border bg-card-bg/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-secondary uppercase tracking-widest">{q.layer}</span>
                  {answered && <CheckCircle2 size={14} className="text-emerald-400" />}
                </div>
                <p className="text-sm font-semibold text-primary">{q.layerDescription}</p>
                {answers[q.id] && (
                  <p className="text-xs text-emerald-400 mt-1 truncate">{answers[q.id].label}</p>
                )}
              </button>
            );
          })}
        </section>

        {/* Question or output */}
        <section className="lg:col-span-2">
          {!showOutput ? (
            <div className="space-y-4">
              <div className="p-6 rounded-3xl border border-border bg-card-bg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-mono text-secondary uppercase tracking-widest">
                    {DISCOVERY_QUESTIONS[activeQuestion].layer} — {DISCOVERY_QUESTIONS[activeQuestion].layerDescription}
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-primary mb-6 leading-relaxed">
                  {DISCOVERY_QUESTIONS[activeQuestion].question}
                </h2>
                <div className="space-y-3">
                  {DISCOVERY_QUESTIONS[activeQuestion].answers.map((answer) => {
                    const isSelected = answers[DISCOVERY_QUESTIONS[activeQuestion].id]?.id === answer.id;
                    return (
                      <button
                        key={answer.id}
                        onClick={() => handleAnswer(DISCOVERY_QUESTIONS[activeQuestion].id, answer)}
                        className={`w-full text-left p-4 rounded-2xl border transition ${
                          isSelected
                            ? 'border-emerald-400/50 bg-emerald-500/10'
                            : 'border-border bg-card-bg/50 hover:border-emerald-400/30'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                            isSelected ? 'border-emerald-400 bg-emerald-400' : 'border-border'
                          }`}>
                            {isSelected && <div className="w-2 h-2 rounded-full bg-page-bg" />}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-primary">{answer.label}</p>
                            <p className="text-xs text-secondary mt-1 leading-relaxed">{answer.implication}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex justify-between">
                <button
                  onClick={() => setActiveQuestion(Math.max(0, activeQuestion - 1))}
                  disabled={activeQuestion === 0}
                  className="text-xs text-secondary hover:text-primary disabled:opacity-30 transition"
                >
                  ← Previous
                </button>
                <button
                  onClick={() => setActiveQuestion(Math.min(DISCOVERY_QUESTIONS.length - 1, activeQuestion + 1))}
                  disabled={activeQuestion === DISCOVERY_QUESTIONS.length - 1}
                  className="text-xs text-secondary hover:text-primary disabled:opacity-30 transition flex items-center gap-1"
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-mono text-secondary uppercase tracking-widest">Pre-Call Prep Card</p>
                <button
                  onClick={() => {
                    const el = document.createElement('a');
                    el.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(exportText);
                    el.download = 'ai-networking-discovery.md';
                    el.click();
                  }}
                  className="flex items-center gap-2 text-xs text-emerald-400 hover:text-primary transition"
                >
                  <Download size={14} /> Export
                </button>
              </div>

              <div className="p-5 rounded-3xl border border-border bg-card-bg space-y-4">
                <div>
                  <p className="text-[10px] font-mono text-secondary uppercase tracking-widest mb-2">Recommended Topology</p>
                  <p className="text-sm text-primary leading-relaxed">{output.topologyTier}</p>
                </div>
                <div className="border-t border-border pt-4">
                  <p className="text-[10px] font-mono text-secondary uppercase tracking-widest mb-2">Positioning Angle</p>
                  <p className="text-sm text-secondary leading-relaxed">{output.positioningAngle}</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-border bg-card-bg/70">
                <p className="text-[10px] font-mono text-secondary uppercase tracking-widest mb-3">Proof Sequence</p>
                <ol className="space-y-2">
                  {output.proofSequence.map((p, i) => (
                    <li key={p} className="flex gap-3 text-sm text-secondary">
                      <span className="text-emerald-400 font-bold shrink-0">{i + 1}.</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {output.objectionAnticipation.length > 0 && (
                <div className="p-5 rounded-2xl border border-amber-400/20 bg-amber-500/5">
                  <p className="text-[10px] font-mono text-amber-400 uppercase tracking-widest mb-3">Objection Anticipation</p>
                  {output.objectionAnticipation.map((o) => (
                    <p key={o} className="text-sm text-secondary leading-relaxed mb-2">· {o}</p>
                  ))}
                </div>
              )}

              <div className="p-5 rounded-2xl border border-emerald-400/20 bg-emerald-500/5">
                <p className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest mb-2">Recommended Next Action</p>
                <p className="text-sm text-primary leading-relaxed">{output.nextAction}</p>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
