
import React, { useEffect, useState } from 'react';
import { ArrowLeft, Network, Zap, ShieldCheck, ChevronRight, Terminal, Info, Layout, Activity, MessageSquare, Database, ArrowRightLeft, Server, Cpu, Share2, Shield, Layers, CheckCircle2, BookOpen, Target, Copy, Check, Radio, GitBranch } from 'lucide-react';
import { PROTOCOL_CONTENT, ProtocolDetail, DCContext } from '@data/protocolsContent';
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

const BGPVisual = () => (
  <div className="relative w-full h-full flex items-center justify-center bg-card-bg rounded-3xl border border-border p-8 overflow-hidden group">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.08)_0%,transparent_70%)]"></div>
    <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-sm">
      <div className="flex justify-between w-full items-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-20 h-12 bg-zinc-950 border border-violet-500/40 rounded-xl flex flex-col items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.2)]">
            <span className="text-[9px] font-mono font-bold text-violet-400">AS 65001</span>
            <span className="text-[7px] font-mono text-zinc-600">LEAF</span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1 flex-1 px-4">
          <div className="w-full h-px bg-gradient-to-r from-violet-500/40 via-violet-500 to-violet-500/40 animate-pulse"></div>
          <span className="text-[8px] font-mono text-violet-500 uppercase tracking-wider">eBGP NLRI</span>
          <div className="w-full h-px bg-gradient-to-r from-violet-500/40 via-violet-500 to-violet-500/40 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-20 h-12 bg-zinc-950 border border-violet-500/40 rounded-xl flex flex-col items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.2)]">
            <span className="text-[9px] font-mono font-bold text-violet-400">AS 65000</span>
            <span className="text-[7px] font-mono text-zinc-600">SPINE</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 opacity-70">
        {['OPEN', 'UPDATE', 'KEEPALIVE'].map((msg) => (
          <div key={msg} className="px-2 py-1.5 rounded-lg bg-zinc-950 border border-violet-500/20 text-[7px] font-mono text-violet-400 uppercase tracking-wider text-center">{msg}</div>
        ))}
      </div>
    </div>
    <div className="absolute bottom-4 left-6 text-[8px] font-mono text-zinc-600 uppercase tracking-widest">Control Plane: BGP Path Vector</div>
  </div>
);

const QoSVisual = () => (
  <div className="relative w-full h-full flex items-center justify-center bg-card-bg rounded-3xl border border-border p-8 overflow-hidden group">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.08)_0%,transparent_70%)]"></div>
    <div className="relative z-10 flex flex-col items-center gap-4 w-full max-w-sm">
      <div className="w-full space-y-2">
        {[
          { label: 'TC7 · EF  · DSCP 46', color: 'bg-red-500', width: 'w-1/4', tag: 'Voice/PTP' },
          { label: 'TC5 · CS5 · DSCP 40', color: 'bg-orange-500', width: 'w-2/5', tag: 'Video/RoCE' },
          { label: 'TC3 · AF31· DSCP 26', color: 'bg-amber-400', width: 'w-3/5', tag: 'Storage' },
          { label: 'TC0 · BE  · DSCP  0', color: 'bg-zinc-600', width: 'w-full', tag: 'Default' },
        ].map((q) => (
          <div key={q.label} className="flex items-center gap-3">
            <span className="text-[8px] font-mono text-zinc-500 w-36 shrink-0">{q.label}</span>
            <div className={`h-5 ${q.width} ${q.color}/60 border border-amber-500/20 rounded group-hover:opacity-100 opacity-70 transition-all`}></div>
            <span className="text-[8px] font-mono text-zinc-600">{q.tag}</span>
          </div>
        ))}
      </div>
    </div>
    <div className="absolute bottom-4 left-6 text-[8px] font-mono text-zinc-600 uppercase tracking-widest">EOS Traffic-Policy: Queue Depth Model</div>
  </div>
);

