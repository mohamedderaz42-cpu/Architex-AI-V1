
import React from 'react';
import { LoaderIcon } from './icons/LoaderIcon';

export const Loader: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center min-h-[200px] animate-fade-in">
      <LoaderIcon className="w-10 h-10 text-ai-violet animate-spin mb-3" />
      <p className="text-sm text-slate-400 font-medium">Loading Module...</p>
    </div>
  );
};
