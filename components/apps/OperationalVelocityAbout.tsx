import React from 'react';
import { ArrowLeft, TrendingUp, Info, BookOpen, Clock, AlertTriangle, DollarSign } from 'lucide-react';
import { SectionType } from '@/types';
import { RelatedActions } from '@/components/RelatedActions';

interface OperationalVelocityAboutProps {
  onBack: () => void;
  onNavigate?: (section: SectionType) => void;
}

export const OperationalVelocityAbout: React.FC<OperationalVelocityAboutProps> = ({ onBack, onNavigate }) => {
  return (
    <div className="min-h-screen bg-page-bg text-primary flex flex-col relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_500px_at_15%_-10%,rgba(59,130,246,0.18),transparent_60%),radial-gradient(800px_520px_at_90%_0%,rgba(14,165,233,0.12),transparent_60%)]" />
      <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-card-bg/85 backdrop-blur z-20 shadow-[0_10px_30px_-22px_rgba(0,0,0,0.9)]">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 text-secondary hover:text-primary rounded-lg hover:bg-card-bg transition">
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400">
              <TrendingUp size={18} />
            </div>
            <div>
              <h1 className="font-serif font-bold text-lg tracking-tight leading-none">Op-Velocity Modeler · About</h1>
              <span className="text-[10px] font-mono text-secondary uppercase tracking-widest mt-1 block">Operational ROI and Automation Uplift</span>
            </div>
          </div>
        </div>
        {onNavigate && (
          <RelatedActions
            actions={[
              { label: 'Velocity App', onClick: () => onNavigate(SectionType.OPERATIONAL_VELOCITY_MODELER), icon: <BookOpen size={12} />, tone: 'blue' }
            ]}
          />
        )}
      </header>

      <main className="flex-1 p-6 md:p-12 space-y-10 relative z-10">
        <section className="grid grid-cols-1 lg:grid-cols-[1.2fr,0.8fr] gap-6">
          <div className="p-8 rounded-[2.5rem] border border-border bg-card-bg/90 shadow-[0_25px_60px_-40px_rgba(0,0,0,0.85)] space-y-5">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-secondary">
              <Info size={14} className="text-blue-400" /> Why this model exists
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tight">
              Make automation ROI explicit.
            </h2>
            <p className="text-base md:text-lg text-primary/80 leading-relaxed max-w-2xl">
              The Op-Velocity Modeler estimates yearly operational savings by comparing manual change workflows to automated change workflows.
              It combines execution time with error remediation overhead, then converts hours to cost, FTE equivalents, and change-risk reduction.
            </p>
            <div className="flex flex-wrap gap-2 text-[11px] font-mono uppercase tracking-[0.3em] text-secondary">
              <span className="px-3 py-1 rounded-full border border-border bg-card-bg">Deterministic Output</span>
              <span className="px-3 py-1 rounded-full border border-border bg-card-bg">Editable Inputs</span>
              <span className="px-3 py-1 rounded-full border border-border bg-card-bg">Annualized View</span>
            </div>
          </div>
          <div className="p-6 rounded-[2.5rem] border border-border bg-card-bg/85 shadow-[0_25px_60px_-40px_rgba(0,0,0,0.85)] space-y-4">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-secondary">
              <BookOpen size={14} className="text-blue-400" /> Assumptions
            </div>
            <ul className="text-sm text-primary/80 space-y-2 list-disc list-inside">
              <li>52 weeks per year with steady change volume.</li>
              <li>Manual and automated error rates represent the percent of changes that require remediation.</li>
              <li>Remediation hours represent average effort per error event.</li>
              <li>Automated time and error inputs reflect the target post-automation steady state.</li>
              <li>Labor rate is fully burdened and applied to all hours.</li>
              <li>Savings = Manual cost minus automated cost; outputs are deterministic.</li>
            </ul>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 rounded-[2rem] border border-border bg-card-bg/90 shadow-[0_20px_50px_-35px_rgba(0,0,0,0.85)]">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-secondary mb-3">
              <Clock size={14} className="text-blue-400" /> Time Model
            </div>
            <p className="text-sm text-primary/80 leading-relaxed">
              Change time = changes per week x hours per change x 52. This captures execution time only and separates manual vs automated effort.
            </p>
          </div>
          <div className="p-6 rounded-[2rem] border border-border bg-card-bg/90 shadow-[0_20px_50px_-35px_rgba(0,0,0,0.85)]">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-secondary mb-3">
              <AlertTriangle size={14} className="text-amber-400" /> Error Model
            </div>
            <p className="text-sm text-primary/80 leading-relaxed">
              Remediation hours = changes per week x error rate x remediation hours x 52 (computed for manual and automated paths).
              Change risk reduction is derived from the ratio between manual and automated error rates.
            </p>
          </div>
          <div className="p-6 rounded-[2rem] border border-border bg-card-bg/90 shadow-[0_20px_50px_-35px_rgba(0,0,0,0.85)]">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-secondary mb-3">
              <DollarSign size={14} className="text-emerald-400" /> Cost Model
            </div>
            <p className="text-sm text-primary/80 leading-relaxed">
              Total cost = total hours x labor rate. FTE potential = (manual hours minus automated hours) / 2080 hours.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="p-6 rounded-[2rem] border border-border bg-card-bg/85 shadow-[0_20px_50px_-35px_rgba(0,0,0,0.85)] space-y-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-secondary">Typical Ranges</div>
            <ul className="text-sm text-primary/80 space-y-2">
              <li><span className="text-primary font-semibold">Changes:</span> 5-50 per week</li>
              <li><span className="text-primary font-semibold">Manual time:</span> 1-6 hours per change</li>
              <li><span className="text-primary font-semibold">Auto time:</span> 0.1-1 hour per change</li>
              <li><span className="text-primary font-semibold">Manual error:</span> 5-30%</li>
              <li><span className="text-primary font-semibold">Auto error:</span> 0.5-5%</li>
            </ul>
          </div>
          <div className="p-6 rounded-[2rem] border border-border bg-card-bg/85 shadow-[0_20px_50px_-35px_rgba(0,0,0,0.85)] space-y-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-secondary">Validation Checklist</div>
            <ul className="text-sm text-primary/80 space-y-2">
              <li>Use change logs to validate weekly change volume.</li>
              <li>Sample tickets to estimate manual hours per change.</li>
              <li>Review incident data for remediation duration.</li>
              <li>Confirm labor rate with fully burdened finance inputs.</li>
            </ul>
          </div>
          <div className="p-6 rounded-[2rem] border border-border bg-card-bg/85 shadow-[0_20px_50px_-35px_rgba(0,0,0,0.85)] space-y-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-secondary">Scope Boundaries</div>
            <ul className="text-sm text-primary/80 space-y-2">
              <li>Excludes tooling license costs and training time.</li>
              <li>Does not quantify outage impact or revenue loss.</li>
              <li>Assumes change volume remains steady year to year.</li>
            </ul>
          </div>
        </section>

        <section className="p-8 rounded-[2.5rem] border border-border bg-card-bg/90 space-y-5 shadow-[0_25px_60px_-40px_rgba(0,0,0,0.85)]">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-secondary">
            <Info size={14} className="text-blue-400" /> Math at a Glance
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border border-border bg-card-bg/70 space-y-2">
              <p className="text-[11px] font-mono text-secondary uppercase tracking-widest">Manual Hours</p>
              <p className="text-sm text-primary font-mono">
                (Changes/Week x Manual Hours x 52) + (Changes/Week x Manual Error% x Remediation Hours x 52)
              </p>
            </div>
            <div className="p-5 rounded-2xl border border-border bg-card-bg/70 space-y-2">
              <p className="text-[11px] font-mono text-secondary uppercase tracking-widest">Automated Hours</p>
              <p className="text-sm text-primary font-mono">
                (Changes/Week x Auto Hours x 52) + (Changes/Week x Auto Error% x Remediation Hours x 52)
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border border-border bg-card-bg/70 space-y-2">
              <p className="text-[11px] font-mono text-secondary uppercase tracking-widest">Cost</p>
              <p className="text-sm text-primary font-mono">Total Hours x $/Hour</p>
            </div>
            <div className="p-5 rounded-2xl border border-border bg-card-bg/70 space-y-2">
              <p className="text-[11px] font-mono text-secondary uppercase tracking-widest">FTE Potential</p>
              <p className="text-sm text-primary font-mono">(Manual Hours - Automated Hours) / 2080</p>
            </div>
          </div>
          <div className="p-5 rounded-2xl border border-border bg-card-bg/70 space-y-2">
            <p className="text-[11px] font-mono text-secondary uppercase tracking-widest">Change Risk Reduction</p>
            <p className="text-sm text-primary font-mono">1 - (Auto Error% / Manual Error%)</p>
            <p className="text-xs text-secondary">Represents the percent reduction in change-related error rate.</p>
          </div>
        </section>

        <section className="p-8 rounded-[2.5rem] border border-border bg-card-bg/90 shadow-[0_25px_60px_-40px_rgba(0,0,0,0.85)]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-secondary">Executive Takeaway</div>
          <p className="text-base md:text-lg text-primary/85 leading-relaxed mt-3">
            Lead with time: "Automation reduces operational hours and error remediation, turning change velocity into measurable ROI."
          </p>
          <p className="text-sm text-secondary mt-2">
            If you validate only one input, validate manual hours per change. It drives the biggest swing.
          </p>
        </section>
      </main>
    </div>
  );
};
