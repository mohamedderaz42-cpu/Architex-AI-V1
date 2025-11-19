
import React from 'react';
import { GlassPanel } from './GlassPanel';
import { ProductEntity } from '../core/schemas/entities';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';
import { PiCoinIcon } from './icons/PiCoinIcon';
import { XCircleIcon } from './icons/XCircleIcon';

interface ShoppingCartModalProps {
    cart: { product: ProductEntity; quantity: number }[];
    onRemove: (productId: string) => void;
    onCheckout: () => void;
    onClose: () => void;
}

export const ShoppingCartModal: React.FC<ShoppingCartModalProps> = ({ cart, onRemove, onCheckout, onClose }) => {
    const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    return (
        <div className="fixed inset-0 bg-brand-dark/80 backdrop-blur-md flex items-center justify-center z-[90] p-4">
            <GlassPanel className="w-full max-w-sm p-6 animate-fade-in flex flex-col max-h-[85vh]">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white text-2xl">&times;</button>
                
                <div className="text-center flex-shrink-0 mb-4">
                    <ShoppingCartIcon className="w-12 h-12 mx-auto text-eco-green mb-2" />
                    <h2 className="text-2xl font-bold text-white">Your Cart</h2>
                </div>

                <div className="flex-grow overflow-y-auto space-y-3 pr-2">
                    {cart.length === 0 ? (
                        <div className="text-center text-slate-500 py-8">
                            Your cart is empty.
                        </div>
                    ) : (
                        cart.map(({ product, quantity }) => (
                            <div key={product.id} className="flex items-center justify-between bg-slate-900/50 p-3 rounded-xl border border-white/10">
                                <div className="flex items-center space-x-3">
                                    <img src={product.imageUrl} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                                    <div>
                                        <h5 className="font-bold text-white text-sm line-clamp-1">{product.name}</h5>
                                        <div className="flex items-center text-xs text-slate-400 mt-1">
                                            <span className="bg-white/10 px-2 rounded-full text-white mr-2">x{quantity}</span>
                                            <PiCoinIcon className="w-3 h-3 mr-1 text-pi-gold" />
                                            <span>{(product.price * quantity).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => onRemove(product.id)} className="text-slate-500 hover:text-red-400 transition-colors">
                                    <XCircleIcon className="w-5 h-5" />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <div className="mt-4 pt-4 border-t border-white/10 flex-shrink-0">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-slate-300 font-semibold">Total</span>
                        <div className="flex items-center space-x-1">
                            <PiCoinIcon className="w-5 h-5 text-pi-gold" />
                            <span className="text-xl font-bold text-white">{total.toFixed(2)}</span>
                        </div>
                    </div>
                    <button
                        onClick={onCheckout}
                        disabled={cart.length === 0}
                        className="w-full flex items-center justify-center px-6 py-3 bg-eco-green/80 border border-eco-green/90 rounded-full text-lg font-semibold text-white backdrop-blur-md hover:bg-eco-green transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Checkout with Pi
                    </button>
                </div>
            </GlassPanel>
        </div>
    );
};
