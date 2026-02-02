
import React, { useState, useMemo } from 'react';
import { ArrowLeft, Cloud, Terminal, CheckCircle2, ChevronRight, Zap, Layers, RefreshCw, Cpu, ShieldCheck, Box, Info, Layout, Play, MessageSquare, Activity, Search, History, MousePointer2, Wand2 } from 'lucide-react';

interface CloudVisionEnablementProps {
  onBack: () => void;
}

interface EnablementStep {
  title: string;
  description: string;
  cliSnippet?: string;
  uiFocus: string;
  insight: string;
  phase: 'DAY 0' | 'DAY 1' | 'STUDIO';
}

const ONBOARDING_STEPS: EnablementStep[] = [
  {
    phase: 'DAY 0',
    title: 'ZTP & PoE Bootstrap',
    description: 'The campus switch boots. ZTP handles the OS download while default PoE negotiation powers up attached VoIP phones and Access Points immediately.',
    cliSnippet: 'show zerotouch',
    uiFocus: 'Devices > ZTP Device Queue',
    insight: 'Truck rolls are expensive. We light up the closet remotely. ZTP ensures the switch is reachable before a human ever logs in.'
  },
  {
    phase: 'DAY 0',
    title: 'Spatial Topology',
    description: 'Campus topology is physical. Create containers for "Building 1" -> "Floor 2". Switches inherit global settings (DNS, NTP) based on their physical location.',
    uiFocus: 'Provisioning > Network Provisioning',
    insight: 'Inheritance is key. Move a switch into "Floor 2", and it automatically adopts the building\'s architectural standards.'
  },
  {
    phase: 'DAY 0',
    title: 'Wired-Wireless Unification',
    description: 'Provision the switch to automatically detect Arista APs via LLDP. CloudVision maps the physical link between the switch port and the AP.',
    cliSnippet: 'show lldp neighbors detail',
    uiFocus: 'Devices > Inventory',
    insight: 'One view for the whole edge. You don\'t manage switches and APs in separate silos anymore; the fabric is unified.'
  },
  {
    phase: 'DAY 0',
    title: 'PoE-Aware Change Control',
    description: 'Push the config. CloudVision\'s pre-checks validate not just syntax, but PoE budgets, ensuring you don\'t oversubscribe the power supply during the rollout.',
    uiFocus: 'Change Control > Validate',
    insight: 'Safety at the edge. We catch power budget violations during the config push, not during the brownout.'
  },
  {
    phase: 'DAY 1',
    title: 'Day 1: Telemetry & Dashboards',
    description: 'Now that the fabric is live, we transition to state-streaming. View real-time interface rates, temperature, and buffer utilization across the whole network.',
    cliSnippet: 'show queue-monitor length',
    uiFocus: 'Dashboards > Metric Explorer',
    insight: ' SNMP is dead. We stream 100% of state changes, allowing you to see micro-bursts that traditional polling would completely miss.'
  },
  {
    phase: 'DAY 1',
    title: 'Network-Wide Search',
    description: 'CloudVision acts as a relational database for your hardware. Search for a MAC address, IP, or VLAN and find exactly which port it is on in seconds.',
    uiFocus: 'Global Search (Top Bar)',
    insight: 'The search index is global. You no longer login to 20 switches to "trace a mac"—you just search it once in the portal.'
  },
  {
    phase: 'DAY 1',
    title: 'Compliance & Vulnerability',
    description: 'Monitor the fabric for configuration drift and security vulnerabilities. CloudVision maps your running code against Arista Security Advisories (CVEs).',
    uiFocus: 'Devices > Compliance Dashboard',
    insight: 'Compliance isn\'t a periodic audit anymore; it is a real-time state. You know instantly if a switch drifts from the architectural gold standard.'
  },
  {
    phase: 'DAY 1',
    title: 'The Time Machine (Forensics)',
    description: 'The ultimate Day 1 tool. Scroll back in time to see exactly what the network looked like at 2:00 AM last Tuesday. Diff the state before and after an event.',
    uiFocus: 'Global Time Slider (Bottom)',
    insight: 'Forensics is about causality. By diffing the "Running Config" and "State" over time, we reduce Mean Time to Resolution from hours to minutes.'
  },
  {
    phase: 'STUDIO',
    title: 'Model the Campus Data Layer',
    description: 'Define intent models for users, cameras, IoT, and APs. Capture VLANs, PoE classes, and segmentation tags as reusable data—not CLI. Note change windows and ownership before binding models to devices.',
    uiFocus: 'Studios > Campus Fabric > Templates (with change window metadata)',
    insight: 'Studios separates “what” from “how.” A consistent model kills drift before it starts.',
    cliSnippet: undefined
  },
  {
    phase: 'STUDIO',
    title: 'Map Profiles to Interfaces Visually',
    description: 'Drag-and-drop profiles onto switch ports, auto-validating PoE draw, LLDP expectations, authentication policies, and planned change windows before activation.',
    uiFocus: 'Studios > Interface Matrix (change window aware)',
    insight: 'Visual mapping accelerates rollouts and removes per-box guesswork.',
    cliSnippet: undefined
  },
  {
    phase: 'STUDIO',
    title: 'Generate & Verify Change Controls',
    description: 'Generate EOScfg from the studio model, run automatic pre-checks, and align with scheduled change windows before push. Sequenced change controls remain reviewable and reversible.',
    uiFocus: 'Change Control > Generated Plans (window + approvals)',
    insight: 'Intent in, validated config out. Repeatable, reviewable, reversible.',
    cliSnippet: undefined
  }
];

