
import React from 'react';
import * as api from '../../core/api/contract';
import { ShieldCheckIcon } from '../icons/ShieldCheckIcon';
import { TrendingUpIcon } from '../icons/TrendingUpIcon';
import { PiCoinIcon } from '../icons/PiCoinIcon';

export const TreasuryView: React.FC = () => {
    const balance = api.treasuryBalance;
    
    // Mock Chart Data
    const revenueData = [10, 25, 18, 30, 45, 35, 55, 60];
    const maxVal = Math.max(...revenueData);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-slate-900 to-black p-6 rounded-2xl border border-pi-gold/30 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <ShieldCheckIcon className="w-24 h-24 text-pi-gold" />
                    </div>
                    <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Protocol Treasury</h3>
                    <div className="text-4xl font-bold text-white flex items-center">
                        <PiCoinIcon className="w-8 h-8 mr-3 text-pi-gold" />
                        {balance.toLocaleString()}
                    </div>
                    <div className="mt-4 flex items-center text-eco-green text-sm font-bold">
                        <TrendingUpIcon className="w-4 h-4 mr-1" /> +12.5% this week
                    </div>
                </div>

                <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/10 flex flex-col justify-center">
                    <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Platform Net Revenue (Fees)</h3>
                    <div className="flex items-end justify-between h-24 space-x-2">
                        {revenueData.map((val, idx) => (
                            <div key={idx} className="flex-1 flex flex-col items-center group">
                                <div 
                                    className="w-full bg-slate-700 group-hover:bg-pi-gold transition-colors rounded-t"
                                    style={{ height: `${(val / maxVal) * 100}%` }}
                                ></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-slate-900/30 p-4 rounded-xl border border-white/5">
                <h4 className="text-sm font-bold text-white mb-3">Fee Distribution</h4>
                <div className="space-y-3">
                    <div>
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                            <span>Staking Rewards (40%)</span>
                            <span className="text-white font-mono">600,000</span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-ai-violet w-[40%]"></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                            <span>Development Fund (30%)</span>
                            <span className="text-white font-mono">450,000</span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-[30%]"></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                            <span>Insurance Pool (20%)</span>
                            <span className="text-white font-mono">300,000</span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-eco-green w-[20%]"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
