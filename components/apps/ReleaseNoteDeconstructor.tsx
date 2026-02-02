
import React, { useState } from 'react';
import { ArrowLeft, FileText, Sparkles, Target, Briefcase, Terminal, Share2, Clipboard, CheckCircle2 } from 'lucide-react';
import { DeconstructionResult, DeconstructedFeature } from '@/types';
import { releaseNotesSeed } from '@/data/releaseNotesSeed';

interface ReleaseNoteDeconstructorProps {
  onBack: () => void;
}

const FeatureDossier: React.FC<{ feature: DeconstructedFeature }> = ({ feature }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = `Feature: ${feature.name}\nVertical: ${feature.vertical}\nTalk Track: ${feature.businessValue}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] overflow-hidden shadow-2xl group hover:border-sky-500/50 transition-all duration-500">
      <div className="p-8 space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
             <span className="text-[10px] font-mono text-sky-400 uppercase tracking-[0.3em] px-2 py-0.5 rounded bg-sky-900/10 border border-sky-500/20">
               {feature.vertical}
             </span>
             <h3 className="text-2xl font-serif font-bold text-white tracking-tight">{feature.name}</h3>
          </div>
          <button onClick={handleCopy} className="p-3 bg-zinc-950 border border-zinc-800 rounded-2xl text-zinc-500 hover:text-white transition-all group-hover:border-sky-500/30">
            {copied ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Clipboard size={18} />}
          </button>
        </div>

        <section className="space-y-3">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
            <Terminal size={12} /> Technical Substrate
          </h4>
          <p className="text-sm text-zinc-400 leading-relaxed font-light">
            {feature.technicalSummary}
          </p>
        </section>

        <section className="p-6 bg-sky-950/10 border border-sky-500/20 rounded-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-5"><Briefcase size={64} className="text-sky-400"/></div>
           <h4 className="text-[10px] font-bold uppercase tracking-widest text-sky-400 mb-3 flex items-center gap-2">
            <Target size={14} /> Value Talk Track
          </h4>
          <p className="text-lg text-white font-medium italic leading-relaxed">
            "{feature.businessValue}"
          </p>
        </section>
      </div>
      <footer className="px-8 py-4 bg-zinc-950/50 border-t border-zinc-800 flex justify-between items-center text-[8px] font-mono text-zinc-600 uppercase tracking-widest">
         <span>Extraction complete</span>
         <span>Reliability: Grounded</span>
      </footer>
    </div>
  );
};

export const ReleaseNoteDeconstructor: React.FC<ReleaseNoteDeconstructorProps> = ({ onBack }) => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<DeconstructionResult | null>(releaseNotesSeed);
  const aiDisabled = true;

  const handleDeconstruct = async () => {
    if (!input.trim()) return;
    if (aiDisabled) return;
  };

  const clear = () => {
    setInput('');
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col overflow-hidden selection:bg-sky-500/30">
      
      {/* HEADER */}
      <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-8 bg-zinc-950 shrink-0 z-50">
        <div className="flex items-center gap-6">
            <button onClick={onBack} className="group p-2 text-zinc-500 hover:text-white transition-colors">
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <div className="h-4 w-px bg-zinc-800"></div>
            <div className="flex items-center gap-3">
                <div className="p-2 bg-sky-500/10 border border-sky-500/20 rounded-lg text-sky-400">
                    <FileText size={20} />
                </div>
                <div>
                    <h1 className="text-sm font-bold uppercase tracking-wider">Release Note Deconstructor</h1>
                    <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Firmware Intelligence v2.0</span>
                </div>
            </div>
        </div>
        <div className="flex items-center gap-4">
           <div className="bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">Parser Ready</span>
           </div>
        </div>
      </header>

      {/* WORKSPACE */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* LEFT: INPUT */}
        <section className="w-full md:w-[450px] lg:w-[500px] bg-zinc-950 border-r border-zinc-900 flex flex-col shrink-0 relative overflow-y-auto">
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
           
           <div className="p-8 md:p-12 relative z-10 space-y-8 flex flex-col h-full">
              <header className="space-y-4">
                 <h2 className="text-4xl font-serif font-bold text-white tracking-tighter">Raw Ingestion</h2>
                 <p className="text-sm text-zinc-500 leading-relaxed">Paste the raw text from an EOS Release Note PDF. The kernel will strip technical noise and extract strategic value.</p>
              </header>

              <div className="flex-1 relative group">
                 <textarea 
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Paste release notes here (e.g. 'EOS-4.32.1F-ReleaseNotes.pdf content')..."
                    className="w-full h-full bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-sm font-mono text-zinc-300 resize-none focus:border-sky-500 outline-none transition-all placeholder-zinc-700 shadow-inner"
                 />
                 <div className="absolute top-4 right-4 flex gap-2">
                   {input && (
                      <button onClick={clear} className="text-[10px] font-bold uppercase text-zinc-500 hover:text-white bg-zinc-800 px-2 py-1 rounded transition-colors">
                         Clear
                      </button>
                   )}
                   {!input && (
                      <button onClick={() => setResult(releaseNotesSeed)} className="text-[10px] font-bold uppercase text-sky-400 hover:text-white bg-sky-900/40 border border-sky-500/30 px-2 py-1 rounded transition-colors">
                        Load Sample
                      </button>
                   )}
                 </div>
              </div>

              <button 
                 onClick={handleDeconstruct}
                 disabled={aiDisabled || !input.trim()}
                 className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 hover:bg-sky-100 transition-all shadow-2xl shadow-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                 <Sparkles size={18} />
                 {aiDisabled ? 'AI Disabled' : 'Deconstruct'}
              </button>
           </div>
        </section>

        {/* RIGHT: OUTPUT */}
        <section className="flex-1 overflow-y-auto bg-black p-8 md:p-16 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.05)_0%,transparent_70%)] pointer-events-none"></div>
            
            <div className="max-w-4xl mx-auto space-y-12 animate-fade-in relative z-10">
               {!result ? (
                  <div className="h-[60vh] flex flex-col items-center justify-center text-center opacity-20">
                     <div className="w-24 h-24 border-2 border-dashed border-zinc-800 rounded-full flex items-center justify-center animate-spin-slower mb-12">
                        <Share2 size={40} className="text-zinc-600" />
                     </div>
                     <h3 className="text-3xl font-serif italic text-zinc-500">Awaiting raw data stream...</h3>
                  </div>
               ) : result && (
                  <div className="space-y-12 pb-20">
                     <header className="flex items-center justify-between pb-8 border-b border-zinc-900">
                        <div className="space-y-2">
                           <span className="text-[10px] font-mono text-sky-500 uppercase tracking-widest">Target Firmware</span>
                           <h2 className="text-5xl font-serif font-bold text-white tracking-tighter">{result.version}</h2>
                        </div>
                        <div className="text-right hidden md:block">
                           <span className="block text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-1">Extraction Yield</span>
                           <span className="text-xl font-bold text-white">{result.features.length} Strategic Items</span>
                        </div>
                     </header>

                     <div className="grid grid-cols-1 gap-8">
                        {result.features.map((feature, i) => (
                           <FeatureDossier key={i} feature={feature} />
                        ))}
                     </div>
                  </div>
               )}
            </div>
        </section>
      </main>

      {/* SYSTEM HUD */}
      <footer className="h-10 bg-zinc-950 border-t border-zinc-900 px-8 flex items-center justify-between text-[8px] font-mono text-zinc-600 uppercase tracking-[0.4em] shrink-0 z-20">
         <div className="flex items-center gap-4">
            <span>Semantic Extraction Core</span>
            <span className="w-1 h-1 bg-zinc-800 rounded-full"></span>
            <span className="text-sky-900">Module: PARSER-REL-04</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span>Kernel Stability: Optimal</span>
         </div>
      </footer>

    </div>
  );
};
