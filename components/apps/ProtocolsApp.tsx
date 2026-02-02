
import React, { useEffect, useState } from 'react';
import { ArrowLeft, Network, Zap, ShieldCheck, Box, ChevronRight, Terminal, Info, Layout, Activity, MessageSquare, Database, ArrowRightLeft, Server, Cpu, Share2, Shield, Radio, Layers, CheckCircle2, BookOpen, Target, Copy, Check } from 'lucide-react';
import { PROTOCOL_CONTENT, ProtocolDetail } from '@data/protocolsContent';
import { SectionType } from '@/types';
import { RelatedActions } from '@/components/RelatedActions';
import { EvidenceDrawer } from '@/components/EvidenceDrawer';

// --- CUSTOM ANIMATED VISUALS ---

const VXLANVisual = () => (
  <div className="relative w-full h-full flex items-center justify-center bg-card-bg rounded-3xl border border-border p-8 overflow-hidden group">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)]"></div>
    <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-md">
      <div className="flex justify-between w-full">
        <div className="w-16 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] animate-float">
          <span className="text-[10px] font-mono font-bold text-white">VLAN 10</span>
        </div>
        <div className="w-16 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] animate-float-delayed">
          <span className="text-[10px] font-mono font-bold text-white">VLAN 10</span>
        </div>
      </div>
      
      <div className="relative w-full flex items-center justify-center h-24">
        <div className="absolute w-full h-1 bg-border rounded-full"></div>
        <div className="w-40 h-16 bg-card-bg border border-border rounded-xl flex items-center justify-center relative overflow-hidden group-hover:border-blue-500 transition-colors">
          <div className="absolute left-0 w-8 h-full bg-blue-500/20 flex items-center justify-center font-mono text-[8px] border-r border-border text-blue-400">UDP</div>
          <div className="flex-1 text-[10px] font-mono font-bold text-center text-secondary px-2">VXLAN VNI: 10010</div>
          <div className="absolute w-4 h-4 bg-white rounded-full blur-[2px] animate-[slide_3s_linear_infinite]" style={{ left: '-20%' }}></div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 opacity-50">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="w-8 h-8 bg-card-bg border border-border rounded flex items-center justify-center">
            <Cpu size={12} className="text-secondary" />
          </div>
        ))}
      </div>
    </div>
    <div className="absolute bottom-4 left-6 text-[8px] font-mono text-zinc-600 uppercase tracking-widest">Encapsulation Pipeline: L2-in-UDP</div>
    
    <style>{`
      @keyframes slide {
        0% { left: -10%; opacity: 0; }
        20% { opacity: 1; }
        80% { opacity: 1; }
        100% { left: 110%; opacity: 0; }
      }
    `}</style>
  </div>
);

const EVPNVisual = () => (
  <div className="relative w-full h-full flex items-center justify-center bg-card-bg rounded-3xl border border-border p-8 overflow-hidden group">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1)_0%,transparent_70%)]"></div>
    <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-sm">
      <div className="w-24 h-24 bg-emerald-500/10 border-2 border-emerald-500/40 rounded-full flex flex-col items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.2)] mb-12 animate-pulse relative">
        <Database size={32} className="text-emerald-400 mb-1" />
        <span className="text-[8px] font-mono text-emerald-500 font-bold uppercase">BGP_SYSDB</span>
        
        {[0, 120, 240].map(angle => (
          <div key={angle} className="absolute h-16 w-px bg-gradient-to-t from-emerald-500/50 to-transparent origin-bottom transition-all duration-1000" style={{ transform: `rotate(${angle}deg) translateY(-80px)` }}>
            <div className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_10px_#10b981] animate-ping" style={{ animationDuration: '2s' }}></div>
          </div>
        ))}
      </div>

      <div className="flex gap-12">
        {['LF_01', 'LF_02', 'LF_03'].map(id => (
          <div key={id} className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-zinc-900 border border-zinc-700 rounded-xl flex items-center justify-center group-hover:border-emerald-500 transition-colors shadow-2xl">
              <Cpu size={20} className="text-zinc-600 group-hover:text-emerald-500 transition-colors" />
            </div>
            <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-tighter">{id}</span>
          </div>
        ))}
      </div>
    </div>
    <div className="absolute bottom-4 left-6 text-[8px] font-mono text-zinc-600 uppercase tracking-widest">Control Plane: Multi-Protocol BGP</div>
  </div>
);

