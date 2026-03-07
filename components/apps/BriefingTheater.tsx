
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowLeft, ArrowRight, ChevronRight, ChevronLeft, Mic2, Tv, Maximize2, Sparkles, Activity, Wifi, Cpu, Database, Server, Layers, Shield, AlertTriangle, Radio, Tablet, Presentation, Plus, Minus, Search, CornerDownLeft, X, Lock, CheckCircle2, Zap, BarChart3, Network, RefreshCw, Smartphone, Globe, Target, Eye, FileKey, ShieldCheck, Beaker, Scale, FileText, Cloud, Terminal } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BriefingNarrative, TeleprompterContext } from '@/types';
import { SIGNATURE_NARRATIVES } from '@/data/briefingData';
import { EvidenceDrawer } from '@/components/EvidenceDrawer';

interface BriefingTheaterProps {
  onBack: () => void;
}

const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

const PRESETS = [
  {
    id: 'why-arista-2',
    title: 'Why Arista 2.0',
    topic: 'Why Arista Is the Inevitable Outcome of Modern Network Constraints.',
    icon: Sparkles,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20'
  },
  {
    id: 'zero-trust',
    title: 'Zero Trust',
    topic: 'Security as Code: MSS, NDR, and MACsec Encryption.',
    icon: Shield,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20'
  },
  {
    id: 'wireless-diff',
    title: 'Arista Wireless',
    topic: 'Arista Wireless (CV-CUE) Differentiators: Cognitive Wi-Fi, Root Cause Analysis, and WIPS Security.',
    icon: Wifi,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20'
  },
  {
    id: 'ai-fabrics',
    title: 'AI Data Center',
    topic: 'Architecting for the GPU Tsunami: Deep Buffers, RoCEv2, DCQCN, and Non-Blocking Scale.',
    icon: Cpu,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20'
  },
  {
    id: 'life-sciences-gxp',
    title: 'Life Sciences GxP',
    topic: 'Forensic Auditability: Streaming State for FDA 21 CFR Part 11 Compliance.',
    icon: Beaker,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20'
  },
  {
    id: 'cloudvision-netops',
    title: 'CloudVision & NetOps',
    topic: 'The Network Operating System: State Streaming, ZTP, Change Control, and AVD at Scale.',
    icon: Eye,
    color: 'text-sky-400',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/20'
  },
  {
    id: 'ip-fabric',
    title: 'BGP/EVPN IP Fabric',
    topic: 'The Modern Data Center: Leaf-Spine Topology, eBGP Underlay, EVPN Overlay, Anycast Gateway.',
    icon: Network,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20'
  }
];

// --- SHARED SCHEMATIC PRIMITIVES ---

const Node = ({ label, color = 'zinc', icon: Icon }: any) => (
  <div className={`w-24 h-24 bg-zinc-900 border border-${color}-500/30 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-2xl relative z-10`}>
    {Icon && <Icon size={24} className={`text-${color}-500`} />}
    <span className={`text-[8px] font-mono uppercase tracking-widest text-${color}-400 text-center px-1`}>{label}</span>
  </div>
);

const Connection = ({ active = false, vertical = false }) => (
  <div className={`${vertical ? 'w-px h-16' : 'h-px w-16'} bg-zinc-800 relative overflow-hidden`}>
    {active && <div className={`absolute inset-0 bg-blue-500 animate-pulse`}></div>}
  </div>
);

// --- ZERO TRUST VISUALS ---

