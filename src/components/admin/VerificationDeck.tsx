
import React, { useState, useEffect } from 'react';
import { VendorProfile } from '../../core/schemas/entities';
import * as api from '../../core/api/contract';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';
import { XCircleIcon } from '../icons/XCircleIcon';
import { DocumentIcon } from '../icons/DocumentIcon';
import { useToast } from '../Toast';

export const VerificationDeck: React.FC = () => {
    const [vendors, setVendors] = useState<VendorProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { addToast } = useToast();

    const fetchQueue = async () => {
        setIsLoading(true);
        const data = await api.listPendingVendors();
        setVendors(data);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchQueue();
    }, []);

    const handleApprove = async (id: string) => {
        await api.approveVendor(id);
        addToast("Vendor Approved & On-boarded", "success");
        setVendors(prev => prev.filter(v => (v as any).id !== id));
    };

    const handleReject = async (id: string) => {
        await api.rejectVendor(id, "Policy Violation");
        addToast("Vendor Rejected", "error");
        setVendors(prev => prev.filter(v => (v as any).id !== id));
    };

    if (isLoading) return <div className="text-center p-10 text-slate-500">Loading queue...</div>;

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white">Vendor Verification Queue</h3>
                <span className="text-xs text-slate-400">{vendors.length} Pending</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto pr-2">
                {vendors.length === 0 && <div className="col-span-2 text-center text-slate-500 py-10">No pending applications.</div>}
                {vendors.map((vendor: any) => (
                    <div key={vendor.id} className="bg-slate-900/50 border border-white/10 rounded-xl p-4 flex flex-col">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h4 className="font-bold text-white">{vendor.companyName}</h4>
                                <p className="text-xs text-slate-400 font-mono">{vendor.taxId}</p>
                            </div>
                            <span className="bg-yellow-500/20 text-yellow-500 text-[10px] px-2 py-0.5 rounded uppercase font-bold">Pending</span>
                        </div>

                        <div className="flex items-center space-x-4 mb-4 text-xs text-slate-300">
                            <a href="#" className="flex items-center hover:text-ai-violet">
                                <DocumentIcon className="w-4 h-4 mr-1" /> License
                            </a>
                            <a href="#" className="flex items-center hover:text-ai-violet">
                                <DocumentIcon className="w-4 h-4 mr-1" /> Insurance
                            </a>
                        </div>

                        <div className="mt-auto flex space-x-2">
                            <button 
                                onClick={() => handleReject(vendor.id)}
                                className="flex-1 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-bold flex items-center justify-center transition-colors"
                            >
                                <XCircleIcon className="w-4 h-4 mr-1" /> Reject
                            </button>
                            <button 
                                onClick={() => handleApprove(vendor.id)}
                                className="flex-1 py-2 bg-eco-green/10 hover:bg-eco-green/20 text-eco-green rounded-lg text-xs font-bold flex items-center justify-center transition-colors"
                            >
                                <CheckCircleIcon className="w-4 h-4 mr-1" /> Approve
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
