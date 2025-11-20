
import React, { useState, useEffect } from 'react';
import { UserEntity, GigCategory } from '../core/schemas/entities';
import * as api from '../core/api/contract';
import { TechnicianCard } from './TechnicianCard';
import { ToolsIcon } from './icons/ToolsIcon';
import { useToast } from './Toast';
import { LoaderIcon } from './icons/LoaderIcon';
import { WrenchIcon } from './icons/WrenchIcon';
import { ZapIcon } from './icons/ZapIcon';

const CATEGORIES: { id: GigCategory | 'All', label: string, icon?: React.ReactNode }[] = [
    { id: 'All', label: 'All' },
    { id: 'Plumbing', label: 'Plumbing', icon: <WrenchIcon className="w-3 h-3" /> },
    { id: 'Electrical', label: 'Electrical', icon: <ZapIcon className="w-3 h-3" /> },
    { id: 'Carpentry', label: 'Carpentry' },
    { id: 'HVAC', label: 'HVAC' },
];

export const MicroServicesHub: React.FC = () => {
    const [technicians, setTechnicians] = useState<UserEntity[]>([]);
    const [filter, setFilter] = useState<GigCategory | 'All'>('All');
    const [isLoading, setIsLoading] = useState(true);
    const { addToast } = useToast();

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            const data = await api.listGigWorkers();
            setTechnicians(data);
            setIsLoading(false);
        };
        loadData();
    }, []);

    const filteredTechs = technicians.filter(t => 
        filter === 'All' || t.serviceProviderProfile?.gigCategories?.includes(filter)
    );

    const handleRequest = (tech: UserEntity) => {
        addToast(`Request sent to ${tech.piUsername}. Waiting for acceptance...`, 'success');
    };

    return (
        <div className="flex flex-col h-full p-2">
            <div className="flex items-center mb-4 px-2">
                <div className="p-2 bg-pi-gold/20 rounded-lg mr-3 text-pi-gold">
                    <ToolsIcon className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="font-bold text-white text-lg">Quick Fix</h3>
                    <p className="text-xs text-slate-400">Find local pros for small jobs instantly.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex space-x-2 overflow-x-auto pb-2 mb-2 px-1 scrollbar-hide">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setFilter(cat.id)}
                        className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-colors flex items-center space-x-1 ${
                            filter === cat.id 
                            ? 'bg-white text-brand-dark' 
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                    >
                        {cat.icon}
                        <span>{cat.label}</span>
                    </button>
                ))}
            </div>

            <div className="flex-grow overflow-y-auto space-y-3 pr-1">
                {isLoading ? (
                    <div className="flex justify-center pt-10">
                        <LoaderIcon className="w-8 h-8 text-ai-violet animate-spin" />
                    </div>
                ) : filteredTechs.length > 0 ? (
                    filteredTechs.map(tech => (
                        <TechnicianCard 
                            key={tech.id} 
                            technician={tech} 
                            onRequest={handleRequest}
                        />
                    ))
                ) : (
                    <div className="text-center text-slate-500 pt-10">
                        <p>No technicians found nearby.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
