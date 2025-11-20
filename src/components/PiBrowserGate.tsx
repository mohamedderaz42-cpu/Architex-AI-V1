
import React, { useEffect, useState } from 'react';
import { GlassPanel } from './GlassPanel';
import { ArchitexLogo } from './icons/ArchitexLogo';
import { QRCodeIcon } from './icons/QRCodeIcon'; // Assuming you might want a QR icon, or use a generic one
import { ExternalLinkIcon } from './icons/ExternalLinkIcon'; // New icon needed below

// Inline simple icons to avoid dependency issues if not present
const WarningIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

const LinkIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
        <polyline points="15 3 21 3 21 9"></polyline>
        <line x1="10" y1="14" x2="21" y2="3"></line>
    </svg>
);

export const PiBrowserGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPiBrowser, setIsPiBrowser] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if Pi SDK is loaded or if user agent suggests Pi Browser
    const checkEnvironment = () => {
      const isPi = window.Pi !== undefined || navigator.userAgent.includes('PiBrowser');
      setIsPiBrowser(isPi);
    };
    
    checkEnvironment();
  }, []);

  if (isPiBrowser === null) return null; // Loading state

  if (isPiBrowser) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen w-full bg-brand-dark flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,_#2e1065_0%,_#030712_100%)] opacity-50"></div>
      
      <GlassPanel className="w-full max-w-md p-8 text-center relative z-10 border-pi-gold/30">
        <div className="w-20 h-20 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10 shadow-glow-gold">
          <ArchitexLogo className="w-12 h-12" />
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-2">Welcome to Architex</h1>
        <p className="text-slate-400 mb-8">
            To access the decentralized features, wallet, and secure marketplace, this application must be opened within the <span className="text-pi-gold font-bold">Pi Browser</span>.
        </p>

        <div className="bg-slate-900/60 p-4 rounded-xl border border-white/10 mb-8 text-left flex items-start">
            <WarningIcon className="w-6 h-6 text-pi-gold mr-3 flex-shrink-0" />
            <div>
                <h3 className="text-sm font-bold text-white">Environment Check Failed</h3>
                <p className="text-xs text-slate-400 mt-1">
                    We could not detect the Pi Network SDK. Please copy the link below and paste it into the Pi Browser address bar.
                </p>
            </div>
        </div>

        <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-pi-gold to-orange-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <button 
                onClick={() => {
                    window.location.href = "pi://architex.app"; // Deep link attempt
                    // Fallback copy
                    navigator.clipboard.writeText(window.location.href);
                    alert("Link copied! Open Pi Browser and paste it.");
                }}
                className="relative w-full py-4 bg-slate-900 ring-1 ring-white/10 rounded-lg leading-none flex items-center justify-center space-x-2"
            >
                <span className="text-white font-bold">Open in Pi Browser</span>
                <LinkIcon className="w-4 h-4 text-pi-gold" />
            </button>
        </div>
        
        <p className="text-[10px] text-slate-600 mt-6">
            If you are a developer testing in a standard browser, ensure Sandbox mode is active.
        </p>
      </GlassPanel>
    </div>
  );
};
