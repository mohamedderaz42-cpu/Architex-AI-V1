
import React, { useState, useEffect } from 'react';
import { UserEntity, ProjectEntity, OrderEntity, ServiceAgreementEntity, TokenEntity, SignedAgreement } from '../core/schemas/entities';
import { GlassPanel } from './GlassPanel';
import { AcceleratorSubscription } from './AcceleratorSubscription';
import { OrderCard } from './OrderCard';
import { ServiceAgreementCard } from './ServiceAgreementCard';
import { WalletPanel } from './WalletPanel'; 
import { FileTextIcon } from './icons/FileTextIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { WrenchIcon } from './icons/WrenchIcon';
import { GavelIcon } from './icons/GavelIcon';
import { LayoutIcon } from './icons/LayoutIcon'; 
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';
import * as api from '../core/api/contract';

interface ProfileScreenProps {
    user: UserEntity;
    projects: ProjectEntity[];
    orders: OrderEntity[];
    serviceAgreements: ServiceAgreementEntity[];
    userTokens: TokenEntity[];
    onConfirmDelivery: (orderId: string) => void;
    onRequestReturn: (orderId: string) => void;
    onConfirmServiceCompletion: (agreement: ServiceAgreementEntity) => void;
    onClaimVestedTokens: () => Promise<void>;
    onSubscribe: () => void;
    onClose: () => void;
    onBecomeProvider: () => void;
    onBecomeArbitrator: () => void;
    onOpenEnterprise: () => void;
    onOpenWhitePaper: () => void;
    onOpenAbout: () => void;
    onOpenLegal: (tab: 'privacy' | 'terms') => void;
    onDisputeOrder: (orderId: string) => Promise<void>;
}

