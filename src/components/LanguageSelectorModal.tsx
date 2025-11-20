
import React from 'react';
import { GlassPanel } from './GlassPanel';
import { useLanguage } from '../core/i18n/LanguageContext';
import { languages } from '../core/i18n/translations';
import { GlobeIcon } from './icons/GlobeIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

interface LanguageSelectorModalProps {
    onClose: () => void;
}

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({ onClose }) => {
    const { language, setLanguage } = useLanguage();

    return (
        <div className="fixed inset-0 bg-brand-dark/90 backdrop-blur-md flex items-center justify-center z-[150] p-4">
            <GlassPanel className="w-full max-w-sm p-6 animate-fade-in">
                <div className="text-center mb-6">
                    <GlobeIcon className="w-12 h-12 mx-auto text-ai-violet mb-2" />
                    <h2 className="text-2xl font-bold text-white">Select Language</h2>
                    <p className="text-sm text-slate-400">Choose your preferred interface language.</p>
                </div>

                <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto custom-scrollbar pr-1">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => {
                                setLanguage(lang.code);
                                onClose();
                            }}
                            className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${
                                language === lang.code
                                    ? 'bg-ai-violet/20 border-ai-violet text-white shadow-glow-violet'
                                    : 'bg-slate-900/50 border-white/10 text-slate-400 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            <span className="text-lg font-bold mb-1">{lang.nativeName}</span>
                            <span className="text-[10px] uppercase tracking-wider opacity-70">{lang.name}</span>
                            {language === lang.code && (
                                <div className="mt-2 text-eco-green">
                                    <CheckCircleIcon className="w-4 h-4" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                <button
                    onClick={onClose}
                    className="w-full mt-6 py-3 bg-slate-700/50 rounded-full text-white font-bold hover:bg-slate-600 transition-colors"
                >
                    Close
                </button>
            </GlassPanel>
        </div>
    );
};
