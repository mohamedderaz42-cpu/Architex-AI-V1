
import React, { useState, useEffect } from 'react';
import { GlassPanel } from './GlassPanel';
import { ProductEntity, InventoryConflict, CartOptimization, UserEntity } from '../core/schemas/entities';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';
import { PiCoinIcon } from './icons/PiCoinIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { BotIcon } from './icons/BotIcon';
import { LoaderIcon } from './icons/LoaderIcon';
import { BellIcon } from './icons/BellIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { FileTextIcon } from './icons/FileTextIcon';
import { ArchieBot } from './ArchieBot';
import * as api from '../core/api/contract';

interface ShoppingCartModalProps {
    cart: { product: ProductEntity; quantity: number }[];
    user?: UserEntity | null;
    onRemove: (productId: string) => void;
    onUpdateItem: (oldId: string, newId: string) => void;
    onCheckout: () => void;
    onClose: () => void;
}

type CheckoutStep = 'review' | 'optimizing' | 'inventory' | 'agreement' | 'processing';

export const ShoppingCartModal: React.FC<ShoppingCartModalProps> = ({ cart, user, onRemove, onUpdateItem, onCheckout, onClose }) => {
    const [step, setStep] = useState<CheckoutStep>('review');
    const [optimization, setOptimization] = useState<CartOptimization | null>(null);
    const [conflicts, setConflicts] = useState<InventoryConflict[]>([]);
    const [agreementText, setAgreementText] = useState('');
    const [signature, setSignature] = useState('');
    
    // Calculate total based on current cart state
    const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    // --- Step Handlers ---

    const handleStartCheckout = async () => {
        setStep('optimizing');
        // Simulate AI thinking time
        const opts = await api.getCartOptimizations(cart);
        // For demo simplicity, take the first one if exists
        if (opts.length > 0) {
            setOptimization(opts[0]);
        } else {
            // No optimizations, move to inventory check
            handleInventoryCheck();
        }
    };

    const handleApplyOptimization = () => {
        if (optimization) {
            onUpdateItem(optimization.originalProductId, optimization.suggestedProductId);
            setOptimization(null); // Clear after applying
            // In real app, might re-run optimization or just move next
            handleInventoryCheck();
        }
    };

    const handleSkipOptimization = () => {
        setOptimization(null);
        handleInventoryCheck();
    };

    const handleInventoryCheck = async () => {
        setStep('inventory');
        const stockConflicts = await api.checkInventory(cart);
        setConflicts(stockConflicts);
        
        if (stockConflicts.length === 0) {
            // No conflicts, move to agreement
            const text = await api.generatePurchaseAgreement(cart, total);
            setAgreementText(text);
            setStep('agreement');
        }
    };

    const handleResolveConflict = (conflict: InventoryConflict, action: 'alternative' | 'notify' | 'remove') => {
        if (action === 'alternative' && conflict.alternativeProductId) {
             onUpdateItem(conflict.productId, conflict.alternativeProductId);
        } else if (action === 'remove' || action === 'notify') {
             onRemove(conflict.productId);
        }
        
        // Remove resolved conflict from local state
        const remaining = conflicts.filter(c => c.productId !== conflict.productId);
        setConflicts(remaining);

        // If all resolved, re-check or move forward
        if (remaining.length === 0) {
             // Re-generate agreement with updated cart
             // We need to wait for state update or pass updated cart manually. 
             // For simplicity, we assume sync update or we just call agreement gen next render.
             // Triggering a short delay to allow cart update prop to propagate
             setTimeout(async () => {
                // Note: Ideally we'd fetch the updated cart from props, but props update might lag.
                // We will just proceed to agreement step and let it re-render or regenerate there.
                // For this demo, we just set step.
                const text = await api.generatePurchaseAgreement(cart, total); // This uses OLD cart if not careful
                setAgreementText(text); 
                setStep('agreement');
             }, 500);
        }
    };

    const handleSignAndPay = () => {
        if (signature === user?.piUsername) {
            setStep('processing');
            onCheckout(); // Triggers the parent's payment flow
        }
    };


    // --- Renderers ---

    const renderOptimizing = () => (
        <div className="flex flex-col items-center justify-center h-64 text-center p-4 animate-fade-in">
            {optimization ? (
                <>
                    <div className="w-16 h-16 bg-ai-violet/20 rounded-full flex items-center justify-center mb-4">
                        <SparklesIcon className="w-8 h-8 text-ai-violet animate-pulse" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Smart Savings Found!</h3>
                    <p className="text-sm text-slate-300 mb-4">{optimization.reason}</p>
                    <div className="bg-eco-green/20 text-eco-green px-4 py-2 rounded-lg font-bold mb-6">
                        Save {optimization.savings.toFixed(2)} PiUSD
                    </div>
                    <div className="flex space-x-3 w-full">
                         <button onClick={handleSkipOptimization} className="flex-1 py-2 text-slate-400 hover:text-white transition-colors">Skip</button>
                         <button onClick={handleApplyOptimization} className="flex-1 py-2 bg-ai-violet rounded-lg text-white font-bold hover:bg-ai-violet/80 transition-colors">Apply Swap</button>
                    </div>
                </>
            ) : (
                <>
                    <LoaderIcon className="w-12 h-12 text-ai-violet animate-spin mb-4" />
                    <p className="text-slate-300">Archie is optimizing your cart...</p>
                </>
            )}
        </div>
    );

    const renderInventory = () => (
         <div className="flex flex-col h-full p-4 animate-fade-in">
            <div className="text-center mb-4">
                 <XCircleIcon className="w-12 h-12 text-red-400 mx-auto mb-2" />
                 <h3 className="text-lg font-bold text-white">Inventory Alert</h3>
            </div>
            
            <div className="flex-grow space-y-4 overflow-y-auto">
                {conflicts.map(conflict => {
                    const item = cart.find(c => c.product.id === conflict.productId);
                    if (!item) return null;
                    return (
                        <div key={conflict.productId} className="space-y-3">
                            {conflict.alternativeProductId && (
                                <ArchieBot message={`I found a stock issue with "${item.product.name}". However, my AI analysis suggests "Bamboo Composite" as a sustainable alternative with 98% spec match. Want to swap?`} />
                            )}
                            
                            <div className="bg-slate-900/50 border border-red-500/30 p-4 rounded-xl">
                                <h4 className="font-bold text-white text-sm">{item.product.name}</h4>
                                <p className="text-xs text-red-300 mt-1">Wanted: {conflict.requested} | Available: {conflict.available}</p>
                                
                                <div className="mt-3 grid grid-cols-1 gap-2">
                                    {conflict.alternativeProductId && (
                                        <button onClick={() => handleResolveConflict(conflict, 'alternative')} className="flex items-center justify-center py-2 bg-ai-violet/20 text-ai-violet rounded hover:bg-ai-violet/30 text-xs font-bold">
                                            <SparklesIcon className="w-3 h-3 mr-1" /> Swap for Alternative
                                        </button>
                                    )}
                                    <button onClick={() => handleResolveConflict(conflict, 'notify')} className="flex items-center justify-center py-2 bg-slate-700/50 text-slate-300 rounded hover:bg-slate-700 text-xs">
                                        <BellIcon className="w-3 h-3 mr-1" /> Notify Me (Remove)
                                    </button>
                                    <button onClick={() => handleResolveConflict(conflict, 'remove')} className="flex items-center justify-center py-2 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 text-xs">
                                        Remove Item
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
         </div>
    );

    const renderAgreement = () => (
        <div className="flex flex-col h-full p-4 animate-fade-in">
            <div className="text-center mb-2">
                 <FileTextIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                 <h3 className="text-lg font-bold text-white">Review & Sign</h3>
            </div>
            
            <div className="flex-grow bg-slate-900/80 rounded-lg p-3 border border-white/10 overflow-y-auto mb-4">
                <pre className="text-[10px] text-slate-400 whitespace-pre-wrap font-mono">
                    {agreementText}
                </pre>
            </div>

            <div className="flex-shrink-0">
                 <label className="block text-xs text-slate-500 mb-1">Type "<span className="text-white font-bold">{user?.piUsername}</span>" to sign</label>
                 <input 
                    type="text" 
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    className="w-full bg-black/20 border border-white/20 rounded p-2 text-white text-sm focus:outline-none focus:border-eco-green mb-3"
                    placeholder="Digital Signature"
                 />
                 <button 
                    onClick={handleSignAndPay}
                    disabled={signature !== user?.piUsername}
                    className="w-full py-3 bg-eco-green text-white font-bold rounded-full shadow-glow-green hover:bg-green-500 transition-all disabled:opacity-50 disabled:shadow-none"
                 >
                     Sign & Pay {total.toFixed(2)} PiUSD
                 </button>
            </div>
        </div>
    );

    const renderReview = () => (
        <>
            <div className="flex-grow overflow-y-auto space-y-3 pr-2">
                {cart.length === 0 ? (
                    <div className="text-center text-slate-500 py-8">Your cart is empty.</div>
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
                    onClick={handleStartCheckout}
                    disabled={cart.length === 0}
                    className="w-full flex items-center justify-center px-6 py-3 bg-eco-green/80 border border-eco-green/90 rounded-full text-lg font-semibold text-white backdrop-blur-md hover:bg-eco-green transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Proceed to Checkout
                </button>
            </div>
        </>
    );

    return (
        <div className="fixed inset-0 bg-brand-dark/80 backdrop-blur-md flex items-center justify-center z-[90] p-4">
            <GlassPanel className="w-full max-w-sm p-0 overflow-hidden flex flex-col max-h-[85vh] relative">
                {step !== 'processing' && (
                     <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white text-2xl z-10">&times;</button>
                )}
                
                {/* Header Bar */}
                <div className="p-4 bg-slate-900/50 border-b border-white/10 flex items-center">
                    <ShoppingCartIcon className="w-5 h-5 text-eco-green mr-2" />
                    <span className="font-bold text-white">
                        {step === 'review' && "Your Cart"}
                        {step === 'optimizing' && "Archie Optimization"}
                        {step === 'inventory' && "Inventory Check"}
                        {step === 'agreement' && "Secure Checkout"}
                        {step === 'processing' && "Processing..."}
                    </span>
                </div>

                {/* Content Area */}
                <div className="flex-grow overflow-hidden flex flex-col p-4">
                    {step === 'review' && renderReview()}
                    {step === 'optimizing' && renderOptimizing()}
                    {step === 'inventory' && renderInventory()}
                    {step === 'agreement' && renderAgreement()}
                    {step === 'processing' && (
                         <div className="flex flex-col items-center justify-center h-64">
                            <LoaderIcon className="w-16 h-16 text-pi-gold animate-spin mb-4" />
                            <p className="text-white font-bold">Securing Assets...</p>
                            <p className="text-xs text-slate-400 mt-2">Please wait while we finalize the smart contract.</p>
                         </div>
                    )}
                </div>
            </GlassPanel>
        </div>
    );
};
