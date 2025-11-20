import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface ScannerInterfaceProps {
    instruction: string;
    progress: number;
    onCancel: () => void;
}

// Extend Window definition for iOS 13+ permission
interface DeviceOrientationEventiOS extends DeviceOrientationEvent {
    requestPermission?: () => Promise<'granted' | 'denied'>;
}

export const ScannerInterface: React.FC<ScannerInterfaceProps> = ({ instruction, progress, onCancel }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [cameraError, setCameraError] = useState(false);
    const [parallax, setParallax] = useState({ x: 0, y: 0 });
    const [showPermissionButton, setShowPermissionButton] = useState(false);
    const lastProgressRef = useRef(0);

    // Haptic Feedback Effect
    useEffect(() => {
        // Trigger haptic on significant progress steps (every 10%)
        if (progress > lastProgressRef.current + 10) {
            if (navigator.vibrate) {
                navigator.vibrate(15); // Short, crisp vibration
            }
            lastProgressRef.current = progress;
        }
    }, [progress]);

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

        // Check if we are on iOS 13+ which requires permission
        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            setShowPermissionButton(true);
        } else {
            window.addEventListener('deviceorientation', handleOrientation);
        }

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
            window.removeEventListener('deviceorientation', handleOrientation);
        };
    }, []);

    const handleOrientation = (event: DeviceOrientationEvent) => {
        if (event.beta && event.gamma) {
            setParallax({
                x: Math.min(Math.max(event.gamma * 0.5, -20), 20),
                y: Math.min(Math.max(event.beta * 0.5, -20), 20)
            });
        }
    };

    const requestMotionPermission = async () => {
        const requestPermission = (DeviceOrientationEvent as unknown as DeviceOrientationEventiOS).requestPermission;
        if (typeof requestPermission === 'function') {
            try {
                const response = await requestPermission();
                if (response === 'granted') {
                    setShowPermissionButton(false);
                    window.addEventListener('deviceorientation', handleOrientation);
                }
            } catch (e) { console.error(e); }
        }
    };

    // Visual SLAM Simulation Loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        const points: {x: number, y: number, age: number}[] = [];

        const render = () => {
            if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
                canvas.width = canvas.clientWidth;
                canvas.height = canvas.clientHeight;
            }
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (Math.random() > 0.5) {
                for (let i = 0; i < 3; i++) {
                    points.push({
                        x: Math.random() * canvas.width,
                        y: Math.random() * canvas.height,
                        age: 0
                    });
                }
            }

            ctx.fillStyle = '#10B981';
            for (let i = points.length - 1; i >= 0; i--) {
                const p = points[i];
                p.age++;
                if (p.age > 30) { points.splice(i, 1); continue; }
                const opacity = 1 - (p.age / 30);
                ctx.globalAlpha = opacity;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1.0;

            // LiDAR Grid Line
            const time = Date.now() / 1000;
            const scanY = (time % 2) * canvas.height;
            ctx.strokeStyle = 'rgba(253, 179, 0, 0.3)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, scanY);
            ctx.lineTo(canvas.width, scanY);
            ctx.stroke();

            animationFrameId = requestAnimationFrame(render);
        };
        render();
        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="w-full h-full flex flex-col items-center justify-center relative bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10">
            {!cameraError ? (
                <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover opacity-80" />
            ) : (
                <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-slate-500"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                    </div>
                   <h3 className="text-white font-bold mb-2">Camera Access Denied</h3>
                   <p className="text-slate-400 text-sm mb-6">Please check your browser permissions.</p>
                </div>
            )}

            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

            {/* AR HUD Overlay */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
                transform: `translate(${parallax.x}px, ${parallax.y}px)`,
                transition: 'transform 0.1s ease-out',
                backgroundImage: 'linear-gradient(to right, #FDB300 1px, transparent 1px), linear-gradient(to bottom, #FDB300 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                width: '120%', height: '120%', left: '-10%', top: '-10%'
            }}></div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-brand-dark/50 pointer-events-none"></div>
            
            {!cameraError && (
                <>
                    {showPermissionButton && (
                        <button onClick={requestMotionPermission} className="absolute top-4 right-4 z-50 bg-black/60 text-white text-xs font-bold px-3 py-2 rounded-full border border-white/20 hover:bg-black/80 transition-all pointer-events-auto">Enable Motion Sensors</button>
                    )}

                    <div className="relative w-48 h-48 flex items-center justify-center z-10">
                        <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                            <circle cx="100" cy="100" r={radius} strokeWidth="8" className="stroke-pi-gold/10" fill="transparent" />
                            <circle cx="100" cy="100" r={radius} strokeWidth="8" className="stroke-pi-gold drop-shadow-[0_0_15px_rgba(253,179,0,0.6)]" fill="transparent" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.5s ease-out' }} />
                        </svg>
                        <div className="text-center">
                            <motion.div 
                                key={Math.round(progress)}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-4xl font-bold text-pi-gold drop-shadow-md"
                            >
                                {Math.round(progress)}%
                            </motion.div>
                        </div>
                    </div>

                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="mt-8 p-4 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 z-10 max-w-xs"
                    >
                        <p className="text-lg text-center text-white font-medium animate-pulse">{instruction}</p>
                    </motion.div>
                </>
            )}
            
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onCancel}
                className="absolute bottom-6 px-8 py-3 bg-red-500/20 border border-red-500/50 rounded-full text-sm font-bold text-red-100 backdrop-blur-md hover:bg-red-500/40 transition-all z-20 pointer-events-auto"
            >
                {cameraError ? 'Go Back' : 'Stop Scan'}
            </motion.button>
        </div>
    );
};