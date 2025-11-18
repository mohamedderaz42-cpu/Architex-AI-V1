import React from 'react';
import { BountyEntity } from '../core/schemas/entities';
import { BountyCard } from './BountyCard';
import { PlusIcon } from './icons/PlusIcon';

interface BountiesInterfaceProps {
    bounties: BountyEntity[];
    onCreateBounty: () => void;
    onBountySelect: (bounty: BountyEntity) => void;
}

export const BountiesInterface: React.FC<BountiesInterfaceProps> = ({ bounties, onCreateBounty, onBountySelect }) => {
    return (
        <div className="p-2 flex flex-col h-full">
            <div className="flex-grow space-y-3 pr-2 overflow-y-auto">
                {bounties.map(bounty => (
                    <BountyCard key={bounty.id} bounty={bounty} onClick={() => onBountySelect(bounty)} />
                ))}
            </div>
             <button
                onClick={onCreateBounty}
                className="group mt-4 flex-shrink-0 flex items-center justify-center w-full px-6 py-3 bg-ai-violet/80 border border-ai-violet/90 rounded-full text-lg font-semibold text-white backdrop-blur-md hover:bg-ai-violet transition-all duration-300"
            >
                <PlusIcon className="w-6 h-6 mr-2" />
                Create Bounty
            </button>
        </div>
    );
};
