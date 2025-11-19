
import React from 'react';
import { ShippingZone } from '../core/schemas/entities';
import { GlobeIcon } from './icons/GlobeIcon';

interface ShippingZonesProps {
    zones: ShippingZone[];
    onZoneUpdate: (zoneId: string, active: boolean) => void;
}

const ToggleSwitch: React.FC<{ checked: boolean; onChange: () => void }> = ({ checked, onChange }) => (
    <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
        <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-eco-green/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-eco-green"></div>
    </label>
);

export const ShippingZones: React.FC<ShippingZonesProps> = ({ zones, onZoneUpdate }) => {
    return (
        <div className="p-4 h-full flex flex-col">
            <div className="text-center mb-6 flex-shrink-0">
                <GlobeIcon className="w-12 h-12 mx-auto text-ai-violet mb-2" />
                <h4 className="font-semibold text-lg text-white">Global Shipping Network</h4>
                <p className="text-xs text-slate-400">Configure regional availability for your products.</p>
            </div>
            
            <div className="flex-grow overflow-y-auto space-y-3 pr-1 pb-2">
                {zones.map(zone => (
                    <div 
                        key={zone.id} 
                        className={`p-3 rounded-xl border flex justify-between items-center transition-all duration-300 ${
                            zone.active 
                                ? 'bg-slate-800/80 border-eco-green/50 shadow-[0_0_10px_rgba(16,185,129,0.1)]' 
                                : 'bg-slate-900/50 border-white/10 opacity-80 hover:opacity-100'
                        }`}
                    >
                        <div className="flex items-center">
                             <div className={`w-2 h-2 rounded-full mr-3 transition-colors duration-300 ${zone.active ? 'bg-eco-green animate-pulse' : 'bg-slate-600'}`}></div>
                             <span className={`font-medium transition-colors duration-300 ${zone.active ? 'text-white' : 'text-slate-400'}`}>{zone.name}</span>
                        </div>
                        <ToggleSwitch 
                            checked={zone.active} 
                            onChange={() => onZoneUpdate(zone.id, !zone.active)}
                        />
                    </div>
                ))}
            </div>
             <p className="text-[10px] text-slate-500 mt-4 text-center flex-shrink-0">
                Changes to shipping zones take effect immediately across the marketplace.
            </p>
        </div>
    );
};
