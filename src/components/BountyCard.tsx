import React from 'react';
import { BountyEntity } from '../core/schemas/entities';
import { GlassPanel } from './GlassPanel';
import { ArchitexLogo } from './icons/ArchitexLogo';
import { GavelIcon } from './icons/GavelIcon';

interface BountyCardProps {
    bounty: BountyEntity;
    onClick: () => void;
}

const statusColors: { [key in BountyEntity['status']]: string } = {
    Open: 'bg-eco-green/20 text-eco-green',
    'In Progress': 'bg-pi-gold/20 text-pi-gold',
    'In Dispute': 'bg-red-500/20 text-red-400',
    'Arbitration': 'bg-orange-500/20 text-orange-400',
    Complete: 'bg-slate-500/20 text-slate-300',
};

export const BountyCard: React.FC<BountyCardProps> = ({ bounty, onClick }) => {
    return (
        <GlassPanel 
            onClick={onClick}
            className="p-3 rounded-xl hover:border-white/20 transition-all duration-300 cursor-pointer hover:bg-slate-500/20"
        >
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-bold text-white">{bounty.title}</h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">{bounty.description}</p>
                </div>
                <div className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColors[bounty.status]} flex items-center`}>
                     {bounty.status === 'In Dispute' && <GavelIcon className="w-3 h-3 mr-1" />}
                    {bounty.status}
                </div>
            </div>
            <div className="mt-2 pt-2 border-t border-white/10 flex justify-end items-center">
                <span className="text-sm font-medium text-slate-300 mr-2">Reward:</span>
                <div className="flex items-center space-x-1.5">
                    <ArchitexLogo className="w-5 h-5 text-ai-violet" />
                    <span className="font-bold text-lg text-white">{bounty.reward.toLocaleString()}</span>
                </div>
            </div>
        </GlassPanel>
    );
};