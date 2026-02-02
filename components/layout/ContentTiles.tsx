
import React from 'react';
import { GlobalConfig, SectionType } from '@/types';
import { Cpu, ArrowUpRight, Sparkles, BookOpen, BrainCircuit, Activity, Radio, Zap } from 'lucide-react';
import { useInfraLens } from '@/context/InfraLensContext';

interface TileProps {
  config: GlobalConfig['tiles'][keyof GlobalConfig['tiles']];
  onNavigate: () => void;
  className?: string;
}

const BaseTile: React.FC<{
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}> = ({ onClick, className, children }) => (
  <div 
    onClick={onClick}
    className={`
      bento-card relative overflow-hidden bg-card-bg rounded-3xl p-5 flex flex-col justify-between border border-border
      cursor-pointer hover:border-zinc-600 tilt-card
      ${className}
    `}
  >
    {children}
  </div>
);

export const ForgeTile: React.FC<TileProps> = ({ config, onNavigate, className }) => {
  const { apps } = useInfraLens();
  
  return (
    <BaseTile 
      onClick={onNavigate} 
      className={`group bg-zinc-900/50 hover:bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors p-0 ${className}`}
    >
      {/* Top Section: Navigation */}
      <div className="px-5 pt-5 pb-1 relative z-10">
         <div className="flex justify-between items-start mb-2">
            <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
               <Cpu size={16} />
            </div>
            <div className="flex flex-col items-end">
                <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">{apps.length} NODES</span>
                <ArrowUpRight size={16} className="text-zinc-600 group-hover:text-blue-400 transition-colors" />
            </div>
         </div>
         <h2 className="text-xl font-bold font-serif text-primary tracking-tight leading-none mb-1">{config.title}</h2>
         <p className="text-[11px] text-zinc-500 font-sans leading-tight line-clamp-2">
           {config.subtext}
         </p>
      </div>

      {/* Bottom Section: DOMINANT FEATURE CARD */}
      <div className="mt-auto p-3 relative z-20">
         <div className="flex items-center gap-1.5 mb-1.5 px-1 opacity-90">
            <Sparkles size={10} className="text-indigo-400 animate-pulse" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-300">Inference Spec</span>
         </div>

         <button
           onClick={(e) => {
             e.stopPropagation();
             window.open('https://aiworkloads-893054650384.europe-west1.run.app', '_blank');
           }}
           className="w-full text-left bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 rounded-xl p-4 border border-indigo-400/30 shadow-lg shadow-indigo-900/40 group/card hover:scale-[1.02] hover:shadow-indigo-500/50 transition-all duration-300 relative overflow-hidden"
         >
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-1">
                    <span className="font-serif font-bold text-primary text-base leading-none tracking-tight">AI Workloads</span>
                    <ArrowUpRight size={12} className="text-primary opacity-60" />
                </div>
                <div className="flex items-center gap-1.5 mt-2 bg-indigo-950/40 w-fit px-2 py-0.5 rounded border border-indigo-400/30 backdrop-blur-md">
                    <div className="flex h-1.5 w-1.5 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
                    </div>
                    <span className="text-[8px] font-mono font-bold text-indigo-100 uppercase tracking-wider">Live Deploy</span>
                </div>
            </div>
         </button>
      </div>
    </BaseTile>
  );
};

export const EpistemicTile: React.FC<{ onNavigate: () => void, className?: string }> = ({ onNavigate, className }) => (
  <BaseTile 
    onClick={onNavigate} 
    className={`bg-zinc-900 border-zinc-800 hover:border-emerald-500/30 group transition-all duration-500 ${className}`}
  >
     <div className="flex flex-col h-full justify-between relative z-10">
       <div className="flex justify-between items-start">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
             <Activity size={20} />
          </div>
          <div className="text-right">
             <div className="text-2xl font-mono font-bold text-emerald-400 leading-none">8.2</div>
             <div className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest mt-1">Signal Score</div>
          </div>
       </div>
       
       <div>
          <h2 className="text-xl font-bold font-serif text-primary tracking-tight mb-1">Epistemic Score</h2>
          <div className="flex items-center gap-2 mb-3">
             <div className="h-1 flex-1 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full w-[82%] bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
             </div>
             <span className="text-[9px] font-mono text-emerald-500 uppercase">Grounded</span>
          </div>
       </div>

       <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 group-hover:border-zinc-700 transition-colors flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
             <Radio size={12} />
          </div>
          <div className="flex-1 overflow-hidden">
             <p className="text-[10px] text-zinc-400 leading-tight font-medium truncate">Optimal Information Ratio</p>
             <p className="text-[8px] text-zinc-600 font-mono uppercase tracking-tighter">Diet: High Signal</p>
          </div>
       </div>
     </div>
  </BaseTile>
);

export const LibraryTile: React.FC<TileProps> = ({ config, onNavigate, className }) => {
  const { books } = useInfraLens();
  
  return (
    <BaseTile 
      onClick={onNavigate} 
      className={`bg-zinc-900/50 hover:bg-orange-900/5 border-zinc-800 hover:border-orange-500/30 group transition-colors ${className}`}
    >
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

       <div className="absolute top-5 right-5 flex flex-col items-end">
          <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mb-1">{books.length} VOLUMES</span>
          <ArrowUpRight size={18} className="text-zinc-600 group-hover:text-orange-400 transition-transform" />
       </div>
       
       <div className="flex flex-col h-full justify-between relative z-10">
         <div>
            <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center mb-3 text-orange-400 border border-orange-500/20 animate-float-delayed shadow-[0_0_15px_rgba(249,115,22,0.15)]">
                <BookOpen size={20} />
            </div>
            <h2 className="text-2xl font-bold font-serif text-primary mb-1 tracking-tight">{config.title}</h2>
            <p className="text-xs text-zinc-500 leading-snug group-hover:text-zinc-400 font-sans line-clamp-3">
              {config.subtext}
            </p>
         </div>
         
         <div className="flex gap-1 items-end h-12 opacity-50 group-hover:opacity-70 transition-opacity duration-500 mt-auto">
            <div className="w-2.5 h-full bg-orange-700 rounded-sm hover:-translate-y-2 transition-transform duration-300"></div>
            <div className="w-3.5 h-[120%] bg-orange-600 rounded-sm hover:-translate-y-3 transition-transform duration-300 delay-75"></div>
            <div className="w-2.5 h-[80%] bg-orange-800 rounded-sm hover:-translate-y-1 transition-transform duration-300 delay-100"></div>
            <div className="w-3.5 h-[110%] bg-orange-500 rounded-sm hover:-translate-y-2 transition-transform duration-300 delay-150"></div>
         </div>
       </div>
    </BaseTile>
  );
};

export const EssaysTile: React.FC<TileProps> = ({ config, onNavigate, className }) => (
  <BaseTile 
    onClick={onNavigate} 
    className={`bg-indigo-600 text-primary border-transparent group overflow-hidden ${className}`}
  >
     <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-700 opacity-80 animate-breathe"></div>

     <div className="flex flex-col h-full justify-between relative z-10">
        <div className="flex justify-between items-start">
            <BrainCircuit size={24} className="text-indigo-200 animate-pulse-slow" />
            <ArrowUpRight size={18} className="opacity-70 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </div>

        <div className="space-y-1 mt-auto">
          <h2 className="text-xl font-bold font-serif tracking-tight leading-tight">{config.title}</h2>
          <p className="text-indigo-200 text-[11px] font-sans leading-snug">
            {config.subtext}
          </p>
        </div>
     </div>
  </BaseTile>
);
