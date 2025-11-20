
import React, { useState, useEffect, Suspense } from 'react';
import { ProjectEntity, SustainabilityReport } from '../core/schemas/entities';
import { GlassPanel } from './GlassPanel';
import { SunMoonIcon } from './icons/SunMoonIcon';
import { ShareIcon } from './icons/ShareIcon';
import { AwardIcon } from './icons/AwardIcon';
import { ChatIcon } from './icons/ChatIcon';
import { RefreshIcon } from './icons/RefreshIcon';
import { WrenchIcon } from './icons/WrenchIcon';
import { PiCoinIcon } from './icons/PiCoinIcon';
import { LeafIcon } from './icons/LeafIcon';
import { useToast } from './Toast';
import { requestServiceQuote, generateSustainabilityReport, optimizeProjectForSustainability } from '../core/api/contract';
import { Loader } from './Loader';
import { RoomViewer3D } from './RoomViewer3D';

interface ProjectDetailsModalProps {
    project: ProjectEntity;
    onGetQuotes: () => void;
    onClose: () => void;
    onShare: (project: ProjectEntity) => void;
    onSubmitToChallenge: () => void;
    onOpenChat?: () => void;
    onModify?: (project: ProjectEntity) => void;
}

type ProjectTab = 'visuals' | 'bom' | 'sustainability';

