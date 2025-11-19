
import React, { useState, useEffect } from 'react';
import { TokenEntity, VestingSchedule } from '../core/schemas/entities';
import { ArchitexLogo } from './icons/ArchitexLogo';
import { PiCoinIcon } from './icons/PiCoinIcon';
import { LockIcon } from './icons/LockIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import * as api from '../core/api/contract';

interface WalletPanelProps {
    userTokens: TokenEntity[];
    onClaim: () => void;
}

export const WalletPanel: React.FC<WalletPanelProps> = ({ userTokens, onClaim }) => {
    const [vestingSchedule, setVestingSchedule] = useState<VestingSchedule | null>(null);
    const [claimableAmount, setClaimableAmount] = useState(0);
    const [isClaiming, setIsClaiming] = useState(false);

    useEffect(() => {
        // Mock fetching user ID securely
        const userId = 'user_01'; 
        api.getVestingSchedule(userId).then(schedule => {
            if (schedule) {
                setVestingSchedule(schedule);
                calculateClaimable(schedule);
            }
        });
    }, [userTokens]);

    const calculateClaimable = (schedule: VestingSchedule) => {
        const now = Date.now();
        const startTime = new Date(schedule.startTime).getTime();
        const durationMillis = schedule.duration * 1000;
        const cliffMillis = schedule.cliff * 1000;

        if (now < startTime + cliffMillis) {
            setClaimableAmount(0);
            return;
        }

        const timeElapsed = Math.min(now - startTime, durationMillis);
        const vested = Math.floor(schedule.totalAmount * (timeElapsed / durationMillis));
        const claimable = Math.max(0, vested - schedule.releasedAmount);
        setClaimableAmount(claimable);
    };

    const handleClaim = async () => {
        setIsClaiming(true);
        try {
            await onClaim(); // Parent handles the toast
            // Update local state after claim
            const updatedSchedule = await api.getVestingSchedule('user_01');
            if(updatedSchedule) {
                setVestingSchedule(updatedSchedule);
                calculateClaimable(updatedSchedule);
            }
        } finally {
            setIsClaiming(false);
        }
    };

    const archiBalance = userTokens.find(t => t.symbol === 'ARCHI')?.balance || 0;
    const piBalance = userTokens.find(t => t.symbol === 'PiUSD')?.balance || 0;

    // Calculate percentages for progress bar
    const vestedPercent = vestingSchedule ? Math.min(100, (vestingSchedule.releasedAmount + claimableAmount) / vestingSchedule.totalAmount * 100) : 0;
    const releasedPercent = vestingSchedule ? (vestingSchedule.releasedAmount / vestingSchedule.totalAmount * 100) : 0;


    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
                 <div className="bg-slate-800/50 p-3 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center">
                    <div className="text-xs text-slate-400 mb-1">Available ARCHI</div>
                    <div className="flex items-center space-x-2">
                        <ArchitexLogo className="w-6 h-6 text-ai-violet" />
                        <span className="text-2xl font-bold text-white">{archiBalance.toLocaleString()}</span>
                    </div>
                 </div>
                 <div className="bg-slate-800/50 p-3 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center">
                    <div className="text-xs text-slate-400 mb-1">Pi Balance</div>
                    <div className="flex items-center space-x-2">
                        <PiCoinIcon className="w-6 h-6 text-pi-gold" />
                        <span className="text-2xl font-bold text-white">{piBalance.toFixed(2)}</span>
                    </div>
                 </div>
            </div>

            {vestingSchedule && (
                <div className="bg-slate-900/80 p-4 rounded-xl border border-ai-violet/30">
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center space-x-2">
                            <LockIcon className="w-5 h-5 text-slate-400" />
                            <h4 className="text-sm font-bold text-white">Vesting Schedule</h4>
                        </div>
                        <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded">Early Adopter Grant</span>
                    </div>

                    <div className="relative h-2 bg-slate-700 rounded-full mb-1 overflow-hidden">
                        <div className="absolute h-full bg-ai-violet/50" style={{width: `${vestedPercent}%`}}></div>
                        <div className="absolute h-full bg-eco-green" style={{width: `${releasedPercent}%`}}></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 mb-4">
                        <span>Start: {new Date(vestingSchedule.startTime).toLocaleDateString()}</span>
                        <span>Total: {vestingSchedule.totalAmount.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between items-center bg-black/20 p-2 rounded-lg">
                         <div className="text-xs">
                             <span className="text-slate-400">Claimable:</span>
                             <div className="font-bold text-white">{claimableAmount.toLocaleString()} ARCHI</div>
                         </div>
                         <button 
                            onClick={handleClaim}
                            disabled={claimableAmount <= 0 || isClaiming}
                            className="px-4 py-2 bg-ai-violet hover:bg-ai-violet/80 disabled:bg-slate-700 disabled:text-slate-500 text-white text-xs font-bold rounded-full transition-all"
                        >
                             {isClaiming ? 'Claiming...' : 'Claim Tokens'}
                         </button>
                    </div>
                </div>
            )}

            <div className="p-3 bg-slate-900/30 rounded-xl border border-white/5">
                <div className="flex items-center justify-between mb-2">
                    <h5 className="text-xs font-bold text-slate-300 uppercase">Contract Stats</h5>
                    <ShieldCheckIcon className="w-4 h-4 text-eco-green" />
                </div>
                <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                        <span className="text-slate-500">Total Supply</span>
                        <span className="text-slate-300">1,000,000,000 ARCHI</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">Treasury Balance</span>
                        <span className="text-pi-gold font-mono">{api.treasuryBalance.toLocaleString()} ARCHI</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
