import React from 'react';

export const GavelIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
        <path d="m14 13-7.5 7.5"/>
        <path d="m18 9-7.5 7.5"/>
        <path d="m3 11 9-9"/>
        <path d="m15 4-8.5 8.5"/>
        <path d="m21 15-8.5 8.5"/>
    </svg>
);