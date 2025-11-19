
import React, { useState, useEffect } from 'react';
import { GlassPanel } from './GlassPanel';
import { BountyEntity, ArbitratorEntity } from '../core/schemas/entities';
import { ScaleIcon } from './icons/ScaleIcon';
import { ArbitrationInterface } from './ArbitrationInterface';
import { ArchieBot } from './ArchieBot';
import { LockIcon } from './icons/LockIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { GavelIcon } from './icons/GavelIcon';

interface DisputeResolutionModalProps {
    bounty: BountyEntity;
    arbitrators: ArbitratorEntity[];
    onConfirmDispute: (bounty: BountyEntity) => void;
    onSelectArbitrator: (bounty: BountyEntity, arbitrator: ArbitratorEntity) => Promise<void>;
    onResolve?: (bounty: BountyEntity, decision: 'Release' | 'Refund') => void;
    onClose: () => void;
}

type DisputeStep = 'init' | 'freeze_confirm' | 'select_arbitrator' | 'confirm_hire' | 'awaiting_ruling' | 'resolved';

export const DisputeResolutionModal: React.FC<DisputeResolutionModalProps> = ({ bounty, arbitrators, onConfirmDispute, onSelectArbitrator, onResolve, onClose }) => {
    const [step, setStep] = useState<DisputeStep>('init');
    const [selectedArbitrator, setSelectedArbitrator] = useState<ArbitratorEntity | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Initialize state based on current bounty status
    useEffect(() => {
        if (bounty.status === 'In Dispute') {
            setStep('select_arbitrator');
        } else if (bounty.status === 'Arbitration') {
            setStep('awaiting_ruling');
        } else {
            setStep('init');
        }
    }, [bounty.status]);

    const handleFreeze = () => {
        setIsProcessing(true);
        setTimeout(() => {
            onConfirmDispute(bounty);
            setStep('select_arbitrator');
            setIsProcessing(false);
        }, 1000);
    };

    const handleArbitratorClick = (arbitrator: ArbitratorEntity) => {
        setSelectedArbitrator(arbitrator);
        setStep('confirm_hire');
    };

    const handleConfirmHire = async () => {
        if (!selectedArbitrator) return;
        setIsProcessing(true);
        try {
            await onSelectArbitrator(bounty, selectedArbitrator);
            // The parent hook updates the bounty status, which triggers the useEffect to move to 'awaiting_ruling'
            // But we set it here visually for immediate feedback
            setStep('awaiting_ruling');
        } catch (e) {
            console.error(e);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSimulateRuling = (decision: 'Release' | 'Refund') => {
        if (onResolve) {
            setIsProcessing(true);
            setTimeout(() => {
                onResolve(bounty, decision);
                setStep('resolved');
                setIsProcessing(false);
            }, 1500);
        }
    };

    const renderContent = () => {
        switch (step) {
            case 'init':
                return (
                    <div className="space-y-4 animate-fade-in">
                        <ArchieBot message={`I've detected a request to intervene in project "${bounty.title}". To protect your assets, I must first freeze the escrow smart contract. Shall I proceed?`} />
                        <button
                            onClick={handleFreeze}
                            disabled={isProcessing}
                            className="w-full flex items-center justify-center px-6 py-3 bg-red-500/20 border border-red-500/50 rounded-full text-lg font-semibold text-red-200 hover:bg-red-500/40 hover:text-white transition-all"
                        >
                            {isProcessing ? 'Freezing Funds...' : 'Yes, Freeze Funds'}
                        </button>
                    </div>
                );
            case 'select_arbitrator':
                return (
                    <div className="space-y-4 animate-fade-in h-full flex flex-col">
                        <ArchieBot message={`Escrow frozen. Funds are secure. Now, please select a verified Arbitrator from the marketplace. I have filtered out any candidates with a conflict of interest.`} />
                        <div className="flex-grow overflow-y-auto pr-2 border-t border-white/10 pt-2">
                             <ArbitrationInterface 
                                arbitrators={arbitrators} 
                                onSelect={handleArbitratorClick} 
                            />
                        </div>
                    </div>
                );
            case 'confirm_hire':
                return (
                    <div className="space-y-4 animate-fade-in">
                        <ArchieBot message={`You selected ${selectedArbitrator?.name}. Their resolution fee is ${selectedArbitrator?.fee} PiUSD. This payment will be held by the Arbitration Marketplace Contract until the case is closed.`} />
                        
                        <div className="p-4 bg-slate-900/50 rounded-xl border border-white/10 text-center">
                            <div className="w-16 h-16 mx-auto rounded-full overflow-hidden mb-3 border-2 border-pi-gold">
                                <img src={selectedArbitrator?.avatarUrl} alt="Arb" className="w-full h-full object-cover" />
                            </div>
                            <h4 className="font-bold text-white">{selectedArbitrator?.name}</h4>
                            <p className="text-xs text-slate-400">{selectedArbitrator?.specialty}</p>
                            <div className="mt-3 text-xl font-bold text-pi-gold">{selectedArbitrator?.fee} PiUSD</div>
                        </div>

                        <div className="flex space-x-3">
                             <button
                                onClick={() => setStep('select_arbitrator')}
                                className="flex-1 py-3 text-slate-400 hover:text-white transition-colors"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleConfirmHire}
                                disabled={isProcessing}
                                className="flex-[2] flex items-center justify-center px-6 py-3 bg-pi-gold/80 border border-pi-gold/90 rounded-full text-lg font-semibold text-white hover:bg-pi-gold transition-all"
                            >
                                {isProcessing ? 'Processing...' : 'Pay Fee & Hire'}
                            </button>
                        </div>
                    </div>
                );
            case 'awaiting_ruling':
                return (
                    <div className="space-y-6 animate-fade-in text-center">
                        <ArchieBot message={`Dispute submitted. Arbitrator ${selectedArbitrator?.name || 'assigned'} is reviewing the evidence. You will be notified once a ruling is submitted to the contract.`} />
                        
                        <div className="flex justify-center my-8">
                            <div className="relative">
                                <div className="absolute inset-0 bg-pi-gold/20 blur-xl rounded-full animate-pulse"></div>
                                <ScaleIcon className="relative w-24 h-24 text-pi-gold" />
                            </div>
                        </div>

                        {/* Simulation Controls */}
                        <div className="p-3 bg-slate-800/50 rounded-xl border border-white/5">
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-3">Admin Simulation Controls</p>
                            <div className="flex space-x-2">
                                <button onClick={() => handleSimulateRuling('Release')} className="flex-1 py-2 bg-eco-green/20 text-eco-green text-xs font-bold rounded hover:bg-eco-green/30">
                                    Simulate: Release Funds
                                </button>
                                <button onClick={() => handleSimulateRuling('Refund')} className="flex-1 py-2 bg-red-500/20 text-red-400 text-xs font-bold rounded hover:bg-red-500/30">
                                    Simulate: Refund Client
                                </button>
                            </div>
                        </div>
                    </div>
                );
            case 'resolved':
                return (
                    <div className="space-y-6 animate-fade-in text-center">
                        <div className="flex justify-center mb-4">
                            <CheckCircleIcon className="w-20 h-20 text-eco-green" />
                        </div>
                        <h3 className="text-2xl font-bold text-white">Case Closed</h3>
                        <p className="text-slate-300">
                            The arbitrator has submitted their ruling. The Smart Contract has automatically executed the fund transfer.
                        </p>
                        <button
                            onClick={onClose}
                            className="w-full py-3 bg-slate-700/50 rounded-full text-white font-bold hover:bg-slate-600 transition-colors"
                        >
                            Return to Dashboard
                        </button>
                    </div>
                );
        }
    };

    return (
        <div className="fixed inset-0 bg-brand-dark/90 backdrop-blur-md flex items-center justify-center z-[80] p-4">
            <GlassPanel className="w-full max-w-md p-6 animate-fade-in flex flex-col max-h-[85vh]">
                {/* Header */}
                <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-4">
                    <div className="flex items-center">
                        {step === 'init' || step === 'freeze_confirm' ? (
                            <LockIcon className="w-6 h-6 text-red-400 mr-2" />
                        ) : (
                            <GavelIcon className="w-6 h-6 text-pi-gold mr-2" />
                        )}
                        <div>
                            <h2 className="text-lg font-bold text-white">Dispute Resolution</h2>
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Protocol v2.1</p>
                        </div>
                    </div>
                    {step !== 'resolved' && <button onClick={onClose} className="text-slate-500 hover:text-white text-2xl">&times;</button>}
                </div>
                
                {/* Content Area */}
                <div className="flex-grow flex flex-col overflow-hidden">
                    {renderContent()}
                </div>
            </GlassPanel>
        </div>
    );
};
