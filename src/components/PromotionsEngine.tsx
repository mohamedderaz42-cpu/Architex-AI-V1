
import React from 'react';
import { PromotionEntity } from '../core/schemas/entities';
import { PlusIcon } from './icons/PlusIcon';
import { PercentIcon } from './icons/PercentIcon';

interface PromotionsEngineProps {
    promotions: PromotionEntity[];
    onCreatePromotion: (promo: Omit<PromotionEntity, 'id'>) => void;
}

const PromotionCard: React.FC<{ promo: PromotionEntity }> = ({ promo }) => (
    <div className="bg-slate-900/50 p-3 rounded-xl border border-white/10 flex items-center space-x-3">
        <div className="w-8 h-8 flex-shrink-0 rounded-full bg-eco-green/20 text-eco-green flex items-center justify-center">
            <PercentIcon className="w-5 h-5" />
        </div>
        <div>
            <div className="font-bold text-white">{promo.discountValue}% OFF</div>
            <p className="text-xs text-slate-400">{promo.description}</p>
        </div>
    </div>
);

export const PromotionsEngine: React.FC<PromotionsEngineProps> = ({ promotions, onCreatePromotion }) => {
    
    // In a real app, this would be a form in a modal
    const handleCreateClick = () => {
        const newPromo: Omit<PromotionEntity, 'id'> = {
            type: 'invoice',
            description: `New ${new Date().getHours()}:${new Date().getMinutes()} Flash Sale`,
            discountValue: 12,
            minSpend: 150
        };
        onCreatePromotion(newPromo);
    }
    
    return (
        <div className="p-2 h-full flex flex-col">
            <h4 className="font-semibold text-lg text-white mb-2 text-center">Active Promotions</h4>
            <div className="space-y-3 overflow-y-auto flex-grow pr-2">
                {promotions.map(p => <PromotionCard key={p.id} promo={p} />)}
            </div>
            <button
                onClick={handleCreateClick}
                className="group mt-4 flex-shrink-0 flex items-center justify-center w-full px-6 py-3 bg-eco-green/80 border border-eco-green/90 rounded-full text-lg font-semibold text-white backdrop-blur-md hover:bg-eco-green transition-all duration-300"
            >
                <PlusIcon className="w-6 h-6 mr-2" />
                Create Promotion
            </button>
        </div>
    );
};
