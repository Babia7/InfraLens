
import React from 'react';
import { ArrowLeft, Globe, Zap, ShieldCheck, Book, ExternalLink, Satellite, Monitor, Layout, Search, Grid, HelpCircle, GraduationCap, Cloud, Code, Wifi, Activity, MessageSquare } from 'lucide-react';
import { lifeSciencesReferences } from '@/data/lifesciences';

interface ResourceHubProps {
  onBack: () => void;
}

interface ResourceItem {
  label: string;
  url?: string;
  icon: any;
  desc: string;
  tag: string;
  color: string;
}

interface ResourceCategory {
  title: string;
  items: ResourceItem[];
}

const CATEGORIES: ResourceCategory[] = [
  {
    title: 'CloudVision Ecosystem',
    items: [
      { label: 'CV Help Center', url: 'https://www.arista.com/en/cg-cv', icon: Cloud, desc: 'Central hub for all CloudVision configuration and operational guides.', tag: 'DOCS', color: 'blue' },
      { label: 'Programmability / API', url: 'https://www.arista.com/en/support/toi/cloudvision-api', icon: Code, desc: 'Advanced integration via Rest API, gRPC, and Python SDKs.', tag: 'DEV', color: 'indigo' },
      { label: 'CV-CUE Guide', url: 'https://www.arista.com/en/cg-cv-cue', icon: Wifi, desc: 'Full lifecycle management for cognitive campus wireless.', tag: 'WIRELESS', color: 'cyan' },
      { label: 'TerminAttr Details', url: 'https://community.arista.com/s/article/terminattr-toi', icon: Activity, desc: 'Deep-dive into the state-streaming agent powering the fabric.', tag: 'AGENT', color: 'emerald' }
    ]
  },
  {
    title: 'Support & Documentation',
    items: [
      { label: 'Arista Community', url: 'https://community.arista.com', icon: Globe, desc: 'Knowledge base, forums, and technical advisories.', tag: 'PUBLIC', color: 'blue' },
      { label: 'Software Downloads', url: 'https://www.arista.com/en/support/software-download', icon: Zap, desc: 'EOS images, CloudVision, and ZTP boot files.', tag: 'SECURE', color: 'indigo' },
      { label: 'Technical Docs', url: 'https://www.arista.com/en/support/product-documentation', icon: Book, desc: 'Configuration guides and hardware specifications.', tag: 'PUBLIC', color: 'sky' },
      { label: 'CVE Tracker', url: 'https://www.arista.com/en/support/advisories-notices', icon: ShieldCheck, desc: 'Security advisories and vulnerability management.', tag: 'CRITICAL', color: 'rose' },
      { label: 'Topology Overview', url: 'https://www.arista.io/help/articles/topology-overview', icon: Globe, desc: 'Arista Topology overview and walkthroughs in the arista.io help center.', tag: 'GUIDE', color: 'emerald' }
    ]
  },
  {
    title: 'Field Readiness',
    items: [
      { label: 'Learning Center', url: 'https://www.arista.com/en/support/training', icon: GraduationCap, desc: 'ACE certifications and advanced cloud technical drills.', tag: 'ENABLEMENT', color: 'emerald' },
      { label: 'Webinar Series', url: 'https://www.arista.com/en/webinars', icon: Monitor, desc: 'Live architectural deep-dives and product reveals.', tag: 'COMMUNITY', color: 'violet' },
      { label: 'CloudVision Labs', url: 'https://www.arista.com/en/products/cloudvision-training', icon: Satellite, desc: 'Step-by-step technical drills for network operations.', tag: 'EXPERT', color: 'cyan' }
    ]
  },
  {
    title: 'Partner & Sales Ecosystem',
    items: [
      { label: 'Partner Portal', url: 'https://partners.arista.com', icon: Layout, desc: 'Deal registration, marketing collateral, and incentives.', tag: 'PRIVATE', color: 'amber' },
      { label: 'TCO ROI Modeler', url: 'https://www.arista.com/en/products/tco-calculator', icon: Grid, desc: 'Comparative financial analysis tools for stakeholders.', tag: 'STRATEGY', color: 'teal' },
      { label: 'Salesforce Central', url: 'https://arista.my.salesforce.com', icon: Search, desc: 'Internal opportunity management and CRM.', tag: 'INTERNAL', color: 'zinc' }
    ]
  },
  {
    title: 'Unified Glossary',
    items: [
      { label: 'Evidence Locker', icon: Activity, desc: 'Shared proof/demo commands and artifacts used across Navigator, Narrative, Protocol Lab, and Briefing. Accessible via the Evidence drawer.', tag: 'GLOSSARY', color: 'emerald' },
      { label: 'Teleprompter Handoff', icon: Monitor, desc: 'Narrative beats can be promoted to Briefing Theater teleprompter; Briefing imports from local handoff context.', tag: 'GLOSSARY', color: 'blue' },
      { label: 'Sales ↔ Narrative Sync', icon: MessageSquare, desc: 'Sales Playbook pushes persona/vertical, objections, and proof points into Narrative; apply/dismiss prompt keeps stories aligned.', tag: 'GLOSSARY', color: 'indigo' },
      { label: 'Validated Design Navigator', icon: Globe, desc: 'Design kits with topology/RT/MTU, AVD/CV exports, and Protocol Lab drills for brownfield/greenfield paths.', tag: 'GLOSSARY', color: 'cyan' },
      { label: 'Protocol Collision Mapper', icon: ShieldCheck, desc: 'Redistribution/conflict scenarios with detection, mitigation, and references; linked from Protocol Lab.', tag: 'GLOSSARY', color: 'rose' },
      { label: 'Proof/Demo Kits', icon: Zap, desc: 'Reusable commands/assets embedded in Narrative beats and Evidence Locker for consistent demos.', tag: 'GLOSSARY', color: 'amber' }
    ]
  },
  {
    title: 'Life Sciences',
    items: lifeSciencesReferences.map((ref) => ({
      label: ref.title,
      url: ref.url,
      icon: MessageSquare,
      desc: ref.summary || '',
      tag: 'LIFE SCIENCES',
      color: 'teal'
    }))
  }
];

