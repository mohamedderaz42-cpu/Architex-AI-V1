import React from 'react';
import { BotIcon } from './icons/BotIcon';

interface ArchieBotProps {
    message: string;
}

export const ArchieBot: React.FC<ArchieBotProps> = ({ message }) => {
    return (
        <div className="mt-4 flex items-start space-x-3 animate-fade-in">
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-ai-violet/20 text-ai-violet border border-ai-violet/50">
                <BotIcon className="w-5 h-5" />
            </div>
            <div className="flex-grow p-3 bg-slate-800/50 rounded-lg rounded-tl-none border border-white/10">
                <p className="text-sm text-slate-300">
                    <span className="font-bold text-ai-violet mr-1">ArchieBot:</span>
                    {message}
                </p>
            </div>
        </div>
    );
};