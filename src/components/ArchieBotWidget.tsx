
import React, { useState, useEffect } from 'react';
import { BotIcon } from './icons/BotIcon';

interface ArchieBotWidgetProps {
    tip: string;
    onClick: () => void;
}

export const ArchieBotWidget: React.FC<ArchieBotWidgetProps> = ({ tip, onClick }) => {
    const [showBubble, setShowBubble] = useState(false);

    useEffect(() => {
        // Show tip bubble periodically or when tip changes
        if (tip) {
            setShowBubble(true);
            const timer = setTimeout(() => setShowBubble(false), 8000); // Hide after 8s
            return () => clearTimeout(timer);
        }
    }, [tip]);

    return (
        <div className="fixed bottom-24 right-4 z-[60] flex flex-col items-end animate-fade-in-up pointer-events-none">
            {showBubble && (
                <div className="mb-2 mr-2 bg-white text-brand-dark p-3 rounded-2xl rounded-br-none shadow-xl max-w-[200px] text-xs font-medium border border-ai-violet/20 relative pointer-events-auto">
                    {tip}
                    <div className="absolute -bottom-1.5 right-4 w-3 h-3 bg-white transform rotate-45"></div>
                </div>
            )}
            <button 
                onClick={onClick}
                className="w-14 h-14 bg-gradient-to-br from-ai-violet to-indigo-600 rounded-full shadow-glow-violet flex items-center justify-center text-white hover:scale-110 transition-transform pointer-events-auto border-2 border-white/20"
            >
                <BotIcon className="w-8 h-8" />
            </button>
        </div>
    );
};