type ProfileTab = 'gallery' | 'orders' | 'services' | 'wallet' | 'contracts';

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, projects, orders, serviceAgreements, userTokens, onConfirmDelivery, onRequestReturn, onConfirmServiceCompletion, onClaimVestedTokens, onSubscribe, onClose, onBecomeProvider, onBecomeArbitrator, onOpenEnterprise, onOpenWhitePaper, onOpenAbout, onOpenLegal, onDisputeOrder }) => {
    const publicProjects = projects.filter(p => p.isPublic);
    const [activeTab, setActiveTab] = useState<ProfileTab>('gallery');
    const [agreements, setAgreements] = useState<SignedAgreement[]>([]);

    useEffect(() => {
        if (activeTab === 'contracts') {
            api.listSignedAgreements(user.id).then(setAgreements);
        }
    }, [activeTab, user.id]);

    const handleReportBug = () => {
        window.open('mailto:support@architex.app?subject=Beta Feedback - Architex App');
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'gallery':
                return (
                    <div className="grid grid-cols-2 gap-4">
                        {publicProjects.map(project => (
                            <div key={project.id} className="rounded-lg overflow-hidden relative aspect-square group">
                                <img src={project.thumbnailUrl} alt={project.name} className="w-full h-full object-cover"/>
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                                    <span className="text-white text-sm font-semibold">{project.name}</span>
                                </div>
                            </div>
                        ))}
                        {!publicProjects.length && (
                            <div className="col-span-2 text-center text-slate-500 py-8">
                                No public projects yet.
                            </div>
                        )}
                    </div>
                );
            case 'orders':
                 return (
                    <div className="space-y-3">
                        {orders.map(order => (
                            <OrderCard 
                                key={order.id} 
                                order={order}
                                onConfirmDelivery={onConfirmDelivery}
                                onRequestReturn={onRequestReturn}
                                onDisputeOrder={onDisputeOrder}
                            />
                        ))}
                        {!orders.length && (
                             <div className="col-span-2 text-center text-slate-500 py-8">
                                No orders found.
                            </div>
                        )}
                    </div>
                 );
            case 'services':
                return (
                    <div className="space-y-3">
                        {serviceAgreements.map(agreement => (
                           <ServiceAgreementCard 
                                key={agreement.id}
                                agreement={agreement}
                                onConfirmCompletion={onConfirmServiceCompletion}
                           />
                        ))}
                        {!serviceAgreements.length && (
                             <div className="col-span-2 text-center text-slate-500 py-8">
                                No active service agreements.
                            </div>
                        )}
                        
                        <div className="pt-4 mt-4 border-t border-white/10 space-y-3">
                             <button 
                                onClick={onBecomeProvider}
                                disabled={!!user.serviceProviderProfile}
                                className="w-full flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-white/5 hover:border-eco-green/30 transition-colors disabled:opacity-50"
                             >
                                 <div className="flex items-center">
                                     <div className="p-2 bg-eco-green/20 rounded-lg mr-3">
                                         <WrenchIcon className="w-5 h-5 text-eco-green" />
                                     </div>
                                     <div className="text-left">
                                         <div className="font-bold text-white text-sm">Become a Pro</div>
                                         <div className="text-xs text-slate-400">{user.serviceProviderProfile ? 'Profile Active' : 'Offer installation services'}</div>
                                     </div>
                                 </div>
                                 {!user.serviceProviderProfile && <span className="text-eco-green text-xs font-bold">Apply</span>}
                             </button>

                             <button 
                                onClick={onBecomeArbitrator}
                                disabled={!!user.arbitratorProfile}
                                className="w-full flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-white/5 hover:border-pi-gold/30 transition-colors disabled:opacity-50"
                             >
                                 <div className="flex items-center">
                                     <div className="p-2 bg-pi-gold/20 rounded-lg mr-3">
                                         <GavelIcon className="w-5 h-5 text-pi-gold" />
                                     </div>
                                     <div className="text-left">
                                         <div className="font-bold text-white text-sm">Become Arbitrator</div>
                                         <div className="text-xs text-slate-400">{user.arbitratorProfile ? 'Application Pending' : 'Resolve disputes & earn'}</div>
                                     </div>
                                 </div>
                                 {!user.arbitratorProfile && <span className="text-pi-gold text-xs font-bold">Apply</span>}
                             </button>
                        </div>
                    </div>
                );
            case 'wallet':
                return <WalletPanel userTokens={userTokens} onClaim={onClaimVestedTokens} />;
            case 'contracts':
                return (
                    <div className="space-y-3">
                        {agreements.map(agg => (
                            <div key={agg.id} className="bg-slate-900/50 p-4 rounded-xl border border-white/10">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center">
                                        <FileTextIcon className="w-5 h-5 text-ai-violet mr-2" />
                                        <h5 className="font-bold text-white text-sm">{agg.type} Agreement</h5>
                                    </div>
                                    <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded font-mono">{agg.status}</span>
                                </div>
                                <div className="text-xs text-slate-400 mb-2">
                                    Ref: {agg.referenceId}
                                </div>
                                <div className="bg-black/30 p-2 rounded border border-white/5 font-mono text-[10px] text-slate-500 break-all mb-2">
                                    Hash: {agg.contentHash}
                                </div>
                                <div className="flex justify-between items-center text-[10px] text-slate-500">
                                    <span>Signed: {new Date(agg.timestamp).toLocaleDateString()}</span>
                                    <span className="flex items-center text-eco-green"><ShieldCheckIcon className="w-3 h-3 mr-1"/> On-Chain</span>
                                </div>
                            </div>
                        ))}
                        {!agreements.length && (
                             <div className="col-span-2 text-center text-slate-500 py-8">
                                No signed agreements found.
                            </div>
                        )}
                    </div>
                );
        }
    }

    return (
        <div className="fixed inset-0 bg-brand-dark/80 backdrop-blur-md flex items-center justify-center z-[60] p-4">
            <GlassPanel className="w-full max-w-md h-[90vh] flex flex-col p-6 animate-fade-in relative">
                <div className="flex-shrink-0 text-center relative">
                    <button onClick={onClose} className="absolute top-0 left-0 text-slate-400 hover:text-white text-2xl font-mono">&times;</button>
                    
                    {/* Report Bug Button */}
                    <button onClick={handleReportBug} className="absolute top-0 right-0 text-red-400 hover:text-red-300" title="Report a Bug">
                        <AlertTriangleIcon className="w-5 h-5" />
                    </button>

                    {user.avatarUrl && (
                        <img src={user.avatarUrl} alt="User Avatar" className="w-24 h-24 rounded-full mx-auto border-2 border-ai-violet" />
                    )}
                    <h2 className="text-2xl font-bold text-white mt-4 flex items-center justify-center">
                        {user.piUsername}
                        {user.isFounder && (
                             <span title="Founder Member" className="ml-2">
                                 <ShieldCheckIcon className="w-5 h-5 text-pi-gold" />
                             </span>
                        )}
                    </h2>
                    <p className="text-sm text-slate-400 truncate">{user.walletAddress}</p>
                    
                    <div className="mt-4 flex flex-col items-center space-y-2">
                        <div className="group relative inline-flex items-center bg-eco-green/20 text-eco-green px-4 py-2 rounded-full text-sm font-semibold border border-eco-green/30 cursor-help">
                            <ShieldCheckIcon className="w-4 h-4 mr-1" />
                            Trust Score: {user.trustScore}
                            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-48 bg-black p-3 rounded-xl border border-white/20 hidden group-hover:block z-20 text-[10px] text-left">
                                <div className="font-bold text-white mb-1 border-b border-white/10 pb-1">Score Components</div>
                                <div className="flex justify-between text-slate-400"><span>Base</span> <span>50</span></div>
                                <div className="flex justify-between text-eco-green"><span>Service</span> <span>+5/job</span></div>
                                <div className="flex justify-between text-red-400"><span>Disputes</span> <span>-20/loss</span></div>
                                <div className="flex justify-between text-pi-gold"><span>Ratings</span> <span>Weighted</span></div>
                            </div>
                        </div>
                        
                        {user.subscriptionTier === 'Enterprise' && (
                             <button 
                                onClick={onOpenEnterprise}
                                className="flex items-center px-3 py-1 bg-white/10 border border-white/20 hover:bg-white/20 rounded-full text-xs font-bold text-white uppercase tracking-wide transition-colors"
                            >
                                <LayoutIcon className="w-3 h-3 mr-1" />
                                Enterprise Portal
                            </button>
                        )}
                        
                        {user.isFounder && (
                            <div className="inline-flex items-center bg-pi-gold/20 text-pi-gold px-3 py-1 rounded-full text-xs font-bold uppercase">
                                Founder Member
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="mt-4">
                    <AcceleratorSubscription user={user} onSubscribe={onSubscribe} />
                </div>

                <div className="flex-grow mt-6 flex flex-col min-h-0">
                    <div className="flex-shrink-0 flex items-center justify-center p-1 bg-slate-900/50 rounded-full mb-4 overflow-x-auto no-scrollbar">
                        <button onClick={() => setActiveTab('gallery')} className={`px-3 py-1.5 rounded-full font-semibold text-xs transition-colors duration-300 ${activeTab === 'gallery' ? 'bg-slate-700 text-white' : 'text-slate-300'}`}>Gallery</button>
                        <button onClick={() => setActiveTab('orders')} className={`px-3 py-1.5 rounded-full font-semibold text-xs transition-colors duration-300 ${activeTab === 'orders' ? 'bg-slate-700 text-white' : 'text-slate-300'}`}>Orders</button>
                        <button onClick={() => setActiveTab('services')} className={`px-3 py-1.5 rounded-full font-semibold text-xs transition-colors duration-300 ${activeTab === 'services' ? 'bg-slate-700 text-white' : 'text-slate-300'}`}>Services</button>
                        <button onClick={() => setActiveTab('wallet')} className={`px-3 py-1.5 rounded-full font-semibold text-xs transition-colors duration-300 ${activeTab === 'wallet' ? 'bg-slate-700 text-white' : 'text-slate-300'}`}>Wallet</button>
                        <button onClick={() => setActiveTab('contracts')} className={`px-3 py-1.5 rounded-full font-semibold text-xs transition-colors duration-300 ${activeTab === 'contracts' ? 'bg-slate-700 text-white' : 'text-slate-300'}`}>Contracts</button>
                    </div>

                    <div className="flex-grow overflow-y-auto pr-2">
                      {renderTabContent()}
                    </div>

                    <div className="flex-shrink-0 pt-4 mt-2 border-t border-white/10 flex justify-center space-x-4 text-xs text-slate-500">
                         <button onClick={onOpenAbout} className="hover:text-white transition-colors font-medium">About</button>
                        <button onClick={onOpenWhitePaper} className="hover:text-white transition-colors font-bold">White Paper</button>
                        <button onClick={() => onOpenLegal('terms')} className="hover:text-slate-300 transition-colors">Terms</button>
                        <button onClick={() => onOpenLegal('privacy')} className="hover:text-slate-300 transition-colors">Privacy</button>
                    </div>
                </div>
            </GlassPanel>
        </div>
    );
};