const PHASE_THEME: Record<'DAY 0' | 'DAY 1' | 'STUDIO', {
  badge: string;
  insightCard: string;
  insightText: string;
  insightHeading: string;
  progress: string;
  heroBorder: string;
  heroGradient: string;
  heroIcon: 'DAY0' | 'DAY1' | 'STUDIO';
  layerColor: string;
}> = {
  'DAY 0': {
    badge: 'text-blue-500 border-blue-900/30 bg-blue-900/10',
    insightCard: 'bg-blue-900/10 border-blue-500/20',
    insightText: 'text-blue-100',
    insightHeading: 'text-blue-500',
    progress: 'bg-blue-500',
    heroBorder: 'border-blue-500',
    heroGradient: 'from-blue-500/5',
    heroIcon: 'DAY0',
    layerColor: 'border-blue-500/50 bg-blue-500/10 text-blue-400'
  },
  'DAY 1': {
    badge: 'text-emerald-500 border-emerald-900/30 bg-emerald-900/10',
    insightCard: 'bg-emerald-900/10 border-emerald-500/20',
    insightText: 'text-emerald-100',
    insightHeading: 'text-emerald-400',
    progress: 'bg-emerald-500',
    heroBorder: 'border-emerald-500',
    heroGradient: 'from-emerald-500/5',
    heroIcon: 'DAY1',
    layerColor: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
  },
  'STUDIO': {
    badge: 'text-violet-400 border-violet-900/30 bg-violet-900/10',
    insightCard: 'bg-violet-900/10 border-violet-500/20',
    insightText: 'text-violet-100',
    insightHeading: 'text-violet-400',
    progress: 'bg-violet-500',
    heroBorder: 'border-violet-500',
    heroGradient: 'from-violet-500/5',
    heroIcon: 'STUDIO',
    layerColor: 'border-violet-500/50 bg-violet-500/10 text-violet-400'
  }
};

const SUPPORT_CONTENT: Record<'DAY 0' | 'DAY 1' | 'STUDIO', {
  outcomes: string[];
  partner: string[];
  safeguards: string[];
  metrics: string[];
}> = {
  'DAY 0': {
    outcomes: [
      'ZTP + PoE online without on-site touch',
      'Site hierarchy applied (building/floor defaults)',
      'Port profiles ready for LLDP device class'
    ],
    partner: [
      'Import golden build templates',
      'Pre-stage serials + PoE budgets',
      'Share rollback bundle for CAB approval'
    ],
    safeguards: [
      'Power budget validation per switch',
      'Auto-inheritance of DNS/NTP',
      'LLDP expected neighbors flagged'
    ],
    metrics: [
      'ZTP success rate / site',
      'Median boot-to-managed time',
      'Ports with correct profile on first push'
    ]
  },
  'DAY 1': {
    outcomes: [
      'Streaming telemetry live (no SNMP gaps)',
      'Compliance checks running hourly',
      'Time-travel snapshots available'
    ],
    partner: [
      'Pre-built dashboards per vertical',
      'Advisory pack for CVE remediations',
      'Saved searches for MAC/IP/VLAN traces'
    ],
    safeguards: [
      'Drift alerts vs. gold standard',
      'CVE watchlist mapped to inventory',
      'Time-slider diffs for change reviews'
    ],
    metrics: [
      'Drift MTTR (config -> repaired)',
      'Search-to-find time for endpoints',
      'Compliance pass rate per site'
    ]
  },
  'STUDIO': {
    outcomes: [
      'Intent models defined for roles/devices',
      'Profiles mapped to interfaces visually',
      'Change plans sequenced with rollback'
    ],
    partner: [
      'Shared studio templates for partners',
      'Approval gates per change window',
      'Export plans for CAB in PDF/JSON'
    ],
    safeguards: [
      'PoE/LLDP/auth checks before apply',
      'Change window + owner tracked in plan',
      'Auto-validation of required tags/VLANs'
    ],
    metrics: [
      'Time from model edit to deploy',
      'Failed validations caught pre-push',
      'Rollback-ready plans per week'
    ]
  }
};

