import React from 'react';
import { GlassPanel } from './GlassPanel';
import { FileTextIcon } from './icons/FileTextIcon';
import { VoteIcon } from './icons/VoteIcon';

export const GovernanceTosModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-brand-dark/80 backdrop-blur-md flex items-center justify-center z-[80] p-4">
            <GlassPanel className="w-full max-w-md p-6 animate-fade-in flex flex-col max-h-[90vh]">
                <div className="text-center flex-shrink-0">
                    <VoteIcon className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                    <h2 className="text-2xl font-bold text-white">ArchitexDAO Governance Model</h2>
                    <p className="text-slate-400 mt-1 text-sm">Terms of Service Excerpt</p>
                </div>

                <div className="my-4 p-3 bg-slate-900/50 rounded-xl border border-white/10 flex-grow overflow-y-auto text-sm text-slate-300 space-y-4">
                    <div>
                        <h3 className="font-bold text-white mb-1">1. The Role of the DAO</h3>
                        <p>The Architex Decentralized Autonomous Organization (DAO) provides a framework for community-led governance. Members can propose, discuss, and vote on changes to the platform's protocol and treasury allocations.</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-white mb-1">2. Binding Votes</h3>
                        <p>All proposals that successfully pass the voting process are considered binding. The outcomes will be automatically implemented by the system's smart contracts and the Administration Bot where applicable.</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-white mb-1">3. Quorum Requirement</h3>
                        <p>For a vote to be considered valid, a minimum participation threshold, or "quorum," must be met. The current quorum is set to <span className="font-bold text-pi-gold">20%</span> of the total active voting power. If quorum is not met by the end of the voting period, the proposal automatically fails, regardless of the vote distribution.</p>
                    </div>
                     <div>
                        <h3 className="font-bold text-white mb-1">4. The Administration Bot</h3>
                        <p>The Administration Bot is an automated agent responsible for executing the will of the community. Once a proposal is successfully passed and the voting period concludes, the bot will verify the quorum and vote count, then automatically execute the on-chain instructions defined in the proposal.</p>
                    </div>
                </div>

                <div className="flex-shrink-0 mt-2">
                    <button
                        onClick={onClose}
                        className="w-full px-6 py-3 bg-ai-violet/80 border border-ai-violet/90 rounded-full text-lg font-semibold text-white"
                    >
                        Acknowledge & Close
                    </button>
                </div>
            </GlassPanel>
        </div>
    );
};