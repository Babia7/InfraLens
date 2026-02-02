
import React, { useState } from 'react';
import { ArrowLeft, Target, Shield, Zap, Globe, Beaker, Database, Activity, ChevronRight, LayoutGrid, CheckCircle2, AlertTriangle, Tv, X, ShieldCheck, History, Fingerprint, Search, Box, Layers, Wifi, Radio } from 'lucide-react';

interface VerticalMatrixProps {
  onBack: () => void;
}

interface DesignDiveContent {
  title: string;
  concept: string;
  technicalPillars: { title: string; body: string }[];
  complianceAlignment: string;
}

interface VerticalMapping {
  pain: string;
  solution: string;
  feature: string;
  value: string;
  designDive?: DesignDiveContent;
}

interface VerticalData {
  id: string;
  name: string;
  icon: any;
  pitch: string;
  color: string;
  mappings: VerticalMapping[];
}

const VERTICALS: VerticalData[] = [
  {
    id: 'life-sciences',
    name: 'Life Sciences',
    icon: Beaker,
    pitch: 'Accelerate genomic sequencing and maintain data integrity with ultra-deep buffers and cognitive operations.',
    color: 'emerald',
    mappings: [
      {
        pain: 'Strict GxP data compliance and audit trail requirements.',
        solution: 'Forensic Telemetry & Snapshots',
        feature: 'CloudVision State-Streaming',
        value: 'Captures every change in real-time, providing a searchable "time-machine" of network state for regulatory audits.',
        designDive: {
          title: 'GxP Data Integrity & Auditability',
          concept: 'In Life Sciences, "Good Practice" (GxP) requires absolute certainty that data hasn\'t been tampered with and that a clear audit trail exists for every configuration change. Legacy SNMP polling creates "blind spots" between intervals.',
          technicalPillars: [
            { 
                title: 'TerminAttr State-Streaming', 
                body: 'Instead of polling, Arista switches stream their entire SysDB state. If a configuration is changed and reverted in milliseconds, legacy systems miss it. EOS records it instantly.' 
            },
            { 
                title: 'Immutable Snapshots', 
                body: 'CloudVision creates point-in-time snapshots of the entire fabric. During a GxP audit, you can "rewind" to any specific timestamp to prove configuration compliance.' 
            },
            { 
                title: 'Full Attribution Logs', 
                body: 'Every CLI command, API call, or automated task is cryptographically logged with user identity via AAA integration, providing 100% attribution for root-cause analysis.' 
            }
          ],
          complianceAlignment: 'Directly supports 21 CFR Part 11 requirements for electronic records and signatures by ensuring data longevity, searchability, and integrity.'
        }
      },
      {
        pain: 'Genomic sequencing data bursts crashing shallow-buffer switches.',
        solution: 'Deep Buffer R-Series Fabrics',
        feature: '7280R3 / 7800 (Jericho2)',
        value: 'Absorbs sub-millisecond burst traffic from sequencing clusters, ensuring zero packet loss during massive file transfers.',
        designDive: {
          title: 'Deep Buffer Physics for Sequencing',
          concept: 'Genomic sequencing machines generate massive datasets in violent, unpredictable bursts. Commodity switches use "shallow" buffers shared across ports; one burst from a sequencer can overflow the buffer, causing "Incast" and dropping packets for the entire lab.',
          technicalPillars: [
            {
              title: 'Virtual Output Queuing (VOQ)',
              body: 'VOQ ensures that congestion on one port never blocks traffic to another. Packers are buffered at the ingress side, keeping the switching fabric non-blocking even during heavy sequencing runs.'
            },
            {
              title: '32GB Deep Buffers',
              body: 'Arista R3-Series uses high-density memory to provide buffers up to 1000x larger than standard data center switches. This allows the network to "soak up" micro-bursts that would otherwise kill TCP throughput.'
            },
            {
              title: 'Predictable Performance',
              body: 'By eliminating packet loss at the hardware level, we prevent TCP retransmissions. This drastically reduces the time it takes to move genomic files from the sequencer to the storage cluster.'
            }
          ],
          complianceAlignment: 'Optimizes the "Time to Science" by ensuring the network substrate is never the bottleneck for High Performance Computing (HPC) research workloads.'
        }
      },
      {
        pain: 'Cryo-EM and high-resolution imaging transfers saturating standard links.',
        solution: 'Ethernet Storage Fabrics (ESF)',
        feature: 'RoCE v2 / NVMe-over-Fabrics',
        value: 'Provides lossless, high-bandwidth storage networking for petabyte-scale 3D imaging data without proprietary lock-in.',
        designDive: {
          title: 'Imaging Storage Optimization',
          concept: 'Cryogenic Electron Microscopy (Cryo-EM) produces terabytes of raw data per day. Moving these files to the storage cluster requires a network that can handle sustained high throughput without "Head-of-Line" blocking.',
          technicalPillars: [
            {
              title: 'Zero-Copy Data Transfer',
              body: 'By utilizing RoCE v2 (RDMA over Converged Ethernet), data moves directly from the imaging server to the storage array memory, bypassing the CPU to maximize bandwidth.'
            },
            {
              title: 'PFC & ECN Lossless Profiles',
              body: 'Priority Flow Control (PFC) ensures that critical storage traffic never gets dropped due to buffer overflow, maintaining the "no-loss" characteristic required for NVMe-over-Fabrics.'
            },
            {
              title: 'Simplified Convergence',
              body: 'Consolidate disparate Fibre Channel networks onto a single high-performance Arista Ethernet fabric, reducing cooling costs and cabling complexity in the research data center.'
            }
          ],
          complianceAlignment: 'Reduces "Data Stuckness" in imaging labs, accelerating the time it takes for researchers to begin processing critical structural biology data.'
        }
      },
      {
        pain: 'Proprietary project data leaking between different research teams.',
        solution: 'Logical Multi-Tenant Isolation',
        feature: 'EVPN-VXLAN / MSS-Group',
        value: 'Enforces strict cryptographic isolation between different research projects sharing the same physical network infrastructure.',
        designDive: {
          title: 'Secure Research Multi-Tenancy',
          concept: 'In shared research environments (e.g. Bio-Incubators), multiple companies or teams share the same physical infrastructure. Protecting Intellectual Property (IP) requires absolute segmentation that is easy to manage.',
          technicalPillars: [
            {
              title: 'Multi-Tenant Virtualization',
              body: 'Use EVPN-VXLAN to create thousands of independent, logically isolated virtual networks (VNs). Data from Project A is physically encapsulated and invisible to Project B.'
            },
            {
              title: 'Group-Based Security (MSS)',
              body: 'Arista Multi-Domain Segmentation (MSS) applies security policies based on "Identity Tags" rather than fragile IP address lists, ensuring security persists even as researchers move across the campus.'
            },
            {
              title: 'CloudVision Policy Audit',
              body: 'Centralized visualization of all project-to-project traffic flows. Instantly identify and block any unauthorized attempts to cross logical project boundaries.'
            }
          ],
          complianceAlignment: 'Ensures IP protection and data sovereignty in multi-tenant environments, satisfying strict information security requirements for patent-sensitive research.'
        }
      },
      {
        pain: 'Unreliable lab Wi-Fi causing instrument downtime.',
        solution: 'Cognitive Wireless Experience',
        feature: 'CV-CUE / Wi-Fi 6E',
        value: 'Automated root cause analysis identifies if a DNA sequencer dropped because of RF interference or a DHCP failure in seconds.',
        designDive: {
          title: 'Cognitive Wi-Fi for Lab Operations',
          concept: 'Laboratory environments are RF-hostile, filled with stainless steel equipment and sensitive scientific instruments. Legacy Wi-Fi management focuses on "uptime," but instruments need "quality." A DNA sequencer might stay connected but drop packets due to invisible interference, causing a $10k run to fail.',
          technicalPillars: [
            {
              title: 'Dedicated 3rd Radio',
              body: 'Arista Access Points feature a dedicated scanning radio that performs 24/7 WIPS and Auto-RF optimization without interrupting client traffic. It proactively identifies interference from lab equipment before it impacts instrument connectivity.'
            },
            {
              title: 'Client Journey Tracking',
              body: 'CloudVision Wi-Fi records the exact sub-millisecond handshake of every instrument. If a sequencer fails to roam or connect, we show the exact stage (Association, Auth, DHCP, DNS) with a root-cause explanation synthesized in plain English.'
            },
            {
              title: 'Application-Aware QoS',
              body: 'EOS identifies scientific data streams natively. We prioritize telemetry from mission-critical instruments over guest traffic or software updates at the edge, ensuring the "Time to Science" is never compromised by congestion.'
            }
          ],
          complianceAlignment: 'Supports operational continuity and data integrity by providing a reliable, high-fidelity wireless substrate for the Internet of Medical Things (IoMT) and lab automation.'
        }
      }
    ]
  }
];

