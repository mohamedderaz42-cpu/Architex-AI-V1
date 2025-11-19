
import React from 'react';
import { GlassPanel } from './GlassPanel';
import { Model3dIcon } from './icons/Model3dIcon';
import { PiCoinIcon } from './icons/PiCoinIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { UserIcon } from './icons/UserIcon';
import { ArchitexLogo } from './icons/ArchitexLogo';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

interface PaymentModalProps {
    onConfirm: () => void;
    onCancel: () => void;
    isProcessing: boolean;
    error?: string | null;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ onConfirm, onCancel, isProcessing, error }) => {
    return (
        <div className="fixed inset-0 bg-brand-dark/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <GlassPanel className="w-full max-w-sm p-8 text-center animate-fade-in">
                <Model3dIcon className="w-20 h-20 mx-auto text-ai-violet mb-4" />
                <h2 className="text-2xl font-bold text-white">Model Generation</h2>
                <p className="text-slate-300 mt-2">
                    Your room scan is complete. Generate a high-fidelity 3D model.
                </p>

                <div className="my-6 bg-slate-900/50 rounded-xl border border-white/10 overflow-hidden">
                    <div className="p-4 border-b border-white/5 flex justify-between items-center">
                        <span className="text-slate-400 font-medium">Service Fee:</span>
                        <div className="flex items-center space-x-2">
                            <PiCoinIcon className="w-6 h-6 text-pi-gold" />
                            <span className="text-2xl font-bold text-white">0.50</span>
                        </div>
                    </div>
                    
                     <div className="p-4 bg-slate-800/30 flex items-center justify-between">
                        <div className="flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center mb-2">
                                <UserIcon className="w-5 h-5 text-slate-300" />
                            </div>
                            <span className="text-[10px] text-slate-400 uppercase font-bold">From You</span>
                        </div>
                        
                        <div className="flex-grow flex flex-col items-center justify-center px-2 opacity-50">
                             <ChevronRightIcon className="w-5 h-5 text-slate-500 animate-pulse" />
                        </div>
        
                        <div className="flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-ai-violet/20 border border-ai-violet/50 flex items-center justify-center mb-2">
                                <ArchitexLogo className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] text-ai-violet uppercase font-bold">To App</span>
                        </div>
                    </div>
                </div>
                
                <div className="mb-6 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-left">
                    <p className="text-xs text-yellow-200 font-bold mb-1 flex items-center">
                         ⚠️ CHECK YOUR WALLET
                    </p>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                        The payment comes from the wallet <b>active in your browser</b>. Ensure it is set to <b>Testnet</b> and has Test-Pi. The App Wallet (Receiver) is handled automatically.
                    </p>
                </div>
                
                {error && (
                    <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-sm text-red-300 flex flex-col items-start">
                        <div className="flex items-center mb-1">
                            <XCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                            <span className="font-bold">Payment Error</span>
                        </div>
                        <span className="text-left text-xs whitespace-pre-wrap">{error}</span>
                    </div>
                )}

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
                        {isProcessing ? 'Processing...' : error ? 'Retry Payment' : 'Confirm & Pay'}
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
