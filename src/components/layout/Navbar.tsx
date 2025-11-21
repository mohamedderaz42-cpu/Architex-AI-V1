
import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { AdminAuth } from '../../core/admin/AdminAuth';
import { ArchitexLogo } from '../icons/ArchitexLogo';
import { UserIcon } from '../icons/UserIcon';
import { GlobeIcon } from '../icons/GlobeIcon';
import { ShieldCheckIcon } from '../icons/ShieldCheckIcon';
import { PiCoinIcon } from '../icons/PiCoinIcon';
import { PackageIcon } from '../icons/PackageIcon';

interface NavbarProps {
    activeTab: string;
    onNavigate: (tab: any) => void;
    onToggleProfile: () => void;
    onToggleLang: () => void;
    onToggleCmd: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onNavigate, onToggleProfile, onToggleLang, onToggleCmd }) => {
    const { user } = useAppStore();
    
    const isAdmin = AdminAuth.verify(user?.walletAddress);
    const isVendor = user?.role === 'vendor';

    // Calculate display balance 
    const balance = user?.stakedArchi || 0; 

    return (
        <header className="relative flex-shrink-0 pt-safe pb-2 px-4 flex justify-between items-center mt-2 z-50">
            <div className="flex items-center">
                <button onClick={() => onNavigate('explore')} className="flex items-center group">
                    <ArchitexLogo className="w-8 h-8 mr-2 text-ai-violet transition-transform group-hover:scale-110"/>
                    <span className="font-bold text-lg tracking-tight text-white hidden sm:block">Architex</span>
                </button>

                {/* Role-Based Navigation Links */}
                {isAdmin && (
                    <button 
                        onClick={() => onNavigate('admin')}
                        className={`ml-4 flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${activeTab === 'admin' ? 'bg-red-500 text-white shadow-glow-red' : 'bg-red-900/30 text-red-400 border border-red-500/30 hover:bg-red-900/50'}`}
                    >
                        <ShieldCheckIcon className="w-3 h-3 mr-1" />
                        Admin Console
                    </button>
                )}

                {isVendor && !isAdmin && (
                    <button 
                        onClick={() => onNavigate('vendor')}
                        className={`ml-4 flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${activeTab === 'vendor' ? 'bg-blue-500 text-white shadow-glow-blue' : 'bg-blue-900/30 text-blue-400 border border-blue-500/30 hover:bg-blue-900/50'}`}
                    >
                        <PackageIcon className="w-3 h-3 mr-1" />
                        Vendor Hub
                    </button>
                )}
            </div>

            <div className="flex items-center space-x-2">
                {/* Wallet Status (Mini) */}
                {user && (
                    <div className="hidden md:flex items-center bg-slate-900/80 border border-white/10 rounded-full px-3 py-1 mr-2">
                        <div className="flex items-center mr-3 border-r border-white/10 pr-3">
                            <PiCoinIcon className="w-4 h-4 text-pi-gold mr-1.5" />
                            <span className="text-xs font-mono font-bold text-white">250.00</span>
                        </div>
                        <div className="flex items-center">
                            <ShieldCheckIcon className="w-3 h-3 text-ai-violet mr-1.5" />
                            <span className="text-xs font-mono text-slate-300">{balance.toLocaleString()}</span>
                        </div>
                    </div>
                )}

                <button onClick={onToggleLang} className="p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/10">
                    <GlobeIcon className="w-5 h-5" />
                </button>
                
                <button onClick={onToggleCmd} className="hidden sm:flex items-center p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/10" title="Command Palette (Cmd+K)">
                    <span className="text-xs bg-white/10 px-2 py-1 rounded border border-white/5">CMD+K</span>
                </button>

                <button onClick={onToggleProfile} className="p-1 text-slate-400 hover:text-white transition-colors relative">
                    {user?.avatarUrl ? (
                        <img src={user.avatarUrl} className="w-8 h-8 rounded-full border border-white/20 hover:border-ai-violet transition-colors" alt="Profile" />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center">
                            <UserIcon className="w-5 h-5" />
                        </div>
                    )}
                    {/* Online Indicator */}
                    <div className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-eco-green border-2 border-brand-dark rounded-full"></div>
                </button>
            </div>
        </header>
    );
};
