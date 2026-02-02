import React from 'react';
import { ArrowLeft, Database, Info, Network, Zap, BookOpen, CheckCircle2 } from 'lucide-react';
import { SectionType } from '@/types';
import { RelatedActions } from '@/components/RelatedActions';

interface StorageFabricPlannerAboutProps {
  onBack: () => void;
  onNavigate?: (section: SectionType) => void;
}

export const StorageFabricPlannerAbout: React.FC<StorageFabricPlannerAboutProps> = ({ onBack, onNavigate }) => {
  return (
    <div className="min-h-screen bg-page-bg text-primary flex flex-col">
      <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-card-bg/80 backdrop-blur z-20">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 text-secondary hover:text-primary rounded-lg hover:bg-card-bg transition">
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400">
              <Database size={18} />
            </div>
            <div>
              <h1 className="font-serif font-bold text-lg tracking-tight leading-none">Storage Fabric Planner · About</h1>
              <span className="text-[10px] font-mono text-secondary uppercase tracking-widest mt-1 block">Arista NVMe-oF Design Rules</span>
            </div>
          </div>
        </div>
        {onNavigate && (
          <RelatedActions
            actions={[
              { label: 'Storage Planner', onClick: () => onNavigate(SectionType.STORAGE_FABRIC_PLANNER), icon: <BookOpen size={12} />, tone: 'blue' }
            ]}
          />
        )}
      </header>

      <main className="flex-1 p-6 md:p-12 space-y-8">
        <section className="p-6 rounded-3xl border border-border bg-card-bg">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-secondary mb-3">
            <Info size={14} className="text-blue-400" /> Overview
          </div>
          <p className="text-sm text-secondary leading-relaxed">
            The Storage Fabric Planner translates VAST NVMe-oF sizing patterns into Arista Ethernet fabric decisions.
            NVIDIA/VAST reference architecture presets are used only for sizing context. All outputs are Arista-centric:
            topology, port maps, platform class, and EOS/AVD configuration guidance.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl border border-border bg-card-bg">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-secondary mb-2">
              <Zap size={14} className="text-amber-400" /> Sizing Presets
            </div>
            <p className="text-sm text-secondary leading-relaxed">
              Presets like 2-4-3-200, 2-8-5-200, and 2-8-9-400 establish per-host bandwidth and scalable unit (SU) sizing.
              Users can select 200G or 400G per host without hardcoding a single speed.
            </p>
          </div>
          <div className="p-5 rounded-2xl border border-border bg-card-bg">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-secondary mb-2">
              <Network size={14} className="text-indigo-400" /> Arista Fabric Outputs
            </div>
            <p className="text-sm text-secondary leading-relaxed">
              The planner outputs leaf-spine topology, per-SU port maps, oversubscription targets, and E-W vs N-S segmentation.
              It also provides a clear port-speed plan for 200G and 400G Ethernet fabrics.
            </p>
          </div>
          <div className="p-5 rounded-2xl border border-border bg-card-bg">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-secondary mb-2">
              <CheckCircle2 size={14} className="text-emerald-400" /> Lossless Guidance
            </div>
            <p className="text-sm text-secondary leading-relaxed">
              RoCE v2 uses a lossless profile with PFC and ECN tuned on Arista EOS. NVMe-TCP relies less on PFC, but still benefits
              from MTU alignment and congestion management.
            </p>
          </div>
        </section>

        <section className="p-6 rounded-3xl border border-border bg-card-bg space-y-4">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-secondary">
            <BookOpen size={14} className="text-blue-400" /> Arista Planner Rules
          </div>
          <ul className="text-sm text-secondary space-y-2 list-disc list-inside">
            <li>Platform choice: 7050X4 is preferred for low oversubscription and predictable flows. 7280R3 is recommended when oversubscription is high or traffic is bursty.</li>
            <li>Fabric split: separate E-W and N-S domains for clarity. Map VAST-facing storage traffic into the N-S profile when needed.</li>
            <li>Port plan: compute the leaf port count per SU and show uplink ratios at 200G or 400G.</li>
            <li>Lossless profile: document PFC priorities, ECN thresholds, and MTU defaults for Arista EOS.</li>
            <li>Validation checklist: confirm host NIC speed, MTU alignment, and switch buffer class before go-live.</li>
          </ul>
        </section>

        <section className="p-6 rounded-3xl border border-border bg-card-bg space-y-3">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-secondary">
            <Info size={14} className="text-blue-400" /> Reference Note
          </div>
          <p className="text-sm text-secondary leading-relaxed">
            Sizing presets are derived from the NVIDIA VAST Data Storage Reference Architecture (July 2025). The planner uses those
            patterns to infer bandwidth demand, but all fabric decisions remain Arista Ethernet specific.
          </p>
        </section>
      </main>
    </div>
  );
};
