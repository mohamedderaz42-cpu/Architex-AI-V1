
import React from 'react';
import { GlassPanel } from './GlassPanel';
import { Model3dIcon } from './icons/Model3dIcon';
import { PiCoinIcon } from './icons/PiCoinIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { UserIcon } from './icons/UserIcon';
import { LockIcon } from './icons/LockIcon';
import { ScanAnalysis } from '../core/schemas/entities';
import { ZapIcon } from './icons/ZapIcon';

interface PaymentModalProps {
    onConfirm: () => void;
    onCancel: () => void;
    isProcessing: boolean;
    error?: string | null;
    analysis?: ScanAnalysis | null;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ onConfirm, onCancel, isProcessing, error }) => {
    return (
        <div className="fixed inset-0 bg-brand-dark/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
            <GlassPanel className="w-full max-w-sm p-6 text-center animate-fade-in flex flex-col max-h-[90vh] overflow-y-auto border-ai-violet/40 shadow-2xl">
                <div className="flex items-center justify-center mb-4">
                    <div className="p-3 bg-ai-violet/20 rounded-full border border-ai-violet/50 shadow-[0_0_20px_rgba(139,92,246,0.4)]">
                        <LockIcon className="w-8 h-8 text-ai-violet" />
                    </div>
                </div>
                
                <h2 className="text-2xl font-bold text-white">Unlock Full Design Studio</h2>
                
                <p className="text-slate-300 mt-2 text-sm leading-relaxed">
                    Your room analysis is complete. Pay the activation fee to unlock:
                </p>

                <ul className="text-left my-4 space-y-2 text-xs text-slate-300 bg-slate-900/50 p-4 rounded-xl border border-white/10">
                    <li className="flex items-center"><ZapIcon className="w-3 h-3 text-pi-gold mr-2"/> Advanced AI Style Transfer</li>
                    <li className="flex items-center"><ZapIcon className="w-3 h-3 text-pi-gold mr-2"/> High-Res 3D Model Export</li>
                    <li className="flex items-center"><ZapIcon className="w-3 h-3 text-pi-gold mr-2"/> Unlimited Design Iterations</li>
                </ul>

                <div className="mb-6 bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl border border-pi-gold/30 overflow-hidden">
                    <div className="p-4 flex justify-between items-center">
                        <span className="text-slate-400 font-medium text-sm">One-Time Fee:</span>
                        <div className="flex items-center space-x-2">
                            <PiCoinIcon className="w-6 h-6 text-pi-gold" />
                            <span className="text-2xl font-bold text-white">0.50</span>
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
                        className="group flex items-center justify-center w-full px-6 py-4 bg-gradient-to-r from-pi-gold to-yellow-500 hover:from-yellow-400 hover:to-yellow-600 border border-pi-gold rounded-full text-lg font-bold text-brand-dark transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-glow-gold hover:scale-105 transform"
                    >
                        {isProcessing ? (
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-brand-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                             <div className="flex items-center">
                                <UserIcon className="w-5 h-5 mr-2" />
                                <span>Unlock & Edit</span>
                             </div>
                        )}
                    </button>
                    <button
                        onClick={onCancel}
                        disabled={isProcessing}
                        className="w-full py-3 text-slate-400 font-semibold hover:text-white transition-colors duration-300 disabled:opacity-50 text-xs"
                    >
                        No thanks, discard analysis
                    </button>
                </div>
            </GlassPanel>
        </div>
    );
};
