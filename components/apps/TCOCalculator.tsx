
import React, { useState, useMemo } from 'react';
import { ArrowLeft, Calculator, Zap, Leaf, Info, ChevronRight, TrendingDown, Server, Globe, Clock, Users, BookOpen, Target, FileText, ShieldCheck } from 'lucide-react';
import { RelatedActions } from '@/components/RelatedActions';
import { SectionType } from '@/types';

interface TCOCalculatorProps {
  onBack: () => void;
  onNavigate?: (section: SectionType) => void;
}

const InputField = ({ label, value, onChange, unit, icon: Icon, desc }: any) => (
  <div className="space-y-2">
    {label && (
      <div className="flex justify-between items-center">
        <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-secondary flex items-center gap-2">
          {Icon && <Icon size={12} />} {label}
        </label>
        {desc && <span className="text-[9px] font-mono text-secondary">{desc}</span>}
      </div>
    )}
    <div className="relative">
      <input 
        type="number" 
        value={value} 
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="w-full bg-card-bg border border-border rounded-xl p-3 text-primary focus:border-emerald-500 outline-none transition-all font-mono text-sm"
      />
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-mono text-secondary">{unit}</span>
    </div>
  </div>
);

const REGIONS: Record<string, { kwh: number; labor: number }> = {
  'Global Average': { kwh: 0.15, labor: 125 },
  'North America': { kwh: 0.16, labor: 165 },
  'Europe (West)': { kwh: 0.32, labor: 140 },
  'Asia Pacific': { kwh: 0.18, labor: 110 },
  'Middle East': { kwh: 0.06, labor: 90 },
  'Latin America': { kwh: 0.14, labor: 50 }
};

