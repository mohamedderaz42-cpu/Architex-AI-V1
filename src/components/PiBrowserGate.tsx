
import React, { useEffect, useState } from 'react';
import { GlassPanel } from './GlassPanel';
import { ArchitexLogo } from './icons/ArchitexLogo';

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

const WrenchIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
    </svg>
);

export const PiBrowserGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPiBrowser, setIsPiBrowser] = useState<boolean | null>(null);
  const [bypass, setBypass] = useState(false);

  useEffect(() => {
    // Check if Pi SDK is loaded or if user agent suggests Pi Browser
    const checkEnvironment = () => {
      // We consider it Pi Browser if window.Pi exists OR if we are bypassing check
      const isPi = window.Pi !== undefined || navigator.userAgent.includes('PiBrowser');
      setIsPiBrowser(isPi);
    };
    
    checkEnvironment();
  }, []);

  if (isPiBrowser === null) return null; // Loading state

  // If it's Pi Browser OR the user has clicked "Developer Bypass"
  if (isPiBrowser || bypass) {
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
            To access the decentralized features, wallet, and secure marketplace, this application is designed to run within the <span className="text-pi-gold font-bold">Pi Browser</span>.
        </p>

        <div className="bg-slate-900/60 p-4 rounded-xl border border-white/10 mb-6 text-left flex items-start">
            <WarningIcon className="w-6 h-6 text-pi-gold mr-3 flex-shrink-0" />
            <div>
                <h3 className="text-sm font-bold text-white">Environment Check</h3>
                <p className="text-xs text-slate-400 mt-1">
                    Pi Network SDK not detected. If you are a user, please open this page in the Pi Browser.
                </p>
            </div>
        </div>

        <div className="space-y-3">
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-pi-gold to-orange-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <button 
                    onClick={() => {
                        // Try to open deep link, fallback to copy
                        window.location.href = "pi://architex.app"; 
                        navigator.clipboard.writeText("pi://architex.app");
                        alert("Deep link copied! Paste it in Pi Browser.");
                    }}
                    className="relative w-full py-4 bg-slate-900 ring-1 ring-white/10 rounded-lg leading-none flex items-center justify-center space-x-2"
                >
                    <span className="text-white font-bold">Open in Pi Browser</span>
                    <LinkIcon className="w-4 h-4 text-pi-gold" />
                </button>
            </div>
            
            {/* Enhanced Developer Bypass Button */}
            <button 
                onClick={() => setBypass(true)}
                className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center space-x-2 text-slate-300 transition-colors"
            >
                <WrenchIcon className="w-4 h-4" />
                <span className="text-xs font-bold">Developer Mode: Continue in Standard Browser</span>
            </button>
        </div>
        
      </GlassPanel>
    </div>
  );
};
