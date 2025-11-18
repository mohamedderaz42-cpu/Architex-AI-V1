import React from 'react';
import { GlassPanel } from './GlassPanel';
import { Model3dIcon } from './icons/Model3dIcon';
import { PiCoinIcon } from './icons/PiCoinIcon';

interface PaymentModalProps {
    onConfirm: () => void;
    onCancel: () => void;
    isProcessing: boolean;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ onConfirm, onCancel, isProcessing }) => {
    return (
        <div className="fixed inset-0 bg-brand-dark/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <GlassPanel className="w-full max-w-sm p-8 text-center animate-fade-in">
                <Model3dIcon className="w-20 h-20 mx-auto text-ai-violet mb-4" />
                <h2 className="text-2xl font-bold text-white">Model Generation</h2>
                <p className="text-slate-300 mt-2">
                    Your room scan is complete. Generate a high-fidelity 3D model for 0.50 Pi.
                </p>

                <div className="my-8 p-4 bg-slate-900/50 rounded-xl border border-white/10">
                    <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-medium">Service Fee:</span>
                        <div className="flex items-center space-x-2">
                            <PiCoinIcon className="w-6 h-6 text-pi-gold" />
                            <span className="text-2xl font-bold text-white">0.50</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col space-y-3">
                    <button
                        onClick={onConfirm}
                        disabled={isProcessing}
                        className="group flex items-center justify-center w-full px-6 py-3 bg-pi-gold/80 border border-pi-gold/90 rounded-full text-lg font-semibold text-white backdrop-blur-md hover:bg-pi-gold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isProcessing ? (
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                             <PiCoinIcon className="w-6 h-6 mr-2" />
                        )}
                        {isProcessing ? 'Processing...' : 'Confirm & Pay'}
                    </button>
                    <button
                        onClick={onCancel}
                        disabled={isProcessing}
                        className="w-full py-3 text-slate-400 font-semibold hover:text-white transition-colors duration-300 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                </div>
            </GlassPanel>
        </div>
    );
};