
import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode, useRef } from 'react';
import { AppItem, BookItem, ConceptExplainer, RoadmapItem, GlobalConfig, SEPerformanceStep, Suggestion, AppCategory } from '../types';
import { initialApps, initialBooks, initialConcepts, initialRoadmap, initialGlobalConfig, initialSEPerformance, initialSuggestions } from '../data/initialData';
import { notifyError } from '@services/notifications';

interface InfraLensContextType {
  // Data Registry
  apps: AppItem[];
  setApps: React.Dispatch<React.SetStateAction<AppItem[]>>;
  suggestions: Suggestion[];
  setSuggestions: React.Dispatch<React.SetStateAction<Suggestion[]>>;
  books: BookItem[];
  setBooks: React.Dispatch<React.SetStateAction<BookItem[]>>;
  concepts: ConceptExplainer[];
  setConcepts: React.Dispatch<React.SetStateAction<ConceptExplainer[]>>;
  roadmap: RoadmapItem[];
  setRoadmap: React.Dispatch<React.SetStateAction<RoadmapItem[]>>;
  sePerformance: SEPerformanceStep[];
  setSEPerformance: React.Dispatch<React.SetStateAction<SEPerformanceStep[]>>;
  
  // System Config
  config: GlobalConfig;
  setConfig: React.Dispatch<React.SetStateAction<GlobalConfig>>;
  showAdminApps: boolean;
  setShowAdminApps: React.Dispatch<React.SetStateAction<boolean>>;
  
  // Operational Actions
  approveSuggestion: (id: string, targetCategory?: AppCategory) => void;
  denySuggestion: (id: string) => void;
  resetToDefaults: () => void;
}

const InfraLensContext = createContext<InfraLensContextType | undefined>(undefined);

/**
 * InfraLens Persistence Configuration
 */
export const DATA_VERSION = 'v1.3'; // Bumped to force clean slate after taxonomy updates
export const STORAGE_KEYS = {
  VERSION: 'infralens_version',
  APPS: 'infralens_field_apps',
  SUGGESTIONS: 'infralens_field_sug',
  BOOKS: 'infralens_field_books',
  CONCEPTS: 'infralens_field_concepts',
  ROADMAP: 'infralens_field_roadmap',
  SE_PERFORMANCE: 'infralens_field_performance',
  CONFIG: 'infralens_field_config',
  LAST_SAVED: 'infralens_last_saved',
  LAST_ERROR: 'infralens_last_error',
  ADMIN_VIEW: 'infralens_admin_view'
};

const LOCKED_APP_IDS = new Set([
  'app-ai-fabric-designer',
  'app-storage-architect',
  'app-release-notes',
  'app-cloudvision',
  'app-protocol-collision',
  'app-lifesciences-architect',
  'app-7280-selector',
  'app-7050-selector',
  'app-avd-studio',
  'app-transceiver-economics',
  'app-service-creation',
  'app-power-thermal',
  'app-ai-readiness',
  'app-runbook-builder',
  'app-campus-ai-ops'
]);

