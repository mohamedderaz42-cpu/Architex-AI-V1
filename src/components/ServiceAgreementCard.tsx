
import React from 'react';
import { ServiceAgreementEntity } from '../core/schemas/entities';
import { PiCoinIcon } from './icons/PiCoinIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { LoaderIcon } from './icons/LoaderIcon';

interface ServiceAgreementCardProps {
    agreement: ServiceAgreementEntity;
    onConfirmCompletion: (agreement: ServiceAgreementEntity) => void;
}

const statusColors: { [key in ServiceAgreementEntity['status']]: string } = {
    pending: 'bg-slate-500/20 text-slate-300',
    signed: 'bg-pi-gold/20 text-pi-gold',
    funded: 'bg-ai-violet/20 text-ai-violet',
    'work-in-progress': 'bg-ai-violet/20 text-ai-violet',
    'client-confirmed': 'bg-orange-500/20 text-orange-400',
    'validator-confirmed': 'bg-eco-green/20 text-eco-green',
    complete: 'bg-eco-green/20 text-eco-green',
    dispute: 'bg-red-500/20 text-red-400',
};


export const ServiceAgreementCard: React.FC<ServiceAgreementCardProps> = ({ agreement, onConfirmCompletion }) => {
    const isPendingQA = agreement.status === 'client-confirmed';

    return (
        <div className="bg-slate-900/50 p-3 rounded-xl border border-white/10">
            <div className="flex justify-between items-start">
                <div>
                    <h5 className="font-bold text-white text-sm truncate">Service for Project #{agreement.projectId.slice(-6)}</h5>
                    <p className="text-xs text-slate-400 mt-1">
                        Provider: {agreement.providerId}
                    </p>
                </div>
                <div className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColors[agreement.status]} flex items-center`}>
                    {isPendingQA && <LoaderIcon className="w-3 h-3 mr-1 animate-spin" />}
                    {isPendingQA ? 'Pending QA' : agreement.status.replace('-', ' ')}
                </div>
            </div>
            <div className="mt-2 pt-2 border-t border-white/10 flex justify-between items-center">
                <div className="flex items-center space-x-1.5">
                    <PiCoinIcon className="w-5 h-5 text-pi-gold" />
                    <span className="font-bold text-lg text-white">{agreement.price.toFixed(2)}</span>
                    {agreement.qualityAssuranceValidatorId && (
                         <span title="QA Protected" className="ml-2">
                             <ShieldCheckIcon className="w-4 h-4 text-eco-green" />
                         </span>
                    )}
                </div>
                <div className="flex items-center space-x-2">
                   {(agreement.status === 'funded' || agreement.status === 'work-in-progress') && (
                        <button onClick={() => onConfirmCompletion(agreement)} className="flex items-center px-2.5 py-1 bg-eco-green/80 rounded-full text-xs font-semibold text-white hover:bg-eco-green transition-all">
                            <CheckCircleIcon className="w-4 h-4 mr-1" />
                            <span>Confirm Completion</span>
                        </button>
                    )}
                    {isPendingQA && (
                         <span className="text-[10px] text-slate-400 italic">Validator Reviewing...</span>
                    )}
                </div>
            </div>
        </div>
    );
};
