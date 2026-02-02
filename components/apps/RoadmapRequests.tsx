
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Cpu, Globe, Clock, Radio, Lightbulb, Zap, ThumbsUp, RefreshCw, Layers, Sparkles, Filter, ShieldCheck, X, FileText, BrainCircuit, Info } from 'lucide-react';
import { useInfraLens } from '@/context/InfraLensContext';
import { RoadmapItem } from '@/types';

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const config: Record<string, { label: string; color: string }> = {
    'released': { label: 'Active', color: 'text-primary border-border bg-surface-muted/70' },
    'in-progress': { label: 'Building', color: 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10' },
    'planned': { label: 'Concept', color: 'text-blue-500 border-blue-500/30 bg-blue-500/10' },
    'request': { label: 'Field Proposal', color: 'text-amber-500 border-amber-500/30 bg-amber-500/10' },
  };
  const style = config[status] || { label: status, color: 'text-zinc-400' };

  return (
    <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${style.color} font-sans`}>
      {style.label}
    </span>
  );
};

const RoadmapCard: React.FC<{ item: RoadmapItem }> = ({ item }) => {
    const getIcon = (category: string) => {
        switch(category) {
            case 'Core': return <Cpu size={16} />;
            case 'System': return <Zap size={16} />;
            case 'Content': return <Clock size={16} />;
            case 'Integration': return <Radio size={16} />;
            case 'Social': return <Globe size={16} />;
            default: return <Lightbulb size={16} />;
        }
    };

    return (
        <div className="bg-card-bg border border-border rounded-2xl p-6 hover:border-emerald-400/40 transition-all duration-300 group shadow-sm">
            <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${
                    item.status === 'in-progress' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                    item.status === 'released' ? 'bg-zinc-100/10 border-zinc-100/20 text-zinc-100' :
                    item.status === 'request' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' :
                    'bg-zinc-800/50 border-zinc-700/50 text-zinc-400'
                }`}>
                    {getIcon(item.category)}
                </div>
                <StatusBadge status={item.status} />
            </div>

            <h3 className="text-xl font-serif font-bold text-primary mb-2 tracking-tight group-hover:text-emerald-400">
                {item.title}
            </h3>
            
            <p className="text-secondary leading-relaxed text-sm font-sans mb-6 line-clamp-3">
                {item.description}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-border font-sans">
                <div className="text-[9px] font-bold uppercase tracking-wider text-secondary bg-surface-muted px-2 py-1 rounded border border-border group-hover:text-primary">
                    {item.category}
                </div>
                <div className="flex items-center gap-2 text-[10px] font-medium text-secondary hover:text-primary transition-colors cursor-pointer group/vote">
                    <ThumbsUp size={12} className="group-hover/vote:text-blue-400 transition-colors" />
                    <span>{item.votes}</span>
                </div>
            </div>
        </div>
    );
};

const SubmitProposalModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
            <div className="w-full max-w-2xl bg-card-bg border border-border rounded-[2rem] shadow-2xl overflow-hidden flex flex-col">
                <header className="p-8 border-b border-border flex justify-between items-start bg-card-bg/80">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 text-yellow-500 mb-1">
                            <Sparkles size={18} />
                            <span className="text-[10px] font-mono uppercase tracking-widest">Strategic Proposal Protocol</span>
                        </div>
                        <h2 className="text-2xl font-serif font-bold text-primary">Submit Field Intelligence</h2>
                        <p className="text-sm text-secondary">We do not build gimmicks. We build cognitive leverage. Frame your request.</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-surface-muted hover:bg-card-bg rounded-full text-secondary hover:text-primary transition-colors border border-border">
                        <X size={20} />
                    </button>
                </header>
                
                <div className="p-8 space-y-8 overflow-y-auto max-h-[60vh]">
                    <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-secondary flex items-center gap-2">
                            <BrainCircuit size={14} className="text-blue-500" /> The Cognitive Gap
                        </label>
                        <textarea placeholder="Where does the current workflow fail? What thinking is being wasted?" className="w-full bg-card-bg border border-border rounded-xl p-4 text-sm text-primary focus:border-emerald-500 outline-none h-24 resize-none transition-colors" />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-secondary flex items-center gap-2">
                            <FileText size={14} className="text-emerald-500" /> Desired Artifact
                        </label>
                        <input placeholder="What durable output should this produce? (e.g. PDF, URL, Graph)" className="w-full bg-card-bg border border-border rounded-xl p-4 text-sm text-primary focus:border-emerald-500 outline-none transition-colors" />
                    </div>

                    <div className="p-6 bg-card-bg/70 border border-border rounded-2xl flex gap-4">
                        <Info size={20} className="text-secondary shrink-0 mt-1" />
                        <div className="space-y-2">
                            <h4 className="text-xs font-bold text-secondary uppercase">Exclusion Zone Criteria</h4>
                            <p className="text-[11px] text-secondary leading-relaxed">
                                We will reject requests for: AI Roleplay, Conversational Chatbots, 3D Hardware Spins, or features that prioritize "Impressiveness" over "Clarity".
                            </p>
                        </div>
                    </div>
                </div>

                <footer className="p-6 border-t border-border bg-card-bg flex justify-end gap-4">
                    <button onClick={onClose} className="px-6 py-3 text-xs font-bold text-secondary uppercase hover:text-primary transition-colors">Cancel</button>
                    <button onClick={onClose} className="px-8 py-3 bg-primary text-black rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-emerald-100 transition-colors shadow-xl border border-border">
                        Submit to Ledger
                    </button>
                </footer>
            </div>
        </div>
    );
};

