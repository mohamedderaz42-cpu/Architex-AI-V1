
import React, { useState, useMemo } from 'react';
import { ProductEntity } from '../core/schemas/entities';
import { ShopProductCard } from './ShopProductCard';
import { SearchIcon } from './icons/SearchIcon';
import { FilterIcon } from './icons/FilterIcon';
import { Skeleton } from './Skeleton';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';
import { PiAdPlaceholder } from './PiAdPlaceholder';

interface MarketplaceShopProps {
    products: ProductEntity[];
    cartCount: number;
    onAddToCart: (product: ProductEntity) => void;
    onOpenCart: () => void;
    onVendorClick: (vendorId: string) => void;
}

const FILTERS = ['All', 'Eco-Friendly', 'Structural', 'Insulation', 'Decor', 'Smart Home'];

export const MarketplaceShop: React.FC<MarketplaceShopProps> = ({ products, cartCount, onAddToCart, onOpenCart, onVendorClick }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    // Simulate loading state for skeleton demonstration
    const [isLoading, setIsLoading] = useState(false);
    
    React.useEffect(() => {
        if(products.length === 0) {
            setIsLoading(true);
            // Fallback if data is empty or fetching
            const timer = setTimeout(() => setIsLoading(false), 2000);
            return () => clearTimeout(timer);
        } else {
            setIsLoading(false);
        }
    }, [products]);

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFilter = activeFilter === 'All' || p.tags?.some(t => t.toLowerCase().includes(activeFilter.toLowerCase().split(' ')[0]));
            return matchesSearch && matchesFilter;
        });
    }, [products, searchQuery, activeFilter]);

    return (
        <div className="flex flex-col h-full">
            {/* Search & Filter Header */}
            <div className="flex-shrink-0 px-2 mb-4 space-y-3">
                <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search materials..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-900/80 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-ai-violet/50 transition-all"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                         <button onClick={onOpenCart} className="relative p-2 hover:bg-white/10 rounded-full transition-colors">
                             <ShoppingCartIcon className="w-6 h-6 text-slate-400 hover:text-white" />
                             {cartCount > 0 && (
                                 <span className="absolute top-0 right-0 w-4 h-4 bg-eco-green text-[10px] font-bold text-white rounded-full flex items-center justify-center">
                                     {cartCount}
                                 </span>
                             )}
                         </button>
                    </div>
                </div>

                <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                    <div className="flex-shrink-0 w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 border border-white/5">
                        <FilterIcon className="w-4 h-4" />
                    </div>
                    {FILTERS.map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                                activeFilter === filter 
                                ? 'bg-white text-brand-dark border-white' 
                                : 'bg-transparent text-slate-400 border-slate-700 hover:border-slate-500'
                            }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {/* Product Grid */}
            <div className="flex-grow overflow-y-auto px-2 pb-2 space-y-4">
                <PiAdPlaceholder />

                {isLoading ? (
                    <div className="grid grid-cols-2 gap-3">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="bg-slate-900/30 rounded-2xl border border-white/5 overflow-hidden h-48 flex flex-col">
                                <Skeleton className="h-32 w-full" />
                                <div className="p-3 space-y-2">
                                    <Skeleton className="h-4 w-3/4" />
                                    <div className="flex justify-between">
                                        <Skeleton className="h-4 w-1/3" />
                                        <Skeleton className="h-6 w-6 rounded-full" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                        {filteredProducts.map(product => (
                            <ShopProductCard 
                                key={product.id} 
                                product={product} 
                                onAddToCart={onAddToCart} 
                                onVendorClick={onVendorClick}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                        <SearchIcon className="w-12 h-12 mb-2 opacity-20" />
                        <p>No products found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
