
import React from 'react';
import { ProductEntity } from '../core/schemas/entities';
import { PiCoinIcon } from './icons/PiCoinIcon';
import { PlusIcon } from './icons/PlusIcon';
import { UserIcon } from './icons/UserIcon';

interface ShopProductCardProps {
    product: ProductEntity;
    onAddToCart: (product: ProductEntity) => void;
    onVendorClick: (vendorId: string) => void;
}

export const ShopProductCard: React.FC<ShopProductCardProps> = ({ product, onAddToCart, onVendorClick }) => {
    return (
        <div className="bg-slate-900/50 rounded-2xl border border-white/10 overflow-hidden group hover:border-ai-violet/50 transition-all duration-300">
            <div className="relative aspect-square overflow-hidden">
                <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                
                <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
                    {product.tags?.slice(0, 2).map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-white/10 backdrop-blur-md rounded-full text-[10px] text-white font-medium">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
            
            <div className="p-3">
                <h4 className="font-bold text-white text-sm line-clamp-1">{product.name}</h4>
                
                <button 
                    onClick={(e) => { e.stopPropagation(); onVendorClick(product.vendorId); }}
                    className="flex items-center text-[10px] text-slate-400 hover:text-ai-violet transition-colors mt-1"
                >
                    <UserIcon className="w-3 h-3 mr-1" />
                    <span>View Vendor</span>
                </button>

                <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center text-pi-gold font-bold">
                        <PiCoinIcon className="w-4 h-4 mr-1" />
                        <span>{product.price.toFixed(2)}</span>
                    </div>
                    <button 
                        onClick={() => onAddToCart(product)}
                        className="p-1.5 bg-ai-violet/20 text-ai-violet rounded-full hover:bg-ai-violet hover:text-white transition-colors"
                        title="Add to Cart"
                    >
                        <PlusIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};
