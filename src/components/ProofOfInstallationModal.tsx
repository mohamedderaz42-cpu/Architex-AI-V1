
import React, { useState } from 'react';
import { GlassPanel } from './GlassPanel';
import { OrderEntity } from '../core/schemas/entities';
import { ArchieBot } from './ArchieBot';
import { UploadCloudIcon } from './icons/UploadCloudIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { ArchitexLogo } from './icons/ArchitexLogo';

interface ProofOfInstallationModalProps {
    order: OrderEntity;
    onConfirm: (orderId: string) => Promise<void>;
    onCancel: () => void;
}

export const ProofOfInstallationModal: React.FC<ProofOfInstallationModalProps> = ({ order, onConfirm, onCancel }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [fileName, setFileName] = useState('');

    const cashbackAmount = (order.total * 0.02).toFixed(2); // 2% cashback

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFileName(event.target.files[0].name);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await onConfirm(order.id);
            setIsComplete(true);
        } catch (error) {
            console.error("Failed to submit proof:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const message = isComplete 
        ? `Verification successful! You've earned a utility reward for helping maintain the integrity of our decentralized network.`
        : `Your order #${order.id.slice(-4)} contains items that require installation. Upload a photo of the completed work to receive a ${cashbackAmount} ARCHI cashback reward!`;

    return (
        <div className="fixed inset-0 bg-brand-dark/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <GlassPanel className="w-full max-w-sm p-6 animate-fade-in">
                <ArchieBot message={message} />
                
                {isComplete ? (
                    <div className="text-center my-8 bg-slate-900/50 p-6 rounded-2xl border border-eco-green/30">
                        <div className="relative inline-block">
                            <div className="absolute inset-0 bg-eco-green blur-xl opacity-20 rounded-full"></div>
                            <CheckCircleIcon className="relative w-16 h-16 mx-auto text-eco-green mb-4" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Utility Reward Claimed!</h3>
                        <div className="mt-4 inline-flex items-center space-x-3 bg-gradient-to-r from-slate-800 to-slate-700 border border-white/10 px-6 py-3 rounded-xl shadow-lg">
                            <ArchitexLogo className="w-8 h-8 text-ai-violet" />
                            <div className="text-left">
                                <span className="block text-2xl font-bold text-white leading-none">+{cashbackAmount}</span>
                                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">ARCHI Token</span>
                            </div>
                        </div>
                        <p className="text-xs text-slate-400 mt-4">
                            Your Trust Score has increased.
                        </p>
                    </div>
                ) : (
                    <div className="my-6">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-slate-900/50 border-2 border-dashed border-slate-600 rounded-xl flex flex-col items-center justify-center p-6 hover:border-ai-violet transition-colors group">
                            <UploadCloudIcon className="w-10 h-10 text-slate-500 mb-2 group-hover:text-ai-violet transition-colors" />
                            <span className="text-sm font-semibold text-slate-300 group-hover:text-white">Click to upload photo</span>
                            <span className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                        </label>
                        {fileName && <p className="text-xs text-slate-400 mt-2 text-center bg-slate-800/50 py-1 px-2 rounded">Selected: {fileName}</p>}
                    </div>
                )}


                <div className="flex flex-col space-y-3">
                    {isComplete ? (
                        <button onClick={onCancel} className="w-full px-6 py-3 bg-white text-brand-dark rounded-full text-lg font-bold hover:bg-slate-200 transition-colors">
                            Return to Dashboard
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting || !fileName}
                                className="group flex items-center justify-center w-full px-6 py-3 bg-eco-green/80 border border-eco-green/90 rounded-full text-lg font-semibold text-white backdrop-blur-md hover:bg-eco-green transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Verifying...' : 'Upload & Claim Reward'}
                            </button>
                            <button
                                onClick={onCancel}
                                disabled={isSubmitting}
                                className="w-full py-2 text-slate-400 font-semibold hover:text-white transition-colors duration-300 disabled:opacity-50"
                            >
                                Maybe Later
                            </button>
                        </>
                    )}
                </div>
            </GlassPanel>
        </div>
    );
};