export const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({ project: initialProject, onGetQuotes, onClose, onShare, onSubmitToChallenge, onOpenChat, onModify }) => {
    const [project, setProject] = useState(initialProject);
    const [activeTab, setActiveTab] = useState<ProjectTab>('visuals');
    const [timeOfDay, setTimeOfDay] = useState(12); 
    const [isRegenerating, setIsRegenerating] = useState(false);
    const [sustainabilityReport, setSustainabilityReport] = useState<SustainabilityReport | null>(null);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const { addToast } = useToast();

    // Fetch Sustainability Report on open if tab clicked
    useEffect(() => {
        if (activeTab === 'sustainability' && !sustainabilityReport) {
            generateSustainabilityReport(project.id).then(setSustainabilityReport);
        }
    }, [activeTab, project.id]);

    const handleRegenerate = async () => {
        if (onModify) {
            setIsRegenerating(true);
            await new Promise(resolve => setTimeout(resolve, 1500)); 
            onModify(project);
            setIsRegenerating(false);
        }
    };

    const handleRequestItemQuote = async (materialId: string) => {
        await requestServiceQuote(project.id, materialId);
        addToast('Quote Request Sent to Service Providers', 'success');
    };

    const handleOptimizeGreen = async () => {
        setIsOptimizing(true);
        try {
            const optimized = await optimizeProjectForSustainability(project.id);
            setProject(optimized); // Update local state
            const newReport = await generateSustainabilityReport(project.id);
            setSustainabilityReport(newReport);
            addToast("Project optimized for sustainability!", "success");
        } catch (e) {
            addToast("Optimization failed.", "error");
        } finally {
            setIsOptimizing(false);
        }
    };

    // Determine Night Mode based on slider
    const isNightMode = timeOfDay < 6 || timeOfDay > 19;

    // --- Renderers ---

    const renderVisuals = () => (
        <>
            <div className="relative w-full aspect-video bg-slate-900/50 rounded-lg border border-white/10 flex items-center justify-center overflow-hidden group">
                {/* 3D Viewer Integration */}
                <Suspense fallback={<div className="flex items-center justify-center w-full h-full text-slate-500"><Loader /></div>}>
                    <RoomViewer3D isNightMode={isNightMode} color={project.isNft ? '#FDB300' : '#8B5CF6'} />
                </Suspense>
                
                <div className="absolute inset-0 pointer-events-none z-10 border-inset border-4 border-transparent group-hover:border-white/5 transition-all"></div>

                {/* Regenerate Button Overlay */}
                <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <button 
                        onClick={handleRegenerate}
                        disabled={isRegenerating}
                        className="p-2 bg-black/60 backdrop-blur-md rounded-full text-white hover:text-ai-violet border border-white/20 transition-all"
                        title="Regenerate Design"
                    >
                        <RefreshIcon className={`w-5 h-5 ${isRegenerating ? 'animate-spin' : ''}`} />
                    </button>
                </div>

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
            <div className="mt-4 bg-slate-800/50 p-3 rounded-xl border border-white/5">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                        <SunMoonIcon className={`w-5 h-5 ${isNightMode ? 'text-ai-violet' : 'text-pi-gold'}`} />
                        <span className="text-xs font-bold text-slate-300 uppercase">
                            {isNightMode ? 'Night Simulation' : 'Daylight Simulation'}
                        </span>
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
            <div className="flex mt-3 gap-2">
                 <button onClick={() => setActiveTab('bom')} className="flex-1 py-3 text-white font-semibold bg-ai-violet/80 rounded-full transition-colors duration-300 hover:bg-ai-violet text-sm">
                    Bill of Materials
                </button>
                 <button onClick={() => setActiveTab('sustainability')} className="flex-1 py-3 text-white font-semibold bg-eco-green/80 rounded-full transition-colors duration-300 hover:bg-eco-green flex items-center justify-center text-sm">
                    <LeafIcon className="w-4 h-4 mr-2" /> Eco-Impact
                </button>
            </div>
        </>
    );

    const renderBOM = () => (
        <div className="flex flex-col h-full">
             <div className="space-y-3 overflow-y-auto max-h-[50vh] pr-2 mb-4">
                {project.billOfMaterials.length === 0 && (
                    <p className="text-center text-slate-500 py-8">No materials generated for this project yet.</p>
                )}
                {project.billOfMaterials.map((item, idx) => (
                    <div key={idx} className={`bg-slate-900/50 p-3 rounded-xl border flex items-center justify-between ${item.isSustainable ? 'border-eco-green/30' : 'border-white/10'}`}>
                        <div className="flex items-center space-x-3">
                            {item.imageUrl ? (
                                <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded bg-black/30 object-cover" />
                            ) : (
                                <div className="w-12 h-12 rounded bg-slate-800 flex items-center justify-center">
                                    <WrenchIcon className="w-5 h-5 text-slate-500" />
                                </div>
                            )}
                            <div>
                                <h5 className="font-bold text-white text-sm flex items-center">
                                    {item.name || `Material ${idx + 1}`}
                                    {item.isSustainable && <LeafIcon className="w-3 h-3 text-eco-green ml-1" />}
                                </h5>
                                <div className="text-xs text-slate-400 flex items-center space-x-2">
                                    <span>Qty: {item.quantity}</span>
                                    {item.estimatedCost && (
                                        <span className="flex items-center text-pi-gold"><PiCoinIcon className="w-3 h-3 mr-1"/>{item.estimatedCost.toFixed(2)}</span>
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

    const renderSustainability = () => {
        if (!sustainabilityReport) {
            return <div className="text-center text-slate-400 py-10">Generating Impact Report...</div>;
        }
        const scoreColor = sustainabilityReport.energyEfficiencyScore >= 80 ? 'text-eco-green' : sustainabilityReport.energyEfficiencyScore >= 50 ? 'text-pi-gold' : 'text-red-400';

        return (
            <div className="flex flex-col h-full animate-fade-in">
                <div className="text-center mb-4">
                    <div className={`text-4xl font-bold ${scoreColor} mb-1`}>{sustainabilityReport.energyEfficiencyScore}/100</div>
                    <p className="text-xs text-slate-400 uppercase tracking-widest">Energy Efficiency Score</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-slate-900/50 p-3 rounded-xl border border-white/10 text-center">
                        <div className="text-lg font-bold text-white">{sustainabilityReport.carbonFootprint}</div>
                        <div className="text-[10px] text-slate-400">kg CO2e Footprint</div>
                    </div>
                    <div className="bg-slate-900/50 p-3 rounded-xl border border-white/10 text-center">
                        <div className="text-lg font-bold text-eco-green flex justify-center items-center">
                            <PiCoinIcon className="w-4 h-4 mr-1" />{sustainabilityReport.estimatedAnnualSavings}
                        </div>
                        <div className="text-[10px] text-slate-400">Est. Yearly Savings</div>
                    </div>
                </div>

                <div className="bg-slate-800/30 p-3 rounded-xl border border-white/5 flex-grow mb-4">
                    <h5 className="text-xs font-bold text-white mb-2 flex items-center"><LeafIcon className="w-3 h-3 mr-1 text-eco-green"/> AI Recommendations</h5>
                    <ul className="space-y-2">
                        {sustainabilityReport.recommendations.map((rec, i) => (
                            <li key={i} className="text-xs text-slate-300 flex items-start">
                                <span className="mr-2">•</span> {rec}
                            </li>
                        ))}
                    </ul>
                </div>

                <button 
                    onClick={handleOptimizeGreen}
                    disabled={isOptimizing}
                    className="w-full py-3 bg-gradient-to-r from-eco-green to-green-600 text-white font-bold rounded-full shadow-glow-green hover:shadow-lg transition-all flex items-center justify-center"
                >
                    {isOptimizing ? (
                        <RefreshIcon className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            <LeafIcon className="w-5 h-5 mr-2" /> Optimize for Green
                        </>
                    )}
                </button>
                <button onClick={() => setActiveTab('visuals')} className="w-full mt-2 py-2 text-slate-400 text-sm hover:text-white">
                    Back to Visuals
                </button>
            </div>
        );
    };

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
                     {activeTab === 'visuals' && renderVisuals()}
                     {activeTab === 'bom' && renderBOM()}
                     {activeTab === 'sustainability' && renderSustainability()}
                </div>
            </GlassPanel>
        </div>
    );
};