export const CloudVisionEnablement: React.FC<CloudVisionEnablementProps> = ({ onBack }) => {
  const [selectedPhase, setSelectedPhase] = useState<'DAY 0' | 'DAY 1' | 'STUDIO' | null>(null);
  const [activeStepIdx, setActiveStepIdx] = useState(0);

  // Filter steps based on selection
  const activeSteps = useMemo(() => {
    if (!selectedPhase) return [];
    return ONBOARDING_STEPS.filter(step => step.phase === selectedPhase);
  }, [selectedPhase]);

  const currentStep = activeSteps[activeStepIdx];
  const theme = currentStep ? PHASE_THEME[currentStep.phase] : PHASE_THEME['DAY 0'];

  const handlePhaseSelect = (phase: 'DAY 0' | 'DAY 1' | 'STUDIO') => {
    setSelectedPhase(phase);
    setActiveStepIdx(0);
  };

  const handleBack = () => {
    if (selectedPhase) {
      setSelectedPhase(null);
      setActiveStepIdx(0);
    } else {
      onBack();
    }
  };

  const nextStep = () => {
    if (activeStepIdx < activeSteps.length - 1) setActiveStepIdx(activeStepIdx + 1);
  };

  const prevStep = () => {
    if (activeStepIdx > 0) setActiveStepIdx(activeStepIdx - 1);
  };

  // --- RENDER: MODULE SELECTION MENU ---
  if (!selectedPhase) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col overflow-hidden selection:bg-blue-500/30">
        <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-950 shrink-0 z-20">
          <div className="flex items-center gap-6">
              <button onClick={onBack} className="group p-2 text-zinc-500 hover:text-white transition-colors">
                  <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              </button>
              <div className="h-4 w-px bg-zinc-800"></div>
              <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400">
                      <Cloud size={18} />
                  </div>
                  <div>
                      <h1 className="font-serif font-bold text-lg tracking-tight leading-none">CloudVision Field Guide</h1>
                      <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mt-1">Select Drill</span>
                  </div>
              </div>
          </div>
        </header>

         <main className="flex-1 p-6 md:p-10 overflow-y-auto relative">
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
           
           <div className="max-w-5xl mx-auto space-y-8 relative z-10">
              <div className="text-center space-y-2">
                 <h2 className="text-4xl md:text-5xl font-serif font-bold text-white tracking-tighter">Operational Readiness</h2>
                 <p className="text-zinc-500 text-base md:text-lg max-w-2xl mx-auto">Choose your enablement path. From zero-touch fabrication to day-two cognitive operations.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 
                 {/* DAY 0 CARD - CAMPUS EDITION */}
                 <button 
                    onClick={() => handlePhaseSelect('DAY 0')}
                    className="group relative bg-zinc-900 border border-zinc-800 rounded-[3rem] p-10 text-left hover:border-blue-500/50 hover:bg-zinc-900/80 transition-all duration-500 hover:-translate-y-2 overflow-hidden shadow-2xl"
                 >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10 flex flex-col h-full">
                       <div className="w-16 h-16 rounded-2xl bg-blue-900/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-8 group-hover:scale-110 transition-transform">
                          <Zap size={32} />
                       </div>
                       <div className="space-y-2 mb-6">
                          <span className="text-xs font-bold text-blue-500 uppercase tracking-widest border border-blue-900/50 px-3 py-1 rounded-full bg-blue-900/10">Day 0 Protocol</span>
                          <h3 className="text-3xl font-serif font-bold text-white">Campus Initialization</h3>
                       </div>
                       <p className="text-sm text-zinc-400 leading-relaxed mb-12 max-w-sm">
                          Master the Campus Edge. Learn ZTP for PoE switches, configure 802.1X identity security, and unify wired/wireless management.
                       </p>
                       <div className="mt-auto flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 group-hover:text-white transition-colors">
                          Start Drill <ChevronRight size={14} />
                       </div>
                    </div>
                 </button>

                 {/* DAY 1 CARD */}
                 <button 
                    onClick={() => handlePhaseSelect('DAY 1')}
                    className="group relative bg-zinc-900 border border-zinc-800 rounded-[3rem] p-10 text-left hover:border-emerald-500/50 hover:bg-zinc-900/80 transition-all duration-500 hover:-translate-y-2 overflow-hidden shadow-2xl"
                 >
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10 flex flex-col h-full">
                       <div className="w-16 h-16 rounded-2xl bg-emerald-900/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-8 group-hover:scale-110 transition-transform">
                          <Activity size={32} />
                       </div>
                       <div className="space-y-2 mb-6">
                          <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest border border-emerald-900/50 px-3 py-1 rounded-full bg-emerald-900/10">Day 1 Protocol</span>
                          <h3 className="text-3xl font-serif font-bold text-white">Cognitive Operations</h3>
                       </div>
                       <p className="text-sm text-zinc-400 leading-relaxed mb-12 max-w-sm">
                          Move beyond "Lights On." Deep dive into state-streaming telemetry, real-time compliance auditing, and forensic time-travel debugging.
                       </p>
                       <div className="mt-auto flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 group-hover:text-white transition-colors">
                          Start Drill <ChevronRight size={14} />
                       </div>
                   </div>
                </button>

                 {/* STUDIO CARD */}
                 <button 
                    onClick={() => handlePhaseSelect('STUDIO')}
                    className="group relative bg-zinc-900 border border-zinc-800 rounded-[3rem] p-10 text-left hover:border-violet-500/50 hover:bg-zinc-900/80 transition-all duration-500 hover:-translate-y-2 overflow-hidden shadow-2xl md:col-span-2"
                 >
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10 flex flex-col h-full">
                       <div className="w-16 h-16 rounded-2xl bg-violet-900/20 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-8 group-hover:scale-110 transition-transform">
                          <Wand2 size={32} />
                       </div>
                       <div className="space-y-2 mb-6">
                          <span className="text-xs font-bold text-violet-400 uppercase tracking-widest border border-violet-900/50 px-3 py-1 rounded-full bg-violet-900/10">Studios</span>
                          <h3 className="text-3xl font-serif font-bold text-white">CloudVision Studios</h3>
                       </div>
                       <p className="text-sm text-zinc-400 leading-relaxed mb-12 max-w-2xl">
                          Model intent, map profiles to ports visually, and generate validated change controls from a single data layer.
                       </p>
                       <div className="mt-auto flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 group-hover:text-white transition-colors">
                          Start Studio <ChevronRight size={14} />
                       </div>
                    </div>
                 </button>

              </div>
           </div>
        </main>
      </div>
    );
  }

  // --- RENDER: ACTIVE MODULE VIEW ---
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col overflow-hidden selection:bg-blue-500/30">
      {/* HEADER */}
      <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-950 shrink-0 z-20">
        <div className="flex items-center gap-6">
            <button onClick={handleBack} className="group p-2 text-zinc-500 hover:text-white transition-colors">
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <div className="h-4 w-px bg-zinc-800"></div>
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400">
                    <Cloud size={18} />
                </div>
                <div>
                    <h1 className="font-serif font-bold text-lg tracking-tight leading-none">CloudVision Field Guide</h1>
                    <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mt-1">Operational Enablement v3.3</span>
                </div>
            </div>
        </div>
           <div className="flex items-center gap-4">
           <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Step {activeStepIdx + 1} of {activeSteps.length}</span>
           <div className="flex gap-1">
              {activeSteps.map((_, i) => (
                <div key={i} className={`h-1 w-3 rounded-full transition-all duration-300 ${i <= activeStepIdx ? theme.progress : 'bg-zinc-800'}`}></div>
              ))}
           </div>
        </div>
      </header>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 relative flex flex-col md:flex-row overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>

         {/* LEFT: CONTENT & NARRATIVE */}
         <div className="flex-1 overflow-y-auto p-6 md:p-12 relative z-10">
            <div className="max-w-3xl space-y-8 animate-fade-in">
               <div className="space-y-6">
                  <div className="flex items-center gap-4">
                     <div className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest ${theme.badge}`}>
                        {currentStep.phase}
                     </div>
                     <div className="h-px w-8 bg-zinc-800"></div>
                     <span className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest">Enablement Module</span>
                  </div>
                  
                  <h2 className="text-5xl md:text-7xl font-serif font-bold tracking-tighter leading-none text-white">
                    {currentStep.title}
                  </h2>
                  
                  <p className="text-2xl text-zinc-400 font-light leading-relaxed">
                     {currentStep.description}
                  </p>
               </div>

               {/* Outcomes and safeguards for the current phase */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-zinc-900/40 border border-zinc-800 rounded-[1.5rem] p-5">
                  {[
                    { label: 'Outcomes', items: SUPPORT_CONTENT[currentStep.phase].outcomes },
                    { label: 'Partner Toolkit', items: SUPPORT_CONTENT[currentStep.phase].partner },
                    { label: 'Safeguards', items: SUPPORT_CONTENT[currentStep.phase].safeguards },
                    { label: 'Metrics', items: SUPPORT_CONTENT[currentStep.phase].metrics }
                  ].map((card) => (
                    <div key={card.label} className="p-3 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-2">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                        <CheckCircle2 size={12} className="text-blue-400" /> {card.label}
                      </div>
                      <ul className="space-y-1">
                        {card.items.map((item) => (
                          <li key={item} className="text-sm text-zinc-300 flex gap-2">
                            <span className="text-blue-500">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
                  <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-[1.75rem] space-y-3 shadow-xl">
                     <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Layout size={14} /> UI Focus Area
                     </h4>
                     <p className="text-lg font-medium text-white">{currentStep.uiFocus}</p>
                  </div>
                  <div className={`p-6 rounded-[1.75rem] space-y-3 shadow-xl border ${theme.insightCard}`}>
                     <h4 className={`text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 ${theme.insightHeading}`}>
                        <MessageSquare size={14} /> Field Insight
                     </h4>
                     <p className={`text-lg italic leading-relaxed ${theme.insightText}`}>"{currentStep.insight}"</p>
                  </div>
               </div>

               {currentStep.cliSnippet && (
                  <div className="space-y-4">
                     <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                        <Terminal size={14} /> Verification Command
                     </h4>
                     <div className="p-8 bg-black border border-zinc-800 rounded-3xl font-mono text-blue-400/80 shadow-inner group relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                        <code className="text-xl">{currentStep.cliSnippet}</code>
                        <div className="absolute top-4 right-6 text-[9px] text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity font-bold">EOS_KERNEL_STATE_STREAM</div>
                     </div>
                  </div>
               )}

               <div className="pt-8 flex items-center gap-4 flex-wrap">
                  <div className="flex gap-2">
                    <button 
                       onClick={prevStep} 
                       disabled={activeStepIdx === 0}
                       className="p-4 rounded-2xl border border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-600 transition-all disabled:opacity-10 disabled:cursor-not-allowed"
                    >
                       <ChevronRight size={24} className="rotate-180" />
                    </button>
                    {activeStepIdx < activeSteps.length - 1 ? (
                      <button 
                         onClick={nextStep}
                         className="px-10 py-4 bg-white text-black font-bold rounded-2xl flex items-center gap-3 hover:bg-blue-50 hover:scale-105 transition-all shadow-2xl shadow-white/5"
                      >
                         Continue Drill <ChevronRight size={20} />
                      </button>
                    ) : (
                      <button 
                         onClick={handleBack}
                         className="px-10 py-4 bg-emerald-600 text-white font-bold rounded-2xl flex items-center gap-3 hover:bg-emerald-500 hover:scale-105 transition-all shadow-2xl shadow-emerald-900/20"
                      >
                         Path Complete <CheckCircle2 size={20} />
                      </button>
                    )}
                  </div>
                  
                  <div className="hidden lg:block">
                     <span className="text-[10px] font-mono text-zinc-700 uppercase tracking-[0.4em]">Continuity Protocol Active</span>
                  </div>
               </div>
            </div>
         </div>

         {/* RIGHT: VISUAL SCHEMATIC */}
         <div className="w-full md:w-96 lg:w-[500px] bg-zinc-900 border-l border-zinc-800 p-10 flex flex-col items-center justify-center relative overflow-hidden shrink-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)]"></div>
            
            <div className="relative z-10 w-full max-w-xs flex flex-col items-center gap-16">
                
                {/* Visual State Mapping */}
                <div className={`w-40 h-40 rounded-[3rem] bg-zinc-950 border-2 transition-all duration-1000 flex items-center justify-center shadow-2xl relative overflow-hidden group ${theme.heroBorder}`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${theme.heroGradient} to-transparent`}></div>
                    {theme.heroIcon === 'DAY0' && <Zap size={64} className="text-blue-500 group-hover:scale-110 transition-transform" />}
                    {theme.heroIcon === 'DAY1' && <Activity size={64} className="text-emerald-500 group-hover:scale-110 transition-transform animate-pulse" />}
                    {theme.heroIcon === 'STUDIO' && <Wand2 size={64} className="text-violet-400 group-hover:scale-110 transition-transform" />}
                </div>

                <div className="flex flex-col items-center gap-8 w-full">
                    {/* Abstract Logic Layers */}
                    {[
                      { icon: Layers, label: 'Provisioning', active: selectedPhase === 'DAY 0' },
                      { icon: ShieldCheck, label: 'Compliance', active: selectedPhase === 'DAY 1' && activeStepIdx >= 2 },
                      { icon: History, label: 'Forensics', active: selectedPhase === 'DAY 1' && activeStepIdx >= 3 },
                      { icon: MousePointer2, label: 'Intent Mapping', active: selectedPhase === 'STUDIO' },
                      { icon: Layout, label: 'Studios Engine', active: selectedPhase === 'STUDIO' && activeStepIdx >= 1 }
                    ].map((layer, i) => (
                       <div key={i} className={`flex items-center gap-6 w-full transition-all duration-700 ${layer.active ? 'opacity-100 translate-x-0' : 'opacity-10 translate-x-10'}`}>
                          <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${layer.active ? theme.layerColor : 'border-zinc-800 text-zinc-800'}`}>
                             <layer.icon size={20} />
                          </div>
                          <div className="flex-1">
                             <div className={`h-1 rounded-full overflow-hidden bg-zinc-800`}>
                                <div className={`h-full transition-all duration-1000 ${layer.active ? theme.progress : 'bg-transparent'} ${layer.active ? 'w-full' : 'w-0'}`}></div>
                             </div>
                             <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mt-1 block">{layer.label}</span>
                          </div>
                       </div>
                    ))}
                </div>

                {/* Status HUD (Small) */}
                <div className="p-6 bg-zinc-950/80 backdrop-blur-xl border border-zinc-800 rounded-3xl w-full">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">System Load</span>
                        <span className="text-[10px] font-mono text-emerald-500">LOW</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Grounding</span>
                        <span className="text-[10px] font-mono text-blue-500">VERIFIED</span>
                    </div>
                </div>
            </div>

            {/* Bottom Decoration */}
            <div className="absolute bottom-10 left-10 flex gap-12 font-mono text-[8px] text-zinc-700 tracking-[0.6em] uppercase">
               <span>Arista_Enablement</span>
               <span>v3.3_Field_Guide</span>
            </div>
         </div>
      </main>

      {/* FOOTER */}
      <footer className="h-12 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between px-8 shrink-0 z-20">
         <div className="flex items-center gap-4 text-[9px] font-mono text-zinc-600 uppercase tracking-[0.4em]">
            <span>Cognitive Operations Hub</span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-blue-900">Uplink Stable</span>
         </div>
         <div className="flex items-center gap-3">
            <span className="text-[8px] font-mono text-zinc-700 uppercase">Latency: 4ms</span>
            <div className="w-px h-3 bg-zinc-800"></div>
            <span className="text-[8px] font-mono text-zinc-700 uppercase">Arista OS // Strategic Layer</span>
         </div>
      </footer>
    </div>
  );
};
