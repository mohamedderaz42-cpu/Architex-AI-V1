import React from 'react';
import { PiCoinIcon } from './icons/PiCoinIcon';
import { ZapIcon } from './icons/ZapIcon';
import { TrendingUpIcon } from './icons/TrendingUpIcon';

const Feature: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
    <div className="flex items-center">
        <div className="w-5 h-5 mr-2 text-ai-violet">{icon}</div>
        <span className="text-slate-300 text-sm">{text}</span>
    </div>
);

export const AcceleratorSubscription: React.FC = () => {
    return (
        <div className="p-4 rounded-2xl bg-slate-900/50 border border-ai-violet/50 shadow-glow-violet">
            <h4 className="font-bold text-white text-lg">Accelerator Tier</h4>
            <p className="text-xs text-slate-400 mb-3">Unlock exclusive AI tools for professionals.</p>
            
            <div className="space-y-2 mb-4">
                <Feature icon={<ZapIcon />} text="AI-Powered Material Matching" />
                <Feature icon={<TrendingUpIcon />} text="Predictive Trend Analysis" />
                <Feature icon={<ZapIcon />} text="Priority Access to New Models" />
            </div>

            <div className="flex items-center justify-between">
                 <div className="flex items-center">
                    <PiCoinIcon className="w-6 h-6 text-pi-gold" />
                    <span className="text-xl font-bold text-white ml-2">52.00</span>
                    <span className="text-slate-400 text-sm ml-1">/ month</span>
                </div>
                <button
                    className="px-4 py-2 bg-ai-violet/80 border border-ai-violet/90 rounded-full text-sm font-semibold text-white backdrop-blur-md hover:bg-ai-violet transition-all"
                >
                    Subscribe Now
                </button>
            </div>
        </div>
    );
};