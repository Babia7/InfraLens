
import React from 'react';
import { GlobalConfig } from '@/types';
import { Component, ArrowUpRight, Lightbulb, Fingerprint } from 'lucide-react';

interface TileProps {
  config: GlobalConfig['tiles'][keyof GlobalConfig['tiles']];
  onNavigate: () => void;
  className?: string;
}

const BaseSystemTile: React.FC<{
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}> = ({ onClick, className, children }) => (
  <div 
    onClick={onClick}
    className={`
      bento-card relative overflow-hidden bg-card-bg rounded-3xl p-6 flex flex-col justify-between border border-border
      cursor-pointer hover:border-zinc-600 tilt-card
      ${className}
    `}
  >
    {children}
  </div>
);

export const AboutTile: React.FC<TileProps> = ({ config, onNavigate, className }) => (
  <BaseSystemTile
    onClick={onNavigate}
    className={`bg-zinc-950 border-zinc-800 hover:border-zinc-600 group relative overflow-hidden ${className}`}
  >
       <div className="absolute inset-0 bg-zinc-900/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
       <div className="flex flex-col h-full justify-between relative z-10">
          <div className="flex justify-between items-start">
             <div className="flex items-center gap-2 text-zinc-500 group-hover:text-zinc-300 transition-colors">
                <Component size={16} />
                <span className="text-[10px] font-mono uppercase tracking-widest">{config.subtext}</span>
             </div>
             <ArrowUpRight size={14} className="text-zinc-700 group-hover:text-zinc-500 transition-colors" />
          </div>
          
          <div className="space-y-2">
              <h2 className="text-lg font-mono font-bold text-zinc-400 group-hover:text-white transition-colors tracking-tight">
                 {config.title}
              </h2>
              <div className="h-0.5 w-8 bg-zinc-800 group-hover:bg-zinc-600 transition-colors"></div>
          </div>
       </div>
  </BaseSystemTile>
);

export const RoadmapTile: React.FC<TileProps> = ({ config, onNavigate, className }) => (
  <BaseSystemTile 
    onClick={onNavigate}
    className={`bg-zinc-950 border-zinc-800 hover:border-zinc-600 group relative overflow-hidden ${className}`}
  >
      <div className="absolute inset-0 bg-zinc-900/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="flex flex-col h-full justify-between relative z-10">
          <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-zinc-500 group-hover:text-yellow-400 transition-colors">
                  <Lightbulb size={16} />
                  <span className="text-[10px] font-mono uppercase tracking-widest">{config.subtext}</span>
              </div>
          </div>
          
          <div>
             <h2 className="text-lg font-mono font-bold text-zinc-400 group-hover:text-white transition-colors tracking-tight mb-3">
                {config.title}
             </h2>
             
             <div className="space-y-1.5 font-mono text-[10px] text-zinc-600">
                <div className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
                    <span className="text-zinc-500 group-hover:text-zinc-400">Anti-Library</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse"></div>
                    <span className="text-zinc-500 group-hover:text-zinc-400">Deep Time</span>
                </div>
             </div>
          </div>
      </div>
  </BaseSystemTile>
);

export const HumanOSTile: React.FC<TileProps> = ({ config, onNavigate, className }) => (
  <BaseSystemTile 
    onClick={onNavigate}
    className={`bg-zinc-950 border-zinc-800 hover:border-zinc-700 group cursor-pointer ${className}`}
  >
     <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiMwMDAiLz48cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSIjMzMzIi8+PC9zdmc+')] opacity-20 pointer-events-none"></div>
     
     <div className="flex flex-col md:flex-row h-full items-center justify-between relative z-10 px-4 md:px-8 py-2 gap-6">
        <div className="flex items-center gap-6">
           <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-white transition-colors">
               <Fingerprint size={32} />
           </div>
           <div>
               <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-500 border border-emerald-900/30 px-2 py-0.5 rounded-full bg-emerald-900/10">Active</span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-yellow-500 border border-yellow-900/30 px-2 py-0.5 rounded-full bg-yellow-900/10 flex items-center gap-1">
                      <Lightbulb size={10} /> Ideas
                  </span>
               </div>
               <h2 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-tight">
                  {config.title}
               </h2>
           </div>
        </div>

        <div className="flex-1 max-w-2xl text-center md:text-left">
            <p className="text-lg md:text-xl font-serif text-zinc-300 leading-snug">
               {config.subtext}
            </p>
        </div>

        <div className="text-right hidden md:block">
            <span className="block text-xs font-mono text-zinc-500 uppercase tracking-widest mb-1">{config.label || 'Microsite'}</span>
            <span className="text-sm text-zinc-400">{config.category || 'Think Different'}</span>
        </div>
     </div>
  </BaseSystemTile>
);
