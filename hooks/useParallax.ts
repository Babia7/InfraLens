
import { useState, useRef, useCallback } from 'react';

/**
 * useParallax
 * Extracts mouse position relative to a container to create 3D tilt and layer shift effects.
 * Returns normalized coordinates (-0.5 to 0.5) for X and Y.
 */
export const useParallax = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    
    // Calculate position relative to container center
    // Result: -0.5 (left/top) to 0.5 (right/bottom)
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    setCoordinates({ x, y });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setCoordinates({ x: 0, y: 0 });
  }, []);

  return {
    containerRef,
    x: coordinates.x,
    y: coordinates.y,
    handleMouseMove,
    handleMouseLeave
  };
};
