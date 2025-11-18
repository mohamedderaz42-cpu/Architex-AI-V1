import React, { useState } from 'react';
import { mockLiquidityPool, addLiquidity } from '../core/api/contract';
import { PlusIcon } from './icons/PlusIcon';
import { PiCoinIcon } from './icons/PiCoinIcon';
import { ArchitexLogo } from './icons/ArchitexLogo';
import { AnchorIcon } from './icons/AnchorIcon';

export const LiquidityInterface: React.FC = () => {
    const [piAmount, setPiAmount] = useState('');
    const [archiAmount, setArchiAmount] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const handleAddLiquidity = async () => {
        if (!piAmount || !archiAmount) return;
        setIsAdding(true);
        await addLiquidity(parseFloat(piAmount), parseFloat(archiAmount));
        setIsAdding(false);
        setPiAmount('');
        setArchiAmount('');
    }

    return (
        <div className="p-4 flex flex-col h-full text-center">
            <h3 className="font-semibold text-white">PiUSD / ARCHI Pool</h3>
            <div className="my-4 p-4 bg-slate-900/50 rounded-xl border border-white/10">
                <div className="text-xs text-slate-400">Your Pool Share</div>
                <div className="text-2xl font-bold text-eco-green mt-1">
                    {(mockLiquidityPool.userShare * 100).toFixed(3)}%
                </div>
                <div className="text-xs text-slate-400 mt-2">
                    Total Value Locked: ${mockLiquidityPool.totalValueLocked.toLocaleString()}
                </div>
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
            </div>

            <button
                onClick={handleAddLiquidity}
                disabled={isAdding || !piAmount || !archiAmount}
                className="group mt-auto flex items-center justify-center w-full px-6 py-3 bg-eco-green/80 border border-eco-green/90 rounded-full text-lg font-semibold text-white backdrop-blur-md hover:bg-eco-green transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <PlusIcon className="w-6 h-6 mr-2" />
                {isAdding ? 'Adding...' : 'Add Liquidity'}
            </button>
            <div className="mt-4 flex items-center justify-center text-xs text-slate-500">
                <AnchorIcon className="w-4 h-4 mr-2" />
                <span>Pool seeded by the Architex Liquidity Fund for stability.</span>
            </div>
        </div>
    );
};