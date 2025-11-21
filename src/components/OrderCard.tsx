
import React, { useState } from 'react';
import { OrderEntity } from '../core/schemas/entities';
import { PiCoinIcon } from './icons/PiCoinIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { ArchiveIcon } from './icons/ArchiveIcon';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';
import { LoaderIcon } from './icons/LoaderIcon';

interface OrderCardProps {
    order: OrderEntity;
    onConfirmDelivery: (orderId: string) => void;
    onRequestReturn: (orderId: string) => void;
    onDisputeOrder: (orderId: string) => Promise<void>;
}

const statusColors: { [key in OrderEntity['status']]: string } = {
    Processing: 'bg-pi-gold/20 text-pi-gold',
    Shipped: 'bg-ai-violet/20 text-ai-violet',
    Delivered: 'bg-eco-green/20 text-eco-green',
    'Return Requested': 'bg-orange-500/20 text-orange-400',
    Returned: 'bg-slate-500/20 text-slate-300',
    Refunded: 'bg-red-500/20 text-red-400',
    'In Dispute': 'bg-red-500 text-white',
    'Forwarded to Vendor': 'bg-indigo-500/20 text-indigo-400',
};

const timeAgo = (date: string): string => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return "just now";
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onConfirmDelivery, onRequestReturn, onDisputeOrder }) => {
    const [isDisputing, setIsDisputing] = useState(false);

    const handleDispute = async () => {
        setIsDisputing(true);
        await onDisputeOrder(order.id);
        setIsDisputing(false);
    };

    return (
        <div className="bg-slate-900/50 p-3 rounded-xl border border-white/10 relative">
            <div className="flex justify-between items-start">
                <div>
                    <h5 className="font-bold text-white text-sm">Order #{order.id.slice(-6)}</h5>
                    <p className="text-xs text-slate-400 mt-1">
                        {order.items.length} item{order.items.length > 1 ? 's' : ''} • {timeAgo(order.createdAt)}
                    </p>
                </div>
                <div className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>
                    {order.status}
                </div>
            </div>
            <div className="mt-2 pt-2 border-t border-white/10 flex justify-between items-center">
                <div className="flex items-center space-x-1.5">
                    <PiCoinIcon className="w-5 h-5 text-pi-gold" />
                    <span className="font-bold text-lg text-white">{order.total.toFixed(2)}</span>
                </div>
                <div className="flex items-center space-x-2">
                    {order.status === 'Shipped' && (
                        <button onClick={() => onConfirmDelivery(order.id)} className="flex items-center px-2.5 py-1 bg-eco-green/80 rounded-full text-xs font-semibold text-white hover:bg-eco-green transition-all">
                            <CheckCircleIcon className="w-4 h-4 mr-1" />
                            <span>Confirm Delivery</span>
                        </button>
                    )}
                    {order.status === 'Delivered' && (
                         <button onClick={() => onRequestReturn(order.id)} className="flex items-center px-2.5 py-1 bg-slate-700/50 rounded-full text-xs font-semibold text-slate-300 hover:bg-slate-600 transition-all">
                            <ArchiveIcon className="w-4 h-4 mr-1" />
                             <span>Request Return</span>
                        </button>
                    )}
                    {order.status === 'In Dispute' && (
                         <div className="flex items-center text-xs text-red-400 font-bold">
                            <AlertTriangleIcon className="w-4 h-4 mr-1" /> Escrow Frozen
                        </div>
                    )}
                    {/* Dispute Button available for active orders */}
                    {(order.status === 'Shipped' || order.status === 'Delivered') && !isDisputing && (
                        <button onClick={handleDispute} className="text-xs text-red-400 hover:text-red-300 underline ml-2 font-medium">
                            Dispute
                        </button>
                    )}
                    {isDisputing && (
                        <span className="flex items-center text-xs text-red-400 ml-2">
                            <LoaderIcon className="w-3 h-3 animate-spin mr-1" /> Freezing...
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};
