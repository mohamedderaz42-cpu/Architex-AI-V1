import React from 'react';
import { ArbitratorEntity } from '../core/schemas/entities';
import { GavelIcon } from './icons/GavelIcon';

const ArbitratorProfileCard: React.FC<{ arbitrator: ArbitratorEntity }> = ({ arbitrator }) => {
    return (
        <div className="bg-slate-900/50 p-4 rounded-xl border border-white/10 flex flex-col items-center text-center">
            <img src={arbitrator.avatarUrl} alt={arbitrator.name} className="w-20 h-20 rounded-full border-2 border-slate-600 mb-3" />
            <h5 className="font-bold text-white text-lg">{arbitrator.name}</h5>
            <p className="text-xs text-ai-violet font-semibold">{arbitrator.specialty}</p>
            <div className="my-3 w-full space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Resolution Rate:</span>
                    <span className="font-semibold text-eco-green">{arbitrator.resolutionRate}%</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Cases Resolved:</span>
                    <span className="font-semibold text-white">{arbitrator.casesResolved}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Fee:</span>
                    <span className="font-semibold text-pi-gold">{arbitrator.fee} PiUSD</span>
                </div>
            </div>
            <button className="w-full mt-2 px-4 py-2 bg-slate-700/50 border border-white/10 rounded-full text-sm font-semibold text-slate-300 hover:bg-ai-violet/30 hover:text-white transition-all">
                View Profile
            </button>
        </div>
    );
};

export const ArbitratorMarketplace: React.FC<{ arbitrators: ArbitratorEntity[] }> = ({ arbitrators }) => {
    return (
        <div className="p-2 h-full flex flex-col">
            <div className="text-center mb-4">
                <GavelIcon className="w-10 h-10 mx-auto text-pi-gold" />
                <h3 className="font-semibold text-white mt-2">Arbitrator Marketplace</h3>
                <p className="text-xs text-slate-400">Browse and vet our decentralized dispute resolution experts.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto pr-2">
                {arbitrators.map(arbitrator => (
                    <ArbitratorProfileCard key={arbitrator.id} arbitrator={arbitrator} />
                ))}
            </div>
        </div>
    );
};
