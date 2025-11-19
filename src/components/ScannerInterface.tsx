
import React, { useEffect, useRef, useState } from 'react';

interface ScannerInterfaceProps {
    instruction: string;
    progress: number;
    onCancel: () => void;
}

export const ScannerInterface: React.FC<ScannerInterfaceProps> = ({ instruction, progress, onCancel }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [cameraError, setCameraError] = useState(false);
    const [parallax, setParallax] = useState({ x: 0, y: 0 });

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

        // Gyroscope Parallax Handler
        const handleOrientation = (event: DeviceOrientationEvent) => {
            if (event.beta && event.gamma) {
                // Beta: -180 to 180 (x), Gamma: -90 to 90 (y)
                // Damping factor 0.5 for smoother feel
                setParallax({
                    x: event.gamma * 0.5,
                    y: event.beta * 0.5
                });
            }
        };
        
        if (window.DeviceOrientationEvent) {
             window.addEventListener('deviceorientation', handleOrientation);
        }

        return () => {
            // Cleanup: stop all tracks when component unmounts
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
            if (window.DeviceOrientationEvent) {
                window.removeEventListener('deviceorientation', handleOrientation);
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
                <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-slate-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                    </div>
                   <h3 className="text-white font-bold mb-2">Camera Access Denied</h3>
                   <p className="text-slate-400 text-sm mb-6">Please check your browser permissions to enable the Room Scanner.</p>
                </div>
            )}

            {/* Parallax Grid Overlay */}
            <div className="absolute inset-0 opacity-20" style={{
                transform: `translate(${parallax.x}px, ${parallax.y}px)`,
                transition: 'transform 0.1s ease-out',
                backgroundImage: 'linear-gradient(to right, #FDB300 1px, transparent 1px), linear-gradient(to bottom, #FDB300 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                maskImage: 'radial-gradient(circle at center, transparent 30%, black 100%)',
                width: '120%', // Larger to account for movement
                height: '120%',
                left: '-10%',
                top: '-10%'
            }}></div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-brand-dark/50 pointer-events-none"></div>
            
            {!cameraError && (
                <>
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
                </>
            )}
            
            <button
                onClick={onCancel}
                className="absolute bottom-6 px-6 py-2 bg-red-500/20 border border-red-500/50 rounded-full text-sm font-semibold text-red-100 backdrop-blur-md hover:bg-red-500/40 transition-all duration-300 z-20"
            >
                {cameraError ? 'Go Back' : 'Cancel Scan'}
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
