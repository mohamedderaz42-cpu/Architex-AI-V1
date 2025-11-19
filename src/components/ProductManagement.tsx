
import React, { useState } from 'react';
import { ProductEntity } from '../core/schemas/entities';
import { PiCoinIcon } from './icons/PiCoinIcon';
import { PlusIcon } from './icons/PlusIcon';
import { LeafIcon } from './icons/LeafIcon';
import { updateProductSustainability } from '../core/api/contract';
import { useToast } from './Toast';

interface ProductManagementProps {
    products: ProductEntity[];
}

const ProductCard: React.FC<{ product: ProductEntity, onUpdate: () => void }> = ({ product, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const { addToast } = useToast();

    const handleEcoToggle = async () => {
        // Mock simple toggle logic for demo
        const newStatus = !product.isEcoFriendly;
        await updateProductSustainability(product.id, newStatus, newStatus ? ['Self-Declared'] : []);
        addToast(`Product marked as ${newStatus ? 'Eco-Friendly' : 'Standard'}`, 'success');
        onUpdate(); // Trigger parent refresh if needed (mock)
    };

    return (
        <div className="bg-slate-900/50 p-3 rounded-xl border border-white/10 flex items-center space-x-3 relative">
            <img src={product.imageUrl} alt={product.name} className="w-16 h-16 rounded-lg object-cover" />
            <div className="flex-grow">
                <h5 className="font-bold text-white flex items-center">
                    {product.name}
                    {product.isEcoFriendly && (
                        <span className="ml-2 text-eco-green" title="Eco-Friendly">
                            <LeafIcon className="w-4 h-4" />
                        </span>
                    )}
                </h5>
                <div className="text-xs text-slate-400 mt-1">
                    In Stock: <span className="font-semibold text-slate-200">{product.inStock.toLocaleString()}</span>
                </div>
                <div className="flex gap-1 mt-1">
                    {product.sustainabilityCertifications?.map((cert, idx) => (
                        <span key={idx} className="text-[9px] bg-eco-green/20 text-eco-green px-1.5 rounded">{cert}</span>
                    ))}
                </div>
            </div>
            
            <div className="flex flex-col items-end space-y-2">
                <div className="flex items-center text-pi-gold font-bold">
                    <PiCoinIcon className="w-4 h-4 mr-1" />
                    <span>{product.price.toFixed(2)}</span>
                </div>
                <button 
                    onClick={handleEcoToggle}
                    className={`text-[10px] px-2 py-1 rounded border ${product.isEcoFriendly ? 'border-red-500 text-red-400' : 'border-eco-green text-eco-green'}`}
                >
                    {product.isEcoFriendly ? 'Remove Eco Tag' : 'Add Eco Tag'}
                </button>
            </div>
        </div>
    );
};

export const ProductManagement: React.FC<ProductManagementProps> = ({ products }) => {
    // Mock refresh mechanism
    const [, setTick] = useState(0);
    const handleUpdate = () => setTick(t => t + 1);

    return (
        <div className="p-2 h-full flex flex-col">
            <div className="space-y-3 overflow-y-auto flex-grow pr-2">
                {products.map(p => <ProductCard key={p.id} product={p} onUpdate={handleUpdate} />)}
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
