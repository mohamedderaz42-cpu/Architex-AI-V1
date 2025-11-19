
import React, { useState } from 'react';
import { GlassPanel } from './GlassPanel';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { LockIcon } from './icons/LockIcon';
import { UserIcon } from './icons/UserIcon';
import { GavelIcon } from './icons/GavelIcon';
import * as api from '../core/api/contract';
import { useToast } from './Toast';

interface AdminPortalProps {
    onClose: () => void;
}

type AuthStep = 'login' | 'mfa' | 'dashboard';

export const AdminPortal: React.FC<AdminPortalProps> = ({ onClose }) => {
    const [step, setStep] = useState<AuthStep>('login');
    const [password, setPassword] = useState('');
    const [mfaCode, setMfaCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { addToast } = useToast();

    // Dashboard Stats Mock
    const stats = {
        totalUsers: 1250,
        activeDisputes: 3,
        flaggedContent: 5,
        treasuryBalance: 1250000
    };

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
                {/* Simplified input for demo */}
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

    const renderDashboard = () => (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                    <ShieldCheckIcon className="w-6 h-6 mr-2 text-eco-green" />
                    Admin Console
                </h2>
                <div className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded border border-red-500/50">
                    Live Mode
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-800/50 p-3 rounded-xl border border-white/5">
                    <div className="text-xs text-slate-400">Total Users</div>
                    <div className="text-xl font-bold text-white">{stats.totalUsers}</div>
                </div>
                 <div className="bg-slate-800/50 p-3 rounded-xl border border-white/5">
                    <div className="text-xs text-slate-400">Treasury</div>
                    <div className="text-xl font-bold text-pi-gold">{stats.treasuryBalance.toLocaleString()}</div>
                </div>
                 <div className="bg-slate-800/50 p-3 rounded-xl border border-white/5">
                    <div className="text-xs text-slate-400">Active Disputes</div>
                    <div className="text-xl font-bold text-red-400">{stats.activeDisputes}</div>
                </div>
                 <div className="bg-slate-800/50 p-3 rounded-xl border border-white/5">
                    <div className="text-xs text-slate-400">Flagged Content</div>
                    <div className="text-xl font-bold text-orange-400">{stats.flaggedContent}</div>
                </div>
            </div>

            <div className="flex-grow overflow-y-auto space-y-3">
                <h3 className="text-sm font-bold text-slate-300 uppercase">Recent Alerts</h3>
                <div className="bg-slate-900/50 p-3 rounded-lg border border-white/10 flex justify-between items-center">
                    <span className="text-sm text-white">User reported for spam</span>
                    <button className="text-xs bg-slate-700 px-2 py-1 rounded hover:bg-slate-600">Review</button>
                </div>
                 <div className="bg-slate-900/50 p-3 rounded-lg border border-white/10 flex justify-between items-center">
                    <span className="text-sm text-white">High value transaction flagged</span>
                    <button className="text-xs bg-slate-700 px-2 py-1 rounded hover:bg-slate-600">Inspect</button>
                </div>
            </div>
            
             <button 
                onClick={onClose}
                className="mt-4 w-full bg-slate-700/50 text-slate-400 font-bold py-3 rounded-full hover:bg-slate-700 hover:text-white transition-colors"
            >
                Log Out
            </button>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-brand-dark/95 backdrop-blur-xl flex items-center justify-center z-[100] p-4">
            <GlassPanel className="w-full max-w-sm p-6 animate-fade-in h-[600px] flex flex-col relative">
                {step !== 'dashboard' && <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white text-2xl">&times;</button>}
                
                <div className="flex-grow flex flex-col justify-center">
                    {step === 'login' && renderLogin()}
                    {step === 'mfa' && renderMfa()}
                    {step === 'dashboard' && renderDashboard()}
                </div>
            </GlassPanel>
        </div>
    );
};
