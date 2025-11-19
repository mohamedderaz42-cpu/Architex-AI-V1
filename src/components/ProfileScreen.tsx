
import React, { useState } from 'react';
import { UserEntity, ProjectEntity, OrderEntity, ServiceAgreementEntity, TokenEntity } from '../core/schemas/entities';
import { GlassPanel } from './GlassPanel';
import { SystemStatus } from './SystemStatus';
import { AcceleratorSubscription } from './AcceleratorSubscription';
import { AdBanner } from './AdBanner';
import { OrderCard } from './OrderCard';
import { ServiceAgreementCard } from './ServiceAgreementCard';
import { WalletPanel } from './WalletPanel'; 

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
    onClose: () => void;
}

type ProfileTab = 'gallery' | 'orders' | 'services' | 'wallet';

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, projects, orders, serviceAgreements, userTokens, onConfirmDelivery, onRequestReturn, onConfirmServiceCompletion, onClaimVestedTokens, onClose }) => {
    const publicProjects = projects.filter(p => p.isPublic);
    const [activeTab, setActiveTab] = useState<ProfileTab>('gallery');

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
                    </div>
                );
            case 'wallet':
                return <WalletPanel userTokens={userTokens} onClaim={onClaimVestedTokens} />;
        }
    }

    return (
        <div className="fixed inset-0 bg-brand-dark/80 backdrop-blur-md flex items-center justify-center z-[60] p-4">
            <GlassPanel className="w-full max-w-md h-[90vh] flex flex-col p-6 animate-fade-in">
                <div className="flex-shrink-0 text-center relative">
                    <button onClick={onClose} className="absolute top-0 left-0 text-slate-400 hover:text-white text-2xl font-mono">&times;</button>
                    {user.avatarUrl && (
                        <img src={user.avatarUrl} alt="User Avatar" className="w-24 h-24 rounded-full mx-auto border-2 border-ai-violet" />
                    )}
                    <h2 className="text-2xl font-bold text-white mt-4">{user.piUsername}</h2>
                    <p className="text-sm text-slate-400 truncate">{user.walletAddress}</p>
                    <div className="mt-4 inline-flex items-center bg-eco-green/20 text-eco-green px-3 py-1 rounded-full text-sm font-semibold">
                        Trust Score: {user.trustScore}
                    </div>
                </div>

                <div className="flex-grow mt-6 flex flex-col min-h-0">
                    <div className="flex-shrink-0 flex items-center justify-center p-1 bg-slate-900/50 rounded-full mb-4 overflow-x-auto no-scrollbar">
                        <button onClick={() => setActiveTab('gallery')} className={`px-3 py-1.5 rounded-full font-semibold text-xs transition-colors duration-300 ${activeTab === 'gallery' ? 'bg-slate-700 text-white' : 'text-slate-300'}`}>Gallery</button>
                        <button onClick={() => setActiveTab('orders')} className={`px-3 py-1.5 rounded-full font-semibold text-xs transition-colors duration-300 ${activeTab === 'orders' ? 'bg-slate-700 text-white' : 'text-slate-300'}`}>Orders</button>
                        <button onClick={() => setActiveTab('services')} className={`px-3 py-1.5 rounded-full font-semibold text-xs transition-colors duration-300 ${activeTab === 'services' ? 'bg-slate-700 text-white' : 'text-slate-300'}`}>Services</button>
                        <button onClick={() => setActiveTab('wallet')} className={`px-3 py-1.5 rounded-full font-semibold text-xs transition-colors duration-300 ${activeTab === 'wallet' ? 'bg-slate-700 text-white' : 'text-slate-300'}`}>Wallet</button>
                    </div>

                    <div className="flex-grow overflow-y-auto pr-2">
                      {renderTabContent()}
                    </div>

                    <div className="flex-shrink-0 pt-4 mt-2 border-t border-white/10 flex justify-center space-x-6 text-xs text-slate-500">
                        <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-slate-300 transition-colors">Support</a>
                    </div>
                </div>
            </GlassPanel>
        </div>
    );
};
