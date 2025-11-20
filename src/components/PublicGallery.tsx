
import React from 'react';
import { ProjectEntity } from '../core/schemas/entities';
import { ProjectCard } from './ProjectCard';
import { GlassPanel } from './GlassPanel';
import { AwardIcon } from './icons/AwardIcon';

interface PublicGalleryProps {
    projects: ProjectEntity[];
    onViewProject: (project: ProjectEntity) => void;
}

export const PublicGallery: React.FC<PublicGalleryProps> = ({ projects, onViewProject }) => {
    return (
        <div className="w-full h-full flex flex-col">
            <div className="px-2 mb-6">
                <GlassPanel className="p-6 bg-gradient-to-r from-ai-violet/20 to-pi-gold/20 border-white/10">
                    <div className="flex items-start justify-between">
                        <div>
                             <h1 className="text-3xl font-bold text-white mb-2">Explore</h1>
                             <p className="text-slate-300 max-w-xs">Discover trending designs from the global Architex community.</p>
                        </div>
                        <AwardIcon className="w-12 h-12 text-pi-gold opacity-80" />
                    </div>
                </GlassPanel>
            </div>

            <div className="flex-grow overflow-y-auto px-2 pb-24">
                <div className="grid grid-cols-2 gap-4">
                    {projects.map(project => (
                        <ProjectCard 
                            key={project.id} 
                            project={project} 
                            onCardClick={() => onViewProject(project)} 
                            // No minting action for public view usually, or different action
                        />
                    ))}
                </div>
                {projects.length === 0 && (
                    <div className="text-center text-slate-500 mt-10">No public projects yet.</div>
                )}
            </div>
        </div>
    );
};
