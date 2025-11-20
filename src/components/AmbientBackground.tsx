
import React from 'react';

export const AmbientBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-brand-dark pointer-events-none">
        {/* Deep Base Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#1a1d2d_0%,_#030712_100%)]"></div>
        
        {/* Aurora Blobs */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-ai-violet/10 rounded-full blur-[120px] animate-blob mix-blend-screen"></div>
        <div className="absolute top-[40%] right-[-20%] w-[500px] h-[500px] bg-pi-gold/5 rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-screen"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-eco-green/5 rounded-full blur-[140px] animate-blob animation-delay-4000 mix-blend-screen"></div>
    </div>
  );
};
