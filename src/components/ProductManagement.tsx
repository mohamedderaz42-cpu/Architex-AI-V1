
import React, { useState } from 'react';
import { ProductEntity } from '../core/schemas/entities';
import { PiCoinIcon } from './icons/PiCoinIcon';
import { PlusIcon } from './icons/PlusIcon';
import { LeafIcon } from './icons/LeafIcon';
import { updateProductSustainability } from '../core/api/contract';
import { useToast } from './Toast';
import { GlassPanel } from './GlassPanel';
import { UploadCloudIcon } from './icons/UploadCloudIcon';
import { EditIcon } from './icons/EditIcon'; // We will create this

interface ProductManagementProps {
    products: ProductEntity[];
    onRefresh: () => void;
}

const ProductCard: React.FC<{ product: ProductEntity, onEdit: (p: ProductEntity) => void }> = ({ product, onEdit }) => {
    return (
        <div className="bg-slate-900/50 p-3 rounded-xl border border-white/10 flex items-center space-x-3 relative">
            <img src={product.imageUrl} alt={product.name} className="w-16 h-16 rounded-lg object-cover" />
            <div className="flex-grow">
                <h5 className="font-bold text-white flex items-center text-sm">
                    {product.name}
                    {product.isEcoFriendly && (
                        <span className="ml-2 text-eco-green" title="Eco-Friendly">
                            <LeafIcon className="w-3 h-3" />
                        </span>
                    )}
                </h5>
                <div className="text-xs text-slate-400 mt-1">
                    In Stock: <span className="font-semibold text-slate-200">{product.inStock.toLocaleString()}</span>
                </div>
                <div className="flex gap-1 mt-1 flex-wrap">
                    {product.tags?.slice(0, 2).map((tag, idx) => (
                        <span key={idx} className="text-[9px] bg-white/10 text-slate-300 px-1.5 py-0.5 rounded">{tag}</span>
                    ))}
                </div>
            </div>
            
            <div className="flex flex-col items-end space-y-2">
                <div className="flex items-center text-pi-gold font-bold">
                    <PiCoinIcon className="w-4 h-4 mr-1" />
                    <span>{product.price.toFixed(2)}</span>
                </div>
                <button 
                    onClick={() => onEdit(product)}
                    className="text-[10px] px-3 py-1.5 rounded bg-slate-700 hover:bg-ai-violet text-white transition-colors flex items-center"
                >
                    <EditIcon className="w-3 h-3 mr-1" /> Edit
                </button>
            </div>
        </div>
    );
};

export const ProductManagement: React.FC<ProductManagementProps> = ({ products, onRefresh }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Partial<ProductEntity>>({});
    const { addToast } = useToast();

    const handleEdit = (product: ProductEntity) => {
        setEditingProduct(product);
        setIsEditing(true);
    };

    const handleAddNew = () => {
        setEditingProduct({
            id: `new_${Date.now()}`,
            name: '',
            price: 0,
            inStock: 0,
            imageUrl: 'https://placehold.co/200',
            tags: [],
            isEcoFriendly: false
        });
        setIsEditing(true);
    };

    const handleSave = async () => {
        // Mock API call to save/update product
        // await api.saveProduct(editingProduct);
        setIsEditing(false);
        addToast(editingProduct.name ? "Product Saved Successfully" : "Product Created", "success");
        onRefresh();
    };

    return (
        <div className="p-2 h-full flex flex-col relative">
            <div className="space-y-3 overflow-y-auto flex-grow pr-2 pb-20">
                {products.map(p => <ProductCard key={p.id} product={p} onEdit={handleEdit} />)}
            </div>
            
            <div className="absolute bottom-4 right-4 left-4">
                 <button
                    onClick={handleAddNew}
                    className="group flex items-center justify-center w-full px-6 py-3 bg-ai-violet/90 border border-ai-violet rounded-full text-lg font-semibold text-white backdrop-blur-md shadow-glow-violet hover:bg-ai-violet transition-all duration-300"
                >
                    <PlusIcon className="w-6 h-6 mr-2" />
                    Add New Product
                </button>
            </div>

            {isEditing && (
                <div className="fixed inset-0 bg-brand-dark/90 backdrop-blur-md flex items-center justify-center z-[100] p-4">
                    <GlassPanel className="w-full max-w-md p-6 animate-fade-in max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold text-white mb-6">{editingProduct.name ? 'Edit Product' : 'New Product'}</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Product Name</label>
                                <input 
                                    type="text" 
                                    value={editingProduct.name} 
                                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-lg p-3 text-white focus:border-ai-violet outline-none"
                                />
                            </div>

                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-slate-400 mb-1">Price (PiUSD)</label>
                                    <input 
                                        type="number" 
                                        value={editingProduct.price} 
                                        onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                                        className="w-full bg-slate-900/50 border border-white/10 rounded-lg p-3 text-white focus:border-ai-violet outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-400 mb-1">Stock</label>
                                    <input 
                                        type="number" 
                                        value={editingProduct.inStock} 
                                        onChange={(e) => setEditingProduct({...editingProduct, inStock: parseInt(e.target.value)})}
                                        className="w-full bg-slate-900/50 border border-white/10 rounded-lg p-3 text-white focus:border-ai-violet outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Product Image</label>
                                <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-800/20 cursor-pointer hover:border-ai-violet/50 transition-colors">
                                    <UploadCloudIcon className="w-8 h-8 text-slate-500 mb-2" />
                                    <span className="text-xs text-slate-400">Click to upload or drag image</span>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 bg-slate-800/30 p-3 rounded-lg">
                                <input 
                                    type="checkbox" 
                                    checked={editingProduct.isEcoFriendly} 
                                    onChange={(e) => setEditingProduct({...editingProduct, isEcoFriendly: e.target.checked})}
                                    className="w-5 h-5 rounded border-slate-600 text-eco-green focus:ring-eco-green" 
                                />
                                <span className="text-sm text-white">Mark as Eco-Friendly</span>
                            </div>
                        </div>

                        <div className="flex space-x-3 mt-8">
                            <button 
                                onClick={() => setIsEditing(false)} 
                                className="flex-1 py-3 bg-slate-800 text-slate-300 rounded-lg font-bold hover:bg-slate-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSave} 
                                className="flex-1 py-3 bg-eco-green text-white rounded-lg font-bold hover:bg-green-600 transition-colors shadow-lg"
                            >
                                Save Changes
                            </button>
                        </div>
                    </GlassPanel>
                </div>
            )}
        </div>
    );
};
