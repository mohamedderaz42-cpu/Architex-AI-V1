import React from 'react';
import { GlassPanel } from './GlassPanel';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { getUpsellPrompt } from '../core/ux-engine/engine';

interface UpsellModalProps {
    onConfirm: () => void;
    onCancel: () => void;
}

export const UpsellModal: React.FC<UpsellModalProps> = ({ onConfirm, onCancel }) => {
    const { title, body } = getUpsellPrompt();

    return (
        <div className="fixed inset-0 bg-brand-dark/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <GlassPanel className="w-full max-w-sm p-8 text-center animate-fade-in">
                <BriefcaseIcon className="w-20 h-20 mx-auto text-eco-green mb-4" />
                <h2 className="text-2xl font-bold text-white">{title}</h2>
                <p className="text-slate-300 mt-2">
                    {body}
                </p>

                <div className="mt-8 flex flex-col space-y-3">
                    <button
                        onClick={onConfirm}
                        className="group flex items-center justify-center w-full px-6 py-3 bg-eco-green/80 border border-eco-green/90 rounded-full text-lg font-semibold text-white backdrop-blur-md hover:bg-eco-green transition-all duration-300"
                    >
                         <BriefcaseIcon className="w-6 h-6 mr-2" />
                         Explore Designers
                    </button>
                    <button
                        onClick={onCancel}
                        className="w-full py-3 text-slate-400 font-semibold hover:text-white transition-colors duration-300"
                    >
                        Continue Designing
                    </button>
                </div>
            </GlassPanel>
        </div>
    );
};