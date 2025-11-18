import React from 'react';
import { ArbitratorEntity } from '../core/schemas/entities';
import { PiCoinIcon } from './icons/PiCoinIcon';

interface ArbitratorCardProps {
    arbitrator: ArbitratorEntity;
    onSelect: () => void;
}

export const ArbitratorCard: React.FC<ArbitratorCardProps> = ({ arbitrator, onSelect }) => {
    return (
        <div className="bg-slate-900/50 p-3 rounded-xl border border-white/10 flex items-center space-x-3">
            <img src={arbitrator.avatarUrl} alt={arbitrator.name} className="w-12 h-12 rounded-full border-2 border-slate-600" />
            <div className="flex-grow">
                <h5 className="font-bold text-white">{arbitrator.name}</h5>
                <div className="text-xs text-slate-400 space-x-2">
                    <span>{arbitrator.resolutionRate}% Rate</span>
                    <span>•</span>
                    <span>{arbitrator.casesResolved} Cases</span>
                </div>
            </div>
            <button
                onClick={onSelect}
                className="flex flex-col items-center px-3 py-1.5 bg-slate-700/50 border border-white/10 rounded-lg text-xs font-semibold text-slate-300 hover:bg-pi-gold/30 hover:text-white transition-all"
            >
                <span className="text-lg font-bold">{arbitrator.fee}</span>
                <div className="flex items-center text-pi-gold -mt-1">
                    <PiCoinIcon className="w-3 h-3 mr-0.5" />
                    <span className="text-xs">PiUSD</span>
                </div>
            </button>
        </div>
    );
};