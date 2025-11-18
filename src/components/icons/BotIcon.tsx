import React from 'react';

export const BotIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        {...props}
    >
        <path d="M12 8V4H8"/>
        <rect x="4" y="8" width="16" height="12" rx="2"/>
        <path d="M8 12h8"/>
        <path d="M9 16h6"/>
        <path d="M16 4h-1.5a2.5 2.5 0 0 0 0 5H16"/>
    </svg>
);