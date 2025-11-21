
import React, { useState, useEffect } from 'react';
import { ProductEntity, SustainabilityRating } from '../../core/schemas/entities';
import { MockAdapter } from '../../core/api/contract';
import { PlusIcon } from '../icons/PlusIcon';
import { EditIcon } from '../icons/EditIcon';
import { ArchiveIcon } from '../icons/ArchiveIcon';
import { LeafIcon } from '../icons/LeafIcon';
import { Model3dIcon } from '../icons/Model3dIcon';
import { GlassPanel } from '../GlassPanel';

export const InventoryManager: React.FC = () => {
    const [products, setProducts] = useState<ProductEntity[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<Partial<ProductEntity>>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        setIsLoading(true);
        const list = await MockAdapter.commerce.listProducts();
        setProducts(list);
        setIsLoading(false);
    };

    const handleEdit = (product?: ProductEntity) => {
        if (product) {
            setCurrentProduct({ ...product });
        } else {
            setCurrentProduct({
                id: '',
                vendorId: 'v1', // Mock current user
                name: '',
                sku: '',
                price: 0,
                inStock: 0,
                sustainabilityRating: 'B',
                modelUrl: '',
                imageUrl: 'https://placehold.co/200',
                tags: []
            });
        }
        setIsEditing(true);
    };

    const handleSave = async () => {
        if (!currentProduct.name || (currentProduct.price || 0) <= 0 || (currentProduct.inStock || 0) < 0) {
            alert("Invalid Input: Check Price (>0) and Stock (>=0)");
            return;
        }

        // Simulate Save
        if (currentProduct.id) {
            await MockAdapter.commerce.updateProduct(currentProduct as ProductEntity);
        } else {
            await MockAdapter.commerce.createProduct(currentProduct as ProductEntity);
        }
        
        setIsEditing(false);
        loadProducts();
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this product?")) {
            await MockAdapter.commerce.deleteProduct(id);
            loadProducts();
        }
    };

    const getRatingColor = (rating?: string) => {
        switch (rating) {
            case 'A': return 'text-eco-green border-eco-green';
            case 'B': return 'text-green-400 border-green-400';
            case 'C': return 'text-yellow-400 border-yellow-400';
            case 'D': return 'text-orange-400 border-orange-400';
            case 'E': return 'text-red-400 border-red-400';
            case 'F': return 'text-red-600 border-red-600';
            default: return 'text-slate-400 border-slate-400';
        }
    };

    if (isLoading) return <div className="text-center p-10 text-slate-500">Loading Inventory...</div>;

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-4 p-2">
                <h3 className="text-xl font-bold text-white">Inventory Manager</h3>
                <button 
                    onClick={() => handleEdit()}
                    className="flex items-center px-4 py-2 bg-ai-violet text-white rounded-lg font-bold hover:bg-ai-violet/80 transition-colors"
                >
                    <PlusIcon className="w-4 h-4 mr-2" /> Add Product
                </button>
            </div>

            <div className="flex-grow overflow-y-auto space-y-2 pr-2">
                {products.map(p => (
                    <div key={p.id} className="bg-slate-900/50 p-3 rounded-xl border border-white/10 flex items-center justify-between group hover:border-white/20 transition-all">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-black">
                                <img src={p.imageUrl} className="w-full h-full object-cover" alt={p.name} />
                            </div>
                            <div>
                                <div className="flex items-center">
                                    <h4 className="font-bold text-white text-sm mr-2">{p.name}</h4>
                                    <span className="text-[10px] bg-white/10 px-1.5 rounded text-slate-400 font-mono">{p.sku || 'NO-SKU'}</span>
                                </div>
                                <div className="flex items-center text-xs text-slate-400 mt-1 space-x-3">
                                    <span>Stock: <span className={p.inStock < 10 ? 'text-red-400' : 'text-white'}>{p.inStock}</span></span>
                                    <span>Price: <span className="text-pi-gold">{p.price} Pi</span></span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            {p.sustainabilityRating && (
                                <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold ${getRatingColor(p.sustainabilityRating)}`} title={`Sustainability: ${p.sustainabilityRating}`}>
                                    {p.sustainabilityRating}
                                </div>
                            )}
                            {p.modelUrl && (
                                <div className="text-ai-violet" title="3D Model Available"><Model3dIcon className="w-5 h-5" /></div>
                            )}
                            <div className="w-px h-8 bg-white/10 mx-2"></div>
                            <button onClick={() => handleEdit(p)} className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white">
                                <EditIcon className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(p.id)} className="p-2 hover:bg-red-500/20 rounded-full text-slate-400 hover:text-red-400">
                                <ArchiveIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {isEditing && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <GlassPanel className="w-full max-w-lg p-6 animate-fade-in">
                        <h3 className="text-lg font-bold text-white mb-4">{currentProduct.id ? 'Edit Product' : 'New Product'}</h3>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="col-span-2">
                                <label className="text-xs text-slate-400 block mb-1">Product Name</label>
                                <input 
                                    className="w-full bg-slate-800 border border-white/10 rounded p-2 text-white focus:border-ai-violet outline-none"
                                    value={currentProduct.name}
                                    onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 block mb-1">SKU</label>
                                <input 
                                    className="w-full bg-slate-800 border border-white/10 rounded p-2 text-white focus:border-ai-violet outline-none"
                                    value={currentProduct.sku || ''}
                                    onChange={e => setCurrentProduct({...currentProduct, sku: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 block mb-1">Price (PiUSD)</label>
                                <input 
                                    type="number"
                                    className="w-full bg-slate-800 border border-white/10 rounded p-2 text-white focus:border-ai-violet outline-none"
                                    value={currentProduct.price}
                                    onChange={e => setCurrentProduct({...currentProduct, price: parseFloat(e.target.value)})}
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 block mb-1">Stock Level</label>
                                <input 
                                    type="number"
                                    className="w-full bg-slate-800 border border-white/10 rounded p-2 text-white focus:border-ai-violet outline-none"
                                    value={currentProduct.inStock}
                                    onChange={e => setCurrentProduct({...currentProduct, inStock: parseInt(e.target.value)})}
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 block mb-1">Sustainability Rating</label>
                                <select 
                                    className="w-full bg-slate-800 border border-white/10 rounded p-2 text-white focus:border-ai-violet outline-none"
                                    value={currentProduct.sustainabilityRating || 'C'}
                                    onChange={e => setCurrentProduct({...currentProduct, sustainabilityRating: e.target.value as SustainabilityRating})}
                                >
                                    {['A','B','C','D','E','F'].map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>
                            <div className="col-span-2">
                                <label className="text-xs text-slate-400 block mb-1">3D Model URL (GLB/GLTF)</label>
                                <input 
                                    className="w-full bg-slate-800 border border-white/10 rounded p-2 text-white focus:border-ai-violet outline-none font-mono text-xs"
                                    value={currentProduct.modelUrl || ''}
                                    onChange={e => setCurrentProduct({...currentProduct, modelUrl: e.target.value})}
                                    placeholder="https://..."
                                />
                            </div>
                        </div>

                        <div className="flex space-x-3 mt-6">
                            <button onClick={() => setIsEditing(false)} className="flex-1 py-3 bg-slate-700 rounded hover:bg-slate-600 text-slate-300">Cancel</button>
                            <button onClick={handleSave} className="flex-1 py-3 bg-eco-green rounded hover:bg-green-600 text-white font-bold">Save Product</button>
                        </div>
                    </GlassPanel>
                </div>
            )}
        </div>
    );
};
