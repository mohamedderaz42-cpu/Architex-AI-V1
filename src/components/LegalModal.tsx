
import React, { useState } from 'react';
import { GlassPanel } from './GlassPanel';
import { FileTextIcon } from './icons/FileTextIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { LEGAL_CONTENT } from '../core/content/legal';
import { LockIcon } from './icons/LockIcon';
import { GavelIcon } from './icons/GavelIcon';

interface LegalModalProps {
    initialTab?: 'privacy' | 'terms';
    onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ initialTab = 'terms', onClose }) => {
    const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>(initialTab);
    
    const content = LEGAL_CONTENT[activeTab];

    return (
        <div className="fixed inset-0 bg-brand-dark/90 backdrop-blur-xl flex items-center justify-center z-[130] p-4">
            <GlassPanel className="w-full max-w-4xl h-[85vh] flex flex-col md:flex-row p-0 overflow-hidden relative border-white/20 shadow-2xl">
                
                {/* Sidebar */}
                <div className="w-full md:w-64 bg-slate-900/50 border-b md:border-b-0 md:border-r border-white/10 p-6 flex flex-col">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                        <ShieldCheckIcon className="w-6 h-6 text-pi-gold mr-2" />
                        Legal Center
                    </h2>
                    
                    <div className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-2">
                        <button 
                            onClick={() => setActiveTab('terms')}
                            className={`flex-1 md:flex-none text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center ${activeTab === 'terms' ? 'bg-ai-violet text-white shadow-glow-violet' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <GavelIcon className="w-4 h-4 mr-3" /> Terms of Service
                        </button>
                        <button 
                            onClick={() => setActiveTab('privacy')}
                            className={`flex-1 md:flex-none text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center ${activeTab === 'privacy' ? 'bg-ai-violet text-white shadow-glow-violet' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <LockIcon className="w-4 h-4 mr-3" /> Privacy Policy
                        </button>
                    </div>

                    <div className="mt-auto pt-6 hidden md:block">
                        <p className="text-[10px] text-slate-500">
                            Last Updated:<br/>
                            <span className="text-slate-300 font-mono">{content.metadata.lastUpdated}</span>
                        </p>
                        <p className="text-[10px] text-slate-500 mt-1">
                            Version: <span className="text-slate-300 font-mono">{content.metadata.version}</span>
                        </p>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-grow flex flex-col bg-brand-dark/30 relative">
                    <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white z-10 p-2 bg-black/20 rounded-full">
                        <span className="text-xl leading-none">&times;</span>
                    </button>

                    <div className="p-8 overflow-y-auto custom-scrollbar">
                        <div className="max-w-2xl mx-auto">
                            <div className="mb-8 border-b border-white/10 pb-6">
                                <h1 className="text-3xl font-bold text-white mb-2">{content.metadata.title}</h1>
                                <div className="flex items-center text-xs text-slate-400 md:hidden">
                                    <span className="mr-3">v{content.metadata.version}</span>
                                    <span>{content.metadata.lastUpdated}</span>
                                </div>
                            </div>

                            <div className="space-y-8">
                                {content.sections.map((section, idx) => (
                                    <div key={idx} className="animate-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
                                        <h3 className="text-lg font-semibold text-white mb-3">{section.heading}</h3>
                                        <p className="text-sm text-slate-300 leading-relaxed opacity-90 text-justify">
                                            {section.content}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 p-4 bg-pi-gold/5 border border-pi-gold/20 rounded-xl flex items-start">
                                <FileTextIcon className="w-5 h-5 text-pi-gold mr-3 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-pi-gold/80">
                                    By continuing to use the Architex platform, you acknowledge that you have read, understood, and agree to be bound by these terms.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </GlassPanel>
        </div>
    );
};
