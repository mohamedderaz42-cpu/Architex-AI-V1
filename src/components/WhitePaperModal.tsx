
import React, { useState } from 'react';
import { GlassPanel } from './GlassPanel';
import { ArchitexLogo } from './icons/ArchitexLogo';
import { FileTextIcon } from './icons/FileTextIcon';
import { LayersIcon } from './icons/LayersIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { GlobeIcon } from './icons/GlobeIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { WHITEPAPER_CONTENT } from '../core/content/whitepaper';

interface WhitePaperModalProps {
    onClose: () => void;
}

type Section = 'intro' | 'tokenomics' | 'tech' | 'roadmap';

export const WhitePaperModal: React.FC<WhitePaperModalProps> = ({ onClose }) => {
    const [activeSection, setActiveSection] = useState<Section>('intro');
    const { intro, tokenomics, tech, roadmap, version } = WHITEPAPER_CONTENT;

    const renderContent = () => {
        switch (activeSection) {
            case 'intro':
                return (
                    <div className="space-y-6 animate-fade-in">
                        <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/10">
                            <h3 className="text-lg font-bold text-white mb-2">{intro.title}</h3>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                {intro.body}
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-900/30 p-4 rounded-xl border border-white/5">
                                <h4 className="text-ai-violet font-bold text-sm mb-1">Problem</h4>
                                <p className="text-xs text-slate-400">{intro.problem}</p>
                            </div>
                            <div className="bg-slate-900/30 p-4 rounded-xl border border-white/5">
                                <h4 className="text-eco-green font-bold text-sm mb-1">Solution</h4>
                                <p className="text-xs text-slate-400">{intro.solution}</p>
                            </div>
                        </div>
                    </div>
                );
            case 'tokenomics':
                return (
                    <div className="space-y-6 animate-fade-in">
                        <div className="flex items-center justify-between bg-gradient-to-r from-slate-900 to-slate-800 p-6 rounded-2xl border border-pi-gold/20">
                            <div>
                                <h3 className="text-lg font-bold text-white">{tokenomics.title}</h3>
                                <p className="text-xs text-slate-400">{tokenomics.subtitle}</p>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-pi-gold">{tokenomics.supply}</div>
                                <div className="text-[10px] uppercase tracking-widest text-slate-500">Total Supply</div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Revenue Model & Fees</h4>
                            <div className="grid grid-cols-2 gap-3">
                                {tokenomics.revenueModel.map((item, idx) => (
                                    <div key={idx} className="bg-slate-900/50 p-3 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                                        <span className="block text-xs text-slate-400">{item.title}</span>
                                        <span className={`text-lg font-bold ${idx % 2 === 0 ? 'text-white' : 'text-eco-green'}`}>{item.value}</span>
                                        <p className="text-[10px] text-slate-500 mt-1">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 'tech':
                return (
                    <div className="space-y-5 animate-fade-in">
                        {tech.map((item, idx) => (
                            <div key={idx} className="bg-slate-900/50 p-4 rounded-xl border border-white/10">
                                <div className="flex items-center mb-2">
                                    <item.icon className={`w-5 h-5 ${item.color} mr-2`} />
                                    <h4 className="font-bold text-white">{item.title}</h4>
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                );
            case 'roadmap':
                return (
                    <div className="space-y-4 animate-fade-in relative">
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-white/10"></div>
                        
                        {roadmap.map((item, idx) => (
                            <div key={idx} className="relative pl-10">
                                <div className={`absolute left-2.5 top-1.5 w-3 h-3 rounded-full border-2 ${item.active ? 'bg-pi-gold border-pi-gold shadow-glow-gold' : 'bg-brand-dark border-slate-600'} transform -translate-x-1/2`}></div>
                                <h4 className={`text-sm font-bold ${item.active ? 'text-white' : 'text-slate-500'}`}>{item.phase}: {item.title}</h4>
                                <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                );
        }
    };

    return (
        <div className="fixed inset-0 bg-brand-dark/90 backdrop-blur-xl flex items-center justify-center z-[120] p-4">
            <GlassPanel className="w-full max-w-2xl h-[85vh] flex flex-col p-0 overflow-hidden relative border-white/20">
                
                {/* Header */}
                <div className="flex-shrink-0 p-6 border-b border-white/10 bg-slate-900/50 flex justify-between items-start">
                    <div className="flex items-center">
                        <div className="mr-4 bg-white/5 p-2 rounded-xl border border-white/10">
                            <ArchitexLogo className="w-10 h-10" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white tracking-tight">Architex Protocol</h2>
                            <p className="text-xs text-pi-gold font-mono uppercase tracking-widest">White Paper v{version}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <span className="text-2xl">&times;</span>
                    </button>
                </div>

                {/* Body */}
                <div className="flex flex-grow overflow-hidden">
                    {/* Sidebar Navigation */}
                    <div className="w-48 bg-slate-900/30 border-r border-white/5 p-4 space-y-2 hidden sm:block">
                        <button onClick={() => setActiveSection('intro')} className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center ${activeSection === 'intro' ? 'bg-ai-violet text-white shadow-glow-violet' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                            <FileTextIcon className="w-4 h-4 mr-2" /> Introduction
                        </button>
                        <button onClick={() => setActiveSection('tokenomics')} className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center ${activeSection === 'tokenomics' ? 'bg-ai-violet text-white shadow-glow-violet' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                            <ChartBarIcon className="w-4 h-4 mr-2" /> Economy
                        </button>
                        <button onClick={() => setActiveSection('tech')} className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center ${activeSection === 'tech' ? 'bg-ai-violet text-white shadow-glow-violet' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                            <LayersIcon className="w-4 h-4 mr-2" /> Technology
                        </button>
                        <button onClick={() => setActiveSection('roadmap')} className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center ${activeSection === 'roadmap' ? 'bg-ai-violet text-white shadow-glow-violet' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                            <GlobeIcon className="w-4 h-4 mr-2" /> Roadmap
                        </button>
                    </div>

                    {/* Mobile Navigation (Top Bar) */}
                    <div className="sm:hidden absolute top-20 left-0 right-0 flex justify-center space-x-2 p-2 z-10 bg-brand-dark/80 backdrop-blur-md border-b border-white/5">
                        <button onClick={() => setActiveSection('intro')} className={`p-2 rounded-lg ${activeSection === 'intro' ? 'text-ai-violet bg-ai-violet/20' : 'text-slate-400'}`}><FileTextIcon className="w-5 h-5" /></button>
                        <button onClick={() => setActiveSection('tokenomics')} className={`p-2 rounded-lg ${activeSection === 'tokenomics' ? 'text-ai-violet bg-ai-violet/20' : 'text-slate-400'}`}><ChartBarIcon className="w-5 h-5" /></button>
                        <button onClick={() => setActiveSection('tech')} className={`p-2 rounded-lg ${activeSection === 'tech' ? 'text-ai-violet bg-ai-violet/20' : 'text-slate-400'}`}><LayersIcon className="w-5 h-5" /></button>
                        <button onClick={() => setActiveSection('roadmap')} className={`p-2 rounded-lg ${activeSection === 'roadmap' ? 'text-ai-violet bg-ai-violet/20' : 'text-slate-400'}`}><GlobeIcon className="w-5 h-5" /></button>
                    </div>

                    {/* Content Area */}
                    <div className="flex-grow p-6 overflow-y-auto sm:mt-0 mt-14">
                        {renderContent()}
                        
                        <div className="mt-12 pt-6 border-t border-white/10 flex justify-center">
                            <button className="flex items-center text-xs text-slate-500 hover:text-white transition-colors">
                                <ShieldCheckIcon className="w-3 h-3 mr-1" />
                                Verified by Pi Network Audits
                            </button>
                        </div>
                    </div>
                </div>
            </GlassPanel>
        </div>
    );
};
