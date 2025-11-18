import React from 'react';
import { ShippingZone } from '../core/schemas/entities';

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
        <div className="p-4">
            <h4 className="font-semibold text-lg text-white mb-4 text-center">Manage Shipping Zones</h4>
            <div className="space-y-3">
                {zones.map(zone => (
                    <div key={zone.id} className="bg-slate-900/50 p-3 rounded-xl border border-white/10 flex justify-between items-center">
                        <span className="font-medium text-slate-200">{zone.name}</span>
                        <ToggleSwitch 
                            checked={zone.active} 
                            onChange={() => onZoneUpdate(zone.id, !zone.active)}
                        />
                    </div>
                ))}
            </div>
             <p className="text-xs text-slate-500 mt-6 text-center">
                Enable zones where you can ship your products. This will affect who can purchase your items on the marketplace.
            </p>
        </div>
    );
};