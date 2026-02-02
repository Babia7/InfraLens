import React, { useState } from 'react';
import { ConceptExplainer as ConceptType } from '../types';
import { ArrowLeft, X, ArrowRight, Circle, Square, Triangle, Copy, Layers, Hammer, Maximize2, Brain } from 'lucide-react';

interface ConceptExplainerProps {
  onBack: () => void;
}

// Curated content based on user persona (Design, Engineering, Productivity)
const curatedConcepts: ConceptType[] = [
  {
    id: 'c1',
    title: 'Systems Thinking',
    subtitle: 'See hidden patterns to solve problems with less effort.',
    tags: ['Mental Models', 'Engineering', 'Structure'],
    sections: [
      {
        heading: 'State & Flow',
        body: 'A "Stock" represents the system\'s current state (history). A "Flow" is the action changing it. Think of a runner: Fitness is the Stock (accumulated over years). Training is the Flow (daily input). You cannot "hack" the Stock with a single massive Flow; you must accumulate it over time.',
        visualPrompt: 'A simple line drawing of a rectangle (tank) with an arrow entering the top and an arrow exiting the bottom.'
      },
      {
        heading: 'Feedback Loops',
        body: 'Actions ripple back. "Balancing loops" keep things stable (like a thermostat), while "Reinforcing loops" make things spiral (like viral growth). If you can spot the loop, you stop being a victim of "unintended consequences" and start controlling the outcome.',
        visualPrompt: 'Two circular arrows interacting. One circle is solid, one is dashed, representing the two types of loops.'
      },
      {
        heading: 'Emergence',
        body: 'The whole is greater than the sum of its parts. Wetness isn\'t a property of a water molecule; it emerges when many molecules interact. You can\'t optimize a team by just optimizing individuals—you must optimize how they connect.',
        visualPrompt: 'A grid of small dots on the left transforming into a complex, unified shape on the right.'
      },
      {
        heading: 'Leverage Points',
        body: 'Don\'t push the boulder uphill. Find the "trim tab"—the tiny place where a small shift creates a massive result. Often, the best leverage point is the goal of the system itself. Change the goal, and the entire system reorients automatically.',
        visualPrompt: 'A fulcrum and lever diagram showing a small object lifting a large one.'
      }
    ]
  },
  {
    id: 'c2',
    title: 'The Flow State',
    subtitle: 'The optimal experience between anxiety and boredom.',
    tags: ['Psychology', 'Productivity', 'Focus'],
    sections: [
      {
        heading: 'The Sweet Spot',
        body: 'Flow exists in a specific channel. If the challenge exceeds your skill, you feel anxiety. If your skill exceeds the challenge, you feel boredom. Flow occurs when high challenge meets high skill, stretching you to your limit.',
        visualPrompt: 'A graph with "Challenge" on the Y-axis and "Skill" on the X-axis. A diagonal channel runs through the middle labeled "Flow".'
      },
      {
        heading: 'The Silent Mind',
        body: 'During flow, the prefrontal cortex—the home of the inner critic and self-consciousness—temporarily shuts down. You trade conscious processing for subconscious efficiency. You become the action.',
        visualPrompt: 'A stylized brain outline where the front section is faded out or dim, while the rest is bright.'
      },
      {
        heading: 'Intrinsic Reward',
        body: 'The activity becomes an end in itself. We do not work for the reward at the end; the work is the reward. The timeline collapses, and hours feel like minutes.',
        visualPrompt: 'A circle that loops back into itself infinitely, representing the self-contained nature of the experience.'
      }
    ]
  },
  {
    id: 'c3',
    title: 'First Principles',
    subtitle: 'Escaping the trap of analogy (Top-Down) by rebuilding from the bottom up.',
    tags: ['Reasoning', 'Mental Models', 'Innovation'],
    sections: [
      {
        heading: 'The Trap of Analogy (Top-Down)',
        body: 'Most thinking is "Top-Down"—copying what already exists with slight variations. This is reasoning by analogy. It\'s safe, but it limits you to what others have already done. It\'s like painting by numbers instead of creating art.',
        visualPrompt: 'A sequence of identical squares representing iterative thinking.'
      },
      {
        heading: 'Deconstruction (Bottom-Up)',
        body: 'First Principles is "Bottom-Up" thinking. You break a problem down to its most basic, foundational truths (the lego blocks). You strip away all assumptions, "best practices," and traditions until only the raw reality remains.',
        visualPrompt: 'A complex object breaking apart into its atomic components.'
      },
      {
        heading: 'Reconstruction',
        body: 'Once you have the raw pieces, you rebuild the solution from scratch. Because you aren\'t following a template, you can combine the pieces in completely new ways. This is how you innovate rather than just iterate.',
        visualPrompt: 'The atomic components reassembling into a completely new, novel structure.'
      }
    ]
  }
];

