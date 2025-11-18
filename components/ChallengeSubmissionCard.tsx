import React from 'react';
import { ChallengeSubmissionEntity, DesignChallengeStatus } from '../core/schemas/entities';
import { ThumbsUpIcon } from './icons/ThumbsUpIcon';

interface ChallengeSubmissionCardProps {
    submission: ChallengeSubmissionEntity;
    challengeStatus: DesignChallengeStatus;
    onVote: () => void;
}

export const ChallengeSubmissionCard: React.FC<ChallengeSubmissionCardProps> = ({ submission, challengeStatus, onVote }) => {
    return (
        <div className="bg-slate-900/50 rounded-xl border border-white/10 overflow-hidden group">
            <div className="relative aspect-video">
                <img src={submission.thumbnailUrl} alt={submission.projectName} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent" />
                <div className="absolute bottom-2 left-2">
                    <p className="text-white text-xs font-bold">{submission.projectName}</p>
                    <p className="text-slate-300 text-xs">by {submission.submitterName}</p>
                </div>
            </div>
            <div className="p-2">
                 <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm">
                        <ThumbsUpIcon className="w-4 h-4 mr-1.5 text-slate-400" />
                        <span className="font-semibold text-white">{submission.votes.toLocaleString()}</span>
                        <span className="text-slate-400 ml-1">Votes</span>
                    </div>
                    {challengeStatus === 'Voting' && (
                        <button 
                            onClick={onVote}
                            className="px-2.5 py-1 bg-slate-700/50 rounded-full text-xs font-semibold text-slate-300 hover:bg-pi-gold/80 hover:text-white transition-colors"
                        >
                            Vote
                        </button>
                    )}
                 </div>
            </div>
        </div>
    );
};