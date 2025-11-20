
import React from 'react';

interface IconButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  activeColor: 'eco-green' | 'pi-gold' | 'ai-violet';
}

export const IconButton: React.FC<IconButtonProps> = ({ icon, label, isActive, onClick, activeColor }) => {
  const colorConfigs = {
    'eco-green': 'text-eco-green shadow-[0_0_20px_-5px_rgba(16,185,129,0.5)] border-eco-green/30 bg-eco-green/10',
    'pi-gold': 'text-pi-gold shadow-[0_0_20px_-5px_rgba(253,179,0,0.5)] border-pi-gold/30 bg-pi-gold/10',
    'ai-violet': 'text-ai-violet shadow-[0_0_20px_-5px_rgba(139,92,246,0.5)] border-ai-violet/30 bg-ai-violet/10',
  };

  const activeClass = colorConfigs[activeColor];
  const inactiveClass = 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent';

  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center w-16 h-16 rounded-2xl border transition-all duration-300 ease-out transform active:scale-95 ${
        isActive ? activeClass : inactiveClass
      }`}
      aria-label={label}
    >
      {/* Active Indicator Dot */}
      {isActive && (
         <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${activeColor === 'eco-green' ? 'bg-eco-green' : activeColor === 'pi-gold' ? 'bg-pi-gold' : 'bg-ai-violet'} animate-pulse shadow-[0_0_10px_currentColor]`}></div>
      )}

      <div className="w-7 h-7">{icon}</div>
      <span className="text-[10px] mt-1 font-semibold tracking-wide">{label}</span>
    </button>
  );
};
