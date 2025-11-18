import React, { useState } from 'react';
import { GlassPanel } from './GlassPanel';
import { BountyEntity, ArbitratorEntity } from '../core/schemas/entities';
import { ScaleIcon } from './icons/ScaleIcon';
import { ArbitrationInterface } from './ArbitrationInterface';

interface DisputeResolutionModalProps {
    bounty: BountyEntity;
    arbitrators: ArbitratorEntity[];
    onConfirmDispute: (bounty: BountyEntity) => void;
    onSelectArbitrator: (bounty: BountyEntity, arbitrator: ArbitratorEntity) => Promise<void>;
    onClose: () => void;
}

export const DisputeResolutionModal: React.FC<DisputeResolutionModalProps> = ({ bounty, arbitrators, onConfirmDispute, onSelectArbitrator, onClose }) => {
    const [isConfirmed, setIsConfirmed] = useState(bounty.status === 'In Dispute');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleConfirm = () => {
        onConfirmDispute(bounty);
        setIsConfirmed(true);
    };

    const handleSelect = async (arbitrator: ArbitratorEntity) => {
        setIsProcessing(true);
        try {
            await onSelectArbitrator(bounty, arbitrator);
            onClose();
        } catch (error) {
            console.error("Arbitrator selection failed", error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-brand-dark/80 backdrop-blur-md flex items-center justify-center z-[80] p-4">
            <GlassPanel className="w-full max-w-sm p-6 animate-fade-in flex flex-col max-h-[90vh]">
                {!isProcessing && <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white text-2xl">&times;</button>}
                <div className="text-center flex-shrink-0">
                    <ScaleIcon className="w-12 h-12 mx-auto text-red-400 mb-2" />
                    <h2 className="text-2xl font-bold text-white">Dispute Resolution</h2>
                </div>
                
                {isProcessing ? (
                     <div className="flex-grow flex flex-col items-center justify-center min-h-[200px]">
                        <svg className="animate-spin h-10 w-10 text-pi-gold mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-slate-300 text-sm font-medium">Processing Payment...</p>
                        <p className="text-slate-500 text-xs mt-1">Please check your Pi Wallet</p>
                    </div>
                ) : !isConfirmed ? (
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