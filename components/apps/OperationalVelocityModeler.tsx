
import React, { useState, useMemo } from 'react';
import { ArrowLeft, Clock, TrendingUp, DollarSign, Zap, Info, Activity, Cpu, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';
import { SectionType } from '@/types';

interface OperationalVelocityModelerProps {
  onBack: () => void;
  onNavigate?: (section: SectionType) => void;
}

const InputField = ({ label, value, onChange, unit, icon: Icon }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-secondary flex items-center gap-2">
      {Icon && <Icon size={12} />} {label}
    </label>
    <div className="relative">
      <input 
        type="number" 
        value={value} 
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="w-full bg-card-bg border border-border rounded-xl p-3 text-primary focus:border-blue-500 outline-none transition-all font-mono text-sm"
      />
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-mono text-secondary">{unit}</span>
    </div>
  </div>
);

export const OperationalVelocityModeler: React.FC<OperationalVelocityModelerProps> = ({ onBack, onNavigate }) => {
  // Inputs
  const [changesPerWeek, setChangesPerWeek] = useState(15);
  const [hoursPerManualChange, setHoursPerManualChange] = useState(4);
  const [hoursPerAutomatedChange, setHoursPerAutomatedChange] = useState(0.5);
  const [hourlyRate, setHourlyRate] = useState(150);
  const [errorRateManual, setErrorRateManual] = useState(20); // %
  const [errorRateAuto, setErrorRateAuto] = useState(1); // %
  const [remediationHours, setRemediationHours] = useState(8);

  const clampValue = (value: number, min = 0, max?: number) => {
    const safeValue = Number.isFinite(value) ? value : 0;
    const bounded = Math.max(min, safeValue);
    return max === undefined ? bounded : Math.min(max, bounded);
  };

  const handleChangesPerWeek = (value: number) => setChangesPerWeek(clampValue(value));
  const handleHoursPerManualChange = (value: number) => setHoursPerManualChange(clampValue(value));
  const handleHoursPerAutomatedChange = (value: number) => setHoursPerAutomatedChange(clampValue(value));
  const handleHourlyRate = (value: number) => setHourlyRate(clampValue(value));
  const handleErrorRateManual = (value: number) => setErrorRateManual(clampValue(value, 0, 100));
  const handleErrorRateAuto = (value: number) => setErrorRateAuto(clampValue(value, 0, 100));
  const handleRemediationHours = (value: number) => setRemediationHours(clampValue(value));

  const stats = useMemo(() => {
    const weeksPerYear = 52;
    const manualYearlyHours = changesPerWeek * hoursPerManualChange * weeksPerYear;
    const autoYearlyHours = changesPerWeek * hoursPerAutomatedChange * weeksPerYear;
    
    const manualErrorHours = (changesPerWeek * (errorRateManual / 100)) * remediationHours * weeksPerYear;
    const autoErrorHours = (changesPerWeek * (errorRateAuto / 100)) * remediationHours * weeksPerYear;

    const totalManualHours = manualYearlyHours + manualErrorHours;
    const totalAutoHours = autoYearlyHours + autoErrorHours;

    const manualCost = totalManualHours * hourlyRate;
    const autoCost = totalAutoHours * hourlyRate;
    const savings = manualCost - autoCost;
    const fteSavings = (totalManualHours - totalAutoHours) / 2080;
    const timeReduced = totalManualHours > 0
      ? Math.round(((totalManualHours - totalAutoHours) / totalManualHours) * 100)
      : 0;
    const complianceCertainty = errorRateManual > 0
      ? Math.max(-100, Math.min(100, Math.round((1 - (errorRateAuto / errorRateManual)) * 100)))
      : 0;

    return {
      savings,
      fteSavings,
      timeReduced,
      complianceCertainty,
      manualCost,
      autoCost
    };
  }, [changesPerWeek, hoursPerManualChange, hoursPerAutomatedChange, hourlyRate, errorRateManual, errorRateAuto, remediationHours]);

  const savingsLabel = stats.savings >= 0 ? 'Yearly Savings' : 'Yearly Net Increase';
  const savingsTone = stats.savings >= 0 ? 'text-emerald-400' : 'text-rose-400';
  const savingsValue = `${stats.savings >= 0 ? '' : '-'}$${Math.round(Math.abs(stats.savings)).toLocaleString()}`;
  const timeLabel = stats.timeReduced >= 0 ? 'Velocity Uplift' : 'Velocity Drag';
  const timeTone = stats.timeReduced >= 0 ? 'text-blue-500' : 'text-rose-500';
  const timeDescription = stats.timeReduced >= 0
    ? 'Reduction in engineering time spent on low-value repetitive tasks.'
    : 'Increase in engineering time due to slower change execution.';
  const riskLabel = stats.complianceCertainty >= 0 ? 'Change Risk Reduction' : 'Change Risk Increase';
  const riskTone = stats.complianceCertainty >= 0 ? 'text-emerald-500' : 'text-rose-500';
  const riskDescription = stats.complianceCertainty >= 0
    ? 'Reduction in change-related error rate based on manual vs automated inputs.'
    : 'Increase in change-related error rate based on manual vs automated inputs.';
  const handleExportBrief = () => {
    const content = `OPERATIONAL ROI BRIEF
Changes per week: ${changesPerWeek}
Manual time/change: ${hoursPerManualChange} hrs
Automated time/change: ${hoursPerAutomatedChange} hrs
Hourly labor rate: $${hourlyRate}/hr
Manual error rate: ${errorRateManual}%
Automated error rate: ${errorRateAuto}%
Remediation hours: ${remediationHours} hrs

Summary:
- Net yearly impact: ${savingsValue}
- Velocity change: ${stats.timeReduced}%
- FTE delta: ${stats.fteSavings.toFixed(1)}
- Change risk delta: ${stats.complianceCertainty}%

Notes:
- Assumes 52 weeks/year.
- Error remediation modeled as hours lost per incident.
`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Operational_ROI_Brief_${new Date().toISOString()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-page-bg text-primary font-sans flex flex-col md:flex-row overflow-hidden selection:bg-blue-500/30">
      
      {/* SIDEBAR: INPUTS */}
      <aside className="w-full md:w-80 border-b md:border-b-0 md:border-r border-border bg-card-bg flex flex-col shrink-0 z-30 overflow-y-auto h-[50vh] md:h-screen">
         <div className="p-8 border-b border-border">
            <button onClick={onBack} className="flex items-center gap-2 text-secondary hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest mb-6">
                <ArrowLeft size={14} /> InfraLens
            </button>
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400">
                    <TrendingUp size={24} />
                </div>
                <div>
                    <h1 className="text-xl font-serif font-bold tracking-tight text-primary">Op-Velocity</h1>
                    <div className="text-[10px] font-mono text-secondary uppercase tracking-widest mt-0.5">Automation ROI Lab</div>
                </div>
            </div>
         </div>

         <div className="p-8 space-y-8 flex-1">
            <section className="space-y-4">
                <h3 className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.3em]">Operational Load</h3>
                <InputField label="Changes" value={changesPerWeek} onChange={handleChangesPerWeek} unit="/ Week" icon={Activity} />
                <InputField label="Manual Time" value={hoursPerManualChange} onChange={handleHoursPerManualChange} unit="Hrs" icon={Clock} />
                <InputField label="Labor Rate" value={hourlyRate} onChange={handleHourlyRate} unit="$/Hr" icon={DollarSign} />
            </section>

            <section className="space-y-4 pt-8 border-t border-border">
                <h3 className="text-[10px] font-bold text-secondary uppercase tracking-[0.3em]">Risk Profile</h3>
                <InputField label="Manual Error %" value={errorRateManual} onChange={handleErrorRateManual} unit="%" icon={AlertTriangle} />
                <InputField label="Remediation" value={remediationHours} onChange={handleRemediationHours} unit="Hrs" icon={ShieldCheck} />
            </section>
         </div>
      </aside>

      {/* MAIN: DASHBOARD */}
      <main className="flex-1 overflow-y-auto bg-page-bg relative flex flex-col">
         <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.02)_1px,transparent_1px)] bg-[length:40px_40px] pointer-events-none"></div>

         <div className="flex-1 p-8 md:p-16 relative z-10 max-w-5xl mx-auto w-full space-y-12">
            <header className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <h2 className="text-5xl md:text-7xl font-serif font-bold tracking-tighter text-primary leading-none">Operational ROI</h2>
                    <p className="text-xl text-secondary font-light mt-4">Modeling the shift from "CLI Friction" to "Declarative Speed."</p>
                </div>
                <div className="text-right">
                    <span className="text-xs font-mono text-secondary uppercase tracking-widest block mb-1">{savingsLabel}</span>
                    <div className={`text-5xl font-bold font-mono tracking-tighter ${savingsTone}`}>
                        {savingsValue}
                    </div>
                    {onNavigate && (
                      <button
                        onClick={() => onNavigate(SectionType.OPERATIONAL_VELOCITY_MODELER_ABOUT)}
                        className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card-bg text-[11px] text-secondary hover:text-primary hover:border-blue-500/60 transition"
                        aria-label="Open Op-Velocity methodology"
                      >
                        <Info size={14} /> About
                      </button>
                    )}
                </div>
            </header>

            <section className="bg-card-bg border border-border rounded-[2.5rem] p-6 md:p-8">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-500 mb-3">
                  <Info size={14} /> Why this ROI matters
                </div>
                <p className="text-sm text-secondary leading-relaxed">
                  This calculation translates change velocity and error reduction into annual OpEx, giving finance and operations a shared, defensible baseline.
                  It surfaces the opportunity cost of manual workflows, clarifies payback for automation, and supports decisions to reallocate engineers from maintenance to innovation.
                </p>
            </section>

            <section className="bg-card-bg border border-border rounded-[2.5rem] p-6 space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-blue-500">
                  <Info size={14} /> Assumptions
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl border border-border surface-muted text-xs text-secondary leading-relaxed">
                    Weeks per year are fixed at 52. Auto values reflect the target state after automation rollout.
                  </div>
                  <InputField label="Automated Time" value={hoursPerAutomatedChange} onChange={handleHoursPerAutomatedChange} unit="Hrs" icon={Clock} />
                  <InputField label="Auto Error %" value={errorRateAuto} onChange={handleErrorRateAuto} unit="%" icon={AlertTriangle} />
                </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-8 bg-card-bg border border-border rounded-[2.5rem] space-y-4 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Zap size={80} /></div>
                    <span className={`text-[10px] font-mono uppercase tracking-[0.2em] mb-4 block ${timeTone}`}>{timeLabel}</span>
                    <div className="text-5xl font-bold text-primary tracking-tighter">{stats.timeReduced}%</div>
                    <p className="text-xs text-secondary leading-relaxed">{timeDescription}</p>
                </div>

                <div className="p-8 bg-card-bg border border-border rounded-[2.5rem] space-y-4 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Cpu size={80} /></div>
                    <span className="text-[10px] font-mono uppercase text-indigo-500 tracking-[0.2em] mb-4 block">Resource Optimization</span>
                    <div className="text-5xl font-bold text-primary tracking-tighter">{stats.fteSavings.toFixed(1)}</div>
                    <p className="text-xs text-secondary leading-relaxed">FTE delta (positive = freed). Moving engineers from "Maintain" to "Innovate."</p>
                </div>

                <div className="p-8 bg-card-bg border border-border rounded-[2.5rem] space-y-4 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><ShieldCheck size={80} /></div>
                    <span className={`text-[10px] font-mono uppercase tracking-[0.2em] mb-4 block ${riskTone}`}>{riskLabel}</span>
                    <div className="text-5xl font-bold text-primary tracking-tighter">{stats.complianceCertainty}%</div>
                    <p className="text-xs text-secondary leading-relaxed">{riskDescription}</p>
                </div>
            </div>

            <section className="bg-card-bg border border-border rounded-[3rem] p-12 relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 p-8 opacity-5"><Sparkles size={120} className="text-blue-500" /></div>
               <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-500 mb-8 flex items-center gap-3">
                  <Info size={16} /> Architectural Synthesis
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                  <div className="md:col-span-8 space-y-6">
                     <p className="text-2xl text-primary font-serif leading-relaxed">
                        "The primary cost of legacy networking isn't the hardware—it's the operational tax of proprietary complexity. By moving to Arista EOS and AVD, we eliminate the manual CLI handshake, turning weeks of configuration into hours of declarative intent."
                     </p>
                  </div>
                  <div className="md:col-span-4 flex flex-col justify-center border-l border-border pl-12 gap-6">
                     <div>
                        <span className="text-[9px] font-mono text-secondary uppercase">Legacy OpEx</span>
                        <div className="text-xl font-bold text-rose-500">${stats.manualCost.toLocaleString()}</div>
                     </div>
                     <div>
                        <span className="text-[9px] font-mono text-secondary uppercase">Arista OpEx</span>
                        <div className="text-xl font-bold text-emerald-400">${stats.autoCost.toLocaleString()}</div>
                     </div>
                  </div>
               </div>
            </section>

            <div className="p-10 rounded-[3rem] bg-gradient-to-br from-indigo-600 to-blue-900 border border-indigo-400/30 text-center relative overflow-hidden">
               <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
               <div className="relative z-10">
                  <h3 className="text-3xl font-serif font-bold text-white mb-4">Internalize the Pivot</h3>
                  <p className="text-indigo-100/70 mb-8 max-w-xl mx-auto leading-relaxed">Automation ROI is the most powerful weapon in an SE's arsenal. It justifies the architectural shift to Cloud-Grade networking by focusing on the business's most expensive resource: Time.</p>
                  <button onClick={handleExportBrief} className="px-10 py-5 bg-white text-black font-bold uppercase tracking-widest rounded-2xl hover:bg-indigo-50 transition-all shadow-2xl">
                     Export Business Case PDF
                  </button>
               </div>
            </div>
         </div>

         <footer className="p-12 border-t border-border surface-muted flex justify-between items-center text-[10px] font-mono text-secondary uppercase tracking-[0.3em]">
            <span>OP-VEL-MODEL-001 // STRATEGIC KERNEL</span>
            <span>VERIFIED FIELD ROI TOOL</span>
         </footer>
      </main>
    </div>
  );
};
