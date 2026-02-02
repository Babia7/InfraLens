
import React, { useState } from 'react';
import { ArrowLeft, Zap, ShieldAlert, Target, ShieldCheck, RefreshCw, Sparkles, Database, MessageSquare, Info, ChevronRight, Share2, Clipboard, Box, AlertTriangle, Scale } from 'lucide-react';
import { GapAnalysisResult } from '@/types';
import { GAP_ANALYSIS_SEED } from '@/data/gapAnalysisSeed';

interface ArchitecturalGapAnalysisProps {
  onBack: () => void;
}

const COMPARISON_SCENARIOS = [
  { id: 'restart', label: 'BGP Process Restart', icon: RefreshCw },
  { id: 'memory', label: 'Management Memory Leak', icon: Box },
  { id: 'race', label: 'Route Converge Race', icon: Zap },
  { id: 'upgrade', label: 'Hitless ISSU binary swap', icon: ShieldCheck }
];

const ArchitecturalSchematic: React.FC<{ mode: 'LEGACY' | 'ARISTA' }> = ({ mode }) => {
  return (
    <div className="h-64 w-full bg-black border border-zinc-800 rounded-2xl relative overflow-hidden flex items-center justify-center p-8">
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,transparent_70%)] pointer-events-none"></div>
       
       {mode === 'LEGACY' ? (
          <div className="relative w-full h-full flex items-center justify-center">
             {/* DISTRIBUTED QUEUES */}
             <div className="flex gap-16 items-center">
                {[1, 2, 3].map(i => (
                   <div key={i} className="relative group">
                      <div className="w-16 h-16 rounded-xl bg-zinc-900 border border-zinc-700 flex flex-col items-center justify-center gap-1 shadow-2xl relative z-10">
                         <Box size={24} className="text-zinc-600" />
                         <span className="text-[8px] font-mono text-zinc-700 uppercase tracking-tighter">P{i}</span>
                      </div>
                      {/* MESSAGING ARROWS */}
                      {i < 3 && (
                         <div className="absolute top-1/2 left-full w-16 h-1 border-t border-dashed border-rose-500/30 -translate-y-1/2 flex items-center justify-center">
                            <Zap size={10} className="text-rose-500 animate-pulse" />
                         </div>
                      )}
                      {/* Cascading failure visual */}
                      <div className="absolute -top-12 left-0 w-full text-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <span className="text-[8px] font-mono text-rose-500 uppercase">Wait_Sync</span>
                      </div>
                   </div>
                ))}
             </div>
             <div className="absolute bottom-4 text-[10px] font-mono text-zinc-600 uppercase tracking-widest italic">Distributed Messaging Architecture</div>
          </div>
       ) : (
          <div className="relative w-full h-full flex items-center justify-center">
             {/* SYSDB CORE */}
             <div className="relative">
                <div className="w-24 h-24 rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/40 flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.2)] animate-breathe">
                   <Database size={40} className="text-emerald-400" />
                </div>
                {[0, 72, 144, 216, 288].map((angle, i) => (
                   <div 
                      key={i} 
                      className="absolute w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center transition-all duration-700 hover:scale-110"
                      style={{ transform: `rotate(${angle}deg) translateY(-80px) rotate(-${angle}deg)` }}
                   >
                      <Zap size={14} className="text-emerald-500" />
                      {/* Link to central truth */}
                      <div className="absolute h-10 w-px bg-emerald-500/20 bottom-full left-1/2 -translate-x-1/2"></div>
                   </div>
                ))}
             </div>
             <div className="absolute bottom-4 text-[10px] font-mono text-zinc-600 uppercase tracking-widest italic">State-Based SysDB Architecture</div>
          </div>
       )}
    </div>
  );
};