const VisualZeroTrust = ({ index }: { index: number }) => {
  switch (index) {
    case 0: // Perimeter Fallacy
      return (
        <div className="relative w-full h-full flex items-center justify-center">
           <div className="w-96 h-64 border-2 border-dashed border-zinc-700 rounded-3xl relative flex items-center justify-center">
              <span className="absolute -top-3 bg-black px-2 text-[10px] font-mono uppercase text-zinc-500">Perimeter Firewall</span>
              {/* Breach animation */}
              <div className="absolute top-0 right-0 w-full h-full flex items-center justify-center">
                 <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping absolute top-0 right-1/2"></div>
                 <div className="w-full h-full bg-rose-500/5 animate-pulse rounded-3xl"></div>
              </div>
              <div className="grid grid-cols-3 gap-8 z-10">
                 {[1,2,3].map(i => <div key={i} className="w-12 h-12 bg-zinc-900 border border-rose-500/50 rounded flex items-center justify-center"><AlertTriangle size={20} className="text-rose-500" /></div>)}
              </div>
           </div>
           <div className="absolute bottom-8 left-12 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Fig 4.1: Lateral Movement</div>
        </div>
      );
    case 1: // MSS
      return (
        <div className="relative w-full h-full flex items-center justify-center">
           <div className="grid grid-cols-3 gap-12">
              <div className="p-4 border border-blue-500/30 bg-blue-500/5 rounded-2xl flex flex-col items-center gap-2">
                 <div className="w-8 h-8 rounded bg-blue-500 flex items-center justify-center text-white"><Server size={16} /></div>
                 <span className="text-[10px] font-mono text-blue-400">APP_ZONE</span>
              </div>
              <div className="p-4 border border-zinc-700 bg-zinc-900 rounded-2xl flex flex-col items-center justify-center gap-2 relative">
                 <div className="absolute inset-0 border border-rose-500 rounded-2xl animate-pulse"></div>
                 <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-zinc-500"><X size={16} className="text-rose-500" /></div>
                 <span className="text-[10px] font-mono text-zinc-500">BLOCKED</span>
              </div>
              <div className="p-4 border border-emerald-500/30 bg-emerald-500/5 rounded-2xl flex flex-col items-center gap-2">
                 <div className="w-8 h-8 rounded bg-emerald-500 flex items-center justify-center text-white"><Database size={16} /></div>
                 <span className="text-[10px] font-mono text-emerald-400">DB_ZONE</span>
              </div>
           </div>
           <div className="absolute bottom-8 left-12 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Fig 4.2: Logical Isolation</div>
        </div>
      );
    case 2: // NDR
      return (
        <div className="relative w-full h-full flex items-center justify-center">
           <div className="w-80 h-80 rounded-full border border-emerald-500/20 flex items-center justify-center relative overflow-hidden bg-emerald-900/5">
              <div className="absolute w-full h-1 bg-emerald-500/50 rotate-45 animate-spin-slow origin-center top-1/2"></div>
              <Eye size={64} className="text-emerald-500 relative z-10" />
              {[...Array(5)].map((_, i) => (
                 <div key={i} className="absolute w-2 h-2 bg-rose-500 rounded-full animate-ping" style={{ top: `${20 + Math.random() * 60}%`, left: `${20 + Math.random() * 60}%`, animationDelay: `${i * 0.5}s` }}></div>
              ))}
           </div>
           <div className="absolute bottom-8 left-12 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Fig 4.3: Behavioral Analysis</div>
        </div>
      );
    case 3: // Encryption
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-center gap-8">
           <div className="flex items-center gap-0">
              <div className="w-24 h-12 bg-zinc-900 border border-zinc-700 rounded-l-xl flex items-center justify-center"><Server size={20} className="text-zinc-500" /></div>
              <div className="w-64 h-8 bg-zinc-800 relative overflow-hidden flex items-center">
                 <div className="absolute inset-0 flex gap-4 animate-[slide_2s_linear_infinite]">
                    {[...Array(10)].map((_,i) => <div key={i} className="w-8 h-4 bg-zinc-700 rounded flex items-center justify-center"><Lock size={10} className="text-zinc-500" /></div>)}
                 </div>
              </div>
              <div className="w-24 h-12 bg-zinc-900 border border-zinc-700 rounded-r-xl flex items-center justify-center"><Globe size={20} className="text-zinc-500" /></div>
           </div>
           <div className="flex items-center gap-2 text-emerald-500 font-mono text-xs uppercase tracking-widest bg-emerald-900/10 px-4 py-2 rounded-lg border border-emerald-500/20">
              <FileKey size={14} /> MACsec Line-Rate
           </div>
           <div className="absolute bottom-8 left-12 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Fig 4.4: Data Obfuscation</div>
           <style>{`@keyframes slide { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
        </div>
      );
    default:
      return (
        <div className="relative w-full h-full flex items-center justify-center">
           <ShieldCheck size={120} className="text-emerald-500 animate-pulse" />
           <div className="absolute bottom-8 left-12 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Fig 4.5: The Secure Core</div>
        </div>
      );
  }
};

// --- LIFE SCIENCES VISUALS ---

const LifeSciencesVisuals: React.FC<{ index: number }> = ({ index }) => {
  if (index === 0) return ( // Regulatory Burden
     <div className="relative w-full h-full flex flex-col items-center justify-center gap-8">
        <div className="relative">
           <Scale size={120} className="text-zinc-600" />
           <div className="absolute top-0 right-0 animate-bounce">
              <AlertTriangle size={48} className="text-rose-500" />
           </div>
        </div>
        <div className="flex gap-4">
           <div className="px-4 py-2 border border-rose-500/50 rounded bg-rose-900/10 text-rose-400 font-mono text-xs uppercase">Warning Letter</div>
           <div className="px-4 py-2 border border-zinc-700 rounded bg-zinc-900 text-zinc-500 font-mono text-xs uppercase">483 Observation</div>
        </div>
     </div>
  );
  if (index === 1) return ( // Polling Gap (Old 0)
     <div className="relative w-full h-full flex flex-col items-center justify-center gap-8">
        <div className="flex gap-4 items-end h-32 w-full max-w-lg px-8 border-b border-zinc-700 relative">
           {/* Discrete Polling Bars */}
           {[0, 20, 40, 60, 80, 100].map(p => (
              <div key={p} className="w-1 h-8 bg-zinc-600 absolute bottom-0" style={{ left: `${p}%` }}></div>
           ))}
           {/* The Missed Event */}
           <div className="absolute left-[50%] bottom-0 w-1 h-24 bg-rose-500 animate-pulse shadow-[0_0_20px_#f43f5e]"></div>
           <div className="absolute left-[50%] -top-8 -translate-x-1/2 text-[10px] font-mono text-rose-500 uppercase bg-black px-2 border border-rose-500/50 rounded">Missed Event</div>
        </div>
        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Legacy SNMP Interval</span>
     </div>
  );
  if (index === 2) return <VisualObservabilityLoop />; // Streaming (Old 1)
  if (index === 3) return ( // Time Travel (Old 2)
     <div className="relative w-full h-full flex items-center justify-center">
        <div className="w-64 h-64 rounded-full border-4 border-dashed border-emerald-500/30 flex items-center justify-center relative animate-spin-slow" style={{ animationDirection: 'reverse' }}>
           <div className="absolute top-0 w-1 h-10 bg-emerald-500"></div>
        </div>
        <div className="absolute font-mono text-4xl font-bold text-white tracking-widest">02:14:00</div>
        <div className="absolute bottom-12 text-[10px] font-mono text-emerald-500 uppercase tracking-widest">State Replay Active</div>
     </div>
  );
  if (index === 4) return <VisualConfidenceStack />; // Identity (Old 3)
  if (index === 5) return <VisualZeroTrust index={1} />; // Segmentation (Reuse)
  if (index === 6) return <VisualZeroTrust index={3} />; // Encryption (Reuse)
  if (index === 7) return ( // Automated IQ/OQ
     <div className="relative w-full h-full flex items-center justify-center gap-12">
        <div className="w-32 h-40 bg-zinc-900 border border-zinc-700 rounded-lg p-4 font-mono text-[8px] text-blue-400 overflow-hidden opacity-50">
           {`fabric_name: GxP_Core\n\n  leaf1:\n    id: 1\n    bgp_as: 65001\n\n  leaf2:\n    id: 2\n    bgp_as: 65001`}
        </div>
        <div className="flex flex-col items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-zinc-600"></div>
           <div className="w-2 h-2 rounded-full bg-zinc-600"></div>
           <div className="w-2 h-2 rounded-full bg-zinc-600"></div>
           <ArrowLeft className="text-emerald-500 rotate-180" />
        </div>
        <div className="w-32 h-40 bg-white text-black rounded-lg p-4 flex flex-col items-center justify-center shadow-[0_0_30px_white]">
           <CheckCircle2 size={48} className="text-emerald-600 mb-2" />
           <span className="font-bold text-xs uppercase tracking-widest">VALIDATED</span>
        </div>
     </div>
  );
  if (index === 8) return ( // Validation Artifact (Old 4)
     <div className="relative w-full h-full flex items-center justify-center">
        <div className="relative">
           <FileText size={100} className="text-zinc-700" />
           <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-black px-2 py-1 text-xs font-bold uppercase -rotate-12 border-2 border-white shadow-xl">
              COMPLIANT
           </div>
        </div>
     </div>
  );
  return <VisualZeroTrust index={4} />; // Audit Defense (Shield)
};

// --- WHY ARISTA 2.0 VISUALS ---

const VisualConstraintGraph = () => (
  <div className="relative w-full h-full flex items-center justify-center p-12">
    <div className="relative w-full max-w-3xl h-96 border-l border-b border-zinc-700">
      <div className="absolute inset-0 flex flex-col justify-between opacity-10 pointer-events-none">
        {[...Array(5)].map((_, i) => <div key={i} className="w-full h-px bg-white"></div>)}
      </div>
      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-500 border-t border-dashed border-zinc-400 flex items-center">
        <span className="absolute right-0 -top-6 text-[10px] font-mono uppercase text-zinc-500 bg-black px-2">Human Cognitive Limit</span>
      </div>
      <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
        <path d="M 0 384 C 200 380, 400 350, 768 0" stroke="#f43f5e" strokeWidth="4" fill="none" />
      </svg>
      <div className="absolute top-0 right-0 text-[10px] font-mono uppercase text-rose-500 bg-black px-2">Network Complexity</div>
      <div className="absolute top-1/2 left-[55%] w-4 h-4 bg-rose-500 rounded-full border-4 border-black -translate-x-1/2 -translate-y-1/2 z-10 animate-pulse"></div>
      <div className="absolute top-[55%] left-[55%] -translate-x-1/2 mt-4 text-center">
        <span className="block text-xs font-bold text-rose-500 uppercase tracking-widest">Failure Zone</span>
      </div>
    </div>
    <div className="absolute bottom-8 left-12 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Fig 1.1: The Scale Gap</div>
  </div>
);

const VisualConfigVsState = () => (
  <div className="relative w-full h-full flex flex-col items-center justify-center gap-16">
    <div className="w-full max-w-2xl relative">
      <div className="h-2 w-full bg-zinc-800 rounded-full"></div>
      <div className="absolute -top-6 left-0 text-[10px] font-mono uppercase text-zinc-500">Intended Config (Static)</div>
      <div className="absolute top-0 left-0 h-full w-full flex justify-between px-12">
         {[...Array(5)].map((_, i) => <div key={i} className="w-0.5 h-4 bg-zinc-600 -mt-1"></div>)}
      </div>
    </div>
    <div className="h-32 border-l-2 border-dashed border-rose-500/30"></div>
    <div className="w-full max-w-2xl relative">
      <svg className="w-full h-24 overflow-visible">
         <path d="M 0 10 Q 150 10, 300 40 T 600 80" stroke="#f43f5e" strokeWidth="3" fill="none" strokeDasharray="6 4" />
      </svg>
      <div className="absolute -bottom-6 right-0 text-[10px] font-mono uppercase text-rose-500">Actual State (Drifting)</div>
      <div className="absolute top-10 left-1/2 w-3 h-3 bg-rose-500 rounded-full animate-ping"></div>
    </div>
    <div className="absolute bottom-8 left-12 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Fig 1.2: Configuration Drift</div>
  </div>
);

const VisualObservabilityLoop = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    <div className="relative w-[600px] h-[300px] flex items-center justify-between">
       <Node label="Infrastructure" icon={Server} color="zinc" />
       <div className="flex-1 h-px bg-zinc-800 relative mx-4">
          <div className="absolute inset-0 flex items-center justify-around overflow-hidden">
             {[...Array(12)].map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-[flow_2s_linear_infinite]" style={{ animationDelay: `${i * 0.1}s` }}></div>
             ))}
          </div>
          <div className="absolute -top-6 w-full text-center text-[9px] font-mono text-blue-500 uppercase tracking-widest">State Streaming</div>
       </div>
       <Node label="Observer" icon={Activity} color="blue" />
    </div>
    <div className="absolute bottom-8 left-12 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Fig 1.3: The Feedback Loop</div>
    <style>{`@keyframes flow { 0% { transform: translateX(-200px); opacity: 0; } 50% { opacity: 1; } 100% { transform: translateX(200px); opacity: 0; } }`}</style>
  </div>
);

const VisualSysDBArchitecture = () => (
  <div className="relative w-full h-full flex items-center justify-center">
     <div className="relative w-96 h-96 flex items-center justify-center">
        <div className="w-32 h-32 rounded-full border-4 border-blue-600 bg-zinc-950 flex items-center justify-center z-20 relative shadow-[0_0_50px_rgba(37,99,235,0.2)]">
           <div className="flex flex-col items-center">
              <Database size={24} className="text-white mb-1" />
              <span className="text-[10px] font-bold text-white uppercase tracking-wider">SysDB</span>
           </div>
        </div>
        {[0, 120, 240].map((angle, i) => (
           <div key={i} className="absolute inset-0 flex items-center justify-center" style={{ transform: `rotate(${angle}deg)` }}>
              <div className="absolute -top-12 flex flex-col items-center transform -rotate-0">
                 <div className="w-16 h-16 bg-zinc-900 border border-zinc-700 rounded-xl flex items-center justify-center mb-2 z-10" style={{ transform: `rotate(-${angle}deg)` }}>
                    <Cpu size={20} className="text-zinc-400" />
                 </div>
                 <div className="h-12 w-0.5 bg-zinc-800"></div>
                 <div className="absolute top-16 w-1 h-1 bg-blue-500 rounded-full animate-ping"></div>
              </div>
           </div>
        ))}
     </div>
     <div className="absolute bottom-8 left-12 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Fig 1.4: State Decoupling</div>
  </div>
);

const VisualChangePipeline = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    <div className="relative w-96 h-24 bg-zinc-900 border border-zinc-700 rounded-full flex items-center p-2 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent animate-[shimmer_2s_infinite]"></div>
        {/* Nodes morphing */}
        <div className="flex justify-between w-full px-8">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.5)] transition-all duration-1000 animate-pulse">
                    <RefreshCw size={20} className="text-white animate-spin-slow" />
                </div>
            ))}
        </div>
    </div>
    <div className="absolute bottom-8 left-12 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Fig 4.0: Continuous Evolution</div>
  </div>
);

const VisualWirelessCorrelation = () => (
  <div className="relative w-full h-full flex items-center justify-center">
     <div className="relative grid grid-cols-4 gap-4 w-96 h-64">
        {[...Array(12)].map((_, i) => (
            <div key={i} className="relative bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden group">
                <div className="absolute inset-0 flex items-center justify-center">
                    <Wifi size={24} className="text-zinc-700 group-hover:text-cyan-400 transition-colors" />
                </div>
                {/* Random waveform overlay */}
                <svg className="absolute bottom-0 w-full h-8 opacity-30" preserveAspectRatio="none">
                    <path d={`M0 32 Q 10 ${Math.random()*32}, 20 32 T 40 32`} stroke="#22d3ee" fill="none" />
                </svg>
            </div>
        ))}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-64 border-2 border-cyan-500/30 rounded-full animate-ping"></div>
        </div>
     </div>
     <div className="absolute bottom-8 left-12 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Fig 5.0: Signal-to-Truth</div>
  </div>
);

const VisualInevitabilityFunnel = () => (
  <div className="relative w-full h-full flex items-center justify-center perspective-[1000px]">
      {/* Converging paths */}
      <div className="relative w-full h-full flex items-center justify-center">
          <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-blue-900/20 to-transparent transform rotate-x-45"></div>
          {[-45, -15, 15, 45].map((angle, i) => (
              <div key={i} className="absolute bottom-0 w-2 h-1/2 bg-zinc-800 origin-bottom transform" style={{ rotate: `${angle}deg`, height: '60%' }}>
                  <div className="w-full h-full bg-blue-500 animate-[flowUp_2s_linear_infinite]" style={{ animationDelay: `${i*0.2}s` }}></div>
              </div>
          ))}
          <div className="absolute bottom-[60%] w-32 h-32 bg-white rounded-full blur-[60px] opacity-50"></div>
          <div className="absolute bottom-[60%] w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-[0_0_50px_white]">
              <Target size={32} className="text-blue-600" />
          </div>
      </div>
      <div className="absolute bottom-8 left-12 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Fig 6.0: Architectural Convergence</div>
      <style>{`@keyframes flowUp { 0% { transform: scaleY(0); transform-origin: bottom; opacity: 0; } 50% { opacity: 1; } 100% { transform: scaleY(1); opacity: 0; } }`}</style>
  </div>
);

const VisualArchitectureVsTooling = () => (
  <div className="relative w-full h-full flex items-center justify-center gap-20">
      <div className="flex flex-col items-center gap-4 opacity-50 grayscale">
          <div className="w-32 h-40 bg-zinc-800 border-4 border-zinc-600 rounded flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-zinc-500">WALL</span>
          </div>
          <span className="text-[10px] font-mono text-zinc-500 uppercase">Legacy Tools</span>
      </div>
      
      <div className="flex flex-col items-center gap-4">
          <div className="relative w-48 h-24">
              <div className="absolute top-0 left-0 w-full h-2 bg-blue-500 rounded-full shadow-[0_0_20px_#3b82f6]"></div>
              <div className="absolute bottom-0 left-0 w-full h-2 bg-blue-500 rounded-full shadow-[0_0_20px_#3b82f6]"></div>
              {/* Struts */}
              {[0, 20, 40, 60, 80, 100].map(p => (
                  <div key={p} className="absolute top-0 bottom-0 w-1 bg-blue-500/50" style={{ left: `${p}%`, transform: 'skewX(-20deg)' }}></div>
              ))}
          </div>
          <span className="text-[10px] font-mono text-blue-500 uppercase tracking-widest">Architectural Bridge</span>
      </div>
      <div className="absolute bottom-8 left-12 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Fig 7.0: Structural Integrity</div>
  </div>
);

const VisualConfidenceStack = () => (
  <div className="relative w-full h-full flex items-center justify-center">
      <div className="flex flex-col-reverse gap-2">
          {['Hardware', 'OS Kernel', 'State DB', 'Telemetry', 'Automation', 'Confidence'].map((layer, i) => (
              <div 
                key={i} 
                className={`w-64 h-12 flex items-center justify-center rounded border ${i === 5 ? 'bg-white text-black border-white shadow-[0_0_40px_white]' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}
                style={{ 
                    width: `${16 + (i * 2)}rem`,
                    opacity: i === 5 ? 1 : 0.5 + (i * 0.1)
                }}
              >
                  <span className={`text-xs font-bold uppercase tracking-widest ${i === 5 ? 'animate-pulse' : ''}`}>{layer}</span>
              </div>
          ))}
      </div>
      <div className="absolute bottom-8 left-12 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Fig 8.0: The Value Stack</div>
  </div>
);

// --- AI FABRIC VISUALS ---

const VisualIncast = () => (
  <div className="relative w-full h-full flex items-center justify-center">
     <div className="relative">
        <div className="w-32 h-32 bg-zinc-900 border border-indigo-500 rounded-2xl flex flex-col items-center justify-center z-20 relative">
           <Database size={32} className="text-indigo-400 mb-2" />
           <span className="text-[9px] font-mono text-indigo-400 uppercase">Buffer</span>
        </div>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
           <div key={i} className="absolute inset-0 flex items-center justify-center" style={{ transform: `rotate(${angle}deg)` }}>
              <div className="absolute top-[-100px] w-1 h-20 bg-gradient-to-b from-transparent to-rose-500 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}></div>
           </div>
        ))}
     </div>
     <div className="absolute bottom-8 left-12 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Fig 3.1: Micro-Burst Incast</div>
  </div>
);

