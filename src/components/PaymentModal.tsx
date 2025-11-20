
import React from 'react';
import { GlassPanel } from './GlassPanel';
import { Model3dIcon } from './icons/Model3dIcon';
import { PiCoinIcon } from './icons/PiCoinIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { UserIcon } from './icons/UserIcon';
import { ArchitexLogo } from './icons/ArchitexLogo';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { ScanAnalysis } from '../core/schemas/entities';
import { LockIcon } from './icons/LockIcon';

interface PaymentModalProps {
    onConfirm: () => void;
    onCancel: () => void;
    isProcessing: boolean;
    error?: string | null;
    analysis?: ScanAnalysis | null;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ onConfirm, onCancel, isProcessing, error, analysis }) => {
    return (
        <div className="fixed inset-0 bg-brand-dark/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
            <GlassPanel className="w-full max-w-sm p-6 text-center animate-fade-in flex flex-col max-h-[90vh] overflow-y-auto border-ai-violet/40">
                <div className="flex items-center justify-center mb-4">
                    <div className="p-3 bg-ai-violet/20 rounded-full border border-ai-violet/50">
                        <LockIcon className="w-8 h-8 text-ai-violet" />
                    </div>
                </div>
                
                <h2 className="text-2xl font-bold text-white">Unlock Design Studio</h2>
                
                <p className="text-slate-300 mt-2 text-sm">
                    Your room analysis is ready. Unlock the full generative suite to edit, visualize styles, and export 3D models.
                </p>

                <div className="my-6 bg-slate-900/50 rounded-xl border border-white/10 overflow-hidden">
                    <div className="p-4 border-b border-white/5 flex justify-between items-center">
                        <span className="text-slate-400 font-medium text-sm">Activation Fee:</span>
                        <div className="flex items-center space-x-2">
                            <PiCoinIcon className="w-5 h-5 text-pi-gold" />
                            <span className="text-xl font-bold text-white">0.50</span>
                        </div>
                    </div>
                    
                     <div className="p-4 bg-slate-800/30 flex items-center justify-between">
                        <div className="flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center mb-2">
                                <UserIcon className="w-5 h-5 text-slate-300" />
                            </div>
                            <span className="text-[10px] text-slate-400 uppercase font-bold">Wallet</span>
                        </div>
                        
                        <div className="flex-grow flex flex-col items-center justify-center px-2 opacity-50">
                             <div className="h-[1px] w-full bg-white/20 relative">
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-900 px-1">
                                    <ChevronRightIcon className="w-4 h-4 text-slate-500" />
                                </div>
                             </div>
                        </div>
        
                        <div className="flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-eco-green/20 border border-eco-green/50 flex items-center justify-center mb-2 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                                <Model3dIcon className="w-5 h-5 text-eco-green" />
                            </div>
                            <span className="text-[10px] text-eco-green uppercase font-bold">Studio</span>
                        </div>
                    </div>
                </div>
                
                {error && (
                    <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-sm text-red-300 flex flex-col items-start animate-shake">
                        <div className="flex items-center mb-1">
                            <XCircleIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span className="font-bold">Transaction Failed</span>
                        </div>
                        <span className="text-left text-xs">{error}</span>
                    </div>
                )}

                <div className="flex flex-col space-y-3">
                    <button
                        onClick={onConfirm}
                        disabled={isProcessing}
                        className="group flex items-center justify-center w-full px-6 py-3 bg-pi-gold hover:bg-yellow-400 border border-pi-gold rounded-full text-lg font-bold text-brand-dark transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-glow-gold"
                    >
                        {isProcessing ? (
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-brand-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                             <PiCoinIcon className="w-6 h-6 mr-2" />
                        )}
                        {isProcessing ? 'Confirming...' : 'Pay & Unlock'}
                    </button>
                    <button
                        onClick={onCancel}
                        disabled={isProcessing}
                        className="w-full py-3 text-slate-400 font-semibold hover:text-white transition-colors duration-300 disabled:opacity-50"
                    >
                        Maybe Later
                    </button>
                </div>
            </GlassPanel>
        </div>
    );
};
