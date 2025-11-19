import React, { useState } from 'react';
import { UserEntity, ProposalEntity } from '../core/schemas/entities';
import { ArchitexLogo } from './icons/ArchitexLogo';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { ProposalCard } from './ProposalCard';
import { PlusIcon } from './icons/PlusIcon';
import { InfoIcon } from './icons/InfoIcon';
import { AwardIcon } from './icons/AwardIcon';
import { PiCoinIcon } from './icons/PiCoinIcon';
import { TrendingUpIcon } from './icons/TrendingUpIcon';

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
            {/* Treasury Dashboard - NEW SECTION */}
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
                            <p className="text-xs text-slate-400">Monthly Inflow</p>
                            <div className="flex items-center justify-end text-eco-green font-semibold">
                                <TrendingUpIcon className="w-4 h-4 mr-1" />
                                <span>+12.5%</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-3 h-1.5 w-full bg-slate-700 rounded-full overflow-hidden flex">
                        <div className="h-full bg-pi-gold w-[40%]" title="Grants (40%)"></div>
                        <div className="h-full bg-eco-green w-[30%]" title="Liquidity (30%)"></div>
                        <div className="h-full bg-ai-violet w-[30%]" title="Rewards (30%)"></div>
                    </div>
                    <div className="flex justify-between mt-1 text-[10px] text-slate-500">
                        <span className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-pi-gold mr-1"></div>Grants</span>
                        <span className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-eco-green mr-1"></div>Liquidity</span>
                        <span className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-ai-violet mr-1"></div>Rewards</span>
                    </div>
                </div>
            </div>

            {/* Voting Power Card */}
            <div className="flex-shrink-0 p-3 bg-slate-900/50 rounded-xl border border-white/10 text-center mb-3">
                <h4 className="font-semibold text-white text-sm">Your Voting Power</h4>
                <div className="text-3xl font-bold text-ai-violet my-1">{votingPower.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                <div className="text-xs text-slate-400">
                    <span className="font-semibold text-slate-200">{(user.stakedArchi || 0).toLocaleString()}</span> Staked ARCHI + <span className="font-semibold text-slate-200">{user.trustScore}</span> Trust Score
                </div>
            </div>

            {/* Staking Interface */}
            <div className="flex-shrink-0 mb-3 p-3 bg-slate-900/50 rounded-xl border border-white/10">
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
                <div className="grid grid-cols-2 gap-2 mt-2">
                    <button onClick={handleStake} disabled={!stakeAmount} className="px-3 py-1.5 bg-ai-violet/80 rounded-full text-sm font-semibold text-white hover:bg-ai-violet disabled:opacity-50 transition-all">Stake</button>
                    <button onClick={handleUnstake} disabled={!stakeAmount} className="px-3 py-1.5 bg-slate-700/50 rounded-full text-sm font-semibold text-slate-300 hover:bg-slate-600 disabled:opacity-50 transition-all">Unstake</button>
                </div>
            </div>
            
            <div className="flex justify-between items-center mb-2 px-1">
                <h4 className="font-semibold text-white">Governance Proposals</h4>
                <button onClick={onViewTos} className="flex items-center text-xs text-slate-400 hover:text-white transition-colors">
                    <InfoIcon className="w-4 h-4 mr-1"/>
                    <span>Model</span>
                </button>
            </div>


            <div className="flex-grow space-y-3 pr-2 overflow-y-auto min-h-0">
                {proposals.map(p => <ProposalCard key={p.id} proposal={p} onVote={onVote} onExecute={onExecute} />)}
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