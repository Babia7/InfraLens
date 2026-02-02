
import React, { useState, useMemo } from 'react';
import { ArrowLeft, Cpu, Layers, Search, Check, ChevronRight, Filter, X, Box, Target, Gauge, ExternalLink, Activity } from 'lucide-react';
import type { SwitchSpec } from '@/types';
import { indexData } from '@data/switches.index';

interface SwitchSelector7050Props {
  onBack: () => void;
}

const MODELS: SwitchSpec[] = indexData.filter((s) => s.series.startsWith('7050'));

export const SwitchSelector7050: React.FC<SwitchSelector7050Props> = ({ onBack }) => {
  const [search, setSearch] = useState('');
  const [filterSpeed, setFilterSpeed] = useState<string | null>(null);

  const filteredModels = useMemo(() => {
    return MODELS.filter(m => {
      const haystack = `${m.model} ${m.description}`.toLowerCase();
      const matchesSearch = haystack.includes(search.toLowerCase());
      const speeds = Object.keys(m.maxPortsBySpeedGbps ?? {});
      const matchesSpeed = filterSpeed ? speeds.includes(filterSpeed) : true;
      return matchesSearch && matchesSpeed;
    });
  }, [search, filterSpeed]);

  const allSpeeds = Array.from(new Set(MODELS.flatMap(m => Object.keys(m.maxPortsBySpeedGbps ?? {})))).sort((a, b) => {
    const getVal = (s: string) => parseInt(s.replace('G', ''));
    return getVal(b) - getVal(a);
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col md:flex-row overflow-hidden selection:bg-blue-500/30">
      
      {/* SIDEBAR: FILTERS */}
      <aside className="w-full md:w-80 border-b md:border-b-0 md:border-r border-zinc-800 bg-zinc-950 flex flex-col shrink-0 z-30 overflow-y-auto h-[40vh] md:h-screen">
         <div className="p-8 border-b border-zinc-900">
            <button onClick={onBack} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mb-6">
                <ArrowLeft size={14} /> Systems Return
            </button>
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                    <Layers size={24} />
                </div>
                <div>
                    <h1 className="text-xl font-serif font-bold tracking-tight">7050 Selector</h1>
                    <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mt-0.5">X3/X4 Universal Matrix</div>
                </div>
            </div>
         </div>

         <div className="p-8 space-y-8 flex-1">
            <section className="space-y-4">
                <h3 className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.3em]">Search Spec</h3>
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors" size={14} />
                    <input 
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="SKU, Use Case, Interface..."
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-9 pr-4 text-xs focus:border-blue-500 outline-none transition-all placeholder-zinc-700"
                    />
                </div>
            </section>

            <section className="space-y-4">
                <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">Max Port Speed</h3>
                <div className="grid grid-cols-2 gap-2">
                    {allSpeeds.map(speed => (
                        <button 
                            key={speed}
                            onClick={() => setFilterSpeed(filterSpeed === speed ? null : speed)}
                            className={`p-2 rounded-xl border text-[10px] font-bold transition-all text-center flex items-center justify-center gap-2 ${filterSpeed === speed ? 'bg-blue-500/10 border-blue-500 text-blue-400' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
                        >
                            <Gauge size={12} /> {speed}G
                            {filterSpeed === speed && <Check size={10} />}
                        </button>
                    ))}
                </div>
            </section>

            {(search || filterSpeed) && (
                <button 
                    onClick={() => { setSearch(''); setFilterSpeed(null); }}
                    className="w-full py-2 text-[10px] font-bold uppercase text-zinc-600 hover:text-white flex items-center justify-center gap-2 transition-colors border border-dashed border-zinc-800 rounded-xl"
                >
                    <X size={12} /> Reset Filter
                </button>
            )}
        </div>
     </aside>

      {/* MAIN VIEW: RESULTS */}
      <main className="flex-1 overflow-y-auto bg-[#09090b] relative flex flex-col">
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>

         <div className="flex-1 p-8 md:p-16 relative z-10 max-w-7xl mx-auto w-full">
            <header className="mb-12 border-b border-zinc-900 pb-12">
                <div className="flex items-center gap-3 mb-6">
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-[10px] font-mono text-blue-400 uppercase tracking-widest">Platform Discovery</span>
                    <div className="h-px w-20 bg-zinc-800"></div>
                </div>
                <h2 className="text-5xl md:text-7xl font-serif font-bold tracking-tighter mb-6 text-white leading-none">Universal Leaf</h2>
                <p className="text-xl text-zinc-500 font-light max-w-3xl leading-relaxed">
                    Arista 7050X series switches are the industry leading enterprise data center leaf platforms. Optimized for 10G/25G and 100G/400G deployments, they offer high density, low latency, and advanced feature support via Trident ASICs.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {filteredModels.length > 0 ? filteredModels.map((model) => {
                  const speeds = Object.keys(model.maxPortsBySpeedGbps ?? {});
                  const portSummary = model.interfaces?.map((i) => `${i.physicalPorts}x ${i.speedGbps}G ${i.formFactor}`).join(' + ');
                  return (
                    <div key={model.id} className="group p-8 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] hover:border-blue-500/50 transition-all flex flex-col shadow-2xl relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <span className="text-[10px] font-mono uppercase tracking-[0.4em] mb-2 block text-blue-500">
                                    Arista {model.series} Series
                                </span>
                                <h3 className="text-4xl font-serif font-bold text-white leading-tight mb-2 tracking-tight group-hover:text-blue-400 transition-colors">{model.model}</h3>
                                <div className="flex flex-wrap items-center gap-3">
                                    <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-black border border-zinc-800">
                                        <Box size={12} className="text-zinc-500" />
                                        <span className="text-[10px] font-bold text-zinc-400">{model.size}</span>
                                    </div>
                                    <div className="flex gap-1">
                                        {speeds.map(s => (
                                            <span key={s} className="px-1.5 py-0.5 rounded bg-zinc-800 text-[8px] font-mono text-zinc-500 uppercase">{s}G</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-[1.5rem] group-hover:scale-110 transition-transform shadow-inner text-blue-400">
                                <Cpu size={24} />
                            </div>
                        </div>

                        <div className="mb-8 p-4 bg-zinc-950/50 border border-zinc-800/50 rounded-2xl">
                           <div className="flex items-center gap-2 text-[8px] font-black text-blue-500 uppercase tracking-widest mb-2">
                               <Target size={10} /> Strategic Role
                           </div>
                           <p className="text-sm font-medium text-zinc-300 leading-relaxed italic">
                               "{model.description}"
                           </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="p-5 bg-zinc-950/30 rounded-3xl border border-zinc-800 group-hover:border-zinc-700 transition-colors">
                                <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest block mb-2">Throughput</span>
                                <span className="text-lg font-bold text-zinc-200">{model.throughputTbps} Tbps</span>
                            </div>
                            <div className="p-5 bg-zinc-950/30 rounded-3xl border border-zinc-800 group-hover:border-zinc-700 transition-colors">
                                <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest block mb-2">Trident Buffer</span>
                                <span className="text-lg font-bold text-blue-400">{model.buffer}</span>
                            </div>
                            <div className="p-5 bg-zinc-950/30 rounded-3xl border border-zinc-800 group-hover:border-zinc-700 transition-colors">
                                <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest block mb-2">Power (Typ)</span>
                                <span className="text-sm font-bold text-zinc-200">{model.powerDraw}</span>
                            </div>
                        </div>

                        <div className="mt-auto pt-6 border-t border-zinc-800 flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-600">
                                    <Layers size={14} />
                                </div>
                                <span className="text-[11px] font-mono text-zinc-500 leading-tight">
                                    {portSummary}
                                </span>
                            </div>
                            <div className="flex gap-2">
                              {model.datasheetUrl && (
                                <button
                                  onClick={() => window.open(model.datasheetUrl!, '_blank')}
                                  className="flex-1 py-3 bg-zinc-950 hover:bg-white hover:text-black border border-zinc-800 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
                                >
                                  Datasheet <ExternalLink size={12} />
                                </button>
                              )}
                              <button className="flex-1 py-3 bg-zinc-950 hover:bg-white hover:text-black border border-zinc-800 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2">
                                View Technical Specs <ChevronRight size={12} />
                              </button>
                            </div>
                        </div>
                    </div>
                  );
                }) : (
                    <div className="col-span-full py-32 flex flex-col items-center justify-center text-center space-y-6 opacity-30">
                        <div className="w-32 h-32 border border-dashed border-zinc-800 rounded-full flex items-center justify-center animate-spin-slow">
                            <Filter size={48} className="text-zinc-600" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-serif italic text-white">No models found for this spec.</h3>
                            <p className="text-sm text-zinc-500">Adjust your ASIC generation or interface requirements.</p>
                        </div>
                    </div>
                )}
            </div>
         </div>

         {/* FOOTER STATS */}
         <div className="h-12 bg-zinc-950 border-t border-zinc-900 px-8 flex items-center justify-between text-[8px] font-mono text-zinc-600 uppercase tracking-[0.4em] shrink-0 z-20">
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-900 rounded-full"></span>
                  <span>Universal Series Matrix</span>
               </div>
               <span className="w-px h-3 bg-zinc-800"></span>
               <div className="flex items-center gap-2">
                  <Activity size={10} className="text-blue-900" />
                  <span>Field Validated Designs</span>
               </div>
            </div>
            <div>
               Arista Core Kernel: Stable
            </div>
         </div>
      </main>

    </div>
  );
};
