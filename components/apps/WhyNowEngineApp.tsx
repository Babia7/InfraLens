import React, { useMemo, useState } from 'react';
import { ArrowLeft, Hourglass, DollarSign, AlertTriangle, TrendingUp, Calculator, Gauge, ShieldAlert, ArrowRightLeft, MessageSquare, Share2, ClipboardList, Copy, Check } from 'lucide-react';
import { SectionType } from '@/types';
import { RelatedActions } from '@/components/RelatedActions';
import { EvidenceDrawer } from '@/components/EvidenceDrawer';

interface WhyNowEngineAppProps {
  onBack: () => void;
  onNavigate?: (section: SectionType) => void;
}

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export const WhyNowEngineApp: React.FC<WhyNowEngineAppProps> = ({ onBack, onNavigate }) => {
  const [inputs, setInputs] = useState({
    customerName: 'Acme BioSystems',
    renewalMonths: 6,
    annualMaintenance: 250000,
    fteCount: 4,
    hoursWastedPerWeek: 8,
    hourlyRate: 125,
    downtimeCost: 100000,
    riskProbability: 25
  });
  const [copied, setCopied] = useState(false);

  const clampValue = (value: number, min = 0, max?: number) => {
    const safeValue = Number.isFinite(value) ? value : min;
    const bounded = Math.max(min, safeValue);
    return max === undefined ? bounded : Math.min(max, bounded);
  };

  const applyPreset = (preset: 'renewal' | 'brownfield' | 'ai') => {
    if (preset === 'renewal') {
      setInputs((prev) => ({ ...prev, renewalMonths: 6, annualMaintenance: 300000, fteCount: 3, hoursWastedPerWeek: 6, hourlyRate: 130, downtimeCost: 120000, riskProbability: 20 }));
    } else if (preset === 'brownfield') {
      setInputs((prev) => ({ ...prev, renewalMonths: 9, annualMaintenance: 450000, fteCount: 6, hoursWastedPerWeek: 10, hourlyRate: 140, downtimeCost: 180000, riskProbability: 30 }));
    } else {
      setInputs((prev) => ({ ...prev, renewalMonths: 4, annualMaintenance: 200000, fteCount: 5, hoursWastedPerWeek: 12, hourlyRate: 160, downtimeCost: 250000, riskProbability: 35 }));
    }
  };

  const results = useMemo(() => {
    const months = Math.max(1, inputs.renewalMonths);
    const weeks = months * 4.33;
    const sunkMaintenance = (inputs.annualMaintenance / 12) * months;
    const laborWaste = inputs.fteCount * inputs.hoursWastedPerWeek * weeks * inputs.hourlyRate;
    const riskExposure = inputs.downtimeCost * (inputs.riskProbability / 100) * (months / 12);
    const total = sunkMaintenance + laborWaste + riskExposure;
    return { months, weeks, sunkMaintenance, laborWaste, riskExposure, total };
  }, [inputs]);

  return (
    <div className="min-h-screen bg-page-bg text-primary flex flex-col">
      <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-card-bg/80 backdrop-blur z-20">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 text-secondary hover:text-primary rounded-lg hover:bg-card-bg transition">
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="font-serif font-bold text-lg tracking-tight">Why Now Engine</div>
            <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-secondary">Cost of Inaction · InfraLens</div>
          </div>
        </div>
        {onNavigate && (
          <RelatedActions
            actions={[
              { label: 'Sales Coach', onClick: () => onNavigate(SectionType.SALES_PLAYBOOK_COACH), icon: <MessageSquare size={12} />, tone: 'emerald' },
              { label: 'Narrative Playbook', onClick: () => onNavigate(SectionType.NARRATIVE_PLAYBOOK), icon: <Share2 size={12} />, tone: 'blue' },
              { label: 'MTTR Insurance', onClick: () => onNavigate(SectionType.MTTR_DOWNTIME_INSURANCE), icon: <ShieldAlert size={12} />, tone: 'rose' },
              { label: 'TCO Modeler', onClick: () => onNavigate(SectionType.TCO_CALCULATOR), icon: <Calculator size={12} />, tone: 'amber' }
            ]}
          />
        )}
      </header>

      <main className="flex-1 grid grid-cols-1 xl:grid-cols-[360px,1fr] gap-6 p-6 md:p-10">
        {/* Inputs rail */}
        <aside className="bg-card-bg border border-border rounded-2xl p-5 space-y-5">
          <div className="flex items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">
            <span className="flex items-center gap-2"><Calculator size={14} /> Model Inputs</span>
            <div className="flex gap-2 text-[10px] font-mono">
              <button onClick={() => applyPreset('renewal')} className="px-2 py-1 rounded bg-card-bg border border-border text-secondary hover:text-primary">Renewal</button>
              <button onClick={() => applyPreset('brownfield')} className="px-2 py-1 rounded bg-card-bg border border-border text-secondary hover:text-primary">Brownfield</button>
              <button onClick={() => applyPreset('ai')} className="px-2 py-1 rounded bg-card-bg border border-border text-secondary hover:text-primary">AI/ML</button>
            </div>
          </div>
          <div className="space-y-4">
            <label className="text-[11px] font-semibold text-primary flex flex-col gap-1">
              Customer Name
              <input
                type="text"
                className="w-full bg-input-bg border border-border rounded-lg px-3 py-2 text-sm text-primary"
                value={inputs.customerName}
                onChange={(e) => setInputs({ ...inputs, customerName: e.target.value })}
              />
            </label>
            <label className="text-[11px] font-semibold text-primary flex flex-col gap-1">
              Deferral Window (months)
              <input
                type="number"
                className="w-full bg-input-bg border border-border rounded-lg px-3 py-2 text-sm text-primary"
                value={inputs.renewalMonths}
                min={1}
                onChange={(e) => setInputs({ ...inputs, renewalMonths: clampValue(Number(e.target.value) || 1, 1) })}
              />
            </label>
            <div className="flex items-center gap-3 text-[10px] font-mono text-secondary">
              <span className="uppercase tracking-[0.3em]">Sensitivity</span>
              <button onClick={() => setInputs((p) => ({ ...p, renewalMonths: Math.max(1, p.renewalMonths - 1) }))} className="px-2 py-1 rounded border border-border bg-card-bg">-1m</button>
              <button onClick={() => setInputs((p) => ({ ...p, renewalMonths: p.renewalMonths + 1 }))} className="px-2 py-1 rounded border border-border bg-card-bg">+1m</button>
            </div>
            <div className="border border-border rounded-xl p-3 space-y-3 bg-card-bg/70">
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-secondary">Financials</p>
              <label className="text-xs text-secondary flex flex-col gap-1">
                Legacy Maintenance (Annual)
                <div className="flex items-center gap-2">
                  <DollarSign size={14} className="text-secondary" />
                  <input
                    type="number"
                    className="flex-1 bg-input-bg border border-border rounded-lg px-3 py-2 text-sm text-primary"
                    value={inputs.annualMaintenance}
                    onChange={(e) => setInputs({ ...inputs, annualMaintenance: clampValue(Number(e.target.value)) })}
                  />
                </div>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="text-xs text-secondary flex flex-col gap-1">
                  FTEs on care/feeding
                  <input
                    type="number"
                    className="w-full bg-input-bg border border-border rounded-lg px-3 py-2 text-sm text-primary"
                    value={inputs.fteCount}
                    onChange={(e) => setInputs({ ...inputs, fteCount: clampValue(Number(e.target.value)) })}
                  />
                </label>
                <label className="text-xs text-secondary flex flex-col gap-1">
                  Hours wasted / week
                  <input
                    type="number"
                    className="w-full bg-input-bg border border-border rounded-lg px-3 py-2 text-sm text-primary"
                    value={inputs.hoursWastedPerWeek}
                    onChange={(e) => setInputs({ ...inputs, hoursWastedPerWeek: clampValue(Number(e.target.value)) })}
                  />
                </label>
              </div>
              <label className="text-xs text-secondary flex flex-col gap-1">
                Blended hourly rate ($)
                <input
                  type="number"
                  className="w-full bg-input-bg border border-border rounded-lg px-3 py-2 text-sm text-primary"
                  value={inputs.hourlyRate}
                  onChange={(e) => setInputs({ ...inputs, hourlyRate: clampValue(Number(e.target.value)) })}
                />
              </label>
            </div>

            <div className="border border-border rounded-xl p-3 space-y-3 bg-card-bg/70">
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-secondary">Risk Model (deferral window)</p>
              <label className="text-xs text-secondary flex flex-col gap-1">
                Cost of major incident
                <div className="flex items-center gap-2">
                  <ShieldAlert size={14} className="text-secondary" />
                  <input
                    type="number"
                    className="flex-1 bg-input-bg border border-border rounded-lg px-3 py-2 text-sm text-primary"
                    value={inputs.downtimeCost}
                    onChange={(e) => setInputs({ ...inputs, downtimeCost: clampValue(Number(e.target.value)) })}
                  />
                </div>
              </label>
              <label className="text-xs text-secondary flex flex-col gap-1">
                Probability of incident (%)
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  className="w-full accent-emerald-500"
                  value={inputs.riskProbability}
                  onChange={(e) => setInputs({ ...inputs, riskProbability: Number(e.target.value) })}
                />
                <span className="text-[11px] text-primary font-semibold">{inputs.riskProbability}%</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Output panel */}
        <section className="bg-card-bg border border-border rounded-3xl p-6 md:p-10 space-y-8 shadow-lg">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/40 text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-300">Executive Snapshot</span>
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-secondary">{inputs.customerName}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight">
              The cost of waiting <span className="text-emerald-300">{results.months} months</span> is {currency.format(results.total)}.
            </h1>
            <p className="text-lg text-secondary max-w-3xl leading-relaxed">
              InfraLens frames the opportunity cost in three dimensions: sunk maintenance, operational drag, and probabilistic risk.
              Use this to anchor the “Why Now” story in Sales Playbook Coach or pull the summary straight into Narrative Playbook beats.
            </p>
            <div className="p-4 rounded-2xl border border-border bg-card-bg/70 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-secondary">Exec blurb</span>
                <button
                  onClick={() => {
                    const blurb = `Waiting ${results.months} months costs ${currency.format(results.total)} (${currency.format(results.sunkMaintenance)} maintenance, ${currency.format(results.laborWaste)} ops drag, ${currency.format(results.riskExposure)} risk). Fund the move with stopped bleed; pair with MTTR + TCO for proof.`;
                    navigator.clipboard.writeText(blurb);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  }}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg border border-border bg-card-bg text-secondary hover:text-primary text-[11px] font-semibold"
                >
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />} Copy
                </button>
              </div>
              <p className="text-sm text-primary leading-relaxed">
                Waiting {results.months} months burns {currency.format(results.total)} ({currency.format(results.sunkMaintenance)} maintenance, {currency.format(results.laborWaste)} ops drag, {currency.format(results.riskExposure)} risk).
                Fund the move with the stopped bleed; pair with MTTR Insurance + TCO ROI for proof.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Sunk Maintenance', value: results.sunkMaintenance, icon: DollarSign, tone: 'text-emerald-300', desc: 'Legacy contracts consumed during the deferral window.' },
              { label: 'Operational Drag', value: results.laborWaste, icon: Gauge, tone: 'text-blue-300', desc: 'Hours lost to manual work on brittle systems.' },
              { label: 'Risk Exposure', value: results.riskExposure, icon: AlertTriangle, tone: 'text-rose-300', desc: 'Probabilistic cost of a major incident over the window.' }
            ].map((card) => (
              <div key={card.label} className="p-4 rounded-2xl border border-border bg-card-bg/70 space-y-2">
                <div className="flex items-center gap-2 text-secondary text-xs uppercase tracking-[0.3em]">
                  <card.icon size={14} className={card.tone} /> {card.label}
                </div>
                <div className="text-2xl font-serif font-bold">{currency.format(card.value)}</div>
                <p className="text-sm text-secondary leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border border-border bg-card-bg/70 space-y-3">
              <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-secondary flex items-center gap-2">
                <TrendingUp size={14} className="text-blue-400" /> Narrative Hooks
              </div>
              <ul className="list-disc list-inside text-secondary space-y-2 text-sm">
                <li>Translate the {currency.format(results.total)} “inaction tax” into a 2-quarter payback benchmark.</li>
                <li>Pair with MTTR Insurance to show failure-mode containment and rollback coverage.</li>
                <li>Export to Sales Coach to personalize for persona/vertical and attach proof steps.</li>
              </ul>
            </div>
            <div className="p-5 rounded-2xl border border-border bg-card-bg/70 space-y-3">
              <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-secondary flex items-center gap-2">
                <ArrowRightLeft size={14} className="text-emerald-400" /> Integration Path
              </div>
              <p className="text-sm text-secondary leading-relaxed">
                Promote this summary into Narrative Playbook beats or drop it into a teleprompter script. Add the deal context (customer, stage, pain) from Sales Coach so delivery and discovery stay synchronized.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-semibold border border-border bg-card-bg text-secondary">Deal Context</span>
                <span className="px-3 py-1 rounded-full text-[11px] font-semibold border border-border bg-card-bg text-secondary">Proof Hooks</span>
                <span className="px-3 py-1 rounded-full text-[11px] font-semibold border border-border bg-card-bg text-secondary">Teleprompter</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-border bg-card-bg/70 space-y-3">
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-secondary">
              <ClipboardList size={14} className="text-emerald-300" /> Recommendations
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-secondary">
              <div className="p-3 rounded-xl border border-border bg-card-bg/60">
                <p className="font-semibold text-primary mb-1">Stage: Discovery</p>
                <p>Quantify drag and renewals; capture deal context in Sales Coach.</p>
              </div>
              <div className="p-3 rounded-xl border border-border bg-card-bg/60">
                <p className="font-semibold text-primary mb-1">Stage: Validation</p>
                <p>Map proof commands in Narrative Playbook; attach Evidence Locker artifacts.</p>
              </div>
              <div className="p-3 rounded-xl border border-border bg-card-bg/60">
                <p className="font-semibold text-primary mb-1">Stage: Decision</p>
                <p>Share the inaction tax as a one-pager, paired with MTTR and TCO outputs.</p>
              </div>
            </div>
          </div>

          <EvidenceDrawer contextTags={['Sales', 'Financial Logic']} />
        </section>
      </main>
    </div>
  );
};