export const ResourceHub: React.FC<ResourceHubProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col overflow-hidden selection:bg-blue-500/30">
      
      {/* HEADER */}
      <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-8 bg-zinc-950 shrink-0 z-50">
        <div className="flex items-center gap-6">
            <button onClick={onBack} className="group p-2 text-zinc-500 hover:text-white transition-colors">
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <div className="h-4 w-px bg-zinc-800"></div>
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400">
                    <Grid size={20} />
                </div>
                <div>
                    <h1 className="text-sm font-bold uppercase tracking-wider">Strategic Resource Hub</h1>
                    <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Global Ecosystem Access</span>
                </div>
            </div>
        </div>
        <div className="flex items-center gap-4">
           <div className="bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">Uplink Stable</span>
           </div>
        </div>
      </header>

      {/* CONTENT AREA */}
      <main className="flex-1 overflow-y-auto relative p-8 md:p-16">
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
         
         <div className="max-w-6xl mx-auto space-y-20 animate-fade-in pb-32 relative z-10">
            
            <header className="max-w-2xl">
               <h2 className="text-5xl md:text-7xl font-serif font-bold tracking-tighter mb-6 text-white leading-tight">Portals of the <span className="text-blue-600 italic">Renaissance</span></h2>
               <p className="text-xl text-zinc-500 font-light leading-relaxed">
                  The unified gateway to Arista's global intelligence network. Secure access to validated designs, firmware substrates, and partner enablement.
               </p>
            </header>

            <div className="space-y-16">
               {CATEGORIES.map((category) => (
                  <section key={category.title} className="space-y-8">
                     <div className="flex items-center gap-4">
                        <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-zinc-600 whitespace-nowrap">{category.title}</h3>
                        <div className="h-px w-full bg-zinc-900"></div>
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {category.items.map((item) => (
                           <div 
                              key={item.label}
                              className="group p-8 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] hover:border-blue-500/40 hover:bg-zinc-900/80 transition-all flex flex-col justify-between h-full shadow-xl relative overflow-hidden"
                           >
                              <div className={`absolute -top-10 -right-10 w-32 h-32 bg-${item.color}-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                              
                              <div className="space-y-6 relative z-10">
                                 <div className={`w-14 h-14 rounded-2xl bg-${item.color}-500/10 border border-${item.color}-500/20 flex items-center justify-center text-${item.color}-400 group-hover:scale-110 transition-transform`}>
                                    <item.icon size={28} />
                                 </div>
                                 <div>
                                    <div className="flex justify-between items-start mb-2">
                                       <h4 className="text-2xl font-serif font-bold text-white leading-tight">{item.label}</h4>
                                       {item.url && <ExternalLink size={16} className="text-zinc-700 group-hover:text-blue-500 transition-colors" />}
                                    </div>
                                    <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">{item.desc}</p>
                                 </div>
                              </div>

                              <div className="mt-8 pt-6 border-t border-zinc-800 flex justify-between items-center relative z-10">
                                 <span className="text-[9px] font-mono font-bold text-zinc-600 uppercase tracking-widest">{item.tag}</span>
                                 {item.url && (
                                   <a
                                     href={item.url}
                                     target="_blank"
                                     rel="noopener noreferrer"
                                     className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                   >
                                      Launch Portal
                                   </a>
                                 )}
                              </div>
                           </div>
                        ))}
                     </div>
                  </section>
               ))}
            </div>

            {/* AI HELP SECTION */}
            <section className="pt-20">
               <div className="p-12 rounded-[3rem] bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 group">
                  <div className="absolute inset-0 bg-blue-500/5 opacity-50"></div>
                  <div className="relative z-10 max-w-xl">
                     <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white mb-6 shadow-[0_0_30px_rgba(59,130,246,0.4)]">
                        <HelpCircle size={24} />
                     </div>
                     <h3 className="text-3xl font-serif font-bold text-white mb-4">Can't find a specific spec?</h3>
                     <p className="text-zinc-500 leading-relaxed">The Intelligence-Kernel is trained on all Arista public and partner documentation. Use the search grounding in the Codex for specific technical queries.</p>
                  </div>
                  <div className="relative z-10 shrink-0">
                     <button className="px-10 py-5 bg-white text-black font-bold uppercase tracking-widest rounded-2xl hover:bg-blue-100 transition-all shadow-2xl">
                        Open Global Search
                     </button>
                  </div>
               </div>
            </section>

         </div>
      </main>

      {/* SYSTEM STATS */}
      <div className="h-10 bg-zinc-950 border-t border-zinc-900 px-8 flex items-center justify-between text-[8px] font-mono text-zinc-600 uppercase tracking-[0.4em] shrink-0 z-20">
         <div className="flex items-center gap-4">
            <span>Arista Portal Network</span>
            <span className="w-1 h-1 bg-zinc-800 rounded-full"></span>
            <span className="text-blue-900">Module: HUB-EXT-01</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span>Ecosystem Synchronized</span>
         </div>
      </div>

    </div>
  );
};