const VisualDeepBuffer = () => (
  <div className="relative w-full h-full flex items-center justify-center gap-12">
     <div className="flex flex-col items-center gap-4">
        <div className="w-24 h-48 border border-rose-800 bg-rose-900/10 rounded flex flex-col justify-end p-1 relative overflow-hidden">
           <div className="w-full h-full bg-rose-500 animate-pulse"></div>
           <div className="absolute top-0 w-full text-center text-[8px] text-rose-500 font-mono bg-black">OVERFLOW</div>
        </div>
        <span className="text-[10px] font-mono text-zinc-500 uppercase">Commodity</span>
     </div>
     <div className="flex flex-col items-center gap-4">
        <div className="w-32 h-64 border border-emerald-800 bg-emerald-900/10 rounded flex flex-col justify-end p-1 relative overflow-hidden">
           <div className="w-full h-1/2 bg-emerald-500 transition-all duration-1000"></div>
           <div className="absolute top-2 w-full text-center text-[8px] text-emerald-500 font-mono">HEADROOM</div>
        </div>
        <span className="text-[10px] font-mono text-zinc-500 uppercase">Deep Buffer (R3)</span>
     </div>
     <div className="absolute bottom-8 left-12 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Fig 3.2: Buffer Depth Comparison</div>
  </div>
);

// --- WIRELESS VISUALS ---

const VisualWirelessSpectrum = () => (
  <div className="relative w-full h-full flex flex-col items-center justify-center gap-8">
     <div className="flex gap-4 items-end h-40">
        <div className="w-20 h-full bg-zinc-900 border border-zinc-700 rounded-t-lg flex flex-col justify-end p-2 relative">
           <div className="w-full h-[80%] bg-zinc-800/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-rose-500/20 animate-pulse"></div>
           </div>
           <span className="text-[9px] text-center font-mono mt-2 text-zinc-500">2.4GHz</span>
        </div>
        <div className="w-20 h-full bg-zinc-900 border border-zinc-700 rounded-t-lg flex flex-col justify-end p-2 relative">
           <div className="w-full h-[60%] bg-zinc-800/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-amber-500/20 animate-pulse"></div>
           </div>
           <span className="text-[9px] text-center font-mono mt-2 text-zinc-500">5GHz</span>
        </div>
        <div className="w-32 h-full bg-zinc-900 border border-cyan-500 rounded-t-lg flex flex-col justify-end p-2 relative shadow-[0_0_30px_rgba(6,182,212,0.1)]">
           <div className="w-full h-[10%] bg-cyan-500/20 relative overflow-hidden"></div>
           <span className="text-[9px] text-center font-mono mt-2 text-cyan-400 font-bold">6GHz (Clean)</span>
        </div>
     </div>
     <div className="absolute bottom-8 left-12 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Fig 2.2: Spectrum Availability</div>
  </div>
);

const VisualClientJourney = () => (
  <div className="relative w-full h-full flex flex-col items-center justify-center gap-8">
     <div className="flex items-center gap-4">
        {['Assoc', 'Auth', 'DHCP', 'DNS'].map((step, i) => (
           <React.Fragment key={step}>
              <div className={`w-20 h-20 rounded-xl border flex flex-col items-center justify-center gap-1 ${i === 2 ? 'border-rose-500 bg-rose-500/10 text-rose-400' : 'border-zinc-800 bg-zinc-900 text-zinc-500'}`}>
                 <span className="text-xs font-bold">{step}</span>
                 {i === 2 && <AlertTriangle size={12} />}
              </div>
              {i < 3 && <div className="w-8 h-px bg-zinc-800"></div>}
           </React.Fragment>
        ))}
     </div>
     <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg text-center">
        <span className="text-[10px] font-mono text-zinc-400 uppercase">Root Cause Analysis</span>
        <div className="text-rose-400 text-sm font-bold mt-1">DHCP OFFER TIMEOUT (VLAN 10)</div>
     </div>
     <div className="absolute bottom-8 left-12 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Fig 2.4: Cognitive Journey</div>
  </div>
);

// --- NARRATIVE VISUAL ROUTER ---

