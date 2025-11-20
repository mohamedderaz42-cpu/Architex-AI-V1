
import React from 'react';
import { GlassPanel } from './GlassPanel';
import { ArchitexLogo } from './icons/ArchitexLogo';
import { ABOUT_CONTENT } from '../core/content/about';

interface AboutModalProps {
    onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
    const { hero, mission, pillars, stats, team, metadata } = ABOUT_CONTENT;

    return (
        <div className="fixed inset-0 bg-brand-dark/90 backdrop-blur-xl flex items-center justify-center z-[120] p-4">
            <GlassPanel className="w-full max-w-2xl h-auto max-h-[90vh] flex flex-col p-0 overflow-hidden relative border-white/20 animate-fade-in">
                
                {/* Header / Hero */}
                <div className="relative p-8 bg-gradient-to-b from-slate-900/80 to-slate-900/40 border-b border-white/10 text-center overflow-hidden flex-shrink-0">
                    <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/10 mb-4 shadow-glow-violet">
                            <ArchitexLogo className="w-12 h-12" />
                        </div>
                        <h2 className="text-3xl font-bold text-white tracking-tight mb-2">{hero.title}</h2>
                        <p className="text-slate-400 max-w-md mx-auto text-sm">{hero.subtitle}</p>
                    </div>
                    <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-20">
                        <span className="text-2xl">&times;</span>
                    </button>
                </div>

                {/* Body */}
                <div className="flex-grow overflow-y-auto p-6 space-y-8">
                    
                    {/* Mission */}
                    <div className="text-center">
                        <h3 className="text-sm font-bold text-pi-gold uppercase tracking-widest mb-2">{mission.title}</h3>
                        <p className="text-slate-300 text-lg leading-relaxed font-light">
                            "{mission.body}"
                        </p>
                    </div>

                    {/* Pillars Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {pillars.map((item, idx) => (
                            <div key={idx} className="bg-slate-800/40 p-4 rounded-xl border border-white/5 hover:bg-slate-800/60 transition-colors">
                                <item.icon className={`w-8 h-8 ${item.color} mb-3`} />
                                <h4 className="text-white font-bold mb-1">{item.title}</h4>
                                <p className="text-xs text-slate-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="text-center">
                                <div className="text-2xl font-bold text-white">{stat.value}</div>
                                <div className="text-[10px] text-slate-500 uppercase tracking-wider">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="text-center pt-4 pb-2">
                        <p className="text-xs text-slate-600 italic mb-4">{team}</p>
                        <div className="flex justify-between items-center text-[9px] text-slate-700 border-t border-white/5 pt-2">
                            <span>&copy; {new Date().getFullYear()} Architex Network</span>
                            <span className="font-mono opacity-60" title={`Last updated: ${metadata.lastUpdated}`}>v{metadata.version}</span>
                        </div>
                    </div>
                </div>
            </GlassPanel>
        </div>
    );
};
