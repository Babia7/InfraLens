
import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Cpu, RefreshCw, Zap, Target, Users, CheckCircle, Brain, Battery, Sun, Moon, Calendar, Database, Activity, Layers, ArrowRight, Info, Save, X, Fingerprint, BookOpen, Clock, Heart, Download } from 'lucide-react';
import { useInfraLens } from '../context/InfraLensContext';

interface HumanOSProps {
  onBack: () => void;
  startAbout?: boolean;
}

// -- ABSTRACT VISUALS --
const VisualLayer: React.FC<{ activeStep: number }> = ({ activeStep }) => {
  const isVisible = (stepIndex: number) => Math.abs(activeStep - stepIndex) <= 2;

  return (
    <div className="w-full h-full relative flex items-center justify-center [perspective:1000px] overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none transform-gpu">
         <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px] transition-all duration-1000 ${[0, 4, 5, 10].includes(activeStep) ? 'opacity-100 scale-100' : 'opacity-20 scale-50'}`} />
         <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[100px] transition-all duration-1000 ${[1, 8].includes(activeStep) ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} />
         <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[100px] transition-all duration-1000 ${[2, 3, 6, 7, 9].includes(activeStep) ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} />
      </div>

      <div className="relative z-10 w-[300px] h-[300px] md:w-[500px] md:h-[500px] flex items-center justify-center transition-all duration-700">
        {isVisible(0) && (
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-700 will-change-transform ${activeStep === 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-90 blur-xl pointer-events-none'}`}>
            <div className="relative flex items-center justify-center w-full h-full">
                <div className="w-32 h-32 md:w-48 md:h-48 bg-white/5 rounded-full border border-white/20 flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.1)] animate-pulse-slow">
                    <div className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-full shadow-[0_0_30px_rgba(255,255,255,0.5)]"></div>
                </div>
                <div className="absolute w-[250px] h-[250px] border border-white/10 rounded-full animate-spin-slow">
                    <div className="absolute top-0 left-1/2 w-3 h-3 bg-indigo-400 rounded-full -translate-x-1/2 -translate-y-1.5 shadow-[0_0_10px_rgba(99,102,241,0.8)]"></div>
                </div>
            </div>
        </div>
        )}
        {isVisible(1) && (
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-700 will-change-transform ${activeStep === 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-110 blur-xl pointer-events-none'}`}>
             <div className="relative w-72 h-72 md:w-96 md:h-96">
                 <svg className="w-full h-full animate-[spin_60s_linear_infinite]" viewBox="0 0 300 300">
                     <defs>
                        <linearGradient id="human-day-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="var(--hos-day-start)" />
                            <stop offset="50%" stopColor="var(--hos-day-mid)" />
                            <stop offset="100%" stopColor="var(--hos-day-end)" />
                        </linearGradient>
                     </defs>
                     <circle cx="150" cy="150" r="140" stroke="rgba(255,255,255,0.1)" strokeWidth="1" fill="none" />
                     <path d="M150 10 A 140 140 0 0 1 150 290" stroke="url(#human-day-gradient)" strokeWidth="4" fill="none" strokeLinecap="round" />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <Sun size={48} className="text-orange-400 mb-2" />
                     <span className="text-4xl md:text-5xl font-serif font-bold text-white">24h</span>
                 </div>
             </div>
        </div>
        )}
        {isVisible(2) && (
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-700 will-change-transform ${activeStep === 2 ? 'opacity-100 scale-100' : 'opacity-0 translate-x-20 blur-xl pointer-events-none'}`}>
            <div className="flex gap-2 md:gap-6 items-end h-64">
                {[...Array(7)].map((_, i) => (
                    <div key={i} className="flex flex-col items-center gap-3 group">
                        <div className={`w-8 md:w-16 rounded-t-lg border-x border-t transition-all duration-500 relative overflow-hidden ${i === 6 ? 'h-48 border-indigo-500 bg-indigo-500/10' : 'h-24 border-zinc-700 bg-zinc-900'}`}></div>
                        <span className={`text-[10px] md:text-sm font-mono font-bold uppercase ${i === 6 ? 'text-indigo-400' : 'text-zinc-600'}`}>{['M','T','W','T','F','S','Sun'][i]}</span>
                    </div>
                ))}
            </div>
        </div>
        )}
        {isVisible(3) && (
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-700 will-change-transform ${activeStep === 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-50 blur-xl pointer-events-none'}`}>
             <div className="relative w-80 h-80 md:w-96 md:h-96 rounded-full border border-zinc-800 bg-zinc-950 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 rounded-full animate-[spin_4s_linear_infinite]">
                      <div className="w-1/2 h-0.5 bg-emerald-500 absolute top-1/2 left-1/2 shadow-[0_0_15px_#10b981] origin-left"></div>
                  </div>
                  <div className="absolute text-center z-10">
                      <span className="block text-3xl font-serif font-bold text-white">30 Days</span>
                  </div>
             </div>
        </div>
        )}
        {isVisible(4) && (
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-700 will-change-transform ${activeStep === 4 ? 'opacity-100 scale-100' : 'opacity-0 scale-150 blur-xl pointer-events-none'}`}>
             <div className="relative w-full h-full flex items-center justify-center">
                 <div className="w-32 h-32 md:w-48 md:h-48 bg-zinc-900 border border-zinc-700 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.05)] relative z-10">
                     <Brain size={64} className="text-white" />
                 </div>
             </div>
        </div>
        )}
         {isVisible(5) && (
         <div className={`absolute inset-0 flex items-center justify-center transition-all duration-700 will-change-transform ${activeStep === 5 ? 'opacity-100 scale-100' : 'opacity-0 translate-y-20 blur-xl pointer-events-none'}`}>
             <div className="w-40 h-40 bg-zinc-900 border border-blue-500 rounded-full flex flex-col items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.15)] relative overflow-hidden z-10">
                 <RefreshCw size={48} className="text-blue-500 animate-spin-slow mb-2" />
             </div>
         </div>
         )}
         {isVisible(6) && (
         <div className={`absolute inset-0 flex items-center justify-center transition-all duration-700 will-change-transform ${activeStep === 6 ? 'opacity-100 scale-100' : 'opacity-0 scale-90 blur-xl pointer-events-none'}`}>
              <div className="relative w-80 h-64 md:w-96 md:h-80 border-l border-b border-zinc-700">
                  <svg className="absolute inset-0 overflow-visible" viewBox="0 0 320 256">
                      <path d="M 0 256 Q 160 250, 320 0" stroke="var(--hos-curve-end)" strokeWidth="6" fill="none" strokeLinecap="round" />
                  </svg>
                  <div className="absolute top-0 right-0 w-6 h-6 bg-purple-500 rounded-full shadow-[0_0_20px_#a855f7] animate-ping"></div>
              </div>
         </div>
         )}
         {isVisible(7) && (
         <div className={`absolute inset-0 flex items-center justify-center transition-all duration-700 will-change-transform ${activeStep === 7 ? 'opacity-100 scale-100' : 'opacity-0 scale-150 blur-xl pointer-events-none'}`}>
             <div className="relative top-[35%] flex flex-col items-center">
                <Target size={64} className="text-white relative z-10 mb-4" />
                <span className="block text-5xl font-serif font-bold text-white tracking-widest drop-shadow-xl">10 Years</span>
             </div>
         </div>
         )}
         {isVisible(8) && (
         <div className={`absolute inset-0 flex items-center justify-center transition-all duration-700 will-change-transform ${activeStep === 8 ? 'opacity-100 scale-100' : 'opacity-0 blur-xl pointer-events-none'}`}>
              <div className="flex gap-8 md:gap-16">
                  <div className="w-20 md:w-24 h-64 md:h-80 bg-zinc-900 border border-zinc-800 rounded-2xl relative overflow-hidden flex items-end p-2">
                      <div className="w-full h-[90%] bg-indigo-500/20 rounded-xl relative overflow-hidden">
                          <div className="absolute inset-0 bg-indigo-500/50 animate-pulse"></div>
                      </div>
                  </div>
              </div>
         </div>
         )}
         {isVisible(9) && (
         <div className={`absolute inset-0 flex items-center justify-center transition-all duration-700 will-change-transform ${activeStep === 9 ? 'opacity-100 scale-100' : 'opacity-0 blur-xl pointer-events-none'}`}>
             <div className="relative w-96 h-96 flex items-center justify-center scale-125">
                 <div className="w-20 h-20 bg-white rounded-full z-10 flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                     <Users size={32} className="text-black" />
                 </div>
             </div>
         </div>
         )}
         {isVisible(10) && (
         <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 will-change-transform ${activeStep === 10 ? 'opacity-100 scale-100' : 'opacity-0 scale-50 blur-xl pointer-events-none'}`}>
             <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 p-8 md:p-10 rounded-3xl shadow-2xl relative">
                 <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-8">Next 24 Hours</h2>
                 <button className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest rounded-xl">Initialize</button>
             </div>
         </div>
         )}
      </div>
    </div>
  );
};

