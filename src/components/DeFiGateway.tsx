
import React, { useState } from 'react';
import { GlassPanel } from './GlassPanel';
import { SwapInterface } from './SwapInterface';
import { LiquidityInterface } from './LiquidityInterface';
import { BountiesInterface } from './BountiesInterface';
import { BountyEntity, UserEntity, ArbitratorEntity, ProposalEntity, ProductEntity } from '../core/schemas/entities';
import { SecurityStatus } from './SecurityStatus';
import { PromoBanner } from './PromoBanner';
import { DataApiInterface } from './DataApiInterface';
import { VendorPortal } from './VendorPortal';
import { ServiceMarketplace } from './ServiceMarketplace';
import { MarketplaceShop } from './MarketplaceShop';
import { ArbitratorMarketplace } from './ArbitratorMarketplace';
import { DaoInterface } from './DaoInterface';
import { MicroServicesHub } from './MicroServicesHub';
import { AffiliateDashboard } from './AffiliateDashboard';
import { DropshipPortal } from './DropshipPortal';

type DeFiTab = 'swap' | 'liquidity' | 'bounties' | 'data' | 'vendor' | 'services' | 'arbitrators' | 'dao' | 'shop' | 'quickfix' | 'earn'; 

interface DeFiGatewayProps {
    bounties: BountyEntity[];
    onCreateBounty: () => void;
    onBountySelect: (bounty: BountyEntity) => void;
    serviceProviders: UserEntity[];
    onHireProvider: (provider: UserEntity) => void;
    arbitrators: ArbitratorEntity[];
    proposals: ProposalEntity[];
    user: UserEntity | null;
    // Add user update callback
    onUpdateUser: (user: UserEntity) => void; 
    onStake: (amount: number) => void;
    onUnstake: (amount: number) => void;
    onVote: (proposalId: string, vote: 'for' | 'against') => void;
    onExecuteProposal: (proposalId: string) => void;
    onViewTos: () => void;
    // Shop Props
    products: ProductEntity[];
    cartCount: number;
    onAddToCart: (product: ProductEntity) => void;
    onOpenCart: () => void;
    onVendorClick: (vendorId: string) => void;
    // DAO Props
    onOpenDetails: (proposal: ProposalEntity) => void;
    // Promo Props
    onJoinFounderProgram: () => void;
    // New Props for DAO State
    handleClaimStakingRewards: () => void;
    votingPower: { total: number; fromTokens: number; fromTrust: number };
    onCreateChallenge: () => void;
}

