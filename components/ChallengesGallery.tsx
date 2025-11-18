import React from 'react';
import { DesignChallengeEntity } from '../core/schemas/entities';
import { DesignChallengeCard } from './DesignChallengeCard';
import { AwardIcon } from './icons/AwardIcon';

interface ChallengesGalleryProps {
    challenges: DesignChallengeEntity[];
    onSelectChallenge: (challenge: DesignChallengeEntity) => void;
}

export const ChallengesGallery: React.FC<ChallengesGalleryProps> = ({ challenges, onSelectChallenge }) => {
    const activeChallenges = challenges.filter(c => c.status !== 'Complete');
    const pastChallenges = challenges.filter(c => c.status === 'Complete');

    return (
        <div className="w-full h-full flex flex-col">
            <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-white">Design Challenges</h2>
                <p className="text-slate-400 mt-1 text-sm">Compete with other designers for ARCHI rewards.</p>
            </div>

            <div className="flex-grow overflow-y-auto space-y-4 pr-2">
                <div>
                    <h3 className="font-semibold text-lg text-slate-300 px-2 mb-2">Active Challenges</h3>
                    {activeChallenges.length > 0 ? (
                        <div className="space-y-3">
                            {activeChallenges.map(challenge => (
                                <DesignChallengeCard key={challenge.id} challenge={challenge} onClick={() => onSelectChallenge(challenge)} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-slate-500 py-8">
                            <AwardIcon className="w-12 h-12 mx-auto mb-2" />
                            <p>No active challenges right now. Check back soon!</p>
                        </div>
                    )}
                </div>
                 <div>
                    <h3 className="font-semibold text-lg text-slate-300 px-2 mb-2">Past Challenges</h3>
                     {pastChallenges.length > 0 ? (
                        <div className="space-y-3">
                            {pastChallenges.map(challenge => (
                                <DesignChallengeCard key={challenge.id} challenge={challenge} onClick={() => onSelectChallenge(challenge)} />
                            ))}
                        </div>
                     ) : (
                         <div className="text-center text-slate-500 py-8">
                            <p>No past challenges yet.</p>
                        </div>
                     )}
                </div>
            </div>
        </div>
    );
};