const MACsecVisual = () => (
  <div className="relative w-full h-full flex items-center justify-center bg-card-bg rounded-3xl border border-border p-8 overflow-hidden group">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.08)_0%,transparent_70%)]"></div>
    <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-sm">
      <div className="flex items-center gap-3 w-full justify-center">
        <div className="w-16 h-12 bg-zinc-950 border border-emerald-500/30 rounded-xl flex flex-col items-center justify-center">
          <Shield size={14} className="text-emerald-500" />
          <span className="text-[7px] font-mono text-zinc-500 mt-0.5">SW-A</span>
        </div>
        <div className="flex-1 relative h-8 flex items-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full h-3 bg-emerald-950 border border-emerald-500/30 rounded flex items-center justify-center overflow-hidden">
              <span className="text-[7px] font-mono text-emerald-500 tracking-wider animate-pulse">AES-256-GCM ████████████</span>
            </div>
          </div>
        </div>
        <div className="w-16 h-12 bg-zinc-950 border border-emerald-500/30 rounded-xl flex flex-col items-center justify-center">
          <Shield size={14} className="text-emerald-500" />
          <span className="text-[7px] font-mono text-zinc-500 mt-0.5">SW-B</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 opacity-80">
        {[{ k: 'CAK', v: 'Pre-shared' }, { k: 'SAK', v: 'Session-derived' }].map((item) => (
          <div key={item.k} className="px-3 py-2 rounded-lg bg-zinc-950 border border-emerald-500/20 text-center">
            <p className="text-[9px] font-mono text-emerald-400 font-bold">{item.k}</p>
            <p className="text-[8px] font-mono text-zinc-500 mt-0.5">{item.v}</p>
          </div>
        ))}
      </div>
    </div>
    <div className="absolute bottom-4 left-6 text-[8px] font-mono text-zinc-600 uppercase tracking-widest">802.1AE: Wire-Speed L2 Encryption</div>
  </div>
);

const MulticastVisual = () => (
  <div className="relative w-full h-full flex items-center justify-center bg-card-bg rounded-3xl border border-border p-8 overflow-hidden group">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.08)_0%,transparent_70%)]"></div>
    <div className="relative z-10 flex flex-col items-center gap-4 w-full max-w-sm">
      {/* RP node */}
      <div className="w-20 h-20 rounded-full bg-amber-500/10 border-2 border-amber-500/50 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.2)] animate-pulse">
        <Radio size={22} className="text-amber-400 mb-0.5" />
        <span className="text-[8px] font-mono text-amber-500 font-bold uppercase">RP</span>
      </div>
      {/* Tree branches to leaves */}
      <div className="relative flex gap-8 items-center mt-2">
        <svg className="absolute inset-x-0 -top-8 w-full h-16 pointer-events-none opacity-60">
          <line x1="50%" y1="0" x2="12%" y2="100%" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 3" className="animate-pulse" />
          <line x1="50%" y1="0" x2="37%" y2="100%" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 3" className="animate-pulse" style={{ animationDelay: '0.3s' }} />
          <line x1="50%" y1="0" x2="63%" y2="100%" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 3" className="animate-pulse" style={{ animationDelay: '0.6s' }} />
          <line x1="50%" y1="0" x2="88%" y2="100%" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 3" className="animate-pulse" style={{ animationDelay: '0.9s' }} />
        </svg>
        {['LF-01', 'LF-02', 'LF-03', 'LF-04'].map((lf, i) => (
          <div key={lf} className="flex flex-col items-center gap-2">
            <div className="w-12 h-10 bg-zinc-950 border border-amber-500/20 rounded-lg flex flex-col items-center justify-center group-hover:border-amber-500/50 transition-colors">
              <Cpu size={14} className="text-zinc-600 group-hover:text-amber-400 transition-colors" />
              <span className="text-[7px] font-mono text-zinc-600 mt-0.5">{lf}</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500/60 animate-ping" style={{ animationDuration: `${1.5 + i * 0.3}s` }}></div>
          </div>
        ))}
      </div>
      <div className="flex gap-3 mt-1">
        {['IGMP Join', 'PIM-SM', 'SSM (*,G)'].map((t) => (
          <span key={t} className="px-2 py-1 rounded bg-zinc-950 border border-amber-500/20 text-[7px] font-mono text-amber-500/70 uppercase tracking-wider">{t}</span>
        ))}
      </div>
    </div>
    <div className="absolute bottom-4 left-6 text-[8px] font-mono text-zinc-600 uppercase tracking-widest">Control Plane: PIM-SM / Anycast RP</div>
  </div>
);

