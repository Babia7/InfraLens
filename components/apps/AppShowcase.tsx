
import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, Search, Cpu, Zap, Layers, ArrowUpRight, Box, Grid, Beaker, LayoutGrid, Terminal, Check, X, Info, Brain, Activity, PenTool, BookOpen, Presentation, Calculator, TrendingUp, Lock } from 'lucide-react';
import { useInfraLens } from '@/context/InfraLensContext';
import { SectionType, AppItem, Suggestion, AppCategory } from '@/types';

const RETIRED_APP_IDS = new Set([
  'app-upgrade-orchestrator',
  'app-cve-advisor',
  'app-telemetry-anomaly',
  'app-eapi-sandbox',
  'app-7280-selector',
  'app-7050-selector',
  'app-campus-ai-ops'
]);
const FORGE_CATEGORY_STORAGE_KEY = 'forge_active_category';
type ForgeCategory = AppCategory | 'All' | 'Locked';
const VALID_FORGE_CATEGORIES: ForgeCategory[] = ['Reasoning', 'Sales', 'Practice', 'Reference', 'Delivery', 'Locked'];
const DEDUPE_FORGE_NAMES = new Set(['CloudVision Field Guide', 'Architecture Codex', 'SE Performance Guide']);

interface AppShowcaseProps {
  onBack: () => void;
  onNavigate: (section: SectionType) => void;
}

const CategorySidebarItem: React.FC<{ 
  active: boolean, 
  onClick: () => void, 
  icon: any, 
  label: string, 
  count: number,
  accentColor: string
}> = ({ active, onClick, icon: Icon, label, count, accentColor }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group ${active ? 'bg-card-bg text-primary border border-border' : 'text-secondary hover:text-primary hover:bg-card-bg/70 border border-transparent'}`}
  >
    <div className="flex items-center gap-3">
      <Icon size={16} className={`${active ? accentColor : 'text-secondary group-hover:text-primary'}`} />
      <span className="text-sm font-medium">{label}</span>
    </div>
    <span className={`text-[10px] font-mono ${active ? 'text-secondary' : 'text-secondary'}`}>{count}</span>
  </button>
);

const AppCard: React.FC<{ app: AppItem, onNavigate: (section: SectionType) => void }> = ({ app, onNavigate }) => {
  const getIcon = () => {
      switch(app.category) {
          case 'Reasoning': return <Calculator size={18} className="text-white"/>;
          case 'Sales': return <TrendingUp size={18} className="text-white"/>;
          case 'Practice': return <Terminal size={18} className="text-white"/>;
          case 'Reference': return <BookOpen size={18} className="text-white"/>;
          case 'Delivery': return <Presentation size={18} className="text-white"/>;
          default: return <Box size={18} className="text-white"/>;
      }
  };

  return (
    <div className="group flex flex-col bg-card-bg border border-border hover:border-emerald-400/50 rounded-xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
       <div className="flex justify-between items-start mb-4">
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${app.color} p-[1px]`}>
             <div className="w-full h-full bg-card-bg rounded-[7px] flex items-center justify-center">{getIcon()}</div>
          </div>
          {app.featured && (
             <div className="bg-blue-500/10 border border-blue-500/20 text-blue-500 px-2 py-1 rounded-md text-[10px] font-mono uppercase tracking-widest">
               Featured
             </div>
          )}
       </div>
       <div className="flex-1 mb-6">
          <h3 className="text-primary font-bold text-lg mb-2 group-hover:text-emerald-400 transition-colors">{app.name}</h3>
          <p className="text-secondary text-sm leading-relaxed line-clamp-3">{app.description}</p>
       </div>
       <div className="mt-auto flex items-center justify-between pt-4 border-t border-border">
          <div className="flex flex-wrap gap-2">
             {app.tags.slice(0, 2).map(tag => (
                <span key={tag} className="text-[9px] font-mono uppercase tracking-widest text-secondary border border-border px-1.5 py-0.5 rounded bg-surface-muted/60">{tag}</span>
             ))}
          </div>
          <button 
             onClick={(e) => {
               e.stopPropagation();
               if (app.internalRoute) onNavigate(app.internalRoute);
               else if (app.link) window.open(app.link, '_blank');
             }}
             disabled={!app.internalRoute && !app.link}
             className={`p-2 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold ${(!app.internalRoute && !app.link) ? 'text-secondary cursor-not-allowed' : 'bg-surface-muted hover:bg-emerald-500 hover:text-black text-primary border border-border'}`}
          >
             {(!app.internalRoute && !app.link) ? <span className="opacity-50">Locked</span> : <ArrowUpRight size={14} />}
          </button>
       </div>
    </div>
  );
};

