
import React, { useState, useEffect, useRef } from 'react';
import { ConceptExplainer as ConceptType } from '@/types';
// Fix: Added ShieldCheck to the imports from lucide-react to resolve errors on lines 131, 132, 133
import { ArrowLeft, X, ArrowRight, Layers, Sparkles, Network, Zap, Info, Save, Download, Cpu, Terminal, Share2, Database, Shield, Radar, Code, Gauge, AlertCircle, ShieldCheck } from 'lucide-react';
import { useInfraLens } from '@/context/InfraLensContext';

interface VisualEssaysProps {
  onBack: () => void;
  startAbout?: boolean;
}

const ConceptVisual: React.FC<{ conceptId: string; sectionIdx: number; progress?: number }> = ({ conceptId, sectionIdx }) => {
  const isActive = (idx: number) => sectionIdx === idx;
  
  if (conceptId === 'c-why-arista') {
    return (
      <div className="w-full h-full flex items-center justify-center relative bg-zinc-950 overflow-hidden">
          {/* 0. Unified Image */}
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 transform ${isActive(0) ? 'opacity-100 scale-100' : 'opacity-0 scale-150 blur-lg'}`}>
              <div className="relative w-80 h-80 flex items-center justify-center">
                  <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
                  <div className="w-40 h-40 bg-white rounded-full shadow-[0_0_80px_rgba(255,255,255,0.4)] flex items-center justify-center">
                      <Shield size={64} className="text-blue-600" />
                  </div>
                  <div className="absolute w-64 h-64 border border-blue-500/30 rounded-full animate-spin-slow"></div>
              </div>
          </div>
          {/* 1. SysDB */}
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 transform ${isActive(1) ? 'opacity-100 scale-100' : 'opacity-0 scale-90 blur-lg'}`}>
              <div className="relative w-96 h-96 flex items-center justify-center">
                  <div className="w-24 h-24 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-2xl relative z-20">
                      <Database size={40} className="text-white" />
                  </div>
                  {[0, 72, 144, 216, 288].map((angle, i) => (
                      <div key={i} className="absolute w-12 h-12 bg-zinc-900 border border-zinc-700 rounded-xl flex items-center justify-center"
                        style={{ transform: `rotate(${angle}deg) translateY(-140px) rotate(-${angle}deg)` }}>
                          <Zap size={20} className="text-indigo-400" />
                      </div>
                  ))}
              </div>
          </div>
          {/* 2. Open Programmability */}
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 transform ${isActive(2) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20 blur-xl'}`}>
              <div className="relative w-96 h-64 bg-zinc-900 border border-zinc-800 rounded-2xl p-8 flex flex-col shadow-2xl overflow-hidden group">
                  <div className="absolute inset-0 bg-blue-500/5 opacity-20 pointer-events-none"></div>
                  <div className="flex justify-between items-center mb-6">
                      <div className="flex gap-2">
                          <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                      </div>
                      <Code size={20} className="text-zinc-600" />
                  </div>
                  <div className="space-y-3 font-mono text-xs text-blue-400">
                      <div className="w-full h-3 bg-blue-500/10 rounded animate-pulse"></div>
                      <div className="w-3/4 h-3 bg-blue-500/10 rounded animate-pulse delay-75"></div>
                      <div className="w-5/6 h-3 bg-blue-500/10 rounded animate-pulse delay-150"></div>
                  </div>
                  <div className="mt-auto pt-6 border-t border-zinc-800 flex items-center gap-4">
                      <Terminal size={18} className="text-zinc-500" />
                      <span className="text-[10px] text-zinc-600 uppercase tracking-widest">EOS_SHELL_ACTIVE</span>
                  </div>
              </div>
          </div>
          {/* 3. Cognitive Telemetry */}
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 transform ${isActive(3) ? 'opacity-100 scale-100' : 'opacity-0 scale-50 blur-xl'}`}>
              <div className="relative w-80 h-80 rounded-full border border-zinc-800 flex items-center justify-center overflow-hidden bg-black/50">
                  <div className="absolute inset-0 border-2 border-dashed border-cyan-500/10 rounded-full animate-spin-slower"></div>
                  <div className="absolute inset-0 bg-[conic-gradient(from_0deg,rgba(34,211,238,0.2)_0deg,transparent_90deg)] animate-spin-slow"></div>
                  <div className="relative z-10 flex flex-col items-center">
                      <Radar size={48} className="text-cyan-400 mb-4 animate-pulse" />
                      <span className="text-[10px] font-mono text-cyan-500 uppercase tracking-[0.4em]">Real-time State</span>
                  </div>
                  {[...Array(8)].map((_, i) => (
                      <div key={i} className="absolute w-2 h-2 bg-cyan-500 rounded-full blur-[1px] animate-pulse" style={{ 
                        top: `${Math.random() * 80 + 10}%`, 
                        left: `${Math.random() * 80 + 10}%`,
                        animationDelay: `${i * 200}ms`
                      }}></div>
                  ))}
              </div>
          </div>
      </div>
    );
  }

  if (conceptId === 'c-leaf-spine') {
    return (
      <div className="w-full h-full flex items-center justify-center relative bg-zinc-950 overflow-hidden">
          {/* 0. ECMP Scaling */}
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 transform ${isActive(0) ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
              <div className="relative w-80 h-80">
                  <div className="absolute top-0 left-1/4 w-12 h-12 bg-zinc-800 rounded border border-zinc-700 flex items-center justify-center text-blue-400"><Cpu size={24}/></div>
                  <div className="absolute top-0 right-1/4 w-12 h-12 bg-zinc-800 rounded border border-zinc-700 flex items-center justify-center text-blue-400"><Cpu size={24}/></div>
                  {[0,1,2,3].map(i => (
                    <div key={i} className="absolute bottom-0 left-[i*25%] w-12 h-12 bg-zinc-900 border border-zinc-800 rounded"></div>
                  ))}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                    <line x1="25%" y1="15%" x2="0%" y2="85%" stroke="#3b82f6" strokeWidth="2" />
                    <line x1="25%" y1="15%" x2="25%" y2="85%" stroke="#3b82f6" strokeWidth="2" />
                    <line x1="75%" y1="15%" x2="50%" y2="85%" stroke="#3b82f6" strokeWidth="2" />
                    <line x1="75%" y1="15%" x2="75%" y2="85%" stroke="#3b82f6" strokeWidth="2" />
                  </svg>
              </div>
          </div>
          {/* 1. CLOS Architecture */}
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 transform ${isActive(1) ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-40 blur-lg'}`}>
              <div className="relative w-full h-full flex flex-col items-center justify-center gap-16">
                  <div className="flex gap-12">
                      {[1, 2, 3].map(i => <div key={i} className="w-16 h-8 bg-zinc-900 border border-zinc-700 rounded flex items-center justify-center text-[10px] text-zinc-500 font-mono">SPINE_{i}</div>)}
                  </div>
                  <div className="relative w-96 h-32">
                     <svg className="absolute inset-0 w-full h-full opacity-30">
                        <path d="M 120 0 L 0 100 M 120 0 L 120 100 M 120 0 L 240 100" stroke="white" strokeWidth="1" />
                        <path d="M 240 0 L 0 100 M 240 0 L 120 100 M 240 0 L 240 100" stroke="white" strokeWidth="1" />
                     </svg>
                  </div>
                  <div className="flex gap-8">
                      {[1, 2, 3, 4].map(i => <div key={i} className="w-12 h-6 bg-zinc-950 border border-blue-500/50 rounded flex items-center justify-center text-[8px] text-blue-400 font-mono">LEAF_{i}</div>)}
                  </div>
              </div>
          </div>
          {/* 2. L3 Boundary Isolation */}
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 transform ${isActive(2) ? 'opacity-100 scale-100' : 'opacity-0 scale-150 rotate-45'}`}>
              <div className="relative w-80 h-80">
                  <div className="absolute inset-0 border border-zinc-800 grid grid-cols-2 grid-rows-2">
                     <div className="border border-zinc-800 bg-zinc-900/50 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-rose-500/10 animate-pulse"></div>
                        <AlertCircle size={32} className="text-rose-500" />
                     </div>
                     <div className="border border-zinc-800 bg-emerald-500/5 flex items-center justify-center text-emerald-500 opacity-20"><ShieldCheck size={32} /></div>
                     <div className="border border-zinc-800 bg-emerald-500/5 flex items-center justify-center text-emerald-500 opacity-20"><ShieldCheck size={32} /></div>
                     <div className="border border-zinc-800 bg-emerald-500/5 flex items-center justify-center text-emerald-500 opacity-20"><ShieldCheck size={32} /></div>
                  </div>
                  <div className="absolute inset-0 border-4 border-blue-600 shadow-[0_0_50px_rgba(37,99,235,0.3)] pointer-events-none"></div>
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-blue-400 bg-zinc-950 px-2 uppercase tracking-widest">L3 Boundary</div>
              </div>
          </div>
          {/* 3. Predictive Performance */}
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 transform ${isActive(3) ? 'opacity-100 scale-100' : 'opacity-0 -translate-y-20 blur-xl'}`}>
              <div className="relative flex flex-col items-center">
                  <div className="relative w-64 h-64 flex items-center justify-center">
                      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                          <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                          <circle cx="50" cy="50" r="45" fill="none" stroke="url(#perf-grad)" strokeWidth="6" strokeDasharray="212" strokeDashoffset="42" className="animate-pulse" />
                          <defs>
                              <linearGradient id="perf-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" stopColor="#3b82f6" />
                                  <stop offset="100%" stopColor="#22d3ee" />
                              </linearGradient>
                          </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <Gauge size={40} className="text-white mb-2" />
                          <span className="text-2xl font-black font-mono tracking-tighter">99.9%</span>
                          <span className="text-[8px] font-mono text-zinc-500 uppercase">Load Balance</span>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    );
  }

  if (conceptId === 'c-polymathos') {
    return (
      <div className="w-full h-full flex items-center justify-center relative bg-zinc-950 overflow-hidden">
        {/* 0. Polymathic Mandate */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 transform ${isActive(0) ? 'opacity-100 scale-100' : 'opacity-0 scale-125 blur-lg'}`}>
          <div className="relative w-80 h-80">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/20 via-purple-500/15 to-emerald-500/20 blur-3xl"></div>
            {[0, 120, 240].map((angle, i) => (
              <div
                key={i}
                className="absolute w-24 h-24 rounded-full border border-blue-400/40 bg-blue-500/10 flex items-center justify-center text-sm font-semibold text-blue-100"
                style={{ transform: `rotate(${angle}deg) translateY(-110px) rotate(-${angle}deg)` }}
              >
                <Sparkles size={18} className="text-emerald-300" />
              </div>
            ))}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-28 h-28 rounded-full bg-white text-zinc-900 flex items-center justify-center font-serif font-bold shadow-[0_0_50px_rgba(59,130,246,0.3)]">
                Core
              </div>
            </div>
          </div>
        </div>

        {/* 1. Engineering Aesthetics */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 transform ${isActive(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16 blur-lg'}`}>
          <div className="relative w-96 h-64 rounded-2xl border border-border bg-card-bg overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.1),transparent_50%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.15),transparent_50%)]"></div>
            <div className="absolute inset-4 border border-border rounded-xl backdrop-blur-sm bg-black/40 flex flex-col justify-center px-6 gap-3">
              <div className="text-lg font-serif font-bold text-primary">Calm Technology</div>
              <p className="text-sm text-secondary leading-relaxed">Interfaces that respect attention: minimal noise, clear hierarchy, composed under load.</p>
              <div className="flex gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-secondary">
                <ShieldCheck size={14} className="text-emerald-400" /> Composed
                <Zap size={14} className="text-blue-400" /> Responsive
                <Info size={14} className="text-cyan-400" /> Legible
              </div>
            </div>
          </div>
        </div>

        {/* 2. Infinite Game */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 transform ${isActive(2) ? 'opacity-100 scale-100' : 'opacity-0 scale-75 blur-lg'}`}>
          <div className="relative w-96 h-96">
            <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 200 200">
              <path d="M20 100 C 60 20, 140 20, 180 100 S 140 180, 100 100 S 60 20, 20 100" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 6" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="px-6 py-3 rounded-full border border-emerald-400/50 bg-emerald-500/10 text-primary font-serif font-bold shadow-lg">Infinite Game</div>
            </div>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-secondary uppercase tracking-[0.3em]">Evolving with you</div>
          </div>
        </div>
      </div>
    );
  }

  return <div className="w-32 h-32 border-2 border-zinc-800 rounded-full animate-pulse"></div>;
};

export const VisualEssays: React.FC<VisualEssaysProps> = ({ onBack, startAbout = false }) => {
  const { concepts } = useInfraLens(); 
  const [selectedConcept, setSelectedConcept] = useState<ConceptType | null>(null);
  const [activeSection, setActiveSection] = useState(0);
  const [showAbout, setShowAbout] = useState(startAbout);

  useEffect(() => {
    if (!selectedConcept) return;
    const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => { if (entry.isIntersecting) setActiveSection(Number(entry.target.getAttribute('data-section-index'))); });
        }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });
    const sections = document.querySelectorAll('.essay-section');
    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, [selectedConcept]);

  if (showAbout) {
    return (
        <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col md:flex-row overflow-hidden">
          <aside className="w-full md:w-72 border-r border-zinc-800 bg-zinc-950 flex flex-col shrink-0">
             <div className="p-8 flex items-center gap-3">
                <button onClick={() => setShowAbout(false)} className="p-2 -ml-2 text-zinc-500 hover:text-white rounded-lg hover:bg-zinc-900 transition-colors"><ArrowLeft size={18} /></button>
                <div className="flex flex-col"><span className="font-serif font-bold text-lg">Essays</span><span className="text-[10px] font-mono text-zinc-600">Arista Field Spec</span></div>
             </div>
             <div className="p-6 border-t border-zinc-900 mt-auto"><button onClick={onBack} className="text-xs text-zinc-500 hover:text-white flex items-center gap-2 uppercase tracking-widest"><ArrowLeft size={12}/> System Home</button></div>
          </aside>
          <main className="flex-1 overflow-y-auto bg-[#09090b] p-8 md:p-20 relative">
            <div className="max-w-4xl mx-auto space-y-16 animate-fade-in pb-32">
                <header className="space-y-6">
                    <h1 className="text-6xl md:text-8xl font-serif font-bold tracking-tighter">Architecture Dives</h1>
                    <p className="text-2xl text-blue-400 font-light border-l-2 border-blue-500/30 pl-8">Visual deconstruction of networking first-principles.</p>
                </header>
            </div>
          </main>
        </div>
    );
  }

  if (!selectedConcept) {
    return (
      <div className="min-h-screen bg-page-bg text-white p-8 md:p-16 font-sans">
        <div className="max-w-7xl mx-auto">
          <header className="mb-20">
            <div className="flex items-center gap-6 mb-8">
                <button onClick={onBack} className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm font-medium"><ArrowLeft size={16} /> Back</button>
                <button onClick={() => setShowAbout(true)} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-blue-500 hover:text-blue-400 transition-colors"><Info size={14} /> About Essays</button>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tighter mb-4 text-white">Visual Essays</h1>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
            {concepts.filter(c => !c.hidden).map((concept) => (
              <div key={concept.id} onClick={() => setSelectedConcept(concept)} className="group relative bg-zinc-900 border border-zinc-800 rounded-3xl p-6 cursor-pointer hover:border-blue-500/30 transition-all">
                 {concept.id === 'c-polymathos' && (
                   <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-[0.3em] px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/40 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.25)]">
                     Featured
                   </span>
                 )}
                 <div className="mb-6 mt-4">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 mb-4 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                        {concept.id === 'c-why-arista' ? <Sparkles size={20} /> : <Share2 size={20} />}
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-white mb-2">{concept.title}</h2>
                    <p className="text-zinc-500 text-sm line-clamp-2">{concept.subtitle}</p>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page-bg text-white font-sans overflow-x-hidden">
        <nav className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50 pointer-events-none">
          <button onClick={() => setSelectedConcept(null)} className="w-10 h-10 rounded-full bg-zinc-900/80 border border-zinc-700 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all backdrop-blur-md pointer-events-auto"><X size={18} /></button>
          <span className="font-mono text-xs uppercase text-zinc-400 bg-black/50 backdrop-blur px-3 py-1 rounded-full border border-white/10">{selectedConcept.title}</span>
        </nav>
        <div className="relative">
          <div className="fixed inset-0 w-full h-screen z-0 flex items-center justify-center bg-zinc-950">
            <ConceptVisual conceptId={selectedConcept.id} sectionIdx={activeSection} />
          </div>
          <div className="relative z-10 w-full pt-[50vh] pb-[50vh]">
            {selectedConcept.sections.map((section, idx) => (
              <div key={idx} data-section-index={idx} className="essay-section min-h-screen flex items-center justify-center pointer-events-none">
                <div className="max-w-xl p-8 md:p-12 bg-zinc-950/80 backdrop-blur-xl border border-white/10 rounded-3xl pointer-events-auto transform transition-all duration-500">
                  <span className="font-mono text-xs text-blue-400 uppercase mb-6 block border-b border-blue-500/20 pb-4">PART 0{idx + 1}</span>
                  <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">{section.heading}</h2>
                  <p className="text-lg md:text-xl text-zinc-300 leading-relaxed font-light">{section.body}</p>
                </div>
              </div>
            ))}
            <div className="h-[50vh] flex flex-col items-center justify-center text-center p-8 relative z-20 pointer-events-auto">
                <button onClick={() => setSelectedConcept(null)} className="px-8 py-4 bg-white text-black rounded-full font-bold text-sm uppercase tracking-widest hover:bg-zinc-200 transition-all">Return to Gallery</button>
            </div>
          </div>
        </div>
    </div>
  );
};
