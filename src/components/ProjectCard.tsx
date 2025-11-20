import React from 'react';
import { ProjectEntity } from '../core/schemas/entities';
import { GlassPanel } from './GlassPanel';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { MessageSquareIcon } from './icons/MessageSquareIcon';
import { NftIcon } from './icons/NftIcon';
import { ThumbsUpIcon } from './icons/ThumbsUpIcon';

interface ProjectCardProps {
  project: ProjectEntity;
  onCardClick: () => void;
  onMintClick: () => void;
}

const statusColors: { [key in ProjectEntity['status']]: string } = {
    Scanning: 'text-pi-gold bg-pi-gold/10 border-pi-gold/20',
    Designing: 'text-ai-violet bg-ai-violet/10 border-ai-violet/20',
    Sourcing: 'text-eco-green bg-eco-green/10 border-eco-green/20',
    Complete: 'text-blue-300 bg-blue-500/10 border-blue-500/20',
};

const timeAgo = (date: string): string => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 86400;
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
      spotlight={true}
      onClick={onCardClick}
      className="p-0 rounded-3xl flex flex-col cursor-pointer group hover:-translate-y-1 transition-transform duration-300 h-full"
    >
      {/* Image Section */}
      <div className="relative w-full h-40 overflow-hidden bg-slate-900/50 border-b border-white/5">
        <img 
            src={project.thumbnailUrl} 
            alt={project.name} 
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-90"></div>
        
        {/* Status Badge Overlay */}
        <div className="absolute top-3 left-3">
             <span className={`px-2.5 py-1 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md ${statusColors[project.status]}`}>
                {project.status}
            </span>
        </div>

        {/* Likes Overlay */}
        {project.likes && project.likes > 0 && (
            <div className="absolute bottom-3 left-3 flex items-center text-white/80 text-xs font-bold bg-black/40 px-2 py-1 rounded-full backdrop-blur-sm border border-white/10">
                <ThumbsUpIcon className="w-3 h-3 mr-1 text-pi-gold" /> {project.likes}
            </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-white text-lg leading-tight font-sans group-hover:text-ai-violet transition-colors duration-300">
                {project.name}
            </h3>
        </div>

        <div className="mt-auto flex items-center justify-between">
             <div className="flex items-center space-x-3">
                <div className="text-[10px] text-slate-500 font-mono">
                    {timeAgo(project.updatedAt)} ago
                </div>
                
                {project.isNft && (
                    <div className="flex items-center px-1.5 py-0.5 rounded bg-ai-violet/10 border border-ai-violet/20 text-ai-violet text-[9px] font-bold uppercase tracking-wide">
                        <NftIcon className="w-3 h-3 mr-1" /> NFT
                    </div>
                )}
             </div>

             {/* Action Area */}
            <div className="flex items-center space-x-2">
                 {project.unreadMessages && project.unreadMessages > 0 && (
                    <div className="flex items-center justify-center w-6 h-6 bg-red-500/20 text-red-400 rounded-full border border-red-500/30 animate-pulse-slow">
                        <MessageSquareIcon className="w-3 h-3" />
                    </div>
                )}
                
                {!project.isNft && project.status === 'Complete' ? (
                     <button 
                        onClick={(e) => { e.stopPropagation(); onMintClick(); }}
                        className="px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-[10px] font-bold text-white transition-all"
                    >
                        MINT
                    </button>
                ) : (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0 duration-300">
                        <ChevronRightIcon className="w-5 h-5 text-slate-400" />
                    </div>
                )}
            </div>
        </div>
      </div>
    </GlassPanel>
  );
};