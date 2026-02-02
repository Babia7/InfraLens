import React from 'react';
import { ArrowLeft, ShieldAlert, Info, BookOpen, Clock, DollarSign, AlertTriangle } from 'lucide-react';
import { SectionType } from '@/types';
import { RelatedActions } from '@/components/RelatedActions';

interface MTTRDowntimeInsuranceAboutProps {
  onBack: () => void;
  onNavigate?: (section: SectionType) => void;
}

export const MTTRDowntimeInsuranceAbout: React.FC<MTTRDowntimeInsuranceAboutProps> = ({ onBack, onNavigate }) => {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_500px_at_15%_-10%,rgba(244,63,94,0.18),transparent_60%),radial-gradient(800px_520px_at_90%_0%,rgba(59,130,246,0.12),transparent_60%)]" />
      <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-950/85 backdrop-blur z-20 shadow-[0_10px_30px_-22px_rgba(0,0,0,0.9)]">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition">
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-500">
              <ShieldAlert size={18} />
            </div>
            <div>
              <h1 className="font-serif font-bold text-lg tracking-tight leading-none">MTTR Insurance · About</h1>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-1 block">Downtime Risk and Recovery Model</span>
            </div>
          </div>
        </div>
        {onNavigate && (
          <RelatedActions
            actions={[
              { label: 'MTTR App', onClick: () => onNavigate(SectionType.MTTR_DOWNTIME_INSURANCE), icon: <BookOpen size={12} />, tone: 'rose' }
            ]}
          />
        )}
      </header>

      <main className="flex-1 p-6 md:p-12 space-y-10 relative z-10">
        <section className="grid grid-cols-1 lg:grid-cols-[1.2fr,0.8fr] gap-6">
          <div className="p-8 rounded-[2.5rem] border border-zinc-800 bg-zinc-900/80 shadow-[0_25px_60px_-40px_rgba(0,0,0,0.85)] space-y-5">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-zinc-400">
              <Info size={14} className="text-rose-400" /> Why this model exists
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tight">
              Quantify downtime insurance.
            </h2>
            <p className="text-base md:text-lg text-zinc-300 leading-relaxed max-w-2xl">
              MTTR Insurance estimates yearly avoided revenue loss by comparing legacy recovery time to Arista recovery time.
              The model multiplies incident frequency, MTTR, and cost per hour to show the size of the risk gap.
            </p>
            <div className="flex flex-wrap gap-2 text-[11px] font-mono uppercase tracking-[0.3em] text-zinc-400">
              <span className="px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900">Deterministic Output</span>
              <span className="px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900">Scenario Presets</span>
              <span className="px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900">Annualized View</span>
            </div>
          </div>
          <div className="p-6 rounded-[2.5rem] border border-zinc-800 bg-zinc-900/70 shadow-[0_25px_60px_-40px_rgba(0,0,0,0.85)] space-y-4">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-zinc-400">
              <BookOpen size={14} className="text-rose-400" /> Assumptions
            </div>
            <ul className="text-sm text-zinc-300 space-y-2 list-disc list-inside">
              <li>Incidents per year represent major outages or material degradations.</li>
              <li>MTTR is average recovery time in hours per incident.</li>
              <li>Cost per hour reflects revenue impact or productivity loss.</li>
              <li>Loss = incidents x MTTR x cost per hour.</li>
              <li>Savings = legacy loss minus Arista loss; outputs are deterministic.</li>
            </ul>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 rounded-[2rem] border border-zinc-800 bg-zinc-900/80 shadow-[0_20px_50px_-35px_rgba(0,0,0,0.85)]">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-zinc-400 mb-3">
              <AlertTriangle size={14} className="text-rose-400" /> Incident Model
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Annual loss scales with incident frequency and the severity of each event. Use real incident logs to ground the count.
            </p>
          </div>
          <div className="p-6 rounded-[2rem] border border-zinc-800 bg-zinc-900/80 shadow-[0_20px_50px_-35px_rgba(0,0,0,0.85)]">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-zinc-400 mb-3">
              <Clock size={14} className="text-blue-400" /> Recovery Model
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed">
              MTTR reflects detection, mitigation, and validation time. Arista recovery assumes stateful restart and reduced blast radius.
            </p>
          </div>
          <div className="p-6 rounded-[2rem] border border-zinc-800 bg-zinc-900/80 shadow-[0_20px_50px_-35px_rgba(0,0,0,0.85)]">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-zinc-400 mb-3">
              <DollarSign size={14} className="text-emerald-400" /> Cost Model
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Cost per hour can represent direct revenue loss, SLA penalties, or productivity impact. Choose the metric your finance team trusts.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="p-6 rounded-[2rem] border border-zinc-800 bg-zinc-900/70 shadow-[0_20px_50px_-35px_rgba(0,0,0,0.85)] space-y-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-zinc-400">Typical Ranges</div>
            <ul className="text-sm text-zinc-300 space-y-2">
              <li><span className="text-white font-semibold">Incidents:</span> 2-12 per year</li>
              <li><span className="text-white font-semibold">Legacy MTTR:</span> 2-12 hours</li>
              <li><span className="text-white font-semibold">Arista MTTR:</span> 0.25-1 hour</li>
              <li><span className="text-white font-semibold">Cost/hour:</span> $25k-$500k+</li>
            </ul>
          </div>
          <div className="p-6 rounded-[2rem] border border-zinc-800 bg-zinc-900/70 shadow-[0_20px_50px_-35px_rgba(0,0,0,0.85)] space-y-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-zinc-400">Validation Checklist</div>
            <ul className="text-sm text-zinc-300 space-y-2">
              <li>Pull outage history to verify incident frequency.</li>
              <li>Use postmortems to validate MTTR averages.</li>
              <li>Align cost per hour with finance or risk teams.</li>
            </ul>
          </div>
          <div className="p-6 rounded-[2rem] border border-zinc-800 bg-zinc-900/70 shadow-[0_20px_50px_-35px_rgba(0,0,0,0.85)] space-y-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-zinc-400">Scope Boundaries</div>
            <ul className="text-sm text-zinc-300 space-y-2">
              <li>Does not include reputational impact or customer churn.</li>
              <li>Excludes regulatory fines and legal exposure.</li>
              <li>Assumes incident severity is uniform year to year.</li>
            </ul>
          </div>
        </section>

        <section className="p-8 rounded-[2.5rem] border border-zinc-800 bg-zinc-900/80 space-y-5 shadow-[0_25px_60px_-40px_rgba(0,0,0,0.85)]">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-zinc-400">
            <Info size={14} className="text-rose-400" /> Math at a Glance
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950/60 space-y-2">
              <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest">Legacy Loss</p>
              <p className="text-sm text-white font-mono">Incidents/Year x Legacy MTTR x Cost/Hour</p>
            </div>
            <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950/60 space-y-2">
              <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest">Arista Loss</p>
              <p className="text-sm text-white font-mono">Incidents/Year x Arista MTTR x Cost/Hour</p>
            </div>
          </div>
          <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-950/60 space-y-2">
            <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest">Avoided Loss</p>
            <p className="text-sm text-white font-mono">Legacy Loss - Arista Loss</p>
            <p className="text-xs text-zinc-500">Equivalent to the yearly insurance effect of faster recovery.</p>
          </div>
        </section>

        <section className="p-8 rounded-[2.5rem] border border-zinc-800 bg-zinc-900/90 shadow-[0_25px_60px_-40px_rgba(0,0,0,0.85)]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-zinc-400">Executive Takeaway</div>
          <p className="text-base md:text-lg text-zinc-200 leading-relaxed mt-3">
            Lead with avoided loss: "Shorter recovery time reduces the expected cost of downtime by orders of magnitude."
          </p>
          <p className="text-sm text-zinc-500 mt-2">
            If you validate only one input, validate incident frequency. It drives the total loss calculation.
          </p>
        </section>
      </main>
    </div>
  );
};
