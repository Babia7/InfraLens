
import React, { useState, useMemo } from 'react';
import { ArrowLeft, ShieldAlert, TrendingDown, DollarSign, Activity, Zap, AlertTriangle, ShieldCheck, Clock, Layers, Sparkles, Copy, Check, Shield, Target, Telescope, Info } from 'lucide-react';
import { EvidenceDrawer } from '@/components/EvidenceDrawer';
import { SectionType } from '@/types';

interface MTTRDowntimeInsuranceProps {
  onBack: () => void;
  onNavigate?: (section: SectionType) => void;
}

const SCENARIOS = {
  SaaS: { downtimeCostPerHour: 250000, incidentsPerYear: 6, legacyMTTR: 6, aristaMTTR: 0.5 },
  Finance: { downtimeCostPerHour: 400000, incidentsPerYear: 3, legacyMTTR: 8, aristaMTTR: 0.75 },
  Campus: { downtimeCostPerHour: 75000, incidentsPerYear: 5, legacyMTTR: 5, aristaMTTR: 0.4 }
} as const;

const InputField = ({ label, value, onChange, unit, icon: Icon, desc }: any) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-secondary flex items-center gap-2">
        {Icon && <Icon size={12} />} {label}
      </label>
      <span className="text-[10px] font-mono text-secondary">{desc}</span>
    </div>
    <div className="relative">
      <input 
        type="number" 
        value={value} 
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="w-full bg-card-bg border border-border rounded-xl p-3 text-primary focus:border-rose-500 outline-none transition-all font-mono text-sm"
      />
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-mono text-secondary">{unit}</span>
    </div>
  </div>
);

