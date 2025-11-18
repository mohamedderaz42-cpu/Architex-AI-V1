import React, { useState } from 'react';
import { GlassPanel } from './GlassPanel';
import { BountyEntity, ArbitratorEntity } from '../core/schemas/entities';
import { ArchitexLogo } from './icons/ArchitexLogo';
import { PiCoinIcon } from './icons/PiCoinIcon';
import { ScaleIcon } from './icons/ScaleIcon';
import { ArbitrationInterface } from './ArbitrationInterface';
import { ShieldQuestionIcon } from './icons/ShieldQuestionIcon';

interface BountyDetailsModalProps {
    bounty: BountyEntity;
    arbitrators: ArbitratorEntity[];
    onClose: () => void;
    onFund: (bounty: BountyEntity) => void;
    onRelease: (bounty: BountyEntity) => void;
    onDispute: (bounty: BountyEntity) => void;
    onSelectArbitrator: (arbitrator: ArbitratorEntity) => Promise<void>;
    onOpenLegalShield: () => void;
    onResolve: (bounty: BountyEntity, decision: 'Release' | 'Refund') => void;
}

export const BountyDetailsModal: React.FC<BountyDetailsModalProps> = ({ bounty, arbitrators, onClose, onFund, onRelease, onDispute, onSelectArbitrator, onOpenLegalShield, onResolve }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleAction = async (action: (b: BountyEntity) => Promise<void> | void) => {
        setIsLoading(true);
        try {
            await Promise.resolve(action(bounty));
        } finally {
            setIsLoading(false);
        }
    };
    
    const renderActionPanel = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center h-24">
                    <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            )
        }

        switch (bounty.status) {
            case 'Open':
                if (bounty.escrowState === 'Unfunded') {
                    return (
                        <button onClick={() => handleAction(onFund)} className="w-full flex items-center justify-center px-6 py-3 bg-pi-gold/80 border border-pi-gold/90 rounded-full text-lg font-semibold text-white hover:bg-pi-gold transition-all">
                            <PiCoinIcon className="w-6 h-6 mr-2" />
                            Fund Escrow & Begin
                        </button>
                    );
                }
                return null;
            case 'In Progress':
                return (
                    <div className="flex space-x-3">
                         <button onClick={() => handleAction(onDispute)} className="w-full flex items-center justify-center px-4 py-3 bg-slate-700/50 border border-white/10 rounded-full font-semibold text-slate-300 hover:bg-red-500/30 hover:text-white transition-all">
                            <ScaleIcon className="w-5 h-5 mr-2" />
                            Raise Dispute
                        </button>
                        <button onClick={() => handleAction(onRelease)} className="w-full flex items-center justify-center px-4 py-3 bg-eco-green/80 border border-eco-green/90 rounded-full font-semibold text-white hover:bg-eco-green transition-all">
                            Release Funds
                        </button>
                    </div>
                );
            case 'In Dispute':
                 return (
                    <div>
                        <h4 className="text-lg font-semibold text-center text-white mb-2">Select an Arbitrator</h4>
                        <ArbitrationInterface arbitrators={arbitrators} onSelect={(a) => onSelectArbitrator(a)} />
                    </div>
                );
            case 'Arbitration':
                 return (
                    <div className="text-center">
                        <p className="text-orange-400 font-semibold mb-3">This bounty is under arbitration.</p>
                        <div className="p-3 bg-slate-900/50 rounded-xl border border-white/10">
                            <p className="text-xs text-slate-400 mb-2">For simulation purposes, you can resolve this now:</p>
                            <div className="flex space-x-2">
                                <button onClick={() => onResolve(bounty, 'Release')} className="w-full text-sm py-2 bg-eco-green/80 rounded-lg text-white font-semibold hover:bg-eco-green">Release Funds</button>
                                <button onClick={() => onResolve(bounty, 'Refund')} className="w-full text-sm py-2 bg-red-500/80 rounded-lg text-white font-semibold hover:bg-red-500">Refund Client</button>
                            </div>
                        </div>
                    </div>
                );
            case 'Complete':
                 return <p className="text-center text-eco-green font-semibold">This bounty has been completed.</p>;
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 bg-brand-dark/80 backdrop-blur-md flex items-center justify-center z-[70] p-4">
            <GlassPanel className="w-full max-w-sm p-6 animate-fade-in relative flex flex-col max-h-[90vh]">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white text-2xl">&times;</button>
                <button onClick={onOpenLegalShield} className="absolute top-4 left-4 text-slate-400 hover:text-white" title="User Legal Shield">
                    <ShieldQuestionIcon className="w-6 h-6" />
                </button>
                
                <div className="text-center mt-4">
                    <h2 className="text-2xl font-bold text-white">{bounty.title}</h2>
                    <div className="mt-2 flex items-center justify-center space-x-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold bg-pi-gold/20 text-pi-gold`}>Escrow: {bounty.escrowState}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold bg-eco-green/20 text-eco-green`}>Status: {bounty.status}</span>
                    </div>
                </div>

                <p className="text-slate-300 my-4 text-sm text-center flex-shrink-0">
                    {bounty.description}
                </p>

                <div className="my-4 p-4 bg-slate-900/50 rounded-xl border border-white/10 flex-shrink-0">
                    <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-medium">Bounty Reward:</span>
                        <div className="flex items-center space-x-2">
                            <ArchitexLogo className="w-6 h-6 text-ai-violet" />
                            <span className="text-2xl font-bold text-white">{bounty.reward.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto pt-2">
                    {renderActionPanel()}
                </div>

            </GlassPanel>
        </div>
    );
};