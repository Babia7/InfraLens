import React, { Suspense, useEffect, useState } from 'react';
import { HashRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { SectionType } from './types';
import { InfraLensProvider } from './context/InfraLensContext';
import { Loader2 } from 'lucide-react';
import { toolsRegistry } from './config/toolsRegistry';
import { Toaster } from 'sonner';

const LoadingSpinner = () => (
  <div className="min-h-screen bg-page-bg flex items-center justify-center text-zinc-500">
     <div className="flex flex-col items-center gap-4">
        <Loader2 size={32} className="animate-spin text-blue-500" />
        <span className="font-mono text-[10px] uppercase tracking-[0.2em]">Initializing Module...</span>
     </div>
  </div>
);

/**
 * RouteView: A unified wrapper for all tool components.
 * It injects the standard `onNavigate` and `onBack` props,
 * plus any tool-specific props defined in the registry.
 */
const RouteView = ({ section }: { section: SectionType }) => {
  const navigate = useNavigate();
  const tool = toolsRegistry[section];

  // If the registry doesn't have this section (shouldn't happen if typed correctly), fallback
  if (!tool) return <Navigate to="/" replace />;

  const Component = tool.component as React.ComponentType<any>;

  const handleNavigate = (target: SectionType) => {
    const targetTool = toolsRegistry[target];
    if (targetTool) navigate(targetTool.path);
  };

  const handleBack = () => {
    const parentId = tool.parentId || SectionType.HOME;
    const parentTool = toolsRegistry[parentId];
    if (parentTool) navigate(parentTool.path);
  };

  return (
    <Component 
      onNavigate={handleNavigate} 
      onBack={handleBack} 
      {...(tool.props || {})} 
    />
  );
};

function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window === 'undefined') return 'dark';
    const saved = localStorage.getItem('infralens_theme') as 'dark' | 'light' | null;
    if (saved) return saved;
    return 'dark'; // default to dark mode
  });

  useEffect(() => {
    document.documentElement.classList.remove('theme-dark', 'theme-light');
    document.documentElement.classList.add(theme === 'light' ? 'theme-light' : 'theme-dark');
    localStorage.setItem('infralens_theme', theme);
  }, [theme]);

  return (
    <InfraLensProvider>
      <Toaster 
        position="top-center" 
        richColors 
        closeButton 
        theme={theme === 'light' ? 'light' : 'dark'}
      />
      <div className="antialiased min-h-screen bg-page-bg">
         <Suspense fallback={<LoadingSpinner />}>
            <HashRouter>
              <div className="sticky top-0 z-50 bg-page-bg/80 backdrop-blur border-b border-border px-4 md:px-8 py-3 flex items-center justify-between">
                <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-secondary">InfraLens</div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-secondary hidden sm:inline">Theme</span>
                  <button
                    onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                    className="px-3 py-1.5 rounded-full text-[11px] font-semibold border border-border bg-card-bg hover:border-emerald-400/60 transition"
                    aria-label="Toggle theme"
                  >
                    {theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
                  </button>
                </div>
              </div>
               <Routes>
                  {Object.values(toolsRegistry).map((tool) => (
                    <Route 
                      key={tool.id}
                      path={tool.path} 
                      element={<RouteView section={tool.id} />} 
                    />
                  ))}

                  {/* Legacy path redirect for SystemAbout */}
                  <Route path="/system" element={<Navigate to="/system-about" replace />} />
                  
                  {/* Fallback for unknown routes */}
                  <Route path="*" element={<Navigate to="/" replace />} />
               </Routes>
            </HashRouter>
         </Suspense>
      </div>
    </InfraLensProvider>
  );
}

export default App;
