
import React from 'react';
import { GlassPanel } from './GlassPanel';
import { UserEntity } from '../core/schemas/entities';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { StarIcon } from './icons/StarIcon';

interface VendorProfileModalProps {
    vendor: UserEntity;
    onClose: () => void;
}

export const VendorProfileModal: React.FC<VendorProfileModalProps> = ({ vendor, onClose }) => {
    return (
        <div className="fixed inset-0 bg-brand-dark/80 backdrop-blur-md flex items-center justify-center z-[80] p-4">
            <GlassPanel className="w-full max-w-sm p-6 animate-fade-in">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white text-2xl">&times;</button>
                
                <div className="flex flex-col items-center">
                    <img src={vendor.avatarUrl} alt={vendor.piUsername} className="w-24 h-24 rounded-full border-4 border-slate-800 shadow-lg mb-4" />
                    <h2 className="text-2xl font-bold text-white flex items-center">
                        {vendor.piUsername}
                        <span title="Verified Vendor" className="ml-2">
                            <ShieldCheckIcon className="w-5 h-5 text-eco-green" />
                        </span>
                    </h2>
                    <p className="text-ai-violet text-sm font-medium">{vendor.subscriptionTier === 'Accelerator' ? 'Premium Supplier' : 'Verified Vendor'}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 my-6">
                    <div className="bg-slate-900/50 p-3 rounded-xl text-center border border-white/5">
                        <div className="text-2xl font-bold text-white">{vendor.trustScore}</div>
                        <div className="text-xs text-slate-400">Trust Score</div>
                    </div>
                    <div className="bg-slate-900/50 p-3 rounded-xl text-center border border-white/5">
                        <div className="text-2xl font-bold text-white flex items-center justify-center">
                            4.9 <StarIcon className="w-4 h-4 text-pi-gold ml-1" />
                        </div>
                        <div className="text-xs text-slate-400">Rating</div>
                    </div>
                </div>

                <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm text-slate-300 border-b border-white/10 pb-2">
                        <span>Wallet</span>
                        <span className="font-mono text-xs">{vendor.walletAddress.slice(0,6)}...{vendor.walletAddress.slice(-4)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-300 border-b border-white/10 pb-2">
                        <span>Insurance</span>
                        <span className="text-eco-green flex items-center"><ShieldCheckIcon className="w-3 h-3 mr-1"/> Verified</span>
                    </div>
                     <div className="flex justify-between text-sm text-slate-300 pb-2">
                        <span>Member Since</span>
                        <span>Jan 2024</span>
                    </div>
                </div>

                <button onClick={onClose} className="w-full py-3 bg-slate-700/50 rounded-full text-white font-semibold hover:bg-slate-600 transition-colors">
                    Close Profile
                </button>
            </GlassPanel>
        </div>
    );
};
