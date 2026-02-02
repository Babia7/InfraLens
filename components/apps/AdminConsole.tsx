
import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Database, LayoutGrid, Plus, Trash2, Edit2, Check, X, Command, Upload, Download, WifiOff, RotateCcw, HardDrive, Copy, AlertTriangle } from 'lucide-react';
import { useInfraLens, DATA_VERSION, STORAGE_KEYS } from '@/context/InfraLensContext';
import { AppItem, AppCategory, Suggestion, BookItem, ConceptExplainer, RoadmapItem, SEPerformanceStep, GlobalConfig } from '@/types';
import { notifyError, notifyInfo, notifySuccess } from '@/services/notifications';

interface AdminConsoleProps {
  onBack: () => void;
}

/**
 * Reusable input group with consistent styling for admin fields.
 */
const InputGroup = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-mono uppercase tracking-widest text-secondary">{label}</label>
    {children}
  </div>
);

type SnapshotPayload = {
  version: string;
  generatedAt: string;
  apps: AppItem[];
  suggestions: Suggestion[];
  books: BookItem[];
  concepts: ConceptExplainer[];
  roadmap: RoadmapItem[];
  sePerformance: SEPerformanceStep[];
  config: GlobalConfig;
};

const PROFILE_INDEX_KEY = 'infralens_profiles';
const PROFILE_PREFIX = 'infralens_profile_';

const formatTimestamp = (value?: string | null) => {
  if (!value) return '—';
  const date = new Date(value);
  return isNaN(date.getTime()) ? '—' : date.toLocaleString();
};

