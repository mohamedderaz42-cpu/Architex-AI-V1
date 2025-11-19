
import React, { useState, useEffect } from 'react';
import { GlassPanel } from './GlassPanel';
import { ServiceAgreementEntity, UserEntity, ArbitratorEntity } from '../core/schemas/entities';
import * as api from '../core/api/contract';
import { FileTextIcon } from './icons/FileTextIcon';
import { PiCoinIcon } from './icons/PiCoinIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';

interface ServiceAgreementModalProps {
    agreement: ServiceAgreementEntity;
    user: UserEntity;
    arbitrators: ArbitratorEntity[];
    onConfirm: (validatorId?: string) => Promise<void>;
    onCancel: () => void;
}

export const ServiceAgreementModal: React.FC<ServiceAgreementModalProps> = ({ agreement, user, arbitrators, onConfirm, onCancel }) => {
    const [agreementText, setAgreementText] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isChecked, setIsChecked] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const [addValidator, setAddValidator] = useState(false);
    const [selectedValidator, setSelectedValidator] = useState<string | null>(null);

    useEffect(() => {
        const fetchText = async () => {
            setIsLoading(true);
            const text = await api.getServiceLevelAgreementText(agreement);
            setAgreementText(text);
            setIsLoading(false);
        };
        fetchText();
    }, [agreement]);

    const handleConfirm = async () => {
        if (!isChecked) return;
        setIsConfirming(true);
        try {
            await onConfirm(addValidator ? selectedValidator ?? undefined : undefined);
            onCancel();
        } finally {
            setIsConfirming(false);
        }
    };
    
    const validatorFee = addValidator && selectedValidator ? arbitrators.find(a => a.id === selectedValidator)?.fee : 0;
    const totalCost = agreement.price + (validatorFee || 0);

    return (
        <div className="fixed inset-0 bg-brand-dark/80 backdrop-blur-md flex items-center justify-center z-[80] p-4">
            <GlassPanel className="w-full max-w-md p-6 animate-fade-in flex flex-col max-h-[90vh]">
                <div className="text-center flex-shrink-0">
                    <FileTextIcon className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                    <h2 className="text-2xl font-bold text-white">Service Agreement</h2>
                </div>
                
                <div className="my-4 p-3 bg-slate-900/50 rounded-xl border border-white/10 flex-grow overflow-y-auto">
                    {isLoading ? (
                        <p className="text-slate-400">Loading agreement...</p>
                    ) : (
                        <pre className="text-xs text-slate-300 whitespace-pre-wrap font-sans">
                            {agreementText}
                        </pre>
                    )}
                </div>

                <div className="flex-shrink-0 space-y-4">
                    <div className="p-3 bg-slate-900/50 rounded-xl border border-white/10">
                        <label className="flex items-center justify-between cursor-pointer">
                            <div className="flex items-center">
                                <ShieldCheckIcon className="w-6 h-6 mr-3 text-eco-green" />
                                <div>
                                    <h4 className="font-semibold text-white">Quality Assurance</h4>
                                    <p className="text-xs text-slate-400">Hire an Arbitrator to validate work.</p>
                                </div>
                            </div>
                            <input type="checkbox" checked={addValidator} onChange={() => setAddValidator(!addValidator)} className="w-5 h-5 text-ai-violet bg-slate-700 border-slate-500 rounded focus:ring-ai-violet" />
                        </label>
                        {addValidator && (
                            <div className="mt-3 animate-fade-in">
                                <select 
                                    onChange={(e) => setSelectedValidator(e.target.value)} 
                                    value={selectedValidator ?? ''} 
                                    className="w-full bg-slate-800/70 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-ai-violet/50"
                                >
                                    <option value="" disabled>Select a Validator...</option>
                                    {arbitrators.map(a => <option key={a.id} value={a.id}>{a.name} (+{a.fee} PiUSD)</option>)}
                                </select>
                                <p className="text-[10px] text-slate-500 mt-1 ml-1">Validator approval required for fund release.</p>
                            </div>
                        )}
                    </div>

                    <div className="p-3 bg-slate-900/50 rounded-xl border border-white/10 text-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400">Service Cost:</span>
                            <span className="font-semibold text-white">{agreement.price.toFixed(2)} PiUSD</span>
                        </div>
                        {addValidator && validatorFee ? (
                             <div className="flex justify-between items-center mt-1">
                                <span className="text-slate-400">Validator Fee:</span>
                                <span className="font-semibold text-white">{validatorFee.toFixed(2)} PiUSD</span>
                            </div>
                        ) : null}
                         <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/10">
                            <span className="text-slate-400 font-medium">Total to Escrow:</span>
                            <div className="flex items-center space-x-2">
                                <PiCoinIcon className="w-5 h-5 text-pi-gold" />
                                <span className="text-xl font-bold text-white">{totalCost.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                
                    <div className="flex items-center">
                        <input id="agree-checkbox-service" type="checkbox" checked={isChecked} onChange={() => setIsChecked(!isChecked)} className="w-5 h-5 text-ai-violet bg-slate-700 border-slate-500 rounded focus:ring-ai-violet" />
                        <label htmlFor="agree-checkbox-service" className="ml-3 text-sm font-medium text-slate-300">
                            I have read and agree to the terms.
                        </label>
                    </div>

                    <div className="flex flex-col space-y-3">
                        <button onClick={handleConfirm} disabled={!isChecked || isConfirming || (addValidator && !selectedValidator)} className="w-full flex items-center justify-center px-6 py-3 bg-pi-gold/80 border border-pi-gold/90 rounded-full text-lg font-semibold text-white hover:bg-pi-gold transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                            {isConfirming ? 'Processing...' : 'Sign & Fund Service'}
                        </button>
                        <button onClick={onCancel} disabled={isConfirming} className="w-full py-2 text-slate-400 font-semibold hover:text-white transition-colors disabled:opacity-50">
                            Cancel
                        </button>
                    </div>
                </div>
            </GlassPanel>
        </div>
    );
};
