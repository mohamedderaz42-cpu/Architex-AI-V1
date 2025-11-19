
import React, { useState } from 'react';
import { GlassPanel } from './GlassPanel';
import { DesignIcon } from './icons/DesignIcon';
import { PlusIcon } from './icons/PlusIcon';

interface CreateProjectModalProps {
    onConfirm: (data: { roomType: string; style: string; prompt: string }) => Promise<void>;
    onCancel: () => void;
}

const ROOM_TYPES = ['Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Office', 'Dining Room'];
const STYLES = ['Modern', 'Industrial', 'Bohemian', 'Scandinavian', 'Minimalist', 'Art Deco'];

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ onConfirm, onCancel }) => {
    const [roomType, setRoomType] = useState(ROOM_TYPES[0]);
    const [style, setStyle] = useState(STYLES[0]);
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleSubmit = async () => {
        setIsGenerating(true);
        try {
            await onConfirm({ roomType, style, prompt });
            onCancel();
        } catch (error) {
            console.error("Generation failed", error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-brand-dark/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <GlassPanel className="w-full max-w-sm p-6 text-center animate-fade-in">
                <DesignIcon className="w-16 h-16 mx-auto text-ai-violet mb-4" />
                <h2 className="text-2xl font-bold text-white">Create AI Design</h2>
                <p className="text-slate-300 mt-2 text-sm">
                    Describe your dream space and let our AI architect build it.
                </p>

                <div className="mt-6 text-left space-y-3">
                    <div>
                        <label className="text-xs text-slate-400 font-semibold ml-1">Room Type</label>
                        <select value={roomType} onChange={e => setRoomType(e.target.value)} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-ai-violet/50">
                            {ROOM_TYPES.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                    
                    <div>
                        <label className="text-xs text-slate-400 font-semibold ml-1">Style</label>
                        <select value={style} onChange={e => setStyle(e.target.value)} className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-ai-violet/50">
                            {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="text-xs text-slate-400 font-semibold ml-1">Additional Details</label>
                        <textarea 
                            placeholder="E.g., High ceilings, large windows, gold accents..." 
                            value={prompt} 
                            onChange={e => setPrompt(e.target.value)} 
                            className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-ai-violet/50 h-24 resize-none"
                        ></textarea>
                    </div>
                </div>
                
                <div className="mt-6 flex flex-col space-y-3">
                    <button
                        onClick={handleSubmit}
                        disabled={isGenerating}
                        className="group flex items-center justify-center w-full px-6 py-3 bg-ai-violet/80 border border-ai-violet/90 rounded-full text-lg font-semibold text-white backdrop-blur-md hover:bg-ai-violet transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isGenerating ? (
                             <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <PlusIcon className="w-5 h-5 mr-2" />
                        )}
                        {isGenerating ? 'Generating...' : 'Generate Design'}
                    </button>
                    <button
                        onClick={onCancel}
                        disabled={isGenerating}
                        className="w-full py-2 text-slate-400 font-semibold hover:text-white transition-colors duration-300 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                </div>
            </GlassPanel>
        </div>
    );
};
