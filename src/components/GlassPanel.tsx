import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  noAnimation?: boolean;
  spotlight?: boolean; // New prop to enable the spotlight effect
}

export const GlassPanel: React.FC<GlassPanelProps> = ({ children, className = '', onClick, noAnimation = false, spotlight = false }) => {
  const BaseComponent = noAnimation ? 'div' : motion.div;
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
  
  const props = noAnimation ? {} : {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.4, ease: [0.25, 0.8, 0.25, 1] }
  };

  return (
    <BaseComponent
      ref={divRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
      className={`relative overflow-hidden rounded-3xl backdrop-blur-2xl border border-white/5 shadow-glass group ${className}`}
      style={{
          background: 'linear-gradient(165deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)',
      }}
    >
      {/* Cinematic Noise Overlay */}
      <div className="absolute inset-0 bg-noise opacity-[0.05] pointer-events-none mix-blend-overlay"></div>
      
      {/* Spotlight Gradient Overlay */}
      {spotlight && (
        <div
          className="pointer-events-none absolute -inset-px transition duration-300 opacity-0 group-hover:opacity-100"
          style={{
            opacity,
            background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.06), transparent 40%)`,
          }}
        />
      )}

      {/* Spotlight Border Reveal */}
      {spotlight && (
        <div
            className="pointer-events-none absolute -inset-px rounded-3xl transition duration-300 opacity-0 group-hover:opacity-100"
            style={{
                opacity,
                background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.3), transparent 40%)`,
                maskImage: 'linear-gradient(black, black) content-box, linear-gradient(black, black)',
                WebkitMaskImage: 'linear-gradient(black, black) content-box, linear-gradient(black, black)',
                maskComposite: 'exclude',
                WebkitMaskComposite: 'xor',
                padding: '1px', // Border width
            }}
        />
      )}
      
      {/* Rim Light (Top) */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50 pointer-events-none"></div>
      
      {/* Content */}
      <div className="relative z-10 h-full w-full">
        {children}
      </div>
    </BaseComponent>
  );
};