
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowLeft, Share2, Info, Navigation, ExternalLink, Box, Book, Brain, Zap, Maximize2, MousePointer2, RefreshCw, BoxSelect, Cpu, Globe, Network, Shield } from 'lucide-react';
import { useInfraLens } from '@/context/InfraLensContext';
import { SectionType } from '@/types';

interface KnowledgeGraphProps {
  onBack: () => void;
  onNavigate: (section: SectionType) => void;
}

type NodeType = 'app' | 'book' | 'concept' | 'hardware' | 'protocol';

interface Node3D {
  id: string;
  label: string;
  type: NodeType;
  tags: string[];
  color: string;
  x: number; y: number; z: number;
  vx: number; vy: number; vz: number;
  mass: number;
  route?: SectionType;
  description?: string;
}

interface Link {
  source: string;
  target: string;
  strength: number;
}

// 3D Matrix Helpers
const rotateX = (point: {y: number, z: number}, angle: number) => {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
        y: point.y * cos - point.z * sin,
        z: point.y * sin + point.z * cos
    };
};

const rotateY = (point: {x: number, z: number}, angle: number) => {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
        x: point.x * cos + point.z * sin,
        z: -point.x * sin + point.z * cos
    };
};

export const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({ onBack, onNavigate }) => {
  const { apps, books, concepts } = useInfraLens();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNode, setSelectedNode] = useState<Node3D | null>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  
  // Generate the Fabric Nexus Data
  const { nodes, links } = useMemo(() => {
    const nodeList: Node3D[] = [
      // Core OS Apps
      ...apps.map(a => ({
        id: a.id, label: a.name, type: 'app' as const, tags: a.tags, color: '#6366f1',
        x: (Math.random() - 0.5) * 400, y: (Math.random() - 0.5) * 400, z: (Math.random() - 0.5) * 400,
        vx: 0, vy: 0, vz: 0, mass: 1.2, route: a.internalRoute
      })),
      // Conceptual Frameworks
      ...concepts.map(c => ({
        id: c.id, label: c.title, type: 'concept' as const, tags: c.tags, color: '#10b981',
        x: (Math.random() - 0.5) * 400, y: (Math.random() - 0.5) * 400, z: (Math.random() - 0.5) * 400,
        vx: 0, vy: 0, vz: 0, mass: 1.8
      })),
      // HARDWARE FABRIC NODES
      { id: 'asic-r3', label: '7280R3 (Jericho2)', type: 'hardware' as const, tags: ['Hardware', 'Deep Buffer', 'R-Series', 'VOQ'], color: '#f43f5e', x: 200, y: 0, z: 0, vx: 0, vy: 0, vz: 0, mass: 3 },
      { id: 'asic-x3', label: '7050X3 (Trident3)', type: 'hardware' as const, tags: ['Hardware', 'Low Latency', 'X-Series'], color: '#fb923c', x: -200, y: 0, z: 0, vx: 0, vy: 0, vz: 0, mass: 2.5 },
      { id: 'proto-evpn', label: 'EVPN Control Plane', type: 'protocol' as const, tags: ['L3LS', 'BGP', 'Overlay', 'EVPN'], color: '#0ea5e9', x: 0, y: 200, z: 0, vx: 0, vy: 0, vz: 0, mass: 2.2 },
      { id: 'proto-avd', label: 'AVD Framework', type: 'protocol' as const, tags: ['Ansible', 'Automation', 'L3LS'], color: '#8b5cf6', x: 0, y: -200, z: 0, vx: 0, vy: 0, vz: 0, mass: 2 },
      
    ];

    const linkList: Link[] = [];
    // Link by tags and specific Arista logic
    for (let i = 0; i < nodeList.length; i++) {
      for (let j = i + 1; j < nodeList.length; j++) {
        const n1 = nodeList[i];
        const n2 = nodeList[j];
        
        // Basic tag overlap
        const sharedTags = n1.tags.filter(t => n2.tags.some(t2 => t2.includes(t) || t.includes(t2)));
        if (sharedTags.length > 0) {
          linkList.push({ source: n1.id, target: n2.id, strength: sharedTags.length * 0.15 });
          n1.mass += 0.05; n2.mass += 0.05;
        }

        // Specific Architectural Logic: R3 requires Deep Buffer and often L3LS
        if (n1.id === 'asic-r3' && (n2.tags.includes('Deep Buffer') || n2.id === 'proto-evpn')) {
            linkList.push({ source: n1.id, target: n2.id, strength: 0.8 });
        }
        if (n1.id === 'proto-avd' && n2.id === 'proto-evpn') {
            linkList.push({ source: n1.id, target: n2.id, strength: 1.2 });
        }
        
      }
    }
    return { nodes: nodeList, links: linkList };
  }, [apps, concepts]);

  useEffect(() => {
    let animationFrameId: number;
    let time = 0;

    const runPhysics = () => {
      const repulsion = 1.8;
      const attraction = 0.002;
      const centerForce = 0.008;
      const friction = 0.92;

      // 3D Forces
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        n1.vx -= n1.x * centerForce;
        n1.vy -= n1.y * centerForce;
        n1.vz -= n1.z * centerForce;

        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dz = n2.z - n1.z;
          const distSq = dx * dx + dy * dy + dz * dz || 1;
          const dist = Math.sqrt(distSq);
          const force = repulsion / distSq;
          const fx = (dx / dist) * force * 150;
          const fy = (dy / dist) * force * 150;
          const fz = (dz / dist) * force * 150;
          n1.vx -= fx; n1.vy -= fy; n1.vz -= fz;
          n2.vx += fx; n2.vy += fy; n2.vz += fz;
        }
      }

      links.forEach(link => {
        const s = nodes.find(n => n.id === link.source);
        const t = nodes.find(n => n.id === link.target);
        if (!s || !t) return;
        const dx = t.x - s.x; const dy = t.y - s.y; const dz = t.z - s.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
        const force = dist * attraction * link.strength;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        const fz = (dz / dist) * force;
        s.vx += fx; s.vy += fy; s.vz += fz;
        t.vx -= fx; t.vy -= fy; t.vz -= fz;
      });

      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy; n.z += n.vz;
        n.vx *= friction; n.vy *= friction; n.vz *= friction;
      });

      time += 0.01;
      // Auto-rotation when idle
      if (!isDragging) {
          setRotation(prev => ({ x: prev.x + 0.001, y: prev.y + 0.002 }));
      }
      
      draw(time);
      animationFrameId = requestAnimationFrame(runPhysics);
    };

    const draw = (t: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const focalLength = 800;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Project 3D to 2D
      const projectedNodes = nodes.map(n => {
          let p = { x: n.x, y: n.y, z: n.z };
          // Apply User Rotation
          const rotYResult = rotateY({x: p.x, z: p.z}, rotation.y);
          p.x = rotYResult.x; p.z = rotYResult.z;
          const rotXResult = rotateX({y: p.y, z: p.z}, rotation.x);
          p.y = rotXResult.y; p.z = rotXResult.z;

          // Camera Zoom
          p.z += 600 / zoom;

          const scale = focalLength / (focalLength + p.z);
          return {
              ...n,
              px: centerX + p.x * scale,
              py: centerY + p.y * scale,
              pz: p.z,
              pScale: scale
          };
      });

      // Sort by depth for correct painter's algorithm rendering
      projectedNodes.sort((a, b) => b.pz - a.pz);

      // Draw Links
      links.forEach(link => {
          const s = projectedNodes.find(n => n.id === link.source);
          const t = projectedNodes.find(n => n.id === link.target);
          if (!s || !t) return;
          
          const avgZ = (s.pz + t.pz) / 2;
          const opacity = Math.max(0, 1 - avgZ / 1000) * 0.2;
          const isFocus = selectedNode && (selectedNode.id === s.id || selectedNode.id === t.id);

          ctx.beginPath();
          ctx.moveTo(s.px, s.py);
          ctx.lineTo(t.px, t.py);
          ctx.strokeStyle = isFocus ? `rgba(255,255,255,${opacity * 2})` : `rgba(255,255,255,${opacity})`;
          ctx.lineWidth = isFocus ? 2 : 1;
          ctx.stroke();
      });

      // Draw Nodes
      projectedNodes.forEach(n => {
          const isHovered = selectedNode?.id === n.id;
          const baseSize = 4 * n.mass * n.pScale;
          const size = isHovered ? baseSize * 1.5 : baseSize;
          const opacity = Math.max(0, 1 - n.pz / 1200);

          ctx.save();
          ctx.globalAlpha = opacity;
          ctx.shadowBlur = isHovered ? 20 : 10;
          ctx.shadowColor = n.color;
          ctx.fillStyle = n.color;
          ctx.beginPath();
          ctx.arc(n.px, n.py, size, 0, Math.PI * 2);
          ctx.fill();

          // Label
          if (opacity > 0.5 || isHovered) {
              ctx.fillStyle = isHovered ? '#fff' : 'rgba(255,255,255,0.4)';
              ctx.font = `${isHovered ? 'bold' : 'normal'} ${10 * n.pScale}px JetBrains Mono`;
              ctx.textAlign = 'center';
              ctx.fillText(n.label, n.px, n.py + size + 15);
          }
          ctx.restore();
      });
    };

    animationFrameId = requestAnimationFrame(runPhysics);
    return () => cancelAnimationFrame(animationFrameId);
  }, [nodes, links, rotation, zoom, selectedNode, isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      setRotation(prev => ({
          x: prev.x + dy * 0.005,
          y: prev.y + dx * 0.005
      }));
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    } else {
        // Hit detection on projected nodes
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        // Simple hit test logic omitted for brevity in non-canvas DOM
        // Real implementation would project mouse ray to 3D space
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    setZoom(prev => Math.max(0.5, Math.min(3, prev + (e.deltaY > 0 ? -0.1 : 0.1))));
  };

  const detail = useMemo(() => {
    if (!selectedNode) return null;
    
    // Direct description check for externally sourced nodes
    if (selectedNode.description) {
        return { description: selectedNode.description, bestFor: 'Technical Operational Info' };
    }

    return apps.find(a => a.id === selectedNode.id) || concepts.find(c => c.id === selectedNode.id) || {
        description: 'Arista Infrastructure Node. Foundation of the Fabric Nexus.',
        bestFor: selectedNode.tags.join(', ')
    };
  }, [selectedNode, apps, concepts]);

  return (
    <div className="min-h-screen bg-[#020205] text-white font-sans overflow-hidden flex flex-col relative">
      {/* UI OVERLAY */}
      <div className="absolute top-0 left-0 w-full p-6 z-20 pointer-events-none flex justify-between items-start">
         <div className="flex flex-col gap-6 pointer-events-auto">
            <button onClick={onBack} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
                <ArrowLeft size={14} /> Systems Return
            </button>
            <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-950/20 border border-indigo-500/20 rounded-lg text-indigo-400 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                    <BoxSelect size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-serif font-bold tracking-tight">Fabric Nexus 3D</h1>
                    <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div>
                        Cognitive Topography Active
                    </div>
                </div>
            </div>
         </div>
         <div className="flex gap-4 pointer-events-auto">
            <button onClick={() => { setRotation({x:0, y:0}); setZoom(1); }} className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-500 hover:text-white transition-all">
                <RefreshCw size={16} />
            </button>
            <div className="px-5 py-3 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-2xl flex gap-6 text-[9px] font-mono font-bold tracking-widest">
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div> ASIC</div>
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> APPS</div>
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> CONCEPTS</div>
                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-sky-500"></div> STACK</div>
            </div>
         </div>
      </div>

      <canvas 
        ref={canvasRef} 
        onMouseDown={handleMouseDown} 
        onMouseMove={handleMouseMove} 
        onMouseUp={() => setIsDragging(false)} 
        onWheel={handleWheel} 
        className="flex-1 cursor-move" 
      />

      {/* NODE DETAILS MODAL */}
      {selectedNode && detail && (
        <div className="absolute bottom-10 right-10 w-96 bg-zinc-950/90 backdrop-blur-2xl border border-zinc-800 rounded-[2.5rem] p-8 z-30 animate-fade-in shadow-2xl overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none"></div>
            <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-inner">
                    {selectedNode.type === 'hardware' && <Cpu size={24} className="text-rose-500" />}
                    {selectedNode.type === 'protocol' && <Network size={24} className="text-sky-500" />}
                    {selectedNode.type === 'app' && <Zap size={24} className="text-indigo-500" />}
                    {selectedNode.type === 'concept' && <Brain size={24} className="text-emerald-500" />}
                </div>
                <button 
                  onClick={() => {
                      if (selectedNode.route) onNavigate(selectedNode.route);
                      else if (selectedNode.type === 'concept') onNavigate(SectionType.CONCEPTS);
                  }}
                  className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform shadow-xl"
                >
                    <Maximize2 size={16} />
                </button>
            </div>
            <h3 className="text-3xl font-serif font-bold text-white mb-2 leading-tight">{selectedNode.label}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6 italic">
                {('description' in detail ? detail.description : '')}
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
                {selectedNode.tags.map(tag => (
                    <span key={tag} className="text-[8px] font-mono uppercase tracking-widest bg-zinc-900 border border-zinc-800 text-zinc-500 px-2 py-1 rounded-md">
                        {tag}
                    </span>
                ))}
            </div>
            <div className="pt-6 border-t border-zinc-800 flex justify-between items-center text-[8px] font-mono text-zinc-600 uppercase tracking-[0.4em]">
                <span>RELATIONAL DEPTH: HIGH</span>
                <span className="flex items-center gap-2"><MousePointer2 size={10} /> Fabric Lock</span>
            </div>
        </div>
      )}

      {/* INTERACTION HINT */}
      {!isDragging && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-zinc-600 text-[10px] font-mono uppercase tracking-[0.6em] pointer-events-none opacity-40 animate-pulse text-center">
            Drag to Navigate Topography // Scroll to Zoom
        </div>
      )}

      {/* BACKGROUND DECO */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-[150px] pointer-events-none"></div>
    </div>
  );
};
