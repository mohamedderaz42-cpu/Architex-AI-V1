
import React, { useState, useEffect } from 'react';
import { ServiceOrderController } from '../core/services/ServiceOrderController';
import { OrderEntity } from '../core/schemas/entities';
import { WrenchIcon } from './icons/WrenchIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { LoaderIcon } from './icons/LoaderIcon';
import { PiCoinIcon } from './icons/PiCoinIcon';
import { useAppStore } from '../store/useAppStore';

export const ServiceDashboard: React.FC = () => {
    const [jobs, setJobs] = useState<OrderEntity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const { user } = useAppStore();

    useEffect(() => {
        if (user?.id) {
            loadJobs();
        }
    }, [user?.id]);

    const loadJobs = async () => {
        setIsLoading(true);
        if (user?.id) {
            const pending = await ServiceOrderController.getPendingJobs(user.id);
            setJobs(pending);
        }
        setIsLoading(false);
    };

    const handleComplete = async (orderId: string) => {
        if (!user?.walletAddress) return;
        setProcessingId(orderId);
        
        const result = await ServiceOrderController.markJobComplete(orderId, user.walletAddress);
        
        if (result.success) {
            // Optimistic update
            setJobs(prev => prev.filter(j => j.id !== orderId));
            alert(result.message); 
        } else {
            alert(result.message);
        }
        
        setProcessingId(null);
    };

    return (
        <div className="h-full flex flex-col p-2">
            <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center">
                    <div className="p-2 bg-blue-500/20 rounded-lg mr-3 text-blue-400">
                        <WrenchIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-lg">Service Jobs</h3>
                        <p className="text-xs text-slate-400">Manage your active installations.</p>
                    </div>
                </div>
                <button onClick={loadJobs} className="text-xs text-slate-400 hover:text-white">Refresh</button>
            </div>

            <div className="flex-grow overflow-y-auto space-y-3 pr-1">
                {isLoading ? (
                    <div className="flex justify-center pt-10"><LoaderIcon className="w-8 h-8 text-ai-violet animate-spin" /></div>
                ) : jobs.length === 0 ? (
                    <div className="text-center text-slate-500 pt-10">No pending jobs assigned.</div>
                ) : (
                    jobs.map(job => (
                        <div key={job.id} className="bg-slate-900/50 p-4 rounded-xl border border-white/10 hover:border-blue-500/30 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-mono text-slate-500">JOB #{job.id.slice(-6).toUpperCase()}</span>
                                <span className="bg-blue-500/20 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded">ACTIVE</span>
                            </div>
                            
                            <div className="mb-3">
                                <h4 className="text-white font-bold text-sm">Installation Service</h4>
                                <p className="text-xs text-slate-400">Client ID: {job.userId}</p>
                            </div>

                            <div className="flex justify-between items-center border-t border-white/5 pt-3">
                                <div className="flex items-center text-pi-gold font-bold text-sm">
                                    <PiCoinIcon className="w-4 h-4 mr-1" />
                                    {job.total} Pi
                                </div>
                                <button 
                                    onClick={() => handleComplete(job.id)}
                                    disabled={processingId === job.id}
                                    className="flex items-center px-4 py-2 bg-eco-green hover:bg-green-600 text-white rounded-lg font-bold text-xs transition-all disabled:opacity-50"
                                >
                                    {processingId === job.id ? (
                                        <LoaderIcon className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <>
                                            <CheckCircleIcon className="w-4 h-4 mr-1.5" /> Mark Complete
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
