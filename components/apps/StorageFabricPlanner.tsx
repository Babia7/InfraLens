
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Database, HardDrive, Zap, ShieldCheck, ChevronRight, Loader2, Sparkles, Info, TrendingUp, Cpu, Network, Share2, Activity } from 'lucide-react';
import { calculateStoragePlannerOutput, DesignPreset, LatencyTier, Oversubscription, PortSpeed, Redundancy, TrafficMix } from '@/services/storagePlannerRules';
import { SectionType, StorageStrategy } from '@/types';

interface StorageFabricPlannerProps {
  onBack: () => void;
  onNavigate?: (section: SectionType) => void;
}

const DEFAULT_STRATEGY_STORAGE_KEY = 'storage_planner_default_strategy_v1';
const PROTOCOL_LAB_STORAGE_KEY = 'protocol_lab_active_id';
const DEFAULT_STRATEGY_SIGNATURE = JSON.stringify({
  protocol: 'NVMe-oF RoCE v2',
  hostCount: 32,
  latencyTier: 'Standard'
});
const DEFAULT_STRATEGY: StorageStrategy = {
  topology: 'Dual-fabric leaf-spine with lossless storage class',
  skuRecommendation: 'Dense 200G deep-buffer leafs with 400G spine uplinks',
  losslessConfig: {
    pfc: 'Enable PFC on storage class only; validate pause storm thresholds.',
    ecn: 'Enable ECN marking on storage queues to signal congestion early.',
    bufferStrategy: 'Deep buffers on ingress; monitor queue depth for bursts.'
  },
  reliabilityScore: 'High',
  businessOutcome: 'Predictable microburst absorption and stable latency for NVMe/RoCE tiers.',
  deploymentNotes: [
    'Standardize MTU end-to-end (typically 9214) for storage paths.',
    'Isolate storage traffic class and confirm QoS/traffic-class mapping.',
    'Validate optics health and queue depth during steady-state.',
    'Capture baseline counters before production cutover.'
  ]
};
const DEFAULT_INPUTS = {
  protocol: 'NVMe-oF RoCE v2',
  hostCount: 32,
  designPreset: '2-4-3-200' as DesignPreset,
  portSpeed: '200G' as PortSpeed,
  oversubscription: '2:1' as Oversubscription,
  trafficMix: 'Balanced' as TrafficMix,
  latencyTier: 'Standard' as LatencyTier,
  redundancy: 'Dual-fabric' as Redundancy
};

