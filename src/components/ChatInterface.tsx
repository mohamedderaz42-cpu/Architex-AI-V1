
import React, { useState, useEffect, useRef } from 'react';
import { GlassPanel } from './GlassPanel';
import { MessageEntity } from '../core/schemas/entities';
import { UserIcon } from './icons/UserIcon';
import { BotIcon } from './icons/BotIcon';

interface ChatInterfaceProps {
    contextId: string; // Project ID or Order ID
    title: string;
    messages: MessageEntity[];
    currentUserId: string;
    onSendMessage: (text: string) => void;
    onClose: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ contextId, title, messages, currentUserId, onSendMessage, onClose }) => {
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (!inputText.trim()) return;
        onSendMessage(inputText);
        setInputText('');
    };

    return (
        <div className="fixed inset-0 z-[90] flex flex-col bg-brand-dark/95 md:absolute md:right-0 md:top-0 md:bottom-0 md:w-96 md:border-l md:border-white/10 animate-slide-in-right">
            {/* Header */}
            <div className="flex-shrink-0 p-4 border-b border-white/10 bg-slate-900/50 backdrop-blur-md flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-white">Communication Hub</h3>
                    <p className="text-xs text-slate-400 truncate max-w-[200px]">Ref: {title}</p>
                </div>
                <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-900/20">
                {messages.length === 0 && (
                    <div className="text-center text-slate-500 mt-10">
                        <p>No messages yet.</p>
                        <p className="text-xs">Start the conversation related to this item.</p>
                    </div>
                )}
                
                {messages.map((msg) => {
                    const isMe = msg.senderId === currentUserId;
                    const isSystem = msg.isSystem;
                    
                    if (isSystem) {
                        return (
                            <div key={msg.id} className="flex justify-center my-2">
                                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded-full">
                                    {msg.text}
                                </span>
                            </div>
                        );
                    }

                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            {!isMe && (
                                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center mr-2 border border-white/10 flex-shrink-0">
                                    {msg.senderName === 'ArchieBot' ? <BotIcon className="w-5 h-5 text-ai-violet" /> : <UserIcon className="w-4 h-4 text-slate-300" />}
                                </div>
                            )}
                            <div className={`max-w-[75%] p-3 rounded-2xl text-sm ${
                                isMe 
                                ? 'bg-ai-violet text-white rounded-tr-none' 
                                : 'bg-slate-800 text-slate-200 rounded-tl-none border border-white/5'
                            }`}>
                                {!isMe && <p className="text-[10px] text-slate-400 mb-1 font-bold">{msg.senderName}</p>}
                                {msg.text}
                                <p className={`text-[9px] mt-1 text-right ${isMe ? 'text-white/60' : 'text-slate-500'}`}>
                                    {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </p>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="flex-shrink-0 p-3 bg-slate-900 border-t border-white/10">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type a message..."
                        className="w-full bg-slate-800 border border-white/10 rounded-full pl-4 pr-12 py-3 text-white focus:outline-none focus:border-ai-violet/50 transition-all"
                    />
                    <button 
                        onClick={handleSend}
                        disabled={!inputText.trim()}
                        className="absolute right-2 p-2 bg-ai-violet rounded-full text-white hover:bg-ai-violet/80 disabled:opacity-50 disabled:bg-slate-700 transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5m0 0l-7 7m7-7l7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};
