import React from 'react';

export const MarketIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M20.58 10.39a.5.5 0 0 0-.42-.8H14a1 1 0 0 1-1-1V2.5a.5.5 0 0 0-.89-.34L4 10.35a.5.5 0 0 0 .1.7l8.2 3.8a.5.5 0 0 0 .6-.1l5.68-6.36Z" />
    <path d="M14 17.5V14l-4 1.84V19l4 1.5Z" />
    <path d="m18 12.5-4 1.84V18l4-1.5Z" />
    <path d="M21.42 16.62a2.48 2.48 0 0 0-3.5 0l-1.03 1.03a1 1 0 1 0 1.42 1.42l1.03-1.03a2.48 2.48 0 0 0 2.08-4.14Z" />
  </svg>
);