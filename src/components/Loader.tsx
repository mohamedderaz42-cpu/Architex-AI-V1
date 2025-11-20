
import React from 'react';
import { LoaderIcon } from './icons/LoaderIcon';

export const Loader: React.FC = () => (
    <div className="flex items-center justify-center h-full w-full">
        <LoaderIcon className="w-8 h-8 text-ai-violet animate-spin" />
    </div>
);
