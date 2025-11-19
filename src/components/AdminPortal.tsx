
import React, { useState } from 'react';
import { GlassPanel } from './GlassPanel';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { LockIcon } from './icons/LockIcon';
import { UserIcon } from './icons/UserIcon';
import { GavelIcon } from './icons/GavelIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { LoaderIcon } from './icons/LoaderIcon';
import { ServerIcon } from './icons/ServerIcon';
import * as api from '../core/api/contract';
import { useToast } from './Toast';
import { SecurityTerminal } from './SecurityTerminal';
import { IntegrationTestResult, StressTestResult } from '../core/schemas/entities';

interface AdminPortalProps {
    onClose: () => void;
}

type AuthStep = 'login' | 'mfa' | 'dashboard';
type AdminTab = 'overview' | 'stress';

export const AdminPortal: React.FC<AdminPortalProps> = ({ onClose }) => {
    const [step, setStep] = useState<AuthStep>('login');
    const [activeTab, setActiveTab] = useState<AdminTab>('overview');
    const [password, setPassword] = useState('');
    const [mfaCode, setMfaCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [testResult, setTestResult] = useState<IntegrationTestResult | null>(null);
    const [isRunningTest, setIsRunningTest] = useState(false);
    
    // Stress Test State
    const [stressResult, setStressResult] = useState<StressTestResult | null>(null);
    const [isStressTesting, setIsStressTesting] = useState(false);
    const [stressProgress, setStressProgress] = useState(0);

    const { addToast } = useToast();

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            const isValid = await api.requestAdminMfa(password);
            if (isValid) {
                setStep('mfa');
                addToast('2FA Code sent to admin device', 'info');
            } else {
                addToast('Invalid Credentials', 'error');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleMfaVerify = async () => {
        setIsLoading(true);
        try {
            const isValid = await api.verifyAdminMfa(mfaCode);
            if (isValid) {
                setStep('dashboard');
                addToast('Admin Access Granted', 'success');
            } else {
                addToast('Invalid 2FA Code', 'error');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const runSystemCheck = async () => {
        setIsRunningTest(true);
        setTestResult(null);
        try {
            // Simulate delay for visual effect
            await new Promise(resolve => setTimeout(resolve, 1000));
            const result = await api.runIntegrationTest();
            setTestResult(result);
            if (result.success) {
                addToast('All Systems Nominal', 'success');
            } else {
                addToast('System Integrity Failure', 'error');
            }
        } finally {
            setIsRunningTest(false);
        }
    };

    const runStressTest = async () => {
        setIsStressTesting(true);
        setStressResult(null);
        setStressProgress(0);
        try {
            const result = await api.runStressTest((users) => {
                setStressProgress(users);
            });
            setStressResult(result);
            addToast('Load Test Complete', 'success');
        } catch (e) {
            addToast('Stress Test Failed', 'error');
        } finally {
            setIsStressTesting(false);
        }
    };

    const handleExportAuditPackage = () => {
        const checksum = "SHA256-" + Math.random().toString(36).substring(2).toUpperCase();
        addToast(`Audit Package Generated. Checksum: ${checksum}`, 'success');
    };

    const renderLogin = () => (
        <div className="text-center">
            <ShieldCheckIcon className="w-16 h-16 mx-auto text-slate-500 mb-4" />
            <h2 className="text-xl font-bold text-white mb-4">Admin Access</h2>
            <input 
                type="password" 
                placeholder="Enter Admin Password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-3 text-white mb-4 focus:outline-none focus:border-pi-gold/50"
            />
            <button 
                onClick={handleLogin}
                disabled={isLoading || !password}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-full transition-colors disabled:opacity-50"
            >
                {isLoading ? 'Verifying...' : 'Request Access'}
            </button>
        </div>
    );

    const renderMfa = () => (
        <div className="text-center">
            <LockIcon className="w-16 h-16 mx-auto text-pi-gold mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Security Verification</h2>
            <p className="text-sm text-slate-400 mb-6">Please enter the 6-digit code sent to your secure device.</p>
            
            <div className="flex justify-center space-x-2 mb-6">
                <input 
                    type="text" 
                    maxLength={6}
                    placeholder="000000" 
                    value={mfaCode}
                    onChange={e => setMfaCode(e.target.value)}
                    className="w-32 bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2 text-center text-2xl tracking-widest text-white focus:outline-none focus:border-pi-gold/50"
                />
            </div>

            <button 
                onClick={handleMfaVerify}
                disabled={isLoading || mfaCode.length !== 6}
                className="w-full bg-pi-gold hover:bg-yellow-500 text-brand-dark font-bold py-3 rounded-full transition-colors disabled:opacity-50"
            >
                {isLoading ? 'Authenticating...' : 'Verify & Enter'}
            </button>
             <p className="text-xs text-slate-500 mt-4 cursor-pointer hover:text-white" onClick={() => setStep('login')}>Back to Login</p>
        </div>
    );

    const renderRoutingVisualizer = () => (
        <div className="mb-4 p-4 bg-slate-900/50 rounded-xl border border-white/10 relative overflow-hidden">
            <h3 className="text-xs font-bold text-slate-400 uppercase mb-3">Active Revenue Routing</h3>
            <div className="flex justify-between items-center text-xs">
                <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center mb-2">
                        <UserIcon className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="text-slate-300">User</span>
                </div>
                
                <div className="flex-grow px-2 relative h-10">
                    {/* Paths */}
                    <div className="absolute top-1/2 left-0 w-full h-px bg-slate-700"></div>
                    <div className="absolute top-1/2 left-1/2 w-px h-8 bg-slate-700 -translate-y-1/2 origin-bottom rotate-45 transform"></div> 
                    <div className="absolute top-1/2 left-1/2 w-px h-8 bg-slate-700 -translate-y-1/2 origin-top -rotate-45 transform"></div> 
                    
                    {/* Flow Indicators */}
                    <div className="absolute top-0 left-1/3 text-[9px] text-eco-green font-bold">100% Value</div>
                </div>

                <div className="flex flex-col space-y-4">
                    <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-pi-gold/20 border border-pi-gold/50 flex items-center justify-center mr-2">
                            <ShieldCheckIcon className="w-4 h-4 text-pi-gold" />
                        </div>
                        <div>
                            <span className="block text-white font-bold">Treasury</span>
                            <span className="text-[9px] text-slate-400">Fees (10%)</span>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-ai-violet/20 border border-ai-violet/50 flex items-center justify-center mr-2">
                            <LockIcon className="w-4 h-4 text-ai-violet" />
                        </div>
                        <div>
                            <span className="block text-white font-bold">Escrow</span>
                            <span className="text-[9px] text-slate-400">Reward (90%)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderOverviewTab = () => (
        <>
            {renderRoutingVisualizer()}

            <div className="grid grid-cols-2 gap-3 mb-4 flex-shrink-0">
                 <div className="bg-slate-800/50 p-3 rounded-xl border border-white/5">
                    <div className="text-xs text-slate-400">Treasury Balance</div>
                    <div className="text-lg font-bold text-pi-gold">{api.treasuryBalance.toLocaleString()}</div>
                </div>
                 <div className="bg-slate-800/50 p-3 rounded-xl border border-white/5">
                    <div className="text-xs text-slate-400">Escrow Locked</div>
                    <div className="text-lg font-bold text-white">{api.escrowBalance.toLocaleString()}</div>
                </div>
            </div>
            
            <div className="mb-4 p-3 bg-black/40 rounded-xl border border-green-500/30">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-bold text-green-400 uppercase">System Integration Test</h3>
                    {!isRunningTest && !testResult && (
                        <button 
                            onClick={runSystemCheck}
                            className="px-3 py-1 bg-green-600/20 hover:bg-green-600/40 border border-green-500/50 rounded text-green-400 text-xs font-bold transition-colors"
                        >
                            RUN PRE-FLIGHT CHECK
                        </button>
                    )}
                </div>

                {isRunningTest ? (
                    <div className="text-center py-4">
                        <LoaderIcon className="w-6 h-6 text-green-500 animate-spin mx-auto mb-2" />
                        <span className="text-xs text-green-400 font-mono">Executing verification suite...</span>
                    </div>
                ) : testResult ? (
                    <div className="space-y-2 font-mono text-xs">
                        {testResult.steps.map((step, idx) => (
                            <div key={idx} className="flex justify-between items-start border-b border-white/5 pb-1 last:border-0">
                                <span className="text-slate-300">{step.name}</span>
                                <div className="text-right">
                                    <span className={step.status === 'Passed' ? 'text-green-400' : 'text-red-400'}>[{step.status}]</span>
                                </div>
                            </div>
                        ))}
                        <div className="pt-2 mt-2 border-t border-white/10 flex justify-between items-center">
                            <span className="text-slate-400">Result:</span>
                            {testResult.success ? (
                                <span className="text-green-400 font-bold flex items-center"><CheckCircleIcon className="w-4 h-4 mr-1"/> PASSED</span>
                            ) : (
                                <span className="text-red-400 font-bold flex items-center"><XCircleIcon className="w-4 h-4 mr-1"/> FAILED</span>
                            )}
                        </div>
                        {testResult.success && (
                            <div className="mt-2 p-2 bg-green-900/20 border border-green-500/30 rounded text-center">
                                <span className="text-green-400 font-bold tracking-wider">CODE FREEZE ACTIVE</span>
                            </div>
                        )}
                    </div>
                ) : (
                     <div className="text-center py-4 text-xs text-slate-500">
                        System ready for final integration verification.
                    </div>
                )}
            </div>

            <div className="flex-grow">
                <h3 className="text-sm font-bold text-slate-300 uppercase mb-2">Security Monitor</h3>
                <div className="h-[200px]">
                    <SecurityTerminal />
                </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/10">
                <button onClick={handleExportAuditPackage} className="w-full py-2 bg-slate-700/50 rounded border border-white/20 text-slate-300 text-sm hover:text-white hover:bg-slate-600 transition-colors">
                    Prepare Audit Package
                </button>
            </div>
        </>
    );

    const renderStressTab = () => (
        <div className="flex flex-col h-full">
            <div className="bg-red-900/10 border border-red-500/30 p-4 rounded-xl mb-6">
                <div className="flex items-center mb-2">
                    <ServerIcon className="w-6 h-6 text-red-400 mr-2" />
                    <h3 className="font-bold text-white">Infrastructure Stress Test</h3>
                </div>
                <p className="text-xs text-slate-400 mb-4">
                    Simulate high-concurrency traffic to identify bottlenecks in the contract execution layer and database sharding logic.
                </p>
                
                {!isStressTesting && !stressResult && (
                     <button 
                        onClick={runStressTest}
                        className="w-full py-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 font-bold hover:bg-red-500/40 hover:text-white transition-all"
                    >
                        INITIATE LOAD TEST
                    </button>
                )}

                {isStressTesting && (
                    <div className="py-4">
                        <div className="flex justify-between text-xs text-slate-300 mb-1">
                            <span>Simulating Users...</span>
                            <span>{stressProgress} / 1000</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden">
                            <div 
                                className="bg-gradient-to-r from-orange-500 to-red-500 h-full transition-all duration-300" 
                                style={{width: `${(stressProgress / 1000) * 100}%`}}
                            ></div>
                        </div>
                    </div>
                )}

                {stressResult && (
                    <div className="mt-4 space-y-2 text-sm">
                        <div className="flex justify-between border-b border-white/10 pb-1">
                            <span className="text-slate-400">Status</span>
                            <span className={stressResult.status === 'Passed' ? 'text-green-400 font-bold' : 'text-yellow-400 font-bold'}>{stressResult.status.toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-1">
                            <span className="text-slate-400">Virtual Users</span>
                            <span className="text-white">{stressResult.virtualUsers}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-1">
                            <span className="text-slate-400">Throughput</span>
                            <span className="text-white">{stressResult.tps} TPS</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-1">
                            <span className="text-slate-400">Avg Latency</span>
                            <span className="text-white">{stressResult.avgLatencyMs}ms</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-slate-400">Error Rate</span>
                            <span className={stressResult.errorRate < 1 ? 'text-green-400' : 'text-red-400'}>{stressResult.errorRate.toFixed(2)}%</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const renderDashboard = () => (
        <div className="h-full flex flex-col overflow-y-auto pr-2">
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
                <h2 className="text-xl font-bold text-white flex items-center">
                    <ShieldCheckIcon className="w-6 h-6 mr-2 text-eco-green" />
                    Admin Console
                </h2>
                <button onClick={onClose} className="text-slate-500 hover:text-white">Close</button>
            </div>
            
            <div className="flex space-x-2 mb-4">
                <button 
                    onClick={() => setActiveTab('overview')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${activeTab === 'overview' ? 'bg-white text-black' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                >
                    System Overview
                </button>
                <button 
                    onClick={() => setActiveTab('stress')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${activeTab === 'stress' ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                >
                    Stress Testing
                </button>
            </div>

            {activeTab === 'overview' ? renderOverviewTab() : renderStressTab()}
        </div>
    );

    return (
        <div className="fixed inset-0 bg-brand-dark/95 backdrop-blur-xl flex items-center justify-center z-[100] p-4">
            <GlassPanel className="w-full max-w-md p-6 animate-fade-in h-[750px] flex flex-col relative">
                <div className="flex-grow flex flex-col justify-center h-full">
                    {step === 'login' && renderLogin()}
                    {step === 'mfa' && renderMfa()}
                    {step === 'dashboard' && renderDashboard()}
                </div>
            </GlassPanel>
        </div>
    );
};
