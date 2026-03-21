
import React, { useState, useMemo } from 'react';
/* Added AlertTriangle to the imports from lucide-react to resolve missing name error */
import { ArrowLeft, Cpu, Zap, Activity, ShieldCheck, Box, Layers, Share2, Server, Layout, ChevronRight, Loader2, Sparkles, AlertCircle, TrendingUp, Info, AlertTriangle } from 'lucide-react';
import { FabricStrategy } from '@/types';

interface AIClusterFabricDesignerProps {
  onBack: () => void;
}

export const AIClusterFabricDesigner: React.FC<AIClusterFabricDesignerProps> = ({ onBack }) => {
  const [gpuCount, setGpuCount] = useState(128);
  const [modelType, setModelType] = useState('H100 (80GB)');
  const [connectivity, setConnectivity] = useState('400G');
  const [loading, setLoading] = useState(false);
  const [strategy, setStrategy] = useState<FabricStrategy | null>(null);

  const buildLocalStrategy = (): FabricStrategy => {
    const topology = gpuCount >= 512 ? 'Rail-optimized leaf-spine' : 'Leaf-spine';
    const skuRecommendation = connectivity === '800G'
      ? '7800R4 spine with 7060X6 leafs (800G rail-ready)'
      : '7280R3 spine with 7050X3 leafs (400G rail-ready)';
    const railAlignment = `Align ${gpuCount} GPUs into 8-GPU rails; keep rail pairs adjacent to minimize cross-rail hops.`;
    const executiveSummary = `Design targets ${connectivity} per-GPU bandwidth with ${oversubscription} fabric economics. Prioritize deterministic ECMP and MTU parity across rails.`;
    const criticalCaveats = [
      'Validate optics power class and lane mapping for the selected form factor.',
      'Keep MTU consistent end-to-end; mismatches will amplify tail latency.',
      'Plan separate control-plane and storage traffic classes for rail stability.'
    ];
    return {
      topology,
      skuRecommendation,
      oversubscriptionRatio: oversubscription,
      railAlignment,
      executiveSummary,
      criticalCaveats
    };
  };

  const handleDesign = () => {
    setLoading(true);
    const local = buildLocalStrategy();
    window.setTimeout(() => {
      setStrategy(local);
      setLoading(false);
    }, 250);
  };

  // Static calculations for immediate feedback
  const oversubscription = useMemo(() => {
    if (gpuCount <= 64) return '1:1 (Non-Blocking)';
    if (gpuCount <= 256) return '2:1 (Slight Oversubscription)';
    return '3:1 (Aggressive Oversubscription)';
  }, [gpuCount]);

  return (
    <div className="min-h-screen bg-page-bg text-primary font-sans flex flex-col overflow-hidden selection:bg-violet-500/30">
      
      {/* HEADER */}
      <header className="h-16 border-b border-border flex items-center justify-between px-8 bg-page-bg shrink-0 z-50">
        <div className="flex items-center gap-6">
            <button onClick={onBack} className="group p-2 text-secondary hover:text-primary transition-colors">
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <div className="h-4 w-px bg-border"></div>
            <div className="flex items-center gap-3">
                <div className="p-2 bg-violet-500/10 border border-violet-500/20 rounded-lg text-violet-400">
                    <Share2 size={20} />
                </div>
                <div>
                    <h1 className="text-sm font-bold uppercase tracking-wider">AI Fabric Designer</h1>
                    <span className="tool-label">High-Radix Pipeline v1.4</span>
                </div>
            </div>
        </div>
        <div className="flex items-center gap-4">
           <div className="bg-card-bg border border-border px-3 py-1 rounded-full flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-violet-500"></div>
              <span className="tool-label">GPU Fabric Ready</span>
           </div>
        </div>
      </header>

      {/* WORKSPACE */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* LEFT: PARAMETERS */}
        <section className="w-full md:w-[400px] bg-page-bg border-r border-border flex flex-col shrink-0 relative overflow-y-auto">
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
           
           <div className="p-8 md:p-10 relative z-10 space-y-12">
              <header className="space-y-4">
                 <h2 className="text-4xl font-serif font-bold text-primary tracking-tighter">Cluster Spec</h2>
                 <p className="text-sm text-secondary leading-relaxed">Define the compute parameters to synthesize a validated Arista networking strategy.</p>
              </header>

              <div className="space-y-6">
                 <div className="space-y-3">
                    <label className="tool-label">Total GPU Count</label>
                    <input 
                       type="range" min="32" max="2048" step="32"
                       value={gpuCount}
                       onChange={(e) => setGpuCount(parseInt(e.target.value))}
                       className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-violet-500"
                    />
                    <div className="flex justify-between text-2xl font-serif font-bold text-primary">
                       <span>{gpuCount}</span>
                       <span className="text-xs font-mono text-secondary self-end">MAX 2048</span>
                    </div>
                 </div>

                 <div className="space-y-3">
                    <label className="tool-label">Accelerator Model</label>
                    <select 
                      value={modelType}
                      onChange={(e) => setModelType(e.target.value)}
                      className="w-full bg-card-bg border border-border rounded-xl p-4 text-sm outline-none focus:border-violet-500 transition-colors"
                    >
                       <option value="H100 (80GB)">NVIDIA H100 (80GB)</option>
                       <option value="B200 (192GB)">NVIDIA BlackWell B200</option>
                       <option value="MI300X">AMD Instinct MI300X</option>
                    </select>
                 </div>

                 <div className="space-y-3">
                    <label className="tool-label">Per-GPU Bandwidth</label>
                    <div className="grid grid-cols-2 gap-2">
                       {['400G', '800G'].map(val => (
                          <button 
                             key={val}
                             onClick={() => setConnectivity(val)}
                             className={`p-3 rounded-xl border text-xs font-bold transition-all ${connectivity === val ? 'bg-violet-900/20 border-violet-500 text-violet-400' : 'bg-card-bg border-border text-secondary hover:border-border'}`}
                          >
                             {val}
                          </button>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="pt-6 border-t border-border">
                 <button 
                   onClick={handleDesign}
                   disabled={loading}
                   className="w-full py-4 bg-white text-black rounded-2xl font-bold uppercase tracking-widest hover:bg-violet-100 transition-all shadow-2xl flex items-center justify-center gap-3"
                 >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <TrendingUp size={18} />}
                    Synthesize Design
                 </button>
              </div>

              <div className="p-6 bg-violet-950/10 border border-violet-500/20 rounded-2xl">
                 <div className="flex items-start gap-4">
                    <Info size={18} className="text-violet-500 shrink-0 mt-1" />
                    <p className="text-[11px] text-secondary leading-relaxed italic">
                       Calculated Oversubscription: <span className="text-primary font-bold">{oversubscription}</span> based on 512-port 400G Radix.
                    </p>
                 </div>
              </div>
           </div>
        </section>

        {/* RIGHT: ARCHITECTURAL SYNTHESIS */}
        <section className="flex-1 overflow-y-auto bg-surface-muted p-8 md:p-16 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.05)_0%,transparent_70%)] pointer-events-none"></div>
            
            <div className="max-w-4xl mx-auto space-y-12 animate-fade-in relative z-10">
               {!strategy && !loading ? (
                  <div className="h-[60vh] flex flex-col items-center justify-center text-center opacity-20">
                     <div className="relative mb-12">
                        <div className="w-32 h-32 border-2 border-dashed border-border rounded-[2.5rem] flex items-center justify-center animate-spin-slower">
                           <Layers size={48} className="text-secondary" />
                        </div>
                        <Cpu size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-secondary" />
                     </div>
                     <h3 className="text-3xl font-serif italic text-secondary">Initialize spec for architectural deconstruction</h3>
                  </div>
               ) : loading ? (
                  <div className="h-[60vh] flex flex-col items-center justify-center space-y-8">
                     <div className="relative">
                        <div className="w-24 h-24 bg-violet-500/10 rounded-full animate-pulse-slow border border-violet-500/20"></div>
                        <Loader2 size={40} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-violet-500 animate-spin" />
                     </div>
                     <div className="text-center">
                        <h4 className="font-bold text-primary uppercase tracking-[0.3em] text-sm">Synthesizing Non-Blocking Fabric</h4>
                        <p className="text-secondary text-xs mt-2 font-mono">[Reasoning-Engine: Rail-Alignment Protocol...]</p>
                     </div>
                  </div>
               ) : strategy && (
                  <div className="space-y-16 pb-20">
                     <header className="space-y-4">
                        <div className="flex items-center gap-4">
                           <span className="font-mono text-xs text-violet-500 uppercase tracking-[0.4em]">Architectural Result</span>
                           <div className="h-px bg-border flex-1"></div>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-serif font-black tracking-tighter text-primary">Fabric Design</h2>
                     </header>

                     {/* TOPOLOGY DASHBOARD */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-8 bg-card-bg border border-border rounded-[2.5rem] space-y-6 shadow-2xl group hover:border-violet-500/30 transition-all">
                           <div className="flex justify-between items-start">
                              <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                                 <Share2 size={24} />
                              </div>
                              <span className="text-[10px] font-mono text-secondary uppercase">Topology</span>
                           </div>
                           <h3 className="text-2xl font-serif font-bold text-primary leading-tight">{strategy.topology}</h3>
                           <p className="text-sm text-secondary leading-relaxed">{strategy.railAlignment}</p>
                        </div>

                        <div className="p-8 bg-card-bg border border-border rounded-[2.5rem] space-y-6 shadow-2xl group hover:border-violet-500/30 transition-all">
                           <div className="flex justify-between items-start">
                              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                 <Cpu size={24} />
                              </div>
                              <span className="text-[10px] font-mono text-secondary uppercase">Hardware</span>
                           </div>
                           <h3 className="text-2xl font-serif font-bold text-primary leading-tight">{strategy.skuRecommendation}</h3>
                           <div className="flex items-center gap-2 px-3 py-1 rounded bg-surface-muted border border-border w-fit">
                              <Zap size={10} className="text-emerald-500" />
                              <span className="text-[10px] font-mono font-bold text-emerald-500 uppercase tracking-tighter">Ratio: {strategy.oversubscriptionRatio}</span>
                           </div>
                        </div>
                     </div>

                     {/* EXECUTIVE SUMMARY */}
                     <section className="bg-card-bg border border-border rounded-[3rem] p-12 relative overflow-hidden group shadow-2xl">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Activity size={120} className="text-violet-500" /></div>
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-violet-500 mb-8 flex items-center gap-3">
                           <Sparkles size={16} /> Strategic Narrative
                        </h3>
                        <p className="text-2xl md:text-3xl text-primary font-serif leading-tight italic">
                           "{strategy.executiveSummary}"
                        </p>
                     </section>

                     {/* CAVEATS */}
                     <section className="space-y-6">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-secondary">Critical Design Caveats</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           {strategy.criticalCaveats.map((caveat, i) => (
                              <div key={i} className="p-6 bg-card-bg border border-border rounded-3xl group hover:border-rose-500/30 transition-all">
                                 <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 mb-4 group-hover:scale-110 transition-transform">
                                    <AlertTriangle size={16} />
                                 </div>
                                 <p className="text-xs text-secondary leading-relaxed font-medium">
                                    {caveat}
                                 </p>
                              </div>
                           ))}
                        </div>
                     </section>

                     {/* LOSSLESS FABRIC CONFIG */}
                     <section className="space-y-6">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-secondary flex items-center gap-2">
                           <ShieldCheck size={14} className="text-emerald-500" /> Lossless Fabric Config (RoCE v2 / PFC+ECN)
                        </h3>
                        <div className="p-6 bg-card-bg border border-border rounded-3xl space-y-4">
                           <p className="text-xs text-secondary leading-relaxed">
                             Apply these EOS snippets to all leaf and spine switches. Configure ECN to fire at ~30% of buffer to give senders time to back off before PFC PAUSE triggers at 80%.
                           </p>
                           <pre className="text-[11px] font-mono text-emerald-300 bg-surface-muted rounded-2xl p-5 overflow-x-auto leading-relaxed whitespace-pre">{connectivity === '800G' ? `! 800G RoCE v2 — Lossless Profile (7060X6 / 7800R4)
! ─────────────────────────────────────────────
! Step 1: Enable lossless queue on priority 3
qos profile ROCE-LOSSLESS
  trust dscp
  tx-queue 3
    bandwidth percent 40
    no random-detect

! Step 2: PFC on priority 3 only (never on all priorities)
priority-flow-control mode on
priority-flow-control priority 3 no-drop

! Step 3: ECN thresholds (fire BEFORE PFC)
qos profile DCQCN
  ecn minimum-threshold 200000    ! ~30% of 640MB buffer
  ecn maximum-threshold 400000    ! ~50%
  pfc threshold 600000            ! ~80%

! Step 4: Apply to every RoCE-bearing interface
interface Ethernet1/1 - 64/1
  qos trust dscp
  service-policy type qos ROCE-LOSSLESS
  priority-flow-control mode on

! Step 5: DSCP marking — map RoCE to CS3 (DSCP 24)
! Confirm with GPU vendor; H200/B200 default is DSCP 26
ip access-list ROCE-MARK
  10 permit ip any any dscp 26 set dscp cs3` : `! 400G RoCE v2 — Lossless Profile (7060X5 / 7280R3)
! ─────────────────────────────────────────────
! Step 1: Enable lossless queue on priority 3
qos profile ROCE-LOSSLESS
  trust dscp
  tx-queue 3
    bandwidth percent 40
    no random-detect

! Step 2: PFC on priority 3 only
priority-flow-control mode on
priority-flow-control priority 3 no-drop

! Step 3: ECN thresholds (ECN fires before PFC)
qos profile DCQCN
  ecn minimum-threshold 100000    ! ~30% of buffer
  ecn maximum-threshold 200000    ! ~50%
  pfc threshold 300000            ! ~80%

! Step 4: Apply to every RoCE-bearing interface
interface Ethernet1 - 32
  qos trust dscp
  service-policy type qos ROCE-LOSSLESS
  priority-flow-control mode on

! Step 5: DSCP marking — map RoCE to CS3 (DSCP 24)
ip access-list ROCE-MARK
  10 permit ip any any dscp 26 set dscp cs3`}</pre>
                           <div className="grid grid-cols-3 gap-3 text-[10px]">
                              {[
                                { label: 'PFC Priority', value: '3 (no-drop)', color: 'text-emerald-400' },
                                { label: 'ECN Trigger', value: '~30% buffer', color: 'text-blue-400' },
                                { label: 'PFC Trigger', value: '~80% buffer', color: 'text-amber-400' }
                              ].map(item => (
                                <div key={item.label} className="p-3 rounded-xl border border-border bg-surface-muted text-center">
                                  <p className="text-secondary mb-1">{item.label}</p>
                                  <p className={`font-mono font-bold ${item.color}`}>{item.value}</p>
                                </div>
                              ))}
                           </div>
                           <p className="text-[10px] text-secondary leading-relaxed">
                             Verify with: <span className="font-mono text-secondary">show qos profile</span> · <span className="font-mono text-secondary">show interfaces Ethernet1 queues</span> · <span className="font-mono text-secondary">show priority-flow-control</span>
                           </p>
                        </div>
                     </section>

                     {/* BOTTOM CTA */}
                     <div className="p-12 bg-violet-950/20 border border-violet-500/20 rounded-[3rem] text-center">
                        <h3 className="text-2xl font-serif font-bold text-primary mb-4">Validate with AVD</h3>
                        <p className="text-secondary mb-8 max-w-xl mx-auto leading-relaxed">Ready to generate the YAML blueprint for this AI cluster? Push this design to the AVD Studio for Day 0 configuration.</p>
                        <button className="px-10 py-5 bg-white text-black font-bold uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-2xl">
                           Initialize AVD Blueprint
                        </button>
                     </div>
                  </div>
               )}
            </div>
        </section>
      </main>

      {/* SYSTEM HUD */}
      <footer className="h-10 bg-page-bg border-t border-border px-8 flex items-center justify-between text-[8px] font-mono text-secondary uppercase tracking-[0.4em] shrink-0 z-20">
         <div className="flex items-center gap-4">
            <span>Arista AI Strategy Core</span>
            <span className="w-1 h-1 bg-border rounded-full"></span>
            <span className="text-violet-900">Module: FABRIC-AI-RADIX</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span>Grounding Calibration: Non-Blocking Optimized</span>
         </div>
      </footer>

    </div>
  );
};
