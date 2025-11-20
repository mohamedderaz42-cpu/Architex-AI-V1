
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

    const canProceed = insuranceFile && agreedToIndemnity;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setInsuranceFile(e.target.files[0]);
        }
    };

    const handleProceed = async () => {
        setIsLoading(true);
        // In a real app, you would upload the file here
        console.log("Vendor verification: File uploaded and indemnity agreed.");
        
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
            <div className="p-4 flex flex-col h-full items-center justify-center text-center">
                <LockIcon className="w-16 h-16 text-slate-500 mb-4" />
                <h3 className="font-semibold text-white text-xl">Vendor Verification Required</h3>
                <p className="text-sm text-slate-400 mt-2 max-w-sm">
                    To ensure marketplace integrity, please complete the following mandatory verification steps.
                </p>
                
                <div className="my-6 space-y-4 text-left max-w-sm w-full">
                    
                    {/* File Upload */}
                    <div className="relative group">
                        <div className={`p-4 bg-slate-900/50 rounded-xl border border-dashed transition-colors flex flex-col items-center justify-center text-center ${insuranceFile ? 'border-eco-green/50 bg-eco-green/5' : 'border-white/10 hover:border-ai-violet/50'}`}>
                             <input 
                                type="file" 
                                accept=".pdf,.jpg,.png" 
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            {insuranceFile ? (
                                <>
                                    <CheckCircleIcon className="w-8 h-8 text-eco-green mb-2" />
                                    <span className="text-sm text-white font-medium truncate max-w-xs">{insuranceFile.name}</span>
                                    <span className="text-[10px] text-eco-green mt-1">Ready for verification</span>
                                </>
                            ) : (
                                <>
                                    <UploadCloudIcon className="w-8 h-8 text-slate-500 mb-2 group-hover:text-ai-violet transition-colors" />
                                    <span className="text-sm text-slate-300">Upload Liability Insurance</span>
                                    <span className="text-[10px] text-slate-500 mt-1">PDF, JPG or PNG (Max 5MB)</span>
                                </>
                            )}
                        </div>
                    </div>

                    <label className="flex items-start p-3 bg-slate-900/50 rounded-lg border border-white/10 cursor-pointer hover:bg-slate-900 transition-colors">
                        <input type="checkbox" checked={agreedToIndemnity} onChange={() => setAgreedToIndemnity(!agreedToIndemnity)} className="mt-1 w-5 h-5 text-ai-violet bg-slate-700 border-slate-500 rounded focus:ring-ai-violet" />
                        <span className="ml-3 text-sm text-slate-300">I have read and agree to the Architex <span className="font-bold text-white">Indemnification Clause</span> & Vendor Terms.</span>
                    </label>
                </div>

                <button
                    onClick={handleProceed}
                    disabled={!canProceed}
                    className="w-full max-w-sm px-6 py-3 bg-eco-green/80 border border-eco-green/90 rounded-full text-lg font-semibold text-white backdrop-blur-md hover:bg-eco-green transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Proceed to Vendor Hub
                </button>
            </div>
        );
    }


    return (
        <div className="flex flex-col h-full">
            {/* Navigation */}
            <div className="flex-shrink-0 flex items-center justify-start gap-2 p-1 bg-slate-900/50 rounded-full mb-2 overflow-x-auto no-scrollbar px-2">
                 <button onClick={() => setActiveTab('dashboard')} className={`flex-shrink-0 flex items-center space-x-2 px-3 py-1.5 rounded-full font-semibold text-xs transition-colors duration-300 whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-ai-violet text-white' : 'text-slate-400'}`}>
                    <ChartBarIcon className="w-4 h-4" /> <span>Overview</span>
                </button>
                <button onClick={() => setActiveTab('orders')} className={`flex-shrink-0 flex items-center space-x-2 px-3 py-1.5 rounded-full font-semibold text-xs transition-colors duration-300 whitespace-nowrap ${activeTab === 'orders' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}>
                    <BoxIcon className="w-4 h-4" /> <span>Orders</span>
                </button>
                <button onClick={() => setActiveTab('products')} className={`flex-shrink-0 flex items-center space-x-2 px-3 py-1.5 rounded-full font-semibold text-xs transition-colors duration-300 whitespace-nowrap ${activeTab === 'products' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}>
                    <PackageIcon className="w-4 h-4" /> <span>Products</span>
                </button>
                <button onClick={() => setActiveTab('shipping')} className={`flex-shrink-0 flex items-center space-x-2 px-3 py-1.5 rounded-full font-semibold text-xs transition-colors duration-300 whitespace-nowrap ${activeTab === 'shipping' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}>
                    <TruckIcon className="w-4 h-4" /> <span>Shipping</span>
                </button>
                <button onClick={() => setActiveTab('promotions')} className={`flex-shrink-0 flex items-center space-x-2 px-3 py-1.5 rounded-full font-semibold text-xs transition-colors duration-300 whitespace-nowrap ${activeTab === 'promotions' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}>
                    <PercentIcon className="w-4 h-4" /> <span>Promos</span>
                </button>
                 <button onClick={() => setActiveTab('api')} className={`flex-shrink-0 flex items-center space-x-2 px-3 py-1.5 rounded-full font-semibold text-xs transition-colors duration-300 whitespace-nowrap ${activeTab === 'api' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}>
                    <DatabaseIcon className="w-4 h-4" /> <span>API</span>
                </button>
            </div>
            <div className="flex-grow overflow-y-auto">
                {renderContent()}
            </div>
        </div>
    );
};
