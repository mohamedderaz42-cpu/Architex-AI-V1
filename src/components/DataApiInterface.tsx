
import React, { useState, useEffect } from 'react';
import { DatabaseIcon } from './icons/DatabaseIcon';
import { TrendingUpIcon } from './icons/TrendingUpIcon';
import { useToast } from './Toast';
import * as api from '../core/api/contract';
import { LockIcon } from './icons/LockIcon';
import { RefreshIcon } from './icons/RefreshIcon';

const mockApiKey = "arch_pk_live_xxxxxxxxxxxxxx";

export const DataApiInterface: React.FC = () => {
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [metrics, setMetrics] = useState<{ name: string, change: number, price: number }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { addToast } = useToast();

    useEffect(() => {
        // Simulate live data fetch
        const fetchMetrics = async () => {
            const data = await api.getMarketMetrics();
            setMetrics(data);
        };
        fetchMetrics();
        const interval = setInterval(fetchMetrics, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleGenerateKey = async () => {
        setIsLoading(true);
        try {
             // Simulate payment requirement usually here, currently just provisioning
            const key = await api.generateApiKey();
            setApiKey(key);
            addToast('API Key Provisioned Successfully', 'success');
        } catch(e) {
            addToast('Provisioning Failed', 'error');
        } finally {
            setIsLoading(false);
        }
    }

    const copyToClipboard = () => {
        if(apiKey) {
            navigator.clipboard.writeText(apiKey);
            addToast('API Key Copied', 'info');
        }
    }

    return (
        <div className="p-4 flex flex-col h-full font-mono">
            <div className="flex items-center justify-center mb-4">
                <DatabaseIcon className="w-8 h-8 text-eco-green mr-2" />
                <h3 className="font-bold text-white text-lg tracking-tight">ARCHITEX PRICE INDEX</h3>
            </div>
            
            {/* Live Ticker */}
            <div className="bg-black rounded-lg border border-slate-800 p-2 mb-4 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                </div>
                <div className="text-[10px] text-slate-500 mb-2 uppercase tracking-widest border-b border-slate-800 pb-1">Live Market Data</div>
                <div className="space-y-1">
                    {metrics.map((m, i) => (
                        <div key={i} className="flex justify-between items-center text-xs">
                            <span className="text-slate-300">{m.name}</span>
                            <div className="flex items-center space-x-3">
                                <span className="text-white">${m.price.toFixed(2)}</span>
                                <span className={m.change >= 0 ? 'text-eco-green' : 'text-red-500'}>
                                    {m.change > 0 ? '+' : ''}{m.change}%
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* JSON Preview */}
            <div className="flex-grow bg-slate-900/80 rounded-lg border border-white/10 p-3 mb-4 overflow-hidden text-[10px] text-slate-400 relative">
                <div className="absolute top-2 right-2 text-xs text-slate-600">JSON PREVIEW</div>
                <pre className="whitespace-pre-wrap">
{`{
  "timestamp": "${new Date().toISOString()}",
  "data": [
    {
      "asset": "Timber",
      "price": 15.50,
      "trend": "bullish"
    },
    ...
  ]
}`}
                </pre>
            </div>

            <div className="mt-auto">
                 {apiKey ? (
                    <div 
                        className="p-3 bg-slate-800 rounded-lg border border-eco-green/30 cursor-pointer hover:bg-slate-700 transition-colors"
                        onClick={copyToClipboard}
                        title="Click to copy"
                    >
                        <p className="text-[10px] text-slate-500 uppercase mb-1">Active API Key</p>
                        <code className="text-eco-green text-xs break-all">{apiKey}</code>
                    </div>
                 ) : (
                    <div className="text-center">
                         <div className="mb-3 flex justify-center">
                            <LockIcon className="w-6 h-6 text-slate-500" />
                         </div>
                         <p className="text-xs text-slate-400 mb-3">Unlock high-frequency data stream access.</p>
                        <button
                            onClick={handleGenerateKey}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center px-4 py-3 bg-white text-black font-bold text-xs uppercase tracking-wider rounded hover:bg-gray-200 transition-all disabled:opacity-50"
                        >
                            {isLoading ? <RefreshIcon className="w-4 h-4 animate-spin" /> : 'Purchase API Access Key'}
                        </button>
                    </div>
                 )}
            </div>
        </div>
    );
};
