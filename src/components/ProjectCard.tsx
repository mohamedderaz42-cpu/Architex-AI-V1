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
    Scanning: 'bg-pi-gold/10 text-pi-gold border-pi-gold/20',
    Designing: 'bg-ai-violet/10 text-ai-violet border-ai-violet/20',
    Sourcing: 'bg-eco-green/10 text-eco-green border-eco-green/20',
    Complete: 'bg-white/5 text-slate-300 border-white/10',
};

const timeAgo = (date: string): string => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "m";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m";
    return "now";
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onCardClick, onMintClick }) => {
  return (
    <GlassPanel 
      className="p-4 rounded-3xl flex items-start space-x-4 hover:border-white/20 hover:bg-white/5 transition-all duration-300 group cursor-pointer"
    >
      <div className="flex-grow" onClick={onCardClick}>
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
                <h3 className="font-bold text-white text-lg tracking-tight group-hover:text-ai-violet transition-colors">{project.name}</h3>
                {project.isNft && (
                    <div className="flex items-center px-2 py-0.5 rounded-full bg-ai-violet/20 border border-ai-violet/30 text-ai-violet text-[10px] font-bold tracking-wider uppercase">
                        NFT
                    </div>
                )}
            </div>
        </div>
        <div className="flex items-center text-xs mt-2">
          <span className={`px-2.5 py-1 rounded-full font-mono text-[10px] font-semibold uppercase tracking-wide border ${statusColors[project.status]}`}>
            {project.status}
          </span>
          <span className="text-slate-500 ml-2 font-mono text-[10px]">{timeAgo(project.updatedAt)} ago</span>
        </div>
      </div>
      
      <div className="flex-shrink-0 flex flex-col items-end space-y-2">
        <div className="flex items-center space-x-2 h-8">
            {project.modificationCount && project.modificationCount > 0 && (
                <div className="flex items-center justify-center w-6 h-6 text-[10px] font-bold font-mono text-ai-violet bg-ai-violet/10 border border-ai-violet/20 rounded-full" title="Versions">
                    v{project.modificationCount}
                </div>
            )}
            {project.unreadMessages && project.unreadMessages > 0 && (
              <div className="relative">
                <MessageSquareIcon className="w-5 h-5 text-slate-400" />
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-3 h-3 text-[8px] font-bold text-white bg-red-500 rounded-full">
                  {project.unreadMessages}
                </span>
              </div>
            )}
        </div>
        {!project.isNft && project.status === 'Complete' && (
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onMintClick();
                }}
                className="flex items-center px-3 py-1 bg-white/5 border border-white/10 hover:border-ai-violet/50 hover:bg-ai-violet/10 rounded-full text-[10px] font-bold text-slate-300 hover:text-white backdrop-blur-sm transition-all"
            >
                <NftIcon className="w-3 h-3 mr-1" />
                MINT
            </button>
        )}
      </div>
      
      <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
        <ChevronRightIcon className="w-5 h-5 text-slate-400" />
      </div>
    </GlassPanel>
  );
};