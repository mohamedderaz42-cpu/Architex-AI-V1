
import React, { useState } from 'react';
import { ProjectEntity } from '../core/schemas/entities';
import { GlassPanel } from './GlassPanel';
import { SunMoonIcon } from './icons/SunMoonIcon';
import { ShareIcon } from './icons/ShareIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { AwardIcon } from './icons/AwardIcon';

interface ProjectDetailsModalProps {
    project: ProjectEntity;
    onGetQuotes: () => void;
    onClose: () => void;
    onShare: (projectId: string) => Promise<{ success: boolean; message: string }>;
    onSubmitToChallenge: () => void;
}

export const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({ project, onGetQuotes, onClose, onShare, onSubmitToChallenge }) => {
    const [isNightMode, setIsNightMode] = useState(false);
    const [isSharing, setIsSharing] = useState(false);
    const [shareStatus, setShareStatus] = useState<'idle' | 'success'>('idle');

    const handleShare = async () => {
        setIsSharing(true);
        setShareStatus('idle');
        await onShare(project.id);
        setIsSharing(false);
        setShareStatus('success');
        setTimeout(() => setShareStatus('idle'), 3000);
    };

    return (
        <div className="fixed inset-0 bg-brand-dark/80 backdrop-blur-md flex items-center justify-center z-[70] p-4">
            <GlassPanel className="w-full max-w-md p-6 animate-fade-in flex flex-col max-h-[90vh]">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white text-2xl z-10">&times;</button>
                
                <div className="text-center mb-4">
                    <h2 className="text-2xl font-bold text-white">{project.name}</h2>
                    <p className="text-sm text-slate-400">Last updated: {new Date(project.updatedAt).toLocaleDateString()}</p>
                </div>

                {/* 3D Viewer Placeholder */}
                <div className="relative w-full aspect-video bg-slate-900/50 rounded-lg border border-white/10 flex items-center justify-center overflow-hidden">
                    <img src={project.thumbnailUrl} alt={project.name} className={`w-full h-full object-cover transition-all duration-500 ${isNightMode ? 'brightness-50' : 'brightness-100'}`} />
                    <div className="absolute inset-0 bg-grid-ai-violet opacity-10" style={{
                        backgroundImage: 'linear-gradient(to right, #8B5CF6 1px, transparent 1px), linear-gradient(to bottom, #8B5CF6 1px, transparent 1px)',
                        backgroundSize: '30px 30px',
                    }}></div>
                    <span className="text-slate-500 font-semibold">3D Model Viewer</span>
                </div>
                
                {/* Controls */}
                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-2">
                        <SunMoonIcon className="w-6 h-6 text-slate-400" />
                        <span className="text-sm font-medium text-slate-300">Environmental Simulation</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={isNightMode} onChange={() => setIsNightMode(!isNightMode)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ai-violet"></div>
                        <span className="ml-3 text-sm font-semibold text-white">{isNightMode ? 'Night' : 'Day'}</span>
                    </label>
                </div>
                
                <div className="mt-6 grid grid-cols-2 gap-3">
                     <button
                        onClick={handleShare}
                        disabled={isSharing || shareStatus === 'success'}
                        className="w-full flex items-center justify-center px-4 py-3 bg-slate-700/50 border border-white/10 rounded-full text-md font-semibold text-white hover:bg-eco-green/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSharing ? (
                           <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        ) : shareStatus === 'success' ? (
                            <CheckCircleIcon className="w-6 h-6 mr-2" />
                        ) : (
                            <ShareIcon className="w-6 h-6 mr-2" />
                        )}
                        {isSharing ? '' : shareStatus === 'success' ? 'Shared!' : 'Share'}
                    </button>
                    <button onClick={onSubmitToChallenge} className="w-full flex items-center justify-center px-4 py-3 bg-slate-700/50 border border-white/10 rounded-full text-md font-semibold text-white hover:bg-pi-gold/80 transition-colors duration-300">
                        <AwardIcon className="w-6 h-6 mr-2" />
                        Submit
                    </button>
                </div>
                 <button onClick={onGetQuotes} className="w-full mt-3 py-3 text-slate-300 font-semibold bg-slate-700/50 rounded-full transition-colors duration-300 hover:bg-slate-600">
                    Get Installation Quotes
                </button>
            </GlassPanel>
        </div>
    );
};
