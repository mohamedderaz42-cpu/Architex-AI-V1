import React from 'react';

interface IconButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  activeColor: 'eco-green' | 'pi-gold' | 'ai-violet';
}

export const IconButton: React.FC<IconButtonProps> = ({ icon, label, isActive, onClick, activeColor }) => {
  const colorClasses = {
    'eco-green': 'text-eco-green bg-eco-green/20',
    'pi-gold': 'text-pi-gold bg-pi-gold/20',
    'ai-violet': 'text-ai-violet bg-ai-violet/20',
  };

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-20 h-20 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none ${
        isActive ? colorClasses[activeColor] : 'text-slate-400 hover:bg-white/10'
      }`}
      aria-label={label}
    >
      <div className="w-8 h-8">{icon}</div>
      <span className="text-xs mt-1 font-medium">{label}</span>
    </button>
  );
};