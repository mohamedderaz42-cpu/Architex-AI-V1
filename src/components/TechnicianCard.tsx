
import React from 'react';
import { UserEntity } from '../core/schemas/entities';
import { PiCoinIcon } from './icons/PiCoinIcon';
import { LocationMarkerIcon } from './icons/LocationMarkerIcon';
import { StarIcon } from './icons/StarIcon';

interface TechnicianCardProps {
    technician: UserEntity;
    onRequest: (tech: UserEntity) => void;
}

export const TechnicianCard: React.FC<TechnicianCardProps> = ({ technician, onRequest }) => {
    const profile = technician.serviceProviderProfile;

    return (
        <div className="bg-slate-900/50 p-3 rounded-xl border border-white/10 flex items-center space-x-3 relative overflow-hidden">
            {profile?.isAvailable && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-eco-green rounded-full shadow-[0_0_5px_#10B981]"></div>
            )}
            
            <img src={technician.avatarUrl} alt={technician.piUsername} className="w-16 h-16 rounded-full border-2 border-slate-600 object-cover" />
            
            <div className="flex-grow">
                <h5 className="font-bold text-white text-sm">{technician.piUsername}</h5>
                <p className="text-xs text-slate-400">{profile?.specialty}</p>
                
                <div className="flex items-center mt-1 space-x-3">
                    <div className="flex items-center text-[10px] text-slate-300">
                        <StarIcon className="w-3 h-3 text-pi-gold mr-1" />
                        {technician.trustScore / 20}
                    </div>
                    <div className="flex items-center text-[10px] text-slate-300">
                        <LocationMarkerIcon className="w-3 h-3 text-ai-violet mr-1" />
                        {profile?.distance || 'Nearby'}
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-end space-y-2">
                <div className="flex items-center text-white font-bold text-sm">
                    <PiCoinIcon className="w-4 h-4 mr-1 text-pi-gold" />
                    {profile?.hourlyRate}/hr
                </div>
                <button 
                    onClick={() => onRequest(technician)}
                    className="px-3 py-1.5 bg-ai-violet/20 text-ai-violet hover:bg-ai-violet hover:text-white rounded-full text-xs font-bold transition-colors"
                >
                    Request
                </button>
            </div>
        </div>
    );
};
