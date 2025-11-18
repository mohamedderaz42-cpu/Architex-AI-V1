import React from 'react';

interface ScannerInterfaceProps {
    instruction: string;
    progress: number;
    onCancel: () => void;
}

export const ScannerInterface: React.FC<ScannerInterfaceProps> = ({ instruction, progress, onCancel }) => {
    const strokeWidth = 8;
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="w-full h-full flex flex-col items-center justify-center relative bg-black/30 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-grid-pi-gold opacity-10" style={{
                backgroundImage: 'linear-gradient(to right, #FDB300 1px, transparent 1px), linear-gradient(to bottom, #FDB300 1px, transparent 1px)',
                backgroundSize: '20px 20px',
            }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-brand-dark"></div>
            
            <div className="relative w-48 h-48 flex items-center justify-center">
                <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                    <circle
                        cx="100"
                        cy="100"
                        r={radius}
                        strokeWidth={strokeWidth}
                        className="stroke-pi-gold/10"
                        fill="transparent"
                    />
                    <circle
                        cx="100"
                        cy="100"
                        r={radius}
                        strokeWidth={strokeWidth}
                        className="stroke-pi-gold"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
                    />
                </svg>
                <div className="text-center">
                    <div className="text-4xl font-bold text-pi-gold">{Math.round(progress)}%</div>
                </div>
            </div>

            <p className="mt-8 text-lg text-center text-slate-200 max-w-xs z-10 font-medium">
                {instruction}
            </p>
            
            <button
                onClick={onCancel}
                className="absolute bottom-6 px-6 py-2 bg-slate-700/50 border border-white/10 rounded-full text-sm font-semibold text-slate-300 backdrop-blur-sm hover:bg-red-500/30 hover:text-white transition-all duration-300"
            >
                Cancel Scan
            </button>
        </div>
    );
};