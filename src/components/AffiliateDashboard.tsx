
import React, { useState } from 'react';
import { UserEntity } from '../core/schemas/entities';
import { GlassPanel } from './GlassPanel';
import { LinkIcon } from './icons/LinkIcon';
import { UsersIcon } from './icons/UsersIcon';
import { TrendingUpIcon } from './icons/TrendingUpIcon';
import { ArchitexLogo } from './icons/ArchitexLogo';
import { useToast } from './Toast';
import * as api from '../core/api/contract';

interface AffiliateDashboardProps {
    user: UserEntity;
    onUpdateUser: (user: UserEntity) => void;
}

export const AffiliateDashboard: React.FC<AffiliateDashboardProps> = ({ user, onUpdateUser }) => {
    const [code, setCode] = useState('');
    const { addToast } = useToast();
    const [isRegistering, setIsRegistering] = useState(false);

    const handleRegister = async () => {
        if (!code) return;
        setIsRegistering(true);
        try {
            const profile = await api.registerAffiliate(code);
            onUpdateUser({ ...user, affiliateProfile: profile });
            addToast("Affiliate profile activated!", "success");
        } finally {
            setIsRegistering(false);
        }
    };

    const handleCopyLink = () => {
        const link = `https://architex.app/ref/${user.affiliateProfile?.referralCode}`;
        navigator.clipboard.writeText(link);
        addToast("Referral link copied to clipboard", "info");
    };

    const handleClaim = async () => {
        await api.claimAffiliateEarnings();
        // Force refresh mock user
        const updated = await api.authenticateWithPi();
        onUpdateUser(updated);
        addToast("Earnings claimed to wallet", "success");
    };

    if (!user.affiliateProfile) {
        return (
            <div className="p-4 text-center">
                <div className="w-16 h-16 mx-auto bg-ai-violet/20 rounded-full flex items-center justify-center mb-4">
                    <LinkIcon className="w-8 h-8 text-ai-violet" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Become a Scout</h2>
                <p className="text-slate-400 text-sm mb-6">
                    Join the Architex growth program. Earn 5 ARCHI for every new user, plus commissions on their marketplace activity.
                </p>
                <div className="bg-slate-900/50 p-4 rounded-xl border border-white/10 mb-6 text-left">
                    <h4 className="text-sm font-bold text-white mb-2">Reward Structure</h4>
                    <div className="space-y-2 text-xs text-slate-300">
                        <div className="flex justify-between"><span>Sign-up Bounty:</span> <span className="text-eco-green font-bold">5 ARCHI</span></div>
                        <div className="flex justify-between"><span>Sale Commission:</span> <span className="text-pi-gold font-bold">1.5%</span></div>
                    </div>
                </div>
                <input 
                    type="text" 
                    placeholder="Create your unique handle (e.g. ARCHIE_PRO)" 
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className="w-full bg-slate-800 border border-white/10 rounded-lg p-3 text-white text-center font-mono mb-4 focus:border-ai-violet outline-none"
                />
                <button 
                    onClick={handleRegister}
                    disabled={!code || isRegistering}
                    className="w-full py-3 bg-ai-violet text-white font-bold rounded-full hover:bg-ai-violet/80 transition-all disabled:opacity-50"
                >
                    {isRegistering ? 'Registering...' : 'Activate Account'}
                </button>
            </div>
        );
    }

    const { referralCode, totalReferrals, totalEarnings, pendingEarnings, campaigns } = user.affiliateProfile;

    return (
        <div className="p-4 flex flex-col h-full">
            <div className="bg-gradient-to-r from-ai-violet/20 to-purple-900/20 border border-ai-violet/30 rounded-2xl p-4 mb-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-20">
                    <ArchitexLogo className="w-24 h-24 text-white" />
                </div>
                <div className="relative z-10">
                    <h3 className="text-xs font-bold text-slate-300 uppercase mb-1">Pending Rewards</h3>
                    <div className="flex items-center space-x-2 mb-4">
                        <span className="text-3xl font-bold text-white">{pendingEarnings.toFixed(2)}</span>
                        <span className="text-xs font-bold bg-ai-violet text-white px-2 py-1 rounded">ARCHI</span>
                    </div>
                    <button 
                        onClick={handleClaim}
                        disabled={pendingEarnings <= 0}
                        className="w-full py-2 bg-white text-ai-violet font-bold rounded-lg text-xs hover:bg-slate-200 transition-colors disabled:opacity-50"
                    >
                        Claim to Wallet
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-slate-900/50 p-3 rounded-xl border border-white/10">
                    <div className="flex items-center space-x-2 mb-2 text-slate-400">
                        <UsersIcon className="w-4 h-4" />
                        <span className="text-xs">Referrals</span>
                    </div>
                    <span className="text-xl font-bold text-white">{totalReferrals}</span>
                </div>
                <div className="bg-slate-900/50 p-3 rounded-xl border border-white/10">
                    <div className="flex items-center space-x-2 mb-2 text-slate-400">
                        <TrendingUpIcon className="w-4 h-4" />
                        <span className="text-xs">Lifetime</span>
                    </div>
                    <span className="text-xl font-bold text-eco-green">{totalEarnings}</span>
                </div>
            </div>

            <div className="bg-slate-800/50 p-3 rounded-xl border border-white/5 mb-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-slate-400">Your Link:</span>
                    <button onClick={handleCopyLink} className="text-xs text-ai-violet font-bold hover:text-white">Copy</button>
                </div>
                <div className="bg-black/30 p-2 rounded border border-white/5 font-mono text-xs text-slate-300 truncate">
                    architex.app/ref/{referralCode}
                </div>
            </div>

            <div className="flex-grow overflow-y-auto">
                <h4 className="text-sm font-bold text-white mb-3">Campaigns</h4>
                <div className="space-y-2">
                    {campaigns.map(cmp => (
                        <div key={cmp.id} className="flex justify-between items-center bg-slate-900/30 p-3 rounded-lg border border-white/5">
                            <div>
                                <div className="text-sm text-white font-medium">{cmp.name}</div>
                                <div className="text-[10px] text-slate-500">{cmp.clicks} clicks</div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-eco-green font-bold">{cmp.conversions} Sales</div>
                                <div className="text-[10px] text-slate-500">{(cmp.conversions / cmp.clicks * 100).toFixed(1)}% conv.</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
