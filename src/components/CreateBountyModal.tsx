
import React, { useState } from 'react';
import { GlassPanel } from './GlassPanel';
import { ArchitexLogo } from './icons/ArchitexLogo';
import { AwardIcon } from './icons/AwardIcon';
import { BountyEntity, UserEntity } from '../core/schemas/entities';
import { calculateFeeDetails } from '../core/api/contract';
import { TrendingUpIcon } from './icons/TrendingUpIcon';

interface CreateBountyModalProps {
    user: UserEntity | null;
    onConfirm: (bountyDetails: Omit<BountyEntity, 'id' | 'createdAt' | 'status' | 'escrowState'>) => Promise<void>;
    onCancel: () => void;
}

export const CreateBountyModal: React.FC<CreateBountyModalProps> = ({ user, onConfirm, onCancel }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [reward, setReward] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const rewardAmount = parseFloat(reward) || 0;
    const { fee, effectiveRate, discountPercent, originalFee } = calculateFeeDetails(rewardAmount, user?.stakedArchi || 0);
    const totalCost = rewardAmount + fee;

    const handleSubmit = async () => {
        if (!title || !description || rewardAmount <= 0) return;
        setIsSubmitting(true);
        try {
            await onConfirm({
                // This would be linked to a project in a real implementation
                projectId: 'proj_generic', 
                title,
                description,
                reward: rewardAmount,
            });
            onCancel(); // Close modal on success
        } catch (error) {
            console.error("Failed to create bounty:", error);
            // Here you would show an error message to the user
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-brand-dark/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <GlassPanel className="w-full max-w-sm p-6 text-center animate-fade-in">
                <AwardIcon className="w-16 h-16 mx-auto text-eco-green mb-4" />
                <h2 className="text-2xl font-bold text-white">Create a Bounty</h2>
                <p className="text-slate-300 mt-2 text-sm">
                    Commission a designer by posting a bounty.
                </p>

                <div className="mt-6 text-left space-y-3">
                    <input type="text" placeholder="Bounty Title (e.g., 'Design a logo')" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-ai-violet/50" />
                    <textarea placeholder="Description..." value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-ai-violet/50 h-20 resize-none"></textarea>
                    <div className="relative">
                        <ArchitexLogo className="w-5 h-5 absolute top-1/2 left-3 -translate-y-1/2 text-ai-violet" />
                        <input type="number" placeholder="Reward Amount in ARCHI" value={reward} onChange={e => setReward(e.target.value)} className="w-full bg-slate-900/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-ai-violet/50" />
                    </div>
                </div>
                
                <div className="my-6 p-4 bg-slate-900/50 rounded-xl border border-white/10 text-sm">
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-2 text-left">Cost Breakdown</h4>
                    
                    <div className="flex justify-between items-center mb-1">
                         <span className="text-slate-400">Bounty Reward:</span>
                         <span className="font-mono text-white">{rewardAmount.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between items-center mb-2 pb-2 border-b border-white/5">
                        <div className="flex items-center">
                            <span className="text-slate-400 mr-2">Platform Fee:</span>
                            {discountPercent > 0 && (
                                <span className="text-[10px] bg-pi-gold/20 text-pi-gold px-1.5 py-0.5 rounded flex items-center font-bold">
                                    <TrendingUpIcon className="w-3 h-3 mr-1" /> -{discountPercent}% STAKER BONUS
                                </span>
                            )}
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="font-mono text-white">{fee.toFixed(2)}</span>
                            {discountPercent > 0 && (
                                <span className="text-[10px] text-slate-500 line-through">{originalFee.toFixed(2)}</span>
                            )}
                        </div>
                    </div>

                     <div className="flex justify-between items-center pt-1">
                        <span className="text-slate-200 font-bold">Total Cost:</span>
                        <div className="flex items-center space-x-2">
                            <ArchitexLogo className="w-4 h-4 text-ai-violet" />
                            <span className="text-lg font-bold text-white">{totalCost.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col space-y-3">
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !title || !description || rewardAmount <= 0}
                        className="group flex items-center justify-center w-full px-6 py-3 bg-eco-green/80 border border-eco-green/90 rounded-full text-lg font-semibold text-white backdrop-blur-md hover:bg-eco-green transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Bounty'}
                    </button>
                    <button
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className="w-full py-2 text-slate-400 font-semibold hover:text-white transition-colors duration-300 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                </div>
            </GlassPanel>
        </div>
    );
};
