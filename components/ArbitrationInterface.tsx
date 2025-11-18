import React from 'react';
import { ArbitratorEntity } from '../core/schemas/entities';
import { ArbitratorCard } from './ArbitratorCard';

interface ArbitrationInterfaceProps {
    arbitrators: ArbitratorEntity[];
    onSelect: (arbitrator: ArbitratorEntity) => void;
}

export const ArbitrationInterface: React.FC<ArbitrationInterfaceProps> = ({ arbitrators, onSelect }) => {
    return (
        <div className="space-y-3 p-1">
            {arbitrators.map(arbitrator => (
                <ArbitratorCard 
                    key={arbitrator.id}
                    arbitrator={arbitrator}
                    onSelect={() => onSelect(arbitrator)}
                />
            ))}
        </div>
    );
};