export const AppShowcase: React.FC<AppShowcaseProps> = ({ onBack, onNavigate }) => {
  const { apps, showAdminApps } = useInfraLens();
  const [activeCategory, setActiveCategory] = useState<ForgeCategory>(() => {
    if (typeof window === 'undefined') return 'All';
    const stored = localStorage.getItem(FORGE_CATEGORY_STORAGE_KEY);
    if (stored && VALID_FORGE_CATEGORIES.includes(stored as ForgeCategory)) {
      return stored as ForgeCategory;
    }
    return 'All';
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    localStorage.removeItem(FORGE_CATEGORY_STORAGE_KEY);
  }, []);

  const displayApps = useMemo(() => {
    const seen = new Set<string>();
    return apps.filter((app) => {
      if (!DEDUPE_FORGE_NAMES.has(app.name)) return true;
      if (seen.has(app.name)) return false;
      seen.add(app.name);
      return true;
    });
  }, [apps]);

  const isSalesCategoryApp = (app: AppItem) =>
    app.category === 'Sales' || (app.category === 'Reasoning' && app.subCategory === 'Financial Logic');
  const lockedApps = useMemo(() => displayApps.filter((app) => app.adminOnly), [displayApps]);
  const unlockedApps = useMemo(() => displayApps.filter((app) => !app.adminOnly), [displayApps]);

  const matchesCategory = (app: AppItem, category: AppCategory | 'All') => {
    if (category === 'All') return true;
    if (category === 'Sales') return isSalesCategoryApp(app);
    return app.category === category;
  };

  const filteredApps = useMemo(() => {
    const baseApps = activeCategory === 'Locked' ? lockedApps : unlockedApps;
    if (activeCategory === 'Locked' && !showAdminApps) return [];
    let result = baseApps.filter(a => (!a.hidden || showAdminApps) && !RETIRED_APP_IDS.has(a.id));
    if (activeCategory !== 'All' && activeCategory !== 'Locked') {
      result = result.filter(a => matchesCategory(a, activeCategory));
    }
    if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        result = result.filter(a => a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q) || a.tags.some(t => t.toLowerCase().includes(q)));
    }
    return result;
  }, [activeCategory, searchQuery, showAdminApps, lockedApps, unlockedApps]);

  const groupedApps = useMemo(() => {
    // Unified view: everything in one bucket
    if (activeCategory === 'All') {
      return { 'Unified Inventory': filteredApps };
    }
    // Otherwise, keep sub-category groupings
    const groups: Record<string, AppItem[]> = {};
    filteredApps.forEach(app => {
      const key = app.subCategory || 'General';
      if (!groups[key]) groups[key] = [];
      groups[key].push(app);
    });
    return groups;
  }, [filteredApps, activeCategory]);

  const getCategoryTitle = () => {
      switch (activeCategory) {
          case 'All': return 'Unified Inventory (all categories)';
          case 'Reasoning': return 'Reasoning Engines';
          case 'Sales': return 'Sales Enablement';
          case 'Practice': return 'Field Practice';
          case 'Reference': return 'Knowledge Base';
          case 'Delivery': return 'Narrative & Delivery';
          case 'Locked': return 'Locked Assets';
          default: return 'Field Inventory';
      }
  };

  return (
    <div className="min-h-screen bg-page-bg text-primary font-sans flex flex-col md:flex-row overflow-hidden selection:bg-blue-500/30">
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-border bg-card-bg flex flex-col shrink-0 z-30">
         <div className="p-6 flex items-center gap-3">
            <button onClick={onBack} className="p-2 -ml-2 text-secondary hover:text-primary rounded-lg hover:bg-surface-muted transition-colors"><ArrowLeft size={18} /></button>
            <span className="font-serif font-bold text-lg tracking-tight text-primary">The Forge</span>
         </div>
         <div className="px-4 pb-4">
            <div className="relative">
               <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
               <input type="text" placeholder="Scan assets..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-card-bg border border-border rounded-lg py-2 pl-9 pr-4 text-xs text-primary focus:border-emerald-500 outline-none transition-colors" />
            </div>
         </div>
         <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
            <CategorySidebarItem active={activeCategory === 'All'} onClick={() => setActiveCategory('All')} icon={LayoutGrid} label="Unified View" count={unlockedApps.length} accentColor="text-primary" />
            <div className="my-2 h-px bg-border mx-4"></div>
            <CategorySidebarItem active={activeCategory === 'Reasoning'} onClick={() => setActiveCategory('Reasoning')} icon={Calculator} label="Reasoning" count={unlockedApps.filter(a => a.category === 'Reasoning').length} accentColor="text-blue-500" />
            <CategorySidebarItem active={activeCategory === 'Sales'} onClick={() => setActiveCategory('Sales')} icon={TrendingUp} label="Sales Enablement" count={unlockedApps.filter((a) => isSalesCategoryApp(a)).length} accentColor="text-emerald-500" />
            <CategorySidebarItem active={activeCategory === 'Practice'} onClick={() => setActiveCategory('Practice')} icon={Terminal} label="Field Practice" count={unlockedApps.filter(a => a.category === 'Practice').length} accentColor="text-indigo-500" />
            <CategorySidebarItem active={activeCategory === 'Reference'} onClick={() => setActiveCategory('Reference')} icon={BookOpen} label="Knowledge Base" count={unlockedApps.filter(a => a.category === 'Reference').length} accentColor="text-emerald-500" />
            <CategorySidebarItem active={activeCategory === 'Delivery'} onClick={() => setActiveCategory('Delivery')} icon={Presentation} label="Narrative & Delivery" count={unlockedApps.filter(a => a.category === 'Delivery').length} accentColor="text-violet-500" />
            <div className="my-2 h-px bg-border mx-4"></div>
            <CategorySidebarItem active={activeCategory === 'Locked'} onClick={() => setActiveCategory('Locked')} icon={Lock} label="Locked" count={lockedApps.length} accentColor="text-amber-500" />
         </nav>
      </aside>

      <main className="flex-1 overflow-y-auto bg-page-bg relative">
         <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.02)_1px,transparent_1px)] bg-[length:40px_40px] pointer-events-none mix-blend-overlay"></div>
         <div className="max-w-6xl mx-auto p-8 relative z-10">
            <h1 className="text-3xl font-serif font-bold text-primary mb-10">
               {getCategoryTitle()}
            </h1>
            <div className="space-y-16">
               {Object.entries(groupedApps).map(([subCategory, groupApps]) => (
                  <section key={subCategory} className="animate-fade-in">
                     <div className="flex items-center gap-4 mb-6">
                        <h2 className="text-lg font-bold text-primary border-l-2 border-emerald-400 pl-3">{subCategory}</h2>
                        <div className="h-px bg-border flex-1"></div>
                        <span className="text-xs font-mono text-secondary">{groupApps.length} ASSETS</span>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {groupApps.map(app => <AppCard key={app.id} app={app} onNavigate={onNavigate} />)}
                     </div>
                  </section>
               ))}
            </div>
         </div>
      </main>
    </div>
  );
};
