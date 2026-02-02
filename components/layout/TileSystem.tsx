
import React from 'react';
import { GlobalConfig, AppItem, BookItem } from '@/types';
import { 
  Cpu, ArrowUpRight, BookOpen, BrainCircuit, Activity, 
  Radio, Zap, Component, Lightbulb, Fingerprint, LucideIcon, Wind,
  Presentation, Mic2, Tv, Radar, Satellite, Cloud, ExternalLink, Globe, Link2, Book, ShieldCheck, Network, Terminal, TrendingUp
} from 'lucide-react';
import { useInfraLens } from '@/context/InfraLensContext';

interface TileProps {
  onNavigate: () => void;
  className?: string;
}

interface ConfigTileProps extends TileProps {
  config: GlobalConfig['tiles'][keyof GlobalConfig['tiles']];
}

const BaseTile: React.FC<{
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}> = ({ onClick, className, children }) => (
  <div 
    onClick={onClick}
    className={`
      bento-card relative overflow-hidden rounded-3xl border border-border text-primary
      cursor-pointer tilt-card transition-all duration-300
      ${className}
    `}
  >
    {children}
  </div>
);

export const ForgeTile: React.FC<ConfigTileProps> = ({ config, onNavigate, className }) => {
  const { apps } = useInfraLens();
  
  return (
    <BaseTile 
      onClick={onNavigate} 
      className={`group bg-zinc-900/50 hover:bg-zinc-900 hover:border-blue-500/30 p-0 ${className}`}
    >
      <div className="px-5 pt-5 pb-1 relative z-10">
         <div className="flex justify-between items-start mb-2">
            <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
               <Cpu size={16} />
            </div>
            <div className="flex flex-col items-end">
                <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">{apps.length} ASSETS</span>
                <ArrowUpRight size={16} className="text-zinc-600 group-hover:text-blue-400 transition-colors" />
            </div>
         </div>
         <h2 className="text-xl font-bold font-serif text-primary tracking-tight leading-none mb-1">{config.title}</h2>
         <p className="text-[11px] text-secondary font-sans leading-tight line-clamp-2">{config.subtext}</p>
      </div>

      <div className="mt-auto p-3 relative z-20">
         <div className="flex items-center gap-1.5 mb-1.5 px-1 opacity-90">
            <span className="text-[9px] font-bold uppercase tracking-widest text-blue-300">Live Simulation</span>
         </div>

         <button
           onClick={(e) => { e.stopPropagation(); window.open('https://aiworkloads-893054650384.europe-west1.run.app', '_blank'); }}
           className="w-full text-left bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-xl p-4 border border-blue-400/30 shadow-lg shadow-blue-900/40 group/card hover:scale-[1.02] transition-all duration-300 relative overflow-hidden"
         >
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-1">
                    <span className="font-serif font-bold text-primary text-base leading-none tracking-tight">Cloud-Grade AI</span>
                    <ArrowUpRight size={12} className="text-primary opacity-60" />
                </div>
                <div className="flex items-center gap-1.5 mt-2 bg-blue-950/40 w-fit px-2 py-0.5 rounded border border-blue-400/30 backdrop-blur-md">
                    <div className="flex h-1.5 w-1.5 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
                    </div>
                    <span className="text-[8px] font-mono font-bold text-blue-100 uppercase tracking-wider">Operational</span>
                </div>
            </div>
         </button>
      </div>
    </BaseTile>
  );
};

export const DemoCommandTile: React.FC<ConfigTileProps> = ({ config, onNavigate, className }) => (
  <BaseTile 
    onClick={onNavigate} 
    className={`bg-card-bg border-border hover:border-emerald-500/50 group transition-all duration-500 ${className} p-6`}
  >
     <div className="flex flex-col h-full justify-between relative z-10">
        <div className="flex justify-between items-start">
           <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)] group-hover:rotate-12 transition-transform">
              <Radar size={24} />
           </div>
           <div className="text-right">
              <div className="text-[9px] font-mono text-secondary uppercase tracking-widest mb-1">Environment Lock</div>
              <div className="flex items-center gap-2 justify-end">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-tighter">Live Playbook</span>
                <ArrowUpRight size={14} className="text-zinc-700 group-hover:text-emerald-400 transition-colors" />
              </div>
           </div>
        </div>

        <div>
           <h2 className="text-2xl font-bold font-serif text-primary tracking-tight mb-2">{config.title}</h2>
           <div className="flex gap-2 mb-4">
              <span className="px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-[8px] font-mono text-emerald-500 uppercase">CVX</span>
              <span className="px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-[8px] font-mono text-cyan-500 uppercase">CV-CUE</span>
           </div>
           <p className="text-xs text-secondary leading-snug line-clamp-1">{config.subtext}</p>
        </div>

        <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
           <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-mono text-secondary">Ready for Uplink</span>
           </div>
           <Satellite size={12} className="text-zinc-700 group-hover:text-emerald-500" />
        </div>
     </div>
  </BaseTile>
);

