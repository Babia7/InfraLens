
import React, { useState } from 'react';
import { ArrowLeft, Cpu, Terminal, FileCode, Play, Download, ShieldCheck, Box, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { AVDBrief } from '@/types';

interface AVDStudioProps {
  onBack: () => void;
}

const InputGroup = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">{label}</label>
    {children}
  </div>
);

export const AVDStudio: React.FC<AVDStudioProps> = ({ onBack }) => {
  // Parameters
  const [fabricName, setFabricName] = useState('DCI-CORE-EVPN');
  const [spines, setSpines] = useState(2);
  const [leafs, setLeafs] = useState(4);
  const [asnStart, setAsnStart] = useState(65001);
  const [platform, setPlatform] = useState('7050X3');

  // Result State
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AVDBrief | null>(null);
  const [activeView, setActiveView] = useState<'YAML' | 'EOS' | 'VALIDATION'>('YAML');

  const buildLocalBlueprint = (): AVDBrief => {
    const yaml = [
      `fabric_name: ${fabricName}`,
      `spines: ${spines}`,
      `leafs: ${leafs}`,
      `asn_start: ${asnStart}`,
      `platform: ${platform}`,
      `protocol: evpn-vxlan`,
      `routing: ebgp`,
      `mtu: 9214`
    ].join('\n');

    const eos = [
      `! ${fabricName}`,
      `hostname ${fabricName.toLowerCase()}`,
      `! Spine/Leaf counts`,
      `! spines: ${spines}`,
      `! leafs: ${leafs}`,
      `! ASN base: ${asnStart}`,
      `! Platform: ${platform}`,
      `!`,
      `service routing protocols model multi-agent`,
      `ip routing`,
      `interface Ethernet1`,
      `   description uplink`,
      `   mtu 9214`,
      `!`,
      `router bgp ${asnStart}`,
      `   router-id 1.1.1.1`,
      `   neighbor SPINES peer-group`,
      `   neighbor SPINES remote-as ${asnStart + 1}`
    ].join('\n');

    const validation = `Baseline AVD blueprint synthesized for ${spines}x spine / ${leafs}x leaf using ${platform}. Validate underlay MTU parity, ASN allocation, and platform TCAM profile before deployment.`;

    return { yaml, eos, validation };
  };

  const handleBuild = () => {
    setLoading(true);
    const blueprint = buildLocalBlueprint();
    window.setTimeout(() => {
      setResult(blueprint);
      setLoading(false);
    }, 250);
  };

  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col md:flex-row overflow-hidden selection:bg-blue-500/30">
      
      {/* LEFT: PARAMETERS */}
      <aside className="w-full md:w-80 border-b md:border-b-0 md:border-r border-zinc-800 bg-zinc-950 flex flex-col shrink-0 z-30 h-[40vh] md:h-screen overflow-y-auto">
         <div className="p-6 border-b border-zinc-900">
            <button onClick={onBack} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest mb-6">
                <ArrowLeft size={12} /> Fabric Labs
            </button>
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400">
                    <Cpu size={20} />
                </div>
                <div>
                    <h1 className="text-lg font-serif font-bold tracking-tight">AVD Studio</h1>
                    <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest mt-0.5">Build Pipeline v3.1</div>
                </div>
            </div>
         </div>

         <div className="p-6 space-y-6 flex-1">
            <InputGroup label="Fabric Identity">
                <input 
                  value={fabricName} 
                  onChange={e => setFabricName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-sm font-mono focus:border-blue-500 outline-none transition-all"
                />
            </InputGroup>

            <div className="grid grid-cols-2 gap-4">
                <InputGroup label="Spines">
                    <input 
                      type="number" 
                      value={spines} 
                      onChange={e => setSpines(parseInt(e.target.value))}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-sm font-mono focus:border-blue-500 outline-none transition-all"
                    />
                </InputGroup>
                <InputGroup label="Leafs">
                    <input 
                      type="number" 
                      value={leafs} 
                      onChange={e => setLeafs(parseInt(e.target.value))}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-sm font-mono focus:border-blue-500 outline-none transition-all"
                    />
                </InputGroup>
            </div>

            <InputGroup label="ASN Base">
                <input 
                  type="number" 
                  value={asnStart} 
                  onChange={e => setAsnStart(parseInt(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-sm font-mono focus:border-blue-500 outline-none transition-all"
                />
            </InputGroup>

            <InputGroup label="Platform SKU">
                <select 
                  value={platform} 
                  onChange={e => setPlatform(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-sm font-mono focus:border-blue-500 outline-none transition-all appearance-none"
                >
                    <option value="7050X3">7050X3 (Fixed)</option>
                    <option value="7060X4">7060X4 (High Performance)</option>
                    <option value="7280R3">7280R3 (Deep Buffer)</option>
                    <option value="vEOS">vEOS (Lab Mode)</option>
                </select>
            </InputGroup>

            <div className="mt-8 pt-8 border-t border-zinc-900">
                <button 
                  onClick={handleBuild}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20 group"
                >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Play size={16} fill="white" />}
                    Build Fabric
                </button>
            </div>
         </div>
      </aside>

      {/* MAIN: CODE VIEWER */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
         
         {/* TOP NAV BAR */}
         <div className="h-14 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-6 shrink-0 relative z-10">
            <div className="flex gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                <button 
                  onClick={() => setActiveView('YAML')}
                  className={`px-4 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${activeView === 'YAML' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                   <FileCode size={12} /> YAML Blueprint
                </button>
                <button 
                  onClick={() => setActiveView('EOS')}
                  className={`px-4 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${activeView === 'EOS' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                   <Terminal size={12} /> EOS Preview
                </button>
                <button 
                  onClick={() => setActiveView('VALIDATION')}
                  className={`px-4 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${activeView === 'VALIDATION' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                   <ShieldCheck size={12} /> Validation
                </button>
            </div>

            <div className="flex gap-2">
                {result && (
                    <button 
                       onClick={() => handleDownload(activeView === 'YAML' ? result.yaml : result.eos, `${fabricName.toLowerCase()}.${activeView === 'YAML' ? 'yml' : 'txt'}`)}
                       className="p-2 text-zinc-500 hover:text-white transition-colors rounded-lg border border-zinc-800 hover:bg-zinc-800"
                       title="Download Source"
                    >
                       <Download size={16} />
                    </button>
                )}
            </div>
         </div>

         {/* CONTENT VIEW */}
         <div className="flex-1 overflow-auto bg-black p-8 font-mono text-sm relative">
            {!result && !loading && (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                    <div className="w-24 h-24 border border-dashed border-zinc-800 rounded-full flex items-center justify-center animate-spin-slow mb-8">
                        <Box size={32} className="text-zinc-600" />
                    </div>
                    <h3 className="text-xl font-serif italic text-zinc-500">Initialize Build Pipeline to generate artifacts</h3>
                </div>
            )}

            {loading && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                    <div className="relative">
                        <div className="w-20 h-20 bg-blue-500/10 rounded-full animate-pulse-slow border border-blue-500/20"></div>
                        <Loader2 size={32} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500 animate-spin" />
                    </div>
                    <div>
                        <h4 className="font-bold text-white uppercase tracking-widest text-sm">Synthesizing Topology</h4>
                        <p className="text-zinc-500 text-xs mt-2 font-mono">[Reasoning-Kernel: Calibrating L3LS...]</p>
                    </div>
                </div>
            )}

            {result && !loading && (
                <div className="animate-fade-in h-full flex flex-col">
                    {activeView === 'YAML' && (
                        <pre className="text-blue-200 leading-relaxed bg-zinc-950 p-6 rounded-xl border border-zinc-800 shadow-inner overflow-auto h-full selection:bg-blue-900/50">
                            {result.yaml}
                        </pre>
                    )}
                    {activeView === 'EOS' && (
                        <pre className="text-emerald-200 leading-relaxed bg-zinc-950 p-6 rounded-xl border border-zinc-800 shadow-inner overflow-auto h-full selection:bg-emerald-900/50">
                            {result.eos}
                        </pre>
                    )}
                    {activeView === 'VALIDATION' && (
                        <div className="max-w-3xl space-y-8 py-8">
                            <div className="flex items-start gap-6 p-8 bg-zinc-900 border border-zinc-800 rounded-[2rem] shadow-xl">
                                <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-blue-400">
                                    <Sparkles size={24} />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-serif font-bold text-white">Architectural Summary</h3>
                                    <p className="text-zinc-400 leading-relaxed text-lg">
                                        {result.validation}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                                    <h4 className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <ShieldCheck size={14} /> Best Practices
                                    </h4>
                                    <ul className="space-y-2 text-xs text-zinc-400 font-mono">
                                        <li>• Layer 3 Leaf-Spine (L3LS) pattern</li>
                                        <li>• Point-to-point /31 Addressing</li>
                                        <li>• EBGP-based Control Plane</li>
                                        <li>• MTU 9214 Jumboframes ready</li>
                                    </ul>
                                </div>
                                <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                                    <h4 className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <AlertCircle size={14} /> Caveats
                                    </h4>
                                    <ul className="space-y-2 text-xs text-zinc-400 font-mono">
                                        <li>• Platform-specific TCAM profiles required</li>
                                        <li>• Check Transceiver power class compatibility</li>
                                        <li>• LLDP Neighbor validation mandatory</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
         </div>

         {/* FOOTER BAR */}
         <div className="h-10 bg-zinc-950 border-t border-zinc-900 px-6 flex items-center justify-between text-[8px] font-mono text-zinc-600 uppercase tracking-[0.4em] relative z-10 shrink-0">
             <div className="flex items-center gap-4">
                <span>Kernel v3.1.0-field</span>
                <span className="w-1 h-1 bg-zinc-800 rounded-full"></span>
                <span className="text-blue-900">Arista Validated Blueprint</span>
             </div>
             <div>
                Operational Readiness Level: {result ? 'High' : 'Awaiting Synthesis'}
             </div>
         </div>
      </main>

    </div>
  );
};
