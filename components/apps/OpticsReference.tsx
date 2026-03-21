
import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, Zap, Layers, Activity, TrendingUp, Shield, RefreshCw } from 'lucide-react';
import { SectionType } from '@/types';
import {
  CONCEPT_DEFINITIONS,
  RULES_OF_THUMB,
  KB_KEYWORDS,
  CONCEPT_TAB_MAP
} from '@/data/optics';

interface OpticsReferenceProps {
  onBack: () => void;
  onNavigate?: (section: SectionType) => void;
}

const TAB_META: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  CONNECTIVITY: { label: 'Connectivity', icon: Layers,   color: 'text-blue-400' },
  HARDWARE:     { label: 'Hardware',     icon: Zap,      color: 'text-emerald-400' },
  SIGNALING:    { label: 'Signaling',    icon: Activity, color: 'text-violet-400' },
  STRATEGY:     { label: 'Strategy',     icon: TrendingUp, color: 'text-amber-400' },
  OPERATIONS:   { label: 'Operations',   icon: RefreshCw,  color: 'text-rose-400' },
  UPGRADES:     { label: 'Upgrades',     icon: Shield,   color: 'text-cyan-400' }
};

const ALL_TABS = Object.keys(TAB_META);

export const OpticsReference: React.FC<OpticsReferenceProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('CONNECTIVITY');
  const [searchQuery, setSearchQuery] = useState('');

  const conceptsInTab = useMemo(() =>
    Object.entries(CONCEPT_TAB_MAP)
      .filter(([, tab]) => tab === activeTab)
      .map(([key]) => key),
    [activeTab]
  );

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return conceptsInTab;
    const q = searchQuery.toLowerCase();
    return Object.keys(CONCEPT_DEFINITIONS).filter(key => {
      const def = CONCEPT_DEFINITIONS[key]?.toLowerCase() ?? '';
      const keywords = (KB_KEYWORDS[key] ?? []).join(' ').toLowerCase();
      return def.includes(q) || keywords.includes(q) || key.toLowerCase().includes(q);
    });
  }, [searchQuery, conceptsInTab]);

  const displayKeys = searchQuery.trim() ? filtered : conceptsInTab;

  return (
    <div className="min-h-screen bg-page-bg text-primary font-sans flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex items-center gap-3 px-6 py-4 border-b border-border bg-card-bg shrink-0">
        <button onClick={onBack} className="p-2 -ml-2 text-secondary hover:text-primary rounded-lg hover:bg-surface-muted transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="font-serif font-bold text-lg text-primary">Optics Reference</h1>
          <p className="text-xs text-secondary">Fiber, form factors, signaling, and AI fabric strategy</p>
        </div>
        <div className="ml-auto relative w-64">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
          <input
            type="text"
            placeholder="Search concepts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-page-bg border border-border rounded-lg py-1.5 pl-8 pr-3 text-xs text-primary focus:border-emerald-500 outline-none transition-colors"
          />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Tab sidebar */}
        <aside className="w-44 border-r border-border bg-card-bg flex flex-col gap-1 p-3 shrink-0">
          {ALL_TABS.map((tab) => {
            const meta = TAB_META[tab];
            const Icon = meta.icon;
            return (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setSearchQuery(''); }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab && !searchQuery
                    ? 'bg-card-bg border border-border text-primary'
                    : 'text-secondary hover:text-primary hover:bg-card-bg/70 border border-transparent'
                }`}
              >
                <Icon size={14} className={activeTab === tab ? meta.color : 'text-secondary'} />
                {meta.label}
              </button>
            );
          })}
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {displayKeys.length === 0 ? (
            <p className="text-secondary text-sm">No concepts match your search.</p>
          ) : (
            <div className="space-y-6 max-w-3xl">
              {!searchQuery && (
                <p className="tool-label">
                  {TAB_META[activeTab]?.label} — {displayKeys.length} concepts
                </p>
              )}
              {displayKeys.map((key) => {
                const definition = CONCEPT_DEFINITIONS[key];
                const rules = RULES_OF_THUMB[key] ?? [];
                const keywords = KB_KEYWORDS[key] ?? [];
                if (!definition) return null;
                return (
                  <div key={key} className="tool-note space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-semibold text-primary text-sm">
                        {key.replace(/_/g, ' ')}
                      </h3>
                      {searchQuery && CONCEPT_TAB_MAP[key] && (
                        <span className="text-[9px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-full border border-border text-secondary shrink-0">
                          {CONCEPT_TAB_MAP[key]}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-secondary leading-relaxed">{definition}</p>
                    {rules.length > 0 && (
                      <div>
                        <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-emerald-400 mb-2">Rules of Thumb</p>
                        <ul className="space-y-1">
                          {rules.map((rule, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-secondary">
                              <span className="w-1 h-1 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                              {rule}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {keywords.slice(0, 8).map((kw) => (
                          <span key={kw} className="text-[9px] font-mono px-2 py-0.5 rounded-full border border-border text-secondary bg-card-bg">
                            {kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
