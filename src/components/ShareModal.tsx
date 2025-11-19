
import React, { useState, useEffect } from 'react';
import { GlassPanel } from './GlassPanel';
import { ProjectEntity } from '../core/schemas/entities';
import { ShareIcon } from './icons/ShareIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { LoaderIcon } from './icons/LoaderIcon';

interface ShareModalProps {
    project: ProjectEntity;
    onShare: (caption: string) => Promise<void>;
    onCancel: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ project, onShare, onCancel }) => {
    const [step, setStep] = useState<'rendering' | 'compose' | 'success'>('rendering');
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState(`Check out my new design "${project.name}" on Architex! #PiNetwork #Architex`);
    const [isSharing, setIsSharing] = useState(false);

    // Simulate High-Fidelity Rendering
    useEffect(() => {
        if (step === 'rendering') {
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setStep('compose');
                        return 100;
                    }
                    // Slow down as it gets closer to 100
                    const increment = Math.max(1, (100 - prev) / 10);
                    return prev + increment;
                });
            }, 150);
            return () => clearInterval(interval);
        }
    }, [step]);

    const handleShare = async () => {
        setIsSharing(true);
        await onShare(caption);
        setIsSharing(false);
        setStep('success');
        setTimeout(onCancel, 2000);
    };

    const renderRendering = () => (
        <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-20 h-20 relative mb-6">
                <svg className="w-full h-full transform -rotate-90">
                    <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                    <circle 
                        cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" 
                        className="text-ai-violet transition-all duration-200" 
                        strokeDasharray={2 * Math.PI * 36}
                        strokeDashoffset={2 * Math.PI * 36 * (1 - progress / 100)}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
                    {Math.round(progress)}%
                </div>
            </div>
            <h3 className="text-lg font-bold text-white animate-pulse">Rendering High-Fidelity Image...</h3>
            <p className="text-xs text-slate-400 mt-2 max-w-[200px]">Calculating raytracing paths and lighting simulation.</p>
        </div>
    );

    const renderCompose = () => (
        <div className="space-y-4 animate-fade-in">
            <div className="relative rounded-xl overflow-hidden border border-white/10">
                <img src={project.thumbnailUrl} alt="Render" className="w-full h-48 object-cover" />
                <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] text-white font-bold border border-white/20">
                    HD RENDER
                </div>
            </div>
            
            <textarea 
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full h-24 bg-slate-900/50 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-ai-violet/50 resize-none"
                placeholder="Write a caption..."
            />
            
            <button 
                onClick={handleShare}
                disabled={isSharing}
                className="w-full py-3 bg-gradient-to-r from-pi-gold to-yellow-500 text-brand-dark font-bold rounded-full hover:shadow-lg transition-all disabled:opacity-70 flex items-center justify-center"
            >
                {isSharing ? <LoaderIcon className="w-5 h-5 animate-spin" /> : 'Post to Pi Social'}
            </button>
        </div>
    );

    const renderSuccess = () => (
        <div className="flex flex-col items-center justify-center py-10 animate-fade-in">
            <CheckCircleIcon className="w-20 h-20 text-eco-green mb-4" />
            <h3 className="text-2xl font-bold text-white">Shared Successfully!</h3>
            <p className="text-slate-400 text-sm mt-2">Your design is now live on the Pi feed.</p>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-brand-dark/90 backdrop-blur-md flex items-center justify-center z-[100] p-4">
            <GlassPanel className="w-full max-w-sm p-6">
                <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                    <div className="flex items-center">
                        <ShareIcon className="w-5 h-5 text-ai-violet mr-2" />
                        <h3 className="font-bold text-white">Share to Pi Network</h3>
                    </div>
                    {step !== 'success' && step !== 'rendering' && (
                        <button onClick={onCancel} className="text-slate-400 hover:text-white text-xl">&times;</button>
                    )}
                </div>
                
                {step === 'rendering' && renderRendering()}
                {step === 'compose' && renderCompose()}
                {step === 'success' && renderSuccess()}
            </GlassPanel>
        </div>
    );
};
