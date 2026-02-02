
import React from 'react';
import { LayoutGrid, Disc, Instagram, Maximize2, Minimize2, Activity, Zap, Cpu } from 'lucide-react';
import { GlobalConfig } from '@/types';

interface HeroTileProps {
  config: GlobalConfig;
  isExpanded: boolean;
  onShrink: () => void;
  className?: string;
}

export const HeroTile: React.FC<HeroTileProps> = ({ config, isExpanded, onShrink, className }) => {
  return (
    <div 
      className={`
        bento-card relative overflow-hidden bg-card-bg rounded-3xl p-6 flex flex-col justify-between border border-border
        bg-gradient-to-br from-blue-950 to-black border-zinc-800 z-10 cursor-pointer group
        ${className}
      `}
      onClick={onShrink}
    >
       {/* Ambient Breathing Background */}
       <div className={`absolute w-96 h-96 bg-blue-900/20 rounded-full blur-3xl animate-breathe pointer-events-none transition-all duration-700 ${isExpanded ? '-top-20 -left-20' : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'}`}></div>
       
       <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none transition-opacity duration-500">
          <div className="relative w-[120px] h-[120px] flex items-center justify-center">
             <Cpu size={80} className="text-blue-500 animate-pulse-slow" />
          </div>
       </div>

       <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-40 transition-opacity">
          {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
       </div>
       
       <div className="flex flex-col h-full justify-between relative z-10">
         <div className="flex items-center justify-between">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center backdrop-blur-md border border-blue-500/20 shadow-inner">
               <Cpu size={20} className="text-blue-400" />
             </div>
             <span className="font-mono text-xs font-medium tracking-wider text-blue-500/70 transition-opacity uppercase">{config.hero.version} // FIELD_READY</span>
           </div>

           {isExpanded && (
             <div className="hidden lg:flex items-center gap-4 bg-zinc-950/40 border border-zinc-800/50 rounded-full px-4 py-1.5 animate-fade-in">
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                   <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-tighter">EOS Core: Online</span>
                </div>
                <div className="w-px h-3 bg-zinc-800"></div>
                <div className="flex items-center gap-2">
                   <Activity size={12} className="text-blue-500" />
                   <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-tighter">Telemetry: Ingestion Active</span>
                </div>
             </div>
           )}
         </div>
         
         <div className={`space-y-4 max-w-2xl transition-all duration-500 ${isExpanded ? 'translate-y-0' : '-translate-y-2'}`}>
            <h1 
              className="font-bold font-serif tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-blue-400 drop-shadow-sm leading-[0.9] transition-all duration-500"
              style={{ fontSize: isExpanded ? 'clamp(2.5rem, 5vw, 4.5rem)' : '2.2rem' }}
            >
              {config.hero.titlePrefix}<span className="text-blue-600 italic">{config.hero.titleSuffix}</span>
            </h1>
            
            {isExpanded && (
              <p className="text-zinc-400 text-lg leading-relaxed max-w-lg font-sans animate-fade-in">
                {config.hero.subtitle}
              </p>
            )}
         </div>

         {isExpanded && (
           <div className="flex justify-end items-end animate-fade-in">
              <div className="text-right">
                 <span className="block text-[8px] font-mono uppercase text-zinc-600 tracking-[0.4em] mb-1">Architecture State</span>
                 <span className="text-xs font-bold text-blue-500 uppercase">Resilient & Programmable</span>
              </div>
           </div>
         )}
         
         {!isExpanded && (
           <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-blue-600 group-hover:text-blue-400 transition-colors">
              Operational Core Active
           </div>
         )}
       </div>
    </div>
  );
};