const MLAGVisual = () => (
  <div className="relative w-full h-full flex items-center justify-center bg-card-bg rounded-3xl border border-border p-8 overflow-hidden group">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.1)_0%,transparent_70%)]"></div>
    <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-sm gap-12">
      
      <div className="relative flex gap-24 items-center">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-1 bg-gradient-to-r from-blue-500/20 via-blue-500 to-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.5)] animate-pulse"></div>
        
        <div className="w-24 h-16 bg-zinc-950 border-2 border-zinc-800 rounded-xl flex flex-col items-center justify-center relative z-10 group-hover:border-blue-500 transition-colors">
          <Layers size={20} className="text-zinc-600 group-hover:text-blue-500" />
          <span className="text-[7px] font-mono text-zinc-700 mt-1 uppercase tracking-tighter">PEER_A</span>
        </div>
        <div className="w-24 h-16 bg-zinc-950 border-2 border-zinc-800 rounded-xl flex flex-col items-center justify-center relative z-10 group-hover:border-blue-500 transition-colors">
          <Layers size={20} className="text-zinc-600 group-hover:text-blue-500" />
          <span className="text-[7px] font-mono text-zinc-700 mt-1 uppercase tracking-tighter">PEER_B</span>
        </div>
      </div>

      <div className="relative">
        <svg className="w-64 h-24 pointer-events-none opacity-40">
           <path d="M 32 0 L 128 80 M 224 0 L 128 80" stroke="white" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" />
        </svg>
        <div className="absolute left-1/2 top-full -translate-x-1/2 mt-2">
          <div className="w-32 h-16 bg-zinc-900 border border-zinc-800 rounded-xl flex flex-col items-center justify-center shadow-2xl">
             <Server size={24} className="text-zinc-500 mb-1" />
             <span className="text-[8px] font-mono text-zinc-600 uppercase font-bold tracking-widest">Logical Bond0</span>
          </div>
        </div>
      </div>
    </div>
    <div className="absolute bottom-4 left-6 text-[8px] font-mono text-zinc-600 uppercase tracking-widest">Redundancy: LACP Active-Active</div>
  </div>
);

const NVMeOFVisual = () => (
  <div className="relative w-full h-full flex items-center justify-center bg-card-bg rounded-3xl border border-border p-8 overflow-hidden group">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08)_0%,transparent_70%)]"></div>
    <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-sm">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col items-center justify-center">
          <Server size={20} className="text-blue-400" />
          <span className="text-[7px] font-mono text-zinc-500 uppercase tracking-[0.3em] mt-1">HOST</span>
        </div>
        <div className="w-28 h-2 bg-gradient-to-r from-blue-500/20 via-blue-500 to-blue-500/20 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.4)] animate-pulse"></div>
        <div className="w-16 h-16 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col items-center justify-center">
          <Database size={20} className="text-emerald-400" />
          <span className="text-[7px] font-mono text-zinc-500 uppercase tracking-[0.3em] mt-1">TARGET</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 opacity-70">
        {['PFC', 'ECN', 'MTU'].map((label) => (
          <div key={label} className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-[8px] font-mono text-zinc-500 uppercase tracking-[0.3em] text-center">
            {label}
          </div>
        ))}
      </div>
    </div>
    <div className="absolute bottom-4 left-6 text-[8px] font-mono text-zinc-600 uppercase tracking-widest">Fabric: Lossless Storage Class</div>
  </div>
);

interface RoleConfigViewerProps {
  roles: RoleConfig[];
}

