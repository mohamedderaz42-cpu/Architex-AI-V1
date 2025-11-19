
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
import { WrenchIcon } from './icons/WrenchIcon';
import { ShieldIcon } from './icons/ShieldIcon';
import { ArbitratorMarketplace } from './ArbitratorMarketplace';
import { DaoInterface } from './DaoInterface';
import { VoteIcon } from './icons/VoteIcon';
import { MarketplaceShop } from './MarketplaceShop'; 
import { useArchitex } from '../hooks/useArchitex'; 

type DeFiTab = 'shop' | 'swap' | 'liquidity' | 'bounties' | 'data' | 'vendor' | 'services' | 'arbitrators' | 'dao';

interface DeFiGatewayProps {
    bounties: BountyEntity[];
    onCreateBounty: () => void;
    onBountySelect: (bounty: BountyEntity) => void;
    serviceProviders: UserEntity[];
    onHireProvider: (provider: UserEntity) => void;
    arbitrators: ArbitratorEntity[];
    proposals: ProposalEntity[];
    user: UserEntity | null;
    onStake: (amount: number) => void;
    onUnstake: (amount: number) => void;
    onVote: (proposalId: string, vote: 'for' | 'against') => void;
    onExecuteProposal: (proposalId: string) => void;
    onViewTos: () => void;
    // New Props
    cartCount: number;
    onAddToCart: (product: ProductEntity) => void;
    onOpenCart: () => void;
    onVendorClick: (vendorId: string) => void;
    // DAO
    onOpenDetails: (proposal: ProposalEntity) => void;
    // Founder
    onJoinFounderProgram: () => void;
}

export const DeFiGateway: React.FC<DeFiGatewayProps> = ({ bounties, onCreateBounty, onBountySelect, serviceProviders, onHireProvider, arbitrators, proposals, user, onStake, onUnstake, onVote, onExecuteProposal, onViewTos, cartCount, onAddToCart, onOpenCart, onVendorClick, onOpenDetails, onJoinFounderProgram }) => {
    const [activeTab, setActiveTab] = useState<DeFiTab>('shop');
    
    // Access global products data
    const { products } = useArchitex();

    const renderTabContent = () => {
        switch (activeTab) {
            case 'shop': return <MarketplaceShop products={products} cartCount={cartCount} onAddToCart={onAddToCart} onOpenCart={onOpenCart} onVendorClick={onVendorClick} />;
            case 'swap': return <SwapInterface />;
            case 'liquidity': return <LiquidityInterface />;
            case 'bounties': return <BountiesInterface bounties={bounties} onCreateBounty={onCreateBounty} onBountySelect={onBountySelect} />;
            case 'data': return <DataApiInterface />;
            case 'vendor': return <VendorPortal />;
            case 'services': return <ServiceMarketplace providers={serviceProviders} onHire={onHireProvider} />;
            case 'arbitrators': return <ArbitratorMarketplace arbitrators={arbitrators} />;
            case 'dao': return user && <DaoInterface user={user} proposals={proposals} onStake={onStake} onUnstake={onUnstake} onVote={onVote} onExecute={onExecuteProposal} onViewTos={onViewTos} onOpenDetails={onOpenDetails}/>;
            default: return null;
        }
    };
    
    return (
        <div className="w-full h-full flex flex-col">
            <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-white">Marketplace</h2>
                <p className="text-slate-400 mt-1 text-sm">Trade assets and commission professionals.</p>
            </div>
            
            <GlassPanel className="flex-grow p-2 flex flex-col min-h-0">
                <div className="flex-shrink-0 flex items-center justify-center p-1 bg-slate-900/50 rounded-full mb-4 overflow-x-auto no-scrollbar">
                    <button onClick={() => setActiveTab('shop')} className={`px-3 py-2 rounded-full font-semibold text-xs sm:text-sm transition-colors duration-300 whitespace-nowrap ${activeTab === 'shop' ? 'bg-eco-green/80 text-white' : 'text-slate-300'}`}>Shop</button>
                    <button onClick={() => setActiveTab('bounties')} className={`px-3 py-2 rounded-full font-semibold text-xs sm:text-sm transition-colors duration-300 whitespace-nowrap ${activeTab === 'bounties' ? 'bg-eco-green/80 text-white' : 'text-slate-300'}`}>Bounties</button>
                    <button onClick={() => setActiveTab('services')} className={`px-3 py-2 rounded-full font-semibold text-xs sm:text-sm transition-colors duration-300 whitespace-nowrap ${activeTab === 'services' ? 'bg-eco-green/80 text-white' : 'text-slate-300'}`}>Services</button>
                    <button onClick={() => setActiveTab('vendor')} className={`px-3 py-2 rounded-full font-semibold text-xs sm:text-sm transition-colors duration-300 whitespace-nowrap ${activeTab === 'vendor' ? 'bg-eco-green/80 text-white' : 'text-slate-300'}`}>Vendor Hub</button>
                    <button onClick={() => setActiveTab('dao')} className={`px-3 py-2 rounded-full font-semibold text-xs sm:text-sm transition-colors duration-300 whitespace-nowrap ${activeTab === 'dao' ? 'bg-eco-green/80 text-white' : 'text-slate-300'}`}>DAO</button>
                    <button onClick={() => setActiveTab('arbitrators')} className={`px-3 py-2 rounded-full font-semibold text-xs sm:text-sm transition-colors duration-300 whitespace-nowrap ${activeTab === 'arbitrators' ? 'bg-eco-green/80 text-white' : 'text-slate-300'}`}>Arbitrators</button>
                    <button onClick={() => setActiveTab('swap')} className={`px-3 py-2 rounded-full font-semibold text-xs sm:text-sm transition-colors duration-300 whitespace-nowrap ${activeTab === 'swap' ? 'bg-eco-green/80 text-white' : 'text-slate-300'}`}>Swap</button>
                </div>
                {activeTab === 'bounties' && !user?.isFounder && <div className="px-2"><PromoBanner onJoinFounderProgram={onJoinFounderProgram} /></div>}
                <div className="flex-grow overflow-y-auto min-h-0">
                    {renderTabContent()}
                </div>
            </GlassPanel>

            <div className="mt-4">
                <SecurityStatus />
            </div>
        </div>
    );
};