export const InfraLensProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  
  // --- ROBUST LOADER ---
  const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

  const loadState = <T,>(key: string, fallback: T): T => {
    if (!isBrowser) return fallback;
    try {
      // Version check to prevent schema corruption
      const version = localStorage.getItem(STORAGE_KEYS.VERSION);
      if (version !== DATA_VERSION) {
        return fallback; 
      }

      const saved = localStorage.getItem(key);
      if (!saved) return fallback;

      const parsed = JSON.parse(saved);
      // Basic type guard: if fallback is array, result must be array
      if (Array.isArray(fallback) && !Array.isArray(parsed)) return fallback;
      
      return parsed;
    } catch (e) {
      console.warn(`[InfraLens] Failed to load ${key}, using default.`, e);
      return fallback;
    }
  };

  // --- STATE INITIALIZATION ---
  const [apps, setApps] = useState<AppItem[]>(() => loadState(STORAGE_KEYS.APPS, initialApps));
  const [suggestions, setSuggestions] = useState<Suggestion[]>(() => loadState(STORAGE_KEYS.SUGGESTIONS, initialSuggestions));
  const [books, setBooks] = useState<BookItem[]>(() => loadState(STORAGE_KEYS.BOOKS, initialBooks));
  const [concepts, setConcepts] = useState<ConceptExplainer[]>(() => loadState(STORAGE_KEYS.CONCEPTS, initialConcepts));
  const [roadmap, setRoadmap] = useState<RoadmapItem[]>(() => loadState(STORAGE_KEYS.ROADMAP, initialRoadmap));
  const [sePerformance, setSEPerformance] = useState<SEPerformanceStep[]>(() => loadState(STORAGE_KEYS.SE_PERFORMANCE, initialSEPerformance));
  const [config, setConfig] = useState<GlobalConfig>(() => {
    const storedConfig = loadState(STORAGE_KEYS.CONFIG, initialGlobalConfig);
    return {
      ...initialGlobalConfig,
      ...storedConfig,
      tiles: {
        ...initialGlobalConfig.tiles,
        ...(storedConfig?.tiles ?? {})
      }
    };
  });
  const [showAdminApps, setShowAdminApps] = useState<boolean>(() => {
    if (!isBrowser) return false;
    return localStorage.getItem(STORAGE_KEYS.ADMIN_VIEW) === 'true';
  });

  // Ensure newly shipped apps appear even if localStorage has older lists
  useEffect(() => {
    const missing = initialApps.filter((app) => !apps.some((a) => a.id === app.id));
    if (missing.length) {
      setApps((prev) => [...prev, ...missing]);
    }
  }, [apps]);

  useEffect(() => {
    let changed = false;
    const next = apps.map((app) => {
      if (!LOCKED_APP_IDS.has(app.id) || app.adminOnly != null) return app;
      changed = true;
      return { ...app, adminOnly: true };
    });
    if (changed) {
      setApps(next);
    }
  }, [apps]);

  // --- CONSOLIDATED PERSISTENCE ---
  // Debounce writes to prevent IO thrashing during rapid updates
  useEffect(() => {
    if (!isBrowser) return;
    const handler = setTimeout(() => {
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
        localStorage.setItem(STORAGE_KEYS.ADMIN_VIEW, showAdminApps ? 'true' : 'false');
      } catch (e) {
        console.error("[InfraLens] Persistence failure (Quota Exceeded?)", e);
        try {
          localStorage.setItem(STORAGE_KEYS.LAST_ERROR, e instanceof Error ? e.message : 'Storage unavailable');
        } catch (err) {
          console.warn('[InfraLens] Failed to record persistence error', err);
        }
        notifyError('Could not save workspace', e instanceof Error ? e.message : 'Storage unavailable');
      }
    }, 1000);

    return () => clearTimeout(handler);
  }, [apps, suggestions, books, concepts, roadmap, sePerformance, config]);

  // --- OPERATIONAL LOGIC ---

  /**
   * Transfers an item from the proposal pool into the active registry.
   */
  const approveSuggestion = useCallback((id: string, targetCategory: AppCategory = 'Reasoning') => {
    setSuggestions(prev => {
      const suggestion = prev.find(s => s.id === id);
      if (!suggestion) return prev;

      // Type-safe construction of new AppItem, ensuring we don't carry over 'reason' field
      const newApp: AppItem = {
        id: suggestion.id,
        name: suggestion.name,
        description: suggestion.description,
        category: targetCategory,
        subCategory: suggestion.subCategory,
        tags: suggestion.tags,
        link: suggestion.link,
        internalRoute: suggestion.internalRoute,
        color: suggestion.color,
        featured: true,
        hidden: false
      };

      setApps(currentApps => [newApp, ...currentApps]);
      console.log(`[InfraLens] Added item: ${newApp.name} to ${targetCategory}`);
      
      // Return filtered list
      return prev.filter(s => s.id !== id);
    });
  }, []);

  /**
   * Removes a suggestion from the pool.
   */
  const denySuggestion = useCallback((id: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== id));
  }, []);

  /**
   * Safe Reset: Restores defaults by clearing only InfraLens keys.
   */
  const resetToDefaults = useCallback(() => {
    if (confirm("Reset Workspace: Are you sure you want to restore default data? All custom nodes and changes will be removed.")) {
      // 1. Clear State
      setApps(initialApps);
      setSuggestions(initialSuggestions);
      setBooks(initialBooks);
      setConcepts(initialConcepts);
      setRoadmap(initialRoadmap);
      setSEPerformance(initialSEPerformance);
      setConfig(initialGlobalConfig);

      // 2. Clear Specific Storage Keys (Safer than localStorage.clear())
      Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
      
      // 3. Reload to ensure clean mount
      window.location.reload();
    }
  }, []);

  return (
    <InfraLensContext.Provider value={{
      apps, setApps,
      suggestions, setSuggestions,
      books, setBooks,
      concepts, setConcepts,
      roadmap, setRoadmap,
      sePerformance, setSEPerformance,
      config, setConfig,
      showAdminApps, setShowAdminApps,
      approveSuggestion, 
      denySuggestion,
      resetToDefaults
    }}>
      {children}
    </InfraLensContext.Provider>
  );
};

/**
 * Access the InfraLens Unified Context
 */
export const useInfraLens = () => {
  const context = useContext(InfraLensContext);
  if (context === undefined) {
    throw new Error('useInfraLens must be used within an InfraLensProvider.');
  }
  return context;
};