const ConceptVisual: React.FC<{ conceptId: string; sectionIdx: number }> = ({ conceptId, sectionIdx }) => {
  // Systems Thinking
  if (conceptId === 'c1') {
     if (sectionIdx === 0) {
        // State & Flow
        return (
           <svg viewBox="0 0 200 200" className="w-48 h-48 md:w-64 md:h-64">
              <defs>
                <linearGradient id="tankGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2"/>
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8"/>
                </linearGradient>
                <marker id="arrowBlue" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L0,6 L9,3 z" fill="#60a5fa" />
                </marker>
              </defs>
              {/* Tank */}
              <rect x="60" y="60" width="80" height="80" stroke="#3b82f6" strokeWidth="2" fill="url(#tankGradient)" rx="4" />
              {/* In Flow */}
              <path d="M100 20 v30" stroke="#60a5fa" strokeWidth="3" markerEnd="url(#arrowBlue)" className="animate-pulse" />
              {/* Out Flow */}
              <path d="M100 150 v30" stroke="#60a5fa" strokeWidth="3" markerEnd="url(#arrowBlue)" className="animate-pulse" />
              {/* Level */}
              <rect x="60" y="100" width="80" height="40" fill="#3b82f6" className="animate-pulse-slow opacity-50" />
           </svg>
        )
     }
     if (sectionIdx === 1) {
        // Feedback Loops
        return (
           <div className="relative w-48 h-48 md:w-64 md:h-64">
              {/* Reinforcing Loop */}
              <div className="absolute inset-0 border-[6px] border-emerald-500 rounded-full border-t-transparent animate-spin-slow opacity-80 shadow-[0_0_20px_rgba(16,185,129,0.3)]"></div>
              {/* Balancing Loop */}
              <div className="absolute inset-12 border-[4px] border-dashed border-rose-500 rounded-full border-b-transparent animate-spin-reverse opacity-80 shadow-[0_0_20px_rgba(244,63,94,0.3)]"></div>
              
              <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-xs uppercase tracking-widest text-primary">Loop Dynamics</div>
           </div>
        )
     }
     if (sectionIdx === 2) {
        // Emergence
        return (
           <div className="grid grid-cols-5 gap-3 w-40 h-40 md:w-48 md:h-48 items-center justify-center">
              {[...Array(25)].map((_, i) => (
                 <div 
                   key={i} 
                   className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-1000 shadow-[0_0_10px_currentColor] ${i % 2 === 0 ? 'animate-bounce bg-fuchsia-500' : 'animate-pulse bg-indigo-500'}`} 
                   style={{ animationDelay: `${i * 100}ms`}} 
                 />
              ))}
           </div>
        )
     }
     if (sectionIdx === 3) {
        // Leverage Points
        return (
           <div className="relative w-48 h-36 md:w-64 md:h-48 flex items-end justify-center mb-8 md:mb-12">
               {/* Fulcrum */}
               <div className="w-0 h-0 border-l-[10px] border-l-transparent border-b-[20px] border-b-orange-500 border-r-[10px] border-r-transparent mx-auto absolute bottom-0 left-1/2 -translate-x-8 shadow-[0_0_20px_#f97316]"></div>
               {/* Lever */}
               <div className="absolute bottom-[20px] left-4 right-4 h-1.5 bg-border transform -rotate-6 origin-[45%_50%] rounded-full"></div>
               {/* Small effort (Input) */}
               <div className="absolute left-6 md:left-8 bottom-[50px] w-6 h-6 md:w-8 md:h-8 border-2 border-cyan-400 rounded-full animate-bounce flex items-center justify-center shadow-[0_0_15px_#22d3ee]">
                   <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-cyan-400 rounded-full"></div>
               </div>
               {/* Large load (Output) */}
               <div className="absolute right-6 md:right-8 bottom-[10px] w-16 h-16 md:w-20 md:h-20 bg-card-bg border border-border rounded-lg flex items-center justify-center">
                    <span className="text-[10px] font-mono text-secondary">OUTCOME</span>
               </div>
           </div>
        )
     }
  }

  // Flow State
  if (conceptId === 'c2') {
     if (sectionIdx === 0) {
        // The Sweet Spot
        return (
          <div className="w-56 h-56 md:w-64 md:h-64 relative border-l-2 border-b-2 border-border">
             <div className="absolute -left-6 bottom-1/2 -rotate-90 text-[10px] font-mono text-secondary tracking-widest">CHALLENGE</div>
             <div className="absolute bottom-[-24px] left-1/2 -translate-x-1/2 text-[10px] font-mono text-secondary tracking-widest">SKILL</div>
             
             {/* Anxiety Zone */}
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-rose-900/20 to-transparent clip-path-polygon(0 0, 100% 0, 0 100%) pointer-events-none"></div>
             
             {/* Boredom Zone */}
             <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-zinc-800/50 to-transparent clip-path-polygon(100% 100%, 100% 0, 0 100%) pointer-events-none"></div>

            {/* Flow Channel */}
            <div className="absolute bottom-0 left-0 w-full h-full">
               <div className="w-[140%] h-12 bg-indigo-500/30 border-y border-indigo-400 blur-sm absolute bottom-0 left-0 transform -rotate-45 origin-bottom-left animate-pulse-slow"></div>
               <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary font-bold tracking-widest">FLOW</div>
            </div>
         </div>
       );
    }
    if (sectionIdx === 1) {
        // The Silent Mind
        return (
          <div className="relative w-48 h-48 md:w-64 md:h-64">
              <Brain size={192} strokeWidth={1} className="text-secondary absolute inset-0 w-full h-full opacity-50" />
              {/* Active Subconscious */}
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                 <Brain size={192} strokeWidth={1} className="text-indigo-400 absolute inset-0 w-full h-full opacity-100 clip-path-polygon(30% 0, 100% 0, 100% 100%, 30% 100%) animate-pulse" />
              </div>
              {/* Quiet Frontal Lobe */}
              <div className="absolute top-0 left-0 w-[35%] h-full flex items-center justify-center">
                 <span className="text-xs font-mono text-secondary uppercase tracking-wide">Quiet</span>
              </div>
           </div>
        );
     }
     if (sectionIdx === 2) {
        // Intrinsic Reward
        return (
           <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
               <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
                   <path 
                     d="M20,25 C20,10 40,10 50,25 C60,40 80,40 80,25 C80,10 60,10 50,25 C40,40 20,40 20,25" 
                     fill="none" 
                     stroke="#a855f7" 
                     strokeWidth="4" 
                     className="drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]"
                   >
                     <animate attributeName="stroke-dasharray" from="0, 200" to="200, 0" dur="3s" repeatCount="indefinite" />
                   </path>
               </svg>
               <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_15px_white] animate-ping"></div>
               </div>
           </div>
        );
     }
  }

  // First Principles
  if (conceptId === 'c3') {
     if (sectionIdx === 0) {
        // The Trap of Analogy (Conveyor Belt)
        return (
          <div className="flex gap-4 items-center justify-center w-full h-48">
              {[...Array(3)].map((_, i) => (
                 <div key={i} className="w-12 h-12 md:w-16 md:h-16 border-2 border-zinc-600 rounded-lg flex items-center justify-center opacity-50">
                    <Copy size={20} className="text-zinc-600" />
                 </div>
              ))}
              <div className="w-12 h-12 md:w-16 md:h-16 border-2 border-rose-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(244,63,94,0.3)] animate-pulse">
                  <Copy size={20} className="text-rose-500" />
              </div>
          </div>
        );
     }
     if (sectionIdx === 1) {
        // Deconstruction (Exploded View)
        return (
           <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
               <div className="absolute w-8 h-8 bg-indigo-500 rounded shadow-[0_0_15px_#6366f1] animate-float"></div>
               <div className="absolute w-8 h-8 bg-purple-500 rounded shadow-[0_0_15px_#a855f7] top-10 left-10 animate-float-delayed"></div>
               <div className="absolute w-8 h-8 bg-blue-500 rounded shadow-[0_0_15px_#3b82f6] bottom-10 right-10 animate-float"></div>
               <div className="absolute w-8 h-8 bg-emerald-500 rounded shadow-[0_0_15px_#10b981] top-10 right-10 animate-float-delayed"></div>
               <div className="absolute w-8 h-8 bg-orange-500 rounded shadow-[0_0_15px_#f97316] bottom-10 left-10 animate-float"></div>
               
               <div className="absolute inset-0 border border-dashed border-zinc-700 rounded-full animate-spin-slower"></div>
           </div>
        );
     }
     if (sectionIdx === 2) {
        // Reconstruction (New Shape)
        return (
           <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
              <div className="grid grid-cols-2 gap-1 rotate-45 transform scale-110">
                  <div className="w-10 h-10 bg-indigo-500 rounded-tl-2xl shadow-[0_0_20px_#6366f1] animate-pulse"></div>
                  <div className="w-10 h-10 bg-purple-500 rounded-tr-2xl shadow-[0_0_20px_#a855f7] animate-pulse delay-75"></div>
                  <div className="w-10 h-10 bg-emerald-500 rounded-bl-2xl shadow-[0_0_20px_#10b981] animate-pulse delay-150"></div>
                  <div className="w-10 h-10 bg-orange-500 rounded-br-2xl shadow-[0_0_20px_#f97316] animate-pulse delay-200"></div>
              </div>
              <div className="absolute -bottom-8 text-xs font-mono text-primary uppercase tracking-widest">Novel Form</div>
           </div>
        );
     }
  }

  return <div className="w-32 h-32 bg-card-bg rounded-full animate-pulse"></div>;
};


export const ConceptExplainer: React.FC<ConceptExplainerProps> = ({ onBack }) => {
  const [selectedConcept, setSelectedConcept] = useState<ConceptType | null>(null);

  // Gallery View
  if (!selectedConcept) {
    return (
      <div className="min-h-screen bg-page-bg text-primary p-8 md:p-16 font-sans selection:bg-indigo-500/30">
        <div className="max-w-7xl mx-auto">
          <header className="mb-20">
            <button 
              onClick={onBack}
              className="group mb-8 flex items-center gap-2 text-secondary hover:text-primary transition-colors text-sm font-medium"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
            </button>
            <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tighter mb-4 text-primary">
              Visual Essays
            </h1>
            <p className="text-xl text-secondary font-sans max-w-2xl">
              Deconstructing mental models into high-fidelity abstract visualizations.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {curatedConcepts.map((concept) => (
              <div 
                key={concept.id}
                onClick={() => setSelectedConcept(concept)}
                className="group relative bg-card-bg border border-border rounded-3xl p-8 cursor-pointer hover:-translate-y-2 transition-transform duration-300 hover:shadow-2xl hover:border-emerald-500/30"
              >
                 <div className="absolute top-8 right-8 w-10 h-10 rounded-full bg-card-bg flex items-center justify-center text-secondary group-hover:bg-primary group-hover:text-black transition-colors">
                    <ArrowRight size={18} />
                 </div>

                 <div className="mb-12 mt-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-border to-card-bg border border-border mb-6 flex items-center justify-center group-hover:border-primary/20 transition-colors shadow-lg">
                        {concept.id === 'c1' && <Layers size={28} className="text-blue-400" />}
                        {concept.id === 'c2' && <Maximize2 size={28} className="text-purple-400" />}
                        {concept.id === 'c3' && <Hammer size={28} className="text-rose-400" />}
                    </div>
                    <h2 className="text-3xl font-serif font-bold text-primary mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary transition-all">
                        {concept.title}
                    </h2>
                    <p className="text-secondary text-sm leading-relaxed">
                        {concept.subtitle}
                    </p>
                 </div>

                 <div className="flex flex-wrap gap-2 mt-auto">
                    {concept.tags.map(tag => (
                        <span key={tag} className="text-[10px] uppercase tracking-wider font-bold text-secondary border border-border px-2 py-1 rounded bg-card-bg">
                            {tag}
                        </span>
                    ))}
                 </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Reader View (Essay)
  return (
    <div className="min-h-screen bg-page-bg text-primary font-sans overflow-x-hidden">
        {/* Navigation Bar */}
        <nav className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm md:backdrop-blur-none pointer-events-none">
            <div className="flex items-center gap-4 pointer-events-auto">
                <button 
                    onClick={() => setSelectedConcept(null)}
                    className="w-10 h-10 rounded-full bg-card-bg/80 border border-border flex items-center justify-center text-primary hover:bg-primary hover:text-black transition-all shadow-lg backdrop-blur-md"
                >
                    <X size={18} />
                </button>
                <span className="font-mono text-xs uppercase tracking-widest text-zinc-400 hidden md:block">
                    {selectedConcept.title}
                </span>
            </div>
            <div className="pointer-events-auto">
                 <button className="px-4 py-2 bg-card-bg/80 border border-border rounded-full text-xs font-bold uppercase tracking-wide text-secondary hover:text-primary transition-colors backdrop-blur-md">
                    Share
                 </button>
            </div>
        </nav>

        {selectedConcept.sections.map((section, idx) => (
            <section key={idx} className="min-h-screen flex flex-col md:grid md:grid-cols-2 relative border-b border-zinc-900">
                
                {/* Visual Side (Top on mobile, Right on desktop) */}
        <div className="h-[50vh] md:h-auto md:order-2 flex items-center justify-center bg-card-bg/50 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800/20 via-zinc-950 to-zinc-950 pointer-events-none"></div>
                    <div className="relative z-10 scale-90 md:scale-100 transition-transform hover:scale-105 duration-700">
                        <ConceptVisual conceptId={selectedConcept.id} sectionIdx={idx} />
                    </div>
                    {/* Section Number Background */}
                    <div className="absolute right-4 bottom-4 md:right-10 md:bottom-10 text-[10rem] md:text-[20rem] font-serif font-black text-zinc-900 select-none z-0 leading-none">
                        {idx + 1}
                    </div>
                </div>

                {/* Text Side (Bottom on mobile, Left on desktop) */}
                <div className="h-auto min-h-[50vh] md:h-auto md:order-1 flex flex-col justify-center p-8 md:p-24 bg-page-bg relative z-10 border-t md:border-t-0 md:border-r border-zinc-900">
                    <div className="max-w-xl">
                        <span className="font-mono text-xs text-indigo-400 uppercase tracking-widest mb-6 block">
                            {idx === 0 ? 'Concept' : idx === selectedConcept.sections.length - 1 ? 'Synthesis' : 'Mechanic'}
                        </span>
                        <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-8 leading-tight">
                            {section.heading}
                        </h2>
                        <p className="text-lg md:text-xl text-zinc-400 leading-relaxed font-light">
                            {section.body}
                        </p>
                    </div>
                </div>

            </section>
        ))}

        {/* Footer Navigation */}
        <div className="h-[50vh] flex flex-col items-center justify-center bg-card-bg text-center p-8 border-t border-border">
             <h3 className="text-zinc-500 font-serif text-2xl mb-6 italic">End of Essay</h3>
             <button 
                onClick={() => setSelectedConcept(null)}
                className="px-8 py-4 bg-card-bg text-primary rounded-full font-bold text-sm uppercase tracking-widest border border-border hover:border-primary transition-all shadow-[0_0_30px_rgba(255,255,255,0.05)]"
             >
                Return to Gallery
             </button>
        </div>
    </div>
  );
};
