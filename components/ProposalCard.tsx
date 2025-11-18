import React from 'react';
import { ProposalEntity } from '../core/schemas/entities';
import { ThumbsUpIcon } from './icons/ThumbsUpIcon';
import { ThumbsDownIcon } from './icons/ThumbsDownIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { ZapIcon } from './icons/ZapIcon';

interface ProposalCardProps {
    proposal: ProposalEntity;
    onVote: (proposalId: string, vote: 'for' | 'against') => void;
    onExecute: (proposalId: string) => void;
}

const statusInfo: { [key in ProposalEntity['status']]: { color: string; label: string } } = {
    Voting: { color: 'text-pi-gold', label: 'Voting Active' },
    Passed: { color: 'text-eco-green', label: 'Passed' },
    Failed: { color: 'text-red-400', label: 'Failed' },
    Executing: { color: 'text-ai-violet', label: 'Executing...' },
    Executed: { color: 'text-slate-300', label: 'Executed' },
};

export const ProposalCard: React.FC<ProposalCardProps> = ({ proposal, onVote, onExecute }) => {
    const totalVotes = proposal.forVotes + proposal.againstVotes;
    const forPercentage = totalVotes > 0 ? (proposal.forVotes / totalVotes) * 100 : 0;
    const againstPercentage = totalVotes > 0 ? (proposal.againstVotes / totalVotes) * 100 : 0;
    const turnoutPercentage = proposal.turnout * 100;
    const quorumPercentage = proposal.quorum * 100;
    
    const isVotingActive = proposal.status === 'Voting' && new Date() < new Date(proposal.endsAt);
    const canExecute = proposal.status === 'Passed' && new Date() > new Date(proposal.endsAt) && proposal.turnout >= proposal.quorum;

    return (
        <div className="bg-slate-900/50 p-3 rounded-xl border border-white/10">
            <div className="flex justify-between items-start">
                <h5 className="font-bold text-white text-sm">{proposal.title}</h5>
                <span className={`text-xs font-semibold ${statusInfo[proposal.status].color}`}>
                    {statusInfo[proposal.status].label}
                </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{proposal.description}</p>
            
            <div className="mt-3">
                <div className="flex h-2 rounded-full overflow-hidden bg-slate-700">
                    <div className="bg-eco-green" style={{ width: `${forPercentage}%` }}></div>
                    <div className="bg-red-500" style={{ width: `${againstPercentage}%` }}></div>
                </div>
                <div className="flex justify-between text-xs mt-1">
                    <span className="text-eco-green font-semibold">{forPercentage.toFixed(1)}% For</span>
                    <span className="text-red-400 font-semibold">{againstPercentage.toFixed(1)}% Against</span>
                </div>
            </div>

            <div className="mt-2">
                <div className="text-xs text-slate-400 mb-1">Turnout:</div>
                <div className="relative h-2 rounded-full bg-slate-700">
                    <div className="absolute h-full rounded-full bg-ai-violet" style={{width: `${turnoutPercentage}%`}}></div>
                    <div className="absolute h-full w-px bg-white/50" style={{left: `${quorumPercentage}%`}} title={`Quorum: ${quorumPercentage}%`}></div>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                    {turnoutPercentage.toFixed(1)}% / {quorumPercentage}% Quorum
                </div>
            </div>

            <div className="mt-3 pt-2 border-t border-white/10 flex space-x-2">
                {isVotingActive ? (
                    <>
                        <button onClick={() => onVote(proposal.id, 'for')} className="w-full flex items-center justify-center py-1.5 bg-eco-green/20 text-eco-green rounded-lg hover:bg-eco-green/40">
                            <ThumbsUpIcon className="w-4 h-4 mr-1.5" /> For
                        </button>
                        <button onClick={() => onVote(proposal.id, 'against')} className="w-full flex items-center justify-center py-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/40">
                            <ThumbsDownIcon className="w-4 h-4 mr-1.5" /> Against
                        </button>
                    </>
                ) : canExecute ? (
                     <button onClick={() => onExecute(proposal.id)} className="w-full flex items-center justify-center py-1.5 bg-ai-violet/80 text-white rounded-lg hover:bg-ai-violet">
                        <ZapIcon className="w-4 h-4 mr-1.5" /> Execute Proposal
                    </button>
                ) : (
                    <div className="w-full text-center text-xs text-slate-500 py-1.5">
                        Voting has ended.
                    </div>
                )}
            </div>
        </div>
    );
};