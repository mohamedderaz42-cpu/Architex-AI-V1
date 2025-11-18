import React from 'react';
import { GlassPanel } from './GlassPanel';
import { ServerIcon } from './icons/ServerIcon';

export const SystemStatus: React.FC = () => {
    return (
        <GlassPanel className="p-4 rounded-2xl">
            <div className="flex items-center mb-3">
                <ServerIcon className="w-6 h-6 mr-2 text-slate-400" />
                <h4 className="text-lg font-semibold text-white">System Control</h4>
            </div>
            <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                    <span className="text-slate-400">Status:</span>
                    <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-eco-green mr-2"></div>
                        <span className="font-semibold text-eco-green">Nominal</span>
                    </div>
                </div>
                 <div className="flex justify-between items-center">
                    <span className="text-slate-400">Deployment:</span>
                    <span className="font-semibold text-slate-200">Code Freeze Active</span>
                </div>
                 <div className="flex justify-between items-center">
                    <span className="text-slate-400">Version:</span>
                    <span className="font-semibold text-pi-gold">Closed Beta</span>
                </div>
            </div>
            <div className="mt-3 pt-3 border-t border-white/10">
                 <h5 className="text-xs font-bold text-slate-500 uppercase mb-2">Launch Parameters (Locked)</h5>
                 <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                        <span className="text-slate-400">Bounty Commission:</span>
                        <span className="font-semibold text-white">10%</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-400">NFT Mint Fee:</span>
                        <span className="font-semibold text-white">250 ARCHI</span>
                    </div>
                 </div>
            </div>
        </GlassPanel>
    );
};