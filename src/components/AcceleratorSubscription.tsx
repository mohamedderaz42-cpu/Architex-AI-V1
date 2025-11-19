
import React from 'react';
import { PiCoinIcon } from './icons/PiCoinIcon';
import { ZapIcon } from './icons/ZapIcon';
import { TrendingUpIcon } from './icons/TrendingUpIcon';
import { UserEntity } from '../core/schemas/entities';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

const Feature: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
    <div className="flex items-center">
        <div className="w-5 h-5 mr-2 text-ai-violet">{icon}</div>
        <span className="text-slate-300 text-xs sm:text-sm">{text}</span>
    </div>
);

interface AcceleratorSubscriptionProps {
    user: UserEntity;
    onSubscribe: () => void;
}

export const AcceleratorSubscription: React.FC<AcceleratorSubscriptionProps> = ({ user, onSubscribe }) => {
    const isSubscribed = user.subscriptionTier === 'Accelerator';
    
    return (
        <div className={`p-5 rounded-2xl border relative overflow-hidden transition-all duration-300 ${isSubscribed ? 'bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 border-ai-violet/50 shadow-glow-violet' : 'bg-slate-900/50 border-white/10'}`}>
            
            {isSubscribed && (
                <div className="absolute top-4 right-4 flex items-center bg-eco-green/20 text-eco-green px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border border-eco-green/30">
                    <CheckCircleIcon className="w-3 h-3 mr-1" /> Active
                </div>
            )}

            <div className="flex items-center mb-2">
                <div className="p-2 rounded-lg bg-ai-violet/20 text-ai-violet mr-3">
                    <ZapIcon className="w-6 h-6" />
                </div>
                <div>
                    <h4 className="font-bold text-white text-lg">Accelerator Tier</h4>
                    <p className="text-xs text-slate-400">Professional AI Suite</p>
                </div>
            </div>
            
            <div className="space-y-3 my-4 bg-black/20 p-3 rounded-xl border border-white/5">
                <Feature icon={<TrendingUpIcon />} text="Predictive Market Trends" />
                <Feature icon={<ZapIcon />} text="Unlimited AI Design Gen" />
                <Feature icon={<ZapIcon />} text="Priority Rendering Queue" />
            </div>

            {isSubscribed ? (
                 <div className="mt-2 text-center">
                    <p className="text-xs text-slate-500">
                        Renews on: <span className="text-white font-mono">{new Date(user.subscriptionExpiry || Date.now()).toLocaleDateString()}</span>
                    </p>
                </div>
            ) : (
                <div className="flex items-center justify-between mt-2">
                     <div className="flex items-end">
                        <div className="flex items-center text-pi-gold">
                            <PiCoinIcon className="w-5 h-5 mr-1" />
                            <span className="text-xl font-bold">52.00</span>
                        </div>
                        <span className="text-slate-500 text-xs ml-1 mb-1">/ month</span>
                    </div>
                    <button
                        onClick={onSubscribe}
                        className="px-5 py-2 bg-white text-brand-dark rounded-full text-sm font-bold hover:bg-ai-violet hover:text-white transition-all shadow-lg"
                    >
                        Subscribe
                    </button>
                </div>
            )}
        </div>
    );
};
