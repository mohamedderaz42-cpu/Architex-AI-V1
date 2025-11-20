import React, { useState } from 'react';
import { DatabaseIcon } from './icons/DatabaseIcon';
import { LockIcon } from './icons/LockIcon';

const mockApiKey = "arch_sk_live_xxxxxxxxxxxxxx_vendor";

export const VendorApiAccess: React.FC = () => {
    const [showKey, setShowKey] = useState(false);

    return (
        <div className="p-4 flex flex-col h-full text-center">
            <DatabaseIcon className="w-12 h-12 mx-auto text-ai-violet mb-2" />
            <h3 className="font-semibold text-white text-xl">Vendor API</h3>
            <p className="text-sm text-slate-400">
                Synchronize your inventory and orders programmatically.
            </p>
            
            <div className="my-6 text-left">
                 <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">API Access Key</h4>
                 <div className="p-3 bg-slate-900/50 rounded-lg border border-white/10 relative group">
                    <p className="text-xs text-slate-400 mb-1">Your Secret Key:</p>
                    <div className="flex justify-between items-center">
                        <code className={`text-sm font-mono break-all ${showKey ? 'text-pi-gold' : 'text-slate-500 blur-sm select-none'}`}>
                            {showKey ? mockApiKey : "arch_sk_live_•••••••••••••••••"}
                        </code>
                        <button 
                            onClick={() => setShowKey(!showKey)} 
                            className="ml-2 p-1.5 bg-white/10 rounded hover:bg-white/20 text-xs font-bold text-white transition-colors"
                        >
                            {showKey ? 'Hide' : 'Show'}
                        </button>
                    </div>
                 </div>
                 <p className="text-[10px] text-red-400 mt-2 flex items-center bg-red-900/10 p-2 rounded">
                    <LockIcon className="w-3 h-3 mr-1" /> Keep this key secure. Do not share it in client-side code.
                 </p>
            </div>
            
            <button
                className="group mt-auto flex items-center justify-center w-full px-6 py-3 bg-slate-700/50 border border-white/10 rounded-full text-lg font-semibold text-white backdrop-blur-md hover:bg-ai-violet/50 transition-all"
            >
                View API Documentation
            </button>
        </div>
    );
};
