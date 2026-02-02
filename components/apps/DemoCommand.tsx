
import React, { useState } from 'react';
import { ArrowLeft, Radar, ExternalLink, Copy, Check, Terminal, Zap, Activity, Globe, Wifi, Play, MessageSquare, AlertTriangle, ListChecks, X, Tags, RefreshCw, FileText, Network, BrainCircuit, Mic2, Box, Gauge, Cpu, TrendingUp, ShieldCheck, Download, AlertCircle, ChevronRight, Lock } from 'lucide-react';
import { DemoScenario } from '@/types';
import { GOLDEN_FLOW_GUIDES } from '@/data/demoData';

interface DemoCommandProps {
  onBack: () => void;
}

type ScenarioState = DemoScenario & { evidence?: { title: string; summary: string }[]; objection?: { title: string; trigger: string; counter: string } };

type PresetEvidence = { title: string; summary: string };
type PresetObjection = { title: string; trigger: string; counter: string };
type PresetScenario = DemoScenario & { evidence: PresetEvidence[]; objection: PresetObjection };

const demoPresets: PresetScenario[] = [
  {
    title: 'GxP Change Control (Life Sciences)',
    persona: 'Plant OT Lead',
    playbook: [
      { step: 'Snapshot & Approval', highlight: 'Schedule a GxP change window with approver and audit trail.', cliCommand: 'cvcli snapshot create --label gxp-change' },
      { step: 'Drift Detection & Rollback', highlight: 'Trigger a controlled change, detect drift, and rollback with evidence.', cliCommand: 'cvcli rollback latest --approve' },
      { step: 'Segmentation & MACsec', highlight: 'Validate role-based segmentation for production lines and MACsec MTU.', cliCommand: 'show mac security sessions' },
      { step: 'Telemetry Replay', highlight: 'Replay the window to prove no anomalies; export QA report.', cliCommand: 'cvcli telemetry replay --window "last change"' },
    ],
    cognitiveAngle: 'Safe, auditable change control with rollback proof for regulated environments.',
    evidence: [
      { title: 'Change Window Snapshot', summary: 'Snapshot + approval trail with timestamps and approver ID.' },
      { title: 'Rollback Proof', summary: 'Drift detected and rolled back; telemetry replay shows no anomalies post-change.' }
    ],
    objection: {
      title: 'Too Risky to Touch Production',
      trigger: '“Our validation runs can’t tolerate downtime.”',
      counter: 'Show safe-change flow with snapshot/approval, drift detection, and rollback evidence ready for QA.'
    }
  },
  {
    title: 'Campus Zero-Trust & Experience',
    persona: 'CIO',
    playbook: [
      { step: 'Identity Tagging', highlight: 'Apply policy by logical groups (staff/guest/IoT) not VLAN sprawl.', cliCommand: 'cv tag assign --group IoT' },
      { step: 'Health & Anomaly', highlight: 'Surface a client issue; show guided remediation via telemetry.', cliCommand: 'cvcli health clients --anomalies' },
      { step: 'Change Control', highlight: 'Push a segmented policy with approval and rollback checkpoint.', cliCommand: 'cvcli change push --with-rollback' },
      { step: 'Policy Validation', highlight: 'Verify hit counts and before/after health; export ops handoff.', cliCommand: 'cvcli policy hits --delta' },
    ],
    cognitiveAngle: 'Tag-driven simplicity with provable MTTR and safe automation.',
    evidence: [
      { title: 'Tag-Based Policy', summary: 'Policies bound to roles (staff/guest/IoT), not VLAN sprawl.' },
      { title: 'Health Delta', summary: 'Before/after client health and anomaly resolution captured with rollback checkpoint.' }
    ],
    objection: {
      title: 'Automation Risk',
      trigger: '“Automation might break campus services.”',
      counter: 'Use snapshots + approval + rollback; show health improvement and policy hit counts post-change.'
    }
  },
  {
    title: 'Genomics Burst Handling',
    persona: 'Bioinformatics Lead',
    playbook: [
      { step: 'Baseline Telemetry', highlight: 'Show burst patterns on sequencing lanes via LANZ/flow counters.', cliCommand: 'show interface counters rates' },
      { step: 'Deep Buffer & ECN Proof', highlight: 'Visualize buffer behavior; demonstrate ECN marks under load.', cliCommand: 'show qos counters ecn' },
      { step: 'Lossless Profile Check', highlight: 'Validate PFC/ECN config and MTU for RoCE/NVMe.', cliCommand: 'show pfc interface' },
      { step: 'Replay & Export', highlight: 'Replay the burst; export buffer/ECN evidence with mitigation checklist.', cliCommand: 'cvcli telemetry replay --window "last burst"' },
    ],
    cognitiveAngle: 'Deep-buffer/ECN assurance for spiky sequencing workloads.',
    evidence: [
      { title: 'LANZ Burst Capture', summary: 'Sequencing lane burst profile with zero drops and ECN marks observed.' },
      { title: 'PFC/ECN Validation', summary: 'Interfaces show PFC enabled, ECN marks under load, MTU consistent end-to-end.' }
    ],
    objection: {
      title: 'Bursty Workloads Risk Drops',
      trigger: '“Our sequencing runs spike; we can’t tolerate packet loss.”',
      counter: 'Show deep-buffer/ECN under stress with LANZ evidence; prove zero drops and controlled ECN marks.'
    }
  }
];

