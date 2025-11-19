
import React, { useState } from 'react';
import { mockLiquidityPool, addLiquidity, stakeLpTokens, claimMiningRewards } from '../core/api/contract';
import { PlusIcon } from './icons/PlusIcon';
import { PiCoinIcon } from './icons/PiCoinIcon';
import { ArchitexLogo } from './icons/ArchitexLogo';
import { AnchorIcon } from './icons/AnchorIcon';
import { TrendingUpIcon } from './icons/TrendingUpIcon';
import { useToast } from './Toast';

export const LiquidityInterface: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'pool' | 'farm'>('pool');
    const [piAmount, setPiAmount] = useState('');
    const [archiAmount, setArchiAmount] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const { addToast } = useToast();

    const handleAddLiquidity = async () => {
        if (!piAmount || !archiAmount) return;
        setIsAdding(true);
        await addLiquidity(parseFloat(piAmount), parseFloat(archiAmount));
        setIsAdding(false);
        setPiAmount('');
        setArchiAmount('');
        addToast('Liquidity Added & Auto-staked', 'success');
    }
    
    const handleClaimRewards = async () => {
        try {
            await claimMiningRewards();
            addToast('Mining Rewards Claimed', 'success');
        } catch(e) {
            addToast('No rewards to claim yet', 'info');
        }
    }

    const renderPool = () => {
        // Calculate liquidity breakdown
        const totalLocked = mockLiquidityPool.totalValueLocked;
        const pol = mockLiquidityPool.protocolLiquidity || 0;
        const communityLiquidity = totalLocked - pol;
        const polPercentage = (pol / totalLocked) * 100;
        
        return (
            <div className="space-y-4 mt-2">
                 <div className="bg-slate-900/50 p-4 rounded-xl border border-white/10">
                    <h4 className="text-xs text-slate-400 font-bold uppercase mb-2">Liquidity Composition</h4>
                    <div className="relative h-4 bg-slate-700 rounded-full overflow-hidden mb-2">
                        <div className="absolute h-full bg-pi-gold/80" style={{width: `${polPercentage}%`}} title={`Protocol Owned: ${polPercentage.toFixed(1)}%`}></div>
                    </div>
                    <div className="flex justify-between text-xs">
                        <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-pi-gold/80 mr-1"></div>
                            <span className="text-white font-semibold">Protocol Owned (Locked)</span>
                        </div>
                         <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-slate-700 mr-1"></div>
                            <span className="text-slate-400">Community</span>
                        </div>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2 text-center">
                        The Liquidity Fund guarantees deep liquidity and price stability.
                    </p>
                </div>

                <div className="space-y-3">
                    <div className="relative">
                        <PiCoinIcon className="w-5 h-5 absolute top-1/2 left-3 -translate-y-1/2 text-pi-gold" />
                        <input 
                            type="number" 
                            value={piAmount}
                            onChange={(e) => setPiAmount(e.target.value)}
                            placeholder="PiUSD Amount"
                            className="w-full bg-slate-900/50 border border-white/10 rounded-full pl-10 pr-4 py-3 text-white focus:outline-none focus:border-pi-gold/50" 
                        />
                    </div>
                        <div className="relative">
                        <ArchitexLogo className="w-5 h-5 absolute top-1/2 left-3 -translate-y-1/2 text-ai-violet" />
                        <input 
                            type="number" 
                            value={archiAmount}
                            onChange={(e) => setArchiAmount(e.target.value)}
                            placeholder="ARCHI Amount"
                            className="w-full bg-slate-900/50 border border-white/10 rounded-full pl-10 pr-4 py-3 text-white focus:outline-none focus:border-ai-violet/50" 
                        />
                    </div>

                    <button
                        onClick={handleAddLiquidity}
                        disabled={isAdding || !piAmount || !archiAmount}
                        className="group mt-4 flex items-center justify-center w-full px-6 py-3 bg-eco-green/80 border border-eco-green/90 rounded-full text-lg font-semibold text-white backdrop-blur-md hover:bg-eco-green transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <PlusIcon className="w-6 h-6 mr-2" />
                        {isAdding ? 'Adding...' : 'Add Liquidity'}
                    </button>
                </div>
            </div>
        );
    };

    const renderFarm = () => (
        <div className="mt-2">
             <div className="bg-slate-800/50 p-4 rounded-xl border border-eco-green/30 mb-4 text-center">
                <div className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Your Farmed Rewards</div>
                <div className="text-3xl font-bold text-eco-green mb-2">12.54 <span className="text-sm text-white">ARCHI</span></div>
                <button 
                    onClick={handleClaimRewards}
                    className="px-4 py-1.5 bg-eco-green text-white text-sm font-bold rounded-full hover:bg-eco-green/80 transition-colors"
                >
                    Claim Yield
                </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-900/50 p-3 rounded-lg text-center">
                    <div className="text-slate-400 text-xs">APY</div>
                    <div className="text-white font-bold text-lg">25.0%</div>
                </div>
                 <div className="bg-slate-900/50 p-3 rounded-lg text-center">
                    <div className="text-slate-400 text-xs">Total Staked</div>
                    <div className="text-white font-bold text-lg">$5.2M</div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-4 flex flex-col h-full">
            <div className="flex justify-center mb-4">
                <div className="bg-slate-900/50 p-1 rounded-full flex space-x-1">
                    <button 
                        onClick={() => setActiveTab('pool')}
                        className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${activeTab === 'pool' ? 'bg-white text-brand-dark' : 'text-slate-400 hover:text-white'}`}
                    >
                        Liquidity
                    </button>
                     <button 
                        onClick={() => setActiveTab('farm')}
                        className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${activeTab === 'farm' ? 'bg-eco-green text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                        Mining Farm
                    </button>
                </div>
            </div>
            
            <div className="mb-2 p-4 bg-slate-900/50 rounded-xl border border-white/10 text-center">
                <div className="text-xs text-slate-400">Your Pool Share</div>
                <div className="text-2xl font-bold text-white mt-1">
                    {(mockLiquidityPool.userShare * 100).toFixed(3)}%
                </div>
                <div className="text-xs text-slate-400 mt-2">
                    TVL: ${mockLiquidityPool.totalValueLocked.toLocaleString()}
                </div>
            </div>

            {activeTab === 'pool' ? renderPool() : renderFarm()}

            <div className="mt-auto pt-4 flex items-center justify-center text-xs text-slate-500">
                <AnchorIcon className="w-4 h-4 mr-2" />
                <span>Stable Pool Strategy Active.</span>
            </div>
        </div>
    );
};
