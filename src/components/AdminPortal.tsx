
import React, { useState, useEffect } from 'react';
import { GlassPanel } from './GlassPanel';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { LockIcon } from './icons/LockIcon';
import { GavelIcon } from './icons/GavelIcon';
import { DatabaseIcon } from './icons/DatabaseIcon';
import { UsersIcon } from './icons/UsersIcon'; // Assuming exists or reusing logic
import { ChartBarIcon } from './icons/ChartBarIcon';
import { useToast } from './Toast';
import { AdminAuth } from '../core/admin/AdminAuth';
import { useAppStore } from '../store/useAppStore';

// Sub-components
import { SecurityTerminal } from './SecurityTerminal';
import { BackupManager } from './BackupManager';
import { VerificationDeck } from './admin/VerificationDeck';
import { ArbitrationConsole } from './admin/ArbitrationConsole';
import { TreasuryView } from './admin/TreasuryView';

interface AdminPortalProps {
    onClose: () => void;
}

type AuthStep = 'access_check' | 'dashboard' | 'denied';
type AdminTab = 'overview' | 'users' | 'court' | 'treasury' | 'security' | 'backup';

export const AdminPortal: React.FC<AdminPortalProps> = ({ onClose }) => {
    const { user } = useAppStore();
    const [step, setStep] = useState<AuthStep>('access_check');
    const [activeTab, setActiveTab] = useState<AdminTab>('overview');
    const { addToast } = useToast();

    useEffect(() => {
        // Secure Access Control
        if (AdminAuth.verify(user?.walletAddress)) {
            setStep('dashboard');
        } else {
            setStep('denied');
        }
    }, [user]);

    const renderSidebar = () => (
        <div className="w-16 bg-slate-900/50 border-r border-white/10 flex flex-col items-center py-4 space-y-4">
            <button onClick={() => setActiveTab('overview')} className={`p-2 rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-white text-black' : 'text-slate-400 hover:text-white'}`} title="Overview">
                <ChartBarIcon className="w-6 h-6" />
            </button>
            <button onClick={() => setActiveTab('users')} className={`p-2 rounded-lg transition-colors ${activeTab === 'users' ? 'bg-white text-black' : 'text-slate-400 hover:text-white'}`} title="Verification Queue">
                <UsersIcon className="w-6 h-6" />
            </button>
            <button onClick={() => setActiveTab('court')} className={`p-2 rounded-lg transition-colors ${activeTab === 'court' ? 'bg-white text-black' : 'text-slate-400 hover:text-white'}`} title="Arbitration">
                <GavelIcon className="w-6 h-6" />
            </button>
            <button onClick={() => setActiveTab('treasury')} className={`p-2 rounded-lg transition-colors ${activeTab === 'treasury' ? 'bg-white text-black' : 'text-slate-400 hover:text-white'}`} title="Treasury">
                <ShieldCheckIcon className="w-6 h-6" />
            </button>
            <div className="h-px w-8 bg-white/10 my-2"></div>
            <button onClick={() => setActiveTab('security')} className={`p-2 rounded-lg transition-colors ${activeTab === 'security' ? 'text-red-400 bg-red-900/20' : 'text-slate-400 hover:text-white'}`} title="Security">
                <LockIcon className="w-6 h-6" />
            </button>
            <button onClick={() => setActiveTab('backup')} className={`p-2 rounded-lg transition-colors ${activeTab === 'backup' ? 'text-ai-violet bg-ai-violet/20' : 'text-slate-400 hover:text-white'}`} title="Backup">
                <DatabaseIcon className="w-6 h-6" />
            </button>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return <TreasuryView />; // Reusing Treasury view as overview for now
            case 'users':
                return <VerificationDeck />;
            case 'court':
                return <ArbitrationConsole />;
            case 'treasury':
                return <TreasuryView />;
            case 'security':
                return <SecurityTerminal />;
            case 'backup':
                return <BackupManager />;
            default:
                return null;
        }
    };

    if (step === 'denied') {
        return (
            <div className="fixed inset-0 bg-black flex items-center justify-center z-[100]">
                <div className="text-center p-8 border border-red-500/50 rounded-2xl bg-red-900/10">
                    <LockIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-red-500 mb-2">ACCESS DENIED</h1>
                    <p className="text-slate-400 text-sm">Your wallet address is not authorized for God Mode.</p>
                    <button onClick={onClose} className="mt-6 px-6 py-2 bg-slate-800 rounded-full text-white hover:bg-slate-700">Return</button>
                </div>
            </div>
        );
    }

    if (step === 'access_check') {
        return <div className="fixed inset-0 bg-black z-[100]" />; // Loading
    }

    return (
        <div className="fixed inset-0 bg-brand-dark/95 backdrop-blur-xl flex items-center justify-center z-[100] p-4">
            <GlassPanel className="w-full max-w-5xl h-[80vh] flex p-0 overflow-hidden border-pi-gold/20 shadow-2xl relative">
                {renderSidebar()}
                
                <div className="flex-grow flex flex-col bg-black/20">
                    <div className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-slate-900/50">
                        <div className="flex items-center">
                            <span className="w-3 h-3 bg-eco-green rounded-full mr-2 animate-pulse"></span>
                            <span className="font-mono text-sm text-slate-300">ADMIN_CONSOLE_V1 // {user?.walletAddress.slice(0,8)}...</span>
                        </div>
                        <button onClick={onClose} className="text-slate-500 hover:text-white text-sm font-bold">EXIT</button>
                    </div>
                    <div className="flex-grow p-6 overflow-y-auto">
                        {renderContent()}
                    </div>
                </div>
            </GlassPanel>
        </div>
    );
};
