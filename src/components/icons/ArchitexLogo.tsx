import React from 'react';

export const ArchitexLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#A78BFA', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#8B5CF6', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <path d="M50 10 L90 90 H10 L50 10Z" stroke="url(#grad1)" strokeWidth="5" />
    <path d="M30 90 L50 50 L70 90" stroke="white" strokeOpacity="0.5" strokeWidth="3" />
    <circle cx="50" cy="45" r="5" fill="white" />
  </svg>
);