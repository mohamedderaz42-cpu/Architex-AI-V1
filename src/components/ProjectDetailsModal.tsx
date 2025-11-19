
import React, { useState } from 'react';
import { ProjectEntity } from '../core/schemas/entities';
import { GlassPanel } from './GlassPanel';
import { SunMoonIcon } from './icons/SunMoonIcon';
import { ShareIcon } from './icons/ShareIcon';
import { AwardIcon } from './icons/AwardIcon';
import { ChatIcon } from './icons/ChatIcon';
import { RefreshIcon } from './icons/RefreshIcon';
import { WrenchIcon } from './icons/WrenchIcon';
import { PiCoinIcon } from './icons/PiCoinIcon';
import { useToast } from './Toast';
import { requestServiceQuote } from '../core/api/contract';

interface ProjectDetailsModalProps {
    project: ProjectEntity;
    onGetQuotes: () => void;
    onClose: () => void;
    onShare: (project: ProjectEntity) => void;
    onSubmitToChallenge: () => void;
    onOpenChat?: () => void;
    onModify?: (project: ProjectEntity) => void;
}

type ProjectTab = 'visuals' | 'bom';

export const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({ project, onGetQuotes, onClose, onShare, onSubmitToChallenge, onOpenChat, onModify }) => {
    const [activeTab, setActiveTab] = useState<ProjectTab>('visuals');
    const [timeOfDay, setTimeOfDay] = useState(12); // 0-24
    const [isRegenerating, setIsRegenerating] = useState(false);
    const { addToast } = useToast();

    const handleRegenerate = async () => {
        if (onModify) {
            setIsRegenerating(true);
            await new Promise(resolve => setTimeout(resolve, 1500)); // Mock AI delay
            onModify(project);
            setIsRegenerating(false);
        }
    };

    const handleRequestItemQuote = async (materialId: string) => {
        await requestServiceQuote(project.id, materialId);
        addToast('Quote Request Sent to Service Providers', 'success');
    };

    // Calculate lighting simulation styles
    const getLightingStyle = () => {
        // Brightness curve: Peak at 12 (1.1), low at 0/24 (0.4)
        const brightness = 0.4 + 0.7 * Math.sin((timeOfDay / 24) * Math.PI);
        
        // Overlay color for tinting
        let overlayColor = 'transparent';
        let overlayOpacity = 0;

        if (timeOfDay < 5 || timeOfDay > 20) {
            // Night: Blue tint
            overlayColor = '#0f172a'; // Slate-900
            overlayOpacity = 0.4;
        } else if (timeOfDay >= 5 && timeOfDay < 9) {
            // Sunrise: Orange/Pink
            overlayColor = '#f97316'; // Orange-500
            overlayOpacity = 0.2;
        } else if (timeOfDay >= 17 && timeOfDay <= 20) {
            // Sunset: Red/Orange
            overlayColor = '#ef4444'; // Red-500
            overlayOpacity = 0.25;
        }

        return {
            filter: `brightness(${brightness})`,
            overlay: { backgroundColor: overlayColor, opacity: overlayOpacity }
        };
    };

    const lighting = getLightingStyle();

    const renderVisuals = () => (
        <>
            {/* 3D Viewer Placeholder */}
            <div className="relative w-full aspect-video bg-slate-900/50 rounded-lg border border-white/10 flex items-center justify-center overflow-hidden group">
                {/* Base Image with Brightness Filter */}
                <img 
                    src={project.thumbnailUrl} 
                    alt={project.name} 
                    className="w-full h-full object-cover transition-all duration-500"
                    style={{ filter: lighting.filter }} 
                />
                
                {/* Atmospheric Overlay */}
                <div 
                    className="absolute inset-0 transition-all duration-500 pointer-events-none"
                    style={lighting.overlay}
                ></div>

                <div className="absolute inset-0 bg-grid-ai-violet opacity-10 pointer-events-none" style={{
                    backgroundImage: 'linear-gradient(to right, #8B5CF6 1px, transparent 1px), linear-gradient(to bottom, #8B5CF6 1px, transparent 1px)',
                    backgroundSize: '30px 30px',
                }}></div>
                
                {/* Controls Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                    <button 
                        onClick={handleRegenerate}
                        disabled={isRegenerating}
                        className="flex flex-col items-center text-white hover:text-ai-violet transition-colors transform hover:scale-110"
                    >
                        <div className={`p-3 bg-black/50 rounded-full backdrop-blur-sm border border-white/20 ${isRegenerating ? 'animate-spin' : ''}`}>
                            <RefreshIcon className="w-8 h-8" />
                        </div>
                        <span className="text-xs font-bold mt-2 bg-black/50 px-2 py-1 rounded backdrop-blur-sm">Regenerate AI</span>
                    </button>
                </div>
                
                {/* Chat Overlay Button */}
                {onOpenChat && (
                    <button 
                        onClick={onOpenChat}
                        className="absolute bottom-3 right-3 p-2 bg-ai-violet text-white rounded-full shadow-glow-violet hover:scale-110 transition-transform z-20"
                        title="Project Chat"
                    >
                        <ChatIcon className="w-5 h-5" />
                    </button>
                )}
            </div>
            
            {/* Environmental Simulation Controls */}
            <div className="mt-4 bg-slate-800/50 p-3 rounded-xl border border-white/5">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                        <SunMoonIcon className="w-5 h-5 text-pi-gold" />
                        <span className="text-xs font-bold text-slate-300 uppercase">Time of Day Simulation</span>
                    </div>
                    <span className="text-xs font-mono text-white">{timeOfDay}:00</span>
                </div>
                <input 
                    type="range" 
                    min="0" 
                    max="24" 
                    step="1" 
                    value={timeOfDay} 
                    onChange={(e) => setTimeOfDay(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-pi-gold"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 px-1">
                    <span>Night</span>
                    <span>Sunrise</span>
                    <span>Noon</span>
                    <span>Sunset</span>
                    <span>Night</span>
                </div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-3">
                 <button
                    onClick={() => onShare(project)}
                    className="w-full flex items-center justify-center px-4 py-3 bg-slate-700/50 border border-white/10 rounded-full text-md font-semibold text-white hover:bg-eco-green/80 transition-all"
                >
                    <ShareIcon className="w-6 h-6 mr-2" />
                    Share
                </button>
                <button onClick={onSubmitToChallenge} className="w-full flex items-center justify-center px-4 py-3 bg-slate-700/50 border border-white/10 rounded-full text-md font-semibold text-white hover:bg-pi-gold/80 transition-colors duration-300">
                    <AwardIcon className="w-6 h-6 mr-2" />
                    Submit
                </button>
            </div>
             <button onClick={() => setActiveTab('bom')} className="w-full mt-3 py-3 text-white font-semibold bg-ai-violet/80 rounded-full transition-colors duration-300 hover:bg-ai-violet">
                View Bill of Materials
            </button>
            
            <p className="text-[10px] text-slate-500 text-center mt-4 px-4 leading-tight">
                Disclaimer: AI-generated visualizations are for conceptual purposes only. Please verify all structural measurements and material requirements with a certified professional before construction.
            </p>
        </>
    );

    const renderBOM = () => (
        <div className="flex flex-col h-full">
             <div className="space-y-3 overflow-y-auto max-h-[50vh] pr-2 mb-4">
                {project.billOfMaterials.length === 0 && (
                    <p className="text-center text-slate-500 py-8">No materials generated for this project yet.</p>
                )}
                {project.billOfMaterials.map((item, idx) => (
                    <div key={idx} className="bg-slate-900/50 p-3 rounded-xl border border-white/10 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            {item.imageUrl ? (
                                <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded bg-black/30 object-cover" />
                            ) : (
                                <div className="w-12 h-12 rounded bg-slate-800 flex items-center justify-center">
                                    <WrenchIcon className="w-5 h-5 text-slate-500" />
                                </div>
                            )}
                            <div>
                                <h5 className="font-bold text-white text-sm">{item.name || `Material ${idx + 1}`}</h5>
                                <div className="text-xs text-slate-400 flex items-center space-x-2">
                                    <span>Qty: {item.quantity}</span>
                                    {item.estimatedCost && (
                                        <span className="flex items-center text-pi-gold"><PiCoinIcon className="w-3 h-3 mr-1"/>{item.estimatedCost}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <button onClick={() => handleRequestItemQuote(item.materialId)} className="p-2 bg-slate-700/50 rounded-full text-ai-violet hover:bg-ai-violet hover:text-white transition-colors" title="Request Quote">
                            <WrenchIcon className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
            <div className="mt-auto pt-4 border-t border-white/10">
                <div className="flex justify-between items-center mb-3">
                     <span className="text-slate-300 text-sm">Total Estimated Cost</span>
                     <span className="text-xl font-bold text-white flex items-center">
                         <PiCoinIcon className="w-5 h-5 text-pi-gold mr-1"/>
                         {project.billOfMaterials.reduce((sum, i) => sum + (i.estimatedCost || 0) * i.quantity, 0).toLocaleString()}
                     </span>
                </div>
                <button onClick={onGetQuotes} className="w-full py-3 bg-eco-green text-white font-bold rounded-full hover:bg-eco-green/80 transition-colors shadow-glow-green">
                    Get Full Project Quote
                </button>
                <button onClick={() => setActiveTab('visuals')} className="w-full mt-2 py-2 text-slate-400 text-sm hover:text-white">
                    Back to Visuals
                </button>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-brand-dark/80 backdrop-blur-md flex items-center justify-center z-[70] p-4">
            <GlassPanel className="w-full max-w-md p-6 animate-fade-in flex flex-col max-h-[90vh]">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white text-2xl z-10">&times;</button>
                
                <div className="text-center mb-4">
                    <h2 className="text-2xl font-bold text-white">{project.name}</h2>
                    <p className="text-sm text-slate-400">
                        Ver: {project.modificationCount || 0} • Updated: {new Date(project.updatedAt).toLocaleDateString()}
                    </p>
                </div>

                <div className="flex-grow overflow-hidden">
                     {activeTab === 'visuals' ? renderVisuals() : renderBOM()}
                </div>
            </GlassPanel>
        </div>
    );
};
