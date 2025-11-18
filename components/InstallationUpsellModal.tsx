import React from 'react';
import { GlassPanel } from './GlassPanel';
import { OrderEntity } from '../core/schemas/entities';
import { ArchieBot } from './ArchieBot';
import { WrenchIcon } from './icons/WrenchIcon';

interface InstallationUpsellModalProps {
    order: OrderEntity;
    onConfirm: () => void;
    onCancel: () => void;
}

export const InstallationUpsellModal: React.FC<InstallationUpsellModalProps> = ({ order, onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 bg-brand-dark/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <GlassPanel className="w-full max-w-sm p-8 animate-fade-in">
                <ArchieBot message={`I see you've received items that need professional installation for order #${order.id.slice(-4)}. Would you like to find a certified installer in our Service Marketplace?`} />
                
                <div className="text-center my-6">
                    <WrenchIcon className="w-20 h-20 mx-auto text-pi-gold mb-4" />
                    <h3 className="text-2xl font-bold text-white">Hire a Professional?</h3>
                </div>

                <div className="flex flex-col space-y-3">
                    <button
                        onClick={onConfirm}
                        className="group flex items-center justify-center w-full px-6 py-3 bg-pi-gold/80 border border-pi-gold/90 rounded-full text-lg font-semibold text-white backdrop-blur-md hover:bg-pi-gold transition-all duration-300"
                    >
                        Find an Installer
                    </button>
                    <button
                        onClick={onCancel}
                        className="w-full py-2 text-slate-400 font-semibold hover:text-white transition-colors duration-300"
                    >
                        No Thanks
                    </button>
                </div>
            </GlassPanel>
        </div>
    );
};