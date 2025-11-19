import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { LoaderIcon } from './icons/LoaderIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import * as api from '../core/api/contract';
import { FuzzTestResult } from '../core/schemas/entities';

export const SecurityTerminal: React.FC = () => {
    const [isRunning, setIsRunning] = useState(false);
    const [result, setResult] = useState<FuzzTestResult | null>(null);
    const [logs, setLogs] = useState<string[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    const runTest = async () => {
        setIsRunning(true);
        setResult(null);
        setLogs(["Initializing AI Fuzz Engine...", "Loading contract ABIs...", "Connecting to sandbox environment..."]);
        
        // Simulate progressive logging for UX
        const interval = setInterval(() => {
            setLogs(prev => [...prev, `> Executing random ops block ${Math.floor(Math.random() * 1000)}...`]);
        }, 300);

        try {
            // Actual Test Execution
            const testResult = await api.executeFuzzTest();
            clearInterval(interval);
            setLogs(prev => [...prev, ...testResult.logs]);
            setResult(testResult);
        } catch (e) {
            clearInterval(interval);
            setLogs(prev => [...prev, "CRITICAL ERROR: Test execution failed."]);
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className="bg-black font-mono text-xs p-4 rounded-xl border border-slate-700 shadow-2xl h-full flex flex-col">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-2">
                <div className="flex items-center text-green-500">
                    <ShieldCheckIcon className="w-4 h-4 mr-2" />
                    <span className="font-bold">ARCHITEX SECURE GUARD</span>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-slate-500">v2.4.0</span>
                    <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'}`}></div>
                </div>
            </div>

            <div ref={scrollRef} className="flex-grow overflow-y-auto bg-slate-900/50 p-3 rounded mb-4 h-48 text-slate-300 space-y-1">
                {logs.map((log, idx) => (
                    <div key={idx} className="border-l-2 border-slate-700 pl-2">{log}</div>
                ))}
                {isRunning && <div className="animate-pulse text-green-400">_</div>}
            </div>

            {result ? (
                <div className={`p-3 rounded mb-4 border ${result.status === 'Passed' ? 'bg-green-900/20 border-green-500/30' : 'bg-red-900/20 border-red-500/30'}`}>
                    <div className="flex items-center mb-2">
                        {result.status === 'Passed' ? <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" /> : <XCircleIcon className="w-5 h-5 text-red-500 mr-2" />}
                        <span className={`font-bold text-lg ${result.status === 'Passed' ? 'text-green-400' : 'text-red-400'}`}>
                            TEST {result.status.toUpperCase()}
                        </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-slate-400">
                        <div>Operations: <span className="text-white">{result.operationsCount}</span></div>
                        <div>Coverage: <span className="text-white">{result.coverage}%</span></div>
                        <div className="col-span-2">ID: {result.testId}</div>
                    </div>
                </div>
            ) : (
                <div className="bg-slate-800/50 p-4 rounded mb-4 text-center text-slate-500">
                    Ready to execute stress tests.
                </div>
            )}

            <button
                onClick={runTest}
                disabled={isRunning}
                className={`w-full py-3 rounded font-bold uppercase tracking-widest transition-all ${
                    isRunning 
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-500 text-white shadow-[0_0_15px_rgba(22,163,74,0.5)]'
                }`}
            >
                {isRunning ? (
                    <span className="flex items-center justify-center">
                        <LoaderIcon className="w-4 h-4 mr-2 animate-spin" /> Executing Fuzz Suite...
                    </span>
                ) : (
                    "Execute AI Fuzz Test"
                )}
            </button>
        </div>
    );
};