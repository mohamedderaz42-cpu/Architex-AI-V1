
import React, { useState } from 'react';
import { GlassPanel } from './GlassPanel';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';

interface DropshipAgreementModalProps {
    onConfirm: () => void;
    onCancel: () => void;
}

export const DropshipAgreementModal: React.FC<DropshipAgreementModalProps> = ({ onConfirm, onCancel }) => {
    const [agreed, setAgreed] = useState(false);

    return (
        <div className="fixed inset-0 bg-brand-dark/90 backdrop-blur-md flex items-center justify-center z-[110] p-4">
            <GlassPanel className="w-full max-w-md p-6">
                <div className="text-center mb-6">
                    <ShieldCheckIcon className="w-12 h-12 mx-auto text-red-500 mb-2" />
                    <h2 className="text-xl font-bold text-white">Merchant Responsibility</h2>
                    <p className="text-sm text-slate-400">Liability Agreement Protocol</p>
                </div>

                <div className="bg-slate-900/50 border border-red-500/30 p-4 rounded-xl mb-6 text-xs text-slate-300 space-y-3 max-h-64 overflow-y-auto">
                    <p>By activating Dropshipping mode, you act as an independent Merchant. Architex provides the technology but assumes <strong className="text-white">NO LIABILITY</strong> for logistics, product quality, or delivery times.</p>
                    <ul className="list-disc pl-4 space-y-1">
                        <li>You are the "Seller of Record" for the buyer.</li>
                        <li>You are solely responsible for forwarding orders to the original vendor.</li>
                        <li>You must handle all customer support disputes.</li>
                        <li>You agree to indemnify Architex against any claims arising from your sales.</li>
                        <li>A 2% Platform Fee will be deducted from each transaction to cover smart contract operations.</li>
                    </ul>
                </div>

                <label className="flex items-start space-x-3 mb-6 cursor-pointer">
                    <input 
                        type="checkbox" 
                        checked={agreed} 
                        onChange={() => setAgreed(!agreed)}
                        className="mt-1 w-5 h-5 text-red-500 bg-slate-800 border-slate-600 rounded focus:ring-red-500"
                    />
                    <span className="text-sm text-white">I accept full legal responsibility for order fulfillment and customer service.</span>
                </label>

                <div className="flex space-x-3">
                    <button onClick={onCancel} className="flex-1 py-3 text-slate-400 hover:text-white">Cancel</button>
                    <button 
                        onClick={onConfirm}
                        disabled={!agreed}
                        className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Confirm & Activate
                    </button>
                </div>
            </GlassPanel>
        </div>
    );
};
