import React, { useState } from 'react';
import { DatabaseIcon } from './icons/DatabaseIcon';
import { TrendingUpIcon } from './icons/TrendingUpIcon';

const mockApiKey = "arch_pk_live_xxxxxxxxxxxxxx";

export const DataApiInterface: React.FC = () => {
    const [apiKey, setApiKey] = useState(mockApiKey);

    const generateNewKey = () => {
        setApiKey("arch_pk_live_" + Array(14).fill(0).map(() => "x").join(''));
    }

    return (
        <div className="p-4 flex flex-col h-full text-center">
            <DatabaseIcon className="w-12 h-12 mx-auto text-eco-green mb-2" />
            <h3 className="font-semibold text-white text-xl">Architex Price Index</h3>
            <p className="text-sm text-slate-400">Aggregating real-time market data for materials and services.</p>
            
            <div className="my-4 p-4 bg-slate-900/50 rounded-xl border border-white/10 text-left">
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Live Market Data</h4>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                        <span className="text-slate-300">Eco-Friendly Timber:</span>
                        <div className="flex items-center text-eco-green font-semibold">
                            <TrendingUpIcon className="w-4 h-4 mr-1" />
                            <span>+2.5% / week</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-slate-300">Recycled Steel Beams:</span>
                        <div className="flex items-center text-red-400 font-semibold">
                            <TrendingUpIcon className="w-4 h-4 mr-1 transform rotate-180" />
                            <span>-1.8% / week</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-left">
                 <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">API Access</h4>
                 <div className="p-3 bg-slate-900/50 rounded-lg border border-white/10">
                    <p className="text-xs text-slate-400">Your API Key:</p>
                    <code className="text-pi-gold text-sm font-mono break-all">{apiKey}</code>
                 </div>
            </div>
            
            <button
                onClick={generateNewKey}
                className="group mt-auto flex items-center justify-center w-full px-6 py-3 bg-eco-green/80 border border-eco-green/90 rounded-full text-lg font-semibold text-white backdrop-blur-md hover:bg-eco-green transition-all"
            >
                Generate New Key
            </button>
        </div>
    );
};