export const MTTRDowntimeInsurance: React.FC<MTTRDowntimeInsuranceProps> = ({ onBack, onNavigate }) => {
  // Financial Inputs
  const [downtimeCostPerHour, setDowntimeCostPerHour] = useState(150000);
  const [incidentsPerYear, setIncidentsPerYear] = useState(4);
  const [legacyMTTR, setLegacyMTTR] = useState(8); // Hours
  const [aristaMTTR, setAristaMTTR] = useState(0.5); // Hours (SysDB hitless or rapid converge)
  const [copied, setCopied] = useState(false);
  const [scenario, setScenario] = useState<keyof typeof SCENARIOS | 'Custom'>('Custom');

  const clampValue = (value: number, min = 0, max?: number) => {
    const safeValue = Number.isFinite(value) ? value : min;
    const bounded = Math.max(min, safeValue);
    return max === undefined ? bounded : Math.min(max, bounded);
  };

  const formatDuration = (hours: number) => {
    if (!Number.isFinite(hours) || hours <= 0) return '0h';
    if (hours < 1) {
      return `${Math.max(1, Math.round(hours * 60))}m`;
    }
    return `${hours < 10 ? hours.toFixed(1) : Math.round(hours)}h`;
  };

  const stats = useMemo(() => {
    const safeIncidents = Math.max(0, incidentsPerYear);
    const safeCostPerHour = Math.max(0, downtimeCostPerHour);
    const safeLegacyMTTR = Math.max(0, legacyMTTR);
    const safeAristaMTTR = Math.max(0, aristaMTTR);

    const legacyYearlyLoss = safeIncidents * safeLegacyMTTR * safeCostPerHour;
    const aristaYearlyLoss = safeIncidents * safeAristaMTTR * safeCostPerHour;
    const yearlySavings = legacyYearlyLoss - aristaYearlyLoss;
    const mttrReduction = safeLegacyMTTR > 0
      ? Math.max(0, Math.min(100, Math.round((1 - (safeAristaMTTR / safeLegacyMTTR)) * 100)))
      : 0;
    const lossRatio = legacyYearlyLoss > 0 ? aristaYearlyLoss / legacyYearlyLoss : 0;
    const lossBarWidth = Math.max(0, Math.min(100, Math.round(lossRatio * 100)));

    return {
      legacyYearlyLoss,
      aristaYearlyLoss,
      yearlySavings,
      resilienceScore: mttrReduction,
      mttrReduction,
      lossBarWidth
    };
  }, [downtimeCostPerHour, incidentsPerYear, legacyMTTR, aristaMTTR]);

  return (
    <div className="min-h-screen bg-page-bg text-primary font-sans flex flex-col md:flex-row overflow-hidden selection:bg-rose-500/30">
      
      {/* SIDEBAR: ACTUARIAL INPUTS */}
      <aside className="w-full md:w-80 border-b md:border-b-0 md:border-r border-border bg-card-bg flex flex-col shrink-0 z-30 overflow-y-auto h-[50vh] md:h-screen">
         <div className="p-8 border-b border-border">
            <button onClick={onBack} className="flex items-center gap-2 text-secondary hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest mb-6">
                <ArrowLeft size={14} /> InfraLens
            </button>
            <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-500">
                    <ShieldAlert size={24} />
                </div>
                <div>
                    <h1 className="text-xl font-serif font-bold tracking-tight text-primary">MTTR Insurance</h1>
                    <div className="text-[10px] font-mono text-secondary uppercase tracking-widest mt-0.5">Reliability Modeler</div>
                </div>
            </div>
         </div>

         <div className="p-8 space-y-8 flex-1">
            <section className="space-y-6">
                <h3 className="text-[10px] font-bold text-rose-500 uppercase tracking-[0.3em]">Actuarial Constants</h3>
                <InputField label="Revenue Impact" value={downtimeCostPerHour} onChange={(value: number) => setDowntimeCostPerHour(clampValue(value))} unit="/Hr" icon={DollarSign} desc="Cost of Blackout" />
                <InputField label="Annual Frequency" value={incidentsPerYear} onChange={(value: number) => setIncidentsPerYear(clampValue(value))} unit="Events" icon={Activity} desc="Outage Probability" />
            </section>

            <section className="space-y-6 pt-8 border-t border-border">
                <h3 className="text-[10px] font-bold text-secondary uppercase tracking-[0.3em]">Recovery Metrics</h3>
                <div className="space-y-4">
                  <InputField label="Legacy MTTR" value={legacyMTTR} onChange={(value: number) => setLegacyMTTR(clampValue(value))} unit="Hrs" icon={Clock} desc="Monolithic Reboot" />
                  <InputField label="Arista MTTR" value={aristaMTTR} onChange={(value: number) => setAristaMTTR(clampValue(value))} unit="Hrs" icon={Zap} desc="SysDB Hitless" />
                </div>
            </section>
         </div>
      </aside>

      {/* MAIN: RISK DASHBOARD */}
      <main className="flex-1 overflow-y-auto bg-page-bg relative flex flex-col">
         <div className="absolute inset-0 bg-[linear-gradient(rgba(244,63,94,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(244,63,94,0.02)_1px,transparent_1px)] bg-[length:40px_40px] pointer-events-none"></div>

         <div className="flex-1 p-8 md:p-16 relative z-10 max-w-5xl mx-auto w-full space-y-12">
            <header className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <h2 className="text-5xl md:text-7xl font-serif font-bold tracking-tighter text-primary leading-none">The Risk Gap</h2>
                    <p className="text-xl text-secondary font-light mt-4">Calculating the financial "Insurance" provided by State-Based software architecture.</p>
                </div>
                <div className="text-right">
                    <span className="text-xs font-mono text-secondary uppercase tracking-widest block mb-1">Avoided Revenue Loss</span>
                    <div className="text-5xl font-bold text-emerald-400 font-mono tracking-tighter">
                        ${Math.round(stats.yearlySavings).toLocaleString()}
                    </div>
                    <span className="text-[10px] font-mono text-secondary uppercase">Per Annum</span>
                    {onNavigate && (
                      <button
                        onClick={() => onNavigate(SectionType.MTTR_DOWNTIME_INSURANCE_ABOUT)}
                        className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card-bg text-[11px] text-secondary hover:text-primary hover:border-rose-500/60 transition"
                        aria-label="Open MTTR methodology"
                      >
                        <Info size={14} /> About
                      </button>
                    )}
                </div>
            </header>

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-secondary">Sample scenarios</span>
              {(['SaaS', 'Finance', 'Campus'] as const).map((name) => (
                <button
                  key={name}
                  onClick={() => {
                    const preset = SCENARIOS[name];
                    setDowntimeCostPerHour(preset.downtimeCostPerHour);
                    setIncidentsPerYear(preset.incidentsPerYear);
                    setLegacyMTTR(preset.legacyMTTR);
                    setAristaMTTR(preset.aristaMTTR);
                    setScenario(name);
                  }}
                  className={`px-3 py-1.5 rounded-full text-[11px] border transition ${
                    scenario === name
                      ? 'border-rose-400/70 bg-rose-500/10 text-primary'
                      : 'border-border bg-card-bg text-secondary hover:border-rose-400/50 hover:text-primary'
                  }`}
                >
                  {name}
                </button>
              ))}
              <button
                onClick={() => setScenario('Custom')}
                className={`px-3 py-1.5 rounded-full text-[11px] border transition ${
                  scenario === 'Custom'
                    ? 'border-emerald-400/70 bg-emerald-500/10 text-primary'
                    : 'border-border bg-card-bg text-secondary hover:border-emerald-400/50 hover:text-primary'
                }`}
              >
                Custom
              </button>
              {scenario !== 'Custom' && (
                <span className="text-[10px] font-mono text-secondary">Loaded {scenario} defaults</span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-8 bg-card-bg border border-border rounded-[2.5rem] space-y-4 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><TrendingDown size={80} /></div>
                    <span className="text-[10px] font-mono uppercase text-rose-500 tracking-[0.2em] mb-4 block">Risk Exposure Reduction</span>
                    <div className="text-5xl font-bold text-primary tracking-tighter">{stats.resilienceScore}%</div>
                    <p className="text-xs text-secondary leading-relaxed">Reduction in critical "Blackout Time" via sub-second process recovery.</p>
                </div>

                <div className="p-8 bg-card-bg border border-border rounded-[2.5rem] space-y-4 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Layers size={80} /></div>
                    <span className="text-[10px] font-mono uppercase text-indigo-500 tracking-[0.2em] mb-4 block">Architectural Shield</span>
                    <div className="text-5xl font-bold text-primary tracking-tighter">Hitless</div>
                    <p className="text-xs text-secondary leading-relaxed">SysDB allows protocol restarts without clearing the hardware forwarding table.</p>
                </div>

                <div className="p-8 bg-card-bg border border-border rounded-[2.5rem] space-y-4 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><ShieldCheck size={80} /></div>
                    <span className="text-[10px] font-mono uppercase text-emerald-500 tracking-[0.2em] mb-4 block">MTTR Assurance</span>
                    <div className="text-5xl font-bold text-primary tracking-tighter">{formatDuration(aristaMTTR)}</div>
                    <p className="text-xs text-secondary leading-relaxed">Typical Arista recovery time including human validation vs. multi-hour reloads.</p>
                </div>
            </div>

            {/* COMPARATIVE VISUALIZATION */}
            <section className="bg-card-bg border border-border rounded-[3rem] p-12 relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 p-8 opacity-5"><Sparkles size={120} className="text-rose-500" /></div>
               <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-rose-500 mb-12 flex items-center gap-3">
                  <AlertTriangle size={16} /> Architectural Deconstruction
               </h3>
               
               <div className="space-y-12">
                  <div className="space-y-4">
                     <div className="flex justify-between items-end">
                        <span className="text-sm font-bold text-secondary uppercase tracking-widest">Legacy Monolithic Cascade</span>
                        <span className="text-rose-500 font-mono font-bold">${stats.legacyYearlyLoss.toLocaleString()}</span>
                     </div>
                     <div className="h-4 w-full surface-muted rounded-full overflow-hidden flex">
                        <div className="h-full bg-rose-900/50 w-full animate-pulse"></div>
                     </div>
                     <p className="text-[10px] text-secondary">Failure logic: If one process crashes, the entire system state is purged, forcing a full hardware reload.</p>
                  </div>

                  <div className="space-y-4">
                     <div className="flex justify-between items-end">
                        <span className="text-sm font-bold text-emerald-500 uppercase tracking-widest">Arista SysDB Resilience</span>
                        <span className="text-emerald-400 font-mono font-bold">${stats.aristaYearlyLoss.toLocaleString()}</span>
                     </div>
                     <div className="h-4 w-full surface-muted rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${stats.lossBarWidth}%` }}></div>
                     </div>
                     <p className="text-[10px] text-secondary">Failure logic: Independent agents sync to SysDB. Protocol restarts are localized. Forwarding plane remains active.</p>
                  </div>
               </div>
            </section>

            <div className="p-10 rounded-[3rem] bg-gradient-to-br from-rose-600 to-indigo-900 border border-rose-400/30 text-left relative overflow-hidden group">
               <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
               <div className="relative z-10 space-y-8">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                    <div className="space-y-3">
                      <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-rose-100/70">Executive Summary</span>
                      <h3 className="text-3xl font-serif font-bold text-white">Uptime is Software</h3>
                      <p className="text-rose-50/80 max-w-2xl leading-relaxed text-primary">
                        Most organizations treat downtime as an "Act of God." Arista treats it as an architectural flaw. By decoupling state from protocol logic, we provide <strong>Infrastructure Insurance</strong> at the kernel level.
                      </p>
                      <div className="flex flex-wrap gap-3 text-[11px] font-mono uppercase tracking-[0.2em] text-secondary">
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15"><Shield size={12}/> State decoupled</div>
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15"><Target size={12}/> Blast radius containment</div>
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15"><Telescope size={12}/> Observable recovery</div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText('Uptime is Software — Most organizations treat downtime as an "Act of God." Arista treats it as an architectural flaw. By decoupling state from protocol logic, we provide Infrastructure Insurance at the kernel level.');
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="self-start inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/30 text-white/90 bg-white/10 hover:bg-white/15 transition"
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy summary'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 rounded-2xl bg-white/10 border border-white/15 text-secondary space-y-2">
                      <span className="text-[10px] font-mono uppercase tracking-[0.3em]">How we insure</span>
                      <ul className="text-sm space-y-1 list-disc list-inside">
                        <li>State decoupled from protocol logic (SysDB keeps forwarding alive).</li>
                        <li>Fault isolation per agent to contain blast radius.</li>
                        <li>Observable recovery with pre/post telemetry checks.</li>
                      </ul>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/10 border border-white/15 text-secondary space-y-3">
                      <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Risk lens</span>
                      <div className="flex flex-col gap-2 text-sm">
                        <div className="flex justify-between"><span>Target SLO</span><span className="font-mono">99.99%</span></div>
                        <div className="flex justify-between"><span>MTTR reduction</span><span className="font-mono">-{stats.mttrReduction}%</span></div>
                        <div className="flex justify-between"><span>Blast radius</span><span className="font-mono">Process-local</span></div>
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/10 border border-white/15 text-secondary space-y-2">
                      <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Proof hooks</span>
                      <ul className="text-sm space-y-1 list-disc list-inside">
                        <li>CVaaS change window with pre/post snapshots.</li>
                        <li>SysDB restart demo (forwarding stays up).</li>
                        <li>Rollback script + telemetry check for audit.</li>
                      </ul>
                      <div className="mt-3 space-y-1 text-[12px] text-secondary">
                        <div className="flex items-center gap-2"><Check size={12} /> Snapshot before/after change</div>
                        <div className="flex items-center gap-2"><Check size={12} /> Guardrails: rollback script staged</div>
                        <div className="flex items-center gap-2"><Check size={12} /> Owner: change window captain assigned</div>
                      </div>
                    </div>
                  </div>
               </div>
            </div>

            <EvidenceDrawer contextTags={['MTTR']} />
         </div>

         <footer className="p-12 border-t border-border surface-muted flex justify-between items-center text-[10px] font-mono text-secondary uppercase tracking-[0.3em]">
            <span>MTTR-INSURE-002 // RELIABILITY CORE</span>
            <span>PROPRIETARY FIELD ROI TOOL</span>
         </footer>
      </main>
    </div>
  );
};
