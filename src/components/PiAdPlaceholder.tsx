
import React from 'react';

export const PiAdPlaceholder: React.FC = () => {
    return (
        <div className="w-full bg-white/5 rounded-xl p-4 flex items-center justify-center border border-white/10 relative overflow-hidden group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-r from-pi-gold/10 to-ai-violet/10 opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <div className="z-10 flex flex-col items-center text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Sponsored</span>
                <p className="text-sm text-slate-300 font-medium">Support Architex by viewing this ad</p>
                <div className="mt-2 px-3 py-1 bg-pi-gold text-brand-dark text-xs font-bold rounded hover:bg-white transition-colors">
                    Watch Video
                </div>
            </div>
        </div>
    );
};
