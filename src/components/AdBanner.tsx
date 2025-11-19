
import React from 'react';
import { GlassPanel } from './GlassPanel';
import { UserEntity } from '../core/schemas/entities';
import { ZapIcon } from './icons/ZapIcon';

interface AdBannerProps {
    user?: UserEntity;
    onUpgrade?: () => void;
}

export const AdBanner: React.FC<AdBannerProps> = ({ user, onUpgrade }) => {
    // Hide if Accelerator subscriber
    if (user?.subscriptionTier === 'Accelerator') {
        return null;
    }

    return (
        <GlassPanel className="p-3 rounded-2xl relative border-pi-gold/30 mb-4">
            <span className="absolute top-2 right-3 text-xs font-bold text-pi-gold/50 bg-brand-dark/50 px-1.5 py-0.5 rounded">Sponsored</span>
            <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pi-gold to-orange-500 flex items-center justify-center text-brand-dark">
                    <ZapIcon className="w-6 h-6" />
                </div>
                <div className="flex-grow">
                    <h5 className="font-semibold text-white">Remove Ads with Accelerator</h5>
                    <p className="text-xs text-slate-400">Unlock AI tools & distraction-free design.</p>
                </div>
                {onUpgrade && (
                     <button 
                        onClick={onUpgrade}
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full text-xs font-bold text-white transition-colors"
                    >
                        Upgrade
                    </button>
                )}
            </div>
        </GlassPanel>
    );
};
