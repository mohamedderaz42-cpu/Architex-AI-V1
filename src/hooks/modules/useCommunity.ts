import { useState, useEffect } from 'react';
import { ProposalEntity, DesignChallengeEntity, ChallengeSubmissionEntity, MessageEntity, UserEntity } from '../../core/schemas/entities';
import * as api from '../../core/api/contract';

export const useCommunity = (
    user: UserEntity | null,
    projectToSubmit: any,
    setProjectToSubmit: any,
    addToast: (msg: string, type?: 'success' | 'error' | 'info') => void
) => {
    // DAO
    const [proposals, setProposals] = useState<ProposalEntity[]>([]);
    const [selectedProposal, setSelectedProposal] = useState<ProposalEntity | null>(null);
    const [showProposalDetailsModal, setShowProposalDetailsModal] = useState(false);
    const [showGovernanceTosModal, setShowGovernanceTosModal] = useState(false);
    
    // Challenges
    const [designChallenges, setDesignChallenges] = useState<DesignChallengeEntity[]>([]);
    const [selectedChallenge, setSelectedChallenge] = useState<DesignChallengeEntity | null>(null);
    const [submissions, setSubmissions] = useState<ChallengeSubmissionEntity[]>([]);
    const [showSubmitToChallengeModal, setShowSubmitToChallengeModal] = useState(false);
    const [showCreateChallengeModal, setShowCreateChallengeModal] = useState(false);

    // Chat
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatContextId, setChatContextId] = useState<string | null>(null);
    const [messages, setMessages] = useState<MessageEntity[]>([]);

    const fetchCommunityData = async () => {
        const [proposalsData, challengesData] = await Promise.all([
            api.listProposals(), api.listDesignChallenges()
        ]);
        setProposals(proposalsData);
        setDesignChallenges(challengesData);
    };
    
    // Update Challenges Periodic check (Mock Admin Bot)
    useEffect(() => {
        const interval = setInterval(async () => {
            const updated = await api.processExpiredChallenges();
            if (updated.length > 0) {
                setDesignChallenges(updated);
                addToast("A Design Challenge has been finalized.", "info");
            }
        }, 10000);
        return () => clearInterval(interval);
    }, [addToast]);

    // DAO Logic
    const handleStake = async (amount: number) => { 
        await api.stakeArchi(amount); 
        addToast(`Staked ${amount} ARCHI`, "success"); 
    };
    const handleUnstake = async (amount: number) => { 
        await api.unstakeArchi(amount); 
        addToast(`Unstaked ${amount} ARCHI`, "success"); 
    };
    const handleClaimStakingRewards = async () => { 
        addToast("Rewards claimed to wallet", "success"); 
    };
    const handleVote = async (proposalId: string, vote: 'for' | 'against') => { 
        if (!user) return; 
        const votingPower = (user.stakedArchi || 0) + user.trustScore; 
        const updatedProposal = await api.voteOnProposal(proposalId, vote, votingPower); 
        setProposals(prev => prev.map(p => p.id === proposalId ? updatedProposal : p)); 
        addToast("Vote cast successfully", "success"); 
    };
    const handleExecuteProposal = async (proposalId: string) => {
        const updatedProposal = await api.executeProposal(proposalId);
        setProposals(prev => prev.map(p => p.id === proposalId ? updatedProposal : p));
        addToast("Proposal executed on-chain", "success");
    };
    const openGovernanceTosModal = () => setShowGovernanceTosModal(true);
    const closeGovernanceTosModal = () => setShowGovernanceTosModal(false);
    const openProposalDetails = (proposal: ProposalEntity) => {
        setSelectedProposal(proposal);
        setShowProposalDetailsModal(true);
    };
    const closeProposalDetails = () => {
        setSelectedProposal(null);
        setShowProposalDetailsModal(false);
    };
    const handleSubmitComment = async (proposalId: string, text: string) => {
        const updated = await api.submitProposalComment(proposalId, text);
        setProposals(prev => prev.map(p => p.id === proposalId ? updated : p));
        if(selectedProposal?.id === proposalId) setSelectedProposal(updated);
        addToast("Comment added", "success");
    };

    // Challenge Logic
    const handleSelectChallenge = async (challenge: DesignChallengeEntity) => {
        const challengeSubmissions = await api.getChallengeSubmissions(challenge.id);
        setSubmissions(challengeSubmissions);
        setSelectedChallenge(challenge);
    };
    const closeChallengeDetailsModal = () => { setSelectedChallenge(null); setSubmissions([]); };

    const openSubmitToChallengeModal = (project: any) => { setProjectToSubmit(project); setShowSubmitToChallengeModal(true); };
    const closeSubmitToChallengeModal = () => { setProjectToSubmit(null); setShowSubmitToChallengeModal(false); };
    const handleSubmitProjectToChallenge = async (challengeId: string) => {
        if (!projectToSubmit) return;
        await api.submitProjectToChallenge(projectToSubmit.id, challengeId);
        closeSubmitToChallengeModal();
        addToast("Project submitted to challenge!", "success");
    };
    const handleVoteOnSubmission = async (submissionId: string) => {
        if (!user || !selectedChallenge) return;
        const votingPower = (user.stakedArchi || 0) + user.trustScore;
        await api.voteOnChallengeSubmission(submissionId, votingPower);
        const challengeSubmissions = await api.getChallengeSubmissions(selectedChallenge.id);
        setSubmissions(challengeSubmissions);
        addToast("Vote recorded", "success");
    };
    const openCreateChallengeModal = () => setShowCreateChallengeModal(true);
    const closeCreateChallengeModal = () => setShowCreateChallengeModal(false);
    const handleCreateChallenge = async (data: Omit<DesignChallengeEntity, 'id' | 'status' | 'winnerId'>) => {
        try {
            const newChallenge = await api.createDesignChallenge(data);
            setDesignChallenges(prev => [newChallenge, ...prev]);
            addToast(`Challenge "${data.title}" Created!`, 'success');
        } catch (e) {
            addToast("Failed to create challenge. Check funds.", "error");
        }
    };

    // Chat Logic
    const openChat = (contextId: string) => {
        setChatContextId(contextId);
        setMessages([
            { id: 'm1', contextId, senderId: 'system', senderName: 'ArchieBot', text: 'Welcome to the secure channel. How can I help?', timestamp: new Date().toISOString(), isSystem: false }
        ]);
        setIsChatOpen(true);
    };
    const closeChat = () => setIsChatOpen(false);
    const handleSendMessage = (text: string) => {
        if (!user || !chatContextId) return;
        const newMsg: MessageEntity = {
            id: `msg_${Date.now()}`,
            contextId: chatContextId,
            senderId: user.id,
            senderName: user.piUsername,
            text,
            timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, newMsg]);
    };

    const votingPower = user ? { total: (user.stakedArchi || 0) + user.trustScore * 50, fromTokens: user.stakedArchi || 0, fromTrust: user.trustScore * 50 } : { total: 0, fromTokens: 0, fromTrust: 0 };

    return {
        proposals, setProposals, designChallenges, setDesignChallenges,
        fetchCommunityData,
        handleStake, handleUnstake, handleClaimStakingRewards, handleVote, handleExecuteProposal,
        showGovernanceTosModal, openGovernanceTosModal, closeGovernanceTosModal,
        selectedProposal, showProposalDetailsModal, openProposalDetails, closeProposalDetails, handleSubmitComment,
        selectedChallenge, submissions, handleSelectChallenge, closeChallengeDetailsModal, handleVoteOnSubmission,
        showSubmitToChallengeModal, openSubmitToChallengeModal, closeSubmitToChallengeModal, handleSubmitProjectToChallenge,
        showCreateChallengeModal, openCreateChallengeModal, closeCreateChallengeModal, handleCreateChallenge,
        votingPower,
        isChatOpen, openChat, closeChat, messages, handleSendMessage, chatContextId
    };
};