export const DeFiGateway: React.FC<DeFiGatewayProps> = ({ 
    bounties, onCreateBounty, onBountySelect, 
    serviceProviders, onHireProvider, 
    arbitrators, proposals, user, onUpdateUser,
    onStake, onUnstake, onVote, onExecuteProposal, onViewTos,
    products, cartCount, onAddToCart, onOpenCart, onVendorClick,
    onOpenDetails, onJoinFounderProgram,
    handleClaimStakingRewards, votingPower, onCreateChallenge
}) => {
    const [activeTab, setActiveTab] = useState<DeFiTab>('bounties');
    // Sub-tab state for Earn section
    const [earnMode, setEarnMode] = useState<'affiliate' | 'dropship'>('affiliate');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'swap': return <SwapInterface />;
            case 'liquidity': return <LiquidityInterface />;
            case 'bounties': return <BountiesInterface bounties={bounties} onCreateBounty={onCreateBounty} onBountySelect={onBountySelect} />;
            case 'data': return <DataApiInterface />;
            case 'vendor': return <VendorPortal />;
            case 'services': return <ServiceMarketplace providers={serviceProviders} onHire={onHireProvider} />;
            case 'arbitrators': return <ArbitratorMarketplace arbitrators={arbitrators} />;
            case 'dao': return user && <DaoInterface user={user} proposals={proposals} onStake={onStake} onUnstake={onUnstake} onVote={onVote} onExecute={onExecuteProposal} onViewTos={onViewTos} onOpenDetails={onOpenDetails} handleClaimStakingRewards={handleClaimStakingRewards} votingPower={votingPower} onCreateChallenge={onCreateChallenge} />;
            case 'shop': return <MarketplaceShop products={products} cartCount={cartCount} onAddToCart={onAddToCart} onOpenCart={onOpenCart} onVendorClick={onVendorClick} />;
            case 'quickfix': return <MicroServicesHub />;
            case 'earn': 
                if (!user) return null;
                return (
                    <div className="h-full flex flex-col">
                        <div className="flex justify-center mb-4 px-4">
                             <div className="bg-slate-900/50 p-1 rounded-full flex space-x-1 w-full max-w-xs border border-white/10">
                                <button 
                                    onClick={() => setEarnMode('affiliate')}
                                    className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all ${earnMode === 'affiliate' ? 'bg-ai-violet text-white' : 'text-slate-400 hover:text-white'}`}
                                >
                                    Affiliate
                                </button>
                                 <button 
                                    onClick={() => setEarnMode('dropship')}
                                    className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all ${earnMode === 'dropship' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'}`}
                                >
                                    Dropship
                                </button>
                             </div>
                        </div>
                        {earnMode === 'affiliate' ? (
                            <AffiliateDashboard user={user} onUpdateUser={onUpdateUser} />
                        ) : (
                            <DropshipPortal user={user} onUpdateUser={onUpdateUser} />
                        )}
                    </div>
                );
            default: return null;
        }
    };
    
    return (
        <div className="w-full h-full flex flex-col">
            <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-white">Marketplace</h2>
                <p className="text-slate-400 mt-1 text-sm">Trade assets, earn rewards, and commission professionals.</p>
            </div>
            
            <GlassPanel className="flex-grow p-2 flex flex-col min-h-0">
                <div className="flex-shrink-0 flex items-center justify-center p-1 bg-slate-900/50 rounded-full mb-4 overflow-x-auto no-scrollbar">
                    <button onClick={() => setActiveTab('quickfix')} className={`px-3 py-2 rounded-full font-semibold text-xs sm:text-sm transition-colors duration-300 whitespace-nowrap ${activeTab === 'quickfix' ? 'bg-pi-gold text-brand-dark' : 'text-slate-300'}`}>Quick Fix</button>
                    <button onClick={() => setActiveTab('earn')} className={`px-3 py-2 rounded-full font-semibold text-xs sm:text-sm transition-colors duration-300 whitespace-nowrap ${activeTab === 'earn' ? 'bg-ai-violet text-white shadow-glow-violet' : 'text-slate-300'}`}>Earn</button>
                    <button onClick={() => setActiveTab('bounties')} className={`px-3 py-2 rounded-full font-semibold text-xs sm:text-sm transition-colors duration-300 whitespace-nowrap ${activeTab === 'bounties' ? 'bg-eco-green/80 text-white' : 'text-slate-300'}`}>Bounties</button>
                    <button onClick={() => setActiveTab('shop')} className={`px-3 py-2 rounded-full font-semibold text-xs sm:text-sm transition-colors duration-300 whitespace-nowrap ${activeTab === 'shop' ? 'bg-eco-green/80 text-white' : 'text-slate-300'}`}>Materials</button>
                    <button onClick={() => setActiveTab('services')} className={`px-3 py-2 rounded-full font-semibold text-xs sm:text-sm transition-colors duration-300 whitespace-nowrap ${activeTab === 'services' ? 'bg-eco-green/80 text-white' : 'text-slate-300'}`}>Pro Services</button>
                    <button onClick={() => setActiveTab('vendor')} className={`px-3 py-2 rounded-full font-semibold text-xs sm:text-sm transition-colors duration-300 whitespace-nowrap ${activeTab === 'vendor' ? 'bg-eco-green/80 text-white' : 'text-slate-300'}`}>Vendor Hub</button>
                    <button onClick={() => setActiveTab('dao')} className={`px-3 py-2 rounded-full font-semibold text-xs sm:text-sm transition-colors duration-300 whitespace-nowrap ${activeTab === 'dao' ? 'bg-eco-green/80 text-white' : 'text-slate-300'}`}>DAO</button>
                    <button onClick={() => setActiveTab('arbitrators')} className={`px-3 py-2 rounded-full font-semibold text-xs sm:text-sm transition-colors duration-300 whitespace-nowrap ${activeTab === 'arbitrators' ? 'bg-eco-green/80 text-white' : 'text-slate-300'}`}>Arbitrators</button>
                    <button onClick={() => setActiveTab('swap')} className={`px-3 py-2 rounded-full font-semibold text-xs sm:text-sm transition-colors duration-300 whitespace-nowrap ${activeTab === 'swap' ? 'bg-eco-green/80 text-white' : 'text-slate-300'}`}>Swap</button>
                </div>
                {activeTab === 'bounties' && <div className="px-2"><PromoBanner onJoinFounderProgram={onJoinFounderProgram} /></div>}
                <div className="flex-grow overflow-y-auto">
                    {renderTabContent()}
                </div>
            </GlassPanel>

            <div className="mt-4">
                <SecurityStatus />
            </div>
        </div>
    );
};
