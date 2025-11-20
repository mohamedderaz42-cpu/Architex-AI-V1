
import React, { useState, useEffect } from 'react';
import { WifiOffIcon } from './icons/WifiOffIcon';
import { GlassPanel } from './GlassPanel';

export const OfflineNotice: React.FC = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (isOnline) return null;

    return (
        <div className="fixed top-safe left-4 right-4 z-[200] animate-slide-down mt-4">
            <GlassPanel className="bg-red-900/90 border-red-500/50 p-3 flex items-center justify-center space-x-3 shadow-2xl backdrop-blur-xl">
                <WifiOffIcon className="w-5 h-5 text-red-200 animate-pulse" />
                <span className="text-white font-bold text-sm">No Internet Connection. Reconnecting...</span>
            </GlassPanel>
        </div>
    );
};
