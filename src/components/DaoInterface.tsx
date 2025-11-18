import React, { useState } from 'react';
import { UserEntity, ProposalEntity } from '../core/schemas/entities';
import { ArchitexLogo } from './icons/ArchitexLogo';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { ProposalCard } from './ProposalCard';
import { PlusIcon } from './icons/PlusIcon';
import { InfoIcon } from './icons/InfoIcon';
import { AwardIcon } from './icons/AwardIcon';

interface DaoInterfaceProps {
    user: UserEntity;
    proposals: ProposalEntity[];
    onStake: (amount: number) => void;
    onUnstake: (amount: number) => void;
    onVote: (proposalId: string, vote: 'for' | 'against') => void;
    onExecute: (proposalId: string) => void;
    onViewTos: () => void;
}

export const DaoInterface: React.FC<DaoInterfaceProps> = ({ user, proposals, onStake, onUnstake, onVote, onExecute, onViewTos }) => {
    const [stakeAmount, setStakeAmount] = useState('');
    const votingPower = (user.stakedArchi || 0) + user.trustScore;

    const handleStake = () => {
        const amount = parseFloat(stakeAmount);
        if (amount > 0) {
            onStake(amount);
            setStakeAmount('');
        }
    };

    const handleUnstake = () => {
        const amount = parseFloat(stakeAmount);
        if (amount > 0) {
            onUnstake(amount);
            setStakeAmount('');
        }
    };

    return (
        <div className="p-2 flex flex-col h-full">
            <div className="flex-shrink-0 p-3 bg-slate-900/50 rounded-xl border border-white/10 text-center">
                <h4 className="font-semibold text-white">Your Voting Power</h4>
                <div className="text-3xl font-bold text-ai-violet my-1">{votingPower.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                <div className="text-xs text-slate-400">
                    <span className="font-semibold text-slate-200">{(user.stakedArchi || 0).toLocaleString()}</span> Staked ARCHI + <span className="font-semibold text-slate-200">{user.trustScore}</span> Trust Score
                </div>
            </div>

            <div className="flex-shrink-0 my-3 p-3 bg-slate-900/50 rounded-xl border border-white/10">
                <div className="relative">
                    <ArchitexLogo className="w-5 h-5 absolute top-1/2 left-3 -translate-y-1/2 text-ai-violet" />
                    <input 
                        type="number" 
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
                        placeholder="ARCHI Amount"
                        className="w-full bg-slate-800/70 border border-white/10 rounded-full pl-10 pr-4 py-2 text-white focus:outline-none focus:border-ai-violet/50" 
                    />
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                    <button onClick={handleStake} disabled={!stakeAmount} className="px-3 py-1.5 bg-ai-violet/80 rounded-full text-sm font-semibold text-white hover:bg-ai-violet disabled:opacity-50">Stake</button>
                    <button onClick={handleUnstake} disabled={!stakeAmount} className="px-3 py-1.5 bg-slate-700/50 rounded-full text-sm font-semibold text-slate-300 hover:bg-slate-600 disabled:opacity-50">Unstake</button>
                </div>
            </div>
            
            <div className="flex justify-between items-center mb-2 px-1">
                <h4 className="font-semibold text-white">Governance Proposals</h4>
                <button onClick={onViewTos} className="flex items-center text-xs text-slate-400 hover:text-white transition-colors">
                    <InfoIcon className="w-4 h-4 mr-1"/>
                    <span>Governance Model</span>
                </button>
            </div>


            <div className="flex-grow space-y-3 pr-2 overflow-y-auto">
                {proposals.map(p => <ProposalCard key={p.id} proposal={p} onVote={onVote} onExecute={onExecute} />)}
            </div>
             <div className="grid grid-cols-2 gap-2 mt-4 flex-shrink-0">
                 <button className="group flex items-center justify-center w-full px-4 py-3 bg-ai-violet/80 border border-ai-violet/90 rounded-full text-md font-semibold text-white backdrop-blur-md hover:bg-ai-violet transition-all duration-300">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    New Proposal
                </button>
                 <button className="group flex items-center justify-center w-full px-4 py-3 bg-pi-gold/80 border border-pi-gold/90 rounded-full text-md font-semibold text-white backdrop-blur-md hover:bg-pi-gold transition-all duration-300">
                    <AwardIcon className="w-5 h-5 mr-2" />
                    New Challenge
                </button>
             </div>
        </div>
    );
};