
import React, { useState, useEffect, useRef } from 'react';
import { ConceptExplainer as ConceptType } from '@/types';
// Fix: Added ShieldCheck to the imports from lucide-react to resolve errors on lines 131, 132, 133
import { ArrowLeft, X, ArrowRight, Layers, Sparkles, Network, Zap, Info, Save, Download, Cpu, Terminal, Share2, Database, Shield, Radar, Code, Gauge, AlertCircle, ShieldCheck, Lock, Key, Activity, Server, Wifi, RefreshCw, Clock, Eye, Radio, BarChart2 } from 'lucide-react';
import { useInfraLens } from '@/context/InfraLensContext';

interface VisualEssaysProps {
  onBack: () => void;
  startAbout?: boolean;
}

const ConceptVisual: React.FC<{ conceptId: string; sectionIdx: number; progress?: number }> = ({ conceptId, sectionIdx }) => {
  const isActive = (idx: number) => sectionIdx === idx;
  
  if (conceptId === 'c-why-arista') {
    return (
      <div className="w-full h-full flex items-center justify-center relative bg-zinc-950 overflow-hidden">
          {/* 0. Unified Image */}
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 transform ${isActive(0) ? 'opacity-100 scale-100' : 'opacity-0 scale-150 blur-lg'}`}>
              <div className="relative w-80 h-80 flex items-center justify-center">
                  <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
                  <div className="w-40 h-40 bg-white rounded-full shadow-[0_0_80px_rgba(255,255,255,0.4)] flex items-center justify-center">
                      <Shield size={64} className="text-blue-600" />
                  </div>
                  <div className="absolute w-64 h-64 border border-blue-500/30 rounded-full animate-spin-slow"></div>
              </div>
          </div>
          {/* 1. SysDB */}
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 transform ${isActive(1) ? 'opacity-100 scale-100' : 'opacity-0 scale-90 blur-lg'}`}>
              <div className="relative w-96 h-96 flex items-center justify-center">
                  <div className="w-24 h-24 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-2xl relative z-20">
                      <Database size={40} className="text-white" />
                  </div>
                  {[0, 72, 144, 216, 288].map((angle, i) => (
                      <div key={i} className="absolute w-12 h-12 bg-zinc-900 border border-zinc-700 rounded-xl flex items-center justify-center"
                        style={{ transform: `rotate(${angle}deg) translateY(-140px) rotate(-${angle}deg)` }}>
                          <Zap size={20} className="text-indigo-400" />
                      </div>
                  ))}
              </div>
          </div>
          {/* 2. Open Programmability */}
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 transform ${isActive(2) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20 blur-xl'}`}>
              <div className="relative w-96 h-64 bg-zinc-900 border border-zinc-800 rounded-2xl p-8 flex flex-col shadow-2xl overflow-hidden group">
                  <div className="absolute inset-0 bg-blue-500/5 opacity-20 pointer-events-none"></div>
                  <div className="flex justify-between items-center mb-6">
                      <div className="flex gap-2">
                          <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                      </div>
                      <Code size={20} className="text-zinc-600" />
                  </div>
                  <div className="space-y-3 font-mono text-xs text-blue-400">
                      <div className="w-full h-3 bg-blue-500/10 rounded animate-pulse"></div>
                      <div className="w-3/4 h-3 bg-blue-500/10 rounded animate-pulse delay-75"></div>
                      <div className="w-5/6 h-3 bg-blue-500/10 rounded animate-pulse delay-150"></div>
                  </div>
                  <div className="mt-auto pt-6 border-t border-zinc-800 flex items-center gap-4">
                      <Terminal size={18} className="text-zinc-500" />
                      <span className="text-[10px] text-zinc-600 uppercase tracking-widest">EOS_SHELL_ACTIVE</span>
                  </div>
              </div>
          </div>
          {/* 3. Cognitive Telemetry */}
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 transform ${isActive(3) ? 'opacity-100 scale-100' : 'opacity-0 scale-50 blur-xl'}`}>
              <div className="relative w-80 h-80 rounded-full border border-zinc-800 flex items-center justify-center overflow-hidden bg-black/50">
                  <div className="absolute inset-0 border-2 border-dashed border-cyan-500/10 rounded-full animate-spin-slower"></div>
                  <div className="absolute inset-0 bg-[conic-gradient(from_0deg,rgba(34,211,238,0.2)_0deg,transparent_90deg)] animate-spin-slow"></div>
                  <div className="relative z-10 flex flex-col items-center">
                      <Radar size={48} className="text-cyan-400 mb-4 animate-pulse" />
                      <span className="text-[10px] font-mono text-cyan-500 uppercase tracking-[0.4em]">Real-time State</span>
                  </div>
                  {[...Array(8)].map((_, i) => (
                      <div key={i} className="absolute w-2 h-2 bg-cyan-500 rounded-full blur-[1px] animate-pulse" style={{ 
                        top: `${Math.random() * 80 + 10}%`, 
                        left: `${Math.random() * 80 + 10}%`,
                        animationDelay: `${i * 200}ms`
                      }}></div>
                  ))}
              </div>
          </div>
      </div>
    );
  }

  if (conceptId === 'c-leaf-spine') {
    return (
      <div className="w-full h-full flex items-center justify-center relative bg-zinc-950 overflow-hidden">
          {/* 0. ECMP Scaling */}
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 transform ${isActive(0) ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
              <div className="relative w-80 h-80">
                  <div className="absolute top-0 left-1/4 w-12 h-12 bg-zinc-800 rounded border border-zinc-700 flex items-center justify-center text-blue-400"><Cpu size={24}/></div>
                  <div className="absolute top-0 right-1/4 w-12 h-12 bg-zinc-800 rounded border border-zinc-700 flex items-center justify-center text-blue-400"><Cpu size={24}/></div>
                  {[0,1,2,3].map(i => (
                    <div key={i} className="absolute bottom-0 left-[i*25%] w-12 h-12 bg-zinc-900 border border-zinc-800 rounded"></div>
                  ))}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                    <line x1="25%" y1="15%" x2="0%" y2="85%" stroke="#3b82f6" strokeWidth="2" />
                    <line x1="25%" y1="15%" x2="25%" y2="85%" stroke="#3b82f6" strokeWidth="2" />
                    <line x1="75%" y1="15%" x2="50%" y2="85%" stroke="#3b82f6" strokeWidth="2" />
                    <line x1="75%" y1="15%" x2="75%" y2="85%" stroke="#3b82f6" strokeWidth="2" />
                  </svg>
              </div>
          </div>
          {/* 1. CLOS Architecture */}
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 transform ${isActive(1) ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-40 blur-lg'}`}>
              <div className="relative w-full h-full flex flex-col items-center justify-center gap-16">
                  <div className="flex gap-12">
                      {[1, 2, 3].map(i => <div key={i} className="w-16 h-8 bg-zinc-900 border border-zinc-700 rounded flex items-center justify-center text-[10px] text-zinc-500 font-mono">SPINE_{i}</div>)}
                  </div>
                  <div className="relative w-96 h-32">
                     <svg className="absolute inset-0 w-full h-full opacity-30">
                        <path d="M 120 0 L 0 100 M 120 0 L 120 100 M 120 0 L 240 100" stroke="white" strokeWidth="1" />
                        <path d="M 240 0 L 0 100 M 240 0 L 120 100 M 240 0 L 240 100" stroke="white" strokeWidth="1" />
                     </svg>
                  </div>
                  <div className="flex gap-8">
                      {[1, 2, 3, 4].map(i => <div key={i} className="w-12 h-6 bg-zinc-950 border border-blue-500/50 rounded flex items-center justify-center text-[8px] text-blue-400 font-mono">LEAF_{i}</div>)}
                  </div>
              </div>
          </div>
          {/* 2. L3 Boundary Isolation */}
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 transform ${isActive(2) ? 'opacity-100 scale-100' : 'opacity-0 scale-150 rotate-45'}`}>
              <div className="relative w-80 h-80">
                  <div className="absolute inset-0 border border-zinc-800 grid grid-cols-2 grid-rows-2">
                     <div className="border border-zinc-800 bg-zinc-900/50 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-rose-500/10 animate-pulse"></div>
                        <AlertCircle size={32} className="text-rose-500" />
                     </div>
                     <div className="border border-zinc-800 bg-emerald-500/5 flex items-center justify-center text-emerald-500 opacity-20"><ShieldCheck size={32} /></div>
                     <div className="border border-zinc-800 bg-emerald-500/5 flex items-center justify-center text-emerald-500 opacity-20"><ShieldCheck size={32} /></div>
                     <div className="border border-zinc-800 bg-emerald-500/5 flex items-center justify-center text-emerald-500 opacity-20"><ShieldCheck size={32} /></div>
                  </div>
                  <div className="absolute inset-0 border-4 border-blue-600 shadow-[0_0_50px_rgba(37,99,235,0.3)] pointer-events-none"></div>
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-blue-400 bg-zinc-950 px-2 uppercase tracking-widest">L3 Boundary</div>
              </div>
          </div>
          {/* 3. Predictive Performance */}
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 transform ${isActive(3) ? 'opacity-100 scale-100' : 'opacity-0 -translate-y-20 blur-xl'}`}>
              <div className="relative flex flex-col items-center">
                  <div className="relative w-64 h-64 flex items-center justify-center">
                      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                          <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                          <circle cx="50" cy="50" r="45" fill="none" stroke="url(#perf-grad)" strokeWidth="6" strokeDasharray="212" strokeDashoffset="42" className="animate-pulse" />
                          <defs>
                              <linearGradient id="perf-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" stopColor="#3b82f6" />
                                  <stop offset="100%" stopColor="#22d3ee" />
                              </linearGradient>
                          </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <Gauge size={40} className="text-white mb-2" />
                          <span className="text-2xl font-black font-mono tracking-tighter">99.9%</span>
                          <span className="text-[8px] font-mono text-zinc-500 uppercase">Load Balance</span>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    );
  }

  if (conceptId === 'c-polymathos') {
    return (
      <div className="w-full h-full flex items-center justify-center relative bg-zinc-950 overflow-hidden">
        {/* 0. Polymathic Mandate */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 transform ${isActive(0) ? 'opacity-100 scale-100' : 'opacity-0 scale-125 blur-lg'}`}>
          <div className="relative w-80 h-80">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/20 via-purple-500/15 to-emerald-500/20 blur-3xl"></div>
            {[0, 120, 240].map((angle, i) => (
              <div
                key={i}
                className="absolute w-24 h-24 rounded-full border border-blue-400/40 bg-blue-500/10 flex items-center justify-center text-sm font-semibold text-blue-100"
                style={{ transform: `rotate(${angle}deg) translateY(-110px) rotate(-${angle}deg)` }}
              >
                <Sparkles size={18} className="text-emerald-300" />
              </div>
            ))}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-28 h-28 rounded-full bg-white text-zinc-900 flex items-center justify-center font-serif font-bold shadow-[0_0_50px_rgba(59,130,246,0.3)]">
                Core
              </div>
            </div>
          </div>
        </div>

        {/* 1. Engineering Aesthetics */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 transform ${isActive(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16 blur-lg'}`}>
          <div className="relative w-96 h-64 rounded-2xl border border-border bg-card-bg overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.1),transparent_50%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.15),transparent_50%)]"></div>
            <div className="absolute inset-4 border border-border rounded-xl backdrop-blur-sm bg-black/40 flex flex-col justify-center px-6 gap-3">
              <div className="text-lg font-serif font-bold text-primary">Calm Technology</div>
              <p className="text-sm text-secondary leading-relaxed">Interfaces that respect attention: minimal noise, clear hierarchy, composed under load.</p>
              <div className="flex gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-secondary">
                <ShieldCheck size={14} className="text-emerald-400" /> Composed
                <Zap size={14} className="text-blue-400" /> Responsive
                <Info size={14} className="text-cyan-400" /> Legible
              </div>
            </div>
          </div>
        </div>

        {/* 2. Infinite Game */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 transform ${isActive(2) ? 'opacity-100 scale-100' : 'opacity-0 scale-75 blur-lg'}`}>
          <div className="relative w-96 h-96">
            <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 200 200">
              <path d="M20 100 C 60 20, 140 20, 180 100 S 140 180, 100 100 S 60 20, 20 100" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 6" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="px-6 py-3 rounded-full border border-emerald-400/50 bg-emerald-500/10 text-primary font-serif font-bold shadow-lg">Infinite Game</div>
            </div>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-secondary uppercase tracking-[0.3em]">Evolving with you</div>
          </div>
        </div>
      </div>
    );
  }

  if (conceptId === 'c-evpn-bgp') {
    return (
      <div className="w-full h-full flex items-center justify-center relative bg-zinc-950 overflow-hidden">
        {/* 0: Flood-and-learn chaos vs BGP control plane */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${isActive(0) ? 'opacity-100 scale-100' : 'opacity-0 scale-90 blur-lg'}`}>
          <div className="flex gap-10 items-center">
            <div className="flex flex-col items-center gap-3">
              <div className="relative w-36 h-36 bg-red-500/5 border border-red-500/20 rounded-2xl flex items-center justify-center overflow-hidden">
                {[0,60,120,180,240,300].map((a, i) => (
                  <div key={i} className="absolute w-2 h-2 bg-red-500 rounded-full animate-ping" style={{ top: `${50 + 35*Math.sin(a*Math.PI/180)}%`, left: `${50 + 35*Math.cos(a*Math.PI/180)}%`, animationDelay: `${i*150}ms`, animationDuration: '1.2s' }} />
                ))}
                <span className="text-[9px] font-mono text-red-400 uppercase tracking-widest z-10">Flood &amp; Learn</span>
              </div>
              <span className="text-[10px] text-zinc-600 uppercase tracking-wider">Before</span>
            </div>
            <div className="text-zinc-700 text-xl font-thin">→</div>
            <div className="flex flex-col items-center gap-3">
              <div className="relative w-36 h-36 bg-blue-500/5 border border-blue-500/20 rounded-2xl flex items-center justify-center">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center z-10 shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                  <Database size={20} className="text-white" />
                </div>
                {[0,120,240].map((a, i) => (
                  <div key={i} className="absolute w-6 h-6 bg-zinc-900 border border-blue-500/40 rounded-lg flex items-center justify-center" style={{ top: `${50 + 36*Math.sin(a*Math.PI/180) - 12}%`, left: `${50 + 36*Math.cos(a*Math.PI/180) - 12}%` }}>
                    <Zap size={10} className="text-blue-400" />
                  </div>
                ))}
              </div>
              <span className="text-[10px] text-zinc-600 uppercase tracking-wider">BGP Control Plane</span>
            </div>
          </div>
        </div>
        {/* 1: RT-2, RT-3, RT-5 */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${isActive(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12 blur-lg'}`}>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-blue-500/10 border border-blue-500/30">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="font-mono text-sm font-bold text-blue-300 w-10">RT-2</span>
              <span className="text-zinc-400 text-sm">MAC + IP Advertisement</span>
            </div>
            <div className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/30">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="font-mono text-sm font-bold text-amber-300 w-10">RT-3</span>
              <span className="text-zinc-400 text-sm">BUM Replication (IMET)</span>
            </div>
            <div className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-violet-500/10 border border-violet-500/30">
              <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
              <span className="font-mono text-sm font-bold text-violet-300 w-10">RT-5</span>
              <span className="text-zinc-400 text-sm">IP Prefix Route (L3 VRF)</span>
            </div>
          </div>
        </div>
        {/* 2: Anycast Gateway */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${isActive(2) ? 'opacity-100 scale-100' : 'opacity-0 scale-75 blur-lg'}`}>
          <div className="flex flex-col items-center gap-8">
            <div className="flex gap-6">
              {['LEAF-1','LEAF-2','LEAF-3'].map(l => (
                <div key={l} className="flex flex-col items-center gap-2">
                  <div className="w-20 h-12 bg-zinc-900 border border-emerald-500/40 rounded-xl flex flex-col items-center justify-center gap-0.5">
                    <span className="text-[8px] font-mono text-emerald-400">{l}</span>
                    <span className="text-[7px] font-mono text-zinc-500">10.0.0.1/24</span>
                  </div>
                  <div className="w-px h-4 bg-emerald-500/30" />
                  <div className="w-6 h-6 bg-zinc-950 border border-zinc-700 rounded" />
                </div>
              ))}
            </div>
            <div className="px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30">
              <span className="text-[10px] font-mono text-emerald-300 uppercase tracking-widest">Same IP · Same MAC · Any Leaf Responds</span>
            </div>
          </div>
        </div>
        {/* 3: Route Targets */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${isActive(3) ? 'opacity-100 scale-100' : 'opacity-0 -translate-x-16 blur-lg'}`}>
          <div className="grid grid-cols-2 gap-3">
            {[
              { rt: '10:10010', label: 'L2 VNI · Tenant A', color: 'border-blue-500/30 bg-blue-500/10 text-blue-300' },
              { rt: '10:10020', label: 'L2 VNI · Tenant B', color: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' },
              { rt: '50:50001', label: 'L3 VRF · Prod', color: 'border-violet-500/30 bg-violet-500/10 text-violet-300' },
              { rt: '50:50002', label: 'L3 VRF · Dev', color: 'border-amber-500/30 bg-amber-500/10 text-amber-300' },
            ].map(({ rt, label, color }) => (
              <div key={rt} className={`px-4 py-3 rounded-xl border flex items-center gap-3 ${color}`}>
                <Key size={13} />
                <div>
                  <div className="font-mono text-[11px] font-bold">{rt}</div>
                  <div className="text-[9px] text-zinc-500 mt-0.5">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (conceptId === 'c-deep-buffers-ai') {
    return (
      <div className="w-full h-full flex items-center justify-center relative bg-zinc-950 overflow-hidden">
        {/* 0: AllReduce incast — converging GPU arrows */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${isActive(0) ? 'opacity-100 scale-100' : 'opacity-0 scale-90 blur-lg'}`}>
          <div className="relative w-64 h-64 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-zinc-900 border-2 border-red-500/60 rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                <Cpu size={28} className="text-red-400" />
              </div>
            </div>
            {[0,45,90,135,180,225,270,315].map((a, i) => (
              <div key={i} className="absolute w-8 h-8 bg-zinc-900 border border-violet-500/40 rounded-lg flex items-center justify-center animate-pulse"
                style={{ top: `${50 + 42*Math.sin(a*Math.PI/180) - 16}%`, left: `${50 + 42*Math.cos(a*Math.PI/180) - 16}%`, animationDelay: `${i*100}ms` }}>
                <span className="text-[7px] font-mono text-violet-400">GPU</span>
              </div>
            ))}
            <div className="absolute -bottom-8 text-[9px] font-mono text-red-400 uppercase tracking-widest">AllReduce Incast Burst</div>
          </div>
        </div>
        {/* 1: PFC + ECN queue thresholds */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${isActive(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16 blur-lg'}`}>
          <div className="flex flex-col items-center gap-4 w-72">
            <div className="relative w-full h-40 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col justify-end">
              <div className="absolute top-0 left-0 right-0 h-full flex flex-col justify-end p-3 gap-0.5">
                <div className="w-full h-[30%] bg-emerald-500/20 rounded-sm transition-all duration-1000" />
                <div className="w-full h-[50%] bg-amber-500/20 rounded-sm" />
                <div className="w-full h-[20%] bg-red-500/20 rounded-sm" />
              </div>
              <div className="absolute top-[30%] left-0 right-0 border-t border-dashed border-emerald-500/60 flex items-center">
                <span className="text-[8px] font-mono text-emerald-400 bg-zinc-950/80 px-1 ml-2">ECN Mark 30%</span>
              </div>
              <div className="absolute top-[50%] left-0 right-0 border-t border-dashed border-amber-500/60 flex items-center">
                <span className="text-[8px] font-mono text-amber-400 bg-zinc-950/80 px-1 ml-2">PFC PAUSE 80%</span>
              </div>
              <div className="absolute top-[5%] left-0 right-0 border-t border-red-500/40 flex items-center">
                <span className="text-[8px] font-mono text-red-400 bg-zinc-950/80 px-1 ml-2">Drop 100% ✗</span>
              </div>
            </div>
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider text-center">ECN reduces rate · PFC halts · Drop never reached</p>
          </div>
        </div>
        {/* 2: Shallow vs deep buffer tanks */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${isActive(2) ? 'opacity-100 scale-100' : 'opacity-0 scale-90 blur-lg'}`}>
          <div className="flex gap-12 items-end">
            <div className="flex flex-col items-center gap-3">
              <div className="relative w-20 h-16 bg-zinc-900 border border-red-500/30 rounded-t-lg overflow-hidden">
                <div className="absolute bottom-0 left-0 right-0 h-[80%] bg-red-500/30 animate-pulse" />
                <div className="absolute inset-0 flex items-end justify-center pb-1">
                  <span className="text-[8px] font-mono text-red-400">64 MB</span>
                </div>
              </div>
              <div className="w-24 h-1 bg-zinc-700 rounded" />
              <span className="text-[9px] text-zinc-500 font-mono">Merchant Si.</span>
              <div className="flex gap-1">
                <div className="w-5 h-5 bg-red-500/20 border border-red-500/30 rounded text-center text-[7px] text-red-400 flex items-center justify-center">✗</div>
                <span className="text-[8px] text-zinc-600">AI/RoCE</span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="relative w-20 h-48 bg-zinc-900 border border-blue-500/30 rounded-t-lg overflow-hidden">
                <div className="absolute bottom-0 left-0 right-0 h-[35%] bg-blue-500/30" />
                <div className="absolute inset-0 flex items-start justify-center pt-2">
                  <span className="text-[8px] font-mono text-blue-400">Deep Buffer</span>
                </div>
              </div>
              <div className="w-24 h-1 bg-zinc-700 rounded" />
              <span className="text-[9px] text-zinc-500 font-mono">Arista Deep Buf.</span>
              <div className="flex gap-1">
                <div className="w-5 h-5 bg-emerald-500/20 border border-emerald-500/30 rounded text-center text-[7px] text-emerald-400 flex items-center justify-center">✓</div>
                <span className="text-[8px] text-zinc-600">AI/RoCE</span>
              </div>
            </div>
          </div>
        </div>
        {/* 3: LANZ latency graph */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${isActive(3) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16 blur-lg'}`}>
          <div className="flex flex-col gap-3 w-80">
            <div className="flex items-center gap-2 mb-1">
              <Activity size={14} className="text-cyan-400" />
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">LANZ · Queue Depth</span>
            </div>
            <div className="flex items-end gap-1 h-28 bg-zinc-900 rounded-xl p-3 border border-zinc-800">
              {[4,6,5,8,22,38,42,35,18,7,5,9,6,52,60,55,40,14,6,5].map((h, i) => (
                <div key={i} className="flex-1 rounded-sm transition-all duration-300"
                  style={{ height: `${h}%`, backgroundColor: h > 30 ? '#ef4444' : h > 15 ? '#f59e0b' : '#22d3ee', opacity: 0.7 }} />
              ))}
            </div>
            <div className="flex justify-between text-[8px] font-mono text-zinc-600">
              <span>0 μs</span><span>Microsecond Resolution</span><span>now</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (conceptId === 'c-state-streaming') {
    return (
      <div className="w-full h-full flex items-center justify-center relative bg-zinc-950 overflow-hidden">
        {/* 0: SNMP polling blindspot */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${isActive(0) ? 'opacity-100 scale-100' : 'opacity-0 scale-90 blur-lg'}`}>
          <div className="flex flex-col gap-4 w-80">
            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">SNMP Poll Timeline</div>
            <div className="relative h-20 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-px bg-zinc-700" />
              </div>
              {[10, 50, 90].map(x => (
                <div key={x} className="absolute top-0 bottom-0 flex flex-col items-center justify-center" style={{ left: `${x}%` }}>
                  <div className="w-px h-full bg-blue-500/60" />
                  <span className="absolute top-1 text-[7px] font-mono text-blue-400">POLL</span>
                </div>
              ))}
              <div className="absolute left-[15%] right-[55%] top-[30%] bottom-[30%] bg-red-500/20 border border-dashed border-red-500/40 rounded flex items-center justify-center">
                <span className="text-[7px] font-mono text-red-400">200 flaps invisible</span>
              </div>
            </div>
            <div className="text-[10px] font-mono text-zinc-600 text-center">Events between polls: invisible to NMS</div>
          </div>
        </div>
        {/* 1: SysDB hub */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${isActive(1) ? 'opacity-100 scale-100' : 'opacity-0 scale-75 blur-lg'}`}>
          <div className="relative w-72 h-72 flex items-center justify-center">
            <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex flex-col items-center justify-center shadow-[0_0_40px_rgba(99,102,241,0.4)] z-10 gap-0.5">
              <Database size={22} className="text-white" />
              <span className="text-[8px] font-mono text-indigo-200">SysDB</span>
            </div>
            {[
              { label: 'BGP', angle: 0 },
              { label: 'INTF', angle: 72 },
              { label: 'LANZ', angle: 144 },
              { label: 'gNMI', angle: 216 },
              { label: 'OSPF', angle: 288 },
            ].map(({ label, angle }) => (
              <div key={label} className="absolute w-14 h-10 bg-zinc-900 border border-zinc-700 rounded-xl flex items-center justify-center"
                style={{ top: `${50 + 40*Math.sin(angle*Math.PI/180) - 20}%`, left: `${50 + 40*Math.cos(angle*Math.PI/180) - 28}%` }}>
                <span className="text-[8px] font-mono text-zinc-400">{label}</span>
              </div>
            ))}
          </div>
        </div>
        {/* 2: gNMI streaming */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${isActive(2) ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20 blur-lg'}`}>
          <div className="flex flex-col gap-4 items-center w-80">
            <div className="flex items-center gap-3 w-full">
              <div className="w-14 h-10 bg-zinc-900 border border-zinc-700 rounded-xl flex items-center justify-center shrink-0">
                <Cpu size={18} className="text-zinc-400" />
              </div>
              <div className="flex-1 relative h-8 overflow-hidden">
                <div className="absolute inset-0 flex gap-2 items-center animate-marquee-slow">
                  {['bgp.state','intf.rx','lanz.q','arp.entry','route.add'].map(e => (
                    <span key={e} className="px-2 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded text-[8px] font-mono text-cyan-400 whitespace-nowrap">△ {e}</span>
                  ))}
                </div>
              </div>
              <div className="w-14 h-10 bg-zinc-900 border border-blue-500/50 rounded-xl flex items-center justify-center shrink-0">
                <Radar size={18} className="text-blue-400" />
              </div>
            </div>
            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">State deltas pushed · Sub-second granularity</div>
          </div>
        </div>
        {/* 3: Time-machine forensic timeline */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${isActive(3) ? 'opacity-100 scale-100' : 'opacity-0 -translate-y-12 blur-lg'}`}>
          <div className="flex flex-col gap-3 w-80">
            <div className="flex items-center gap-2 mb-1">
              <Clock size={14} className="text-blue-400" />
              <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">CloudVision Time-Machine</span>
            </div>
            <div className="relative h-14 bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
              <div className="absolute top-1/2 left-4 right-4 h-px bg-zinc-700" />
              {[
                { x: 15, label: 'BGP ↓', color: 'red' },
                { x: 38, label: 'Intf ↕', color: 'amber' },
                { x: 62, label: 'Cfg Δ', color: 'blue' },
                { x: 80, label: 'Route −', color: 'red' },
              ].map(({ x, label, color }) => (
                <div key={label} className="absolute flex flex-col items-center" style={{ left: `${x}%`, top: '20%' }}>
                  <div className={`w-1.5 h-1.5 rounded-full ${color === 'red' ? 'bg-red-500' : color === 'amber' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                  <span className={`text-[7px] font-mono mt-0.5 ${color === 'red' ? 'text-red-400' : color === 'amber' ? 'text-amber-400' : 'text-blue-400'}`}>{label}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[8px] font-mono text-zinc-700">
              <span>T-30 min</span><span>← Scrub backwards in time</span><span>Now</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (conceptId === 'c-zero-trust') {
    return (
      <div className="w-full h-full flex items-center justify-center relative bg-zinc-950 overflow-hidden">
        {/* 0: Perimeter fallacy — flat vs segmented */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${isActive(0) ? 'opacity-100 scale-100' : 'opacity-0 scale-90 blur-lg'}`}>
          <div className="flex gap-8 items-start">
            <div className="flex flex-col items-center gap-2">
              <div className="relative w-36 h-28 bg-red-500/5 border border-red-500/20 rounded-xl p-2">
                <div className="absolute top-2 right-2 w-4 h-4 rounded bg-zinc-800 border border-red-500/40" />
                {[[20,30],[55,20],[85,50],[25,70],[70,65]].map(([x,y],i) => (
                  <div key={i} className="absolute w-4 h-4 bg-zinc-800 border border-zinc-700 rounded" style={{ left:`${x}%`, top:`${y}%` }} />
                ))}
                <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none">
                  <line x1="28%" y1="38%" x2="59%" y2="28%" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 2"/>
                  <line x1="59%" y1="28%" x2="73%" y2="58%" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 2"/>
                  <line x1="28%" y1="38%" x2="29%" y2="78%" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 2"/>
                </svg>
              </div>
              <span className="text-[9px] font-mono text-red-400">Flat — Lateral Movement</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="relative w-36 h-28 bg-emerald-500/5 border border-emerald-500/20 rounded-xl overflow-hidden">
                <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-px p-1">
                  {['A','B','C','D'].map(z => (
                    <div key={z} className="bg-zinc-900 border border-emerald-500/20 rounded flex items-center justify-center">
                      <span className="text-[8px] font-mono text-emerald-600">{z}</span>
                    </div>
                  ))}
                </div>
                <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-px p-1 pointer-events-none">
                  <div className="border-r border-b border-emerald-500/50" />
                </div>
              </div>
              <span className="text-[9px] font-mono text-emerald-400">Segmented — Zero Trust</span>
            </div>
          </div>
        </div>
        {/* 1: MSS per-leaf enforcement */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${isActive(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16 blur-lg'}`}>
          <div className="flex flex-col items-center gap-6">
            <div className="flex gap-4">
              {['LEAF-1','LEAF-2','LEAF-3'].map(l => (
                <div key={l} className="flex flex-col items-center gap-1">
                  <div className="w-18 h-14 bg-zinc-900 border border-blue-500/40 rounded-xl flex flex-col items-center justify-center gap-0.5 px-2">
                    <Shield size={14} className="text-blue-400" />
                    <span className="text-[7px] font-mono text-zinc-500">{l}</span>
                    <span className="text-[6px] font-mono text-blue-400">Policy ✓</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <span className="text-[9px] font-mono text-blue-300">CloudVision pushes policy · Enforced in ASIC at line rate</span>
            </div>
          </div>
        </div>
        {/* 2: Identity as perimeter */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${isActive(2) ? 'opacity-100 scale-100' : 'opacity-0 scale-75 blur-lg'}`}>
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-zinc-900 border border-zinc-700 rounded-2xl flex items-center justify-center">
                <Cpu size={24} className="text-zinc-500" />
              </div>
              <div className="flex flex-col gap-1">
                <div className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center gap-2">
                  <ShieldCheck size={12} className="text-emerald-400" />
                  <span className="text-[9px] font-mono text-emerald-300">Identity: device-7829 · Cert valid</span>
                </div>
                <div className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-center gap-2">
                  <Eye size={12} className="text-blue-400" />
                  <span className="text-[9px] font-mono text-blue-300">Access: VLAN-Prod · Port 443 only</span>
                </div>
                <div className="px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2">
                  <AlertCircle size={12} className="text-red-400" />
                  <span className="text-[9px] font-mono text-red-300">Blocked: VLAN-Finance · HR-subnet</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* 3: NDR anomaly detection */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${isActive(3) ? 'opacity-100 scale-100' : 'opacity-0 translate-x-16 blur-lg'}`}>
          <div className="flex flex-col gap-3 w-80">
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-red-400" />
              <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest">NDR · Behavioral Anomaly</span>
            </div>
            <div className="flex items-end gap-1 h-24 bg-zinc-900 rounded-xl p-3 border border-zinc-800">
              {[2,3,2,3,2,3,2,28,42,38,24,3,2,3,2].map((h, i) => (
                <div key={i} className="flex-1 rounded-sm"
                  style={{ height: `${h * 2}%`, backgroundColor: h > 10 ? '#ef4444' : '#3b82f6', opacity: 0.7 }} />
              ))}
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg">
              <AlertCircle size={12} className="text-red-400 shrink-0" />
              <span className="text-[8px] font-mono text-red-300">SRV-42 → HR-subnet · SMB · First-time contact flagged</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (conceptId === 'c-macsec') {
    return (
      <div className="w-full h-full flex items-center justify-center relative bg-zinc-950 overflow-hidden">
        {/* 0: Encrypted link */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${isActive(0) ? 'opacity-100 scale-100' : 'opacity-0 scale-90 blur-lg'}`}>
          <div className="flex items-center gap-4">
            <div className="w-20 h-14 bg-zinc-900 border border-zinc-700 rounded-xl flex flex-col items-center justify-center gap-0.5">
              <Cpu size={18} className="text-zinc-400" />
              <span className="text-[7px] font-mono text-zinc-600">ASIC-A</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1">
                <div className="w-16 h-px bg-gradient-to-r from-zinc-700 via-emerald-500 to-zinc-700" />
              </div>
              <div className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center gap-1.5">
                <Lock size={10} className="text-emerald-400" />
                <span className="text-[8px] font-mono text-emerald-300">AES-128-GCM</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-16 h-px bg-gradient-to-r from-zinc-700 via-emerald-500 to-zinc-700" />
              </div>
            </div>
            <div className="w-20 h-14 bg-zinc-900 border border-zinc-700 rounded-xl flex flex-col items-center justify-center gap-0.5">
              <Cpu size={18} className="text-zinc-400" />
              <span className="text-[7px] font-mono text-zinc-600">ASIC-B</span>
            </div>
          </div>
        </div>
        {/* 1: CAK → SAK key derivation */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${isActive(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16 blur-lg'}`}>
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-8">
              {['Switch-A','Switch-B'].map(s => (
                <div key={s} className="flex flex-col items-center gap-2">
                  <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center gap-2">
                    <Key size={14} className="text-amber-400" />
                    <span className="text-[9px] font-mono text-amber-300">CAK (pre-shared)</span>
                  </div>
                  <div className="w-px h-4 bg-zinc-700" />
                  <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2">
                    <Lock size={14} className="text-emerald-400" />
                    <span className="text-[9px] font-mono text-emerald-300">SAK (session)</span>
                  </div>
                  <span className="text-[8px] font-mono text-zinc-600">{s}</span>
                </div>
              ))}
            </div>
            <div className="text-[9px] font-mono text-zinc-500 text-center">CAK never crosses the wire · SAK rotates automatically</div>
          </div>
        </div>
        {/* 2: Selective deployment — high-risk links */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${isActive(2) ? 'opacity-100 scale-100' : 'opacity-0 scale-75 blur-lg'}`}>
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-10 items-center">
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-10 bg-zinc-900 border border-zinc-700 rounded-lg flex items-center justify-center">
                  <span className="text-[7px] font-mono text-zinc-500">DC-A</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-20 h-px bg-amber-500/60" />
                  <Lock size={10} className="text-amber-400" />
                  <div className="w-20 h-px bg-amber-500/60" />
                </div>
                <div className="w-16 h-10 bg-zinc-900 border border-zinc-700 rounded-lg flex items-center justify-center">
                  <span className="text-[7px] font-mono text-zinc-500">DC-B</span>
                </div>
              </div>
            </div>
            <div className="flex gap-4 text-[8px] font-mono">
              <div className="flex items-center gap-1 text-amber-400"><Lock size={9} /> DCI dark fiber</div>
              <div className="flex items-center gap-1 text-amber-400"><Lock size={9} /> Colo cross-connect</div>
            </div>
            <div className="flex items-center gap-1 text-zinc-600 text-[8px] font-mono">
              <span>Internal fabric links: unencrypted (trusted)</span>
            </div>
          </div>
        </div>
        {/* 3: Cipher + replay protection */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${isActive(3) ? 'opacity-100 scale-100' : 'opacity-0 translate-x-16 blur-lg'}`}>
          <div className="flex flex-col gap-3 w-72">
            <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl font-mono text-[9px] space-y-2">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                <span className="text-zinc-500">SecTAG Packet #</span>
                <span className="text-cyan-400 tabular-nums animate-pulse">0x0000A4F2</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">Cipher Suite</span>
                <span className="text-emerald-400">GCM-AES-256</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">Replay Window</span>
                <span className="text-blue-400">32 frames</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">FIPS 140-2</span>
                <ShieldCheck size={12} className="text-emerald-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (conceptId === 'c-ai-cluster-networking') {
    return (
      <div className="w-full h-full flex items-center justify-center relative bg-zinc-950 overflow-hidden">
        {/* 0: Bisection bandwidth */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${isActive(0) ? 'opacity-100 scale-100' : 'opacity-0 scale-90 blur-lg'}`}>
          <div className="relative w-72 h-56 flex items-center justify-center">
            <div className="absolute inset-0 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
              <div className="grid grid-cols-3 grid-rows-3 h-full">
                {Array.from({length:9}).map((_,i) => (
                  <div key={i} className="border border-zinc-800/50 flex items-center justify-center">
                    <div className="w-4 h-4 bg-violet-500/20 rounded" />
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute top-0 bottom-0 left-1/2 w-px bg-red-500/60 border-l border-dashed border-red-500" />
            <div className="absolute top-1/2 left-0 right-0 flex justify-between px-3">
              <span className="text-[8px] font-mono text-blue-400 bg-zinc-950/80 px-1">← 400G</span>
              <span className="text-[8px] font-mono text-blue-400 bg-zinc-950/80 px-1">400G →</span>
            </div>
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[8px] font-mono text-red-400">Bisection Line</div>
          </div>
        </div>
        {/* 1: Dual-rail fabric */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${isActive(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16 blur-lg'}`}>
          <div className="flex flex-col gap-4 items-center">
            <div className="flex gap-6">
              <div className="flex flex-col items-center gap-1">
                <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg text-[8px] font-mono text-blue-400">Rail 0 ToR</div>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="px-4 py-2 bg-violet-500/10 border border-violet-500/30 rounded-lg text-[8px] font-mono text-violet-400">Rail 1 ToR</div>
              </div>
            </div>
            <div className="flex gap-2">
              {Array.from({length:4}).map((_,i) => (
                <div key={i} className="flex flex-col items-center gap-0.5">
                  <div className="w-px h-4 bg-blue-500/40" />
                  <div className="w-px h-4 bg-violet-500/40" />
                  <div className="w-12 h-8 bg-zinc-900 border border-zinc-700 rounded flex items-center justify-center">
                    <span className="text-[6px] font-mono text-zinc-500">GPU×8</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-[9px] font-mono text-zinc-500">Each server dual-homed · Rail 0 + Rail 1</div>
          </div>
        </div>
        {/* 2: RDMA kernel bypass */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${isActive(2) ? 'opacity-100 scale-100' : 'opacity-0 scale-75 blur-lg'}`}>
          <div className="flex gap-16 items-center">
            {['GPU-A','GPU-B'].map((g, i) => (
              <div key={g} className="flex flex-col items-center gap-2">
                <div className="w-16 h-10 bg-violet-500/10 border border-violet-500/30 rounded-xl flex items-center justify-center">
                  <span className="text-[8px] font-mono text-violet-300">{g}</span>
                </div>
                <div className="w-px h-4 bg-emerald-500/40" />
                <div className="w-16 h-8 bg-zinc-900 border border-emerald-500/30 rounded-lg flex items-center justify-center">
                  <span className="text-[7px] font-mono text-emerald-400">NIC</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* 3: Three-tier AI fabric */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${isActive(3) ? 'opacity-100 scale-100' : 'opacity-0 -translate-y-12 blur-lg'}`}>
          <div className="flex flex-col items-center gap-3">
            {[
              { label: 'Ethernet Spine', color: 'border-blue-500/40 bg-blue-500/10 text-blue-400', w: 'w-56' },
              { label: 'NVLink Switch', color: 'border-violet-500/40 bg-violet-500/10 text-violet-400', w: 'w-44' },
              { label: 'GPU × NVLink', color: 'border-amber-500/40 bg-amber-500/10 text-amber-400', w: 'w-32' },
            ].map(({ label, color, w }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <div className={`${w} py-2 border rounded-lg flex items-center justify-center ${color}`}>
                  <span className="text-[9px] font-mono">{label}</span>
                </div>
                <div className="w-px h-3 bg-zinc-700" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (conceptId === 'c-campus-vs-dc') {
    return (
      <div className="w-full h-full flex items-center justify-center relative bg-zinc-950 overflow-hidden">
        {/* 0: DC vs Campus trust model */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${isActive(0) ? 'opacity-100 scale-100' : 'opacity-0 scale-90 blur-lg'}`}>
          <div className="flex gap-8">
            <div className="flex flex-col items-center gap-3">
              <div className="w-36 h-28 bg-blue-500/5 border border-blue-500/20 rounded-xl p-2 flex flex-wrap gap-1 content-start">
                {Array.from({length:6}).map((_,i) => (
                  <div key={i} className="w-8 h-6 bg-zinc-900 border border-blue-500/30 rounded flex items-center justify-center">
                    <Server size={10} className="text-blue-400" />
                  </div>
                ))}
              </div>
              <span className="text-[9px] font-mono text-blue-400">DC · Known endpoints</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-36 h-28 bg-amber-500/5 border border-amber-500/20 rounded-xl p-2 flex flex-wrap gap-1 content-start">
                <div className="w-8 h-6 bg-zinc-900 border border-zinc-700 rounded flex items-center justify-center"><Cpu size={10} className="text-zinc-500"/></div>
                <div className="w-8 h-6 bg-zinc-900 border border-zinc-700 rounded flex items-center justify-center"><Wifi size={10} className="text-zinc-500"/></div>
                <div className="w-8 h-6 bg-zinc-900 border border-zinc-700 rounded flex items-center justify-center"><Radio size={10} className="text-zinc-500"/></div>
                <div className="w-8 h-6 bg-zinc-900 border border-zinc-700 rounded flex items-center justify-center"><Shield size={10} className="text-zinc-500"/></div>
                <div className="w-16 h-6 bg-amber-500/10 border border-amber-500/40 rounded flex items-center justify-center col-span-2">
                  <ShieldCheck size={10} className="text-amber-400 mr-1" /><span className="text-[7px] font-mono text-amber-400">802.1X gate</span>
                </div>
              </div>
              <span className="text-[9px] font-mono text-amber-400">Campus · Identity first</span>
            </div>
          </div>
        </div>
        {/* 1: PoE budget */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${isActive(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16 blur-lg'}`}>
          <div className="flex flex-col items-center gap-4">
            <div className="w-64 h-16 bg-zinc-900 border border-zinc-700 rounded-2xl flex items-center justify-center gap-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-amber-500/5" />
              <Zap size={20} className="text-amber-400" />
              <span className="text-sm font-bold font-mono text-white">Campus Switch</span>
              <Zap size={20} className="text-amber-400" />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { icon: <Wifi size={12}/>, label: 'AP 30W', color: 'text-blue-400 border-blue-500/30' },
                { icon: <span className="text-[8px]">📞</span>, label: 'Phone 15W', color: 'text-emerald-400 border-emerald-500/30' },
                { icon: <Radio size={12}/>, label: 'Camera 15W', color: 'text-violet-400 border-violet-500/30' },
                { icon: <Shield size={12}/>, label: 'IoT 7W', color: 'text-amber-400 border-amber-500/30' },
              ].map(({ icon, label, color }) => (
                <div key={label} className={`flex flex-col items-center gap-1 px-2 py-2 bg-zinc-900 border rounded-xl ${color}`}>
                  <div className={color}>{icon}</div>
                  <span className={`text-[7px] font-mono ${color}`}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* 2: LLDP-MED auto-provision */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${isActive(2) ? 'opacity-100 scale-100' : 'opacity-0 scale-75 blur-lg'}`}>
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center gap-1">
                <div className="w-14 h-10 bg-zinc-900 border border-zinc-700 rounded-xl flex items-center justify-center">
                  <Wifi size={18} className="text-zinc-500" />
                </div>
                <span className="text-[7px] font-mono text-zinc-600">IP Phone</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded text-[7px] font-mono text-emerald-400">LLDP-MED →</div>
                <div className="px-2 py-1 bg-blue-500/10 border border-blue-500/30 rounded text-[7px] font-mono text-blue-400">Voice VLAN: 100</div>
                <div className="px-2 py-1 bg-violet-500/10 border border-violet-500/30 rounded text-[7px] font-mono text-violet-400">DSCP EF: 46</div>
              </div>
              <div className="w-14 h-10 bg-zinc-900 border border-blue-500/30 rounded-xl flex items-center justify-center">
                <Cpu size={18} className="text-blue-400" />
              </div>
            </div>
            <span className="text-[9px] font-mono text-zinc-500">Auto-provisioned · Zero manual per-port config</span>
          </div>
        </div>
        {/* 3: STP blocking vs routed access */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${isActive(3) ? 'opacity-100 scale-100' : 'opacity-0 -translate-x-16 blur-lg'}`}>
          <div className="flex gap-10 items-start">
            <div className="flex flex-col items-center gap-2">
              <div className="w-20 h-8 bg-zinc-900 border border-zinc-700 rounded text-center text-[7px] font-mono text-zinc-500 flex items-center justify-center">Core</div>
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-px h-6 bg-blue-500/50" />
                  <div className="w-14 h-7 bg-zinc-900 border border-zinc-700 rounded text-center text-[6px] font-mono text-zinc-500 flex items-center justify-center">Access</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-px h-6 bg-red-500/40 border-l border-dashed border-red-500" />
                  <div className="w-14 h-7 bg-red-500/5 border border-red-500/30 rounded text-center text-[6px] font-mono text-red-400 flex items-center justify-center">BLOCKED</div>
                </div>
              </div>
              <span className="text-[8px] font-mono text-red-400">STP blocks 50%</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-20 h-8 bg-zinc-900 border border-emerald-500/30 rounded text-center text-[7px] font-mono text-emerald-400 flex items-center justify-center">Core</div>
              <div className="flex gap-3">
                {['A','B'].map(l => (
                  <div key={l} className="flex flex-col items-center">
                    <div className="w-px h-6 bg-emerald-500/50" />
                    <div className="w-14 h-7 bg-emerald-500/5 border border-emerald-500/30 rounded text-center text-[6px] font-mono text-emerald-400 flex items-center justify-center">BGP {l}</div>
                  </div>
                ))}
              </div>
              <span className="text-[8px] font-mono text-emerald-400">Routed · 100% active</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (conceptId === 'c-issu-reliability') {
    return (
      <div className="w-full h-full flex items-center justify-center relative bg-zinc-950 overflow-hidden">
        {/* 0: Classic upgrade gap vs ISSU */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${isActive(0) ? 'opacity-100 scale-100' : 'opacity-0 scale-90 blur-lg'}`}>
          <div className="flex flex-col gap-5 w-80">
            <div className="flex flex-col gap-1">
              <span className="text-[8px] font-mono text-red-400 uppercase">Traditional Upgrade</span>
              <div className="flex items-center h-8 bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
                <div className="h-full w-[35%] bg-emerald-500/30" />
                <div className="h-full w-[30%] bg-red-500/40 flex items-center justify-center">
                  <span className="text-[7px] font-mono text-red-300">DOWN 5min</span>
                </div>
                <div className="h-full w-[35%] bg-emerald-500/30" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[8px] font-mono text-emerald-400 uppercase">ISSU (EOS)</span>
              <div className="flex items-center h-8 bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
                <div className="h-full w-full bg-emerald-500/30 flex items-center justify-center">
                  <span className="text-[7px] font-mono text-emerald-300">Forwarding Continuous ✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* 1: SysDB preserving state during agent restart */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${isActive(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16 blur-lg'}`}>
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-2">
              {['BGP','OSPF','LLDP','IntfMgr'].map((agent, i) => (
                <div key={agent} className="flex flex-col items-center gap-1">
                  <div className={`w-14 h-10 rounded-xl border flex flex-col items-center justify-center gap-0.5 ${i === 1 ? 'bg-amber-500/10 border-amber-500/40' : 'bg-zinc-900 border-zinc-700'}`}>
                    <span className={`text-[7px] font-mono ${i === 1 ? 'text-amber-400' : 'text-zinc-500'}`}>{agent}</span>
                    {i === 1 && <RefreshCw size={8} className="text-amber-400 animate-spin" />}
                  </div>
                </div>
              ))}
            </div>
            <div className="w-72 h-px bg-zinc-800" />
            <div className="w-64 py-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl flex items-center justify-center gap-2">
              <Database size={16} className="text-indigo-400" />
              <span className="text-[9px] font-mono text-indigo-300">SysDB · Forwarding State Preserved</span>
            </div>
            <div className="w-48 py-2 bg-zinc-900 border border-zinc-700 rounded-lg flex items-center justify-center gap-2">
              <Cpu size={14} className="text-zinc-500" />
              <span className="text-[8px] font-mono text-zinc-500">ASIC · Forwarding Uninterrupted</span>
            </div>
          </div>
        </div>
        {/* 2: BGP agent crash → restart */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${isActive(2) ? 'opacity-100 scale-100' : 'opacity-0 scale-75 blur-lg'}`}>
          <div className="flex flex-col gap-3 w-72">
            {[
              { step: '1', label: 'BGP agent crashes', color: 'text-red-400 border-red-500/30 bg-red-500/10' },
              { step: '2', label: 'SysDB state preserved', color: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10' },
              { step: '3', label: 'Agent restarts · re-subscribes', color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
              { step: '4', label: 'Peer: Graceful Restart active', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' },
            ].map(({ step, label, color }) => (
              <div key={step} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border ${color}`}>
                <span className="font-mono text-xs font-bold w-4">{step}</span>
                <span className="text-[10px] font-mono">{label}</span>
              </div>
            ))}
          </div>
        </div>
        {/* 3: CloudVision fabric upgrade */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${isActive(3) ? 'opacity-100 scale-100' : 'opacity-0 -translate-y-12 blur-lg'}`}>
          <div className="flex flex-col gap-4 items-center">
            <div className="grid grid-cols-5 gap-2">
              {[true,true,true,false,false,true,false,false,false,false].map((done, i) => (
                <div key={i} className={`w-10 h-8 rounded-lg border flex items-center justify-center ${done ? 'bg-emerald-500/20 border-emerald-500/40' : 'bg-zinc-900 border-zinc-700'}`}>
                  <span className={`text-[7px] font-mono ${done ? 'text-emerald-400' : 'text-zinc-600'}`}>{done ? '✓' : '…'}</span>
                </div>
              ))}
            </div>
            <div className="w-64 h-2 bg-zinc-900 rounded-full border border-zinc-800 overflow-hidden">
              <div className="h-full w-[30%] bg-emerald-500 rounded-full" />
            </div>
            <span className="text-[9px] font-mono text-zinc-500">CloudVision Lifecycle · Rolling ISSU · Auto-validate</span>
          </div>
        </div>
      </div>
    );
  }

  if (conceptId === 'c-optics-guide') {
    return (
      <div className="w-full h-full flex items-center justify-center relative bg-zinc-950 overflow-hidden">
        {/* 0: Reach ruler */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${isActive(0) ? 'opacity-100 scale-100' : 'opacity-0 scale-90 blur-lg'}`}>
          <div className="flex flex-col gap-4 w-80">
            <div className="relative h-8 bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex">
                {[
                  { label:'SR', w:'10%', color:'bg-blue-500/30' },
                  { label:'DR', w:'10%', color:'bg-cyan-500/20' },
                  { label:'FR', w:'15%', color:'bg-emerald-500/20' },
                  { label:'LR', w:'20%', color:'bg-amber-500/20' },
                  { label:'ER', w:'20%', color:'bg-orange-500/20' },
                  { label:'ZR', w:'25%', color:'bg-red-500/20' },
                ].map(({ label, w, color }) => (
                  <div key={label} className={`h-full ${color} border-r border-zinc-800 flex items-center justify-center`} style={{width:w}}>
                    <span className="text-[8px] font-mono text-zinc-400">{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-between text-[7px] font-mono text-zinc-600">
              <span>100m</span><span>500m</span><span>2km</span><span>10km</span><span>40km</span><span>80-120km</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {[
                { l:'SR', t:'MMF', c:'text-blue-400 border-blue-500/30' },
                { l:'ZR+', t:'SMF + DSP', c:'text-red-400 border-red-500/30' },
              ].map(({ l, t, c }) => (
                <div key={l} className={`flex items-center gap-1 px-2 py-1 rounded border text-[8px] font-mono ${c}`}>
                  <Radio size={9} /><span>{l} · {t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* 1: Breakout logic */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${isActive(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16 blur-lg'}`}>
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="px-4 py-3 bg-violet-500/10 border border-violet-500/30 rounded-xl">
                <div className="text-[10px] font-mono text-violet-300 font-bold">400G QSFP-DD</div>
                <div className="text-[8px] font-mono text-zinc-500">1× port</div>
              </div>
              <div className="text-zinc-600">→</div>
              <div className="flex flex-col gap-1">
                {['100G','100G','100G','100G'].map((b,i) => (
                  <div key={i} className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-lg text-[8px] font-mono text-blue-300">{b}</div>
                ))}
              </div>
            </div>
            <div className="text-[9px] font-mono text-zinc-500">MPO-12 breakout · 4× LC duplex · ASIC lane allocation</div>
          </div>
        </div>
        {/* 2: DOM diagnostic panel */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${isActive(2) ? 'opacity-100 scale-100' : 'opacity-0 scale-75 blur-lg'}`}>
          <div className="flex flex-col gap-2 w-72 p-4 bg-zinc-900 border border-zinc-800 rounded-2xl font-mono text-[10px]">
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-2 mb-1">
              <Activity size={12} className="text-cyan-400" />
              <span className="text-cyan-400 uppercase tracking-widest text-[9px]">DOM · Ethernet1</span>
            </div>
            {[
              { label: 'Tx Power', value: '-2.3 dBm', status: 'emerald' },
              { label: 'Rx Power', value: '-8.7 dBm', status: 'amber' },
              { label: 'Temperature', value: '45°C', status: 'emerald' },
              { label: 'Bias Current', value: '35 mA', status: 'emerald' },
            ].map(({ label, value, status }) => (
              <div key={label} className="flex justify-between items-center py-1 border-b border-zinc-800/50">
                <span className="text-zinc-500">{label}</span>
                <span className={status === 'emerald' ? 'text-emerald-400' : 'text-amber-400'}>{value}
                  {status === 'amber' && <span className="ml-1 text-amber-500">⚠</span>}
                </span>
              </div>
            ))}
          </div>
        </div>
        {/* 3: ZR DCI before/after */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${isActive(3) ? 'opacity-100 scale-100' : 'opacity-0 translate-x-16 blur-lg'}`}>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <span className="text-[8px] font-mono text-red-400 uppercase">Before · Traditional DCI</span>
              <div className="flex items-center gap-1 text-[7px] font-mono text-zinc-500">
                {['Router','Transponder','DWDM','Transponder','Router'].map((n,i) => (
                  <span key={i} className={`flex items-center gap-0.5 ${n==='DWDM'?'text-red-400':''}`}>
                    {i>0 && <span className="text-zinc-700">—</span>}
                    <span className={`px-1 py-0.5 rounded border ${n==='DWDM'?'border-red-500/40 bg-red-500/10':'border-zinc-700 bg-zinc-900'}`}>{n}</span>
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[8px] font-mono text-emerald-400 uppercase">After · 400G-ZR Direct</span>
              <div className="flex items-center gap-1 text-[7px] font-mono text-zinc-500">
                {['Router','400G-ZR','Dark Fiber','400G-ZR','Router'].map((n,i) => (
                  <span key={i} className="flex items-center gap-0.5">
                    {i>0 && <span className="text-zinc-700">—</span>}
                    <span className={`px-1 py-0.5 rounded border ${n.includes('ZR')?'border-emerald-500/40 bg-emerald-500/10 text-emerald-400':'border-zinc-700 bg-zinc-900'}`}>{n}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <div className="w-32 h-32 border-2 border-zinc-800 rounded-full animate-pulse"></div>;
};

export const VisualEssays: React.FC<VisualEssaysProps> = ({ onBack, startAbout = false }) => {
  const { concepts } = useInfraLens(); 
  const [selectedConcept, setSelectedConcept] = useState<ConceptType | null>(null);
  const [activeSection, setActiveSection] = useState(0);
  const [showAbout, setShowAbout] = useState(startAbout);

  useEffect(() => {
    if (!selectedConcept) return;
    const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => { if (entry.isIntersecting) setActiveSection(Number(entry.target.getAttribute('data-section-index'))); });
        }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });
    const sections = document.querySelectorAll('.essay-section');
    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, [selectedConcept]);

  if (showAbout) {
    return (
        <div className="min-h-screen bg-page-bg text-primary font-sans flex flex-col md:flex-row overflow-hidden">
          <aside className="w-full md:w-72 border-r border-border bg-page-bg flex flex-col shrink-0">
             <div className="p-8 flex items-center gap-3">
                <button onClick={() => setShowAbout(false)} className="p-2 -ml-2 text-secondary hover:text-primary rounded-lg hover:bg-card-bg transition-colors"><ArrowLeft size={18} /></button>
                <div className="flex flex-col"><span className="font-serif font-bold text-lg">Essays</span><span className="tool-label">Arista Field Spec</span></div>
             </div>
             <div className="p-6 border-t border-border mt-auto"><button onClick={onBack} className="text-xs text-secondary hover:text-primary flex items-center gap-2 uppercase tracking-widest"><ArrowLeft size={12}/> System Home</button></div>
          </aside>
          <main className="flex-1 overflow-y-auto bg-[#09090b] p-8 md:p-20 relative">
            <div className="max-w-4xl mx-auto space-y-16 animate-fade-in pb-32">
                <header className="space-y-6">
                    <h1 className="text-6xl md:text-8xl font-serif font-bold tracking-tighter">Architecture Dives</h1>
                    <p className="text-2xl text-blue-400 font-light border-l-2 border-blue-500/30 pl-8">Visual deconstruction of networking first-principles.</p>
                </header>
            </div>
          </main>
        </div>
    );
  }

  if (!selectedConcept) {
    return (
      <div className="min-h-screen bg-page-bg text-white p-8 md:p-16 font-sans">
        <div className="max-w-7xl mx-auto">
          <header className="mb-20">
            <div className="flex items-center gap-6 mb-8">
                <button onClick={onBack} className="group flex items-center gap-2 text-secondary hover:text-primary transition-colors text-sm font-medium"><ArrowLeft size={16} /> Back</button>
                <button onClick={() => setShowAbout(true)} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-blue-500 hover:text-blue-400 transition-colors"><Info size={14} /> About Essays</button>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tighter mb-4 text-primary">Visual Essays</h1>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
            {concepts.filter(c => !c.hidden).map((concept) => (
              <div key={concept.id} onClick={() => setSelectedConcept(concept)} className="group relative bg-card-bg border border-border rounded-3xl p-6 cursor-pointer hover:border-blue-500/30 transition-all">
                 {concept.id === 'c-polymathos' && (
                   <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-[0.3em] px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/40 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.25)]">
                     Featured
                   </span>
                 )}
                 <div className="mb-6 mt-4">
                    <div className="w-12 h-12 rounded-2xl bg-card-bg border border-border mb-4 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                        {concept.id === 'c-why-arista' ? <Sparkles size={20} /> : <Share2 size={20} />}
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-primary mb-2">{concept.title}</h2>
                    <p className="text-secondary text-sm line-clamp-2">{concept.subtitle}</p>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page-bg text-primary font-sans overflow-x-hidden">
        <nav className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50 pointer-events-none">
          <button onClick={() => setSelectedConcept(null)} className="w-10 h-10 rounded-full bg-card-bg/80 border border-border flex items-center justify-center text-primary hover:bg-white hover:text-black transition-all backdrop-blur-md pointer-events-auto"><X size={18} /></button>
          <span className="font-mono text-xs uppercase text-secondary bg-surface-muted/50 backdrop-blur px-3 py-1 rounded-full border border-primary/10">{selectedConcept.title}</span>
        </nav>
        <div className="relative">
          <div className="fixed inset-0 w-full h-screen z-0 flex items-center justify-center bg-page-bg">
            <ConceptVisual conceptId={selectedConcept.id} sectionIdx={activeSection} />
          </div>
          <div className="relative z-10 w-full pt-[50vh] pb-[50vh]">
            {selectedConcept.sections.map((section, idx) => (
              <div key={idx} data-section-index={idx} className="essay-section min-h-screen flex items-center justify-center pointer-events-none">
                <div className="max-w-xl p-8 md:p-12 bg-page-bg/80 backdrop-blur-xl border border-primary/10 rounded-3xl pointer-events-auto transform transition-all duration-500">
                  <span className="font-mono text-xs text-blue-400 uppercase mb-6 block border-b border-blue-500/20 pb-4">PART 0{idx + 1}</span>
                  <h2 className="text-3xl md:text-5xl font-serif font-bold text-primary mb-6 leading-tight">{section.heading}</h2>
                  <p className="text-lg md:text-xl text-primary leading-relaxed font-light">{section.body}</p>
                </div>
              </div>
            ))}
            <div className="h-[50vh] flex flex-col items-center justify-center text-center p-8 relative z-20 pointer-events-auto">
                <button onClick={() => setSelectedConcept(null)} className="px-8 py-4 bg-white text-black rounded-full font-bold text-sm uppercase tracking-widest hover:bg-zinc-200 transition-all">Return to Gallery</button>
            </div>
          </div>
        </div>
    </div>
  );
};
