import React, { useEffect, useRef, useState } from 'react';

interface ScannerInterfaceProps {
    instruction: string;
    progress: number;
    onCancel: () => void;
}

export const ScannerInterface: React.FC<ScannerInterfaceProps> = ({ instruction, progress, onCancel }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [cameraError, setCameraError] = useState(false);

    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ 
                    video: { facingMode: 'environment' } // Prefer back camera on mobile
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
                setCameraError(true);
            }
        };

        startCamera();

        return () => {
            // Cleanup: stop all tracks when component unmounts
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const strokeWidth = 8;
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="w-full h-full flex flex-col items-center justify-center relative bg-black rounded-3xl overflow-hidden">
            {/* Camera Feed Layer */}
            {!cameraError ? (
                <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
            ) : (
                <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                   <span className="text-slate-500 text-xs">Camera unavailable</span>
                </div>
            )}

            {/* UI Overlay Layer */}
            <div className="absolute inset-0 bg-grid-pi-gold opacity-20" style={{
                backgroundImage: 'linear-gradient(to right, #FDB300 1px, transparent 1px), linear-gradient(to bottom, #FDB300 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                maskImage: 'radial-gradient(circle at center, transparent 30%, black 100%)'
            }}></div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-brand-dark/50"></div>
            
            <div className="relative w-48 h-48 flex items-center justify-center z-10">
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
                        className="stroke-pi-gold drop-shadow-[0_0_10px_rgba(253,179,0,0.8)]"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
                    />
                </svg>
                <div className="text-center">
                    <div className="text-4xl font-bold text-pi-gold drop-shadow-md">{Math.round(progress)}%</div>
                </div>
                
                {/* Scanning Line Animation */}
                <div className="absolute w-full h-1 bg-pi-gold/50 blur-md animate-scan-line top-1/2 left-0"></div>
            </div>

            <div className="mt-8 p-4 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 z-10 max-w-xs">
                <p className="text-lg text-center text-white font-medium">
                    {instruction}
                </p>
            </div>
            
            <button
                onClick={onCancel}
                className="absolute bottom-6 px-6 py-2 bg-red-500/20 border border-red-500/50 rounded-full text-sm font-semibold text-red-100 backdrop-blur-md hover:bg-red-500/40 transition-all duration-300 z-20"
            >
                Cancel Scan
            </button>

            <style>{`
                @keyframes scan-line {
                    0% { transform: translateY(-80px); opacity: 0; }
                    50% { opacity: 1; }
                    100% { transform: translateY(80px); opacity: 0; }
                }
                .animate-scan-line {
                    animation: scan-line 2s linear infinite;
                }
            `}</style>
        </div>
    );
};