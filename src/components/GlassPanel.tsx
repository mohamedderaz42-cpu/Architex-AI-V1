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
    transition: { duration: 0.3 }
  };

  return (
    <BaseComponent
      onClick={onClick}
      {...props}
      className={`bg-slate-500/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-lg relative overflow-hidden ${className}`}
    >
      {/* Subtle Noise Texture Overlay for Realism */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
      }}></div>
      
      <div className="relative z-10 h-full">
        {children}
      </div>
    </BaseComponent>
  );
};