const RoleConfigViewer: React.FC<RoleConfigViewerProps> = ({ roles }) => {
  const [activeRole, setActiveRole] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(roles[activeRole].config);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-card-bg border border-border rounded-[2rem] overflow-hidden shadow-2xl">
       <header className="p-6 bg-card-bg/80 border-b border-border flex justify-between items-center">
          <div className="flex items-center gap-3">
             <Terminal size={18} className="text-emerald-500" />
             <h3 className="text-xs font-bold uppercase tracking-widest text-primary">Reference Configurations</h3>
          </div>
          <div className="flex gap-2 p-1 bg-surface-muted rounded-lg border border-border">
             {roles.map((r, i) => (
                <button 
                  key={r.role}
                  onClick={() => setActiveRole(i)}
                  className={`px-3 py-1 rounded text-[9px] font-bold uppercase tracking-wider transition-all ${activeRole === i ? 'bg-card-bg text-primary border border-border' : 'text-secondary hover:text-primary'}`}
                >
                  {r.role.split(' ')[0]}
                </button>
             ))}
          </div>
       </header>
       
       <div className="p-6 space-y-6">
          <div className="space-y-2">
             <h4 className="text-sm font-bold text-primary flex items-center gap-2">
               <Target size={14} className="text-emerald-500" /> {roles[activeRole].role}
             </h4>
             <p className="text-xs text-secondary leading-relaxed italic">
                {roles[activeRole].description}
             </p>
          </div>

          <div className="relative group">
             <pre className="p-6 bg-surface-muted rounded-2xl border border-border text-[11px] font-mono text-emerald-600 overflow-x-auto h-64 selection:bg-emerald-100/40">
                {roles[activeRole].config}
             </pre>
             <button 
                onClick={handleCopy}
                className="absolute top-4 right-4 p-2 bg-card-bg border border-border rounded-lg text-secondary hover:text-primary transition-all opacity-0 group-hover:opacity-100"
             >
                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
             </button>
          </div>
       </div>

       <footer className="p-4 bg-card-bg text-center border-t border-border/70">
          <p className="text-[8px] text-secondary font-mono uppercase tracking-[0.4em]">Field Validated Design Snippet</p>
       </footer>
    </div>
  );
};

interface ProtocolsAppProps {
  onBack: () => void;
  onNavigate?: (section: SectionType) => void;
}

const PROTOCOL_LAB_STORAGE_KEY = 'protocol_lab_active_id';