const StepContent: React.FC<{ 
    title: string; 
    description: string;
    actionLabel: string;
    actionText: string;
    isActive: boolean;
    stepIndex: number;
    divRef: (el: HTMLDivElement | null) => void;
}> = ({ title, description, actionLabel, actionText, isActive, stepIndex, divRef }) => {
    return (
        <div 
          ref={divRef}
          data-step-index={stepIndex}
          className={`min-h-screen flex items-center transition-all duration-700 ${isActive ? 'opacity-100 translate-x-0' : 'opacity-10 -translate-x-10 blur-sm'}`}
        >
            <div className="max-w-xl p-8 relative">
                <div className="absolute -left-8 top-10 font-black text-8xl text-zinc-800 opacity-20 font-serif select-none -z-10">
                    {stepIndex < 9 ? `0${stepIndex + 1}` : stepIndex + 1}
                </div>
                <div className="flex items-center gap-4 mb-8">
                    <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest border border-zinc-800 px-2 py-1 rounded bg-zinc-900">
                        Module {stepIndex < 9 ? `0${stepIndex + 1}` : stepIndex + 1}
                    </span>
                    <div className={`h-px flex-1 bg-gradient-to-r from-zinc-700 to-transparent transition-all duration-1000 ${isActive ? 'w-20 opacity-100' : 'w-0 opacity-0'}`}></div>
                </div>
                <h2 className="font-serif font-bold text-white mb-8 leading-[1.1] tracking-tight" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}>
                    {title}
                </h2>
                <div className="space-y-10">
                    <p className="text-zinc-400 font-sans leading-relaxed max-w-lg" style={{ fontSize: 'clamp(1rem, 1.2vw, 1.25rem)' }}>
                        {description}
                    </p>
                    <div className="relative pl-6 border-l-2 border-indigo-500/30 group hover:border-indigo-500 transition-colors">
                        <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-indigo-400 mb-3 group-hover:text-indigo-300 transition-colors">
                            {actionLabel}
                        </span>
                        <p className="text-white font-medium leading-relaxed" style={{ fontSize: 'clamp(0.9rem, 1.1vw, 1.125rem)' }}>
                            {actionText}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};