const WhyAristaLegacyVisuals: React.FC<{ index: number }> = ({ index }) => {
  // Mapping the 12 legacy slides to schematics
  if (index === 0) return ( // Legacy Monolith
    <div className="flex flex-col gap-1 items-center justify-center h-full">
       {[...Array(6)].map((_, i) => <div key={i} className="w-32 h-8 bg-zinc-800 border border-rose-500/30 rounded flex items-center justify-center text-[8px] text-zinc-500">OS_Frag_{i}</div>)}
       <div className="text-rose-500 text-xs font-bold mt-4">Fragmentation</div>
    </div>
  );
  if (index === 1) return ( // Unified Binary
    <div className="flex items-center justify-center h-full">
       <div className="w-40 h-40 bg-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_50px_rgba(37,99,235,0.3)] text-white font-bold text-xl">EOS</div>
    </div>
  );
  if (index === 2) return <VisualSysDBArchitecture />;
  if (index === 3) return ( // Open Prog
    <div className="flex flex-col items-center justify-center gap-4 h-full">
       <div className="w-64 bg-zinc-900 border border-zinc-700 rounded-lg p-4 font-mono text-[10px] text-green-400">
          $ bash<br/>[admin@switch ~]$ python3<br/>&gt;&gt;&gt; import jsonrpclib
       </div>
       <span className="text-[10px] font-mono text-zinc-500 uppercase">Unmodified Kernel</span>
    </div>
  );
  if (index === 4) return ( // Automation Pivot — AVD YAML → EOS config
    <div className="relative w-full h-full flex items-center justify-center gap-8">
      <div className="w-28 h-36 bg-zinc-900 border border-zinc-700 rounded-lg p-3 font-mono text-[8px] text-blue-400 overflow-hidden">
        {'fabric:\n  spine: 2\n  leaf: 4\n  bgp_as: 65000\n\nvlans:\n  - id: 10\n    name: prod'}
      </div>
      <div className="flex flex-col items-center gap-1">
        {[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-blue-500 animate-ping" style={{ animationDelay: `${i * 0.3}s` }}></div>)}
        <ArrowRight size={18} className="text-blue-500 mt-1" />
      </div>
      <div className="w-28 h-36 bg-zinc-900 border border-emerald-500/40 rounded-lg p-3 font-mono text-[8px] text-emerald-400 overflow-hidden">
        {'router bgp 65000\n  bgp listen range\n  10.0.0.0/8\n\ninterface Vxlan1\n  vxlan source\n  Loopback1'}
      </div>
      <div className="absolute bottom-8 left-12 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Fig 1.4: AVD Pipeline</div>
    </div>
  );
  if (index === 5) return ( // AI Revolution — GPU all-to-all grid
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="grid grid-cols-4 gap-3">
        {[...Array(16)].map((_, i) => (
          <div key={i} className="w-12 h-12 bg-zinc-900 border border-violet-500/40 rounded-lg flex items-center justify-center relative">
            <Cpu size={16} className="text-violet-400" />
            {i % 3 === 0 && <div className="absolute inset-0 border border-violet-500 rounded-lg animate-pulse"></div>}
          </div>
        ))}
      </div>
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg">
        {[...Array(8)].map((_, i) => <line key={i} x1="20%" y1={`${15 + i * 10}%`} x2="80%" y2={`${85 - i * 10}%`} stroke="#8b5cf6" strokeWidth="1" />)}
      </svg>
      <div className="absolute bottom-8 left-12 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Fig 1.5: All-to-All GPU Fabric</div>
    </div>
  );
  if (index === 6) return <VisualDeepBuffer />; // Deep Buffer Resilience
  if (index === 7) return <VisualZeroTrust index={1} />; // Zero Trust / MSS zones
  if (index === 8) return ( // Cognitive Management — CV time-travel
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="w-24 h-24 rounded-full border-4 border-dashed border-sky-500/30 flex items-center justify-center relative animate-spin-slow" style={{ animationDirection: 'reverse' }}>
        <div className="absolute top-0 w-1 h-8 bg-sky-500 rounded"></div>
      </div>
      <div className="absolute font-mono text-3xl font-bold text-white tracking-widest">02:14:33</div>
      <div className="absolute right-16 flex flex-col gap-3">
        {['STATE_DELTA', 'ROUTE_UPDATE', 'INTF_CHANGE'].map((label, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-sky-500 animate-ping" style={{ animationDelay: `${i * 0.4}s` }}></div>
            <span className="text-[9px] font-mono text-sky-400 uppercase">{label}</span>
          </div>
        ))}
      </div>
      <div className="absolute bottom-8 left-12 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Fig 1.8: CloudVision Time-Travel</div>
    </div>
  );
  if (index === 9) return ( // Cloud-Grade Operations — concentric rings
    <div className="relative w-full h-full flex items-center justify-center">
      {([{ label: 'CAMPUS', size: 280, cls: 'border-blue-500/30' }, { label: 'DATA CENTER', size: 190, cls: 'border-emerald-500/40' }, { label: 'CLOUD', size: 100, cls: 'border-violet-500/50' }] as const).map(({ label, size, cls }) => (
        <div key={label} className={`absolute rounded-full border-2 ${cls} flex items-center justify-center`} style={{ width: size, height: size }}>
          <span className="absolute -top-3 bg-black px-1 text-[8px] font-mono text-zinc-500 uppercase">{label}</span>
        </div>
      ))}
      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center z-10">
        <Network size={14} className="text-white" />
      </div>
      <div className="absolute bottom-8 left-12 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Fig 1.9: Unified Operational Plane</div>
    </div>
  );
  if (index === 10) return ( // Operational TCO — diverging SVG lines
    <div className="relative w-full h-full flex items-center justify-center p-12">
      <div className="relative w-full max-w-xl h-64 border-l border-b border-zinc-700">
        <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
          <path d="M 0 50 C 150 60, 350 160, 500 220" stroke="#f43f5e" strokeWidth="2.5" fill="none" strokeDasharray="6 3" />
          <path d="M 0 220 C 150 200, 350 100, 500 20" stroke="#10b981" strokeWidth="2.5" fill="none" />
        </svg>
        <span className="absolute top-2 right-4 text-[9px] font-mono text-emerald-400 uppercase">Performance ↑</span>
        <span className="absolute bottom-12 right-4 text-[9px] font-mono text-rose-400 uppercase">OpEx ↓</span>
      </div>
      <div className="absolute bottom-8 left-12 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Fig 1.10: TCO Crossover Point</div>
    </div>
  );
  if (index === 11) return ( // Network Renaissance — sunburst
    <div className="relative w-full h-full flex items-center justify-center">
      {[200, 160, 120, 80, 40].map((r, i) => (
        <div key={i} className="absolute rounded-full border border-blue-500/20 animate-pulse" style={{ width: r * 2, height: r * 2, animationDelay: `${i * 0.4}s` }}></div>
      ))}
      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center z-10 shadow-[0_0_60px_rgba(37,99,235,0.6)]">
        <Sparkles size={28} className="text-white" />
      </div>
      <div className="absolute bottom-8 left-12 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Fig 1.11: The Network Renaissance</div>
    </div>
  );
  return <VisualObservabilityLoop />;
};

const WirelessVisuals: React.FC<{ index: number }> = ({ index }) => {
  if (index === 0) return ( // Connectivity Illusion
    <div className="flex items-center justify-center h-full gap-12">
        <div className="flex flex-col items-center gap-2">
            <div className="w-32 h-32 bg-zinc-900 border border-emerald-500 rounded-full flex items-center justify-center text-emerald-500 font-bold text-xl">UP</div>
            <span className="text-[10px] text-zinc-500 uppercase">Legacy Dashboard</span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <div className="w-32 h-32 bg-zinc-900 border border-rose-500 rounded-full flex items-center justify-center text-rose-500 font-bold text-xl">LAG</div>
            <span className="text-[10px] text-zinc-500 uppercase">User Reality</span>
        </div>
    </div>
  );
  if (index === 1) return <VisualWirelessSpectrum />;
  if (index === 2) return ( // 3rd Radio
    <div className="relative w-full h-full flex items-center justify-center">
       <div className="w-40 h-40 rounded-full border border-zinc-700 flex items-center justify-center relative">
          <div className="absolute inset-0 border-2 border-cyan-500/30 rounded-full animate-spin-slow"></div>
          <Radio size={40} className="text-cyan-500" />
          <div className="absolute -top-8 bg-black px-2 text-[10px] text-cyan-500 uppercase">Continuous Scan</div>
       </div>
    </div>
  );
  if (index === 3) return <VisualClientJourney />;
  if (index === 4) return ( // Application Awareness — app lanes with priority
    <div className="relative w-full h-full flex flex-col items-center justify-center gap-3">
      {([{ label: 'MS Teams', color: 'border-blue-500 text-blue-400', tag: 'EF · P1' }, { label: 'Zoom', color: 'border-sky-500 text-sky-400', tag: 'EF · P1' }, { label: 'Salesforce', color: 'border-emerald-500 text-emerald-400', tag: 'AF · P3' }, { label: 'Backup', color: 'border-zinc-600 text-zinc-500', tag: 'BE · P7' }] as const).map(({ label, color, tag }) => (
        <div key={label} className={`w-80 h-10 border rounded-lg flex items-center justify-between px-4 ${color} bg-zinc-900/60`}>
          <span className="text-[10px] font-mono uppercase">{label}</span>
          <span className="text-[9px] font-mono bg-zinc-800 px-2 py-0.5 rounded">{tag}</span>
        </div>
      ))}
      <div className="absolute bottom-8 left-12 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Fig 2.4: App-Aware QoS</div>
    </div>
  );
  if (index === 5) return ( // Root Cause Synthesis — AI inference engine
    <div className="relative w-full h-full flex items-center justify-center gap-8">
      <div className="relative w-24 h-24">
        <div className="w-24 h-24 rounded-full border-2 border-cyan-500/40 flex items-center justify-center bg-zinc-900">
          <Cpu size={32} className="text-cyan-400" />
        </div>
        {['RADIUS', 'RF', 'DHCP', 'DNS'].map((src, i) => (
          <svg key={src} className="absolute inset-0 w-full h-full overflow-visible pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <line x1={12 + i * 22} y1={i % 2 === 0 ? -20 : 140} x2="50%" y2="50%" stroke="#06b6d4" strokeWidth="1" strokeDasharray="3 2" strokeOpacity="0.5" />
            <text x={i * 22} y={i % 2 === 0 ? -24 : 152} fontSize="8" fill="#71717a" fontFamily="monospace">{src}</text>
          </svg>
        ))}
      </div>
      <div className="w-56 p-4 bg-zinc-900 border border-cyan-500/30 rounded-lg">
        <div className="text-[8px] font-mono text-zinc-500 uppercase mb-2">Root Cause</div>
        <div className="text-xs font-mono text-cyan-300 leading-relaxed">"RADIUS cert expired on VLAN 10 SSID at 14:02:15"</div>
      </div>
      <div className="absolute bottom-8 left-12 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Fig 2.5: Inference Engine</div>
    </div>
  );
  if (index === 6) return ( // WIPS Air Guardian — rogue AP neutralization
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="w-80 h-64 border-2 border-dashed border-blue-500/40 rounded-3xl relative flex items-center justify-center bg-blue-500/5">
        <span className="absolute -top-3 bg-black px-2 text-[10px] font-mono text-blue-400 uppercase">Protected Airspace</span>
        <div className="w-16 h-16 rounded-full border-2 border-blue-500/40 flex items-center justify-center bg-zinc-900">
          <Wifi size={24} className="text-blue-400" />
        </div>
        <div className="absolute -top-4 -right-4 w-10 h-10 bg-rose-500/10 border border-rose-500 rounded-full flex items-center justify-center animate-pulse">
          <AlertTriangle size={16} className="text-rose-500" />
        </div>
        <div className="absolute -top-4 right-8 text-[9px] font-mono text-rose-400 uppercase">Rogue AP</div>
        <div className="absolute inset-0 border-4 border-blue-500/10 rounded-3xl animate-pulse"></div>
      </div>
      <div className="absolute bottom-8 left-12 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Fig 2.6: WIPS Containment</div>
    </div>
  );
  if (index === 7) return ( // Location Intelligence — triangulation
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="w-72 h-56 border border-zinc-700 rounded-lg bg-zinc-900/50 relative overflow-hidden">
        <div className="absolute inset-0 grid" style={{ backgroundSize: '24px 24px', backgroundImage: 'linear-gradient(to right,rgba(63,63,70,0.3) 1px,transparent 1px),linear-gradient(to bottom,rgba(63,63,70,0.3) 1px,transparent 1px)' }}></div>
        {([{ x: '15%', y: '20%', c: 'bg-sky-500' }, { x: '80%', y: '15%', c: 'bg-sky-500' }, { x: '50%', y: '80%', c: 'bg-sky-500' }] as const).map((b, i) => (
          <div key={i} className={`absolute w-3 h-3 ${b.c} rounded-full animate-ping`} style={{ left: b.x, top: b.y }}></div>
        ))}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <line x1="15%" y1="20%" x2="50%" y2="50%" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="4 2" strokeOpacity="0.5" />
          <line x1="80%" y1="15%" x2="50%" y2="50%" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="4 2" strokeOpacity="0.5" />
          <line x1="50%" y1="80%" x2="50%" y2="50%" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="4 2" strokeOpacity="0.5" />
          <circle cx="50%" cy="50%" r="6" fill="#0ea5e9" />
        </svg>
      </div>
      <div className="absolute bottom-8 left-12 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Fig 2.7: Location Triangulation</div>
    </div>
  );
  if (index === 8) return ( // Unified Edge Operations — converge to CV
    <div className="relative w-full h-full flex items-center justify-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <div className="w-14 h-14 bg-zinc-900 border border-zinc-700 rounded-xl flex items-center justify-center"><Server size={24} className="text-zinc-400" /></div>
        <span className="text-[8px] font-mono text-zinc-500 uppercase">Wired Switch</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <div className="h-px w-12 bg-zinc-600"></div>
        <ArrowRight size={14} className="text-sky-400" />
        <div className="h-px w-12 bg-zinc-600"></div>
      </div>
      <div className="w-16 h-16 bg-sky-600/20 border-2 border-sky-500/60 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(14,165,233,0.3)]">
        <Eye size={24} className="text-sky-400" />
      </div>
      <div className="flex flex-col items-center gap-1">
        <div className="h-px w-12 bg-zinc-600"></div>
        <ArrowLeft size={14} className="text-sky-400" />
        <div className="h-px w-12 bg-zinc-600"></div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="w-14 h-14 bg-zinc-900 border border-zinc-700 rounded-xl flex items-center justify-center"><Wifi size={24} className="text-zinc-400" /></div>
        <span className="text-[8px] font-mono text-zinc-500 uppercase">Access Point</span>
      </div>
      <div className="absolute bottom-8 left-12 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Fig 2.8: Unified Edge — CloudVision</div>
    </div>
  );
  if (index === 9) return ( // Automated RF Planning — self-adjusting circles
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="grid grid-cols-4 gap-6">
        {([{ r: 50, cls: 'border-cyan-500/60 bg-cyan-500/5' }, { r: 38, cls: 'border-cyan-400/40 bg-cyan-400/5' }, { r: 60, cls: 'border-sky-500/50 bg-sky-500/5' }, { r: 35, cls: 'border-sky-400/40 bg-sky-400/5' }, { r: 55, cls: 'border-cyan-500/60 bg-cyan-500/5' }, { r: 42, cls: 'border-cyan-400/40 bg-cyan-400/5' }, { r: 48, cls: 'border-sky-500/50 bg-sky-500/5' }, { r: 40, cls: 'border-cyan-500/60 bg-cyan-500/5' }] as const).map((c, i) => (
          <div key={i} className={`rounded-full border-2 ${c.cls} flex items-center justify-center animate-pulse`} style={{ width: c.r * 1.4, height: c.r * 1.4, animationDelay: `${i * 0.25}s` }}>
            <Wifi size={10} className="text-cyan-400 opacity-50" />
          </div>
        ))}
      </div>
      <div className="absolute bottom-8 left-12 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Fig 2.9: Cognitive RRM</div>
    </div>
  );
  if (index === 10) return ( // Cloud vs On-Prem Freedom — balance scale
    <div className="relative w-full h-full flex flex-col items-center justify-center gap-4">
      <div className="flex items-end gap-16">
        <div className="flex flex-col items-center gap-2">
          <div className="w-20 h-20 bg-zinc-900 border border-zinc-700 rounded-2xl flex flex-col items-center justify-center gap-1">
            <Cloud size={28} className="text-sky-400" />
            <span className="text-[8px] font-mono text-zinc-500 uppercase">Arista Cloud</span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-0 -mb-2">
          <div className="w-2 h-12 bg-zinc-700 rounded-full"></div>
          <div className="w-20 h-1 bg-zinc-500 rounded"></div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-20 h-20 bg-zinc-900 border border-zinc-700 rounded-2xl flex flex-col items-center justify-center gap-1">
            <Server size={28} className="text-emerald-400" />
            <span className="text-[8px] font-mono text-zinc-500 uppercase">On-Prem</span>
          </div>
        </div>
      </div>
      <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Identical Feature Set</div>
      <div className="absolute bottom-8 left-12 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Fig 2.10: Deployment Freedom</div>
    </div>
  );
  if (index === 11) return ( // Wireless Renaissance — cyan sunburst
    <div className="relative w-full h-full flex items-center justify-center">
      {[200, 160, 120, 80, 40].map((r, i) => (
        <div key={i} className="absolute rounded-full border border-cyan-500/20 animate-pulse" style={{ width: r * 2, height: r * 2, animationDelay: `${i * 0.4}s` }}></div>
      ))}
      <div className="w-16 h-16 bg-cyan-600 rounded-full flex items-center justify-center z-10 shadow-[0_0_60px_rgba(8,145,178,0.6)]">
        <Wifi size={28} className="text-white" />
      </div>
      <div className="absolute bottom-8 left-12 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Fig 2.11: Wireless Renaissance</div>
    </div>
  );
  return <VisualObservabilityLoop />;
};

const AiFabricsVisuals: React.FC<{ index: number }> = ({ index }) => {
  if (index === 0) return ( // Compute Shift
    <div className="relative w-full h-full flex items-center justify-center">
       <div className="grid grid-cols-4 gap-4">
          {[...Array(16)].map((_, i) => (
             <div key={i} className="w-4 h-4 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.05}s` }}></div>
          ))}
       </div>
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_80%)] pointer-events-none"></div>
       <div className="absolute bottom-8 left-12 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Fig 3.0: All-to-All Traffic</div>
    </div>
  );
  if (index === 1) return <VisualDeepBuffer />; // Deep Buffer Resilience
  if (index === 2) return ( // RoCE
    <div className="flex flex-col items-center justify-center gap-2 h-full">
       {[...Array(3)].map((_, i) => (
          <div key={i} className="w-64 h-2 bg-zinc-800 rounded overflow-hidden">
             <div className="h-full w-1/3 bg-white animate-[slide_1s_linear_infinite]" style={{ animationDelay: `${i * 0.2}s` }}></div>
          </div>
       ))}
       <span className="text-[10px] font-mono text-zinc-500 uppercase mt-4">Lossless Transport</span>
       <style>{`@keyframes slide { 0% { transform: translateX(-100%); } 100% { transform: translateX(300%); } }`}</style>
    </div>
  );
  if (index === 3) return <VisualIncast />; // LANZ/Telemetry
  if (index === 4) return ( // Non-Blocking Scale
    <div className="relative w-full h-full flex items-center justify-center">
       <div className="grid grid-cols-4 gap-8">
          {[...Array(4)].map((_, i) => (
             <div key={i} className="flex flex-col gap-2">
                <div className="w-12 h-8 bg-zinc-800 border border-zinc-700 rounded flex items-center justify-center text-[8px]">SPINE</div>
                <div className="h-8 w-px bg-zinc-800 mx-auto"></div>
                <div className="w-12 h-8 bg-zinc-800 border border-zinc-700 rounded flex items-center justify-center text-[8px]">LEAF</div>
             </div>
          ))}
       </div>
       <div className="absolute bottom-8 left-12 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Fig 3.4: CLOS Topology</div>
    </div>
  );
  return <VisualObservabilityLoop />;
};

