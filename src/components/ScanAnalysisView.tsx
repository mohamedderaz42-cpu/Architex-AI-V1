import React from 'react';
import { GlassPanel } from './GlassPanel';
import { ScanAnalysis } from '../core/schemas/entities';
import { LoaderIcon } from './icons/LoaderIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

interface ScanAnalysisViewProps {
    analysis: ScanAnalysis;
}

export const ScanAnalysisView: React.FC<ScanAnalysisViewProps> = ({ analysis }) => {
    return (
        <div className="w-full h-full flex items-center justify-center p-4 animate-fade-in">
            <GlassPanel className="w-full max-w-md p-8 text-center relative overflow-hidden border-ai-violet/30">
                {/* Ambient Background Effect */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pi-gold to-transparent animate-shimmer"></div>
                <div className="absolute inset-0 bg-ai-violet/5 pointer-events-none"></div>
                
                <div className="mb-6 flex justify-center relative z-10">
                    <div className="relative">
                        <div className="absolute inset-0 bg-pi-gold/20 blur-xl rounded-full animate-pulse"></div>
                        <CheckCircleIcon className="w-16 h-16 text-pi-gold relative z-10" />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-white mb-2 relative z-10">Scan Analysis Complete</h2>
                <p className="text-slate-400 text-sm mb-6 relative z-10">Spatial data successfully captured.</p>

                <div className="space-y-4 text-left bg-slate-900/60 p-5 rounded-xl border border-white/10 relative z-10 shadow-inner">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-slate-500 text-xs uppercase tracking-wider font-bold">Dimensions</span>
                        <span className="text-white font-mono text-sm">{analysis.dimensions}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-slate-500 text-xs uppercase tracking-wider font-bold">Lighting</span>
                        <span className="text-white text-sm">{analysis.lighting}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-slate-500 text-xs uppercase tracking-wider font-bold">Detected Style</span>
                        <span className="text-pi-gold text-sm font-medium">{analysis.style}</span>
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-center text-xs text-slate-400 relative z-10">
                    <LoaderIcon className="w-4 h-4 mr-2 animate-spin text-ai-violet" />
                    <span>Preparing Design Studio...</span>
                </div>
            </GlassPanel>
        </div>
    );
};