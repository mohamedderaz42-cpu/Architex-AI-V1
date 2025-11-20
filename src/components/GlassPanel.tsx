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
    initial: { opacity: 0, y: 15, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -15, scale: 0.98 },
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } // Custom ease for premium feel
  };

  return (
    <BaseComponent
      onClick={onClick}
      {...props}
      className={`relative overflow-hidden rounded-3xl backdrop-blur-2xl ${className}`}
      style={{
          background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.6) 100%)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.36), inset 0 0 0 1px rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Noise Texture for realism */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
      }}></div>

      {/* Top Highlight Gradient (simulates light hitting top edge) */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-70"></div>
      
      {/* Content Container */}
      <div className="relative z-10 h-full w-full">
        {children}
      </div>
    </BaseComponent>
  );
};