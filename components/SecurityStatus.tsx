import React from 'react';
import { GlassPanel } from './GlassPanel';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { LoaderIcon } from './icons/LoaderIcon';

const StatusItem: React.FC<{ label: string; status: 'Passed' | 'In Progress' }> = ({ label, status }) => {
    const isPassed = status === 'Passed';
    return (
        <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">{label}:</span>
            <div className={`flex items-center font-semibold ${isPassed ? 'text-eco-green' : 'text-pi-gold'}`}>
                {isPassed ? (
                    <ShieldCheckIcon className="w-4 h-4 mr-1.5" />
                ) : (
                    <LoaderIcon className="w-4 h-4 mr-1.5" />
                )}
                <span>{status}</span>
            </div>
        </div>
    );
};


export const SecurityStatus: React.FC = () => {
    return (
        <GlassPanel className="p-3 rounded-xl">
             <h4 className="text-xs font-bold text-slate-500 uppercase mb-2 text-center">Security & Testing Protocol</h4>
            <div className="space-y-1.5">
                <StatusItem label="AI Fuzz Test" status="Passed" />
                <StatusItem label="Integration Test" status="Passed" />
                <StatusItem label="Infrastructure Stress Test" status="In Progress" />
                <StatusItem label="External Human Audit" status="In Progress" />
            </div>
        </GlassPanel>
    );
};