export const TCOCalculator: React.FC<TCOCalculatorProps> = ({ onBack, onNavigate }) => {
  // --- STATE ---
  const [region, setRegion] = useState('North America');
  const [numSwitches, setNumSwitches] = useState(48);
  const [years, setYears] = useState(5);
  const [savingsView, setSavingsView] = useState<'total' | 'annual'>('total');
  
  // Costs (Auto-adjusted by Region, but editable)
  const [kwhPrice, setKwhPrice] = useState(REGIONS['North America'].kwh);
  const [hourlyRate, setHourlyRate] = useState(REGIONS['North America'].labor);
  
  // Power & Environment
  const [pue, setPue] = useState(1.6); // Power Usage Effectiveness
  
  // Operational Profile
  const [legacyHours, setLegacyHours] = useState(12); // Hrs/switch/year (Maintenance, Troubleshooting)
  const [aristaHours, setAristaHours] = useState(2);  // Hrs/switch/year (Automation savings)

  // Hardware Specs
  const [legacyWatts, setLegacyWatts] = useState(650);
  const [aristaWatts, setAristaWatts] = useState(380);
  const [legacyHardwareCost, setLegacyHardwareCost] = useState(45000);
  const [aristaHardwareCost, setAristaHardwareCost] = useState(38000);

  const [showAssumptions, setShowAssumptions] = useState(false);

  const clampValue = (value: number, min = 0, max?: number) => {
    const safeValue = Number.isFinite(value) ? value : min;
    const bounded = Math.max(min, safeValue);
    return max === undefined ? bounded : Math.min(max, bounded);
  };

  const handleNumSwitches = (value: number) => setNumSwitches(clampValue(value));
  const handleYearsChange = (value: number) => setYears(clampValue(value, 1));
  const handleKwhPrice = (value: number) => setKwhPrice(clampValue(value));
  const handleHourlyRate = (value: number) => setHourlyRate(clampValue(value));
  const handleLegacyHours = (value: number) => setLegacyHours(clampValue(value));
  const handleAristaHours = (value: number) => setAristaHours(clampValue(value));
  const handleLegacyWatts = (value: number) => setLegacyWatts(clampValue(value));
  const handleAristaWatts = (value: number) => setAristaWatts(clampValue(value));
  const handleLegacyHardwareCost = (value: number) => setLegacyHardwareCost(clampValue(value));
  const handleAristaHardwareCost = (value: number) => setAristaHardwareCost(clampValue(value));

  const handleRegionChange = (newRegion: string) => {
    setRegion(newRegion);
    if (REGIONS[newRegion]) {
      setKwhPrice(REGIONS[newRegion].kwh);
      setHourlyRate(REGIONS[newRegion].labor);
    }
  };

  // --- CALCULATIONS ---
  const stats = useMemo(() => {
    const hoursPerYear = 8760;
    
    // Power Calculation
    const legacyTotalKwh = (legacyWatts * numSwitches * hoursPerYear * pue * years) / 1000;
    const aristaTotalKwh = (aristaWatts * numSwitches * hoursPerYear * pue * years) / 1000;
    const legacyPowerCost = legacyTotalKwh * kwhPrice;
    const aristaPowerCost = aristaTotalKwh * kwhPrice;

    // Labor Calculation
    const legacyLaborCost = numSwitches * legacyHours * years * hourlyRate;
    const aristaLaborCost = numSwitches * aristaHours * years * hourlyRate;

    // Totals
    const legacyHardwareTotal = legacyHardwareCost * numSwitches;
    const aristaHardwareTotal = aristaHardwareCost * numSwitches;

    const legacyTotal = legacyHardwareTotal + legacyPowerCost + legacyLaborCost;
    const aristaTotal = aristaHardwareTotal + aristaPowerCost + aristaLaborCost;

    const savings = legacyTotal - aristaTotal;
    const powerSavings = legacyPowerCost - aristaPowerCost;
    const laborSavings = legacyLaborCost - aristaLaborCost;
    const carbonSaved = (legacyTotalKwh - aristaTotalKwh) * 0.4; // 0.4kg CO2 per kWh approx

    return {
      legacyTotal, aristaTotal,
      legacyHardwareTotal, aristaHardwareTotal,
      legacyPowerCost, aristaPowerCost,
      legacyLaborCost, aristaLaborCost,
      savings,
      powerSavings,
      laborSavings,
      carbonSaved
    };
  }, [numSwitches, kwhPrice, pue, years, legacyWatts, aristaWatts, legacyHardwareCost, aristaHardwareCost, hourlyRate, legacyHours, aristaHours]);

  const effectiveYears = Math.max(1, years);
  const annualSavings = stats.savings / effectiveYears;
  const displayedSavings = savingsView === 'annual' ? annualSavings : stats.savings;

  const evidence = [
    { label: 'OpEx reduction', source: 'AVD automation field studies', confidence: 'High', link: 'https://www.arista.com/en/solutions/cloudvision' },
    { label: 'Outage avoidance', source: 'SysDB state/time-machine impact', confidence: 'Med', link: 'https://www.arista.com/en/products/eos' },
    { label: 'Compliance & change control', source: 'Snapshot/rollback approvals (GxP/ITIL)', confidence: 'Med-High', link: 'https://www.arista.com/en/support/advisories-notices' },
  ];

  const hardwareSavings = stats.legacyHardwareTotal - stats.aristaHardwareTotal;
  const savingsDrivers = [
    { label: 'Hardware', value: hardwareSavings },
    { label: 'Power', value: stats.powerSavings },
    { label: 'Labor', value: stats.laborSavings }
  ];
  const dominantDriver = savingsDrivers.reduce((max, current) => {
    return Math.abs(current.value) > Math.abs(max.value) ? current : max;
  }, savingsDrivers[0]);
  const netLabel = stats.savings >= 0 ? 'savings' : 'increase';
  const netValue = Math.abs(stats.savings);
  const annualNet = netValue / effectiveYears;
  const formatCurrency = (value: number) => `$${Math.round(value).toLocaleString()}`;
  const formatSignedCurrency = (value: number) => `${value >= 0 ? '+' : '-'}$${Math.round(Math.abs(value)).toLocaleString()}`;
  const insightCopy = `Net ${netLabel} of ${formatCurrency(netValue)} over ${effectiveYears} years (~${formatCurrency(annualNet)}/yr). Largest driver: ${dominantDriver.label} ${dominantDriver.value >= 0 ? 'savings' : 'increase'} of ${formatCurrency(Math.abs(dominantDriver.value))}.`;
  const legacyTotalSafe = stats.legacyTotal > 0 ? stats.legacyTotal : 0;
  const aristaTotalSafe = stats.aristaTotal > 0 ? stats.aristaTotal : 0;
  const legacyHardwarePct = legacyTotalSafe > 0 ? (stats.legacyHardwareTotal / legacyTotalSafe) * 100 : 0;
  const legacyPowerPct = legacyTotalSafe > 0 ? (stats.legacyPowerCost / legacyTotalSafe) * 100 : 0;
  const legacyLaborPct = legacyTotalSafe > 0 ? (stats.legacyLaborCost / legacyTotalSafe) * 100 : 0;
  const aristaTotalPct = legacyTotalSafe > 0 ? (stats.aristaTotal / legacyTotalSafe) * 100 : 0;
  const aristaHardwarePct = aristaTotalSafe > 0 ? (stats.aristaHardwareTotal / aristaTotalSafe) * 100 : 0;
  const aristaPowerPct = aristaTotalSafe > 0 ? (stats.aristaPowerCost / aristaTotalSafe) * 100 : 0;
  const aristaLaborPct = aristaTotalSafe > 0 ? (stats.aristaLaborCost / aristaTotalSafe) * 100 : 0;

  const handleExportBrief = () => {
    const content = `TCO MODEL BRIEF
Region: ${region}
Scale: ${numSwitches} switches
Horizon: ${years} years

Summary:
- Projected savings (total): $${Math.round(stats.savings).toLocaleString()} over ${years} years
- Projected savings (annualized): $${Math.round(annualSavings).toLocaleString()} per year
- OpEx reduction: $${Math.round(stats.laborSavings).toLocaleString()} via automation
- Power savings: $${Math.round(stats.powerSavings).toLocaleString()} (${Math.round(stats.carbonSaved / 1000)} tons CO2 avoided)

Key assumptions:
- Legacy power ${legacyWatts}W vs Arista ${aristaWatts}W; PUE ${pue}
- Labor ${legacyHours}h -> ${aristaHours}h per switch/year @ $${hourlyRate}/hr
- Hardware $${legacyHardwareCost} vs $${aristaHardwareCost} per unit

Evidence:
${evidence.map(e => `- ${e.label}: ${e.source} (${e.confidence})`).join('\n')}

Scope guardrails:
- Excludes discounting and staffing model changes.
- Uses regional energy/labor defaults; adjust as needed.
`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `TCO_Model_Brief_${new Date().toISOString()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const steps = [
    { title: 'Summary', desc: 'Lead with the three headline deltas.', active: true },
    { title: 'Assumptions', desc: 'Show presets, ranges, and last edit.' },
    { title: 'Results', desc: 'Savings + sensitivity at a glance.' },
    { title: 'Evidence', desc: 'Citations and confidence for each claim.' },
    { title: 'Export', desc: 'One-click brief for leadership.' }
  ];

  return (
    <div className="min-h-screen bg-page-bg text-primary font-sans flex flex-col md:flex-row overflow-hidden selection:bg-blue-500/30">
      
      {/* LEFT: INPUTS */}
      <aside className="w-full md:w-80 border-b md:border-b-0 md:border-r border-border bg-card-bg flex flex-col shrink-0 z-30 overflow-y-auto h-[50vh] md:h-screen">
         <div className="p-8 border-b border-border">
            <button onClick={onBack} className="flex items-center gap-2 text-secondary hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest mb-6">
               <ArrowLeft size={14} /> InfraLens
            </button>
            <div className="flex items-center gap-3">
               <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-500">
                  <Calculator size={24} />
               </div>
               <div>
                  <h1 className="text-xl font-serif font-bold tracking-tight text-primary">TCO Modeler</h1>
                  <div className="text-[10px] font-mono text-secondary uppercase tracking-widest mt-0.5">v2.0 // Localization</div>
               </div>
            </div>
         </div>

         <div className="p-8 space-y-8 flex-1">
            <section className="space-y-4">
               <h3 className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.3em] flex items-center gap-2">
                  <Globe size={12} /> Localization
               </h3>
               <div className="relative">
                  <select 
                    value={region} 
                    onChange={(e) => handleRegionChange(e.target.value)}
                    className="w-full bg-card-bg border border-border rounded-xl p-3 text-primary focus:border-emerald-500 outline-none transition-all font-mono text-xs appearance-none"
                  >
                     {Object.keys(REGIONS).map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <ChevronRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none rotate-90" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <InputField label="Energy" value={kwhPrice} onChange={handleKwhPrice} unit="$/kWh" icon={Zap} />
                  <InputField label="Labor" value={hourlyRate} onChange={handleHourlyRate} unit="$/Hr" icon={Users} />
               </div>
            </section>

            <section className="space-y-4 pt-6 border-t border-border">
               <h3 className="text-[10px] font-bold text-secondary uppercase tracking-[0.3em]">Environment</h3>
               <InputField label="Scale" value={numSwitches} onChange={handleNumSwitches} unit="Switches" icon={Server} />
               <InputField label="Duration" value={years} onChange={handleYearsChange} unit="Years" icon={Clock} />
            </section>

            <section className="space-y-4 pt-6 border-t border-border">
               <h3 className="text-[10px] font-bold text-secondary uppercase tracking-[0.3em]">OpEx & Hardware</h3>
               <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 bg-card-bg border border-border rounded-2xl space-y-3">
                     <span className="text-[9px] font-mono text-secondary uppercase block">Legacy Node</span>
                     <InputField label="Power Draw" value={legacyWatts} onChange={handleLegacyWatts} unit="W" />
                     <InputField label="Unit Cost" value={legacyHardwareCost} onChange={handleLegacyHardwareCost} unit="$" />
                     <InputField label="Maint. Time" value={legacyHours} onChange={handleLegacyHours} unit="Hrs/Yr" />
                  </div>
                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/30 rounded-2xl space-y-3">
                     <span className="text-[9px] font-mono text-emerald-600 uppercase block">Arista Node</span>
                     <InputField label="Power Draw" value={aristaWatts} onChange={handleAristaWatts} unit="W" />
                     <InputField label="Unit Cost" value={aristaHardwareCost} onChange={handleAristaHardwareCost} unit="$" />
                     <InputField label="Maint. Time" value={aristaHours} onChange={handleAristaHours} unit="Hrs/Yr" />
                  </div>
               </div>
            </section>
         </div>
      </aside>

      {/* RIGHT: DASHBOARD */}
      <main className="flex-1 overflow-y-auto bg-page-bg relative">
         <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.02)_1px,transparent_1px)] bg-[length:40px_40px] pointer-events-none mix-blend-overlay"></div>
         
         <div className="max-w-5xl mx-auto p-8 md:p-16 relative z-10 space-y-12">
            
      <header className="flex flex-col md:flex-row justify-between items-end gap-6">
         <div>
            <h2 className="text-5xl md:text-7xl font-serif font-bold tracking-tighter text-primary">Total Value</h2>
            <p className="text-xl text-secondary font-light mt-2">{years}-Year TCO projection based on {region} economics.</p>
         </div>
            <div className="text-right">
               <span className="text-xs font-mono text-secondary uppercase tracking-widest block mb-1">Projected Savings</span>
               <div className="text-5xl font-bold text-emerald-400 font-mono tracking-tighter">
                  ${Math.round(displayedSavings).toLocaleString()}
               </div>
               <span className="text-[10px] font-mono text-secondary uppercase block">
                 {savingsView === 'annual' ? 'Per Annum' : `Over ${effectiveYears} Years`}
               </span>
               <div className="mt-2 flex items-center justify-end gap-1.5">
                 <button
                   onClick={() => setSavingsView('total')}
                   className={`px-2 py-1 rounded-full border text-[10px] font-mono uppercase tracking-widest transition ${
                     savingsView === 'total'
                       ? 'border-emerald-400/60 text-emerald-300'
                       : 'border-border text-secondary hover:text-primary'
                   }`}
                 >
                   Total
                 </button>
                 <button
                   onClick={() => setSavingsView('annual')}
                   className={`px-2 py-1 rounded-full border text-[10px] font-mono uppercase tracking-widest transition ${
                     savingsView === 'annual'
                       ? 'border-emerald-400/60 text-emerald-300'
                       : 'border-border text-secondary hover:text-primary'
                   }`}
                 >
                   Annualized
                 </button>
               </div>
            {onNavigate && (
              <button
                onClick={() => onNavigate(SectionType.TCO_CALCULATOR_ABOUT)}
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card-bg text-[11px] text-secondary hover:text-primary hover:border-emerald-400/60 transition"
                aria-label="Open TCO methodology"
              >
                <Info size={14} /> About
              </button>
            )}
            <button onClick={handleExportBrief} className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card-bg text-[11px] text-secondary hover:text-primary hover:border-emerald-400/60 transition">
              <FileText size={14} /> Export Brief
            </button>
            </div>
      </header>

            <section className="p-5 rounded-2xl border border-border bg-card-bg/80 shadow-sm">
              <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-secondary">Executive Takeaway</div>
              <p className="text-base text-primary/85 leading-relaxed mt-2">
                Lead with the delta: "At this scale, Arista reduces {years}-year TCO by focusing on power efficiency and operational hours, not just hardware."
              </p>
              <p className="text-sm text-secondary mt-2">
                If you validate only one input, validate maintenance hours per switch/year - it tends to drive the largest swing.
              </p>
            </section>

            {/* NARRATIVE FLOW */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {steps.map((step, idx) => (
                <div key={step.title} className={`p-3 rounded-xl border ${idx === 0 ? 'border-emerald-400/60 bg-emerald-500/5' : 'border-border bg-card-bg'} shadow-sm`}>
                  <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-secondary flex items-center gap-2">
                    <Target size={12} /> {step.title}
                  </div>
                  <p className="text-xs text-secondary mt-2 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>

            {/* HIGH LEVEL STAT CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="bg-card-bg border border-border p-8 rounded-[2rem] relative overflow-hidden group hover:border-emerald-400/40 transition-colors shadow-sm">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Zap size={80}/></div>
                  <span className="text-[10px] font-mono uppercase text-blue-500 tracking-[0.2em] mb-4 block">Power Efficiency</span>
                  <div className="text-3xl font-bold mb-2 text-blue-400">
                     ${Math.round(stats.powerSavings).toLocaleString()}
                  </div>
                  <p className="text-xs text-secondary leading-relaxed">
                    Energy savings via lower <span className="relative inline-flex items-center underline decoration-dotted cursor-help text-secondary group">TDP
                      <span className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-64 -translate-x-1/2 rounded-xl border border-border bg-card-bg px-3 py-2 text-[11px] text-secondary shadow-[0_20px_50px_-35px_rgba(0,0,0,0.85)] opacity-0 transition-opacity group-hover:opacity-100">
                        TDP (Thermal Design Power) is the maximum heat a device is expected to generate under normal workloads.
                      </span>
                    </span> and better <span className="relative inline-flex items-center underline decoration-dotted cursor-help text-secondary group">PUE
                      <span className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-72 -translate-x-1/2 rounded-xl border border-border bg-card-bg px-3 py-2 text-[11px] text-secondary shadow-[0_20px_50px_-35px_rgba(0,0,0,0.85)] opacity-0 transition-opacity group-hover:opacity-100">
                        PUE (Power Usage Effectiveness) = Total facility power / IT equipment power. Lower is more efficient.
                      </span>
                    </span> utilization.
                  </p>
               </div>

               <div className="bg-card-bg border border-border p-8 rounded-[2rem] relative overflow-hidden group hover:border-emerald-400/40 transition-colors shadow-sm">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Users size={80}/></div>
                  <span className="text-[10px] font-mono uppercase text-indigo-500 tracking-[0.2em] mb-4 block">Operational Labor</span>
                  <div className="text-3xl font-bold mb-2 text-indigo-400">
                     ${Math.round(stats.laborSavings).toLocaleString()}
                  </div>
                  <p className="text-xs text-secondary leading-relaxed">OpEx recovered via AVD automation and SysDB reliability.</p>
               </div>

               <div className="bg-card-bg border border-border p-8 rounded-[2rem] relative overflow-hidden group hover:border-emerald-400/40 transition-colors shadow-sm">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Leaf size={80}/></div>
                  <span className="text-[10px] font-mono uppercase text-emerald-500 tracking-[0.2em] mb-4 block">Sustainability</span>
                  <div className="text-3xl font-bold mb-2 text-emerald-400">
                     {Math.round(stats.carbonSaved / 1000).toFixed(1)} Tons
                  </div>
                  <p className="text-xs text-secondary leading-relaxed">CO2 emissions avoided. Equivalent to {Math.round(stats.carbonSaved / 20)} trees planted.</p>
               </div>
            </div>

            {/* COMPARISON BARS + ASSUMPTIONS + EVIDENCE */}
            <div className="space-y-10">
              <section className="bg-card-bg border border-border rounded-[2.5rem] p-10">
                 <h3 className="text-sm font-bold uppercase tracking-widest text-secondary mb-10 flex items-center gap-2">
                    <TrendingDown size={16} /> Total Cost Breakdown
                 </h3>
                 
                 <div className="space-y-12">
                    <div className="space-y-4">
                       <div className="flex justify-between items-end">
                          <span className="text-sm font-bold text-secondary">Legacy Infrastructure</span>
                          <span className="font-mono text-xl text-primary">${Math.round(stats.legacyTotal).toLocaleString()}</span>
                       </div>
                       <div className="h-8 w-full bg-surface-muted rounded-full overflow-hidden flex shadow-inner">
                          <div className="h-full bg-zinc-600 transition-all duration-700" style={{ width: `${legacyHardwarePct}%` }}></div>
                          <div className="h-full bg-zinc-700 transition-all duration-700" style={{ width: `${legacyPowerPct}%` }}></div>
                          <div className="h-full bg-zinc-500 transition-all duration-700" style={{ width: `${legacyLaborPct}%` }}></div>
                       </div>
                       <div className="flex gap-6 text-[10px] font-mono text-secondary justify-end">
                          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-zinc-600"></div> HW: ${Math.round(stats.legacyHardwareTotal/1000)}k</div>
                          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-zinc-700"></div> PWR: ${Math.round(stats.legacyPowerCost/1000)}k</div>
                          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-zinc-500"></div> LAB: ${Math.round(stats.legacyLaborCost/1000)}k</div>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <div className="flex justify-between items-end">
                          <span className="text-sm font-bold text-primary">Arista Cognitive Fabric</span>
                          <span className="font-mono text-xl text-blue-500">${Math.round(stats.aristaTotal).toLocaleString()}</span>
                       </div>
                       <div className="h-8 w-full bg-surface-muted rounded-full overflow-hidden flex shadow-inner relative">
                          {/* Scale Arista bar relative to Legacy total for visual comparison */}
                          <div className="absolute left-0 h-full flex" style={{ width: `${aristaTotalPct}%` }}>
                             <div className="h-full bg-blue-600 transition-all duration-700" style={{ width: `${aristaHardwarePct}%` }}></div>
                             <div className="h-full bg-blue-500 transition-all duration-700" style={{ width: `${aristaPowerPct}%` }}></div>
                             <div className="h-full bg-indigo-500 transition-all duration-700" style={{ width: `${aristaLaborPct}%` }}></div>
                          </div>
                       </div>
                       <div className="flex gap-6 text-[10px] font-mono text-secondary justify-end">
                          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-600"></div> HW: ${Math.round(stats.aristaHardwareTotal/1000)}k</div>
                          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500"></div> PWR: ${Math.round(stats.aristaPowerCost/1000)}k</div>
                          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> LAB: ${Math.round(stats.aristaLaborCost/1000)}k</div>
                       </div>
                    </div>
                 </div>
              </section>

              <section className="grid grid-cols-1 lg:grid-cols-[1.4fr,1fr] gap-8">
                <div className="bg-card-bg border border-border rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-secondary">
                      <BookOpen size={14} /> Assumptions
                    </div>
                    <button onClick={() => setShowAssumptions(!showAssumptions)} className="text-[11px] text-secondary hover:text-primary flex items-center gap-1">
                      <ChevronRight size={14} className={`transition-transform ${showAssumptions ? 'rotate-90' : 'rotate-0'}`} /> {showAssumptions ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {showAssumptions && (
                    <div className="space-y-3 text-sm text-secondary">
                      <div className="p-3 rounded-xl border border-border bg-page-bg">
                        <div className="text-[10px] font-mono uppercase tracking-widest text-secondary mb-1">Preset</div>
                        <div>Region: {region}; Scale: {numSwitches} switches; Horizon: {years} years</div>
                      </div>
                      <div className="p-3 rounded-xl border border-border bg-page-bg">
                        <div className="text-[10px] font-mono uppercase tracking-widest text-secondary mb-1">
                          Power & <span className="relative inline-flex items-center underline decoration-dotted cursor-help text-secondary group">PUE
                            <span className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-72 -translate-x-1/2 rounded-xl border border-border bg-card-bg px-3 py-2 text-[11px] text-secondary shadow-[0_20px_50px_-35px_rgba(0,0,0,0.85)] opacity-0 transition-opacity group-hover:opacity-100">
                              PUE (Power Usage Effectiveness) = Total facility power / IT equipment power. Lower is more efficient.
                            </span>
                          </span>
                        </div>
                        <div>Legacy {legacyWatts}W vs Arista {aristaWatts}W; PUE {pue}</div>
                      </div>
                      <div className="p-3 rounded-xl border border-border bg-page-bg">
                        <div className="text-[10px] font-mono uppercase tracking-widest text-secondary mb-1">OpEx Model</div>
                        <div>Maintenance {legacyHours}h → {aristaHours}h per switch/year at ${hourlyRate}/hr</div>
                      </div>
                      <div className="p-3 rounded-xl border border-border bg-page-bg">
                        <div className="text-[10px] font-mono uppercase tracking-widest text-secondary mb-1">Scope Guardrails</div>
                        <ul className="list-disc list-inside text-sm text-secondary space-y-1">
                          <li>Discounting and staffing mix changes are excluded.</li>
                          <li>Energy/labor use regional defaults; adjust if Finance provides overrides.</li>
                          <li>Risk uplift focuses on outage avoidance; no CapEx negotiations modeled.</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-card-bg border border-border rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-secondary">
                      <ShieldCheck size={14} /> Evidence Panel
                    </div>
                    <span className="text-[10px] text-secondary">Confidence tagged</span>
                  </div>
                  <div className="space-y-3">
                    {evidence.map(item => (
                      <div key={item.label} className="p-3 rounded-xl border border-border bg-page-bg">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-semibold text-primary">{item.label}</div>
                          <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/30">{item.confidence}</span>
                        </div>
                        <div className="text-xs text-secondary mt-1">{item.source}</div>
                        {item.link && (
                          <a href={item.link} target="_blank" rel="noreferrer" className="text-[11px] text-emerald-500 hover:text-emerald-400 inline-flex items-center gap-1 mt-1">
                            <ArrowLeft size={12} className="rotate-180" /> Open source
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            {/* DETERMINISTIC INSIGHT */}
            <section className="relative">
               <div className="w-full p-8 rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-900 border border-blue-400/30 text-left shadow-2xl shadow-blue-900/40 overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                  <div className="flex items-center gap-3 mb-4 relative z-10">
                     <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
                        <Calculator size={24} className="text-white" />
                     </div>
                     <div>
                        <h4 className="text-2xl font-serif font-bold text-white tracking-tight leading-none">Deterministic Insight</h4>
                        <div className="text-[10px] font-mono text-white/70 uppercase tracking-[0.2em] mt-1">No AI. Pure arithmetic.</div>
                     </div>
                  </div>

                  <div className="space-y-4 relative z-10">
                     <p className="text-lg leading-relaxed text-white/90 font-medium">
                        {insightCopy}
                     </p>
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] font-mono uppercase tracking-widest text-white/70">
                        <div className="rounded-xl border border-white/10 bg-white/5 p-3">Hardware {formatSignedCurrency(hardwareSavings)}</div>
                        <div className="rounded-xl border border-white/10 bg-white/5 p-3">Power {formatSignedCurrency(stats.powerSavings)}</div>
                        <div className="rounded-xl border border-white/10 bg-white/5 p-3">Labor {formatSignedCurrency(stats.laborSavings)}</div>
                     </div>
                  </div>
               </div>
            </section>

         </div>

         <footer className="p-16 mt-20 border-t border-border bg-card-bg text-secondary text-[10px] font-mono uppercase tracking-[0.3em] flex justify-between items-center">
            <span>TCO-MOD-002 // CALCULATION ENGINE</span>
            <span>PROPRIETARY INFRALENS FIELD SPEC</span>
         </footer>
      </main>
    </div>
  );
};
