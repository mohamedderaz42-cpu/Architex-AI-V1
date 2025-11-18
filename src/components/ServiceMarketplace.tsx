import React from 'react';
import { UserEntity } from '../core/schemas/entities';
import { WrenchIcon } from './icons/WrenchIcon';

const ServiceProviderCard: React.FC<{ provider: UserEntity; onHire: (provider: UserEntity) => void; }> = ({ provider, onHire }) => {
    return (
        <div className="bg-slate-900/50 p-3 rounded-xl border border-white/10 flex space-x-3">
            <img src={provider.avatarUrl} alt={provider.piUsername} className="w-16 h-16 rounded-full border-2 border-slate-600" />
            <div className="flex-grow">
                <h5 className="font-bold text-white">{provider.piUsername}</h5>
                <p className="text-xs text-ai-violet font-semibold">{provider.serviceProviderProfile?.specialty}</p>
                <div className="text-xs text-slate-400 mt-1">
                    Trust Score: <span className="font-semibold text-eco-green">{provider.trustScore}</span>
                </div>
            </div>
            <button
                onClick={() => onHire(provider)}
                className="self-center px-4 py-2 bg-slate-700/50 border border-white/10 rounded-full text-sm font-semibold text-slate-300 hover:bg-ai-violet/30 hover:text-white transition-all"
            >
                Hire
            </button>
        </div>
    );
};

export const ServiceMarketplace: React.FC<{ providers: UserEntity[], onHire: (provider: UserEntity) => void }> = ({ providers, onHire }) => {
     return (
        <div className="p-2 h-full flex flex-col">
            <div className="text-center mb-4">
                <WrenchIcon className="w-10 h-10 mx-auto text-pi-gold" />
                <h3 className="font-semibold text-white mt-2">Service Marketplace</h3>
                <p className="text-xs text-slate-400">Find certified professionals for installation and other services.</p>
            </div>
            <div className="space-y-3 overflow-y-auto pr-2">
                {providers.map(provider => (
                    <ServiceProviderCard key={provider.id} provider={provider} onHire={onHire} />
                ))}
            </div>
        </div>
    );
};
