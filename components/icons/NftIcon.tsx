
import React from 'react';

export const NftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
        <path d="M10 3h4"/>
        <path d="M12 3v2.35"/>
        <path d="m19 9-7 7-7-7"/>
        <path d="M12 21V16"/>
        <path d="M5 9h14"/>
        <path d="M3 9h2"/>
        <path d="M19 9h2"/>
    </svg>
);
