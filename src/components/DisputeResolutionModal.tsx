import React, { useState } from 'react';
import { GlassPanel } from './GlassPanel';
import { BountyEntity, ArbitratorEntity } from '../core/schemas/entities';
import { ScaleIcon } from './icons/ScaleIcon';
import { ArbitrationInterface } from './ArbitrationInterface';

interface DisputeResolutionModalProps {
    bounty: BountyEntity;
    arbitrators: ArbitratorEntity[];
    onConfirmDispute: (bounty: BountyEntity) => void;
    onSelectArbitrator: (bounty: BountyEntity, arbitrator: ArbitratorEntity) => void;
    onClose: () => void;
}

export const DisputeResolutionModal: React.FC<DisputeResolutionModalProps> = ({ bounty, arbitrators, onConfirmDispute, onSelectArbitrator, onClose }) => {
    const [isConfirmed, setIsConfirmed] = useState(bounty.status === 'In Dispute');

    const handleConfirm = () => {
        onConfirmDispute(bounty);
        setIsConfirmed(true);
    };

    const handleSelect = (arbitrator: ArbitratorEntity) => {
        onSelectArbitrator(bounty, arbitrator);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-brand-dark/80 backdrop-blur-md flex items-center justify-center z-[80] p-4">
            <GlassPanel className="w-full max-w-sm p-6 animate-fade-in flex flex-col max-h-[90vh]">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white text-2xl">&times;</button>
                <div className="text-center flex-shrink-0">
                    <ScaleIcon className="w-12 h-12 mx-auto text-red-400 mb-2" />
                    <h2 className="text-2xl font-bold text-white">Dispute Resolution</h2>
                </div>
                
                {!isConfirmed ? (
                    <div className="my-4">
                        <p className="text-slate-300 text-sm text-center">
                            You are about to raise a dispute for the bounty: <span className="font-bold text-white">"{bounty.title}"</span>. This will freeze the funds and begin the arbitration process.
                        </p>
                        <button
                            onClick={handleConfirm}
                            className="w-full mt-6 px-6 py-3 bg-red-500/80 border border-red-500/90 rounded-full text-lg font-semibold text-white hover:bg-red-500 transition-all"
                        >
                            Confirm & Raise Dispute
                        </button>
                    </div>
                ) : (
                    <div className="flex-grow overflow-y-auto pt-2 mt-4">
                        <h3 className="text-lg font-semibold text-center text-white mb-2">Select an Arbitrator</h3>
                        <p className="text-xs text-slate-400 text-center mb-4">An arbitrator will review the case and make a final decision. Their fee will be deducted from your PiUSD balance.</p>
                        <ArbitrationInterface 
                            arbitrators={arbitrators} 
                            onSelect={handleSelect} 
                        />
                    </div>
                )}
            </GlassPanel>
        </div>
    );
};