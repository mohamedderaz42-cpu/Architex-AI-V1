import React, { useState } from 'react';
import { GlassPanel } from './GlassPanel';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { LockIcon } from './icons/LockIcon';
import { UserIcon } from './icons/UserIcon';
import { GavelIcon } from './icons/GavelIcon';
import * as api from '../core/api/contract';
import { useToast } from './Toast';
import { SecurityTerminal } from './SecurityTerminal';

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
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white flex items-center">
                    <ShieldCheckIcon className="w-6 h-6 mr-2 text-eco-green" />
                    Admin Console
                </h2>
                <button onClick={onClose} className="text-slate-500 hover:text-white">Close</button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
                 <div className="bg-slate-800/50 p-3 rounded-xl border border-white/5">
                    <div className="text-xs text-slate-400">Treasury</div>
                    <div className="text-lg font-bold text-pi-gold">{stats.treasuryBalance.toLocaleString()}</div>
                </div>
                 <div className="bg-slate-800/50 p-3 rounded-xl border border-white/5">
                    <div className="text-xs text-slate-400">Flagged</div>
                    <div className="text-lg font-bold text-orange-400">{stats.flaggedContent}</div>
                </div>
            </div>

            <div className="flex-grow overflow-hidden">
                <h3 className="text-sm font-bold text-slate-300 uppercase mb-2">Live Security Monitor</h3>
                <div className="h-[300px]">
                    <SecurityTerminal />
                </div>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-brand-dark/95 backdrop-blur-xl flex items-center justify-center z-[100] p-4">
            <GlassPanel className="w-full max-w-md p-6 animate-fade-in h-[650px] flex flex-col relative">
                <div className="flex-grow flex flex-col justify-center">
                    {step === 'login' && renderLogin()}
                    {step === 'mfa' && renderMfa()}
                    {step === 'dashboard' && renderDashboard()}
                </div>
            </GlassPanel>
        </div>
    );
};