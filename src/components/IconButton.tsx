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
  
  // Glow colors based on active state
  const glowColors = {
    'eco-green': 'shadow-[0_0_30px_-5px_rgba(16,185,129,0.6)] bg-eco-green/10 text-eco-green border-eco-green/30',
    'pi-gold': 'shadow-[0_0_30px_-5px_rgba(253,179,0,0.6)] bg-pi-gold/10 text-pi-gold border-pi-gold/30',
    'ai-violet': 'shadow-[0_0_30px_-5px_rgba(139,92,246,0.6)] bg-ai-violet/10 text-ai-violet border-ai-violet/30',
  };

  const activeClass = glowColors[activeColor];
  const inactiveClass = 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border-transparent';

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      className={`
        relative flex items-center justify-center rounded-2xl border transition-all duration-500 ease-out
        ${isSidebar ? 'flex-row space-x-3 w-full px-4 py-3 mb-2' : 'flex-col w-16 h-16'} 
        ${isActive ? activeClass : inactiveClass}
      `}
      aria-label={label}
    >
      {/* Active Indicator Line (Sidebar only) */}
      {isSidebar && isActive && (
        <motion.div 
            layoutId="sidebar-active-pill"
            className={`absolute left-0 top-0 bottom-0 w-1 rounded-r-full ${
                activeColor === 'eco-green' ? 'bg-eco-green' : 
                activeColor === 'pi-gold' ? 'bg-pi-gold' : 'bg-ai-violet'
            }`}
        />
      )}

      {/* Background Glow Spot (Bottom Nav only) */}
      {!isSidebar && isActive && (
           <motion.div 
             layoutId="bottom-nav-glow"
             className={`absolute inset-0 rounded-2xl opacity-50 bg-gradient-to-tr from-transparent to-white/5`}
           />
      )}

      <div className={`relative z-10 ${isSidebar ? 'w-6 h-6' : 'w-6 h-6'}`}>
        {icon}
      </div>
      
      <span className={`relative z-10 ${isSidebar ? 'text-sm font-bold tracking-wide' : 'text-[9px] mt-1.5 font-medium uppercase tracking-wider'}`}>
        {label}
      </span>
    </motion.button>
  );
};