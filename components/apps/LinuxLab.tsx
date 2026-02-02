
import React, { useState } from 'react';
import { ArrowLeft, Terminal, Cpu, HardDrive, Network, Code, FileText, ChevronRight, Zap, Info, ShieldCheck, Box, Activity, Layers, BookOpen } from 'lucide-react';
import { LAB_MODULES, LabModule } from '@data/linuxModules';

interface LinuxLabProps {
  onBack: () => void;
}

const Tooltip: React.FC<{ text: string; children: React.ReactNode; side?: 'top' | 'bottom' | 'left' | 'right'; className?: string }> = ({ text, children, side = 'top', className = '' }) => {
  const posClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-[90%] top-1/2 -translate-y-1/2 ml-2'
  };

  return (
    <div className={`group relative flex items-center ${className}`}>
      {children}
      <div className={`absolute ${posClasses[side]} z-[100] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
        <div className="bg-zinc-800 text-zinc-200 text-[10px] font-medium py-1.5 px-3 rounded-lg border border-zinc-700 shadow-xl whitespace-nowrap">
          {text}
          {/* Tiny arrow */}
          <div className={`absolute w-2 h-2 bg-zinc-800 border-zinc-700 transform rotate-45 ${
             side === 'top' ? 'bottom-[-5px] left-1/2 -translate-x-1/2 border-b border-r' : 
             side === 'bottom' ? 'top-[-5px] left-1/2 -translate-x-1/2 border-t border-l' :
             side === 'right' ? 'left-[-5px] top-1/2 -translate-y-1/2 border-l border-b' :
             'right-[-5px] top-1/2 -translate-y-1/2 border-t border-r'
          }`}></div>
        </div>
      </div>
    </div>
  );
};

// Legacy inline content retained for reference; live content is sourced from @data/linuxModules.
export const LinuxLab: React.FC<LinuxLabProps> = ({ onBack }) => {
  const [activeModuleIdx, setActiveModuleIdx] = useState(0);
  const [activeStepIdx, setActiveStepIdx] = useState(0);

  const activeModule = LAB_MODULES[activeModuleIdx];
  const activeStep = activeModule.content[activeStepIdx];

  const handleNext = () => {
    if (activeStepIdx < activeModule.content.length - 1) {
      setActiveStepIdx(activeStepIdx + 1);
    } else if (activeModuleIdx < LAB_MODULES.length - 1) {
      setActiveModuleIdx(activeModuleIdx + 1);
      setActiveStepIdx(0);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col overflow-hidden selection:bg-emerald-500/30">
      
      {/* HEADER */}
      <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-8 bg-zinc-950 shrink-0 z-50">
        <div className="flex items-center gap-6">
            <Tooltip text="Return to App Registry" side="right">
                <button onClick={onBack} className="group p-2 text-zinc-500 hover:text-white transition-colors">
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                </button>
            </Tooltip>
            <div className="h-4 w-px bg-zinc-800"></div>
            <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
                    <Terminal size={20} />
                </div>
                <div>
                    <h1 className="text-sm font-bold uppercase tracking-wider">EOS Linux Laboratory</h1>
                    <span className="text-[9px] font-mono text-emerald-500 uppercase tracking-widest">Operator Drills v2.5</span>
                </div>
            </div>
        </div>
        <div className="flex items-center gap-4">
           <div className="hidden md:flex gap-1">
              {LAB_MODULES.map((m, i) => (
                <Tooltip key={m.id} text={m.title} side="bottom">
                    <div className={`h-1 w-12 rounded-full transition-all duration-500 cursor-help ${i === activeModuleIdx ? 'bg-emerald-500' : 'bg-zinc-800'}`}></div>
                </Tooltip>
              ))}
           </div>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <main className="flex-1 flex overflow-hidden min-h-0">
        
        {/* MODULE SIDEBAR */}
        <aside className="w-64 border-r border-zinc-900 bg-zinc-950/50 hidden lg:flex flex-col">
            <div className="p-6">
                <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em] mb-6">Execution Sequence</h3>
                <nav className="space-y-2">
                    {LAB_MODULES.map((module, idx) => (
                        <Tooltip key={module.id} text={module.summary} side="right" className="w-full">
                            <button 
                                onClick={() => { setActiveModuleIdx(idx); setActiveStepIdx(0); }}
                                className={`w-full text-left p-4 rounded-xl transition-all border flex items-center gap-4 ${activeModuleIdx === idx ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-transparent border-transparent text-zinc-500 hover:text-zinc-300'}`}
                            >
                                <module.icon size={18} />
                                <span className="text-xs font-bold uppercase tracking-wider">{module.title}</span>
                            </button>
                        </Tooltip>
                    ))}
                </nav>
            </div>
            <div className="mt-auto p-6 border-t border-zinc-900">
                <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
                    <p className="text-[10px] text-zinc-500 leading-relaxed italic">"Arista Advanced Cloud Training (ACT) emphasizes that EOS is a set of Linux processes."</p>
                </div>
            </div>
        </aside>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto relative p-8 md:p-16 flex flex-col min-h-0">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
            
            <div className="max-w-3xl animate-fade-in">
                <header className="mb-12">
                    <span className="font-mono text-xs text-emerald-500 uppercase tracking-[0.4em] mb-4 block">Module 0{activeModuleIdx + 1} // Step 0{activeStepIdx + 1}</span>
                    <h2 className="text-5xl font-serif font-bold text-white mb-6 leading-tight">{activeStep.heading}</h2>
                    <p className="text-xl text-zinc-400 font-light leading-relaxed">
                        {activeStep.description}
                    </p>
                </header>

                <div className="space-y-12 pb-20">
                    {/* COMMAND DISPLAY */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                            <Code size={14} className="text-emerald-500" /> CLI Execution
                        </div>
                        <div className="p-6 bg-black border border-zinc-800 rounded-2xl relative group overflow-hidden shadow-2xl">
                            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                            <code className="text-emerald-400 font-mono text-lg block">
                                {activeStep.command.split('\n').map((line, i) => (
                                    <div key={i} className="flex gap-3 mb-1 last:mb-0">
                                        <span className="text-zinc-700 select-none shrink-0">$</span>
                                        <span className="break-all">{line}</span>
                                    </div>
                                ))}
                            </code>
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-[8px] font-mono text-zinc-700 uppercase">Interactive_Shell_Active</span>
                            </div>
                        </div>
                        <p className="text-sm text-zinc-500 leading-relaxed pl-4 border-l border-zinc-800 italic">
                            {activeStep.explanation}
                        </p>
                    </div>

                    {/* INSIGHT CARD */}
                    <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-[2rem] relative overflow-hidden shadow-xl">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Zap size={100} className="text-emerald-500" />
                        </div>
                        <div className="flex items-center gap-3 text-emerald-400 mb-4">
                            <ShieldCheck size={20} />
                            <h4 className="text-xs font-bold uppercase tracking-widest">ACT Field Insight</h4>
                        </div>
                        <p className="text-lg text-zinc-200 leading-relaxed font-serif">
                            {activeStep.insight}
                        </p>
                    </div>
                </div>

                {/* NAVIGATION FOOTER */}
                <div className="mt-auto border-t border-zinc-900 pt-10 flex justify-between items-center">
                    <div className="flex gap-1">
                        {activeModule.content.map((_, i) => (
                            <div key={i} className={`h-1 w-8 rounded-full transition-all ${i === activeStepIdx ? 'bg-emerald-500' : 'bg-zinc-800'}`}></div>
                        ))}
                    </div>
                    <button 
                        onClick={handleNext}
                        className="px-8 py-4 bg-white text-black font-bold rounded-xl flex items-center gap-3 hover:bg-emerald-100 transition-all shadow-xl shadow-white/5"
                    >
                        {activeStepIdx < activeModule.content.length - 1 ? 'Next Step' : 'Next Module'} 
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        </div>

        {/* METRICS PANEL */}
        <div className="w-80 border-l border-zinc-900 bg-zinc-950/30 hidden xl:flex flex-col p-8 gap-8 overflow-y-auto">
            <section>
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
                    <Activity size={14} className="text-emerald-500" /> Lab Status
                </h3>
                <div className="space-y-4">
                    <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800 group relative">
                        <span className="text-[10px] text-zinc-600 uppercase block mb-1">Architecture</span>
                        <span className="text-sm font-bold">Linux-Based (Fedora)</span>
                    </div>
                    <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
                        <span className="text-[10px] text-zinc-600 uppercase block mb-1">Kernel Version</span>
                        <span className="text-sm font-bold">vEOS Unified 4.31+</span>
                    </div>
                </div>
            </section>

            <section>
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
                    <Box size={14} className="text-emerald-500" /> Artifact Registry
                </h3>
                <div className="space-y-3">
                    {[
                        { label: 'SysDB Context', val: 'READ_ONLY', tip: 'State synchronization agent status' },
                        { label: 'Bash Permissions', val: 'SUDO_LOCKED', tip: 'Root access requires explicit elevation' },
                        { label: 'Aboot Target', val: 'FLASH_V01', tip: 'Primary bootloader partition pointer' }
                    ].map(item => (
                        <Tooltip key={item.label} text={item.tip} side="left">
                            <div className="flex justify-between text-[10px] font-mono border-b border-zinc-900 pb-2 cursor-help">
                                <span className="text-zinc-600 border-b border-dashed border-zinc-800">{item.label}</span>
                                <span className="text-emerald-600">{item.val}</span>
                            </div>
                        </Tooltip>
                    ))}
                </div>
            </section>

            <div className="mt-auto">
                <div className="bg-emerald-950/20 border border-emerald-500/20 p-6 rounded-2xl">
                    <Info size={24} className="text-emerald-500 mb-4" />
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                        Mastering the bash shell allows SEs to run native scripts, perform advanced packet captures, and interact with EOS via internal APIs directly from the command line.
                    </p>
                </div>
            </div>
        </div>

      </main>

      {/* SYSTEM STATS */}
      <div className="h-10 bg-zinc-950 border-t border-zinc-900 px-8 flex items-center justify-between text-[8px] font-mono text-zinc-600 uppercase tracking-[0.4em] shrink-0 z-20">
         <div className="flex items-center gap-4">
            <span>Arista Learning Center</span>
            <span className="w-1 h-1 bg-zinc-800 rounded-full"></span>
            <span className="text-emerald-900">Module: Technical Substrate</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span>Training Kernel Active</span>
         </div>
      </div>

    </div>
  );
};
