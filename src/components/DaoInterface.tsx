
import React, { useState } from 'react';
import { UserEntity, ProposalEntity } from '../core/schemas/entities';
import { ArchitexLogo } from './icons/ArchitexLogo';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { ProposalCard } from './ProposalCard';
import { PlusIcon } from './icons/PlusIcon';
import { InfoIcon } from './icons/InfoIcon';
import { AwardIcon } from './icons/AwardIcon';
import { TrendingUpIcon } from './icons/TrendingUpIcon';

interface DaoInterfaceProps {
    user: UserEntity;
    proposals: ProposalEntity[];
    onStake: (amount: number) => void;
    onUnstake: (amount: number) => void;
    onVote: (proposalId: string, vote: 'for' | 'against') => void;
    onExecute: (proposalId: string) => void;
    onViewTos: () => void;
    onOpenDetails: (proposal: ProposalEntity) => void;
    // Added props to replace hook usage
    handleClaimStakingRewards: () => void;
    votingPower: { total: number; fromTokens: number; fromTrust: number };
}

export const DaoInterface: React.FC<DaoInterfaceProps> = ({ user, proposals, onStake, onUnstake, onVote, onExecute, onViewTos, onOpenDetails, handleClaimStakingRewards, votingPower }) => {
    const [stakeAmount, setStakeAmount] = useState('');
    
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
            {/* Treasury Dashboard */}
            <div className="flex-shrink-0 mb-3 p-4 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl border border-pi-gold/30 shadow-glow-violet relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-10">
                    <ArchitexLogo className="w-32 h-32 text-white" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center space-x-2 mb-2">
                        <ShieldCheckIcon className="w-5 h-5 text-pi-gold" />
                        <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Community Treasury</h4>
                    </div>
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-xs text-slate-400">Total Value Locked</p>
                            <div className="flex items-center space-x-2">
                                <span className="text-2xl font-bold text-white">1,250,000</span>
                                <span className="text-xs font-bold text-ai-violet bg-ai-violet/20 px-2 py-0.5 rounded">ARCHI</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-slate-400">Governance APY</p>
                            <div className="flex items-center justify-end text-eco-green font-semibold">
                                <TrendingUpIcon className="w-4 h-4 mr-1" />
                                <span>15.0%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Staking Interface */}
            <div className="flex-shrink-0 mb-3 p-3 bg-slate-900/50 rounded-xl border border-white/10">
                 <div className="flex justify-between items-center mb-2">
                    <div className="text-xs text-slate-400">
                        Staked: <span className="font-bold text-white">{(user.stakedArchi || 0).toLocaleString()}</span>
                    </div>
                     <div className="text-xs text-slate-400">
                        Pending: <span className="font-bold text-pi-gold">{user.stakingPosition?.unclaimedRewards.toFixed(2) || 0}</span>
                    </div>
                </div>

                <div className="relative">
                    <ArchitexLogo className="w-5 h-5 absolute top-1/2 left-3 -translate-y-1/2 text-ai-violet" />
                    <input 
                        type="number" 
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
                        placeholder="Stake ARCHI to Vote"
                        className="w-full bg-slate-800/70 border border-white/10 rounded-full pl-10 pr-4 py-2 text-white focus:outline-none focus:border-ai-violet/50" 
                    />
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2">
                    <button onClick={handleStake} disabled={!stakeAmount} className="px-2 py-1.5 bg-ai-violet/80 rounded-lg text-xs font-semibold text-white hover:bg-ai-violet disabled:opacity-50 transition-all">Stake</button>
                    <button onClick={handleUnstake} disabled={!stakeAmount} className="px-2 py-1.5 bg-slate-700/50 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-600 disabled:opacity-50 transition-all">Unstake</button>
                    <button onClick={handleClaimStakingRewards} className="px-2 py-1.5 bg-eco-green/80 rounded-lg text-xs font-semibold text-white hover:bg-eco-green transition-all">Claim</button>
                </div>
            </div>
            
            <div className="flex justify-between items-center mb-2 px-1">
                <h4 className="font-semibold text-white">Proposals</h4>
                
                {/* Weighted Voting Power Tooltip */}
                <div className="group relative flex flex-col items-end">
                    <div className="text-xs text-slate-400 cursor-help">Voting Power: <span className="text-white font-bold">{votingPower.total.toLocaleString()}</span></div>
                    <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block bg-black p-2 rounded border border-white/20 text-[10px] w-32 z-20">
                        <div className="flex justify-between"><span>Tokens:</span> <span>{votingPower.fromTokens.toLocaleString()}</span></div>
                        <div className="flex justify-between text-eco-green"><span>Trust (x50):</span> <span>+{votingPower.fromTrust.toLocaleString()}</span></div>
                    </div>
                </div>
            </div>


            <div className="flex-grow space-y-3 pr-2 overflow-y-auto min-h-0">
                {proposals.map(p => (
                    <ProposalCard 
                        key={p.id} 
                        proposal={p} 
                        onVote={onVote} 
                        onExecute={onExecute} 
                        onOpenDetails={onOpenDetails}
                    />
                ))}
            </div>
             <div className="grid grid-cols-2 gap-2 mt-3 flex-shrink-0 pt-2 border-t border-white/5">
                 <button className="group flex items-center justify-center w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-full text-sm font-semibold text-slate-300 hover:bg-slate-700 transition-all duration-300">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Propose
                </button>
                 <button className="group flex items-center justify-center w-full px-4 py-3 bg-pi-gold/10 border border-pi-gold/50 rounded-full text-sm font-semibold text-pi-gold hover:bg-pi-gold/20 transition-all duration-300">
                    <AwardIcon className="w-4 h-4 mr-2" />
                    Challenge
                </button>
             </div>
        </div>
    );
};
