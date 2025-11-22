
import React, { useState, useEffect } from 'react';
import { UserEntity, ProductEntity, DropshipListing } from '../core/schemas/entities';
import { GlassPanel } from './GlassPanel';
import { DropshipAgreementModal } from './DropshipAgreementModal';
import { GlobeIcon } from './icons/GlobeIcon';
import { BoxIcon } from './icons/BoxIcon';
import { PlusIcon } from './icons/PlusIcon';
import { SearchIcon } from './icons/SearchIcon';
import { PiCoinIcon } from './icons/PiCoinIcon';
import { useToast } from './ToastProvider';
import * as api from '../core/api/contract';

interface DropshipPortalProps {
    user: UserEntity;
    onUpdateUser: (user: UserEntity) => void;
}

type Tab = 'overview' | 'source' | 'listings';

export const DropshipPortal: React.FC<DropshipPortalProps> = ({ user, onUpdateUser }) => {
    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const [showAgreement, setShowAgreement] = useState(false);
    const [storeName, setStoreName] = useState('');
    const { addToast } = useToast();
    
    // Data State
    const [candidates, setCandidates] = useState<ProductEntity[]>([]);
    const [myListings, setMyListings] = useState<DropshipListing[]>([]);

    useEffect(() => {
        if (user.dropshipProfile?.isActive) {
            loadData();
        }
    }, [activeTab, user.dropshipProfile]);

    const loadData = async () => {
        if (activeTab === 'source') {
            const prods = await api.listDropshipCandidates();
            setCandidates(prods);
        } else if (activeTab === 'listings') {
            const listings = await api.getMyDropshipListings();
            setMyListings(listings);
        }
    };

    const handleActivate = async () => {
        const profile = await api.activateDropshipping(storeName);
        onUpdateUser({ ...user, dropshipProfile: profile });
        setShowAgreement(false);
        addToast("Dropshipping Store Activated", "success");
    };

    const handleAddListing = async (productId: string, basePrice: number) => {
        // Simple prompt for markup in this demo, usually a modal
        const markupStr = prompt(`Enter retail price (Base Wholesale: ${basePrice} PiUSD):`, (basePrice * 1.2).toString());
        if (!markupStr) return;
        
        const markup = parseFloat(markupStr);
        if (markup <= basePrice) {
            addToast("Price must be higher than wholesale cost", "error");
            return;
        }

        await api.addDropshipListing(productId, markup);
        addToast("Product added to your store", "success");
        // Refresh candidates to show added status if needed
    };

    // --- Onboarding View ---
    if (!user.dropshipProfile?.isActive) {
        return (
            <div className="p-4 text-center">
                <div className="w-16 h-16 mx-auto bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                    <GlobeIcon className="w-8 h-8 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Global Dropshipping</h2>
                <p className="text-slate-400 text-sm mb-6">
                    Start your own digital furniture store without inventory. Source products, set your margin, and manage fulfillment.
                </p>
                <input 
                    type="text" 
                    placeholder="Store Name" 
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full bg-slate-800 border border-white/10 rounded-lg p-3 text-white mb-4 focus:border-blue-400 outline-none"
                />
                <button 
                    onClick={() => { if(storeName) setShowAgreement(true); }}
                    disabled={!storeName}
                    className="w-full py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-500 transition-all disabled:opacity-50"
                >
                    Start Selling
                </button>
                
                {showAgreement && (
                    <DropshipAgreementModal 
                        onConfirm={handleActivate} 
                        onCancel={() => setShowAgreement(false)} 
                    />
                )}
            </div>
        );
    }

    // --- Dashboard Views ---
    return (
        <div className="flex flex-col h-full">
            {/* Navigation */}
            <div className="flex-shrink-0 p-2 bg-slate-900/50 m-2 rounded-xl flex space-x-1">
                <button 
                    onClick={() => setActiveTab('overview')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-white text-brand-dark' : 'text-slate-400 hover:text-white'}`}
                >
                    Overview
                </button>
                <button 
                    onClick={() => setActiveTab('source')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${activeTab === 'source' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                    Source Items
                </button>
                <button 
                    onClick={() => setActiveTab('listings')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${activeTab === 'listings' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                    My Store
                </button>
            </div>

            <div className="flex-grow overflow-y-auto p-2">
                {activeTab === 'overview' && (
                    <div className="space-y-4">
                        <div className="bg-gradient-to-r from-blue-900/40 to-slate-900 p-4 rounded-2xl border border-blue-500/30">
                            <h3 className="text-lg font-bold text-white">{user.dropshipProfile.storeName}</h3>
                            <div className="text-xs text-slate-400 mt-1">Seller Rating: {user.dropshipProfile.reputationScore}/100</div>
                            
                            <div className="mt-4 flex justify-between items-end">
                                <div>
                                    <p className="text-xs text-slate-400">Total Sales</p>
                                    <p className="text-2xl font-bold text-white">{user.dropshipProfile.totalSales}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-400">Platform Fee</p>
                                    <p className="text-sm font-bold text-white">2.0%</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                            <button className="p-3 bg-slate-800 rounded-xl border border-white/5 hover:border-white/20 text-left">
                                <BoxIcon className="w-6 h-6 text-orange-400 mb-2" />
                                <div className="text-xs text-slate-400">Pending Orders</div>
                                <div className="font-bold text-white">0</div>
                            </button>
                             <button className.tsx="p-3 bg-slate-800 rounded-xl border border-white/5 hover:border-white/20 text-left">
                                <GlobeIcon className="w-6 h-6 text-eco-green mb-2" />
                                <div className="text-xs text-slate-400">Active Listings</div>
                                <div className="font-bold text-white">{myListings.length}</div>
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'source' && (
                    <div className="space-y-3">
                        <div className="relative">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input type="text" placeholder="Search global catalog..." className="w-full bg-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none" />
                        </div>
                        {candidates.map(prod => (
                            <div key={prod.id} className="bg-slate-900/50 p-3 rounded-xl border border-white/10 flex space-x-3">
                                <img src={prod.imageUrl} className="w-16 h-16 rounded object-cover" />
                                <div className="flex-grow">
                                    <h4 className="text-sm font-bold text-white">{prod.name}</h4>
                                    <p className="text-xs text-slate-400">Wholesale: {prod.wholesalePrice} PiUSD</p>
                                    <div className="flex items-center mt-2">
                                        <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-slate-300">MSRP: {prod.price}</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleAddListing(prod.id, prod.wholesalePrice || 0)}
                                    className="self-center bg-blue-600 p-2 rounded-full text-white hover:bg-blue-500"
                                >
                                    <PlusIcon className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'listings' && (
                    <div className="space-y-3">
                        {myListings.length === 0 && <p className="text-center text-slate-500 mt-10">No active listings.</p>}
                        {myListings.map(listing => (
                            <div key={listing.id} className="bg-slate-900/50 p-3 rounded-xl border border-blue-500/20 flex justify-between items-center">
                                <div>
                                    <div className="text-xs text-slate-400">Item ID: {listing.originalProductId}</div>
                                    <div className="font-bold text-white flex items-center">
                                        {listing.markupPrice} PiUSD
                                        <span className="ml-2 text-[10px] text-eco-green">+{listing.margin.toFixed(2)} Margin</span>
                                    </div>
                                </div>
                                <div className="px-2 py-1 bg-eco-green/20 text-eco-green text-xs font-bold rounded">Active</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
