import React from 'react';
import { ProjectEntity } from '../core/schemas/entities';
import { GlassPanel } from './GlassPanel';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { MessageSquareIcon } from './icons/MessageSquareIcon';
import { NftIcon } from './icons/NftIcon';

interface ProjectCardProps {
  project: ProjectEntity;
  onCardClick: () => void;
  onMintClick: () => void;
}

const statusColors: { [key in ProjectEntity['status']]: string } = {
    Scanning: 'bg-pi-gold/20 text-pi-gold',
    Designing: 'bg-ai-violet/20 text-ai-violet',
    Sourcing: 'bg-eco-green/20 text-eco-green',
    Complete: 'bg-slate-500/20 text-slate-300',
};

const timeAgo = (date: string): string => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onCardClick, onMintClick }) => {
  return (
    <GlassPanel 
      className="p-4 rounded-2xl flex items-start space-x-4 hover:border-white/20 transition-colors duration-300 "
    >
      <div className="flex-grow cursor-pointer" onClick={onCardClick}>
        <div className="flex items-center">
            <h3 className="font-bold text-white text-lg">{project.name}</h3>
            {project.isNft && (
                <div className="ml-2 flex items-center px-2 py-0.5 rounded-full bg-ai-violet/30 text-ai-violet text-xs font-bold">
                    <NftIcon className="w-3 h-3 mr-1" />
                    NFT
                </div>
            )}
        </div>
        <div className="flex items-center text-xs text-slate-400 mt-1">
          <span className={`px-2 py-0.5 rounded-full font-semibold mr-2 ${statusColors[project.status]}`}>
            {project.status}
          </span>
          <span>• Updated {timeAgo(project.updatedAt)}</span>
        </div>
      </div>
      <div className="flex-shrink-0 flex flex-col items-end space-y-2">
        <div className="flex items-center space-x-3 h-8">
            {project.modificationCount && project.modificationCount > 0 && (
                <div className="flex items-center justify-center w-6 h-6 text-xs font-bold text-ai-violet bg-ai-violet/20 rounded-full" title={`${project.modificationCount} modifications`}>
                    {project.modificationCount}
                </div>
            )}
            {project.unreadMessages && project.unreadMessages > 0 && (
              <div className="relative">
                <MessageSquareIcon className="w-6 h-6 text-slate-400" />
                <span className="absolute -top-1 -right-2 flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                  {project.unreadMessages}
                </span>
              </div>
            )}
            <ChevronRightIcon className="w-6 h-6 text-slate-500" />
        </div>
        {!project.isNft && project.status === 'Complete' && (
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onMintClick();
                }}
                className="flex items-center px-3 py-1 bg-slate-700/50 border border-white/10 rounded-full text-xs font-semibold text-slate-300 backdrop-blur-sm hover:bg-ai-violet/30 hover:text-white transition-all duration-300"
            >
                <NftIcon className="w-4 h-4 mr-1.5" />
                Mint as NFT
            </button>
        )}
      </div>
    </GlassPanel>
  );
};