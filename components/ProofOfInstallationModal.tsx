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
        ? `Verification complete! We've sent ${cashbackAmount} ARCHI to your wallet. Thanks for helping build a trusted marketplace!`
        : `Your order #${order.id.slice(-4)} contains items that require installation. Upload a photo of the completed work to receive a ${cashbackAmount} ARCHI cashback reward!`;

    return (
        <div className="fixed inset-0 bg-brand-dark/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <GlassPanel className="w-full max-w-sm p-6 animate-fade-in">
                <ArchieBot message={message} />
                
                {isComplete ? (
                    <div className="text-center my-6">
                        <CheckCircleIcon className="w-20 h-20 mx-auto text-eco-green mb-4" />
                        <h3 className="text-2xl font-bold text-white">Reward Claimed!</h3>
                        <div className="mt-4 inline-flex items-center space-x-2 bg-eco-green/20 text-eco-green px-4 py-2 rounded-full">
                            <ArchitexLogo className="w-6 h-6" />
                            <span className="text-xl font-bold">+{cashbackAmount}</span>
                        </div>
                    </div>
                ) : (
                    <div className="my-6">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-slate-900/50 border-2 border-dashed border-slate-600 rounded-xl flex flex-col items-center justify-center p-6 hover:border-ai-violet transition-colors">
                            <UploadCloudIcon className="w-10 h-10 text-slate-500 mb-2" />
                            <span className="text-sm font-semibold text-slate-300">Click to upload photo</span>
                            <span className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                        </label>
                        {fileName && <p className="text-xs text-slate-400 mt-2 text-center">Selected: {fileName}</p>}
                    </div>
                )}


                <div className="flex flex-col space-y-3">
                    {isComplete ? (
                        <button onClick={onCancel} className="w-full px-6 py-3 bg-ai-violet/80 border border-ai-violet/90 rounded-full text-lg font-semibold text-white">
                            Close
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