import React, { useState } from 'react';
import { GlassPanel } from './GlassPanel';
import { FileTextIcon } from './icons/FileTextIcon';
import { PiCoinIcon } from './icons/PiCoinIcon';

interface AgreementModalProps {
    agreementText: string;
    onConfirm: () => Promise<void>;
    onCancel: () => void;
}

export const AgreementModal: React.FC<AgreementModalProps> = ({ agreementText, onConfirm, onCancel }) => {
    const [isChecked, setIsChecked] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);

    const handleConfirm = async () => {
        if (!isChecked) return;
        setIsConfirming(true);
        try {
            await onConfirm();
        } finally {
            setIsConfirming(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-brand-dark/80 backdrop-blur-md flex items-center justify-center z-[80] p-4">
            <GlassPanel className="w-full max-w-sm p-6 animate-fade-in flex flex-col max-h-[90vh]">
                <div className="text-center flex-shrink-0">
                    <FileTextIcon className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                    <h2 className="text-2xl font-bold text-white">Service Agreement</h2>
                    <p className="text-slate-400 mt-1 text-sm">Please review and agree to the terms.</p>
                </div>

                <div className="my-4 p-3 bg-slate-900/50 rounded-xl border border-white/10 flex-grow overflow-y-auto">
                    <pre className="text-xs text-slate-300 whitespace-pre-wrap font-sans">
                        {agreementText}
                    </pre>
                </div>

                <div className="flex-shrink-0">
                    <div className="flex items-center my-4">
                        <input
                            id="agree-checkbox"
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => setIsChecked(!isChecked)}
                            className="w-5 h-5 text-ai-violet bg-slate-700 border-slate-500 rounded focus:ring-ai-violet"
                        />
                        <label htmlFor="agree-checkbox" className="ml-3 text-sm font-medium text-slate-300">
                            I have read and agree to the terms.
                        </label>
                    </div>

                    <div className="flex flex-col space-y-3">
                        <button
                            onClick={handleConfirm}
                            disabled={!isChecked || isConfirming}
                            className="w-full flex items-center justify-center px-6 py-3 bg-pi-gold/80 border border-pi-gold/90 rounded-full text-lg font-semibold text-white hover:bg-pi-gold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isConfirming ? 'Processing...' : 'Sign & Fund Escrow'}
                        </button>
                        <button
                            onClick={onCancel}
                            disabled={isConfirming}
                            className="w-full py-2 text-slate-400 font-semibold hover:text-white transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </GlassPanel>
        </div>
    );
};