export const StorageFabricPlanner: React.FC<StorageFabricPlannerProps> = ({ onBack, onNavigate }) => {
  const [protocol, setProtocol] = useState('NVMe-oF RoCE v2');
  const [hostCount, setHostCount] = useState(32);
  const [designPreset, setDesignPreset] = useState<DesignPreset>('2-4-3-200');
  const [portSpeed, setPortSpeed] = useState<PortSpeed>('200G');
  const [oversubscription, setOversubscription] = useState<Oversubscription>('2:1');
  const [trafficMix, setTrafficMix] = useState<TrafficMix>('Balanced');
  const [latencyTier, setLatencyTier] = useState<LatencyTier>('Standard');
  const [redundancy, setRedundancy] = useState<Redundancy>('Dual-fabric');
  const [loading, setLoading] = useState(false);
  const [strategy, setStrategy] = useState<StorageStrategy | null>(null);
  const hasPrefetchedStrategy = useRef(false);

  const isDefaults =
    protocol === DEFAULT_INPUTS.protocol &&
    hostCount === DEFAULT_INPUTS.hostCount &&
    designPreset === DEFAULT_INPUTS.designPreset &&
    portSpeed === DEFAULT_INPUTS.portSpeed &&
    oversubscription === DEFAULT_INPUTS.oversubscription &&
    trafficMix === DEFAULT_INPUTS.trafficMix &&
    latencyTier === DEFAULT_INPUTS.latencyTier &&
    redundancy === DEFAULT_INPUTS.redundancy;

  const protocolGuardrails: Record<string, string[]> = {
    'NVMe-oF RoCE v2': [
      'Lossless class only: PFC + ECN tuned to avoid pause storms.',
      'Standardize MTU end-to-end and isolate storage traffic class.',
      'Monitor queue depth, ECN marks, and pause counters during bursts.'
    ],
    'NVMe-TCP': [
      'Prefer operational simplicity; validate TCP retransmits and host CPU.',
      'Use consistent MTU and track microburst drops on storage links.',
      'Baseline latency under load; watch for queue depth growth.'
    ],
    iSCSI: [
      'Validate jumbo frames and TCP offload support end-to-end.',
      'Confirm multipath/ALUA behavior and path failover timings.',
      'Monitor retransmits and buffer usage during backup windows.'
    ]
  };

  const runbookText = [
    'Storage Fabric Runbook',
    `Protocol: ${protocol}`,
    `Hosts: ${hostCount}`,
    `Port speed: ${portSpeed}`,
    `Oversubscription: ${oversubscription}`,
    `Latency tier: ${latencyTier}`,
    '',
    'Pre-flight checks:',
    '- Verify MTU end-to-end on storage links.',
    '- Confirm QoS/traffic class mapping for storage queues.',
    '- Validate PFC + ECN on storage class only (RoCE v2).',
    '- Check queue depth trends and pause counters under burst.',
    '- Capture baseline counters before production cutover.'
  ].join('\n');

  const buildLocalStrategy = (): StorageStrategy => {
    const topology = redundancy === 'Single-fabric'
      ? 'Single-fabric leaf-spine with storage traffic class isolation'
      : 'Dual-fabric leaf-spine with lossless storage class';
    const skuRecommendation = latencyTier === 'Ultra-low'
      ? 'Low-latency X-series leafs with 400G spine uplinks'
      : 'Deep-buffer R-series leafs with 400G spine uplinks';
    const losslessConfig = protocol === 'NVMe-oF RoCE v2'
      ? {
          pfc: 'Enable PFC on storage class only; validate pause storm thresholds.',
          ecn: 'Enable ECN marking on storage queues to signal congestion early.',
          bufferStrategy: 'Deep buffers on ingress; monitor queue depth for bursts.'
        }
      : {
          pfc: 'PFC not required; rely on TCP backpressure and queue monitoring.',
          ecn: 'Enable ECN if supported for early congestion signals.',
          bufferStrategy: 'Balance shallow buffers with active queue monitoring.'
        };
    const deploymentNotes = [
      'Standardize MTU end-to-end (typically 9214) for storage paths.',
      'Isolate storage traffic class and confirm QoS/traffic-class mapping.',
      'Validate optics health and queue depth during steady-state.',
      'Capture baseline counters before production cutover.'
    ];
    return {
      topology,
      skuRecommendation,
      losslessConfig,
      reliabilityScore: latencyTier === 'Ultra-low' ? 'High' : 'Moderate',
      businessOutcome: `Predictable performance for ${protocol} with ${latencyTier.toLowerCase()} latency targets.`,
      deploymentNotes
    };
  };

  const handlePlan = () => {
    setLoading(true);
    const local = buildLocalStrategy();
    window.setTimeout(() => {
      setStrategy(local);
      setLoading(false);
    }, 250);
  };

  useEffect(() => {
    if (hasPrefetchedStrategy.current) return;
    hasPrefetchedStrategy.current = true;
    try {
      const saved = localStorage.getItem(DEFAULT_STRATEGY_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as { signature: string; strategy: StorageStrategy };
        if (parsed?.signature === DEFAULT_STRATEGY_SIGNATURE && parsed.strategy) {
          setStrategy(parsed.strategy);
          return;
        }
      }
    } catch {
      // Ignore storage errors and fall back to defaults.
    }
    setStrategy(DEFAULT_STRATEGY);
    try {
      localStorage.setItem(
        DEFAULT_STRATEGY_STORAGE_KEY,
        JSON.stringify({ signature: DEFAULT_STRATEGY_SIGNATURE, strategy: DEFAULT_STRATEGY })
      );
    } catch {
      // Ignore storage errors.
    }
  }, []);

  const plannerOutput = calculateStoragePlannerOutput({
    designPreset,
    portSpeed,
    hostCount,
    protocol,
    oversubscription,
    trafficMix,
    latencyTier,
    redundancy
  });

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
                    <Database size={20} />
                </div>
                <div>
                    <h1 className="text-sm font-bold uppercase tracking-wider">Storage Fabric Planner</h1>
                    <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Lossless Fabric v2.1</span>
                </div>
            </div>
        </div>
        <div className="flex items-center gap-4">
           <div className="bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
              <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">Lossless State: OK</span>
           </div>
           {!isDefaults && (
             <div className="bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
               <span className="text-[9px] font-mono text-amber-300 uppercase tracking-widest">Defaults changed</span>
             </div>
           )}
           {onNavigate && (
             <button
               onClick={() => onNavigate(SectionType.STORAGE_FABRIC_PLANNER_ABOUT)}
               className="px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors flex items-center gap-2"
               aria-label="Open storage planner methodology"
             >
               <Info size={12} /> About
             </button>
           )}
        </div>
      </header>

      {/* WORKSPACE */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* LEFT: PARAMETERS */}
        <section className="w-full md:w-[400px] bg-zinc-950 border-r border-zinc-900 flex flex-col shrink-0 relative overflow-y-auto">
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
           
           <div className="p-8 md:p-10 relative z-10 space-y-12">
              <header className="space-y-4">
                 <h2 className="text-4xl font-serif font-bold text-white tracking-tighter">Fabric Spec</h2>
                 <p className="text-sm text-zinc-500 leading-relaxed">Define storage requirements to synthesize a validated Ethernet Storage Fabric.</p>
              </header>

              <div className="space-y-6">
                 <div className="space-y-3">
                    <label className="text-[10px] font-mono font-bold uppercase text-zinc-600 tracking-widest">Storage Protocol</label>
                    <div className="grid grid-cols-1 gap-2">
                       {['NVMe-oF RoCE v2', 'NVMe-TCP', 'iSCSI'].map(val => (
                          <button 
                             key={val}
                             onClick={() => setProtocol(val)}
                             className={`p-4 rounded-xl border text-xs font-bold transition-all text-left flex justify-between items-center ${protocol === val ? 'bg-blue-900/20 border-blue-500 text-blue-400 shadow-lg shadow-blue-500/10' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
                          >
                             {val}
                             {protocol === val && <ChevronRight size={14} />}
                          </button>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-3">
                    <label className="text-[10px] font-mono font-bold uppercase text-zinc-600 tracking-widest">Design Preset</label>
                    <select
                      value={designPreset}
                      onChange={(e) => setDesignPreset(e.target.value as DesignPreset)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-sm outline-none focus:border-blue-500 transition-colors"
                    >
                       <option value="2-4-3-200">2-4-3-200 (200G per host)</option>
                       <option value="2-8-5-200">2-8-5-200 (200G per host)</option>
                       <option value="2-8-9-400">2-8-9-400 (400G per host)</option>
                    </select>
                 </div>

                 <div className="space-y-3">
                    <label className="text-[10px] font-mono font-bold uppercase text-zinc-600 tracking-widest">Port Speed</label>
                    <select
                      value={portSpeed}
                      onChange={(e) => setPortSpeed(e.target.value as PortSpeed)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-sm outline-none focus:border-blue-500 transition-colors"
                    >
                       <option value="200G">200G Ethernet</option>
                       <option value="400G">400G Ethernet</option>
                    </select>
                 </div>

                 <div className="space-y-3">
                    <label className="text-[10px] font-mono font-bold uppercase text-zinc-600 tracking-widest">Host Count</label>
                    <input
                       type="range" min="8" max="512" step="8"
                       value={hostCount}
                       onChange={(e) => setHostCount(parseInt(e.target.value))}
                       className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <div className="flex justify-between text-2xl font-serif font-bold text-white">
                       <span>{hostCount}</span>
                       <span className="text-xs font-mono text-zinc-600 self-end">Hosts</span>
                    </div>
                 </div>

                 <div className="space-y-3">
                    <label className="text-[10px] font-mono font-bold uppercase text-zinc-600 tracking-widest">Oversubscription Target</label>
                    <select
                      value={oversubscription}
                      onChange={(e) => setOversubscription(e.target.value as Oversubscription)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-sm outline-none focus:border-blue-500 transition-colors"
                    >
                       <option value="1:1">1:1 (Lossless)</option>
                       <option value="2:1">2:1 (Balanced)</option>
                       <option value="3:1">3:1 (Optimized)</option>
                    </select>
                 </div>

                 <div className="space-y-3">
                    <label className="text-[10px] font-mono font-bold uppercase text-zinc-600 tracking-widest">Traffic Mix</label>
                    <select
                      value={trafficMix}
                      onChange={(e) => setTrafficMix(e.target.value as TrafficMix)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-sm outline-none focus:border-blue-500 transition-colors"
                    >
                       <option value="Balanced">Balanced</option>
                       <option value="E-W heavy">E-W heavy</option>
                       <option value="N-S heavy">N-S heavy</option>
                    </select>
                 </div>

                 <div className="space-y-3">
                    <label className="text-[10px] font-mono font-bold uppercase text-zinc-600 tracking-widest">Latency Tier</label>
                    <select
                      value={latencyTier}
                      onChange={(e) => setLatencyTier(e.target.value as LatencyTier)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-sm outline-none focus:border-blue-500 transition-colors"
                    >
                       <option value="Standard">Standard</option>
                       <option value="Ultra-low">Ultra-low</option>
                    </select>
                 </div>

                 <div className="space-y-3">
                    <label className="text-[10px] font-mono font-bold uppercase text-zinc-600 tracking-widest">Redundancy</label>
                    <select
                      value={redundancy}
                      onChange={(e) => setRedundancy(e.target.value as Redundancy)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-sm outline-none focus:border-blue-500 transition-colors"
                    >
                       <option value="Dual-fabric">Dual-fabric</option>
                       <option value="Single-fabric">Single-fabric</option>
                    </select>
                 </div>
              </div>

              <div className="pt-6 border-t border-zinc-900">
                 <button 
                   onClick={handlePlan}
                   disabled={loading}
                   className="w-full py-4 bg-white text-black rounded-2xl font-bold uppercase tracking-widest hover:bg-blue-50 transition-all shadow-2xl flex items-center justify-center gap-3"
                 >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <TrendingUp size={18} />}
                    Synthesize Planner
                 </button>
              </div>

              <div className="p-6 bg-blue-950/10 border border-blue-500/20 rounded-2xl">
                 <div className="flex items-start gap-4">
                    <Info size={18} className="text-blue-500 shrink-0 mt-1" />
                    <p className="text-[11px] text-zinc-400 leading-relaxed italic">
                       Calculated Buffer Requirement: <span className="text-white font-bold">{latencyTier === 'Ultra-low' ? '32GB (Deep Buffer)' : '16GB (Universal)'}</span> based on congestion profile.
                    </p>
                 </div>
              </div>

              <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-3">
                 <div className="flex items-center justify-between gap-3">
                    <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">NVMe-oF Protocol Lab Notes</div>
                    {onNavigate && (
                      <button
                        onClick={() => {
                          try {
                            localStorage.setItem(PROTOCOL_LAB_STORAGE_KEY, 'NVMe-oF');
                          } catch {
                            // Ignore storage errors.
                          }
                          onNavigate(SectionType.PROTOCOLS);
                        }}
                        className="text-[10px] font-mono uppercase tracking-[0.3em] text-blue-400 hover:text-white transition-colors"
                      >
                        Protocol Lab →
                      </button>
                    )}
                 </div>
                 <ul className="text-xs text-zinc-400 space-y-2 list-disc list-inside">
                    <li>Choose transport by SLA: RoCE v2 for microsecond latency, NVMe/TCP for simpler ops.</li>
                    <li>Lossless guardrails: MTU end-to-end, storage traffic class isolation, PFC + ECN tuned.</li>
                    <li>Validate queues and pause storms with `show queue-monitor length detail` and interface counters.</li>
                 </ul>
                 <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-600">Protocol guardrails</div>
                 <ul className="text-xs text-zinc-400 space-y-2 list-disc list-inside">
                    {(protocolGuardrails[protocol] || protocolGuardrails['NVMe-oF RoCE v2']).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                 </ul>
              </div>
           </div>
        </section>

        {/* RIGHT: ARCHITECTURAL SYNTHESIS */}
        <section className="flex-1 overflow-y-auto bg-black p-8 md:p-16 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)] pointer-events-none"></div>
            
            <div className="max-w-5xl mx-auto space-y-12 animate-fade-in relative z-10">
               <section className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-10 shadow-2xl">
                  <div className="flex items-center gap-3 mb-8">
                     <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                        <Network size={20} />
                     </div>
                     <div>
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em] block">Arista Fabric Sizing</span>
                        <h3 className="text-2xl font-serif font-bold text-white">Port Map & Platform</h3>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                     <div className="p-4 bg-black border border-zinc-800 rounded-2xl">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Assumptions</span>
                        <div className="mt-2 space-y-1 text-xs text-zinc-500">
                          <div>Protocol: {protocol}</div>
                          <div>Preset: {designPreset}</div>
                          <div>Hosts: {hostCount}</div>
                        </div>
                     </div>
                     <div className="p-4 bg-black border border-zinc-800 rounded-2xl">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Fabric Targets</span>
                        <div className="mt-2 space-y-1 text-xs text-zinc-500">
                          <div>Port speed: {portSpeed}</div>
                          <div>Oversub: {oversubscription}</div>
                          <div>Latency: {latencyTier}</div>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div className="p-4 bg-black border border-zinc-800 rounded-2xl">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Topology</span>
                        <p className="text-lg text-white font-semibold mt-2">{plannerOutput.topology}</p>
                        <p className="text-xs text-zinc-500 mt-2">{plannerOutput.fabricSplit}</p>
                     </div>
                     <div className="p-4 bg-black border border-zinc-800 rounded-2xl">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Platform Class</span>
                        <p className="text-lg text-white font-semibold mt-2">{plannerOutput.platform.model}</p>
                        <p className="text-xs text-zinc-500 mt-2">{plannerOutput.platform.rationale}</p>
                     </div>
                     <div className="p-4 bg-black border border-zinc-800 rounded-2xl">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Port Plan</span>
                        <p className="text-lg text-white font-semibold mt-2">{plannerOutput.portPlan.portSpeedGb}G x {plannerOutput.portPlan.hostPortsPerNode}</p>
                        <p className="text-xs text-zinc-500 mt-2">Per host bandwidth: {plannerOutput.portPlan.perHostBandwidthGb}G</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                     <div className="p-4 bg-black border border-zinc-800 rounded-2xl">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Scalable Units</span>
                        <p className="text-xl text-white font-semibold mt-2">{plannerOutput.portPlan.suCount}</p>
                        <p className="text-xs text-zinc-500 mt-2">{hostCount} total hosts</p>
                     </div>
                     <div className="p-4 bg-black border border-zinc-800 rounded-2xl">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Leaf Ports</span>
                        <p className="text-xl text-white font-semibold mt-2">{plannerOutput.portPlan.leafPortsRequired}</p>
                        <p className="text-xs text-zinc-500 mt-2">Spine uplinks: {plannerOutput.portPlan.spineUplinksRequired}</p>
                     </div>
                     <div className="p-4 bg-black border border-zinc-800 rounded-2xl">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Aggregate Bandwidth</span>
                        <p className="text-xl text-white font-semibold mt-2">{plannerOutput.portPlan.totalHostBandwidthGb}G</p>
                        <p className="text-xs text-zinc-500 mt-2">Oversubscription: {plannerOutput.portPlan.oversubscription}</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                     <div className="p-4 bg-black border border-zinc-800 rounded-2xl">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Lossless Profile</span>
                        <p className="text-xs text-zinc-500 mt-2">{plannerOutput.losslessProfile.pfc}</p>
                        <p className="text-xs text-zinc-500 mt-2">{plannerOutput.losslessProfile.ecn}</p>
                        <p className="text-xs text-zinc-500 mt-2">{plannerOutput.losslessProfile.mtu}</p>
                     </div>
                     <div className="p-4 bg-black border border-zinc-800 rounded-2xl">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Validation Flags</span>
                        {plannerOutput.validationFlags.length === 0 ? (
                          <p className="text-xs text-zinc-500 mt-2">No flags for this configuration.</p>
                        ) : (
                          <ul className="text-xs text-zinc-500 mt-2 space-y-2 list-disc list-inside">
                             {plannerOutput.validationFlags.map((flag) => (
                               <li key={flag}>{flag}</li>
                             ))}
                          </ul>
                        )}
                     </div>
                  </div>
               </section>

               {!strategy && !loading ? (
                  <div className="h-[40vh] flex flex-col items-center justify-center text-center opacity-20">
                     <div className="relative mb-8">
                        <div className="w-24 h-24 border-2 border-dashed border-zinc-800 rounded-[2rem] flex items-center justify-center animate-spin-slower">
                           <HardDrive size={40} className="text-zinc-600" />
                        </div>
                        <Database size={20} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-zinc-400" />
                     </div>
                     <h3 className="text-2xl font-serif italic text-zinc-500">Synthesize strategy for narrative output</h3>
                  </div>
               ) : loading ? (
                  <div className="h-[40vh] flex flex-col items-center justify-center space-y-8">
                     <div className="relative">
                        <div className="w-24 h-24 bg-blue-500/10 rounded-full animate-pulse-slow border border-blue-500/20"></div>
                        <Loader2 size={40} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500 animate-spin" />
                     </div>
                     <div className="text-center">
                        <h4 className="font-bold text-white uppercase tracking-[0.3em] text-sm">Synthesizing Storage Strategy</h4>
                        <p className="text-zinc-500 text-xs mt-2 font-mono">[Reasoning-Engine: Calibrating Lossless Profile...]</p>
                     </div>
                  </div>
               ) : strategy && (
                  <div className="space-y-16 pb-20">
                     <header className="space-y-4">
                        <div className="flex items-center gap-4">
                           <span className="font-mono text-xs text-blue-500 uppercase tracking-[0.4em]">Fabric Result</span>
                           <div className="h-px bg-zinc-800 flex-1"></div>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-serif font-black tracking-tighter text-white">Lossless Design</h2>
                     </header>

                     {/* TOPOLOGY DASHBOARD */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] space-y-6 shadow-2xl group hover:border-blue-500/30 transition-all">
                           <div className="flex justify-between items-start">
                              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                                 <Share2 size={24} />
                              </div>
                              <span className="text-[10px] font-mono text-zinc-600 uppercase">Topology</span>
                           </div>
                           <h3 className="text-2xl font-serif font-bold text-white leading-tight">{strategy.topology}</h3>
                           <div className="flex items-center gap-2 px-3 py-1 rounded bg-black border border-zinc-800 w-fit">
                              <ShieldCheck size={10} className="text-emerald-500" />
                              <span className="text-[10px] font-mono font-bold text-emerald-500 uppercase tracking-tighter">Reliability: {strategy.reliabilityScore}</span>
                           </div>
                        </div>

                        <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] space-y-6 shadow-2xl group hover:border-blue-500/30 transition-all">
                           <div className="flex justify-between items-start">
                              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                                 <Cpu size={24} />
                              </div>
                              <span className="text-[10px] font-mono text-zinc-600 uppercase">Hardware</span>
                           </div>
                           <h3 className="text-2xl font-serif font-bold text-white leading-tight">{strategy.skuRecommendation}</h3>
                           <p className="text-sm text-zinc-500 leading-relaxed">Optimal ASIC selection for {protocol} buffer requirements.</p>
                        </div>
                     </div>

                     {/* LOSSLESS CORE */}
                    <section className="bg-zinc-900 border border-zinc-800 rounded-[3rem] p-12 relative overflow-hidden group shadow-2xl">
                       <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Activity size={120} className="text-blue-500" /></div>
                       <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-500 mb-8 flex items-center gap-3">
                          <Zap size={16} /> Lossless Configuration
                       </h3>
                       <div className="flex justify-end mb-6">
                          <button
                            onClick={() => navigator.clipboard.writeText(runbookText)}
                            className="px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-[10px] font-mono uppercase tracking-[0.3em] text-blue-300 hover:text-white hover:border-blue-400 transition"
                          >
                            Copy runbook
                          </button>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                           <div className="space-y-2">
                              <span className="text-[10px] font-mono text-zinc-500 uppercase">PFC (Priority Flow Control)</span>
                              <p className="text-lg text-white font-medium">{strategy.losslessConfig.pfc}</p>
                           </div>
                           <div className="space-y-2">
                              <span className="text-[10px] font-mono text-zinc-500 uppercase">ECN (Congestion Notification)</span>
                              <p className="text-lg text-white font-medium">{strategy.losslessConfig.ecn}</p>
                           </div>
                           <div className="space-y-2">
                              <span className="text-[10px] font-mono text-zinc-500 uppercase">Buffer Strategy</span>
                              <p className="text-lg text-white font-medium">{strategy.losslessConfig.bufferStrategy}</p>
                           </div>
                        </div>
                     </section>

                     {/* OUTCOME SUMMARY */}
                     <section className="space-y-6">
                        <div className="p-10 bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-[3rem] shadow-2xl">
                           <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-emerald-500 mb-6 flex items-center gap-3">
                              <Sparkles size={16} /> Strategic Outcome
                           </h3>
                           <p className="text-3xl text-zinc-100 font-serif leading-tight italic">
                              "{strategy.businessOutcome}"
                           </p>
                        </div>
                     </section>

                     {/* DEPLOYMENT NOTES */}
                     <section className="space-y-6">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Critical Deployment Notes</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {strategy.deploymentNotes.map((note, i) => (
                              <div key={i} className="p-6 bg-zinc-900 border border-zinc-800 rounded-3xl group hover:border-blue-500/30 transition-all flex items-start gap-4">
                                 <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0 group-hover:scale-125 transition-transform"></div>
                                 <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                                    {note}
                                 </p>
                              </div>
                           ))}
                        </div>
                     </section>

                     {/* BOTTOM CTA */}
                     <div className="p-12 bg-blue-950/20 border border-blue-500/20 rounded-[3rem] text-center">
                        <h3 className="text-2xl font-serif font-bold text-white mb-4">Export Validated Blueprint</h3>
                        <p className="text-zinc-500 mb-8 max-w-xl mx-auto leading-relaxed">Generate the EOS CLI and AVD parameters for this lossless storage fabric.</p>
                        <button className="px-10 py-5 bg-white text-black font-bold uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-2xl">
                           Synthesize CLI Config
                        </button>
                     </div>
                  </div>
               )}
            </div>
        </section>
      </main>

      {/* SYSTEM HUD */}
      <footer className="h-10 bg-zinc-950 border-t border-zinc-900 px-8 flex items-center justify-between text-[8px] font-mono text-zinc-600 uppercase tracking-[0.4em] shrink-0 z-20">
         <div className="flex items-center gap-4">
            <span>Arista Storage Intelligence</span>
            <span className="w-1 h-1 bg-zinc-800 rounded-full"></span>
            <span className="text-blue-900">Module: ESF-PLANNER-01</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
            <span>Fabric Grounding: Verified</span>
         </div>
      </footer>

    </div>
  );
};
