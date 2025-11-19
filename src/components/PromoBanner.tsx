
import React from 'react';
import { GlassPanel } from './GlassPanel';
import { MegaphoneIcon } from './icons/MegaphoneIcon';

interface PromoBannerProps {
    onJoinFounderProgram: () => void;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({ onJoinFounderProgram }) => (
    <GlassPanel className="p-3 mb-4 rounded-xl bg-ai-violet/20 border-ai-violet/50 animate-fade-in">
        <div className="flex items-center">
            <div className="flex-shrink-0 mr-3">
                <MegaphoneIcon className="w-8 h-8 text-ai-violet" />
            </div>
            <div className="flex-grow">
                <h4 className="font-bold text-white">Founder Designer Program</h4>
                <p className="text-xs text-slate-300">
                    Early adopters enjoy <span className="font-semibold text-pi-gold">0% commission</span> for the first 6 months.
                </p>
            </div>
            <button 
                onClick={onJoinFounderProgram}
                className="ml-3 flex-shrink-0 px-3 py-1 bg-slate-700/50 border border-white/10 rounded-full text-xs font-semibold text-slate-300 hover:bg-ai-violet/30 hover:text-white transition-all"
            >
                Join Now
            </button>
        </div>
    </GlassPanel>
);