export const ProtocolsApp: React.FC<ProtocolsAppProps> = ({ onBack, onNavigate }) => {
  const [selectedId, setSelectedId] = useState<string>('VXLAN');
  const [copiedBlock, setCopiedBlock] = useState<string | null>(null);
  const active = PROTOCOL_CONTENT[selectedId];

  useEffect(() => {
    try {
      const stored = localStorage.getItem(PROTOCOL_LAB_STORAGE_KEY);
      if (stored && PROTOCOL_CONTENT[stored]) {
        setSelectedId(stored);
      }
      localStorage.removeItem(PROTOCOL_LAB_STORAGE_KEY);
    } catch {
      // Ignore storage errors.
    }
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col selection:bg-blue-500/30">
      
      {/* HEADER */}
      <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-8 bg-zinc-950 shrink-0 z-50">
        <div className="flex items-center gap-6">
            <button onClick={onBack} className="group p-2 text-zinc-500 hover:text-white transition-colors">
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <div className="h-4 w-px bg-zinc-800"></div>
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400">
                    <Network size={20} />
                </div>
                <div>
                    <h1 className="text-sm font-bold uppercase tracking-wider">Protocol Lab</h1>
                    <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Operational Patterns v3.0</span>
                </div>
            </div>
        </div>
        
        <div className="flex gap-2">
            {Object.keys(PROTOCOL_CONTENT).map(id => (
                <button
                    key={id}
                    onClick={() => { setSelectedId(id); }}
                    className={`px-5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${selectedId === id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'}`}
                >
                    {id}
                </button>
            ))}
        </div>
      </header>

      {/* CONTENT AREA */}
      <main className="flex-1 overflow-y-auto relative p-8 md:p-16">
         <div className="absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.02)_1px,transparent_1px)] bg-[length:50px_50px] pointer-events-none"></div>
         
         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 animate-fade-in">
            
            {/* LEFT: CONCEPTUAL DEEP DIVE */}
            <div className="lg:col-span-7 space-y-12">
               <header className="space-y-6">
                  <div className="flex items-center gap-3">
                     <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-[10px] font-mono text-blue-400 uppercase tracking-widest">Dossier: {active.id}</span>
                     <div className="h-px w-20 bg-zinc-800"></div>
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-5xl md:text-8xl font-serif font-bold tracking-tighter text-white leading-tight">
                      {active.name}
                    </h2>
                    <div className="flex items-center gap-4">
                      <div className="h-px w-8 bg-blue-500"></div>
                      <p className="text-xl md:text-2xl text-zinc-400 font-light italic">
                        "{active.tagline}"
                      </p>
            </div>
        </div>
        {onNavigate && (
          <RelatedActions
            actions={[
              { label: 'Briefing Theater', onClick: () => onNavigate(SectionType.BRIEFING_THEATER), icon: <MessageSquare size={12} />, tone: 'blue' },
              { label: 'Narrative Playbook', onClick: () => onNavigate(SectionType.NARRATIVE_PLAYBOOK), icon: <Share2 size={12} />, tone: 'indigo' },
              { label: 'Collision Mapper', onClick: () => onNavigate(SectionType.PROTOCOL_COLLISION_MAPPER), icon: <ArrowRightLeft size={12} />, tone: 'emerald' },
              { label: 'Validated Designs', onClick: () => onNavigate(SectionType.VALIDATED_DESIGN_NAVIGATOR), icon: <Layout size={12} />, tone: 'blue' }
            ]}
          />
        )}
      </header>

               <section className="space-y-6">
                  <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-zinc-500 flex items-center gap-2">
                    <Info size={14} className="text-blue-500" /> Operational Context
                  </h3>
                  <p className="text-xl text-zinc-200 leading-relaxed font-sans font-light">
                    {active.description}
                  </p>
               </section>

               <section className="space-y-6">
                  <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-zinc-500 flex items-center gap-2">
                    <Zap size={14} className="text-blue-500" /> Strategic Impact
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {active.keyBenefits.map((benefit, i) => (
                       <div key={i} className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-blue-500/30 transition-all group flex gap-4">
                          <div className="w-8 h-8 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-600 group-hover:text-blue-400 shrink-0">
                            <ShieldCheck size={16} />
                          </div>
                          <span className="text-sm text-zinc-400 leading-relaxed group-hover:text-zinc-200">{benefit}</span>
                       </div>
                    ))}
                  </div>
               </section>

               {active.overview && (
                 <section className="space-y-6">
                   <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-zinc-500 flex items-center gap-2">
                     <Target size={14} className="text-blue-500" /> {active.overview.title}
                   </h3>
                   <div className="p-6 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-4 text-zinc-300">
                     <p className="text-sm leading-relaxed">{active.overview.intro}</p>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {active.overview.sections.map((section) => (
                         <div key={section.title} className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-2">
                           <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500">{section.title}</p>
                           <p className="text-xs text-zinc-400 leading-relaxed">{section.body}</p>
                           <p className="text-[10px] font-mono text-zinc-600 uppercase">Best for:</p>
                           <p className="text-xs text-zinc-400 leading-relaxed">{section.bestFor}</p>
                         </div>
                       ))}
                     </div>
                     <p className="text-xs text-zinc-500 leading-relaxed">{active.overview.conclusion}</p>
                   </div>
                 </section>
               )}

               {active.primer && (
                 <section className="space-y-6">
                   <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-zinc-500 flex items-center gap-2">
                     <BookOpen size={14} className="text-blue-500" /> {active.primer.title}
                   </h3>
                   <div className="p-6 bg-zinc-900/60 border border-zinc-800 rounded-2xl text-zinc-300">
                     <p className="text-sm leading-relaxed">{active.primer.body}</p>
                   </div>
                 </section>
               )}
            </div>

            {/* RIGHT: TRANSLATION & VISUALS */}
            <div className="lg:col-span-5 space-y-8">
               
              <section className="space-y-4">
                 <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-zinc-500 flex items-center gap-2">
                   <Activity size={14} className="text-emerald-500" /> Architectural Flow
                 </h3>
                 <div className="h-[320px]">
                   {active.id === 'vxlan' && <VXLANVisual />}
                   {active.id === 'evpn' && <EVPNVisual />}
                   {active.id === 'mlag' && <MLAGVisual />}
                   {active.id === 'nvmeof' && <NVMeOFVisual />}
                 </div>
              </section>

              {active.id === 'vxlan' && active.roleConfigs && (
                <section className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-zinc-500 flex items-center gap-2">
                    <Layout size={14} className="text-blue-500" /> Operational Playbook
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {active.roleConfigs
                      .filter((r) => [
                        'Preflight Checklist',
                        'Validation / Proof Hooks',
                        'Troubleshooting Map',
                        'Safe Defaults (VXLAN/EVPN)',
                        'Brownfield Cutover Steps'
                      ].includes(r.role))
                      .map((role) => (
                        <div key={role.role} className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500">{role.role}</p>
                              <p className="text-xs text-zinc-400 leading-relaxed">{role.description}</p>
                            </div>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(role.config);
                                setCopiedBlock(role.role);
                                setTimeout(() => setCopiedBlock(null), 2000);
                              }}
                              className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:border-blue-400/50 transition"
                              aria-label={`Copy ${role.role} snippet`}
                            >
                              {copiedBlock === role.role ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                            </button>
                          </div>
                          <pre className="text-[11px] font-mono text-zinc-300 bg-black/60 border border-zinc-800 rounded-lg p-3 max-h-48 overflow-y-auto">
                            {role.config}
                          </pre>
                        </div>
                      ))}
                  </div>
                </section>
              )}

               {active.referenceLinks && active.referenceLinks.length > 0 && (
                 <section className="space-y-4">
                   <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-zinc-500 flex items-center gap-2">
                     <BookOpen size={14} className="text-blue-500" /> Reference Material
                   </h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {active.referenceLinks.map((ref) => (
                  <div key={ref.title} className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl space-y-1">
                    <p className="text-sm font-semibold text-white">{ref.title}</p>
                    {ref.summary && <p className="text-xs text-zinc-500 leading-relaxed">{ref.summary}</p>}
                    {ref.url && (
                      <a className="text-[11px] text-blue-400 hover:underline inline-flex items-center gap-1" href={ref.url} target="_blank" rel="noreferrer">
                        View <ChevronRight size={12} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ROLE-BASED CONFIGS */}
          {active.roleConfigs && <RoleConfigViewer roles={active.roleConfigs} />}

          <EvidenceDrawer contextTags={['Protocol', 'Life Sciences']} />

               <section className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
                  <header className="p-6 bg-zinc-800/50 border-b border-zinc-800 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Terminal size={18} className="text-blue-400" />
                        <h3 className="text-xs font-bold uppercase tracking-widest">Operational Command Snippets</h3>
                    </div>
                    <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Source: EOS Native</span>
                  </header>

                  <div className="p-6 space-y-6">
                    {active.cliTranslation.map((pair, i) => (
                        <div key={i} className="space-y-3 group">
                          <div className="flex flex-col gap-1.5">
                              <div className="flex justify-between items-center">
                                <span className="text-[8px] font-mono text-blue-500 uppercase">EOS Native</span>
                                <CheckCircle2 size={10} className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                              <code className="text-[11px] bg-blue-950/20 p-3 rounded-lg border border-blue-500/20 text-blue-300 block truncate font-bold shadow-inner">
                                {pair.arista}
                              </code>
                          </div>
                          {i < active.cliTranslation.length - 1 && <div className="h-px bg-zinc-800/50 w-full mt-4"></div>}
                        </div>
                    ))}
                  </div>

                  <footer className="p-5 bg-zinc-950 text-center border-t border-zinc-800/50">
                    <p className="text-[9px] text-zinc-600 italic font-mono uppercase tracking-widest">Grounded in RFC Standards</p>
                  </footer>
               </section>

            </div>

         </div>
      </main>

      <footer className="h-10 bg-zinc-950 border-t border-zinc-800 px-8 flex items-center justify-between text-[8px] font-mono text-zinc-600 uppercase tracking-[0.4em] shrink-0 z-20">
         <div className="flex items-center gap-4">
            <span>Knowledge Substrate</span>
            <span className="w-1 h-1 bg-zinc-800 rounded-full"></span>
            <span className="text-blue-900">Module: EVPN-MASTER-01</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span>Expertise Grounding: Calibrated</span>
         </div>
      </footer>

    </div>
  );
};