export const VerticalMatrix: React.FC<VerticalMatrixProps> = ({ onBack }) => {
  const [activeVertical] = useState<VerticalData>(VERTICALS[0]);
  const [selectedDive, setSelectedDive] = useState<DesignDiveContent | null>(null);

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col overflow-hidden selection:bg-emerald-500/30">
      
      {/* DESIGN DIVE MODAL */}
      {selectedDive && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-xl animate-fade-in">
           <div className="w-full max-w-5xl bg-zinc-900 border border-zinc-800 rounded-[3rem] shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
              <header className="p-8 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                 <div className="flex items-center gap-4">
                    <div className={`p-3 bg-${activeVertical.color}-500/10 rounded-2xl border border-${activeVertical.color}-500/20 text-${activeVertical.color}-400`}>
                        <Search size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-serif font-bold text-white tracking-tight">{selectedDive.title}</h2>
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Architectural Design Dive // {activeVertical.name} Spec</span>
                    </div>
                 </div>
                 <button 
                    onClick={() => setSelectedDive(null)}
                    className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-full text-zinc-400 hover:text-white transition-all"
                 >
                    <X size={20} />
                 </button>
              </header>

              <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12">
                 <section className="max-w-3xl">
                    <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-500 mb-4 flex items-center gap-2">
                        <Fingerprint size={16} className={`text-${activeVertical.color}-500`} /> The Problem Statement
                    </h3>
                    <p className="text-xl md:text-2xl text-zinc-300 font-light leading-relaxed italic border-l-2 pl-8 transition-colors" style={{ borderColor: `var(--tw-color-${activeVertical.color}-500)` }}>
                       "{selectedDive.concept}"
                    </p>
                 </section>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {selectedDive.technicalPillars.map((pillar, i) => (
                        <div key={i} className="p-8 bg-zinc-950 border border-zinc-800 rounded-[2rem] transition-all group hover:border-zinc-700">
                            <div className={`text-${activeVertical.color}-500 mb-6 group-hover:scale-110 transition-transform origin-left`}>
                                {activeVertical.id === 'life-sciences' && i === 2 && selectedDive.title.includes('Wi-Fi') ? <Wifi size={28} /> : i === 0 ? <Zap size={28} /> : i === 1 ? <Box size={28} /> : <Layers size={28} />}
                            </div>
                            <h4 className="text-lg font-serif font-bold text-white mb-4">{pillar.title}</h4>
                            <p className="text-sm text-zinc-500 leading-relaxed">{pillar.body}</p>
                        </div>
                    ))}
                 </div>

                 <section className={`p-8 bg-${activeVertical.color}-950/20 border border-${activeVertical.color}-500/20 rounded-[2.5rem] relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 p-8 opacity-5"><ShieldCheck size={120} /></div>
                    <div className="relative z-10">
                        <h3 className={`text-xs font-bold uppercase tracking-[0.3em] text-${activeVertical.color}-400 mb-4`}>Strategic Alignment</h3>
                        <p className={`text-lg text-${activeVertical.color}-100 font-medium leading-relaxed`}>
                            {selectedDive.complianceAlignment}
                        </p>
                    </div>
                 </section>
              </div>

              <footer className="p-8 border-t border-zinc-800 bg-zinc-950/50 flex justify-between items-center">
                 <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Confidential // Arista Field Strategy Module</span>
                 <button 
                    onClick={() => setSelectedDive(null)}
                    className="px-8 py-3 bg-white text-black font-bold uppercase tracking-widest rounded-xl hover:bg-zinc-200 transition-all text-xs"
                 >
                    Return to Matrix
                 </button>
              </footer>
           </div>
        </div>
      )}
      
      {/* HEADER */}
      <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-8 bg-zinc-950 shrink-0 z-50">
        <div className="flex items-center gap-6">
            <button onClick={onBack} className="group p-2 text-zinc-500 hover:text-white transition-colors">
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <div className="h-4 w-px bg-zinc-800"></div>
            <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                    <Target size={20} />
                </div>
                <div>
                    <h1 className="text-sm font-bold uppercase tracking-wider">Life Sciences Stratum</h1>
                    <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Architectural Spec: Bio-Pharma</span>
                </div>
            </div>
        </div>
        <div className="flex items-center gap-4">
           <div className="bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">Vertical Lock: Active</span>
           </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-hidden flex flex-col lg:flex-row relative">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>

        {/* MAPPING CANVAS */}
        <div className="flex-1 overflow-y-auto relative p-8 md:p-12 lg:p-16">
            
            <div className="max-w-5xl mx-auto space-y-12 animate-fade-in relative z-10">
                
                <header className="space-y-6">
                   <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl bg-${activeVertical.color}-500/10 border border-${activeVertical.color}-500/20 flex items-center justify-center text-${activeVertical.color}-400`}>
                         <activeVertical.icon size={28} />
                      </div>
                      <h2 className="text-5xl md:text-7xl font-serif font-bold tracking-tighter text-white">{activeVertical.name}</h2>
                   </div>
                   <p className="text-2xl text-zinc-400 font-light leading-relaxed max-w-2xl italic border-l-2 pl-8 transition-colors" style={{ borderColor: `var(--tw-color-${activeVertical.color}-500)` }}>
                      "{activeVertical.pitch}"
                   </p>
                </header>

                <div className="grid grid-cols-1 gap-6">
                    <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-zinc-600 mb-2 flex items-center gap-2">
                        <CheckCircle2 size={14} className={`text-${activeVertical.color}-500`} /> Alignment Strategy
                    </h3>
                    
                    {activeVertical.mappings.map((mapping, idx) => (
                        <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden group hover:border-zinc-600 transition-all flex flex-col md:flex-row">
                            {/* PAIN SECTION */}
                            <div className="md:w-1/3 p-8 border-b md:border-b-0 md:border-r border-zinc-800 bg-zinc-900/40">
                                <div className="flex items-center gap-2 text-rose-500 mb-4 text-[10px] font-bold uppercase tracking-widest">
                                    <AlertTriangle size={14} /> The Customer Pain
                                </div>
                                <p className="text-lg text-zinc-100 font-medium leading-relaxed">
                                    {mapping.pain}
                                </p>
                            </div>

                            {/* SOLUTION SECTION */}
                            <div className="flex-1 p-8 space-y-6">
                                <div className="space-y-2">
                                    <span className={`text-[9px] font-mono uppercase tracking-[0.3em] text-${activeVertical.color}-500`}>Arista Intervention</span>
                                    <h4 className="text-2xl font-serif font-bold text-white tracking-tight">{mapping.solution}</h4>
                                </div>
                                
                                <div className="flex flex-wrap gap-3">
                                    <div className="px-3 py-1 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
                                        <Zap size={12} className={`text-${activeVertical.color}-400`} />
                                        <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold">{mapping.feature}</span>
                                    </div>
                                </div>

                                <p className="text-sm text-zinc-400 leading-relaxed">
                                    {mapping.value}
                                </p>
                                
                                <div className="pt-4 flex justify-end">
                                    <button 
                                        disabled={!mapping.designDive}
                                        onClick={() => mapping.designDive && setSelectedDive(mapping.designDive)}
                                        className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all ${mapping.designDive ? `text-zinc-600 group-hover:text-${activeVertical.color}-400` : 'text-zinc-800 cursor-not-allowed'}`}
                                    >
                                        {mapping.designDive ? 'View Design Dive' : 'Dive Unavailable'} <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* BOTTOM CTA / ACTION */}
                <div className={`mt-20 p-12 rounded-[3rem] bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 group`}>
                    <div className={`absolute inset-0 bg-${activeVertical.color}-500/5 opacity-50`}></div>
                    <div className="relative z-10 max-w-xl">
                        <div className={`w-12 h-12 bg-${activeVertical.color}-500 rounded-2xl flex items-center justify-center text-white mb-6 shadow-[0_0_30px_rgba(var(--tw-color-${activeVertical.color}-500),0.4)]`}>
                            <Tv size={24} />
                        </div>
                        <h3 className="text-3xl font-serif font-bold text-white mb-4">Elevator Synthesis</h3>
                        <p className="text-zinc-500 leading-relaxed">Ready to present this architecture? Generate a cinematic narrative tailored for {activeVertical.name} stakeholders in the Briefing Theater.</p>
                    </div>
                    <div className="relative z-10 shrink-0">
                        <button className="px-10 py-5 bg-white text-black font-bold uppercase tracking-widest rounded-2xl hover:bg-zinc-100 transition-all shadow-2xl">
                            Initialize Theater
                        </button>
                    </div>
                </div>

            </div>
        </div>
      </main>

      {/* SYSTEM HUD */}
      <div className="h-10 bg-zinc-950 border-t border-zinc-900 px-8 flex items-center justify-between text-[8px] font-mono text-zinc-600 uppercase tracking-[0.4em] shrink-0 z-20">
         <div className="flex items-center gap-4">
            <span>Arista Strategic Kernel</span>
            <span className="w-1 h-1 bg-zinc-800 rounded-full"></span>
            <span className={`text-${activeVertical.color}-900`}>Module: BIO-PHARMA-01</span>
         </div>
         <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full bg-${activeVertical.color}-500 animate-pulse`}></div>
            <span>Compliance Synchronized</span>
         </div>
      </div>

    </div>
  );
};
