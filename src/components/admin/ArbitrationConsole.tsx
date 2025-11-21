
import React, { useState, useEffect } from 'react';
import { OrderEntity } from '../../core/schemas/entities';
import * as api from '../../core/api/contract';
import { web3Service } from '../../core/blockchain/web3Service';
import { GavelIcon } from '../icons/GavelIcon';
import { AlertTriangleIcon } from '../icons/AlertTriangleIcon';
import { PiCoinIcon } from '../icons/PiCoinIcon';
import { useToast } from '../Toast';

export const ArbitrationConsole: React.FC = () => {
    const [disputes, setDisputes] = useState<OrderEntity[]>([]);
    const [selectedCase, setSelectedCase] = useState<OrderEntity | null>(null);
    const { addToast } = useToast();

    useEffect(() => {
        api.listAllDisputes().then(setDisputes);
    }, []);

    const handleRule = async (winner: 'buyer' | 'seller') => {
        if (!selectedCase) return;
        
        // In a real app, we'd get addresses from the Order entity
        const winnerAddress = winner === 'buyer' ? '0xBuyer...' : '0xSeller...';
        
        try {
            const result = await web3Service.resolveDispute(selectedCase.id, winnerAddress);
            addToast(`Judgment Executed: ${winner.toUpperCase()} WINS. TX: ${result.txHash.substring(0,8)}...`, "success");
            setDisputes(prev => prev.filter(d => d.id !== selectedCase.id));
            setSelectedCase(null);
        } catch (e) {
            addToast("Smart Contract Execution Failed", "error");
        }
    };

    return (
        <div className="h-full flex gap-4">
            {/* Case List */}
            <div className="w-1/3 border-r border-white/10 pr-2 overflow-y-auto">
                <h3 className="text-sm font-bold text-slate-400 uppercase mb-3">Open Cases</h3>
                {disputes.map(dispute => (
                    <div 
                        key={dispute.id}
                        onClick={() => setSelectedCase(dispute)}
                        className={`p-3 rounded-lg border mb-2 cursor-pointer transition-all ${
                            selectedCase?.id === dispute.id 
                            ? 'bg-red-900/20 border-red-500/50 shadow-lg' 
                            : 'bg-slate-900/30 border-white/5 hover:bg-slate-800'
                        }`}
                    >
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-mono text-slate-300">#{dispute.id.slice(-6)}</span>
                            <span className="text-[10px] bg-red-500 text-white px-1.5 rounded font-bold">FROZEN</span>
                        </div>
                        <div className="flex items-center text-white font-bold text-sm">
                            <PiCoinIcon className="w-4 h-4 mr-1 text-pi-gold" />
                            {dispute.total.toFixed(2)}
                        </div>
                    </div>
                ))}
                {disputes.length === 0 && <div className="text-slate-500 text-xs text-center">No active disputes.</div>}
            </div>

            {/* Case Details */}
            <div className="w-2/3 flex flex-col">
                {selectedCase ? (
                    <>
                        <div className="bg-black/40 p-4 rounded-xl border border-white/10 mb-4">
                            <div className="flex items-center mb-4">
                                <GavelIcon className="w-6 h-6 text-red-500 mr-3" />
                                <h2 className="text-xl font-bold text-white">The High Court</h2>
                            </div>
                            <div className="space-y-2 text-sm text-slate-300">
                                <p><span className="text-slate-500">Dispute ID:</span> {selectedCase.id}</p>
                                <p><span className="text-slate-500">Value Locked:</span> {selectedCase.total} PiUSD</p>
                                <p><span className="text-slate-500">Opened:</span> {new Date(selectedCase.createdAt).toLocaleDateString()}</p>
                                <div className="bg-red-900/20 p-3 rounded border border-red-500/20 mt-2">
                                    <span className="text-red-400 font-bold text-xs uppercase block mb-1">Claim</span>
                                    <p className="italic">"Item was never delivered, seller unresponsive."</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto grid grid-cols-2 gap-4">
                            <button 
                                onClick={() => handleRule('buyer')}
                                className="p-4 bg-eco-green/10 hover:bg-eco-green/20 border border-eco-green/30 rounded-xl text-center group transition-all"
                            >
                                <span className="block text-eco-green font-bold text-lg group-hover:scale-105 transition-transform">Refund Buyer</span>
                                <span className="text-xs text-slate-400">Revert transaction</span>
                            </button>
                            <button 
                                onClick={() => handleRule('seller')}
                                className="p-4 bg-ai-violet/10 hover:bg-ai-violet/20 border border-ai-violet/30 rounded-xl text-center group transition-all"
                            >
                                <span className="block text-ai-violet font-bold text-lg group-hover:scale-105 transition-transform">Release to Seller</span>
                                <span className="text-xs text-slate-400">Dismiss claim</span>
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-slate-500 text-sm">
                        Select a case to adjudicate.
                    </div>
                )}
            </div>
        </div>
    );
};