const LinuxVisual = () => (
  <div className="relative w-full h-full flex items-center justify-center bg-card-bg rounded-3xl border border-border p-8 overflow-hidden group">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.08)_0%,transparent_70%)]"></div>
    <div className="relative z-10 flex flex-col items-center gap-3 w-full max-w-xs">
      {[
        { label: 'EOS CLI / NIOS', color: 'border-violet-500/40 bg-violet-500/10', text: 'text-violet-300' },
        { label: 'SysDB (State Engine)', color: 'border-blue-500/30 bg-blue-500/08', text: 'text-blue-300' },
        { label: 'Linux Bash / eAPI', color: 'border-zinc-600 bg-zinc-900', text: 'text-zinc-400' },
      ].map((layer, i) => (
        <div key={layer.label} className="flex flex-col items-center w-full gap-1">
          <div className={`w-full py-3 px-4 rounded-xl border ${layer.color} flex items-center justify-between group-hover:brightness-125 transition-all`}>
            <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${layer.text}`}>{layer.label}</span>
            {i === 2 && <Terminal size={12} className="text-zinc-600" />}
            {i === 1 && <Database size={12} className="text-blue-500/60" />}
            {i === 0 && <GitBranch size={12} className="text-violet-500/60" />}
          </div>
          {i < 2 && (
            <div className="flex flex-col items-center">
              <div className="w-px h-3 bg-gradient-to-b from-violet-500/40 to-zinc-700"></div>
              <div className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-zinc-700 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-zinc-700 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              </div>
              <div className="w-px h-3 bg-gradient-to-b from-zinc-700 to-violet-500/20"></div>
            </div>
          )}
        </div>
      ))}
      <div className="flex gap-2 mt-2 opacity-70">
        {['eAPI', 'gNMI', 'OpenConfig'].map((t) => (
          <span key={t} className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-700 text-[7px] font-mono text-zinc-500 uppercase tracking-wider">{t}</span>
        ))}
      </div>
    </div>
    <div className="absolute bottom-4 left-6 text-[8px] font-mono text-zinc-600 uppercase tracking-widest">Substrate: EOS Linux Integration</div>
  </div>
);

// --- DC TOPOLOGY DIAGRAMS ---

const SPINE_COLOR = { fill: 'rgba(59,130,246,0.15)', stroke: '#3b82f6' };
const LEAF_COLOR  = { fill: 'rgba(39,39,42,0.8)',    stroke: '#52525b' };
const HOST_COLOR  = { fill: 'rgba(24,24,27,0.9)',     stroke: '#3f3f46' };
const BORDER_COLOR = { fill: 'rgba(16,185,129,0.15)', stroke: '#10b981' };
const SUPERSP_COLOR = { fill: 'rgba(139,92,246,0.15)', stroke: '#8b5cf6' };
const ISL_COLOR   = '#3b82f6';
const LINK_COLOR  = '#3f3f46';
const HL_COLORS: Record<string, string> = {
  'leaf-spine': '#3b82f6',
  'isl':        '#f59e0b',
  'host-edge':  '#10b981',
  'border':     '#8b5cf6',
  'all':        '#f59e0b',
};

const SmallDCDiagram = ({ highlight }: { highlight: string }) => {
  const hl = HL_COLORS[highlight] ?? ISL_COLOR;
  const hlLeaf = highlight === 'leaf-spine' || highlight === 'all';
  const hlHost = highlight === 'host-edge' || highlight === 'all';
  const hlISL  = highlight === 'isl' || highlight === 'all';

  const spines = [{ x: 90, y: 30 }, { x: 220, y: 30 }];
  const leaves = [{ x: 40, y: 110 }, { x: 110, y: 110 }, { x: 180, y: 110 }, { x: 250, y: 110 }];
  const hosts  = [{ x: 20, y: 185 }, { x: 90, y: 185 }, { x: 155, y: 185 }, { x: 230, y: 185 }];

  return (
    <svg viewBox="0 0 310 225" className="w-full h-full" style={{ maxHeight: 225 }}>
      {/* ISL spine↔spine */}
      <line x1={spines[0].x + 30} y1={spines[0].y + 12} x2={spines[1].x} y2={spines[1].y + 12}
        stroke={hlISL ? hl : '#52525b'} strokeWidth={hlISL ? 2 : 1} strokeDasharray={hlISL ? '0' : '3 2'} />
      {/* Spine↔Leaf */}
      {spines.map((sp) => leaves.map((lf) => (
        <line key={`${sp.x}-${lf.x}`}
          x1={sp.x + 15} y1={sp.y + 24} x2={lf.x + 15} y2={lf.y}
          stroke={hlLeaf ? hl : LINK_COLOR} strokeWidth={hlLeaf ? 1.5 : 1} opacity={hlLeaf ? 0.8 : 0.5} />
      )))}
      {/* Leaf↔Host */}
      {leaves.map((lf, i) => (
        <line key={i} x1={lf.x + 15} y1={lf.y + 24} x2={hosts[i].x + 18} y2={hosts[i].y}
          stroke={hlHost ? hl : LINK_COLOR} strokeWidth={hlHost ? 1.5 : 1} opacity={hlHost ? 0.8 : 0.5} />
      ))}
      {/* Spine nodes */}
      {spines.map((s, i) => (
        <g key={i}>
          <rect x={s.x} y={s.y} width={30} height={24} rx={4}
            fill={SPINE_COLOR.fill} stroke={SPINE_COLOR.stroke} strokeWidth={1.5} />
          <text x={s.x + 15} y={s.y + 15} textAnchor="middle" fontSize={6} fill="#93c5fd" fontFamily="monospace">SP-{i + 1}</text>
        </g>
      ))}
      {/* Leaf nodes */}
      {leaves.map((l, i) => (
        <g key={i}>
          <rect x={l.x} y={l.y} width={30} height={24} rx={4}
            fill={LEAF_COLOR.fill} stroke={hlLeaf ? hl : LEAF_COLOR.stroke} strokeWidth={hlLeaf ? 1.5 : 1} />
          <text x={l.x + 15} y={l.y + 15} textAnchor="middle" fontSize={6} fill="#a1a1aa" fontFamily="monospace">LF-{i + 1}</text>
        </g>
      ))}
      {/* Host nodes */}
      {hosts.map((h, i) => (
        <g key={i}>
          <rect x={h.x} y={h.y} width={36} height={18} rx={3}
            fill={HOST_COLOR.fill} stroke={hlHost ? hl : HOST_COLOR.stroke} strokeWidth={hlHost ? 1.5 : 1} />
          <text x={h.x + 18} y={h.y + 12} textAnchor="middle" fontSize={5.5} fill="#71717a" fontFamily="monospace">SRV</text>
        </g>
      ))}
      {/* Labels */}
      <text x={295} y={42} textAnchor="end" fontSize={6} fill="#6b7280" fontFamily="monospace">SPINE</text>
      <text x={295} y={122} textAnchor="end" fontSize={6} fill="#6b7280" fontFamily="monospace">LEAF</text>
      <text x={295} y={194} textAnchor="end" fontSize={6} fill="#6b7280" fontFamily="monospace">HOST</text>
    </svg>
  );
};

const MediumDCDiagram = ({ highlight }: { highlight: string }) => {
  const hl = HL_COLORS[highlight] ?? ISL_COLOR;
  const hlLeaf   = highlight === 'leaf-spine' || highlight === 'all';
  const hlHost   = highlight === 'host-edge'  || highlight === 'all';
  const hlISL    = highlight === 'isl'        || highlight === 'all';
  const hlBorder = highlight === 'border'     || highlight === 'all';

  const borders = [{ x: 115, y: 8 }, { x: 175, y: 8 }];
  const spines  = [{ x: 40, y: 62 }, { x: 100, y: 62 }, { x: 165, y: 62 }, { x: 225, y: 62 }];
  const leaves  = [{ x: 15, y: 128 }, { x: 65, y: 128 }, { x: 120, y: 128 }, { x: 170, y: 128 }, { x: 220, y: 128 }, { x: 270, y: 128 }];
  const hosts   = [{ x: 10, y: 188 }, { x: 60, y: 188 }, { x: 115, y: 188 }, { x: 165, y: 188 }, { x: 215, y: 188 }, { x: 265, y: 188 }];

  return (
    <svg viewBox="0 0 310 225" className="w-full h-full" style={{ maxHeight: 225 }}>
      {/* Border↔Spine */}
      {borders.map((b) => spines.map((sp) => (
        <line key={`${b.x}-${sp.x}`}
          x1={b.x + 15} y1={b.y + 18} x2={sp.x + 15} y2={sp.y}
          stroke={hlBorder ? hl : LINK_COLOR} strokeWidth={hlBorder ? 1.5 : 1} opacity={0.6} />
      )))}
      {/* Spine↔Leaf */}
      {spines.map((sp) => leaves.map((lf) => (
        <line key={`${sp.x}-${lf.x}`}
          x1={sp.x + 15} y1={sp.y + 24} x2={lf.x + 14} y2={lf.y}
          stroke={hlLeaf ? hl : LINK_COLOR} strokeWidth={hlLeaf ? 1.5 : 1} opacity={hlISL || hlLeaf ? 0.6 : 0.35} />
      )))}
      {/* ISL spine↔spine */}
      <line x1={spines[0].x + 30} y1={spines[0].y + 12} x2={spines[3].x} y2={spines[3].y + 12}
        stroke={hlISL ? hl : '#3f3f46'} strokeWidth={hlISL ? 2 : 1} strokeDasharray="4 2" opacity={0.7} />
      {/* Leaf↔Host */}
      {leaves.map((lf, i) => (
        <line key={i} x1={lf.x + 14} y1={lf.y + 24} x2={hosts[i].x + 14} y2={hosts[i].y}
          stroke={hlHost ? hl : LINK_COLOR} strokeWidth={hlHost ? 1.5 : 1} opacity={hlHost ? 0.8 : 0.4} />
      ))}
      {/* Border nodes */}
      {borders.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={b.y} width={30} height={18} rx={4}
            fill={BORDER_COLOR.fill} stroke={hlBorder ? hl : BORDER_COLOR.stroke} strokeWidth={1.5} />
          <text x={b.x + 15} y={b.y + 12} textAnchor="middle" fontSize={5.5} fill="#6ee7b7" fontFamily="monospace">BL-{i + 1}</text>
        </g>
      ))}
      {/* Spine nodes */}
      {spines.map((s, i) => (
        <g key={i}>
          <rect x={s.x} y={s.y} width={30} height={24} rx={4}
            fill={SPINE_COLOR.fill} stroke={SPINE_COLOR.stroke} strokeWidth={1.5} />
          <text x={s.x + 15} y={s.y + 15} textAnchor="middle" fontSize={6} fill="#93c5fd" fontFamily="monospace">SP-{i + 1}</text>
        </g>
      ))}
      {/* Leaf nodes */}
      {leaves.map((l, i) => (
        <g key={i}>
          <rect x={l.x} y={l.y} width={28} height={24} rx={4}
            fill={LEAF_COLOR.fill} stroke={hlLeaf ? hl : LEAF_COLOR.stroke} strokeWidth={hlLeaf ? 1.5 : 1} />
          <text x={l.x + 14} y={l.y + 15} textAnchor="middle" fontSize={5.5} fill="#a1a1aa" fontFamily="monospace">L{i + 1}</text>
        </g>
      ))}
      {/* Hosts */}
      {hosts.map((h, i) => (
        <g key={i}>
          <rect x={h.x} y={h.y} width={28} height={16} rx={3}
            fill={HOST_COLOR.fill} stroke={hlHost ? hl : HOST_COLOR.stroke} strokeWidth={hlHost ? 1.5 : 1} />
          <text x={h.x + 14} y={h.y + 11} textAnchor="middle" fontSize={5} fill="#71717a" fontFamily="monospace">SRV</text>
        </g>
      ))}
      {/* Labels */}
      <text x={305} y={20} textAnchor="end" fontSize={6} fill="#6b7280" fontFamily="monospace">BORDER</text>
      <text x={305} y={76} textAnchor="end" fontSize={6} fill="#6b7280" fontFamily="monospace">SPINE</text>
      <text x={305} y={142} textAnchor="end" fontSize={6} fill="#6b7280" fontFamily="monospace">LEAF</text>
      <text x={305} y={200} textAnchor="end" fontSize={6} fill="#6b7280" fontFamily="monospace">HOST</text>
    </svg>
  );
};

const LargeDCDiagram = ({ highlight }: { highlight: string }) => {
  const hl = HL_COLORS[highlight] ?? ISL_COLOR;
  const hlLeaf   = highlight === 'leaf-spine' || highlight === 'all';
  const hlHost   = highlight === 'host-edge'  || highlight === 'all';
  const hlISL    = highlight === 'isl'        || highlight === 'all';
  const hlBorder = highlight === 'border'     || highlight === 'all';

  const superSpines = [{ x: 100, y: 8 }, { x: 185, y: 8 }];
  const spines      = [{ x: 25, y: 66 }, { x: 90, y: 66 }, { x: 155, y: 66 }, { x: 220, y: 66 }];
  const leaves      = [{ x: 15, y: 130 }, { x: 55, y: 130 }, { x: 105, y: 130 }, { x: 145, y: 130 }, { x: 190, y: 130 }, { x: 235, y: 130 }, { x: 275, y: 130 }];
  const hosts       = [{ x: 10, y: 188 }, { x: 50, y: 188 }, { x: 100, y: 188 }, { x: 140, y: 188 }, { x: 185, y: 188 }, { x: 230, y: 188 }, { x: 270, y: 188 }];

  return (
    <svg viewBox="0 0 310 225" className="w-full h-full" style={{ maxHeight: 225 }}>
      {/* SS↔Spine */}
      {superSpines.map((ss) => spines.map((sp) => (
        <line key={`${ss.x}-${sp.x}`}
          x1={ss.x + 15} y1={ss.y + 20} x2={sp.x + 15} y2={sp.y}
          stroke={hlBorder ? hl : LINK_COLOR} strokeWidth={hlBorder ? 1.5 : 1} opacity={0.55} />
      )))}
      {/* SS ISL */}
      <line x1={superSpines[0].x + 30} y1={superSpines[0].y + 10} x2={superSpines[1].x} y2={superSpines[1].y + 10}
        stroke={hlISL ? hl : '#52525b'} strokeWidth={hlISL ? 2 : 1} strokeDasharray="5 2" />
      {/* Spine↔Leaf */}
      {spines.map((sp) => leaves.slice(0, 4).map((lf) => (
        <line key={`${sp.x}-${lf.x}`}
          x1={sp.x + 15} y1={sp.y + 24} x2={lf.x + 13} y2={lf.y}
          stroke={hlLeaf ? hl : LINK_COLOR} strokeWidth={hlLeaf ? 1.5 : 1} opacity={hlLeaf ? 0.5 : 0.3} />
      )))}
      {spines.slice(2).map((sp) => leaves.slice(3).map((lf) => (
        <line key={`${sp.x}-${lf.x}-r`}
          x1={sp.x + 15} y1={sp.y + 24} x2={lf.x + 13} y2={lf.y}
          stroke={hlLeaf ? hl : LINK_COLOR} strokeWidth={hlLeaf ? 1.5 : 1} opacity={hlLeaf ? 0.5 : 0.3} />
      )))}
      {/* Leaf↔Host */}
      {leaves.map((lf, i) => (
        <line key={i} x1={lf.x + 13} y1={lf.y + 22} x2={hosts[i].x + 13} y2={hosts[i].y}
          stroke={hlHost ? hl : LINK_COLOR} strokeWidth={hlHost ? 1.5 : 1} opacity={hlHost ? 0.8 : 0.4} />
      ))}
      {/* Super-spine nodes */}
      {superSpines.map((ss, i) => (
        <g key={i}>
          <rect x={ss.x} y={ss.y} width={30} height={20} rx={4}
            fill={SUPERSP_COLOR.fill} stroke={SUPERSP_COLOR.stroke} strokeWidth={1.5} />
          <text x={ss.x + 15} y={ss.y + 13} textAnchor="middle" fontSize={5.5} fill="#c4b5fd" fontFamily="monospace">SS-{i + 1}</text>
        </g>
      ))}
      {/* Spine nodes */}
      {spines.map((s, i) => (
        <g key={i}>
          <rect x={s.x} y={s.y} width={30} height={24} rx={4}
            fill={SPINE_COLOR.fill} stroke={SPINE_COLOR.stroke} strokeWidth={1.5} />
          <text x={s.x + 15} y={s.y + 15} textAnchor="middle" fontSize={6} fill="#93c5fd" fontFamily="monospace">SP-{i + 1}</text>
        </g>
      ))}
      {/* Leaf nodes */}
      {leaves.map((l, i) => (
        <g key={i}>
          <rect x={l.x} y={l.y} width={26} height={22} rx={4}
            fill={LEAF_COLOR.fill} stroke={hlLeaf ? hl : LEAF_COLOR.stroke} strokeWidth={hlLeaf ? 1.5 : 1} />
          <text x={l.x + 13} y={l.y + 14} textAnchor="middle" fontSize={5.5} fill="#a1a1aa" fontFamily="monospace">L{i + 1}</text>
        </g>
      ))}
      {/* Hosts */}
      {hosts.map((h, i) => (
        <g key={i}>
          <rect x={h.x} y={h.y} width={26} height={16} rx={3}
            fill={HOST_COLOR.fill} stroke={hlHost ? hl : HOST_COLOR.stroke} strokeWidth={hlHost ? 1.5 : 1} />
          <text x={h.x + 13} y={h.y + 11} textAnchor="middle" fontSize={5} fill="#71717a" fontFamily="monospace">SRV</text>
        </g>
      ))}
      {/* Labels */}
      <text x={305} y={20} textAnchor="end" fontSize={6} fill="#6b7280" fontFamily="monospace">SUPER-SPINE</text>
      <text x={305} y={78} textAnchor="end" fontSize={6} fill="#6b7280" fontFamily="monospace">SPINE</text>
      <text x={305} y={142} textAnchor="end" fontSize={6} fill="#6b7280" fontFamily="monospace">LEAF</text>
      <text x={305} y={200} textAnchor="end" fontSize={6} fill="#6b7280" fontFamily="monospace">HOST</text>
    </svg>
  );
};

interface DCTopologyViewerProps {
  dcContext?: DCContext;
}

const DC_SIZES = [
  { id: 'small',  label: 'Small',  sub: '≤ 50 switches'   },
  { id: 'medium', label: 'Medium', sub: '50–500 switches'  },
  { id: 'large',  label: 'Large',  sub: '500+ switches'    },
] as const;

type DCSize = 'small' | 'medium' | 'large';

const DCTopologyViewer: React.FC<DCTopologyViewerProps> = ({ dcContext }) => {
  const [dcSize, setDcSize] = useState<DCSize>('small');
  const ctx = dcContext?.[dcSize];
  const hl = ctx?.highlight ?? 'leaf-spine';

  return (
    <div className="bg-card-bg border border-border rounded-[2rem] overflow-hidden shadow-2xl">
      <header className="p-5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Layout size={16} className="text-blue-400" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-primary">DC Deployment Context</h3>
        </div>
        <div className="flex gap-1 p-1 bg-zinc-900 rounded-xl border border-border">
          {DC_SIZES.map(({ id, label, sub }) => (
            <button
              key={id}
              onClick={() => setDcSize(id)}
              className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all ${
                dcSize === id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title={sub}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      <div className="p-5">
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex items-center justify-center" style={{ minHeight: 200 }}>
          {dcSize === 'small'  && <SmallDCDiagram  highlight={hl} />}
          {dcSize === 'medium' && <MediumDCDiagram highlight={hl} />}
          {dcSize === 'large'  && <LargeDCDiagram  highlight={hl} />}
        </div>

        {ctx && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-2">
              <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-zinc-500">Scale</p>
              <p className="text-xs font-semibold text-zinc-200">{ctx.scale}</p>
              <p className="text-xs text-zinc-400 leading-relaxed">{ctx.topologyRole}</p>
            </div>
            <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-2">
              <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-zinc-500">Key Config</p>
              <pre className="text-[10px] font-mono text-emerald-400 leading-relaxed whitespace-pre-wrap">{ctx.keyConfig}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

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
                  {r.role.split(' ').slice(0, 2).join(' ').slice(0, 14)}
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
        
        <div className="flex gap-2 overflow-x-auto scrollbar-none max-w-2xl">
            {Object.keys(PROTOCOL_CONTENT).map(id => (
                <button
                    key={id}
                    onClick={() => { setSelectedId(id); }}
                    className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap shrink-0 ${selectedId === id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'}`}
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

               {active.bestPractices && active.bestPractices.length > 0 && (
                 <section className="space-y-6">
                   <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-zinc-500 flex items-center gap-2">
                     <CheckCircle2 size={14} className="text-amber-500" /> Best Practices
                   </h3>
                   <div className="space-y-3">
                     {active.bestPractices.map((practice, i) => (
                       <div key={i} className="flex gap-4 p-4 bg-zinc-900/40 border border-amber-500/10 rounded-xl hover:border-amber-500/30 transition-all group">
                         <div className="shrink-0 w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-[10px] font-mono font-bold text-amber-500 group-hover:bg-amber-500/20 transition-colors">
                           {i + 1}
                         </div>
                         <p className="text-sm text-zinc-400 leading-relaxed group-hover:text-zinc-200">
                           {practice.split(/`([^`]+)`/).map((part, j) =>
                             j % 2 === 1
                               ? <code key={j} className="px-1.5 py-0.5 bg-zinc-800 rounded text-amber-400 font-mono text-[11px]">{part}</code>
                               : part
                           )}
                         </p>
                       </div>
                     ))}
                   </div>
                 </section>
               )}

               {active.masteryPath && active.masteryPath.length > 0 && (
                 <section className="space-y-6">
                   <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-zinc-500 flex items-center gap-2">
                     <Target size={14} className="text-purple-500" /> Learning Path
                   </h3>
                   <div className="space-y-4">
                     {active.masteryPath.map((level, i) => {
                       const levelNum = Math.min(i + 1, 4) * 100;
                       type LevelStyle = { bg: string; border: string; text: string; badge: string };
                       const styleMap: Record<string, LevelStyle> = {
                         Foundation: { bg: 'bg-blue-500/8', border: 'border-blue-500/20', text: 'text-blue-400', badge: 'bg-blue-900/40 text-blue-300 border-blue-500/30' },
                         Logic:       { bg: 'bg-amber-500/8', border: 'border-amber-500/20', text: 'text-amber-400', badge: 'bg-amber-900/40 text-amber-300 border-amber-500/30' },
                         Architecture:{ bg: 'bg-emerald-500/8', border: 'border-emerald-500/20', text: 'text-emerald-400', badge: 'bg-emerald-900/40 text-emerald-300 border-emerald-500/30' },
                       };
                       const c: LevelStyle = styleMap[level.level] ?? styleMap['Architecture'];
                       return (
                         <div key={i} className={`p-5 ${c.bg} border ${c.border} rounded-2xl space-y-3 hover:brightness-125 transition-all`}>
                           <div className="flex items-center gap-3">
                             <span className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-widest rounded border ${c.badge}`}>
                               {levelNum} · {level.level}
                             </span>
                             <h4 className={`text-sm font-bold ${c.text}`}>{level.heading}</h4>
                           </div>
                           <p className="text-xs text-zinc-400 leading-relaxed">{level.body}</p>
                           <div className={`px-3 py-1.5 inline-flex items-center gap-2 rounded-lg border ${c.border} ${c.bg}`}>
                             <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">Key Concept:</span>
                             <code className={`text-[10px] font-mono font-bold ${c.text}`}>{level.keyConcept}</code>
                           </div>
                         </div>
                       );
                     })}
                   </div>
                 </section>
               )}

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

            {/* RIGHT: TOPOLOGY & CONFIGS */}
            <div className="lg:col-span-5 space-y-8">

              {/* 1. DC TOPOLOGY VIEWER */}
              <DCTopologyViewer dcContext={active.dcContext} />

              {/* 2. PROTOCOL MECHANICS (existing per-protocol animation) */}
              <section className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-zinc-500 flex items-center gap-2">
                  <Activity size={14} className="text-emerald-500" /> Protocol Mechanics
                </h3>
                <div className="h-[220px]">
                  {active.id === 'vxlan'     && <VXLANVisual />}
                  {active.id === 'evpn'      && <EVPNVisual />}
                  {active.id === 'mlag'      && <MLAGVisual />}
                  {active.id === 'nvmeof'    && <NVMeOFVisual />}
                  {active.id === 'bgp'       && <BGPVisual />}
                  {active.id === 'qos'       && <QoSVisual />}
                  {active.id === 'macsec'    && <MACsecVisual />}
                  {active.id === 'multicast' && <MulticastVisual />}
                  {active.id === 'linux'     && <LinuxVisual />}
                </div>
              </section>

              {/* 3. ROLE-BASED CONFIGURATIONS */}
              {active.roleConfigs && <RoleConfigViewer roles={active.roleConfigs} />}

              {/* 4. CLI REFERENCE */}
              <section className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <header className="p-6 bg-zinc-800/50 border-b border-zinc-800 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Terminal size={18} className="text-blue-400" />
                    <h3 className="text-xs font-bold uppercase tracking-widest">CLI Reference</h3>
                  </div>
                  <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">EOS Native</span>
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

              {/* 5. REFERENCE MATERIAL */}
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

              {/* 6. EVIDENCE DRAWER */}
              <EvidenceDrawer contextTags={['Protocol', 'Life Sciences']} />

              {/* 7. OPERATIONAL PLAYBOOK */}
              {(['vxlan', 'mlag'] as string[]).includes(active.id) && active.roleConfigs && (() => {
                const playBookRoles: Record<string, string[]> = {
                  vxlan: ['Preflight Checklist', 'Validation / Proof Hooks', 'Troubleshooting Map', 'Safe Defaults (VXLAN/EVPN)', 'Brownfield Cutover Steps'],
                  mlag:  ['Preflight Checklist', 'Peer-Link Failure Drill', 'Troubleshooting Map', 'Split-Brain Recovery', 'MLAG Upgrade Runbook'],
                };
                const filtered = active.roleConfigs!.filter((r) => playBookRoles[active.id]?.includes(r.role));
                if (!filtered.length) return null;
                return (
                  <section className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-zinc-500 flex items-center gap-2">
                      <Layout size={14} className="text-blue-500" /> Operational Playbook
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {filtered.map((role) => (
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
                );
              })()}

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