const readProfileIndex = (): string[] => {
  try {
    const raw = localStorage.getItem(PROFILE_INDEX_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
};

const writeProfileIndex = (profiles: string[]) => {
  localStorage.setItem(PROFILE_INDEX_KEY, JSON.stringify(profiles));
};

const diffById = <T extends { id?: string }>(incoming?: T[], current?: T[]) => {
  const next = new Set((incoming || []).map(item => item?.id));
  const curr = new Set((current || []).map(item => item?.id));
  const added = (incoming || []).filter(item => item?.id && !curr.has(item.id)).length;
  const removed = (current || []).filter(item => item?.id && !next.has(item.id)).length;
  return { added, removed, totalIncoming: incoming?.length || 0 };
};

/**
 * Admin Console for direct manipulation of the System state (Apps, Config, etc).
 */
export const AdminConsole: React.FC<AdminConsoleProps> = ({ onBack }) => {
  const { apps, setApps, config, setConfig, suggestions, setSuggestions, books, setBooks, concepts, setConcepts, roadmap, setRoadmap, sePerformance, setSEPerformance, showAdminApps, setShowAdminApps } = useInfraLens();
  const [editingApp, setEditingApp] = useState<AppItem | null>(null);
  const [telemetry, setTelemetry] = useState<{ lastSaved?: string | null; lastError?: string | null }>({ lastSaved: null, lastError: null });
  const [profileName, setProfileName] = useState('');
  const [profiles, setProfiles] = useState<string[]>([]);
  const [importError, setImportError] = useState<string | null>(null);
  const [lastDeleted, setLastDeleted] = useState<AppItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [pendingSnapshot, setPendingSnapshot] = useState<SnapshotPayload | null>(null);
  const [activeProfile, setActiveProfile] = useState<string | null>(null);
  const isOnline = typeof navigator === 'undefined' ? true : navigator.onLine;
  const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  const [pinInput, setPinInput] = useState('');
  const ADMIN_PIN = '19901991';

  useEffect(() => {
    if (!isBrowser) return;
    setTelemetry({
      lastSaved: localStorage.getItem(STORAGE_KEYS.LAST_SAVED),
      lastError: localStorage.getItem(STORAGE_KEYS.LAST_ERROR)
    });
    setProfiles(readProfileIndex());
  }, []);

  const refreshTelemetry = () => {
    if (!isBrowser) return;
    setTelemetry({
      lastSaved: localStorage.getItem(STORAGE_KEYS.LAST_SAVED),
      lastError: localStorage.getItem(STORAGE_KEYS.LAST_ERROR)
    });
  };

  const saveNow = () => {
    if (!isBrowser) return;
    try {
      localStorage.setItem(STORAGE_KEYS.VERSION, DATA_VERSION);
      localStorage.setItem(STORAGE_KEYS.APPS, JSON.stringify(apps));
      localStorage.setItem(STORAGE_KEYS.SUGGESTIONS, JSON.stringify(suggestions));
      localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));
      localStorage.setItem(STORAGE_KEYS.CONCEPTS, JSON.stringify(concepts));
      localStorage.setItem(STORAGE_KEYS.ROADMAP, JSON.stringify(roadmap));
      localStorage.setItem(STORAGE_KEYS.SE_PERFORMANCE, JSON.stringify(sePerformance));
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
      localStorage.setItem(STORAGE_KEYS.LAST_SAVED, new Date().toISOString());
      localStorage.removeItem(STORAGE_KEYS.LAST_ERROR);
      refreshTelemetry();
      notifySuccess('Workspace saved locally');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Storage unavailable';
      try {
        localStorage.setItem(STORAGE_KEYS.LAST_ERROR, message);
      } catch {/* ignore */}
      notifyError('Save failed', message);
      refreshTelemetry();
    }
  };

  const buildSnapshot = (): SnapshotPayload => ({
    version: DATA_VERSION,
    generatedAt: new Date().toISOString(),
    apps,
    suggestions,
    books,
    concepts,
    roadmap,
    sePerformance,
    config
  });

  const applySnapshot = (payload: Partial<SnapshotPayload>) => {
    if (!payload) return;
    try {
      if (Array.isArray(payload.apps)) setApps(payload.apps);
      if (Array.isArray(payload.suggestions)) setSuggestions(payload.suggestions);
      if (Array.isArray(payload.books)) setBooks(payload.books);
      if (Array.isArray(payload.concepts)) setConcepts(payload.concepts);
      if (Array.isArray(payload.roadmap)) setRoadmap(payload.roadmap);
      if (Array.isArray(payload.sePerformance)) setSEPerformance(payload.sePerformance);
      if (payload.config) setConfig(payload.config);
      notifySuccess('Workspace restored', 'Snapshot applied to local session.');
      refreshTelemetry();
    } catch (e) {
      notifyError('Invalid snapshot', e instanceof Error ? e.message : 'Unknown error');
    }
  };

  const handleExport = () => {
    const snapshot = buildSnapshot();
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `infralens_snapshot_${new Date().toISOString()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    notifyInfo('Snapshot exported', 'JSON saved locally.');
  };

  const handleImport = async (fileList: FileList | null) => {
    setImportError(null);
    const file = fileList?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      setPendingSnapshot(parsed);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Could not parse snapshot';
      setImportError(message);
      notifyError('Import failed', message);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSaveProfile = () => {
    const trimmed = profileName.trim();
    if (!trimmed) {
      notifyError('Profile name required');
      return;
    }
    const snapshot = buildSnapshot();
    localStorage.setItem(`${PROFILE_PREFIX}${trimmed}`, JSON.stringify(snapshot));
    const index = Array.from(new Set([...profiles, trimmed]));
    writeProfileIndex(index);
    setProfiles(index);
    notifySuccess('Profile saved', `Saved as "${trimmed}"`);
  };

  const handleLoadProfile = (name: string) => {
    try {
      const raw = localStorage.getItem(`${PROFILE_PREFIX}${name}`);
      if (!raw) {
        notifyError('Profile not found');
        return;
      }
      applySnapshot(JSON.parse(raw));
      setProfileName(name);
      setActiveProfile(name);
    } catch (e) {
      notifyError('Failed to load profile', e instanceof Error ? e.message : 'Unknown error');
    }
  };

  const handleDeleteProfile = (name: string) => {
    localStorage.removeItem(`${PROFILE_PREFIX}${name}`);
    const next = profiles.filter(p => p !== name);
    writeProfileIndex(next);
    setProfiles(next);
    notifyInfo('Profile removed', name);
  };

  const handleDuplicateProfile = (name: string) => {
    try {
      const raw = localStorage.getItem(`${PROFILE_PREFIX}${name}`);
      if (!raw) {
        notifyError('Profile missing', name);
        return;
      }
      let copyName = `${name}-copy`;
      let counter = 1;
      while (profiles.includes(copyName)) {
        copyName = `${name}-copy-${counter++}`;
      }
      localStorage.setItem(`${PROFILE_PREFIX}${copyName}`, raw);
      const updated = [...profiles, copyName];
      writeProfileIndex(updated);
      setProfiles(updated);
      notifySuccess('Profile duplicated', copyName);
    } catch (e) {
      notifyError('Duplicate failed', e instanceof Error ? e.message : 'Unknown error');
    }
  };

  /**
   * Persists changes to an existing node in the registry.
   */
  const handleSaveApp = () => {
    if (!editingApp) return;
    setApps(prev => prev.map(a => a.id === editingApp.id ? editingApp : a));
    setEditingApp(null);
  };

  /**
   * Initializes a new speculative node in the Forge.
   */
  const handleCreateApp = () => {
    const newApp: AppItem = {
      id: crypto.randomUUID(),
      name: 'New Node',
      description: 'System module description...',
      category: 'Reasoning',
      tags: [],
      color: 'from-zinc-500 to-zinc-700'
    };
    setApps([newApp, ...apps]);
    setEditingApp(newApp);
  };

  /**
   * Removes a node from the registry.
   */
  const handleDeleteApp = (id: string) => {
      setApps(prev => {
        const target = prev.find(a => a.id === id) || null;
        if (target) setLastDeleted(target);
        return prev.filter(a => a.id !== id);
      });
  };

  /**
   * Restores the most recently deleted node.
   */
  const handleUndoDelete = () => {
    if (!lastDeleted) return;
    setApps(prev => [lastDeleted, ...prev]);
    setLastDeleted(null);
  };

  const isEditingValid = editingApp ? Boolean(editingApp.name?.trim() && editingApp.description?.trim()) : false;

  return (
    <div className="min-h-screen bg-page-bg text-primary font-sans p-6 md:p-12 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
            <header className="mb-6 flex justify-between items-center">
                <div className="flex items-center gap-6">
                    <button onClick={onBack} className="p-2 hover:bg-card-bg rounded-lg text-secondary hover:text-primary transition-colors border border-transparent hover:border-border">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-card-bg border border-border rounded-lg">
                            <Command size={24} className="text-secondary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-serif font-bold tracking-tight">System Admin</h1>
                            <div className="text-[10px] font-mono text-secondary uppercase tracking-widest">System Configuration Shell</div>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Root Session Active</span>
                    </div>
                    <div className={`px-4 py-2 rounded-full border ${isOnline ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-300'} text-[10px] font-bold uppercase tracking-widest flex items-center gap-2`}>
                        {isOnline ? <WifiOff size={14} className="rotate-45" /> : <WifiOff size={14} />}
                        {isOnline ? 'Online' : 'Offline (changes stay local)'}
                    </div>
                    <button onClick={saveNow} className="px-4 py-2 bg-white text-black rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors">
                        Save now
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
                <div className="p-4 bg-card-bg border border-border rounded-xl">
                    <div className="text-[10px] font-mono uppercase tracking-widest text-secondary mb-1">Data Version</div>
                    <div className="text-sm font-bold text-primary">{DATA_VERSION}</div>
                </div>
                <div className="p-4 bg-card-bg border border-border rounded-xl">
                    <div className="text-[10px] font-mono uppercase tracking-widest text-secondary mb-1">Last Saved</div>
                    <div className="text-sm font-semibold text-emerald-300">{formatTimestamp(telemetry.lastSaved)}</div>
                </div>
                <div className="p-4 bg-card-bg border border-border rounded-xl">
                    <div className="text-[10px] font-mono uppercase tracking-widest text-secondary mb-1">Last Error</div>
                    <div className="text-xs text-amber-300 line-clamp-2">{telemetry.lastError || '—'}</div>
                </div>
                <div className="p-4 bg-card-bg border border-border rounded-xl flex items-center justify-between">
                    <div>
                        <div className="text-[10px] font-mono uppercase tracking-widest text-secondary mb-1">Snapshots</div>
                        <div className="text-sm font-semibold text-primary">{profiles.length} saved</div>
                    </div>
                    <button onClick={() => refreshTelemetry()} className="p-2 text-secondary hover:text-primary rounded-lg hover:bg-card-bg transition-colors border border-transparent hover:border-border" title="Refresh telemetry">
                        <RotateCcw size={14} />
                    </button>
                </div>
                <div className="p-4 bg-card-bg border border-border rounded-xl flex items-center justify-between">
                    <div>
                        <div className="text-[10px] font-mono uppercase tracking-widest text-secondary mb-1">Admin Apps</div>
                        <div className="text-sm font-semibold text-primary">{showAdminApps ? 'Visible' : 'Hidden'}</div>
                    </div>
                    <div className="flex gap-2 items-center">
                        <input
                          type="password"
                          value={pinInput}
                          onChange={(e) => setPinInput(e.target.value)}
                          placeholder="PIN"
                          className="w-20 bg-page-bg border border-border rounded p-2 text-sm text-primary"
                        />
                        <button
                          onClick={() => {
                            if (pinInput === ADMIN_PIN) {
                              setShowAdminApps(true);
                              notifySuccess('Admin apps unlocked');
                            } else {
                              notifyError('Invalid PIN');
                            }
                          }}
                          className="px-3 py-1.5 bg-white text-black rounded text-[10px] font-bold uppercase tracking-wider hover:bg-zinc-200 transition-colors"
                        >
                          Unlock
                        </button>
                        {showAdminApps && (
                          <button
                            onClick={() => setShowAdminApps(false)}
                            className="px-3 py-1.5 bg-card-bg border border-border rounded text-[10px] font-bold uppercase tracking-wider text-secondary hover:text-primary"
                          >
                            Hide
                          </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* CONFIGURATION EDITOR */}
                <div className="lg:col-span-4 space-y-8">
                    <section className="bg-card-bg border border-border rounded-2xl p-6 space-y-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-secondary flex items-center gap-2">
                                <HardDrive size={14} /> Snapshots & Import
                            </h2>
                            <div className="flex gap-2">
                                <button onClick={handleExport} className="px-3 py-1.5 bg-card-bg border border-border rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 hover:border-emerald-400">
                                    <Download size={12} /> Export
                                </button>
                                <button onClick={() => fileInputRef.current?.click()} className="px-3 py-1.5 bg-card-bg border border-border rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 hover:border-emerald-400">
                                    <Upload size={12} /> Import
                                </button>
                                <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={e => handleImport(e.target.files)} />
                            </div>
                        </div>
                        <p className="text-xs text-secondary leading-relaxed">
                            Export or import the entire workspace (apps, books, roadmap, performance steps, config). Keeps everything local—no external DB.
                        </p>
                        {importError && (
                          <div className="text-xs text-amber-600 bg-amber-100 border border-amber-200 rounded-lg p-3">
                            Import error: {importError}
                          </div>
                        )}
                        {pendingSnapshot && (
                          <div className="p-3 bg-card-bg border border-border rounded-lg space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-500">Import Ready (dry run)</div>
                              <div className="text-[10px] text-secondary">Version: {pendingSnapshot.version || 'unknown'}</div>
                            </div>
                            <div className="text-xs text-secondary space-y-1">
                              <div>Apps {pendingSnapshot.apps?.length ?? 0} · Books {pendingSnapshot.books?.length ?? 0} · Concepts {pendingSnapshot.concepts?.length ?? 0} · Roadmap {pendingSnapshot.roadmap?.length ?? 0} · SE Perf {pendingSnapshot.sePerformance?.length ?? 0}</div>
                              <div className="flex flex-wrap gap-2">
                                {(() => {
                                  const sections = [
                                    { label: 'Apps', ...diffById(pendingSnapshot.apps, apps) },
                                    { label: 'Roadmap', ...diffById(pendingSnapshot.roadmap, roadmap) },
                                    { label: 'Books', ...diffById(pendingSnapshot.books, books) },
                                    { label: 'Concepts', ...diffById(pendingSnapshot.concepts, concepts) },
                                    { label: 'SE Perf', ...diffById(pendingSnapshot.sePerformance, sePerformance) },
                                  ];
                                  return sections.map(sec => (
                                    <span key={sec.label} className="px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] text-emerald-600">
                                      {sec.label}: +{sec.added} / -{sec.removed}
                                    </span>
                                  ));
                                })()}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => { applySnapshot(pendingSnapshot); setPendingSnapshot(null); }} className="px-3 py-1.5 bg-emerald-500 text-black rounded text-[10px] font-bold uppercase tracking-wider hover:bg-emerald-400">
                                Apply snapshot
                              </button>
                              <button onClick={() => setPendingSnapshot(null)} className="px-3 py-1.5 bg-card-bg border border-border rounded text-[10px] font-bold uppercase tracking-wider text-secondary hover:text-primary">
                                Dismiss
                              </button>
                            </div>
                          </div>
                        )}
                        <div className="border border-dashed border-border rounded-lg p-3 space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-[10px] font-mono uppercase tracking-widest text-secondary">Profile Name</div>
                                    <input value={profileName} onChange={e => setProfileName(e.target.value)} placeholder="e.g. workshop-1" className="mt-1 w-full bg-page-bg border border-border rounded p-2 text-xs text-primary" />
                                </div>
                                <button onClick={handleSaveProfile} className="h-9 px-3 bg-white text-black rounded font-bold text-[10px] uppercase tracking-wider hover:bg-zinc-200 transition-colors self-end">
                                    Save
                                </button>
                            </div>
                            {profiles.length > 0 && (
                              <div className="space-y-2">
                                <div className="text-[10px] font-mono uppercase tracking-widest text-secondary">Saved Profiles</div>
                                <div className="flex flex-wrap gap-2">
                                  {profiles.map(name => (
                                    <div key={name} className={`flex items-center gap-2 bg-page-bg border px-3 py-1 rounded-full text-xs ${activeProfile === name ? 'border-emerald-500/40' : 'border-border'}`}>
                                      <button onClick={() => handleLoadProfile(name)} className="text-primary hover:text-emerald-400 font-semibold flex items-center gap-1">
                                        {name} {activeProfile === name && <span className="text-[9px] text-emerald-400">(active)</span>}
                                      </button>
                                      <button onClick={() => handleDuplicateProfile(name)} className="text-secondary hover:text-primary">
                                        <Copy size={12} />
                                      </button>
                                      <button onClick={() => handleDeleteProfile(name)} className="text-secondary hover:text-red-500">
                                        <Trash2 size={12} />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          {lastDeleted && (
                            <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-lg p-3">
                                <div>
                                    <div className="text-[10px] font-mono uppercase tracking-widest text-amber-700">Undo</div>
                                    <div className="text-sm text-primary">{lastDeleted.name} removed</div>
                                </div>
                                <button onClick={handleUndoDelete} className="px-3 py-1.5 bg-amber-500 text-black rounded font-bold text-[10px] uppercase tracking-wider hover:bg-amber-400">
                                    Restore
                                </button>
                            </div>
                          )}
                    </section>

                    <section className="bg-card-bg border border-border rounded-2xl p-6 space-y-6 shadow-sm">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-secondary border-b border-border pb-4 flex items-center gap-2">
                            <Database size={14} /> Hero Config
                        </h2>
                        <InputGroup label="Prefix">
                            <input className="w-full bg-page-bg border border-border rounded p-2 text-primary text-xs" value={config.hero.titlePrefix} onChange={e => setConfig({...config, hero: {...config.hero, titlePrefix: e.target.value}})} />
                        </InputGroup>
                        <InputGroup label="Suffix">
                            <input className="w-full bg-page-bg border border-border rounded p-2 text-primary text-xs" value={config.hero.titleSuffix} onChange={e => setConfig({...config, hero: {...config.hero, titleSuffix: e.target.value}})} />
                        </InputGroup>
                        <InputGroup label="Subtitle">
                            <textarea className="w-full bg-page-bg border border-border rounded p-2 text-primary text-xs h-20" value={config.hero.subtitle} onChange={e => setConfig({...config, hero: {...config.hero, subtitle: e.target.value}})} />
                        </InputGroup>
                    </section>
                </div>

                {/* APP REGISTRY */}
                <div className="lg:col-span-8 space-y-8">
                    <section className="bg-card-bg border border-border rounded-2xl p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-secondary flex items-center gap-2">
                                <LayoutGrid size={14} /> Node Registry
                            </h2>
                            <button onClick={handleCreateApp} className="px-3 py-1.5 bg-white text-black rounded font-bold text-[10px] uppercase tracking-wider hover:bg-zinc-200 transition-colors">
                                Add Node
                            </button>
                        </div>

                        {editingApp && (
                             <div className="mb-12 p-6 bg-card-bg border border-border rounded-xl space-y-4 animate-fade-in shadow-sm">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-sm font-bold text-primary">Edit Node Protocol</h3>
                                    <div className="flex gap-2">
                                        <button onClick={() => setEditingApp(null)} className="p-2 text-secondary hover:text-primary"><X size={16}/></button>
                                        <button onClick={handleSaveApp} className="p-2 text-emerald-500 hover:text-emerald-400"><Check size={16}/></button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <InputGroup label="Node Name">
                                        <input className="w-full bg-page-bg border border-border rounded p-2 text-primary text-xs" value={editingApp.name} onChange={e => setEditingApp({...editingApp, name: e.target.value})} />
                                    </InputGroup>
                                    <InputGroup label="Gradient Key">
                                        <input className="w-full bg-page-bg border border-border rounded p-2 text-primary text-xs font-mono" value={editingApp.color} onChange={e => setEditingApp({...editingApp, color: e.target.value})} />
                                    </InputGroup>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <InputGroup label="Taxonomy Field">
                                        <select className="w-full bg-page-bg border border-border rounded p-2 text-primary text-xs" value={editingApp.category} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEditingApp({...editingApp, category: e.target.value as AppCategory})}>
                                            <option value="Reasoning">Reasoning</option>
                                            <option value="Sales">Sales</option>
                                            <option value="Practice">Practice</option>
                                            <option value="Reference">Reference</option>
                                            <option value="Delivery">Delivery</option>
                                        </select>
                                    </InputGroup>
                                    <InputGroup label="Sub-Domain">
                                        <input className="w-full bg-page-bg border border-border rounded p-2 text-primary text-xs" value={editingApp.subCategory || ''} onChange={e => setEditingApp({...editingApp, subCategory: e.target.value})} placeholder="e.g. Cognitive Cybernetics" />
                                    </InputGroup>
                                </div>

                                <InputGroup label="Protocol Description">
                                    <textarea className="w-full bg-page-bg border border-border rounded p-2 text-primary text-xs h-20" value={editingApp.description} onChange={e => setEditingApp({...editingApp, description: e.target.value})} />
                                </InputGroup>

                                <div className="grid grid-cols-2 gap-4">
                                  <label className="flex items-center gap-2 text-xs text-secondary">
                                    <input
                                      type="checkbox"
                                      checked={!!editingApp.adminOnly}
                                      onChange={(e) => setEditingApp({ ...editingApp, adminOnly: e.target.checked })}
                                      className="accent-emerald-500"
                                    />
                                    Admin Only
                                  </label>
                                  <label className="flex items-center gap-2 text-xs text-secondary">
                                    <input
                                      type="checkbox"
                                      checked={!!editingApp.hidden}
                                      onChange={(e) => setEditingApp({ ...editingApp, hidden: e.target.checked })}
                                      className="accent-emerald-500"
                                    />
                                    Hidden
                                  </label>
                                </div>

                                {!isEditingValid && (
                                  <div className="text-[11px] text-amber-700 bg-amber-100 border border-amber-200 rounded-lg p-3">
                                    Name and description are required before saving.
                                  </div>
                                )}
                                
                                <div className="flex justify-end gap-3 pt-4 border-t border-border">
                                    <button onClick={() => setEditingApp(null)} className="px-4 py-2 text-xs font-bold text-secondary uppercase">Cancel</button>
                                    <button 
                                      onClick={handleSaveApp} 
                                      disabled={!isEditingValid}
                                      className={`px-6 py-2 rounded text-xs font-bold uppercase transition-colors ${isEditingValid ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-card-bg border border-border text-secondary cursor-not-allowed'}`}
                                    >
                                      Save Node Changes
                                    </button>
                                </div>
                             </div>
                        )}

                        <div className="space-y-2">
                            {apps.map(app => {
                                const invalid = !app.name?.trim() || !app.description?.trim();
                                return (
                                    <div key={app.id} className="group flex items-center justify-between p-4 bg-page-bg border border-border rounded-lg hover:border-emerald-200/60 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-8 h-8 rounded bg-gradient-to-br ${app.color} opacity-50`}></div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <div className="text-sm font-bold text-primary">{app.name}</div>
                                                    {invalid && (
                                                        <span className="text-[9px] text-amber-600 flex items-center gap-1 uppercase font-mono">
                                                            <AlertTriangle size={10} /> Needs details
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-[10px] font-mono text-secondary uppercase">{app.category} / {app.subCategory || 'General'}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => setEditingApp(app)} className="p-2 text-secondary hover:text-primary transition-colors">
                                                <Edit2 size={14} />
                                            </button>
                                            <button onClick={() => handleDeleteApp(app.id)} className="p-2 text-secondary hover:text-red-500 transition-colors">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                </div>

            </div>
        </div>
    </div>
  );
};
