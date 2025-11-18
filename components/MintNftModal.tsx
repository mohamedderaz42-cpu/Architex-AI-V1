import React, { useState } from 'react';
import { GlassPanel } from './GlassPanel';
import { NftIcon } from './icons/NftIcon';
import { ProjectEntity } from '../core/schemas/entities';
import { ArchitexLogo } from './icons/ArchitexLogo';

interface MintNftModalProps {
    project: ProjectEntity;
    onConfirm: () => Promise<void>;
    onCancel: () => void;
}

const MINT_FEE = 250; // Should match API

export const MintNftModal: React.FC<MintNftModalProps> = ({ project, onConfirm, onCancel }) => {
    const [isMinting, setIsMinting] = useState(false);

    const handleConfirm = async () => {
        setIsMinting(true);
        try {
            await onConfirm();
            onCancel(); // Close modal on success
        } catch (error) {
            console.error("Failed to mint NFT:", error);
            // Show error to user
        } finally {
            setIsMinting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-brand-dark/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <GlassPanel className="w-full max-w-sm p-8 text-center animate-fade-in">
                <NftIcon className="w-20 h-20 mx-auto text-ai-violet mb-4" />
                <h2 className="text-2xl font-bold text-white">Mint Project as NFT</h2>
                <p className="text-slate-300 mt-2">
                    Create a unique, ownable digital asset of your project <span className="font-bold text-white">"{project.name}"</span> on the Pi blockchain.
                </p>

                <div className="my-8 p-4 bg-slate-900/50 rounded-xl border border-white/10">
                    <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-medium">Minting Fee:</span>
                        <div className="flex items-center space-x-2">
                            <ArchitexLogo className="w-6 h-6 text-ai-violet" />
                            <span className="text-2xl font-bold text-white">{MINT_FEE.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col space-y-3">
                    <button
                        onClick={handleConfirm}
                        disabled={isMinting}
                        className="group flex items-center justify-center w-full px-6 py-3 bg-ai-violet/80 border border-ai-violet/90 rounded-full text-lg font-semibold text-white backdrop-blur-md hover:bg-ai-violet transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isMinting ? 'Minting...' : 'Confirm & Mint'}
                    </button>
                    <button
                        onClick={onCancel}
                        disabled={isMinting}
                        className="w-full py-3 text-slate-400 font-semibold hover:text-white transition-colors duration-300 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                </div>
            </GlassPanel>
        </div>
    );
};