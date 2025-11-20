
import React, { useState, useEffect } from 'react';
import { OrderEntity } from '../core/schemas/entities';
import * as api from '../core/api/contract';
import { BoxIcon } from './icons/BoxIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { TruckIcon } from './icons/TruckIcon';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';
import { GlassPanel } from './GlassPanel';
import { useToast } from './Toast';
import { EyeIcon } from './icons/EyeIcon'; // We will create this

export const VendorFulfillment: React.FC = () => {
    const [orders, setOrders] = useState<OrderEntity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<OrderEntity | null>(null);
    const [trackingNumber, setTrackingNumber] = useState('');
    const { addToast } = useToast();

    const fetchOrders = async () => {
        setIsLoading(true);
        const allOrders = await api.listOrders();
        setOrders(allOrders);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleViewDetails = (order: OrderEntity) => {
        setSelectedOrder(order);
        setTrackingNumber(''); // Reset
    };

    const handleShipOrder = async () => {
        if (!selectedOrder) return;
        if (!trackingNumber) {
            addToast("Please enter a tracking number.", "error");
            return;
        }
        await api.processVendorOrderAction(selectedOrder.id, 'ship');
        addToast(`Order ${selectedOrder.id.slice(-6)} marked as shipped!`, "success");
        setSelectedOrder(null);
        fetchOrders();
    };

    const handleQuickAction = async (orderId: string, action: 'approve_return' | 'dispute_return') => {
        await api.processVendorOrderAction(orderId, action);
        fetchOrders();
    };

    const getStatusBadge = (status: OrderEntity['status']) => {
        switch (status) {
            case 'Processing': return <span className="bg-pi-gold/20 text-pi-gold px-2 py-0.5 rounded text-xs font-bold">Processing</span>;
            case 'Shipped': return <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded text-xs font-bold">Shipped</span>;
            case 'Delivered': return <span className="bg-eco-green/20 text-eco-green px-2 py-0.5 rounded text-xs font-bold">Delivered</span>;
            case 'Return Requested': return <span className="bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded text-xs font-bold animate-pulse">Return Request</span>;
            case 'Returned': return <span className="bg-slate-500/20 text-slate-400 px-2 py-0.5 rounded text-xs font-bold">Returned</span>;
            case 'Refunded': return <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded text-xs font-bold">Refunded</span>;
            case 'In Dispute': return <span className="bg-red-500 text-white px-2 py-0.5 rounded text-xs font-bold flex items-center"><AlertTriangleIcon className="w-3 h-3 mr-1"/> Dispute</span>;
            default: return null;
        }
    };

    return (
        <div className="h-full flex flex-col p-2">
            <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="font-bold text-white text-lg flex items-center">
                    <BoxIcon className="w-5 h-5 mr-2 text-ai-violet" /> Fulfillment
                </h3>
                <button onClick={fetchOrders} className="text-xs text-slate-400 hover:text-white">Refresh</button>
            </div>

            <div className="flex-grow overflow-y-auto space-y-3 pr-2">
                {orders.length === 0 ? (
                    <div className="text-center text-slate-500 mt-10">No active orders.</div>
                ) : (
                    orders.map(order => (
                        <div key={order.id} className="bg-slate-900/50 p-4 rounded-xl border border-white/10 hover:border-white/20 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h4 className="text-white font-bold text-sm">Order #{order.id.slice(-6)}</h4>
                                    <p className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                {getStatusBadge(order.status)}
                            </div>
                            
                            <div className="text-xs text-slate-300 mb-3 flex justify-between items-center">
                                <p>{order.items.length} Items • Total: <span className="font-mono text-white">{order.total.toFixed(2)} PiUSD</span></p>
                            </div>

                            <div className="border-t border-white/5 pt-2 flex justify-end space-x-2">
                                <button 
                                    onClick={() => handleViewDetails(order)}
                                    className="flex items-center px-3 py-1.5 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-lg text-xs font-bold transition-all"
                                >
                                    <EyeIcon className="w-3 h-3 mr-1.5" /> Details
                                </button>
                                {order.status === 'Return Requested' && (
                                    <>
                                        <button 
                                            onClick={() => handleQuickAction(order.id, 'approve_return')}
                                            className="flex items-center px-3 py-1.5 bg-slate-700/50 text-slate-300 hover:bg-slate-700 rounded-lg text-xs font-bold transition-all"
                                        >
                                            Refund
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-brand-dark/90 backdrop-blur-md flex items-center justify-center z-[100] p-4">
                    <GlassPanel className="w-full max-w-md p-6 animate-fade-in flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-white">Order #{selectedOrder.id.slice(-6)}</h3>
                                <p className="text-sm text-slate-400">Placed on {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-white text-2xl">&times;</button>
                        </div>

                        <div className="flex-grow overflow-y-auto space-y-6">
                            {/* Shipping Info (Mocked) */}
                            <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5">
                                <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Shipping Address</h4>
                                <p className="text-sm text-white leading-relaxed">
                                    John Doe<br/>
                                    123 Blockchain Blvd, Suite 404<br/>
                                    San Francisco, CA 94107<br/>
                                    United States
                                </p>
                            </div>

                            {/* Items */}
                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Items</h4>
                                <div className="space-y-2">
                                    {selectedOrder.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center bg-black/20 p-3 rounded-lg">
                                            <span className="text-sm text-white">Product ID: {item.productId}</span>
                                            <span className="text-sm font-mono text-slate-400">x{item.quantity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            {selectedOrder.status === 'Processing' && (
                                <div className="bg-ai-violet/10 p-4 rounded-xl border border-ai-violet/30">
                                    <h4 className="text-sm font-bold text-ai-violet mb-3">Fulfillment</h4>
                                    <label className="block text-xs text-slate-400 mb-1">Tracking Number</label>
                                    <div className="flex space-x-2">
                                        <input 
                                            type="text" 
                                            value={trackingNumber}
                                            onChange={(e) => setTrackingNumber(e.target.value)}
                                            placeholder="Enter carrier tracking #"
                                            className="flex-grow bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-ai-violet outline-none"
                                        />
                                        <button 
                                            onClick={handleShipOrder}
                                            className="bg-ai-violet hover:bg-ai-violet/80 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                                        >
                                            Ship
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </GlassPanel>
                </div>
            )}
        </div>
    );
};
