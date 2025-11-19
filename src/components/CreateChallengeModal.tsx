
import React, { useState } from 'react';
import { GlassPanel } from './GlassPanel';
import { ArchitexLogo } from './icons/ArchitexLogo';
import { AwardIcon } from './icons/AwardIcon';
import { DesignChallengeEntity } from '../core/schemas/entities';
import { treasuryBalance } from '../core/api/contract';

interface CreateChallengeModalProps {
    onConfirm: (challengeData: Omit<DesignChallengeEntity, 'id' | 'status' | 'winnerId'>) => Promise<void>;
    onCancel: () => void;
}

export const CreateChallengeModal: React.FC<CreateChallengeModalProps> = ({ onConfirm, onCancel }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [reward, setReward] = useState('');
    const [durationDays, setDurationDays] = useState('7');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const rewardAmount = parseFloat(reward) || 0;
    const canAfford = rewardAmount <= treasuryBalance;

    const handleSubmit = async () => {
        if (!title || !description || rewardAmount <= 0 || !canAfford) return;
        setIsSubmitting(true);
        
        const endsAt = new Date();
        endsAt.setDate(endsAt.getDate() + (parseInt(durationDays) || 7));

        try {
            await onConfirm({
                title,
                description,
                reward: rewardAmount,
                endsAt: endsAt.toISOString(),
            });
            onCancel(); 
        } catch (error) {
            console.error("Failed to create challenge:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-brand-dark/80 backdrop-blur-md flex items-center justify-center z-[90] p-4">
            <GlassPanel className="w-full max-w-sm p-6 text-center animate-fade-in">
                <AwardIcon className="w-16 h-16 mx-auto text-pi-gold mb-4" />
                <h2 className="text-2xl font-bold text-white">Sponsor Challenge</h2>
                <p className="text-slate-300 mt-2 text-sm">
                    Create a community competition sponsored by the DAO Treasury.
                </p>

                <div className="mt-6 text-left space-y-3">
                    <input 
                        type="text" 
                        placeholder="Challenge Title" 
                        value={title} 
                        onChange={e => setTitle(e.target.value)} 
                        className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-pi-gold/50" 
                    />
                    <textarea 
                        placeholder="Description (e.g., 'Design the best futuristic kitchen')" 
                        value={description} 
                        onChange={e => setDescription(e.target.value)} 
                        className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-pi-gold/50 h-20 resize-none"
                    ></textarea>
                    
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                             <label className="block text-xs text-slate-400 mb-1">Duration (Days)</label>
                             <input 
                                type="number" 
                                value={durationDays} 
                                onChange={e => setDurationDays(e.target.value)} 
                                className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-pi-gold/50" 
                            />
                        </div>
                        <div>
                             <label className="block text-xs text-slate-400 mb-1">Reward Pool</label>
                             <div className="relative">
                                <ArchitexLogo className="w-4 h-4 absolute top-1/2 left-2 -translate-y-1/2 text-ai-violet" />
                                <input 
                                    type="number" 
                                    value={reward} 
                                    onChange={e => setReward(e.target.value)} 
                                    placeholder="ARCHI"
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-lg pl-8 pr-2 py-2 text-white focus:outline-none focus:border-ai-violet/50" 
                                />
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="my-4 p-3 bg-slate-900/50 rounded-xl border border-white/10 text-sm flex justify-between items-center">
                    <span className="text-slate-400">Treasury Balance:</span>
                    <span className={`font-bold ${canAfford ? 'text-eco-green' : 'text-red-400'}`}>
                        {treasuryBalance.toLocaleString()} ARCHI
                    </span>
                </div>

                <div className="flex flex-col space-y-3">
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !title || !description || !canAfford || rewardAmount <= 0}
                        className="group flex items-center justify-center w-full px-6 py-3 bg-pi-gold/80 border border-pi-gold/90 rounded-full text-lg font-semibold text-white backdrop-blur-md hover:bg-pi-gold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Initiating...' : 'Launch Challenge'}
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
