
import React from 'react';
import { GlassPanel } from './GlassPanel';
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
                        <h3 className="font-bold text-white mb-1">1. The DAO & Binding Votes</h3>
                        <p>The Architex Decentralized Autonomous Organization (DAO) is the supreme governing body of the protocol. Proposals that pass the voting process are legally and technically <span className="text-white font-semibold">binding</span>. The code is law.</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-white mb-1">2. Quorum Requirement</h3>
                        <p>To prevent minority rule, a proposal must reach a minimum participation threshold (Quorum) of <span className="text-pi-gold font-bold">20%</span> of the total circulating voting power. If this threshold is not met by the deadline, the proposal fails regardless of the vote ratio.</p>
                    </div>
                     <div>
                        <h3 className="font-bold text-white mb-1">3. The Administration Bot</h3>
                        <p>The Administration Bot is a decentralized oracle service tasked with executing the community's will. Upon the successful conclusion of a vote (Pass + Quorum Met), the Bot automatically triggers the smart contract functions to implement changes, transfer treasury funds, or update protocol parameters without human intervention.</p>
                    </div>
                     <div>
                        <h3 className="font-bold text-white mb-1">4. Reputation-Weighted Voting</h3>
                        <p>Voting power is derived from both staked ARCHI tokens and your earned Trust Score, ensuring that active, reputable contributors have a significant voice in governance.</p>
                    </div>
                </div>

                <div className="flex-shrink-0 mt-2">
                    <button
                        onClick={onClose}
                        className="w-full px-6 py-3 bg-ai-violet/80 border border-ai-violet/90 rounded-full text-lg font-semibold text-white hover:bg-ai-violet transition-all"
                    >
                        I Understand the Model
                    </button>
                </div>
            </GlassPanel>
        </div>
    );
};