export const RoadmapRequests: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { roadmap, showAdminApps } = useInfraLens();
  const navigate = useNavigate();
  const [activeType, setActiveType] = useState<'ALL' | 'PIPELINE' | 'IMPROVEMENTS' | 'REQUESTS'>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const pipelineItems = useMemo(() => roadmap.filter(r => !r.hidden && r.status !== 'request' && (r.type === 'feature' || !r.type)), [roadmap]);
  const improvementItems = useMemo(() => roadmap.filter(r => !r.hidden && r.type === 'refinement'), [roadmap]);
  const requestItems = useMemo(() => roadmap.filter(r => !r.hidden && r.status === 'request'), [roadmap]);

  if (!showAdminApps) {
    return (
      <div className="min-h-screen bg-page-bg text-primary font-sans selection:bg-blue-500/30 overflow-x-hidden">
        <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
          <button 
            onClick={onBack}
            className="group flex items-center gap-2 text-secondary hover:text-primary transition-colors text-xs font-bold uppercase tracking-[0.2em]"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Systems Return
          </button>

          <div className="mt-12 bg-card-bg border border-border rounded-[2rem] p-10 shadow-2xl">
            <div className="flex items-center gap-3 text-emerald-400 mb-4">
              <ShieldCheck size={20} />
              <span className="text-[10px] font-mono uppercase tracking-widest">Admin Gate</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary tracking-tight mb-3">
              Admin PIN Required
            </h1>
            <p className="text-sm text-secondary leading-relaxed mb-8">
              The Pipeline ledger is restricted. Unlock admin access with the PIN to continue.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/admin')}
                className="px-6 py-2.5 bg-primary text-black rounded-full font-bold text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-emerald-500/10 flex items-center gap-2 border border-border hover:bg-emerald-100"
              >
                Open Admin Console
              </button>
              <button
                onClick={onBack}
                className="px-6 py-2.5 bg-card-bg border border-border rounded-full font-bold text-[10px] uppercase tracking-widest text-secondary hover:text-primary"
              >
                Return Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page-bg text-primary font-sans selection:bg-blue-500/30 overflow-x-hidden">
      
      {isModalOpen && <SubmitProposalModal onClose={() => setIsModalOpen(false)} />}

      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none opacity-15">
         <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 relative z-10">
        
        {/* Header Section */}
        <header className="mb-20 space-y-12">
          <div className="flex items-center justify-between">
             <button 
                onClick={onBack}
                className="group flex items-center gap-2 text-secondary hover:text-primary transition-colors text-xs font-bold uppercase tracking-[0.2em]"
              >
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Systems Return
              </button>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-2.5 bg-primary text-black hover:bg-emerald-100 rounded-full font-bold text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-emerald-500/10 flex items-center gap-2 border border-border"
              >
                <Plus size={14} /> Submit Architecture Idea
              </button>
          </div>
          
          <div className="space-y-6">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl shadow-inner">
                    <RefreshCw size={28} className="text-emerald-500 animate-spin-slow" />
                 </div>
                 <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-secondary">System Evolution Ledger</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-serif font-black text-primary tracking-tighter leading-none">
                Roadmap <span className="text-secondary italic">&</span> Refinements
              </h1>
              <p className="text-secondary text-lg md:text-xl leading-relaxed max-w-2xl font-light">
                Grounded in the AristaOS core pillars: Trusted Advisor, Software Reliability, and Biological Excellence.
              </p>
          </div>

          {/* Type Filter */}
          <div className="flex p-1 bg-card-bg border border-border rounded-2xl w-fit overflow-x-auto">
              <button 
                onClick={() => setActiveType('ALL')}
                className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeType === 'ALL' ? 'bg-surface-muted text-primary shadow-sm border border-border' : 'text-secondary hover:text-primary'}`}
              >
                  Unified Ledger
              </button>
              <button 
                onClick={() => setActiveType('PIPELINE')}
                className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeType === 'PIPELINE' ? 'bg-surface-muted text-primary shadow-sm border border-border' : 'text-secondary hover:text-primary'}`}
              >
                  Strategic Pipeline
              </button>
              <button 
                onClick={() => setActiveType('IMPROVEMENTS')}
                className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeType === 'IMPROVEMENTS' ? 'bg-surface-muted text-primary shadow-sm border border-border' : 'text-secondary hover:text-primary'}`}
              >
                  System Refinements
              </button>
              <button 
                onClick={() => setActiveType('REQUESTS')}
                className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeType === 'REQUESTS' ? 'bg-surface-muted text-primary shadow-sm border border-border' : 'text-secondary hover:text-primary'}`}
              >
                  Field Requests
              </button>
          </div>
       </header>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
           
           {/* COLUMN 1: STRATEGIC PIPELINE (Features) */}
           {(activeType === 'ALL' || activeType === 'PIPELINE') && (
               <section className="space-y-12 animate-fade-in">
                  <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                        <Sparkles size={18} />
                      </div>
                      <div>
                          <h2 className="text-2xl font-serif font-bold text-white tracking-tight">Strategic Pipeline</h2>
                          <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Major Feature Expansions</p>
                      </div>
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                      {pipelineItems.map(item => <RoadmapCard key={item.id} item={item} />)}
                  </div>
               </section>
           )}

           {/* COLUMN 2: SYSTEM REFINEMENTS (Improvements) */}
           {(activeType === 'ALL' || activeType === 'IMPROVEMENTS') && (
               <section className="space-y-12 animate-fade-in">
                  <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                        <Layers size={18} />
                      </div>
                      <div>
                          <h2 className="text-2xl font-serif font-bold text-white tracking-tight">System Refinements</h2>
                          <p className="text--[10px] font-mono text-zinc-600 uppercase tracking-widest">UX, Performance & Redesign</p>
                      </div>
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                      {improvementItems.map(item => <RoadmapCard key={item.id} item={item} />)}
                  </div>
               </section>
           )}

           {/* COLUMN 3: FIELD REQUESTS (Suggestions) */}
           {(activeType === 'ALL' || activeType === 'REQUESTS') && (
               <section className="space-y-12 animate-fade-in lg:col-span-2">
                  <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-400 border border-yellow-500/20">
                        <Lightbulb size={18} />
                      </div>
                      <div>
                          <h2 className="text-2xl font-serif font-bold text-white tracking-tight">Field Intelligence</h2>
                          <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Validated User Proposals</p>
                      </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {requestItems.map(item => <RoadmapCard key={item.id} item={item} />)}
                  </div>
               </section>
           )}

        </div>

      </div>

      {/* Footer Metrics */}
      <footer className="mt-20 border-t border-zinc-900 bg-black/50 p-8">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-8">
                <div className="flex flex-col gap-1">
                    <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">Pipeline Depth</span>
                    <span className="text-xs font-bold text-zinc-400">{pipelineItems.length} Strategic Initiatives</span>
                </div>
                <div className="w-px h-8 bg-zinc-800"></div>
                <div className="flex flex-col gap-1">
                    <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">Refinement Velocity</span>
                    <span className="text-xs font-bold text-zinc-400">{improvementItems.length} Pending Tweaks</span>
                </div>
                <div className="w-px h-8 bg-zinc-800"></div>
                <div className="flex flex-col gap-1">
                    <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">Field Signal</span>
                    <span className="text-xs font-bold text-zinc-400">{requestItems.length} Validated Requests</span>
                </div>
            </div>
            <div className="text-[10px] font-mono text-zinc-700 uppercase tracking-[0.5em]">
                Evolution Status: Continuous Delivery
            </div>
         </div>
      </footer>
    </div>
  );
};
