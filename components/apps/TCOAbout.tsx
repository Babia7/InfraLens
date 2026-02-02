import React from 'react';
import { ArrowLeft, Calculator, Info, BookOpen, Zap, Users, Leaf } from 'lucide-react';
import { SectionType } from '@/types';
import { RelatedActions } from '@/components/RelatedActions';

interface TCOAboutProps {
  onBack: () => void;
  onNavigate?: (section: SectionType) => void;
}

export const TCOAbout: React.FC<TCOAboutProps> = ({ onBack, onNavigate }) => {
  return (
    <div className="min-h-screen bg-page-bg text-primary flex flex-col relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_500px_at_10%_-5%,rgba(59,130,246,0.18),transparent_60%),radial-gradient(800px_520px_at_90%_0%,rgba(16,185,129,0.12),transparent_60%)]" />
      <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-card-bg/85 backdrop-blur z-20 shadow-[0_10px_30px_-22px_rgba(0,0,0,0.9)]">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 text-secondary hover:text-primary rounded-lg hover:bg-card-bg transition">
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400">
              <Calculator size={18} />
            </div>
            <div>
              <h1 className="font-serif font-bold text-lg tracking-tight leading-none">TCO Modeler · About</h1>
              <span className="text-[10px] font-mono text-secondary uppercase tracking-widest mt-1 block">Calculations & Assumptions</span>
            </div>
          </div>
        </div>
        {onNavigate && (
          <RelatedActions
            actions={[
              { label: 'TCO App', onClick: () => onNavigate(SectionType.TCO_CALCULATOR), icon: <BookOpen size={12} />, tone: 'blue' }
            ]}
          />
        )}
      </header>

      <main className="flex-1 p-6 md:p-12 space-y-10 relative z-10">
        <section className="grid grid-cols-1 lg:grid-cols-[1.2fr,0.8fr] gap-6">
          <div className="p-8 rounded-[2.5rem] border border-border bg-card-bg/95 shadow-[0_25px_60px_-40px_rgba(0,0,0,0.85)] space-y-5">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-secondary">
              <Info size={14} className="text-blue-400" /> Why this model exists
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tight">
              Make the cost delta explicit.
            </h2>
            <p className="text-base md:text-lg text-primary/80 leading-relaxed max-w-2xl">
              The TCO Modeler estimates multi-year total cost of ownership by comparing a legacy stack against an Arista stack across hardware, power, and operations.
              Adjust horizon, power/labor rates, PUE, power draw, maintenance time, and hardware costs to match your environment.
            </p>
            <div className="flex flex-wrap gap-2 text-[11px] font-mono uppercase tracking-[0.3em] text-secondary">
              <span className="px-3 py-1 rounded-full border border-border bg-card-bg">Configurable Horizon</span>
              <span className="px-3 py-1 rounded-full border border-border bg-card-bg">Deterministic Output</span>
              <span className="px-3 py-1 rounded-full border border-border bg-card-bg">Transparent Math</span>
            </div>
          </div>
          <div className="p-6 rounded-[2.5rem] border border-border bg-card-bg/90 shadow-[0_25px_60px_-40px_rgba(0,0,0,0.85)] space-y-4">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-secondary">
              <BookOpen size={14} className="text-blue-400" /> Assumptions
            </div>
            <ul className="text-sm text-primary/80 space-y-2 list-disc list-inside">
              <li>8760 hours/year; <span className="relative inline-flex items-center underline decoration-dotted cursor-help text-primary/90 group">PUE
                <span className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-72 -translate-x-1/2 rounded-xl border border-border bg-card-bg px-3 py-2 text-[11px] text-secondary shadow-[0_20px_50px_-35px_rgba(0,0,0,0.85)] opacity-0 transition-opacity group-hover:opacity-100">
                  PUE (Power Usage Effectiveness) = Total facility power / IT equipment power. Lower is more efficient.
                </span>
              </span> applies equally to both stacks.</li>
              <li>Hardware is treated as upfront capex (no depreciation or financing modeled).</li>
              <li>Labor inputs represent annual operational effort per switch.</li>
              <li>Power pricing and labor rates are localized via region presets but fully editable.</li>
              <li>Savings = Legacy total – Arista total across HW, power, and labor.</li>
              <li>All outputs are deterministic and calculated locally (no AI inference).</li>
            </ul>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 rounded-[2rem] border border-border bg-card-bg/95 shadow-[0_20px_50px_-35px_rgba(0,0,0,0.85)]">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-secondary mb-3">
              <Zap size={14} className="text-blue-400" /> Power Model
            </div>
            <p className="text-sm text-primary/80 leading-relaxed">
              Power = (Watts × Switches × 8760 hrs × <span className="relative inline-flex items-center underline decoration-dotted cursor-help text-primary/90 group">PUE
                <span className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-72 -translate-x-1/2 rounded-xl border border-border bg-card-bg px-3 py-2 text-[11px] text-secondary shadow-[0_20px_50px_-35px_rgba(0,0,0,0.85)] opacity-0 transition-opacity group-hover:opacity-100">
                  PUE (Power Usage Effectiveness) = Total facility power / IT equipment power. Lower is more efficient.
                </span>
              </span> × Years) ÷ 1000 × $/kWh.
              PUE is applied equally to both stacks; adjust it to reflect data center efficiency.
            </p>
          </div>
          <div className="p-6 rounded-[2rem] border border-border bg-card-bg/95 shadow-[0_20px_50px_-35px_rgba(0,0,0,0.85)]">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-secondary mb-3">
              <Users size={14} className="text-indigo-400" /> Operations Model
            </div>
            <p className="text-sm text-primary/80 leading-relaxed">
              Labor = Switches × maintenance hours per year × Years × $/Hr. This captures time spent on upgrades, troubleshooting, and routine operations. Automation and tooling reduce hours materially.
            </p>
          </div>
          <div className="p-6 rounded-[2rem] border border-border bg-card-bg/95 shadow-[0_20px_50px_-35px_rgba(0,0,0,0.85)]">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-secondary mb-3">
              <Leaf size={14} className="text-emerald-400" /> Sustainability
            </div>
            <p className="text-sm text-primary/80 leading-relaxed">
              Carbon estimate uses 0.4 kg CO2 per kWh to show avoided emissions from lower power draw and improved PUE. Adjust if you have region-specific carbon factors.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="p-6 rounded-[2rem] border border-border bg-card-bg/90 shadow-[0_20px_50px_-35px_rgba(0,0,0,0.85)] space-y-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-secondary">Typical Ranges</div>
            <ul className="text-sm text-primary/80 space-y-2">
              <li><span className="text-primary font-semibold">PUE:</span> 1.2–1.8 (use site-specific data if available)</li>
              <li><span className="text-primary font-semibold">Energy:</span> $0.08–$0.30 per kWh by region</li>
              <li><span className="text-primary font-semibold">Labor:</span> $90–$180 per hour fully burdened</li>
            </ul>
          </div>
          <div className="p-6 rounded-[2rem] border border-border bg-card-bg/90 shadow-[0_20px_50px_-35px_rgba(0,0,0,0.85)] space-y-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-secondary">Validation Checklist</div>
            <ul className="text-sm text-primary/80 space-y-2">
              <li>Pull power rates from the last two utility bills.</li>
              <li>Use change tickets to estimate yearly maintenance hours per switch.</li>
              <li>Confirm hardware unit costs with current BOM/quotes.</li>
            </ul>
          </div>
          <div className="p-6 rounded-[2rem] border border-border bg-card-bg/90 shadow-[0_20px_50px_-35px_rgba(0,0,0,0.85)] space-y-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-secondary">Scope Boundaries</div>
            <ul className="text-sm text-primary/80 space-y-2">
              <li>Excludes financing, depreciation, and tax impacts.</li>
              <li>Does not model facilities capex or real estate costs.</li>
              <li>Software licensing/support costs are not included unless entered as labor.</li>
            </ul>
          </div>
        </section>

        <section className="p-8 rounded-[2.5rem] border border-border bg-card-bg/90 space-y-5 shadow-[0_25px_60px_-40px_rgba(0,0,0,0.85)]">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-secondary">
            <Info size={14} className="text-blue-400" /> Math at a Glance
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border border-border bg-card-bg/70 space-y-2">
              <p className="text-[11px] font-mono text-secondary uppercase tracking-widest">Power Cost</p>
              <p className="text-sm text-primary font-mono">
                (Watts × Switches × 8760 × PUE × Years) ÷ 1000 × $/kWh
              </p>
              <p className="text-xs text-secondary">
                8760 = 24 hours × 365 days. Divide by 1000 to convert watts to kW.
              </p>
            </div>
            <div className="p-5 rounded-2xl border border-border bg-card-bg/70 space-y-2">
              <p className="text-[11px] font-mono text-secondary uppercase tracking-widest">Labor Cost</p>
              <p className="text-sm text-primary font-mono">
                Switches × Maintenance Hours/Year × Years × $/Hour
              </p>
              <p className="text-xs text-secondary">
                Represents yearly operational effort per switch (upgrades, troubleshooting, routine ops).
              </p>
            </div>
          </div>
          <div className="p-5 rounded-2xl border border-border bg-card-bg/70 space-y-2">
            <p className="text-[11px] font-mono text-secondary uppercase tracking-widest">Total TCO (N-Year)</p>
            <p className="text-sm text-primary font-mono">
              Hardware + Power Cost + Labor Cost
            </p>
            <p className="text-xs text-secondary">
              Savings = Legacy Total − Arista Total across hardware, power, and labor.
            </p>
          </div>
        </section>

        <section className="p-8 rounded-[2.5rem] border border-border bg-card-bg/95 shadow-[0_25px_60px_-40px_rgba(0,0,0,0.85)]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-secondary">Executive Takeaway</div>
          <p className="text-base md:text-lg text-primary/85 leading-relaxed mt-3">
            Lead with the delta: “At this scale, Arista reduces multi-year TCO by focusing on power efficiency and operational hours, not just hardware.”
          </p>
          <p className="text-sm text-secondary mt-2">
            If you only validate one input, validate maintenance hours per switch/year — it tends to drive the largest swing.
          </p>
        </section>
      </main>
    </div>
  );
};
