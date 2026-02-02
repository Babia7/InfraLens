import React, { useState } from 'react';
import { ArrowLeft, Layers, Palette, Cpu, Type, LayoutGrid, Code, Sparkles, Zap, Monitor, Box, ChevronRight, Info, Fingerprint, Download, Save, ExternalLink, Library, BrainCircuit, ShieldCheck, Activity, Target, Database, Terminal } from 'lucide-react';
import { SectionType } from '@/types';
import { useInfraLens } from '@/context/InfraLensContext';

interface SystemAboutProps {
  onBack: () => void;
  onNavigate?: (section: SectionType) => void;
}

type AboutTab = 'MANIFESTO' | 'MODES' | 'EVOLUTION' | 'TYPOGRAPHY' | 'COLORS';

export const SystemAbout: React.FC<SystemAboutProps> = ({ onBack, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<AboutTab>('MANIFESTO');
  const { apps, books, concepts } = useInfraLens();

  const handleExportPDF = () => { window.print(); };

  const handleExportMarkdown = () => {
    const content = `# INFRALENS MASTER SPECIFICATION v4.2.0
Generated: ${new Date().toLocaleString()}

## 1. IDENTITY CORE
I am InfraLens. I am the Cognition Layer for Arista Systems Engineers and Sales teams (Account Managers, pre-sales SEs).
I do not make decisions; I externalize the complexity required for *you* to make them.

## 2. THE PROBLEM: COGNITIVE ENTROPY
The modern SE and account team faces "Context Collapse" between Micro-Physics, Macro-Strategy, and Human Dynamics.
I act as the externalized State Database (SysDB), decoupling knowledge from cognitive load.

## 3. OPERATING MODES
### 3.1 REASONING (Constraint Mapping)
Tools for framing problems and calculating tradeoffs: AI Fabric Designer, TCO Modeler.

### 3.2 PRACTICE (Applied Skills)
Interactive drills for building muscle memory: Linux Lab, CloudVision Field Guide.

### 3.3 REFERENCE (High-Fidelity Grounding)
Deep storage of truth: Release Note Deconstructor, Architecture Codex.

### 3.4 DELIVERY (Narrative Projection)
Systems for persuasive explanation: Briefing Theater, Demo Command.

## 4. HUMAN PRIMACY
I am not an agent. I do not act on your behalf. I amplify your judgment through rigorous, defensible logic artifacts.

[END OF SPEC]`;

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'infralens-manifesto-v4.2.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const NavItem = ({ tab, icon: Icon, label }: { tab: AboutTab, icon: any, label: string }) => (
    <button 
      onClick={() => setActiveTab(tab)}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200 group ${
        activeTab === tab ? 'bg-card-bg border-border text-primary shadow-lg' : 'text-secondary border-transparent hover:text-primary hover:bg-card-bg'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon size={18} className={activeTab === tab ? 'text-blue-400' : 'group-hover:text-secondary'} />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <ChevronRight size={14} className={`transition-transform ${activeTab === tab ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`} />
    </button>
  );

  return (
    <div className="about-shell min-h-screen bg-page-bg text-primary font-sans flex flex-col md:flex-row overflow-hidden selection:bg-blue-500/30">
      
      <aside className="no-print w-full md:w-72 border-b md:border-b-0 md:border-r border-border bg-card-bg flex flex-col shrink-0 z-30">
         <div className="p-8 flex items-center gap-3">
            <button onClick={onBack} className="group p-2 text-secondary hover:text-primary transition-colors">
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
                <div className="text-[10px] font-mono text-secondary uppercase tracking-[0.3em]">SystemAbout</div>
                <h1 className="text-xl font-serif font-bold leading-tight">InfraLens Core</h1>
                <span className="text-[9px] font-mono text-secondary uppercase tracking-widest">Field Version 4.2.0</span>
            </div>
         </div>

         <div className="flex-1 p-6 space-y-3">
            <NavItem tab="MANIFESTO" icon={Fingerprint} label="The Manifesto" />
            <NavItem tab="MODES" icon={Layers} label="Operating Modes" />
            <NavItem tab="EVOLUTION" icon={Zap} label="Evolution Pipeline" />
            <NavItem tab="TYPOGRAPHY" icon={Type} label="Typography & UX" />
            <NavItem tab="COLORS" icon={Palette} label="Chromatics" />
         </div>

         <div className="no-print border-t border-border p-6 space-y-3">
            <button onClick={handleExportPDF} className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-border bg-card-bg hover:border-emerald-400/50 transition">
               <div className="flex items-center gap-2 text-sm text-primary font-semibold">
                  <Download size={16} /> Export PDF Spec
               </div>
               <span className="text-[10px] font-mono text-secondary uppercase tracking-[0.3em]">v4.2</span>
            </button>
            <button onClick={handleExportMarkdown} className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-border bg-card-bg hover:border-blue-400/50 transition">
               <div className="flex items-center gap-2 text-sm text-primary font-semibold">
                  <Save size={16} /> Save .MD Log
               </div>
               <span className="text-[10px] font-mono text-secondary uppercase tracking-[0.3em]">Traceable</span>
            </button>
         </div>
      </aside>

      <main className="flex-1 overflow-y-auto relative">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
        <div className="max-w-5xl mx-auto p-6 md:p-12 space-y-10">
          
          {activeTab === 'MANIFESTO' && (
            <section className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-3">
                <Sparkles size={20} className="text-blue-400" />
                <div>
                  <p className="text-[10px] font-mono text-secondary uppercase tracking-[0.3em]">Core Identity</p>
                  <h2 className="text-5xl md:text-6xl font-serif font-bold tracking-tight">Human Primacy</h2>
                </div>
              </div>
              <p className="text-xl text-secondary leading-relaxed">
                I am InfraLens. I am the Cognition Layer for Arista Systems Engineers and Sales teams (Account Managers, pre-sales SEs). I do not act on your behalf. I amplify your judgment through rigorous, defensible logic artifacts.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl border border-border bg-card-bg/70">
                  <p className="text-[10px] font-mono text-secondary uppercase tracking-[0.3em]">Sizing Philosophy</p>
                  <p className="text-sm text-secondary">Headlines: 3xl–6xl serif for hero/sections with tight tracking. Card titles: xl–2xl serif. Body: sm–base sans with comfortable line-height (~1.5). Labels: 9–11px mono with 0.2–0.3em tracking. Status pills: 8–10px mono. Maintain a two-step contrast between title/subtext for clarity.</p>
                </div>
                <div className="p-5 rounded-2xl border border-border bg-card-bg/70">
                  <p className="text-[10px] font-mono text-secondary uppercase tracking-[0.3em]">Rhythm & Line Height</p>
                  <p className="text-sm text-secondary">Use 1.2–1.3 line-height on display/serif to keep headlines compact; 1.5 on body text for readability. Vertical rhythm: 12–16px gaps on micro elements, 20–24px between blocks. Avoid line-clamp on titles; clamp subtext only.</p>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'MODES' && (
            <section className="space-y-6 animate-fade-in">
              <header className="flex items-center gap-3">
                <LayoutGrid size={18} className="text-emerald-400" />
                <div>
                  <p className="text-[10px] font-mono text-secondary uppercase tracking-[0.3em]">Operating Modes</p>
                  <h3 className="text-3xl font-serif font-bold text-primary tracking-tight">The Four Pillars</h3>
                </div>
              </header>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl border border-border bg-card-bg/70">
                  <p className="text-sm font-semibold text-primary flex items-center gap-2"><Layers size={14} className="text-blue-400" /> Reasoning</p>
                  <p className="text-sm text-secondary">Constraint mapping and tradeoffs: AI Fabric Designer, TCO Modeler.</p>
                </div>
                <div className="p-5 rounded-2xl border border-border bg-card-bg/70">
                  <p className="text-sm font-semibold text-primary flex items-center gap-2"><Activity size={14} className="text-emerald-400" /> Practice</p>
                  <p className="text-sm text-secondary">Applied drills: Linux Lab, CloudVision Field Guide, Protocol Lab.</p>
                </div>
                <div className="p-5 rounded-2xl border border-border bg-card-bg/70">
                  <p className="text-sm font-semibold text-primary flex items-center gap-2"><Library size={14} className="text-indigo-400" /> Reference</p>
                  <p className="text-sm text-secondary">Grounded truth: Release Note Deconstructor, Architecture Codex.</p>
                </div>
                <div className="p-5 rounded-2xl border border-border bg-card-bg/70">
                  <p className="text-sm font-semibold text-primary flex items-center gap-2"><Target size={14} className="text-emerald-300" /> Delivery</p>
                  <p className="text-sm text-secondary">Persuasive projection: Briefing Theater, Demo Command, Narrative Playbook.</p>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'EVOLUTION' && (
            <section className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-3">
                <BrainCircuit size={18} className="text-emerald-400" />
                <div>
                  <p className="text-[10px] font-mono text-secondary uppercase tracking-[0.3em]">Pipeline</p>
                  <h3 className="text-3xl font-serif font-bold text-primary tracking-tight">Evolution Pipeline</h3>
                </div>
              </div>
              <div className="p-5 rounded-2xl border border-border bg-card-bg/70 space-y-2">
                <p className="text-sm text-secondary">Tracking the roadmap of new modules, refactors, and integrations. Each increment is versioned for auditability.</p>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm text-primary"><ShieldCheck size={14} className="text-emerald-400" /> Theme tokens + light/dark parity</div>
                  <div className="flex items-center gap-2 text-sm text-primary"><Zap size={14} className="text-blue-400" /> Evidence Locker for proofs/demos</div>
                  <div className="flex items-center gap-2 text-sm text-primary"><Code size={14} className="text-indigo-400" /> @aliases and modular design packages</div>
                  <div className="flex items-center gap-2 text-sm text-primary"><Monitor size={14} className="text-emerald-300" /> Quick start tiles for key apps</div>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'TYPOGRAPHY' && (
            <section className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-3">
                <Type size={18} className="text-blue-400" />
                <div>
                  <p className="text-[10px] font-mono text-secondary uppercase tracking-[0.3em]">Design System</p>
                  <h3 className="text-3xl font-serif font-bold text-primary tracking-tight">Typography & UX</h3>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl border border-border bg-card-bg/70 space-y-2">
                  <div className="text-sm font-semibold text-primary">Typefaces</div>
                  <p className="text-sm text-secondary">Inter for headings, labels, and body. JetBrains Mono for numerical data, part numbers, and code-like elements.</p>
                </div>
                <div className="p-5 rounded-2xl border border-border bg-card-bg/70 space-y-2">
                  <div className="text-sm font-semibold text-primary">Sizing & Rhythm</div>
                  <p className="text-sm text-secondary">Display: 48–72px with tight tracking; Titles: 20–32px; Body: 14–16px; Labels: 10–11px mono. Vertical rhythm 12–16px on micro elements, 20–24px between blocks.</p>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'COLORS' && (
            <section className="space-y-6 animate-fade-in">
              <header className="flex items-center gap-3">
                <Palette size={18} className="text-emerald-400" />
                <div>
                  <p className="text-[10px] font-mono text-secondary uppercase tracking-[0.3em]">Chromatics</p>
                  <h3 className="text-3xl font-serif font-bold text-primary tracking-tight">Resilient Palette</h3>
                </div>
              </header>
              <div className="grid md:grid-cols-3 gap-3">
                {[
                  { name: 'Primary', desc: 'Deep blues for hero + callouts.', swatch: 'bg-gradient-to-br from-[#0f172a] to-[#1d4ed8]' },
                  { name: 'Accent', desc: 'Emeralds for status + actions.', swatch: 'bg-gradient-to-br from-[#064e3b] to-[#10b981]' },
                  { name: 'Surface', desc: 'Card backgrounds, low-noise surfaces.', swatch: 'bg-gradient-to-br from-[#0b0b0f] to-[#1f2937]' }
                ].map((c) => (
                  <div key={c.name} className="p-4 rounded-2xl border border-border bg-card-bg/70 space-y-2">
                    <div className="w-full h-16 rounded-xl border border-border" style={{ backgroundImage: undefined }}><div className={`w-full h-full rounded-xl ${c.swatch}`}></div></div>
                    <div className="text-sm font-semibold text-primary">{c.name}</div>
                    <p className="text-xs text-secondary">{c.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="p-5 rounded-2xl border border-border bg-card-bg/80 flex flex-wrap gap-3 items-center justify-between">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-secondary">
              <Info size={14} className="text-blue-400" /> Integrations
            </div>
            <div className="flex gap-2 text-[11px] text-secondary">
              <button onClick={() => onNavigate?.(SectionType.CONCEPTS)} className="px-3 py-1 rounded-full border border-border hover:border-blue-400/50">Visual Essays</button>
              <button onClick={() => onNavigate?.(SectionType.BOOKS)} className="px-3 py-1 rounded-full border border-border hover:border-blue-400/50">Architecture Codex</button>
              <button onClick={() => onNavigate?.(SectionType.APPS)} className="px-3 py-1 rounded-full border border-border hover:border-blue-400/50">Forge</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