// --- CLOUDVISION & NETOPS VISUALS ---

const CloudVisionVisuals: React.FC<{ index: number }> = ({ index }) => {
  if (index === 0) return ( // Management Gap — SNMP poll bar with missed event
    <div className="relative w-full h-full flex flex-col items-center justify-center gap-8">
      <div className="flex gap-4 items-end h-32 w-full max-w-lg px-8 border-b border-zinc-700 relative">
        {[0, 20, 40, 60, 80, 100].map(p => (
          <div key={p} className="w-1 h-8 bg-zinc-600 absolute bottom-0" style={{ left: `${p}%` }}></div>
        ))}
        <div className="absolute left-[50%] bottom-0 w-1 h-24 bg-rose-500 animate-pulse shadow-[0_0_20px_#f43f5e]"></div>
        <div className="absolute left-[50%] -top-8 -translate-x-1/2 text-[10px] font-mono text-rose-500 uppercase bg-black px-2 border border-rose-500/50 rounded">Missed Event</div>
      </div>
      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">SNMP Poll Interval: 5 min</span>
      <div className="absolute bottom-8 left-12 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Fig 5.0: The Visibility Gap</div>
    </div>
  );
  if (index === 1) return ( // State Streaming — SysDB → CV
    <div className="relative w-full h-full flex items-center justify-center gap-12">
      <div className="w-24 h-24 bg-zinc-900 border border-sky-500/40 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-[0_0_30px_rgba(14,165,233,0.15)]">
        <Database size={28} className="text-sky-400" />
        <span className="text-[8px] font-mono text-sky-500 uppercase">SysDB</span>
      </div>
      <div className="flex flex-col gap-2">
        {[0,1,2].map(i => (
          <div key={i} className="flex items-center gap-1">
            <div className="w-16 h-1 bg-sky-500/30 relative overflow-hidden rounded">
              <div className="absolute h-full w-4 bg-sky-400 animate-[slide_1.5s_linear_infinite]" style={{ animationDelay: `${i * 0.4}s` }}></div>
            </div>
            <ArrowRight size={10} className="text-sky-500" />
          </div>
        ))}
      </div>
      <div className="w-24 h-24 bg-sky-600/10 border-2 border-sky-500/50 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-[0_0_30px_rgba(14,165,233,0.2)]">
        <Eye size={28} className="text-sky-400" />
        <span className="text-[8px] font-mono text-sky-400 uppercase">CloudVision</span>
      </div>
      <div className="absolute bottom-8 left-12 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Fig 5.1: TerminAttr Streaming</div>
    </div>
  );
  if (index === 2) return ( // Time Machine — rewind clock
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="w-64 h-64 rounded-full border-4 border-dashed border-sky-500/30 flex items-center justify-center relative animate-spin-slow" style={{ animationDirection: 'reverse' }}>
        <div className="absolute top-0 w-1 h-10 bg-sky-500"></div>
      </div>
      <div className="absolute font-mono text-4xl font-bold text-white tracking-widest">02:14:33</div>
      <div className="absolute bottom-12 text-[10px] font-mono text-sky-500 uppercase tracking-widest">State Replay Active</div>
      <div className="absolute bottom-8 left-12 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Fig 5.2: Time-Machine Forensics</div>
    </div>
  );
  if (index === 3) return ( // Change Control — before/after diff
    <div className="relative w-full h-full flex items-center justify-center gap-6">
      <div className="w-32 h-36 bg-zinc-900 border border-zinc-700 rounded-lg p-3 font-mono text-[8px] text-zinc-400 overflow-hidden">
        {'interface Eth1\n  shutdown\n  no ip addr\n\nvlan 10\n  name old_prod'}
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="px-2 py-1 border border-emerald-500/50 rounded text-[8px] font-mono text-emerald-400 uppercase">Approved</div>
        <ArrowRight size={18} className="text-emerald-500" />
      </div>
      <div className="w-32 h-36 bg-zinc-900 border border-emerald-500/30 rounded-lg p-3 font-mono text-[8px] text-emerald-400 overflow-hidden">
        {'interface Eth1\n  no shutdown\n  ip addr 10.0.1.1\n\nvlan 10\n  name prod_v2'}
      </div>
      <div className="absolute bottom-8 left-12 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Fig 5.3: Change Control Diff</div>
    </div>
  );
  if (index === 4) return ( // ZTP — cable → boot → configured
    <div className="relative w-full h-full flex items-center justify-center gap-6">
      {([{ icon: <Server size={24} className="text-zinc-400" />, label: 'Cable In', sub: 'Power + Network' }, { icon: <RefreshCw size={24} className="text-sky-400 animate-spin" />, label: 'Auto-Boot', sub: 'Fetches EOS + Config' }, { icon: <CheckCircle2 size={24} className="text-emerald-400" />, label: 'Configured', sub: 'Ready to Forward' }] as const).map((step, i) => (
        <React.Fragment key={i}>
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 bg-zinc-900 border border-zinc-700 rounded-xl flex items-center justify-center">{step.icon}</div>
            <span className="text-[9px] font-mono text-zinc-400 uppercase">{step.label}</span>
            <span className="text-[8px] font-mono text-zinc-600">{step.sub}</span>
          </div>
          {i < 2 && <ArrowRight size={16} className="text-zinc-600 mb-4" />}
        </React.Fragment>
      ))}
      <div className="absolute bottom-8 left-12 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Fig 5.4: Zero-Touch Provisioning</div>
    </div>
  );
  if (index === 5) return ( // AVD YAML → EOS config
    <div className="relative w-full h-full flex items-center justify-center gap-8">
      <div className="w-36 h-40 bg-zinc-900 border border-zinc-700 rounded-lg p-3 font-mono text-[8px] text-blue-400 overflow-hidden">
        {'# AVD fabric.yaml\nfabric_name: PROD\n\nleaf_bgp_as: 65001\nspine_bgp_as: 65000\n\nvlans:\n  - id: 10\n    vni: 10010'}
      </div>
      <div className="flex flex-col items-center gap-1">
        {[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-sky-500 animate-ping" style={{ animationDelay: `${i * 0.25}s` }}></div>)}
        <ArrowRight size={18} className="text-sky-400 mt-1" />
      </div>
      <div className="w-36 h-40 bg-zinc-900 border border-sky-500/30 rounded-lg p-3 font-mono text-[8px] text-sky-300 overflow-hidden">
        {'router bgp 65001\n  router-id 1.1.1.1\n  neighbor SPINE\n    remote-as 65000\n\ninterface Vxlan1\n  vxlan source-interface\n  Loopback1'}
      </div>
      <div className="absolute bottom-8 left-12 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Fig 5.5: AVD Network as Code</div>
    </div>
  );
  if (index === 6) return ( // Studio — topology builder
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="w-80 h-56 border border-zinc-700 rounded-xl bg-zinc-900/50 relative overflow-hidden">
        <div className="absolute top-3 left-3 text-[8px] font-mono text-zinc-500 uppercase">Studio: Topology Builder</div>
        <div className="absolute w-14 h-10 bg-zinc-800 border border-zinc-600 rounded-lg flex items-center justify-center" style={{ top: '30%', left: '20%' }}>
          <span className="text-[8px] font-mono text-zinc-400">LEAF-1</span>
        </div>
        <div className="absolute w-14 h-10 bg-zinc-800 border border-zinc-600 rounded-lg flex items-center justify-center" style={{ top: '30%', right: '20%' }}>
          <span className="text-[8px] font-mono text-zinc-400">LEAF-2</span>
        </div>
        <div className="absolute w-14 h-10 bg-sky-900/60 border border-sky-500/60 rounded-lg flex items-center justify-center" style={{ top: '10%', left: '37%' }}>
          <span className="text-[8px] font-mono text-sky-400">SPINE</span>
        </div>
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <line x1="27%" y1="30%" x2="44%" y2="20%" stroke="#0ea5e9" strokeWidth="1.5" strokeOpacity="0.6" />
          <line x1="73%" y1="30%" x2="56%" y2="20%" stroke="#0ea5e9" strokeWidth="1.5" strokeOpacity="0.6" />
          <line x1="27%" y1="40%" x2="73%" y2="40%" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 2" strokeOpacity="0.5" className="animate-pulse" />
        </svg>
        <div className="absolute bottom-3 right-3 px-2 py-1 bg-sky-600 rounded text-[8px] font-mono text-white uppercase">Generate Configs</div>
      </div>
      <div className="absolute bottom-8 left-12 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Fig 5.6: Studio Intent Builder</div>
    </div>
  );
  if (index === 7) return ( // Compliance — golden config drift
    <div className="relative w-full h-full flex items-center justify-center gap-12">
      <div className="flex flex-col items-center gap-3">
        <div className="w-20 h-20 bg-emerald-900/20 border-2 border-emerald-500/50 rounded-2xl flex items-center justify-center">
          <CheckCircle2 size={36} className="text-emerald-400" />
        </div>
        <span className="text-[9px] font-mono text-emerald-400 uppercase">Golden Config</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <div className="h-px w-12 bg-zinc-700"></div>
        <span className="text-[8px] font-mono text-zinc-600">Drift?</span>
        <div className="h-px w-12 bg-zinc-700"></div>
      </div>
      <div className="flex flex-col items-center gap-3">
        <div className="w-20 h-20 bg-zinc-900 border-2 border-rose-500/50 rounded-2xl flex items-center justify-center animate-pulse">
          <AlertTriangle size={36} className="text-rose-400" />
        </div>
        <span className="text-[9px] font-mono text-rose-400 uppercase">ACL Modified</span>
      </div>
      <ArrowRight size={20} className="text-emerald-500" />
      <div className="flex flex-col items-center gap-3">
        <div className="w-20 h-20 bg-emerald-900/20 border-2 border-emerald-500/50 rounded-2xl flex items-center justify-center">
          <CheckCircle2 size={36} className="text-emerald-400" />
        </div>
        <span className="text-[9px] font-mono text-emerald-400 uppercase">Remediated</span>
      </div>
      <div className="absolute bottom-8 left-12 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Fig 5.7: Continuous Compliance</div>
    </div>
  );
  if (index === 8) return ( // Multi-site — 3 sites to CV globe
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="w-20 h-20 bg-sky-600/10 border-2 border-sky-500/50 rounded-full flex items-center justify-center z-10 shadow-[0_0_40px_rgba(14,165,233,0.2)]">
        <Eye size={28} className="text-sky-400" />
      </div>
      {([{ label: 'NYC DC', x: -180, y: -60 }, { label: 'SIN DC', x: 180, y: -60 }, { label: 'LHR Campus', x: 0, y: 100 }] as const).map(({ label, x, y }) => (
        <div key={label} className="absolute flex flex-col items-center gap-1" style={{ transform: `translate(${x}px, ${y}px)` }}>
          <div className="w-14 h-10 bg-zinc-900 border border-zinc-700 rounded-lg flex items-center justify-center">
            <Server size={16} className="text-zinc-400" />
          </div>
          <span className="text-[8px] font-mono text-zinc-500 uppercase">{label}</span>
          <svg className="absolute" width="200" height="120" style={{ top: '50%', left: '50%', transform: `translate(-50%, -50%) translate(${-x * 0.5}px, ${-y * 0.5}px)`, opacity: 0.3 }}>
            <line x1="50%" y1="50%" x2={`${50 + x * 0.25}%`} y2={`${50 + y * 0.25}%`} stroke="#0ea5e9" strokeWidth="1" strokeDasharray="4 2" />
          </svg>
        </div>
      ))}
      <div className="absolute bottom-8 left-12 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Fig 5.8: Multi-Site Visibility</div>
    </div>
  );
  // index 9 — Operating Model
  return (
    <div className="relative w-full h-full flex items-center justify-center gap-12">
      <div className="flex flex-col items-center gap-2">
        <div className="grid grid-cols-3 gap-1">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="w-8 h-8 bg-zinc-800 border border-zinc-700 rounded flex items-center justify-center">
              <Terminal size={10} className="text-zinc-500" />
            </div>
          ))}
        </div>
        <span className="text-[8px] font-mono text-zinc-500 uppercase">Per-Device CLI</span>
      </div>
      <ArrowRight size={24} className="text-sky-400" />
      <div className="flex flex-col items-center gap-2">
        <div className="w-28 h-20 bg-sky-600/10 border-2 border-sky-500/50 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-[0_0_30px_rgba(14,165,233,0.2)]">
          <Eye size={24} className="text-sky-400" />
          <span className="text-[8px] font-mono text-sky-400 uppercase">Fabric OS</span>
        </div>
        <span className="text-[8px] font-mono text-zinc-400 uppercase">One System</span>
      </div>
      <div className="absolute bottom-8 left-12 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Fig 5.9: The Operating Model Shift</div>
    </div>
  );
};

