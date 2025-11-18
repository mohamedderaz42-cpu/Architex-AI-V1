import React from 'react';
import { GlassPanel } from './GlassPanel';
import { DesignChallengeEntity, ChallengeSubmissionEntity } from '../core/schemas/entities';
import { ArchitexLogo } from './icons/ArchitexLogo';
import { ChallengeSubmissionCard } from './ChallengeSubmissionCard';

interface ChallengeDetailsModalProps {
    challenge: DesignChallengeEntity;
    submissions: ChallengeSubmissionEntity[];
    onClose: () => void;
    onVote: (submissionId: string) => void;
}

export const ChallengeDetailsModal: React.FC<ChallengeDetailsModalProps> = ({ challenge, submissions, onClose, onVote }) => {
    
    return (
        <div className="fixed inset-0 bg-brand-dark/80 backdrop-blur-md flex items-center justify-center z-[70] p-4">
            <GlassPanel className="w-full max-w-md p-6 animate-fade-in flex flex-col max-h-[90vh]">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white text-2xl z-10">&times;</button>
                
                <div className="text-center flex-shrink-0">
                    <h2 className="text-2xl font-bold text-white">{challenge.title}</h2>
                    <p className="text-sm text-slate-300 mt-2 max-w-xs mx-auto">{challenge.description}</p>
                    <div className="mt-4 inline-flex items-center space-x-2 bg-pi-gold/20 text-pi-gold px-4 py-2 rounded-full">
                        <ArchitexLogo className="w-6 h-6" />
                        <span className="text-xl font-bold">{challenge.reward.toLocaleString()} ARCHI Prize</span>
                    </div>
                </div>

                <div className="mt-4 border-t border-white/10 pt-4 flex-grow overflow-y-auto">
                    <h3 className="font-semibold text-lg text-white text-center mb-3">Submissions ({submissions.length})</h3>
                    {submissions.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3 pr-2">
                           {submissions.map(sub => (
                               <ChallengeSubmissionCard 
                                    key={sub.id}
                                    submission={sub}
                                    onVote={() => onVote(sub.id)}
                                    challengeStatus={challenge.status}
                               />
                           ))}
                        </div>
                    ) : (
                        <div className="text-center text-slate-500 pt-8">
                            <p>No submissions yet. Be the first!</p>
                        </div>
                    )}
                </div>

            </GlassPanel>
        </div>
    );
};