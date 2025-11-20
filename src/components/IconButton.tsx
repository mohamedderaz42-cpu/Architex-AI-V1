import React from 'react';
import { motion } from 'framer-motion';

interface IconButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  activeColor: 'eco-green' | 'pi-gold' | 'ai-violet';
  isSidebar?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({ icon, label, isActive, onClick, activeColor, isSidebar = false }) => {
  const colorClasses = {
    'eco-green': 'text-eco-green bg-eco-green/20 shadow-[0_0_15px_rgba(16,185,129,0.3)]',
    'pi-gold': 'text-pi-gold bg-pi-gold/20 shadow-[0_0_15px_rgba(253,179,0,0.3)]',
    'ai-violet': 'text-ai-violet bg-ai-violet/20 shadow-[0_0_15px_rgba(139,92,246,0.3)]',
  };

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`flex ${isSidebar ? 'flex-row space-x-3 w-full px-4 py-3 mb-2' : 'flex-col items-center justify-center w-16 h-16'} rounded-2xl transition-colors duration-300 ease-in-out focus:outline-none ${
        isActive ? colorClasses[activeColor] : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
      }`}
      aria-label={label}
    >
      <div className={`${isSidebar ? 'w-6 h-6' : 'w-7 h-7'}`}>{icon}</div>
      <span className={`${isSidebar ? 'text-sm font-bold' : 'text-[10px] mt-1 font-medium'}`}>{label}</span>
      {isSidebar && isActive && (
          <motion.div 
            layoutId="sidebar-indicator"
            className={`ml-auto w-1.5 h-1.5 rounded-full ${
                activeColor === 'eco-green' ? 'bg-eco-green' : 
                activeColor === 'pi-gold' ? 'bg-pi-gold' : 'bg-ai-violet'
            }`} 
          />
      )}
    </motion.button>
  );
};