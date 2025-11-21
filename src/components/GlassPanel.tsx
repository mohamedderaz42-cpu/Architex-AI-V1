
import React, { useRef, useState } from 'react';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  spotlight?: boolean;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({ children, className = '', onClick, spotlight = false }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || !spotlight) return;
    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => {
    if (spotlight) setOpacity(1);
  };

  const handleMouseLeave = () => {
    if (spotlight) setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative bg-slate-900/30 backdrop-blur-xl border border-white/10 rounded-3xl shadow-lg overflow-hidden group ${className}`}
    >
      {/* Cinematic Noise Overlay */}
      <div className="absolute inset-0 bg-noise opacity-[0.07] pointer-events-none mix-blend-overlay z-0"></div>

      {/* Spotlight Gradient Overlay */}
      {spotlight && (
        <div
          className="pointer-events-none absolute -inset-px transition duration-500 opacity-0 group-hover:opacity-100 z-10"
          style={{
            opacity,
            background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.08), transparent 40%)`,
          }}
        />
      )}

       {/* Spotlight Border Reveal */}
       {spotlight && (
        <div
            className="pointer-events-none absolute -inset-px rounded-3xl transition duration-500 opacity-0 group-hover:opacity-100 z-10"
            style={{
                opacity,
                background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.4), transparent 40%)`,
                maskImage: 'linear-gradient(black, black) content-box, linear-gradient(black, black)',
                WebkitMaskImage: 'linear-gradient(black, black) content-box, linear-gradient(black, black)',
                maskComposite: 'exclude',
                WebkitMaskComposite: 'xor',
                padding: '1px', // Border width
            }}
        />
      )}

      <div className="relative z-20 h-full">
        {children}
      </div>
    </div>
  );
};
