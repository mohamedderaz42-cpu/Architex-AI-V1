
import React, { useEffect } from 'react';
import { GlassPanel } from './GlassPanel';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { LoaderIcon } from './icons/LoaderIcon';

export interface BootStep {
    id: string;
    label: string;
    status: 'pending' | 'active' | 'complete' | 'error';
}

interface SystemBootLoaderProps {
    steps: BootStep[];
    onRetry: () => void;
}

export const SystemBootLoader: React.FC<SystemBootLoaderProps> = ({ steps, onRetry }) => {
    const hasError = steps.some(s => s.status === 'error');

    return (
        <div className="w-full max-w-md animate-fade-in p-4">
            <GlassPanel className="p-6 border-ai-violet/30">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                    <span className="w-2 h-2 bg-ai-violet rounded-full mr-3 animate-pulse"></span>
                    System Initialization
                </h3>

                <div className="space-y-4 font-mono text-sm">
                    {steps.map((step) => (
                        <div key={step.id} className="flex items-center justify-between transition-all duration-300">
                            <span className={`${
                                step.status === 'active' ? 'text-white font-semibold' : 
                                step.status === 'complete' ? 'text-slate-400' : 
                                step.status === 'error' ? 'text-red-400' : 'text-slate-600'
                            }`}>
                                {step.status === 'active' && '> '}
                                {step.label}...
                            </span>
                            
                            <div>
                                {step.status === 'active' && <LoaderIcon className="w-4 h-4 text-ai-violet animate-spin" />}
                                {step.status === 'complete' && <CheckCircleIcon className="w-4 h-4 text-eco-green animate-scale-in" />}
                                {step.status === 'error' && <XCircleIcon className="w-4 h-4 text-red-500" />}
                                {step.status === 'pending' && <span className="w-4 h-4 block border border-slate-800 rounded-full"></span>}
                            </div>
                        </div>
                    ))}
                </div>

                {hasError && (
                    <div className="mt-6 pt-4 border-t border-white/10 animate-fade-in">
                        <p className="text-xs text-red-400 mb-3 text-center">Initialization sequence failed.</p>
                        <button 
                            onClick={onRetry}
                            className="w-full py-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-100 font-bold hover:bg-red-500/30 transition-all"
                        >
                            Retry Sequence
                        </button>
                    </div>
                )}
            </GlassPanel>
            
            <div className="mt-4 text-center text-[10px] text-slate-600 font-mono">
                ESTABLISHING SECURE UPLINK v2.4.1
            </div>
        </div>
    );
};
