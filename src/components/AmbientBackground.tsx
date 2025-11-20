import React from 'react';

export const AmbientBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-brand-dark">
        {/* Deep Cosmic Base */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#1a1d2d_0%,_#030712_100%)]"></div>
        
        {/* Aurora Borealis 1: Violet */}
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-ai-violet/10 rounded-full blur-[120px] animate-blob mix-blend-screen"></div>
        
        {/* Aurora Borealis 2: Gold */}
        <div className="absolute top-[20%] right-[-20%] w-[600px] h-[600px] bg-pi-gold/5 rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-screen opacity-60"></div>
        
        {/* Aurora Borealis 3: Emerald */}
        <div className="absolute bottom-[-20%] left-[30%] w-[700px] h-[700px] bg-eco-green/5 rounded-full blur-[140px] animate-blob animation-delay-4000 mix-blend-screen opacity-50"></div>

        {/* Cinematic Grain Overlay for Film Look */}
        <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay"></div>
    </div>
  );
};