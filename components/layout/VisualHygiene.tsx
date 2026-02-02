
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Eye, Play, Pause, RotateCcw, Activity, Move, Maximize, CircleDashed } from 'lucide-react';

interface VisualHygieneProps {
  onBack: () => void;
}

type DrillType = 'PURSUIT' | 'PERIPHERAL' | 'ACCOMMODATION' | null;

// --- DRILL COMPONENTS ---

const SmoothPursuit = ({ isPlaying }: { isPlaying: boolean }) => {
  // Use CSS animation for smoothest 60fps performance without JS overhead
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.05)_1px,transparent_1px)] bg-[length:50px_50px]"></div>
      
      {/* Moving Target */}
      <div 
        className={`w-8 h-8 bg-cyan-400 rounded-full shadow-[0_0_30px_#22d3ee] absolute will-change-transform ${isPlaying ? 'animate-[figure8_8s_linear_infinite]' : ''}`}
        style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
      >
         <div className="absolute inset-0 bg-white rounded-full scale-50"></div>
      </div>

      <style>{`
        @keyframes figure8 {
          0%   { transform: translate(0, 0); }
          25%  { transform: translate(40vw, 20vh); }
          50%  { transform: translate(0, -20vh); }
          75%  { transform: translate(-40vw, 20vh); }
          100% { transform: translate(0, 0); }
        }
      `}</style>
    </div>
  );
};

