import React from 'react';
import { motion } from 'framer-motion';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  noAnimation?: boolean;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({ children, className = '', onClick, noAnimation = false }) => {
  const BaseComponent = noAnimation ? 'div' : motion.div;
  
  const props = noAnimation ? {} : {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.4, ease: [0.25, 0.8, 0.25, 1] } // "Cinema" ease
  };

  return (
    <BaseComponent
      onClick={onClick}
      {...props}
      className={`relative overflow-hidden rounded-3xl backdrop-blur-xl border border-white/10 shadow-glass ${className}`}
      style={{
          background: 'linear-gradient(165deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
      }}
    >
      {/* Hyper-Realistic Noise Overlay */}
      <div className="absolute inset-0 bg-noise opacity-[0.07] pointer-events-none mix-blend-overlay"></div>
      
      {/* Rim Light Gradient (Top Edge) */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-50 pointer-events-none"></div>
      
      {/* Content Container */}
      <div className="relative z-10 h-full w-full">
        {children}
      </div>
    </BaseComponent>
  );
};