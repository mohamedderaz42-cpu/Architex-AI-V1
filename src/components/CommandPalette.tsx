import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchIcon } from './icons/SearchIcon';
import { DesignIcon } from './icons/DesignIcon';
import { MarketIcon } from './icons/MarketIcon';
import { PlusIcon } from './icons/PlusIcon';
import { ScanIcon } from './icons/ScanIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
    onNavigate: (tab: string) => void;
    onCreateProject: () => void;
    onCreateBounty: () => void;
}

const COMMANDS = [
    { id: 'scan', label: 'Start Room Scan', group: 'Actions', icon: ScanIcon, action: 'scan' },
    { id: 'create-project', label: 'Create New Design', group: 'Actions', icon: PlusIcon, action: 'create-project' },
    { id: 'create-bounty', label: 'Post a Bounty', group: 'Actions', icon: PlusIcon, action: 'create-bounty' },
    { id: 'goto-design', label: 'Go to Design Studio', group: 'Navigation', icon: DesignIcon, action: 'design' },
    { id: 'goto-market', label: 'Go to Marketplace', group: 'Navigation', icon: MarketIcon, action: 'market' },
];

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onNavigate, onCreateProject, onCreateBounty }) => {
    const [query, setQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Keyboard trap
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                isOpen ? onClose() : null; // Toggle logic handled in parent mostly, but close here
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const filteredCommands = COMMANDS.filter(cmd => 
        cmd.label.toLowerCase().includes(query.toLowerCase())
    );

    const execute = (action: string) => {
        if (action === 'scan') onNavigate('scan');
        if (action === 'design') onNavigate('design');
        if (action === 'market') onNavigate('market');
        if (action === 'create-project') onCreateProject();
        if (action === 'create-bounty') onCreateBounty();
        onClose();
        setQuery('');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[20vh] px-4">
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div 
                        initial={{ scale: 0.95, opacity: 0, y: -20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: -20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="w-full max-w-lg bg-[#0f172a]/90 border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative z-10 backdrop-blur-xl"
                    >
                        <div className="flex items-center px-4 border-b border-white/5 p-3">
                            <SearchIcon className="w-5 h-5 text-slate-400 mr-3" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="What do you need?..."
                                className="flex-grow bg-transparent border-none text-white placeholder-slate-500 focus:outline-none text-lg font-sans"
                            />
                            <div className="text-[10px] text-slate-500 border border-white/10 rounded px-1.5 py-0.5 font-mono">ESC</div>
                        </div>
                        
                        <div className="max-h-[300px] overflow-y-auto p-2">
                            {filteredCommands.length > 0 ? (
                                <div className="space-y-1">
                                    {filteredCommands.map((cmd) => (
                                        <button
                                            key={cmd.id}
                                            onClick={() => execute(cmd.action)}
                                            className="w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-white/5 group transition-colors"
                                        >
                                            <div className="flex items-center">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 text-slate-400 group-hover:text-white group-hover:bg-ai-violet/20 mr-3 transition-colors`}>
                                                    <cmd.icon className="w-4 h-4" />
                                                </div>
                                                <span className="text-slate-300 group-hover:text-white font-medium">{cmd.label}</span>
                                            </div>
                                            <ChevronRightIcon className="w-4 h-4 text-slate-600 group-hover:text-slate-400 opacity-0 group-hover:opacity-100 transition-all" />
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-8 text-center text-slate-500 text-sm">
                                    No commands found.
                                </div>
                            )}
                        </div>
                        
                        <div className="px-4 py-2 bg-black/20 border-t border-white/5 flex justify-between items-center">
                            <span className="text-[10px] text-slate-500">Architex Command v2.0</span>
                            <div className="flex items-center space-x-2">
                                <span className="text-[10px] text-slate-500">Use arrows to navigate</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};