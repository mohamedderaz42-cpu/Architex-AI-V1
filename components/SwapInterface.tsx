import React, { useState } from 'react';
import { mockUserTokens, swapTokens } from '../core/api/contract';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { SwapIcon } from './icons/SwapIcon';

export const SwapInterface: React.FC = () => {
    const [fromToken, setFromToken] = useState(mockUserTokens[0]);
    const [toToken, setToToken] = useState(mockUserTokens[1]);
    const [fromAmount, setFromAmount] = useState('');
    const [toAmount, setToAmount] = useState('');
    const [isSwapping, setIsSwapping] = useState(false);

    const handleSwap = async () => {
        if (!fromAmount || parseFloat(fromAmount) <= 0) return;
        setIsSwapping(true);
        await swapTokens(fromToken.symbol, toToken.symbol, parseFloat(fromAmount));
        setIsSwapping(false);
        setFromAmount('');
        setToAmount('');
        // Here you would refresh balances
    };
    
    // Dummy conversion
    React.useEffect(() => {
        const amount = parseFloat(fromAmount);
        if(!isNaN(amount)) {
            const rate = fromToken.symbol === 'PiUSD' ? 21.5 : 1/21.5;
            setToAmount((amount * rate).toFixed(2));
        } else {
            setToAmount('');
        }
    }, [fromAmount, fromToken, toToken]);

    return (
        <div className="p-4 flex flex-col h-full">
            <div className="bg-slate-900/50 p-3 rounded-xl border border-white/10">
                <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
                    <span>From</span>
                    <span>Balance: {fromToken.balance.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <input 
                        type="number"
                        value={fromAmount}
                        onChange={(e) => setFromAmount(e.target.value)}
                        placeholder="0.0"
                        className="bg-transparent text-2xl font-semibold text-white w-full focus:outline-none"
                    />
                    <div className="flex items-center space-x-2 bg-slate-700/50 p-2 rounded-full">
                        <fromToken.icon className="w-6 h-6 text-pi-gold" />
                        <span className="font-bold text-white">{fromToken.symbol}</span>
                    </div>
                </div>
            </div>

            <div className="flex justify-center my-4">
                <button className="p-2 bg-slate-700/50 rounded-full border border-white/10 text-ai-violet">
                    <SwapIcon className="w-6 h-6" />
                </button>
            </div>

            <div className="bg-slate-900/50 p-3 rounded-xl border border-white/10">
                 <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
                    <span>To</span>
                    <span>Balance: {toToken.balance.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <input 
                        type="number"
                        value={toAmount}
                        readOnly
                        placeholder="0.0"
                        className="bg-transparent text-2xl font-semibold text-white w-full focus:outline-none"
                    />
                     <div className="flex items-center space-x-2 bg-slate-700/50 p-2 rounded-full">
                        <toToken.icon className="w-6 h-6 text-ai-violet" />
                        <span className="font-bold text-white">{toToken.symbol}</span>
                    </div>
                </div>
            </div>

            <button
                onClick={handleSwap}
                disabled={isSwapping || !fromAmount}
                className="group mt-auto flex items-center justify-center w-full px-6 py-3 bg-ai-violet/80 border border-ai-violet/90 rounded-full text-lg font-semibold text-white backdrop-blur-md hover:bg-ai-violet transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSwapping ? 'Swapping...' : 'Swap Tokens'}
            </button>
        </div>
    );
};