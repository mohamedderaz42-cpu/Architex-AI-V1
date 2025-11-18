import React from 'react';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  // FIX: Add onClick prop to allow click handling on the panel.
  onClick?: () => void;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({ children, className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-slate-500/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-lg ${className}`}
    >
      {children}
    </div>
  );
};
