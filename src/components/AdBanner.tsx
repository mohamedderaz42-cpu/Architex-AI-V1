import React from 'react';
import { GlassPanel } from './GlassPanel';

export const AdBanner: React.FC = () => {
    return (
        <GlassPanel className="p-3 rounded-2xl relative border-pi-gold/30">
            <span className="absolute top-2 right-3 text-xs font-bold text-pi-gold/50 bg-brand-dark/50 px-1.5 py-0.5 rounded">Ad</span>
            <div className="flex items-center space-x-3">
                <img src="https://placehold.co/64x64/FDB300/020617/png?text=Pi" alt="Ad thumbnail" className="w-12 h-12 rounded-lg" />
                <div>
                    <h5 className="font-semibold text-white">Upgrade to Architex Pro!</h5>
                    <p className="text-sm text-slate-400">Remove ads and unlock exclusive AI tools.</p>
                </div>
            </div>
        </GlassPanel>
    );
};