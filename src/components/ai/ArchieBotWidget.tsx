
import React, { useState, useEffect, useRef } from 'react';
import { ProactiveEngine, BotTrigger } from '../../core/ai/ProactiveEngine';
import { BotIcon } from '../icons/BotIcon';
import { XCircleIcon } from '../icons/XCircleIcon';
import { ZapIcon } from '../icons/ZapIcon';

export const ArchieBotWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentTrigger, setCurrentTrigger] = useState<BotTrigger | null>(null);
    const [hasUnread, setHasUnread] = useState(false);
    
    // Audio ref for notification sound (optional)
    // const audioRef = useRef(new Audio('/notification.mp3'));

    useEffect(() => {
        const unsubscribe = ProactiveEngine.subscribe((trigger) => {
            setCurrentTrigger(trigger);
            setIsOpen(true);
            setHasUnread(true);
            // audioRef.current?.play().catch(() => {}); // Play sound if policy allows
        });
        return () => unsubscribe();
    }, []);

    const handleAction = (actionId: string) => {
        ProactiveEngine.executeAction(actionId);
        setIsOpen(false);
        setHasUnread(false);
    };

    const handleDismiss = () => {
        setIsOpen(false);
        setHasUnread(false);
    };

    const toggleOpen = () => {
        setIsOpen(!isOpen);
        if (!isOpen) setHasUnread(false);
    };

    return (
        <div className="fixed bottom-24 right-4 z-[200] flex flex-col items-end pointer-events-none">
            
            {/* Expanded Chat Bubble */}
            {isOpen && currentTrigger && (
                <div className="mb-4 mr-2 w-72 bg-slate-900/90 backdrop-blur-xl border border-ai-violet/40 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto animate-slide-up origin-bottom-right">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-ai-violet/20 to-purple-900/20 p-3 border-b border-white/10 flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <BotIcon className="w-5 h-5 text-ai-violet" />
                            <span className="font-bold text-white text-sm">Archie AI</span>
                        </div>
                        <button onClick={handleDismiss} className="text-slate-400 hover:text-white">
                            <XCircleIcon className="w-5 h-5" />
                        </button>
                    </div>
                    
                    {/* Body */}
                    <div className="p-4">
                        <p className="text-sm text-slate-200 leading-relaxed">
                            {currentTrigger.message}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="p-3 bg-black/20 flex flex-col space-y-2">
                        {currentTrigger.actions.map((action, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleAction(action.actionId)}
                                className={`w-full py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                                    action.style === 'primary' 
                                    ? 'bg-ai-violet hover:bg-ai-violet/80 text-white shadow-glow-violet' 
                                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                                }`}
                            >
                                {action.style === 'primary' && <ZapIcon className="w-3 h-3 mr-1.5" />}
                                {action.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Floating Trigger Button */}
            <button 
                onClick={toggleOpen}
                className="pointer-events-auto group relative w-14 h-14 bg-slate-900 border-2 border-ai-violet/50 rounded-full shadow-[0_0_20px_rgba(139,92,246,0.3)] flex items-center justify-center hover:scale-110 hover:border-ai-violet transition-all duration-300"
            >
                <div className="absolute inset-0 bg-ai-violet/20 rounded-full animate-pulse-slow"></div>
                <BotIcon className="w-7 h-7 text-white relative z-10" />
                
                {/* Unread Badge */}
                {hasUnread && !isOpen && (
                    <span className="absolute top-0 right-0 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pi-gold opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-pi-gold border border-black"></span>
                    </span>
                )}
            </button>
        </div>
    );
};
