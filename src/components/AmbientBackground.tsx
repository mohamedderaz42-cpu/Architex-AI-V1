import React from 'react';

export const AmbientBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-brand-dark">
        {/* Deep Base Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark via-[#050b1a] to-[#0f172a]"></div>
        
        {/* Moving Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-ai-violet/20 rounded-full blur-[120px] animate-blob opacity-40"></div>
        <div className="absolute top-[40%] right-[-10%] w-[400px] h-[400px] bg-pi-gold/10 rounded-full blur-[100px] animate-blob animation-delay-2000 opacity-30"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-eco-green/10 rounded-full blur-[140px] animate-blob animation-delay-4000 opacity-30"></div>

        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
    </div>
  );
};