import React, { useState } from 'react';
import { GlassPanel } from './GlassPanel';
import { ProjectEntity, DesignChallengeEntity } from '../core/schemas/entities';
import { AwardIcon } from './icons/AwardIcon';

interface SubmitToChallengeModalProps {
    project: ProjectEntity;
    challenges: DesignChallengeEntity[];
    onCancel: () => void;
    onSubmit: (challengeId: string) => Promise<void>;
}

export const SubmitToChallengeModal: React.FC<SubmitToChallengeModalProps> = ({ project, challenges, onCancel, onSubmit }) => {
    const [selectedChallengeId, setSelectedChallengeId] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const openChallenges = challenges.filter(c => c.status === 'Open');

    const handleSubmit = async () => {
        if (!selectedChallengeId) return;
        setIsSubmitting(true);
        await onSubmit(selectedChallengeId);
        // On success, the parent component will close this modal
        setIsSubmitting(false);
    };

    return (
        <div className="fixed inset-0 bg-brand-dark/80 backdrop-blur-md flex items-center justify-center z-[80] p-4">
            <GlassPanel className="w-full max-w-sm p-6 animate-fade-in">
                <div className="text-center">
                    <AwardIcon className="w-12 h-12 mx-auto text-pi-gold mb-2" />
                    <h2 className="text-2xl font-bold text-white">Submit to Challenge</h2>
                    <p className="text-slate-400 mt-1 text-sm">
                        Submitting project: <span className="font-semibold text-white">"{project.name}"</span>
                    </p>
                </div>

                <div className="my-6">
                    <label htmlFor="challenge-select" className="block text-sm font-medium text-slate-300 mb-2">Select an active challenge:</label>
                    <select
                        id="challenge-select"
                        value={selectedChallengeId}
                        onChange={(e) => setSelectedChallengeId(e.target.value)}
                        className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-pi-gold/50"
                    >
                        <option value="" disabled>Choose a challenge...</option>
                        {openChallenges.map(c => (
                            <option key={c.id} value={c.id}>
                                {c.title} (Prize: {c.reward.toLocaleString()} ARCHI)
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col space-y-3">
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !selectedChallengeId}
                        className="w-full px-6 py-3 bg-pi-gold/80 border border-pi-gold/90 rounded-full text-lg font-semibold text-white hover:bg-pi-gold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Project'}
                    </button>
                    <button
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className="w-full py-2 text-slate-400 font-semibold hover:text-white transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                </div>
            </GlassPanel>
        </div>
    );
};