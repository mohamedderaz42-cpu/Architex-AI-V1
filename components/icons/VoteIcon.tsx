
import React from 'react';

export const VoteIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
        <path d="M15 21v-4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v4"/>
        <path d="M9 10h.01"/>
        <path d="M15 10h.01"/>
        <path d="M12 10h.01"/>
        <path d="M6 10a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v4a2 2 0 0 1-2 2h-1.172a1 1 0 0 0-.707.293l-1.414 1.414a1 1 0 0 1-1.414 0l-1.414-1.414A1 1 0 0 0 8.172 16H7a2 2 0 0 1-2-2v-4Z"/>
    </svg>
);
