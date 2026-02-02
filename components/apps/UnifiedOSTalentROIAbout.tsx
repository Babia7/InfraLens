import React from 'react';
import { ArrowLeft, GraduationCap, Info, BookOpen, Users, Brain, DollarSign } from 'lucide-react';
import { SectionType } from '@/types';
import { RelatedActions } from '@/components/RelatedActions';

interface UnifiedOSTalentROIAboutProps {
  onBack: () => void;
  onNavigate?: (section: SectionType) => void;
}

export const UnifiedOSTalentROIAbout: React.FC<UnifiedOSTalentROIAboutProps> = ({ onBack, onNavigate }) => {
  return (
    <div className="min-h-screen bg-page-bg text-primary flex flex-col relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_500px_at_15%_-10%,rgba(245,158,11,0.18),transparent_60%),radial-gradient(800px_520px_at_90%_0%,rgba(59,130,246,0.12),transparent_60%)]" />
      <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-card-bg/85 backdrop-blur z-20 shadow-[0_10px_30px_-22px_rgba(0,0,0,0.9)]">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 text-secondary hover:text-primary rounded-lg hover:bg-card-bg transition">
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-500">
              <GraduationCap size={18} />
            </div>
            <div>
              <h1 className="font-serif font-bold text-lg tracking-tight leading-none">Talent ROI · About</h1>
              <span className="text-[10px] font-mono text-secondary uppercase tracking-widest mt-1 block">Unified EOS Productivity Model</span>
            </div>
          </div>
        </div>
        {onNavigate && (
          <RelatedActions
            actions={[
              { label: 'Talent ROI App', onClick: () => onNavigate(SectionType.UNIFIED_OS_TALENT_ROI), icon: <BookOpen size={12} />, tone: 'amber' }
            ]}
          />
        )}
      </header>

      <main className="flex-1 p-6 md:p-12 space-y-10 relative z-10">
        <section className="grid grid-cols-1 lg:grid-cols-[1.2fr,0.8fr] gap-6">
          <div className="p-8 rounded-[2.5rem] border border-border bg-card-bg/95 shadow-[0_25px_60px_-40px_rgba(0,0,0,0.85)] space-y-5">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-secondary">
              <Info size={14} className="text-amber-500" /> Why this model exists
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tight">
              Measure the cost of context switching.
            </h2>
            <p className="text-base md:text-lg text-primary/80 leading-relaxed max-w-2xl">
              The Talent ROI Modeler estimates yearly OpEx savings by comparing training and cognitive load across multiple legacy network OS stacks
              versus a unified EOS footprint. It converts training hours and switching tax into cost and FTE impact.
            </p>
            <div className="flex flex-wrap gap-2 text-[11px] font-mono uppercase tracking-[0.3em] text-secondary">
              <span className="px-3 py-1 rounded-full border border-border bg-card-bg">Deterministic Output</span>
              <span className="px-3 py-1 rounded-full border border-border bg-card-bg">Editable Inputs</span>
              <span className="px-3 py-1 rounded-full border border-border bg-card-bg">Annualized View</span>
            </div>
          </div>
          <div className="p-6 rounded-[2.5rem] border border-border bg-card-bg/90 shadow-[0_25px_60px_-40px_rgba(0,0,0,0.85)] space-y-4">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-secondary">
              <BookOpen size={14} className="text-amber-500" /> Assumptions
            </div>
            <ul className="text-sm text-primary/80 space-y-2 list-disc list-inside">
              <li>Training hours are annual per OS and scale with team size.</li>
              <li>Switching tax represents time lost to syntax and tooling context shifts.</li>
              <li>Unified EOS training uses a single OS with a deeper ramp (1.2x training hours).</li>
              <li>Unified EOS cognitive tax defaults to 1% for edge cases.</li>
              <li>Savings = legacy OpEx minus unified OpEx; outputs are deterministic.</li>
            </ul>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 rounded-[2rem] border border-border bg-card-bg/95 shadow-[0_20px_50px_-35px_rgba(0,0,0,0.85)]">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-secondary mb-3">
              <Users size={14} className="text-amber-500" /> Team Model
            </div>
            <p className="text-sm text-primary/80 leading-relaxed">
              Training hours scale with team size and the number of OS variants. Larger, multi-vendor teams compound overhead.
            </p>
          </div>
          <div className="p-6 rounded-[2rem] border border-border bg-card-bg/95 shadow-[0_20px_50px_-35px_rgba(0,0,0,0.85)]">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-secondary mb-3">
              <Brain size={14} className="text-indigo-500" /> Cognitive Tax
            </div>
            <p className="text-sm text-primary/80 leading-relaxed">
              Switching tax estimates time lost to re-learning syntax, tooling, and operational patterns across OS boundaries.
            </p>
          </div>
          <div className="p-6 rounded-[2rem] border border-border bg-card-bg/95 shadow-[0_20px_50px_-35px_rgba(0,0,0,0.85)]">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-secondary mb-3">
              <DollarSign size={14} className="text-emerald-500" /> Cost Model
            </div>
            <p className="text-sm text-primary/80 leading-relaxed">
              Total OpEx = training cost + cognitive cost. FTE potential uses 2080 hours per year.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="p-6 rounded-[2rem] border border-border bg-card-bg/90 shadow-[0_20px_50px_-35px_rgba(0,0,0,0.85)] space-y-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-secondary">Typical Ranges</div>
            <ul className="text-sm text-primary/80 space-y-2">
              <li><span className="text-primary font-semibold">Team size:</span> 5-50 FTEs</li>
              <li><span className="text-primary font-semibold">Legacy OS count:</span> 2-6</li>
              <li><span className="text-primary font-semibold">Training hours:</span> 40-120 per OS/year</li>
              <li><span className="text-primary font-semibold">Switching tax:</span> 5-25%</li>
            </ul>
          </div>
          <div className="p-6 rounded-[2rem] border border-border bg-card-bg/90 shadow-[0_20px_50px_-35px_rgba(0,0,0,0.85)] space-y-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-secondary">Validation Checklist</div>
            <ul className="text-sm text-primary/80 space-y-2">
              <li>Use training records to verify annual hours per OS.</li>
              <li>Survey engineers to estimate context switching time.</li>
              <li>Confirm fully burdened hourly rates with finance.</li>
            </ul>
          </div>
          <div className="p-6 rounded-[2rem] border border-border bg-card-bg/90 shadow-[0_20px_50px_-35px_rgba(0,0,0,0.85)] space-y-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-secondary">Scope Boundaries</div>
            <ul className="text-sm text-primary/80 space-y-2">
              <li>Does not include tooling license or support costs.</li>
              <li>Excludes hiring and attrition impacts.</li>
              <li>Assumes steady team size year to year.</li>
            </ul>
          </div>
        </section>

        <section className="p-8 rounded-[2.5rem] border border-border bg-card-bg/90 space-y-5 shadow-[0_25px_60px_-40px_rgba(0,0,0,0.85)]">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-secondary">
            <Info size={14} className="text-amber-500" /> Math at a Glance
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border border-border bg-card-bg/70 space-y-2">
              <p className="text-[11px] font-mono text-secondary uppercase tracking-widest">Legacy Training Cost</p>
              <p className="text-sm text-primary font-mono">
                Team Size x Legacy OS Count x Training Hours x $/Hour
              </p>
            </div>
            <div className="p-5 rounded-2xl border border-border bg-card-bg/70 space-y-2">
              <p className="text-[11px] font-mono text-secondary uppercase tracking-widest">Legacy Cognitive Cost</p>
              <p className="text-sm text-primary font-mono">
                (Team Size x 2080 x Switching Tax%) x $/Hour
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border border-border bg-card-bg/70 space-y-2">
              <p className="text-[11px] font-mono text-secondary uppercase tracking-widest">Unified Training Cost</p>
              <p className="text-sm text-primary font-mono">
                Team Size x (Training Hours x 1.2) x $/Hour
              </p>
            </div>
            <div className="p-5 rounded-2xl border border-border bg-card-bg/70 space-y-2">
              <p className="text-[11px] font-mono text-secondary uppercase tracking-widest">Unified Cognitive Cost</p>
              <p className="text-sm text-primary font-mono">
                (Team Size x 2080 x 1%) x $/Hour
              </p>
            </div>
          </div>
          <div className="p-5 rounded-2xl border border-border bg-card-bg/70 space-y-2">
            <p className="text-[11px] font-mono text-secondary uppercase tracking-widest">Talent ROI</p>
            <p className="text-sm text-primary font-mono">
              Legacy OpEx - Unified OpEx
            </p>
            <p className="text-xs text-secondary">
              Represents the yearly opportunity unlocked by a unified OS footprint.
            </p>
          </div>
        </section>

        <section className="p-8 rounded-[2.5rem] border border-border bg-card-bg/95 shadow-[0_25px_60px_-40px_rgba(0,0,0,0.85)]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-secondary">Executive Takeaway</div>
          <p className="text-base md:text-lg text-primary/85 leading-relaxed mt-3">
            Lead with focus: "Unified EOS reduces training churn and cognitive tax, freeing engineers for architecture work."
          </p>
          <p className="text-sm text-secondary mt-2">
            If you validate only one input, validate switching tax. It drives the largest swing.
          </p>
        </section>
      </main>
    </div>
  );
};
