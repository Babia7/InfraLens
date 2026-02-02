
import React, { useState } from 'react';
import { BookItem, BookSummary } from '@/types';
import { ArrowLeft, BookOpen, Info, Layers, CheckCircle2, ArrowUpRight, Save, Download, ShieldCheck, FileText, Activity } from 'lucide-react';
import { useInfraLens } from '@/context/InfraLensContext';

interface BookShelfProps {
  onBack: () => void;
  startAbout?: boolean;
}

export const BookShelf: React.FC<BookShelfProps> = ({ onBack, startAbout = false }) => {
  const { books } = useInfraLens();
  const [selectedBook, setSelectedBook] = useState<BookItem | null>(null);
  const [summary, setSummary] = useState<BookSummary | null>(null);
  const [showAbout, setShowAbout] = useState(startAbout);

  const visibleBooks = books.filter(b => !b.hidden);

  const handleBookClick = (book: BookItem) => {
    setSelectedBook(book);
    setSummary(book.preloadedSummary || null);
  };

  const closeReader = () => {
    setSelectedBook(null);
    setSummary(null);
  };

  const handleExportMarkdown = () => {
    const content = `# ARCHITECTURE CODEX: ARISTA FIELD SPEC
## GENERATED: ${new Date().toLocaleString()}

### 1. MISSION
High-fidelity extraction of deployment logic and hardware constraints from Arista technical artifacts.

### 2. CATALOG
${visibleBooks.map((b, i) => `- [${b.type}] **${b.title}**: ${b.review}`).join('\n')}

[END OF CODEX EXPORT]`;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'architecture-codex.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (showAbout) {
    return (
        <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col md:flex-row overflow-hidden selection:bg-indigo-500/30">
          <aside className="no-print w-full md:w-72 border-b md:border-b-0 md:border-r border-zinc-800 bg-zinc-950 flex flex-col shrink-0 z-30">
             <div className="p-8 flex items-center gap-3">
                <button onClick={() => setShowAbout(false)} className="p-2 -ml-2 text-zinc-500 hover:text-white rounded-lg hover:bg-zinc-900 transition-colors">
                   <ArrowLeft size={18} />
                </button>
                <div className="flex flex-col">
                    <span className="font-serif font-bold text-lg tracking-tight leading-none">The Codex</span>
                    <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mt-1">Field Version 3.3</span>
                </div>
             </div>
             <nav className="flex-1 px-4 space-y-2 pt-4">
                <button onClick={() => window.print()} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all border border-indigo-500/20 group">
                    <Save size={18} />
                    <span className="text-sm font-bold uppercase tracking-wider">Export PDF</span>
                </button>
                <button onClick={handleExportMarkdown} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-800 text-zinc-400 hover:bg-white hover:text-black transition-all border border-zinc-700 group">
                    <Download size={18} />
                    <span className="text-sm font-bold uppercase tracking-wider">Save .MD</span>
                </button>
             </nav>
             <div className="p-6 border-t border-zinc-900">
                <button onClick={onBack} className="text-xs text-zinc-500 hover:text-white flex items-center gap-2 uppercase tracking-widest"><ArrowLeft size={12}/> Systems Return</button>
             </div>
          </aside>
          <main className="no-print flex-1 overflow-y-auto bg-[#09090b] p-8 md:p-20 relative">
             <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.01)_1px,transparent_1px)] bg-[length:40px_40px] pointer-events-none"></div>
             <div className="max-w-4xl mx-auto space-y-12 animate-fade-in pb-32">
                <h1 className="text-6xl md:text-8xl font-serif font-bold tracking-tighter">Architecture Codex</h1>
                <p className="text-2xl text-indigo-400 font-light border-l-2 border-indigo-500/30 pl-8">Intelligence deconstruction for the modern Systems Engineer. Curated from validated designs and ASIC specifications.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl">
                        <h3 className="font-bold text-xl mb-4 text-white">Verification Stack</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed">The Codex is curated from validated designs and field-reviewed artifacts. Summaries are updated against hardware revisions and EOS release cycles to keep guidance current.</p>
                    </div>
                    <div className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl">
                        <h3 className="font-bold text-xl mb-4 text-white">Value Mapping</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed">We move beyond "What it is" into "How it deploys" and "Why it wins." Every deconstruction maps technical features directly to customer business outcomes.</p>
                    </div>
                </div>
             </div>
          </main>
        </div>
    );
  }

  if (selectedBook) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-page-bg text-white font-sans selection:bg-indigo-500/30 animate-fade-in">
        <div className="max-w-5xl mx-auto p-8 md:p-16">
          <header className="mb-16 border-b border-zinc-800 pb-8">
            <button onClick={closeReader} className="group mb-8 flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Codex
            </button>
            <div className="flex items-center gap-4 mb-6">
               <span className="font-mono text-[10px] uppercase tracking-[0.2em] px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/5 text-indigo-400">Validated Artifact</span>
               <div className="h-px w-8 bg-zinc-800"></div>
            </div>
            <h1 className="text-5xl md:text-8xl font-serif font-bold tracking-tighter mb-6 text-white leading-[0.9]">{selectedBook.title}</h1>
            <p className="text-xl md:text-2xl text-zinc-400 font-sans font-light flex items-center gap-3">
               <span className="text-zinc-600 uppercase font-mono text-sm tracking-widest">Type:</span> 
               <span className="text-white font-medium">{selectedBook.type}</span>
            </p>
          </header>

          {summary ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 pb-24">
              <div className="lg:col-span-8 space-y-16">
                <section>
                   <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-500 mb-6 flex items-center gap-2"><Activity size={16} className="text-indigo-400" /> Strategic Context</h3>
                   <p className="text-lg md:text-xl text-zinc-200 font-sans leading-relaxed md:leading-loose tracking-wide italic">"{summary.intro}"</p>
                </section>
                <section>
                   <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-500 mb-8 flex items-center gap-2"><Layers size={16} className="text-indigo-400" /> Deployment Pillars</h3>
                   <div className="space-y-12">
                      {summary.keyIdeas.map((idea, idx) => (
                        <div key={idx} className="relative pl-8 border-l-2 border-zinc-800 hover:border-indigo-500 transition-colors">
                           <span className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-page-bg border-2 border-zinc-800"></span>
                           <h4 className="text-2xl font-bold text-white mb-4 font-serif">{idea.heading}</h4>
                           <p className="text-lg text-zinc-400 leading-relaxed font-light">{idea.body}</p>
                        </div>
                      ))}
                   </div>
                </section>
                <section className="p-8 md:p-12 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
                   <div className="absolute top-0 right-0 p-8 opacity-5"><ShieldCheck size={120} /></div>
                   <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-500 mb-4 flex items-center gap-2"><CheckCircle2 size={16} /> Business Outcome</h3>
                   <p className="text-lg md:text-xl text-zinc-100 leading-relaxed font-medium">"{summary.conclusion}"</p>
                </section>
              </div>
              <div className="lg:col-span-4 space-y-8">
                 <div className="sticky top-8">
                    <div className="p-8 border border-zinc-800 rounded-[2rem] bg-zinc-900/30 backdrop-blur-sm space-y-8">
                        <div className={`w-full aspect-[3/4] rounded-2xl shadow-2xl border border-zinc-800 bg-gradient-to-br ${selectedBook.coverColor} p-8 flex flex-col justify-between relative overflow-hidden group`}>
                             <div className="absolute inset-0 bg-zinc-950/40 mix-blend-multiply"></div>
                             <div className="relative z-10 flex justify-between items-start">
                                <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-white/50 border border-white/10 px-2 py-1 rounded w-fit block">Arista_Field_Spec</span>
                                <FileText size={20} className="text-white/30" />
                             </div>
                             <div className="relative z-10">
                                <h1 className="font-serif font-black text-4xl text-white leading-[0.85] tracking-tight break-words">{selectedBook.title}</h1>
                                <p className="font-mono text-[10px] text-white/50 mt-6 uppercase tracking-widest">{selectedBook.author}</p>
                             </div>
                        </div>
                        <div>
                            <span className="block text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-600 mb-3">Field Review</span>
                           <p className="text-zinc-400 italic text-sm leading-relaxed">"{selectedBook.review}"</p>
                        </div>
                        <div className="h-px bg-zinc-800 w-full"></div>
                        <div className="space-y-4">
                           <div className="flex justify-between text-[10px] uppercase font-mono tracking-widest text-zinc-500"><span>Kernel</span><span className="text-zinc-300">Curated v3</span></div>
                           <div className="flex justify-between text-[10px] uppercase font-mono tracking-widest text-zinc-500"><span>Source</span><span className="text-zinc-300">Internal Depot</span></div>
                        </div>
                        <button 
                           onClick={closeReader}
                           className="w-full py-4 bg-zinc-950 hover:bg-white hover:text-black border border-zinc-800 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all"
                        >
                           Close Dossier
                        </button>
                    </div>
                 </div>
              </div>
            </div>
          ) : <div className="text-center py-20 text-zinc-500">No curated summary available for this entry yet.</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page-bg text-primary font-sans p-8 md:p-16 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        <header className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12 relative z-10">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-indigo-500"><BookOpen size={24} /><span className="font-mono text-xs uppercase tracking-[0.4em]">Architecture Codex v3.3</span></div>
            <h1 className="text-6xl md:text-9xl font-serif font-black tracking-tighter text-white leading-none">The <span className="text-zinc-800 italic">Codex</span></h1>
            <p className="font-sans text-zinc-500 text-xl max-w-2xl font-light leading-relaxed">High-fidelity deconstruction of Arista validated designs and competitive logic. Curated from field-reviewed technical sources.</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setShowAbout(true)} className="px-8 py-4 rounded-full border border-zinc-700 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all flex items-center gap-3 font-sans text-sm font-bold uppercase tracking-widest"><Info size={18} /> About Codex</button>
            <button onClick={onBack} className="w-16 h-16 rounded-full border border-zinc-700 hover:bg-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white transition-all shadow-2xl"><ArrowLeft size={24} /></button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-32">
          {visibleBooks.map((book, idx) => (
            <div key={book.id} onClick={() => handleBookClick(book)} className="group cursor-pointer relative aspect-[3.5/5] bg-zinc-900/30 border border-zinc-800/50 hover:border-indigo-500/50 transition-all duration-500 flex flex-col justify-between overflow-hidden rounded-[2.5rem] shadow-2xl">
               <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${book.coverColor} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-1000 pointer-events-none`}></div>
               <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${book.coverColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
               
               <div className="p-10 relative z-10 h-full flex flex-col">
                  <div className="flex justify-between items-start mb-12 opacity-50 group-hover:opacity-100 transition-opacity">
                     <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-[0.4em] border border-zinc-800 px-3 py-1 rounded-full">{book.type}</span>
                     <Activity size={14} className="text-zinc-700" />
                  </div>
                  <h3 className="text-4xl md:text-5xl font-serif font-bold text-white leading-[0.9] tracking-tight break-words group-hover:translate-x-2 transition-transform duration-700">{book.title}</h3>
                  
                  <div className="mt-auto space-y-6">
                     <p className="text-zinc-500 text-sm leading-relaxed line-clamp-3 font-light group-hover:text-zinc-300 transition-colors">"{book.review}"</p>
                     <div className="flex items-center justify-between pt-6 border-t border-zinc-800/50">
                        <div className="flex gap-2">
                           {book.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="text-[8px] font-mono text-zinc-600 uppercase border border-zinc-800 px-2 py-0.5 rounded">{tag}</span>
                           ))}
                        </div>
                        <div className="flex items-center gap-2 text-white font-bold uppercase tracking-[0.2em] text-[10px]">
                           <span className={`text-transparent bg-clip-text bg-gradient-to-r ${book.coverColor}`}>Deconstruct</span>
                           <ArrowUpRight size={14} className="text-zinc-700 group-hover:text-white transition-colors" />
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full p-8 flex justify-between items-center pointer-events-none z-0 opacity-20">
          <div className="text-[15vw] font-serif font-black text-zinc-900 select-none pointer-events-none leading-none -ml-4">CODEX</div>
      </div>
    </div>
  );
};
