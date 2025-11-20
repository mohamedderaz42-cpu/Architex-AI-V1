
import React from 'react';
import { ProjectEntity } from '../core/schemas/entities';
import { GlassPanel } from './GlassPanel';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { MessageSquareIcon } from './icons/MessageSquareIcon';
import { NftIcon } from './icons/NftIcon';
import { ThumbsUpIcon } from './icons/ThumbsUpIcon'; // Assume this exists or use another icon

interface ProjectCardProps {
  project: ProjectEntity;
  onCardClick: () => void;
  onMintClick?: () => void; // Optional now
}

const statusColors: { [key in ProjectEntity['status']]: string } = {
    Scanning: 'bg-pi-gold/10 text-pi-gold border-pi-gold/20',
    Designing: 'bg-ai-violet/10 text-ai-violet border-ai-violet/20',
    Sourcing: 'bg-eco-green/10 text-eco-green border-eco-green/20',
    Complete: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

const timeAgo = (date: string): string => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h";
    return "now";
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onCardClick, onMintClick }) => {
  return (
    <GlassPanel 
      spotlight={true}
      onClick={onCardClick}
      className="p-0 rounded-2xl cursor-pointer group h-full flex flex-col"
    >
      <div className="relative h-32 w-full overflow-hidden bg-slate-800">
         <img src={project.thumbnailUrl} alt={project.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
         <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-transparent to-transparent"></div>
         
         {/* Status Badge */}
         <div className="absolute top-2 left-2">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border backdrop-blur-md ${statusColors[project.status]}`}>
                {project.status}
            </span>
         </div>

         {/* NFT Badge */}
         {project.isNft && (
            <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-md p-1 rounded-full border border-white/10 text-ai-violet">
                <NftIcon className="w-3 h-3" />
            </div>
         )}
      </div>

      <div className="p-3 flex-grow flex flex-col">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="font-bold text-white text-sm leading-tight group-hover:text-ai-violet transition-colors">{project.name}</h3>
                {project.ownerName && (
                    <p className="text-[10px] text-slate-500 mt-0.5">by {project.ownerName}</p>
                )}
            </div>
        </div>

        <div className="mt-auto pt-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <span className="text-[10px] text-slate-400 font-mono">{timeAgo(project.updatedAt)}</span>
                {project.likes !== undefined && (
                    <div className="flex items-center text-[10px] text-slate-300">
                        <ThumbsUpIcon className="w-3 h-3 mr-1 text-slate-500" /> {project.likes}
                    </div>
                )}
            </div>

            <div className="flex items-center">
                {project.unreadMessages && project.unreadMessages > 0 && (
                    <div className="mr-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                )}
                
                {!project.isNft && project.status === 'Complete' && onMintClick && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); onMintClick(); }}
                        className="text-[10px] font-bold text-slate-400 hover:text-white border border-white/10 hover:bg-white/5 px-2 py-1 rounded transition-colors"
                    >
                        MINT
                    </button>
                )}
                {(!project.status || project.status !== 'Complete' || project.isNft) && (
                     <ChevronRightIcon className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                )}
            </div>
        </div>
      </div>
    </GlassPanel>
  );
};
