import React, { useState, useMemo } from 'react';
import { ArrowLeft, Calculator, TrendingUp, Server, AlertTriangle, ChevronRight, Info } from 'lucide-react';

interface AIFabricPortMathProps {
  onBack: () => void;
}

interface PortMathResult {
  nodeCount: number;
  hostPortsPerPlane: number;
  leafDownlinks: number;
  leafUplinks: number;
  leafCountPerPlane: number;
  spineCountPerPlane: number;
  actualOversubscription: string;
  totalLeaves: number;
  totalSpines: number;
  platformRecommendation: string;
  growthPath: string;
  warnings: string[];
}

export const AIFabricPortMath: React.FC<AIFabricPortMathProps> = ({ onBack }) => {
  const [gpuCount, setGpuCount] = useState(1024);
  const [gpusPerNode, setGpusPerNode] = useState(8);
  const [nicsPerNode, setNicsPerNode] = useState(2);
  const [linkSpeed, setLinkSpeed] = useState('400G');
  const [planes, setPlanes] = useState(2);
  const [switchRadix, setSwitchRadix] = useState(64);
  const [targetOversubRatio, setTargetOversubRatio] = useState(1);
  const [growthTarget, setGrowthTarget] = useState(2);

  const result = useMemo<PortMathResult>(() => {
    const nodeCount = Math.ceil(gpuCount / gpusPerNode);
    const nicsPerPlane = nicsPerNode / planes;
    const hostPortsPerPlane = Math.ceil(nodeCount * nicsPerPlane);

    // Leaf port split based on target oversubscription
    const uplinkFraction = 1 / (targetOversubRatio + 1);
    const leafUplinks = Math.floor(switchRadix * uplinkFraction);
    const leafDownlinks = switchRadix - leafUplinks;

    // Leaf count
    const leafCountPerPlane = Math.ceil(hostPortsPerPlane / leafDownlinks);

    // Spine count: each leaf needs a unique port on each spine
    // With leafUplinks distributed across spines, need enough spine ports
    const spineCountPerPlane = Math.max(2, leafUplinks); // Min 2 for redundancy
    // Each spine must have enough ports for all leaves
    // If leafUplinks = 32 and leafCount = 16 → 32 spines × 1 uplink per leaf = 32 spines
    // Simplified: spine count = leafUplinks (each leaf has 1 port per spine)
    const effectiveSpineCount = Math.min(leafUplinks, Math.ceil(leafUplinks * leafCountPerPlane / switchRadix));
    const spineCountFinal = Math.max(2, effectiveSpineCount);

    const actualOversub = leafDownlinks / leafUplinks;
    const actualOversubStr = actualOversub <= 1.05
      ? '1:1 (Non-Blocking)'
      : actualOversub <= 1.6
        ? `${actualOversub.toFixed(1)}:1 (Slight)`
        : `${actualOversub.toFixed(1)}:1 (Oversubscribed)`;

    const totalLeaves = leafCountPerPlane * planes;
    const totalSpines = spineCountFinal * planes;

    // Platform recommendation
    let platformRecommendation = '';
    if (spineCountFinal <= 8) {
      platformRecommendation = `Fixed switches viable throughout. Leaf: 7060DX5-64S (${linkSpeed} Strata, DLB-capable). Spine: 7060DX5-64S or 7280R3A.`;
    } else if (spineCountFinal <= 16) {
      platformRecommendation = `Fixed spine count is manageable but approaching density threshold. Evaluate 7800R4 modular spine for consolidation. Leaf: 7060DX5-64S (Strata, DLB).`;
    } else {
      platformRecommendation = `Spine count exceeds fixed-switch density sweet spot. Strongly evaluate 7800R4 modular AI spine. Leaf: 7060DX5-64S (Strata, DLB). Each 7800R4 line card provides high port density.`;
    }

    // Growth path
    const growthGpuCount = gpuCount * growthTarget;
    const growthNodeCount = Math.ceil(growthGpuCount / gpusPerNode);
    const growthHostPorts = Math.ceil(growthNodeCount * nicsPerPlane);
    const growthLeafCount = Math.ceil(growthHostPorts / leafDownlinks);
    const growthPath = `At ${growthGpuCount.toLocaleString()} GPUs (${growthTarget}× growth): ${growthLeafCount} leaves/plane (vs ${leafCountPerPlane} today). ${
      growthLeafCount > leafCountPerPlane * 1.5
        ? 'Spine uplink slots may be exhausted — evaluate spine upgrade at this scale.'
        : 'Within current spine capacity — add leaves without spine changes.'
    }`;

    // Warnings
    const warnings: string[] = [];
    if (nicsPerNode > planes * 2) {
      warnings.push(`${nicsPerNode} NICs/node with ${planes} planes: verify NIC-to-plane rail alignment before finalizing.`);
    }
    if (actualOversub > 2) {
      warnings.push(`Oversubscription ${actualOversub.toFixed(1)}:1 exceeds recommended 2:1 for AI fabrics — reduce downlinks or add planes.`);
    }
    if (spineCountFinal > 24) {
      warnings.push(`${spineCountFinal} spines/plane: fixed-switch cabling complexity is high — modular spine chassis strongly recommended.`);
    }
    if (leafUplinks < 8) {
      warnings.push(`Only ${leafUplinks} spine uplinks per leaf — limited path diversity. Consider higher target oversubscription or larger switch radix.`);
    }

    return {
      nodeCount,
      hostPortsPerPlane,
      leafDownlinks,
      leafUplinks,
      leafCountPerPlane,
      spineCountPerPlane: spineCountFinal,
      actualOversubscription: actualOversubStr,
      totalLeaves,
      totalSpines,
      platformRecommendation,
      growthPath,
      warnings
    };
  }, [gpuCount, gpusPerNode, nicsPerNode, linkSpeed, planes, switchRadix, targetOversubRatio, growthTarget]);

  const inputClass = "w-full bg-card-bg border border-border rounded-xl px-3 py-2 text-sm text-primary focus:outline-none focus:border-violet-400/60 transition";
  const labelClass = "text-[10px] font-mono text-secondary uppercase tracking-widest mb-1 block";

  return (
    <div className="min-h-screen bg-page-bg text-primary font-sans flex flex-col">
      <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-card-bg/80 backdrop-blur z-20">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="group p-2 text-secondary hover:text-primary transition-colors">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-500/10 border border-violet-500/30 rounded-lg text-violet-400">
              <Calculator size={18} />
            </div>
            <div>
              <h1 className="font-serif font-bold text-lg tracking-tight leading-none">Port Math Calculator</h1>
              <span className="text-[10px] font-mono text-secondary uppercase tracking-widest mt-1 block">AI Fabric Sizing · Vault: Port Math Worksheet</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-10 grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Inputs */}
        <section className="lg:col-span-2 space-y-5">
          <div className="p-5 rounded-3xl border border-border bg-card-bg">
            <p className="text-[10px] font-mono text-secondary uppercase tracking-widest mb-4">Cluster Inputs</p>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>GPU Count (Total Cluster)</label>
                <input
                  type="number"
                  className={inputClass}
                  value={gpuCount}
                  min={8} max={32768} step={64}
                  onChange={(e) => setGpuCount(Number(e.target.value))}
                />
              </div>
              <div>
                <label className={labelClass}>GPUs per Node</label>
                <select className={inputClass} value={gpusPerNode} onChange={(e) => setGpusPerNode(Number(e.target.value))}>
                  {[4, 8, 16].map(n => <option key={n} value={n}>{n} GPUs/node</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Cluster-Facing NICs per Node</label>
                <select className={inputClass} value={nicsPerNode} onChange={(e) => setNicsPerNode(Number(e.target.value))}>
                  <option value={1}>1 NIC (single-rail)</option>
                  <option value={2}>2 NICs (dual-rail)</option>
                  <option value={4}>4 NICs</option>
                  <option value={8}>8 NICs (DGX H100/H200 style)</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Link Speed per NIC</label>
                <select className={inputClass} value={linkSpeed} onChange={(e) => setLinkSpeed(e.target.value)}>
                  <option value="100G">100G</option>
                  <option value="400G">400G</option>
                  <option value="800G">800G</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Fabric Planes (Rail Count)</label>
                <select className={inputClass} value={planes} onChange={(e) => setPlanes(Number(e.target.value))}>
                  <option value={1}>1 plane (single-rail)</option>
                  <option value={2}>2 planes (dual-rail)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-3xl border border-border bg-card-bg">
            <p className="text-[10px] font-mono text-secondary uppercase tracking-widest mb-4">Switch Parameters</p>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Switch Radix (Total Ports)</label>
                <select className={inputClass} value={switchRadix} onChange={(e) => setSwitchRadix(Number(e.target.value))}>
                  <option value={32}>32-port</option>
                  <option value={48}>48-port</option>
                  <option value={64}>64-port (7060DX5-64S)</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Target Oversubscription</label>
                <select className={inputClass} value={targetOversubRatio} onChange={(e) => setTargetOversubRatio(Number(e.target.value))}>
                  <option value={1}>1:1 (Non-Blocking)</option>
                  <option value={1.5}>1.5:1</option>
                  <option value={2}>2:1</option>
                  <option value={3}>3:1</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Growth Target (× current GPU count)</label>
                <select className={inputClass} value={growthTarget} onChange={(e) => setGrowthTarget(Number(e.target.value))}>
                  <option value={2}>2× (18-month target)</option>
                  <option value={4}>4×</option>
                  <option value={8}>8×</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="lg:col-span-3 space-y-4">
          {result.warnings.length > 0 && (
            <div className="p-4 rounded-2xl border border-amber-400/30 bg-amber-500/5">
              <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-widest text-amber-400">
                <AlertTriangle size={14} /> Design Warnings
              </div>
              {result.warnings.map((w) => (
                <p key={w} className="text-sm text-amber-300/80 leading-relaxed mb-1">· {w}</p>
              ))}
            </div>
          )}

          {/* Key numbers */}
          <div className="p-6 rounded-3xl border border-border bg-card-bg">
            <p className="text-[10px] font-mono text-secondary uppercase tracking-widest mb-4">Calculation Results</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Node Count', value: result.nodeCount.toLocaleString() },
                { label: 'Host Ports / Plane', value: result.hostPortsPerPlane.toLocaleString() },
                { label: 'Leaf Downlinks', value: result.leafDownlinks },
                { label: 'Leaf Uplinks', value: result.leafUplinks },
                { label: 'Leaves / Plane', value: result.leafCountPerPlane },
                { label: 'Spines / Plane', value: result.spineCountPerPlane },
              ].map(({ label, value }) => (
                <div key={label} className="p-3 rounded-xl border border-border bg-card-bg/50 text-center">
                  <div className="text-2xl font-bold text-primary">{value}</div>
                  <div className="text-[10px] font-mono text-secondary uppercase tracking-widest mt-1">{label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl border border-violet-400/30 bg-violet-500/5 text-center">
                <div className="text-lg font-bold text-violet-400">{result.totalLeaves}</div>
                <div className="text-[10px] font-mono text-secondary uppercase tracking-widest mt-1">Total Leaves ({planes} planes)</div>
              </div>
              <div className="p-3 rounded-xl border border-blue-400/30 bg-blue-500/5 text-center">
                <div className="text-lg font-bold text-blue-400">{result.totalSpines}</div>
                <div className="text-[10px] font-mono text-secondary uppercase tracking-widest mt-1">Total Spines ({planes} planes)</div>
              </div>
              <div className="p-3 rounded-xl border border-emerald-400/30 bg-emerald-500/5 text-center">
                <div className="text-xs font-bold text-emerald-400">{result.actualOversubscription}</div>
                <div className="text-[10px] font-mono text-secondary uppercase tracking-widest mt-1">Actual Oversubscription</div>
              </div>
            </div>
          </div>

          {/* Calculation trace */}
          <div className="p-5 rounded-2xl border border-border bg-card-bg/70">
            <p className="text-[10px] font-mono text-secondary uppercase tracking-widest mb-3">Calculation Trace</p>
            <div className="space-y-2 font-mono text-xs text-secondary">
              <div className="flex items-center gap-2">
                <ChevronRight size={12} className="text-violet-400" />
                <span>Node count = {gpuCount.toLocaleString()} GPUs ÷ {gpusPerNode} GPUs/node = <span className="text-primary font-bold">{result.nodeCount}</span> nodes</span>
              </div>
              <div className="flex items-center gap-2">
                <ChevronRight size={12} className="text-violet-400" />
                <span>Host ports/plane = {result.nodeCount} nodes × ({nicsPerNode} NICs ÷ {planes} planes) = <span className="text-primary font-bold">{result.hostPortsPerPlane}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <ChevronRight size={12} className="text-violet-400" />
                <span>Leaf port split ({targetOversubRatio}:1): <span className="text-primary font-bold">{result.leafDownlinks}</span> down + <span className="text-primary font-bold">{result.leafUplinks}</span> up = {switchRadix} total</span>
              </div>
              <div className="flex items-center gap-2">
                <ChevronRight size={12} className="text-violet-400" />
                <span>Leaf count/plane = ⌈{result.hostPortsPerPlane} ÷ {result.leafDownlinks}⌉ = <span className="text-primary font-bold">{result.leafCountPerPlane}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <ChevronRight size={12} className="text-violet-400" />
                <span>Spine count/plane = <span className="text-primary font-bold">{result.spineCountPerPlane}</span> (min 2 for redundancy)</span>
              </div>
            </div>
          </div>

          {/* Platform recommendation */}
          <div className="p-5 rounded-2xl border border-border bg-card-bg/70">
            <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-widest text-secondary">
              <Server size={14} className="text-violet-400" /> Platform Recommendation
            </div>
            <p className="text-sm text-secondary leading-relaxed">{result.platformRecommendation}</p>
          </div>

          {/* Growth path */}
          <div className="p-5 rounded-2xl border border-border bg-card-bg/70">
            <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-widest text-secondary">
              <TrendingUp size={14} className="text-emerald-400" /> Growth Path ({growthTarget}× GPUs)
            </div>
            <p className="text-sm text-secondary leading-relaxed">{result.growthPath}</p>
          </div>

          <div className="p-4 rounded-2xl border border-border bg-card-bg/40">
            <div className="flex items-start gap-2">
              <Info size={14} className="text-secondary mt-0.5 shrink-0" />
              <p className="text-xs text-secondary leading-relaxed">
                <span className="font-bold text-primary">Node model first:</span> always confirm the exact NIC count and link speed per node before finalizing. DGX H100/H200 systems expose 8×400G cluster-facing links per node — this changes port math significantly vs a generic 2×400G server. Vault ref: GPU Node NIC and Port Math for AI Fabrics.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