export const ArchitecturalGapAnalysis: React.FC<ArchitecturalGapAnalysisProps> = ({ onBack }) => {
  const [result, setResult] = useState<GapAnalysisResult | null>(GAP_ANALYSIS_SEED['upgrade']);

  const handleRunAnalysis = (scenarioId: string) => {
    const seed = GAP_ANALYSIS_SEED[scenarioId];
    if (seed) setResult(seed);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col overflow-hidden selection:bg-rose-500/30">
      
      {/* HEADER */}
      <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-8 bg-zinc-950 shrink-0 z-50">
        <div className="flex items-center gap-6">
            <button onClick={onBack} className="group p-2 text-zinc-500 hover:text-white transition-colors">
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <div className="h-4 w-px bg-zinc-800"></div>
            <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.15)]">
                    <Scale size={20} />
                </div>
                <div>
                    <h1 className="text-sm font-bold uppercase tracking-wider">Architectural Gap Analysis</h1>
                    <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Reasoning Kernel v4.1</span>
                </div>
            </div>
        </div>
        <div className="flex items-center gap-4">
           <div className="bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">SysDB Verified</span>
           </div>
        </div>
      </header>

      {/* WORKSPACE */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* LEFT: SIMULATOR & SCENARIOS */}
        <section className="w-full md:w-[450px] lg:w-[500px] bg-zinc-950 border-r border-zinc-900 flex flex-col shrink-0 relative overflow-y-auto">
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
           
           <div className="p-8 md:p-12 relative z-10 space-y-12">
              <header className="space-y-4">
                 <h2 className="text-4xl font-serif font-bold text-white tracking-tighter">Failure Modes</h2>
                 <p className="text-sm text-zinc-500 leading-relaxed">Select a scenario to deconstruct the architectural response gap between legacy messaging and Arista state-streaming.</p>
              </header>

              <div className="grid grid-cols-1 gap-4">
                 {COMPARISON_SCENARIOS.map((scenario) => (
                    <button 
                       key={scenario.id}
                       onClick={() => handleRunAnalysis(scenario.id)}
                       className="p-6 bg-zinc-900 border border-zinc-800 rounded-3xl text-left transition-all hover:border-rose-500/50 hover:bg-zinc-900/80 group flex items-center justify-between"
                    >
                       <div className="flex items-center gap-6">
                          <div className="w-12 h-12 rounded-2xl bg-black border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-rose-400 transition-colors">
                             <scenario.icon size={24} />
                          </div>
                          <span className="font-bold text-white group-hover:text-rose-400 transition-colors">{scenario.label}</span>
                       </div>
                       <ChevronRight size={18} className="text-zinc-700 group-hover:text-rose-400" />
                    </button>
                 ))}
              </div>

              <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                 <div className="flex items-start gap-4">
                    <Info size={18} className="text-zinc-500 shrink-0 mt-1" />
                    <p className="text-[11px] text-zinc-500 leading-relaxed italic">
                       "Messaging-based OSs rely on inter-process sync that can lead to race conditions. SysDB decouples state from logic, ensuring that if a process fails, the state remains immutable and instantly available to the restarted agent."
                    </p>
                 </div>
              </div>
           </div>
        </section>

        {/* RIGHT: REASONING CORE */}
        <section className="flex-1 overflow-y-auto bg-black p-8 md:p-16 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.05)_0%,transparent_70%)] pointer-events-none"></div>
            
            <div className="max-w-4xl mx-auto space-y-12 animate-fade-in relative z-10">
               {!result ? (
                  <div className="h-[60vh] flex flex-col items-center justify-center text-center opacity-20">
                     <div className="w-24 h-24 border-2 border-dashed border-zinc-800 rounded-full flex items-center justify-center animate-spin-slower mb-12">
                        <Scale size={40} className="text-zinc-600" />
                     </div>
                     <h3 className="text-3xl font-serif italic text-zinc-500">Select a scenario for gap synthesis</h3>
                  </div>
               ) : result && (
                  <div className="space-y-16 pb-20">
                     <header className="space-y-4">
                        <div className="flex items-center gap-4">
                           <span className="font-mono text-xs text-rose-500 uppercase tracking-[0.4em]">Gap Deconstruction</span>
                           <div className="h-px bg-zinc-800 flex-1"></div>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-serif font-black tracking-tighter text-white">{result.scenario}</h2>
                     </header>

                     {/* SCHEMATIC COMPARISON */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                           <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Legacy Paradigm</h3>
                           <ArchitecturalSchematic mode="LEGACY" />
                           <div className="p-6 bg-rose-950/10 border border-rose-500/20 rounded-2xl min-h-[140px]">
                              <div className="flex items-center gap-2 text-rose-500 mb-3 text-[10px] font-bold uppercase">
                                 <AlertTriangle size={14} /> Critical Entropy
                              </div>
                              <p className="text-sm text-zinc-400 leading-relaxed">
                                 {result.legacyImpact}
                              </p>
                           </div>
                        </div>

                        <div className="space-y-4">
                           <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Arista Paradigm</h3>
                           <ArchitecturalSchematic mode="ARISTA" />
                           <div className="p-6 bg-emerald-950/10 border border-emerald-500/20 rounded-2xl min-h-[140px]">
                              <div className="flex items-center gap-2 text-emerald-500 mb-3 text-[10px] font-bold uppercase">
                                 <ShieldCheck size={14} /> State Resilience
                              </div>
                              <p className="text-sm text-zinc-400 leading-relaxed">
                                 {result.aristaResilience}
                              </p>
                           </div>
                        </div>
                     </div>

                     {/* BUSINESS METRIC */}
                     <section className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-10 relative overflow-hidden group shadow-2xl">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Zap size={120} className="text-rose-500" /></div>
                        <div className="flex items-center gap-4 mb-8">
                           <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500">
                              <Target size={24} />
                           </div>
                           <h3 className="text-2xl font-serif font-bold text-white">Business Value Projection</h3>
                        </div>
                        <div className="text-4xl font-serif font-bold text-white mb-4 tracking-tight">
                           {result.businessMetric}
                        </div>
                        <p className="text-lg text-zinc-400 font-light leading-relaxed italic border-l-2 border-rose-500/30 pl-8">
                           "{result.executiveSummary}"
                        </p>
                     </section>

                     {/* BATTLE CARD BARS */}
                     <section className="space-y-6">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">CTO Battlefield Points</h3>
                        <div className="grid grid-cols-1 gap-4">
                           {result.bulletPoints.map((point, i) => (
                              <div key={i} className="group p-6 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-between hover:border-zinc-700 transition-all cursor-default">
                                 <div className="flex items-center gap-6">
                                    <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]"></div>
                                    <span className="text-zinc-200 font-medium">{point}</span>
                                 </div>
                                 <button className="p-2 text-zinc-700 hover:text-white transition-colors">
                                    <Clipboard size={16} />
                                 </button>
                              </div>
                           ))}
                        </div>
                     </section>
                  </div>
               )}
            </div>
        </section>
      </main>

      {/* SYSTEM HUD */}
      <footer className="h-10 bg-zinc-950 border-t border-zinc-900 px-8 flex items-center justify-between text-[8px] font-mono text-zinc-600 uppercase tracking-[0.4em] shrink-0 z-20">
         <div className="flex items-center gap-4">
            <span>Competitive Reasoning Kernel</span>
            <span className="w-1 h-1 bg-zinc-800 rounded-full"></span>
            <span className="text-rose-900">Module: ARCH-GAP-SIM-09</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span>Grounding Calibration: Optimized</span>
         </div>
      </footer>

    </div>
  );
};
