import React from 'react';
import { GlassPanel } from './GlassPanel';
import { ShieldQuestionIcon } from './icons/ShieldQuestionIcon';

export const UserLegalShieldModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-brand-dark/80 backdrop-blur-md flex items-center justify-center z-[90] p-4">
            <GlassPanel className="w-full max-w-md p-6 animate-fade-in flex flex-col max-h-[90vh]">
                <div className="text-center flex-shrink-0">
                    <ShieldQuestionIcon className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                    <h2 className="text-2xl font-bold text-white">User Legal Shield</h2>
                    <p className="text-slate-400 mt-1 text-sm">Your Protection in the Architex Ecosystem</p>
                </div>

                <div className="my-4 p-3 bg-slate-900/50 rounded-xl border border-white/10 flex-grow overflow-y-auto text-sm text-slate-300 space-y-4">
                    <div>
                        <h3 className="font-bold text-white mb-1">1. Smart Contract Escrow</h3>
                        <p>All bounty funds are held in a secure, multi-signature smart contract until the project is marked as complete by you, or a resolution is determined by an arbitrator.</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-white mb-1">2. Decentralized Arbitration</h3>
                        <p>In the event of a dispute, you can select from a pool of vetted, community-approved arbitrators. Their decisions are cryptographically signed and enforced by the smart contract.</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-white mb-1">3. Reputation & Trust Score</h3>
                        <p>Every participant has a dynamic Trust Score. Completing jobs, receiving positive ratings, and contributing to the ecosystem increases your score, making you a more trusted partner.</p>
                    </div>
                     <div>
                        <h3 className="font-bold text-white mb-1">4. Governance Rights</h3>
                        <p>As a user, you have a say. Stake ARCHI tokens to vote on proposals that shape the rules of the marketplace, including the arbitration process and fee structures.</p>
                    </div>
                </div>

                <div className="flex-shrink-0 mt-2">
                    <button
                        onClick={onClose}
                        className="w-full px-6 py-3 bg-ai-violet/80 border border-ai-violet/90 rounded-full text-lg font-semibold text-white"
                    >
                        Understood
                    </button>
                </div>
            </GlassPanel>
        </div>
    );
};