export const HumanOS: React.FC<HumanOSProps> = ({ onBack, startAbout = false }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [showAbout, setShowAbout] = useState(startAbout);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  // Fix: Access sePerformance from context and alias it to humanOS to resolve the missing property error.
  const { sePerformance: humanOS } = useInfraLens();

  useEffect(() => {
    if (showAbout) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-step-index'));
            setActiveStep(index);
          }
        });
      },
      { root: null, rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    );
    stepRefs.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [humanOS, showAbout]);

  const handlePrint = () => { window.print(); };

  const handleExportMarkdown = () => {
    const content = `# HUMAN OS PROTOCOL - VERSION 1.0
## BIOLOGICAL KERNEL SPECIFICATION

### 1. PHILOSOPHY
- Identity Centric: Protocols serve the "Desired Self" archetype.
- Rhythmic Alignment: Biological sync > External schedules.
- High Density Signal: Minimize consumption of noise; maximize synthesis.

### 2. CORE MODULES
${humanOS.map((s, i) => `- ${i+1}. **${s.title}**: ${s.description} (${s.actionLabel}: ${s.actionText})`).join('\n')}

### 3. METRICS OF SUCCESS
- HRV Baseline
- Focus-to-Entropy Ratio
- Sleep Architecture Efficiency (REM/Deep)

[END OF CANONICAL HUMAN_OS SPEC]`;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'human-os-protocol.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (showAbout) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col md:flex-row overflow-hidden selection:bg-emerald-500/30">
        {/* SIDEBAR */}
        <aside className="no-print w-full md:w-72 border-b md:border-b-0 md:border-r border-zinc-800 bg-zinc-950 flex flex-col shrink-0 z-30">
           <div className="p-8 flex items-center gap-3">
              <button onClick={() => setShowAbout(false)} className="p-2 -ml-2 text-zinc-500 hover:text-white rounded-lg hover:bg-zinc-900 transition-colors">
                 <ArrowLeft size={18} />
              </button>
              <div className="flex flex-col">
                  <span className="font-serif font-bold text-lg tracking-tight leading-none">Module Specs</span>
                  <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mt-1">HumanOS v1.0</span>
              </div>
           </div>
           <nav className="flex-1 px-4 space-y-2 pt-4">
              <div className="p-6 bg-emerald-950/10 border border-emerald-500/20 rounded-2xl mb-4">
                  <h3 className="text-emerald-400 font-bold text-sm mb-2 flex items-center gap-2"><Fingerprint size={16}/> Biological Kernel</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">Detailed protocols for physiological and cognitive optimization. Intended for daily execution.</p>
              </div>
              <button onClick={handlePrint} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all border border-indigo-500/20 group">
                  <Save size={18} />
                  <span className="text-sm font-bold uppercase tracking-wider">Export PDF</span>
              </button>
              <button onClick={handleExportMarkdown} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-800 text-zinc-400 hover:bg-white hover:text-black transition-all border border-zinc-700 group">
                  <Download size={18} />
                  <span className="text-sm font-bold uppercase tracking-wider">Save .MD</span>
              </button>
           </nav>
           <div className="p-6 border-t border-zinc-900">
              <button onClick={onBack} className="text-xs text-zinc-500 hover:text-white flex items-center gap-2 uppercase tracking-widest"><ArrowLeft size={12}/> Return to About</button>
           </div>
        </aside>

        {/* INTERACTIVE DOSSIER PREVIEW */}
        <main className="no-print flex-1 overflow-y-auto bg-[#09090b] relative p-8 md:p-20">
           <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[length:40px_40px] pointer-events-none"></div>
           <div className="max-w-4xl mx-auto space-y-20 animate-fade-in pb-32">
              <section className="space-y-6">
                  <h1 className="text-6xl md:text-8xl font-serif font-bold tracking-tighter">HumanOS</h1>
                  <p className="text-2xl text-emerald-400 font-light italic border-l-2 border-emerald-500/30 pl-8">"Optimization is not an event, but a continuous biological state."</p>
              </section>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl">
                      <h3 className="font-bold text-xl mb-4 text-white">System Architecture</h3>
                      <p className="text-zinc-400 text-sm leading-relaxed">HumanOS treats the body as a hierarchical state machine. Rhythms (Circadian) govern energy levels, which govern focus (Ultradian), which determines cognitive output.</p>
                  </div>
                  <div className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl">
                      <h3 className="font-bold text-xl mb-4 text-white">Execution Layers</h3>
                      <ul className="space-y-3 text-xs font-mono text-zinc-500">
                          <li className="flex justify-between border-b border-zinc-800 pb-1"><span>L1: IDENTITY</span><span>Values & Baseline</span></li>
                          <li className="flex justify-between border-b border-zinc-800 pb-1"><span>L2: BIOLOGICAL</span><span>Light, Fuel, Sleep</span></li>
                          <li className="flex justify-between border-b border-zinc-800 pb-1"><span>L3: COGNITIVE</span><span>Work, Synthesis</span></li>
                      </ul>
                  </div>
              </div>
           </div>
        </main>

        {/* PRINTABLE DOSSIER (Mirroring Parent style) */}
        <div className="print-only hidden mx-auto bg-white text-black p-0 overflow-visible" style={{ width: '210mm' }}>
           <div className="p-16 border-b border-gray-100 min-h-[297mm] flex flex-col relative print-break-after">
              <div className="absolute top-8 right-16 text-[10px] font-mono text-gray-400 uppercase tracking-widest">PAGE 01</div>
              <header className="mb-20 border-b-8 border-black pb-8">
                  <h1 className="text-6xl font-serif font-black uppercase tracking-tighter mb-4">HumanOS Specification</h1>
                  <div className="flex justify-between font-mono text-xs uppercase tracking-widest text-gray-500">
                     <span>Module: PROTOCOL v1.0</span>
                     <span>Compiled: {new Date().toLocaleDateString()}</span>
                  </div>
              </header>
              <section className="mb-20 space-y-12">
                  <h2 className="text-4xl font-serif font-bold tracking-tight mb-8 border-b-2 border-black pb-2">I. The Biological Stack</h2>
                  <div className="grid grid-cols-1 gap-12">
                      <div>
                          <h3 className="font-bold uppercase tracking-widest text-xs mb-3 text-emerald-600">01. Circadian Calibration</h3>
                          <p className="text-sm leading-loose">The master clock (SCN) must be anchored to solar light within 60 minutes of waking. This initializes the cortisol/melatonin cycle. Violating this timing leads to metabolic and cognitive drift.</p>
                      </div>
                      <div>
                          <h3 className="font-bold uppercase tracking-widest text-xs mb-3 text-emerald-600">02. Ultradian Performance</h3>
                          <p className="text-sm leading-loose">Cognitive work should be executed in 90-minute blocks separated by 20-minute periods of total visual and auditory disengagement. Deep work happens in the 'Flow Channel' between high challenge and high skill.</p>
                      </div>
                      <div>
                          <h3 className="font-bold uppercase tracking-widest text-xs mb-3 text-emerald-600">03. Hormetic Regulation</h3>
                          <p className="text-sm leading-loose">The system requires controlled stressors (Heat, Cold, Resistance) to maintain adaptive capacity. A sedentary state is treated as a critical system fault.</p>
                      </div>
                  </div>
              </section>
              <footer className="mt-auto pt-8 border-t border-gray-200 text-center font-mono text-[8px] uppercase text-gray-400 tracking-[0.5em]">HumanOS // Section I // Kernel v1.0</footer>
           </div>

           <div className="p-16 border-b border-gray-100 min-h-[297mm] flex flex-col relative print-break-after">
              <div className="absolute top-8 right-16 text-[10px] font-mono text-gray-400 uppercase tracking-widest">PAGE 02</div>
              <section className="mb-16 space-y-12">
                  <h2 className="text-4xl font-serif font-bold tracking-tight mb-8 border-b-2 border-black pb-2">II. Operational Protocols</h2>
                  <div className="grid grid-cols-1 gap-6">
                      {humanOS.map((step, i) => (
                          <div key={i} className="flex gap-6 border-b border-gray-100 pb-4">
                              <span className="font-mono text-xs font-bold text-gray-400">0{i+1}</span>
                              <div>
                                  <h4 className="font-bold text-sm uppercase">{step.title}</h4>
                                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">{step.description}</p>
                                  <div className="mt-2 text-[10px] font-mono text-emerald-600 uppercase font-bold">{step.actionLabel}: {step.actionText}</div>
                              </div>
                          </div>
                      ))}
                  </div>
              </section>
              <footer className="mt-auto pt-8 border-t border-gray-200 text-center font-mono text-[8px] uppercase text-gray-400 tracking-[0.5em]">HumanOS // Section II // Execution Map</footer>
           </div>

           <div className="p-16 min-h-[297mm] flex flex-col relative bg-gray-50">
              <div className="absolute top-8 right-16 text-[10px] font-mono text-gray-400 uppercase tracking-widest">PAGE 03</div>
              <header className="mb-12 border-b border-gray-300 pb-4">
                  <h2 className="text-xs font-mono font-bold uppercase tracking-[0.4em] text-gray-500">CANONICAL_TEXT_VERSION</h2>
              </header>
              <div className="flex-1 bg-white p-10 border border-gray-200 font-mono text-[10px] text-gray-700 whitespace-pre-wrap leading-relaxed">
{`# HUMAN OS PROTOCOL - VERSION 1.0
## BIOLOGICAL KERNEL SPECIFICATION

### 1. PHILOSOPHY
- Identity Centric: Protocols serve the "Desired Self" archetype.
- Rhythmic Alignment: Biological sync > External schedules.
- High Density Signal: Minimize consumption of noise; maximize synthesis.

### 2. CORE MODULES
${humanOS.map((s, i) => `- ${i+1}. ${s.title}: ${s.description} (${s.actionLabel}: ${s.actionText})`).join('\n')}

### 3. METRICS OF SUCCESS
- HRV Baseline
- Focus-to-Entropy Ratio
- Sleep Architecture Efficiency (REM/Deep)

[END OF CANONICAL HUMAN_OS SPEC]`}
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-page-bg text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden min-h-screen">
      <nav className="fixed top-0 left-0 w-full z-50 p-6 flex justify-between items-center mix-blend-difference pointer-events-none">
        <div className="flex items-center gap-6 pointer-events-auto">
            <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-indigo-400 transition-colors text-white">
            <ArrowLeft size={14} /> Back
            </button>
            <button onClick={() => setShowAbout(true)} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-500 hover:text-emerald-400 transition-colors">
            <Info size={14} /> About HumanOS
            </button>
        </div>
        <span className="font-mono text-xs text-white/50">HumanOS Kernel v1.0</span>
      </nav>
      <div className="fixed top-0 left-0 h-1 bg-zinc-950 w-full z-50">
          <div className="h-full bg-indigo-500 transition-all duration-300 shadow-[0_0_10px_#6366f1]" style={{ width: `${((activeStep + 1) / 11) * 100}%` }} />
      </div>
      <div className="relative flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 relative z-20 pl-4 md:pl-20">
              <div className="pt-[10vh] pb-[10vh]">
                  {humanOS.map((step, index) => (
                      <StepContent key={step.id || index} title={step.title} description={step.description} actionLabel={step.actionLabel} actionText={step.actionText} stepIndex={index} isActive={activeStep === index} divRef={el => stepRefs.current[index] = el} />
                  ))}
              </div>
          </div>
          <div className="hidden md:block w-1/2 h-screen sticky top-0 bg-page-bg z-10 border-l border-zinc-900 shadow-2xl">
             <VisualLayer activeStep={activeStep} />
          </div>
          <div className="md:hidden fixed inset-0 z-0 opacity-40 pointer-events-none">
             <VisualLayer activeStep={activeStep} />
          </div>
      </div>
    </div>
  );
};
