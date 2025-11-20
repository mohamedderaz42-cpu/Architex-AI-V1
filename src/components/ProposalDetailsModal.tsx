
import React, { useState } from 'react';
import { GlassPanel } from './GlassPanel';
import { ProposalEntity } from '../core/schemas/entities';
import { UserIcon } from './icons/UserIcon';

interface ProposalDetailsModalProps {
    proposal: ProposalEntity;
    onClose: () => void;
    onComment: (proposalId: string, text: string) => void;
}

export const ProposalDetailsModal: React.FC<ProposalDetailsModalProps> = ({ proposal, onClose, onComment }) => {
    const [commentText, setCommentText] = useState('');

    const handleSubmit = () => {
        if (!commentText.trim()) return;
        onComment(proposal.id, commentText);
        setCommentText('');
    };

    const statusColors: { [key in ProposalEntity['status']]: string } = {
        Voting: 'text-pi-gold',
        Passed: 'text-eco-green',
        Failed: 'text-red-400',
        Executing: 'text-ai-violet',
        Executed: 'text-slate-300',
    };

    return (
        <div className="fixed inset-0 bg-brand-dark/90 backdrop-blur-md flex items-center justify-center z-[80] p-4">
            <GlassPanel className="w-full max-w-md h-[85vh] flex flex-col p-6 animate-fade-in">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white text-2xl">&times;</button>

                <div className="flex-shrink-0 mb-4">
                    <h2 className="text-xl font-bold text-white pr-8">{proposal.title}</h2>
                    <div className="flex items-center mt-1 space-x-3">
                        <span className={`text-xs font-bold uppercase ${statusColors[proposal.status]}`}>{proposal.status}</span>
                        <span className="text-xs text-slate-400">Proposer: {proposal.proposerId}</span>
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto pr-2 mb-4">
                    <div className="bg-slate-900/30 p-3 rounded-lg border border-white/5 mb-4">
                        <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{proposal.description}</p>
                    </div>

                    <h3 className="text-sm font-bold text-white mb-3 flex items-center">
                        Discussion 
                        <span className="ml-2 bg-slate-700 text-xs px-2 py-0.5 rounded-full text-slate-300">{proposal.comments?.length || 0}</span>
                    </h3>

                    <div className="space-y-3">
                        {proposal.comments && proposal.comments.length > 0 ? (
                            proposal.comments.map(comment => (
                                <div key={comment.id} className="flex space-x-3">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-white/10">
                                        <UserIcon className="w-4 h-4 text-slate-400" />
                                    </div>
                                    <div className="flex-grow bg-slate-800/50 p-2.5 rounded-lg rounded-tl-none border border-white/5">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs font-bold text-ai-violet">{comment.authorName}</span>
                                            <span className="text-[10px] text-slate-500">{new Date(comment.timestamp).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-xs text-slate-300">{comment.text}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-slate-500 text-xs py-4">No comments yet. Be the first to discuss!</p>
                        )}
                    </div>
                </div>

                <div className="flex-shrink-0 pt-3 border-t border-white/10">
                    <div className="relative">
                        <input
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Add to the discussion..."
                            className="w-full bg-slate-900/70 border border-white/10 rounded-full pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-ai-violet/50 transition-colors"
                            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                        />
                        <button 
                            onClick={handleSubmit}
                            disabled={!commentText.trim()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-ai-violet rounded-full text-white hover:bg-ai-violet/80 disabled:opacity-50 disabled:hover:bg-ai-violet transition-all"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </GlassPanel>
        </div>
    );
};