// --- BGP/EVPN IP FABRIC VISUALS ---

const IPFabricVisuals: React.FC<{ index: number }> = ({ index }) => {
  if (index === 0) return ( // STP — blocked links
    <div className="relative w-full h-full flex items-center justify-center">
      <svg width="340" height="240" viewBox="0 0 340 240" xmlns="http://www.w3.org/2000/svg">
        <rect x="130" y="10" width="80" height="36" rx="6" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />
        <text x="170" y="32" textAnchor="middle" fontSize="9" fill="#71717a" fontFamily="monospace">ROOT BRIDGE</text>
        <rect x="20" y="100" width="80" height="36" rx="6" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />
        <text x="60" y="122" textAnchor="middle" fontSize="9" fill="#71717a" fontFamily="monospace">SW-A</text>
        <rect x="240" y="100" width="80" height="36" rx="6" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />
        <text x="280" y="122" textAnchor="middle" fontSize="9" fill="#71717a" fontFamily="monospace">SW-B</text>
        <rect x="130" y="190" width="80" height="36" rx="6" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />
        <text x="170" y="212" textAnchor="middle" fontSize="9" fill="#71717a" fontFamily="monospace">SW-C</text>
        <line x1="130" y1="28" x2="100" y2="100" stroke="#10b981" strokeWidth="2" />
        <line x1="210" y1="28" x2="240" y2="100" stroke="#10b981" strokeWidth="2" />
        <line x1="100" y1="136" x2="130" y2="190" stroke="#10b981" strokeWidth="2" />
        <line x1="240" y1="136" x2="210" y2="190" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5 3" />
        <text x="228" y="172" fontSize="10" fill="#f59e0b" fontFamily="monospace" fontWeight="bold">BLK</text>
        <line x1="100" y1="118" x2="240" y2="118" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5 3" />
        <text x="155" y="112" fontSize="10" fill="#f59e0b" fontFamily="monospace" fontWeight="bold">BLK</text>
      </svg>
      <div className="absolute bottom-8 left-12 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Fig 6.0: STP — Half Bandwidth Wasted</div>
    </div>
  );
  if (index === 1) return ( // Leaf-spine ECMP
    <div className="relative w-full h-full flex items-center justify-center">
      <svg width="340" height="220" viewBox="0 0 340 220" xmlns="http://www.w3.org/2000/svg">
        <rect x="80" y="10" width="70" height="32" rx="6" fill="#18181b" stroke="#10b981" strokeWidth="1.5" />
        <text x="115" y="30" textAnchor="middle" fontSize="8" fill="#10b981" fontFamily="monospace">SPINE-1</text>
        <rect x="190" y="10" width="70" height="32" rx="6" fill="#18181b" stroke="#10b981" strokeWidth="1.5" />
        <text x="225" y="30" textAnchor="middle" fontSize="8" fill="#10b981" fontFamily="monospace">SPINE-2</text>
        {[30, 120, 210, 300].map((x, i) => (
          <g key={i}>
            <rect x={x} y="110" width="50" height="28" rx="4" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />
            <text x={x + 25} y="128" textAnchor="middle" fontSize="7" fill="#a1a1aa" fontFamily="monospace">LEAF-{i + 1}</text>
            <line x1={x + 25} y1="110" x2="115" y2="42" stroke="#10b981" strokeWidth="1" strokeOpacity="0.6" />
            <line x1={x + 25} y1="110" x2="225" y2="42" stroke="#10b981" strokeWidth="1" strokeOpacity="0.6" />
            <rect x={x + 5} y="165" width="40" height="20" rx="3" fill="#27272a" stroke="#3f3f46" strokeWidth="1" />
            <text x={x + 25} y="178" textAnchor="middle" fontSize="6" fill="#71717a" fontFamily="monospace">SERVER</text>
            <line x1={x + 25} y1="138" x2={x + 25} y2="165" stroke="#3f3f46" strokeWidth="1" />
          </g>
        ))}
        <text x="170" y="210" textAnchor="middle" fontSize="7" fill="#10b981" fontFamily="monospace">ALL PATHS ACTIVE · ECMP</text>
      </svg>
      <div className="absolute bottom-8 left-12 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Fig 6.1: Leaf-Spine — Full Bandwidth</div>
    </div>
  );
  if (index === 2) return ( // eBGP unnumbered underlay
    <div className="relative w-full h-full flex items-center justify-center gap-16">
      <div className="flex flex-col items-center gap-2">
        <div className="w-20 h-14 bg-zinc-900 border border-zinc-700 rounded-xl flex flex-col items-center justify-center gap-1">
          <span className="text-[9px] font-mono text-zinc-400">LEAF</span>
          <span className="text-[7px] font-mono text-zinc-600">AS 65001</span>
        </div>
        <div className="text-[7px] font-mono text-zinc-600">Lo0: 1.1.1.1</div>
      </div>
      <div className="flex flex-col items-center gap-1">
        <div className="text-[7px] font-mono text-emerald-500 uppercase bg-emerald-900/20 px-2 py-0.5 rounded border border-emerald-500/30">RFC 5549</div>
        <div className="w-24 h-px bg-zinc-600"></div>
        <div className="text-[7px] font-mono text-zinc-500 uppercase">No P2P IP</div>
        <div className="w-24 h-px bg-zinc-600"></div>
        <div className="text-[7px] font-mono text-sky-500 uppercase">eBGP Session</div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="w-20 h-14 bg-zinc-900 border border-sky-500/40 rounded-xl flex flex-col items-center justify-center gap-1">
          <span className="text-[9px] font-mono text-sky-400">SPINE</span>
          <span className="text-[7px] font-mono text-zinc-600">AS 65000</span>
        </div>
        <div className="text-[7px] font-mono text-zinc-600">Lo0: 2.2.2.2</div>
      </div>
      <div className="absolute bottom-8 left-12 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Fig 6.2: RFC 5549 Unnumbered eBGP</div>
    </div>
  );
  if (index === 3) return ( // EVPN control plane — no flooding
    <div className="relative w-full h-full flex items-center justify-center gap-8">
      <div className="w-20 h-20 bg-zinc-900 border border-emerald-500/40 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
        <Database size={24} className="text-emerald-400" />
        <span className="text-[7px] font-mono text-emerald-500 uppercase">BGP CP</span>
      </div>
      <div className="flex flex-col gap-3">
        {[{ label: 'RT-2 MAC/IP', color: 'text-blue-400 border-blue-500/40' }, { label: 'RT-3 BUM', color: 'text-amber-400 border-amber-500/40' }, { label: 'RT-5 Prefix', color: 'text-emerald-400 border-emerald-500/40' }].map(({ label, color }) => (
          <div key={label} className={`px-3 py-1 border rounded text-[8px] font-mono ${color} bg-zinc-900`}>{label}</div>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        {['VTEP-1', 'VTEP-2', 'VTEP-3'].map((v, i) => (
          <div key={v} className="w-16 h-8 bg-zinc-900 border border-zinc-700 rounded flex items-center justify-center">
            <span className="text-[7px] font-mono text-zinc-400">{v}</span>
          </div>
        ))}
      </div>
      <div className="absolute bottom-8 left-12 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Fig 6.3: EVPN — No Flooding</div>
    </div>
  );
  if (index === 4) return ( // RT-2 MAC/IP advertisement
    <div className="relative w-full h-full flex items-center justify-center gap-8">
      <div className="p-4 bg-zinc-900 border border-blue-500/30 rounded-xl">
        <div className="text-[8px] font-mono text-zinc-500 uppercase mb-3">BGP EVPN Update</div>
        <div className="space-y-2">
          <div className="flex gap-2 items-center"><span className="text-[8px] font-mono text-zinc-600 w-20">Route Type</span><span className="text-[8px] font-mono text-blue-400 bg-blue-900/20 px-2 rounded">2 (MAC/IP)</span></div>
          <div className="flex gap-2 items-center"><span className="text-[8px] font-mono text-zinc-600 w-20">MAC Addr</span><span className="text-[8px] font-mono text-white">00:50:79:66:68:0a</span></div>
          <div className="flex gap-2 items-center"><span className="text-[8px] font-mono text-zinc-600 w-20">IP Addr</span><span className="text-[8px] font-mono text-white">10.1.10.101</span></div>
          <div className="flex gap-2 items-center"><span className="text-[8px] font-mono text-zinc-600 w-20">L2 VNI</span><span className="text-[8px] font-mono text-emerald-400">10010</span></div>
          <div className="flex gap-2 items-center"><span className="text-[8px] font-mono text-zinc-600 w-20">VTEP IP</span><span className="text-[8px] font-mono text-zinc-400">1.1.1.1</span></div>
        </div>
      </div>
      <div className="absolute bottom-8 left-12 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Fig 6.4: RT-2 MAC/IP Advertisement</div>
    </div>
  );
  if (index === 5) return ( // RT-5 IP prefix / symmetric IRB
    <div className="relative w-full h-full flex items-center justify-center gap-6">
      <div className="flex flex-col gap-2">
        {['APP VRF', 'DB VRF'].map((v, i) => (
          <div key={v} className={`w-20 h-12 bg-zinc-900 border rounded-lg flex items-center justify-center ${i === 0 ? 'border-blue-500/40' : 'border-emerald-500/40'}`}>
            <span className={`text-[8px] font-mono ${i === 0 ? 'text-blue-400' : 'text-emerald-400'} uppercase`}>{v}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center gap-1">
        <ArrowRight size={14} className="text-zinc-500" />
        <div className="text-[7px] font-mono text-amber-400 uppercase bg-amber-900/20 px-2 py-0.5 rounded border border-amber-500/30">RT-5</div>
        <div className="text-[7px] font-mono text-zinc-600">L3 VNI: 50001</div>
        <ArrowLeft size={14} className="text-zinc-500" />
      </div>
      <div className="w-20 h-28 bg-zinc-900 border border-zinc-700 rounded-xl flex flex-col items-center justify-center gap-1">
        <span className="text-[8px] font-mono text-zinc-400 uppercase">LEAF</span>
        <span className="text-[7px] font-mono text-zinc-600">Sym. IRB</span>
      </div>
      <div className="absolute bottom-8 left-12 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Fig 6.5: RT-5 Symmetric IRB</div>
    </div>
  );
  if (index === 6) return ( // Anycast Gateway / VARP
    <div className="relative w-full h-full flex items-center justify-center">
      <svg width="320" height="220" viewBox="0 0 320 220" xmlns="http://www.w3.org/2000/svg">
        {[50, 160, 270].map((x, i) => (
          <g key={i}>
            <rect x={x - 30} y="60" width="60" height="28" rx="4" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />
            <text x={x} y="78" textAnchor="middle" fontSize="7" fill="#a1a1aa" fontFamily="monospace">LEAF-{i + 1}</text>
            <text x={x} y="120" textAnchor="middle" fontSize="7" fill="#10b981" fontFamily="monospace">GW: 10.0.0.1</text>
            <text x={x} y="133" textAnchor="middle" fontSize="6" fill="#71717a" fontFamily="monospace">VARP</text>
          </g>
        ))}
        <path d="M 50 88 Q 160 30 270 88" stroke="#10b981" strokeWidth="1.5" fill="none" strokeDasharray="5 3" strokeOpacity="0.5" />
        <text x="160" y="24" textAnchor="middle" fontSize="8" fill="#10b981" fontFamily="monospace">Same GW IP + MAC</text>
        <rect x="110" y="170" width="100" height="28" rx="4" fill="#27272a" stroke="#3f3f46" strokeWidth="1" />
        <text x="160" y="188" textAnchor="middle" fontSize="7" fill="#71717a" fontFamily="monospace">HOST: 10.0.0.101</text>
        <line x1="160" y1="170" x2="160" y2="88" stroke="#3f3f46" strokeWidth="1" strokeDasharray="3 2" />
      </svg>
      <div className="absolute bottom-8 left-12 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Fig 6.6: Anycast Gateway (VARP)</div>
    </div>
  );
  if (index === 7) return ( // MLAG dual-homing
    <div className="relative w-full h-full flex items-center justify-center">
      <svg width="300" height="220" viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg">
        <rect x="80" y="20" width="60" height="28" rx="4" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />
        <text x="110" y="38" textAnchor="middle" fontSize="7" fill="#a1a1aa" fontFamily="monospace">LEAF-1</text>
        <rect x="160" y="20" width="60" height="28" rx="4" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />
        <text x="190" y="38" textAnchor="middle" fontSize="7" fill="#a1a1aa" fontFamily="monospace">LEAF-2</text>
        <line x1="140" y1="34" x2="160" y2="34" stroke="#f59e0b" strokeWidth="2" />
        <text x="150" y="28" textAnchor="middle" fontSize="7" fill="#f59e0b" fontFamily="monospace">ISL</text>
        <rect x="115" y="130" width="70" height="28" rx="4" fill="#27272a" stroke="#3f3f46" strokeWidth="1.5" />
        <text x="150" y="148" textAnchor="middle" fontSize="7" fill="#71717a" fontFamily="monospace">SERVER</text>
        <line x1="110" y1="130" x2="110" y2="48" stroke="#10b981" strokeWidth="2" />
        <line x1="190" y1="130" x2="190" y2="48" stroke="#10b981" strokeWidth="2" />
        <text x="88" y="95" textAnchor="middle" fontSize="7" fill="#10b981" fontFamily="monospace">Active</text>
        <text x="212" y="95" textAnchor="middle" fontSize="7" fill="#10b981" fontFamily="monospace">Active</text>
        <text x="150" y="108" textAnchor="middle" fontSize="8" fill="#10b981" fontFamily="monospace">LACP / LAG</text>
      </svg>
      <div className="absolute bottom-8 left-12 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Fig 6.7: MLAG Active-Active Dual-Homing</div>
    </div>
  );
  if (index === 8) return ( // DCI — border leaf VXLAN tunnel
    <div className="relative w-full h-full flex items-center justify-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <div className="w-16 h-10 bg-zinc-900 border border-zinc-700 rounded-lg flex items-center justify-center">
          <span className="text-[7px] font-mono text-zinc-400">LEAF</span>
        </div>
        <div className="w-1 h-6 bg-zinc-700"></div>
        <div className="w-20 h-12 bg-zinc-900 border border-emerald-500/50 rounded-xl flex flex-col items-center justify-center gap-1">
          <span className="text-[7px] font-mono text-emerald-400">BORDER</span>
          <span className="text-[6px] font-mono text-zinc-600">VTEP</span>
        </div>
      </div>
      <div className="flex flex-col items-center gap-1">
        <svg width="120" height="40" viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg">
          <path d="M 5 35 Q 60 -10 115 35" stroke="#10b981" strokeWidth="2" fill="none" strokeDasharray="6 3" />
          <text x="60" y="10" textAnchor="middle" fontSize="7" fill="#10b981" fontFamily="monospace">VXLAN DCI</text>
        </svg>
        <span className="text-[7px] font-mono text-zinc-600 uppercase">VNI-controlled</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="w-16 h-10 bg-zinc-900 border border-zinc-700 rounded-lg flex items-center justify-center">
          <span className="text-[7px] font-mono text-zinc-400">LEAF</span>
        </div>
        <div className="w-1 h-6 bg-zinc-700"></div>
        <div className="w-20 h-12 bg-zinc-900 border border-emerald-500/50 rounded-xl flex flex-col items-center justify-center gap-1">
          <span className="text-[7px] font-mono text-emerald-400">BORDER</span>
          <span className="text-[6px] font-mono text-zinc-600">VTEP</span>
        </div>
      </div>
      <div className="absolute bottom-8 left-12 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Fig 6.8: DCI via Border Leaf</div>
    </div>
  );
  // index 9 — One Fabric One OS
  return (
    <div className="relative w-full h-full flex items-center justify-center gap-8">
      {([{ label: 'Campus', sub: 'EOS 4.3x', cls: 'border-blue-500/40 text-blue-400' }, { label: 'DC Leaf', sub: 'EOS 4.3x', cls: 'border-emerald-500/40 text-emerald-400' }, { label: 'Cloud PE', sub: 'EOS 4.3x', cls: 'border-violet-500/40 text-violet-400' }] as const).map(({ label, sub, cls }) => (
        <div key={label} className={`w-20 h-20 bg-zinc-900 border-2 rounded-2xl flex flex-col items-center justify-center gap-1 ${cls}`}>
          <span className="text-[9px] font-mono uppercase">{label}</span>
          <span className="text-[7px] font-mono text-zinc-600">{sub}</span>
        </div>
      ))}
      <div className="absolute bottom-16 flex flex-col items-center gap-1">
        <ArrowRight size={14} className="text-sky-400 rotate-90" />
        <div className="w-16 h-8 bg-sky-600/10 border border-sky-500/50 rounded-lg flex items-center justify-center">
          <Eye size={12} className="text-sky-400" />
        </div>
        <span className="text-[7px] font-mono text-sky-500 uppercase">CloudVision</span>
      </div>
      <div className="absolute bottom-8 left-12 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.4em]">Fig 6.9: One Fabric, One OS</div>
    </div>
  );
};

// --- SCENE VISUAL ROUTER ---

const SceneVisual: React.FC<{ intent: string; index: number; active: boolean; presetId?: string }> = ({ intent, index, active, presetId }) => {
  return (
    <div className={`relative w-full h-full flex items-center justify-center transition-all duration-700 bg-zinc-950 ${active ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>

       {presetId === 'why-arista-2' ? (
          <div className="scale-90 md:scale-100">
             {index === 0 && <VisualConstraintGraph />}
             {index === 1 && <VisualConfigVsState />}
             {index === 2 && <VisualObservabilityLoop />}
             {index === 3 && <VisualSysDBArchitecture />}
             {index === 4 && <VisualChangePipeline />}
             {index === 5 && <VisualWirelessCorrelation />}
             {index === 6 && <VisualInevitabilityFunnel />}
             {index === 7 && <VisualArchitectureVsTooling />}
             {index === 8 && <VisualConfidenceStack />}
          </div>
       ) : presetId === 'zero-trust' ? (
          <VisualZeroTrust index={index} />
       ) : presetId === 'wireless-diff' ? (
          <WirelessVisuals index={index} />
       ) : presetId === 'ai-fabrics' ? (
          <AiFabricsVisuals index={index} />
       ) : presetId === 'cloudvision-netops' ? (
          <CloudVisionVisuals index={index} />
       ) : presetId === 'ip-fabric' ? (
          <IPFabricVisuals index={index} />
       ) : presetId === 'life-sciences-gxp' ? (
          <LifeSciencesVisuals index={index} />
       ) : (
          <WhyAristaLegacyVisuals index={index} />
       )}

       {/* Meta Tag for Visual Intent (Presenter Aid) */}
       {!active && <div className="absolute inset-0 bg-black z-50"></div>}
    </div>
  );
};

export const BriefingTheater: React.FC<BriefingTheaterProps> = ({ onBack }) => {
  const [narrative, setNarrative] = useState<BriefingNarrative | null>(null);
  const [activePresetId, setActivePresetId] = useState<string | undefined>(undefined);
  const [currentScene, setCurrentScene] = useState(0);
  const [isZen, setIsZen] = useState(false);
  const [presenterMode, setPresenterMode] = useState(false);
  const [showTeleprompter, setShowTeleprompter] = useState(true);
  const [scrollLock, setScrollLock] = useState(false);
  const [fontScale, setFontScale] = useState(1.25);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState('');

  const paletteInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // ... (Effects remain identical)
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (!hash) return;
    if (narrative) {
      const idx = narrative.scenes.findIndex(s => slugify(s.heading) === hash);
      if (idx !== -1) { setCurrentScene(idx); return; }
    }
    for (const key in SIGNATURE_NARRATIVES) {
      const preset = SIGNATURE_NARRATIVES[key];
      const idx = preset.scenes.findIndex(s => slugify(s.heading) === hash);
      if (idx !== -1) {
        setNarrative(preset);
        setActivePresetId(key);
        setCurrentScene(idx);
        break;
      }
    }
  }, [location.hash, narrative]);

  useEffect(() => {
    if (!narrative) return;
    const scene = narrative.scenes[currentScene];
    const slug = slugify(scene.heading);
    if (location.hash !== `#${slug}`) navigate(`#${slug}`, { replace: true });
  }, [currentScene, narrative, navigate]);

  useEffect(() => { setScrollLock(presenterMode); }, [presenterMode]);

  useEffect(() => {
    if (!scrollLock) return;
    const preventScroll = (e: Event) => { e.preventDefault(); e.stopPropagation(); };
    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });
    return () => {
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
    };
  }, [scrollLock]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!narrative) return;
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setPaletteOpen(prev => !prev); return; }
      if (paletteOpen && e.key === 'Escape') { setPaletteOpen(false); return; }
      if (paletteOpen) return;
      const isNext = e.key === 'ArrowRight' || e.key === ' ';
      const isPrev = e.key === 'ArrowLeft';
      const isStepNext = scrollLock && (e.key === 'ArrowDown' || e.key === 'PageDown');
      const isStepPrev = scrollLock && (e.key === 'ArrowUp' || e.key === 'PageUp');
      if (isNext || isStepNext) { if (isStepNext) e.preventDefault(); next(); }
      if (isPrev || isStepPrev) { if (isStepPrev) e.preventDefault(); prev(); }
      if (e.key === 'z') setIsZen(!isZen);
      if (e.key === 't') setShowTeleprompter(!showTeleprompter);
      if (e.key === 'Escape') { setPresenterMode(false); setIsZen(false); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [narrative, currentScene, isZen, showTeleprompter, presenterMode, scrollLock, paletteOpen]);

  useEffect(() => {
    if (narrative) return;
    try {
      const stored = localStorage.getItem('teleprompter_context');
      if (!stored) return;
      const ctx = JSON.parse(stored) as TeleprompterContext;
      if (!ctx?.scene?.heading) return;
      const tempNarrative: BriefingNarrative = {
        title: ctx.title || 'Imported Narrative',
        subtitle: 'From Narrative Playbook Studio',
        scenes: [
          {
            heading: ctx.scene.heading,
            caption: ctx.scene.caption || '',
            teleprompter: ctx.scene.teleprompter || ctx.scene.caption || '',
            visualIntent: ctx.scene.visualIntent || 'Imported from Narrative Playbook'
          }
        ]
      };
      setNarrative(tempNarrative);
      setCurrentScene(0);
      setShowTeleprompter(true);
      localStorage.removeItem('teleprompter_context');
    } catch {
      // ignore parse errors
    }
  }, [narrative]);

  useEffect(() => {
    if (paletteOpen && paletteInputRef.current) setTimeout(() => paletteInputRef.current?.focus(), 50);
    else setPaletteQuery('');
  }, [paletteOpen]);

  const handleSelectPreset = (presetId: string) => {
    setActivePresetId(presetId);
    if (SIGNATURE_NARRATIVES[presetId]) {
      setNarrative(SIGNATURE_NARRATIVES[presetId]);
      setCurrentScene(0);
    }
  };

  const next = () => { if (narrative && currentScene < narrative.scenes.length - 1) setCurrentScene(currentScene + 1); };
  const prev = () => { if (currentScene > 0) setCurrentScene(currentScene - 1); };
  const filteredScenes = useMemo(() => {
    if (!narrative) return [];
    return narrative.scenes.map((scene, idx) => ({ ...scene, originalIndex: idx }))
      .filter(s => s.heading.toLowerCase().includes(paletteQuery.toLowerCase()) || s.caption.toLowerCase().includes(paletteQuery.toLowerCase()));
  }, [narrative, paletteQuery]);
  const jumpToScene = (index: number) => { setCurrentScene(index); setPaletteOpen(false); };

  if (!narrative) {
    // ... (Selection Screen - Modified)
    return (
      <div className="min-h-screen bg-zinc-950 text-white font-sans flex items-center justify-center p-8 overflow-y-auto">
         <div className="max-w-4xl w-full space-y-16 animate-fade-in py-12">
            <header className="text-center space-y-6">
               <button onClick={onBack} className="text-zinc-600 hover:text-white flex items-center gap-2 mx-auto text-xs font-bold uppercase tracking-widest transition-colors mb-4">
                  <ArrowLeft size={14} /> Systems Return
               </button>
               <div className="w-20 h-20 bg-violet-500/10 border border-violet-500/20 rounded-3xl flex items-center justify-center text-violet-400 mx-auto shadow-2xl">
                  <Tv size={40} />
               </div>
               <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tighter">Briefing Theater</h1>
               <p className="text-zinc-500 text-lg max-w-2xl mx-auto">Cinema-grade architectural storytelling. Replace static slides with a curated narrative journey.</p>
            </header>
            <div className="space-y-12">
               <section className="space-y-6">
                  <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-600 text-center flex items-center justify-center gap-4">
                     <span className="h-px w-12 bg-zinc-800"></span> Signature Series <span className="h-px w-12 bg-zinc-800"></span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                     {PRESETS.map((preset) => (
                        <button key={preset.id} onClick={() => handleSelectPreset(preset.id)} className={`group p-6 bg-zinc-900 border border-zinc-800 rounded-[2rem] text-left transition-all hover:border-violet-500/50 hover:bg-zinc-900/80 hover:-translate-y-1 disabled:opacity-50`}>
                           <div className={`w-10 h-10 rounded-2xl ${preset.bg} ${preset.border} flex items-center justify-center ${preset.color} mb-6 transition-transform group-hover:scale-110`}><preset.icon size={20} /></div>
                           <h4 className="text-xl font-serif font-bold text-white mb-2 group-hover:text-violet-400 transition-colors">{preset.title}</h4>
                           <p className="text-xs text-zinc-500 leading-relaxed mb-6 line-clamp-3">{preset.topic}</p>
                           <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-600 group-hover:text-white transition-colors">Initialize <ChevronRight size={12} /></div>
                        </button>
                     ))}
                  </div>
               </section>
            </div>
         </div>
      </div>
    );
  }

  const activeScene = narrative.scenes[currentScene];

  return (
    <div className={`min-h-screen bg-black text-white font-sans flex flex-col overflow-hidden transition-all duration-1000 ${isZen || presenterMode ? 'cursor-none' : ''}`}>
       
       {/* TOP HUD */}
       {!isZen && !presenterMode && (
          <header className="h-16 border-b border-zinc-900 flex items-center justify-between px-8 bg-zinc-950/80 backdrop-blur-md shrink-0 z-50">
             <div className="flex items-center gap-6">
                <button 
                  onClick={() => {
                    setNarrative(null);
                    navigate(location.pathname, { replace: true });
                  }} 
                  className="p-2 text-zinc-600 hover:text-white transition-colors"
                >
                   <ArrowLeft size={20} />
                </button>
                <div className="h-4 w-px bg-zinc-800"></div>
                <div>
                   <h2 className="text-sm font-bold uppercase tracking-wider">{narrative.title}</h2>
                   <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Theater Online</span>
                   </div>
                </div>
             </div>
             <div className="flex items-center gap-4">
                <button onClick={() => setPresenterMode(true)} className="p-2 rounded-lg border border-zinc-800 text-zinc-600 hover:text-white transition-colors" title="Presenter Mode"><Presentation size={16} /></button>
                <button onClick={() => setShowTeleprompter(!showTeleprompter)} className={`p-2 rounded-lg border transition-all ${showTeleprompter ? 'bg-violet-500/10 border-violet-500/50 text-violet-400' : 'border-zinc-800 text-zinc-600'}`}><Mic2 size={16} /></button>
                <button onClick={() => setIsZen(!isZen)} className="p-2 border border-zinc-800 rounded-lg text-zinc-600 hover:text-white"><Maximize2 size={16} /></button>
             </div>
          </header>
       )}

       {/* MAIN CANVAS */}
       <div className="flex-1 relative flex">
          <div className={`flex-1 relative transition-all duration-700 ${showTeleprompter && !isZen && !presenterMode ? 'pr-80' : ''}`} id={slugify(activeScene.heading)}>
             
             {/* Dynamic Scene Visual */}
             <div className="absolute inset-0 z-0">
                <SceneVisual intent={activeScene.visualIntent} index={currentScene} active={true} presetId={activePresetId} />
             </div>

             {/* Narrative Text */}
             <div 
               className={`absolute inset-x-0 bottom-24 px-12 md:px-24 z-10 space-y-6 transition-all duration-500 ${presenterMode ? 'origin-bottom-left bottom-32' : ''}`}
               style={{ transform: presenterMode ? `scale(${fontScale})` : 'none' }}
             >
                <div className="flex items-center gap-4">
                   <span className="font-mono text-xs text-blue-500 uppercase tracking-[0.4em] mb-2 block border-b border-blue-500/20 pb-2">
                      Part {currentScene < 9 ? `0${currentScene + 1}` : currentScene + 1}
                   </span>
                   <div className="h-px bg-zinc-900 flex-1"></div>
                </div>
                <h1 className="text-5xl md:text-7xl font-serif font-black tracking-tighter leading-[0.95] drop-shadow-2xl max-w-4xl">
                   {activeScene.heading}
                </h1>
                <p className="text-xl text-zinc-400 font-light max-w-3xl leading-relaxed italic border-l-2 border-zinc-800 pl-6">
                   {activeScene.caption}
                </p>
             </div>

             {/* Progress HUD */}
             {!isZen && !presenterMode && (
                <div className="absolute bottom-8 left-10 right-10 flex justify-between items-center z-50">
                   <div className="flex gap-1.5 flex-wrap max-w-[60%]">
                      {narrative.scenes.map((_, i) => (
                         <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === currentScene ? 'w-12 bg-white' : 'w-4 bg-zinc-800 hover:bg-zinc-600 cursor-pointer'}`} onClick={() => setCurrentScene(i)}></div>
                      ))}
                   </div>
                   <div className="flex gap-4">
                      <button onClick={prev} disabled={currentScene === 0} className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl text-zinc-500 hover:text-white disabled:opacity-20"><ChevronLeft size={24} /></button>
                      <button onClick={next} disabled={currentScene === narrative.scenes.length - 1} className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl text-zinc-500 hover:text-white disabled:opacity-20"><ChevronRight size={24} /></button>
                   </div>
                </div>
             )}

             {/* Presenter Mode Controls */}
             {presenterMode && (
                <div className="fixed top-6 right-6 flex items-center gap-4 z-50">
                    <div className="flex items-center bg-black/50 backdrop-blur-md rounded-full border border-white/10 p-1">
                        <button onClick={() => setFontScale(s => Math.max(0.8, s - 0.1))} className="p-2 hover:bg-white/20 rounded-full text-white transition-colors"><Minus size={14} /></button>
                        <span className="text-[10px] font-mono w-10 text-center text-white/70 select-none">{Math.round(fontScale * 100)}%</span>
                        <button onClick={() => setFontScale(s => Math.min(2.0, s + 0.1))} className="p-2 hover:bg-white/20 rounded-full text-white transition-colors"><Plus size={14} /></button>
                    </div>
                    <button onClick={() => setPresenterMode(false)} className="p-3 bg-black/50 hover:bg-zinc-800 text-white/50 hover:text-white rounded-full transition-all backdrop-blur-md group relative">
                        <X size={20} />
                    </button>
                </div>
             )}
          </div>

          {/* TELEPROMPTER */}
          {showTeleprompter && !isZen && !presenterMode && (
             <aside className="w-80 bg-zinc-900/90 backdrop-blur border-l border-zinc-800 p-8 flex flex-col gap-8 animate-fade-in overflow-y-auto">
                <div>
                   <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
                      <Mic2 size={14} /> Talk Track
                   </h3>
                   <div className="p-6 bg-black border border-zinc-800 rounded-2xl relative">
                      <p className="text-lg leading-relaxed text-zinc-200 font-medium font-serif">
                         {activeScene.teleprompter}
                      </p>
                   </div>
                </div>
                <div className="mt-auto bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-center">
                   <p className="text-[10px] text-zinc-500 font-mono">Present with authority.</p>
                </div>
             </aside>
          )}
       </div>

       {/* COMMAND PALETTE */}
        {paletteOpen && (
           <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-start justify-center pt-32 animate-fade-in" onClick={(e) => { if (e.target === e.currentTarget) setPaletteOpen(false); }}>
              <div className="w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[60vh]">
                 <div className="p-4 border-b border-zinc-800 flex items-center gap-3">
                    <Search size={18} className="text-zinc-500" />
                   <input ref={paletteInputRef} className="flex-1 bg-transparent border-none outline-none text-white placeholder-zinc-600 text-lg font-sans" placeholder="Jump to section..." value={paletteQuery} onChange={(e) => setPaletteQuery(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && filteredScenes.length > 0) jumpToScene(filteredScenes[0].originalIndex); }} />
                   <div className="px-2 py-1 rounded bg-zinc-800 border border-zinc-700 text-[10px] font-mono text-zinc-400">ESC</div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                   {filteredScenes.length > 0 ? filteredScenes.map((scene, idx) => (
                      <button key={idx} onClick={() => jumpToScene(scene.originalIndex)} className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between group transition-colors ${idx === 0 ? 'bg-violet-600/10 border border-violet-500/20' : 'hover:bg-zinc-800 border border-transparent'}`}>
                         <div className="flex flex-col"><span className={`text-sm font-bold ${idx === 0 ? 'text-violet-400' : 'text-zinc-200 group-hover:text-white'}`}>{scene.heading}</span><span className="text-[10px] text-zinc-500 line-clamp-1">{scene.caption}</span></div>
                         {idx === 0 && <CornerDownLeft size={14} className="text-violet-500" />}
                      </button>
                   )) : <div className="p-8 text-center text-zinc-500 text-xs font-mono uppercase tracking-widest">No matching scenes</div>}
                </div>
              </div>
           </div>
        )}
        <div className="p-6">
          <EvidenceDrawer contextTags={['Narrative']} />
        </div>
     </div>
  );
};