export const BriefingTile: React.FC<ConfigTileProps> = ({ config, onNavigate, className }) => (
  <BaseTile 
    onClick={onNavigate} 
    className={`bg-card-bg border-border hover:border-violet-500/50 group transition-all duration-500 ${className} p-6`}
  >
     <div className="flex flex-col h-full justify-between relative z-10">
        <div className="flex justify-between items-start">
           <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shadow-[0_0_20px_rgba(139,92,246,0.15)] group-hover:scale-110 transition-transform">
              <Tv size={24} />
           </div>
           <div className="text-right">
              <div className="text-[9px] font-mono text-secondary uppercase tracking-widest mb-1">Ready Mode</div>
              <div className="flex items-center gap-2 justify-end">
                <span className="text-xs font-bold text-violet-400 uppercase tracking-tighter">Cinematic Engine</span>
                <ArrowUpRight size={14} className="text-zinc-700 group-hover:text-violet-400 transition-colors" />
              </div>
           </div>
        </div>

        <div>
           <h2 className="text-2xl font-bold font-serif text-primary tracking-tight mb-2">{config.title}</h2>
           <p className="text-xs text-secondary leading-snug max-w-[200px]">{config.subtext}</p>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-zinc-800">
           <div className="flex -space-x-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-6 h-6 rounded-full border border-zinc-950 bg-zinc-800 flex items-center justify-center">
                   <Mic2 size={10} className="text-zinc-500" />
                </div>
              ))}
           </div>
           <span className="text-[10px] font-mono text-secondary">Live Synthesis Enabled</span>
        </div>
     </div>
  </BaseTile>
);

export const SalesPlaybookTile: React.FC<ConfigTileProps> = ({ config, onNavigate, className }) => (
  <BaseTile 
    onClick={onNavigate} 
    className={`bg-card-bg border-border hover:border-emerald-500/50 group transition-all duration-500 ${className} p-6`}
  >
     <div className="flex flex-col h-full justify-between relative z-10">
        <div className="flex justify-between items-start">
           <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)] group-hover:scale-110 transition-transform">
              <TrendingUp size={24} />
           </div>
           <div className="text-right">
              <span className="block text-[8px] font-mono text-secondary uppercase tracking-widest mb-1">{config.category}</span>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-tighter">Sales Enablement</span>
           </div>
        </div>

        <div>
           <h2 className="text-2xl font-bold font-serif text-primary tracking-tight mb-2">{config.title}</h2>
           <p className="text-xs text-secondary leading-snug line-clamp-2">{config.subtext}</p>
        </div>

        <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
           <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-mono text-secondary">Objection Kits Ready</span>
           </div>
           <ArrowUpRight size={14} className="text-zinc-700 group-hover:text-emerald-500 transition-all" />
        </div>
     </div>
  </BaseTile>
);

export const LibraryTile: React.FC<ConfigTileProps> = ({ config, onNavigate, className }) => {
  const { books } = useInfraLens();
  return (
    <BaseTile onClick={onNavigate} className={`bg-card-bg/70 hover:bg-indigo-50/40 hover:border-indigo-500/30 group ${className}`}>
       <div className="absolute top-5 right-5 flex flex-col items-end">
          <span className="text-[9px] font-mono text-secondary uppercase tracking-widest mb-1">{books.length} GUIDES</span>
          <ArrowUpRight size={18} className="text-secondary group-hover:text-indigo-400 transition-transform" />
       </div>
       <div className="flex flex-col h-full justify-between relative z-10 p-5">
         <div>
            <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-3 text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
                <BookOpen size={20} />
            </div>
            <h2 className="text-2xl font-bold font-serif text-primary mb-1 tracking-tight">{config.title}</h2>
            <p className="text-xs text-secondary leading-snug line-clamp-3">{config.subtext}</p>
         </div>
         <div className="flex gap-1 items-end h-12 opacity-30 group-hover:opacity-60 transition-opacity mt-auto">
            {[1.2, 1.5, 0.8, 1.1].map((scale, i) => (
              <div key={i} className={`w-3 bg-indigo-600 rounded-sm hover:-translate-y-1 transition-transform`} style={{ height: `${scale * 100}%` }}></div>
            ))}
         </div>
       </div>
    </BaseTile>
  );
};

