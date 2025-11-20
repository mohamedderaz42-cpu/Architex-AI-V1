
import React, { useState, useEffect } from 'react';
import { GlassPanel } from './GlassPanel';
import { SearchIcon } from './icons/SearchIcon';
import { DesignIcon } from './icons/DesignIcon';
import { MarketIcon } from './icons/MarketIcon';
import { ScanIcon } from './icons/ScanIcon';
import { FileTextIcon } from './icons/FileTextIcon';

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
    onNavigate: (tab: string) => void;
    onOpenWhitePaper?: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onNavigate, onOpenWhitePaper }) => {
    if (!isOpen) return null;

    const [query, setQuery] = useState('');
    const options = [
        { id: 'scan', label: 'Start New Scan', icon: <ScanIcon className="w-4 h-4"/>, action: () => onNavigate('scan') },
        { id: 'explore', label: 'Explore Gallery', icon: <DesignIcon className="w-4 h-4"/>, action: () => onNavigate('explore') },
        { id: 'design', label: 'Go to Studio', icon: <DesignIcon className="w-4 h-4"/>, action: () => onNavigate('design') },
        { id: 'market', label: 'Open Marketplace', icon: <MarketIcon className="w-4 h-4"/>, action: () => onNavigate('market') },
        { id: 'whitepaper', label: 'Read White Paper', icon: <FileTextIcon className="w-4 h-4"/>, action: () => onOpenWhitePaper?.() },
    ];

    const filtered = options.filter(o => o.label.toLowerCase().includes(query.toLowerCase()));

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <GlassPanel className="w-full max-w-lg relative animate-slide-up p-0 overflow-hidden border-white/10">
                <div className="flex items-center px-4 py-3 border-b border-white/10 bg-white/5">
                    <SearchIcon className="w-5 h-5 text-slate-400 mr-3" />
                    <input 
                        autoFocus
                        type="text" 
                        placeholder="Type a command or search..." 
                        className="bg-transparent border-none outline-none text-white placeholder-slate-500 w-full text-lg"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                    <button onClick={onClose} className="text-xs bg-white/10 px-2 py-1 rounded text-slate-400">ESC</button>
                </div>
                <div className="max-h-64 overflow-y-auto p-2">
                    {filtered.map((opt, idx) => (
                        <button 
                            key={opt.id}
                            onClick={() => { opt.action(); onClose(); }}
                            className={`w-full flex items-center px-3 py-3 rounded-lg text-left transition-colors ${idx === 0 ? 'bg-ai-violet/20 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                        >
                            <span className="mr-3 opacity-70">{opt.icon}</span>
                            <span className="text-sm font-medium">{opt.label}</span>
                        </button>
                    ))}
                    {filtered.length === 0 && (
                        <div className="p-4 text-center text-slate-500 text-sm">No results found.</div>
                    )}
                </div>
            </GlassPanel>
        </div>
    );
};
