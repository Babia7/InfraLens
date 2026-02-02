
import React, { useState } from 'react';
import { SectionType } from '@/types';
import { Command, Info, Lightbulb, Share2, Calculator, Compass, Sparkles, Play } from 'lucide-react';
import { useInfraLens } from '@/context/InfraLensContext';

import { HeroTile, BriefingTile, SalesPlaybookTile, LinksTile, ProtocolsTile } from '@layout';

interface BentoGridProps {
  onNavigate: (section: SectionType) => void;
}

export const BentoGrid: React.FC<BentoGridProps> = ({ onNavigate }) => {
  const { config, showAdminApps } = useInfraLens();
  const [isHeroCollapsed, setIsHeroCollapsed] = useState(false);

  const quickStarts = [
    { title: 'Start a Briefing', desc: 'Preset narratives & live teleprompter', action: () => onNavigate(SectionType.BRIEFING_THEATER) },
    { title: 'Validated Designs', desc: 'Browse AVD-ready field kits', action: () => onNavigate(SectionType.VALIDATED_DESIGN_NAVIGATOR) }
  ];

  const openCalculatorSuite = () => {
    localStorage.setItem('forge_active_category', 'Sales');
    onNavigate(SectionType.APPS);
  };
  
  return (
    <div className="min-h-screen bg-page-bg text-primary font-sans selection:bg-zinc-700 overflow-hidden relative flex flex-col">
      <div className="flex-1 p-4 md:p-6 flex items-center justify-center overflow-y-auto">
        <div className="max-w-7xl w-full space-y-6 transition-all duration-500">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <HeroTile 
              config={config} 
              isExpanded={!isHeroCollapsed} 
              onShrink={() => setIsHeroCollapsed(!isHeroCollapsed)} 
              className={`transition-all duration-500 ease-in-out ${isHeroCollapsed ? "md:col-span-7 h-[260px]" : "md:col-span-8 h-[360px]"}`}
            />

            <div className="md:col-span-4 lg:col-span-4 h-full">
              <div className="h-full p-5 rounded-3xl border border-border bg-card-bg flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Compass size={16} className="text-emerald-400" />
                    <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-zinc-500">Start Here</div>
                  </div>
                  <button
                    onClick={() => onNavigate(SectionType.APPS)}
                    className="text-[10px] font-mono uppercase tracking-[0.3em] text-emerald-500 hover:text-primary"
                  >
                    Browse all →
                  </button>
                </div>
                <p className="text-sm text-secondary leading-snug">
                  Pick a mission. Returning users jump straight into delivery; new users can take the guided protocol paths.
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {quickStarts.map((qs) => (
                    <button
                      key={qs.title}
                      onClick={qs.action}
                      className="w-full text-left px-4 py-3 rounded-2xl border border-border bg-card-bg hover:border-emerald-400/50 hover:-translate-y-0.5 transition flex items-start justify-between gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-page-bg"
                    >
                      <div>
                        <div className="text-xs font-semibold text-primary">{qs.title}</div>
                        <div className="text-[11px] text-secondary leading-snug">{qs.desc}</div>
                      </div>
                      <Play size={14} className="text-emerald-300 mt-0.5" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-min">
            {config.tiles.briefing.visible && (
              <BriefingTile 
                config={config.tiles.briefing} 
                onNavigate={() => onNavigate(SectionType.BRIEFING_THEATER)}
                className="md:col-span-6 h-[220px]" 
              />
            )}

            {config.tiles.protocols?.visible && (
              <ProtocolsTile 
                config={config.tiles.protocols} 
                onNavigate={() => onNavigate(SectionType.PROTOCOLS)}
                className="md:col-span-6 h-[220px]" 
              />
            )}

            {config.tiles.salesPlaybook?.visible && (
              <SalesPlaybookTile 
                config={config.tiles.salesPlaybook}
                onNavigate={() => onNavigate(SectionType.SALES_PLAYBOOK_COACH)}
                className="md:col-span-6 h-[220px]" 
              />
            )}

            <div className="md:col-span-6 h-[220px] rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-900/40 via-zinc-900 to-black p-5 flex flex-col justify-between shadow-[0_0_30px_rgba(16,185,129,0.12)] hover:border-emerald-400/60 transition">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-emerald-300">
                  <Calculator size={14} /> ROI Calculators
                </div>
                <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-emerald-400/70 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Suite
                </span>
              </div>
              <div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.2)] mb-3">
                  <Calculator size={18} />
                </div>
                <h3 className="text-2xl font-serif text-primary mb-2">ROI Calculators</h3>
                <p className="text-sm text-zinc-300 leading-relaxed">TCO, Op Velocity, MTTR, Unified OS, and Why Now—financial logic built for field execution.</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {['TCO', 'MTTR', 'OpEx'].map((tag) => (
                    <span key={tag} className="text-[9px] font-mono uppercase tracking-widest text-emerald-200/80 border border-emerald-500/20 px-2 py-0.5 rounded-full bg-emerald-900/20">
                      {tag}
                    </span>
                  ))}
                </div>
                <button
                  onClick={openCalculatorSuite}
                  className="px-4 py-2 rounded-lg border border-emerald-400/40 text-sm font-semibold text-primary hover:border-emerald-400 hover:text-emerald-200 transition"
                >
                  Open Calculators
                </button>
              </div>
            </div>

            {config.tiles.links.visible && (
              <LinksTile 
                config={config.tiles.links}
                onNavigate={() => onNavigate(SectionType.LINKS_HUB)}
                className="md:col-span-6 h-[210px]"
              />
            )}

            <div className="md:col-span-6 h-[210px] rounded-3xl border border-border bg-card-bg p-5 flex flex-col justify-between">
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-emerald-300">
                <Sparkles size={14} /> Browse Everything
              </div>
              <div>
                <h3 className="text-xl font-serif text-primary mb-2">All apps & assets</h3>
                <p className="text-sm text-secondary leading-relaxed">Search and filter the full catalog when you need a specific tool.</p>
              </div>
              <button
                onClick={() => onNavigate(SectionType.APPS)}
                className="self-start px-4 py-2 rounded-lg border border-emerald-400/40 text-sm font-semibold text-primary hover:border-emerald-400 hover:text-emerald-700 transition"
              >
                Open Catalog
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-zinc-950 border-t border-zinc-800 px-8 py-3 flex items-center justify-between shrink-0 z-50">
         <div className="flex gap-6">
            <button 
              onClick={() => onNavigate(SectionType.ABOUT)}
              className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-secondary hover:text-primary transition-colors group"
            >
               <Info size={14} className="group-hover:text-blue-400 transition-colors" />
               SYS_INFO
            </button>
            <div className="w-px h-4 bg-zinc-800 my-auto"></div>
            {showAdminApps && (
              <>
                <button 
                  onClick={() => onNavigate(SectionType.ROADMAP)}
                  className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-secondary hover:text-primary transition-colors group"
                >
                   <Lightbulb size={14} className="group-hover:text-yellow-400 transition-colors" />
                   PIPELINE
                </button>
                <div className="w-px h-4 bg-zinc-800 my-auto"></div>
              </>
            )}
            <button 
              onClick={() => onNavigate(SectionType.KNOWLEDGE_GRAPH)}
              className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-secondary hover:text-primary transition-colors group"
            >
               <Share2 size={14} className="group-hover:text-blue-400 transition-colors" />
               NEXUS
            </button>
         </div>

         <div className="flex items-center gap-4">
            <div className="text-left">
              <div className="text-[10px] text-zinc-600 font-mono hidden md:block">InfraLens Field Kernel v3.1</div>
            </div>
            <button 
              onClick={() => onNavigate(SectionType.ADMIN)} 
              title="Admin Console"
              className="text-secondary hover:text-primary transition-colors p-2 bg-card-bg rounded-md border border-border"
            >
               <Command size={14} />
            </button>
         </div>
      </div>
    </div>
  );
};