export const ProtocolsTile: React.FC<ConfigTileProps> = ({ config, onNavigate, className }) => {
  return (
    <BaseTile 
      onClick={onNavigate} 
      className={`bg-card-bg border-border hover:border-blue-500/50 group transition-all duration-500 ${className} p-6`}
    >
      <div className="flex flex-col h-full justify-between relative z-10">
        <div className="flex justify-between items-start">
           <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.15)] group-hover:scale-110 transition-transform">
              <Network size={24} />
           </div>
           <div className="text-right">
              <span className="block text-[8px] font-mono text-secondary uppercase tracking-widest mb-1">{config.category}</span>
              <span className="text-xs font-bold text-blue-400 uppercase tracking-tighter">Architecture Hub</span>
           </div>
        </div>

        <div>
           <h2 className="text-2xl font-bold font-serif text-primary tracking-tight mb-2">{config.title}</h2>
           <p className="text-xs text-secondary leading-snug line-clamp-2">{config.subtext}</p>
        </div>

        <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
           <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
              <span className="text-[10px] font-mono text-secondary">Translation Core: Active</span>
           </div>
           <ArrowUpRight size={14} className="text-zinc-700 group-hover:text-blue-500 transition-all" />
        </div>
      </div>
    </BaseTile>
  );
};

export const SEPerformanceTile: React.FC<ConfigTileProps> = ({ config, onNavigate, className }) => (
  <BaseTile onClick={onNavigate} className={`bg-zinc-900 border-zinc-800 hover:border-blue-700/50 group ${className}`}>
     <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
     <div className="flex flex-col md:flex-row h-full items-center justify-between relative z-10 px-8 py-2 gap-6">
        <div className="flex items-center gap-6">
           <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-blue-400 transition-colors">
               <Fingerprint size={32} />
           </div>
           <div>
               <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-500 border border-blue-500/30 px-2 py-0.5 rounded-full bg-blue-900/10">Active</span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-500 border border-emerald-900/30 px-2 py-0.5 rounded-full bg-emerald-900/10 flex items-center gap-1">
                      <Zap size={10} /> High Bandwidth
                  </span>
               </div>
           <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary tracking-tight">{config.title}</h2>
           </div>
        </div>
        <div className="flex-1 max-w-2xl hidden lg:block">
            <p className="text-lg font-serif text-zinc-400 leading-snug line-clamp-1">{config.subtext}</p>
        </div>
        <div className="text-right">
            <span className="block text-xs font-mono text-zinc-500 uppercase tracking-widest mb-1">{config.label || 'Microsite'}</span>
            <span className="text-sm text-zinc-400 font-bold">{config.category || 'Elite Protocol'}</span>
        </div>
     </div>
  </BaseTile>
);

export const CloudVisionEnablementTile: React.FC<ConfigTileProps> = ({ config, onNavigate, className }) => (
  <BaseTile onClick={onNavigate} className={`bg-zinc-900 border-zinc-800 hover:border-blue-500/40 group p-6 ${className}`}>
     <div className="flex flex-col h-full justify-between relative z-10">
        <div className="flex justify-between items-start">
           <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.1)] group-hover:animate-pulse">
              <Cloud size={24} />
           </div>
           <div className="text-right">
              <span className="block text-[8px] font-mono text-zinc-600 uppercase tracking-widest mb-1">{config.category}</span>
              <span className="text-xs font-bold text-blue-500 uppercase tracking-tighter">Day 0 Provisioning</span>
           </div>
        </div>

        <div>
           <h2 className="text-2xl font-bold font-serif text-primary tracking-tight mb-2">{config.title}</h2>
           <p className="text-xs text-zinc-500 leading-snug max-w-[180px]">{config.subtext}</p>
        </div>

        <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-[10px] font-mono text-zinc-500">Level: Operational</span>
           </div>
           <ArrowUpRight size={14} className="text-zinc-700 group-hover:text-blue-500 transition-all" />
        </div>
     </div>
  </BaseTile>
);

