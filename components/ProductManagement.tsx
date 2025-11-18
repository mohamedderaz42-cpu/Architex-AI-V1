import React from 'react';
import { ProductEntity } from '../core/schemas/entities';
import { PiCoinIcon } from './icons/PiCoinIcon';
import { PlusIcon } from './icons/PlusIcon';

interface ProductManagementProps {
    products: ProductEntity[];
}

const ProductCard: React.FC<{ product: ProductEntity }> = ({ product }) => (
    <div className="bg-slate-900/50 p-3 rounded-xl border border-white/10 flex items-center space-x-3">
        <img src={product.imageUrl} alt={product.name} className="w-16 h-16 rounded-lg object-cover" />
        <div className="flex-grow">
            <h5 className="font-bold text-white">{product.name}</h5>
            <div className="text-xs text-slate-400 mt-1">
                In Stock: <span className="font-semibold text-slate-200">{product.inStock.toLocaleString()}</span> units
            </div>
        </div>
        <div className="flex items-center text-pi-gold font-bold">
            <PiCoinIcon className="w-4 h-4 mr-1" />
            <span>{product.price.toFixed(2)}</span>
        </div>
    </div>
);

export const ProductManagement: React.FC<ProductManagementProps> = ({ products }) => {
    return (
        <div className="p-2 h-full flex flex-col">
            <div className="space-y-3 overflow-y-auto flex-grow pr-2">
                {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
            <button
                className="group mt-4 flex-shrink-0 flex items-center justify-center w-full px-6 py-3 bg-ai-violet/80 border border-ai-violet/90 rounded-full text-lg font-semibold text-white backdrop-blur-md hover:bg-ai-violet transition-all duration-300"
            >
                <PlusIcon className="w-6 h-6 mr-2" />
                Add New Product
            </button>
        </div>
    );
};