export const DemoCommand: React.FC<DemoCommandProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'PRE_FLIGHT' | 'FOUNDATIONS' | 'SCENARIO' | 'IMPROVEMENTS'>('PRE_FLIGHT');
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [scenario, setScenario] = useState<ScenarioState | null>(demoPresets[0]);
  const [selectedGuide, setSelectedGuide] = useState<DemoScenario | null>(null);
  
  // Pre-Flight State
  const [checks, setChecks] = useState<Record<string, boolean>>({});

  const toggleCheck = (id: string) => {
    setChecks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const allChecksPassed = ['outcome', 'anti_persona', 'connectivity', 'clean_slate', 'story_arc'].every(id => checks[id]);

  const handleExportBrief = (guide: DemoScenario) => {
      const content = `# DEMO BRIEFING: ${guide.title.toUpperCase()}
TARGET: ${guide.persona}
COGNITIVE ANGLE: ${guide.cognitiveAngle}

## EXECUTION SEQUENCE
${guide.playbook.map((step, i) => `${i+1}. ${step.step}\n   TALK TRACK: "${step.highlight}"\n   CLI: ${step.cliCommand || 'N/A'}\n`).join('\n')}

[GENERATED BY INFRALENS DEMO ENABLEMENT]`;

      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Demo_Brief_${guide.title.replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
  };

  const goldenFlows = [
    {
      id: 'flow-1',
      title: 'ZTP & Change Control',
      platform: 'CloudVision',
      goal: 'Demonstrate architectural consistency via software-defined provisioning.',
      keyHook: 'Compliance is our superpower. Explain the Snapshot feature.',
      icon: Zap,
      color: 'text-emerald-400'
    },
    {
      id: 'flow-2',
      title: 'The Time-Lag Anomaly',
      platform: 'CloudVision',
      goal: 'Prove causality by rewinding state to the exact moment of failure.',
      keyHook: 'SysDB stores state over time. Don\'t just show the fix; show the history.',
      icon: Activity,
      color: 'text-blue-400'
    },
    {
      id: 'flow-ai',
      title: 'AI Fabric Incast',
      platform: '7280R3 / LANZ',
      goal: 'Visualize micro-burst absorption in high-performance GPU clusters.',
      keyHook: 'Packet loss in AI = Idle GPUs. Show the deep buffer histogram.',
      icon: Cpu,
      color: 'text-violet-400'
    },
    {
      id: 'flow-mss',
      title: 'Zero Trust Zones',
      platform: 'CloudVision MSS',
      goal: 'Define security policy by logical group, not IP address.',
      keyHook: 'The network is the firewall. Segmentation happens at the port level.',
      icon: ShieldCheck,
      color: 'text-rose-400'
    },
    {
      id: 'flow-issu',
      title: 'Hitless ISSU',
      platform: 'CloudVision',
      goal: 'Validate decoupled state architecture via zero-loss upgrades.',
      keyHook: 'Decoupled state allows hitless OS restarts. Maintain uptime metrics.',
      icon: RefreshCw,
      color: 'text-amber-400'
    },
    {
      id: 'flow-4',
      title: 'Topology & Tagging',
      platform: 'CloudVision',
      goal: 'Transform physical spaghetti into logical business hierarchy.',
      keyHook: 'Tags are the API to the UI. Use them to manage scale effortlessly.',
      icon: Tags,
      color: 'text-indigo-400'
    }
  ];

  const objections = [
    { 
      id: 'obj-cost', 
      title: 'High CapEx Cost', 
      trigger: '"You are 20% more expensive than the commodity option."', 
      counter: 'CloudVision reduces change risk and rework by making intent, drift, and rollback provable—not just assumed.',
      fieldResponse: {
        acknowledge: 'Totally fair—CapEx is visible and it’s easy to benchmark on list price.',
        align: 'We’re optimizing for operational cost and risk reduction over the full lifecycle.',
        anchor: 'CloudVision makes change safety provable with snapshots, drift detection, and rollback evidence.',
        proof: 'We can show pre/post snapshots, compliance diffs, and time-stamped audit trails.',
        nextStep: 'If we quantify OpEx savings and avoided outage risk via CloudVision evidence, does that address the delta?'
      },
      icon: TrendingUp 
    },
    { 
      id: 'obj-complexity', 
      title: 'Complexity / Learning Curve', 
      trigger: '"My team only knows the Legacy CLI. This is too different."', 
      counter: 'CloudVision centralizes intent, validation, and state replay so operators aren’t jumping between tools and tribal knowledge.',
      fieldResponse: {
        acknowledge: 'That’s a real concern—tool sprawl kills adoption.',
        align: 'We want faster ramp and fewer handoffs, not a new cognitive tax.',
        anchor: 'CloudVision unifies intent, validation, and change execution with a single source of truth.',
        proof: 'We can walk a change end-to-end: define intent, validate, execute, and replay the state window.',
        nextStep: 'If we demo a day-1 workflow in CloudVision with your team, are we aligned?'
      },
      icon: BrainCircuit 
    },
    { 
      id: 'obj-lockin', 
      title: 'Vendor Lock-In', 
      trigger: '"I don\'t want to be trapped in your ecosystem."', 
      counter: 'CloudVision sits on open protocols and exposes audit-grade evidence you can export and retain.',
      fieldResponse: {
        acknowledge: 'Avoiding lock-in is smart—we don’t want to trade one dependency for another.',
        align: 'We want portability at the protocol layer and transparency in operations.',
        anchor: 'CloudVision operates on open standards and produces exportable evidence of behavior.',
        proof: 'We can show exported reports, change trails, and standards-based behavior on the wire.',
        nextStep: 'If we validate standards-based operation plus exportable evidence, does that de-risk the concern?'
      },
      icon: Lock 
    }
  ];

  // Updated to match STRATEGIC_ROADMAP.md (Non-Agentic, Artifact-focused)
  const improvements = [
    { id: 1, title: 'FRAMING CHECKLISTS', desc: 'Mandatory "Pre-Flight" constraints definition. Ensures the "Why" is established before the "How".', icon: ListChecks, color: 'text-indigo-400' },
    { id: 2, title: 'CAUSAL CHAIN VISUALIZER', desc: 'Interactive "Blast Radius" mapping. Hover over a spine to see downstream dependency impact in real-time.', icon: Network, color: 'text-emerald-400' },
    { id: 3, title: 'DECISION RECORD (ADR)', desc: 'Generate a PDF "Why we chose X" document automatically from the demo session flow.', icon: FileText, color: 'text-rose-400' },
    { id: 4, title: 'METRIC CONTEXTUALIZER', desc: 'Displays data with semantic meaning (e.g., "40Gbps" shown as "60% Capacity", not just a number).', icon: Gauge, color: 'text-blue-400' },
    { id: 5, title: 'OBJECTION LOGIC MAP', desc: 'A structured tree of architectural counters to common objections, replacing free-form arguing.', icon: BrainCircuit, color: 'text-amber-400' },
    { id: 6, title: 'BRIEFING MEMO BUILDER', desc: 'High-fidelity PDF export of narrative logic, transforming a transient demo into a permanent artifact.', icon: Box, color: 'text-zinc-400' },
    { id: 7, title: 'GENERATIVE TOPOLOGY', desc: 'AI draws the logical network diagram described in the script for whiteboard sessions.', icon: Cpu, color: 'text-violet-400' },
    { id: 8, title: 'VOICE REHEARSAL', desc: 'TTS engine reads the talk track aloud for commute listening. Passive internalization of the narrative.', icon: Mic2, color: 'text-cyan-400' }
  ];

  if (selectedGuide) {
     return (
        <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col selection:bg-emerald-500/30">
           <header className="h-16 border-b border-zinc-900 flex items-center justify-between px-8 bg-zinc-950 shrink-0 z-50">
              <div className="flex items-center gap-6">
                 <button onClick={() => setSelectedGuide(null)} className="p-2 text-zinc-500 hover:text-white transition-colors">
                    <ArrowLeft size={20} />
                 </button>
                 <div className="h-4 w-px bg-zinc-800"></div>
                 <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider">{selectedGuide.title}</h2>
                    <span className="text-[9px] font-mono text-emerald-500 uppercase tracking-widest">Active Sequence</span>
                 </div>
              </div>
              <div className="flex items-center gap-4">
                 <button onClick={() => handleExportBrief(selectedGuide)} className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-bold uppercase tracking-widest hover:text-white hover:border-emerald-500 transition-colors">
                    <Download size={14} /> Export Brief
                 </button>
                 <button onClick={() => setSelectedGuide(null)} className="p-2 text-zinc-500 hover:text-white"><X size={20}/></button>
              </div>
           </header>
           
           <main className="flex-1 overflow-y-auto p-8 md:p-16 relative">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
              
              <div className="max-w-4xl mx-auto space-y-12 animate-fade-in">
                 <div className="flex justify-between items-end border-b border-zinc-800 pb-8">
                    <div className="space-y-2">
                       <h2 className="text-5xl font-serif font-bold text-white leading-tight">{selectedGuide.title}</h2>
                       <p className="text-emerald-400 font-mono text-[10px] uppercase tracking-[0.4em]">Target Persona: {selectedGuide.persona}</p>
                    </div>
                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl hidden md:block">
                        <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">Logic Density</span>
                        <div className="flex gap-1 mt-1">
                           {[1,2,3,4,5].map(i => <div key={i} className="w-4 h-1 bg-emerald-500 rounded-full"></div>)}
                        </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8 space-y-8">
                       <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2"><ListChecks size={14}/> Execution Sequence</h3>
                       <div className="space-y-6">
                          {selectedGuide.playbook.map((step, idx) => (
                             <div key={idx} className="group p-6 bg-zinc-900 border border-zinc-800 rounded-3xl hover:border-zinc-600 transition-all">
                                <div className="flex gap-6">
                                   <div className="w-10 h-10 rounded-2xl bg-black border border-zinc-800 flex items-center justify-center font-serif font-bold text-emerald-500 shrink-0">
                                      0{idx + 1}
                                   </div>
                                   <div className="space-y-4 flex-1">
                                      <h4 className="text-xl font-bold text-white leading-tight">{step.step}</h4>
                                      
                                      <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-xl">
                                         <div className="flex items-center gap-2 text-[8px] font-black text-emerald-500 uppercase tracking-widest mb-2">
                                            <BrainCircuit size={10} /> Narrative Logic (The Why)
                                         </div>
                                         <p className="text-sm text-zinc-300 leading-relaxed font-medium italic">"{step.highlight}"</p>
                                      </div>

                                      {step.cliCommand && (
                                         <div className="mt-4 p-4 bg-black border border-zinc-800 rounded-xl relative group/code">
                                            <div className="flex justify-between items-center mb-2">
                                               <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest flex items-center gap-1"><Terminal size={10}/> Verification CLI</span>
                                            </div>
                                            <pre className="text-[10px] font-mono text-emerald-500/70 pl-2 leading-relaxed">
                                               {step.cliCommand}
                                            </pre>
                                            <button className="absolute top-3 right-3 p-1.5 rounded bg-zinc-900 border border-zinc-800 opacity-0 group-hover/code:opacity-100 transition-opacity hover:text-white">
                                               <Copy size={10} />
                                            </button>
                                         </div>
                                      )}
                                   </div>
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>

                    <div className="lg:col-span-4 space-y-8">
                       <div className="p-8 bg-emerald-500/5 border border-emerald-500/10 rounded-[2rem] relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-4 opacity-10"><Zap size={100} className="text-emerald-500" /></div>
                          <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-4">The Differentiator</h3>
                          <p className="text-lg leading-relaxed text-zinc-300 font-serif italic">
                             {selectedGuide.cognitiveAngle}
                          </p>
                       </div>

                       <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-3xl">
                          <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-6">Expert Framing</h4>
                          <ul className="space-y-4 text-xs text-zinc-400">
                             <li className="flex items-start gap-3">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 shadow-[0_0_8px_#10b981]"></div>
                                <span>Pause after the "Snapshot" diff to let the user process the forensic depth.</span>
                             </li>
                             <li className="flex items-start gap-3">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></div>
                                <span>Relate every technical step back to "Operational Uptime" or "Regulatory Compliance."</span>
                             </li>
                          </ul>
                       </div>
                    </div>
                 </div>
              </div>
           </main>
        </div>
     );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col md:flex-row overflow-hidden selection:bg-emerald-500/30">
      
      {/* SIDEBAR */}
      <aside className="w-full md:w-80 border-b md:border-b-0 md:border-r border-zinc-800 bg-zinc-950 flex flex-col shrink-0 z-30 overflow-y-auto h-[40vh] md:h-screen">
         <div className="p-8 border-b border-zinc-900">
            <button onClick={onBack} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mb-6">
                <ArrowLeft size={14} /> Systems Return
            </button>
            <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                    <Radar size={24} />
                </div>
                <div>
                    <h1 className="text-xl font-serif font-bold tracking-tight">Demo Enablement</h1>
                    <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mt-0.5">Architecture-First v4.0</div>
                </div>
            </div>
         </div>

         <div className="p-8 space-y-8 flex-1">
            <section className="space-y-4">
                <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">Cognitive Principles</h3>
                <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl space-y-4">
                   <div className="flex items-start gap-3">
                      <MessageSquare size={14} className="text-emerald-500 shrink-0 mt-1" />
                      <p className="text-[10px] text-zinc-400 leading-relaxed italic">"Prove the architecture, don't sell the feature. Use the CLI only to verify what the UI promised."</p>
                   </div>
                   <div className="flex items-start gap-3">
                      <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-1" />
                      <p className="text-[10px] text-zinc-400 leading-relaxed italic">"Pitfall: Getting stuck in 'Inventory'. Stay in 'Telemetry' and 'Events'—that is where the Cognition lives."</p>
                   </div>
                </div>
            </section>
         </div>
      </aside>

      {/* MAIN VIEW */}
      <main className="flex-1 overflow-y-auto bg-[#09090b] relative flex flex-col">
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>

         {/* NAVIGATION TABS */}
         <div className="h-16 border-b border-zinc-900 flex items-center px-8 bg-zinc-950/80 backdrop-blur-md shrink-0 z-20 overflow-x-auto">
            <div className="flex gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
               <button 
                 onClick={() => setActiveTab('PRE_FLIGHT')}
                 className={`px-4 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'PRE_FLIGHT' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
               >
                  Runbook Prep
               </button>
               <button 
                 onClick={() => setActiveTab('FOUNDATIONS')}
                 className={`px-4 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'FOUNDATIONS' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
               >
                 Foundations
               </button>
               <button 
                 onClick={() => setActiveTab('SCENARIO')}
                 className={`px-4 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'SCENARIO' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
               >
                 Scenario Architect
               </button>
               <button 
                 onClick={() => setActiveTab('IMPROVEMENTS')}
                 className={`px-4 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'IMPROVEMENTS' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
               >
                  Roadmap
               </button>
            </div>
         </div>

         {/* TAB CONTENT */}
         <div className="flex-1 p-8 md:p-16 relative z-10">
            
            {activeTab === 'PRE_FLIGHT' && (
                <div className="max-w-6xl mx-auto space-y-10 animate-fade-in">
                    <header className="space-y-3">
                        <div className="flex items-center gap-3 text-emerald-400">
                            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex items-center justify-center">
                                <ListChecks size={24} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-serif font-bold text-white">Runbook Prep</h2>
                                <p className="text-zinc-500 text-sm">Lock intent, sequence, and proof points before touching the UI.</p>
                            </div>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <section className="lg:col-span-5 space-y-6">
                            <div className="space-y-4">
                                {[
                                    { id: 'outcome', label: 'Business Outcome Defined', sub: 'Are we solving for MTTR, Compliance, or Agility?' },
                                    { id: 'anti_persona', label: 'Anti-Persona Identified', sub: 'Who is the enemy? (e.g. "Complexity", "Manual CLI", "Legacy Vendor")' },
                                    { id: 'connectivity', label: 'Lab Connectivity Verified', sub: 'Is the VPN active? Are the demo pods powered on?' },
                                    { id: 'clean_slate', label: 'Environment Reset', sub: 'Have previous changes been rolled back to a clean state?' },
                                    { id: 'story_arc', label: 'Narrative Arc Selected', sub: 'Do you have a beginning, middle, and end?' }
                                ].map((check) => (
                                    <button 
                                        key={check.id}
                                        onClick={() => toggleCheck(check.id)}
                                        className={`w-full p-6 rounded-2xl border flex items-center gap-6 transition-all ${checks[check.id] ? 'bg-emerald-900/10 border-emerald-500/50' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'}`}
                                    >
                                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${checks[check.id] ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-zinc-600 text-transparent'}`}>
                                            <Check size={16} strokeWidth={4} />
                                        </div>
                                        <div className="text-left">
                                            <h4 className={`text-lg font-bold ${checks[check.id] ? 'text-white' : 'text-zinc-400'}`}>{check.label}</h4>
                                            <p className="text-xs text-zinc-500">{check.sub}</p>
                                        </div>
                                    </button>
                                    ))}
                            </div>

                            <div className="pt-2">
                                <button 
                                    disabled={!allChecksPassed}
                                    onClick={() => setActiveTab('FOUNDATIONS')}
                                    className="w-full px-8 py-4 bg-white text-black font-bold uppercase tracking-widest rounded-xl hover:bg-emerald-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                >
                                    {allChecksPassed ? 'All Systems Go' : 'Complete Checks to Launch'} <ChevronRight size={16} />
                                </button>
                            </div>
                        </section>

                        <section className="lg:col-span-7 space-y-6">
                            <header>
                                <h3 className="text-3xl font-serif font-bold tracking-tight text-white">Objection Logic Map</h3>
                                <p className="text-sm text-zinc-500">Structured architectural counters to common field pushback. Logic over argument.</p>
                            </header>

                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                {objections.map((obj) => (
                                    <div key={obj.id} className="group p-8 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] hover:border-amber-500/50 transition-all flex flex-col shadow-2xl relative overflow-hidden h-full">
                                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity"><obj.icon size={64} className="text-amber-500" /></div>
                                        
                                        <div className="mb-8">
                                            <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest border border-amber-500/20 px-2 py-1 rounded bg-amber-900/10">Objection Pattern</span>
                                            <h3 className="text-2xl font-serif font-bold text-white mt-4">{obj.title}</h3>
                                        </div>

                                        <div className="space-y-6 flex-1">
                                            <div className="p-4 bg-black/50 rounded-xl border border-zinc-800">
                                                <div className="flex items-center gap-2 text-zinc-500 text-[10px] uppercase font-bold mb-2">
                                                    <AlertCircle size={12} className="text-rose-500" /> The Pushback
                                                </div>
                                                <p className="text-sm text-zinc-300 italic">"{obj.trigger}"</p>
                                            </div>

                                        <div className="relative pl-4 border-l-2 border-amber-500/50">
                                            <div className="flex items-center gap-2 text-amber-500 text-[10px] uppercase font-bold mb-2">
                                                <BrainCircuit size={12} /> The Logic Core
                                            </div>
                                            <p className="text-sm text-zinc-400 leading-relaxed">
                                                {obj.counter}
                                            </p>
                                        </div>

                                        <div className="p-4 bg-zinc-950/60 rounded-xl border border-zinc-800">
                                            <div className="flex items-center gap-2 text-emerald-400 text-[10px] uppercase font-bold mb-3">
                                                <MessageSquare size={12} /> Field Response
                                            </div>
                                            <div className="space-y-2 text-[11px] text-zinc-400 leading-relaxed">
                                                <p><span className="text-zinc-500">Acknowledge:</span> {obj.fieldResponse.acknowledge}</p>
                                                <p><span className="text-zinc-500">Align:</span> {obj.fieldResponse.align}</p>
                                                <p><span className="text-zinc-500">Architecture anchor:</span> {obj.fieldResponse.anchor}</p>
                                                <p><span className="text-zinc-500">Proof:</span> {obj.fieldResponse.proof}</p>
                                                <p><span className="text-zinc-500">Next step:</span> {obj.fieldResponse.nextStep}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        </section>
                    </div>
                </div>
            )}

            {activeTab === 'FOUNDATIONS' && (
               <div className="max-w-6xl mx-auto space-y-12 animate-fade-in">
                  <header className="max-w-2xl">
                     <h2 className="text-5xl font-serif font-bold tracking-tighter mb-4 text-white">Golden Flows</h2>
                     <p className="text-xl text-zinc-500 font-light">The foundational narratives every Arista Systems Engineer must master. Focus on the architectural hooks.</p>
                  </header>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {goldenFlows.map((flow) => (
                        <div key={flow.id} className="group p-8 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] hover:border-emerald-500/50 transition-all flex flex-col justify-between h-full shadow-2xl">
                           <div className="space-y-4">
                              <div className={`w-12 h-12 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center ${flow.color} group-hover:scale-110 transition-transform`}>
                                 <flow.icon size={24} />
                              </div>
                              <div>
                                 <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">{flow.platform}</div>
                                 <h3 className="text-2xl font-serif font-bold text-white group-hover:text-emerald-400 transition-colors leading-tight">{flow.title}</h3>
                              </div>
                              <p className="text-xs text-zinc-500 leading-relaxed">{flow.goal}</p>
                           </div>
                           
                           <div className="mt-8 pt-6 border-t border-zinc-800">
                              <div className="flex items-center gap-2 mb-4 text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em]">
                                 <BrainCircuit size={12} /> Narrative Arc
                              </div>
                              <p className="text-[10px] text-zinc-400 leading-relaxed italic">"{flow.keyHook}"</p>
                              <button 
                                 onClick={() => setSelectedGuide(GOLDEN_FLOW_GUIDES[flow.id])}
                                 className="w-full mt-6 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover:bg-white group-hover:text-black transition-all flex items-center justify-center gap-2"
                              >
                                 <Play size={10} fill="currentColor" /> Initialize Sequence
                              </button>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            )}

            {activeTab === 'SCENARIO' && (
               <div className="max-w-5xl mx-auto space-y-12 animate-fade-in">
                  <header className="space-y-2">
                    <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-emerald-300">Scenario Architect</p>
                    <h2 className="text-4xl font-serif font-bold tracking-tight text-white">Contextual Framing</h2>
                    <p className="text-sm text-zinc-500">Choose a pre-built scenario; briefs and playbooks are ready without typing.</p>
                  </header>

                  <div className="grid grid-cols-1 md:grid-cols-[1.4fr,1fr] gap-6 items-start">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {demoPresets.map((preset, idx) => (
                          <button
                            key={preset.title}
                            onClick={() => { setSelectedPreset(idx); setScenario(preset); }}
                            className={`p-4 rounded-2xl border text-left transition-all ${selectedPreset === idx ? 'bg-emerald-500/10 border-emerald-500/40 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-emerald-400/40'}`}
                          >
                            <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-emerald-400 mb-1">Preset</div>
                            <div className="text-lg font-semibold text-white leading-tight">{preset.title}</div>
                            <div className="text-[11px] text-zinc-500 mt-1">{preset.persona}</div>
                          </button>
                        ))}
                      </div>
                      <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-3">
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-blue-400">
                           <Target size={14} /> Tips for High-Trust Briefs
                        </div>
                        <ul className="text-sm text-zinc-400 space-y-2 list-disc list-inside">
                           <li>Anchor to a business outcome (MTTR, Compliance, Agility).</li>
                           <li>Lead with UI; use CLI only to validate.</li>
                           <li>Embed one objection and the logic counter.</li>
                           <li>End with an exportable artifact (brief, checklist, rollback plan).</li>
                        </ul>
                      </div>
                    </div>

                    {scenario && (
                      <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-emerald-300">Preset Brief</p>
                            <h3 className="text-xl font-serif font-bold text-white">{scenario.title}</h3>
                            <p className="text-xs text-zinc-500">{scenario.persona}</p>
                          </div>
                          <button onClick={() => handleExportBrief(scenario)} className="flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-white transition-colors">
                            <Download size={14} /> Export Brief
                          </button>
                        </div>
                        <div className="p-4 bg-emerald-950/10 border border-emerald-500/20 rounded-xl">
                          <div className="flex items-center gap-2 text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-2">
                            <MessageSquare size={10} /> Cognitive Angle
                          </div>
                          <p className="text-sm text-zinc-300 leading-relaxed italic">"{scenario.cognitiveAngle}"</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {scenario && (
                    <div className="space-y-8 animate-fade-in pb-20">
                      <div className="flex justify-between items-end border-b border-zinc-800 pb-6">
                         <div className="space-y-2">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase">Instructional Playbook</span>
                            <h2 className="text-3xl font-serif font-bold text-white leading-tight">{scenario.title}</h2>
                            <p className="text-emerald-400 font-mono text-[10px] uppercase tracking-[0.4em]">Target Persona: {scenario.persona}</p>
                         </div>
                         <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                            <span className="text-[10px] font-bold text-emerald-500">Ready to Run</span>
                         </div>
                      </div>

                      <div className="space-y-6">
                        {scenario.playbook.map((step, idx) => (
                          <div key={idx} className="group p-6 bg-zinc-900 border border-zinc-800 rounded-3xl hover:border-zinc-600 transition-all">
                             <div className="flex gap-6">
                                <div className="w-10 h-10 rounded-2xl bg-black border border-zinc-800 flex items-center justify-center font-serif font-bold text-emerald-500 shrink-0">
                                   0{idx + 1}
                                </div>
                                <div className="space-y-4 flex-1">
                                   <h4 className="text-xl font-bold text-white leading-tight">{step.step}</h4>
                                   
                                   <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-xl">
                                      <div className="flex items-center gap-2 text-[8px] font-black text-emerald-500 uppercase tracking-widest mb-2">
                                         <MessageSquare size={10} /> Narrative Logic
                                      </div>
                                      <p className="text-sm text-zinc-300 leading-relaxed font-medium italic">"{step.highlight}"</p>
                                   </div>

                                   {step.cliCommand && (
                                      <div className="mt-4 p-4 bg-black border border-zinc-800 rounded-xl relative group/code">
                                         <div className="flex justify-between items-center mb-2">
                                            <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest flex items-center gap-1"><Terminal size={10}/> Verification CLI</span>
                                         </div>
                                         <pre className="text-[10px] font-mono text-zinc-500 pl-2 leading-relaxed">
                                            {step.cliCommand}
                                         </pre>
                                         <button className="absolute top-3 right-3 p-1.5 rounded bg-zinc-900 border border-zinc-800 opacity-0 group-hover/code:opacity-100 transition-opacity">
                                            <Copy size={10} className="text-zinc-600" />
                                         </button>
                                      </div>
                                   )}
                                </div>
                             </div>
                         </div>
                        ))}
                      </div>

                      {(scenario.objection || scenario.evidence) && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                          {scenario.objection && (
                            <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-3 lg:col-span-2">
                              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-amber-500">
                                <AlertCircle size={12} /> Objection Logic
                              </div>
                              <div className="space-y-2">
                                <h4 className="text-sm font-semibold text-white">{scenario.objection.title}</h4>
                                <p className="text-xs text-zinc-400 italic">"{scenario.objection.trigger}"</p>
                                <p className="text-sm text-zinc-300">{scenario.objection.counter}</p>
                              </div>
                            </div>
                          )}
                          {scenario.evidence && (
                            <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-3">
                              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-blue-400">
                                <FileText size={12} /> Evidence Hooks
                              </div>
                              <ul className="space-y-2">
                                {scenario.evidence.map((ev) => (
                                  <li key={ev.title} className="text-sm text-zinc-300">
                                    <span className="font-semibold text-white">{ev.title}:</span> {ev.summary}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
               </div>
            )}

            {activeTab === 'IMPROVEMENTS' && (
               <div className="max-w-5xl mx-auto space-y-12 animate-fade-in">
                  <header className="max-w-2xl">
                     <h2 className="text-5xl font-serif font-bold tracking-tighter mb-4 text-white">Capability Evolution</h2>
                     <p className="text-xl text-zinc-500 font-light">Strategic upgrades to the Narrative Engine, aligning with the Cognition Layer roadmap.</p>
                  </header>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {improvements.map((imp) => (
                        <div key={imp.id} className="group p-6 bg-zinc-900 border border-zinc-800 rounded-3xl hover:border-blue-500/30 transition-all flex flex-col shadow-xl">
                           <div className="flex items-center gap-4 mb-4">
                              <div className={`p-3 bg-zinc-950 border border-zinc-800 rounded-2xl ${imp.color} group-hover:scale-110 transition-transform`}>
                                 <imp.icon size={20} />
                              </div>
                              <h3 className="text-sm font-bold text-white uppercase tracking-wider">{imp.title}</h3>
                           </div>
                           <p className="text-xs text-zinc-500 leading-relaxed flex-1">
                              {imp.desc}
                           </p>
                           <div className="mt-6 flex items-center justify-between text-[8px] font-mono uppercase tracking-widest">
                              <span className="text-zinc-700">Refinement Stage</span>
                              <span className="text-blue-500">Pipeline</span>
                           </div>
                        </div>
                     ))}
                  </div>
                  
                  <div className="p-8 bg-blue-500/5 border border-blue-500/10 rounded-[2.5rem] flex items-center justify-between">
                     <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                           <TrendingUp size={32} />
                        </div>
                        <div>
                           <h4 className="text-xl font-bold text-white">Continuous Innovation</h4>
                           <p className="text-sm text-zinc-500">All modules are grounded in the latest Arista Validated Designs and EOS firmware versions.</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <span className="block text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Build Status</span>
                        <span className="text-lg font-bold text-emerald-500">100% Signal</span>
                     </div>
                  </div>
               </div>
            )}
         </div>

         {/* FOOTER STATS */}
         <div className="h-10 bg-zinc-950 border-t border-zinc-900 px-8 flex items-center justify-between text-[8px] font-mono text-zinc-600 uppercase tracking-[0.4em] shrink-0 z-20">
            <div className="flex items-center gap-4">
               <span>Arista Demo Logic</span>
               <span className="w-1 h-1 bg-zinc-800 rounded-full"></span>
               <span className="text-emerald-900">Cognitive Scaffolding Active</span>
            </div>
            <div>
               System Integrity: Stable (Preset mode)
            </div>
         </div>
      </main>

    </div>
  );
};