const PeripheralPulse = ({ isPlaying }: { isPlaying: boolean }) => {
  const [activeDot, setActiveDot] = useState<number | null>(null);

  useEffect(() => {
    if (!isPlaying) {
      setActiveDot(null);
      return;
    }

    const interval = setInterval(() => {
      // Random quadrant 0-3
      const nextDot = Math.floor(Math.random() * 4);
      setActiveDot(nextDot);
      // Clear quickly
      setTimeout(() => setActiveDot(null), 400); 
    }, 1500);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black">
       {/* Central Fixation */}
       <div className="relative z-10 w-4 h-4">
          <div className="absolute inset-0 bg-red-500 rounded-full animate-pulse"></div>
          <div className="absolute -inset-4 border border-red-900 rounded-full"></div>
          <div className="absolute -inset-1 border border-red-500/50 rounded-full"></div>
       </div>
       <div className="absolute mt-12 text-xs text-zinc-600 font-mono tracking-widest uppercase">Lock Eyes Here</div>

       {/* Peripheral Stimuli */}
       {/* Top Left */}
       <div className={`absolute top-[10%] left-[10%] w-32 h-32 bg-cyan-500/20 blur-3xl rounded-full transition-opacity duration-200 ${activeDot === 0 ? 'opacity-100' : 'opacity-0'}`}></div>
       {/* Top Right */}
       <div className={`absolute top-[10%] right-[10%] w-32 h-32 bg-cyan-500/20 blur-3xl rounded-full transition-opacity duration-200 ${activeDot === 1 ? 'opacity-100' : 'opacity-0'}`}></div>
       {/* Bottom Right */}
       <div className={`absolute bottom-[10%] right-[10%] w-32 h-32 bg-cyan-500/20 blur-3xl rounded-full transition-opacity duration-200 ${activeDot === 2 ? 'opacity-100' : 'opacity-0'}`}></div>
       {/* Bottom Left */}
       <div className={`absolute bottom-[10%] left-[10%] w-32 h-32 bg-cyan-500/20 blur-3xl rounded-full transition-opacity duration-200 ${activeDot === 3 ? 'opacity-100' : 'opacity-0'}`}></div>
    </div>
  );
};

const AccommodationBreathing = ({ isPlaying }: { isPlaying: boolean }) => {
  // Simulates depth change via scale/blur
  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden">
       {/* Tunnel Effect */}
       {[...Array(5)].map((_, i) => (
          <div 
            key={i}
            className={`absolute border border-cyan-500/30 rounded-full ${isPlaying ? 'animate-[tunnel_10s_ease-in-out_infinite]' : ''}`}
            style={{ 
              width: `${(i + 1) * 200}px`, 
              height: `${(i + 1) * 200}px`,
              animationDelay: `${i * 0.2}s`,
              animationPlayState: isPlaying ? 'running' : 'paused'
            }}
          ></div>
       ))}

       {/* Focal Object */}
       <div 
          className={`flex flex-col items-center justify-center ${isPlaying ? 'animate-[depthShift_8s_ease-in-out_infinite]' : ''}`}
          style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
       >
          <div className="text-6xl font-bold font-serif text-white tracking-widest mb-4">FOCUS</div>
          <div className="w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_20px_#22d3ee]"></div>
       </div>

       <style>{`
        @keyframes tunnel {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
        @keyframes depthShift {
          0%, 100% { 
            transform: scale(1); 
            filter: blur(0px); 
            opacity: 1;
          }
          50% { 
            transform: scale(0.2); 
            filter: blur(4px); 
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
};

// --- MAIN COMPONENT ---

export const VisualHygiene: React.FC<VisualHygieneProps> = ({ onBack }) => {
  const [activeDrill, setActiveDrill] = useState<DrillType>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // Default 60s
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsPlaying(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, timeLeft]);

  const startDrill = (drill: DrillType) => {
    setActiveDrill(drill);
    setTimeLeft(60); // Reset time
    setIsPlaying(true);
  };

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const stopDrill = () => {
    setIsPlaying(false);
    setActiveDrill(null);
    setTimeLeft(60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="min-h-screen bg-black text-cyan-50 font-sans selection:bg-cyan-900/50 flex flex-col">
      
      {/* HEADER */}
      <header className="h-16 border-b border-zinc-900 flex items-center justify-between px-6 bg-zinc-950 shrink-0 z-20">
        <div className="flex items-center gap-6">
            <button 
                onClick={activeDrill ? stopDrill : onBack}
                className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
            >
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
                {activeDrill ? 'End Session' : 'InfraLens'}
            </button>
            <div className="h-4 w-px bg-zinc-800"></div>
            <div className="flex items-center gap-2">
                <Eye size={18} className="text-cyan-500" />
                <h1 className="font-serif font-bold text-lg tracking-tight">Visual Hygiene</h1>
            </div>
        </div>
        
        {activeDrill && (
            <div className="flex items-center gap-6">
                <div className="font-mono text-xl tabular-nums text-cyan-400">
                    {formatTime(timeLeft)}
                </div>
                <button 
                    onClick={togglePlay} 
                    className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white hover:border-cyan-500 transition-colors"
                >
                    {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                </button>
            </div>
        )}
      </header>

      {/* CONTENT */}
      <main className="flex-1 relative overflow-hidden">
         {!activeDrill ? (
            // DASHBOARD VIEW
            <div className="h-full flex flex-col items-center justify-center p-8 animate-fade-in">
                <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Card 1: Smooth Pursuit */}
                    <button 
                        onClick={() => startDrill('PURSUIT')}
                        className="group bg-zinc-900 border border-zinc-800 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.1)] rounded-2xl p-8 text-left transition-all duration-300 relative overflow-hidden h-80 flex flex-col justify-between"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-black border border-zinc-800 rounded-xl flex items-center justify-center mb-6 text-cyan-400 group-hover:scale-110 transition-transform">
                                <Move size={24} />
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-white mb-2">Smooth Pursuit</h3>
                            <p className="text-sm text-zinc-400 leading-relaxed">
                                Track a moving object in a complex Figure-8 pattern. Improves eye coordination and reduces jerkiness (saccades) during reading.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 uppercase tracking-widest group-hover:text-cyan-400 transition-colors">
                            <Play size={12} /> Start Protocol
                        </div>
                    </button>

                    {/* Card 2: Peripheral Pulse */}
                    <button 
                        onClick={() => startDrill('PERIPHERAL')}
                        className="group bg-zinc-900 border border-zinc-800 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.1)] rounded-2xl p-8 text-left transition-all duration-300 relative overflow-hidden h-80 flex flex-col justify-between"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-black border border-zinc-800 rounded-xl flex items-center justify-center mb-6 text-cyan-400 group-hover:scale-110 transition-transform">
                                <Maximize size={24} />
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-white mb-2">Peripheral Pulse</h3>
                            <p className="text-sm text-zinc-400 leading-relaxed">
                                Maintain central gaze while detecting flashes in your peripheral vision. Combats "tunnel vision" caused by screens.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 uppercase tracking-widest group-hover:text-cyan-400 transition-colors">
                            <Play size={12} /> Start Protocol
                        </div>
                    </button>

                    {/* Card 3: Accommodation */}
                    <button 
                        onClick={() => startDrill('ACCOMMODATION')}
                        className="group bg-zinc-900 border border-zinc-800 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.1)] rounded-2xl p-8 text-left transition-all duration-300 relative overflow-hidden h-80 flex flex-col justify-between"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-black border border-zinc-800 rounded-xl flex items-center justify-center mb-6 text-cyan-400 group-hover:scale-110 transition-transform">
                                <CircleDashed size={24} />
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-white mb-2">Depth Shift</h3>
                            <p className="text-sm text-zinc-400 leading-relaxed">
                                Rhythmic focus switching between near and far planes. Relaxes the ciliary muscles that cramp during close work.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 uppercase tracking-widest group-hover:text-cyan-400 transition-colors">
                            <Play size={12} /> Start Protocol
                        </div>
                    </button>

                </div>
            </div>
         ) : (
            // ACTIVE DRILL VIEW
            <div className="absolute inset-0">
                {activeDrill === 'PURSUIT' && <SmoothPursuit isPlaying={isPlaying} />}
                {activeDrill === 'PERIPHERAL' && <PeripheralPulse isPlaying={isPlaying} />}
                {activeDrill === 'ACCOMMODATION' && <AccommodationBreathing isPlaying={isPlaying} />}
                
                {/* Overlay Paused State */}
                {!isPlaying && timeLeft > 0 && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-20">
                        <button 
                            onClick={togglePlay}
                            className="bg-white text-black px-8 py-4 rounded-full font-bold uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-3 shadow-[0_0_30px_white]"
                        >
                            <Play size={20} fill="black" /> Resume
                        </button>
                    </div>
                )}

                {/* Finished State */}
                {timeLeft === 0 && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-30">
                        <div className="text-center">
                            <Activity size={64} className="text-emerald-500 mx-auto mb-6" />
                            <h2 className="text-4xl font-serif font-bold text-white mb-4">Session Complete</h2>
                            <p className="text-zinc-400 mb-8">Visual cortex recalibrated.</p>
                            <div className="flex gap-4 justify-center">
                                <button onClick={() => setTimeLeft(60)} className="px-6 py-3 border border-zinc-700 text-white rounded-lg hover:bg-zinc-900 transition-colors flex items-center gap-2">
                                    <RotateCcw size={16} /> Repeat
                                </button>
                                <button onClick={stopDrill} className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition-colors font-bold">
                                    Finish
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
         )}
      </main>

    </div>
  );
};
