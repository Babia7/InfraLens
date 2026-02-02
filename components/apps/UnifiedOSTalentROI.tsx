
import React, { useState, useMemo } from 'react';
import { ArrowLeft, Users, GraduationCap, DollarSign, Brain, Activity, Zap, Info, AlertCircle, ShieldCheck, Target, Layers, Sparkles } from 'lucide-react';
import { SectionType } from '@/types';

interface UnifiedOSTalentROIProps {
  onBack: () => void;
  onNavigate?: (section: SectionType) => void;
}

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
        className="w-full bg-input-bg border border-border rounded-xl p-3 text-primary focus:border-amber-500 outline-none transition-all font-mono text-sm"
      />
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-mono text-secondary">{unit}</span>
    </div>
  </div>
);

export const UnifiedOSTalentROI: React.FC<UnifiedOSTalentROIProps> = ({ onBack, onNavigate }) => {
  // Operational Inputs
  const [teamSize, setTeamSize] = useState(12);
  const [legacyOSCount, setLegacyOSCount] = useState(4); // e.g. iOS, NX-OS, JunOS, etc.
  const [annualTrainingHours, setAnnualTrainingHours] = useState(80); // Hours per OS per Year
  const [hourlyRate, setHourlyRate] = useState(125);
  const [switchingTax, setSwitchingTax] = useState(15); // % of time lost to context switching between syntaxes

  const clampValue = (value: number, min = 0, max?: number) => {
    const safeValue = Number.isFinite(value) ? value : min;
    const bounded = Math.max(min, safeValue);
    return max === undefined ? bounded : Math.min(max, bounded);
  };

  const handleTeamSize = (value: number) => setTeamSize(clampValue(value));
  const handleLegacyOSCount = (value: number) => setLegacyOSCount(clampValue(value));
  const handleHourlyRate = (value: number) => setHourlyRate(clampValue(value));
  const handleSwitchingTax = (value: number) => setSwitchingTax(clampValue(value, 0, 100));

  const stats = useMemo(() => {
    // Legacy Costs
    const legacyTrainingHours = teamSize * legacyOSCount * annualTrainingHours;
    const legacyTrainingCost = legacyTrainingHours * hourlyRate;
    const legacyCognitiveLoss = (teamSize * 2080) * (switchingTax / 100);
    const legacyCognitiveCost = legacyCognitiveLoss * hourlyRate;
    const totalLegacyOpEx = legacyTrainingCost + legacyCognitiveCost;

    // Arista Unified Costs (Unified EOS across all domains)
    const aristaTrainingHours = teamSize * 1 * (annualTrainingHours * 1.2); // One OS, slightly more deep dive
    const aristaTrainingCost = aristaTrainingHours * hourlyRate;
    const aristaCognitiveLoss = (teamSize * 2080) * (0.01); // 1% tax for standard edge cases
    const aristaCognitiveCost = aristaCognitiveLoss * hourlyRate;
    const totalAristaOpEx = aristaTrainingCost + aristaCognitiveCost;

    const yearlySavings = totalLegacyOpEx - totalAristaOpEx;
    const talentVelocity = totalLegacyOpEx > 0
      ? Math.round(((totalLegacyOpEx - totalAristaOpEx) / totalLegacyOpEx) * 100)
      : 0;
    const fteEfficiency = (legacyTrainingHours + legacyCognitiveLoss - aristaTrainingHours - aristaCognitiveLoss) / 2080;
    const aristaOpExShare = totalLegacyOpEx > 0 ? (totalAristaOpEx / totalLegacyOpEx) * 100 : 0;

    return {
      legacyTrainingCost,
      legacyCognitiveCost,
      totalLegacyOpEx,
      totalAristaOpEx,
      yearlySavings,
      talentVelocity,
      fteEfficiency,
      aristaOpExShare
    };
  }, [teamSize, legacyOSCount, annualTrainingHours, hourlyRate, switchingTax]);

  const handleExportBrief = () => {
    const content = `TALENT ROI BRIEF
Team size: ${teamSize} FTEs
Legacy OS count: ${legacyOSCount}
Annual training hours/OS: ${annualTrainingHours}
Hourly rate: $${hourlyRate}/hr
Context switching tax: ${switchingTax}%

Summary:
- Yearly savings: $${Math.round(stats.yearlySavings).toLocaleString()}
- Talent velocity change: ${stats.talentVelocity}%
- FTE delta: ${stats.fteEfficiency.toFixed(1)}
- Legacy OpEx: $${Math.round(stats.totalLegacyOpEx).toLocaleString()}
- Arista OpEx: $${Math.round(stats.totalAristaOpEx).toLocaleString()}

Notes:
- Assumes 2080 hours/FTE/year.
- Unified EOS training modeled as a 20% deeper single-track.
`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Talent_ROI_Brief_${new Date().toISOString()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-page-bg text-primary font-sans flex flex-col md:flex-row overflow-hidden selection:bg-amber-500/30">
      
      {/* SIDEBAR: TALENT ARCHITECTURE INPUTS */}
      <aside className="w-full md:w-80 border-b md:border-b-0 md:border-r border-border bg-card-bg flex flex-col shrink-0 z-30 overflow-y-auto h-[50vh] md:h-screen">
         <div className="p-8 border-b border-border">
            <button onClick={onBack} className="flex items-center gap-2 text-secondary hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest mb-6">
                <ArrowLeft size={14} /> InfraLens
            </button>
            <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
                    <GraduationCap size={24} />
                </div>
                <div>
                    <h1 className="text-xl font-serif font-bold tracking-tight text-primary">Talent ROI</h1>
                    <div className="text-[10px] font-mono text-secondary uppercase tracking-widest mt-0.5">Unified EOS Modeler</div>
                </div>
            </div>
         </div>

         <div className="p-8 space-y-8 flex-1">
            <section className="space-y-6">
                <h3 className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.3em]">Operational Payload</h3>
                <InputField label="Team Size" value={teamSize} onChange={handleTeamSize} unit="FTEs" icon={Users} desc="Eng Resources" />
                <InputField label="Hourly Yield" value={hourlyRate} onChange={handleHourlyRate} unit="$/Hr" icon={DollarSign} desc="Fully Burdened" />
            </section>

            <section className="space-y-6 pt-8 border-t border-border">
                <h3 className="text-[10px] font-bold text-secondary uppercase tracking-[0.3em]">Complexity Drivers</h3>
                <InputField label="Legacy NOS Variants" value={legacyOSCount} onChange={handleLegacyOSCount} unit="OSs" icon={Layers} desc="Multivendor Tax" />
                <InputField label="Context Tax" value={switchingTax} onChange={handleSwitchingTax} unit="%" icon={Brain} desc="Switching Penalty" />
            </section>
         </div>
      </aside>

      {/* MAIN: TALENT DASHBOARD */}
      <main className="flex-1 overflow-y-auto bg-page-bg relative flex flex-col">
         <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.02)_1px,transparent_1px)] bg-[length:40px_40px] pointer-events-none"></div>

         <div className="flex-1 p-8 md:p-16 relative z-10 max-w-5xl mx-auto w-full space-y-12">
            <header className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <h2 className="text-5xl md:text-7xl font-serif font-bold tracking-tighter text-primary leading-none">The Unified Edge</h2>
                    <p className="text-xl text-secondary font-light mt-4">Calculating the ROI of training on one binary from Campus to Cloud.</p>
                </div>
                <div className="text-right">
                    <span className="text-xs font-mono text-secondary uppercase tracking-widest block mb-1">Total Talent Savings</span>
                    <div className="text-5xl font-bold text-emerald-400 font-mono tracking-tighter">
                        ${Math.round(stats.yearlySavings).toLocaleString()}
                    </div>
                    <span className="text-[10px] font-mono text-secondary uppercase">Per Annum</span>
                    {onNavigate && (
                      <button
                        onClick={() => onNavigate(SectionType.UNIFIED_OS_TALENT_ROI_ABOUT)}
                        className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card-bg text-[11px] text-secondary hover:text-primary hover:border-amber-400/60 transition"
                        aria-label="Open Talent ROI methodology"
                      >
                        <Info size={14} /> About
                      </button>
                    )}
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-8 bg-card-bg border border-border rounded-[2.5rem] space-y-4 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Activity size={80} /></div>
                    <span className="text-[10px] font-mono uppercase text-amber-500 tracking-[0.2em] mb-4 block">Engineering Velocity</span>
                    <div className="text-5xl font-bold text-primary tracking-tighter">{stats.talentVelocity}%</div>
                    <p className="text-xs text-secondary leading-relaxed">Reduction in overhead by eliminating multiple syntax qualifications.</p>
                </div>

                <div className="p-8 bg-card-bg border border-border rounded-[2.5rem] space-y-4 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Target size={80} /></div>
                    <span className="text-[10px] font-mono uppercase text-indigo-500 tracking-[0.2em] mb-4 block">FTE Reallocation</span>
                    <div className="text-5xl font-bold text-primary tracking-tighter">{stats.fteEfficiency.toFixed(1)}</div>
                    <p className="text-xs text-secondary leading-relaxed">Engineers freed from "syntax maintenance" to focus on architecture.</p>
                </div>

                <div className="p-8 bg-card-bg border border-border rounded-[2.5rem] space-y-4 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><ShieldCheck size={80} /></div>
                    <span className="text-[10px] font-mono uppercase text-emerald-500 tracking-[0.2em] mb-4 block">Reliability Bonus</span>
                    <div className="text-5xl font-bold text-primary tracking-tighter">Unified</div>
                    <p className="text-xs text-secondary leading-relaxed">One OS means one bug-testing cycle for the entire global fabric.</p>
                </div>
            </div>

            {/* COMPARATIVE VISUALIZATION */}
            <section className="bg-card-bg/70 border border-border rounded-[3rem] p-12 relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 p-8 opacity-5"><Sparkles size={120} className="text-amber-500" /></div>
               <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-amber-500 mb-12 flex items-center gap-3">
                  <AlertCircle size={16} /> Architectural Synthesis
               </h3>
               
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                  <div className="space-y-6">
                     <p className="text-2xl text-primary font-serif leading-relaxed">
                        "The hidden cost of legacy networking is the 'Cognitive Tax.' Engineers juggling four different CLI syntaxes make 40% more errors than those mastering a single, unified binary like EOS."
                     </p>
                     <div className="pt-6 flex flex-wrap gap-4">
                        <div className="px-4 py-2 bg-card-bg border border-border rounded-xl flex items-center gap-3">
                           <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                           <span className="text-[10px] font-mono text-secondary uppercase">Edge to Cloud Continuity</span>
                        </div>
                        <div className="px-4 py-2 bg-card-bg border border-border rounded-xl flex items-center gap-3">
                           <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                           <span className="text-[10px] font-mono text-secondary uppercase">Single Qualification Cycle</span>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-10 border-l border-border pl-12">
                     <div className="space-y-4">
                        <div className="flex justify-between items-end">
                           <span className="text-xs font-bold text-secondary uppercase tracking-widest">Legacy OpEx Tax</span>
                           <span className="text-rose-500 font-mono font-bold">${Math.round(stats.totalLegacyOpEx).toLocaleString()}</span>
                        </div>
                        <div className="h-4 w-full surface-muted rounded-full overflow-hidden">
                           <div className="h-full bg-rose-500/50 w-full animate-pulse"></div>
                        </div>
                        <p className="text-[9px] text-secondary font-mono">Includes certification churn and context-switching friction.</p>
                     </div>

                     <div className="space-y-4">
                        <div className="flex justify-between items-end">
                           <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Arista Talent ROI</span>
                           <span className="text-emerald-400 font-mono font-bold">${Math.round(stats.totalAristaOpEx).toLocaleString()}</span>
                        </div>
                        <div className="h-4 w-full surface-muted rounded-full overflow-hidden">
                           <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${stats.aristaOpExShare}%` }}></div>
                        </div>
                        <p className="text-[9px] text-secondary font-mono">Leverages the power of one single EOS binary.</p>
                     </div>
                  </div>
               </div>
            </section>

            <div className="p-10 rounded-[3rem] bg-gradient-to-br from-amber-600 to-indigo-900 border border-amber-400/30 text-center relative overflow-hidden group">
               <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
               <div className="relative z-10">
                  <h3 className="text-3xl font-serif font-bold text-white mb-4">Invest in Architects, Not Certifications</h3>
                  <p className="text-amber-100/70 mb-8 max-w-xl mx-auto leading-relaxed">
                    The Arista Architecture simplifies the talent equation. By standardizing on <strong>EOS</strong> across all domains, you turn your engineering team into a cross-functional high-performance force.
                  </p>
                  <button onClick={handleExportBrief} className="px-10 py-5 bg-white text-black font-bold uppercase tracking-widest rounded-2xl hover:bg-amber-50 transition-all shadow-2xl">
                     Export Talent Impact PDF
                  </button>
               </div>
            </div>
         </div>

         <footer className="p-12 border-t border-border surface-muted flex justify-between items-center text-[10px] font-mono text-secondary uppercase tracking-[0.3em]">
            <span>TALENT-ROI-003 // OPERATIONAL CORE</span>
            <span>STRATEGIC HUMAN CAPITAL TOOL</span>
         </footer>
      </main>
    </div>
  );
};
