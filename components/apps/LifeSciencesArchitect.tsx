import React, { useMemo, useState } from 'react';
import { ArrowLeft, Info, Target, Activity, Sparkles, ShieldCheck, Ruler, Cpu, BookOpen, Link as LinkIcon, Gauge, Shield, Network, MessageCircle } from 'lucide-react';
import { SectionType } from '@/types';
import { EvidenceDrawer } from '@/components/EvidenceDrawer';
import { WORKLOADS, calculateResult, WorkloadId, REFERENCE_LINKS } from '@/data/lifescienceArchitect';

interface LifeSciencesArchitectProps {
  onBack: () => void;
  onNavigate?: (section: SectionType) => void;
}

export const LifeSciencesArchitect: React.FC<LifeSciencesArchitectProps> = ({ onBack, onNavigate }) => {
  const [workloadId, setWorkloadId] = useState<WorkloadId>('genomics');
  const [instruments, setInstruments] = useState(WORKLOADS[0].defaults.instruments);
  const [distance, setDistance] = useState(WORKLOADS[0].defaults.distanceMeters);
  const [speed, setSpeed] = useState<10 | 25 | 100 | 400>(WORKLOADS[0].defaults.interfaceSpeedGbps);
  const [summary, setSummary] = useState<string | null>(null);

  const workload = WORKLOADS.find((w) => w.id === workloadId) ?? WORKLOADS[0];

  const result = useMemo(() => calculateResult(workload, instruments, distance, speed), [workload, instruments, distance, speed]);

  const generateSummary = () => {
    const parts = [
      `${workload.name}: ~${result.totalGbps} Gbps avg, ~${result.burstGbps} Gbps burst across ${instruments} instruments.`,
      `Optic: ${result.optic.label} (${speed}G) for ${distance}m; ${result.breakoutNote}`,
      `Deep buffers: ${result.recommendsDeepBuffers ? 'Recommended' : 'Not required for baseline profile'}`
    ];
    setSummary(parts.join(' · '));
  };

  const loadPreset = (id: WorkloadId) => {
    const w = WORKLOADS.find((p) => p.id === id);
    if (!w) return;
    setWorkloadId(id);
    setInstruments(w.defaults.instruments);
    setDistance(w.defaults.distanceMeters);
    setSpeed(w.defaults.interfaceSpeedGbps);
  };

  return (
    <div className="min-h-screen bg-page-bg text-primary flex flex-col">
      <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-card-bg/80 backdrop-blur z-20">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 text-secondary hover:text-primary rounded-lg hover:bg-card-bg transition">
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="font-serif font-bold text-lg tracking-tight">BioNet Architect</div>
            <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-secondary">Decidable Network Architecture · Life Sciences</div>
          </div>
        </div>
        {onNavigate && (
          <div className="flex items-center gap-3">
            <button onClick={() => onNavigate(SectionType.VALIDATED_DESIGN_NAVIGATOR)} className="text-[10px] font-mono uppercase tracking-[0.3em] text-emerald-400 hover:text-primary">
              Validated Designs →
            </button>
            <button onClick={() => onNavigate(SectionType.PROTOCOLS)} className="text-[10px] font-mono uppercase tracking-[0.3em] text-blue-400 hover:text-primary">
              Protocol Lab →
            </button>
          </div>
        )}
      </header>

      <main className="flex-1 grid grid-cols-1 xl:grid-cols-[320px,1fr] gap-4 md:gap-6 p-6 md:p-10">
        {/* Left rail */}
        <aside className="bg-card-bg border border-border rounded-2xl p-4 space-y-4">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">Workloads</div>
          <div className="grid grid-cols-1 gap-2">
            {WORKLOADS.map((w) => (
              <button
                key={w.id}
                onClick={() => loadPreset(w.id)}
                className={`w-full text-left p-3 rounded-xl border transition ${
                  workloadId === w.id ? 'border-emerald-400/60 bg-emerald-500/5 text-primary' : 'border-border bg-card-bg hover:border-emerald-400/40 text-secondary'
                }`}
              >
                <div className="text-sm font-semibold">{w.name}</div>
                <div className="text-xs text-secondary leading-snug">{w.description}</div>
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">Instruments</label>
            <input
              type="number"
              value={instruments}
              onChange={(e) => setInstruments(Math.max(1, Number(e.target.value) || workload.defaults.instruments))}
              className="w-full bg-card-bg border border-border rounded-lg px-3 py-2 text-sm text-primary"
            />
            <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">Distance (m)</label>
            <input
              type="number"
              value={distance}
              onChange={(e) => setDistance(Math.max(1, Number(e.target.value) || workload.defaults.distanceMeters))}
              className="w-full bg-card-bg border border-border rounded-lg px-3 py-2 text-sm text-primary"
            />
            <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">Interface Speed</label>
            <select
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value) as 10 | 25 | 100 | 400)}
              className="w-full bg-card-bg border border-border rounded-lg px-3 py-2 text-sm text-primary"
            >
              {[10, 25, 100, 400].map((s) => (
                <option key={s} value={s}>{s}G</option>
              ))}
            </select>
          </div>

          <div className="p-3 rounded-xl border border-border bg-card-bg">
            <div className="flex items-center gap-2 text-[11px] text-secondary uppercase tracking-[0.3em]">
              <Info size={14} /> Guardrails
            </div>
            <ul className="text-sm text-secondary space-y-1 mt-2 list-disc list-inside">
              <li>No configs/pricing/roadmap generated.</li>
              <li>Focus: optics, buffers, breakout, segmentation guidance.</li>
              <li>AI chat is constrained to blueprint context.</li>
            </ul>
          </div>
        </aside>

        {/* Main content */}
        <section className="bg-card-bg border border-border rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
          <div className="flex flex-wrap items-center gap-3 justify-between">
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-secondary">
              <Sparkles size={14} className="text-emerald-400" /> Blueprint
            </div>
            <div className="flex gap-3 text-[11px] text-secondary">
              <div className="flex items-center gap-2"><Shield size={12} className="text-emerald-400" /> {result.recommendsDeepBuffers ? 'Deep buffers recommended' : 'Standard buffers ok'}</div>
              <div className="flex items-center gap-2"><Gauge size={12} className="text-blue-400" /> {result.totalGbps} Gbps avg</div>
              <div className="flex items-center gap-2"><Activity size={12} className="text-rose-400" /> {result.burstGbps} Gbps burst</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-border bg-card-bg/70 space-y-2">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-secondary">
                <Network size={14} className="text-blue-400" /> Optic & Breakout
              </div>
              <div className="text-lg font-semibold text-primary">{result.optic.label}</div>
              <p className="text-sm text-secondary">Distance: {distance}m · Speed: {speed}G</p>
              <p className="text-sm text-secondary">{result.breakoutNote}</p>
            </div>
            <div className="p-4 rounded-2xl border border-border bg-card-bg/70 space-y-2">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-secondary">
                <ShieldCheck size={14} className="text-emerald-400" /> Buffer Guidance
              </div>
              <div className="text-lg font-semibold text-primary">{result.recommendsDeepBuffers ? 'Deep buffers advised' : 'Standard buffers sufficient'}</div>
              <p className="text-sm text-secondary">
                {result.recommendsDeepBuffers
                  ? 'Bursts exceed safe thresholds; prefer deep-buffer platforms with ECN tuned.'
                  : 'Bursts within shallow buffer tolerance; standard platforms acceptable.'}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-border bg-card-bg/70 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-secondary">
                <Target size={14} className="text-emerald-400" /> Decision Rationale
              </div>
              <button
                onClick={generateSummary}
                className="px-3 py-2 rounded-lg border border-emerald-400/40 text-xs font-semibold text-primary hover:border-emerald-400 transition"
              >
                Generate Summary
              </button>
            </div>
            <ul className="text-sm text-secondary space-y-1 list-disc list-inside">
              <li>Workload profile: {workload.name} ({workload.notes.join(' · ')})</li>
              <li>Throughput model: instruments × base Gbps × burst factor → {result.burstGbps} Gbps peak</li>
              <li>Optic chosen for distance/speed; breakout validated per rule table.</li>
              <li>Buffers: {result.recommendsDeepBuffers ? 'Deep buffers + ECN recommended for burst absorption.' : 'Standard buffers acceptable; monitor ECN marks.'}</li>
            </ul>
            {summary && (
              <div className="p-3 rounded-lg border border-border bg-card-bg text-sm text-primary">
                <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-secondary mb-1">Executive summary</div>
                {summary}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-border bg-card-bg/70 space-y-2">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-secondary">
                <Ruler size={14} className="text-blue-400" /> Physics
              </div>
              <p className="text-sm text-secondary">Modeled from instrument physics (payload size, burst factor) not user counts. Keep MTU consistent and validate ECMP symmetry.</p>
            </div>
            <div className="p-4 rounded-2xl border border-border bg-card-bg/70 space-y-2">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-secondary">
                <MessageCircle size={14} className="text-emerald-400" /> Ask the Architect
              </div>
              <p className="text-sm text-secondary">Use in-app chat with the generated blueprint; constrained to optics/buffers/breakout guidance—no configs or pricing.</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-secondary">
              <BookOpen size={14} className="text-blue-400" /> References
            </div>
            <div className="grid md:grid-cols-3 gap-3">
              {REFERENCE_LINKS.map((ref) => (
                <div key={ref.title} className="p-3 rounded-xl border border-border bg-card-bg/80">
                  <div className="text-sm font-semibold text-primary">{ref.title}</div>
                  <div className="text-xs text-secondary">{ref.summary}</div>
                </div>
              ))}
            </div>
          </div>

          <EvidenceDrawer contextTags={['Life Sciences']} />
        </section>
      </main>
    </div>
  );
};
