
import React from 'react';
import { ProjectEntity } from '../core/schemas/entities';
import { GlassPanel } from './GlassPanel';
import { NftIcon } from './icons/NftIcon';
import { ThumbsUpIcon } from './icons/ThumbsUpIcon';
import { UserIcon } from './icons/UserIcon';
import { SearchIcon } from './icons/SearchIcon';

interface PublicGalleryProps {
    projects: ProjectEntity[];
    onViewProject: (project: ProjectEntity) => void;
}

export const PublicGallery: React.FC<PublicGalleryProps> = ({ projects, onViewProject }) => {
    return (
        <div className="w-full h-full flex flex-col">
            <div className="px-2 mb-4">
                <h2 className="text-2xl font-bold text-white mb-1">Community Explore</h2>
                <p className="text-slate-400 text-sm">Discover trending designs from across the network.</p>
            </div>

            {/* Search Bar (Visual Only) */}
            <div className="px-2 mb-4">
                <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input 
                        type="text" 
                        placeholder="Search styles, architects..." 
                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-ai-violet/50"
                    />
                </div>
            </div>

            <div className="flex-grow overflow-y-auto pr-2 space-y-4 pb-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-2">
                    {projects.map(project => (
                        <div 
                            key={project.id} 
                            onClick={() => onViewProject(project)}
                            className="bg-slate-900/40 rounded-2xl border border-white/10 overflow-hidden group cursor-pointer hover:border-pi-gold/30 transition-all duration-300"
                        >
                            <div className="relative aspect-video">
                                <img src={project.thumbnailUrl} alt={project.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                                
                                {project.isNft && (
                                    <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-md p-1.5 rounded-full border border-white/10">
                                        <NftIcon className="w-4 h-4 text-ai-violet" />
                                    </div>
                                )}

                                <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
                                    <div>
                                        <h4 className="text-white font-bold text-sm line-clamp-1">{project.name}</h4>
                                        <div className="flex items-center text-xs text-slate-300 mt-0.5">
                                            <UserIcon className="w-3 h-3 mr-1 opacity-70" />
                                            {project.ownerName || 'Unknown'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-3 flex justify-between items-center bg-white/5">
                                <div className="flex items-center text-xs text-slate-400">
                                    <span className="bg-white/10 px-2 py-0.5 rounded text-slate-300">{project.status}</span>
                                </div>
                                <div className="flex items-center text-pi-gold font-semibold text-xs">
                                    <ThumbsUpIcon className="w-4 h-4 mr-1" />
                                    {project.likes || 0}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