export const LinksTile: React.FC<ConfigTileProps> = ({ config, onNavigate, className }) => {
  const aristaLinks = [
    { label: 'Community & KB', url: 'https://community.arista.com', icon: Globe },
    { label: 'Software Downloads', url: 'https://www.arista.com/en/support/software-download', icon: Zap },
    { label: 'Partner Portal', url: 'https://partners.arista.com', icon: ShieldCheck },
    { label: 'Learning Center', url: 'https://www.arista.com/en/support/training', icon: Book },
  ];

  return (
    <BaseTile 
      onClick={onNavigate} 
      className={`bg-zinc-900 border-zinc-800 hover:border-zinc-500/30 p-6 ${className} group`}
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-zinc-800 rounded-lg text-zinc-400 group-hover:text-blue-400 transition-colors">
                <Link2 size={18} />
             </div>
             <div>
                <h3 className="font-bold text-primary font-serif tracking-tight">{config.title}</h3>
                <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">{config.category}</span>
             </div>
          </div>
          <ArrowUpRight size={16} className="text-zinc-700 group-hover:text-zinc-400 transition-colors" />
        </div>

        <div className="grid grid-cols-1 gap-2">
          {aristaLinks.slice(0, 3).map((link) => (
            <div
              key={link.label}
              className="flex items-center justify-between p-2.5 bg-zinc-950/50 border border-zinc-800 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <link.icon size={12} className="text-zinc-600" />
                <span className="text-[10px] font-medium text-zinc-500">{link.label}</span>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-auto pt-4 text-[10px] text-zinc-600 font-sans italic line-clamp-1 border-t border-zinc-800/50">
          Access the full operational ecosystem...
        </p>
      </div>
    </BaseTile>
  );
};

export const LinuxLabTile: React.FC<ConfigTileProps> = ({ config, onNavigate, className }) => (
  <BaseTile 
    onClick={onNavigate} 
    className={`bg-zinc-900 border-zinc-800 hover:border-emerald-500/50 group transition-all duration-500 ${className} p-6`}
  >
     <div className="flex flex-col h-full justify-between relative z-10">
        <div className="flex justify-between items-start">
           <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)] group-hover:scale-110 transition-transform">
              <Terminal size={24} />
           </div>
           <div className="text-right">
              <span className="block text-[8px] font-mono text-zinc-500 uppercase tracking-widest mb-1">{config.category}</span>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-tighter">Root Access</span>
           </div>
        </div>

        <div>
           <h2 className="text-2xl font-bold font-serif text-primary tracking-tight mb-2">{config.title}</h2>
           <p className="text-xs text-zinc-500 leading-snug line-clamp-2">{config.subtext}</p>
        </div>

        <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
           <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-mono text-zinc-500">Bash Shell: Ready</span>
           </div>
           <ArrowUpRight size={14} className="text-zinc-700 group-hover:text-emerald-500 transition-all" />
        </div>
     </div>
  </BaseTile>
);

export const LearnLinuxTile: React.FC<ConfigTileProps> = ({ config, onNavigate, className }) => (
  <BaseTile 
    onClick={onNavigate} 
    className={`bg-gradient-to-br from-emerald-900/40 via-zinc-900 to-black border-emerald-500/30 hover:border-emerald-500/50 group transition-all duration-500 ${className} p-6`}
  >
     <div className="flex flex-col h-full justify-between relative z-10">
        <div className="flex justify-between items-start">
           <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.15)] group-hover:scale-110 transition-transform">
              <Terminal size={22} />
           </div>
           <div className="text-right">
              <span className="block text-[8px] font-mono text-emerald-400 uppercase tracking-widest mb-1">Tracks</span>
              <span className="text-xs font-bold text-emerald-200 uppercase tracking-tighter">Guided</span>
           </div>
        </div>

        <div>
           <h2 className="text-2xl font-bold font-serif text-primary tracking-tight mb-2">{config.title}</h2>
           <p className="text-xs text-zinc-400 leading-snug line-clamp-2">{config.subtext}</p>
        </div>

        <div className="pt-4 border-t border-emerald-500/20 flex items-center justify-between">
           <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-mono text-emerald-300">EdTech UX</span>
           </div>
           <ArrowUpRight size={14} className="text-emerald-400 group-hover:text-primary transition-all" />
        </div>
     </div>
  </BaseTile>
);
