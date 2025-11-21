
import React, { useState, useEffect } from 'react';
import { LockIcon } from './icons/LockIcon';
import * as api from '../core/api/contract';
import { ProductEntity, ShippingZone, PromotionEntity } from '../core/schemas/entities';
import { ProductManagement } from './ProductManagement';
import { ShippingZones } from './ShippingZones';
import { PromotionsEngine } from './PromotionsEngine';
import { VendorApiAccess } from './VendorApiAccess';
import { VendorFulfillment } from './VendorFulfillment';
import { VendorDashboard } from './VendorDashboard';
import { PackageIcon } from './icons/PackageIcon';
import { TruckIcon } from './icons/TruckIcon';
import { PercentIcon } from './icons/PercentIcon';
import { DatabaseIcon } from './icons/DatabaseIcon';
import { BoxIcon } from './icons/BoxIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { UploadCloudIcon } from './icons/UploadCloudIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

type VendorTab = 'dashboard' | 'products' | 'orders' | 'shipping' | 'promotions' | 'api';

export const VendorPortal: React.FC = () => {
    const [isVerified, setIsVerified] = useState(false);
    const [insuranceFile, setInsuranceFile] = useState<File | null>(null);
    const [agreedToIndemnity, setAgreedToIndemnity] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<VendorTab>('dashboard');

    const [products, setProducts] = useState<ProductEntity[]>([]);
    const [shippingZones, setShippingZones] = useState<ShippingZone[]>([]);
    const [promotions, setPromotions] = useState<PromotionEntity[]>([]);

    const canProceed = insuranceFile !== null && agreedToIndemnity;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setInsuranceFile(e.target.files[0]);
        }
    };

    const handleProceed = async () => {
        setIsLoading(true);
        // Simulate verification delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log(`[VendorPortal] Uploading insurance doc: ${insuranceFile?.name}`);
        
        await refreshData();

        setIsVerified(true);
        setIsLoading(false);
    };

    const refreshData = async () => {
        const [productsData, zonesData, promosData] = await Promise.all([
            api.listVendorProducts(),
            api.listShippingZones(),
            api.listPromotions(),
        ]);
        setProducts(productsData);
        setShippingZones(zonesData);
        setPromotions(promosData);
    };

    const handleZoneUpdate = async (zoneId: string, newStatus: boolean) => {
        const updatedZone = await api.updateShippingZone(zoneId, newStatus);
        setShippingZones(prev => prev.map(z => z.id === zoneId ? updatedZone : z));
    };

    const handleCreatePromotion = async (promo: Omit<PromotionEntity, 'id'>) => {
        await api.createPromotion(promo);
        const updatedPromos = await api.listPromotions();
        setPromotions(updatedPromos);
    };


    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <VendorDashboard products={products} />;
            case 'orders':
                return <VendorFulfillment />;
            case 'products':
                return <ProductManagement products={products} onRefresh={refreshData} />;
            case 'shipping':
                return <ShippingZones zones={shippingZones} onZoneUpdate={handleZoneUpdate} />;
            case 'promotions':
                return <PromotionsEngine promotions={promotions} onCreatePromotion={handleCreatePromotion} />;
            case 'api':
                return <VendorApiAccess />;
            default:
                return null;
        }
    };


    if (!isVerified) {
        return (
            <div className="p-4 flex flex-col h-full items-center justify-center text-center animate-fade-in">
                <div className="p-4 bg-slate-800/50 rounded-full mb-6 shadow-glow-violet">
                    <LockIcon className="w-12 h-12 text-slate-400" />
                </div>
                <h3 className="font-bold text-white text-2xl mb-2">KYB Verification</h3>
                <p className="text-sm text-slate-400 mt-1 max-w-xs leading-relaxed">
                    To activate your store on the decentralized network, proof of Liability Insurance is mandatory.
                </p>
                
                <div className="my-8 space-y-4 text-left max-w-xs w-full">
                    
                    {/* File Upload */}
                    <div className="relative group">
                        <div className={`p-6 rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center text-center ${insuranceFile ? 'border-eco-green/50 bg-eco-green/10' : 'border-white/10 bg-slate-900/50 hover:border-ai-violet/50 hover:bg-slate-800'}`}>
                             <input 
                                type="file" 
                                accept=".pdf,.jpg,.png" 
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            {insuranceFile ? (
                                <div className="animate-scale-in">
                                    <CheckCircleIcon className="w-10 h-10 text-eco-green mb-2 mx-auto" />
                                    <span className="text-sm text-white font-bold truncate max-w-[200px] block">{insuranceFile.name}</span>
                                    <span className="text-[10px] text-eco-green mt-1 uppercase font-bold tracking-wider">Ready for Upload</span>
                                </div>
                            ) : (
                                <>
                                    <UploadCloudIcon className="w-10 h-10 text-slate-500 mb-3 group-hover:text-ai-violet transition-colors" />
                                    <span className="text-sm text-slate-300 font-semibold">Upload Liability Doc</span>
                                    <span className="text-[10px] text-slate-500 mt-1">PDF or IMG (Max 10MB)</span>
                                </>
                            )}
                        </div>
                    </div>

                    <label className="flex items-start p-3 rounded-xl cursor-pointer transition-colors group hover:bg-white/5">
                        <input type="checkbox" checked={agreedToIndemnity} onChange={() => setAgreedToIndemnity(!agreedToIndemnity)} className="mt-1 w-5 h-5 text-ai-violet bg-slate-800 border-slate-600 rounded focus:ring-ai-violet" />
                        <span className="ml-3 text-xs text-slate-400 group-hover:text-slate-300">I agree to the <span className="font-bold text-white">Vendor Indemnification Clause</span> and accept responsibility for product safety.</span>
                    </label>
                </div>

                <button
                    onClick={handleProceed}
                    disabled={!canProceed || isLoading}
                    className="w-full max-w-xs px-6 py-4 bg-gradient-to-r from-eco-green to-emerald-600 border border-emerald-500/50 rounded-full text-lg font-bold text-white shadow-lg shadow-emerald-900/20 hover:shadow-emerald-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                >
                    {isLoading ? 'Verifying Identity...' : 'Activate Vendor Hub'}
                </button>
            </div>
        );
    }


    return (
        <div className="flex flex-col h-full animate-fade-in">
            {/* Navigation */}
            <div className="flex-shrink-0 flex items-center justify-start gap-2 p-1 bg-slate-900/50 rounded-full mb-2 overflow-x-auto no-scrollbar px-2 mx-2 mt-2 border border-white/5">
                 <button onClick={() => setActiveTab('dashboard')} className={`flex-shrink-0 flex items-center space-x-2 px-3 py-2 rounded-full font-semibold text-xs transition-all duration-300 whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-ai-violet text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                    <ChartBarIcon className="w-4 h-4" /> <span>Overview</span>
                </button>
                <button onClick={() => setActiveTab('orders')} className={`flex-shrink-0 flex items-center space-x-2 px-3 py-2 rounded-full font-semibold text-xs transition-all duration-300 whitespace-nowrap ${activeTab === 'orders' ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                    <BoxIcon className="w-4 h-4" /> <span>Orders</span>
                </button>
                <button onClick={() => setActiveTab('products')} className={`flex-shrink-0 flex items-center space-x-2 px-3 py-2 rounded-full font-semibold text-xs transition-all duration-300 whitespace-nowrap ${activeTab === 'products' ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                    <PackageIcon className="w-4 h-4" /> <span>Products</span>
                </button>
                <button onClick={() => setActiveTab('shipping')} className={`flex-shrink-0 flex items-center space-x-2 px-3 py-2 rounded-full font-semibold text-xs transition-all duration-300 whitespace-nowrap ${activeTab === 'shipping' ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                    <TruckIcon className="w-4 h-4" /> <span>Shipping</span>
                </button>
                <button onClick={() => setActiveTab('promotions')} className={`flex-shrink-0 flex items-center space-x-2 px-3 py-2 rounded-full font-semibold text-xs transition-all duration-300 whitespace-nowrap ${activeTab === 'promotions' ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                    <PercentIcon className="w-4 h-4" /> <span>Promos</span>
                </button>
                 <button onClick={() => setActiveTab('api')} className={`flex-shrink-0 flex items-center space-x-2 px-3 py-2 rounded-full font-semibold text-xs transition-all duration-300 whitespace-nowrap ${activeTab === 'api' ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                    <DatabaseIcon className="w-4 h-4" /> <span>API</span>
                </button>
            </div>
            <div className="flex-grow overflow-y-auto">
                {renderContent()}
            </div>
        </div>
    );
};
