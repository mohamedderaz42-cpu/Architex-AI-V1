
import React, { useState, useEffect } from 'react';
import { OrderEntity } from '../core/schemas/entities';
import * as api from '../core/api/contract';
import { BoxIcon } from './icons/BoxIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { TruckIcon } from './icons/TruckIcon';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';

export const VendorFulfillment: React.FC = () => {
    const [orders, setOrders] = useState<OrderEntity[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchOrders = async () => {
        setIsLoading(true);
        const allOrders = await api.listOrders();
        // In a real app, filter by vendorId. For mock, we just show all for demo.
        setOrders(allOrders);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleAction = async (orderId: string, action: 'ship' | 'approve_return' | 'dispute_return') => {
        await api.processVendorOrderAction(orderId, action);
        await fetchOrders(); // Refresh list
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
                        <div key={order.id} className="bg-slate-900/50 p-4 rounded-xl border border-white/10">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h4 className="text-white font-bold text-sm">Order #{order.id.slice(-6)}</h4>
                                    <p className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                {getStatusBadge(order.status)}
                            </div>
                            
                            <div className="text-xs text-slate-300 mb-3">
                                <p>{order.items.length} Items • Total: <span className="font-mono text-white">{order.total.toFixed(2)} PiUSD</span></p>
                            </div>

                            <div className="border-t border-white/5 pt-2 flex justify-end space-x-2">
                                {order.status === 'Processing' && (
                                    <button 
                                        onClick={() => handleAction(order.id, 'ship')}
                                        className="flex items-center px-3 py-1.5 bg-ai-violet/20 text-ai-violet hover:bg-ai-violet hover:text-white rounded-lg text-xs font-bold transition-all"
                                    >
                                        <TruckIcon className="w-4 h-4 mr-1.5" /> Mark as Shipped
                                    </button>
                                )}
                                {order.status === 'Return Requested' && (
                                    <>
                                        <button 
                                            onClick={() => handleAction(order.id, 'approve_return')}
                                            className="flex items-center px-3 py-1.5 bg-slate-700/50 text-slate-300 hover:bg-slate-700 rounded-lg text-xs font-bold transition-all"
                                        >
                                            Approve Refund
                                        </button>
                                        <button 
                                            onClick={() => handleAction(order.id, 'dispute_return')}
                                            className="flex items-center px-3 py-1.5 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-lg text-xs font-bold transition-all"
                                        >
                                            Dispute
                                        </button>
                                    </>
                                )}
                                {order.status === 'In Dispute' && (
                                    <div className="text-[10px] text-red-400 font-mono flex items-center bg-red-900/10 px-2 py-1 rounded">
                                        Arbitration Protocol Active
                                    </div>
                                )}
                                {order.status === 'Delivered' && (
                                    <div className="text-[10px] text-eco-green font-mono flex items-center">
                                        <CheckCircleIcon className="w-3 h-3 mr-1"/> Funds Released
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
